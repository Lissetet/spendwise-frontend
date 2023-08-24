<template>
  <h1>Profile</h1>
  {{ store.user }}
</template>

<script setup>
import useUserStore from '@/store/user';
const store = useUserStore();

</script>