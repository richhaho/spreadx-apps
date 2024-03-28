<script setup>
import { createFormData } from '@/helpers/helpers';
import axios_lite from "@/plugins/axios_lite";
import { useUiStore } from '@/store/uiStore';
import { emailValidator, requiredValidator } from "@validators";
import { ref } from 'vue';
import { useI18n } from "vue-i18n";
const uiStore = useUiStore();
uiStore.$subscribe(() => {

});
const { t } = useI18n();
const v1 =
  import.meta.env.VITE_API_V1
const v2 =
  import.meta.env.VITE_API_V2



const userDataString = localStorage.getItem("userData");
const userData = JSON.parse(userDataString);

const accountData = ref({
  profile_image: null,
  first_name: userData.first_name,
  last_name: userData.last_name,
  email: userData.email,
  phone: userData.country_code ? userData.country_code + "-" + userData.phone : userData.phone,
})

const profile_image_name = ref(userData.profile_image);

const refInputEl = ref()
const isConfirmDialogOpen = ref(false)
// const accountDataLocal = ref(structuredClone(accountData))
const isAccountDeactivated = ref(false)
const validateAccountDeactivation = [v => !!v || 'Please confirm account deactivation']

// const resetForm = () => {
//   accountDataLocal.value = structuredClone(accountData)
// }

const changeAvatar = file => {
  const fileReader = new FileReader()
  const { files } = file.target
  accountData.value.profile_image = files[0];
  if (files && files.length) {
    fileReader.readAsDataURL(files[0]);
    fileReader.onload = () => {
      console.log("imagePath" + fileReader.result);
      if (typeof fileReader.result === 'string')
        console.log("imagePath" + fileReader.result);
      profile_image_name.value = fileReader.result
    }
  }
}

// reset avatar image
const resetAvatar = () => {
  accountData.value.profile_image = null
  profile_image_name.value = '';
}



const updateUserProfile = (data) => {
  axios_lite.post(`${v1}profile`, data)
    .then((res) => {
      if (res.data.status == false) {
        uiStore.setSnackBar(true, 'error', res.data.message)
      }
      if (res.data.status === true) {
        uiStore.setSnackBar(true, 'success', "Profile updated successfully")
        localStorage.setItem("userData", JSON.stringify(res.data.data));
      }
    }).catch((error) => {
      uiStore.setSnackBar(true, 'error', error)
    }).finally(() => isUpdateProfile.value = false)
}





const refUpdateProfileVForm = ref();
const isUpdateProfile = ref(false)



const submitUpdateProfile = (() => {
  isUpdateProfile.value = true
  refUpdateProfileVForm.value?.validate().then(({ valid: isValid }) => {
    isValid ? updateUserProfile(createFormData(accountData.value)) : isUpdateProfile.value = false;
  });
})


const changePassword = (data) => {

  axios_lite.post(`${v1}auth/change-password`, data)
    .then((res) => {
      if (res.data.status == false) {
        uiStore.setSnackBar(true, 'error', res.data.errors.message)
      }
      if (res.data.status === true) {
        uiStore.setSnackBar(true, 'success', "Profile updated successfully")
      }
    }).catch((error) => {
      uiStore.setSnackBar(true, 'error', error)
    }).finally(() => isPasswordChangeLoading.value = false)
}



const refUpdatePasswordVForm = ref();
const isPasswordVisible = ref(false);

const formData = ref({
  new_password: '',
  old_password: '',
})

const isPasswordChangeLoading = ref();

const submitResetPassword = (() => {
  isPasswordChangeLoading.value = true;
  refUpdatePasswordVForm.value?.validate().then(({ valid: isValid }) => {
    isValid ? changePassword(formData.value) : (isPasswordChangeLoading.value = false);
  });
});


const twoFa = ref();

// check-two-factor-auth

const checkTwoFactorAuth = ((token) => {
  const access_token = localStorage.getItem("accessToken")
  axios_lite.defaults.headers.common["Authorization"] = `Bearer ${access_token}`;
  axios_lite.post(`${v1}check-two-factor-auth`)
    .then((res) => {
      if (res.data.status == false) {
        uiStore.setSnackBar(true, 'error', res.data.errors.message)
      }
      if (res.data.status === true) {
        twoFa.value = res.data.data !== null ? res.data.data === 1 ? true : false : 0;
      }
    }).catch((error) => {
      uiStore.setSnackBar(true, 'error', error)
    }).finally(() => { })
})


checkTwoFactorAuth();


const updatingTwoFactorAuth = ref()

const updtaeTwoFactorAuthentication = ((event) => {
  updatingTwoFactorAuth.value = true
  axios_lite.post(`${v1}enable-2fa`, {
    is_two_factor_on: event == true ? 1 : 0
  })
    .then((res) => {
      if (res.data.status == false) {
        uiStore.setSnackBar(true, 'error', res.data.errors.message)
      }
      if (res.data.status === true) {
        uiStore.setSnackBar(true, 'success', res.data.message)
      }
    }).catch((error) => {
      uiStore.setSnackBar(true, 'error', error)
    }).finally(() => updatingTwoFactorAuth.value = false)
})

const twoFaState = ((states) => {
  switch (states) {
    case true: return {
      state: "Active",
      color: "success"
    }

      break;

    default:
      return {
        state: "Inactive",
        color: "warning"
      }
      break;
  }
})




const countdown = ref(0); // Start with 60 seconds
const countdownStarted = ref(false); // Flag to track if countdown has started

const startCountdown = () => {
  countdown.value = 60;
  countdownStarted.value = true; // Set flag to true when countdown starts
  const intervalId = setInterval(() => {
    if (countdown.value > 0) {
      countdown.value--; // Decrement the countdown value by one second
    } else {
      clearInterval(intervalId); // Clear the interval when countdown finishes
    }
  }, 1000);
};

const refMainOtpVForm = ref();

const sendMailOtp = (() => {
  refMainOtpVForm.value?.validate().then(({ valid: isValid }) => {
    if (isValid) {
      startCountdown()
      // pettyCashStore.createCategories({
      //   name: billCategoryName.value,
      //   code: billCategoryCode.value,
      // });
    }
  })
})

const email = ref()
const isUpdateUserEmail = ref(false);
const otp = ref('')
const isOtpInserted = ref(false)
const onFinish = () => {
  // countdown.value = 0;
  isOtpInserted.value = true
  setTimeout(() => {
    isOtpInserted.value = false

  }, 2000)
}


</script>

<template>
  <div class="">


    <VDialog height="auto"
      persistent
      v-model="isUpdateUserEmail"
      max-width="30%">


      <DialogCloseBtn @click="isUpdateUserEmail = false" />

      <VCard title="Update Your Email">
        <VCardText>

          <VForm ref="refMainOtpVForm"
            @submit.prevent="sendMailOtp">
            <VRow>
              <VCol cols="12"
                md="8">
                <VTextField v-model="email"
                  :rules="[requiredValidator, emailValidator]"
                  placeholder="example@spread.ae"
                  label="New E-Mail" />
              </VCol>

              <VCol cols="12"
                sm="4">
                <VBtn type="submit"
                  v-if="countdown < 1">Get OTP</VBtn>

                <VBtn v-else
                  label
                  variant="outlined"
                  color="primary">
                  <VIcon start
                    size="16"
                    icon="tabler-clock" />
                  {{ countdown }}
                </VBtn>
              </VCol>
            </VRow>

            <VRow>
              <!-- email -->
              <VCol cols="12"
                class="d-flex justify-center">


                <VProgressLinear v-if="isOtpInserted"
                  indeterminate
                  color="info" />

                <VOtpInput v-else
                  v-model="otp"
                  :disabled="isOtpInserted"
                  type="number"
                  class="pa-0"
                  @finish="onFinish" />

              </VCol>
            </VRow>

          </VForm>




        </VCardText>
      </VCard>

    </VDialog>


    <VRow>
      <VCol cols="12">



        <VCard>

          <VBtn color="secondary"
            variant="tonal"
            class="ma-2">
            <VIcon icon="tabler-user"></VIcon>
            Profile Settings
          </VBtn>


          <VCardText class="pt-2">

            <VForm ref="refUpdateProfileVForm"
              @submit.prevent="submitUpdateProfile">

              <VCardText class="d-flex">

                <VAvatar rounded
                  size="100"
                  class="me-6"
                  :image="profile_image_name" />
                <div class="d-flex flex-column justify-center gap-4">
                  <div class="d-flex flex-wrap gap-2">
                    <VBtn color="info"
                      variant="tonal"
                      @click="refInputEl?.click()">
                      <VIcon icon="tabler-cloud-upload"
                        class="d-sm-none" />
                      <span class="d-none d-sm-block">Upload new photo</span>
                    </VBtn>

                    <input ref="refInputEl"
                      type="file"
                      name="file"
                      accept=".jpeg,.png,.jpg"
                      hidden
                      @input="changeAvatar">

                    <VBtn type="reset"
                      color="secondary"
                      variant="tonal"
                      @click="resetAvatar">
                      <span class="d-none d-sm-block">Reset</span>
                      <VIcon icon="tabler-refresh"
                        class="d-sm-none" />
                    </VBtn>
                  </div>

                  <p class="text-body-1 mb-0">
                    Allowed JPG, JPEG or PNG. Max size of 1MB
                  </p>
                </div>
              </VCardText>

              <VDivider />

              <VRow class="mt-2">

                <VCol cols="12"
                  sm="3">
                  <VTextField v-model="accountData.first_name"
                    autofocus
                    label="First Name"
                    :rules="[requiredValidator]" />
                </VCol>


                <VCol cols="12"
                  sm="3">
                  <VTextField v-model="accountData.last_name"
                    label="Last Name"
                    :rules="[requiredValidator]" />
                </VCol>

                <VCol cols="12"
                  sm="3">
                  <VTextField v-model="accountData.email"
                    label="Email"
                    type="email"
                    readonly
                    append-inner-icon="tabler-edit"
                    @click:append-inner="isUpdateUserEmail = true"
                    :rules="[requiredValidator]" />
                </VCol>

                <VCol cols="12"
                  sm="3">
                  <VTextField v-model="accountData.phone"
                    label="Phone"
                    type="text"
                    readonly
                    disabled="true"
                    :rules="[requiredValidator]" />
                </VCol>



              </VRow>


              <VRow>
                <VCol cols="12"
                  class="d-flex justify-end">
                  <div v-if="isUpdateProfile"
                    class="d-flex justify-center mt-3">
                    <VProgressCircular indeterminate
                      color="info" />
                  </div>
                  <div v-else>
                    <VBtn type="submit">
                      {{ t("UPDATE Profile") }}
                    </VBtn>
                  </div>
                </VCol>
              </VRow>


            </VForm>

          </VCardText>



        </VCard>
      </VCol>

      <VCol cols="12">





        <VRow>
          <VCol cols="12"
            md="6">
            <VCard>
              <VBtn color="warning"
                variant="tonal"
                class="ma-2">
                <VIcon icon="tabler-shield-lock"></VIcon>
                Security Settings
              </VBtn>
              <VCardText>
                <h3>Change Password</h3>

                <VForm ref="refUpdatePasswordVForm"
                  @submit.prevent="submitResetPassword">
                  <VRow>

                    <VCol cols="12"
                      sm="5">
                      <VTextField v-model="formData.old_password"
                        autofocus
                        label="Old Password"
                        placeholder="············"
                        :rules="[requiredValidator]"
                        :type="isPasswordVisible ? 'text' : 'password'"
                        :append-inner-icon="isPasswordVisible ? 'tabler-eye-off' : 'tabler-eye'"
                        @click:append-inner="isPasswordVisible = !isPasswordVisible" />
                    </VCol>


                    <VCol cols="12"
                      sm="5">
                      <VTextField v-model="formData.new_password"
                        label="New Password"
                        :rules="[requiredValidator]"
                        placeholder="············"
                        :type="isConfirmPasswordVisible ? 'text' : 'password'"
                        :append-inner-icon="isConfirmPasswordVisible ? 'tabler-eye-off' : 'tabler-eye'"
                        @click:append-inner="isConfirmPasswordVisible = !isConfirmPasswordVisible" />
                    </VCol>



                    <VCol cols="12"
                      sm="2">
                      <div v-if="isPasswordChangeLoading"
                        class="d-flex justify-center mt-3">
                        <VProgressCircular indeterminate
                          color="info" />
                      </div>
                      <div v-else>
                        <VBtn block
                          type="submit">
                          {{ t("CHANGE") }}
                        </VBtn>
                      </div>
                    </VCol>
                  </VRow>
                </VForm>

                <VDivider class="mt-4" />
                <div class="d-flex gap-2 justify-end mt-1">

                  <div v-if="updatingTwoFactorAuth"
                    class="d-flex justify-center mt-3">
                    <VProgressCircular indeterminate
                      color="info" />
                  </div>

                  <VSwitch v-else
                    v-model="twoFa"
                    :color="twoFaState(twoFa).color"
                    @update:model-value="updtaeTwoFactorAuthentication($event)"
                    :label="`Two Factor Authentication is ${twoFaState(twoFa).state}`"
                    hide-details
                    inset>
                  </VSwitch>
                </div>

              </VCardText>
            </VCard>
          </VCol>
        </VRow>
      </VCol>
    </VRow>
  </div>
</template>
