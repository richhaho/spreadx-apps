
<script setup>
import { requiredValidator } from "@/@core/utils/validators";
import NavBarI18n from "@/layouts/components/NavBarI18n.vue";
import NavbarThemeSwitcher from "@/layouts/components/NavbarThemeSwitcher.vue";
import axios_lite from "@/plugins/axios_lite";
import { useAuthStore } from "@/store/auth";
import { useUiStore } from "@/store/uiStore";
import { useGenerateImageVariant } from "@core/composable/useGenerateImageVariant";
import authV2LoginIllustrationBorderedDark from "@images/pages/auth-v2-login-illustration-bordered-dark.png";
import authV2LoginIllustrationBorderedLight from "@images/pages/auth-v2-login-illustration-bordered-light.png";
import authV2LoginIllustrationDark from "@images/pages/auth-v2-login-illustration-dark.png";
import authV2LoginIllustrationLight from "@images/pages/auth-v2-login-illustration-light.png";
import authV2MaskDark from "@images/pages/misc-mask-dark.png";
import authV2MaskLight from "@images/pages/misc-mask-light.png";
import { VNodeRenderer } from "@layouts/components/VNodeRenderer";
import { themeConfig } from "@themeConfig";
import { ref } from "vue";
import { useI18n } from "vue-i18n";
import { useRouter } from "vue-router";
const uiStore = useUiStore();
const router = useRouter();
const v1 =
  import.meta.env.VITE_API_V1
const v2 =
  import.meta.env.VITE_API_V2
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


const formData = ref({
  token: ''
})

authStore.$subscribe((mutation, state) => { });

const refLoginforgotPasswordVForm = ref()
const isResetLoading = ref(false);


const submitOtp = (() => {
  isResetLoading.value = true
  refLoginforgotPasswordVForm.value?.validate().then(({ valid: isValid }) => {
    isValid ? requestChangePassword() : (isResetLoading.value = false);
  });
});



const requestChangePassword = (() => {
  axios_lite.post(`${v1}verify-token`,
    formData.value
  )
    .then((res) => {
      if (res.data.status === 422) {
        uiStore.setSnackBar(true, 'success', res.data.errors.message)
      }
      if (res.data.status === true) {
        uiStore.setSnackBar(true, 'success', "Otp verified successfully Continue to reset password")
        localStorage.setItem('token', formData.value.token)
        router.push('/reset_password')
        isResetLoading.value = false
      } else {
        uiStore.setSnackBar(true, 'success', res.data.errors.message)
      }
    })
    .catch((error) => {
      isResetLoading.value = false,
    uiStore.setSnackBar(true, 'error', error.response.data.errors.message)
    })
    .finally((state) => {
      isResetLoading.value = false
    });
})



</script>

<template>
  <div class="d-flex align-center justify-center h-screen px-2">
    <VCard :max-width="400"
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
          Verify Otp
        </h5>


        <p class="mb-0 text-center">
          Enter the Otp you received
        </p>
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
        <VForm ref="refLoginforgotPasswordVForm"
          @submit.prevent="submitOtp">
          <VRow>
            <!-- token -->

            <VCol cols="12">
              <VTextField v-model="formData.token"
                label="otp"
                :rules="[requiredValidator]"
                type="number" />
            </VCol>
            <VCol cols="12">
              <div v-if="isResetLoading"
                class="d-flex justify-center mt-3">
                <VProgressCircular indeterminate
                  color="info" />
              </div>
              <div v-else>
                <VBtn block
                  type="submit">
                  {{ t("Verify") }}
                </VBtn>
              </div>
            </VCol>
            <!-- back to login -->
            <VCol cols="12">
              <RouterLink class="d-flex align-center justify-center"
                :to="{ name: 'login' }">
                <VIcon icon="tabler-chevron-left"
                  class="flip-in-rtl" />
                <span>Back to login</span>
              </RouterLink>
            </VCol>
          </VRow>
        </VForm>
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
  redirectIfLoggedIn: true
</route>

