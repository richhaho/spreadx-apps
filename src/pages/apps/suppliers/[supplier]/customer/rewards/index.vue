<script setup>
import { useDemoVendorStore } from '@/store/demoVendorStore';
import { useUiStore } from '@/store/uiStore';
import { useRoute } from 'vue-router';
const demoVendorStore = useDemoVendorStore();
const route = useRoute()
const uiStore = useUiStore()
const userData = JSON.parse(localStorage.getItem("userData"));
const business_id = userData.business.id
const supplier_id = route.params.supplier
demoVendorStore.fetchOrders(business_id, supplier_id)
const orderData = computed(() => demoVendorStore.$state.orders)
const orders = computed(() => orderData.value.length > 0 ? orderData.value[0].order_list : [])
const order = JSON.parse(localStorage.getItem("orderDetail"));

const isViewAddMapDialogue = ref(false);

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
      <h3 class="ml-3">Home / Profile</h3>
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
        <VRow class="mr-1">
          <VCol cols="12">
            <VCard class="ml-2 pl-3 pr-3 pt-3 pb-3 mt-5" color="#def8e3">
              <div class="d-flex">
                <VIcon icon="tabler-crown" color="success" size="70" />
                <div class="ml-5 w-100">
                  <h5>You are</h5>
                  <h4 class="text-success" >Pro Member</h4>
                  <span class="text-xs">Unlock VIP and access a world of benefits, freebies and exclusive offers.</span>
                  <VCard class="mt-3 pl-2 pr-2 pt-2 pb-2">
                    <h6>Current Balance</h6>
                    <div class="d-flex justify-space-between pl-5 pr-5 mt-3">
                      <div>
                        <h6>3</h6>
                        <h6>FreshCoins</h6>
                      </div>
                      <div>
                        <VBtn icon="tabler-equal" color="#f0f0e1" size="x-small">=</VBtn>
                      </div>
                      <div>
                        <h6>0.3</h6>
                        <h6>AED</h6>
                      </div>
                    </div>
                  </VCard>
                </div>
              </div>
            </VCard>
          </VCol>
        </VRow>
        <VRow class="mr-1">
          <VCol cols="12" sm="6" lg="8">
            <VCard class="d-flex justify-space-between mt-5 ml-2 mr-2 pl-3 pr-3 pt-3 pb-5" color="#f4f3f3">
              <div class="pt-1 pb-1" >
                <h5> Unlock VIP membership!</h5>
                <h6> Please 3 orders each above 100 to upgrade to VIP membership</h6>
              </div>
              <div class="pt-1 pb-1 text-center">
                <h5> {{ orders.length }}/3</h5>
                <h6> Orders</h6>
              </div>
            </VCard>
            <h5 class="ml-3 mt-5 mb-2">Balance History</h5>
            <VCard class="ml-3 mr-3 pl-3 pr-3 pt-3 pb-5 h-50" variant="outlined">
              <div class="d-flex justify-space-between">
                <div>
                  <VCard color="success" class="pl-1 pr-1 pt-1 pb-1">
                    <VIcon icon="tabler-circle-plus" size="22" />
                  </VCard>
                </div>
                <h6 class="ml-1">Earned 3 FreshCoin for the order #358234.</h6>
                <div>
                  <h6>AED 0.30</h6>
                  <div class="text-xs"> 09 Apr, 2024</div>
                </div>
              </div>
            </VCard>
            <h5 class="ml-3 mt-5 mb-2">My Refferals</h5>
            <VCard class="ml-3 mr-3 pl-3 pr-3 pt-3 pb-5" variant="outlined">
            </VCard>
          </VCol>
          <VCol
            cols="12"
            lg="4"
            sm="6"
            relative
            class="mb-5"
          >
            <VCard class="pl-3 pr-3 pt-3 pb-3 mt-5" color="#def8e3">
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
  .mobile-slot{
    display: block !important;
    padding-right: 20px;
  }
  .mobile-view{
    width: 450px !important;
  }
  .mobile-scroll {
    overflow-x: auto;
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
