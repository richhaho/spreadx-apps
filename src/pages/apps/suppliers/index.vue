<script setup>
import axios_lite from "@/plugins/axios_lite";
import { useDemoVendorStore } from '@/store/demoVendorStore';
import { useUiStore } from "@/store/uiStore";
import { onMounted, ref } from "vue";

const demoVendorStore = useDemoVendorStore();

const vendorId = ref();
const supplierId = ref();
const customerId = ref();
const code = ref();
const uiStore = useUiStore();
const customerDetails = ref(null)
const qlineUrl = import.meta.env.VITE_API_V1;
uiStore.$subscribe(() => { });
demoVendorStore.$subscribe(() => { });


const subtitleHardcoded = "This is hard coded subtitle"
const timeHardCoded = "Until 6:00 PM"
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
    align: "end",
  },
]

const itemsPerPage = ref(0)
const searchQuery = ref('')
const page = ref(1)
const sortBy = ref()
const orderBy = ref()
const isGridView = ref(true);

onMounted(() => uiStore.getSuppliers())

const requests = computed(() => uiStore.$state.suppliers.map((item, index) => {
  return {
    ...item,
    like: index % 2,
    cartegories: [
      {
        id: 1,
        name: 'Food',
        image: 'https://eta.ironrocksoftware.com/images/temp/1.png',
        brand: '',
      },
      {
        id: 2,
        name: 'Bags',
        image: 'https://eta.ironrocksoftware.com/images/temp/2.png',
        brand: '',
      },
      {
        id: 3,
        name: 'Clothes',
        image: 'https://eta.ironrocksoftware.com/images/temp/3.png',
        brand: '',
      },
    ]
  }
}))

var items = requests
function search() {
  items = requests._value.filter(item => item.name.toLowerCase().includes(this.searchQuery.toLowerCase()))
}
const isViewProductsDialogue = ref(false)

function verifyCode() {
  axios_lite.get(`v1/verify_customer`, {
    params: {
      supplier_id: supplierId.value,
      vendor_id: vendorId.value,
      code: code.value,
    },
  })
    .then(res => {
      if (res.data.status === false) {
        uiStore.setSnackBar(true, 'error', res.data.message)
      }
      if (res.data.status === true) {
        uiStore.setSnackBar(true, 'success', res.data.message)
        uiStore.getSuppliers()
        isViewProductsDialogue.value = false
      }
    })
}

//check customer_vendor_verification
const resolveCustomerVendorVerification = (verified => {
  if (verified) {
    return {
      title: "Verified",
      color: "success",
    }
  } else {
    return {
      title: "Verify",
      color: "default",
    }
  }
})

const becomeCustomer = (details => {
  customerDetails.value = details
  vendorId.value = details.id
  supplierId.value = details.supplier_id
  vendorId.value = details.id
  supplierId.value = details.supplier_id
  customerId.value = details.customer_id
  isViewProductsDialogue.value = true

  // axios_lite.post(`v1/create_new_customer`, {
  //   params:{
  //     customer: details,
  //     vendor_id: details.supplier_id,
  //     supplier_id: details.id,
  //     customer_id: details.customer_id,
  //   }
  // })  
  // .then((res) => {
  //   if (res.data.status == false) {
  //     uiStore.setSnackBar(true, 'error', res.data.message)
  //   }
  //   if (res.data.status === true) {
  //     uiStore.setSnackBar(true, 'success', res.data.message)
  //     uiStore.getSuppliers();
  //     isViewProductsDialogue.value = false
  //   }   
  // })
})

const doLike = (item => {
  item.like = !item.like
})

const refNewVerifyForm = ref()

// const onVerifyCodeSubmit = (details) => {
//   verifyCode();
// };
function verifyCustomer(details) {
  customerDetails.value = details
  vendorId.value = details.supplier_id
  supplierId.value = details.id
  customerId.value = details.customer_id
  isViewProductsDialogue.value = true
}

const supplierUrl = (id => {
  return `/apps/suppliers/${id}`
})

// Initialize filteredOrders with userData
const filteredOrders = ref(JSON.parse(localStorage.getItem('userData')))

console.log(filteredOrders)


// Define requiredValidator rule
const requiredValidator = value => !!value || 'Field is required'

// Handle form submission
const onVerifyCodeSubmit = () => {
  // Post the filteredOrders to the server
  axios_lite.post(`v1/create_new_customer`, {
    params: {
      vendor_id: supplierId.value,
      supplier_id: vendorId.value,
      full_name: filteredOrders.value.full_name,
      phone: filteredOrders.value.phone,
      email: filteredOrders.value.email,
      address: filteredOrders.value.address,
    },
  })
    .then(res => {
      if (res.data.status === false) {
        uiStore.setSnackBar(true, 'error', res.data.message)
      }
      if (res.data.status === true) {
        uiStore.setSnackBar(true, 'success', res.data.message)
        uiStore.getSuppliers()
        isViewProductsDialogue.value = false
      }
    })
}
</script>

<template>
  <div>
    <VDialog
      v-model="isViewProductsDialogue"
      max-width="600"
    >
      <VCard>
        <div class="pa-6 d-flex align-center">
          <h5 class="text-h5">
            Become Customer
          </h5>
          <VSpacer />
          <VBtn
            variant="tonal"
            class="rounded"
            size="32"
            @click="isViewProductsDialogue = false"
          >
            <VIcon
              size="18"
              icon="tabler-x"
            />
          </VBtn>
        </div>
        <VCardText>
          <VDivider />
          <VForm
            ref="refNewVerifyForm"
            @submit.prevent="onVerifyCodeSubmit"
          >
            <VCardText>
              <VRow>
                <VCol
                  cols="12"
                  md="12"
                >
                  <VTextField
                    v-model="filteredOrders.full_name"
                    label="Name"
                    :rules="[requiredValidator]"
                    type="text"
                  />
                </VCol>
                <VCol
                  cols="12"
                  md="12"
                >
                  <VTextField
                    v-model="filteredOrders.phone"
                    label="Phone"
                    :rules="[requiredValidator]"
                    type="text"
                  />
                </VCol>
                <VCol
                  cols="12"
                  md="12"
                >
                  <VTextField
                    v-model="filteredOrders.email"
                    label="Email"
                    :rules="[requiredValidator]"
                    type="text"
                  />
                </VCol>
                <VCol
                  cols="12"
                  md="12"
                >
                  <VTextField
                    v-model="filteredOrders.address"
                    label="Address"
                    :rules="[requiredValidator]"
                    type="text"
                  />
                </VCol>
              </VRow>
            </VCardText>

            <VCardText class="d-flex justify-end flex-wrap gap-3">
              <div>
                <VBtn
                  variant="tonal"
                  color="secondary"
                  class="mx-1"
                  @click="isDialogVisible = false"
                >
                  Close
                </VBtn>
                <VBtn type="submit">
                  Submit
                </VBtn>
              </div>
            </VCardText>
          </VForm>
        </VCardText>
      </VCard>
    </VDialog>
    <VRow>
      <VCol cols="12">
        <VCard title="SUPPLIERS LIST">
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
                  { value: 0, title: 'All Suppliers' },
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
              <div style="width: 20rem;">
                <VTextField
                  v-model="searchQuery"
                  icon="tabler-search"
                  placeholder="Search Supplier"
                  density="compact"
                  @change="search()"
                >
                  <template #prepend-inner>
                    <VIcon
                      icon="tabler-search"
                      size="23"
                    />
                  </template>
                </VTextField>
              </div>
            </div>
          </VCardText>
          <VCardText>
            <VRow>
              <VCol v-for="item in items"
                    cols="12" sm="6" md="6" lg="4" xl="3">
                <VCard class="py-5">
                  <VCardText class="d-flex flex-column  justify-center ">
                    <VRow>
                      <VCol>
                        <VImg
                          class="mt-4 text-center"
                          :src="item.logo" />
                      </VCol>
                      <VCol>
                        <div class="d-flex justify-end gap-2">
                          <VIcon
                            size="22"
                            icon="tabler-heart"
                            variant="elevated"
                            :color.sync="item.favourite ? 'error' : ''"
                            @click="() => doLike(item)"
                          />
                        </div>
                      </VCol>
                    </VRow>
                    <div class="d-flex justify-end gap-2">
                      <VBtn
                        v-if="item.exists == 0"
                        size="x-small"
                        @click="becomeCustomer(item)"
                        color="success"
                      >
                        Become Customer
                      </VBtn>
                      <VBtn
                        v-if="item.verified == 0 && item.exists == 1"
                        size="x-small"
                        color="secondary"
                      >
                        Pending Approval {{ item.tracking_no }}
                      </VBtn>
                      <VBtn
                        v-if="item.verified == 1"
                        size="x-small"
                        color="primary"
                        :to="supplierUrl(item.auth_id)"
                      >
                        Visit
                      </VBtn>
                    </div>
                  </VCardText>
                  <VCardText class="d-flex flex-column  justify-center ">
                    <h4 class="">
                      {{ item.name }}
                    </h4>
                    <span class="text-xs mt-1">{{ item.description }}</span>
                    <h5 class="mt-2"><span>Categories</span> : <span>{{ item.cartegories.map(item => item.name).join(', ') }}</span></h5>
                    <VDivider class="mt-2"></VDivider>
                  </VCardText>
                  <VCardText>
                    <VRow>
                      <VCol cols="4" v-for="category in item.top_products">
                        <img class="rounded shadow" :src="category.image" width="90" height="70">
                      </VCol>
                    </VRow>
                  </VCardText>
                  <VCardText>
                    <VBtn
                        color="primary"
                        variant="tonal"
                        :to="`/apps/suppliers/${item.auth_id}`"
                    >
                      View Supplier
                    </VBtn>
                  </VCardText>
                </VCard>
              </VCol>
            </VRow>
          </VCardText>
        </VCard>
      </VCol>
    </VRow>
  </div>
</template>

<style scoped>
.cart-item-image {
  block-size: auto;
  inline-size: 100%;
  max-inline-size: 90px;

  /* Set the desired maximum width for the product image */
}
</style>
