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
        lg="4"
        sm="6"
        xs="12"      
        relative
        class="mb-5"
      >
        <div class="d-flex justify-space-between mt-3 ml-3 mr-3 mb-1">
          <VImg src="https://eta.ironrocksoftware.com/images/temp/1.jpg"  />
        </div>
        <div class="d-flex justify-center mt-3 ml-3 mr-3 mb-1">
          <h3 class="text-center">Thank you</h3>
        </div>
        <div class="d-flex ml-3 mr-3 mb-1">
          <span class="text-center">We have received your order. We will send an update with tracking details when we ship your items.</span>
        </div>
        <div class="d-flex justify-center mt-5 ml-3 mr-3 mb-1">
          <VBtn color="success" class="w-100" :to="'/'">Back Home</VBtn>
        </div>
      </VCol>
      <VCol
        cols="12"
        lg="4"
        sm="6"
        xs="12"
        relative
        class="mb-5"
      >
        <VCard class="ml-2 mr-2 pl-3 pr-3 pt-3 pb-3 mt-5" color="#def8e3">
          <div class="d-flex justify-space-between align-center">
            <div>
              <h5 class="ml-1">#3581316</h5>
              <h4 class="ml-1">AED {{ total }}</h4>
            </div>
            <VBtn color="success" size="small">Details</VBtn>
          </div>
        </VCard>
        <VCard class="ml-2 mr-2 pl-3 mt-5 pr-3 pt-3 pb-3" color="#f4f3f3">
          <div class="d-flex justify-space-between align-center">
            <div>
              <span class="ml-1 text-xs">Delivery Timeslot</span>
              <h6 class="ml-1">2024-04-08</h6>
              <h6 class="ml-1">Express Delivery - 90 mins</h6>
            </div>
            <VBtn color="success" size="small">Details</VBtn>
          </div>
        </VCard>
        <div class="d-flex justify-space-between mt-5 pt-5 ml-3 mr-3 mb-1">
          <span class="text-sm">Your Items</span>
          <h5>{{cart_products.length || 0 }}</h5>
        </div>
        <VDivider />
        <div class="d-flex justify-space-between mt-5 pt-5 ml-3 mr-3 mb-1">
          <span class="text-sm">Payment</span>
          <h5>Pay with Credit/Debit Card</h5>
        </div>
        <VDivider />
        <div class="d-flex justify-space-between mt-5 pt-5 ml-3 mr-3 mb-1">
          <span class="text-sm">Email</span>
          <h5>alimousawi@gmail.com</h5>
        </div>
        <VDivider />
        <div class="d-flex justify-space-between mt-5 pt-5 ml-3 mr-3 mb-1">
          <span class="text-sm">Mobile</span>
          <h5>+971505140401</h5>
        </div>
      </VCol>
      <VCol
        cols="12"
        lg="4"
        sm="12"        
        relative
        class="mb-5"
      >
        <VCard class="mr-2 pl-3 pr-3 pt-3 pb-3 mt-5" color="#def8e3">
          <div class="d-flex justify-space-between align-center">
            <div>
              <h5>Refer & Earn</h5>
              <h5>Give AED 25, Get AED 25</h5>
              <span class="text-xs">Invite your friends to Barakat and you both can earn 250 FreshCoins</span>
            </div>
            <div>
            </div>
          </div>
          <div class="d-flex justify-center align-center mt-5 pt-5">
              <h4>Your Referral Code:</h4>
          </div>
          <div class="d-flex justify-center align-center">
            <div class="d-flex justify-space-between border-success-dash pl-2 pr-2 pt-2 pb-2">
              <h4>XjhZ2f0G</h4>
              <div class="ml-5">
                <VIcon size="30" color="success" icon="tabler-copy"></VIcon>
                <span class="text-success">Copy</span>
              </div>
            </div>
          </div>

          <div class="mt-5 pt-5">
            <h4>How does it work?</h4>
            <span class="text-xs">- Invite your friends to join Barakat and they get AED 25 off on their 1st oder + 250 FreshCoins (AED 25) on becoming VIP member.</span><br>
            <span class="text-xs">- You also earn 250 FreshCoins (AED 25) once your friend complets 1st order.</span>
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
.border-success-dash {
  border-style: dashed;
  border-color:green;
  border-width: 1px;
}

</style>
