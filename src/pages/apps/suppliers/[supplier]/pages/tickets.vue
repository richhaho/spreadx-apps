<script setup>

import { useUiStore } from "@/store/uiStore";
import { onMounted, ref } from "vue";
import { useRoute } from 'vue-router';
const uiStore = useUiStore();
const itemsPerPage = ref(10)
const searchQuery = ref('')
const page = ref(1)
const route = useRoute();
const supplier_id = route.params.supplier;
uiStore.getTickets(supplier_id);
onMounted(() => uiStore.getTickets(supplier_id));
const requests = computed(() => uiStore.$state.tickets)
console.log(requests);
const headers = [
  {
    title: '#',
    key: 'id',
  },

  {
    title: 'SUPPLIER NAME',
    key: 'supplier_name',
  },
  {
    title: 'ISSUE NO',
    key: 'issue_no',
  },
  {
    title: 'CREATED DATE',
    key: 'created_at',
  },
  {
    title: 'STATUS',
    key: 'status',
  },
  // {
  //   title: 'ACTIONS',
  //   key: 'actions',
  //   sortable: false,
  //   align: "center",
  // },
]
</script>

<template>
  <dev>
    <VRow>
        <VCol cols="12">
          <VCard title="TICKETS LIST">
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
                    :items="requests"
                    :items-length="totalRequests"
                    :headers="headers"
                    class="text-no-wrap"
                    @update:options="updateOptions"
                  >
                    <template #item.id="{ item, index }">
                      {{ (index + 1) + (itemsPerPage * (page - 1)) }}
                      <!-- {{ item.order_details }} -->
                    </template>


                    <!-- Actions -->
                    <!-- <template #item.actions="{ item }">
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
                    </template> -->

                    <!-- pagination -->
                    <template #bottom>
                      <VDivider />
                      <div class="d-flex align-center justify-sm-space-between justify-center flex-wrap gap-3 pa-5 pt-3">
               

                        <VPagination
                          v-model="page"
                          :length="Math.ceil(totalRequests / itemsPerPage)"
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
  </dev>
</template>
