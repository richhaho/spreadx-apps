<script setup>
import { createFormData } from "@/helpers/helpers";
import axios_lite from '@/plugins/axios_lite';
import { useUiStore } from "@/store/uiStore";
import { ref } from "vue";
import { useRouter } from 'vue-router';
const uiStore = useUiStore();
const v1 =import.meta.env.VITE_API_V1
const v2 =import.meta.env.VITE_API_V2
const router = useRouter();
uiStore.$subscribe(() => { });

const supplierTypes = 
  [
    {
      title: "Cash",
      value: 1,
    },
    {
      title: "Credit",
      value: 2,
    }
  ];

const selectedSupplierTypes = ref();
const supplierName = ref()
const supplierCode = ref()
const phoneNumber = ref();
const supplierType = ref();
const supplierLocation = ref();

const saveNewSupplier = () => {
  const formData = {
    supplier_name: supplierName.value,
    supplier_code: supplierCode.value,
    phone_number: phoneNumber.value,
    supplier_type: supplierType.value,
    location: supplierLocation.value,
  }

  axios_lite
    .post(`v1/suppliers`, createFormData(formData))
    .then(() => {
      uiStore.setSnackBar(true, 'success', 'Supplier Saved Successfully')
      router.push('/apps/marketplace/suppliers/list');
    })
    .catch((error) => {
      console.log(JSON.parse(error.request.response).errors.message)
      uiStore.setSnackBar(true, 'error', JSON.parse(error.request.response).errors.message)
    })
};
const onNewSupplierSubmit = () => {
  saveNewSupplier();
};
</script>

<template>
  <div class="">
    <VRow>
      <VCol cols="12">
        <VCard title="CREATE NEW SUPPLIER">
          <!-- 👉 Filters -->
          <VCardText>
            <VDivider></VDivider>
            <VForm ref="refNewRecuringBillVForm"
              @submit.prevent="onNewSupplierSubmit">
              <VCardText>

                <VRow>

                  <VCol cols="4"
                    md="4">
                    <VTextField label="Supplier Name"
                      v-model="supplierName"
                      :rules="[requiredValidator]"
                      type="text" />
                  </VCol>

                  <VCol cols="4"
                    md="4">
                    <VTextField label="Supplier Code"
                      v-model="supplierCode"
                      :rules="[requiredValidator]"
                      type="text" />
                  </VCol>

                  <VCol cols="4"
                    md="4">
                    <VTextField
                      v-model="phoneNumber"
                      dirty
                      name="mobile"
                      type="number"
                      prefix="+971"
                      label="Phone Number"
                      placeholder="50 565 5656"
                      :rules="[requiredValidator]"
                      class="mb-5"
                    />
                  </VCol>
                </VRow>


                <VRow>
         

                  <VCol cols="12"
                    sm="4">
                    <VSelect v-model="selectedSupplierTypes"
                      label="Supplier Type"
                      return-object
                      item-value="value"
                      item-text="title"
                      :items="supplierTypes"
                      :rules="[requiredValidator]"
                      />
                  </VCol>

                  <VCol cols="12"
                    sm="4">
                    <VTextField v-model="supplierLocation"
                      clearable
                      :rules="[requiredValidator]"
                      clear-icon="tabler-circle-x"
                      label="Address"
                      />
                  </VCol>
                </VRow>

                <VRow>
                  <VCol cols="12"
                    sm="12">
               
                  </VCol>
                </VRow>

          

              </VCardText>

              <VCardText class="d-flex justify-end flex-wrap gap-3">
         
                <div>
                  <VBtn variant="tonal"
                    color="secondary"
                    @click="isDialogVisible = false"
                    class="mx-1">
                    Close
                  </VBtn>
                  <VBtn type="submit">Save</VBtn>
                </div>
              </VCardText>
            </VForm>

          </VCardText>
        </VCard>
      </VCol>
    </VRow>
  </div>
</template>
