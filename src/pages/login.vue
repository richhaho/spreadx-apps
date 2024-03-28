<script setup>
import NavBarI18n from "@/layouts/components/NavBarI18n.vue";
import NavbarThemeSwitcher from "@/layouts/components/NavbarThemeSwitcher.vue";
import axios_lite from "@/plugins/axios_lite";
import { useAuthStore } from "@/store/auth";
import { useDemoVendorStore } from "@/store/demoVendorStore";
import { useGenerateImageVariant } from "@core/composable/useGenerateImageVariant";
import authV2LoginIllustrationBorderedDark from "@images/pages/auth-v2-login-illustration-bordered-dark.png";
import authV2LoginIllustrationBorderedLight from "@images/pages/auth-v2-login-illustration-bordered-light.png";
import authV2LoginIllustrationDark from "@images/pages/auth-v2-login-illustration-dark.png";
import authV2LoginIllustrationLight from "@images/pages/auth-v2-login-illustration-light.png";
import authV2MaskDark from "@images/pages/misc-mask-dark.png";
import authV2MaskLight from "@images/pages/misc-mask-light.png";
import { VNodeRenderer } from "@layouts/components/VNodeRenderer";
import { themeConfig } from "@themeConfig";
import { requiredValidator } from "@validators";
// import CryptoJS from 'crypto-js';
import { useAppAbility } from '@/plugins/casl/useAppAbility';
import { ref } from "vue";
import { useI18n } from "vue-i18n";
import { useDisplay } from 'vuetify';
import router from "../router/index";

const { name } = useDisplay()

const deviceHeight = computed(() => {
  switch (name.value) {
    case 'xs': return 'fit-content'
    case 'sm': return 'fit-content'
    default: return "auto"
  }

  return "tonal"
})

const getVariant = computed(() => {
  switch (name.value) {
    case 'xs': return 'flat'
    case 'sm': return 'flat'
    default: return "tonal"
  }

  return undefined
})

const inlineRadio = ref('phone')
const phoneData = ref(null);

const v1 = import.meta.env.VITE_API_V1
const v2 = import.meta.env.VITE_API_V2

const ability = useAppAbility()

const demoVendorStore = useDemoVendorStore();
demoVendorStore.$subscribe(() => {

});

const authStore = useAuthStore();
const authThemeImg = useGenerateImageVariant(
  authV2LoginIllustrationLight,
  authV2LoginIllustrationDark,
  authV2LoginIllustrationBorderedLight,
  authV2LoginIllustrationBorderedDark,
  true
);
const authThemeMask = useGenerateImageVariant(authV2MaskLight, authV2MaskDark);
const refLoginVForm = ref();
const isPasswordVisible = ref(false);
const email = ref("");
const password = ref("");
const rememberMe = ref(false);
const { t } = useI18n();

const clearErrors = () => {
  authStore.$state.authentication_error_state = [];
  authStore.$state.authentication_success_state = [];
};

authStore.$subscribe((mutation, state) => {
  // console.log(authStore.$state.authentication_error_state)
  // console.log(authStore.$state.authentication_success_state)
});


const isCryptoAvailable = () => {
  const isVailable = window.crypto && window.crypto.subtle != 'undefined' && window.crypto.subtle && window.TextEncoder;
  console.log("availability=" + isVailable)
  return isVailable;
};



const generateRandomSalt = () => {
  const saltLength = 16;
  const salt = new Uint8Array(saltLength);
  crypto.getRandomValues(salt);
  return Array.from(salt)
    .map((byte) => byte.toString(16).padStart(2, '0'))
    .join('');
};

const deriveKeyFromPassword = async (password, salt) => {
  try {
    const passwordBuffer = new TextEncoder().encode(password);
    const saltBuffer = new TextEncoder().encode(salt);

    const keyMaterial = await window.crypto.subtle.importKey('raw',
      passwordBuffer,
      { name: 'PBKDF2' },
      false,
      ['deriveKey']
    );

    const derivedKey = await window.crypto.subtle.deriveKey(
      {
        name: 'PBKDF2',
        salt: saltBuffer,
        iterations: 10000,
        hash: 'SHA-256',
      },
      keyMaterial,
      { name: 'AES-GCM', length: 256 },
      true,
      ['encrypt', 'decrypt']
    );

    // Generate a random IV
    const randomIV = window.crypto.getRandomValues(new Uint8Array(16));
    const ivString = Array.from(randomIV)
      .map((byte) => byte.toString(16).padStart(2, '0'))
      .join('');


    return { derivedKey, iv: ivString };

  } catch (error) {
    console.error('Error deriving AES key from password:', error);
    return null;
  }
};

const cryptoKeyToHexString = async (cryptoKey) => {
  try {
    const keyBuffer = await window.crypto.subtle.exportKey('raw', cryptoKey);
    return Array.from(new Uint8Array(keyBuffer))
      .map((byte) => byte.toString(16).padStart(2, '0'))
      .join('');
  } catch (error) {
    console.error('Error converting CryptoKey to hex string:', error);
    return null;
  }
};



const otp = ref('')
const isOtpInserted = ref(false)

const onFinish = () => {
  isOtpInserted.value = true
  login_user();
}

const is_2fa_enabled = ref(false)



const login_user = () => {

  authStore.$state.authentication_error_state = [];
  authStore.$state.authentication_success_state = [];

  //=============Uncomment this for password Encription when sending password===============

  // if (isCryptoAvailable()) {

  //   const salt = generateRandomSalt();

  //   deriveKeyFromPassword(password.value, salt).then(async ({ derivedKey, iv }) => {
  //     console.log(derivedKey);

  //     if (derivedKey) {
  //       const keyString = await cryptoKeyToHexString(derivedKey);
  //       authStore.login_user({
  //         email: email.value,
  //         username: email.value,
  //         password: keyString,
  //         iv: iv
  //       });
  //     } else {
  //       console.error('Failed  AES key from password');
  //     }
  //   });
  // } else {
  //   console.error('Web not secure');
  // }
  const urlParams = new URLSearchParams(window.location.search);

  // authStore.login_user({
  //   email: email.value,
  //   username: email.value,
  //   password: password.value,
  // });


  const number = ref()

  if (phoneData) {
    number.value = phoneData.value.nationalNumber
  }

  const formData = ref({
    email: email.value,
    username: inlineRadio.value == "phone" ? number.value : email.value,
    password: password.value,
    two_factor_code: otp.value,
    vendor_customer_id: localStorage.getItem('customer_id'),
    vendor_id: localStorage.getItem('supplier_id')
  })

  const verifyCustomer = (supplierId, code, intendedUrl) => {

    // router.push("/"); //comment this line and uncomment the block bellow after the implementation
    axios_lite.get(`${v1}verify_customer`, {
      params: {
        supplier_id: supplierId,
        code: code,
      },
      headers: {
        accessToken: localStorage.getItem("accessToken"),
        Authorization: `Bearer ${localStorage.getItem("accessToken")}`
      }
    })
      .then((res) => {
        if (res.data.status == false) {
          uiStore.setSnackBar(true, 'error', res.data.message)
          router.push("/");
        }
        if (res.data.status === true) {
          localStorage.setItem('intededUrl', null)
          router.push('/apps/suppliers/' + res.data.supplier_id + '/products');
        }
      }).catch((error) => {
        router.push("/");
      })
  }



  axios_lite.post(`${v2}auth/login`, formData.value)
    .then((res) => {
      if (res.data.status === 422) {
        authStore.$state.authentication_error_state = [res.data.errors.message]
      }

      if (res.data.data) {

        if (res.data.data.is_user_verified === false || res.data.data.is_user_has_business === false) {

          router.push("/account_verification");

        } else {
          if (res.data.data && res.data.data.is_2fa_enabled == 1) {
            formData.value.username = '';
            formData.value.password = '';
            is_2fa_enabled.value = true;
          }

          else if (res.data.status === true && !localStorage.getItem('userData')) {

            authStore.$state.authentication_success_state = ["Login successfully"];

            localStorage.setItem("accessToken", res.data.data.access_token);
            localStorage.setItem("vendor_id", res.data.data.vendor_id);
            localStorage.setItem("activeBusiness", JSON.stringify(res.data.data.default_business_id));
            localStorage.setItem("refreshToken", res.data.data.refresh_token);
            localStorage.setItem("expires_in", res.data.data.expires_in);
            localStorage.setItem("business_info", JSON.stringify(res.data.data.business_info));

            localStorage.setItem("userData", JSON.stringify(res.data.data.user_profile));
            authStore.$state.activebusness = JSON.stringify(res.data.data.default_business_id);

            const serverUserAbilities = res.data.data.user_profile.roles[0].permissions.map((ability) => {
              return {
                action: ability.name,
                subject: ability.subject
              }
            })


            ability.update(serverUserAbilities)
            localStorage.setItem('userAbilities', JSON.stringify(serverUserAbilities))
            authStore.$state.authentication_success_state = []

            // check if user needs to be atached to a vendor
            // ====get the intended url
            // ====check the supplier part in the intented url
            // ====if true atach this customer to the supplier in the db
            // ====proceed to the intended url
            // ====if false proceed to home

            const intendedUrl = localStorage.getItem('intededUrl');

            if (intendedUrl) {
              if (intendedUrl == "/" || intendedUrl == null){
                router.push("/");
              }else {
                const intededUrlComponents = intendedUrl.split('/');
                const supplierComponent = intededUrlComponents[2];

                if (supplierComponent === 'suppliers') {

                  const supplierId = intededUrlComponents[3];
                  const userToken = intendedUrl.split('token=')[1] //to.query.token;
                  verifyCustomer(supplierId, userToken, "/apps/suppliers/" + supplierId + "/products")
                  // send the atachement here
                } else {
                  router.push("/apps/suppliers/" + supplierId + "/products");
                }
              }
            } else {

              if (intendedUrl) {
                router.push(intendedUrl)
              } else {

                router.push("/");
              }
            }


          } else if (res.data.status == true && localStorage.getItem('userData')) {
            const intendedUrl = localStorage.getItem('intededUrl')
            if (intendedUrl) {
              router.push(intendedUrl)
            } else {
              router.push("/");
            }

          } else {
            authStore.$state.authentication_error_state = [res.data.errors.message];
          }
        }

      } else {
        authStore.$state.authentication_error_state = [res.data.errors.message]
      }
    })
    .catch((error) => {
      console.log(JSON.stringify(error.response.data.message));
      authStore.$state.authentication_error_state = [error.response.data.message]
    })

    .finally((state) => {
      authStore.$state.button_loading_state = false;
      isOtpInserted.value = false
    });
};



const invalidClass = ref('');

const onNewLoginSubmit = () => {
  authStore.$state.button_loading_state = true;

  if (inlineRadio.value == "phone") {

    if (phoneData.value !== null && phoneData.value.isValid) {
      invalidClass.value = ""
      authStore.$state.button_loading_state = true;
      refLoginVForm.value?.validate().then(({ valid: isValid }) => {
        isValid ? login_user() : (authStore.$state.button_loading_state = false);
      });
    } else {
      invalidClass.value = "invalid"
      authStore.$state.button_loading_state = false
    }

  } else {
    refLoginVForm.value?.validate().then(({ valid: isValid }) => {
      isValid ? login_user() : (authStore.$state.button_loading_state = false);
    });
  }
};
const requestTwoOtp = (() => {
  is_2fa_enabled.value = false;
  email.value = '';
  password.value = '';
  otp.value = '';
})

</script>

<template>

  <div class="">
    <div v-if="!is_2fa_enabled"
      class="d-flex align-center justify-center h-screen px-2">

      <VCard :max-width="500"
        rounded="true"
        class="mt-12 mt-sm-0 pa-2">
        <VCardText class="d-flex align-center justify-end">
          <NavBarI18n />
          <NavbarThemeSwitcher />
        </VCardText>

        <VDivider></VDivider>

        <VCardText>
          <VNodeRenderer :nodes="themeConfig.app.logo"
            class="mb-6 d-flex align-center justify-center" />
          <h5 class="text-h5 text-center font-weight-semibold mb-1">
            <h5>{{ t("Login") }}</h5>
          </h5>
        </VCardText>
        <VCardText v-if="authStore.$state.authentication_error_state.length || authStore.$state.authentication_success_state.length">
          <VAlert v-if="authStore.$state.authentication_error_state.length"
            type="error"
            :icon="tabler - list"
            :close-on-click="clearErrors"
            :closable="true">

            <h5 class="p-0 m-0 text-white"
              v-for="(error, errorIndex) in authStore.$state.authentication_error_state">
              <span class="">{{ errorIndex + 1 + "." + error }}</span>
            </h5>
          </VAlert>

          <VAlert v-if="authStore.$state.authentication_success_state.length"
            type="success"
            :icon="tabler - list"
            :close-on-click="clearErrors"
            :closable="true">
            <h5 class="p-0 m-0 text-white"
              v-for="(error, errorIndex) in authStore.$state
      .authentication_success_state">
              <span class="">{{ error }}</span>
            </h5>
          </VAlert>
        </VCardText>

        <VCardText>

          <VRadioGroup v-model="inlineRadio"
            inline>
            <VRadio label="Phone"
              value="phone" />
            <VRadio label="E-Mail"
              value="email" />
          </VRadioGroup>


          <VForm ref="refLoginVForm"
            @submit.prevent="onNewLoginSubmit">
            <VRow>


              <VCol v-if="inlineRadio == 'phone'"
                cols="12">
                <div class="">
                  <phone-input
                    phone="phone = $event"
                    @country="phoneData = $event"
                    @phoneData="phoneData = $event"
                    defaultCountry="AE"
                    required="true"
                    name="phone-number-input"
                    :rules="[requiredValidator]" />
                  <small v-if="invalidClass != ''"
                    class="text-error">Invalid Phone Number</small>
                </div>
              </VCol>

              <VCol v-else
                cols="12">
                <VTextField v-model="email"
                  :rules="[requiredValidator, emailValidator]"
                  placeholder="example@spread.ae"
                  label="E-mail" />
              </VCol>

              <!-- <VCol cols="12">
                <VTextField v-model="email"
                  label="Email/Phone"
                  type="text"
                  :rules="[requiredValidator]" />
              </VCol> -->

              <!-- password -->
              <VCol cols="12">
                <VTextField v-model="password"
                  label="Password"
                  :rules="[requiredValidator]"
                  :type="isPasswordVisible ? 'text' : 'password'"
                  :append-inner-icon="isPasswordVisible ? 'tabler-eye-off' : 'tabler-eye'
      "
                  @click:append-inner="isPasswordVisible = !isPasswordVisible" />

                <div class="d-flex align-center flex-wrap justify-space-between mt-2 mb-4">
                  <VCheckbox v-model="rememberMe"
                    label="Remember me" />

                  <RouterLink :to="{ name: 'forgot-password' }"
                    class="font-weight-medium text-primary user-list-name">
                    Forgot Password?
                  </RouterLink>
                </div>

                <div v-if="authStore.$state.button_loading_state"
                  class="d-flex justify-center">
                  <VProgressCircular indeterminate
                    color="info" />
                </div>
                <div v-else>
                  <VBtn @click="isDialogVisible = true"
                    block
                    type="submit">
                    {{ t("Login") }}
                  </VBtn>
                </div>
              </VCol>

              <!-- create account -->
              <VCol cols="12"
                class="text-center">
                <span>New on our platform?</span>
                <RouterLink :to="{ name: 'register' }"
                  class="font-weight-medium user-list-name">
                  Create an account
                </RouterLink>
                <VCol cols="12"
                  class="text-center">
                  <AuthProvider />
                </VCol>
              </VCol>
            </VRow>
          </VForm>



        </VCardText>
      </VCard>
    </div>

    <div v-else
      class="d-flex align-center justify-center h-screen px-2">
      <VCard :max-width="500"
        rounded="true"
        class="mt-12 mt-sm-0 pa-2">
        <VCardText class="d-flex align-center justify-end">
          <NavBarI18n />
          <NavbarThemeSwitcher />
        </VCardText>

        <VDivider></VDivider>

        <VCardText>
          <VNodeRenderer :nodes="themeConfig.app.logo"
            class="mb-6 d-flex align-center justify-center" />

          <h5 class="text-h5 font-weight-semibold mb-1 text-center">
            Two Step Verification
          </h5>

          <p class="mb-0 text-center">We sent a verification code to your mobile. Enter the code from the mobile in the field below.</p>

        </VCardText>
        <VCardText v-if="authStore.$state.authentication_error_state.length || authStore.$state.authentication_success_state.length">
          <VAlert v-if="authStore.$state.authentication_error_state.length"
            type="error"
            :icon="tabler - list"
            :close-on-click="clearErrors"
            :closable="true">
            <h5 class="p-0 m-0 text-white"
              v-for="(error, errorIndex) in authStore.$state
      .authentication_error_state">
              <span class="">{{ errorIndex + 1 + "." + error }}</span>
            </h5>
          </VAlert>

          <VAlert v-if="authStore.$state.authentication_success_state.length"
            type="success"
            :icon="tabler - list"
            :close-on-click="clearErrors"
            :closable="true">
            <h5 class="p-0 m-0 text-white"
              v-for="(error, errorIndex) in authStore.$state
      .authentication_success_state">
              <span class="">{{ error }}</span>
            </h5>
          </VAlert>
        </VCardText>
        <VCardText>


          <VForm @submit.prevent="() => { }">
            <VRow>
              <!-- email -->
              <VCol cols="12">
                <VOtpInput v-model="otp"
                  :disabled="isOtpInserted"
                  type="number"
                  class="pa-0"
                  @finish="onFinish" />
              </VCol>

              <!-- reset password -->
              <VCol cols="12">
                <VBtn :loading="isOtpInserted"
                  :disabled="isOtpInserted"
                  block
                  type="submit">
                  Verify my account
                </VBtn>
              </VCol>

              <VCol cols="12">
                <div class="d-flex justify-center align-center flex-wrap">
                  <span class="me-1">Didn't get the code?</span>

                  <VBtn @click="requestTwoOtp"
                    variant="text">

                    request Again
                  </VBtn>

                </div>
              </VCol>
            </VRow>
          </VForm>
          <VDivider />
          <small class="mb-0 text-center">You can disable this feature in your profile settings</small>
        </VCardText>
      </VCard>
    </div>
  </div>
</template>

<style lang="scss">
@use "@core/scss/template/pages/page-auth.scss";

#phone-number-input {
  border: none !important;
  inline-size: 75%;
  margin-block-end: 0;
  margin-block-start: 0;
  margin-inline-start: 1rem;
}

#phone-number-input:focus {
  outline: none !important;
}
</style>

<route lang="yaml">
meta:
  layout: blank
  action: read
  subject: Auth
  redirectIfLoggedIn: true
</route>
