

<template>
  <n-config-provider :theme="store.themePreference" :themeOverrides="themeOverrides">
    <n-message-provider placement="bottom-right">
      <n-dialog-provider>
        <div v-if="!isLoading && !isAuthenticated">
          <nav-bar :login="login" />
          <hero-intro :signUp="signUp" />
        </div>
        <div v-else>
          <content :logout="logout" />
        </div>
      </n-dialog-provider>
    </n-message-provider>
  </n-config-provider>
</template>


<script setup>
import { ref, watchEffect, watch } from 'vue';
import { addIcon } from '@iconify/vue';
import { useAuth0 } from '@auth0/auth0-vue';
import useUserStore from '@/store/user';
import NavBar from '@/components/NavBar.vue';
import HeroIntro from '@/components/HeroIntro.vue';
import Content from '@/components/Content.vue';
import { 
  darkTheme, 
  lightTheme, 
  NConfigProvider, 
  NMessageProvider, 
  NDialogProvider 
} from 'naive-ui'

const {
  isAuthenticated, 
  isLoading, 
  user, 
  logout, 
  loginWithRedirect 
} = useAuth0();
const store = useUserStore();

const login = () => {
  loginWithRedirect({
    appState: {
      target: '/overview',
    },
  });
};

const signUp = () => {
  loginWithRedirect({
    screen_hint: 'signup',
    appState: {
      target: '/overview',
    },
  });
};

watchEffect(() => {
  if (user) {
    store.setUser(user.value);
  }
})

watch(
  () => store.$state,
  (newState) => {
    localStorage.setItem('userStore', JSON.stringify(newState));
  },
  { deep: true }
);

addIcon('spendwise', {
   body: '<path fill="currentColor" d="M126 303.1c-2.9-1-6.1-.2-8.3 2l-64 64c-2.9 3-6.5 5.4-10.2 6.9-3 1.3-4.9 4.2-4.9 7.4v67.3c0 14.4 11.7 26.1 26.1 26.1h40.8c14.4 0 26.1-11.7 26.1-26.1V313.3c0-1.2-.1-2.5-.3-3.6-.3-3-2.4-5.6-5.3-6.6"/><path fill="currentColor" d="M495.3 95.3c-3.4-3.5-8.2-5.2-14.3-5.2L397 94c-4.7.2-13.3.6-17.7 10.2-4.9 10.3 1.9 17.2 4.8 20.1l7.1 7.2c4.2 4.2 8.3 8.4 12.5 12.4L241.2 306.5 144 209.1c-4.9-4.9-11.5-7.6-18.5-7.6s-13.4 2.7-18.5 7.6L7.6 308.5c-4.9 5-7.6 11.6-7.6 18.6 0 7 2.7 13.6 7.6 18.5l4.5 4.5c4.9 4.9 11.5 7.6 18.5 7.6s13.4-2.7 18.5-7.6l76.3-76.4 97.3 97.4c4.9 4.9 11.5 7.6 18.5 7.6s13.4-2.7 18.5-7.6l185.5-185.7 19.4 19.3c2.7 2.7 6.7 6.8 13.2 6.8 2.6 0 5.2-.7 7.9-2.1 9.9-5.4 10.4-15.4 10.5-18.7 1.2-26.3 2.4-52.4 3.7-78.7l.1-1.8c.2-6.4-1.4-11.4-4.7-14.9"/><defs><path id="SVGID_1_" d="M182.7 26.9h120v215.4h-120z"/></defs><clipPath id="SVGID_00000160907718109543904960000018180868116663163534_"><use xlink:href="#SVGID_1_" style="overflow:visible"/></clipPath><path fill="currentColor" d="M193.2 210.4c7.6 3.6 16.1 6.1 26.8 7.8h.2v9.6c0 8.4 5.6 14.2 13.9 14.4 2.4.1 4.7.1 7.1.1 2.4 0 4.7 0 7.2-.1 8.1-.2 13.6-5.8 13.6-14V224c0-2.9.1-5.8 0-8.8 11.4-3.2 20.9-9.3 28.2-18.1 9.7-11.7 13.6-27 10.7-41.8-2.9-15.5-12.8-29-27.2-36.9-7.7-4.3-15.7-7.5-23.4-10.7l-1.8-.7c-3.4-1.4-7.8-3.4-11.4-6.4-1.5-1.2-2.3-2.5-2.1-3.7.1-1.3 1.3-2.4 3.1-3.2 1.3-.6 3-.9 5.5-1.1 9.5-.5 18.2 1.2 26.8 5.2 2.1 1 6.9 3.4 11.9 1.3 5-2.1 6.7-7.2 7.5-9.6l3.6-12 1.2-4.3c2.3-7.4-1-14.2-8.1-17.3-7.1-3.2-14.3-5.3-21.4-6.3-.7-.1-1.4-.2-2-.3v-2c-.1-16.9-3.8-20.5-20.6-20.5h-5.7c-10.2.4-14.6 4.8-14.7 14.8-.1 2-.1 3.8-.1 5.7l.1 2.6v2c-.7.2-1.4.5-2.3.8-22.1 8-34.4 23.9-35.8 45.8-1.2 18.9 7.7 34.2 26.3 45.3 6.7 4 13.7 6.8 20.5 9.5 2.8 1.2 5.6 2.3 8.5 3.5 3.5 1.5 6.1 3.1 8.3 4.8 2.1 1.7 3.2 3.9 2.8 6-.3 2-1.8 3.8-4.3 4.9-4.1 1.8-8.7 2.4-13.8 1.8-9.5-1.2-17.5-3.6-24.6-7.4-2.3-1.2-7.1-3.8-12.2-1.6-5.2 2.1-6.7 7.5-7.5 9.9-1.5 4.8-2.8 9.6-4.1 14.5-2.7 10.5-.3 16 9.3 20.7" style="clip-path:url(#SVGID_00000160907718109543904960000018180868116663163534_)"/><defs><path id="SVGID_00000169541027384881384640000009791073323511957649_" d="M144.1 330.8h94.4v146h-94.4z"/></defs><clipPath id="SVGID_00000181777818016129952270000001492604517749493923_"><use xlink:href="#SVGID_00000169541027384881384640000009791073323511957649_" style="overflow:visible"/></clipPath><path fill="currentColor" d="M231.9 398.4c-5.2-1.5-10.1-4.4-14.1-8.4L161 333.2c-1.8-1.7-4.3-2.6-6.7-2.3-2.5.3-4.7 1.8-6 3.9-2.3 4-3.6 8.6-3.6 13.2v102.6c0 14.4 11.7 26.2 26.1 26.2h40.7c14.4 0 26.1-11.8 26.1-26.2v-44.4c.2-3.6-2.2-6.8-5.7-7.8" style="clip-path:url(#SVGID_00000181777818016129952270000001492604517749493923_)"/><g><defs><path id="SVGID_00000079476416154626368890000013039577995087286975_" d="M250.7 328.8H344v150.1h-93.3z"/></defs><clipPath id="SVGID_00000087377870201292846980000002483699780096014731_"><use xlink:href="#SVGID_00000079476416154626368890000013039577995087286975_" style="overflow:visible"/></clipPath><path fill="currentColor" d="m324.9 331.7-60.4 60.4c-2.6 2.6-5.7 4.7-9 6.3-2.8 1.4-4.6 4.2-4.6 7.3v46.9c0 14.4 11.7 26.2 26.1 26.2h40.7c14.4 0 26.1-11.8 26.1-26.2V350.1c0-7-2.7-13.6-7.6-18.4-3.1-3.2-8.1-3.2-11.3 0" style="clip-path:url(#SVGID_00000087377870201292846980000002483699780096014731_)"/></g><path fill="currentColor" d="M444.3 216.6c-2.9-1-6.2-.3-8.3 2l-65.6 65.6-11.1 11.1c-1.5 1.5-2.4 3.6-2.4 5.7v149.7c0 14.4 11.7 26.2 26.1 26.2h40.7c14.4 0 26.1-11.7 26.1-26.2v-224c0-1.1-.1-2.3-.2-3.4-.3-3.2-2.4-5.7-5.3-6.7"/>',
   width: 500,
   height: 475,
});

const themeOverrides = {
  common: {
    invertedColor: '#fafafc',
  },
}

store.setIsDark(window.matchMedia("(prefers-color-scheme: dark)").matches);
store.setThemePreference(store.isDark ? darkTheme : lightTheme);

window.matchMedia("(prefers-color-scheme: dark)").addEventListener('change', e => {
  store.setIsDark(e.matches)
  store.setThemePreference(store.isDark ? darkTheme : lightTheme);
});
</script>