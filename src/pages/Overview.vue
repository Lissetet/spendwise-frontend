<template>
  <h1 class="mb-10">Welcome {{ store.user.name }}!</h1>
  <n-card class="mb-10">
    <n-text type="primary" :class="['flex gap-4 items-center', { 'mb-6': showNetWorth }]">
      <h2 class="my-auto">Net Worth</h2>
      <n-button text type="primary" @click="showNetWorth = !showNetWorth">
        <Icon 
          :style="{ transform: showNetWorth ? 'rotate(180deg)' : '' }" 
          icon="ion:chevron-down" class="transition-all duration-300 text-base"
        />
      </n-button>
    </n-text>
    <net-worth-card v-if="showNetWorth"/>
  </n-card>

  <n-card class="mb-10">
    <n-text type="primary" :class="['flex gap-4 items-center', { 'mb-6': showEvents }]">
      <h2 class="my-auto">Upcoming Events</h2>
      <n-button text type="primary" @click="showEvents = !showEvents">
        <Icon 
          :style="{ transform: showEvents ? 'rotate(180deg)' : '' }" 
          icon="ion:chevron-down" class="transition-all duration-300 text-base"
        />
      </n-button>
    </n-text>
    <event-calendar v-if="showEvents"/>
  </n-card>

  <n-card>
    <n-text type="primary" :class="['flex gap-4 items-center', { 'mb-6': showAccountOverview }]">
      <h2 class="my-auto">Accounts Overview</h2>
      <n-button text type="primary" @click="showAccountOverview = !showAccountOverview">
        <Icon 
          :style="{ transform: showAccountOverview ? 'rotate(180deg)' : '' }" 
          icon="ion:chevron-down" class="transition-all duration-300 text-base"
        />
      </n-button>
    </n-text>
    <account-table :formatCurrency="formatCurrency" v-if="showAccountOverview"/>
  </n-card>

</template>

<script setup>
import { onMounted, ref } from 'vue';
import useUserStore from '@/store/user';
import { Icon } from '@iconify/vue';
import { NText, NCard, NButton } from 'naive-ui';
const store = useUserStore();
import AccountTable from "@/components/AccountTable.vue";
import NetWorthCard from '@/components/NetWorthCard.vue';
import EventCalendar from '@/components/EventCalendar.vue';

const showAccountOverview = ref(true);
const showNetWorth = ref(true);
const showEvents = ref(true);

const formatCurrency = (amount) => {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amount);
};

onMounted(()=> {
  store.fetchCategories();
  store.fetchAccounts();
  store.fetchEvents();
}
);

</script>