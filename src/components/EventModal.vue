<template>
  <n-modal v-model:show="showEventModal">
    <n-card
      style="width: 600px"
      :title="title"
      :bordered="false"
      size="large"
      role="dialog"
      aria-modal="true"
    >
      <template #header-extra>
        <n-button text @click="showEventModal = false">
          <Icon icon="material-symbols:close-rounded" class="text-lg" />
        </n-button>
      </template>
      <n-input-group class="mb-8">
        <n-date-picker v-model:value="model.date" type="date" class="w-80"/>
        <n-input v-model:value="model.tag" type="text" placeholder="Event Name" />
        <n-select 
          v-model:value="model.type" 
          :options="typeOptions" 
          :render-tag="renderTag" 
          class="w-64"
        />
      </n-input-group>
      <n-input-group class="mx-auto">
        <n-button type="primary" @click="onSave">Save</n-button>
        <n-button @click="handleCancel">Cancel</n-button>
      </n-input-group>
    </n-card>
  </n-modal>
</template>

<script setup>
import { ref, h } from "vue";
import { 
  NButton, 
  NModal, 
  NCard,
  NInputGroup, 
  NDatePicker, 
  NSelect, 
  NInput, 
  NTag 
} from 'naive-ui';
import { Icon } from '@iconify/vue';

const emit = defineEmits(['handle-save']);

const showEventModal = ref(false);
const title = ref(null);
const editingId = ref(null);

const model = ref({
  date: null,
  tag: null,
  type: null,
})

const openModal = event => {
  title.value = event ? 'Edit Event' : 'Add New Event';
  if (event) {
    editingId.value = event.id;
    model.value.date = event.date;
    model.value.tag = event.tag;
    model.value.type = event.type;
  } else {
    clearInputs();
  }
  showEventModal.value = true;
};

const closeModal = () => {
  showEventModal.value = false;
};

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

const clearInputs = () => {
  editingId.value = null;
  model.value.date = null;
  model.value.tag = null;
  model.value.type = null;
};

const handleCancel = () => {
  clearInputs();
  closeModal();
};

const onSave = () => {
  const { date, tag, type } = model.value;
  const event = {
    date,
    tag,
    type,
    _id: editingId.value
  };
  emit("handle-save", event, !!editingId.value);
};

defineExpose({ openModal, closeModal });
</script>