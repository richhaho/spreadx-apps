<script setup>
import { useUiStore } from '@/store/uiStore';
const uiStore = useUiStore();
uiStore.$subscribe(() => {

});
const getCartDetails = (() => {
  uiStore.$state.showCartDetails = !uiStore.$state.showCartDetails;
  
});

const cartItems = computed(() => {
  return uiStore.$state.cartItems
})
</script>

<template>
 
  <VBtn
    icon
    variant="text"
    color="default"
    size="small"
    :to="`/apps/suppliers/cart`"
  >
  <h4 class="text-error">
    {{ cartItems.length > 0 ? cartItems.length :''  }}
  </h4>
    <VIcon
      icon="tabler-shopping-cart"
      size="24"
    />
  </VBtn>
</template>
