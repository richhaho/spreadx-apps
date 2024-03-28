<script setup>
import { useUiStore } from '@/store/uiStore';
const uiStore = useUiStore();
uiStore.$subscribe(() => {

});
const getCartDetails = (() => {
  uiStore.$state.showCartDetails = !uiStore.$state.showCartDetails;
  
});

</script>

<template>
 
  <VBtn
    icon
    variant="text"
    color="default"
    size="small"
    @click="getCartDetails()"
  >
  <h4>

    {{ uiStore.$state.cartItems.length > 0 ? uiStore.$state.cartItems.length :''  }}
  </h4>
    <VIcon
      icon="tabler-shopping-cart"
      size="24"
    />
  </VBtn>
</template>
