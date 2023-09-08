<template>
  <n-dropdown 
    trigger="click" 
    :options="options"
    placement="bottom-start"
    size="huge"
    class="max-w-xs w-screen"
  >
    <n-button quaternary size="small" >
      <Icon icon="mdi:menu" class="text-lg"/>
    </n-button>
  </n-dropdown>
</template>

<script setup>
import { h } from "vue";
import { RouterLink } from "vue-router";
import { NDropdown, NButton } from "naive-ui";
import { Icon } from '@iconify/vue';

const { logout } = defineProps({
  logout: {
    type: Function,
    required: true
  }
});


const renderLabel = (label) => {
  if (label === 'divider') {
    return null;
  } else if (label === 'Logout') {
    return h(
      'a',
      { onClick: () => logout({ returnTo: window.location.origin }) },
      { default: () => label }
    )
  } else {
    const to = label.toLowerCase().replace(' ', '-');
    return h(
      RouterLink, 
      { to, class: 'capitalize' }, 
      { default: () => label }
    )
  }
}

const getOption = (label, key) => ({
  key,
  type: label === 'divider' ? 'divider' : 'item',
  label: () => renderLabel(label)
});

const pages = [
  'Overview',
  'Accounts',
  'Transactions',
  'Events',
  'Budgets',
  'Categories',
  'Net Worth',
  'divider',
  'Settings',
  'Contact',
  'divider',
  'Profile',
  'Logout'
]

const options = pages.map(getOption);

</script>