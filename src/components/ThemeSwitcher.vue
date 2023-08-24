<template>
  <n-button quaternary @click="toggleTheme" >
    <Icon :icon="iconName" />
  </n-button>
  
</template>

<script setup>
import { ref } from 'vue';
import { Icon } from '@iconify/vue';
import { NButton, darkTheme, lightTheme } from 'naive-ui';

import useUserStore from '@/store/user';
const store = useUserStore();
const icons = {
  light: 'material-symbols:light-mode-outline',
  dark: 'material-symbols:dark-mode-outline',
};
const iconName = ref(store.isDark ? icons.light : icons.dark);

const toggleTheme = () => {
  store.theme.name === 'light' ? store.setTheme(darkTheme) : store.setTheme(lightTheme);
  store.isDark = !store.isDark;
  iconName.value = store.isDark ? icons.light : icons.dark;
};
</script>