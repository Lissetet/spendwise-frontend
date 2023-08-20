<template>
  <section :style="store.isDark ? darkBgStyle : lightBgStyle">
    <div class="container gap-10 flex-wrap">
      <div class="">
        <h1 class="font-extrabold text-4xl">
          <n-text type="primary">
            Managing money, <br>made simple.
          </n-text>
        </h1>
        <n-button type="primary" @click="signUp">
          Sign up for free
        </n-button>
        <h2>
          Spendwise is a free, easy-to-use tool to help you manage your money.
        </h2>
      </div>
      <img src="@/assets/laptop3.png" alt="laptop" class=" w-96 opacity-80" />
    </div>
  </section>
  <n-button type="primary" strong class="font-extrabold text-center text-lg p-10 mt-0 w-full">
    Learn why Spendwise is the best way to manage your money.
  </n-button>
</template>

<script setup>
import { NButton, NText } from 'naive-ui';
import useUserStore from '@/store/user';
const store = useUserStore();

const props = defineProps({
  signUp: {
    type: Function,
    required: true
  }
})

const darkBgStyle =  {
  backgroundImage: "linear-gradient(to right, rgba(0,0,0, 0.8), rgba(0,0,0, 0.8)), url('bg.svg')"
}
const lightBgStyle = {
  backgroundImage: "linear-gradient(to right, rgba(225, 225, 225, 0.95), rgba(185, 227, 205, 0.95), rgba(225, 225, 225, 0.95)), url('bg.svg')"
}
</script>

<style scoped>
section {
  @apply p-14 flex items-center justify-center px-4 bg-cover bg-center bg-no-repeat;
  height: 70vh;
}

.container {
  @apply flex max-w-6xl w-full;
}
</style>
