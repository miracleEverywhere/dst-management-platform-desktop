<template>
  <!-- 游戏是否安装 -->
  <template v-if="globalStore.gameVersion.local!==0">
    <!-- 房间是否选择 -->
    <template v-if="globalStore.room.id!==0">
      <!-- 数据是否获取 -->
      <template v-if="dataGot">
        <v-row>
          <v-col
            cols="12"
            md="6"
          >
            <v-card
              ref="card1Ref"
              min-height="350"
            >
              <v-card-title>
                {{ t('dashboard.card1.title') }}
              </v-card-title>
              <v-card-text class="mt-8 mb-4">
                <v-row>
                  <v-col
                    cols="12"
                    md="6"
                  >
                    <v-chip
                      label
                      color="info"
                      class="mr-2"
                    >
                      {{ t('dashboard.card1.item.roomName') }}
                    </v-chip>
                    <v-btn
                      v-copy="baseInfo.room.gameName"
                      variant="text"
                      append-icon="ri-file-copy-line"
                      class="text-none"
                    >
                      {{ truncateString(baseInfo.room.gameName, mobile?(card1Width-200)/15:(card1Width-400)/30) }}
                    </v-btn>
                  </v-col>
                  <v-col
                    cols="12"
                    md="6"
                  >
                    <v-chip
                      label
                      color="info"
                      class="mr-2"
                    >
                      {{ t('dashboard.card1.item.connectCode') }}
                    </v-chip>
                    <v-btn
                      v-copy="connectionCode"
                      v-tooltip="connectionCode"
                      :loading="connectionCodeLoading"
                      variant="text"
                      icon="ri-file-copy-line"
                    />
                    <v-btn
                      v-tooltip="t('dashboard.card1.item.custom.tip')"
                      variant="text"
                      color="default"
                      @click="customConnectionCodeDialog=true"
                    >
                      {{ t('dashboard.card1.item.custom.button') }}
                    </v-btn>
                    <v-dialog
                      v-model="customConnectionCodeDialog"
                      :width="mobile?'90%':'60%'"
                    >
                      <v-card>
                        <v-card-title>
                          {{ t('dashboard.card1.item.custom.title') }}
                        </v-card-title>
                        <v-form
                          ref="customConnectionCodeFormRef"
                          @submit.prevent="handleUpdateConnectionCode"
                        >
                          <v-card-text>
                            <v-alert
                              :text="t('dashboard.card1.item.custom.tip')"
                              type="info"
                              variant="tonal"
                              class="mb-8"
                            />
                            <v-text-field
                              v-model="customConnectionCodeForm.ip"
                              v-tooltip="t('dashboard.card1.item.custom.ip.tip')"
                              :rules="customConnectionCodeFormRules.ip"
                              :label="t('dashboard.card1.item.custom.ip.title')"
                              class="mb-8"
                            />
                            <v-number-input
                              v-model="customConnectionCodeForm.port"
                              v-tooltip="t('dashboard.card1.item.custom.port.tip')"
                              :rules="customConnectionCodeFormRules.port"
                              :label="t('dashboard.card1.item.custom.port.title')"
                              :min="1"
                              :max="65535"
                            />
                          </v-card-text>
                          <v-card-actions class="mr-4 mb-4">
                            <v-spacer />
                            <v-btn
                              variant="elevated"
                              color="defalut"
                              @click="customConnectionCodeDialog=false"
                            >
                              {{ t('global.confirm.cancel') }}
                            </v-btn>
                            <v-btn
                              v-tooltip="t('dashboard.card1.item.custom.clear.tip')"
                              variant="elevated"
                              color="warning"
                              @click="handleClearConnectionCode"
                            >
                              {{ t('dashboard.card1.item.custom.clear.title') }}
                            </v-btn>
                            <v-btn
                              variant="elevated"
                              color="primary"
                              type="submit"
                            >
                              {{ t('global.confirm.confirm') }}
                            </v-btn>
                          </v-card-actions>
                        </v-form>
                      </v-card>
                    </v-dialog>
                  </v-col>
                </v-row>
                <v-row>
                  <v-col
                    cols="12"
                    md="6"
                  >
                    <v-chip
                      label
                      color="info"
                      class="mr-4"
                    >
                      {{ t('dashboard.card1.item.cycles') }}
                    </v-chip>
                    <v-chip v-if="baseInfo.session.cycles!==-1">
                      {{ baseInfo.session.cycles }}
                    </v-chip>
                    <v-chip
                      v-else
                      color="error"
                    >
                      {{ t('dashboard.card1.error') }}
                    </v-chip>
                  </v-col>
                  <v-col
                    cols="12"
                    md="6"
                  >
                    <v-chip
                      label
                      color="info"
                      class="mr-4"
                    >
                      {{ t('dashboard.card1.item.gameMode') }}
                    </v-chip>
                    <v-chip>{{ t(`game.base.step1.gameMode.modes.${baseInfo.room.gameMode}`) }}</v-chip>
                  </v-col>
                </v-row>
                <v-row>
                  <v-col
                    cols="12"
                    md="6"
                  >
                    <v-chip
                      label
                      color="info"
                      class="mr-4"
                    >
                      {{ t('dashboard.card1.item.gameSeason') }}
                    </v-chip>
                    <v-chip v-if="baseInfo.session.season!=='error'">
                      {{ t(`dashboard.card1.season.${baseInfo.session.season}`) }}({{ baseInfo.session.elapsedDays }}/{{ baseInfo.session.seasonLength[baseInfo.session.season] }})
                    </v-chip>
                    <v-chip
                      v-else
                      color="error"
                    >
                      {{ t('dashboard.card1.error') }}
                    </v-chip>
                  </v-col>
                  <v-col
                    cols="12"
                    md="6"
                  >
                    <v-chip
                      label
                      color="info"
                      class="mr-4"
                    >
                      {{ t('dashboard.card1.item.gamePhase') }}
                    </v-chip>
                    <v-chip v-if="baseInfo.session.phase!=='error'">
                      {{ t(`dashboard.card1.phase.${baseInfo.session.phase}`) }}
                    </v-chip>
                    <v-chip
                      v-else
                      color="error"
                    >
                      {{ t('dashboard.card1.error') }}
                    </v-chip>
                  </v-col>
                </v-row>
                <v-row>
                  <v-col
                    cols="12"
                    md="6"
                  >
                    <v-chip
                      label
                      color="info"
                      class="mr-4"
                    >
                      {{ t('dashboard.card1.item.mods') }}
                    </v-chip>
                    <v-chip v-if="(baseInfo.room.modInOne?parseModLua(baseInfo.room.modData).length:parseModLua(baseInfo.worlds[0].modData).length)===0">
                      {{ baseInfo.room.modInOne?parseModLua(baseInfo.room.modData).length:parseModLua(baseInfo.worlds[0].modData).length }}
                    </v-chip>
                    <v-chip
                      v-else
                      @click="modDialog=true;getEnabledMods()"
                    >
                      {{ baseInfo.room.modInOne?parseModLua(baseInfo.room.modData).length:parseModLua(baseInfo.worlds[0].modData).length }}
                    </v-chip>
                    <v-dialog
                      v-model="modDialog"
                      :width="mobile?'90%':'60%'"
                    >
                      <v-card>
                        <v-card-title>
                          {{ t('dashboard.card1.item.mods') }}
                        </v-card-title>
                        <v-card-text v-if="!modLoading">
                          <v-sheet
                            border
                            rounded
                            class="mt-4"
                          >
                            <v-data-table
                              :headers="headers"
                              :items="modList"
                            >
                              <template #loading>
                                <v-skeleton-loader type="table-row@10" />
                              </template>

                              <template #item.preview_url="{ value }">
                                <v-img
                                  :src="value"
                                  :width="100"
                                  cover
                                  rounded
                                  aspect-ratio="1"
                                  class="ma-2"
                                >
                                  <template #placeholder>
                                    <div class="d-flex align-center justify-center fill-height">
                                      <v-progress-circular
                                        color="grey-lighten-4"
                                        indeterminate
                                      />
                                    </div>
                                  </template>
                                </v-img>
                              </template>
                              <template #item.name="{ value }">
                                <v-chip
                                  label
                                  color="info"
                                >
                                  {{ value }}
                                </v-chip>
                              </template>
                              <template #item.serverSize="{ value }">
                                <v-chip
                                  label
                                  color="primary"
                                >
                                  {{ formatBytes(parseInt(value)) }}
                                </v-chip>
                              </template>
                              <template #item.id="{ value }">
                                <v-chip label>
                                  {{ value }}
                                </v-chip>
                              </template>
                              <template #item.update="{ item }">
                                <v-chip
                                  v-if="item.file_url!==''"
                                  label
                                >
                                  {{ t('game.mod.add.notUGC') }}
                                </v-chip>
                                <v-chip
                                  v-if="item.file_url===''&&item.serverSize===item.localSize"
                                  label
                                  color="success"
                                >
                                  {{ t('game.mod.add.needNoUpdate') }}
                                </v-chip>
                                <v-chip
                                  v-if="item.file_url===''&&item.serverSize!==item.localSize"
                                  label
                                  color="error"
                                >
                                  {{ t('game.mod.add.needUpdate') }}
                                </v-chip>
                              </template>
                              <template #item.actions="{ item }">
                                <v-btn
                                  color="info"
                                  append-icon="ri-arrow-drop-down-line"
                                  variant="text"
                                >
                                  {{ t('game.mod.add.actions') }}
                                  <v-menu activator="parent">
                                    <v-list>
                                      <v-list-item
                                        :disabled="modEnableLoading"
                                        class="text-success"
                                        @click="handleModAction('enable', item)"
                                      >
                                        <template #prepend>
                                          <v-icon
                                            icon="ri-file-check-line"
                                            size="22"
                                          />
                                        </template>
                                        <v-list-item-title>
                                          {{ t('game.mod.add.enable') }}
                                        </v-list-item-title>
                                      </v-list-item>
                                      <v-list-item
                                        :disabled="modUpdateLoading"
                                        class="text-info"
                                        @click="handleModAction('update', item)"
                                      >
                                        <template #prepend>
                                          <v-icon
                                            icon="ri-arrow-up-circle-line"
                                            size="22"
                                          />
                                        </template>
                                        <v-list-item-title>
                                          {{ t('game.mod.add.updateMod') }}
                                        </v-list-item-title>
                                      </v-list-item>
                                    </v-list>
                                  </v-menu>
                                </v-btn>
                              </template>
                            </v-data-table>
                          </v-sheet>
                        </v-card-text>
                        <v-card-text v-else>
                          <result
                            type="info"
                            :title="t('game.base.loading')"
                            :height="calculateContainerSize()/2"
                          />
                        </v-card-text>
                      </v-card>
                    </v-dialog>
                  </v-col>
                  <v-col
                    cols="12"
                    md="6"
                  >
                    <v-chip
                      label
                      color="info"
                      class="mr-4"
                    >
                      {{ t('dashboard.card1.item.players') }}
                    </v-chip>
                    <v-chip>
                      <v-tooltip
                        v-if="baseInfo.players.map(user => user.nickname).join(', ')!==''"
                        activator="parent"
                      >
                        {{ baseInfo.players.map(user => user.nickname).join(', ') }}
                      </v-tooltip>
                      ({{ baseInfo.players?.length || 0 }}/{{ baseInfo.room.maxPlayer }})
                    </v-chip>
                  </v-col>
                </v-row>
              </v-card-text>
            </v-card>
          </v-col>
          <v-col
            cols="12"
            md="6"
          >
            <v-card min-height="350">
              <v-card-title>
                {{ t('dashboard.card2.title') }}
              </v-card-title>
              <v-card-text>
                <v-row
                  v-if="!mobile"
                  class="mt-4"
                >
                  <v-col
                    cols="12"
                    md="5"
                  >
                    <div>
                      <div class="fcc">
                        <v-icon icon="ri-cpu-line" />
                        <span class="mr-2 ml-1">CPU</span>
                        <v-progress-linear
                          :model-value="sysInfo.cpu"
                          rounded
                          height="8"
                          :indeterminate="sysInfo.cpu===0"
                          rounded-bar
                          color="grey-lighten-2"
                          class="w-33 ml-2"
                        />
                        <span class="ml-2">{{ sysInfo.cpu.toFixed(1) }}%</span>
                      </div>
                      <v-sparkline
                        :width="(card1Width/12)*5"
                        :height="350-44-22.5-72"
                        :gradient="gradients"
                        gradient-direction="top"
                        :line-width="3"
                        :model-value="cpuList"
                        padding="8"
                        smooth
                        stroke-linecap="round"
                        type="trend"
                        auto-draw
                        class="mt-4"
                      />
                    </div>
                  </v-col>
                  <v-spacer />
                  <v-col
                    cols="12"
                    md="5"
                  >
                    <div>
                      <div class="d-flex align-center justify-center">
                        <v-icon icon="ri-ram-2-line" />
                        <span class="mr-2 ml-1">{{ t('dashboard.card2.memory') }}</span>
                        <v-progress-linear
                          :model-value="sysInfo.memory"
                          rounded
                          height="8"
                          :indeterminate="sysInfo.memory===0"
                          rounded-bar
                          color="grey-lighten-2"
                          class="w-33 ml-2"
                        />
                        <span class="ml-2">{{ sysInfo.memory.toFixed(1) }}%</span>
                      </div>
                      <v-sparkline
                        :width="(card1Width/12)*5"
                        :height="350-44-22.5-72"
                        :gradient="gradients"
                        gradient-direction="top"
                        :line-width="3"
                        :model-value="memoryList"
                        padding="8"
                        smooth
                        stroke-linecap="round"
                        type="trend"
                        auto-draw
                        class="mt-4"
                      />
                    </div>
                  </v-col>
                </v-row>
                <v-row
                  v-else
                  class="mt-4"
                >
                  <v-col
                    cols="6"
                    class="fcc"
                    style="height: 240px"
                  >
                    <v-progress-circular
                      :model-value="sysInfo.cpu.toFixed(1)"
                      :size="140"
                      :width="10"
                      :color="getProgressColor(sysInfo.cpu)"
                      rounded
                    >
                      <div class="d-flex flex-column align-center justify-center">
                        <div>
                          <span>CPU</span>
                        </div>
                        <div>
                          {{ sysInfo.cpu.toFixed(1) }}%
                        </div>
                      </div>
                    </v-progress-circular>
                  </v-col>
                  <v-col
                    cols="6"
                    class="fcc"
                    style="height: 240px"
                  >
                    <v-progress-circular
                      :model-value="sysInfo.memory.toFixed(1)"
                      :size="140"
                      :width="10"
                      :color="getProgressColor(sysInfo.memory)"
                      rounded
                    >
                      <div class="d-flex flex-column align-center justify-center">
                        <div>
                          <span>{{ t('dashboard.card2.memory') }}</span>
                        </div>
                        <div>
                          {{ sysInfo.memory.toFixed(1) }}%
                        </div>
                      </div>
                    </v-progress-circular>
                  </v-col>
                </v-row>
              </v-card-text>
            </v-card>
          </v-col>
        </v-row>
        <v-row>
          <v-col
            cols="12"
            md="6"
          >
            <v-card min-height="295">
              <v-card-title>
                {{ t('dashboard.card3.title') }}
              </v-card-title>
              <v-card-text class="mx-4">
                <v-row class="mt-4">
                  <v-btn
                    v-tooltip="t('dashboard.card3.startup.tip')"
                    class="mr-4 mb-4"
                    color="success"
                    @click="confirmBoxVisible.startup.visible=true"
                  >
                    {{ t('dashboard.card3.startup.title') }}
                  </v-btn>
                  <confirm-box
                    v-model="confirmBoxVisible.startup.visible"
                    type="info"
                    :title="t('dashboard.card3.startup.title')"
                    :content="t('dashboard.card3.startup.confirm')"
                    :confirm-text="t('global.confirm.confirm')"
                    :cancel-text="t('global.confirm.cancel')"
                    :confirm-loading="confirmBoxVisible.startup.loading"
                    @confirm="handleGameExec({type:'startup',extra:'all'})"
                    @cancel="confirmBoxVisible.startup.visible=false"
                  />

                  <v-btn
                    v-tooltip="t('dashboard.card3.shutdown.tip')"
                    class="mr-4 mb-4"
                    color="error"
                    @click="confirmBoxVisible.shutdown.visible=true"
                  >
                    {{ t('dashboard.card3.shutdown.title') }}
                  </v-btn>
                  <confirm-box
                    v-model="confirmBoxVisible.shutdown.visible"
                    type="info"
                    :title="t('dashboard.card3.shutdown.title')"
                    :content="t('dashboard.card3.shutdown.confirm')"
                    :confirm-text="t('global.confirm.confirm')"
                    :cancel-text="t('global.confirm.cancel')"
                    :confirm-loading="confirmBoxVisible.shutdown.loading"
                    @confirm="handleGameExec({type:'shutdown',extra:'all'})"
                    @cancel="confirmBoxVisible.shutdown.visible=false"
                  />

                  <v-btn
                    v-tooltip="t('dashboard.card3.restart.tip')"
                    class="mr-4 mb-4"
                    color="warning"
                    @click="confirmBoxVisible.restart.visible=true"
                  >
                    {{ t('dashboard.card3.restart.title') }}
                  </v-btn>
                  <confirm-box
                    v-model="confirmBoxVisible.restart.visible"
                    type="info"
                    :title="t('dashboard.card3.restart.title')"
                    :content="t('dashboard.card3.restart.confirm')"
                    :confirm-text="t('global.confirm.confirm')"
                    :cancel-text="t('global.confirm.cancel')"
                    :confirm-loading="confirmBoxVisible.restart.loading"
                    @confirm="handleGameExec({type:'restart'})"
                    @cancel="confirmBoxVisible.restart.visible=false"
                  />

                  <v-btn
                    v-tooltip="t('dashboard.card3.update.tip')"
                    class="mr-4 mb-4"
                    color="info"
                    :disabled="userStore.userInfo.role!=='admin'"
                    :loading="sysInfo.updating"
                    @click="updateTypeDialog=true"
                  >
                    {{ t('dashboard.card3.update.title') }}
                  </v-btn>
                  <v-dialog
                    v-model="updateTypeDialog"
                    :width="mobile?'85%':'40%'"
                  >
                    <v-card>
                      <v-card-title>
                        {{ t('dashboard.card3.update.title') }}
                      </v-card-title>
                      <v-card-text>
                        <v-radio-group
                          v-model="updateType"
                          inline
                          color="primary"
                          class="mt-2"
                        >
                          <template #prepend>
                            <v-chip>
                              {{ t('dashboard.card3.update.type') }}
                            </v-chip>
                          </template>
                          <v-radio
                            v-tooltip="t('dashboard.card3.update.frontend.tip')"
                            :label="t('dashboard.card3.update.frontend.title')"
                            value="frontend"
                          />
                          <v-radio
                            v-tooltip="t('dashboard.card3.update.backend.tip')"
                            :label="t('dashboard.card3.update.backend.title')"
                            value="backend"
                          />
                        </v-radio-group>
                      </v-card-text>
                      <v-card-actions>
                        <v-spacer />
                        <v-btn
                          color="default"
                          variant="elevated"
                          @click="updateTypeDialog=false"
                        >
                          {{ t('global.confirm.cancel') }}
                        </v-btn>
                        <v-btn
                          v-if="updateType==='frontend'"
                          variant="elevated"
                          to="/install"
                        >
                          {{ t('global.confirm.confirm') }}
                        </v-btn>
                        <v-btn
                          v-if="updateType==='backend'"
                          variant="elevated"
                          @click="handleGameExec({type:'update'});updateTypeDialog=false;sysInfo.updating=true"
                        >
                          {{ t('global.confirm.confirm') }}
                        </v-btn>
                      </v-card-actions>
                    </v-card>
                  </v-dialog>
                </v-row>
                <v-row class="mb-4">
                  <v-btn
                    v-tooltip="t('dashboard.card3.reset.tip')"
                    class="mr-4 mb-4"
                    :color="colors.purple.base"
                    @click="resetTypeDialog=true"
                  >
                    {{ t('dashboard.card3.reset.title') }}
                  </v-btn>
                  <v-dialog
                    v-model="resetTypeDialog"
                    :width="mobile?'85%':'40%'"
                  >
                    <v-card>
                      <v-card-title>
                        {{ t('dashboard.card3.reset.title') }}
                      </v-card-title>
                      <v-card-text>
                        <v-radio-group
                          v-model="resetType"
                          inline
                          color="primary"
                          class="mt-2"
                        >
                          <template #prepend>
                            <v-chip>
                              {{ t('dashboard.card3.reset.resetType') }}
                            </v-chip>
                          </template>
                          <v-radio
                            v-tooltip="t('dashboard.card3.reset.noForced.tip')"
                            :label="t('dashboard.card3.reset.noForced.title')"
                            value="reset-no-force"
                          />
                          <v-radio
                            v-tooltip="t('dashboard.card3.reset.forced.tip')"
                            :label="t('dashboard.card3.reset.forced.title')"
                            value="force"
                          />
                        </v-radio-group>
                      </v-card-text>
                      <v-card-actions>
                        <v-spacer />
                        <v-btn
                          color="default"
                          variant="elevated"
                          @click="resetTypeDialog=false"
                        >
                          {{ t('global.confirm.cancel') }}
                        </v-btn>
                        <v-btn
                          variant="elevated"
                          @click="handleGameExec({type:'reset',extra:resetType});resetTypeDialog=false"
                        >
                          {{ t('global.confirm.confirm') }}
                        </v-btn>
                      </v-card-actions>
                    </v-card>
                  </v-dialog>

                  <v-btn
                    v-tooltip="t('dashboard.card3.clean.tip')"
                    class="mr-4 mb-4"
                    :color="colors.brown.base"
                  >
                    {{ t('dashboard.card3.clean.title') }}
                    <v-menu activator="parent">
                      <v-list>
                        <v-list-item
                          v-for="(item, index) in consoleForm.worlds"
                          :key="index"
                          :value="item.id"
                          @click="cleanWorldID=item.id;confirmBoxVisible.clean.visible=true"
                        >
                          <v-list-item-title>{{ item.worldName }}</v-list-item-title>
                        </v-list-item>
                      </v-list>
                    </v-menu>
                  </v-btn>
                  <confirm-box
                    v-model="confirmBoxVisible.clean.visible"
                    type="info"
                    :title="t('dashboard.card3.clean.title')"
                    :content="t('dashboard.card3.clean.confirm')"
                    :confirm-text="t('global.confirm.confirm')"
                    :cancel-text="t('global.confirm.cancel')"
                    :confirm-loading="confirmBoxVisible.clean.loading"
                    @confirm="handleGameExec({type:'delete',worldID:cleanWorldID})"
                    @cancel="confirmBoxVisible.clean.visible=false"
                  />

                  <v-btn
                    v-tooltip="t('dashboard.card3.quickCmd.tip')"
                    class="mr-4 mb-4"
                    :color="colors.cyan.darken1"
                    @click="quickCmdDialog=true"
                  >
                    {{ t('dashboard.card3.quickCmd.title') }}
                  </v-btn>
                  <v-dialog
                    v-model="quickCmdDialog"
                    :width="mobile?'90%':'60%'"
                  >
                    <v-card>
                      <v-card-title>
                        <span>{{ t('dashboard.card3.quickCmd.title') }}</span>
                        <v-chip
                          v-if="quickCmdUid!==''"
                          label
                          color="success"
                          class="ml-2"
                        >
                          {{ baseInfo.players.find(item => item.uid === quickCmdUid).nickname }}
                        </v-chip>
                      </v-card-title>
                      <v-card-text>
                        <v-row>
                          <v-col>
                            <v-radio-group
                              v-model="quickCmdType"
                              inline
                              color="primary"
                              class="my-4"
                            >
                              <v-radio
                                :label="t('dashboard.card3.quickCmd.player')"
                                value="player"
                              />
                              <v-radio
                                :label="t('dashboard.card3.quickCmd.world')"
                                value="world"
                              />
                            </v-radio-group>
                          </v-col>
                        </v-row>
                        <v-row>
                          <v-col>
                            <v-btn
                              v-for="player in baseInfo.players"
                              variant="text"
                              class="mr-2"
                              @click="quickCmdUid=player.uid"
                            >
                              {{ player.nickname }}
                            </v-btn>
                          </v-col>
                        </v-row>
                        <v-row>
                          <v-col>
                            <v-select
                              v-model="quickCmdPlayerId"
                              :disabled="quickCmdUid===''||quickCmdType!=='player'"
                              :items="quickCmdPlayerOptions"
                              :label="t('dashboard.card3.quickCmd.playerCmd')"
                              item-title="label"
                              item-value="value"
                              @update:model-value="quickCmdPlayerGenerate"
                            />
                          </v-col>
                          <v-spacer v-if="!mobile" />
                        </v-row>
                        <v-row>
                          <v-col>
                            <v-select
                              v-model="quickCmdWorldId"
                              :disabled="quickCmdType!=='world'"
                              :items="quickCmdWorldOptions"
                              :label="t('dashboard.card3.quickCmd.worldCmd')"
                              item-title="label"
                              item-value="value"
                              @update:model-value="quickCmdWorldGenerate"
                            />
                          </v-col>
                          <v-spacer v-if="!mobile" />
                        </v-row>
                        <v-row>
                          <v-col>
                            <md-preview
                              :model-value="'```lua ::open'+'\n'+quickCmd"
                              :theme="editorTheme"
                              :language="editorLanguage"
                              preview-theme="github"
                              class="mdp"
                            />
                          </v-col>
                        </v-row>
                      </v-card-text>
                      <v-card-actions>
                        <v-spacer />
                        <v-btn
                          variant="elevated"
                          :text="t('dashboard.card3.quickCmd.insert')"
                          @click="quickCmdInsert"
                        />
                      </v-card-actions>
                    </v-card>
                  </v-dialog>
                  <v-btn
                    v-tooltip="t('dashboard.card3.check.tip')"
                    class="mr-4 mb-4"
                    :color="colors.teal.base"
                  >
                    {{ t('dashboard.card3.check.title') }}
                    <v-dialog
                      activator="parent"
                      :width="mobile?'90%':'60%'"
                      @after-enter="checkLobby"
                    >
                      <template #default="{ isActive }">
                        <v-card min-height="520">
                          <v-card-title>
                            {{ t('dashboard.card3.check.title') }}
                          </v-card-title>
                          <v-card-text>
                            <v-select
                              v-model="selectRegions"
                              multiple
                              chips
                              density="compact"
                              :label="t('dashboard.card3.check.region')"
                              class="mt-8"
                              item-title="label"
                              item-value="value"
                              :items="regions"
                              :disabled="checkLobbyLoading"
                              @update:menu="checkLobby"
                            />
                            <template v-if="checkLobbyLoading">
                              <result
                                :height="520-44"
                                type="info"
                                :title="t('dashboard.card3.check.result.loading.title')"
                                :sub-title="t('dashboard.card3.check.result.loading.subTitle')"
                              />
                            </template>
                            <template v-else>
                              <result
                                v-if="checkLobbyResult"
                                :height="520-44"
                                type="success"
                                :title="t('dashboard.card3.check.result.success.title')"
                                :sub-title="t('dashboard.card3.check.result.success.subTitle')"
                              />
                              <result
                                v-else
                                :height="520-44"
                                type="error"
                                :title="t('dashboard.card3.check.result.error.title')"
                                :sub-title="t('dashboard.card3.check.result.error.subTitle')"
                              />
                            </template>
                          </v-card-text>
                        </v-card>
                      </template>
                    </v-dialog>
                  </v-btn>
                </v-row>
                <v-row>
                  <v-chip
                    v-tooltip="t('dashboard.card3.rollback.tip')"
                    label
                    class="mr-4"
                  >
                    {{ t('dashboard.card3.rollback.title') }}
                  </v-chip>
                  <v-btn
                    v-for="i in mobile?[1, 2, 3, 4]:[1, 2, 3, 4, 5, 6, 7, 8, 9]"
                    color="default"
                    size="x-small"
                    class="mr-4 mb-4"
                  >
                    {{ i }}
                    <v-dialog
                      activator="parent"
                      max-width="500px"
                      persistent
                    >
                      <template #default="{ isActive }">
                        <v-card>
                          <v-card-title class="d-flex align-center">
                            <span>{{ t('dashboard.card3.rollback.title') }}</span>
                          </v-card-title>
                          <v-card-text>
                            <v-alert
                              :text="t('dashboard.card3.rollback.confirm.c1')+i+t('dashboard.card3.rollback.confirm.c2')"
                              type="info"
                              variant="tonal"
                            />
                          </v-card-text>
                          <v-card-actions class="pa-4">
                            <v-spacer />
                            <v-btn
                              variant="elevated"
                              color="default"
                              @click="isActive.value = false"
                            >
                              {{ t('global.confirm.cancel') }}
                            </v-btn>
                            <v-btn
                              variant="elevated"
                              :loading="confirmBoxVisible.rollback.loading"
                              @click="handleGameExec({type:'console',extra:`c_rollback(${i})`,worldID:baseInfo.worlds[0].id});isActive.value = false"
                            >
                              {{ t('global.confirm.confirm') }}
                            </v-btn>
                          </v-card-actions>
                        </v-card>
                      </template>
                    </v-dialog>
                  </v-btn>
                </v-row>
              </v-card-text>
            </v-card>
          </v-col>
          <v-col
            cols="12"
            md="6"
          >
            <v-card min-height="295">
              <v-card-title>
                {{ t('dashboard.card4.title') }}
              </v-card-title>
              <v-card-text>
                <v-row class="mt-8">
                  <v-col cols="12">
                    <v-text-field
                      v-model="announceMsg"
                      append-inner-icon="ri-send-plane-fill"
                      class="w-100"
                      :label="t('dashboard.card4.announce')"
                      clearable
                      @click:append-inner="handleGameExec({type:'announce',extra:announceMsg})"
                      @keyup.enter="handleGameExec({type:'announce',extra:announceMsg})"
                    />
                  </v-col>
                </v-row>
                <v-row class="my-8">
                  <v-col
                    cols="12"
                    md="3"
                  >
                    <v-select
                      v-model="consoleForm.selectedWorldID"
                      :label="t('dashboard.card4.world')"
                      class="mr-1"
                      item-title="worldName"
                      item-value="id"
                      :items="consoleForm.worlds"
                    />
                  </v-col>
                  <v-col
                    cols="12"
                    md="9"
                  >
                    <v-text-field
                      v-model="consoleForm.cmd"
                      append-inner-icon="ri-send-plane-fill"
                      :label="t('dashboard.card4.cmd')"
                      clearable
                      :disabled="consoleForm.selectedWorldID===undefined"
                      @click:append-inner="handleGameExec({type:'console',extra:consoleForm.cmd,worldID:consoleForm.selectedWorldID})"
                      @keyup.enter="handleGameExec({type:'console',extra:consoleForm.cmd,worldID:consoleForm.selectedWorldID})"
                    />
                  </v-col>
                </v-row>
              </v-card-text>
            </v-card>
          </v-col>
        </v-row>
        <v-row>
          <v-col cols="12">
            <v-card>
              <v-card-title>
                {{ t('dashboard.card5.title') }}
              </v-card-title>
              <v-card-text class="my-8">
                <v-row>
                  <v-col cols="12">
                    <v-sheet
                      rounded
                      border
                    >
                      <v-data-table
                        :items="baseInfo.worlds"
                        :headers="worldHeaders"
                        hide-default-footer
                      >
                        <template #item.worldName="{ value }">
                          <v-chip
                            color="primary"
                            label
                          >
                            {{ value }}
                          </v-chip>
                        </template>
                        <template #item.isMaster="{ value }">
                          <v-chip
                            v-if="value"
                            color="success"
                            label
                          >
                            是
                          </v-chip>
                          <v-chip
                            v-else
                            label
                          >
                            否
                          </v-chip>
                        </template>
                        <template #item.cpu="{ item }">
                          <v-chip
                            label
                            color="info"
                          >
                            {{ item.performanceStatus.cpu.toFixed(2) }}%
                          </v-chip>
                        </template>
                        <template #item.mem="{ item }">
                          <v-chip
                            label
                            color="info"
                          >
                            {{ item.performanceStatus.mem.toFixed(2) }}% ({{ item.performanceStatus.memSize }} MB)
                          </v-chip>
                        </template>
                        <template #item.disk="{ item }">
                          <v-chip
                            label
                            color="info"
                          >
                            {{ formatBytes(item.performanceStatus.disk) }}
                          </v-chip>
                        </template>
                        <template #item.status="{ item }">
                          <v-switch
                            v-model="item.status"
                            :loading="worldStatusLoading"
                            color="success"
                            hide-details
                            @change="item.status?handleGameExec({type:'startup',worldID:item.id}):handleGameExec({type:'shutdown',worldID:item.id})"
                          />
                        </template>
                      </v-data-table>
                    </v-sheet>
                  </v-col>
                </v-row>
              </v-card-text>
            </v-card>
          </v-col>
        </v-row>
      </template>
      <template v-else>
        <result
          type="info"
          :title="t('game.base.loading')"
          :height="calculateContainerSize()"
        />
      </template>
    </template>
    <template v-else>
      <result
        :title="t('global.noRoomSelected.title')"
        :sub-title="t('global.noRoomSelected.subTitle')"
        type="error"
        :height="calculateContainerSize()"
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
      :height="calculateContainerSize()"
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
      :height="calculateContainerSize()"
      type="error"
    />
  </template>
</template>

<script setup>
import { debounce, formatBytes, getEditorLang, parseModLua, truncateString } from "@/utils/tools.js"
import dashboardApi from "@/api/dashboard.js"
import useGlobalStore from "@store/global.js"
import colors from 'vuetify/lib/util/colors'
import { useDisplay } from "vuetify/framework"
import { useI18n } from "vue-i18n"
import { showSnackbar } from "@/utils/snackbar.js"
import useUserStore from "@store/user.js"
import modApi from "@/api/mod.js"
import { MdPreview } from 'md-editor-v3'
import 'md-editor-v3/lib/preview.css'


const windowHeight = ref(window.innerHeight)
const globalStore = useGlobalStore()
const userStore = useUserStore()
const { mobile } = useDisplay()
const { t } = useI18n()

const baseInfo = ref()

const card1Ref = ref()

const card1Width = ref(0)

const getBaseInfo = async () => {
  if (globalStore.room.id === 0) {
    return
  }

  const reqForm = {
    roomID: globalStore.room.id,
  }

  const response = await dashboardApi.info.base.get(reqForm)

  baseInfo.value = response.data
}

const sysInfo = ref()
const gradients = ['#f72047', '#ffd200', '#1feaea']

const cpuList = ref(Array(30).fill(0))
const memoryList = ref(Array(30).fill(0))

const getSysInfo = async () => {
  if (globalStore.room.id === 0) {
    return
  }
  const response = await dashboardApi.info.sys.get()
  if (!response.data) return

  const cpu = Number(response.data.cpu) || 0
  const memory = Number(response.data.memory) || 0

  sysInfo.value = {
    ...response.data,
    cpu,
    memory,
  }

  cpuList.value = [...cpuList.value.slice(1), cpu]
  memoryList.value = [...memoryList.value.slice(1), memory]
}

const confirmBoxVisible = ref({
  startup: {
    visible: false,
    loading: false,
  },
  shutdown: {
    visible: false,
    loading: false,
  },
  restart: {
    visible: false,
    loading: false,
  },
  clean: {
    visible: false,
    loading: false,
  },
  rollback: {
    visible: false,
    loading: false,
  },
})

const worldHeaders = [
  { title: t('dashboard.card5.worldName'), value: 'worldName' },
  { title: t('dashboard.card5.isMaster'), value: 'isMaster' },
  { title: 'CPU', value: 'cpu' },
  { title: t('dashboard.card5.mem'), value: 'mem' },
  { title: t('dashboard.card5.disk'), value: 'disk' },
  { title: t('dashboard.card5.status'), value: 'status', minWidth: 100 },
]

const worldStatusLoading = ref(false)

const handleGameExec = params => {
  const reqForm = {
    type: params.type,
    roomID: globalStore.room.id,
    worldID: params.worldID,
    extra: params.extra,
  }

  worldStatusLoading.value = true
  Object.keys(confirmBoxVisible.value).forEach(key => {
    confirmBoxVisible.value[key].loading = true
  })
  dashboardApi.exec.game.post(reqForm).then(response => {
    showSnackbar(response.message)
    Object.keys(confirmBoxVisible.value).forEach(key => {
      confirmBoxVisible.value[key].visible = false
    })
  }).finally(() => {
    Object.keys(confirmBoxVisible.value).forEach(key => {
      confirmBoxVisible.value[key].loading = false
    })
    worldStatusLoading.value = false
    getBaseInfo()
  })
}

const announceMsg = ref('')

const consoleForm = ref({
  worlds: [],
  selectedWorldID: undefined,
  cmd: '',
})

const updateTypeDialog = ref(false)
const updateType = ref('frontend')

const resetTypeDialog = ref(false)
const resetType = ref('reset-no-force')

const cleanWorldID = ref()

const modDialog = ref(false)
const modLoading = ref(false)
const modList = ref([])

const getEnabledMods = async () => {
  modLoading.value = true

  const reqForm = {
    roomID: globalStore.room.id,
    worldID: baseInfo.value.worlds[0].id,
  }

  const response = await modApi.setting.enabledMods.get(reqForm)

  modList.value = response.data
  modLoading.value = false
}

const headers = [
  { key: 'preview_url', title: t('game.mod.add.preview') },
  { key: 'name', title: t('game.mod.add.name') },
  { key: 'serverSize', title: t('game.mod.add.size') },
  { key: 'id', title: 'ID' },
]

const connectionCodeLoading = ref(false)
const connectionCode = ref('')

const getConnectionCode = () => {
  if (globalStore.room.id === 0) {
    return
  }
  connectionCodeLoading.value = true

  const reqForm = {
    roomID: globalStore.room.id,
  }

  dashboardApi.connectionCode.get(reqForm).then(response => {
    connectionCode.value = response.data
  }).finally(() => {
    connectionCodeLoading.value = false
  })
}

const customConnectionCodeDialog = ref(false)
const customConnectionCodeFormRef = ref()

const customConnectionCodeForm = ref({
  id: '',
  port: undefined,
})

const customConnectionCodeFormRules = ref({
  ip: [
    value => {
      if (!value) return t('dashboard.card1.item.custom.ip.required')
      
      return true
    },
  ],
  port: [
    value => {
      if (value) return true

      return t('dashboard.card1.item.custom.port.required')
    },
  ],
})

const updateConnectionCodeLoading = ref(false)

const handleUpdateConnectionCode = async () => {
  const { valid } = await customConnectionCodeFormRef.value.validate()
  if (!valid) return
  updateConnectionCodeLoading.value = true

  const reqForm ={
    roomID: globalStore.room.id,
    ip: customConnectionCodeForm.value.ip,
    port: customConnectionCodeForm.value.port,
  }

  const response = await dashboardApi.connectionCode.put(reqForm)

  updateConnectionCodeLoading.value = false
  customConnectionCodeDialog.value = false
  showSnackbar(response.message)
  getConnectionCode()
}

const handleClearConnectionCode = () => {
  updateConnectionCodeLoading.value = true

  const reqForm ={
    roomID: globalStore.room.id,
    ip: '',
    port: 0,
  }

  dashboardApi.connectionCode.put(reqForm).then(response => {
    customConnectionCodeDialog.value = false
    showSnackbar(response.message)
    getConnectionCode()
  }).finally(() => {
    updateConnectionCodeLoading.value = false
  })
}

const checkLobbyResult = ref(false)
const checkLobbyLoading = ref(false)

const regions = [
  {
    label: 'ap-southeast-1',
    value: 'ap-southeast-1',
  },
  {
    label: 'ap-east-1',
    value: 'ap-east-1',
  },
  {
    label: 'us-east-1',
    value: 'us-east-1',
  },
  {
    label: 'eu-central-1',
    value: 'eu-central-1',
  },
]

const selectRegions = ref(['ap-southeast-1', 'ap-east-1'])

const checkLobby = (isOpen=false) => {
  if (isOpen) return

  checkLobbyLoading.value = true

  const reqForm = {
    gameName: baseInfo.value.room.gameName,
    maxPlayer: baseInfo.value.room.maxPlayer,
    regions: selectRegions.value,
  }

  dashboardApi.check.lobby.post(reqForm).then(response => {
    checkLobbyResult.value = response.data
  }).finally(() => {
    checkLobbyLoading.value = false
  })
}

const quickCmdDialog = ref(false)
const editorTheme = computed(() => globalStore.theme)
const quickCmdType = ref('player')
const quickCmdPlayerId = ref()
const quickCmdUid = ref('')
const quickCmdWorldId = ref()
const quickCmd = ref('')

const quickCmdPlayerOptions = [
  {
    label: t('dashboard.card3.quickCmd.playerOptions.godmode'),
    value: 0,
  },
  {
    label: t('dashboard.card3.quickCmd.playerOptions.buildermode'),
    value: 1,
  },
  {
    label: t('dashboard.card3.quickCmd.playerOptions.invisiblemode'),
    value: 2,
  },
  {
    label: t('dashboard.card3.quickCmd.playerOptions.oneattacktokill'),
    value: 3,
  },
  {
    label: t('dashboard.card3.quickCmd.playerOptions.unlockalltech'),
    value: 4,
  },
  {
    label: t('dashboard.card3.quickCmd.playerOptions.movingspeed4'),
    value: 5,
  },
  {
    label: t('dashboard.card3.quickCmd.playerOptions.reselectcharacter'),
    value: 6,
  },
  {
    label: t('dashboard.card3.quickCmd.playerOptions.respawn'),
    value: 7,
  },
  {
    label: t('dashboard.card3.quickCmd.playerOptions.mapclear'),
    value: 8,
  },
]

const quickCmdPlayerGenerate = () => {
  if (!(/^KU_/.test(quickCmdUid.value))) {
    koiMsgError(language.value === 'zh' ? '请输入正确的玩家UID' : 'Please input the correct player UID')
    
    return
  }
  if (quickCmdPlayerId.value === 0) {
    quickCmd.value = `UserToPlayer('${quickCmdUid.value}').components.health:SetInvincible(true)`
  }
  if (quickCmdPlayerId.value === 1) {
    quickCmd.value = `for k, v in pairs(AllPlayers) do if v.userid=='${quickCmdUid.value}' then AllPlayers[k].components.builder:GiveAllRecipes() end end`
  }
  if (quickCmdPlayerId.value === 2) {
    quickCmd.value = `UserToPlayer('${quickCmdUid.value}'):AddTag('debugnoattack')`
  }
  if (quickCmdPlayerId.value === 3) {
    quickCmd.value = `UserToPlayer('${quickCmdUid.value}').components.combat.CalcDamage = function() return 9999999999 * 9 end`
  }
  if (quickCmdPlayerId.value === 4) {
    quickCmd.value = `UserToPlayer('${quickCmdUid.value}').components.builder:UnlockRecipesForTech({SCIENCE = 1, MAGIC = 1, ANCIENT = 1, SHADOW = 1, CARTOGRAPHY = 1})`
  }
  if (quickCmdPlayerId.value === 5) {
    quickCmd.value = `UserToPlayer('${quickCmdUid.value}').components.locomotor:SetExternalSpeedMultiplier(UserToPlayer('${quickCmdUid.value}'), 'c_speedmult', 4)`
  }
  if (quickCmdPlayerId.value === 6) {
    quickCmd.value = `c_despawn(UserToPlayer('${quickCmdUid.value}'))`
  }
  if (quickCmdPlayerId.value === 7) {
    quickCmd.value = `for k, v in pairs(AllPlayers) do if v.userid=='${quickCmdUid.value}' then AllPlayers[k]:PushEvent('respawnfromghost') end end`
  }
  if (quickCmdPlayerId.value === 8) {
    quickCmd.value = `local p=UserToPlayer('${quickCmdUid.value}')if p then local s=2*TheWorld.Map:GetSize()for x=-s,s,32 do for z=-s,s,32 do p.player_classified.MapExplorer:RevealArea(x,0,z)end end end`
  }
}

const quickCmdWorldOptions = [
  {
    label: t('dashboard.card3.quickCmd.worldOptions.rollback6days'),
    value: 0,
  },
  {
    label: t('dashboard.card3.quickCmd.worldOptions.skip1day'),
    value: 1,
  },
  {
    label: t('dashboard.card3.quickCmd.worldOptions.nextphase'),
    value: 2,
  },
  {
    label: t('dashboard.card3.quickCmd.worldOptions.save'),
    value: 3,
  },
]

const quickCmdWorldGenerate = () => {
  if (quickCmdWorldId.value === 0) {
    quickCmd.value = `c_rollback(6)`
  }
  if (quickCmdWorldId.value === 1) {
    quickCmd.value = `c_skip(1)`
  }
  if (quickCmdWorldId.value === 2) {
    quickCmd.value = `TheWorld:PushEvent('ms_nextphase')`
  }
  if (quickCmdWorldId.value === 3) {
    quickCmd.value = `c_save()`
  }
}

const quickCmdInsert = () => {
  consoleForm.value.cmd = quickCmd.value
  quickCmdDialog.value = false
  quickCmd.value = ''

  // quickCmdUid.value = ''
  quickCmdPlayerId.value = undefined
  quickCmdWorldId.value = undefined
}

const editorLanguage = computed(() => getEditorLang(globalStore.language))

const getProgressColor = n => {
  if (n >= 0 && n < 25) {
    return 'success'
  }
  if (n >= 25 && n < 50) {
    return 'info'
  }
  if (n >= 50 && n < 75) {
    return 'warning'
  }
  if (n >= 75) {
    return 'error'
  }

  return 'primary'
}

let intervalBaseId = null
let intervalSysId = null

const startBaseRequests = () => {
  intervalBaseId = setInterval(() => {
    getBaseInfo()
  }, 10000)
}

const startSysRequests = () => {
  intervalSysId = setInterval(() => {
    getSysInfo()
  }, 2000)
}

const cancelBaseRequests = () => {
  if (intervalBaseId) {
    clearInterval(intervalBaseId)
    intervalBaseId = null
  }
}

const cancelSysRequests = () => {
  if (intervalSysId) {
    clearInterval(intervalSysId)
    intervalSysId = null
  }
}

const handleResize = debounce(() => {
  windowHeight.value = window.innerHeight
  if (card1Ref.value) {
    card1Width.value = card1Ref.value.$el.offsetWidth
  }
}, 200)

const calculateContainerSize = () => {
  // 64(navbar) + 37(tab header) + 20(card padding) + 16(card padding) = 137
  const other = 150

  return Math.max(2, Math.floor(windowHeight.value - other))
}

const dataGot = ref(false)

onMounted(async () => {
  await Promise.all([getBaseInfo(), getSysInfo()])
  dataGot.value = true
  getConnectionCode()
  consoleForm.value.worlds = baseInfo.value?.worlds || []
  handleResize()

  // 添加事件监听
  window.addEventListener('resize', handleResize)
  startBaseRequests()
  startSysRequests()
})

onUnmounted(() => {
  cancelBaseRequests()
  cancelSysRequests()
  window.removeEventListener('beforeunload', cancelBaseRequests)
  window.removeEventListener('beforeunload', cancelSysRequests)
  window.removeEventListener('resize', handleResize)
})
</script>
