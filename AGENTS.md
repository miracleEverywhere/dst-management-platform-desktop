# AGENTS.md

This file provides guidance to Codex (Codex.ai/code) when working with code in this repository.

## Project Overview

Don't Starve Together Management Platform (饥荒管理平台) — an Electron desktop app for remotely managing DST game servers. It connects to a backend API server ([dst-management-platform-api](https://github.com/miracleEverywhere/dst-management-platform-api)).

## Commands

```bash
pnpm dev              # Start Vite dev server (port 5174)
pnpm build            # Build for web
pnpm lint             # ESLint with auto-fix
pnpm preview          # Preview production build
pnpm electron:build   # Build for web then package with electron-builder
```

There is no test runner configured in this project.

## Tech Stack

- **Desktop**: Electron 42 (two-window app via `vite-plugin-electron`)
- **UI**: Vue 3 (Composition API, `<script setup>`), Vuetify 3, Sass/SCSS
- **State**: Pinia with `pinia-plugin-persistedstate` (persists to localStorage with `dmp-` prefix)
- **Routing**: Vue Router 4 (hash mode — required by Electron's `file://` protocol)
- **HTTP**: Axios with dynamic `baseURL` set from the active connection
- **i18n**: vue-i18n (zh/en)
- **Build**: Vite 8, pnpm

## Electron: Two-Window Architecture

The app uses two separate `BrowserWindow` instances, only one visible at a time:

| Window | Purpose | Default Route | Size |
|--------|---------|--------------|------|
| `winEntry` | Login / server connection setup | `/#/entry` | 1090×800 |
| `winDashboard` | Main management interface | `/#/rooms` | 1600×1080 |

Windows switch via IPC channels (`open-dashboard-window`, `open-entry-window`) defined in `electron/main.js`. The preload script (`electron/preload.js`) exposes `window.electronAPI` via `contextBridge` with methods for store access, navigation, file downloads, theme changes, and opening external URLs. The renderer wraps these in the `ElectronApi` static class (`src/utils/electronApi.js`).

Window close is intercepted — the app minimizes to the system tray instead of quitting. The tray icon right-click menu provides the actual quit option.

## Route Architecture

Hash-mode routing with two layout groups:

- **`default.vue` layout** (`src/layouts/default.vue`) — wraps pages in `DefaultLayoutWithVerticalNav` (sidebar + header + footer). Used by: rooms, dashboard, game settings (base/mod/player), tools (backup/announce/map/snapshot), logs (game/chat/download/steam/access/runtime/clean), upload, install, platform.
- **`blank.vue` layout** (`src/layouts/blank.vue`) — minimal wrapper. Used by: entry (login), 404 catch-all.

All route components are lazy-loaded. The router listens for `force-navigate` IPC events from the Electron main process (used to redirect to `/dashboard` when the dashboard window is shown in production).

## State Management (Pinia)

Two persisted stores in `src/plugins/store/`:

- **`global`** (`dmp-global` in localStorage): theme, language, active room context (`id`, `gameName`), game/server version tracking, DMP version nag state, connection info (`entry` object with `ip`/`port`/`token`/`inEntry` flag).
- **`user`** (`dmp-user` in localStorage): user profile, menus, auth token. Has a `clearStore()` action.

## API Layer

`src/utils/axios.js` creates an Axios instance with dynamic `baseURL`:
- The URL is built at request time from `globalStore.entry.ip` + `globalStore.entry.port` + `ApiVersion` (`/v3`).
- Every request injects `X-DMP-TOKEN` (JWT) and `X-I18n-Lang` headers.
- HTTP 420 from the server means session expired → user is redirected to the entry (login) window.
- Response interceptor expects `response.data.status === 200` or `response.data.code === 200` for success.

API modules in `src/api/` are organized by domain: `dashboard.js`, `logs.js`, `mod.js`, `platform.js`, `player.js`, `room.js`, `tools.js`, `user.js`.

## Directory Map

```
src/
├── @core/             # Framework-level: SCSS base/template, shared card components, plugin registration helper
│   ├── components/    # CardStatistics*, MoreBtn, ThemeSwitcher
│   ├── scss/          # base/ and template/ SCSS (layout, Vuetify overrides, mixins, placeholders)
│   └── utils/         # colorConverter, formatters, helpers, plugins (auto-registration via import.meta.glob)
├── @layouts/          # Layout components + styles (DefaultLayoutWithVerticalNav, NavHeader, Footer, etc.)
├── api/               # API client modules per domain
├── assets/            # Fonts, images (avatars, pages, svg), styles (variables, Vuetify overrides)
├── components/        # Shared Vue components (CodeEditor, ConfirmBox, Message, scEcharts, etc.)
├── config/            # App constants: ApiVersion, GamePortFactor, DB_KEY, PiniaPrefix
├── directives/        # Custom directives (v-copy)
├── languages/         # i18n locale files (lang-zh.js, lang-en.js)
├── layouts/           # default.vue and blank.vue (thin wrappers over @layouts components)
├── plugins/           # router/, store/, vuetify/, i18n/, iconify/ — auto-registered via import.meta.glob
│   ├── router/        # routes.js (route definitions), index.js (router creation + IPC listener)
│   └── store/         # global.js, user.js, index.js (Pinia creation)
├── utils/             # axios.js (HTTP client), electronApi.js (IPC wrapper), snackbar.js, eventBus.js, tools.js
└── views/             # Page components: entry/, dashboard/, rooms/, game/, tools/, logs/, upload/, install/, platform/, profile/
```

## Plugin Auto-Registration

`src/@core/utils/plugins.js` uses `import.meta.glob` to scan `src/plugins/*.{ts,js}` and `src/plugins/*/index.{ts,js}`. Any file that `default`-exports a function `(app) => void` is automatically registered as a Vue plugin. Plugins load in sorted path order.

## Path Aliases (Vite)

| Alias | Path |
|-------|------|
| `@` | `src/` |
| `@core` | `src/@core/` |
| `@layouts` | `src/@layouts/` |
| `@images` | `src/assets/images/` |
| `@styles` | `src/assets/styles/` |
| `@store` | `src/plugins/store/` |
| `@configured-variables` | `src/assets/styles/variables/_template.scss` |

ESLint enforces using these aliases — direct `@/assets/images`, `@/plugins/store`, `@/assets/styles` imports are lint errors.

## Vuetify Custom SASS Injection

`vite.config.js` defines a custom Vite plugin (`vuetifyConfigStyles`) that prepends `@use "src/assets/styles/variables/_vuetify.scss"` to every Vuetify SASS/SCSS file. This injects custom variable overrides into Vuetify's styles. The plugin exists because `vite-plugin-vuetify`'s built-in `styles.configFile` had a race condition with virtual modules.

## Auto-Imports

- **Components**: auto-imported from `src/@core/components` and `src/components` (via `unplugin-vue-components`)
- **Functions**: `vue`, `vue-router`, `@vueuse/core`, `@vueuse/math`, `pinia` are auto-imported (via `unplugin-auto-import`) — no need to manually import `ref`, `computed`, `watch`, `useRouter`, `useRoute`, etc.

## Key Conventions

- **Semicolons**: never (`@stylistic/semi: 'error'` with `never`)
- **Indentation**: 2 spaces
- **Trailing commas**: always in multiline
- **Case**: camelCase for JS/TS identifiers. Exception: `src/views/game/components/base/levelDataMap.js` and `src/views/game/components/mod/setting.vue` allow snake_case (DST game config data).
- **Template component naming**: kebab-case (`vue/component-name-in-template-casing`)
- **Component file naming**: must match component name (`vue/match-component-file-name`)
- **Icons**: only `mdi` icons allowed (not `tabler-*`)
- **`useLayouts` composable**: restricted to `@core` and `@layouts` directories only
- **Dynamic baseURL**: The app has no static API base URL — it connects to user-configured DST server instances at runtime.
