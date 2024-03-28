<script setup>
import axios_koch from '@/plugins/axios_koch';
import { useUiStore } from '@/store/uiStore';
const uiStore = useUiStore();
const qlineUrl = import.meta.env.VITE_API_V1;
const tanafToken = import.meta.env.VITE_AUTH_TOKEN_TANAF;

uiStore.$subscribe(() => {

});

const props = defineProps({
  currentStep: {
    type: Number,
    required: true,
  },
  checkoutData: {
    type: null,
    required: true,
  },
})

const totalCost = computed(() => {
  let total = 0;

  // Loop through the cart items and calculate the total amount
  for (const cartItem of uiStore.$state.cartItems) {
    total += cartItem.qty * cartItem.price_without_vat;
  }

  return total.toFixed(2); 
})
const totalVat = computed(() => {
  let total = 0;

  // Loop through the cart items and calculate the total amount
  for (const cartItem of uiStore.$state.cartItems) {
    total += (cartItem.qty * (cartItem.price)) - (cartItem.qty * (cartItem.price_without_vat));
  }

  return total.toFixed(2); 
})
const finalAmount = computed(() => {
  let totalCost = 0;
  let totalVat = 0;

  // Loop through the cart items and calculate the total amount
  for (const cartItem of uiStore.$state.cartItems) {
    totalCost += (cartItem.qty * (cartItem.price_without_vat));
    totalVat += (cartItem.qty * (cartItem.price)) - (cartItem.qty * (cartItem.price_without_vat));
  }

  return (totalCost + totalVat).toFixed(2); 
});
function createOrderNo() {
    axios_koch
    .get(`${qlineUrl}document_sequence`, {
        // headers:{
        //     // "authId":localStorage.getItem("authId"),
        //     "authToken":tanafToken,
        //     "Accept": "Application/json",
        // },
        // "auth_access_token": tanafToken
    })
    .then((response) => {

        const salesOrderObject = response.data.result.find(
            (item) => item.document_name === "sales_order"
        );    
        localStorage.setItem("order_no", salesOrderObject.prefix+salesOrderObject.running_no);
    })
    .catch((error) => {});
}
function generateRandomId(length) {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';

  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * characters.length);
    result += characters.charAt(randomIndex);
  }

  return result;
}
function getCurrentCoordinates() {
  return new Promise((resolve, reject) => {
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const latitude = position.coords.latitude;
          const longitude = position.coords.longitude;

          const coordinatesString = `${latitude},${longitude}`;
          resolve(coordinatesString);
        },
        (error) => {
          reject(error.message);
        }
      );
    } else {
      reject('Geolocation is not supported in this browser.');
    }
  });
}
const coordinates = ref();
getCurrentCoordinates()
  .then((coordinatesString) => {
    coordinates.value = coordinatesString;
  })
  .catch((error) => {
    console.error(error);
  });

function getCurrentFormattedDate() {
  const options = {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: true,
  };

  const formatter = new Intl.DateTimeFormat('en-US', options);
  const formattedDate = formatter.format(new Date());

  return formattedDate;
}
function updateSessionId() {
    axios_koch
    .get(`${qlineUrl}get_route_activity`, {
        // headers:{
        //     // "authId":localStorage.getItem("authId"),
        //     "authToken":tanafToken,
        //     "Accept": "Application/json",
        // },
        // "auth_access_token": tanafToken
      })
    .then((response) => {
        if (response.data.list.session_id != undefined){
          localStorage.setItem("session_id", response.data.list.session_id);
        }else{
          axios_koch
          .post(`${qlineUrl}route_activity`, {
              // headers:{
              //   // "authId":localStorage.getItem("authId"),
              //   "authToken":tanafToken,
              //   "Accept": "Application/json",
              // },
              // "auth_access_token": tanafToken,
              "activity": "Start Day",
              "client_random_id": generateRandomId(10),
              "coordinates": coordinatesString,
              "create_date": getCurrentFormattedDate(),
              "data": [],
              "session_id": generateRandomId(20),
              "version": "1.8.1.221016"
          })
          .then((response) => {
              localStorage.setItem("session_id", response.data.session_id);
          })
          .catch((error) => {});
        }
    })
    .catch((error) => {});
}
// createOrderNo();
updateSessionId();
const placeOrder = () => {
  if (localStorage.getItem('customer_id')){
    const date = new Date();
    // createOrderNo();
    // Format the current date
    const formattedDate = date.toLocaleString('en-US', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    });
    // Calculate the delivery date (date + 1 day)
    const deliveryDate = new Date(date);
    deliveryDate.setDate(date.getDate() + 1);

    // Format the delivery date
    const formattedDeliveryDate = deliveryDate.toLocaleString('en-US', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    });
    updateSessionId();
    axios_koch
      .post(`${qlineUrl}store_order` ,{      
            // headers:{
            //   // "authId":localStorage.getItem("authId"),
            //   "authToken":tanafToken,
            //   "Accept": "Application/json",
            // },
            // "auth_access_token": tanafToken,
            "vendor_id": localStorage.getItem('supplier_id'),
            "customer_id": localStorage.getItem('customer_id'),
            "delivery_date": formattedDeliveryDate,
            "discount": 0,
            "invoice_no": generateRandomId(6),
            "is_custom_price": 0,
            "order_date": formattedDate,
            "product_id": uiStore.$state.cartItems.map(item => item.id).join(','),
            "qty": uiStore.$state.cartItems.map(item => item.qty).join(','),
            "unit": uiStore.$state.cartItems.map(item => item.unit_id).join(','),
            "reference_no": generateRandomId(6),
            "session_id": localStorage.getItem('session_id'),
        })
      .then((res) => {        
          if (res.data.status == false) {
            uiStore.setSnackBar(true, 'error', res.data.message)
          }
          if (res.data.status === true) {
            uiStore.setSnackBar(true, 'success', res.data.message)
            uiStore.$state.currentStep = 1;
            localStorage.removeItem("cartItems");  
            localStorage.setItem("orderNo", res.data.invoice_no);  
            uiStore.$patch({ cartItems: [] });
          } 
      })  
      .catch((error) => {})
  }else {
    uiStore.setSnackBar(true, 'error', "You are not a registered customer to vendor")
  }


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
</script>

<template>
  <VRow>
    <VCol
      cols="12"
      lg="8"
    >
  

      <h6 class="text-h6 my-4">
        My Cart ({{ uiStore.$state.cartItems.length }} Items)
      </h6>

      <!-- 👉 Cart items -->
      <div class="border rounded">
        <template
          v-for="(item, index) in uiStore.$state.cartItems"
          :key="item.name"
        >
          <div
            class="d-flex align-center gap-3 pa-5 position-relative flex-column flex-sm-row"
            :class="index ? 'border-t' : ''"
          >
            <IconBtn
              class="checkout-item-remove-btn"
              @click="removeFromCart(item)"
            >
              <VIcon
                size="20"
                icon="tabler-x"
              />
            </IconBtn>

            <div>
              <VImg
                width="140"
                :src="item.image"
              />
            </div>

            <div
              class="d-flex w-100"
              :class="(($vuetify.display.width <= 1280 && $vuetify.display.width >= 960) || $vuetify.display.width <= 700) ? 'flex-column' : 'flex-row'"
            >
              <div>
                <h6 class="text-base font-weight-regular mb-4">
                  {{ (item.name) }}
                </h6>
                <div class="d-flex align-center text-no-wrap gap-2 text-base">
                
                  <span class="text-disabled">Unit:</span>
                  <VChip
                    :color="item.code ? 'info' : 'error'"
                    label
                  >
                    <span class="text-xs font-weight-medium">
                      {{ item.unit_name }}
                    </span>
                  </VChip> 
                  
                </div>
                <br>

                <div class="d-flex align-center text-no-wrap gap-2 text-base">

                  <span class="text-disabled">Quantity:</span>
                  <VChip
                    :color="item.qty ? 'info' : 'error'"
                    label
                  >
                    <span class="text-s font-weight-medium">
                      {{ item.qty }}
                    </span>
                  </VChip>
                </div>


                <AppTextField
                  v-model="item.quantity"
                  type="number"
                  style="inline-size: 7.5rem;"
                  density="compact"
                />
              </div>

              <VSpacer />

              <div
                class="d-flex flex-column justify-space-between mt-5"
                :class="(($vuetify.display.width <= 1280 && $vuetify.display.width >= 960) || $vuetify.display.width <= 700) ? 'text-start' : 'text-end'"
              >
                <p class="text-base mt-4">
                  <span class="text-primary">AED {{ item.price }} </span>
                </p>
                <span class="text-primary">Total: AED {{ item.price * item.qty }} </span>

              </div>
            </div>
          </div>
        </template>
      </div>
    </VCol>

    <VCol
      cols="12"
      lg="4"
      style="margin-top: 4%;"
    >
      <VCard
        flat
        variant="outlined"
      >
        <!-- 👉 payment offer -->
        <VCardText>
          <h6 class="text-base font-weight-medium mb-3">
            Order Summary
          </h6>

          <!-- 👉 Gift wrap banner -->
          <div class="bg-var-theme-background rounded pa-5 mt-4">
            <h6 class="text-base font-weight-medium mb-1">
              Note
            </h6>
            <p>
              This order will be sent to the tanaf, payment process and order deliveries will be handled by tanaf.
            </p>
          </div>
        </VCardText>

        <VDivider />

        <!-- 👉 Price details -->
        <VCardText>
          <h6 class="text-base font-weight-medium mb-3">
            Order Details
          </h6>

          <div class="text-high-emphasis">
            <div class="d-flex justify-space-between mb-2">
              <span>Total Cart Amount</span>
              <span>AED {{ totalCost }} </span>
            </div>

            <div class="d-flex justify-space-between mb-2">
              <span>VAT (5%)</span>
              <span>AED {{ totalVat }} </span>
            </div>

          </div>
        </VCardText>

        <VDivider />

        <VCardText class="d-flex justify-space-between py-4">
          <h6 class="text-base font-weight-medium">
            Total
          </h6>
          <h6 class="text-base font-weight-medium">
            AED {{ (finalAmount) }} 
          </h6>
        </VCardText>
      </VCard>

      <VBtn
        block
        class="mt-4"
        @click="placeOrder"
      >
        Place Order
      </VBtn>
    </VCol>
  </VRow>
</template>

<style lang="scss" scoped>
.checkout-item-remove-btn {
  position: absolute;
  inset-block-start: 10px;
  inset-inline-end: 10px;
}
</style>
