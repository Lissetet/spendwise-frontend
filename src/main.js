import { createApp } from "vue";
import { createPinia } from 'pinia'
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate'
import { createAuth0 } from '@auth0/auth0-vue';
import { Icon } from '@iconify/vue';
import App from './App.vue'
import router from './router';
import './style.css'

const auth0 = createAuth0({
  domain: import.meta.env.VITE_AUTH0_DOMAIN,
  clientId: import.meta.env.VITE_AUTH0_CLIENT_ID,
  authorizationParams: { redirect_uri: `${window.location.origin}/overview` }
})
const pinia = createPinia();
pinia.use(piniaPluginPersistedstate);

createApp(App)
  .use(router)
  .use(pinia)
  .use(auth0)
  .component('icon', Icon)
  .mount("#app");