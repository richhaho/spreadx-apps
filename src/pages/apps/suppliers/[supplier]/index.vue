<script setup>

import { useUiStore } from '@/store/uiStore';
import { onBeforeMount } from 'vue';
import { useRoute, useRouter } from 'vue-router';
const uiStore = useUiStore();
const route = useRoute();
const router = useRouter();
const supplier_id = route.params.supplier;


onBeforeMount(() => {
  const sPageRefreshed = performance.navigation.type === 1;
  if (sPageRefreshed) {
    // Fetch data only when the page is refreshed
    uiStore.getSuppliers();
  }
})



// get the id of the selected supplier
const supplierAxiosMapping = ((id) => {
  switch (id) {
    case 1: return axios_koch
      break;
    default: return null;
      break;
  }
})

const axiosInstance = supplierAxiosMapping[supplier_id]

const getProductList = () => {
  if (localStorage.getItem("customer_id")) {
    axiosInstance ? axiosInstance.get(('v1/get_customer_price'), {
      params: {
        customer_id: localStorage.getItem("customer_id")
      }
    }
    ).then((response) => {
      demoVendorStore.$state.products = response.data.product_lists
    }) : null
  }
};

getProductList()

const suppliers = computed(() => uiStore.$state.suppliers)

const currentSupplier = ref('');

suppliers.value.map((item) => {
  if (item.verified == 1) {
    currentSupplier.value = item.name;
    return item;
  }
})

watch(suppliers, () => {
  suppliers.value.map((item) => {
    if (item.verified == 1) {
      currentSupplier.value = item.name;
      return item;
    }
  })
})



const open = ref(['Users', 'Admin'])

const orders = [
  ['New Order', 'tabler-plus'],
  ['Order List', 'tabler-list', ''],
]

const accounts = [
  ['Settings', 'tabler-settings'],
  ['securiry', 'tabler-shield'],
]

const admins = [
  ['New Order', 'tabler-plus'],
  ['Order List', 'tabler-list'],
]

const payments = [
  ['New Payment', 'tabler-plus'],
  ['Payment List', 'tabler-list'],
]

const navigateTab = (() => {
  router.push({ name: 'checkout' })
})

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
</style>
<template>
  <VRow>
    <VCol cols="12"
      relative
      sm="4"
      md="3"
      lg="3">
      <h2 v-if="currentSupplier">
        <router-link to="/apps/suppliers"
          class="supplier-link">
          Supplier list >>
        </router-link>
        {{ currentSupplier }}
      </h2>
      <h3 color="error"
        v-else>You are not verified for the supplier you selected</h3>

      <VList v-model:opened="open"
        style="height: 100%;">
        <VListItem prepend-icon="tabler-home"
          title="Supplier Dashboard"
          :to="`/apps/suppliers/${supplier_id}/dashboard`"
          value="supplier_id" />

        <!-- <VListGroup value="profile">
          <template #activator="{ props }">
            <VListItem v-bind="props"
              prepend-icon="tabler-users"
              title="My Profile" />
          </template>

<VListItem v-for="([title, icon], i) in accounts"
  :key="i"
  :value="title"
  :title="title"
  :prepend-icon="icon" />
</VListGroup> -->

        <VListGroup value="Orders">
          <template #activator="{ props }">
            <VListItem v-bind="props"
              prepend-icon="tabler-users"
              title="My Orders" />
          </template>

          <VListItem value="New Order"
            title="new Order"
            :to="`/apps/suppliers/${supplier_id}/products`"
            prepend-icon="tabler-plus" />


          <VListItem value="Order List"
            title="Order List"
            :to="`/apps/suppliers/${supplier_id}/order_list`"
            prepend-icon="tabler-list" />

        </VListGroup>
        <VListGroup value="Tickets">
          <template #activator="{ props }">
            <VListItem v-bind="props"
              prepend-icon="tabler-users"
              title="My Tickets" />
          </template>

          <VListItem value="New Ticket"
            title="New Ticket"
            :to="`/apps/suppliers/${supplier_id}/ticket/create_ticket`"
            prepend-icon="tabler-plus" />


          <VListItem value="Ticket List"
            title="Ticket List"
            :to="`/apps/suppliers/${supplier_id}/ticket/tickets`"
            prepend-icon="tabler-list" />

        </VListGroup>



        <VListGroup value="payments">
          <template #activator="{ props }">
            <VListItem v-bind="props"
              prepend-icon="tabler-users"
              title="My Payments" />
          </template>

          <VListItem v-for="([title, icon], i) in payments"
            :key="i"
            :value="title"
            :title="title"
            :prepend-icon="icon" />
        </VListGroup>
      </VList>
    </VCol>
    <vCol cols="12"
      relative
      sm="8"
      md="9"
      lg="9">
      <div class="header">
        <h1>Welcome to {{ currentSupplier }}</h1>
      </div>

      <div class="welcome-container">
        <p>
          From your account dashboard. you can easily check & view your recent orders and create new one.
        </p>
      </div>
    </vCol>
  </VRow>
</template>
