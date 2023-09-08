<template>
  <h1>Events</h1>
  <n-card class="event-card mb-10 pb-5"  size="small">
    <n-button @click="()=>openEventModal()" class="my-5" type="primary">
      Add New Event
    </n-button>
    <event-calendar ref="calendar"/>
  </n-card>
</template>

`<script setup>
import { ref, onMounted } from "vue";
import { NButton, NCard } from "naive-ui";
import EventCalendar from "@/components/EventCalendar.vue";
import useUserStore from "@/store/user";

const store = useUserStore();
const calendar = ref(null);

const openEventModal = (event) => {
  calendar.value.openEventModal(event)
};

onMounted(() => {
  store.fetchEvents();
});
</script>

<style>
.event-card {
  transform: scale(var(--event-scale-factor));
  transform-origin: top;
  @apply w-fit lg:w-full justify-self-center mx-auto;
}
</style>
