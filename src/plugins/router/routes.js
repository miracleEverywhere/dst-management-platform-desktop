export const routes = [
  { path: '/', redirect: '/dashboard' },
  {
    path: '/',
    component: () => import('@/layouts/default.vue'),
    children: [
      {
        path: 'rooms',
        component: () => import('@/views/rooms/index.vue'),
      },
      {
        path: 'dashboard',
        component: () => import('@/views/dashboard/index.vue'),
      },
      {
        path: 'game/base',
        component: () => import('@/views//game/base.vue'),
      },
      {
        path: 'game/mod',
        component: () => import('@/views//game/mod.vue'),
      },
      {
        path: 'game/player',
        component: () => import('@/views/game/player.vue'),
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
        path: 'tools/map',
        component: () => import('@/views/tools/map.vue'),
      },
      {
        path: 'tools/snapshot',
        component: () => import('@/views/tools/snapshot.vue'),
      },
      {
        path: 'logs/game',
        component: () => import('@/views/logs/game.vue'),
      },
      {
        path: 'logs/chat',
        component: () => import('@/views/logs/chat.vue'),
      },
      {
        path: 'logs/download',
        component: () => import('@/views/logs/download.vue'),
      },
      {
        path: 'logs/steam',
        component: () => import('@/views/logs/steam.vue'),
      },
      {
        path: 'logs/access',
        component: () => import('@/views/logs/access.vue'),
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
        path: 'upload',
        component: () => import('@/views/upload/index.vue'),
      },
      {
        path: 'install',
        component: () => import('@/views/install/index.vue'),
      },
      {
        path: 'platform',
        component: () => import('@/views/platform/index.vue'),
      },
    ],
  },
  {
    path: '/',
    component: () => import('@/layouts/blank.vue'),
    children: [
      {
        path: 'entry',
        component: () => import('@/views/entry/index.vue'),
      },
      {
        path: '/:pathMatch(.*)*',
        component: () => import('@/components/[...error].vue'),
      },
    ],
  },
]
