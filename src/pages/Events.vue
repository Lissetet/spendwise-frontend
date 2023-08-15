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
import { useAuth0 } from '@auth0/auth0-vue';
import { ref, h, onMounted } from "vue";
import { Icon } from '@iconify/vue';
import { NCalendar, NTag, NDropdown, NButton, NInput, NSelect, NDatePicker } from "naive-ui";
import { addDays } from 'date-fns/esm'
import axios from 'axios';

const baseURL = import.meta.env.VITE_BASE_URL;
const { user } = useAuth0();

const dateValue = ref(null)
const tagValue = ref(null)
const typeValue = ref(null)
const dates = ref([]);
const userId = user._rawValue.sub;

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
    console.log(dates.value[index])
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
  const newSingleDate = {
    ...dateObj,
    tag: tagValue.value,
    type: typeValue.value,
    user: userId,
  }
  axios.post(`${baseURL}/events`, newSingleDate)
    .then((res) => {
      dates.value.push(res.data);
    })
    .catch((err) => {
      console.log(err);
    });
};

const getAllEvents = () => {
  axios.get(`${baseURL}/events?user=${userId}`)
    .then((res) => {
      dates.value = res.data;
    })
    .catch((err) => {
      console.log(err);
    });
};

onMounted(getAllEvents);
const value = ref(addDays(Date.now(), 0).valueOf());
</script>
