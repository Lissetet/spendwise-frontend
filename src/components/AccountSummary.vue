<template>
  <n-card class="w-fit">
    <div class="flex">
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
          :class="`bg-neutral-${store.theme.name==='dark' ? '800' : '100'} w-px mx-6`"
        />
      </template>
    </div>
  </n-card>
  <div class="h-0 w-0 bg-neutral-800 bg-neutral-100"/>
</template>

<script setup>
import { computed } from "vue";
import {  NStatistic, NCard, NText } from "naive-ui";
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
