<template>
  <h1>Events</h1>
  <n-date-picker v-model:value="dateValue" type="date" />
  <div class="flex">
    <n-input v-model:value="tagValue" type="text" placeholder="Event Name" />
    <n-select v-model:value="typeValue" :options="typeOptions" :render-tag="renderTag" class="w-40"/>
  </div>
  <n-button
    type="primary"
    @click="addSingleDate"
  >Add Date</n-button>

  <n-calendar
  >
    <template #default="{ year, month, date }">
      <div class="flex flex-col gap-1">
        <template v-for="item in dates">
          <div 
            :key="item._id"
            class="flex gap-2" 
            v-if="year === item.year && month === item.month && date === item.day"
          >
            <n-tag :type="item.type">{{ item.tag }}</n-tag>
            <n-dropdown :options="dropDownOptions.map(option => ({ ...option, id: item._id }))" @select="(key) => handleDropdownSelection(key, item._id)">
              <n-button text>
                <Icon icon="material-symbols:settings" />
              </n-button>
            </n-dropdown>

            <!-- <n-dropdown :options="dropDownOptions.map(option => ({ ...option, id: item._id }))" @select="handleDropdownSelection"> -->

            <!-- <n-dropdown trigger="hover" :options="dropDownOptions" @select="handleDropdownSelection"> -->
          </div>
        </template>
      </div>
    </template>
  </n-calendar>
</template>
`<script setup>
import { ref, h } from "vue";
import { Icon } from '@iconify/vue';
import { NCalendar, NTag, NDropdown, NButton, NInput, NSelect, NDatePicker } from "naive-ui";
import { addDays } from 'date-fns/esm'

const dateValue = ref(null)
const tagValue = ref(null)
const typeValue = ref(null)
const dateIndex = ref(0)
const dates = ref([]);

const renderIcon = icon => () => h(Icon, { icon });
const renderTag = ({ option }) => {
  return h(
    NTag,
    {
      type: option.value,
    },
    { default: () => option.label }
  );
};
const getOption = (value, label) => ({ value, label });

const typeOptions = [
  getOption("success", "Income"),
  getOption("error", "Expense"),
  getOption("default", "Other"),
];

const dropDownOptions = [
  {
    label: "Edit",
    icon: renderIcon("material-symbols:edit"),
    key: "edit",
  },
  {
    label: "Delete",
    icon: renderIcon("material-symbols:delete"),
    key: "delete",
  },
];
const handleDropdownSelection = (key, id) => {
  const index = dates.value.findIndex((item) => item._id === id);

  if (key === "delete") {
    dates.value.splice(index, 1);
  } else {
   dates.value[index] = {
    ...dates.value[index],
    tag: "New Tag",
   }
  }
};

const getYearMonthDate = (date) => {
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const day = date.getDate();
  return { year, month, day };
};

const addSingleDate = () => {
  const dateObj = getYearMonthDate(new Date(dateValue.value));
  dates.value.push({
    ...dateObj,
    _id: dateIndex.value++,
    tag: tagValue.value,
    type: typeValue.value,
  })
};

const value = ref(addDays(Date.now(), 0).valueOf());
</script>
