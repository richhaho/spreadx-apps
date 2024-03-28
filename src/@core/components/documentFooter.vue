<script setup>
import { format } from "date-fns";
const userData = JSON.parse(localStorage.getItem('userData'))
</script>
<template>
  <VCardText>
          <div class="row">
            <div class="col-md-4 print-black ">
              <p>Printed On: {{ format(new Date(), 'dd/MM/yyyy') }}</p>
            </div>
          </div>

          <div class="row">
            <div class="col-md-4 print-black ">
              <p>By: {{ userData ? userData.first_name + " " + userData.last_name : "" }}</p>
            </div>
          </div>
        </VCardText>
</template>
