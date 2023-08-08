<template>
  <n-button @click="createMessage">
    Last for 5 second
  </n-button>
</template>

<script setup>
import { useMessage } from "naive-ui";

const message = useMessage();
const createMessage = () => {
  message.success(
    "I don't know why nobody told you how to unfold your love",
    { duration: 5e3 }
  );
}
</script>