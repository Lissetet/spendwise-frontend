<template>
  <section :style="bgStyle">
    <div class="container gap-10 flex-wrap">
      <div class="">
        <h1 class="font-extrabold text-4xl">
          <n-text type="primary">
            Managing money, <br>made simple.
          </n-text>
        </h1>
        <n-button strong type="primary" @click="signUp">
          Sign up for free
        </n-button>
        <n-h2 class="font-bold">
          Spendwise is a free, easy-to-use tool to help you manage your money.
        </n-h2>
      </div>
      <img src="@/assets/laptop.png" alt="laptop" class=" w-96 opacity-80" />
    </div>
  </section>
  <n-card type="primary"
    style="background-color: var(--n-color-target)"
    class="flex w-full h-20 text-center"
  >
    <n-text class="font-extrabold text-lg">
      Learn why Spendwise is the best way to manage your money.
    </n-text>
  </n-card>
</template>

<script setup>
import { computed } from 'vue';
import { NButton, NText, useOsTheme, NH2, NCard } from 'naive-ui';
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

const bgStyle = computed(() => {
  if (store.theme === 'system') {
    const osTheme = useOsTheme().value;
    return osTheme === 'dark' ? darkBgStyle : lightBgStyle;
  } else {
    return store.theme === 'dark' ? darkBgStyle : lightBgStyle;
  }
});
</script>

<style scoped>
section {
  @apply flex items-center justify-center px-4 bg-cover bg-center bg-no-repeat;
  height: calc(100vh - 10rem);
}

.container {
  @apply flex max-w-6xl w-full;
}
</style>
