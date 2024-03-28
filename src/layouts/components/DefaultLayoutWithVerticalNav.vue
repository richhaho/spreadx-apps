<script setup>
import { associateMenuToUserAbilities, isUserAdmin, navItemsMapping } from "@/helpers/helpers";

import navItems from '@/navigation/vertical/index';

// import navItems from "@/navigation/vertical";

import { useThemeConfig } from "@core/composable/useThemeConfig";
// Components
import Footer from "@/layouts/components/Footer.vue";
import NavBarI18n from "@/layouts/components/NavBarI18n.vue";
import NavbarShortcuts from '@/layouts/components/NavbarShortcuts.vue';
import NavbarThemeSwitcher from "@/layouts/components/NavbarThemeSwitcher.vue";
import UserProfile from "@/layouts/components/UserProfile.vue";
// @layouts plugin
import { VerticalNavLayout } from "@layouts";

import { useAuthStore } from "@/store/auth";

import { useRoute, useRouter } from 'vue-router';
const route = useRoute();
const router = useRouter();
const routeUrl = route.fullPath;
const parts = routeUrl.split('/');

const appUrl = parts[2];

const currentNavItems = ref(navItems);

currentNavItems.value = navItemsMapping[appUrl] || navItems;

const authStore = useAuthStore();

authStore.$subscribe(() => { });

const { appRouteTransition, isLessThanOverlayNavBreakpoint } = useThemeConfig();
const { width: windowWidth } = useWindowSize();

const activebusness = ref(localStorage.getItem("activeBusiness") != 'undefined' ? JSON.parse(localStorage.getItem("activeBusiness")) : null);


// 1 == 2 ? associateMenuToUserAbilities(navItems)

</script>

<template>
  <VerticalNavLayout :nav-items="associateMenuToUserAbilities(currentNavItems)">
   
    <!-- 👉 navbar -->
    <template 
      #navbar="{ toggleVerticalOverlayNavActive }">
      <div class="d-flex h-100 align-center">
        <VBtn v-if="isLessThanOverlayNavBreakpoint(windowWidth)"
          icon
          variant="text"
          color="default"
          class="ms-n3"
          size="small"
          @click="toggleVerticalOverlayNavActive(true)">
          <VIcon icon="tabler-menu-2"
            size="24" />
        </VBtn>
       <div class="d-none d-sm-none d-md-block">
           <VBtn v-if="authStore.$state.activebusness"
              color="secondary"
              variant="tonal">
              Business: {{ activebusness ? activebusness.business_name : "Choose Active Business" }}
            </VBtn>
            <VBtn v-else> Choose Active Business </VBtn>
        </div>

        <VSpacer />

        <NavBarI18n />
        <NavbarThemeSwitcher />
        <NavbarCart />
        <NavbarShortcuts />
              <!--        <NavBarNotifications class="me-2" />  -->
        <UserProfile />
      </div>
      
    </template>

  





    <!-- 👉 Pages -->
    <RouterView v-slot="{ Component }">
      <Transition :name="appRouteTransition"
        mode="out-in">
        <Component :is="Component" />
      </Transition>
    </RouterView>

    <!-- 👉 Footer -->
    <template #footer>
      <Footer />
    </template>

    <!-- 👉 Customizer -->
    <!-- <TheCustomizer /> -->
  </VerticalNavLayout>
</template>
