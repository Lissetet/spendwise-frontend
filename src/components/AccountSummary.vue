<template>
  <n-card class="w-fit">
    <div class="flex">
      <template v-for="stat in stats">
        <n-statistic  :label="stat.label">
          <span class="font-semibold text-base">
            {{ formatCurrency(stat.value) }}
          </span>
        </n-statistic>
        <div 
          v-if="!stat.hideDivider" 
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

const stats = [
  {
    label: "Total Cash",
    value: store.accountTotalValues.cash
  },
  {
    label: "Total Debt",
    value: store.accountTotalValues.debt
  },
  {
    label: "Total Investments",
    value: store.accountTotalValues.investment
  },
  {
    label: "Total Property",
    value: store.accountTotalValues.property
  },
  {
    label: "Net Total",
    value: store.accountTotalValues.all,
    hideDivider: true
  }
]
</script>
