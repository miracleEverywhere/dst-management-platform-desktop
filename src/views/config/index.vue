<template>
  <v-card>
    <v-card-item>
      <v-card-title>
        {{props.configItem.name}}
      </v-card-title>
      <v-card-subtitle>
        {{props.configItem.remark}}
      </v-card-subtitle>

      <template #append>
        <div class="me-n3">

        </div>
      </template>
    </v-card-item>

    <v-card-text style="width: 500px">
      <v-row>
        <v-col cols="12" sm="7">
          <div>
            <v-chip color="success" label variant="outlined">
              <v-icon icon="ri-global-line" start></v-icon>
              http://{{props.configItem.ip}}:{{props.configItem.port}}
            </v-chip>
            <div style="margin-top: 10px">
              <v-chip v-if="props.configItem.type==='master'||props.configItem.type==='both'"
                      color="primary" style="margin-right: 5px">地面</v-chip>
              <v-chip v-if="props.configItem.type==='cave'||props.configItem.type==='both'"
                      color="success">洞穴</v-chip>
            </div>

          </div>
        </v-col>
        <v-col cols="12" sm="5">
          <v-progress-circular model-value="55" color="primary" :size="60" :width="5">
            CPU
          </v-progress-circular>
          <v-progress-circular model-value="72" color="warning" :size="60" :width="5" style="margin-left: 20px">
            内存
          </v-progress-circular>
        </v-col>
      </v-row>


      <VBtn block style="margin-top: 25px">
        进入
      </VBtn>
    </v-card-text>
  </v-card>
</template>

<script setup>
import ElectronApi from "@/utils/electronApi";

const props = defineProps({
  configItem: {
    type: Object,
    default: {
      name: undefined,
      type: undefined, // 1 master; 2 cave; 3 both;
      ip: undefined,
      port: undefined,
      token: undefined,
    }
  }
})

const roomInfo = ref({
  name: undefined,
  cpu: undefined,
  mem: undefined,
})

const gotoDashboard = () => {
  ElectronApi.window.dashboard()
}

</script>

<style scoped lang="scss">
</style>