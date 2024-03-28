<script setup>
import axios_lite from '@/plugins/axios_lite';
import { useDemoVendorStore } from '@/store/demoVendorStore';
import { useRoute, useRouter } from 'vue-router';
import SupplierCart from './pages/cart.vue';
import SupplierDashboard from './pages/dashboard.vue';
import SupplierOrderLIst from './pages/order_list.vue';
import SupplierProducts from './pages/products.vue';
import SupplierPromotions from './pages/promotions.vue';
const route = useRoute();
const router = useRouter();
const isProductsTabActive = computed(() => route.params.tab === 'products');
const demoVendorStore = useDemoVendorStore();
const price = ref(0);

const applyFilterOffer = (event, offer) => {
  const isChecked = event.target.checked;
  if (isChecked) {
    demoVendorStore.setNewOffer(offer)
  } else {
    demoVendorStore.setNewOffer('');
  }
}
const applyFilterCategory = (event, category) => {
  const isChecked = event.target.checked;
  if (isChecked) {
    demoVendorStore.setNewCategory(category)
  } else {
    demoVendorStore.setNewCategory('');
  }
}
const applyFilterBrand = (event, brand) => {
  const isChecked = event.target.checked;
  if (isChecked) {
    demoVendorStore.setNewbrand(brand)
  } else {
    demoVendorStore.setNewbrand('');
  }
}
const applyFilterPrice = () => {  
  demoVendorStore.setNewPrice(price.value)
}
const activeTab = computed({
  get: () => route.params.tab,
  set: () => route.params.tab,
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
    title: 'Promotions',
    icon: 'tabler-discount-2',
    tab: 'promotions',
    to: '/apps/suppliers/' + supplier_id + '/promotions'
  },
  {
    title: 'Products',
    icon: 'tabler-user-check',
    tab: 'products',
    to: '/apps/suppliers/' + supplier_id + '/products'
  },

  {
    title: 'Cart',
    icon: 'tabler-shopping-cart',
    tab: 'cart',
    to: '/apps/suppliers/' + supplier_id + '/cart'
  },
]

const productsOffers = ref([]);
const productsBrand = ref([]);
const productsCategory = ref([]);
const getVendorsProducts = () => {
  // axios_lite.get('v1/get_vendors_products',{
  //   params: {

  //     supplier_id: supplier_id
  //   }
  // }).then((response) => {
  //   demoVendorStore.$state.products = response.data.products;
  //   demoVendorStore.$state.products.forEach(product => {
  //     product.parsedName = typeof product.name == "string" ? product.code + " | " + product.name :  product.code + " | " + JSON.parse(product.name).en;
      
  //   });
  //   const uniqueOffers = new Set(demoVendorStore.$state.products
  //     .filter(product => product.offer !== undefined && product.offer !== null)
  //     .map(product => product.offer));
  //   const uniqueCategory = new Set(demoVendorStore.$state.products
  //     .filter(product => product.category !== undefined && product.category !== null)
  //     .map(product => product.category));
  //   const uniqueBrand = new Set(demoVendorStore.$state.products
  //     .filter(product => product.brand !== undefined && product.brand !== null)
  //     .map(product => product.brand));
      
  //   // Convert Set to array and assign it to productsOffers
  //   productsOffers.value = [...uniqueOffers];
  //   productsBrand.value = [...uniqueBrand];
  //   productsCategory.value = [...uniqueCategory];
  // });
}

const minPrice = computed(() => {
  let min = Infinity; // Set initial min value to Infinity
  filteredProductsAll.value.forEach(product => {
    if (product.price < min) {
      min = product.price; // Update min if current product price is less
    }
  });
  return min;
});

const maxPrice = computed(() => {
  let max = -Infinity; // Set initial max value to -Infinity
  filteredProductsAll.value.forEach(product => {
    if (product.price > max) {
      max = product.price; // Update max if current product price is greater
    }
  });
  return max;
});

onMounted(() => {
  getVendorsProducts();
});
const filteredProductsAll = computed(() => {
  return demoVendorStore.$state.products.map(product => {
    const filteredProduct = { ...product };
    filteredProduct.attributes = processAttributes(product.attributes);
    return filteredProduct;
  });
});
const capitalizeFirstLetter = (string) => {
  return string.charAt(0).toUpperCase() + string.slice(1);
};
const processAttributes = (attributes) => {
    if (!attributes) return [];
    return attributes.split(', ').map(attribute => {
      const attributeName = capitalizeFirstLetter(attribute.replace(/_/g, ' '));
        return {
            name: attributeName,
            color: attribute
        };
    });
};

</script>
<style>
#filterbar {
  padding: 15px;
  border: 1px solid #dee2e6;
  border-radius: 5px;
  background-color: #f8f9fa;
}

.box {
  margin-block-end: 20px;
}

.box-label {
  font-weight: bold;
}

.tick {
  display: flex;
  align-items: center;
  margin-block-end: 5px;
}

.btn-group .btn {
  border-radius: 0;
}

.multi-range-slider {
  position: relative;
}

.multi-range-slider input[type="range"] {
  overflow: hidden;
  padding: 0;
  border: none;
  border-radius: 5px;
  margin: 0;
  appearance: none;
  background: #d3d3d3;
  block-size: 10px;
  inline-size: 100%;
  outline: none;
}

.multi-range-slider input[type="range"]::-webkit-slider-thumb {
  position: relative;
  z-index: 3;
  border: 2px solid #fff;
  border-radius: 50%;
  appearance: none;
  background: #007bff;
  block-size: 20px;
  cursor: pointer;
  inline-size: 20px;
}

.multi-range-slider input[type="range"]::-moz-range-thumb {
  position: relative;
  z-index: 3;
  border: 2px solid #fff;
  border-radius: 50%;
  background: #007bff;
  block-size: 20px;
  cursor: pointer;
  inline-size: 20px;
}

.multi-range-slider .slider {
  position: absolute;
  block-size: 10px;
  inset-block-start: 0;
  inset-inline: 15px;
}

.multi-range-slider .slider .track {
  position: absolute;
  z-index: 1;
  background: #007bff;
  block-size: 100%;
}

.multi-range-slider .slider .range {
  position: absolute;
  z-index: 2;
  background: #fff;
  block-size: 100%;
}

.multi-range-slider .slider .thumb {
  position: absolute;
  z-index: 3;
  border: 2px solid #fff;
  border-radius: 50%;
  background: #007bff;
  block-size: 20px;
  cursor: pointer;
  inline-size: 20px;
}

.multi-range-slider .slider .thumb.left {
  inset-inline-start: -10px;
}

.multi-range-slider .slider .thumb.right {
  inset-inline-end: -10px;
}

.box .collapse {
  border-block-start: 1px solid #dee2e6;
  padding-block-start: 10px;
}

.btn-group .btn {
  margin-inline-end: 5px;
}

</style>
<template>
  <div>

    <VRow>
      <VCol cols="12"
        sm="4"
        md="2">
        <VTabs v-model="activeTab"
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
          <VCard v-if="isProductsTabActive" style="margin-top: 20px;">
            <div id="filterbar" class="collapse">
              <div class="box border-bottom">
                  <div class="box-label text-uppercase d-flex align-items-center">
                      OFFERS
                  </div>
                  <div class="my-1" v-for="(offer, index) in productsOffers" :key="index">
                      <label class="tick">
                          <input type="checkbox" :value="offer" @change="applyFilterOffer($event, offer)">
                          &nbsp;
                          {{ offer }}
                      </label>
                  </div>
              </div>
              <div class="box border-bottom">
                  <div class="box-label text-uppercase d-flex align-items-center">
                      CATEGORY
                  </div>
                  <div id="inner-box" class="collapse mt-2 mr-1">
                      <div class="my-1" v-for="(category, index) in productsCategory" :key="index">
                          <label class="tick">
                            <input type="checkbox" :value="category" @change="applyFilterCategory($event, category)">
                            &nbsp;
                            {{category}}  
                          </label>
                      </div>
                  </div>
              </div>
              <div class="box border-bottom">
                  <div class="box-label text-uppercase d-flex align-items-center">
                    BRAND
                  </div>
                  <div id="inner-box2" class="collapse mt-2 mr-1" v-for="(brand, index) in productsBrand" :key="index">
                    <label class="tick">
                      <input type="checkbox" :value="brand" @change="applyFilterBrand($event, brand)">
                      &nbsp;
                      {{ brand }}  
                    </label>   
                  </div>
              </div>
              <div class="box border-bottom">
                <div class="box-label text-uppercase d-flex align-items-center">
                    {{ minPrice }}
                    <span class="ml-auto">
                        <span id="max-price" class="font-weight-bold"></span> {{ maxPrice }}
                    </span>
                </div>
                <div class="collapse" id="price">
                    <div class="middle">
                        <div class="multi-range-slider"> 
                          <input type="range" id="input-right" v-model="price" @input="applyFilterPrice" :min="minPrice" :max="maxPrice">
                            <div class="slider">
                                <div class="track"></div>
                                <div class="range"></div>
                            </div>
                        </div>
                        <div class="mt-2">
                            <!-- This is where the dynamic price range will be displayed -->
                        </div>
                    </div>
                </div>
            </div>

            </div>
          </VCard>
        </VTabs>
      </VCol>
      <VCol cols="12"
        sm="8"
        md="10">

        <VWindow v-model="activeTab"
          class="mt-5 disable-tab-transition"
          :touch="false">
          <!-- Cart -->
          <VWindowItem value="dashboard">
            <SupplierDashboard />
          </VWindowItem>

          
          <VWindowItem value="cart">
            <SupplierCart />
          </VWindowItem>

          <!-- Order List -->

          <!-- Products -->
          <VWindowItem value="products">
            <SupplierProducts />
          </VWindowItem>

          <VWindowItem value="promotions">
            <SupplierPromotions />
          </VWindowItem>
          <!-- <VWindowItem> -->
            <!-- </VWindowItem> -->
          <VWindowItem value="order_list">
            <SupplierOrderLIst/>
          </VWindowItem>
        </VWindow>


        

      </VCol>
    </VRow>




  </div>
</template>
