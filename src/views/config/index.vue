<template>
  <v-card style="width: 500px; min-height: 259px;">
    <template v-if="props.configItem.name">
      <v-card-item>
        <v-card-title>
          {{props.configItem.name}}
        </v-card-title>
        <v-card-subtitle>
          {{props.configItem.remark}}
        </v-card-subtitle>
        <template v-slot:append>
          <v-menu v-model="menu" location="bottom end" open-on-hover>
            <template v-slot:activator="{ props }">
              <v-btn icon color="primary" v-bind="props">
                <v-icon icon="ri-more-2-fill"></v-icon>
              </v-btn>
            </template>
            <v-list>
              <v-list-item
                  v-for="(item, index) in menuItems"
                  :key="index"
                  @click="handleMenuClick(item)"
              >
                <v-list-item-title>{{ item.title }}</v-list-item-title>
              </v-list-item>
            </v-list>
          </v-menu>

        </template>

      </v-card-item>
      <v-card-text>
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
    </template>
    <template v-else>
      <v-card-item>
        <v-card-title>
          点击新建
        </v-card-title>
      </v-card-item>
      <v-card-text>
        <v-card variant="tonal">
          <div class="cc" style="min-height: 169px;">
            <v-dialog v-model="dialog" max-width="600">
              <template v-slot:activator="{ props: activatorProps }">
                <v-icon icon="ri-add-line" size="50" v-bind="activatorProps"></v-icon>
              </template>

              <v-card prepend-icon="mdi-account" title="User Profile">
                <v-card-text>
                  <v-row dense>
                    <v-col cols="12" md="4" sm="6">
                      <v-text-field label="First name*" required></v-text-field>
                    </v-col>

                    <v-col cols="12" md="4" sm="6"
                    >
                      <v-text-field hint="example of helper text only on focus" label="Middle name"></v-text-field>
                    </v-col>

                    <v-col cols="12" md="4" sm="6">
                      <v-text-field hint="example of persistent helper text" label="Last name*" persistent-hint required></v-text-field>
                    </v-col>

                    <v-col cols="12" md="4" sm="6">
                      <v-text-field label="Email*" required></v-text-field>
                    </v-col>

                    <v-col cols="12" md="4" sm="6">
                      <v-text-field label="Password*" type="password" required></v-text-field>
                    </v-col>

                    <v-col cols="12" md="4" sm="6">
                      <v-text-field label="Confirm Password*" type="password" required></v-text-field>
                    </v-col>

                    <v-col cols="12" sm="6">
                      <v-select :items="['0-17', '18-29', '30-54', '54+']" label="Age*" required></v-select>
                    </v-col>

                    <v-col cols="12" sm="6">
                      <v-autocomplete :items="['Skiing', 'Ice hockey', 'Soccer', 'Basketball', 'Hockey', 'Reading', 'Writing', 'Coding', 'Basejump']" label="Interests" auto-select-first multiple></v-autocomplete>
                    </v-col>
                  </v-row>

                  <small class="text-caption text-medium-emphasis">*indicates required field</small>
                </v-card-text>

                <v-divider></v-divider>

                <v-card-actions>
                  <div style="padding: 10px 0">
                    <v-btn text="关 闭" @click="dialog = false"></v-btn>
                    <v-btn variant="tonal" text="新 增" @click="dialog = false" style="margin-left: 5px"></v-btn>
                  </div>
                </v-card-actions>
              </v-card>
            </v-dialog>

          </div>
        </v-card>
      </v-card-text>
    </template>

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

const menu = ref(false)
const menuItems = ref([
  { title: 'Option 1' },
  { title: 'Option 2' },
  { title: 'Option 3' },
])

const handleMenuClick = (item) => {
  console.log('Clicked:', item.title);
  // menu.value = false; // 关闭菜单
}

const dialog = ref(false)

</script>

<style scoped lang="scss">
</style>