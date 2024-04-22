<script setup>
import { useDemoVendorStore } from '@/store/demoVendorStore';
import { useUiStore } from '@/store/uiStore';
import { onBeforeMount } from 'vue';
import { useRoute, useRouter } from 'vue-router';
const demoVendorStore = useDemoVendorStore();

const uiStore = useUiStore()
const route = useRoute()
const router = useRouter()
const category_id = route.params.category

onBeforeMount(() => {
  const sPageRefreshed = performance.navigation.type === 1
  if (sPageRefreshed) {
    // Fetch data only when the page is refreshed
    uiStore.getSuppliers()
  }
  console.log(category_id)
})


const userData = JSON.parse(localStorage.getItem("userData"));
const business_id = userData.business.id

demoVendorStore.fetchAllProducts(business_id)
const products = computed(() => demoVendorStore.$state.products)
const my_products = computed(() => category_id == 'all' ? products.value : products.value.filter((item) => JSON.parse(item.category).id == category_id))
const categories = computed(() => products.value.map((item) => item.category).filter((value, index, array) => array.indexOf(value) === index).map((item) => JSON.parse(item)))
const current_category = computed(() => categories.value.find((item) => item.id == category_id))
const countries = [
  'UAE',
  'India',
  'Egypt',
  'Kenya',
  'Colombia',
  'GCC',
  'South Africa',
  'Thailand',
  'China',
  'Iran',
  'Saudi Arabia',
  'Holland',
  'Turkey',
  'Vietnam',
  'Australia',
  'Chile',
  'Ecuador',
  'Pakistan',
  'Palestine'
];
const tags = [
  'Premium By Air',
  'By Air',
  'RIPEN AT HOME',
  'Premium Quality',
  'Ripen at Home',
  'By Air! Ripe at home',
  'By Air! Ripen at Home',
  'Ripen at home',
  'STEAL DEAL',
  'Best for Salads.',
  'DETOXIFIER',
  'Exp: March 2024',
  'Expiry - 30 April',
  'Ideal for Cooking',
  'RIPEN AT HOME (RAW)',
  'Ready to eat'
];
function calc_stock(product) {
  return product.stock_availability ? product.stock_availability + product.unit_name : 'Out of Stock'
}
function update_cart(product) {
  const products = JSON.parse(localStorage.getItem('cart') || '[]')
  const index = products.findIndex((item) => item.id === product.id)
  if (index < 0) {
    products.push(product)
  } else if (!product.cart) {
    products.splice(index, 1)
  } else {
    products.splice(index, 1, product)
  }
  localStorage.setItem('cart', JSON.stringify(products))
  uiStore.$state.cartItems = products
}
function toCategory(category_id) {
  location.href = `/apps/categories/${category_id}`
}

</script>

<template>
  <VRow>
    <VCol
      cols="12"
      relative
      sm="4"
      md="3"
      lg="3"
    >
      <VList title="Category" class="list">
        <h4 class="mt-2 mb-2 ml-4">Categories</h4>
        <VDivider />
        <VListItem
          v-for="category in categories"
          active-color="success"
          variant="text"
          :title="category.name"
          :value="category.id"
          @click="toCategory(category.id)"
        />
      </VList>
      <VSwitch
        class="mt-5 pl-3"
        label="Express Delivery"
        color="warning"
        style="background-color: #def8e3; border-radius: 5px;"
      />
      <VList title="Category" class="mt-5 list">
        <h4 class="mt-2 mb-2 ml-4">Origin</h4>
        <VDivider />
        <VListItem
          v-for="country in countries"
        >
          <template #prepend>
            <VCheckbox :label="country" :value="true"/>
          </template>
        </VListItem>
      </VList>
      <div class="d-flex justify-space-between pl-3 pr-3 pt-1">
        <VBtn color="success">Apply</VBtn>
        <VBtn color="success" variant="tonal">Reset</VBtn>
      </div>

      <VList title="Tags" class="mt-5 list">
        <h4 class="mt-2 mb-2 ml-4">Tags</h4>
        <VDivider />
        <VListItem
          v-for="tag in tags"
        >
          <template #prepend>
            <VCheckbox :label="tag" :value="true"/>
          </template>
        </VListItem>
      </VList>
      <div class="d-flex justify-space-between pl-3 pr-3 pt-1">
        <VBtn color="success">Apply</VBtn>
        <VBtn color="success" variant="tonal">Reset</VBtn>
      </div>
    </VCol>
    <VCol
      cols="12"
      relative
      sm="8"
      md="9"
      lg="9"
    >
      <VCard>
        <VRow class="mt-3 mb-1">
          <VCol class="d-flex justify-space-between">
            <span class="ml-3">{{ current_category?.name }}</span>
            <div style="width: 20rem;" class="pr-5">
              <VTextField
                v-model="searchQuery"
                icon="tabler-search"
                placeholder="Best Sellers"
                density="compact"
                @change="search()"
              >
                <template #prepend-inner>
                  <VIcon
                    icon="tabler-search"
                    size="23"
                  />
                </template>
              </VTextField>
            </div>
          </VCol>
        </VRow>
        <VDivider />
        <VRow>
          <template v-for="product in my_products">
            <VCol
              class="mt-3" cols="6" sm="4" md="4" lg="4" relative
            >
              <VCard
                class="mb-5 mr-3 ml-3"
              >
                <div class="d-flex pr-2">
                  <div class="text-xs text-white" style="background-color: #f76726; border-radius: 4px;">&nbsp; Random Special &nbsp;</div>
                </div>
                <div class="d-flex justify-end pr-2" style="margin-top: -16px">
                  <div class="text-xs text-white" style="background-color: #d8345f;">&nbsp; {{ Math.round(100 - 100 * product.price / (product.packing_price || product.price + 2)) }}% Off &nbsp;</div>
                </div>
                <RouterLink :to="`/apps/suppliers/${supplier_id}/product/${product.id}`">
                  <VImg
                    class="mt-4 text-center"
                    :src="product.image"
                  />
                </RouterLink>
                <div class="d-flex justify-end pr-1 mt-1" >
                  <div class="border">
                    <VBtn
                      color="success"
                      size="x-small"
                      class="text-high-emphasis ms-n1 mr-3"
                      style="width: 20px; height: 30px;"
                      v-if="product.cart"
                      @click="() => { product.cart--; update_cart(product) }"
                    >
                      <VIcon
                        size="22"
                        icon="tabler-minus"
                      />
                    </VBtn>
                    <span v-if="product.cart" class="mr-4 mt-1">{{product.cart}}</span>
                    <VBtn
                      color="success"
                      size="x-small"
                      class="text-high-emphasis ms-n1"
                      style="width: 20px; height: 30px;"
                      @click="() => { product.cart = (product.cart || 0) + 1; update_cart(product) }"
                    >
                      <VIcon
                        size="22"
                        icon="tabler-plus"
                      />
                    </VBtn>
                  </div>
                </div>
                <VCardText class="product-name">
                  <h5 class="text-center">{{ product.name }}</h5>
                </VCardText>
                <VCardText>
                  <h6 class="text-center" style="text-decoration: line-through">
                    AED {{ product.packing_price || product.price + 2 }}
                  </h6>
                  <h6 class="text-error text-center">AED {{ product.price }}</h6>
                </VCardText>
                <VCardText class="d-flex">
                  <div class="pt-1 pb-1 w-100 text-center" style="background-color: #def8e3; border-radius: 5px;">
                    <h6>{{ calc_stock(product) }}</h6>
                  </div>
                </VCardText>
              </VCard>
            </VCol>
          </template>
        </VRow>
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

.product-item {
  float: left;
  width: 220px;
}
.carousel-size {
  height: 200px;
}
.product-name {
  height: 80px;
}
@media only screen and (max-width: 600px) {
  .product-item {
    width: 120px;
  }
  .product-name {
    height: 120px; line-height: 90% !important;
  }
}
.list {
  height: 300px; overflow-y: scroll;
}
</style>
