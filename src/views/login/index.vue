<template>
  <div class="header">
    <div class="fcc">
      <nav-header />
    </div>
    <div class="fcc">
      <github />
      <document />
      <lang-select />
      <navbar-theme-switcher />
    </div>
  </div>
  <div class="d-flex align-center justify-center pa-4">
    <!-- 登录卡片 -->
    <v-card
      width="448"
      class="auth-card"
      :style="mobile?{'margin-top': '10vh'}:{'margin-top': '25vh'}"
    >
      <v-card-text class="mt-4">
        <span style="font-size: 1.5em">
          {{ $t('login.welcome') }}
        </span>
      </v-card-text>

      <v-card-text class="mt-6">
        <v-form @submit.prevent="handleLogin">
          <v-row>
            <v-col cols="12">
              <v-text-field
                v-model="loginForm.username"
                :label="t('login.loginForm.username')"
              />
            </v-col>

            <v-col cols="12">
              <v-text-field
                v-model="loginForm.password"
                :append-inner-icon="isPasswordVisible ? 'ri-eye-off-line' : 'ri-eye-line'"
                :type="isPasswordVisible ? 'text' : 'password'"
                autocomplete="password"
                :label="t('login.loginForm.password')"
                @click:append-inner="isPasswordVisible = !isPasswordVisible"
              />
              <v-btn
                block
                class="my-6"
                type="submit"
                :loading="loginLoading"
              >
                {{ t('login.login') }}
              </v-btn>
              <v-dialog
                v-model="registerDialogVisible"
                :max-width="mobile?'80%':'50%'"
              >
                <template #activator="{ props: activatorProps }">
                  <v-btn
                    :color="colors.grey.lighten3"
                    block
                    class="my-6"
                    v-bind="activatorProps"
                  >
                    {{ t('login.register') }}
                  </v-btn>
                </template>

                <template #default="{ isActive }">
                  <v-card :title="t('login.register')">
                    <v-card-text>
                      <v-form
                        fast-fail
                        class="mx-4 mt-6"
                        @submit.prevent="handleRegisterPost"
                      >
                        <v-row>
                          <v-text-field
                            v-model="registerForm.username"
                            class="mb-6"
                            :label="t('login.registerForm.username')"
                            clearable
                            :rules="registerFormRules.username"
                          />
                        </v-row>
                        <v-row>
                          <v-text-field
                            v-model="registerForm.nickname"
                            class="mb-6"
                            :label="t('login.registerForm.nickname')"
                            clearable
                            :rules="registerFormRules.nickname"
                          />
                        </v-row>
                        <v-row class="mb-6">
                          <v-col
                            :cols="mobile?4:2"
                            class="d-flex align-center"
                          >
                            <v-row>
                              <v-col>
                                <v-chip>
                                  {{ t('login.registerForm.avatar') }}
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
                                  :model-value="registerForm.avatar === i.toString()"
                                >
                                  <v-avatar
                                    v-ripple
                                    color="primary"
                                    variant="tonal"
                                    @click="registerForm.avatar = i.toString()"
                                  >
                                    <v-img :src="getAvatar(i)" />
                                  </v-avatar>
                                </v-badge>
                              </v-col>
                            </v-row>
                          </v-col>
                        </v-row>
                        <v-spacer />
                        <v-row>
                          <v-text-field
                            v-model="registerForm.password"
                            :append-inner-icon="isPasswordVisible ? 'ri-eye-off-line' : 'ri-eye-line'"
                            :type="isPasswordVisible ? 'text' : 'password'"
                            autocomplete="password"
                            class="mb-6"
                            :label="t('login.registerForm.password')"
                            :rules="registerFormRules.password"
                            clearable
                            @click:append-inner="isPasswordVisible = !isPasswordVisible"
                          />
                        </v-row>
                        <v-card-actions class="mt-16">
                          <v-spacer />
                          <v-btn
                            color="default"
                            variant="elevated"
                            :text="t('login.cancel')"
                            class="mr-4"
                            @click="isActive.value = false"
                          />
                          <v-btn
                            :text="t('login.submit')"
                            variant="elevated"
                            type="submit"
                            :loading="registerLoading"
                          />
                        </v-card-actions>
                      </v-form>
                    </v-card-text>
                  </v-card>
                </template>
              </v-dialog>
            </v-col>
          </v-row>
        </v-form>
      </v-card-text>
    </v-card>

    <v-img
      :src="authV1Tree"
      :width="250"
      class="auth-footer-start-tree d-none d-md-block"
    />

    <v-img
      :src="authV1Tree2"
      :width="350"
      class="auth-footer-end-tree d-none d-md-block"
      style="z-index: 0!important;"
    />

    <v-img
      :src="authThemeMask"
      class="auth-footer-mask d-none d-md-block"
    />
  </div>
</template>

<script setup>
import { useDisplay, useTheme } from 'vuetify'
import authV1MaskDark from '@images/pages/auth-v1-mask-dark.png'
import authV1MaskLight from '@images/pages/auth-v1-mask-light.png'
import authV1Tree2 from '@images/pages/auth-v1-tree-2.png'
import authV1Tree from '@images/pages/auth-v1-tree.png'
import avatar1 from '@images/avatars/avatar-1.png'
import avatar2 from '@images/avatars/avatar-2.png'
import avatar3 from '@images/avatars/avatar-3.png'
import avatar4 from '@images/avatars/avatar-4.png'
import colors from 'vuetify/lib/util/colors'
import userApi from '@/api/user'
import { deepCopy, getBrowserLang, SHA512 } from "@/utils/tools"
import { showSnackbar } from "@/utils/snackbar"
import useUserStore from "@store/user"
import useGlobalStore from "@store/global"
import { useRouter } from 'vue-router'
import NavHeader from "@/layouts/components/NavHeader.vue"
import Github from "@/layouts/components/GitHub.vue"
import LangSelect from "@/layouts/components/LangSelect.vue"
import Document from "@/layouts/components/Document.vue"
import NavbarThemeSwitcher from "@/layouts/components/NavbarThemeSwitcher.vue"
import { useI18n } from "vue-i18n"


const router = useRouter()
const { t } = useI18n()
const userStore = useUserStore()
const globalStore = useGlobalStore()

const { mobile } = useDisplay()

onMounted(() => {

})

const loginForm = ref({
  username: '',
  password: '',
})

const vuetifyTheme = useTheme()

const authThemeMask = computed(() => {
  return vuetifyTheme.global.name.value === 'light' ? authV1MaskLight : authV1MaskDark
})

const isPasswordVisible = ref(false)

const loginLoading = ref(false)

const handleLogin = async () => {
  if (loginForm.value.username === "") {
    showSnackbar(t('login.loginFormRule.username'), "error")
    
    return
  }
  if (loginForm.value.password === "") {
    showSnackbar(t('login.loginFormRule.password'), "error")
    
    return
  }

  loginLoading.value = true

  const reqForm = deepCopy(loginForm.value)

  reqForm.password = SHA512(loginForm.value.password)

  userApi.login.post(reqForm).then(async response => {
    const resLogin = await userApi.login.post(reqForm)

    userStore.token = resLogin.data

    const resUser = await userApi.base.get()

    userStore.userInfo = resUser.data

    const resMenu = await userApi.menu.get()

    userStore.menus = resMenu.data

    const redirect = router.currentRoute.value.query.redirect || '/rooms'

    if (globalStore.language === "") {
      globalStore.language = getBrowserLang()
    }
    if (globalStore.theme === "") {
      globalStore.theme = "light"
    }
    await router.push(redirect)
    showSnackbar(t('login.loginSuccess'))
  }).finally(() => {
    loginLoading.value = false
  })
}

const registerDialogVisible = ref(false)
const registerLoading = ref(false)

const registerForm = ref({
  username: '',
  nickname: '',
  avatar: '1',
  password: '',
})

const registerFormRules = {
  username: [
    value => {
      if (value) return true
      
      return t('login.registerFormRule.username')
    },
  ],
  nickname: [
    value => {
      if (value) return true
      
      return t('login.registerFormRule.nickname')
    },
  ],
  password: [
    value => {
      if (value) return true
      
      return t('login.registerFormRule.password')
    },
  ],
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

const handleRegisterPost = async event => {
  registerLoading.value = true

  const results = await event

  if (!results.valid) {
    registerLoading.value = false
    
    return
  }

  const password = SHA512(registerForm.value.password)

  const reqForm = {
    username: registerForm.value.username,
    nickname: registerForm.value.nickname,
    avatar: registerForm.value.avatar,
    password: password,
  }

  userApi.register.post(reqForm).then(response => {
    showSnackbar(response.message)
    registerLoading.value = false
    registerDialogVisible.value = false
    registerForm.value = {
      username: '',
      nickname: '',
      avatar: '1',
      password: '',
    }
  }).finally(() => {
    registerLoading.value = false
  })

}
</script>

<style lang="scss" scoped>
@use "@core/scss/template/pages/page-auth";
.header {
  padding: 16px;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
}
</style>
