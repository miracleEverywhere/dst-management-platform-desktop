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
  <div>
    <v-card>
      123
    </v-card>
  </div>
</template>

<script setup>
import NavHeader from "@/layouts/components/NavHeader.vue"
import Github from "@/layouts/components/GitHub.vue"
import LangSelect from "@/layouts/components/LangSelect.vue"
import Document from "@/layouts/components/Document.vue"
import NavbarThemeSwitcher from "@/layouts/components/NavbarThemeSwitcher.vue"
import useUserStore from "@store/user"

const userStore = useUserStore();

const setMenu = () => {
  userStore.menus = [
    {
      "id": 1,
      "type": "link",
      "section": "",
      "title": "rooms",
      "to": "/rooms",
      "component": "rooms/index",
      "icon": "ri-instance-line",
      "links": null
    },
    {
      "id": 2,
      "type": "link",
      "section": "",
      "title": "dashboard",
      "to": "/dashboard",
      "component": "dashboard/index",
      "icon": "ri-function-ai-line",
      "links": null
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
          "links": null
        },
        {
          "id": 302,
          "type": "link",
          "section": "",
          "title": "gameMod",
          "to": "/game/mod",
          "component": "game/mod",
          "icon": "ri-rocket-2-line",
          "links": null
        },
        {
          "id": 303,
          "type": "link",
          "section": "",
          "title": "gamePlayer",
          "to": "/game/player",
          "component": "game/player",
          "icon": "ri-ghost-line",
          "links": null
        }
      ]
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
          "links": null
        },
        {
          "id": 602,
          "type": "link",
          "section": "",
          "title": "toolsAnnounce",
          "to": "/tools/announce",
          "component": "tools/announce",
          "icon": "ri-chat-smile-ai-3-line",
          "links": null
        },
        {
          "id": 603,
          "type": "link",
          "section": "",
          "title": "toolsMap",
          "to": "/tools/map",
          "component": "tools/map",
          "icon": "ri-road-map-line",
          "links": null
        },
        {
          "id": 604,
          "type": "link",
          "section": "",
          "title": "toolsToken",
          "to": "/tools/token",
          "component": "tools/token",
          "icon": "ri-coupon-line",
          "links": null
        }
      ]
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
          "links": null
        },
        {
          "id": 702,
          "type": "link",
          "section": "",
          "title": "logsChat",
          "to": "/logs/chat",
          "component": "logs/chat",
          "icon": "ri-chat-smile-3-line",
          "links": null
        },
        {
          "id": 703,
          "type": "link",
          "section": "",
          "title": "logsDownload",
          "to": "/logs/download",
          "component": "logs/download",
          "icon": "ri-download-2-line",
          "links": null
        },
        {
          "id": 704,
          "type": "link",
          "section": "",
          "title": "logsSteam",
          "to": "/logs/steam",
          "component": "logs/steam",
          "icon": "ri-steam-line",
          "links": null
        },
        {
          "id": 705,
          "type": "link",
          "section": "",
          "title": "logsAccess",
          "to": "/logs/access",
          "component": "logs/access",
          "icon": "ri-code-box-line",
          "links": null
        },
        {
          "id": 706,
          "type": "link",
          "section": "",
          "title": "logsRuntime",
          "to": "/logs/runtime",
          "component": "logs/runtime",
          "icon": "ri-terminal-box-line",
          "links": null
        },
        {
          "id": 707,
          "type": "link",
          "section": "",
          "title": "logsClean",
          "to": "/logs/clean",
          "component": "logs/clean",
          "icon": "ri-file-shred-line",
          "links": null
        }
      ]
    },
    {
      "id": 4,
      "type": "link",
      "section": "",
      "title": "upload",
      "to": "/upload",
      "component": "upload/index",
      "icon": "ri-contacts-book-upload-line",
      "links": null
    },
    {
      "id": 5,
      "type": "link",
      "section": "",
      "title": "install",
      "to": "/install",
      "component": "install/index",
      "icon": "ri-import-line",
      "links": null
    },
    {
      "id": 8,
      "type": "link",
      "section": "",
      "title": "platform",
      "to": "/platform",
      "component": "platform/index",
      "icon": "ri-vip-crown-2-line",
      "links": null
    }
  ]
}

onMounted(() => {
  setMenu()
})

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

