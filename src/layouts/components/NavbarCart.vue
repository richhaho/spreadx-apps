<script setup>
const carts = [
  {
    name: 'cart',
    icon: 'tabler-shopping-cart',
  },
  
]
</script>

<template>
  <NavbarCart :carts="carts"/>
</template>
