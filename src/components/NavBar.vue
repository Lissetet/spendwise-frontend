<template>
  <header class="flex max-w-6xl mx-auto p-3 gap-20 justify-between">
    <div class="flex">
      <Icon icon="spendwise" class="text-2xl mr-4"/>
      <span class="text-base mt-1 font-bold">SpendWise</span>
    </div>
    <n-space justify="space-around">
    </n-space>
    <n-button @click="login" type="primary">Log in</n-button>
  </header>
</template>

<script setup>
import { useAuth0 } from '@auth0/auth0-vue';
import { Icon } from '@iconify/vue';
import { NSpace, NButton } from 'naive-ui';
const { isAuthenticated, isLoading, user, loginWithRedirect, logout } = useAuth0();

const login = () => {
  loginWithRedirect();
};
</script>