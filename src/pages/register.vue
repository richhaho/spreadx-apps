<script setup>
import NavBarI18n from "@/layouts/components/NavBarI18n.vue";
import NavbarThemeSwitcher from "@/layouts/components/NavbarThemeSwitcher.vue";
import { useAuthStore } from "@/store/auth";
import { useGenerateImageVariant } from "@core/composable/useGenerateImageVariant";
import authV2LoginIllustrationBorderedDark from "@images/pages/auth-v2-login-illustration-bordered-dark.png";
import authV2LoginIllustrationBorderedLight from "@images/pages/auth-v2-login-illustration-bordered-light.png";
import authV2LoginIllustrationDark from "@images/pages/auth-v2-login-illustration-dark.png";
import authV2LoginIllustrationLight from "@images/pages/auth-v2-login-illustration-light.png";
import authV2MaskDark from "@images/pages/misc-mask-dark.png";
import authV2MaskLight from "@images/pages/misc-mask-light.png";
import { VNodeRenderer } from "@layouts/components/VNodeRenderer";
import { themeConfig } from "@themeConfig";
import { emailValidator, requiredValidator } from "@validators";
import { ref } from "vue";
import { useI18n } from "vue-i18n";
import { useDisplay } from 'vuetify';
const { name } = useDisplay()
const authStore = useAuthStore();
const { t } = useI18n();

const authThemeImg = useGenerateImageVariant(
  authV2LoginIllustrationLight,
  authV2LoginIllustrationDark,
  authV2LoginIllustrationBorderedLight,
  authV2LoginIllustrationBorderedDark,
  true
);
const authThemeMask = useGenerateImageVariant(authV2MaskLight, authV2MaskDark);
const isPasswordVisible = ref(false);
const phone = ref("");
const email = ref("");
const inlineRadio = ref('phone')
const phoneData = ref(null);
const password = ref("");
const rememberMe = ref(false);

authStore.$subscribe((mutation, state) => { });

const clearErrors = computed(() => {
  // authStore.$state.authentication_error_state = [];
  // authStore.$state.authentication_success_state = [];
});

const refregisterVForm = ref();

const register_user = () => {
  authStore.$state.authentication_error_state = [];
  authStore.$state.authentication_success_state = [];
  const urlParams = new URLSearchParams(window.location.search);

  const number = ref()

  if (phoneData) {
    number.value = phoneData.value.dialCode + "-" + phoneData.value.nationalNumber
  }


  authStore.registerUser({
    username: inlineRadio.value == "phone" ? number.value : email.value,
    vendor_customer_id: localStorage.getItem('customer_id'),
    vendor_id: localStorage.getItem('supplier_id')
  });
};
const invalidClass = ref('');

const onNewRegisterSubmit = () => {

  if (inlineRadio.value == "phone") {

    if (phoneData.value !== null && phoneData.value.isValid) {
      invalidClass.value = ""
      authStore.$state.button_loading_state = true;
      refregisterVForm.value?.validate().then(({ valid: isValid }) => {
        isValid ? register_user() : (authStore.$state.button_loading_state = false);
      });
    } else {
      invalidClass.value = "invalid"
    }

  } else {
    authStore.$state.button_loading_state = true;
    refregisterVForm.value?.validate().then(({ valid: isValid }) => {
      isValid ? register_user() : (authStore.$state.button_loading_state = false);
    });
  }

};


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


const allCountries = [
  {
    name: "United Arab Emirates",
    iso2: "AE",
    dialCode: 971,
    format: "+...-.-......",
    hasAreaCodes: false
  },
]

const country = ref("");



</script>

<template>
  <div class="d-flex align-center justify-center h-screen px-2">
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
          <h5>{{ t("REGISTER") }}</h5>
        </h5>
      </VCardText>

      <VCardText>
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
          icon="tabler-list"
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

        <VForm ref="refregisterVForm"
          @submit.prevent="onNewRegisterSubmit">
          <VRow>
            <VCol v-if="inlineRadio == 'phone'"
              cols="12">
              <div class="">
                <phone-input @phone="phone = $event"
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

            <VCol cols="12">

              <div v-if="authStore.$state.button_loading_state"
                class="d-flex justify-center mt-2">
                <VProgressCircular indeterminate
                  color="info" />
              </div>
              <div v-else>
                <VBtn @click="isDialogVisible = true"
                  block
                  class="mt-2"
                  type="submit">
                  {{ t("Register") }}
                </VBtn>
              </div>
            </VCol>

            <!-- create account -->

            <VCol cols="12"
              class="text-center">
              <span>Already a member!</span>

              <RouterLink :to="{ name: 'login' }"
                class="font-weight-medium user-list-name">
                Login
              </RouterLink>
              <VCol cols="12"
                class="text-center"> </VCol>
            </VCol>

            <VCol cols="12"
              class="text-center">
              <span>Already Reaceived OTP</span>

              <RouterLink :to="{ name: 'update-password' }"
                class="font-weight-medium user-list-name">
                Update Password
              </RouterLink>
              <VCol cols="12"
                class="text-center"> </VCol>
            </VCol>
          </VRow>
        </VForm>
      </VCardText>
    </VCard>
  </div>
</template>

<style lang="scss">
@use "@core/scss/template/pages/page-auth.scss";

.invalid {
  border: 1px solid red;
}

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
