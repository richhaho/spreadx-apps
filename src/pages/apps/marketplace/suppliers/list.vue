<script setup>
import axios_lite from "@/plugins/axios_lite";
import { useDemoVendorStore } from '@/store/demoVendorStore';
import { useUiStore } from "@/store/uiStore";
import { onMounted, ref } from "vue";
const demoVendorStore = useDemoVendorStore();

const vendorId = ref();
const customerId = ref();
const supplierId = ref();
const code = ref();
const uiStore = useUiStore();
const qlineUrl = import.meta.env.VITE_API_V1;
uiStore.$subscribe(() => {});
demoVendorStore.$subscribe(() => {});
// axios_lite
//   .get(`get_vendor_data`, {
//     params
//   })
//   .then((response) => {
//     this.bisinesses = response.data.data;
//   })
//   .catch((error) => {
//     //   console.error(error);  
//   });
const headers = [
  {
    title: '#',
    key: 'id',
  },

  {
    title: 'SUPPLIER NAME',
    key: 'name',
  },
  {
    title: 'ACTIONS',
    key: 'actions',
    sortable: false,
    align: "center",
  },
]
const itemsPerPage = ref(10)
const searchQuery = ref('')
const page = ref(1)
const sortBy = ref()
const orderBy = ref()
onMounted(() => uiStore.getSuppliers());
const requests = computed(() => uiStore.$state.suppliers)
const isViewProductsDialogue = ref(false);
// console.log(requests);
function verifyCode(){
  axios_lite.get(`v1/verify_customer`, {
    params:{
      vendor_id: vendorId.value,
      code: code.value,
    }
  })  
  .then((res) => {
    if (res.data.status == false) {
      uiStore.setSnackBar(true, 'error', res.data.message)
    }
    if (res.data.status === true) {
      uiStore.setSnackBar(true, 'success', res.data.message)
      uiStore.getSuppliers();
      isViewProductsDialogue.value = false
    }   
  })   
}
const refNewVerifyForm = ref();
const onVerifyCodeSubmit = () => {
  
   verifyCode();
};
function verifyCustomer(details){
  
  vendorId.value = details.supplier_id
  customerId.value = details.customer_id
  supplierId.value = details.id
  isViewProductsDialogue.value = true
}
</script>
<style scoped>
.cart-item-image {
  block-size: auto;
  inline-size: 100%;
  max-inline-size: 90px; /* Set the desired maximum width for the product image */
}

</style>
<template>
  <div>
    <VDialog v-model="isViewProductsDialogue" max-width="600">
      <VCard>
        <div class="pa-6 d-flex align-center">
          <h5 class="text-h5">Verify Customer</h5>
          <VSpacer />
          <VBtn
            variant="tonal"
            class="rounded"
            size="32"
            @click="isViewProductsDialogue = false"
          >
            <VIcon size="18" icon="tabler-x" />
          </VBtn>
          
        </div>
        <VCardText>
            <VDivider></VDivider>
            <VForm ref="refNewVerifyForm"
            @submit.prevent="onVerifyCodeSubmit">
              <VCardText>
                <VRow>
                  <VCol cols="12"
                    md="12">
                    <VTextField label="Verification Code"
                      v-model="code"
                      :rules="[requiredValidator]"
                      type="text" />
                  </VCol>
                </VRow>
              </VCardText>

              <!-- <VCardText class="d-flex justify-end flex-wrap gap-3">
         
                <div>
                  <VBtn variant="tonal"
                    color="secondary"
                    @click="isDialogVisible = false"
                    class="mx-1">
                    Close
                  </VBtn>
                  <VBtn type="submit">Verify</VBtn>
                </div>
              </VCardText> -->
            </VForm>

          </VCardText>
      </VCard>
    </VDialog>
    <VRow>
        <VCol cols="12">
          <VCard title="SUPPLIERS LIST">
            <!-- 👉 Filters -->

            <VDivider />

            <VCardText class="d-flex flex-wrap py-4 gap-4">
              <div
                class=""
                style="min-width: 80px;"
              >
                <VSelect
                  v-model="itemsPerPage"
                  density="compact"
                  variant="outlined"
                  :items="[
                    { value: 10, title: '10' },
                    { value: 25, title: '25' },
                    { value: 50, title: '50' },
                    { value: 100, title: '100' },
                  ]"
                  @update:model-value="itemsPerPage = parseInt($event, 10)"
                />
              </div>

              <VSpacer />

              <div class="app-user-search-filter d-flex align-center flex-wrap gap-4">
                <!-- 👉 Search  -->
                <div style="width: 15rem;">
                  <VTextField
                    v-model="searchQuery"
                    placeholder="Search"
                    density="compact"
                  />
                </div>
                <!-- <VBtn :to="{ name: 'apps-marketplace-suppliers-new' }">
                  CREATE NEW SUPPLIER
                </VBtn> -->
              </div>
            </VCardText>

            <VCardText>
              <VRow>
                <VCol>
                  <VDataTableServer
                    v-model:items-per-page="itemsPerPage"
                    v-model:page="page"
                    :items="requests"
                    :items-length="totalRequests"
                    :headers="headers"
                    class="text-no-wrap"
                    @update:options="updateOptions"
                  >
                    <template #item.id="{ item, index }">
                      {{ (index + 1) }}
                    </template>
                    <template #item.name="{ item }">
                      {{ item.name  }}
                    </template>
                    <template #item.actions="{ item }">

                      <!-- <VBtn 
                        v-if="item.verified == 0"                        
                        variant="tonal"
                        color="default"
                        v-bind="slotProps"
                        :icon="false"
                        @click="verifyCustomer(item)"
                      >
                        Verify
                      </VBtn> -->
<!--                      <VBtn-->
<!--                        v-else-->
<!--                        color="success"-->
<!--                        disabled-->
<!--                      >-->
<!--                        Verified-->
<!--                      </VBtn> &ndash;&gt;-->
                    </template>


                  
                    <!-- Actions -->

                    <!-- pagination -->
                    <template #bottom>
                      <VDivider />
                      <div class="d-flex align-center justify-sm-space-between justify-center flex-wrap gap-3 pa-5 pt-3">
               

                        <VPagination
                          v-model="page"
                          :length="Math.ceil(totalRequests / itemsPerPage)"
                          :total-visible="5"
                        >
                          <template #prev="slotProps">
                            <VBtn
                              variant="tonal"
                              color="default"
                              v-bind="slotProps"
                              :icon="false"
                            >
                              Previous
                            </VBtn>
                          </template>

                          <template #next="slotProps">
                            <VBtn
                              variant="tonal"
                              color="default"
                              v-bind="slotProps"
                              :icon="false"
                            >
                              Next
                            </VBtn>
                          </template>
                        </VPagination>
                      </div>
                    </template>
                  </VDataTableServer>
                </VCol>
              </VRow>
            </VCardText>
          </VCard>
        </VCol>
    </VRow>
  </div>
</template>
