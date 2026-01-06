<template>
  <v-card :height="calculateContainerSize()">
    <v-card-title>
      <div class="card-header">
        <span>
          {{ t('profile.title') }}
        </span>
        <v-btn
          :loading="submitLoading"
          @click="handleSubmit"
        >
          {{ t('profile.submit') }}
        </v-btn>
      </div>
    </v-card-title>
    <v-card-text class="mx-4 mt-4">
      <v-row>
        <v-col
          v-if="!mobile"
          cols="12"
          md="6"
        >
          <div
            class="fcc"
            :style="{height: calculateContainerSize()-54+'px'}"
          >
            <v-img
              :src="avatarImageFull"
              height="356"
              width="178"
            />
          </div>
        </v-col>
        <v-col
          cols="12"
          md="6"
          :style="{height: calculateContainerSize()-54+'px'}"
          class="d-flex justify-center align-center"
        >
          <div class="form-container">
            <v-form ref="userInfoRef">
              <v-text-field
                v-model="userInfo.username"
                disabled
                :label="t('profile.username')"
                class="mb-8"
              />
              <v-text-field
                v-model="userInfo.nickname"
                :label="t('profile.nickname')"
                class="mb-8"
              />
              <v-row class="mb-8">
                <v-col
                  :cols="mobile?4:2"
                  class="d-flex align-center"
                >
                  <v-row>
                    <v-col>
                      <v-chip v-tooltip="t('platform.user.form.avatar.tip')">
                        {{ t('platform.user.form.avatar.title') }}
                      </v-chip>
                    </v-col>
                  </v-row>
                </v-col>
                <v-col :cols="mobile?8:10">
                  <v-row>
                    <v-col
                      v-for="i in 4"
                      :key="i"
                      :cols="mobile?6:3"
                    >
                      <v-badge
                        dot
                        location="bottom right"
                        offset-x="3"
                        offset-y="3"
                        color="success"
                        :model-value="userInfo.avatar === i.toString()"
                      >
                        <v-avatar
                          v-ripple
                          color="primary"
                          variant="tonal"
                          @click="userInfo.avatar = i.toString()"
                        >
                          <v-img :src="getAvatar(i)" />
                        </v-avatar>
                      </v-badge>
                    </v-col>
                  </v-row>
                </v-col>
              </v-row>
              <v-text-field
                v-model="userInfo.password"
                v-tooltip="t('platform.user.form.password.tip')"
                :append-inner-icon="isPasswordVisible ? 'ri-eye-off-line' : 'ri-eye-line'"
                :type="isPasswordVisible ? 'text' : 'password'"
                autocomplete="password"
                :label="t('platform.user.form.password.title')"
                :rules="userInfoRules.password"
                clearable
                @click:append-inner="isPasswordVisible = !isPasswordVisible"
              />
            </v-form>
          </div>
        </v-col>
      </v-row>
    </v-card-text>
  </v-card>
</template>

<script setup>
import avatar1 from '@images/avatars/avatar-1.png'
import avatar2 from '@images/avatars/avatar-2.png'
import avatar3 from '@images/avatars/avatar-3.png'
import avatar4 from '@images/avatars/avatar-4.png'
import avatar1full from '@images/avatars/avatar-1-full.png'
import avatar2full from '@images/avatars/avatar-2-full.png'
import avatar3full from '@images/avatars/avatar-3-full.png'
import avatar4full from '@images/avatars/avatar-4-full.png'
import useUserStore from "@store/user"
import { useDisplay } from "vuetify/framework"
import { useI18n } from "vue-i18n"
import { SHA512, sleep } from "@/utils/tools.js"
import userApi from "@/api/user.js"
import { showSnackbar } from "@/utils/snackbar.js"
import { useRouter } from "vue-router"


const userStore = useUserStore()
const router = useRouter()
const { mobile } = useDisplay()
const { t } = useI18n()

const userInfo = ref({
  username: userStore.userInfo.username,
  nickname: userStore.userInfo.nickname,
  avatar: userStore.userInfo.avatar,
  password: '',
})

const avatarImage = ref()
const avatarImageFull = ref()

switch (userInfo.value.avatar) {
case '1':
  avatarImage.value = avatar1
  avatarImageFull.value = avatar1full
  break
case '2':
  avatarImage.value = avatar2
  avatarImageFull.value = avatar2full
  break
case '3':
  avatarImage.value = avatar3
  avatarImageFull.value = avatar3full
  break
case '4':
  avatarImage.value = avatar4
  avatarImageFull.value = avatar4full
  break
default:
  avatarImage.value = avatar1
  avatarImageFull.value = avatar1full
}

const avatars = {
  1: avatar1,
  2: avatar2,
  3: avatar3,
  4: avatar4,
}

const getAvatar = index => {
  return avatars[index]
}

const userInfoRef = ref()
const isPasswordVisible = ref(false)

const userInfoRules = {
  username: [
    value => {
      if (value) return true

      return t('platform.user.form.username.required')
    },
  ],
  nickname: [
    value => {
      if (value) return true

      return t('platform.user.form.nickname.required')
    },
  ],
  password: [
    value => {
      if (value) return true

      return t('platform.user.form.password.required')
    },
  ],
}

const submitLoading = ref(false)

const handleSubmit = async () => {
  const { valid } = await userInfoRef.value.validate()
  if (!valid) return
  submitLoading.value = true

  const reqFrom = {
    username: userInfo.value.username,
    nickname: userInfo.value.nickname,
    avatar: userInfo.value.avatar,
    password: SHA512(userInfo.value.password),
  }

  userApi.myself.put(reqFrom).then(async response => {
    showSnackbar(response.message)
    await sleep(3000)
    await userStore.clearStore()
    await router.push('/dashboard')
  }).finally(() => {
    submitLoading.value = false
  })
}

const windowHeight = ref(window.innerHeight)

const handleResize = () => {
  windowHeight.value = window.innerHeight
}

const calculateContainerSize = () => {
  const other = 120
  
  return Math.max(2, Math.floor(windowHeight.value - other))
}

onMounted(async () => {
  window.addEventListener('resize', handleResize)
})

onUnmounted(() => {
  window.removeEventListener('resize', handleResize)
})
</script>

<style scoped>
.form-container {
  width: 100%;
  margin: 0 auto;
  padding: 20px;
}
</style>