<template>
  <section id="hero">
    <div class="container gap-10 flex-wrap">
      <div class="">
        <h1 class="font-extrabold text-primary text-4xl">
          Managing money, <br>made simple.
        </h1>
        <n-button type="primary">
          Sign up for free
        </n-button>
        <h2>
          Spendwise is a free, easy-to-use tool to help you manage your money.
        </h2>
      </div>
      <img src="@/assets/laptop.png" alt="laptop" class=" w-96 opacity-80" />
    </div>
  </section>
  <p class="bg-primary text-white font-extrabold text-center text-lg p-2 mt-0">
    Learn why Spendwise is the best way to manage your money.
  </p>
</template>

<script setup>
import { NButton } from 'naive-ui';
</script>

<style scoped>
section {
  @apply p-14 flex items-center justify-center px-4 bg-cover bg-center bg-no-repeat;
  background-image: linear-gradient(to right, rgba(225, 225, 225, 0.95), rgba(185, 227, 205, 0.95), rgba(225, 225, 225, 0.95)), url('bg.svg');
}

.container {
  @apply flex max-w-6xl w-full;
}
</style>
