<template>
  <n-statistic label="Current Net Worth" tabular-nums>
  <n-text :type="netWorth < 0 ? 'error' : netWorth > 0 ? 'success' : 'default'">
    $<n-number-animation
      ref="numberAnimationInstRef"
      :from="0"
      :to="netWorth"
      show-separator
      :active="true"
      :precision="2"
      :duration="500"
    />
  </n-text>
  </n-statistic>
  <n-button size="small" text type="primary" @click="showDetails = !showDetails">
    {{ showDetails ? 'Hide' : 'Show' }} Details
  </n-button>
  <n-tree
    block-line
    :data="data"
    :selectable="false"
    class="mt-8 text-sm"
    :render-label="renderLabel"
    :render-switcher-icon="renderSwitcherIcon"
    v-if="showDetails"
  />
</template>

<script setup>
import { h, ref, onMounted, reactive } from 'vue'
import { Icon } from '@iconify/vue'
import useUserStore from '@/store/user';
import { formatCurrency } from '@/utils';
import {  NStatistic, NNumberAnimation, NButton, NText, NTree } from 'naive-ui'

const store = useUserStore();
const numberAnimationInstRef = ref(null);
const showDetails = ref(true);
const netWorth = ref(0);

const getCurrency = (value) => {
  return h(
    NText,
    { type: value < 0 ? "error" : value > 0 ? "success" : 'default'},
    { default: () => formatCurrency(value) }
  );
}

const getChildAccount = (account) => {
  return {
    label: account.name,
    key: account.id,
    suffix: () => getCurrency(account.balance)
  };
}

const assets = {
  cash: 'allCash', 
  investments: 'investment',
  property: 'property'
}

const liablities = {
  credit: 'credit',
  loan: 'loan'
}

const getChildren = (type) => {
  return Object.entries(type).map(([key, childrenKey]) => {
    const { children, balance } = store.accountTypes[childrenKey];
    netWorth.value += balance;
    return {
      label: key,
      key,
      children: children.map(getChildAccount),
      suffix: () => getCurrency(balance)
    };
  });
}

const renderLabel = ({option}) => {
  const className = `capitalize ${option.children ? 'font-bold' : ''}`
  return h("span", { class: className }, option.label);
};

const data = reactive([
  {
    label: "Assets",
    key: "assets",
    children: getChildren(assets),
    suffix: () => getCurrency(netWorth.value - store.accountTotalValues.debt)
  },
  {
    label: "Liabilities",
    key: "liabilities",
    children: getChildren(liablities),
    suffix: () => getCurrency(store.accountTotalValues.debt)
  }
]);

const renderSwitcherIcon = ({ isExpanded }) => {
  return h(Icon, {
    class: 'text-md',
    icon: isExpanded ? 'typcn:chevron-down' : 'typcn:chevron-right'
  });
};

onMounted(()=> {
  store.fetchAccounts();
  numberAnimationInstRef.value.play();
});
</script>

<style scope>
.n-statistic-value__content {
  font-size: 3rem !important;
}
</style>