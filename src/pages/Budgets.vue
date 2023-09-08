<template>
  <h1>Budgets</h1>
  <n-el class="date-picker-wrapper">
    <n-date-picker
      panel
      type="date"
      :is-date-disabled="dateDisabled"
      :actions="[]"
      v-model:value="dateValue"
      @update-value="handleSelect"
      style="border: 1px solid var(--divider-color);"
    />
    <div class="flex flex-col gap-4 my-4">
      <template v-for="event in events">
        <n-tag :bordered="false" :type="event.type" size="large" :style="{width: '290px'}">
          {{ event.tag }}
        </n-tag>
      </template>
    </div>
  </n-el>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { formatDate } from '@/utils';
import { NDatePicker, NTag, NEl } from 'naive-ui';
import useUserStore from '@/store/user';

const store = useUserStore();
const dateValue = ref(null);
const events = ref([]);

const getTimeStamp = ({ year, month, day }) => {
  return new Date(year, month - 1, day).getTime();
};

const dates = store.events.map((event) => {
  return getTimeStamp(event);
});

const datesMap = dates.reduce((acc, curr) => {
  acc[curr] = store.events.filter((event) => getTimeStamp(event) === curr);
  return acc;
}, {});

const dateDisabled = (ts) => {
   if(!dates.includes(ts)) {
    return {
      style: {
        color: 'red'
      }
    }
   } else {
      return false;
   }
};

onMounted(() => {
  const scaleFactor = Math.min(window.innerWidth / 290 * 0.8, 1.5);
  document.documentElement.style.setProperty('--scale-factor', scaleFactor);
});


const handleSelect = (date) => {
  events.value = datesMap[date];
};
</script>