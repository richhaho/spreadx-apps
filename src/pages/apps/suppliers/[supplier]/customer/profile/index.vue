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
console.log(userData)
const user = ref(userData)
const isOldPasswordVisible = ref(false);
const isNewPasswordVisible = ref(false);
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
        <h3 class="ml-3 mb-1">Profile Information</h3>
        <VCard class="ml-3 mr-3">
          <div class="d-flex justify-space-between mt-5 ml-3 mr-3 mb-3">
            <VTextField
              placeholder="First Name"
              density="compact"
              v-model="user.first_name"
            />
            <VTextField
              placeholder="Last Name"
              class="ml-2"
              density="compact"
              v-model="user.last_name"
            />
          </div>
          <div class="d-flex justify-space-between mt-5 ml-3 mr-3 mb-3">
            <VTextField
              placeholder="Phone number"
              density="compact"
              v-model="user.phone"
            />
          </div>
          <div class="d-flex justify-space-between mt-5 ml-3 mr-3 mb-3">
            <VTextField
              placeholder="Email"
              density="compact"
              v-model="user.email"
            />
          </div>
          <div class="d-flex justify-end mt-5 ml-3 mr-3 mb-3">
            <VBtn color="success">Save</VBtn>
          </div>
        </VCard>
        <h3 class="ml-3 mb-1 mt-5">Update Password</h3>
        <VCard class="ml-3 mr-3 mt-3 mb-5 pl-3 pr-3 pb-3 pt-3">
          <VRow>
            <VCol cols="12" md="4">
              <VTextField
                placeholder="Enter your old password"
                density="compact"
                :type="isOldPasswordVisible ? 'text' : 'password'"
                :append-inner-icon="isOldPasswordVisible ? 'tabler-eye-off' : 'tabler-eye'"
                v-model="user.old_password"
                @click:append-inner="isOldPasswordVisible = !isOldPasswordVisible"
              />
            </VCol>
            <VCol cols="12" md="4">
              <VTextField
                :type="isNewPasswordVisible ? 'text' : 'password'"
                placeholder="Enter your new password"
                density="compact"
                :append-inner-icon="isNewPasswordVisible ? 'tabler-eye-off' : 'tabler-eye'"
                v-model="user.new_password"
                @click:append-inner="isNewPasswordVisible = !isNewPasswordVisible"
              />
            </VCol>
            <VCol cols="12" md="4" class="d-flex justify-end">
              <VBtn color="success">Update Password</VBtn>
            </VCol>
          </VRow>
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
