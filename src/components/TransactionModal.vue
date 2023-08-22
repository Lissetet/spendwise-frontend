<template>
  <n-modal v-model:show="showTransactionModal">
    <n-card
      :title="title"
      :bordered="false"
      size="large"
      role="dialog"
      aria-modal="true"
      class=" w-11/12 max-w-xl"
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
          size="medium"
          label-width="auto"
        >
          <n-form-item label="Date" path="date">
            <n-date-picker v-model:value="model.date" type="date" />
          </n-form-item>
          <n-form-item label="Amount" path="amount" placeholder="Amount">
            <n-input-number v-model:value="model.amount" :precision="2" clearable>
              <template #prefix>$</template>
            </n-input-number>
          </n-form-item>
          <n-form-item label="Description" path="description">
            <n-input v-model:value="model.description" placeholder="Description" />
          </n-form-item>
          <n-form-item label="Account" path="account">
            <n-select
              v-model:value="model.account"
              placeholder="Select Acccount"
              :options="accountOptions"
              filterable
            />
          </n-form-item>
          <n-form-item label="Type" path="type">
            <n-select
              v-model:value="model.type"
              placeholder="Select Transaction Type"
              :options="typeOptions"
            />
          </n-form-item>
          <n-form-item label="Category" path="category">
            <n-select
              v-model:value="model.category"
              placeholder="Select Category"
              :options="categoryOptions"
              filterable
            />
          </n-form-item>
          <div class="flex justify-end gap-4">
            <n-button @click="showTransactionModal = false">
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
import { ref, onMounted } from "vue";
import { 
  NButton, 
  NModal, 
  NCard, 
  NForm, 
  NFormItem, 
  NSelect, 
  NDatePicker, 
  NInput, 
  NInputNumber, 
  useMessage 
} from 'naive-ui';
import { Icon } from '@iconify/vue';
import useUserStore from '@/store/user';

const store = useUserStore();
const message = useMessage();
const showTransactionModal = ref(false);
const title = ref(null);
const editing = ref(null);
const formRef = ref(null);
const emptyData = {
  key: null,
  description: null,
  type: null,
  category: null,
  date: null,
  amount: null,
  account: null
};
const model = ref(null);
const emit = defineEmits(['handle-save']);

const openModal = (transaction) => {
  editing.value = !!transaction;
  if (transaction) {
    title.value = 'Edit Transaction';
    model.value = {
      _id: transaction._id,
      description: transaction.description,
      type: transaction.type,
      category: transaction.category,
      date: new Date(transaction.date).getTime(),
      amount: transaction.amount,
      account: transaction.account
    };
  } else {
    title.value = 'Add Transaction';
    model.value = {...emptyData};
  }
  showTransactionModal.value = true;
};

const closeModal = () => {
  showTransactionModal.value = false;
}

const getTypeOptions = (options) => {
  return options.map((v) => {
    return {
      label: v,
      value: v.toLowerCase()
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

const typeOptions = getTypeOptions(["Income", "Expense", "Adjustment", "Transfer"]);
const accountOptions = ref([]);
const categoryOptions = ref([]);

const getRuleObject = (message, required=true, trigger=['blur', 'input']) => {
  return { required, trigger, message };
};

const rules = {
  description: getRuleObject("Please input description"),
  type: getRuleObject("Please select type", false),
  account: getRuleObject("Please select account"),
  category: getRuleObject("Please select category", false),
  date: {
    ...getRuleObject("Please input date"),
    type: "number",
  },
  amount: {
    ...getRuleObject("Please input valid amount"),
    type: "number",
  },
};

const handleValidateButtonClick = (e) => {
  e.preventDefault();
  formRef.value?.validate((errors) => {
    const transaction = {
      date: new Date(model.value.date),
      description: model.value.description,
      account: model.value.account,
      amount: model.value.amount,
    };  
    model.value.type === 'expense' && (transaction.amount = -model.value.amount);
    model.value.type && (transaction.type = model.value.type);
    model.value.category && (transaction.category = model.value.category);
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

onMounted(() => {
  categoryOptions.value = getCatergoryOptions(store.sortedCategories);
  accountOptions.value = getAccountOptions(store.accounts);
});

defineExpose({ openModal, closeModal });
</script>