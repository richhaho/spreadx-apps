<script setup>
import { useRoute, useRouter } from 'vue-router';
import SupplierCreateTicket from '../pages/create_ticket.vue';
import SupplierTicket from '../pages/tickets.vue';
const route = useRoute();
const router = useRouter();

const activeTicketTab = computed({
  get: () => route.params.tabticket,
  set: () => route.params.tabticket,
})
const supplier_id = route.params.supplier;
// tabs
const tabs = [
  {
    title: 'Supplier Dashboard',
    icon: 'tabler-home',
    tab: 'dashboard',
    to: '/apps/suppliers/' + supplier_id
  },
  {
    title: 'Tickets',
    icon: 'tabler-user-check',
    tab: 'tickets',
    to: '/apps/suppliers/' + supplier_id + '/ticket/tickets'
  },
  {
    title: 'Create Ticket',
    icon: 'tabler-shopping-cart',
    tab: 'create_ticket',
    to: '/apps/suppliers/' + supplier_id + '/ticket/create_ticket'
  },
]
</script>
<template>
  <div>

    <VRow>
      <VCol cols="12"
        sm="4"
        md="2">
        <VTabs v-model="activeTicketTab"
          class="v-tabs-pill"
          direction="vertical">
          <VTab v-for="item in tabs"
            :key="item.icon"
            :value="item.tab"
            :to="item.to">
            <VIcon size="20"
              start
              :icon="item.icon" />
            {{ item.title }}
          </VTab>
        </VTabs>
      </VCol>
      <VCol cols="12"
        sm="8"
        md="10">
        <VWindow v-model="activeTicketTab"
          class="mt-5 disable-tab-transition"
          :touch="false">
          <!-- Cart -->
          <VWindowItem value="dashboard">
            <SupplierDashboard />
          </VWindowItem>
          <VWindowItem value="tickets">
            <SupplierTicket />
          </VWindowItem>

          <!-- Order List -->

          <!-- Products -->
          <VWindowItem value="create_ticket">
            <SupplierCreateTicket />
          </VWindowItem>
          <!-- <VWindowItem> -->
            <!-- </VWindowItem> -->
        </VWindow>




      </VCol>
    </VRow>




  </div>
</template>
