<template>
  <template v-for="menu in menus">
    <vertical-nav-section-title
      v-if="menu.section!==''"
      :key="menu.id"
      :item="{heading: menu.section}"
    />
    <vertical-nav-group
      v-if="menu.type==='group'"
      :key="menu.id"
      :item="{
        title: t('menu.'+menu.title),
        badgeContent: menu.badgeContent,
        badgeClass: menu.badgeClass,
        icon: menu.icon
      }"
      :is-open="activeGroupId === menu.id"
      @toggle="handleGroupToggle(menu.id)"
    >
      <vertical-nav-link
        v-for="link in menu.links"
        :key="link.id"
        :item="{
          title: t('menu.'+link.title),
          icon: link.icon,
          to: link.to,
          href: link.href,
          target: link.target,
          badgeContent: link.badgeContent,
        }"
      />
    </vertical-nav-group>
    <vertical-nav-link
      v-if="menu.type==='link'"
      :key="menu.id"
      :item="{
        title: t('menu.'+menu.title),
        icon: menu.icon,
        to: menu.to,
        href: menu.href,
        target: menu.target,
        badgeContent: menu.badgeContent,
      }"
      @click="handleCloseAll"
    />
  </template>
</template>

<script setup>
import VerticalNavSectionTitle from '@/@layouts/components/VerticalNavSectionTitle.vue'
import VerticalNavGroup from '@layouts/components/VerticalNavGroup.vue'
import VerticalNavLink from '@layouts/components/VerticalNavLink.vue'
import useUserStore from '@store/user'
import { useI18n } from "vue-i18n"
import eventBus from '@/utils/eventBus'
import { useRoute } from 'vue-router'

const userStore = useUserStore()
const { t } = useI18n()
const route = useRoute()

const menus = userStore.menus

// 当前展开的菜单组ID
const activeGroupId = ref(null)

// 根据当前路由路径查找对应的菜单组
const findGroupByPath = path => {
  for (const menu of menus) {
    if (menu.type === 'group' && menu.links) {
      // 检查当前路径是否匹配该组内的任意链接
      const matchedLink = menu.links.find(link => {
        // 处理各种路径匹配情况
        if (link.to === path) return true
        if (link.href === path) return true

        // 如果是动态路由，可以添加更复杂的匹配逻辑
        return link.to && path.startsWith(link.to)

      })

      if (matchedLink) {
        return menu.id
      }
    }
  }
  
  return null
}

// 监听路由变化，自动展开对应的菜单组
watch(() => route.path, newPath => {
  const targetGroupId = findGroupByPath(newPath)
  if (targetGroupId) {
    activeGroupId.value = targetGroupId
  } else {
    activeGroupId.value = null
  }
}, { immediate: true }) // 立即执行一次，确保页面加载时正确展开

// 展开/折叠
const handleGroupToggle = groupId => {
  if (activeGroupId.value === groupId) {
    activeGroupId.value = null
  } else {
    activeGroupId.value = groupId
  }
}

const handleCloseAll = () => {
  activeGroupId.value = null
}

onMounted(() => {
  eventBus.on('toggleMenu', handleGroupToggle)
})
</script>