<template>
  <n-dropdown trigger="hover" :options="options" @select="handleSelect">
    <n-button quaternary >
      <Icon :icon="iconMap[store.theme]" />
    </n-button>
  </n-dropdown>
</template>

<script setup>
import { h } from 'vue';
import { Icon } from '@iconify/vue';
import { NButton, NDropdown } from 'naive-ui';
import useUserStore from '@/store/user';
const store = useUserStore();

const iconMap = {
  'light': 'material-symbols:light-mode-outline',
  'dark': 'material-symbols:dark-mode-outline',
  'system': 'line-md:light-dark-loop',
};
const renderIcon = icon => () => h(Icon, { icon });

const getOption = (label) => { 
  const iconName = label === 'System' ? 'line-md:light-dark-loop' : null;
  const key = label.toLowerCase();
  return {
    label,
    key,
    icon: renderIcon(iconName || `material-symbols:${key}-mode-outline`),
  }
};

const options = ['Light', 'Dark', 'System'].map(getOption);

const handleSelect = (key) => {
  store.theme = key;
}
</script>