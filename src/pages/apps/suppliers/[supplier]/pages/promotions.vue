<script setup>
import axios_lite from '@/plugins/axios_lite';
import { useDemoVendorStore } from '@/store/demoVendorStore';
import { useUiStore } from '@/store/uiStore';
import avatar1 from "@images/avatars/promotions.jpg";
import { computed, onMounted, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
const uiStore = useUiStore();
const demoVendorStore = useDemoVendorStore();
const router = useRouter();
const vendorOptions = ref([]);
const route = useRoute();
const supplier_id = route.params.supplier;
const loadingPromotions = ref(true);

const getVendorsPromotions = () => {
  axios_lite.get('v1/get_promotions',{
    params: {
      supplier_id: supplier_id
    }
  }).then((response) => {
    if (response.data.status){

      demoVendorStore.$state.promotions = response.data.data;
    }else {
      demoVendorStore.$state.promotions = [];
    }
    loadingPromotions.value = false; 
  });
}
onMounted(() => {
  getVendorsPromotions();
});

uiStore.$subscribe(() => {

});
demoVendorStore.$subscribe(() => {

});
const promotions = computed(() => demoVendorStore.$state.promotions);

const capitalizeFirstLetter = (string) => {
  return string.charAt(0).toUpperCase() + string.slice(1);
};

const formatDate = (dateString) => {
  const options = { day: '2-digit', month: 'short', year: 'numeric' };
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', options);
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

.loader-container {
  --loader-dot-color: rgb(115, 103, 240);
  --loader-dot-size: 30px;
  --loader-dot-spacing: 25px;
}

</style>
<template>
  <div>
    <div v-if="loadingPromotions" class="loading-indicator">
      <div class="loader-container">
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
    <VRow>
      <div v-if="promotions.length > 0">
        <VCol
          v-for="(promotion) in promotions"
          :key="promotion.id"
          cols="12"
          sm="6"
          md="4"
          lg="3"
        >
          <VCard class="product-card">
            <VImg :src="avatar1" style="margin: auto;" alt="Product Image" />
            <VCardBody>
                <VCardTitle>Promotion Code: {{ promotion.promotion_name }}</VCardTitle>
                <VCardTitle>{{ promotion.promotion_desc }}</VCardTitle>
            
            </VCardBody>
          </VCard>
  
        </VCol>
      </div>
      <VCol
        v-else
      >
        No Promotion Available Yet!
      </VCol>
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
