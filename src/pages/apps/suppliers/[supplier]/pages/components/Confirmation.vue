<script setup>
import { useUiStore } from '@/store/uiStore';
import { useRoute, useRouter } from "vue-router";
const router = useRouter();
const route = useRoute();
const uiStore = useUiStore();
uiStore.$subscribe(() => {

});
const props = defineProps({
  currentStep: {
    type: Number,
    required: false,
  },
  checkoutData: {
    type: null,
    required: true,
  },
})

const emit = defineEmits([
  'update:currentStep',
  'update:checkout-data',
])
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
const supplier_id = route.params.supplier;

const backHome = (() => {
  router.push('/apps/suppliers/'+supplier_id);
});

const orderNo = localStorage.getItem('orderNo')??uiStore.$state.orderItems[0].invoice_no;
// console.log
</script>

<template>
  <section class="text-base">
    <div class="text-center">
      <h5 class="text-h5 mb-3">
        Thank You! 😇
      </h5>
      <p>
        Your order {{ orderNo }} has been placed!
      </p>
      <div class="d-flex align-center gap-2 justify-center">
        <VIcon
          size="20"
          icon="tabler-clock"
        />
        <span>Time placed: {{getCurrentFormattedDate()}}</span>
      </div>
      
      <div class="d-flex align-center gap-2 justify-center"
        
      >

        <VBtn
          style="inset-block-end: 10px;"
          class="mt-4"
          @click="backHome"
        >
        Home
      </VBtn>
      </div>

    </div>
  </section>
</template>
