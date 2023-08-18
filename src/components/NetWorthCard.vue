<template>
  <n-statistic label="Current Net Worth" tabular-nums>
  <div>
    $<n-number-animation
      ref="numberAnimationInstRef"
      :from="0"
      :to="netWorth"
      show-separator
      :active="true"
      :precision="2"
      :duration="500"
    />
  </div>

  </n-statistic>
  <n-button size="small" text type="primary" @click="showDetails = !showDetails">
    {{ showDetails ? 'Hide' : 'Show' }} Details
  </n-button>
  <n-tree
    block-line
    :data="data"
    :selectable="false"
    class="mt-8 text-sm font-semibold"
    :render-switcher-icon="renderSwitcherIcon"
    v-if="showDetails"
  />
</template>

<script setup>
import { h, ref, onMounted, reactive } from 'vue'
import { Icon } from '@iconify/vue'
import useUserStore from '@/store/user';
const store = useUserStore();

import {  NStatistic, NNumberAnimation, NButton, useMessage, NTree } from 'naive-ui'

const numberAnimationInstRef = ref(null);
const showDetails = ref(true);
const netWorth = ref(0);
const assetsValue = ref(0);
const cashValue = ref(0);
const investmentValue = ref(0);
const propertyValue = ref(0);
const liabilitiesValue = ref(0);
const creditValue = ref(0);
const loanValue = ref(0);

const formatCurrency = (value) => {
  return value.toLocaleString('en-US', { style: 'currency', currency: 'USD' });
}

const getChildAccount = (account) => {
  return {
    label: account.name,
    key: account.id,
    suffix: () => h(
      NButton,
      { 
        text: true, 
        type: account.balance > 0 ? "success" : "error",
        size: "large" 
      },
      { default: () => formatCurrency(account.balance) }
    ),
  };
}

const data = reactive([
  {
    label: "Assets",
    key: "assets",
    children: [
      {
        label: "Cash",
        key: "cash",
        children: [],
        suffix: () => h(
          NButton,
          { text: true, type: "success", size: "large" },
          { default: () => formatCurrency(cashValue.value) }
        ),
      },
      {
        label: "Investments",
        key: "investment",
        children: [],
        suffix: () => h(
          NButton,
          { text: true, type: "success", size: "large" },
          { default: () => formatCurrency(investmentValue.value) }
        ),
      },
      {
        label: "Property",
        key: "property",
        children: [],
        suffix: () => h(
          NButton,
          { text: true, type: "success", size: "large" },
          { default: () => formatCurrency(propertyValue.value) }
        ),
      }
    ], 
    suffix: () => h(
      NButton,
      { text: true, type: "success", size: "large" },
      { default: () => formatCurrency(assetsValue.value) }
    ),
  },
  {
    label: "Liabilities",
    key: "liabilities",
    children: [
      {
        label: "Credit Cards",
        key: "credit",
        children: [],
        suffix: () => h(
          NButton,
          { text: true, type: "error", size: "large" },
          { default: () => formatCurrency(creditValue.value) }
        ),
      },
      {
        label: "Loans",
        key: "loan",
        children: [],
        suffix: () => h(
          NButton,
          { text: true, type: "error", size: "large" },
          { default: () => formatCurrency(loanValue.value) }
        ),
      }
    ],
    suffix: () => h(
      NButton,
      { text: true, type: "error", size: "large" },
      { default: () => formatCurrency(liabilitiesValue.value) }
    ),
  }
]);

const loadData =  () => {
  store.fetchAccounts();
  const cashAccountTypes = ['checking', 'savings', 'cash'];
  const cashAccounts = store.accounts.filter(({ type }) => cashAccountTypes.includes(type));
  const investmntAccounts = store.accounts.filter(({ type }) => type === 'investment');
  const propertyAccounts = store.accounts.filter(({ type }) => type === 'property');
  const creditAccounts = store.accounts.filter(({ type }) => type === 'credit');
  const loanAccounts = store.accounts.filter(({ type }) => type === 'loan');

  cashAccounts.forEach((account) => {
    data[0].children[0].children.push(getChildAccount(account));
    cashValue.value += account.balance;
    assetsValue.value += account.balance;
  })

  investmntAccounts.forEach((account) => {
    data[0].children[1].children.push(getChildAccount(account));
    investmentValue.value += account.balance;
    assetsValue.value += account.balance;
  })

  propertyAccounts.forEach((account) => {
    data[0].children[2].children.push(getChildAccount(account));
    propertyValue.value += account.balance;
    assetsValue.value += account.balance;
  })

  creditAccounts.forEach((account) => {
    data[1].children[0].children.push(getChildAccount(account));
    creditValue.value += account.balance;
    liabilitiesValue.value += account.balance;
  })

  loanAccounts.forEach((account) => {
    data[1].children[1].children.push(getChildAccount(account));
    loanValue.value += account.balance;
    liabilitiesValue.value += account.balance;
  })

  netWorth.value = assetsValue.value + liabilitiesValue.value;
  numberAnimationInstRef.value.play();
};

const renderSwitcherIcon = ({ isExpanded }) => {
  return h(Icon, {
    class: 'text-md',
    icon: isExpanded ? 'typcn:chevron-down' : 'typcn:chevron-right'
  });
};

onMounted(loadData);
</script>

<style scope>
.n-statistic-value__content {
  font-size: 3rem !important;
}
</style>