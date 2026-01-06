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
import { useI18n } from "vue-i18n"
import eventBus from '@/utils/eventBus'
import { useRoute } from 'vue-router'

const { t } = useI18n()
const route = useRoute()

const menus = [
  {
    "id": 1,
    "type": "link",
    "section": "",
    "title": "rooms",
    "to": "/rooms",
    "component": "rooms/index",
    "icon": "ri-instance-line",
    "links": null,
  },
  {
    "id": 2,
    "type": "link",
    "section": "",
    "title": "dashboard",
    "to": "/dashboard",
    "component": "dashboard/index",
    "icon": "ri-function-ai-line",
    "links": null,
  },
  {
    "id": 3,
    "type": "group",
    "section": "",
    "title": "game",
    "to": "/game",
    "component": "",
    "icon": "ri-gamepad-line",
    "links": [
      {
        "id": 301,
        "type": "link",
        "section": "",
        "title": "gameBase",
        "to": "/game/base",
        "component": "game/base",
        "icon": "ri-sword-line",
        "links": null,
      },
      {
        "id": 302,
        "type": "link",
        "section": "",
        "title": "gameMod",
        "to": "/game/mod",
        "component": "game/mod",
        "icon": "ri-rocket-2-line",
        "links": null,
      },
      {
        "id": 303,
        "type": "link",
        "section": "",
        "title": "gamePlayer",
        "to": "/game/player",
        "component": "game/player",
        "icon": "ri-ghost-line",
        "links": null,
      },
    ],
  },
  {
    "id": 6,
    "type": "group",
    "section": "",
    "title": "tools",
    "to": "/tools",
    "component": "",
    "icon": "ri-wrench-line",
    "links": [
      {
        "id": 601,
        "type": "link",
        "section": "",
        "title": "toolsBackup",
        "to": "/tools/backup",
        "component": "tools/backup",
        "icon": "ri-save-2-line",
        "links": null,
      },
      {
        "id": 602,
        "type": "link",
        "section": "",
        "title": "toolsAnnounce",
        "to": "/tools/announce",
        "component": "tools/announce",
        "icon": "ri-chat-smile-ai-3-line",
        "links": null,
      },
      {
        "id": 603,
        "type": "link",
        "section": "",
        "title": "toolsMap",
        "to": "/tools/map",
        "component": "tools/map",
        "icon": "ri-road-map-line",
        "links": null,
      },
    ],
  },
  {
    "id": 7,
    "type": "group",
    "section": "",
    "title": "logs",
    "to": "/logs",
    "component": "",
    "icon": "ri-blogger-line",
    "links": [
      {
        "id": 701,
        "type": "link",
        "section": "",
        "title": "logsGame",
        "to": "/logs/game",
        "component": "logs/game",
        "icon": "ri-game-line",
        "links": null,
      },
      {
        "id": 702,
        "type": "link",
        "section": "",
        "title": "logsChat",
        "to": "/logs/chat",
        "component": "logs/chat",
        "icon": "ri-chat-smile-3-line",
        "links": null,
      },
      {
        "id": 703,
        "type": "link",
        "section": "",
        "title": "logsDownload",
        "to": "/logs/download",
        "component": "logs/download",
        "icon": "ri-download-2-line",
        "links": null,
      },
      {
        "id": 704,
        "type": "link",
        "section": "",
        "title": "logsSteam",
        "to": "/logs/steam",
        "component": "logs/steam",
        "icon": "ri-steam-line",
        "links": null,
      },
      {
        "id": 705,
        "type": "link",
        "section": "",
        "title": "logsAccess",
        "to": "/logs/access",
        "component": "logs/access",
        "icon": "ri-code-box-line",
        "links": null,
      },
      {
        "id": 706,
        "type": "link",
        "section": "",
        "title": "logsRuntime",
        "to": "/logs/runtime",
        "component": "logs/runtime",
        "icon": "ri-terminal-box-line",
        "links": null,
      },
      {
        "id": 707,
        "type": "link",
        "section": "",
        "title": "logsClean",
        "to": "/logs/clean",
        "component": "logs/clean",
        "icon": "ri-file-shred-line",
        "links": null,
      },
    ],
  },
  {
    "id": 4,
    "type": "link",
    "section": "",
    "title": "upload",
    "to": "/upload",
    "component": "upload/index",
    "icon": "ri-contacts-book-upload-line",
    "links": null,
  },
  {
    "id": 5,
    "type": "link",
    "section": "",
    "title": "install",
    "to": "/install",
    "component": "install/index",
    "icon": "ri-import-line",
    "links": null,
  },
  {
    "id": 8,
    "type": "link",
    "section": "",
    "title": "platform",
    "to": "/platform",
    "component": "platform/index",
    "icon": "ri-vip-crown-2-line",
    "links": null,
  },
]

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