<template>
  <n-card class="w-fit">
    <div class="flex">
      <n-statistic label="Total Cash">
        <span class="font-semibold text-base">
          {{ formatCurrency(store.accountTotalValues.cash) }}
        </span>
      </n-statistic>
      <div :class="`${store.isDark ? 'bg-neutral-800' : 'bg-neutral-100'} w-px mx-6`"/>
      <n-statistic label="Total Debt">
        <span class="font-semibold text-base">
          {{ formatCurrency(store.accountTotalValues.debt) }}
        </span>
      </n-statistic>
      <div :class="`${store.isDark ? 'bg-neutral-800' : 'bg-neutral-100'} w-px mx-6`"/>
      <n-statistic label="Total Investments">
        <span class="font-semibold text-base">
          {{ formatCurrency(store.accountTotalValues.investment) }}
        </span>
      </n-statistic>
      <div :class="`${store.isDark ? 'bg-neutral-800' : 'bg-neutral-100'} w-px mx-6`"/>
      <n-statistic label="Total Property">
        <span class="font-semibold text-base">
          {{ formatCurrency(store.accountTotalValues.property) }}
        </span>
      </n-statistic>
      <div :class="`${store.isDark ? 'bg-neutral-800' : 'bg-neutral-100'} w-px mx-6`"/>
      <n-statistic label="Net Total">
        <span class="font-semibold text-base">
          {{ formatCurrency(store.accountTotalValues.all) }}
        </span>
      </n-statistic>
    </div>
  </n-card>
</template>

<script setup>
import {  NStatistic, NCard } from "naive-ui";

import useUserStore from '@/store/user';
const store = useUserStore();

const props = defineProps({
  formatCurrency: {
    type: Function,
    required: true
  }
})
</script>
