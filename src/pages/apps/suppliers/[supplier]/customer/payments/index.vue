<script setup>
import { useDemoVendorStore } from '@/store/demoVendorStore';
import { useRoute } from 'vue-router';
const demoVendorStore = useDemoVendorStore();
const route = useRoute()
const userData = JSON.parse(localStorage.getItem("userData"));
const business_id = userData.business.id
const supplier_id = route.params.supplier
demoVendorStore.fetchOrders(business_id, supplier_id)
const orderData = computed(() => demoVendorStore.$state.orders)
const orders = computed(() => orderData.value.length > 0 ? orderData.value[0].order_list : [])
const search = '';

const headers = [
  {
    title: '#',
    align: 'start',
    key: 'num',
  },
  {key:'invoice_date', title:'INVOICE DATE'},
  {key:'invoice_number', title:'INVOICE NUMBER'},
  {key:'invoice_total', title:'INVOICE TOTAL'},
  {key:'balance',  title:'BALANCE'},
  {key:'amount', title:'AMOUNT TO PAY'},
  {key: 'action', title: 'Action', sortable: false}
];
const invoices = computed(() => {
  const invoices = [];
  orders.value.forEach(item => {
    if (item.invoice_details.id) {
        const invoice = item.invoice_details
        invoices.push({
          num: invoice.id,
          invoice_date: invoice.created_at,
          invoice_number: invoice.invoice_no,
          invoice_total: invoice.net_total + invoice.grand_total + invoice.vat_total,
          balance: '-',
        })
    }
  })
  return invoices
})
function downloadInvoice(item) {
  localStorage.setItem("invoice", JSON.stringify(item));
}
const itemsPerpage = 3;

const results = [];
const selected = [];
function enterSelect() {
  console.log(this);
  this.selected.map(function(e){
    results.push({
      num : e.num,
      invoice_date : e.invoice_date,
      invoice_number : e.invoice_number,
      invoice_total : e.invoice_total,
      balance : e.balance
    })
  });
  console.log(results);
}
function viewPayment(results){
  localStorage.setItem('makePayment', JSON.stringify(results));
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
      <VCard class="pr-5 pl-5">
        <template v-slot:text >
          <div class="d-flex header-part">
            <div class="d-flex entry-div">
              <span class="mt-2 mr-1">Show</span>
              <v-select 
              :items="['5', '25', '50', '75', '100', 'ALL']"
              ></v-select>
              <span class="pt-2 ml-1">entries</span>   
            </div>
            <div class="search-div d-flex">
              <span class="float-left mt-2 mr-1">Search: </span>
              <v-text-field
                class="w-75"
                v-model="search"
                label="Search"
                prepend-inner-icon="mdi-magnify"
                variant="outlined"
                hide-details
              ></v-text-field>
            </div>
          </div>
        </template>
        <VBtn color="info" class="payment-button mb-3" @click="viewPayment(results)" :to="`/apps/suppliers/${supplier_id}/customer/payments/makePayment`">Make a payment</VBtn>
        <v-data-table v-model="selected" @input="enterSelect()" class="table" :headers="headers" :search="search" :item-value="item => `${item.num}-${item.version}`"  :items="invoices" items-per-page="5" return-object show-select>
          <template v-slot:item.amount="{item}">
            <v-text-field class="amount-input"></v-text-field>
          </template>
          <template v-slot:item.action="{item}">
            <v-btn color="primary"  size="small" @click="downloadInvoice(item)" :to="`/apps/suppliers/${supplier_id}/customer/payments/${item.invoice_number}`">View</v-btn>
          </template>
        </v-data-table>
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
.make-payment-button{
  display: flex;
  justify-content: flex-end;
}
.payment-button{
  float: right;
}
.entry-div{
  width: 30%;
  height: 20px;
} 
.search-div {
  width: 50%;
}
.header-part {
  justify-content: space-between;
}
.v-card-text {
  padding: 20px 0;
}
</style>
