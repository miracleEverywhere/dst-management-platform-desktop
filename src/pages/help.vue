<template>
  <v-expansion-panels>
    <v-expansion-panel>
      <v-expansion-panel-title>
        <template v-slot:default="{ expanded }">
          欢迎加群讨论
        </template>
      </v-expansion-panel-title>
      <v-expansion-panel-text>
        <div>
          <div class="help-text">
            如果您遇到了任何问题，都可以在群中进行讨论，也可以提出一些改进项或功能
          </div>
          <div class="help-text">
            如果您有什么好点子，也可以在在群中交流
          </div>
          <div class="tip_info">
            群号：733948644
          </div>
          <v-img :src="globalStore.theme==='dark'?qunDark:qunLight" :width="300"></v-img>
        </div>
      </v-expansion-panel-text>
    </v-expansion-panel>
    <v-expansion-panel>
      <v-expansion-panel-title v-slot="{ expanded }">
        服务器开启后没有模组
      </v-expansion-panel-title>
      <v-expansion-panel-text>
        <div>
          <div class="tip_success">DMP在启动游戏前会自动替换so文件，包含启动、重启等操作，无需执行以下操作</div>
          <div class="tip_info">
            <div>点击替换按钮进行替换，替换前请确认饥荒已经完成安装，替换完成后需执行重启操作</div>
            <v-btn @click="handleReplaceSo" size="small" class="mt-2">替换</v-btn>
          </div>
          <div class="help-text" style="text-decoration: line-through">
            目前饥荒的模组自动下载功能存在Bug，您需要手动替换 dst/bin/lib32/steamclient.so 和 dst/steamclient.so 文件
          </div>
          <MdPreview :modelValue="twoCode"
                     :theme="globalStore.theme"
                     previewTheme="github"/>
          <div class="help-text" style="text-decoration: line-through">
            重新启动游戏服务器即可
          </div>
          <v-timeline direction="horizontal" class="mt-4">
            <v-timeline-item dot-color="error">
              <template v-slot:opposite>
                <v-chip color="error">2024-10-25</v-chip>
              </template>
              <v-alert color="error" title="问题出现">饥荒专用服务器无法自动下载模组</v-alert>
            </v-timeline-item>
            <v-timeline-item dot-color="warning">
              <template v-slot:opposite>
                <v-chip color="warning">2024-12-9</v-chip>
              </template>
              <v-alert color="warning" title="DMP-1.0.6修复此问题">DMP在更新完游戏后会自动替换so文件，或手动点击替换按钮</v-alert>
            </v-timeline-item>
            <v-timeline-item dot-color="info">
              <template v-slot:opposite>
                <v-chip color="info">2025-3-18</v-chip>
              </template>
              <v-alert color="info" title="DMP-1.1.9再次优化">每次启动游戏前自动替换so文件</v-alert>
            </v-timeline-item>
          </v-timeline>
        </div>
      </v-expansion-panel-text>
    </v-expansion-panel>
    <v-expansion-panel>
      <v-expansion-panel-title v-slot="{ expanded }">
        如何开启熔炉
      </v-expansion-panel-title>
      <v-expansion-panel-text>
        <div class="help-text">
          首先在游戏模式中选择熔炉
        </div>
        <div class="help-text">
          输入地面配置：
        </div>
        <MdPreview ref="threeCodeOneRef"
                   :modelValue="threeCodeOne"
                   :theme="isDark?'dark':'light'"
                   previewTheme="github"/>
        <div class="help-text">
          保持洞穴配置为空，输入模组配置：
        </div>
        <MdPreview ref="threeCodeTwoRef"
                   :modelValue="threeCodeTwo"
                   :theme="isDark?'dark':'light'"
                   previewTheme="github"/>
      </v-expansion-panel-text>
    </v-expansion-panel>
    <v-expansion-panel>
      <v-expansion-panel-title v-slot="{ expanded }">
        遇到了问题？先下载日志吧
      </v-expansion-panel-title>
      <v-expansion-panel-text>
        <div class="help-text">
          如果遇到了一些简单的问题，可能通过语言描述，大家凭借经验就能给出相应的解决方案，但是如果遇到了奇奇怪怪的问题，描述了半天大家还是毫无头绪，那么！我们就需要日志啦。
        </div>
        <div class="help-text" style="align-content: center">
          饥荒管理平台一共产生两种日志，一种是请求日志，在 日志-平台 页面就可以看到(前提是打开了请求日志)，还有一种是运行日志，路径是~/dmpProcess.log，如果你是大佬，可以尝试查看日志并解决问题，如果你是小白，那么就点击这个
          <v-btn size="x-small" :loading="downloadProcessLogLoading"
                 @click="handleDownloadProcessLog">下载</v-btn>
          按钮，把日志一股脑的甩给我吧！
        </div>
      </v-expansion-panel-text>
    </v-expansion-panel>
    <v-expansion-panel>
      <v-expansion-panel-title v-slot="{ expanded }">
        如何使用多机器模式
      </v-expansion-panel-title>
      <v-expansion-panel-text>
        <div class="help-text">多机器模式就是在多台云主机上启动一个饥荒服务器。</div>
        <div class="help-text">首先在设置-房间点击 切换为多机器模式，正确输入房间名、令牌（多个节点需相同配置）等信息后点击下一步。</div>
        <div class="help-text">在世界设置中，需要输入多条配置，下面是各个配置的对应关系。</div>
        <div class="tip_info">
          <div class="help-text">
            <span class="font-weight-bold">连接端口</span>： {server.ini - [NETWORK] - server_port} 默认：地面11000，洞穴11001
          </div>
          <div class="help-text">
            <span class="font-weight-bold">侦听端口</span>： {cluster.ini - [SHARD] - master_port} 默认：10888
          </div>
          <div class="help-text">
            <span class="font-weight-bold">Steam连接端口</span>： {server.ini - [STEAM] - server_master_port} 默认：地面27018，洞穴27019
          </div>
          <div class="help-text">
            <span class="font-weight-bold">Steam认证端口</span>： {server.ini - [STEAM] - authentication_port} 默认：地面8768，洞穴8769
          </div>
          <div class="help-text">
            <span class="font-weight-bold">Master IP</span>： {cluster.ini - [SHARD] - master_ip} 地面为127.0.0.1无需修改，洞穴为地面服务器的公网ip
          </div>
          <div class="help-text">
            <span class="font-weight-bold">认证密码</span>： {cluster.ini - [SHARD] - cluster_key} 地面和洞穴之间认证的密码，两个服务器该配置需一致
          </div>
        </div>
        <div class="tip_warning">
          配置完成后需要到云服务器页面放开对应的端口，否则会出现连接失败的问题
        </div>
        <div class="tip_error">
          注意，多机器模式下，主节点与从节点的模组配置须一致，如果在主节点新增了一个模组，在剩余从节点也应该加上这个模组
        </div>
      </v-expansion-panel-text>
    </v-expansion-panel>
    <v-expansion-panel>
      <v-expansion-panel-title v-slot="{ expanded }">
        导入存档后需要重选角色
      </v-expansion-panel-title>
      <v-expansion-panel-text>
        <div class="tip_info">DMP建议的解决方案↓</div>
        <div class="help-text">点击设置-系统，在用户路径编码中修改地面和洞穴的相关配置，提交后手动重启游戏即可</div>
        <div class="tip_warning">临时解决方案(不建议)↓</div>
        <div class="help-text">先进入 .klei/DoNotStarveTogether/MyDediServer/Master/save/session/XXXXXX/ 下，查看里面的文件夹是否为A7开头，如果是，则在 .klei/DoNotStarveTogether/MyDediServer/Master/server.ini 文件中添加或修改</div>
        <MdPreview ref="sixCodeOneRef"
                   :modelValue="sixCodeOne"
                   :theme="isDark?'dark':'light'"
                   previewTheme="github"/>
        <div class="help-text">如果不是，则添加或修改</div>
        <MdPreview ref="sixCodeTwoRef"
                   :modelValue="sixCodeTwo"
                   :theme="isDark?'dark':'light'"
                   previewTheme="github"/>
        <div class="help-text">重启游戏即可</div>
      </v-expansion-panel-text>
    </v-expansion-panel>
  </v-expansion-panels>
</template>

<script setup>
import logsApi from '@/api/logs'
import toolsApi from '@/api/tools'
import {saveFile} from "@/utils/tools";
import {showSnackbar} from "@/utils/snackbar";
import useGlobalStore from "@/plugins/pinia/global";
import {MdPreview} from 'md-editor-v3';
import 'md-editor-v3/lib/preview.css';


const globalStore = useGlobalStore()

const qunLight =  new URL('@/views/help/images/IMG_4193.JPG', import.meta.url).href
const qunDark =  new URL('@/views/help/images/IMG_4194.JPG', import.meta.url).href

const twoCode = ref('```shell ::close\n# 备份\ncd ~\nmv dst/bin/lib32/steamclient.so dst/bin/lib32/steamclient.so.bak\nmv dst/steamclient.so dst/steamclient.so.bak\n# 替换\ncp steamcmd/linux32/steamclient.so dst/bin/lib32/steamclient.so\ncp steamcmd/linux32/steamclient.so dst/steamclient.so\n```')
const threeCodeOne = ref('```lua ::close\nreturn {\n  background_node_range={ 0, 1 },\n  desc="你敢去熔炉里证明你自己的实力吗？",\n  hideminimap=false,\n  id="LAVAARENA",\n  location="lavaarena",\n  max_playlist_position=999,\n  min_playlist_position=0,\n  name="熔炉",\n  numrandom_set_pieces=0,\n  override_level_string=false,\n  overrides={\n    autumn="default",\n    basicresource_regrowth="none",\n    beefaloheat="default",\n    boons="never",\n    brightmarecreatures="default",\n    crow_carnival="default",\n    darkness="default",\n    day="default",\n    dropeverythingondespawn="default",\n    extrastartingitems="default",\n    ghostenabled="always",\n    ghostsanitydrain="always",\n    hallowed_nights="default",\n    healthpenalty="always",\n    hunger="default",\n    keep_disconnected_tiles=true,\n    krampus="default",\n    layout_mode="RestrictNodesByKey",\n    lessdamagetaken="none",\n    no_joining_islands=true,\n    no_wormholes_to_disconnected_tiles=true,\n    poi="never",\n    portalresurection="none",\n    protected="never",\n    resettime="default",\n    roads="never",\n    season_start="default",\n    seasonalstartingitems="default",\n    shadowcreatures="default",\n    spawnmode="fixed",\n    spawnprotection="default",\n    specialevent="default",\n    spring="default",\n    start_location="lavaarena",\n    summer="default",\n    task_set="lavaarena_taskset",\n    temperaturedamage="default",\n    touchstone="never",\n    traps="never",\n    winter="default",\n    winters_feast="default",\n    world_size="small",\n    year_of_the_beefalo="default",\n    year_of_the_bunnyman="default",\n    year_of_the_carrat="default",\n    year_of_the_catcoon="default",\n    year_of_the_dragonfly="default",\n    year_of_the_gobbler="default",\n    year_of_the_pig="default",\n    year_of_the_varg="default"\n  },\n  required_prefabs={ "lavaarena_portal" },\n  settings_desc="你敢去熔炉里证明你自己的实力吗？",\n  settings_id="LAVAARENA",\n  settings_name="熔炉",\n  substitutes={  },\n  version=2,\n  worldgen_desc="你敢去熔炉里证明你自己的实力吗？",\n  worldgen_id="LAVAARENA",\n  worldgen_name="熔炉"\n}\n```')
const threeCodeTwo = ref('```lua ::close\nreturn {\n  ["workshop-1938752683"]={\n    configuration_options={\n      ADJUST_FILTER=false,\n      BATTLESTANDARD_EFFICIENCY=1,\n      COMMAND_SPAM_BAN_TIME=10,\n      DAMAGE_NUMBER_FONT_SIZE=32,\n      DAMAGE_NUMBER_HEIGHT=40,\n      DAMAGE_NUMBER_OPTIONS="default",\n      DAMAGE_NUMBER_PLAYERS=false,\n      DEBUG=false,\n      DEFAULT_FILTER=1,\n      DEFAULT_LOBBY_TAB="news",\n      DEFAULT_ROTATION=false,\n      DIFFICULTY="normal",\n      DISPLAY_COLORED_STATS=true,\n      DISPLAY_TARGET_BADGE=true,\n      DISPLAY_TEAMMATES_DEBUFFS=false,\n      ["Damage Number Options"]=0,\n      ["Detailed Summary Options"]=0,\n      EVENT_TRACKING=true,\n      FORCE_START_DELAY_TIME=5,\n      FRIENDLY_FIRE=false,\n      GAMETYPE="forge",\n      GIFT_SIDE="right",\n      ["Gameplay Settings"]=0,\n      HIDE_INDICATORS=true,\n      JOINABLE_MIDMATCH=true,\n      LOBBY_GEAR=true,\n      ["Lobby Options"]=0,\n      MAX_MESSAGES=100,\n      MOB_ATTACK_RATE=1,\n      MOB_DAMAGE_DEALT=1,\n      MOB_DAMAGE_TAKEN=1,\n      MOB_DUPLICATOR=1,\n      MOB_HEALTH=1,\n      MOB_SIZE=1,\n      MOB_SPEED=1,\n      MODE="reforged",\n      Mutators=0,\n      NO_HUD=false,\n      NO_REVIVES=false,\n      NO_SLEEP=false,\n      ONLY_SHOW_NONZERO_STATS=true,\n      Other=0,\n      PING_KEYBIND="KEY_R",\n      PING_TRANSPARENCY=100,\n      PLAYER_DEBUFF_DISPLAY="mini",\n      ["Player HUD Options"]=0,\n      RESERVE_SLOTS=true,\n      ROTATION=0,\n      SANDBOX=false,\n      SERVER_ACHIEVEMENTS=false,\n      SERVER_LEVEL=false,\n      SHOW_CHAT_ICON=false,\n      SPECTATORS_ONLY=true,\n      SPECTATOR_ON_DEATH=false,\n      VOTE_FORCE_START=true,\n      VOTE_GAME_SETTINGS=true,\n      VOTE_KICK=true,\n      ["Visual Options"]=0,\n      Vote=0,\n      WAVESET="swineclops"\n    },\n    enabled=true\n  },\n  ["workshop-2038128735"]={ configuration_options={ klaustrophobia=false }, enabled=true },\n  ["workshop-2619860122"]={ configuration_options={  }, enabled=true },\n  ["workshop-2633870801"]={\n    configuration_options={\n      ["Gameplay Settings"]=0,\n      MAP="none",\n      ["Other Settings"]=0,\n      WAVESET="none",\n      light_color_override=false\n    },\n    enabled=true\n  },\n  ["workshop-2961923603"]={ configuration_options={  }, enabled=true },\n  ["workshop-3132633883"]={ configuration_options={  }, enabled=true },\n  ["workshop-3139080374"]={\n    configuration_options={\n      Brainwash_Fix=true,\n      Lock_Recipes=true,\n      Manually_Rapid_Atk=true,\n      Random_Character_Fix=true,\n      Rhinocebro_Fix=false,\n      Spike_Fix=true,\n      Tenfold_Optimize=true,\n      force_camera=true,\n      worly_cookpot=false\n    },\n    enabled=true\n  },\n  ["workshop-666155465"]={\n    configuration_options={\n      chestB=-1,\n      chestG=-1,\n      chestR=-1,\n      display_hp=-1,\n      food_estimation=-1,\n      food_order=0,\n      food_style=0,\n      lang="auto",\n      show_food_units=-1,\n      show_uses=-1\n    },\n    enabled=true\n  }\n}\n```')
const sixCodeOne = ref('```ini ::open\n[ACCOUNT]\nencode_user_path = true\n```')
const sixCodeTwo = ref('```ini ::open\n[ACCOUNT]\nencode_user_path = false\n```')


const downloadProcessLogLoading = ref(false)
const handleDownloadProcessLog = () => {
  downloadProcessLogLoading.value = true
  logsApi.processLog.post().then(async (response) => {
    await saveFile(response.data, 'logs.tgz')
  }).finally(() => {
    downloadProcessLogLoading.value = false
  })
}

const handleReplaceSo = () => {
  toolsApi.replaceSo.post().then(response => {
    showSnackbar(response.message)
  })
}
</script>

<style scoped>
</style>