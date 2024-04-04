<script setup>
import { useDemoVendorStore } from '@/store/demoVendorStore';
import { useUiStore } from '@/store/uiStore';
import { onBeforeMount } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { PerfectScrollbar } from 'vue3-perfect-scrollbar';
const demoVendorStore = useDemoVendorStore();

const uiStore = useUiStore()
const route = useRoute()
const router = useRouter()
const supplier_id = route.params.supplier


onBeforeMount(() => {
  const sPageRefreshed = performance.navigation.type === 1
  if (sPageRefreshed) {
    // Fetch data only when the page is refreshed
    uiStore.getSuppliers()
  }
})



// get the id of the selected supplier
const supplierAxiosMapping = (id => {
  switch (id) {
  case 1: return axios_koch
    break
  default: return null
    break
  }
})

const axiosInstance = supplierAxiosMapping[supplier_id]

const getProductList = () => {
  if (localStorage.getItem("customer_id")) {
    axiosInstance ? axiosInstance.get(('v1/get_customer_price'), {
      params: {
        customer_id: localStorage.getItem("customer_id"),
      },
    },
    ).then(response => {
      demoVendorStore.$state.products = response.data.product_lists
    }) : null
  }
}
const userData = JSON.parse(localStorage.getItem("userData"));
const business_id = userData.business.id

demoVendorStore.fetchProducts(business_id, supplier_id)
getProductList()
const products = computed(() => demoVendorStore.$state.products)
const suppliers = computed(() => uiStore.$state.suppliers)

const currentSupplier = computed(() => {
  return suppliers.value.find((item) => item.auth_id == supplier_id) || {}
})

const categories = computed(() => products.value.map((item) => item.category).filter((value, index, array) => array.indexOf(value) === index))

const open = ref(['Users', 'Admin'])

const orders = [
  ['New Order', 'tabler-plus'],
  ['Order List', 'tabler-list', ''],
]

const accounts = [
  ['Settings', 'tabler-settings'],
  ['securiry', 'tabler-shield'],
]

const admins = [
  ['New Order', 'tabler-plus'],
  ['Order List', 'tabler-list'],
]

const payments = [
  ['New Payment', 'tabler-plus'],
  ['Payment List', 'tabler-list'],
]

const navigateTab = (() => {
  router.push({ name: 'checkout' })
})

function calc_stock(product) {
  const stock = JSON.parse(product.stock) || []
  let sum = 0;
  stock.forEach((item) => {
    sum += item.weight * item.qty
  })
  return sum ? sum + product.unit_name : 'Out of Stock'
}
</script>

<template>
  <VRow>
    <VCol
      cols="12"
      relative
      sm="4"
      md="3"
      lg="3"
      class="d-none"
    >
      <h3 v-if="currentSupplier.name">
        <RouterLink
          to="/apps/suppliers"
          class="supplier-link"
        >
          Supplier list >>
        </RouterLink>
        {{ currentSupplier.name }}
      </h3>
      <h3
        v-else
        color="error"
      >
        You are not verified for the supplier you selected
      </h3>

      <VList
        v-model:opened="open"
        style="height: 100%;"
      >
        <VListItem
          prepend-icon="tabler-home"
          title="Supplier Dashboard"
          :to="`/apps/suppliers/${supplier_id}/dashboard`"
          value="supplier_id"
        />
        <VListGroup value="Orders">
          <template #activator="{ props }">
            <VListItem
              v-bind="props"
              prepend-icon="tabler-users"
              title="My Orders"
            />
          </template>

          <VListItem
            value="New Order"
            title="new Order"
            :to="`/apps/suppliers/${supplier_id}/products`"
            prepend-icon="tabler-plus"
          />

          <VListItem
            value="Order List"
            title="Order List"
            :to="`/apps/suppliers/${supplier_id}/order_list`"
            prepend-icon="tabler-list"
          />
        </VListGroup>
        <VListGroup value="Tickets">
          <template #activator="{ props }">
            <VListItem
              v-bind="props"
              prepend-icon="tabler-users"
              title="My Tickets"
            />
          </template>

          <VListItem
            value="New Ticket"
            title="New Ticket"
            :to="`/apps/suppliers/${supplier_id}/ticket/create_ticket`"
            prepend-icon="tabler-plus"
          />


          <VListItem
            value="Ticket List"
            title="Ticket List"
            :to="`/apps/suppliers/${supplier_id}/ticket/tickets`"
            prepend-icon="tabler-list"
          />
        </VListGroup>



        <VListGroup value="payments">
          <template #activator="{ props }">
            <VListItem
              v-bind="props"
              prepend-icon="tabler-users"
              title="My Payments"
            />
          </template>

          <VListItem
            v-for="([title, icon], i) in payments"
            :key="i"
            :value="title"
            :title="title"
            :prepend-icon="icon"
          />
        </VListGroup>
      </VList>
    </VCol>
    <VCol
      cols="12"
      relative
    >
      <VCard class="header">
        <VRow>
          <VCol
            cols="2"
            md="3"
          >
            <VImg
              class="mt-4 text-center"
              :src="currentSupplier.logo" />
          </VCol>
          <VCol
            cols="10"
            md="9"
          >
            <span>Supplier Name</span>
            <h2>{{ currentSupplier.name || 'You are not verified for the supplier you selected' }}</h2>
            <p class="mt-2">{{ currentSupplier.description }}</p>
          </VCol>
        </VRow>
      </VCard>
      <VCard
        v-for="category in categories"
        :title="category"
        class="mt-5"
      >
        <PerfectScrollbar :options="{ wheelPropagation: false, suppressScrollY: true }">
          <VCardText style="overflow-x: auto;">
            <div style="width: max-content;">
              <template v-for="product in products">
                <VCard
                  class="mr-3"
                  v-if="product.category === category"
                  style="float: left; width: 220px;"
                >
                  <div class="d-flex pr-2">
                    <div class="text-xs text-white" style="background-color: #f76726; border-radius: 4px;">&nbsp; Random Special &nbsp;</div>
                  </div>
                  <div class="d-flex justify-end pr-2" style="margin-top: -16px">
                    <div class="text-xs text-white" style="background-color: #d8345f;">&nbsp; {{ Math.round(100 - 100 * product.price / (product.packing_price || product.price + 2)) }}% Off &nbsp;</div>
                  </div>
                  <RouterLink :to="`/apps/suppliers/${supplier_id}/product/${product.id}`">
                    <VImg
                      class="mt-4 text-center"
                      :src="product.image"
                    />
                  </RouterLink>
                  <div class="d-flex justify-end pr-1 mt-1" >
                    <div class="border">
                      <VBtn
                        color="success"
                        size="x-small"
                        class="text-high-emphasis ms-n1 mr-3"
                        style="width: 20px; height: 30px;"
                        :disabled="!product.cart"
                        @click="product.cart--"
                      >
                        <VIcon
                          size="22"
                          icon="tabler-minus"
                        />
                      </VBtn>
                      <span class="mr-4 mt-1">{{product.cart || 0}}</span>
                      <VBtn
                        color="success"
                        size="x-small"
                        class="text-high-emphasis ms-n1"
                        style="width: 20px; height: 30px;"
                        @click="product.cart = (product.cart || 0) + 1"
                      >
                        <VIcon
                          size="22"
                          icon="tabler-plus"
                        />
                      </VBtn>
                    </div>
                  </div>
                  <VCardText style="height: 80px;">
                    <h4 class="text-center">{{ product.name }}</h4>
                  </VCardText>
                  <VCardText class="d-none">
                    <span class="text-sm">Sold by:
                      <img
                        :title="currentSupplier.name"
                        width="40"
                        class="mt-4 text-center"
                        :src="currentSupplier.logo">
                    </span>
                  </VCardText>
                  <VCardText>
                    <h6 class="text-center" style="text-decoration: line-through">
                      AED {{ product.packing_price || product.price + 2 }}
                    </h6>
                    <h5 class="text-error text-center">AED {{ product.price }}</h5>
                  </VCardText>
                  <VCardText class="d-flex">
                    <div class="pt-1 pb-1 w-100 text-center" style="background-color: #def8e3; border-radius: 5px;">
                      <h6>{{ calc_stock(product) }}</h6>
                    </div>
                  </VCardText>
                </VCard>
              </template>
            </div>
          </VCardText>
        </PerfectScrollbar>
      </VCard>
    </VCol>
  </VRow>
</template>

<style>
.supplier-link {
  display: inline-block;

  /* Ensure link and heading are on the same line */
  color: blue;

  /* Customize the link color */
  margin-block-end: 10px;

  /* Adjust spacing as needed */
}

.header {
  padding: 20px;
  text-align: start;
}

.welcome-container {
  padding: 20px;
  background-color: white;
  box-shadow: 0 0 10px rgba(0, 0, 0, 10%);
  margin-block: 40px;
  margin-inline: auto;
  max-inline-size: 800px;
}
</style>
