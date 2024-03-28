<script setup>
import logo from "@/assets/images/logo.jpg";
import { useBusinessStore } from "@/store/businessStore";
const businessStore = useBusinessStore();
businessStore.$subscribe((mutation, state) => { })
businessStore.fetchDefaultBusiness()
const props = defineProps(
  {
    title: String,
  }
)
</script>

<template>
  <div class="">

    <header v-if="businessStore.$state.activebusness"
      style="text-align: start;">
      <div class="container-fluid">
        <div class="row">
          <div class="col-md-1 text-start">
            <img :src="businessStore.$state.activebusness.business_logo ?? logo"
              alt="Company Logo"
              style="max-width: 150px;">
          </div>

          <div class="col-md-11 text-start ">
            <h5 style=" padding: 0;  margin: 0;"
              class="print-black">{{ businessStore.$state.activebusness.business_name }}</h5>
            <p class="print-black">ADDRESS: {{ businessStore.$state.activebusness.address }}</p>
            <p class="print-black">TRN :{{ businessStore.$state.activebusness.trn }}<br>Phone: {{ businessStore.$state.activebusness.phone }}</p>
          </div>
        </div>
      </div>

    </header>
    <h6 class="heading"
      style=" padding: 0;  margin: 0;text-align: center !important;">{{ title }}</h6>
  </div>
</template>
