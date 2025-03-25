<template>
  <!-- 👉 Dashboards -->
  <VerticalNavLink
    :item="{
      title: '首页',
      icon: 'ri-home-smile-line',
      to: '/dashboard',
    }"
    @click="handleCloseAll"
  />
  <!-- 👉 settings -->
  <VerticalNavGroup
    :item="{
      title: '设置',
      icon: 'ri-settings-line',
    }"
    :is-open="activeGroupId === 'settings'"
    @toggle="handleGroupToggle('settings')"
  >
    <VerticalNavLink
      :item="{
        title: '房间',
        icon: 'ri-gamepad-fill',
        to: '/settings/room',
      }"
    />
    <VerticalNavLink
      :item="{
        title: '玩家',
        icon: 'ri-user-heart-fill',
        to: '/settings/player',
      }"
    />
    <VerticalNavLink
      :item="{
        title: '模组',
        icon: 'ri-file-settings-fill',
        to: '/settings/mod',
      }"
    />
    <VerticalNavLink
      :item="{
        title: '导入',
        icon: 'ri-import-fill',
        to: '/settings/import',
      }"
    />
    <VerticalNavLink
      :item="{
        title: '系统',
        icon: 'ri-settings-4-fill',
        to: '/settings/system',
      }"
    />
  </VerticalNavGroup>
  <!-- 👉 tools -->
  <VerticalNavGroup
    :item="{
      title: '工具',
      icon: 'ri-tools-line',
    }"
    :is-open="activeGroupId === 'tools'"
    @toggle="handleGroupToggle('tools')"
  >
    <VerticalNavLink
      :item="{
        title: '定时更新',
        icon: 'ri-download-cloud-fill',
        to: '/tools/update',
      }"
    />
    <VerticalNavLink
      :item="{
        title: '定时备份',
        icon: 'ri-save-2-fill',
        to: '/tools/backup',
      }"
    />
    <VerticalNavLink
      :item="{
        title: '定时通知',
        icon: 'ri-notification-3-fill',
        to: '/tools/announce',
      }"
    />
    <VerticalNavLink
      :item="{
        title: '安装游戏',
        icon: 'ri-install-fill',
        to: '/tools/install',
      }"
    />
    <VerticalNavLink
      :item="{
        title: '玩家统计',
        icon: 'ri-bar-chart-box-ai-fill',
        to: '/tools/statistics',
      }"
    />
    <VerticalNavLink
      :item="{
        title: '系统监控',
        icon: 'ri-line-chart-fill',
        to: '/tools/metrics',
      }"
    />
  </VerticalNavGroup>
  <!-- 👉 logs -->
  <VerticalNavGroup
    :item="{
      title: '日志',
      icon: 'ri-blogger-line',
    }"
    :is-open="activeGroupId === 'logs'"
    @toggle="handleGroupToggle('logs')"
  >
    <VerticalNavLink
      :item="{
        title: '地面日志',
        icon: 'ri-sun-fill',
        to: '/logs/ground',
      }"
    />
    <VerticalNavLink
      :item="{
        title: '洞穴日志',
        icon: 'ri-typhoon-fill',
        to: '/logs/cave',
      }"
    />
    <VerticalNavLink
      :item="{
        title: '聊天日志',
        icon: 'ri-chat-smile-fill',
        to: '/logs/chat',
      }"
    />
    <VerticalNavLink
      :item="{
        title: '请求日志',
        icon: 'ri-code-box-fill',
        to: '/logs/dmp',
      }"
    />
    <VerticalNavLink
      :item="{
        title: '运行日志',
        icon: 'ri-cpu-line',
        to: '/logs/runtime',
      }"
    />
    <VerticalNavLink
      :item="{
        title: '清理日志',
        icon: 'ri-file-shred-fill',
        to: '/logs/clean',
      }"
    />
  </VerticalNavGroup>
  <!-- 👉 帮助 -->
  <VerticalNavLink
    :item="{
      title: '帮助',
      icon: 'ri-heart-2-line',
      to: '/help',
    }"
    @click="handleCloseAll"
  />

</template>

<script setup>
import VerticalNavGroup from '@layouts/components/VerticalNavGroup.vue'
import VerticalNavLink from '@layouts/components/VerticalNavLink.vue'

// 当前展开的菜单组ID
const activeGroupId = ref(null)

// 展开/折叠
const handleGroupToggle = (groupId) => {
  if (activeGroupId.value === groupId) {
    activeGroupId.value = null
  } else {
    activeGroupId.value = groupId
  }
}

const handleCloseAll = () => {
  activeGroupId.value = null
}
</script>
