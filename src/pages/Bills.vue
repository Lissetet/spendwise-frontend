<template>
  <h1>Calendar</h1>
  <n-input v-model:value="tagValue" type="text" placeholder="Event Name" />
  <n-date-picker v-model:value="dateValue" type="date" />
  <n-button
    type="primary"
    @click="addSingleDate(dateValue)"
  >Add Date</n-button>

  <n-calendar
  >
    <template #default="{ year, month, date }">
      <div class="flex flex-col gap-1">
        <template v-for="item in dates" >
          <n-tag
          v-if="year === item.year && month === item.month && date === item.day" >
            {{ item.tag }}
          </n-tag>
        </template>
      </div>
    </template>
  </n-calendar>
</template>
`<script setup>
import { ref } from "vue";
import { NCalendar, NTag } from "naive-ui";
import { addDays } from 'date-fns/esm'

const dateValue = ref(null)
const tagValue = ref(null)
const dates = ref([]);

const getYearMonthDate = (date) => {
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const day = date.getDate();
  return { year, month, day };
};

const addSingleDate = (timestamp) => {
  const dateObj = getYearMonthDate(new Date(timestamp));
  dates.value.push({
    ...dateObj,
    tag: tagValue.value,
  })
};

const value = ref(addDays(Date.now(), 0).valueOf());
</script>
