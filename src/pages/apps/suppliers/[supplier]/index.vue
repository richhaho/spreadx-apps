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
  // const stock = JSON.parse(product.stock) || []
  // let sum = 0;
  // stock.forEach((item) => {
  //   sum += item.weight * item.qty
  // })
  // return sum ? sum + product.unit_name : 'Out of Stock'
  return product.stock_availability ? product.stock_availability + product.unit_name : 'Out of Stock'
}
function update_cart(product) {
  const products = JSON.parse(localStorage.getItem('cart') || '[]')
  const index = products.findIndex((item) => item.id === product.id)
  if (index < 0) {
    products.push(product)
  } else if (!product.cart) {
    products.splice(index, 1)
  } else {
    products.splice(index, 1, product)
  }
  localStorage.setItem('cart', JSON.stringify(products))
  uiStore.$state.cartItems = products
}
</script>

<template>
  <VRow>
    <VCol
      cols="12"
      relative
      v-if="currentSupplier.name"
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
            <h2>{{ currentSupplier.name}}</h2>
            <p class="mt-2">{{ currentSupplier.description }}</p>
          </VCol>
        </VRow>
      </VCard>
      <VCard class="mt-1" v-if="currentSupplier.banners && currentSupplier.banners.length" height="400">
        <VCarousel>
          <VCarouselItem :cover="false" v-for="banner in currentSupplier.banners" :src="banner.image"></VCarouselItem>
        </VCarousel>
      </VCard>
      <VRow class="mt-3" v-if="userData.verify_at">
        <VCol cols="12" sm="3">
          <VCard color="success" class="pt-3 pl-3 pr-3 pb-3" :to="`/apps/suppliers/${supplier_id}/customer/orders`">
            <div class="d-flex justify-space-between">
              <div>
                <h5 class="text-white">My</h5>
                <h5 class="text-white">Orders</h5>
              </div>
              <VIcon icon="tabler-refresh" size="40" />
            </div>
          </VCard>
        </VCol>
        <VCol cols="12" sm="2">
          <VCard color="error" class="pt-3 pl-3 pr-3 pb-3">
            <div class="d-flex justify-space-between">
              <div>
                <h5 class="text-white">Buy it</h5>
                <h5 class="text-white">Again</h5>
              </div>
              <VIcon icon="tabler-heart" size="40" />
            </div>
          </VCard>
        </VCol>
        <VCol cols="12" sm="3">
          <VCard color="warning" class="pt-3 pl-3 pr-3 pb-3">
            <div class="d-flex justify-space-between">
              <div>
                <h5 class="text-white">Refer a</h5>
                <h5 class="text-white">Friend</h5>
              </div>
              <VIcon icon="tabler-users" size="40" />
            </div>
          </VCard>
        </VCol>
        <VCol cols="12" sm="4">
          <VCard color="info" class="pt-3 pl-3 pr-3 pb-3">
            <div class="d-flex justify-space-between">
              <VIcon icon="tabler-crown" size="40" />
              <div>
                <h5 class="text-white">You are a Pro member</h5>
                <h5 class="text-white">AED 0.3 (3 FreshCoins)</h5>
              </div>
              <div>
                <h5 class="text-white">0/3</h5>
                <h6 class="text-white">Orders</h6>
              </div>
            </div>
          </VCard>
        </VCol>
      </VRow>
      <VCard
        v-for="category in categories"
        :title="JSON.parse(category).name"
        class="mt-5"
      >
        <VImg :src="JSON.parse(category).image" height="100" class="mb-2 w-100"/>
        <div class="d-flex justify-end mr-3 mb-2">
          <RouterLink :to="`/apps/categories/all`">
            Show All
          </RouterLink>
        </div>
        <PerfectScrollbar :options="{ wheelPropagation: false, suppressScrollY: true }">
            <div style="width: max-content;" class="pl-3">
              <template v-for="product in products">
                <VCard
                  class="mb-5 mr-3 product-item"
                  v-if="product.category === category"
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
                        v-if="product.cart"
                        @click="() => { product.cart--; update_cart(product) }"
                      >
                        <VIcon
                          size="22"
                          icon="tabler-minus"
                        />
                      </VBtn>
                      <span v-if="product.cart" class="mr-4 mt-1">{{product.cart}}</span>
                      <VBtn
                        color="success"
                        size="x-small"
                        class="text-high-emphasis ms-n1"
                        style="width: 20px; height: 30px;"
                        @click="() => { product.cart = (product.cart || 0) + 1; update_cart(product) }"
                      >
                        <VIcon
                          size="22"
                          icon="tabler-plus"
                        />
                      </VBtn>
                    </div>
                  </div>
                  <VCardText class="product-name">
                    <h5 class="text-center">{{ product.name }}</h5>
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
                    <h6 class="text-error text-center">AED {{ product.price }}</h6>
                  </VCardText>
                  <VCardText class="d-flex">
                    <div class="pt-1 pb-1 w-100 text-center" style="background-color: #def8e3; border-radius: 5px;">
                      <h6>{{ calc_stock(product) }}</h6>
                    </div>
                  </VCardText>
                </VCard>
              </template>
            </div>
        </PerfectScrollbar>
      </VCard>
    </VCol>
    <VCol
      cols="12"
      relative
      v-else
    >
      <VCard class="header">
        <h2 class="mt-3 mb-3 ml-3">You are not verified for the supplier you selected</h2>
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

.product-item {
  float: left;
  width: 220px;
}
.carousel-item {
  height: 200px;
}
.product-name {
  height: 80px;
}
@media only screen and (max-width: 600px) {
  .product-item {
    width: 120px;
  }
  .product-name {
    height: 120px; line-height: 90% !important;
  }
}

</style>
