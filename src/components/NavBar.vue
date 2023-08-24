<template>
  <n-card :bordered="false" class="rounded-none h-20">
    <header class="flex max-w-6xl m-auto justify-between">
      <n-text type="primary" class="flex">
        <Icon icon="spendwise" class="text-3xl mr-4"/>
        <span class="text-lg mt-1 font-bold">SpendWise</span>
      </n-text>
      <n-space justify="space-around">
      </n-space>
      <n-button @click="login" type="primary" size="large" strong>Log in</n-button>
    </header>
  </n-card>
</template>

<script setup>
import { Icon } from '@iconify/vue';
import { NSpace, NButton, NText, NCard } from 'naive-ui';

const props = defineProps({
  login: {
    type: Function,
    required: true
  }
})
</script>