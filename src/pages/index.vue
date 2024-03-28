<script setup>
  import router from '@/router';
  import {appsShortCuts} from "@/helpers/helpers"

</script>

<template>
  <VRow>
    <VCol v-for="(shortcut, index) in appsShortCuts"
          cols="12" sm="6" md="6" lg="4" xl="3">
      <VCard class="py-5">
        <VCardText class="d-flex flex-column  justify-center ">
          <h4 class="">
            {{ shortcut.title }}
          </h4>
          <VDivider></VDivider>
          <VAvatar class="mt-4 text-center"
                   v-if="shortcut.icon"
                   size="42"
                   variant="tonal"
                   :color="shortcut.color"
                   :image="shortcut.icon" />
          <span class="text-sm">{{ shortcut.subtitle }}</span>
        </VCardText>
        <VCardText class="d-flex justify-end">
          <a :href="shortcut.url">
            <VBtn>Get Started</VBtn>
          </a>
        </VCardText>
      </VCard>

    </VCol>

  </VRow>
</template>


<!--Review the commented code for permissions of users-->

<!--<script setup>-->
<!--import { appsShortCuts, isUserAdmin } from "@/helpers/helpers";-->
<!--// Added this code to remove the modules that are not allowed to be viewed by the user/employee-->
<!--const userAbilities = JSON.parse(localStorage.getItem('userAbilities'));-->
<!--const filteredShortcuts = ref([]);-->
<!--if (isUserAdmin()){-->
<!--  filteredShortcuts.value = appsShortCuts;-->
<!--}else {-->
<!--  const hasCategory = (categoryName) => {-->
<!--    return userAbilities.map(item => item.category == categoryName)[0];-->
<!--  };-->
<!--  filteredShortcuts.value = computed(() => {-->
<!--    return appsShortCuts.filter(shortcut => hasCategory(shortcut.category));-->
<!--  });-->
<!--}-->
<!--</script>-->

<!--<template>-->
<!--  <VRow>-->
<!--    <VCol v-for="(shortcut, index) in filteredShortcuts"  -->
<!--      :key="index"-->
<!--      cols="12" sm="6" md="6" lg="4" xl="3" >-->
<!--      <VCard class="py-5" >-->
<!--        <VCardText class="d-flex flex-column justify-center">-->
<!--          <h4 class="">-->
<!--            {{ shortcut.title }}-->
<!--          </h4>-->
<!--          <VDivider></VDivider>-->
<!--          <VAvatar class="mt-4 text-center"-->
<!--            v-if="shortcut.icon"-->
<!--            size="42"-->
<!--            variant="tonal"-->
<!--            :color="shortcut.color"-->
<!--            :image="shortcut.icon" />-->
<!--          <span class="text-sm">{{ shortcut.subtitle }}</span>-->
<!--        </VCardText>-->
<!--        <VCardText class="d-flex justify-end">-->
<!--          <a :href="shortcut.url">-->
<!--            <VBtn>Get Started</VBtn>-->
<!--          </a>-->
<!--        </VCardText>-->
<!--      </VCard>-->

<!--    </VCol>-->

<!--  </VRow>-->
<!--</template>-->
