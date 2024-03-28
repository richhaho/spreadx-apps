<script setup>
import { useAuthStore } from "@/store/auth";
import avatar1 from "@images/logo.svg";
const authStore = useAuthStore();
const userData = localStorage.getItem("userData") ? JSON.parse(localStorage.getItem("userData")) : null;
</script>

<template>
  <h5 class="d-none d-md-block">{{ userData.first_name }}</h5>
  <VBadge dot
    location="bottom right"
    offset-x="3"
    offset-y="3"
    bordered
    color="success">
    <VAvatar class="cursor-pointer"
      color="primary"
      variant="tonal">
      <VImg :src="userData.profile_image" />

      <!-- SECTION Menu -->
      <VMenu activator="parent"
        width="230"
        location="bottom end"
        offset="14px">
        <VList>
          <!-- 👉 User Avatar & Name -->
          <VListItem>
            <template #prepend>
              <VListItemAction start>
                <VBadge dot
                  location="bottom right"
                  offset-x="3"
                  offset-y="3"
                  color="success">
                  <VAvatar color="primary"
                    variant="tonal">
                    <VImg :src="userData.profile_image" />
                  </VAvatar>
                </VBadge>
              </VListItemAction>
            </template>

            <VListItemTitle class="font-weight-semibold">
              Spread
            </VListItemTitle>
            <VListItemSubtitle>{{ userData.last_name}}</VListItemSubtitle>
          </VListItem>

          <VDivider class="my-2" />

          <!-- 👉 Profile -->
          <VListItem to="/settings"
            link>
            <template #prepend>
              <VIcon class="me-2"
                icon="tabler-user"
                size="22" />
            </template>

            <VListItemTitle>Profile</VListItemTitle>
          </VListItem>

          <!-- 👉 Settings -->
          <VListItem link>
            <template #prepend>
              <VIcon class="me-2"
                icon="tabler-settings"
                size="22" />
            </template>

            <VListItemTitle>Settings</VListItemTitle>
          </VListItem>

          <!-- 👉 Pricing -->
          <VListItem link>
            <template #prepend>
              <VIcon class="me-2"
                icon="tabler-currency-dollar"
                size="22" />
            </template>

            <VListItemTitle>Pricing</VListItemTitle>
          </VListItem>

          <!-- 👉 FAQ -->
          <VListItem link>
            <template #prepend>
              <VIcon class="me-2"
                icon="tabler-help"
                size="22" />
            </template>

            <VListItemTitle>FAQ</VListItemTitle>
          </VListItem>

          <!-- Divider -->
          <VDivider class="my-2" />

          <!-- 👉 Logout -->
          <VListItem to="/login">
            <template #prepend>
              <VIcon class="me-2"
                icon="tabler-logout"
                size="22" />
            </template>

            <VListItemTitle @click="authStore.log_out()">Logout</VListItemTitle>
          </VListItem>
        </VList>
      </VMenu>
      <!-- !SECTION -->
    </VAvatar>
  </VBadge>
</template>
