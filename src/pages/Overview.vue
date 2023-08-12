<template>
  <h1>Welcome {{ user.name }}!</h1>

  {{ JSON.stringify(user, null, 2) }}
</template>

<script setup>
import { useAuth0 } from '@auth0/auth0-vue';

const { user } = useAuth0();

console.log(user._rawValue.sub);

</script>