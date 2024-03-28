<script setup>
import { requiredValidator } from '@/@core/utils/validators';
import NavBarI18n from '@/layouts/components/NavBarI18n.vue';
import NavbarThemeSwitcher from '@/layouts/components/NavbarThemeSwitcher.vue';
import axios_lite from "@/plugins/axios_lite";
import { useUiStore } from "@/store/uiStore";
import { useGenerateImageVariant } from '@core/composable/useGenerateImageVariant';
import authV2ForgotPasswordIllustrationDark from '@images/pages/auth-v2-forgot-password-illustration-dark.png';
import authV2ForgotPasswordIllustrationLight from '@images/pages/auth-v2-forgot-password-illustration-light.png';
import authV2MaskDark from '@images/pages/misc-mask-dark.png';
import authV2MaskLight from '@images/pages/misc-mask-light.png';
import { VNodeRenderer } from '@layouts/components/VNodeRenderer';
import { themeConfig } from '@themeConfig';
import { ref } from 'vue';
import { useI18n } from 'vue-i18n';
import { useDisplay } from 'vuetify';
import { useRouter } from 'vue-router';
const { name } = useDisplay()
const { t } = useI18n()
const email = ref('')
const uiStore = useUiStore();
const router = useRouter();
const v1 =
  import.meta.env.VITE_API_V1
const v2 =
  import.meta.env.VITE_API_V2
const authThemeImg = useGenerateImageVariant(authV2ForgotPasswordIllustrationLight, authV2ForgotPasswordIllustrationDark)
const authThemeMask = useGenerateImageVariant(authV2MaskLight, authV2MaskDark)

const getVariant = computed(() => {
  switch (name.value) {
    case 'xs': return 'flat'
    case 'sm': return 'flat'
    default: return "tonal"
  }
  return undefined
})

const formData = ref({
  username: ''
});

const isResetLoading = ref(false);

const message = ref("");
const refLoginforgotPasswordVForm = ref();

const submitResetPassword = (() => {
  isResetLoading.value = true
  refLoginforgotPasswordVForm.value?.validate().then(({ valid: isValid }) => {
    isValid ? requestChangePassword() : (isResetLoading.value = false);
  });
});



const requestChangePassword = (() => {
  axios_lite.get(`${v1}reset-password`, {
    params: formData.value
  })
    .then((res) => {
      if (res.data.status === 422) {
        // authStore.$state.authentication_error_state = [res.data.errors.message]
      }
      if (res.data.status === true) {
        uiStore.setSnackBar(true, 'success', "We send you an otp code Please use it to reset your password")
         router.push('/password_otp')
        // authStore.$state.authentication_success_state = ["Check "];
        isResetLoading.value = false
      } else {
         uiStore.setSnackBar(true, 'error', res.data.errors.message)
      }
    })
    .catch((error) => { 
       uiStore.setSnackBar(true, 'error', error.response.data.errors.message)
    })
    .finally((state) => {
      isResetLoading.value = false
    });
})




</script>

<template>
  <div class="d-flex align-center justify-center px-2 h-screen">

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

        <h5 class="text-h5 font-weight-semibold mb-1">
          Forgot Password?
        </h5>

        <p class="mb-0">
          Enter your username and we'll send you instructions to reset your password
        </p>
      </VCardText>

      <VCardText>
        <VForm ref="refLoginforgotPasswordVForm"
          @submit.prevent="submitResetPassword">
          <VRow>
            <!-- email -->
            <VCol cols="12">
              <VTextField v-model="formData.username"
                label="Username"
                placeholder="971-5252525252"
                :rules="[requiredValidator]"
                type="text" />
            </VCol>

            <!-- Reset link -->
            <VCol cols="12">
              <!-- <VBtn block
                type="submit">
                Continue
              </VBtn> -->

              <div v-if="isResetLoading"
                class="d-flex justify-center">
                <VProgressCircular indeterminate
                  color="info" />
              </div>
              <div v-else>
                <VBtn block
                  type="submit">
                  Continue
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
