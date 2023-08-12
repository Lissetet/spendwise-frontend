

<template>
  <n-config-provider :theme="themePreference" :themeOverrides="themeOverrides">
    <n-message-provider placement="bottom-right">
      <n-dialog-provider>
        <div v-if="!isLoading && !isAuthenticated">
          <nav-bar />
          <hero-intro />
        </div>
        <div v-else>
          <content />
        </div>
      </n-dialog-provider>
    </n-message-provider>
  </n-config-provider>
</template>


<script setup>
import { ref, provide } from 'vue';
import { useAuth0 } from '@auth0/auth0-vue';
import { useRouter } from 'vue-router';  // import the useRouter hook
import NavBar from '@/components/NavBar.vue';
import HeroIntro from '@/components/HeroIntro.vue';
import Content from '@/components/Content.vue';
import { darkTheme, lightTheme, NConfigProvider, NMessageProvider, NDialogProvider } from 'naive-ui'

const { isAuthenticated, isLoading, user, loginWithRedirect, logout } = useAuth0();
const router = useRouter();  // get the router instance

const login = () => {
  loginWithRedirect();
};

const doLogout = () => {
  logout({ returnTo: window.location.origin });
};

const themeOverrides = {
  common: {
    // primaryColor: '#FF0000';
    invertedColor: '#fafafc',
  },
}

const isDarkTheme = ref(window.matchMedia("(prefers-color-scheme: dark)").matches);
const themePreference = ref(isDarkTheme.value ? darkTheme : lightTheme);

// Listen for changes
window.matchMedia("(prefers-color-scheme: dark)").addEventListener('change', e => {
  isDarkTheme.value = e.matches;
  themePreference.value = e.matches ? darkTheme : lightTheme;
});

provide('isDarkTheme', isDarkTheme);
</script>