<template>
  <n-layout has-sider position="absolute">
    <n-layout-sider
      bordered
      show-trigger
      collapse-mode="width"
      :inverted="true"
      :collapsed-width="50"
      :width="200"
      :native-scrollbar="false"
      :collapsed="collapsed"
      @collapse="collapsed = true"
      @expand="collapsed = false"
      class="h-screen py-4"
      :style="isDarkTheme ? '' : 'border-right: 1px solid #f2f2f6;'"
    >
      <n-menu 
        :collapsed-width="64" 
        :options="menuNavOptions" 
        :class="{ hidden: collapsed }" 
      />
    </n-layout-sider>
    <n-layout content-style="padding: 1rem 2rem">
      <n-space class="flex gap-20 w-full -mb-3 text-xs" justify="end" align="center">
        <!-- <n-button quaternary @click="toggleCollapse" aria-label="Toggle Menu" class="flex my-auto lg:hidden">
          <Icon icon="material-symbols:menu" class="text-xl"/>
        </n-button> -->
        <div>
          <feedback-modal />
          <n-button quaternary>
            <Icon icon="mi:notification" class="pr-2"/>
            Notifications
          </n-button>
          <n-button quaternary>
            <Icon icon="material-symbols:help-outline" class="pr-2"/>
            Help
          </n-button>
        </div>
      </n-space>
      <n-divider />
      <main>
        <router-view />
      </main>
    </n-layout>
  </n-layout>
</template>

<script setup>
import { useAuth0 } from '@auth0/auth0-vue';
import { Icon } from '@iconify/vue';
import { RouterLink } from 'vue-router';
import { NLayout, NDivider, NLayoutSider, NSpace, NMenu, NButton } from 'naive-ui';
import { ref, h, inject, onMounted, onBeforeUnmount } from 'vue';
import FeedbackModal from '@/components/FeedbackModal.vue';

const isDarkTheme = inject('isDarkTheme');

const { logout } = useAuth0();
const collapsed = ref(false);

const toggleCollapse = () => {
  collapsed.value = !collapsed.value;
};

const checkWindowSize = () => {
  collapsed.value = window.innerWidth < 1024;
};

onMounted(() => {
  window.addEventListener('resize', checkWindowSize);
  checkWindowSize();  // Call it once to initialize state based on current window size
});

onBeforeUnmount(() => {
  window.removeEventListener('resize', checkWindowSize);
});

const getHeaderOption = () => {
  return {
    label: () => h(
      'div',
      { class: 'flex justify-center py-3' },
      [
        h(Icon, { icon: 'spendwise', class: 'text-2xl' }),
        h('span', { class: 'text-base my-auto font-bold' }, 'SpendWise')
      ]
    ),
    key: 'header',
  }
};

const getDividerOption = () => {
  return {
    key: 'divider-1',
    type: 'divider',
    props: {
      style: {
        margin: '2rem'
      }
    }
  }
};

const getOption = (label, key, to) => {
  return {
    label: () => h(
      RouterLink, { to }, { default: () => label }
    ),
    active: () => router.currentRoute.value.path === to,
    key
  };
};

const getLogOut = () => {
  return {
    label: () => h(
      'a',
      {
        onClick: () => logout({ returnTo: window.location.origin })
      },
      { default: () => "Logout" }
    ),
    key: "logout"
  }
};

const menuNavOptions = [
  getHeaderOption(),
  getDividerOption(),
  getOption("Overview WIP", "overview", "/overview"),
  getOption("Accounts", "accounts", "/accounts"),
  getOption("Transactions", "transactions", "/transactions"),
  getOption("Goals WIP", "goals", "/goals"),
  getOption("Events", "events", "/events"),
  getOption("Budgets WIP", "budgets", "/budgets"),
  getOption("Categories", "categories", "/categories"),
  getOption("Net Worth WIP", "net-worth", "/net-worth"),
  getDividerOption(),
  getOption("Settings WIP", "settings", "/settings"),
  getOption("Profile WIP", "profile", "/profile"),
  getLogOut(),
];

</script>

<style>
a {
  font-weight: 500;
}
</style>