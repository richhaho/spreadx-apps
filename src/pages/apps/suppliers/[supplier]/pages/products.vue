<script setup>
import axios_lite from '@/plugins/axios_lite';
import { useDemoVendorStore } from '@/store/demoVendorStore';
import { useUiStore } from '@/store/uiStore';
import avatar1 from '@images/avatars/avatar-1.png';
import avatar2 from '@images/avatars/avatar-2.png';
import avatar3 from '@images/avatars/avatar-3.png';
import avatar4 from '@images/avatars/avatar-4.png';
import { computed, getCurrentInstance, onMounted, ref, watch } from 'vue';
import { QrcodeStream } from "vue-qrcode-reader";
import { useRoute, useRouter } from 'vue-router';
const v1 = import.meta.env.VITE_API_V1
const v2 =  import.meta.env.VITE_API_V2

const filteredProductsTabs = ref([]);
const uiStore = useUiStore();
const demoVendorStore = useDemoVendorStore();
const qlineUrl = import.meta.env.VITE_API_V1;
const selectedVendor = ref(null);
const router = useRouter();
const vendorOptions = ref([]);
const route = useRoute();
const supplier_id = route.params.supplier;
const loadingProducts = ref(true);

const getVendorsProducts = () => {
  axios_lite.get('v1/get_vendors_products',{
    params: {

      supplier_id: supplier_id
    }
  }).then((response) => {
    demoVendorStore.$state.products = response.data.products;
    demoVendorStore.$state.products.forEach(product => {
      product.parsedName = typeof product.name == "string" ? product.code + " | " + product.name :  product.code + " | " + JSON.parse(product.name).en;
      
    });
    // console.log(demoVendorStore.$state.products);
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
    loadingProducts.value = false; 
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

// function getHighestFactorPacking(product) {
//   console.log(product)
//   return product.packing.reduce((maxPacking, currentPacking) => {
//     return currentPacking.factor > maxPacking.factor ? currentPacking : maxPacking;
//   }, { factor: -Infinity });
// }


async function addToCart(product) {
  // console.log(product);
  requestedProduct.value = {
    'id': product.product_id,
    'supplier_id': supplier_id,
    'qty': 1,
    'image': product.image,
    'name': typeof product.name == "string" ? product.name : JSON.parse(product.name).en,
    'code': product.product_code,
    "price_without_vat": product.price,
    "vat": product.vat,
    "unit_id": product.unit_id,
    "unit_name": product.unit_name,
    'batch_no': product.expiry_date,
    "price": product.price + (product.price * (product.vat / 100)),
  }
  showQuantityButtons.value = true;
  // Check if the product is already in the cart
  const existingProductIndex = uiStore.$state.cartItems.findIndex(
    (item) => item.id === requestedProduct.value.id && item.batch_no === requestedProduct.value.batch_no 
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
function handleCheckout() {
  uiStore.$state.showCartDetails = false;
  router.push('cart');
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

watch(() => demoVendorStore.$state.newOffer, () => {
  filteredProductsAll;
});
watch(() => demoVendorStore.$state.category, () => {
  filteredProductsAll;
});
watch(() => demoVendorStore.$state.brand, () => {
  filteredProductsAll;
});
watch(() => demoVendorStore.$state.price, () => {
  filteredProductsAll;
});
const searchQueryHeader = ref('');
const filteredProductsAll = computed(() => {
  const query = searchQueryHeader.value?.trim();
  const newOffer = demoVendorStore.$state.newOffer;
  const category = demoVendorStore.$state.category;
  const brand = demoVendorStore.$state.brand;
  const price = demoVendorStore.$state.price;
  if (!price && !brand && !category && !newOffer && !query) {
    return demoVendorStore.$state.products.map(product => {
      const filteredProduct = { ...product };
      filteredProduct.attributes = processAttributes(product.attributes);
      return filteredProduct;
    });
  }
  const regex = new RegExp(query, 'i');
  const filteredProducts = demoVendorStore.$state.products.filter(product =>
    (regex.test(product.code) || regex.test(product.name) || regex.test(product.barcode) || regex.test(product.brand)) &&
    (!newOffer || product.offer === newOffer)
     && (!category || product.category === category)
     && (!brand || product.brand === brand)
     && (!price || product.price >= price)
  );

  return filteredProducts.map(product => {
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
const barcodeFormats = [
  "aztec",
  "code_128",
  "code_39",
  "code_93",
  "codabar",
  "data_matrix",
  "ean_13",
  "ean_8",
  "itf",
  "pdf417",
  "qr_code",
  "upc_a",
  "upc_e",
  "unknown",
];

const isValid = ref(undefined);
const paused = ref(false);
const result = ref(null);
const cameraDetected = ref(false);

const instance = getCurrentInstance();

const validationPending = computed(
  () => isValid.value === undefined && paused.value,
);
const validationSuccess = computed(() => isValid.value === true);
const validationFailure = computed(() => isValid.value === false);

const onError = console.error;

const formatDate = (dateString) => {
  const options = { day: '2-digit', month: 'short', year: 'numeric' };
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', options);
};

const resetValidationState = () => {
  isValid.value = undefined;
  cameraDetected.value = true;
};
const updateSearchQuery = (newValue) => {
  searchQueryHeader.value = newValue;
};

const onDetect = async ([firstDetectedCode]) => {
  result.value = firstDetectedCode.rawValue;
  paused.value = true;
  // Perform the search operation
  searchQueryHeader.value = firstDetectedCode.rawValue;
  showQRScannerPopup.value = false;
  instance.emit("Ok", firstDetectedCode.rawValue);
};

let showQRScannerPopup = ref(false);

const openQRScannerPopup = () => {
  showQRScannerPopup.value = true;
};
</script>
<style scoped>
.v-chip.in_stock {
  background: #28a745;
  color: white;
}

.v-chip.on_sale {
  background: #dc3545;
  color: white;
}

.v-chip.expire_soon {
  background: #ffc107;
  color: white;
}

.v-chip.pre_order {
  background: #007bff;
  color: white;
}

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

/* .cart-item-image { */

/* block-size: auto;
    inline-size: 100%; */

/* max-inline-size: 80px; */

/* } */

.total-amount {
  position: fixed;
  font-weight: bold;
  inset-block-end: 90px; /* Adjust this value as needed */
  inset-inline-end: 30px;
}

.total-amount-btn {
  position: fixed;
  inset-block-end: 20px;
  inset-inline-end: 30px;
}

.cart-item-details {
  margin-block-start: 10px;
}

.greenStyle {
  background: #4caf50;
  color: white;
}

.dangerStyle {
  background: red;
  color: white;
}

.input-transparent {
  border: none;
  border: 1px solid #c5cbd5;
  background: #fff;
  background-image: url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='20' height='20' viewBox='0 0 20 20'><path fill='%23838D99' d='M13.22 14.63a8 8 0 1 1 1.41-1.41l4.29 4.29a1 1 0 1 1-1.41 1.41l-4.29-4.29zm-.66-2.07a6 6 0 1 0-8.49-8.49 6 6 0 0 0 8.49 8.49z'></path></svg>");
  background-position: 10px 10px;
  background-repeat: no-repeat;
  background-size: 20px 20px;
  font-size: 16px;
  inline-size: 100%;
  inline-size: 300px;
  line-height: 1.5;
  padding-block: 0.5em;
  padding-inline: 2.5em 1em;
}

.input-transparent2 {
  border: none;
  border: 1px solid #c5cbd5;
  background: #fff;
  background-repeat: no-repeat;
  background-size: 20px 20px;
  font-size: 16px;
  inline-size: 100%;
  inline-size: 300px;
  line-height: 1.5;
  margin-block: 13px 6px;
  margin-inline: 5px;
  padding-block: 0.5em;
  padding-inline: 0.5em 1em;
}

.input-transparent::placeholder {
  color: #838d99;
}

.input-transparent:focus {
  border: 1px solid #84a2fa;
  outline: none;
}

.loader-dots {
  position: absolute;
  margin: auto;
  block-size: var(--loader-dot-size, 16px);
  filter: url("#gooey");
  inline-size:
    calc(
      calc(var(--loader-dot-size, 16px) * 4) +
      calc(calc(var(--loader-dot-spacing, 8px)) * 3)
    );
  inset-block-start: 80%;
  inset-inline-start: 50%;
  transform: translate(-50%, -50%);
}

.loader-dot {
  position: absolute;
  border-radius: 50%;
  background-color: var(--loader-dot-color, rgb(115, 103, 240));
  block-size: var(--loader-dot-size, 16px);
  inline-size: var(--loader-dot-size, 16px);
  inset: 0;
  margin-block-start: 80%;
  margin-inline: auto;
}

.loader-dot:first-child {
  inset-inline-start:
    calc(
      0px -
      calc(
        calc(var(--loader-dot-size, 16px) * 4) +
        var(--loader-dot-spacing, calc(var(--loader-dot-size, 16px) / 2))
      )
    );
}

.loader-dot:nth-child(2) {
  inset-inline-start:
    calc(
      0px -
      calc(
        var(--loader-dot-size, 16px) +
        var(--loader-dot-spacing, calc(var(--loader-dot-size, 16px) / 2))
      )
    );
}

.loader-dot:nth-child(3) {
  inset-inline-start:
    calc(
      var(--loader-dot-size, 16px) +
      var(--loader-dot-spacing, calc(var(--loader-dot-size, 16px) / 2))
    );
}

.loader-dot:last-child {
  inset-inline-start:
    calc(
      calc(var(--loader-dot-size, 16px) * 4) +
      var(--loader-dot-spacing, calc(var(--loader-dot-size, 16px) / 2))
    );
}

.moving-dot {
  animation: moving-dot var(--loader-animation-duration, 2.5s) ease infinite;
}

.fixed-dot {
  animation: fixed-dot var(--loader-animation-duration, 2.5s) ease infinite;
}

@keyframes moving-dot {
  50% {
    transform:
      translateX(
        calc(
          calc(var(--loader-dot-size, 16px) * 4) +
          var(--loader-dot-spacing, calc(var(--loader-dot-size, 16px) / 2))
        )
      );
  }

  100% {
    transform: translateX(0);
  }
}

@keyframes fixed-dot {
  50% {
    transform:
      translateX(
        calc(
          0px -
          calc(
            var(--loader-dot-size, 16px) +
            var(--loader-dot-spacing, calc(var(--loader-dot-size, 16px) / 2))
          )
        )
      );
  }

  100% {
    transform: translateX(0);
  }
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
                  <!-- Cart items -->
                  <VRow v-for="cartItem in uiStore.$state.cartItems" :key="cartItem.id">
                    <div v-if="cartItem.supplier_id == supplier_id">
                    
                      <!-- Left column: Product image and details -->
                      <VCol cols="3">
                          <img :src="cartItem.image" style="margin: auto;" height="60%" cover width="60%" alt="Product Image" class="cart-item-image" />
                      </VCol>
                      <VCol cols="9">
                          <VRow>
                              <VCol cols="12">
                                  <div class="cart-item-details">
                                      <div>
                                          <strong>{{ cartItem.name }}</strong>
                                      </div>
                                      <div>Code: {{ cartItem.code }}</div>
                                      <div>Price: {{ cartItem.price_without_vat }} AED</div>
                                      <VChip class="price-tag" label color="primary">Total: {{ (cartItem.qty * cartItem.price_without_vat).toFixed(2) }} AED</VChip>
                                      <div v-if="cartItem.batch_no != null">Best Before: {{ formatDate(cartItem.batch_no) }}</div>

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
                    </div>
                  </VRow>
              </VCardText>
              <!-- Bottom section: Total amount and checkout button -->
              <VRow align="center" class="pb-4">
                  <VCol cols="6" sm="6" class="text-right">
                      <div class="total-amount">
                          Total: {{ calculateTotalAmount() }} AED
                      </div>
                  </VCol>
                  <VCol cols="10" sm="10" class="total-amount-btn">
                      <VBtn @click="handleCheckout" class="ma-2" color="primary" block>
                          Checkout
                      </VBtn>
                  </VCol>
              </VRow>
          </VCard>
        </PerfectScrollbar>
    </VNavigationDrawer>

    <VRow class="pa-6">
      <VCol cols="12" > 
        <VRow>
          <VRow align="center" class="mt-1">
            <VCol cols="9">
              
              <input
                class="form-control input-transparent"
                type="text"
                v-model="searchQueryHeader"
                placeholder="Search"
                style="width: 80%;"
              >   
              <VBtn style="margin-left: 10px;" @click="openQRScannerPopup">
                <VIcon>mdi-qrcode-scan</VIcon>
              </VBtn>
            
              <v-dialog v-model="showQRScannerPopup">
                <VCard height="65vh" width="65vh" style="margin: auto;">
                  <qrcode-stream :formats="barcodeFormats" :paused="paused" @detect="onDetect" @error="onError"
                  @camera-on="resetValidationState">
                  <div v-if="validationSuccess" class="validation-success">
                    OK
                  </div>
                  <div v-if="validationFailure" class="validation-failure">
                    ERROR
                  </div>
                  <div v-if="validationPending" class="validation-pending">
                    READING
                  </div>
                    <div class="loading-indicator" v-if="!cameraDetected">
                      <p class="text-secondary">Accepting the camera permissions allows you to scan the code and avoid typing it manually.</p>
                    </div>
                  </qrcode-stream>
                </VCard>
              </v-dialog>
            </VCol>
            <VCol cols="3" class="text-right"> 
              <!-- Toggle buttons -->
            
              <VBtnToggle v-model="isGridView" multiple>
                <VBtn icon @click="isGridView = true" :active="isGridView">
                  <VIcon>mdi-view-grid</VIcon>
                </VBtn>
                <VBtn icon @click="isGridView = false" :active="!isGridView">
                  <VIcon>mdi-view-list</VIcon>
                </VBtn>
              </VBtnToggle>
            </VCol>
          </VRow>
          <!-- <VCol cols="12"> -->
        </VRow>

      </VCol>
    </VRow>
    <div v-if="loadingProducts" class="loading-indicator">
      <div class="loader-container" style="

    --loader-dot-color: rgb(115, 103, 240); --loader-dot-size: 30px; --loader-dot-spacing: 25px;">
        <div class="loader-dots">
          <div class="loader-dot moving-dot"></div>
          <div class="loader-dot fixed-dot"></div>
          <div class="loader-dot fixed-dot"></div>
          <div class="loader-dot fixed-dot"></div>
        </div>
        <svg xmlns="http://www.w3.org/2000/svg" version="1.1" style="display: none;">
          <defs>
            <filter id="gooey">
              <feGaussianBlur in="SourceGraphic" stdDeviation="10" result="blur" />
              <feColorMatrix in="blur" mode="matrix" values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 21 -7" />
            </filter>
          </defs>
        </svg>
      </div>
    </div>
    <VRow v-if="isGridView">
      <VCol
        v-for="(product, index) in filteredProductsAll"
        :key="product.id"
        cols="12"
        sm="6"
        md="4"
        lg="3"
      >
        <VCard class="product-card">
          <VImg :src="product.image" style="margin: auto;" alt="Product Image" height="60%" cover width="60%" />
          <VCardBody>
              <VCardTitle>{{ typeof product.name == "string" ? product.name : JSON.parse(product.name).en }}</VCardTitle>
              <VCardText>{{ product.product_code }}</VCardText>
              <VCardText>Supplier: {{ (product.get_supplier_details.name) }}</VCardText>
              <VRow align="center">
                <VCol cols="1"></VCol>
                <VCol cols="10">
                  <template v-for="(attribute, attributeIndex) in product.attributes" :key="attributeIndex">
                      <template v-if="attribute.color !== 'in_stock' || JSON.parse(product.stock)[0].qty !== 0">

                          <VChip class="mr-2 mb-2" :class="attribute.color">{{ attribute.name }}</VChip>
                      </template>
                  </template>
                  <VChip class="mr-2 mb-2" v-if="product.expiry_date" :class="expire_soon">Best Before: {{ formatDate(product.expiry_date) }}</VChip>
                  <VChip class="mr-2 mb-2" v-if="product.offer" :class="on_sale">{{ (product.offer) }}</VChip>
                  
                </VCol>
                <VCol cols="9" style="margin-left: 10px;">
                  <!-- + ((product).packing_price * (product.vat / 100)) -->
                  <VChip class="price-tag" label v-if="product.packing_price" color="primary"><s>AED {{ ((product).packing_price ).toFixed(2) }}</s></VChip><br/><br/>
                  <VChip class="price-tag" label color="primary">AED {{ ((product).price).toFixed(2) }}</VChip>
                </VCol>
                <VCol cols="10">
                    <VBtn @click="addToCart(product)" v-if="product.stock_availability == 1" class="ma-2" color="primary" :loading="loading">
                      Add To Cart
                    </VBtn> 
                    <VBtn disabled v-if="product.stock_availability == 0" class="ma-2" color="primary" :loading="loading">
                      Out Of Stock
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
        :items="filteredProductsAll"
        :search="searchQuery"
        :items-per-page="itemsPerPage"
      >
      <template v-slot:item="{ item, index }">
          <tr>
            <td>
              {{ (index + 1) }}
            </td>
            <td>
              {{ typeof item.name == "string" ? item.name : JSON.parse(item.name).en }} <br> {{ item.product_code }}
              <br/><br/>
              <template v-for="(attribute, attributeIndex) in item.attributes" :key="attributeIndex">
                <VChip class="mr-2 mb-2" :class="attribute.color">{{ attribute.name }}</VChip>
              </template>
            </td>
            <td>{{ (item).price }} AED</td>
            <td><img style="margin: auto;" height="100%" cover width="40%" :src="item.image" @error="$event.target.src = ''" /></td>
            <td>
              <template v-if="!item.showQuantityButtons">
                <VBtn @click="addToCart(item)" v-if="item.stock_availability == 1" class="ma-2" color="primary" :loading="loading">
                  Add To Cart
                </VBtn> 
                <VBtn disabled v-if="item.stock_availability == 0" class="ma-2" color="primary" :loading="loading">
                  Out Of Stock
                </VBtn> 

              </template>
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
