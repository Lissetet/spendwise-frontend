<template>
  <n-card class="w-fit">
    <div class="flex">
      <template v-for="stat in stats">
        <n-statistic  :label="stat.label" class="capitalize">
          <span class="font-semibold text-base">
            {{ formatCurrency(stat.value) }}
          </span>
        </n-statistic>
        <div 
          v-if="!stat.label.includes('Net')" 
          :class="`${store.isDark ? 'bg-neutral-800' : 'bg-neutral-100'} w-px mx-6`"
        />
      </template>
    </div>
  </n-card>
</template>

<script setup>
import {  NStatistic, NCard } from "naive-ui";
import { formatCurrency } from "@/utils";

import useUserStore from '@/store/user';
const store = useUserStore();

const keys = ["cash", "debt", "investments", "property", "all"]

const stats = keys.map((key) => {
  return {
    label: key === "all" ? "Net Total" : `Total ${key}`,
    value: store.accountTotalValues[key],
  }
})
</script>
