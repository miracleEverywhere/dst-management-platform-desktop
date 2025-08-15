<template>
  <VerticalNavLayout>
    <!-- 👉 navbar 顶部一长条-->
    <template #navbar="{ toggleVerticalOverlayNavActive }">
      <div class="d-flex h-100 align-center">
        <!-- 👉 小屏幕菜单按钮 -->
        <IconBtn
          class="ms-n3 d-lg-none"
          @click="toggleVerticalOverlayNavActive(true)"
        >
          <VIcon icon="ri-menu-line"/>
        </IconBtn>

        <div
          class="d-flex align-center w-25"
        >
          <v-select v-model="globalStore.selectedDstCluster"
                    v-model:menu="selectOpen"
                    :items="globalStore.dstClusters===null?[]:globalStore.dstClusters"
                    item-title="clusterDisplayName"
                    item-value="clusterName"
                    density="compact"
                    @update:model-value="handleSelectedClusterChange"
          >
            <template #append-item>
              <v-list-item @click="handleOpenCreateDialog">
                <v-list-item-title>
                  新建集群
                </v-list-item-title>
              </v-list-item>
            </template>
          </v-select>

        </div>

        <v-dialog v-model="clusterCreateDialogVisible" persistent width="60%">
          <v-card>
            <v-card-title>
              集群创建
            </v-card-title>
            <v-card-text>
              <v-form class="my-8" @submit.prevent="handleCreate">
                <v-text-field v-model="clusterForm.clusterName"
                              :rules="clusterFormRules"
                              label="集群名"
                              class="mb-4"
                ></v-text-field>
                <v-text-field v-model="clusterForm.clusterDisplayName"
                              label="集群昵称"
                              class="mb-8"
                ></v-text-field>
                <div class="d-flex justify-end" style="margin-bottom: -32px">
                  <v-btn @click="clusterCreateDialogVisible=false" class="mr-4" color="grey">取消</v-btn>
                  <v-btn :loading="createLoading" type="submit">创建</v-btn>
                </div>

              </v-form>
            </v-card-text>

          </v-card>
        </v-dialog>

        <VSpacer/>

        <IconBtn
          href="https://github.com/miracleEverywhere/dst-management-platform-desktop"
          rel="noopener noreferrer"
          target="_blank"
        >
          <VIcon icon="ri-github-fill"/>
        </IconBtn>

        <NavbarThemeSwitcher class="me-2"/>

        <IconBtn :disabled="needDisabled()" >
          <v-tooltip activator="parent" open-delay="1000" scroll-strategy="close">
            重新载入应用
          </v-tooltip>
          <VIcon icon="ri-refresh-line" @click="handleReload"/>
        </IconBtn>

        <IconBtn>
          <v-tooltip activator="parent" open-delay="1000" scroll-strategy="close">
            退出当前存档，返回存档选择界面
          </v-tooltip>
          <VIcon icon="ri-logout-box-r-line" @click="handleOut"/>
        </IconBtn>
      </div>
    </template>

    <template #vertical-nav-header="{ toggleIsOverlayNavActive }">
      <RouterLink
        class="app-logo app-title-wrapper"
        to="/"
      >
        <!-- LOGO -->
        <v-img
          width="4em"
          height="4em"
          src="src/assets/images/logo.svg"
        ></v-img>
        <!-- 标题 -->
        <h1 class="font-weight-medium leading-normal text-xl text-uppercase">
          {{ title }}
        </h1>
      </RouterLink>
      <!-- 标题右边的关闭按钮 -->
      <IconBtn
        class="d-block d-lg-none"
        @click="toggleIsOverlayNavActive(false)"
      >
        <VIcon icon="ri-close-line"/>
      </IconBtn>
    </template>

    <template #vertical-nav-content>
      <NavItems/>
    </template>
    <slot/>
  </VerticalNavLayout>
</template>

<script setup>
import NavItems from '@/layouts/components/NavItems.vue'
import settingApi from '@/api/setting'
import VerticalNavLayout from '@layouts/components/VerticalNavLayout.vue'
import NavbarThemeSwitcher from '@/layouts/components/NavbarThemeSwitcher.vue'
import useGlobalStore from "@/plugins/pinia/global";
import useConfigStore from '@/plugins/pinia/config'
import ElectronApi from "@/utils/electronApi";
import {DB_KEY} from "@/config";
import {showSnackbar} from "@/utils/snackbar";


onMounted(async () => {
  getClusters()
})

const router = useRouter()
const globalStore = useGlobalStore()
const configStore = useConfigStore()

const title = import.meta.env.VITE_TITLE

const handleOut = () => {
  configStore.inConfig = true
  globalStore.clearStore()
  ElectronApi.window.config()
}

const handleReload = () => {
  ElectronApi.window.reload()
}

const needDisabled = () => {
  if (router.currentRoute.value.fullPath === '/tools/statistics') {
    return true
  }
  return router.currentRoute.value.fullPath === '/tools/metrics';
}

const getClusters = () => {
  settingApi.clusters.get().then(response => {
    globalStore.dstClusters = response.data
    const selectedDstCluster = ElectronApi.store.get(DB_KEY.selectedDstCluster + globalStore.id) || null
    if (globalStore.selectedDstCluster === null && globalStore.dstClusters !== null && selectedDstCluster === null) {
      ElectronApi.store.set(DB_KEY.selectedDstCluster + globalStore.id, globalStore.dstClusters[0].clusterName)
      globalStore.selectedDstCluster = globalStore.dstClusters[0].clusterName
    }
  })
}

const handleSelectedClusterChange = () => {
  if (globalStore.selectedDstCluster) {
    ElectronApi.store.set(DB_KEY.selectedDstCluster + globalStore.id, globalStore.selectedDstCluster)
    handleReload()
  }
}

const selectOpen = ref(false)
const clusterCreateDialogVisible = ref(false)
const handleOpenCreateDialog = () => {
  selectOpen.value = false
  clusterCreateDialogVisible.value = true
}
const clusterForm = ref({
  clusterName: "",
  clusterDisplayName: "",
})
const clusterFormRules = ref([
  value => {
    if (!value) {
      return "请输入集群名"
    }
    if (!/^[a-zA-Z]/.test(value)) {
      return '第一个字符必须是字母'
    }
    if (!/^[a-zA-Z0-9]+$/.test(value)) {
      return '只能包含字母和数字'
    }

    return true
  }
])
const createLoading = ref(false)
const handleCreate = async (event) => {
  console.log(1)
  createLoading.value = true
  const results = await event
  if (!results.valid) {
    createLoading.value = false
    return
  }

  const reqForm = {
    clusterName: clusterForm.value.clusterName,
    clusterDisplayName: clusterForm.value.clusterDisplayName?clusterForm.value.clusterDisplayName:clusterForm.value.clusterName
  }
  createLoading.value = true
  settingApi.cluster.post(reqForm).then(async response => {
    clusterCreateDialogVisible.value = false
    showSnackbar(response.message)
    await getClusters()
    globalStore.selectedDstCluster = clusterForm.value.clusterName
  }).finally(() => {
    createLoading.value = false
  })
}

</script>

<style lang="scss" scoped>
.meta-key {
  border: thin solid rgba(var(--v-border-color), var(--v-border-opacity));
  border-radius: 6px;
  block-size: 1.5625rem;
  line-height: 1.3125rem;
  padding-block: 0.125rem;
  padding-inline: 0.25rem;
}

.app-logo {
  display: flex;
  align-items: center;
  column-gap: 0.75rem;

  .app-logo-title {
    font-size: 1.25rem;
    font-weight: 500;
    line-height: 1.75rem;
    text-transform: uppercase;
  }
}
</style>
