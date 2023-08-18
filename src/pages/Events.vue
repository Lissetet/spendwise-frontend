<template>
  <h1>Events</h1>
  <n-button @click="()=>openEventModal('Add New Event')" class="mb-10" type="primary">
    Add New Event
  </n-button>
  <n-card class="mb-10">
    <event-calendar ref="calendar"/>
  </n-card>
</template>

`<script setup>
import { ref } from "vue";
import { NButton, NCard } from "naive-ui";
import EventCalendar from "@/components/EventCalendar.vue";

const calendar = ref(null);

const openEventModal = (title, event) => {
  calendar.value.openEventModal(title, event)
};
</script>
