<script setup>
import { useUiStore } from '@/store/uiStore';
const uiStore = useUiStore()

const cart_products = computed(() => uiStore.$state.cartItems)
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

function removeFromCart(product) {
  const products = JSON.parse(localStorage.getItem('cart') || '[]')
  const index = products.findIndex((item) => item.id === product.id)
  if (index < 0) {
    return
  } else {
    products.splice(index, 1)
  }
  localStorage.setItem('cart', JSON.stringify(products))
  uiStore.$state.cartItems = products
}

function get_total() {
  const products = uiStore.$state.cartItems
  let sum = 0;
  products.forEach((item) => {
    sum = sum + item.price * item.cart
  })
  return sum
}

const total = computed(() => get_total())

function calc_unit(product) {
  const stock = JSON.parse(product.stock) || []
  let sum;
  stock.forEach((item) => {
    sum = item.weight
  })
  return sum ? sum + product.unit_name : ''
}

const screen_width = window.innerWidth
</script>

<template>
  <VCard class="pt-3 pb-3">
    <VRow>
      <VCol
      cols="12"
      relative
      sm="4"
      md="3"
      lg="3"
    >
      <h3 class="ml-3">Home / Orders</h3>
      <VList
        v-model:opened="open"
        style="height: 100%;"
      >
        <VListItem
          prepend-icon="tabler-home"
          title="Dashboard"
          :to="`/apps/customer/dashboard`"
        />
        <VListItem
          prepend-icon="tabler-user"
          title="Profile"
          :to="`/apps/customer/profile`"
        />
        <VListItem
          prepend-icon="tabler-map"
          title="Addresses"
          :to="`/apps/customer/address`"
        />
        <VListItem
          prepend-icon="tabler-list"
          title="Orders"
          :to="`/apps/customer/orders`"
        />
        <VListItem
          prepend-icon="tabler-adjustments"
          title="Rewards"
          :to="`/apps/customer/rewards`"
        />
        <VListItem
          prepend-icon="tabler-credit-card"
          title="Payments"
          :to="`/apps/customer/payments`"
        />        
      </VList>
    </VCol>
      <VCol
        cols="12"
        relative
        sm="8"
        md="9"
        lg="9"
      >
        <div class="d-flex justify-space-between ml-3 mr-3 mb-1">
          <h4>Orders ({{ cart_products.length || 0 }})</h4>
        </div>
        <VCard v-for="a in 2" class=" mt-2 ml-2 mr-2 border">
          <div class="d-flex justify-space-between mt-2 ml-2 mr-3 mb-1">
            <h5 class="text-success">Order 3581316 (Qty: 6)</h5>
            <span class="text-xs">Placed On Apr 08, 2024</span>
          </div>
          <div class="d-flex justify-space-between mt-1 ml-2 mr-3 mb-1">
            <span class="text-xs">Charged amount: AED 39.8542</span>
            <span class="text-xs text-primary">Status: Confirmed</span>
          </div>
          <VDivider />
          <div class="d-flex justify-space-between mt-1 ml-2 mr-3 mb-5" style="overflow-x: scroll;">
            <div style="width: max-content;" class="pl-3">
              <VCard v-for="product in cart_products" class="mobile-view mobile-card ml-2" style="float: left; width: 250px; height: 100px;">
                <VRow class="mb-2 pt-3 pb-3">
                  <VCol cols="2" class="mobile-view">
                    <VBtn variant="tonal" size="xx-small" color="success">x{{ product.cart }}</VBtn>
                    <VImg
                      :src="product.image"
                    />
                  </VCol>
                  <VCol cols="10">
                    <div class="mobile-view product-name">
                      <h4>{{ product.name }}</h4>
                    </div>
                    <div class="d-flex justify-space-between">
                      <h5 class="text-error mt-2">AED {{ product.price }}</h5>
                      <VBtn color="success" size="x-small">90mins</VBtn>
                    </div>
                  </VCol>
                </VRow>
              </VCard>
            </div>
          </div>
          <div class="d-flex justify-end mt-1 ml-2 mr-3 mb-3">
            <VBtn color="success" variant="outlined" size="small">Reorder</VBtn>
            <VBtn color="success" size="small" class="ml-1" :to="`/apps/customer/orders/3581316`">Details</VBtn>
          </div>
        </VCard>
      </VCol>
    </VRow>
  </VCard>
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
.add_cart_btn {
  width: 20px; height: 30px;
}
@media only screen and (max-width: 600px) {
  
}
.mobile-view{
  padding: 0px !important;
  font-size: small !important
}
.mobile-card {
  padding-left: 14px !important;
  padding-right: 14px !important;
  margin-top: 14px !important
}
.product-name {
  height: 35px;
}
</style>
