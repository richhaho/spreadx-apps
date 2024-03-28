<script setup>
import { useRouter } from 'vue-router';

import { useDemoVendorStore } from '@/store/demoVendorStore';
import { useUiStore } from '@/store/uiStore';

// import PaymentContent from '@/views/wizard-examples/checkout/Payment.vue';
import CartContent from './components/Cart.vue';
import ConfirmationContent from './components/Confirmation.vue';
const uiStore = useUiStore();
const demoVendorStore = useDemoVendorStore();
const qlineUrl = import.meta.env.VITE_QLINE_BASE_URL;
const router = useRouter();

uiStore.$subscribe(() => {

});

demoVendorStore.$subscribe(() => {

});


const checkoutSteps = [
  {
    title: 'Cart',
    icon: 'custom-cart',
  },
  {
    title: 'Confirmation',
    icon: 'custom-trending',
  },
]

const checkoutData = ref({})

uiStore.$state.currentStep = 0;

</script>
<template>
  <div class="checkout-page">
    <div class="checkout-card">
      <VCard>
        <VCardText>
          <!-- 👉 Stepper -->
          Checkout
        </VCardText>
        <VDivider />
        <VCardText>
          <!-- 👉 stepper content -->
          <VWindow v-model="uiStore.$state.currentStep"
            class="disable-tab-transition"
            :touch="false">
            <VWindowItem>
              <CartContent v-model:current-step="uiStore.$state.currentStep"
                v-model:checkout-data="checkoutData" />
            </VWindowItem>
            <VWindowItem>
              <ConfirmationContent v-model:checkout-data="checkoutData" />
            </VWindowItem>
          </VWindow>
        </VCardText>
      </VCard>
    </div>
  </div>
</template>

<style lang="scss">
.checkout-stepper {
  .stepper-icon-step {
    .step-wrapper + svg {
      margin-inline: 3.5rem !important;
    }
  }
}
</style>
