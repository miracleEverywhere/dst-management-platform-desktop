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
      icon: 'ri-settings-line',
    }"
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
  />
<!--  &lt;!&ndash; 👉 Apps & Pages &ndash;&gt;-->
<!--  <VerticalNavSectionTitle-->
<!--      :item="{-->
<!--      heading: 'Apps & Pages',-->
<!--    }"-->
<!--  />-->
<!--  <VerticalNavLink-->
<!--      :item="{-->
<!--      title: 'Email',-->
<!--      icon: 'ri-mail-line',-->
<!--      href: 'https://demos.themeselection.com/materio-vuetify-vuejs-admin-template/demo-1/apps/email',-->
<!--      target: '_blank',-->
<!--      badgeContent: 'Pro',-->
<!--      badgeClass: 'bg-light-primary text-primary',-->
<!--    }"-->
<!--  />-->
<!--  <VerticalNavLink-->
<!--      :item="{-->
<!--      title: 'Chat',-->
<!--      icon: 'ri-wechat-line',-->
<!--      href: 'https://demos.themeselection.com/materio-vuetify-vuejs-admin-template/demo-1/apps/chat',-->
<!--      target: '_blank',-->
<!--      badgeContent: 'Pro',-->
<!--      badgeClass: 'bg-light-primary text-primary',-->
<!--    }"-->
<!--  />-->
<!--  <VerticalNavLink-->
<!--      :item="{-->
<!--      title: 'Calendar',-->
<!--      icon: 'ri-calendar-line',-->
<!--      href: 'https://demos.themeselection.com/materio-vuetify-vuejs-admin-template/demo-1/apps/calendar',-->
<!--      target: '_blank',-->
<!--      badgeContent: 'Pro',-->
<!--      badgeClass: 'bg-light-primary text-primary',-->
<!--    }"-->
<!--  />-->
<!--  <VerticalNavLink-->
<!--      :item="{-->
<!--      title: 'Kanban',-->
<!--      icon: 'ri-drag-drop-line',-->
<!--      href: 'https://demos.themeselection.com/materio-vuetify-vuejs-admin-template/demo-1/apps/kanban',-->
<!--      target: '_blank',-->
<!--      badgeContent: 'Pro',-->
<!--      badgeClass: 'bg-light-primary text-primary',-->
<!--    }"-->
<!--  />-->

<!--  <VerticalNavLink-->
<!--      :item="{-->
<!--      title: 'Account Settings',-->
<!--      icon: 'ri-user-settings-line',-->
<!--      to: '/account-settings',-->
<!--    }"-->
<!--  />-->

<!--  <VerticalNavLink-->
<!--      :item="{-->
<!--      title: 'Login',-->
<!--      icon: 'ri-login-box-line',-->
<!--      to: '/login',-->
<!--    }"-->
<!--  />-->
<!--  <VerticalNavLink-->
<!--      :item="{-->
<!--      title: 'Register',-->
<!--      icon: 'ri-user-add-line',-->
<!--      to: '/register',-->
<!--    }"-->
<!--  />-->
<!--  <VerticalNavLink-->
<!--      :item="{-->
<!--      title: 'Error',-->
<!--      icon: 'ri-information-line',-->
<!--      to: '/no-existence',-->
<!--    }"-->
<!--  />-->

<!--  &lt;!&ndash; 👉 User Interface &ndash;&gt;-->
<!--  <VerticalNavSectionTitle-->
<!--      :item="{-->
<!--      heading: 'User Interface',-->
<!--    }"-->
<!--  />-->
<!--  <VerticalNavLink-->
<!--      :item="{-->
<!--      title: 'Typography',-->
<!--      icon: 'ri-text',-->
<!--      to: '/typography',-->
<!--    }"-->
<!--  />-->
<!--  <VerticalNavLink-->
<!--      :item="{-->
<!--      title: 'Icons',-->
<!--      icon: 'ri-remixicon-line',-->
<!--      to: '/icons',-->
<!--    }"-->
<!--  />-->
<!--  <VerticalNavLink-->
<!--      :item="{-->
<!--      title: 'Cards',-->
<!--      icon: 'ri-bar-chart-box-line',-->
<!--      to: '/cards',-->
<!--    }"-->
<!--  />-->

<!--  &lt;!&ndash; 👉 Forms & Tables &ndash;&gt;-->
<!--  <VerticalNavSectionTitle-->
<!--      :item="{-->
<!--      heading: 'Forms & Tables',-->
<!--    }"-->
<!--  />-->
<!--  <VerticalNavLink-->
<!--      :item="{-->
<!--      title: 'Form Layouts',-->
<!--      icon: 'ri-layout-4-line',-->
<!--      to: '/form-layouts',-->
<!--    }"-->
<!--  />-->
<!--  <VerticalNavLink-->
<!--      :item="{-->
<!--      title: 'Form Validation',-->
<!--      icon: 'ri-checkbox-multiple-line',-->
<!--      href: 'https://demos.themeselection.com/materio-vuetify-vuejs-admin-template/demo-1/forms/form-validation',-->
<!--      target: '_blank',-->
<!--      badgeContent: 'Pro',-->
<!--      badgeClass: 'bg-light-primary text-primary',-->
<!--    }"-->
<!--  />-->
<!--  <VerticalNavLink-->
<!--      :item="{-->
<!--      title: 'Form Wizard',-->
<!--      icon: 'ri-git-commit-line',-->
<!--      href: 'https://demos.themeselection.com/materio-vuetify-vuejs-admin-template/demo-1/forms/form-wizard-numbered',-->
<!--      target: '_blank',-->
<!--      badgeContent: 'Pro',-->
<!--      badgeClass: 'bg-light-primary text-primary',-->
<!--    }"-->
<!--  />-->
<!--  <VerticalNavLink-->
<!--      :item="{-->
<!--      title: 'Tables',-->
<!--      icon: 'ri-table-alt-line',-->
<!--      to: '/tables',-->
<!--    }"-->
<!--  />-->

<!--  &lt;!&ndash; 👉 Others &ndash;&gt;-->
<!--  <VerticalNavSectionTitle-->
<!--      :item="{-->
<!--      heading: 'Others',-->
<!--    }"-->
<!--  />-->
<!--  <VerticalNavLink-->
<!--      :item="{-->
<!--      title: 'Access Control',-->
<!--      icon: 'ri-shield-line',-->
<!--      href: 'https://demos.themeselection.com/materio-vuetify-vuejs-admin-template/demo-1/access-control',-->
<!--      target: '_blank',-->
<!--      badgeContent: 'Pro',-->
<!--      badgeClass: 'bg-light-primary text-primary',-->
<!--    }"-->
<!--  />-->
<!--  <VerticalNavLink-->
<!--      :item="{-->
<!--      title: 'Documentation',-->
<!--      icon: 'ri-article-line',-->
<!--      href: 'https://demos.themeselection.com/materio-vuetify-vuejs-admin-template/documentation/',-->
<!--      target: '_blank',-->
<!--    }"-->
<!--  />-->
<!--  <VerticalNavLink-->
<!--      :item="{-->
<!--      title: 'Raise Support',-->
<!--      href: 'https://github.com/themeselection/materio-vuetify-vuejs-admin-template-free/issues',-->
<!--      icon: 'ri-lifebuoy-line',-->
<!--      target: '_blank',-->
<!--    }"-->
<!--  />-->
</template>

<script setup>
import VerticalNavSectionTitle from '@/@layouts/components/VerticalNavSectionTitle.vue'
import VerticalNavGroup from '@layouts/components/VerticalNavGroup.vue'
import VerticalNavLink from '@layouts/components/VerticalNavLink.vue'
</script>
