<template>
  <v-card height="870">
    <template #title>
      <div class="card-header">
        <span class="font-weight-bold">定时通知</span>
        <v-btn @click="addAnnounce">新增</v-btn>
      </div>
    </template>
    <template #text>
      <v-container height="700" style="overflow-y: auto">
        <v-data-table :headers="headers" :items="announceData" :loading="loading" hide-default-footer>
          <!-- 是否激活 -->
          <template v-slot:item.enable="{ item }">
            <v-chip :color="item.enable ? 'primary' : 'error'" label>
              {{ item.enable ? "启用" : "禁用" }}
            </v-chip>
          </template>

          <!-- 操作列 -->
          <template v-slot:item.actions="{ item }">
            <v-btn class="mr-2" size="small" @click="openAnnounceUpdate(item)">更新</v-btn>
            <v-btn color="error" size="small" @click="handleAnnounceDelete(item)">删除</v-btn>
          </template>
        </v-data-table>
      </v-container>
    </template>
  </v-card>
  <v-dialog v-model="addDialogVisible" width="600">
    <v-card>
      <v-card-title class="font-weight-bold">新增通知</v-card-title>
      <v-card-text>
        <v-sheet class="mx-auto pa-4">
          <v-form ref="announceFormRef" :rules="announceFormRules">
            <v-text-field v-model="announceForm.name" class="mb-4" label="名称"></v-text-field>
            <v-switch v-model="announceForm.enable" :label="announceForm.enable ? '启用' : '禁用'" class="mb-4"
                      inset></v-switch>
            <v-text-field v-model="announceForm.content" class="mb-4" label="内容"></v-text-field>
            <v-text-field v-model="announceForm.frequency" label="频率" type="number">
              <v-tooltip activator="parent" open-delay="300" scroll-strategy="close">
                每次执行的间隔，单位：秒
              </v-tooltip>
            </v-text-field>
          </v-form>
        </v-sheet>
      </v-card-text>
      <v-card-actions>
        <v-btn @click="addDialogVisible = false">取消</v-btn>
        <v-btn color="primary" @click="handleAnnounce">确定</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
  <v-dialog v-model="deleteDialogVisible" width="400">
    <v-card>
      <v-card-title class="font-weight-bold">删除通知</v-card-title>
      <v-card-text>该操作将会永久删除且无法恢复，是否继续？</v-card-text>
      <v-card-actions>
        <v-btn size="small" variant="plain" @click="cancelDelete">取消</v-btn>
        <v-btn color="primary" size="small" variant="tonal" @click="confirmDelete">确认</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup>
import {ref} from "vue";
import {showSnackbar} from "@/utils/snackbar";
import toolsApi from "@/api/tools";

const announceForm = ref({
  name: "",
  enable: true,
  content: "",
  frequency: 600,
});
const announceFormRules = {
  name: [{required: true, message: "请输入名称", trigger: "blur"}],
  enable: [{required: true, message: "请选择是否激活", trigger: "change"}],
  content: [{required: true, message: "请输入通知内容", trigger: "blur"}],
  frequency: [{required: true, message: "请输入通知频率", trigger: "blur"}],
};
// 弹窗相关
const addDialogVisible = ref(false);

// 表单相关
const announceFormRef = ref(null);
const announceAction = ref("");

// 新增通知
const addAnnounce = () => {
  // 重置表单数据
  announceForm.value = {
    name: "",
    enable: true,
    content: "",
    frequency: 600,
  };

  // 显示对话框
  announceAction.value = "post";
  addDialogVisible.value = true;
};

const handleAnnounce = async () => {
  // 表单验证
  if (!announceFormRef.value) return;

  try {
    const {valid} = await announceFormRef.value.validate();
    console.log("表单验证结果", valid);

    if (valid) {
      if (announceForm.value.frequency < 1) {
        showSnackbar("通知频率必须大于0", "warning");
        return;
      }

      switch (announceAction.value) {
        case "post":
          handleAnnouncePost();
          break;
        case "put":
          handleAnnouncePut()
          break;
      }

      // 关闭对话框
      addDialogVisible.value = false;
    }
  } catch (error) {
    console.error("表单验证错误", error);
  }
};

// 新增通知
const handleAnnouncePost = () => {
  toolsApi.announce.post(announceForm.value).then((response) => {
    showSnackbar(response.message, "success");
    getAnnounceData();
  });
};

// 更新通知
const handleAnnouncePut = () => {
  toolsApi.announce.put(announceForm.value).then((response) => {
    showSnackbar(response.message, "success");
    getAnnounceData();
  });
};

const openAnnounceUpdate = (row) => {
  announceForm.value = {...row}
  announceAction.value = 'put'
  addDialogVisible.value = true
}

// 删除通知
const deleteDialogVisible = ref(false);
const currentDeleteItem = ref(null);

const handleAnnounceDelete = (form) => {
  currentDeleteItem.value = form;
  deleteDialogVisible.value = true;
};

const confirmDelete = () => {
  if (!currentDeleteItem.value) return;

  toolsApi.announce.delete(currentDeleteItem.value).then(response => {
    showSnackbar(response.message, "success");
    getAnnounceData();
  }).finally(() => {
    deleteDialogVisible.value = false;
    currentDeleteItem.value = null;
  });
};

const cancelDelete = () => {
  deleteDialogVisible.value = false;
  currentDeleteItem.value = null;
  showSnackbar('已取消操作', "info");
};


// 获取通知列表
const loading = ref(false);
const announceData = ref([]);

function DEFAULT_HEADERS() {
  return [
    {
      title: "名称",
      align: "start",
      key: "name",
    },
    {title: "是否激活", key: "enable"},
    {title: "通知频率", key: "frequency"},
    {title: "通知内容", key: "content"},
    {title: "操作", key: "actions", sortable: false, width: "200px"},
  ];
}

const headers = ref(DEFAULT_HEADERS());
const getAnnounceData = () => {
  loading.value = true;
  toolsApi.announce
    .get()
    .then((response) => {
      announceData.value = response.data;
    })
    .finally(() => {
      loading.value = false;
    });
};

onMounted(() => {
  getAnnounceData();
});
</script>

<style scoped></style>
