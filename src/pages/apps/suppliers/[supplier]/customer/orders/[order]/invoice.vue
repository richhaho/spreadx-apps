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

//demoVendorStore.fetchOrders(business_id, supplier_id)
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
  <div class="d-flex pb-1">
    <VBtn color = 'primary'>Print Invoice</VBtn>
  </div>
  <div class="part-first">
    <VRow>
      <VCol cols="2"></VCol>
      <VCol cols="6" class="general-trading pt-5">
        <p class="pb-1">DSG GENERAL TRADING LLC</p>
        <p class="pb-1">دي أس جي التجارة العامة ذ م م</p>
        <p class="pb-1">Tel : T 971-4-4457721 |F 971-4-8868394</p>
        <p class="pb-1">Email : sales@dsggeneraltrading.com</p>
        <p class="pb-1">Address : Ras Al Khor-Dubai -United Arab Emirates</p>
        <p class="pb-1">TRN : 100510630500003</p>
      </VCol>
      <VCol cols="4" class="text-end">
        <h1>TAX INVOICE</h1>
        <span class="status">STATUS: COMPLETED</span>
        <svg width="244px" height="92px" x="0px" y="0px" viewBox="0 0 244 92" style="transform: translate(5px,12px)">
          <rect x="0" y="0" width="244" height="92" style="fill:#f8f7fa;"></rect>
          <g transform="translate(10, 10)" style="fill:#000000;">
            <rect x="0" y="0" width="4" height="50"></rect>
            <rect x="6" y="0" width="2" height="50"></rect>
            <rect x="12" y="0" width="2" height="50"></rect>
            <rect x="22" y="0" width="4" height="50"></rect>
            <rect x="32" y="0" width="2" height="50"></rect>
            <rect x="40" y="0" width="2" height="50"></rect>
            <rect x="44" y="0" width="2" height="50"></rect>
            <rect x="48" y="0" width="6" height="50"></rect>
            <rect x="60" y="0" width="4" height="50"></rect>
            <rect x="66" y="0" width="4" height="50"></rect>
            <rect x="74" y="0" width="6" height="50"></rect>
            <rect x="84" y="0" width="2" height="50"></rect>
            <rect x="88" y="0" width="2" height="50"></rect>
            <rect x="92" y="0" width="6" height="50"></rect>
            <rect x="100" y="0" width="8" height="50"></rect>
            <rect x="110" y="0" width="4" height="50"></rect>
            <rect x="116" y="0" width="4" height="50"></rect>
            <rect x="124" y="0" width="4" height="50"></rect>
            <rect x="132" y="0" width="4" height="50"></rect>
            <rect x="138" y="0" width="4" height="50"></rect>
            <rect x="146" y="0" width="4" height="50"></rect>
            <rect x="154" y="0" width="2" height="50"></rect>
            <rect x="162" y="0" width="2" height="50"></rect>
            <rect x="168" y="0" width="4" height="50"></rect>
            <rect x="176" y="0" width="4" height="50"></rect>
            <rect x="184" y="0" width="4" height="50"></rect>
            <rect x="190" y="0" width="4" height="50"></rect>
            <rect x="198" y="0" width="4" height="50"></rect>
            <rect x="208" y="0" width="6" height="50"></rect>
            <rect x="216" y="0" width="2" height="50"></rect>
            <rect x="220" y="0" width="4" height="50"></rect>
            <text style="font: 20px monospace" text-anchor="middle" x="112" y="72">IN2000005</text>
          </g>
        </svg>
      </VCol>
    </VRow>
  </div>
  <div class="part-second border-top pl-4 pr-4">
    <VRow>
      <VCol cols="8" class="customer-detail">
        <h2 class="pb-3">CUSTOMER DETAIL:</h2>
        <p class="pb-1">Modoway | Modoway</p>
        <p class="pb-1">Address:</p>
        <p class="pb-1">Tel: 5012345678</p>
        <p class="pb-1">TRN:</p>
      </VCol>
      <VCol cols="4">
        <h2 class="pb-3">INVOICE DETAIL:</h2>
        <VRow class="invoice-detail">
          <VCol cols="6">
            <p class="pb-2">INVOICE NUMBER:</p>
            <p class="pb-2">REFERENCE NUMBER:</p>
            <p class="pb-2">INVOICE TYPE:</p>
            <p class="pb-2">INVOICE DATE:</p>
            <p class="pb-2">INVOICE CREATED AT</p>
            <p class="pb-2">ROUTE:</p>
          </VCol>
          <VCol cols="6" class="text-end">
            <p class="pb-2">IN2000005</p>
            <p class="pb-2">xJlEqkHxZq</p>
            <p class="pb-2">CASH</p>
            <p class="pb-2">22-04-2024</p>
            <p class="pb-2">22-04-2024 11:40 AM</p>
            <p class="pb-2">200 | SPREADX</p>
          </VCol>
        </VRow>
      </VCol>
    </VRow>
  </div>
  <div class="part-third border-top pl-4 pr-4">
    <table class="table mb-2">
      <thead>
        <tr>
          <th>#</th>
          <th>Barcode</th>
          <th>Description</th>
          <th>UOM</th>
          <th>BATCH</th>
          <th>QTY</th>
          <th>Gross Weight</th>
          <th>Net Weight</th>
          <th>Price</th>
          <th>Discount</th>
          <th>Total</th>
          <th>Total Excl. VAT</th>
          <th>VAT %</th>
          <th>VAT Amount</th>
          <th>Total</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>1</td>
          <td>DSGP01</td>
          <td>A/GREEN EVAPORATED MILK ORIGINAL</td>
          <td>CARTON</td>
          <td>None</td>
          <td>1</td>
          <td>-</td>
          <td>-</td>
          <td>165.00</td>
          <td>(0.00)</td>
          <td>165.00</td>
          <td>165.00</td>
          <td>5.00</td>
          <td>8.25</td>
          <td>173.25</td>
        </tr>
      </tbody>
    </table>
    <div class="part-third-gross">
      <div class="part-third-gross-width">
        <div class="d-flex third-gross">
          <p>GROSS SALES</p>
          <p>165.00</p>
        </div>
        <div class="d-flex third-gross">
          <p>DISCOUNT</p>
          <p>(0.00)</p>
        </div>
        <div class="d-flex third-gross">
          <p>NET TOTAL</p>
          <p>165.00</p>
        </div>
        <div class="d-flex third-gross">
          <p>VAT TOTAL</p>
          <p>8.25</p>
        </div>
        <div class="d-flex third-gross">
          <p>GRAND TOTAL</p>
          <p>173.25</p>
        </div>
        <div class="d-flex third-gross">
          <p>AMOUNT PAID</p>
          <p>0.00</p>
        </div>
        <div class="d-flex third-gross">
          <p>TOTAL DUE</p>
          <p>173.25</p>
        </div>
      </div>
    </div>
  </div>
  <div class="part-forth border-top pl-4 pr-4">
    <h2 class="mb-2">PAYMENT DETAIL:</h2>
    <table class="table" width="100%">
      <thead>
        <tr>
          <th>Date</th>
          <th>Receipt No</th>
          <th>Amount</th>
          <th>Payment Method</th>
          <th>Payment Status</th>
          <th>Additional Info</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>22-04-2024</td>
          <td>PR0004</td>
          <td>173.25</td>
          <td>CASH</td>
          <td>PENDING</td>
          <td>N/A</td>
        </tr>
      </tbody>
    </table>
  </div>
  <div class="part-fifth border-top pl-4 pr-4">
    <div class="notice mb-3">
      <p>NOTICE</p>
      <p>Received the goods in good condition</p>
    </div>
    <div class="thank">
      <p>Thank You</p>
    </div>
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
.part-first{
  padding: 20px 0 60px 0;
  border-top: 1px solid #000;
}
h1{
  font-size: 45px;
}
.status{
  border: 1px solid blue;
  padding: 8px;
  border-radius: 4px;
  font-size: 15px;
  color: #000;
}
p{
  margin: 0 !important;
}
.border-top{
  padding: 20px 0 60px 0;
  border-top: 2px solid #000;
}
.invoice-detail{
  font-size: 12px;
  color: #000;
}
.customer-detail,.general-trading{
  font-size: 15px;
  color: #000;
}
.table tbody td, .table thead th{
  border: 1px solid #000;
  padding: 5px;
  text-align: left;
  color: #000;
  font-size: 13px;
}
.table{
  border-collapse: collapse;
}
.part-third-gross{
  display: flex;
  justify-content: end;
}
.part-third-gross-width{
  width: 370px;
  color: #000;
  font-size: 12px;
}
.third-gross{
  justify-content: space-between;
  border-bottom: 2px solid #000;
  padding: 10px;
}
.notice{
  border-left: 5px solid blue;
  padding-left: 5px;
  color: #000;
  font-size: 15px
}
.thank{
  border-left: 5px solid blue;
  font-size: 36px;
  background: #cecfe3;
  padding-left: 10px;
  width: 280px;
}
</style>
