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
import { confirmedValidator, requiredValidator } from "@validators";
import { useI18n } from "vue-i18n";
import axios_lite from "@/plugins/axios_lite";
import { useUiStore } from "@/store/uiStore";
import { useRouter } from 'vue-router';
import { ref } from "vue";
const uiStore = useUiStore();
const router = useRouter();
const v1 =
  import.meta.env.VITE_API_V1
const v2 =
  import.meta.env.VITE_API_V2
const authStore = useAuthStore();

authStore.$subscribe((mutation, state) => { });

const clearErrors = computed(() => {
  // authStore.$state.authentication_error_state = [];
  // authStore.$state.authentication_success_state = [];
});

const refUpdatePasswordVForm = ref();


const formData = ref({
  new_password: '',
  confirmPassword: '',
  token: localStorage.getItem("token"),
})

const isResetLoading= ref(false)

const requestChangePassword = (() => {
  axios_lite.post(`${v1}update-forget-password`,
    formData.value
  )
    .then((res) => {
      if (res.data.status === 422) {
        uiStore.setSnackBar(true, 'success', res.data.errors.message)
      }
      if (res.data.status === true) {
        uiStore.setSnackBar(true, 'success', "Password Changed Successfully")
        router.push('/login')
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



const submitResetPassword = (() => {
  isResetLoading.value = true
  refUpdatePasswordVForm.value?.validate().then(({ valid: isValid }) => {
    isValid ? requestChangePassword() : (isResetLoading.value = false);
  });
});




const isPasswordVisible = ref(false)
const isConfirmPasswordVisible = ref(false)



const { t } = useI18n();
const authThemeImg = useGenerateImageVariant(
  authV2LoginIllustrationLight,
  authV2LoginIllustrationDark,
  authV2LoginIllustrationBorderedLight,
  authV2LoginIllustrationBorderedDark,
  true
);
const authThemeMask = useGenerateImageVariant(authV2MaskLight, authV2MaskDark);

const email = ref("");
const password = ref("");
const token = ref();
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
          <h5>{{ t("Create your new password") }}</h5>
        </h5>
      </VCardText>
      <VCardText>
        <VAlert v-if="authStore.$state.authentication_error_state.length"
          type="error"
          icon="tabler-list"
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


        <VForm ref="refUpdatePasswordVForm"
          @submit.prevent="submitResetPassword">
          <VRow>
            <!-- password -->
            <VCol cols="12">
              <VTextField v-model="formData.new_password"
                autofocus
                label="New Password"
                placeholder="············"
                :rules="[requiredValidator]"
                :type="isPasswordVisible ? 'text' : 'password'"
                :append-inner-icon="isPasswordVisible ? 'tabler-eye-off' : 'tabler-eye'"
                @click:append-inner="isPasswordVisible = !isPasswordVisible" />
            </VCol>

            <!-- Confirm Password -->
            <VCol cols="12">
              <VTextField v-model="formData.confirmPassword"
                label="Confirm Password"
                :rules="[confirmedValidator(formData.confirmPassword, formData.new_password)]"
                placeholder="············"
                :type="isConfirmPasswordVisible ? 'text' : 'password'"
                :append-inner-icon="isConfirmPasswordVisible ? 'tabler-eye-off' : 'tabler-eye'"
                @click:append-inner="isConfirmPasswordVisible = !isConfirmPasswordVisible" />
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
                    {{ t("UPDATE PASSWORD") }}
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
