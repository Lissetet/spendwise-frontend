<template>
  <n-modal v-model:show="showTransactionModal">
    <n-card
      style="width: 600px"
      :title="title"
      :bordered="false"
      size="large"
      role="dialog"
      aria-modal="true"
    >
      <template #header-extra>
        <n-button text @click="showTransactionModal = false">
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
          <n-form-item label="Amount" path="amountValue" placeholder="Amount">
            <n-input-number v-model:value="model.amountValue" />
          </n-form-item>
          <n-form-item label="Description" path="descriptionValue">
            <n-input v-model:value="model.descriptionValue" placeholder="Description" />
          </n-form-item>
          <n-form-item label="Account" path="accountValue">
            <n-select
              v-model:value="model.accountValue"
              placeholder="Select Acccount"
              :options="accountOptions"
              filterable
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
              filterable
            />
          </n-form-item>
          <div style="display: flex; justify-content: flex-end">
            <n-button style="margin-right: 8px" @click="showTransactionModal = false">
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
import { ref } from "vue";
import { NButton, NModal, NCard, NForm, NFormItem, NSelect, NDatePicker, NInput, NInputNumber, useMessage } from 'naive-ui';
import { Icon } from '@iconify/vue';

const emit = defineEmits(['handle-save']);
const message = useMessage();
const showTransactionModal = ref(false);
const title = ref(null);
const editing = ref(false);
const formRef = ref(null);
const emptyData = {
  key: null,
  descriptionValue: null,
  typeValue: null,
  categoryValue: null,
  dateValue: null,
  amountValue: null,
  accountValue: null
};
const model = ref({...emptyData});

const openModal = (modalTitle, transaction) => {
  title.value = modalTitle;
  editing.value = !!transaction;
  if (transaction) {
    model.value = {
      _id: transaction._id,
      descriptionValue: transaction.description,
      typeValue: transaction.type,
      categoryValue: transaction.category,
      dateValue: new Date(transaction.date).getTime(),
      amountValue: transaction.amount,
      accountValue: transaction.account
    };
  } else {
    model.value = {...emptyData};
  }
  showTransactionModal.value = true;
};
const closeModal = () => {
  showTransactionModal.value = false;
}


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

const getRuleObject = (message, required=true) => {
  return {
    required,
    trigger: ["blur", "input"],
    message
  };
};

const rules = {
  descriptionValue: getRuleObject("Please input description"),
  typeValue: getRuleObject("Please select type", false),
  accountValue: getRuleObject("Please select account"),
  categoryValue: getRuleObject("Please select category", false),
  dateValue: {
    ...getRuleObject("Please input date"),
    type: "number",
  },
  amountValue: {
    ...getRuleObject("Please input valid amount"),
    type: "number",
  },
};

const handleValidateButtonClick = (e) => {
  e.preventDefault();
  formRef.value?.validate((errors) => {
    const transaction = {
      date: new Date(model.value.dateValue),
      description: model.value.descriptionValue,
      account: model.value.accountValue,
      amount: model.value.amountValue,
    };  
    model.value.typeValue === 'expense' && (transaction.amount = -model.value.amountValue);
    model.value.typeValue && (transaction.type = model.value.typeValue);
    model.value.categoryValue && (transaction.category = model.value.categoryValue);
    model.value._id && (transaction._id = model.value._id);

    if (!errors) {
      emit('handle-save', transaction, editing.value);
    } 
    else {
      message.error('Unknow error, please try again.');
      console.log(errors);
    }
  });
  closeModal();
};

defineExpose({ openModal, closeModal, setCategoryOptions, setAccountOptions });

</script>