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

const isEditAddressDialogVisible = ref(false)
let billingAddress = ref({
  first_name: userData.first_name,
  last_name: userData.last_name,
  email: userData.email,
  city: userData.city,
  state: userData.state,
  phone: userData.phone,
  address1: userData.address,
  address2: userData.address || '',
  country: userData.country || ''
})

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
        <div class="d-flex justify-space-between mt-3 ml-3 mr-3 mb-3">
          <h4>Addresses</h4>
          <a @click="isViewAddMapDialogue = true">
            <VIcon
              size="22"
              icon="tabler-circle-plus"
            /> Add address
          </a>
        </div>
        <VCard
          class="ml-2 mr-2"
          image="https://openmaptiles.org/img/home-banner-map.png"
          variant="outlined"
        >
          <VRow>
            <VCol cols="12" sm="2">
              <VBtn color="primary" size="x-small" class="mt-2 ml-2">Default</VBtn>
            </VCol>
            <VCol cols="12" sm="6">
              <h4 class="text-bold mt-2">{{ billingAddress.first_name }} {{ billingAddress.last_name }}</h4>
              <p>{{ billingAddress.address1 }} {{ billingAddress.address2 }}</p>
            </VCol>
            <VCol cols="10" sm="3">
              <h5 class="mt-2">Phone</h5>
              <span class="text-sm">{{ billingAddress.phone || '+9715055140401' }}</span>
              <h5>Email</h5>
              <span class="text-sm">{{ billingAddress.email }}</span>
            </VCol>
            <VCol cols="2" sm="1">
              <VIcon icon="tabler-pencil" size="22" @click="isEditAddressDialogVisible = !isEditAddressDialogVisible" />
              <VIcon icon="tabler-trash" size="22" />
            </VCol>
          </VRow>
        </VCard>
        <EditAddressDialog
          v-model:isDialogVisible="isEditAddressDialogVisible"
          v-model:billingAddress="billingAddress"
        />
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
