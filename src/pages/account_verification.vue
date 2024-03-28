
<script setup>
import { requiredValidator } from "@/@core/utils/validators";
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
import { useI18n } from "vue-i18n";
import axios_lite from "@/plugins/axios_lite";
import routing from "../router/index";
const authStore = useAuthStore();
const { t } = useI18n();
const authThemeImg = useGenerateImageVariant(
  authV2LoginIllustrationLight,
  authV2LoginIllustrationDark,
  authV2LoginIllustrationBorderedLight,
  authV2LoginIllustrationBorderedDark,
  true
);
const v1 =
  import.meta.env.VITE_API_V1
const v2 =
  import.meta.env.VITE_API_V2
const authThemeMask = useGenerateImageVariant(authV2MaskLight, authV2MaskDark);
const isPasswordVisible = ref(false);
const router = useRouter()
const otp = ref('')
const isOtpInserted = ref(false)

const onFinish = () => {
  isOtpInserted.value = true
  authStore.$state.authentication_error_state=[]
  axios_lite.post(`${v1}create-business`, {token:otp.value})
    .then((res) => {
      if (res.data.status === 422) {
        authStore.$state.authentication_error_state = [res.data.errors.message]
      }
      else if (res.data.status === true) {
        authStore.$state.authentication_success_state = ["Your account Has Been Verified login to continue"];
        routing.push('/login')
      } else {
        authStore.$state.authentication_error_state = [res.data.errors.message];
      }
    })
    .catch((error) => {

      console.log("error status" + error.response.status);
      if (error.response && error.response.status === 422) {
        authStore.$state.authentication_error_state = error.response.data.errors.message.split(",");
      }

    })
    .finally((state) => {
      isOtpInserted.value = false
    });
}

authStore.$subscribe((mutation, state) => { });

const clearErrors = (() => {
  authStore.$state.authentication_error_state = [];
  authStore.$state.authentication_success_state = [];
});

const refregisterVForm = ref();

const register_user = () => {
  authStore.$state.authentication_error_state = [];
  authStore.$state.authentication_success_state = [];
  const urlParams = new URLSearchParams(window.location.search);
  authStore.registerUser({
    username: phone.value,
    vendor_customer_id: localStorage.getItem('customer_id'),
    vendor_id: localStorage.getItem('supplier_id')
  });
};


const verifyOtpVForm = ref();


const onNewVerifySubmit = (() => {

  authStore.$state.button_loading_state = true;
  verifyOtpVForm.value?.validate().then(({ valid: isValid }) => {
    isValid ? authStore.verifyToken({
      token: otp.value,
    }) : (authStore.$state.button_loading_state = false);
  });
})


const onNewRegisterSubmit = () => {
  authStore.$state.button_loading_state = true;
  refregisterVForm.value?.validate().then(({ valid: isValid }) => {
    isValid ? register_user() : (authStore.$state.button_loading_state = false);
  });
};
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

        <h5 class="text-h5 font-weight-semibold mb-1 text-center">
          Account Verification
        </h5>
        <p class="mb-0 text-center">Your Account is Unverified</p>
        <p class="mb-0 text-center">We sent a verification code to your mobile/E-mail. Enter the code in the field below.</p>

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
                @click="onFinish"
                type="submit">
                Verify my account
              </VBtn>
            </VCol>

            <VCol cols="12">
              <div class="d-flex justify-center align-center flex-wrap">
                <span class="me-1">Didn't get the code?</span>
                <RouterLink :to="{ name: 'login' }"
                  class="font-weight-medium user-list-name">
                  Request Again
                </RouterLink>
              </div>
            </VCol>
          </VRow>
        </VForm>
        <VDivider />

      </VCardText>
    </VCard>
  </div>
</template>

<style lang="scss">
@use "@core/scss/template/pages/page-auth.scss";
</style>

<route lang="yaml">
meta:
  layout: blank
  action: read
  subject: Auth
  redirectIfLoggedIn: false
</route>

