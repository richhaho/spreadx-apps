<script setup>
import { useRoute } from 'vue-router';
const route = useRoute()
const order = JSON.parse(localStorage.getItem("orderDetail"));
const userData = JSON.parse(localStorage.getItem("userData"));
const supplier_id = route.params.supplier
function copyToClipboard(data) {
  navigator.clipboard.writeText(data);
}
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
      <VCard class="pr-5 pl-5">
        <template v-slot:text >
          <VRow style="display: flex; justify-content: space-between; ">
            <VCol cols="4" class="d-flex">
              <span class="mt-2">Show</span>
              <v-select 
              :items="['5', '25', '50', '75', '100', 'ALL']"
              ></v-select>
              
              <span class="pt-2">entries</span>   
              
            </VCol>   
            <VCol cols="5">
              <span class="float-left mt-2">Search: </span>
              <v-text-field
                class="w-75"
                v-model="search"
                label="Search"
                prepend-inner-icon="mdi-magnify"
                variant="outlined"
                hide-details
                single-line
              ></v-text-field>
            </VCol>
          </VRow>
        </template>
        <v-data-table class="table" :headers="headers" :search="search" :item-value="item => `${item.num}-${item.version}`"  :items="desserts" items-per-page="5" show-select>
        </v-data-table>
      </VCard>
      </VCol>
    </VRow>
  </VCard>
</template>
<script>
  export default {
    data () {
      return {
        search: '',
        headers: [
          {
            title: '#',
            align: 'start',
            key: 'num',
          },
          {key:'invoice_date', title:'INVOICE DATE'},
          {key:'invoice_number', title:'INVOICE NUMBER'},
          {key:'invoice_total', title:'INVOICE TOTAL'},
          {key:'balance',  title:'BALANCE'},
          {key:'amount', title:'AMOUNT TO PAY'}
        ],
        desserts:[
          {
            num:'1',
            invoice_date:'16-04-2024',
            invoice_number:'IN25442',
            invoice_total:'145.94',
            balance : '145.95',
          },
          {
            num:'2',
            invoice_date:'16-04-2024',
            invoice_number:'IN25443',
            invoice_total:'9.45',
            balance : '9.45',
          }
        ]
      }
    },
  }
</script>
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
