
<script setup>
import { useUiStore } from "@/store/uiStore";
const uiStore = useUiStore();
uiStore.$subscribe(() => { });
</script>
<template>
  <v-snackbar location="top end"
    transition="fade-transition"
    v-model="uiStore.$state.snackbar"
    vertical
    :color="uiStore.$state.snackbarColor"
    :timeout="2000">
    <template class="text-center"
      v-slot:actions>
      <v-btn :color="uiStore.$state.snackbarColor"
        append-icon="mdi-close"
        variant="elevated"
        @click="uiStore.$state.snackbar = false">
      </v-btn>
    </template>
    <div class="text-subtitle-1 pb-2">
      <p class="text-white">{{ uiStore.$state.snackBarMessage }}</p>
    </div>
  </v-snackbar>
</template>
