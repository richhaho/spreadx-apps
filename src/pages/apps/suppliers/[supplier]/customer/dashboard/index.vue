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
        <VCard class="ml-3 mr-3" color="#eefbf1">
          <div class="d-flex ml-3 mr-3 mt-3">
            <h4>{{ userData.full_name }}</h4>
            <VBtn class="ml-3" color="warning" size="x-small"><VIcon icon="tabler-crown"></VIcon>Pro Member</VBtn>
          </div>
          <div class="d-flex justify-space-between mt-5 ml-3 mr-3 mb-3">
            <div class="d-flex mobile-slot">
              <div class="mr-3 ml-2">
                <h6 class="text-xs">Email</h6>
                <h5>{{ userData.email }}</h5>
              </div>
              <VDivider vertical />
              <div class="mr-3 ml-2">
                <h6 class="text-xs">Phone</h6>
                <h5>{{ userData.phone || '+9715055140401' }}</h5>
              </div>
              <VDivider vertical />
              <div class="mr-3 ml-2">
                <h6 class="text-xs">Rewards Balance</h6>
                <h5>0 FreshCoins</h5>
              </div>
              <VDivider vertical />
            </div>
            <VBtn color="success" size="x-small">Edit Profile</VBtn>
          </div>
        </VCard>
        <VRow class="mt-5">
          <VCol cols="12" sm="6">
            <VCard class="ml-3 mr-3 pl-3 pr-3 pt-3 pb-5" variant="outlined">
              <VRow class="mb-1">
                <VCol cols="12" class="mt-5 mb-5">
                  <h4 class="mt-2 text-center"> {{ orders.length }}/3</h4>
                  <h4 class="text-center">Orders</h4>
                </VCol>
              </VRow>
              <h5>Unlock VIP membership</h5>
              <span class="text-sm">Place 3 orders each above 100 to upgrade to VIP membership</span>
            </VCard>
          </VCol>
          <VCol cols="12" sm="6">
            <VCard class="mr-3 ml-3 pl-3 pr-3 pt-3 pb-5" image="https://openmaptiles.org/img/home-banner-map.png" variant="outlined">
              <VRow>
                <VCol cols="12">
                  <VBtn color="primary" size="x-small" class="mt-2 ml-2">Default</VBtn>
                </VCol>
                <VCol cols="12">
                  <h4 class="text-bold mt-2">{{ userData.full_name }}</h4>
                  <p>{{ userData.address || 'Villa3, Villa3, Al Rashdiya, Dubai'}}</p>
                </VCol>
              </VRow>
              <div class="d-flex justify-space-between">
                <h5 class="mt-2">Phone</h5>
                <span class="text-sm">{{ userData.phone || '+9715055140401' }}</span>
              </div>
              <div class="d-flex justify-space-between">
                <h5>Email</h5>
                <span class="text-sm">{{ userData.email }}</span>
              </div>
            </VCard>
          </VCol>
        </VRow>
        <div class="d-flex justify-space-between mt-5 ml-3 mr-3 mb-1">
          <h4>Recent Orders</h4>
          <span class="text-sm">Show All</span>
        </div>
        <VCard class="ml-3 mr-3 pl-3 pr-3 pt-3 pb-5 mobile-scroll" variant="outlined">
          <table class="table table-default w-100 mobile-view">
            <thead>
              <tr>
                <th>ORDER ID<VDivider/></th>
                <th>Date<VDivider/></th>
                <th>Status<VDivider/></th>
                <th>Total<VDivider/></th>
                <th>Action<VDivider/></th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="order in orders">
                <td class="text-center">{{ order.invoice_no }}</td>
                <td class="text-center">{{ order.order_date }}</td>
                <td class="text-center">{{ order.status }}</td>
                <td class="text-center">AED {{ order.grand_total }}</td>
                <td class="text-center">
                  <VBtn color="default" icon="tabler-arrow-right" size="x-small" class="ml-1" @click="toOrderDetail(order)" :to="`/apps/suppliers/${supplier_id}/customer/orders/${order.reference_no}`" />
                </td>
              </tr>

            </tbody>
          </table>
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
