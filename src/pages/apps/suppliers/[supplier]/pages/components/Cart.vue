<script setup>
import axio_lite from '@/plugins/axios_lite';
import { useAuthStore } from "@/store/auth";
import { useDemoVendorStore } from '@/store/demoVendorStore';
import { useUiStore } from '@/store/uiStore';
import { addDays, format, getDay } from 'date-fns';
import { onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
const uiStore = useUiStore();
const qlineUrl = import.meta.env.VITE_API_V1;
const tanafToken = import.meta.env.VITE_AUTH_TOKEN_TANAF;
const router = useRouter();
const demoVendorStore = useDemoVendorStore();

demoVendorStore.$subscribe(() => {

});
const route = useRoute();

const authStore = useAuthStore();
uiStore.$subscribe(() => {

});
authStore.$subscribe((mutation, state) => {
  // console.log(authStore.$state.authentication_error_state)
  // console.log(authStore.$state.authentication_success_state)
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
const selectedSlot = ref(null);
const finalAmount = computed(() => {
  let totalCost = 0;
  let totalVat = 0;

  // Loop through the cart items and calculate the total amount
  for (const cartItem of uiStore.$state.cartItems) {
    totalCost += (cartItem.qty * (cartItem.price_without_vat));
    totalVat += (cartItem.qty * (cartItem.price)) - (cartItem.qty * (cartItem.price_without_vat));
  }
  let discount = 0;
  // Check if any promotions apply to the entire cart
  const promotions = demoVendorStore.$state.promotions;
  if (promotions.status && promotions.data.length > 0) {
    let totalCostLocal = 0;
    for (const cartItem of uiStore.$state.cartItems) {
      totalCostLocal += cartItem.qty * cartItem.price_without_vat;
    }
    promotions.data.forEach(promotion => {
      // Check if the promotion applies to the entire cart
      
        // Apply percentage discount to the total cart amount
        discount += (parseFloat(totalCostLocal) * promotion.benefit_value) / 100;
    });
  }

  return ((totalCost + totalVat) - discount).toFixed(2); 
});
const calculateItemDiscount = (item) => {
  let discount = 0;
  const promotions = demoVendorStore.$state.promotions;
  if (promotions.status && promotions.data.length > 0) {
    promotions.data.forEach(promotion => {
      if ( promotion.products.includes(item.id)) {
        discount += (parseFloat(item.price_without_vat) * promotion.benefit_value) / 100;
      }
    });
  }
  return discount.toFixed(2);
};
// createOrderNo();
const selectedPaymentMethod = ref('');

const customerName = ref(JSON.parse(localStorage.getItem('userData')).first_name??'');
const customerEmail = ref(JSON.parse(localStorage.getItem('userData')).email??'');
const notes = ref('');
const supplier_id = route.params.supplier;
const itemCount = computed(() => uiStore.$state.cartItems.length);
const isPlacingOrder = ref(false);

const placeOrder = () => {
  if (uiStore.$state.cartItems.length > 0){
    isPlacingOrder.value = true; 
    axio_lite
    .post(`v1/store_order` ,{     
      "customer_name": customerName.value,
      "customer_email": customerEmail.value,
      "address": customerAddress.value,
      "notes": notes.value,
      "product_id": uiStore.$state.cartItems.map(item => item.id).join(','),
      "qty": uiStore.$state.cartItems.map(item => item.qty).join(','),
      "price": uiStore.$state.cartItems.map(item => item.price_without_vat).join(','),
      "batch_no": uiStore.$state.cartItems.map(item => item.batch_no == null ? '' : formatDateNew2(item.batch_no)).join(','),
      "unit": uiStore.$state.cartItems.map(item => item.unit_id).join(','),
      "supplier_id": supplier_id,
      "delivery_slot_id": selectedSlot.value??0
    })
    .then((res) => {        
        if (res.data.status == false) {
          uiStore.setSnackBar(true, 'error', res.data.message)
        }
        if (res.data.status === true) {
          uiStore.setSnackBar(true, 'success', res.data.message)
          uiStore.getOrderItems(supplier_id).then(() => {
            localStorage.setItem("orderNo", uiStore.$state.orderItems[0].invoice_no);
            localStorage.removeItem("cartItems");
            uiStore.$patch({ cartItems: [] });
            uiStore.$state.currentStep = 1;
          });
          isPlacingOrder.value = false;
        } 
    })  
    .catch((error) => {
      isPlacingOrder.value = false;
    })
  }else {
    uiStore.setSnackBar(true, 'error', "Your cart is empty")
  }
}



function formatDateNew(date){
  return date.split(' ')[0].replace(/-/g, '');
}
function formatDateNew2(date){
  return date.split(' ')[0];
}
const deliverySlots = ref([]);
const loading = ref(true);
onMounted(async () => {
  try {
    respnse = [];
    // const response = await axio_lite.get('v1/delivery_spots', {
    //   params: { supplier_id }
    // });
    if (response.data.status === true) {
      console.log(response.data.data);
      deliverySlots.value = response.data.data;
    } else {
      console.error(response.data.data);
    }
  } catch (error) {
    console.error('Error fetching delivery spots:', error);
  } finally {
    loading.value = false;
  }
});

demoVendorStore.getPromotions(supplier_id);
const totalDiscount = computed(() => {
  let discount = 0;

  // Check if any promotions apply to the entire cart
  const promotions = demoVendorStore.$state.promotions;
  if (promotions.status && promotions.status == true && promotions.data.length > 0) {
    let totalCostLocal = 0;
    for (const cartItem of uiStore.$state.cartItems) {
      totalCostLocal += cartItem.qty * cartItem.price_without_vat;
    }
    promotions.data.forEach(promotion => {
      // Check if the promotion applies to the entire cart
      // Apply percentage discount to the total cart amount
      discount += (parseFloat(totalCostLocal) * promotion.benefit_value) / 100;
    });
  }

  return discount.toFixed(2);
});
const appliedPromotions = computed(() => {
  if(demoVendorStore.$state.promotions.status){
    return demoVendorStore.$state.promotions.data;  
  }else {
    return [];
  }
});
console.log(appliedPromotions)
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
const formatDate = (dayAbbreviation) => {
  const daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  const dayIndex = daysOfWeek.findIndex(day => day.toLowerCase().startsWith(dayAbbreviation.toLowerCase()));
  return daysOfWeek[dayIndex] || dayAbbreviation;
};
function saveCartToLocalStorage() {
  localStorage.setItem('cartItems', JSON.stringify(uiStore.$state.cartItems));
}
const selectedOption = ref(null);
const customerAddress = ref(JSON.parse(localStorage.getItem('userData')).address??"");
const customerPhone = ref('');
const country = ref('');
// console.log(JSON.parse(customerAddress).business.address);
const getDate = (dayAbbreviation) => {
  const today = new Date();
  const daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  const todayIndex = daysOfWeek.findIndex(day => day.toLowerCase().startsWith(dayAbbreviation.toLowerCase()));
  const currentDayIndex = getDay(today);
  const difference = todayIndex - currentDayIndex;
  const nextSundayDate = addDays(today, difference >= 0 ? difference : difference + 7);
  return format(nextSundayDate, 'do MMM');
};
const showLoginDialog = ref(false);
const onNewLoginSubmit = () => {
  // Your existing login submission logic...
  // Close the dialog after successful login or handle errors accordingly
  showLoginDialog.value = false;
};
</script>

<template>
 
  <VRow>
    <VCol
      cols="12"
      lg="8"
    >
    <h6 class="text-h6 my-4">My Account</h6>
    <div class="border rounded mb-4">
      <hr>
        <VCardText>
          <VRow class="mt-1">
            <!-- 👉 Select Type -->

            <VCol cols="6"
              sm="6">
              <VTextField
                label="Name"
                v-model="customerName"
                type="text" />
            </VCol>

            <VCol cols="6"
              sm="6">
              <VTextField 
                label="Email"
                v-model="customerEmail"
                type="email" />
            </VCol>
          </VRow>
        </VCardText>
    </div>
    <h6 class="text-h6 my-4">Shipping & Billing</h6>
    <div class="border rounded mb-4">
      <VCardText>
        <VRow class="">
          <VCol cols="12"
            sm="12">
            <VTextField 
              label="Address"
              v-model="customerAddress"
              type="text" />
          </VCol>
          <VCol cols="12"
            sm="12">
            <VTextField 
              label="Phone"
              v-model="customerPhone"
              type="text" />
          </VCol>
          <!-- <VCol cols="12"
            sm="12">
            <VSelect
              v-model="country"
              label="Select Country"
              :items="countryList"
            />
          </VCol> -->
          <VCol cols="12"
            sm="12">
            <VTextarea label="Additional Notes To Supplier" v-model="notes" rows="4" cols="50"></VTextarea>
          </VCol>
        </VRow>
      </VCardText>
    </div>
    <h6 class="text-h6 my-4">Payment Methods</h6>
    <div class="border rounded mb-4">
      <VCardText>
        <VRow class="mt-1">
          <!-- Card Payment -->
          <VCol cols="12">
            <div class="form-check">
              <input class="form-check-input" type="radio" v-model="selectedOption" id="cardPayment" value="card">
              <label class="form-check-label" for="cardPayment">
                Card Payment
              </label>
            </div>
          </VCol>

          <!-- Cash on Delivery -->
          <VCol cols="12">
            <div class="form-check">
              <input class="form-check-input" type="radio" v-model="selectedOption" id="cashOnDelivery" value="cash">
              <label class="form-check-label" for="cashOnDelivery">
                Cash on Delivery
              </label>
            </div>
          </VCol>
        </VRow>
      </VCardText>

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
        <VCardText>
          <h6 class="text-base font-weight-medium mb-3">
            Order Summary
          </h6>
          <div class="border rounded">
        <template
          v-for="(item, index) in uiStore.$state.cartItems"
          :key="item.name"
        >
          <div
            class="align-center gap-3 pa-5 position-relative flex-column flex-sm-row"
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

            
            <VRow>
              <VCol cols="4" sm="4">
                <VImg
                  width="90"
                  :src="item.image"
                />
              </VCol>
              <VCol cols="4" sm="4">
                <h6 class="text-base font-weight-regular mb-4">
                  {{ item.name }}
                </h6>
                <div class="align-center text-no-wrap gap-2 text-base">
                  <span class="text-disabled">Unit</span>
                  <VChip :color="item.code ? 'info' : 'error'" label>
                    <span class="text-xs font-weight-medium">{{ item.unit_name }}</span>
                  </VChip>
                </div>
                <br>
                <div class="align-center text-no-wrap gap-2 text-base mb-4">
                  <span class="text-disabled">Quantity</span>
                  <VChip :color="item.qty ? 'info' : 'error'" label>
                    <span class="text-s font-weight-medium">{{ item.qty }}</span>
                  </VChip>
                </div>
                <div v-if="item.batch_no != null" class="align-center text-no-wrap gap-2 text-base">
                  <span class="text-disabled">SKU</span>
                  <VChip :color="item.qty ? 'info' : 'error'" label>
                    <span class="text-s font-weight-medium">{{ item.code + formatDateNew(item.batch_no) }}</span>
                  </VChip>
                </div>
                <AppTextField v-model="item.quantity" type="number" style="inline-size: 7.5rem;" density="compact" />
              </VCol>
              <VCol class="text-end" cols="4" sm="4"> <!-- Always align text to the end -->
                <p class="text-sm mt-4">
                  <span class="text-primary">{{ (item.price_without_vat).toFixed(2) }}</span>
                </p>
                <p class="text-sm mt-4">
                  <span class="text-primary">VAT{{ ((item.vat / 100) * item.price_without_vat).toFixed(2) }}</span><br>
                  <span class="text-primary">{{ ((item.vat)).toFixed(2) }}%</span>
                </p>
                <p class="text-sm mt-4">
                  <span class="text-primary">Discount {{ calculateItemDiscount(item) }}</span>
                </p>
                <span class="text-primary">Total{{ (item.price * item.qty).toFixed(2) }}</span>
              </VCol>
            </VRow>

          </div>
        </template>
      </div>
        
          <div class="bg-var-theme-background rounded pa-5 mt-4">
            <h6 class="text-base font-weight-medium mb-1">
              Note
            </h6>
            <p>
              This order will be sent to the supplier, payment process and order deliveries will be handled by supplier.
            </p>
          </div>
        </VCardText>

        <VDivider />
        <!-- <VCardText>
              <div class="row py-4 my-2">
                <div class="col-md mb-md-0 mb-2" v-for="(option, index) in deliverySlots" :key="index">
                  <div class="form-check custom-option custom-option-basic" :class="{ checked: selectedSlot === option.id }">
                    <label class="form-check-label custom-option-content form-check-input-payment d-flex gap-3 align-items-center" :for="'customRadio' + index">
                      <input name="customRadioTemp" class="form-check-input" type="radio" :value="option.id" :id="'customRadio' + index" v-model="selectedSlot">
                      <span class="custom-option-body">
                        <span class="ms-3">{{ formatDate(option.day) }}, {{ getDate(option.day) }}</span>
                        <br>
                        <span class="ms-3 text-sm">{{ option.start_time }} - {{ option.end_time }}</span>
                      </span>
                   
                    </label>
                  </div>
                </div>
              </div>
            </div>
        </VCardText> -->

        <VDivider />
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
              <span>Discount</span>
              <span>AED {{ totalDiscount }} </span>
            </div>

            <div class="d-flex justify-space-between mb-2">
              <span>VAT (5%)</span>
              <span>AED {{ totalVat }} </span>
            </div>

            <div class="mb-2">
              <span v-if="appliedPromotions.length > 0">Promotions Applied:</span>
              <ul>
                <template v-for="(promotion, index) in appliedPromotions" :key="index">
                  <li>-- {{ promotion.promotion_desc }}</li>
                </template>
              </ul>
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
        :disabled="itemCount === 0 || isPlacingOrder"
        block
        class="mt-4"
        @click="placeOrder"
      >
      {{ isPlacingOrder ? 'Placing Order...' : 'Place Order' }}
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
