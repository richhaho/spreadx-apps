<script setup>
import { useUiStore } from '@/store/uiStore';
import { useRoute, useRouter } from 'vue-router';
const route = useRoute()
const router = useRouter();
const uiStore = useUiStore()
const supplier_id = route.params.supplier
const userData = JSON.parse(localStorage.getItem("userData"));
const business_id = userData.business.id
const order = JSON.parse(localStorage.getItem("orderDetail"));
const cart_products = computed(() => uiStore.$state.cartItems)

function get_total() {
  const products = uiStore.$state.cartItems
  let sum = 0;
  products.forEach((item) => {
    sum = sum + item.price * item.cart
  })
  return sum
}

function reOrder(order) {
  const cart_products = []
  order.order_details.forEach(product => {
    cart_products.push({
      ...product,
      cart: product.qty,
      image: product.image,
      name: product.product_name,
      price: product.total_amount
    })
  })
  localStorage.setItem('cart', JSON.stringify(cart_products));
  console.log(cart_products)
  localStorage.setItem('supplier_id', supplier_id);
  setTimeout(() => { router.push('/apps/suppliers/checkout') }, 1000)
}
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
          :to="`/apps/suppliers/${supplier_id}/customer/dashboard`"
        />
        <VListItem
          prepend-icon="tabler-user"
          title="Profile"
          :to="`/apps/suppliers/${supplier_id}/customer/profile`"
        />
        <VListItem
          prepend-icon="tabler-map"
          title="Addresses"
          :to="`/apps/suppliers/${supplier_id}/customer/address`"
        />
        <VListItem
          prepend-icon="tabler-list"
          title="Orders"
          :to="`/apps/suppliers/${supplier_id}/customer/orders`"
        />
        <VListItem
          prepend-icon="tabler-adjustments"
          title="Rewards"
          :to="`/apps/suppliers/${supplier_id}/customer/rewards`"
        />
        <VListItem
          prepend-icon="tabler-credit-card"
          title="Payments"
          :to="`/apps/suppliers/${supplier_id}/customer/payments`"
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
          <div>
            <h4>Order# {{order.invoice_no}}</h4>
            <span class="text-sm">Placed On {{order.order_date}}</span>
          </div>
          <VBtn color="success" size="small" @click="reOrder(order)">Reorder</VBtn>
        </div>
        <div class="d-flex mt-5 ml-3 mr-3 mb-1">
          <h4>Order Status</h4>
        </div>
        <VCard class="ml-3 mr-3" variant="outlined">
          <div class="d-flex justify-space-between ml-3 mr-3 mt-3">
            <span class="text-xs">Delivery Slot</span>
            <span class="text-xs">status</span>
          </div>
          <div class="d-flex justify-space-between ml-3 mr-3 mb-1">
            <h5>{{ order.delivery_date }}</h5>
            <h5>{{ order.status }}</h5>
          </div>
            <VCardText>
            <VProgressLinear
              color="success"
              :model-value="order.status.toUpperCase() == 'COMPLETED' ? 100 : 50"
              height="6"
            />
          </VCardText>
        </VCard>
        <div class="d-flex mt-5 ml-3 mr-3 mb-1">
          <h4>Delivery Time</h4>
        </div>
        <VCard class="ml-3 mr-3 pt-3 pb-4" variant="outlined">
          <VRow>
            <VCol cols="12" sm="4">
              <div class="d-flex ml-3 mr-3 mt-3">
                <VIcon icon="tabler-calendar" size="30" color="success" />
                <div class="ml-3">
                  <h6 class="text-xs">Delivery Slot</h6>
                  <h5>{{ order.delivery_date }}</h5>
                </div>
              </div>
            </VCol>
            <VDivider vertical />
            <VCol cols="12" sm="8">
              <div class="d-flex ml-3 mr-3 mt-3">
                <VIcon icon="tabler-clock" size="30" color="success" />
                <div class="ml-3">
                  <h6 class="text-xs">Timeslot</h6>
                  <h5>90 mins</h5>
                </div>
              </div>
            </VCol>
          </VRow>
        </VCard>
        <div class="d-flex mt-5 ml-3 mr-3 mb-1">
          <h4>Delivery Instructions / Gift Message</h4>
        </div>
        <VCard class="ml-3 mr-3 pt-3 pb-3" variant="outlined">
          <div class="d-flex ml-3 mr-3 mobile-slot">
            <VRadio class="text-success ml-2" label="Call before delivery" />
            <VRadio class="text-success ml-2" label="Return Barakat boxes" />
            <VRadio class="text-success ml-2" label="Leave at the door" />
          </div>
        </VCard>
        <div class="d-flex mt-5 ml-3 mr-3 mb-1">
          <h4>Delivery Address</h4>
        </div>
        <VCard class="ml-2 mr-2" image="https://openmaptiles.org/img/home-banner-map.png" variant="outlined">
          <VRow class="ml-1">
            <VCol cols="12" sm="2">
              <VBtn color="primary" size="x-small" class="mt-2">Default</VBtn>
            </VCol>
            <VCol cols="12" sm="7">
              <h4 class="text-bold mt-2">{{ userData.full_name }}</h4>
              <p>{{ userData.address || 'Villa3, Villa3, Al Rashdiya, Dubai'}}</p>
            </VCol>
            <VCol cols="12" sm="3">
              <h5 class="mt-2">Phone</h5>
              <span class="text-sm">{{ userData.phone || '+9715055140401' }}</span>
              <h5>Email</h5>
              <span class="text-sm">{{ userData.email }}</span>
            </VCol>
          </VRow>
        </VCard>

        <VRow class="mt-5">
          <VCol cols="12" sm="7">
            <div class="d-flex justify-space-between mt-3 ml-3 mr-3 mb-1">
              <h4>Your Items</h4>
            </div>
            <VCard class="ml-2 mr-2" color="#eefbf1">
              <VCard>
                <VCardText v-for="product in order.order_details" class="mobile-view mobile-card">
                  <VRow class="mb-2 pt-3 pb-3">
                    <VCol cols="2" class="mobile-view">
                      <VBtn variant="tonal" size="xx-small" color="success">x{{ product.qty }}</VBtn>
                      <VImg
                        :src="product.image"
                      />
                    </VCol>
                    <VCol cols="10">
                      <VCardText class="mobile-view">
                        <h4>{{ product.product_name }}</h4>
                        <h5 class="text-error mt-2">AED {{ product.total_amount }}</h5>
                      </VCardText>
                    </VCol>
                  </VRow>
                  <VDivider />
                </VCardText>
              </VCard>
            </VCard>
          </VCol>
          <VCol cols="12" sm="5">
            <div class="d-flex justify-space-between mt-5 ml-3 mr-3 mb-1">
              <h4>Order totals</h4>
            </div>
            <VCard class="ml-2 mr-2 pl-5 pr-5">
              <div class="d-flex justify-space-between mt-3 mb-3 text-sm">
                <span>Subtotal</span>
                <span>AED {{ order.net_total }}</span>
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
                <span>Service Fee</span>
                <span>AED 0</span>
              </div>
              <div class="d-flex justify-space-between mt-3 mb-3 text-sm">
                <span>Express Delivery Fee</span>
                <span>AED 0</span>
              </div>
              <VDivider />
              <div class="d-flex justify-space-between mt-3 mb-3">
                <div>
                  <h4>Grand Total</h4>
                  <span class="text-xs">(Inclusive all VAT)</span>
                </div>
                <h4>AED {{ Math.round(order.grand_total * 100) /100 }}</h4>
              </div>
              <div class="d-flex justify-space-between mt-3 mb-3">
                <span class="text-sm">Tax</span>
                <span class="text-sm">AED {{ order.vat_total }}</span>
              </div>
            </VCard>
            <VCard class="d-flex mt-5 ml-2 mr-2 pl-3 pr-3 pt-3 pb-3" color="#f4f3f3">
              <VIcon size="42" icon="tabler-credit-card" />
              <div class="ml-3">
                <h6>Payment method</h6>
                <h5>Pay with Credit Card</h5>
              </div>
            </VCard>
          </VCol>
        </VRow>
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
  .mobile-slot{
    display: block !important;
    padding-right: 20px;
  }
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
