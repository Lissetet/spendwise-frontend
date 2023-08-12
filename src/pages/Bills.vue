<template>
  <h1>Bills</h1>
  <n-calendar
    v-model:value="value"
    #="{ year, month, date }"
    :is-date-disabled="isDateDisabled"
    @update:value="handleUpdateValue"
  >
    {{ year }}-{{ month }}-{{ date }}
  </n-calendar>
</template>

<script setup>
import { ref } from "vue";
import { useMessage } from 'naive-ui'
import { isYesterday, addDays } from 'date-fns/esm'

const message = useMessage();

const value = ref(addDays(Date.now(), 1).valueOf());
const handleUpdateValue = (_, { year, month, date }) => {
  message.success(`${year}-${month}-${date}`);
};
const isDateDisabled = (timestamp) =>{
  if (isYesterday(timestamp)) {
    return true;
  }
  return false;
}
</script>
