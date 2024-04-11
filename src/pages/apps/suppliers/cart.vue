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
  <VCard
      title="Home / Cart"
      class="mt-3"
  >
    <VRow>
      <VCol
        cols="12"
        lg="8"
        sm="12"        
        relative
      >
        <VCardText>
          Your Items ({{ cart_products.length }})
        </VCardText>
        <VCard class="ml-2 mr-2">
          <VCardText class="mobile-view">
            <div class="d-flex justify-end">
              <VBtn color="warning" size="x-small">
                To Express
              </VBtn>
            </div>
            <div class="d-flex justify-space-between">
              <span class="text-warning text-bold mobile-view">Shipment</span>
              <span class="text-sm text-warning mobile-view">Express Delivery - 90 mins</span>
            </div>
            <div class="d-flex justify-space-between">
              <div>Total: AED {{ total }}</div>
              <span class="text-sm mobile-view">Delevery Fee: AED 6</span>
            </div>
          </VCardText>
          <VCard>
            <VCardText v-for="product in cart_products" class="mobile-view mobile-card">
              <VRow class="mb-2">
                <VCol cols="2" class="mobile-view">
                  <VImg
                    class="mt-4 text-center"
                    :src="product.image"
                  />
                </VCol>
                <VCol cols="6">
                  <VCardText class="mobile-view">
                    <h4>{{ product.name }}</h4>
                    <h5 class="text-error mt-2">AED {{ product.price }}</h5>
                  </VCardText>
                  <VCardText class="d-flex mobile-view">
                    <div class="pt-1 pb-1 pr-2 pl-2 text-center border" style="border-radius: 5px;">
                      <h6>UAE</h6>
                    </div>
                    <div class="ml-2 pt-1 pb-1 pr-2 pl-2 text-center border" style="background-color: #def8e3; border-radius: 5px;">
                      <h6>{{ calc_unit(product) }}</h6>
                    </div>
                  </VCardText>
                </VCol>
                <VCol cols="4" class="mobile-view">
                  <div v-if="screen_width > 420" class="d-flex justify-end pr-1 mt-1 mobile-view">
                    <div class="border">
                      <VBtn
                        color="default"
                        size="x-small"
                        class="text-high-emphasis ms-n1 mr-3 add_cart_btn"
                        :disabled="!product.cart"
                        @click="() => { product.cart--; update_cart(product) }"
                      >
                        <VIcon
                          size="22"
                          icon="tabler-minus"
                        />
                      </VBtn>
                      <span class="mr-4 mt-1">{{product.cart || 0}}</span>
                      <VBtn
                        color="default"
                        size="x-small"
                        class="text-high-emphasis ms-n1 add_cart_btn"
                        @click="() => { product.cart = (product.cart || 0) + 1; update_cart(product) }"
                      >
                        <VIcon
                          size="22"
                          icon="tabler-plus"
                        />
                      </VBtn>
                    </div>
                  </div>
                  <div v-else class="d-flex justify-end pr-1 mt-1 mobile-view">
                    <VSelect
                      :items="[0,1,2,3,4,5,6,7,8,9,10]"
                      v-model="product.cart"
                      @update="update_cart(product)"
                    />
                  </div>
                  <div class="d-flex justify-end pr-1 mt-1 mobile-view" >
                    <VBtn
                      color="default"
                      size="x-small"
                      class="text-high-emphasis ms-n1 mt-5"
                      style="width: 20px; height: 30px;"
                      @click="() => { removeFromCart(product) }"
                    >
                      <VIcon
                        size="22"
                        icon="tabler-trash"
                      />
                    </VBtn>
                  </div>
                </VCol>
              </VRow>
              <VDivider />
            </VCardText>
          </VCard>
        </VCard>
      </VCol>
      <VCol
        cols="12"
        lg="4"
        sm="12"        
        relative
        class="mb-5"
      >
        <VCardText>
          Summary
        </VCardText>
        <VCard class="ml-2 mr-2 pl-5 pr-5">
          <div class="d-flex justify-space-between mt-3 mb-3">
            <span>Subtotal</span>
            <span>AED {{ total }}</span>
          </div>
          <VDivider />
          <div class="d-flex justify-space-between mt-3 mb-3">
            <div>
              <h4>Grand Total</h4>
              <span class="text-xs">(Incl Tax)</span>
            </div>
            <h4>AED {{ total + Math.round(total * 0.02 * 100) / 100 }}</h4>
          </div>
          <div class="d-flex justify-space-between mt-3 mb-3">
            <span class="text-sm">Tax</span>
            <span class="text-sm">AED {{ Math.round(total * 0.02 * 100) / 100 }}</span>
          </div>
        </VCard>
        <VCard class="mt-5 ml-2 mr-2 pl-5 pr-5 pt-3 pb-5" style="background-color: #def8e3; border-radius: 5px;">
            <div class="pt-1 pb-1 text-center" >
              <h6> You've earned FREE shipping!</h6>
              <VProgressLinear
                color="success"
                model-value="100"
                height="8"
              />
            </div>
        </VCard>
        <VCard class="mt-5 ml-2 mr-2">
          <VBtn class="w-100" color="success" :to="'/apps/suppliers/checkout'">
            Processed
          </VBtn>
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
  .mobile-view{
    padding: 0px !important;
    font-size: x-small !important
  }
  .mobile-card {
    padding-left: 14px !important;
    padding-right: 14px !important;
    margin-top: 14px !important
  }
}

</style>
