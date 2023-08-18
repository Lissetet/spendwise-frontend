<template>
  <header class="flex max-w-6xl mx-auto p-3 gap-20 justify-between">
    <n-text type="primary" class="flex">
      <Icon icon="spendwise" class="text-2xl mr-4"/>
      <span class="text-base mt-1 font-bold">SpendWise</span>
    </n-text>
    <n-space justify="space-around">
    </n-space>
    <n-button @click="login" type="primary">Log in</n-button>
  </header>
</template>

<script setup>
import { Icon } from '@iconify/vue';
import { NSpace, NButton, NText } from 'naive-ui';

const props = defineProps({
  login: {
    type: Function,
    required: true
  }
})
</script>