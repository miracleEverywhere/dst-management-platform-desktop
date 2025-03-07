export const routes = [
  { path: '/', redirect: '/dashboard' },
  {
    path: '/',
    component: () => import('@/layouts/default.vue'),
    children: [
      {
        path: 'dashboard',
        component: () => import('@/pages/dashboard.vue'),
      },
      {
        path: 'settings/room',
        component: () => import('@/pages/settings-room.vue'),
      },
      {
        path: 'settings/player',
        component: () => import('@/pages/settings-player.vue'),
      },
      {
        path: 'settings/mod',
        component: () => import('@/pages/settings-mod.vue'),
      },
      {
        path: 'settings/import',
        component: () => import('@/pages/settings-import.vue'),
      },
      {
        path: 'settings/system',
        component: () => import('@/pages/settings-system.vue'),
      },
      {
        path: 'tools/update',
        component: () => import('@/pages/tools-update.vue'),
      },
      {
        path: 'tools/backup',
        component: () => import('@/pages/tools-backup.vue'),
      },
      {
        path: 'tools/announce',
        component: () => import('@/pages/tools-announce.vue'),
      },
      {
        path: 'tools/install',
        component: () => import('@/pages/tools-install.vue'),
      },
      {
        path: 'tools/statistics',
        component: () => import('@/pages/tools-statistics.vue'),
      },
      {
        path: 'tools/metrics',
        component: () => import('@/pages/tools-metrics.vue'),
      },
      {
        path: 'logs/ground',
        component: () => import('@/pages/logs-ground.vue'),
      },
      {
        path: 'logs/cave',
        component: () => import('@/pages/logs-cave.vue'),
      },
      {
        path: 'logs/chat',
        component: () => import('@/pages/logs-chat.vue'),
      },
      {
        path: 'logs/dmp',
        component: () => import('@/pages/logs-dmp.vue'),
      },
      {
        path: 'logs/runtime',
        component: () => import('@/pages/logs-runtime.vue'),
      },
      {
        path: 'logs/clean',
        component: () => import('@/pages/logs-clean.vue'),
      },
      {
        path: 'help',
        component: () => import('@/pages/help.vue'),
      },
    ],
  },
  {
    path: '/',
    component: () => import('@/layouts/blank.vue'),
    children: [
      {
        path: 'login',
        component: () => import('@/pages/login.vue'),
      },
      {
        path: 'config',
        component: () => import('@/pages/config.vue'),
      },
      {
        path: 'register',
        component: () => import('@/pages/register.vue'),
      },
      {
        path: '/:pathMatch(.*)*',
        component: () => import('@/pages/[...error].vue'),
      },
    ],
  },
]
