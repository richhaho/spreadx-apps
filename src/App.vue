<script setup>
import snackBar from "@/components/snackBar.vue";
import { useThemeConfig } from "@core/composable/useThemeConfig";
import { hexToRgb } from "@layouts/utils";
import { useTheme } from "vuetify";
// import component style
// import { useBusinessStore } from "@/store/businessStore";
import { useDemoVendorStore } from '@/store/demoVendorStore';
const demoVendorStore = useDemoVendorStore();
demoVendorStore.$subscribe(() => {

});
// const businesstore = useBusinessStore();
// businesstore.fetchDefaultBusiness({});
// businesstore.$subscribe(() => { });
// console.log(JSON.parse(localStorage.getItem('userData')))
if (localStorage.getItem('userData')) {
  const userData = JSON.parse(localStorage.getItem('userData')).vendor_customer;

  const customerIdToVendorIdMap = ref({});

  // for (const user of userData) {
  //   const customerId = user.customer_id;
  //   const vendorId = user.vendor_id;
  //   localStorage.setItem('custmoer_id', customerId)
  //   localStorage.setItem('vendor_id', vendorId)
  //   // Assign vendorId to customerId in the map
  //   customerIdToVendorIdMap.value[vendorId] = customerId;
  // }

  // Now, customerIdToVendorIdMap.value is an object where customer IDs map to vendor IDs.
  // You can store it in localStorage or use it as needed.
  
  // Example: Store in localStorage
  // localStorage.setItem('customerVendorIds', JSON.stringify(customerIdToVendorIdMap.value));
}

  const {
    syncInitialLoaderTheme,
    syncVuetifyThemeWithTheme: syncConfigThemeWithVuetifyTheme,
    isAppRtl,
  } = useThemeConfig();

  const { global } = useTheme();

  syncInitialLoaderTheme();
  syncConfigThemeWithVuetifyTheme();
</script>

<template>
  <VLocaleProvider :rtl="isAppRtl">

    <snackBar></snackBar>

    <VApp :style="`--v-global-theme-primary: ${hexToRgb(
      global.current.value.colors.primary
    )}`">
      <RouterView />
    </VApp>
  </VLocaleProvider>
</template>

<style lang="css">
.layout-content-width-boxed.layout-wrapper.layout-nav-type-vertical .layout-navbar,
.layout-content-width-boxed.layout-wrapper.layout-nav-type-vertical .layout-footer {
  inline-size: 100%;
  margin-inline: auto;
  max-inline-size: 100% !important;
}

.layout-content-width-boxed .layout-page-content {
  inline-size: 100%;
  margin-inline: auto;
  max-inline-size: 100% !important;
}

.show_on_print {
  display: none;
}

@media print {
  .v-card-text {
    padding: 0 !important;
  }

  .show_on_print {
    display: block;
  }

  .list_card {
    display: none !important;
  }

  .print-black {
    color: black !important;
  }

  .v-application {
    background: transparent !important;
  }

  @page {
    margin: 0;
    size: auto;
  }

  .layout-page-content,
  .v-row,
  .v-col-md-9 {
    padding: 0;
    margin: 0;
  }

  .product-buy-now {
    display: none;
  }

  .v-navigation-drawer,
  .layout-vertical-nav,
  .app-customizer-toggler,
  .layout-footer,
  .layout-navbar,
  .layout-navbar-and-nav-container {
    display: none;
  }

  .v-card {
    box-shadow: none !important;
  }

  .v-card .print-row {
    flex-direction: row !important;
  }

  .layout-content-wrapper {
    padding-inline-start: 0 !important;
  }
}
</style>
