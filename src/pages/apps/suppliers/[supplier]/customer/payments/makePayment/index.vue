<script setup>
import { useRoute } from 'vue-router';
const route = useRoute()
const supplier_id = route.params.supplier
const data = JSON.parse(localStorage.getItem('makePayment'))
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
     <VCard v-for="result in data" class="mt-2 ml-2 mr-2 border">
        <div class="payment-result mt-2 ml-2 mr-3 mb-1">
            <p>Invoice Date : <span class="ml-3">{{ result.invoice_date}}</span></p>
            <p>Invoice Number : <span class="ml-3">{{ result.invoice_number}}</span></p>
            <p>Invoice Total : <span class="ml-3">{{ result.invoice_total}}</span></p>
            <p>Balance : <span class="ml-3">{{ result.balance}}</span></p>
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
.make-payment-button{
  display: flex;
  justify-content: flex-end;
}
.payment-result p{
    font-weight: 900;
}
.payment-result span{
    color: #aaa;
    font-size: 13px;
}
</style>
