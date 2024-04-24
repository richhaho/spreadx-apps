<script setup>
import { useUiStore } from '@/store/uiStore';
const uiStore = useUiStore()
const order = JSON.parse(localStorage.getItem("orderDetail"));
const userData = JSON.parse(localStorage.getItem("userData"));
const supplier_id = '3GTAbmAx'
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
                  <h5 class="ml-1">#{{ order.invoice_no }}</h5>
                  <h4 class="ml-1">AED {{ Math.round(order.grand_total * 100)/100 }}</h4>
                </div>
                <VBtn color="success" size="small" @click="toOrderDetail(order)" :to="`/apps/suppliers/${supplier_id}/customer/orders/${order.reference_no}`">Details</VBtn>
              </div>
            </VCard>
            <VCard class="ml-2 mr-2 pl-3 mt-5 pr-3 pt-3 pb-3" color="#f4f3f3">
              <div class="d-flex justify-space-between align-center">
                <div>
                  <span class="ml-1 text-xs">Delivery Timeslot</span>
                  <h6 class="ml-1">{{ order.delivery_date }}</h6>
                </div>
                <VBtn color="success" size="small">Details</VBtn>
              </div>
            </VCard>
            <div class="d-flex justify-space-between mt-5 pt-5 ml-3 mr-3 mb-1">
              <span class="text-sm">Your Items</span>
              <h5>{{ order.item_count || 0 }}</h5>
            </div>
            <VDivider />
            <div class="d-flex justify-space-between mt-5 pt-5 ml-3 mr-3 mb-1">
              <span class="text-sm">Payment</span>
              <h5>Pay with Credit/Debit Card</h5>
            </div>
            <VDivider />
            <div class="d-flex justify-space-between mt-5 pt-5 ml-3 mr-3 mb-1">
              <span class="text-sm">Email</span>
              <h5>{{ userData.email }}</h5>
            </div>
            <VDivider />
            <div class="d-flex justify-space-between mt-5 pt-5 ml-3 mr-3 mb-1">
              <span class="text-sm">Mobile</span>
              <h5>{{ userData.phone || '+971505140401'}}</h5>
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
                  <h4>{{ order.reference_no }}</h4>
                  <div class="ml-5">
                    <VIcon size="30" color="success" icon="tabler-copy" @click="copyToClipboard(order.reference_no)"></VIcon>
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
