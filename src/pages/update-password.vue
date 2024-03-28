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
import { requiredValidator } from "@validators";
import { useI18n } from "vue-i18n";
const authStore = useAuthStore();

authStore.$subscribe((mutation, state) => { });

const clearErrors = computed(() => {
  // authStore.$state.authentication_error_state = [];
  // authStore.$state.authentication_success_state = [];
});

const refUpdatePasswordVForm = ref();

const update_password = () => {
  authStore.$state.authentication_error_state = [];
  authStore.$state.authentication_success_state = [];
  authStore.verifyToken({
    token: token.value,
    password: password.value,
  });
};

const onUpdatePasswordSubmit = () => {
  authStore.$state.button_loading_state = true;
  refUpdatePasswordVForm.value?.validate().then(({ valid: isValid }) => {
    isValid
      ? update_password()
      : (authStore.$state.button_loading_state = false);
  });
};

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

        <h3 class="text-center" >Account Activation</h3>  
        <h5 class="text-center font-weight-semibold mb-1">
          {{ t("We send an OTP to your registered phone/E-mail. Please provide it to activate your account") }}
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
          @submit.prevent="onUpdatePasswordSubmit">
          <VRow>
            <!-- email -->
            <VCol cols="12">
              <VTextField v-model="token"
                label="OTP"
                type="text"
                :rules="[requiredValidator]" />
            </VCol>

            <!-- password -->
            <VCol cols="12">
              <VTextField v-model="password"
                label="Password"
                :rules="[requiredValidator]"
                :type="isPasswordVisible ? 'text' : 'password'"
                :append-inner-icon="isPasswordVisible ? 'tabler-eye-off' : 'tabler-eye'
                  "
                @click:append-inner="isPasswordVisible = !isPasswordVisible" />

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
                  {{ t("Update") }}
                </VBtn>
              </div>
            </VCol>

            <!-- create account -->

            <!-- <VCol cols="12">
                <div class="d-flex ga-2">
                  <h4>Already Have token?</h4>
                  <RouterLink class="d-flex align-center justify-center "
                    :to="{ name: 'verify' }">

                    <span>Verify</span>
                  </RouterLink>
                </div>
              </VCol> -->

            <!-- back to Register -->
            <VCol cols="12">
              <RouterLink class="d-flex align-center justify-center"
                :to="{ name: 'register' }">
                <VIcon icon="tabler-chevron-left"
                  class="flip-in-rtl" />
                <span>Back to Register</span>
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
