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
        lg="8"
        sm="12"        
        relative
      >
        <div class="d-flex justify-space-between mt-3 ml-3 mr-3 mb-1">
          <h4>Delivery Address</h4>
          <div>
            <VIcon
              size="22"
              icon="tabler-pencil"
            />Change
          </div>
        </div>
        <VCard class="ml-2 mr-2" image="https://openmaptiles.org/img/home-banner-map.png" variant="outlined">
          <VRow>
            <VCol cols="2">
              <VBtn color="primary" size="x-small" class="mt-2 ml-2">Default</VBtn>
            </VCol>
            <VCol cols="7">
              <h4 class="text-bold mt-2">Ali Mousavi</h4>
              <p>Villa3, Villa3, Al Rashdiya, Dubai</p>
            </VCol>
            <VCol cols="3">
              <h5 class="mt-2">Phone</h5>
              <span class="text-sm">+9715055140401</span>
              <h5>Email</h5>
              <span class="text-sm">alimousawig@gmail.com</span>
            </VCol>
          </VRow>
        </VCard>

        <div class="d-flex justify-space-between mt-5 ml-3 mr-3 mb-1">
          <h4>Book Delivery Slot</h4>
        </div>
        <VCard class="ml-2 mr-2" variant="outlined">
          <VRow>
            <VCol cols="12" class="d-flex">
              <VCard class="ml-3 mt-3 pt-1 pb-1 pl-4 pr-4" color="success">
                <div class="text-center text-sm">09, Apr 24</div>
                <div class="text-center text-xs mt-1">Tomorrow</div>
              </VCard>
              <VCard class="ml-3 mt-3 pt-1 pb-1 pl-4 pr-4">
                <div class="text-center text-sm">10, Apr 24</div>
                <div class="text-center text-xs mt-1">Wendsday</div>
              </VCard>
              <VCard class="ml-3 mt-3 pt-1 pb-1 pl-4 pr-4">
                <div class="text-center text-sm">11, Apr 24</div>
                <div class="text-center text-xs mt-1">Thursday</div>
              </VCard>
              <VCard class="ml-3 mt-3 pt-1 pb-1 pl-4 pr-4">
                <div class="text-center text-sm">12, Apr 24</div>
                <div class="text-center text-xs mt-1">Friday</div>
              </VCard>
              <VCard class="ml-3 mt-3 pt-1 pb-1 pl-4 pr-4">
                <div class="text-center text-sm">13, Apr 24</div>
                <div class="text-center text-xs mt-1">Saturday</div>
              </VCard>
            </VCol>
          </VRow>
          <VRow style="background-color: #def8e3;">
            <VCol cols="12" class="d-flex">
              <VCard class="ml-3 mb-2 pt-1 pb-1 pl-4 pr-4" color="warning">
                <div class="text-center text-xs">Breakfast Slot</div>
                <div class="text-center text-xs mt-1">6:00 AM - 10:00 AM</div>
              </VCard>
              <VCard class="ml-3 mb-2 pt-1 pb-1 pl-4 pr-4 d-flex align-center" variant="outlined" color="success">
                <div class="text-center text-xs mt-1">9:00 AM - 1:00 PM</div>
              </VCard>
              <VCard class="ml-3 mb-2 pt-1 pb-1 pl-4 pr-4 d-flex align-center" variant="outlined" color="success">
                <div class="text-center text-xs mt-1">2:00 PM - 6:00 PM</div>
              </VCard>
              <VCard class="ml-3 mb-2 pt-1 pb-1 pl-4 pr-4 d-flex align-center" variant="outlined" color="success">
                <div class="text-center text-xs mt-1">6:00 AM - 10:00 PM</div>
              </VCard>
            </VCol>
          </VRow>
        </VCard>
        <VCard class="ml-2 mr-2 mt-5" variant="outlined" color="warning">
          <div class="d-flex mt-2 ml-2 text-success">
            <VIcon
              size="22"
              icon="tabler-info-circle"
            />
            <span class="text-sm ml-1">Coins can be redeemed up to maxium 25% of the order value</span>
          </div>
          <div class="d-flex justify-end mt-2 mb-2 mr-2">
            <VIcon
              size="15"
              icon="tabler-info-circle"
            />
            <span class="text-xs ml-1">Fresh Coins available</span>
          </div>
        </VCard>
        <div class="d-flex mt-5">
          <VCard class="ml-2 mr-2 pl-3 pt-2 pb-2 pr-2" variant="outlined" color="success">
            <div class="d-flex">
              <span>Before Delivery</span>
            </div>
            <div class="d-flex justify-end">
              <VIcon icon="tabler-phone" size="22" />
            </div>
          </VCard>
          <VCard class="ml-2 mr-2 pl-3 pt-2 pb-2 pr-2" variant="outlined" color="success">
            <div class="d-flex">
              <span>Return Baraket boxes</span>
            </div>
            <div class="d-flex justify-end">
              <VIcon icon="tabler-devices" size="22" />
            </div>
          </VCard>
          <VCard class="ml-2 mr-2 pl-3 pt-2 pb-2 pr-2" variant="outlined" color="success">
            <div class="d-flex">
              <span>Leave at the door</span>
            </div>
            <div class="d-flex justify-end">
              <VIcon icon="tabler-door" size="22" />
            </div>
          </VCard>
        </div>
        <div class="d-flex mt-5 text-error">
          <VIcon
            size="22"
            icon="tabler-info-circle"
            class="ml-2"
          />
          <span class="text-sm ml-1">Did you know? Our delivery expert earns 0.5 AED for every box you return.</span>
        </div>
        <div class="d-flex mt-5">
          <VCheckbox class="ml-3" label="Delivery Instructions / Gift message"></VCheckbox>
        </div>
        <div class="d-flex justify-space-between mt-5 ml-3 mr-3 mb-1">
          <h4>PAYMENT</h4>
        </div>
        <VCard class="ml-2 mr-2" variant="outlined">
          <VRow>
            <VCol cols="12" class="d-flex justify-space-between pl-5 pr-5 pt-5">
              <VRadio label="Pay with Credit/Debit Card" />
              <VIcon
                size="22"
                icon="tabler-credit-card"
                class="ml-2"
              />
            </VCol>
            <VCol cols="12" class="pl-5 pr-5">
              <VTextField
                icon="tabler-credit-card"
                placeholder="Card Number"
                density="compact"
                @change="search()"
              >
                <template #prepend-inner>
                  <VIcon
                    icon="tabler-credit-card"
                    size="23"
                  />
                </template>
                <template #append-inner>
                  <span class="text-xs">MM/YY CVV</span>
                </template>
              </VTextField>
              <div class="d-flex mt-2">
                <VCheckbox class="ml-3" label="Remember this card" color="success" />
              </div>
              <div class="d-flex ml-3">
                <h6>Baraket will security store this card for faster payment experience. Your CVV number will not be stored.</h6>
              </div>
            </VCol>
            <VCol cols="12" class="pl-5 pr-5 pb-3 d-flex justify-end text-success" style="background-color: #def8e3;">
              <span class="text-sm mb-3">Saved Cards</span>
            </VCol>
          </VRow>
        </VCard>
      </VCol>
      <VCol
        cols="12"
        lg="4"
        sm="12"        
        relative
        class="mb-5"
      >
        <div class="d-flex justify-space-between mt-3 ml-3 mr-3 mb-1">
          <h4>Your ITEMS({{ cart_products.length || 0 }})</h4>
          <div>Edit</div>
        </div>
        <VCard class="ml-2 mr-2" color="#eefbf1">
          <VCard>
            <VCardText v-for="product in cart_products" class="mobile-view mobile-card">
              <VRow class="mb-2 pt-3 pb-3">
                <VCol cols="2" class="mobile-view">
                  <VBtn variant="tonal" size="xx-small" color="success">x{{ product.cart }}</VBtn>
                  <VImg
                    :src="product.image"
                  />
                </VCol>
                <VCol cols="10">
                  <VCardText class="mobile-view">
                    <h4>{{ product.name }}</h4>
                    <h5 class="text-error mt-2">AED {{ product.price }}</h5>
                  </VCardText>
                </VCol>
              </VRow>
              <VDivider />
            </VCardText>
          </VCard>
        </VCard>

        <VCard class="d-flex justify-space-between mt-5 ml-2 mr-2 pl-3 pr-3 pt-3 pb-3" color="#f4f3f3">
            <div class="d-flex">
              <VIcon size="22" icon="tabler-settings" />
              <h5 class="ml-1">Enter discount code</h5>
            </div>
            <h5 class="text-success float-right text-right">View all</h5>
        </VCard>

        <VCard class="d-flex justify-space-between mt-5 ml-2 mr-2 pl-3 pr-3 pt-3 pb-5" color="#94b014">
            <div class="pt-1 pb-1" >
              <h5> Unlock VIP membership!</h5>
              <h6> Please 3 orders each above 100 to upgrade to VIP membership</h6>
            </div>
            <div class="pt-1 pb-1 text-center">
              <h5> 0/3</h5>
              <h6> Orders</h6>
            </div>
        </VCard>


        <div class="d-flex justify-space-between mt-5 ml-3 mr-3 mb-1">
          <h4>SUMMARY</h4>
        </div>
        <VCard class="ml-2 mr-2 pl-5 pr-5">
          <div class="d-flex justify-space-between mt-3 mb-3 text-sm">
            <span>Subtotal</span>
            <span>AED {{ total }}</span>
          </div>
          <div class="d-flex justify-space-between mt-3 mb-3 text-error text-xs">
            <span>You Earn</span>
            <span>5 FreshCoins</span>
          </div>
          <div class="d-flex justify-space-between mt-3 mb-3 text-sm">
            <span>Delivery Charges</span>
            <span>AED 0</span>
          </div>
          <div class="d-flex justify-space-between mt-3 mb-3 text-sm">
            <span>Service Fee, Express Delivery Fee</span>
            <span>AED 0</span>
          </div>
          <VDivider />
          <div class="d-flex justify-space-between mt-3 mb-3">
            <div>
              <h4>Grand Total</h4>
              <span class="text-xs">(Inclusive all VAT)</span>
            </div>
            <h4>AED {{ total + Math.round(total * 0.02 * 100) / 100 }}</h4>
          </div>
          <div class="d-flex justify-space-between mt-3 mb-3">
            <span class="text-sm">Tax</span>
            <span class="text-sm">AED {{ Math.round(total * 0.02 * 100) / 100 }}</span>
          </div>
        </VCard>
        <VCard class="mt-5 ml-2 mr-2">
          <VBtn class="w-100" color="success">
            Pay
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

</style>
