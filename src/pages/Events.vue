<template>
  <h1>Events</h1>
  <n-calendar class="mb-10">
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
          </div>
        </template>
      </div>
    </template>
  </n-calendar>
  <n-button @click="handleAdd" v-if="!showForm" class="mb-10" type="primary">
    Add New Event
  </n-button>
  <n-card class="flex mb-8 max-w-2xl" v-if="showForm">
    <h2 class="text-base font-semibold mt-0">{{ title }}</h2>
    <n-input-group>
      <n-date-picker v-model:value="dateValue" type="date" class="w-80"/>
      <n-input v-model:value="tagValue" type="text" placeholder="Event Name" />
      <n-select v-model:value="typeValue" :options="typeOptions" :render-tag="renderTag" class="w-64" placeholder="Type"/>
      <n-button type="primary" @click="handleSave">Save</n-button>
      <n-button @click="handleCancel">Cancel</n-button>
    </n-input-group>
  </n-card>
</template>
`<script setup>
import { useAuth0 } from '@auth0/auth0-vue';
import { ref, h, onMounted } from "vue";
import { Icon } from '@iconify/vue';
import { NCalendar, NTag, NDropdown, NButton, NInput, NSelect, NDatePicker, useMessage, NCard, NInputGroup } from "naive-ui";
import { addDays } from 'date-fns/esm'
import axios from 'axios';

const baseURL = import.meta.env.VITE_BASE_URL;
const { user } = useAuth0();

const dateValue = ref(null)
const tagValue = ref(null)
const typeValue = ref(null)
const editingId = ref(null);
const title = ref("Add New Event");
const showForm = ref(false);
const dates = ref([]);
const userId = user._rawValue.sub;
const message = useMessage();

const clearInputs = () => {
  editingId.value = null;
  dateValue.value = null;
  tagValue.value = null;
  typeValue.value = null;
};

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

const handleAdd = () => {
  clearInputs();
  title.value = "Add New Event";
  showForm.value = true;
};

const handleEdit = (id) => {
  const index = dates.value.findIndex((item) => item._id === id);
  const { year, month, day, tag, type } = dates.value[index];
  dateValue.value = new Date(year, month - 1, day);
  tagValue.value = tag;
  typeValue.value = type;
  editingId.value = id;
  title.value = "Edit Event";
  showForm.value = true;
};

const handleDropdownSelection = (key, id) => {
  const index = dates.value.findIndex((item) => item._id === id);
  if (key === "delete") {
    handleDelete(id);
  } else {
    handleEdit(id);
  }
};

const getYearMonthDate = (date) => {
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const day = date.getDate();
  return { year, month, day };
};

const addNewDate = (dateObj) => {
  axios.post(`${baseURL}/events`, dateObj)
    .then((res) => {
      dates.value.push(res.data);
      message.success(
        `${res.data.tag} added successfully!`,
        { duration: 5e3 }
      );
      handleCancel();
    })
    .catch((err) => {
      console.log(err);
    });
};

const editDate = (editedDateObj) => {
  const index = dates.value.findIndex((item) => item._id === editingId.value);
  axios.patch(`${baseURL}/events/${editingId.value}`, editedDateObj)
    .then((res) => {
      dates.value[index] = res.data;
      message.success(
        `${res.data.tag} updated successfully!`,
        { duration: 5e3 }
      );
      handleCancel();
    })
    .catch((err) => {
      console.log(err);
    });
};

const handleSave = () => {
  const dateObj = getYearMonthDate(new Date(dateValue.value));
  const editedDateObj = {
    ...dateObj,
    tag: tagValue.value,
    type: typeValue.value,
  }
  if (title.value === "Add New Event") {
    addNewDate({...editedDateObj, user: userId});
  } else {
    editDate(editedDateObj);
  }
  
};

const handleDelete = (id) => {
  axios.delete(`${baseURL}/events/${id}`)
    .then((res) => {
      const index = dates.value.findIndex((item) => item._id === id);
      message.success(
        `${dates.value[index].tag} deleted successfully!`,
        { duration: 5e3 }
      );
      dates.value.splice(index, 1);
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

const handleCancel = () => {
  clearInputs();
  showForm.value = false;
};

onMounted(getAllEvents);
const value = ref(addDays(Date.now(), 0).valueOf());
</script>
