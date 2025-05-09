export const routes = [
  { path: '/', redirect: '/dashboard' },
  {
    path: '/',
    component: () => import('@/layouts/default.vue'),
    children: [
      {
        path: 'dashboard',
        component: () => import('@/views/dashboard/index.vue'),
      },
      {
        path: 'settings/room',
        component: () => import('@/views/settings/room.vue'),
      },
      {
        path: 'settings/player',
        component: () => import('@/views/settings/player.vue'),
      },
      {
        path: 'settings/mod',
        component: () => import('@/views/settings/mod.vue'),
      },
      {
        path: 'settings/import',
        component: () => import('@/views/settings/import.vue'),
      },
      {
        path: 'settings/system',
        component: () => import('@/views/settings/system.vue'),
      },
      {
        path: 'tools/update',
        component: () => import('@/views/tools/update.vue'),
      },
      {
        path: 'tools/backup',
        component: () => import('@/views/tools/backup.vue'),
      },
      {
        path: 'tools/announce',
        component: () => import('@/views/tools/announce.vue'),
      },
      {
        path: 'tools/install',
        component: () => import('@/views/tools/install.vue'),
      },
      {
        path: 'tools/statistics',
        component: () => import('@/views/tools/statistics.vue'),
      },
      {
        path: 'tools/metrics',
        component: () => import('@/views/tools/metrics.vue'),
      },
      {
        path: 'logs/ground',
        component: () => import('@/views/logs/ground.vue'),
      },
      {
        path: 'logs/cave',
        component: () => import('@/views/logs/cave.vue'),
      },
      {
        path: 'logs/chat',
        component: () => import('@/views/logs/chat.vue'),
      },
      {
        path: 'logs/dmp',
        component: () => import('@/views/logs/dmp.vue'),
      },
      {
        path: 'logs/runtime',
        component: () => import('@/views/logs/runtime.vue'),
      },
      {
        path: 'logs/clean',
        component: () => import('@/views/logs/clean.vue'),
      },
      {
        path: 'help',
        component: () => import('@/views/help/index.vue'),
      },
    ],
  },
  {
    path: '/',
    component: () => import('@/layouts/blank.vue'),
    children: [
      {
        path: 'config',
        component: () => import('@/views/config/index.vue'),
      },
      {
        path: '/:pathMatch(.*)*',
        component: () => import('@/components/[...error].vue'),
      },
    ],
  },
]
