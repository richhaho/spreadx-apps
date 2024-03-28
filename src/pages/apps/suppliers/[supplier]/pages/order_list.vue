<script setup>
import axios_lite from '@/plugins/axios_lite';
import { useDemoVendorStore } from '@/store/demoVendorStore';
import { useUiStore } from "@/store/uiStore";
import { onMounted, ref } from "vue";
import { useRoute } from 'vue-router';
const demoVendorStore = useDemoVendorStore();
const route = useRoute();
const supplier_id = route.params.supplier;
const uiStore = useUiStore();
const qlineUrl = import.meta.env.VITE_API_V1;
uiStore.$subscribe(() => {});
demoVendorStore.$subscribe(() => {});

onMounted(() => {
  axios_lite.get('v1/get_vendors_products',{
    params: {
      supplier_id: supplier_id
    }
  }).then((response) => {
    demoVendorStore.$state.products = response.data.products;
  });


});
function resolveProductImage(product_id){
  const product = demoVendorStore.$state.products.find(
    (subproduct) => subproduct.id === product_id
  );

  // Check if product exists and has an image, return the image URL
  if (product && product.image) {
    return product.image;
  }

  // Otherwise, return null or a default image URL
  return null;
}
const headers = [
  {
    title: '#',
    key: 'id',
  },

  {
    title: 'SUPPLIER NAME',
    key: 'supplier_name',
    sortable: true,
  },
  {
    title: 'ORDER NO',
    key: 'invoice_no',
    sortable: true,
  },

  {
    title: 'ORDER DATE',
    key: 'created_at',
    sortable: true,
  },

  {
    title: 'STATUS',
    key: 'status',
  },
  {
    title: 'AMOUNT',
    key: 'grand_total',
  },

  {
    title: 'CUSTOMER NAME',
    key: 'customer_name',
  },
  {
    title: 'ACTIONS',
    key: 'actions',
    sortable: false,
    align: "center",
  },
]
const itemsPerPage = ref(10)
const searchQuery = ref('')
const page = ref(1)
const sortBy = ref()
const orderBy = ref()
onMounted(() => uiStore.getOrderItems(supplier_id));
const requests = computed(() => uiStore.$state.orderItems)
const selectedOrder = ref({});
const isViewProductsDialogue = ref(false);
function viewProducts(order) {
  // console.log(order)
  selectedOrder.value = order;
  isViewProductsDialogue.value = true;
}

const filteredOrders = computed(() => {
  const regex = new RegExp(searchQuery.value, 'i');
  return requests.value.filter(order =>
    regex.test(order.supplier_name) ||
    regex.test(order.invoice_no) ||
    regex.test(order.created_at) ||
    regex.test(order.status) ||
    regex.test(order.customer_name)
  ).sort((a, b) => {
    if (!sortBy.value || !orderBy.value) return 0;
    if (orderBy.value === 'asc') {
      return a[sortBy.value] > b[sortBy.value] ? 1 : -1;
    } else {
      return a[sortBy.value] < b[sortBy.value] ? 1 : -1;
    }
  });
});
function toggleSort(key) {
  if (sortBy.value === key) {
    orderBy.value = orderBy.value === 'asc' ? 'desc' : 'asc';
  } else {
    sortBy.value = key;
    orderBy.value = 'asc';
  }
}
</script>
<style scoped>
.cart-item-image {
  block-size: auto;
  inline-size: 100%;
  max-inline-size: 90px; /* Set the desired maximum width for the product image */
}

</style>
<template>
  <div>
    <VDialog v-model="isViewProductsDialogue" max-width="600">
      <VCard>
        <div class="pa-6 d-flex align-center">
          <h5 class="text-h5">Order Details - {{ selectedOrder.transaction_id }}</h5>
          <VSpacer />
          <VBtn
            variant="tonal"
            class="rounded"
            size="32"
            @click="isViewProductsDialogue = false"
          >
            <VIcon size="18" icon="tabler-x" />
          </VBtn>
        </div>
          <!-- Display the products from selectedOrder.products -->
          <!-- <div v-for="product in selectedOrder.order_details" :key="product.product_id">
            {{ product.product_name }} - {{ product.unit_price }}AED
          </div> -->

        <PerfectScrollbar>
          <VCard height="40vh" style="overflow-y: auto;" flat>
            <VCardText class="pb-12">
              <VRow v-for="product in selectedOrder.order_details" :key="product.product_id">
                <VCol cols="3">
                  <img @error="$event.target.src = ''"  :src="resolveProductImage(product.product_id) || ''"  class="cart-item-image" />
                </VCol>
                <VCol cols="9">
                  <VRow>
                    <VCol cols="12">
                      <div class="cart-item-details">
                        <div>
                          <strong>{{ product.product_name }}</strong>
                        </div>
                        <div>Code: {{ product.product_code }}</div>
                        <div>QTY: {{ product.qty }}</div>
                        <div>Unit: {{ product.unit_name }}</div>
                        <div>Price: {{ product.unit_price }} AED</div>
                        <VChip class="price-tag" label color="primary">Total: {{ product.line_total }} AED</VChip>
                      </div>
                    </VCol>
                  </VRow>
                </VCol>
                <VCol cols="3" class="text-center">
                
                </VCol>
              </VRow>
            </VCardText>
          </VCard>
        </PerfectScrollbar>
      </VCard>
    </VDialog>
    <VRow>
        <VCol cols="12">
          <VCard title="ORDERS LIST">
            <!-- 👉 Filters -->

            <VDivider />

            <VCardText class="d-flex flex-wrap py-4 gap-4">
              <div
                class=""
                style="min-width: 80px;"
              >
                <VSelect
                  v-model="itemsPerPage"
                  density="compact"
                  variant="outlined"
                  :items="[
                    { value: 10, title: '10' },
                    { value: 25, title: '25' },
                    { value: 50, title: '50' },
                    { value: 100, title: '100' },
                  ]"
                  @update:model-value="itemsPerPage = parseInt($event, 10)"
                />
              </div>

              <VSpacer />

              <div class="app-user-search-filter d-flex align-center flex-wrap gap-4">
                <!-- 👉 Search  -->
                <div style="width: 10rem;">
                  <VTextField
                    v-model="searchQuery"
                    placeholder="Search"
                    density="compact"
                  />
                </div>
              </div>
            </VCardText>

            <VCardText>
              <VRow>
                <VCol>
                  <VDataTableServer
                    v-model:items-per-page="itemsPerPage"
                    v-model:page="page"
                    :items="filteredOrders"
                    :items-length="requests.length"
                    :headers="headers"
                    class="text-no-wrap"
                    @update:options="updateOptions"
                  >
                    <template #item.id="{ item, index }">
                      {{ (index + 1) + (itemsPerPage * (page - 1)) }}
                      <!-- {{ item.order_details }} -->
                    </template>


                    <!-- Actions -->
                    <template #item.actions="{ item }">
                      <VBtn
                        icon
                        size="x-small"
                        color="primary"
                        variant="text"
                        @click="viewProducts(item)"
                      >
                        <VIcon
                          size="22"
                          icon="tabler-eye"
                        />
                      </VBtn>
                    </template>

                    <!-- pagination -->
                    <template #bottom>
                      <VDivider />
                      <div class="d-flex align-center justify-sm-space-between justify-center flex-wrap gap-3 pa-5 pt-3">
               

                        <VPagination
                          v-model="page"
                          :length="Math.ceil(requests.length / itemsPerPage)"
                          :total-visible="5"
                        >
                          <template #prev="slotProps">
                            <VBtn
                              variant="tonal"
                              color="default"
                              v-bind="slotProps"
                              :icon="false"
                            >
                              Previous
                            </VBtn>
                          </template>

                          <template #next="slotProps">
                            <VBtn
                              variant="tonal"
                              color="default"
                              v-bind="slotProps"
                              :icon="false"
                            >
                              Next
                            </VBtn>
                          </template>
                        </VPagination>
                      </div>
                    </template>
                  </VDataTableServer>
                </VCol>
              </VRow>
            </VCardText>
          </VCard>
        </VCol>
    </VRow>
  </div>
</template>
