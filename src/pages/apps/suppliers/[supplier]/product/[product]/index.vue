<script setup>
import { useDemoVendorStore } from '@/store/demoVendorStore';
import { useUiStore } from '@/store/uiStore';
import { onBeforeMount } from 'vue';
import { useRoute, useRouter } from 'vue-router';
const demoVendorStore = useDemoVendorStore();

const uiStore = useUiStore()
const route = useRoute()
const router = useRouter()
const supplier_id = route.params.supplier
const product_id = route.params.product

onBeforeMount(() => {
  const sPageRefreshed = performance.navigation.type === 1
  if (sPageRefreshed) {
    // Fetch data only when the page is refreshed
    uiStore.getSuppliers()
    demoVendorStore.fetchProducts(business_id, supplier_id)
  }
})



const userData = JSON.parse(localStorage.getItem("userData"));
const business_id = userData.business.id

demoVendorStore.fetchProducts(business_id, supplier_id)
const products = computed(() => demoVendorStore.$state.products)
const suppliers = computed(() => uiStore.$state.suppliers)

const currentSupplier = computed(() => {
  return suppliers.value.find((item) => item.auth_id == supplier_id) || {}
})

const product = computed(() => {
  return products.value.find((item) => item.id == product_id) || {}
})

function calc_stock(product) {
  const stock = JSON.parse(product.stock) || []
  let sum = 0;
  stock.forEach((item) => {
    sum = sum || item.weight
  })
  return sum ? sum + product.unit_name : 'Out of Stock'
}
</script>

<template>
  <VRow>
    <VCol
      cols="12"
      relative
    >
      <VCard
        v-if="product.name"
        title="Product"
        class="mt-1"
      >
        <VCardText>
          <VRow>
            <VCol cols="6" lg="6">
              <div class="d-flex pr-2">
                <div class="text-xs text-white" style="background-color: #f76726; border-radius: 4px;">&nbsp; Random Special &nbsp;</div>
              </div>
              <VImg
                class="mt-4 text-center"
                :src="product.image"
              />
            </VCol>
            <VCol cols="6" lg="6">
              <VCardText>
                <h3>{{ product.name }}</h3>
                <h4 class="mt-5 pt-5">
                  <span class="text-error"> AED {{ product.price }} </span>
                  <span class="text-xs"> (Inclusive all VAT)</span>
                </h4>
                <h5>
                  <span style="text-decoration: line-through">AED {{ product.packing_price || product.price + 2 }}</span>
                  <span class="text-xs text-white ml-3" style="background-color: #d8345f;">&nbsp; {{ Math.round(100 - 100 * product.price / (product.packing_price || product.price + 2)) }}% Off &nbsp;</span>
                </h5>
              </VCardText>
              <VCardText>
                <h6>Size: {{ calc_stock(product) }}</h6>
              </VCardText>
              <VCardText v-if="product.expiry_date">
                <VCard>
                  <VRow class="mt-1 mb-1">
                    <VCol cols="2">
                      <VIcon icon="tabler-clock" class="ml-5"</VIcon>
                    </VCol>
                    <VCol cols="10">
                      <h6>Self Life</h6>
                      <h6 class="text-success">{{ product.expiry_date || 'None'}}</h6>
                    </VCol>
                  </VRow>
                </VCard>
              </VCardText>
              
              <VCardText>
                <VBtn
                  color="success"
                  size="small"
                  class="w-100"
                >
                  ADD TO CART
                </VBtn>
              </VCardText>
            </VCol>
          </VRow>
          <VRow>
            <VCol cols="12" lg="12">
              <VDivider />
              <VCardText>
                <h4>Description</h4>
                <span class="text-sm">{{ product.get_supplier_details.description }}</span>
              </VCardText>
              <VDivider />
              <VCardText>
                <h4>Disclaimer</h4>
                <h5>{{ product.disclaimer }}</h5>
              </VCardText>
            </VCol>
          </VRow>
        </VCardText>
      </VCard>
    </VCol>
  </VRow>
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
</style>
