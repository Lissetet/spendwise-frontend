<template>
  <n-button @click="showEditMultiple = true" :disabled="disabled">
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
import { ref, defineEmits, defineProps } from "vue";
import { NButton, NModal, NCard, NForm, NFormItem, NSelect, NDatePicker, NInput, useMessage } from 'naive-ui';
import { Icon } from '@iconify/vue';

const emit = defineEmits(['handle-edit-multiple']);
const props = defineProps({
  disabled: Boolean,
})
const message = useMessage();
const showEditMultiple = ref(false);
const editing = ref(false);
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

const getOptions = (options) => {
  return options.map((v) => {
    const capitalized = v.split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
    return {
      label: capitalized,
      value: v
    };
  });
};

const typeOptions = getOptions(["Income", "Expense", "Transfer"]);
const accountOptions = getOptions(["Cash", "Credit Card", "Bank Account"]);
const categoryOptions = getOptions([
  "Salary",
  "Bonuses",
  "Investments",
  "Business",
  "Rentals",
  "Royalties",
  "Pensions",
  "Interest",
  "Alimony",
  "Gifts",
  "Housing",
  "Utilities",
  "Groceries",
  "Dining",
  "Transport",
  "Vehicle",
  "Health",
  "Entertainment",
  "Clothing",
  "Education"
]);

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
</script>