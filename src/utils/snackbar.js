// src/utils/snackbar.js
import { ref } from 'vue';

// 定义 Snackbar 的状态
const snackbar = ref(false);
const color = ref('success');
const text = ref('');
const location = ref('top');
const timeout = ref(3000);

// 显示 Snackbar 的函数
export function showSnackbar(message, type = 'primary') {
    snackbar.value = true;
    color.value = type;
    text.value = message;
}

// 提供 Snackbar 的状态和方法
export function useSnackbar() {
    return {
        snackbar,
        color,
        text,
        location,
        timeout,
        showSnackbar,
    };
}