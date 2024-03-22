<template>
  <n-card class="w-fit">
    <div class="flex flex-wrap">
      <template v-for="stat in stats">
        <n-text type="primary">
        <n-statistic  :label="stat.label" class="capitalize">
          <span class="font-semibold text-base">
            {{ formatCurrency(stat.value) }}
          </span>
        </n-statistic>
        </n-text>
        <div 
          v-if="!stat.label.includes('Net')" 
          style="background-color: var(--n-border-color)"
          class="vertical-divider"
        />
      </template>
    </div>
  </n-card>
</template>

<script setup>
import {  NStatistic, NCard, NText } from "naive-ui";
import { formatCurrency } from "@/utils";

import useUserStore from '@/store/user';
const store = useUserStore();
let total = 0;

const keys = ["cash", "debt", "investments", "property"]

const stats = keys.map((key) => {
  total += store.accountTotalValues[key];
  return {
    label: `Total ${key}`,
    value: store.accountTotalValues[key],
  }
})

stats.push({
  label: "Net Total",
  value: total
})
</script>

<style>
.vertical-divider {
  @apply w-px mx-5;
  background-color: var(--n-border-color);
}
</style>
