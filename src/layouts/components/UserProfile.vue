<template>
  <v-badge
    dot
    location="bottom right"
    offset-x="3"
    offset-y="3"
    color="success"
    bordered
  >
    <v-avatar
      class="cursor-pointer"
      color="primary"
      variant="tonal"
    >
      <v-img :src="avatarImage" />

      <!-- SECTION Menu -->
      <v-menu
        activator="parent"
        location="bottom end"
        offset="14px"
      >
        <v-list>
          <!-- 👉 User Avatar & Name -->
          <v-list-item>
            <template #prepend>
              <v-list-item-action start>
                <v-badge
                  dot
                  location="bottom right"
                  offset-x="3"
                  offset-y="3"
                  color="success"
                >
                  <v-avatar
                    color="primary"
                    variant="tonal"
                  >
                    <v-img :src="avatarImage" />
                  </v-avatar>
                </v-badge>
              </v-list-item-action>
            </template>

            <v-list-item-title class="font-weight-semibold">
              {{ userInfo.nickname }}
            </v-list-item-title>
            <v-list-item-subtitle>{{ userInfo.username }}</v-list-item-subtitle>
          </v-list-item>
          <v-divider class="my-2" />

          <!-- 👉 Profile -->
          <v-list-item to="/profile">
            <template #prepend>
              <v-icon
                icon="ri-user-line"
                size="22"
              />
            </template>

            <v-list-item-title>{{ t('global.profile') }}</v-list-item-title>
          </v-list-item>

          <!-- 👉 Logout -->
          <v-list-item
            to="/login"
            @click="handleLogout"
          >
            <template #prepend>
              <v-icon
                icon="ri-logout-box-r-line"
                size="22"
              />
            </template>

            <v-list-item-title>{{ t('global.logout') }}</v-list-item-title>
          </v-list-item>
        </v-list>
      </v-menu>
      <!-- !SECTION -->
    </v-avatar>
  </v-badge>
</template>

<script setup>
import avatar1 from '@images/avatars/avatar-1.png'
import avatar2 from '@images/avatars/avatar-2.png'
import avatar3 from '@images/avatars/avatar-3.png'
import avatar4 from '@images/avatars/avatar-4.png'
import useUserStore from '@store/user'
import { useI18n } from "vue-i18n"


const { t } = useI18n()
const userStore = useUserStore()
const userInfo = userStore.userInfo
const avatarImage = ref()

switch (userInfo.avatar) {
case '1':
  avatarImage.value = avatar1
  break
case '2':
  avatarImage.value = avatar2
  break
case '3':
  avatarImage.value = avatar3
  break
case '4':
  avatarImage.value = avatar4
  break
default:
  avatarImage.value = avatar1
}

const handleLogout = async () => {
  await userStore.clearStore()
}
</script>
