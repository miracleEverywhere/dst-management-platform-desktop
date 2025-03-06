<template>
  <!-- 👉 Dashboards -->
  <VerticalNavLink
      :item="{
        title: '首页',
        icon: 'ri-home-smile-line',
        to: '/dashboard',
      }"
  />
  <!-- 👉 settings -->
  <VerticalNavGroup
      :item="{
      title: '设置',
      icon: 'ri-home-smile-line',
    }"
  >
    <VerticalNavLink
        :item="{
        title: '房间',
        icon: 'ri-home-smile-line',
        to: '/settings/room',
      }"
    />
    <VerticalNavLink
        :item="{
        title: '玩家',
        icon: 'ri-home-smile-line',
        to: '/settings/player',
      }"
    />
    <VerticalNavLink
        :item="{
        title: '模组',
        icon: 'ri-home-smile-line',
        to: '/settings/mod',
      }"
    />
    <VerticalNavLink
        :item="{
        title: '导入',
        icon: 'ri-home-smile-line',
        to: '/settings/import',
      }"
    />
    <VerticalNavLink
        :item="{
        title: '系统',
        icon: 'ri-home-smile-line',
        to: '/settings/system',
      }"
    />
  </VerticalNavGroup>
  <!-- 👉 tools -->
  <VerticalNavGroup
      :item="{
      title: '工具',
      icon: 'ri-home-smile-line',
    }"
  >
    <VerticalNavLink
        :item="{
        title: '定时更新',
        icon: 'ri-home-smile-line',
        to: '/tools/update',
      }"
    />
    <VerticalNavLink
        :item="{
        title: '定时备份',
        icon: 'ri-home-smile-line',
        to: '/tools/backup',
      }"
    />
    <VerticalNavLink
        :item="{
        title: '定时通知',
        icon: 'ri-home-smile-line',
        to: '/tools/announce',
      }"
    />
    <VerticalNavLink
        :item="{
        title: '安装游戏',
        icon: 'ri-home-smile-line',
        to: '/tools/install',
      }"
    />
    <VerticalNavLink
        :item="{
        title: '玩家统计',
        icon: 'ri-home-smile-line',
        to: '/tools/statistics',
      }"
    />
    <VerticalNavLink
        :item="{
        title: '系统监控',
        icon: 'ri-home-smile-line',
        to: '/tools/metrics',
      }"
    />
  </VerticalNavGroup>

  <!-- 👉 Apps & Pages -->
  <VerticalNavSectionTitle
      :item="{
      heading: 'Apps & Pages',
    }"
  />
  <VerticalNavLink
      :item="{
      title: 'Email',
      icon: 'ri-mail-line',
      href: 'https://demos.themeselection.com/materio-vuetify-vuejs-admin-template/demo-1/apps/email',
      target: '_blank',
      badgeContent: 'Pro',
      badgeClass: 'bg-light-primary text-primary',
    }"
  />
  <VerticalNavLink
      :item="{
      title: 'Chat',
      icon: 'ri-wechat-line',
      href: 'https://demos.themeselection.com/materio-vuetify-vuejs-admin-template/demo-1/apps/chat',
      target: '_blank',
      badgeContent: 'Pro',
      badgeClass: 'bg-light-primary text-primary',
    }"
  />
  <VerticalNavLink
      :item="{
      title: 'Calendar',
      icon: 'ri-calendar-line',
      href: 'https://demos.themeselection.com/materio-vuetify-vuejs-admin-template/demo-1/apps/calendar',
      target: '_blank',
      badgeContent: 'Pro',
      badgeClass: 'bg-light-primary text-primary',
    }"
  />
  <VerticalNavLink
      :item="{
      title: 'Kanban',
      icon: 'ri-drag-drop-line',
      href: 'https://demos.themeselection.com/materio-vuetify-vuejs-admin-template/demo-1/apps/kanban',
      target: '_blank',
      badgeContent: 'Pro',
      badgeClass: 'bg-light-primary text-primary',
    }"
  />

  <VerticalNavLink
      :item="{
      title: 'Account Settings',
      icon: 'ri-user-settings-line',
      to: '/account-settings',
    }"
  />

  <VerticalNavLink
      :item="{
      title: 'Login',
      icon: 'ri-login-box-line',
      to: '/login',
    }"
  />
  <VerticalNavLink
      :item="{
      title: 'Register',
      icon: 'ri-user-add-line',
      to: '/register',
    }"
  />
  <VerticalNavLink
      :item="{
      title: 'Error',
      icon: 'ri-information-line',
      to: '/no-existence',
    }"
  />

  <!-- 👉 User Interface -->
  <VerticalNavSectionTitle
      :item="{
      heading: 'User Interface',
    }"
  />
  <VerticalNavLink
      :item="{
      title: 'Typography',
      icon: 'ri-text',
      to: '/typography',
    }"
  />
  <VerticalNavLink
      :item="{
      title: 'Icons',
      icon: 'ri-remixicon-line',
      to: '/icons',
    }"
  />
  <VerticalNavLink
      :item="{
      title: 'Cards',
      icon: 'ri-bar-chart-box-line',
      to: '/cards',
    }"
  />

  <!-- 👉 Forms & Tables -->
  <VerticalNavSectionTitle
      :item="{
      heading: 'Forms & Tables',
    }"
  />
  <VerticalNavLink
      :item="{
      title: 'Form Layouts',
      icon: 'ri-layout-4-line',
      to: '/form-layouts',
    }"
  />
  <VerticalNavLink
      :item="{
      title: 'Form Validation',
      icon: 'ri-checkbox-multiple-line',
      href: 'https://demos.themeselection.com/materio-vuetify-vuejs-admin-template/demo-1/forms/form-validation',
      target: '_blank',
      badgeContent: 'Pro',
      badgeClass: 'bg-light-primary text-primary',
    }"
  />
  <VerticalNavLink
      :item="{
      title: 'Form Wizard',
      icon: 'ri-git-commit-line',
      href: 'https://demos.themeselection.com/materio-vuetify-vuejs-admin-template/demo-1/forms/form-wizard-numbered',
      target: '_blank',
      badgeContent: 'Pro',
      badgeClass: 'bg-light-primary text-primary',
    }"
  />
  <VerticalNavLink
      :item="{
      title: 'Tables',
      icon: 'ri-table-alt-line',
      to: '/tables',
    }"
  />

  <!-- 👉 Others -->
  <VerticalNavSectionTitle
      :item="{
      heading: 'Others',
    }"
  />
  <VerticalNavLink
      :item="{
      title: 'Access Control',
      icon: 'ri-shield-line',
      href: 'https://demos.themeselection.com/materio-vuetify-vuejs-admin-template/demo-1/access-control',
      target: '_blank',
      badgeContent: 'Pro',
      badgeClass: 'bg-light-primary text-primary',
    }"
  />
  <VerticalNavLink
      :item="{
      title: 'Documentation',
      icon: 'ri-article-line',
      href: 'https://demos.themeselection.com/materio-vuetify-vuejs-admin-template/documentation/',
      target: '_blank',
    }"
  />
  <VerticalNavLink
      :item="{
      title: 'Raise Support',
      href: 'https://github.com/themeselection/materio-vuetify-vuejs-admin-template-free/issues',
      icon: 'ri-lifebuoy-line',
      target: '_blank',
    }"
  />
</template>

<script setup>
import VerticalNavSectionTitle from '@/@layouts/components/VerticalNavSectionTitle.vue'
import VerticalNavGroup from '@layouts/components/VerticalNavGroup.vue'
import VerticalNavLink from '@layouts/components/VerticalNavLink.vue'
</script>
