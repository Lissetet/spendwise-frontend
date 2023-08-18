<template>
  <n-button @click="openMultipleModal" :disabled="disabled">
    <Icon icon="material-symbols:edit" class="pr-2" />
    Edit Multiple
  </n-button>
  <n-modal v-model:show="showEditMultiple">
    <n-card
      style="width: 600px"
      title="Edit Multiple Transactions"
      :bordered="false"
      size="large"
      role="dialog"
      aria-modal="true"
    >
      <template #header-extra>
        <n-button text @click="showEditMultiple = false">
          <Icon icon="material-symbols:close-rounded" class="text-lg" />
        </n-button>
      </template>
        <n-form
          ref="formRef"
          :model="model"
          :rules="rules"
          label-placement="left"
          require-mark-placement="right-hanging"
          size="medium"
          label-width="auto"
          :style="{
            maxWidth: '640px'
          }"
        >
          <n-form-item label="Date" path="dateValue">
            <n-date-picker v-model:value="model.dateValue" type="date" />
          </n-form-item>
          <n-form-item label="Description" path="descriptionValue">
            <n-input v-model:value="model.descriptionValue" placeholder="Description" />
          </n-form-item>
          <n-form-item label="Account" path="accountValue">
            <n-select
              v-model:value="model.accountValue"
              placeholder="Select Acccount"
              :options="accountOptions"
            />
          </n-form-item>
          <n-form-item label="Type" path="typeValue">
            <n-select
              v-model:value="model.typeValue"
              placeholder="Select Transaction Type"
              :options="typeOptions"
            />
          </n-form-item>
          <n-form-item label="Category" path="categoryValue">
            <n-select
              v-model:value="model.categoryValue"
              placeholder="Select Category"
              :options="categoryOptions"
            />
          </n-form-item>
          <div style="display: flex; justify-content: flex-end">
            <n-button style="margin-right: 8px" @click="showEditMultiple = false">
              Cancel
            </n-button>
            <n-button type="primary" @click="handleValidateButtonClick">
              Save
            </n-button>
          </div>
        </n-form>
    </n-card>
  </n-modal>
</template>

<script setup>
import { ref, defineProps } from "vue";
import { NButton, NModal, NCard, NForm, NFormItem, NSelect, NDatePicker, NInput, useMessage } from 'naive-ui';
import { Icon } from '@iconify/vue';

const emit = defineEmits(['handle-edit-multiple']);
const props = defineProps({
  disabled: Boolean,
})
const message = useMessage();
const showEditMultiple = ref(false);
const formRef = ref(null);

const model = ref({});

const setEmptyModel = () => {
  model.value = {
    descriptionValue: null,
    typeValue: null,
    categoryValue: null,
    dateValue: null,
    accountValue: null
  };
};

setEmptyModel();

const openMultipleModal = () => {
  setEmptyModel();
  showEditMultiple.value = true;
};

const getTypeOptions = (options) => {
  return options.map((v) => {
    const capitalized = v.split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
    return {
      label: capitalized,
      value: v
    };
  });
};

const getCatergoryOptions = (options) => {
  return options.map((v) => {
    return {
      label: v.name,
      value: v.alias,
      style: v.parent === 'root' ? {} : { paddingLeft: '1.5rem'},
      class: v.parent === 'root' ? 'font-extrabold' : ''
    };
  });
};

const getAccountOptions = (options) => {
  return options.map((v) => {
    return {
      label: v.name,
      value: v._id
    };
  });
};

const setCategoryOptions = (options) => {
  categoryOptions.value = getCatergoryOptions(options);
};

const setAccountOptions = (options) => {
  accountOptions.value = getAccountOptions(options);
};

const typeOptions = getTypeOptions(["income", "expense", "adjustment", "transfer"]);
const accountOptions = ref([]);
const categoryOptions = ref([]);

const getRuleObject = (message) => {
  return {
    required: false,
    trigger: ["blur", "input"],
    message
  };
};

const rules = {
  descriptionValue: getRuleObject("Please input description"),
  typeValue: getRuleObject("Please select type"),
  accountValue: getRuleObject("Please select account"),
  categoryValue: getRuleObject("Please select category"),
  dateValue: {
    ...getRuleObject("Please input date"),
    type: "number",
  },
};

const handleValidateButtonClick = (e) => {
  e.preventDefault();
  formRef.value?.validate((errors) => {
    if (!errors) {
      emit('handle-edit-multiple', {
        date: model.value.dateValue ? new Date(model.value.dateValue) : null,
        description: model.value.descriptionValue,
        category: model.value.categoryValue, 
        type: model.value.typeValue,
        account: model.value.accountValue,
      });
      setEmptyModel();
    } 
    else {
      message.error('Unknow error, please try again.');
      console.log(errors);
    }
  });

  showEditMultiple.value = false;
};

defineExpose({ setCategoryOptions, setAccountOptions });
</script>