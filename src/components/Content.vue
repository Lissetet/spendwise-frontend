<template>
  <n-layout has-sider position="absolute">
    <n-layout-sider
      bordered
      :show-trigger="false"
      collapse-mode="width"
      :collapsed-width="0"
      :width="200"
      :native-scrollbar="false"
      :collapsed="!store.isLarge"
      class="h-screen py-4"
    >
      <n-menu :options="menuNavOptions" />
    </n-layout-sider>
    <n-layout content-style="padding: 1rem 1.5rem">
      <n-space class="-mb-3" justify="space-between" align="center">
        <div>
          <mobile-menu v-if="!store.isLarge" :logout="logout" />
        </div>
        <div>
          <feedback-modal />
          <!-- <n-button quaternary>
            <Icon icon="mi:notification" class="pr-2"/>
            Notifications
          </n-button> -->
          <contact-modal />
          <theme-switcher />
        </div>
      </n-space>
      <n-divider />
      <main class="mb-10">
        <router-view />
      </main>
    </n-layout>
  </n-layout>
</template>

<script setup>
import { ref, h, onMounted, onBeforeUnmount } from 'vue';
import { useAuth0 } from '@auth0/auth0-vue';
import { Icon } from '@iconify/vue';
import { RouterLink } from 'vue-router';
import { 
  NLayout, 
  NDivider, 
  NLayoutSider,
  NSpace, 
  NMenu, 
  NText,
} from 'naive-ui';
import FeedbackModal from '@/components/FeedbackModal.vue';
import ContactModal from '@/components/ContactModal.vue';
import ThemeSwitcher from '@/components/ThemeSwitcher.vue';
import MobileMenu from '@/components/MobileMenu.vue';

import useUserStore from '@/store/user';
const store = useUserStore();

const { logout } = useAuth0();

const checkWindowSize = () => {
  store.isLarge = window.innerWidth > 1024;
  const scaleFactor = store.isLarge ? 1 : Math.min(window.innerWidth / 322 * 0.85, 1.5);
  document.documentElement.style.setProperty('--event-scale-factor', scaleFactor);
};

onMounted(() => {
  window.addEventListener('resize', checkWindowSize);
  checkWindowSize(); 
});

onBeforeUnmount(() => {
  window.removeEventListener('resize', checkWindowSize);
});

const getHeaderOption = () => {
  return {
    label: () => h(
      NText,
      { class: 'flex justify-center py-3', type: 'primary' },
      {
        default: () => [
          h(Icon, { icon: 'spendwise', class: 'text-2xl mr-3' }),
          h('span', { class: 'text-base my-auto font-bold' }, 'SpendWise')
        ]
      }
    ),
    key: 'header',
  }
};

const getDividerOption = () => {
  return {
    key: 'divider',
    type: 'divider',
    props: {
      style: { margin: '2rem' }
    }
  }
};

const getOption = (key, disabled=false) => {
  const link = key === 'net worth' ? 'net-worth' : key;
  return {
    label: () => h(
      RouterLink, 
      { 
        to: `/${link}`, 
        class: 'capitalize font-semibold'
      }, 
      { default: () => key }
    ),
    active: () => router.currentRoute.value.path === `/${link}`,
    key,
    disabled
  };
};


const getLogOut = () => {
  return {
    label: () => h(
      'a',
      { onClick: () => logout({ returnTo: window.location.origin }) },
      { default: () => "Logout" }
    ),
    key: "logout"
  }
};

const menuNavOptions = [
  getHeaderOption(),
  getDividerOption(),
  getOption("overview"),
  getOption("accounts"),
  getOption("transactions"),
  getOption("events"),
  getOption("budgets", true),
  getOption("categories"),
  getOption("net worth"),
  getDividerOption(),
  getOption("settings", true),
  getOption("contact"),
  getDividerOption(),
  getOption("profile", true),
  getLogOut(),
];

</script>