<template>
  <!-- 游戏是否安装 -->
  <template v-if="globalStore.gameVersion.local!==0">
    <!-- 房间是否选择 -->
    <template v-if="globalStore.room.id!==0">
      <v-card v-if="dataGot">
        <v-card-title class="mb-4">
          <div class="card-header">
            <span>
              {{ t('tools.map.title') }}
            </span>
            <div class="fcc">
              <v-select
                v-model="selectedWorldID"
                :items="worlds"
                item-title="worldName"
                item-value="id"
                :label="t('logs.world')"
                density="compact"
                class="mr-4"
                @update:model-value="getSummary"
              />
              <v-btn
                color="default"
                @click="getSummary"
              >
                {{ t('tools.map.refresh') }}
              </v-btn>
            </div>
          </div>
        </v-card-title>
        <v-card-text>
          <div class="fcc">
            <div style="overflow: auto">
              <canvas
                ref="canvas"
                class="fcc"
                :width="Data.image.width*2"
                :height="Data.image.height*2"
                @mousemove="getPixelColor"
              />
            </div>
          </div>

          <v-expansion-panels class="my-8">
            <v-expansion-panel>
              <v-expansion-panel-title>
                {{ t('tools.map.panels.p1') }}
              </v-expansion-panel-title>
              <v-expansion-panel-text>
                <div class="mt-8 mx-12">
                  <v-row>
                    <v-col
                      cols="12"
                      md="2"
                      class="d-flex align-center"
                      :style="{boxShadow: currentColor === '#000000' ? '0 0 10px 2px gold' : 'none',borderRadius: '10px', transition: 'box-shadow 0.3s'}"
                    >
                      <div
                        class="inline-flex border"
                        :style="{
                          backgroundColor: '#000000',
                          borderRadius: '10px',
                          height: '2rem',
                          width: '6rem',
                        }"
                      />
                      <span class="ml-1">:</span>
                      <span class="ml-4">{{ t('tools.map.colorScheme.#000000') }}</span>
                    </v-col>
                    <v-col
                      cols="12"
                      md="2"
                      class="d-flex align-center"
                      :style="{boxShadow: currentColor === '#546E7A' ? '0 0 10px 2px gold' : 'none',borderRadius: '10px', transition: 'box-shadow 0.3s'}"
                    >
                      <div
                        class="inline-flex border"
                        :style="{
                          backgroundColor: '#546E7A',
                          borderRadius: '10px',
                          height: '2rem',
                          width: '6rem',

                        }"
                      />
                      <span class="ml-1">:</span>
                      <span class="ml-4">{{ t('tools.map.colorScheme.#546E7A') }}</span>
                    </v-col>
                    <v-col
                      cols="12"
                      md="2"
                      class="d-flex align-center"
                      :style="{boxShadow: currentColor === '#A1887F' ? '0 0 10px 2px gold' : 'none',borderRadius: '10px', transition: 'box-shadow 0.3s'}"
                    >
                      <div
                        class="inline-flex border"
                        :style="{
                          backgroundColor: '#A1887F',
                          borderRadius: '10px',
                          height: '2rem',
                          width: '6rem',

                        }"
                      />
                      <span class="ml-1">:</span>
                      <span class="ml-4">{{ t('tools.map.colorScheme.#A1887F') }}</span>
                    </v-col>
                    <v-col
                      cols="12"
                      md="2"
                      class="d-flex align-center"
                      :style="{boxShadow: currentColor === '#FFEFD5' ? '0 0 10px 2px gold' : 'none',borderRadius: '10px', transition: 'box-shadow 0.3s'}"
                    >
                      <div
                        class="inline-flex border"
                        :style="{
                          backgroundColor: '#FFEFD5',
                          borderRadius: '10px',
                          height: '2rem',
                          width: '6rem',

                        }"
                      />
                      <span class="ml-1">:</span>
                      <span class="ml-4">{{ t('tools.map.colorScheme.#FFEFD5') }}</span>
                    </v-col>
                    <v-col
                      cols="12"
                      md="2"
                      class="d-flex align-center"
                      :style="{boxShadow: currentColor === '#F5DEB3' ? '0 0 10px 2px gold' : 'none',borderRadius: '10px', transition: 'box-shadow 0.3s'}"
                    >
                      <div
                        class="inline-flex border"
                        :style="{
                          backgroundColor: '#F5DEB3',
                          borderRadius: '10px',
                          height: '2rem',
                          width: '6rem',

                        }"
                      />
                      <span class="ml-1">:</span>
                      <span class="ml-4">{{ t('tools.map.colorScheme.#F5DEB3') }}</span>
                    </v-col>
                    <v-col
                      cols="12"
                      md="2"
                      class="d-flex align-center"
                      :style="{boxShadow: currentColor === '#FFFACD' ? '0 0 10px 2px gold' : 'none',borderRadius: '10px', transition: 'box-shadow 0.3s'}"
                    >
                      <div
                        class="inline-flex border"
                        :style="{
                          backgroundColor: '#FFFACD',
                          borderRadius: '10px',
                          height: '2rem',
                          width: '6rem',

                        }"
                      />
                      <span class="ml-1">:</span>
                      <span class="ml-4">{{ t('tools.map.colorScheme.#FFFACD') }}</span>
                    </v-col>
                  </v-row>

                  <v-row>
                    <v-col
                      cols="12"
                      md="2"
                      class="d-flex align-center"
                      :style="{boxShadow: currentColor === '#66CDAA' ? '0 0 10px 2px gold' : 'none',borderRadius: '10px', transition: 'box-shadow 0.3s'}"
                    >
                      <div
                        class="inline-flex border"
                        :style="{
                          backgroundColor: '#66CDAA',
                          borderRadius: '10px',
                          height: '2rem',
                          width: '6rem',

                        }"
                      />
                      <span class="ml-1">:</span>
                      <span class="ml-4">{{ t('tools.map.colorScheme.#66CDAA') }}</span>
                    </v-col>
                    <v-col
                      cols="12"
                      md="2"
                      class="d-flex align-center"
                      :style="{boxShadow: currentColor === '#2E8B57' ? '0 0 10px 2px gold' : 'none',borderRadius: '10px', transition: 'box-shadow 0.3s'}"
                    >
                      <div
                        class="inline-flex border"
                        :style="{
                          backgroundColor: '#2E8B57',
                          borderRadius: '10px',
                          height: '2rem',
                          width: '6rem',

                        }"
                      />
                      <span class="ml-1">:</span>
                      <span class="ml-4">{{ t('tools.map.colorScheme.#2E8B57') }}</span>
                    </v-col>
                    <v-col
                      cols="12"
                      md="2"
                      class="d-flex align-center"
                      :style="{boxShadow: currentColor === '#4A148C' ? '0 0 10px 2px gold' : 'none',borderRadius: '10px', transition: 'box-shadow 0.3s'}"
                    >
                      <div
                        class="inline-flex border"
                        :style="{
                          backgroundColor: '#4A148C',
                          borderRadius: '10px',
                          height: '2rem',
                          width: '6rem',

                        }"
                      />
                      <span class="ml-1">:</span>
                      <span class="ml-4">{{ t('tools.map.colorScheme.#4A148C') }}</span>
                    </v-col>
                    <v-col
                      cols="12"
                      md="2"
                      class="d-flex align-center"
                      :style="{boxShadow: currentColor === '#B2EBF2' ? '0 0 10px 2px gold' : 'none',borderRadius: '10px', transition: 'box-shadow 0.3s'}"
                    >
                      <div
                        class="inline-flex border"
                        :style="{
                          backgroundColor: '#B2EBF2',
                          borderRadius: '10px',
                          height: '2rem',
                          width: '6rem',

                        }"
                      />
                      <span class="ml-1">:</span>
                      <span class="ml-4">{{ t('tools.map.colorScheme.#B2EBF2') }}</span>
                    </v-col>
                    <v-col
                      cols="12"
                      md="2"
                      class="d-flex align-center"
                      :style="{boxShadow: currentColor === '#0091EA' ? '0 0 10px 2px gold' : 'none',borderRadius: '10px', transition: 'box-shadow 0.3s'}"
                    >
                      <div
                        class="inline-flex border"
                        :style="{
                          backgroundColor: '#0091EA',
                          borderRadius: '10px',
                          height: '2rem',
                          width: '6rem',

                        }"
                      />
                      <span class="ml-1">:</span>
                      <span class="ml-4">{{ t('tools.map.colorScheme.#0091EA') }}</span>
                    </v-col>
                    <v-col
                      cols="12"
                      md="2"
                      class="d-flex align-center"
                      :style="{boxShadow: currentColor === '#66BB6A' ? '0 0 10px 2px gold' : 'none',borderRadius: '10px', transition: 'box-shadow 0.3s'}"
                    >
                      <div
                        class="inline-flex border"
                        :style="{
                          backgroundColor: '#66BB6A',
                          borderRadius: '10px',
                          height: '2rem',
                          width: '6rem',

                        }"
                      />
                      <span class="ml-1">:</span>
                      <span class="ml-4">{{ t('tools.map.colorScheme.#66BB6A') }}</span>
                    </v-col>
                  </v-row>

                  <v-row>
                    <v-col
                      cols="12"
                      md="2"
                      class="d-flex align-center"
                      :style="{boxShadow: currentColor === '#8D6E63' ? '0 0 10px 2px gold' : 'none',borderRadius: '10px', transition: 'box-shadow 0.3s'}"
                    >
                      <div
                        class="inline-flex border"
                        :style="{
                          backgroundColor: '#8D6E63',
                          borderRadius: '10px',
                          height: '2rem',
                          width: '6rem',

                        }"
                      />
                      <span class="ml-1">:</span>
                      <span class="ml-4">{{ t('tools.map.colorScheme.#8D6E63') }}</span>
                    </v-col>
                    <v-col
                      cols="12"
                      md="2"
                      class="d-flex align-center"
                      :style="{boxShadow: currentColor === '#9E9D24' ? '0 0 10px 2px gold' : 'none',borderRadius: '10px', transition: 'box-shadow 0.3s'}"
                    >
                      <div
                        class="inline-flex border"
                        :style="{
                          backgroundColor: '#9E9D24',
                          borderRadius: '10px',
                          height: '2rem',
                          width: '6rem',

                        }"
                      />
                      <span class="ml-1">:</span>
                      <span class="ml-4">{{ t('tools.map.colorScheme.#9E9D24') }}</span>
                    </v-col>
                    <v-col
                      cols="12"
                      md="2"
                      class="d-flex align-center"
                      :style="{boxShadow: currentColor === '#BA68C8' ? '0 0 10px 2px gold' : 'none',borderRadius: '10px', transition: 'box-shadow 0.3s'}"
                    >
                      <div
                        class="inline-flex border"
                        :style="{
                          backgroundColor: '#BA68C8',
                          borderRadius: '10px',
                          height: '2rem',
                          width: '6rem',

                        }"
                      />
                      <span class="ml-1">:</span>
                      <span class="ml-4">{{ t('tools.map.colorScheme.#BA68C8') }}</span>
                    </v-col>
                    <v-col
                      cols="12"
                      md="2"
                      class="d-flex align-center"
                      :style="{boxShadow: currentColor === '#E040FB' ? '0 0 10px 2px gold' : 'none',borderRadius: '10px', transition: 'box-shadow 0.3s'}"
                    >
                      <div
                        class="inline-flex border"
                        :style="{
                          backgroundColor: '#E040FB',
                          borderRadius: '10px',
                          height: '2rem',
                          width: '6rem',

                        }"
                      />
                      <span class="ml-1">:</span>
                      <span class="ml-4">{{ t('tools.map.colorScheme.#E040FB') }}</span>
                    </v-col>
                    <v-col
                      cols="12"
                      md="2"
                      class="d-flex align-center"
                      :style="{boxShadow: currentColor === '#E57373' ? '0 0 10px 2px gold' : 'none',borderRadius: '10px', transition: 'box-shadow 0.3s'}"
                    >
                      <div
                        class="inline-flex border"
                        :style="{
                          backgroundColor: '#E57373',
                          borderRadius: '10px',
                          height: '2rem',
                          width: '6rem',

                        }"
                      />
                      <span class="ml-1">:</span>
                      <span class="ml-4">{{ t('tools.map.colorScheme.#E57373') }}</span>
                    </v-col>
                    <v-col
                      cols="12"
                      md="2"
                      class="d-flex align-center"
                      :style="{boxShadow: currentColor === '#C8E6C9' ? '0 0 10px 2px gold' : 'none',borderRadius: '10px', transition: 'box-shadow 0.3s'}"
                    >
                      <div
                        class="inline-flex border"
                        :style="{
                          backgroundColor: '#C8E6C9',
                          borderRadius: '10px',
                          height: '2rem',
                          width: '6rem',

                        }"
                      />
                      <span class="ml-1">:</span>
                      <span class="ml-4">{{ t('tools.map.colorScheme.#C8E6C9') }}</span>
                    </v-col>
                  </v-row>

                  <v-row>
                    <v-col
                      cols="12"
                      md="2"
                      class="d-flex align-center"
                      :style="{boxShadow: currentColor === '#FFA07A' ? '0 0 10px 2px gold' : 'none',borderRadius: '10px', transition: 'box-shadow 0.3s'}"
                    >
                      <div
                        class="inline-flex border"
                        :style="{
                          backgroundColor: '#FFA07A',
                          borderRadius: '10px',
                          height: '2rem',
                          width: '6rem',

                        }"
                      />
                      <span class="ml-1">:</span>
                      <span class="ml-4">{{ t('tools.map.colorScheme.#FFA07A') }}</span>
                    </v-col>
                    <v-col
                      cols="12"
                      md="2"
                      class="d-flex align-center"
                      :style="{boxShadow: currentColor === '#FFF9C4' ? '0 0 10px 2px gold' : 'none',borderRadius: '10px', transition: 'box-shadow 0.3s'}"
                    >
                      <div
                        class="inline-flex border"
                        :style="{
                          backgroundColor: '#FFF9C4',
                          borderRadius: '10px',
                          height: '2rem',
                          width: '6rem',

                        }"
                      />
                      <span class="ml-1">:</span>
                      <span class="ml-4">{{ t('tools.map.colorScheme.#FFF9C4') }}</span>
                    </v-col>
                    <v-col
                      cols="12"
                      md="2"
                      class="d-flex align-center"
                      :style="{boxShadow: currentColor === '#96CDCD' ? '0 0 10px 2px gold' : 'none',borderRadius: '10px', transition: 'box-shadow 0.3s'}"
                    >
                      <div
                        class="inline-flex border"
                        :style="{
                          backgroundColor: '#96CDCD',
                          borderRadius: '10px',
                          height: '2rem',
                          width: '6rem',

                        }"
                      />
                      <span class="ml-1">:</span>
                      <span class="ml-4">{{ t('tools.map.colorScheme.#96CDCD') }}</span>
                    </v-col>
                    <v-col
                      cols="12"
                      md="2"
                      class="d-flex align-center"
                      :style="{boxShadow: currentColor === '#FFB6C1' ? '0 0 10px 2px gold' : 'none',borderRadius: '10px', transition: 'box-shadow 0.3s'}"
                    >
                      <div
                        class="inline-flex border"
                        :style="{
                          backgroundColor: '#FFB6C1',
                          borderRadius: '10px',
                          height: '2rem',
                          width: '6rem',

                        }"
                      />
                      <span class="ml-1">:</span>
                      <span class="ml-4">{{ t('tools.map.colorScheme.#FFB6C1') }}</span>
                    </v-col>
                    <v-col
                      cols="12"
                      md="2"
                      class="d-flex align-center"
                      :style="{boxShadow: currentColor === '#FFB300' ? '0 0 10px 2px gold' : 'none',borderRadius: '10px', transition: 'box-shadow 0.3s'}"
                    >
                      <div
                        class="inline-flex border"
                        :style="{
                          backgroundColor: '#FFB300',
                          borderRadius: '10px',
                          height: '2rem',
                          width: '6rem',

                        }"
                      />
                      <span class="ml-1">:</span>
                      <span class="ml-4">{{ t('tools.map.colorScheme.#FFB300') }}</span>
                    </v-col>
                    <v-col
                      cols="12"
                      md="2"
                      class="d-flex align-center"
                      :style="{boxShadow: currentColor === '#4DB6AC' ? '0 0 10px 2px gold' : 'none',borderRadius: '10px', transition: 'box-shadow 0.3s'}"
                    >
                      <div
                        class="inline-flex border"
                        :style="{
                          backgroundColor: '#4DB6AC',
                          borderRadius: '10px',
                          height: '2rem',
                          width: '6rem',

                        }"
                      />
                      <span class="ml-1">:</span>
                      <span class="ml-4">{{ t('tools.map.colorScheme.#4DB6AC') }}</span>
                    </v-col>
                  </v-row>

                  <v-row>
                    <v-col
                      cols="12"
                      md="2"
                      class="d-flex align-center"
                      :style="{boxShadow: currentColor === '#1E88E5' ? '0 0 10px 2px gold' : 'none',borderRadius: '10px', transition: 'box-shadow 0.3s'}"
                    >
                      <div
                        class="inline-flex border"
                        :style="{
                          backgroundColor: '#1E88E5',
                          borderRadius: '10px',
                          height: '2rem',
                          width: '6rem',

                        }"
                      />
                      <span class="ml-1">:</span>
                      <span class="ml-4">{{ t('tools.map.colorScheme.#1E88E5') }}</span>
                    </v-col>
                    <v-col
                      cols="12"
                      md="2"
                      class="d-flex align-center"
                      :style="{boxShadow: currentColor === '#1976D2' ? '0 0 10px 2px gold' : 'none',borderRadius: '10px', transition: 'box-shadow 0.3s'}"
                    >
                      <div
                        class="inline-flex border"
                        :style="{
                          backgroundColor: '#1976D2',
                          borderRadius: '10px',
                          height: '2rem',
                          width: '6rem',

                        }"
                      />
                      <span class="ml-1">:</span>
                      <span class="ml-4">{{ t('tools.map.colorScheme.#1976D2') }}</span>
                    </v-col>
                    <v-col
                      cols="12"
                      md="2"
                      class="d-flex align-center"
                      :style="{boxShadow: currentColor === '#1565C0' ? '0 0 10px 2px gold' : 'none',borderRadius: '10px', transition: 'box-shadow 0.3s'}"
                    >
                      <div
                        class="inline-flex border"
                        :style="{
                          backgroundColor: '#1565C0',
                          borderRadius: '10px',
                          height: '2rem',
                          width: '6rem',

                        }"
                      />
                      <span class="ml-1">:</span>
                      <span class="ml-4">{{ t('tools.map.colorScheme.#1565C0') }}</span>
                    </v-col>
                    <v-col
                      cols="12"
                      md="2"
                      class="d-flex align-center"
                      :style="{boxShadow: currentColor === '#0D47A1' ? '0 0 10px 2px gold' : 'none',borderRadius: '10px', transition: 'box-shadow 0.3s'}"
                    >
                      <div
                        class="inline-flex border"
                        :style="{
                          backgroundColor: '#0D47A1',
                          borderRadius: '10px',
                          height: '2rem',
                          width: '6rem',

                        }"
                      />
                      <span class="ml-1">:</span>
                      <span class="ml-4">{{ t('tools.map.colorScheme.#0D47A1') }}</span>
                    </v-col>
                    <v-col
                      cols="12"
                      md="2"
                      class="d-flex align-center"
                      :style="{boxShadow: currentColor === '#F5FFFA' ? '0 0 10px 2px gold' : 'none',borderRadius: '10px', transition: 'box-shadow 0.3s'}"
                    >
                      <div
                        class="inline-flex border"
                        :style="{
                          backgroundColor: '#F5FFFA',
                          borderRadius: '10px',
                          height: '2rem',
                          width: '6rem',

                        }"
                      />
                      <span class="ml-1">:</span>
                      <span class="ml-4">{{ t('tools.map.colorScheme.#F5FFFA') }}</span>
                    </v-col>
                    <v-col
                      cols="12"
                      md="2"
                      class="d-flex align-center"
                      :style="{boxShadow: currentColor === '#00897B' ? '0 0 10px 2px gold' : 'none',borderRadius: '10px', transition: 'box-shadow 0.3s'}"
                    >
                      <div
                        class="inline-flex border"
                        :style="{
                          backgroundColor: '#00897B',
                          borderRadius: '10px',
                          height: '2rem',
                          width: '6rem',

                        }"
                      />
                      <span class="ml-1">:</span>
                      <span class="ml-4">{{ t('tools.map.colorScheme.#00897B') }}</span>
                    </v-col>
                  </v-row>
                </div>
              </v-expansion-panel-text>
            </v-expansion-panel>
            <v-expansion-panel>
              <v-expansion-panel-title>
                {{ t('tools.map.panels.p2') }}
              </v-expansion-panel-title>
              <v-expansion-panel-text>
                <v-row class="my-4">
                  <div
                    v-for="item in Data.count"
                    class="d-flex align-center mr-4"
                  >
                    <span class="mr-2">
                      {{ t(`tools.map.prefabs.${item.code}`) }}:
                    </span>
                    <v-chip
                      color="info"
                      label
                    >
                      {{ item.count }}
                    </v-chip>
                  </div>
                </v-row>
              </v-expansion-panel-text>
            </v-expansion-panel>
            <v-expansion-panel>
              <v-expansion-panel-title>
                {{ t('tools.map.panels.p3') }}
              </v-expansion-panel-title>
              <v-expansion-panel-text>
                <v-row class="my-4">
                  <div
                    v-for="player in Data.players"
                    class="d-flex align-center mr-4"
                  >
                    <v-img
                      :src="getPlayerImageSrc(player.prefab)"
                      style="height: 32px; width: 32px"
                    />
                    <v-chip
                      color="info"
                      label
                    >
                      {{ player.nickname }}
                    </v-chip>
                  </div>
                </v-row>
              </v-expansion-panel-text>
            </v-expansion-panel>
          </v-expansion-panels>
        </v-card-text>
      </v-card>
      <v-card v-else>
        <result
          :height="1000"
          type="info"
          :title="t('tools.map.fetch')"
        />
      </v-card>
    </template>
    <template v-else>
      <result
        :title="t('global.noRoomSelected.title')"
        :sub-title="t('global.noRoomSelected.subTitle')"
        type="error"
        :height="1000"
      >
        <v-btn
          to="/rooms"
          class="mt-4"
        >
          {{ t('global.noRoomSelected.button') }}
        </v-btn>
      </result>
    </template>
  </template>
  <template v-else>
    <result
      v-if="userStore.userInfo.role==='admin'"
      :title="t('global.noGame.title')"
      :sub-title="t('global.noGame.subTitle')"
      :height="1000"
      type="error"
    >
      <v-btn
        to="/install"
        class="mt-4"
      >
        {{ t('global.noGame.button') }}
      </v-btn>
    </result>
    <result
      v-else
      :title="t('global.noGameNoAdmin.title')"
      :sub-title="t('global.noGameNoAdmin.subTitle')"
      :height="1000"
      type="error"
    />
  </template>
</template>

<script setup>
import roomApi from "@/api/room.js"
import toolsApi from "@/api/tools.js"
import useGlobalStore from "@store/global.js"
import useUserStore from "@store/user.js"
import { useDisplay } from "vuetify/framework"
import { useI18n } from "vue-i18n"
import Result from "@/components/Result.vue"


const globalStore = useGlobalStore()
const userStore = useUserStore()
const { mobile } = useDisplay()
const { t } = useI18n()
const loading = ref(false)
const dataGot = ref(false)

const Data = ref({
  image: {
    height: 0,
    width: 0,
    image: '',
  },
  prefabs: [],
  count: [],
  players: [],
})

const worlds = ref([])
const selectedWorldID = ref()

const getWorlds = async () => {
  const reqForm = {
    roomID: globalStore.room.id,
  }

  const response = await roomApi.worlds.get(reqForm)

  worlds.value = response.data
  selectedWorldID.value = worlds.value[0]?.id || 0
}

const canvas = ref()

const getSummary = async () => {
  dataGot.value = false

  const reqForm = {
    roomID: globalStore.room.id,
    worldID: selectedWorldID.value,
  }

  loading.value = true

  const response = await toolsApi.map.get(reqForm)

  Data.value = response.data
  if (Data.value.players === null) {
    Data.value.players = []
  }
  if (Data.value.prefabs === null) {
    Data.value.prefabs = []
  }
  dataGot.value = true
  await generateImage()
  loading.value = false
}

const getPlayerImageSrc = name => {
  if (name) {
    return new URL(`./images/${name}.png`, import.meta.url).href
  } else {
    return new URL(`./images/undefined.png`, import.meta.url).href
  }
}

const ctx = ref()

const generateImage = async () => {
  const mainImage = new Image()

  mainImage.src = 'data:image/png;base64,' + Data.value.image.image

  const stickerImages = []

  for (let item of Data.value.prefabs) {
    const image = new Image()

    image.src = new URL(`./images/${item.name}.png`, import.meta.url).href
    stickerImages.push(image)
  }

  const playerImages = {
    'undefined': (() => {
      const img = new Image()

      img.src = new URL(`./images/undefined.png`, import.meta.url).href
      
      return img
    })(),
    waxwell: (() => {
      const img = new Image()

      img.src = new URL(`./images/waxwell.png`, import.meta.url).href
      
      return img
    })(),
    walter: (() => {
      const img = new Image()

      img.src = new URL(`./images/walter.png`, import.meta.url).href
      
      return img
    })(),
    wanda: (() => {
      const img = new Image()

      img.src = new URL(`./images/wanda.png`, import.meta.url).href
      
      return img
    })(),
    warly: (() => {
      const img = new Image()

      img.src = new URL(`./images/warly.png`, import.meta.url).href
      
      return img
    })(),
    wathgrithr: (() => {
      const img = new Image()

      img.src = new URL(`./images/wathgrithr.png`, import.meta.url).href
      
      return img
    })(),
    webber: (() => {
      const img = new Image()

      img.src = new URL(`./images/webber.png`, import.meta.url).href
      
      return img
    })(),
    wendy: (() => {
      const img = new Image()

      img.src = new URL(`./images/wendy.png`, import.meta.url).href
      
      return img
    })(),
    wes: (() => {
      const img = new Image()

      img.src = new URL(`./images/wes.png`, import.meta.url).href
      
      return img
    })(),
    wickerbottom: (() => {
      const img = new Image()

      img.src = new URL(`./images/wickerbottom.png`, import.meta.url).href
      
      return img
    })(),
    willow: (() => {
      const img = new Image()

      img.src = new URL(`./images/willow.png`, import.meta.url).href
      
      return img
    })(),
    wilson: (() => {
      const img = new Image()

      img.src = new URL(`./images/wilson.png`, import.meta.url).href
      
      return img
    })(),
    winona: (() => {
      const img = new Image()

      img.src = new URL(`./images/winona.png`, import.meta.url).href
      
      return img
    })(),
    wolfgang: (() => {
      const img = new Image()

      img.src = new URL(`./images/wolfgang.png`, import.meta.url).href
      
      return img
    })(),
    wonkey: (() => {
      const img = new Image()

      img.src = new URL(`./images/wonkey.png`, import.meta.url).href
      
      return img
    })(),
    woodie: (() => {
      const img = new Image()

      img.src = new URL(`./images/woodie.png`, import.meta.url).href
      
      return img
    })(),
    wormwood: (() => {
      const img = new Image()

      img.src = new URL(`./images/wormwood.png`, import.meta.url).href
      
      return img
    })(),
    wortox: (() => {
      const img = new Image()

      img.src = new URL(`./images/wortox.png`, import.meta.url).href
      
      return img
    })(),
    wurt: (() => {
      const img = new Image()

      img.src = new URL(`./images/wurt.png`, import.meta.url).href
      
      return img
    })(),
    wx78: (() => {
      const img = new Image()

      img.src = new URL(`./images/wx78.png`, import.meta.url).href
      
      return img
    })(),
  }

  // 等待所有图片加载完成
  await Promise.all([
    new Promise(resolve => { mainImage.onload = resolve }),
    Promise.all(stickerImages.map(image =>
      new Promise(resolve => {
        image.onload = resolve
      }),
    )),
    Promise.all(Object.values(playerImages).map(image =>
      new Promise(resolve => {
        image.onload = resolve
      }),
    )),
  ])

  ctx.value = canvas.value.getContext('2d')

  ctx.value = canvas.value.getContext('2d')

  // 修改为使用放大后的尺寸
  canvas.value.width = Data.value.image.width * 2
  canvas.value.height = Data.value.image.height * 2

  // 绘制主图（使用放大后的尺寸）
  await ctx.value.drawImage(
    mainImage,
    0, 0,
    Data.value.image.width * 2,
    Data.value.image.height * 2,
  )

  // 修改贴图位置和尺寸（乘以2倍）
  for (let index = 0; index < stickerImages.length; index++) {
    await ctx.value.drawImage(
      stickerImages[index],
      Data.value.prefabs[index].x * 2 - 16,
      Data.value.prefabs[index].y * 2 - 16,
      32,
      32,
    )
  }

  for (let player of Data.value.players) {
    let image = playerImages.hasOwnProperty(player.prefab)
      ? player.prefab
      : 'undefined'

    await ctx.value.drawImage(
      playerImages[image],
      player.coordinate.x * 2 - 16,
      player.coordinate.y * 2 - 16,
      32,
      32,
    )
    await drawTextWithBg(
      ctx.value,
      player.nickname,
      player.coordinate.x * 2 + 16,
      player.coordinate.y * 2,
    )
  }
}

const drawRoundedRect  = (ctx, x, y, width, height, radius, color) => {
  ctx.fillStyle = color
  ctx.beginPath()
  ctx.moveTo(x + radius, y)
  ctx.lineTo(x + width - radius, y)
  ctx.quadraticCurveTo(x + width, y, x + width, y + radius)
  ctx.lineTo(x + width, y + height - radius)
  ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height)
  ctx.lineTo(x + radius, y + height)
  ctx.quadraticCurveTo(x, y + height, x, y + height - radius)
  ctx.lineTo(x, y + radius)
  ctx.quadraticCurveTo(x, y, x + radius, y)
  ctx.closePath()
  ctx.fill()
}

const drawTextWithBg = async (ctx, text, x, y, options = {}) => {
  // 默认选项
  const defaults = {
    font: '8px Arial',
    textColor: '#080808',
    bgColor: '#ffffff',
    padding: 5,
    borderRadius: 5,
    textBaseline: 'top',
  }

  // 合并选项
  const opts = { ...defaults, ...options }

  // 设置字体
  ctx.font = opts.font
  ctx.textBaseline = opts.textBaseline

  // 测量文字
  const metrics = ctx.measureText(text)
  const textWidth = metrics.width
  const textHeight = parseInt(opts.font, 10) // 简单估算高度

  // 计算背景尺寸
  const bgWidth = textWidth + opts.padding * 2
  const bgHeight = textHeight + opts.padding * 2

  // 绘制圆角背景
  if (opts.borderRadius > 0) {
    await drawRoundedRect(ctx, x, y, bgWidth, bgHeight, opts.borderRadius, opts.bgColor)
  } else {
    ctx.fillStyle = opts.bgColor
    ctx.fillRect(x, y, bgWidth, bgHeight)
  }

  // 绘制文字
  ctx.fillStyle = opts.textColor
  ctx.fillText(text, x + opts.padding, y + opts.padding)
}

const currentColor = ref()

const getPixelColor = event => {
  const rect = canvas.value.getBoundingClientRect()

  // 计算缩放比例
  const scaleX = canvas.value.width / rect.width
  const scaleY = canvas.value.height / rect.height

  // 考虑缩放比例计算坐标
  const x = (event.clientX - rect.left) * scaleX
  const y = (event.clientY - rect.top) * scaleY

  const pixel = ctx.value.getImageData(Math.floor(x), Math.floor(y), 1, 1).data

  currentColor.value = rgbToHex(pixel[0], pixel[1], pixel[2])
}

const rgbToHex = (r, g, b) => {
  return '#' + [r, g, b]
    .map(x => x.toString(16).padStart(2, '0'))
    .join('')
    .toUpperCase()
}

onMounted(async () => {
  await getWorlds()
  await getSummary()
})
</script>

