<script setup>
import { useRouter } from 'vue-router';

import axios_lite from '@/plugins/axios_lite';
import { useDemoVendorStore } from '@/store/demoVendorStore';
import { useUiStore } from '@/store/uiStore';
import avatar1 from '@images/avatars/avatar-1.png';
import avatar2 from '@images/avatars/avatar-2.png';
import avatar3 from '@images/avatars/avatar-3.png';
import avatar4 from '@images/avatars/avatar-4.png';
import { onMounted, ref } from 'vue';

const v1 =
  import.meta.env.VITE_API_V1
const v2 =
  import.meta.env.VITE_API_V2

const uiStore = useUiStore();

const demoVendorStore = useDemoVendorStore();
const qlineUrl = import.meta.env.VITE_API_V1;
const selectedVendor = ref(null);
const router = useRouter();
const vendorOptions = ref([]);
const getVendorsProducts = () => {
  axios_lite.get('v1/get_vendors_products').then((response) => {
    console.log(response.data.products)
    demoVendorStore.$state.products = response.data.products;
    const newOptions = response.data.products.map(product => ({
      title: product.get_supplier_details.name,
      value: product.get_supplier_details.id,
    }));

    // Create a Set to track unique values
    const uniqueValues = new Set(vendorOptions.value.map(option => option.value));

    // Insert only unique values
    newOptions.forEach(option => {
      if (!uniqueValues.has(option.value)) {
        vendorOptions.value.push(option);
        uniqueValues.add(option.value);
      }
    });
  });
}

const updateFilteredProducts = () => {
  if (selectedVendor.value) {
    const selectedVendorId = selectedVendor.value;
    console.log(selectedVendorId)
    // Filter demoVendorStore.$state.products based on the selected vendor's ID
    filteredProducts.value = demoVendorStore.$state.products.filter(product => {
      // console.log(product.get_supplier_details.name)
      return product.get_supplier_details.name === selectedVendorId;
    });
  }
};
watch(() => selectedVendor.value, updateFilteredProducts);

onMounted(() => {
  getVendorsProducts();
});


// const vendorOptions = 
const filteredProducts = ref([]);

// const getDemoProducts = () => {
//   if (localStorage.getItem("customer_id")){
//     axios_koch.get(('v1/get_customer_price'), {
//     // headers: {
//     //   'Access-Control-Allow-Origin': "*",
//     //   'authId': localStorage.getItem("authId"),
//     //   'authToken': localStorage.getItem("authToken")
//     // },
//     params: {
//       customer_id: localStorage.getItem("customer_id")
//     }
//     }).then((response) => {
//         console.log(response.data.product_lists)
//         demoVendorStore.$state.products = response.data.product_lists
//       ;
//     })
//   }
// };
// getDemoProducts();
uiStore.$subscribe(() => {

});
demoVendorStore.$subscribe(() => {

});
const getCartDetails = (() => {
  uiStore.$state.showCartDetails = !uiStore.$state.showCartDetails;
  
});
const avatars = [
  avatar1,
  avatar2,
  avatar3,
  avatar4,
]
const products = computed(() => demoVendorStore.$state.products);
const isCardDetailsVisible = ref(false);
const requestedProduct = ref({
  'id': 0,
  'qty': 1,
  'image': '',
  'name': '',
  'code': ''
});

function getHighestFactorPacking(product) {
  return product.packing.reduce((maxPacking, currentPacking) => {
    return currentPacking.factor > maxPacking.factor ? currentPacking : maxPacking;
  }, { factor: -Infinity });
}


async function addToCart(product) {
  const highestFactorPacking = getHighestFactorPacking(product);
  requestedProduct.value = {
    'id': product.product_id,
    'qty': 1,
    'image': product.product_image,
    'name': JSON.parse(product.product_name).en,
    // 'code': product.product_code,
    "price_without_vat": highestFactorPacking.price,
    "vat": product.vat,
    "unit_id": highestFactorPacking.unit_id,
    "unit_name": highestFactorPacking.unit_name,
    "price": highestFactorPacking.price + (highestFactorPacking.price * (product.vat / 100)),
  }
  showQuantityButtons.value = true;
  // Check if the product is already in the cart
  const existingProductIndex = uiStore.$state.cartItems.findIndex(
    (item) => item.id === requestedProduct.value.id
  );

  if (existingProductIndex !== -1) {
    uiStore.$state.cartItems[existingProductIndex].qty += requestedProduct.value.qty;
  } else {
    uiStore.$patch({ cartItems: [...uiStore.$state.cartItems, { ...requestedProduct.value }] });
  }
  saveCartToLocalStorage();
  uiStore.$state.showCartDetails = true;
}
async function removeFromCart(product) {
  // Check if the product is in the cart
  const existingProductIndex = uiStore.$state.cartItems.findIndex(
    (item) => item.id === product.id
  );

  if (existingProductIndex !== -1) {
    // Remove the item from the cart
    uiStore.$state.cartItems.splice(existingProductIndex, 1);
    saveCartToLocalStorage();
  }
}
function saveCartToLocalStorage() {
  localStorage.setItem('cartItems', JSON.stringify(uiStore.$state.cartItems));
}
function loadCartFromLocalStorage() {
  const storedCartItems = localStorage.getItem('cartItems');
  if (storedCartItems) {
    // If there are items in localStorage, load them into the cart
    uiStore.$patch({ cartItems: JSON.parse(storedCartItems) });
  }
}
const decrementCartItem=((item)=>{

  const newCart=uiStore.$state.cartItems.map((cartItem)=>{
    if(cartItem.id===item.id && cartItem.qty > 1){
      return{...cartItem, qty: cartItem.qty - 1};
    }else{
      return cartItem;
    }
  })
  uiStore.$patch({cartItems :newCart});
  saveCartToLocalStorage();
})
const incrementCartItem=((item)=>{

  const newCart=uiStore.$state.cartItems.map((cartItem)=>{
    if(cartItem.id===item.id){
      return{...cartItem, qty: cartItem.qty + 1};
    }else{
      return cartItem;
    }
  })
  uiStore.$patch({cartItems :newCart});
  saveCartToLocalStorage();
})
const snackBarMessage = ref();
const snackBarColor = ref();
function handleCheckout() {
  uiStore.$state.showCartDetails = false;
  router.push('checkout');
}
function calculateTotalAmount(){
  let total = 0;

  // Loop through the cart items and calculate the total amount
  for (const cartItem of uiStore.$state.cartItems) {
    total += cartItem.qty * cartItem.price;
  }

  return total.toFixed(2); 
}

const itemsPerPage = ref(10)
const searchQuery = ref('')
const page = ref(1)
const tableHeaders = [
{
    title: '#',
    key: 'id',
  },

  {
    title: 'PRODUCT NAME',
    key: 'name',
  },

  {
    title: 'PRODUCT CODE',
    key: 'description',
  },
 
  {
    title: 'PRICE',
    key: 'price',
  },

  {
    title: 'PRODUCT IMAGE',
    key: 'image',
  },
  {
    title: 'ACTIONS',
    key: 'actions',
    sortable: false,
    align: "center",
  },
];
const isGridView = ref(true);
const showQuantityButtons = ref(false);
// const defaultImage = "/logo.jpg";
</script>
<style scoped>
.product-card {
  margin-block-end: 20px;
  transition: box-shadow 0.3s ease-in-out;
}

.product-card:hover {
  box-shadow: 0 4px 8px rgba(0, 0, 0, 40%);
}

.product-card .price-tag {
  font-size: 16px;
}

.cart-item-image {
  block-size: auto;
  inline-size: 100%;
  max-inline-size: 80px;
}

.total-amount {
  position: fixed;
  font-weight: bold;
  inset-block-end: 20px;
  inset-inline-end: 30px;
}

.cart-item-details {
  margin-block-start: 10px;
}

</style>
<template>
<div>
  <VNavigationDrawer
    permanent
    width="auto"
    location="end"
    class="scrollable-content"
    :model-value="uiStore.$state.showCartDetails"
  >
    <div class="pa-6 d-flex align-center">
      <h5 class="text-h5">CART</h5>
      <VSpacer />
      <VBtn
        variant="tonal"
        class="rounded"
        size="32"
        @click="uiStore.$state.showCartDetails = false"
      >
        <VIcon size="18" icon="tabler-x" />
      </VBtn>
    </div>

    <PerfectScrollbar :options="{ wheelPropagation: false }">
      <VCard height="85vh" style="overflow-y: auto;" flat>
        <VCardText class="pb-12">
          <VRow v-for="cartItem in uiStore.$state.cartItems" :key="cartItem.id">
            <VCol cols="3">
              <img :src="cartItem.image" alt="Product Image" class="cart-item-image" />
            </VCol>
            <VCol cols="9">
              <VRow>
                <VCol cols="12">
                  <div class="cart-item-details">
                    <div>
                      <strong>{{ cartItem.name }}</strong>
                    </div>
                    <div>Code: {{ cartItem.code }}</div>
                    <div>Price: {{ cartItem.price }} AED</div>
                    <VChip class="price-tag" label color="primary">Total: {{ cartItem.qty * cartItem.price }} AED</VChip>
                  </div>
                </VCol>
                <VCol cols="9">
                  <v-text-field
                    v-model="cartItem.qty"
                    name="name"
                    label="Quantity"
                    id="id"
                    prepend-inner-icon="tabler-minus"
                    append-inner-icon="tabler-plus"
                    @click:append-inner="incrementCartItem(cartItem)"
                    @click:prepend-inner="decrementCartItem(cartItem)"
                  ></v-text-field>
                </VCol>
                <VCol cols="3">
                  <VBtn icon @click="removeFromCart(cartItem)">
                    <VIcon icon="tabler-trash" />
                  </VBtn>
                </VCol>
              </VRow>
            </VCol>
            <VCol cols="3" class="text-center">
             
            </VCol>
          </VRow>
        </VCardText>
      </VCard>
      <VBtn
        style="inset-block-end: 10px;"
        fixed
        bottom
        right
        class="ma-6"
        @click="handleCheckout"
      >
        Checkout
      </VBtn>
      <div class="total-amount">
        Total: {{ calculateTotalAmount() }} AED
      </div>
    </PerfectScrollbar>
  </VNavigationDrawer>
  <VRow class="pa-6">
    <VCol cols="6" class="text-left">
      <h5 class="text-h5">
        SELECT PRODUCTS
      </h5>
    </VCol>
    <VCol cols="6" class="text-right"> 
      <VRow>
        <VCol
          cols="6"
          md="6"
        >
        <v-select
          v-model="selectedVendor"
          :items="vendorOptions"
          label="Select Supplier"
          clearable
          item-value="id"
          item-text="name"
          @change="updateProductsForSelectedVendor"
        />
        </VCol>
        <VCol
          cols="6"
          md="6"
        >
        <VBtnToggle v-model="isGridView" multiple>
          <VBtn icon @click="isGridView = true" :active="isGridView">
            <VIcon>mdi-view-grid</VIcon>
          </VBtn>
          <VBtn icon @click="isGridView = false" :active="!isGridView">
            <VIcon>mdi-view-list</VIcon>
          </VBtn>
        </VBtnToggle>
        </VCol>
         <!-- Add VSelect for vendor selection -->
      </VRow>

    </VCol>
  </VRow>

  <VRow v-if="isGridView">
    <VCol
      v-for="(product, index) in demoVendorStore.$state.products"
      :key="product.id"
      cols="12"
      sm="6"
      md="4"
      lg="2"
    >
      <VCard class="product-card">
        <VImg :src="product.image " alt="Product Image" height="" cover max-inline-size="100%" />
        <VCardBody>
          <VCardTitle>{{ JSON.parse(product.name).en }}</VCardTitle>
          <VCardText>{{ JSON.parse(product.name).en }}</VCardText>
          <VCardText>Supplier: {{ (product.get_supplier_details.name) }}</VCardText>
          <VRow align="center">
            <VCol cols="1"></VCol>
            <VCol cols="6">
              <VChip class="price-tag" label color="primary">AED {{ ((product).price + ((product).price * (product.vat / 100))).toFixed(2) }}</VChip>
            </VCol>
            <VCol cols="7">
              <VBtn @click="addToCart(product)" class="ma-2" color="primary" :loading="loading">
                Add To Cart
              </VBtn>
            </VCol>
          </VRow>
        </VCardBody>
      </VCard>
    </VCol>
  </VRow>
  <VRow v-if="!isGridView">
    <VDataTable
      :headers="tableHeaders"
      :items="demoVendorStore.$state.products.details"
      :search="searchQuery"
      :items-per-page="itemsPerPage"
    >
    <template v-slot:item="{ item, index }">
        <tr>
          <td>
            {{ (index + 1) }}
          </td>
          <td>{{ JSON.parse(item.name).en }}</td>
          <td>{{ item.description }}</td>
          <td>{{ getHighestFactorPacking(item).price }} AED</td>
          <td><img :src="item.image" alt="Product Image" class="cart-item-image" /></td>
          <td>
            <template v-if="!item.showQuantityButtons">
              <VBtn @click="addToCart(item)" class="ma-2" color="primary" :loading="loading">
                Add To Cart
              </VBtn>
            </template>
            <!-- <template v-if="item.showQuantityButtons">
              <VRow align="center">
                <VCol cols="3">
                  <v-btn icon @click="decrementCartItem(item)">
                    <v-icon>mdi-minus</v-icon>
                  </v-btn>
                </VCol>
                <VCol cols="6">
                  <v-text-field v-model="item.qty" dense hide-details prepend-inner-icon="mdi-plus" append-inner-icon="mdi-minus"></v-text-field>
                </VCol>
                <VCol cols="3">
                  <v-btn icon @click="incrementCartItem(item)">
                    <v-icon>mdi-plus</v-icon>
                  </v-btn>
                </VCol>
              </VRow>
            </template> -->
          </td>
        </tr>
      </template>

      <!-- </template> -->
    </VDataTable>
  </VRow>
</div>
</template>

<style lang="scss" scoped>
.avatar-center {
  position: absolute;
  border: 3px solid rgb(var(--v-theme-surface));
  inset-block-start: -2rem;
  inset-inline-start: 1rem;
}

// membership pricing
.member-pricing-bg {
  position: relative;
  background-color: rgba(var(--v-theme-on-surface), var(--v-hover-opacity));
}

.membership-pricing {
  sup {
    inset-block-start: 9px;
  }
}

.v-btn {
  transform: none;
}
</style>
