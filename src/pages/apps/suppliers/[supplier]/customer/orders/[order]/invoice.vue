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
function toOrderDetail(order) {
  localStorage.setItem("orderDetail", JSON.stringify(order));
}

</script>

<template>
  <div class="d-flex">
    <VBtn color = 'primary'>Print Invoice</VBtn>
  </div>
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
