<script setup>
import { useDemoVendorStore } from '@/store/demoVendorStore';
import { useUiStore } from '@/store/uiStore';
import { useRoute, useRouter } from 'vue-router';
const route = useRoute()
const router = useRouter();

const uiStore = useUiStore()
const demoVendorStore = useDemoVendorStore();

const userData = JSON.parse(localStorage.getItem("userData"));
const business_id = userData.business.id
const supplier_id = route.params.supplier

demoVendorStore.fetchOrders(business_id, supplier_id)
const orderData = computed(() => demoVendorStore.$state.orders)
const orders = computed(() => orderData.value.length > 0 ? orderData.value[0].order_list : [])

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

function downloadInvoice(order) {
  console.log(order.invoice)
}
// function reOrder(order) {
//   const product_ids = []
//   const prices = []
//   const qtys = []
//   const units = []
//   order.order_details.forEach(product => {
//     product_ids.push(product.product_id)
//     prices.push(product.total_amount)
//     qtys.push(product.qty)
//     units.push(product.unit_id)
//   })
//   const payload = {
//     "customer_name": userData.full_name,
//     "customer_email": userData.email,
//     "address": userData.address,
//     "notes": '',
//     "product_id": product_ids.join(','),
//     "qty": qtys.join(','),
//     "price": prices.join(','),
//     "batch_no": ",,",
//     "unit": units.join(','),
//     "supplier_id": supplier_id,
//     "delivery_slot_id": 0,
//     "business_id": business_id
//     }
//   demoVendorStore.storeOrder(business_id, payload)
// }

function toOrderDetail(order) {
  localStorage.setItem("orderDetail", JSON.stringify(order));
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
          <h4>Orders ({{ orders.length || 0 }})</h4>
        </div>
        <VCard v-for="order in orders" class=" mt-2 ml-2 mr-2 border">
          <div class="d-flex justify-space-between mt-2 ml-2 mr-3 mb-1">
            <h5 class="text-success">Order {{ order.invoice_no }} (Qty: {{order.order_details.length || 0}})</h5>
            <span class="text-xs">Placed On {{ order.order_date}}</span>
          </div>
          <div class="d-flex justify-space-between mt-1 ml-2 mr-3 mb-1">
            <span class="text-xs">Charged amount: AED {{ order.grand_total }}</span>
            <span class="text-xs text-primary">Status: {{ order.status }}</span>
          </div>
          <VDivider />
          <div class="d-flex justify-space-between mt-1 ml-2 mr-3 mb-5" style="overflow-x: scroll;">
            <div style="width: max-content;" class="pl-3">
              <VCard v-for="product in order.order_details" class="mobile-view mobile-card ml-2" style="float: left; width: 250px; height: 100px;">
                <VRow class="mb-2 pt-3 pb-3">
                  <VCol cols="2" class="mobile-view">
                    <VBtn variant="tonal" size="xx-small" color="success">x{{ product.qty }}</VBtn>
                    <VImg
                      :src="product.image"
                    />
                  </VCol>
                  <VCol cols="10">
                    <div class="mobile-view product-name">
                      <h4>{{ product.product_name }}</h4>
                    </div>
                    <div class="d-flex justify-space-between">
                      <h5 class="text-error mt-2">AED {{ product.total_amount }}</h5>
                      <VBtn color="success" size="x-small">90mins</VBtn>
                    </div>
                  </VCol>
                </VRow>
              </VCard>
            </div>
          </div>
          <div class="d-flex justify-end mt-1 ml-2 mr-3 mb-3">
            <VBtn color="success" variant="outlined" size="small" @click="reOrder(order)">Reorder</VBtn>
            <VBtn v-if="order.status=='COMPLETED'" color="info" size="small" class="ml-1" :to="`/apps/suppliers/${supplier_id}/customer/orders/${order.reference_no}/invoice`">Invoice</VBtn>
            <VBtn color="success" size="small" class="ml-1" @click="toOrderDetail(order)" :to="`/apps/suppliers/${supplier_id}/customer/orders/${order.reference_no}`">Details</VBtn>
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
