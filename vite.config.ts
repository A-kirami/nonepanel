/* eslint-disable new-cap */
import path from 'node:path'

import Vue from '@vitejs/plugin-vue'
import VueJsx from '@vitejs/plugin-vue-jsx'
import PostcssNesting from 'postcss-nesting'
import UnoCSS from 'unocss/vite'
import AutoImport from 'unplugin-auto-import/vite'
import Info from 'unplugin-info/vite'
import TurboConsole from 'unplugin-turbo-console/vite'
import Components from 'unplugin-vue-components/vite'
import VueMacros from 'unplugin-vue-macros/vite'
import { VueRouterAutoImports } from 'unplugin-vue-router'
import VueRouter from 'unplugin-vue-router/vite'
import { defineConfig } from 'vite'
import VueDevTools from 'vite-plugin-vue-devtools'
import MetaLayouts from 'vite-plugin-vue-meta-layouts'

import type { UserConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    VueMacros({
      plugins: {
        vue: Vue(),
        vueJsx: VueJsx(),
        vueRouter: VueRouter({
          routesFolder: 'src/views',
          dts: 'src/typed-router.d.ts',
        }),
      },
      shortVmodel: {
        prefix: '::',
      },
      betterDefine: false,
    }),
    MetaLayouts(),
    AutoImport({
      imports: [
        'vue',
        '@vueuse/core',
        VueRouterAutoImports,
      ],
      dirs: ['src/composables', 'src/stores', 'src/utils'],
      dts: 'src/auto-imports.d.ts',
      vueTemplate: true,
    }),
    Components({
      dts: 'src/components.d.ts',
    }),
    UnoCSS(),
    Info({
      meta: {
        isBuild: process.env.GITHUB_WORKFLOW === 'Build',
        isRelease: process.env.GITHUB_WORKFLOW === 'Release',
        prNum: process.env.GITHUB_PR_NUMBER,
        buildSha: process.env.GITHUB_BUILD_SHA,
      },
    }),
    TurboConsole(),
    VueDevTools(),
  ],

  resolve: {
    alias: {
      '~/': `${path.resolve(import.meta.dirname, 'src')}/`,
    },
  },

  css: {
    postcss: {
      plugins: [PostcssNesting()],
    },
    modules: {
      localsConvention: 'camelCaseOnly',
    },
  },
} satisfies UserConfig)
