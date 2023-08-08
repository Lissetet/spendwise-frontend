<template>
  <n-button @click="showTransactionModal = true" type="primary">
    {{ title }}
  </n-button>
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
import { ref, defineEmits, defineProps } from "vue";
import { Icon } from '@iconify/vue';

const emit = defineEmits(['new-transaction']);
const props = defineProps(['title', 'transaction']);

const showTransactionModal = ref(false);
const formRef = ref(null);
const emptyData = {
  descriptionValue: null,
  typeValue: null,
  categoryValue: null,
  dateValue: null,
  amountValue: null,
  accountValue: null
};
const model = ref(props.transaction? props.transaction: emptyData);

const getOptions = (options) => {
  return options.map((v) => {
    const capitalized = v.split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
    return {
      label: capitalized,
      value: v
    };
  });
};

const typeOptions = getOptions(["income", "expense", "transfer"]);
const accountOptions = getOptions(["cash", "credit card", "bank account"]);
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

const rules = {
  descriptionValue: {
    required: true,
    trigger: ["blur", "input"],
    message: "Please input descriptionValue"
  },
  typeValue: {
    required: true,
    trigger: ["blur", "change"],
    message: "Please select typeValue"
  },
  accountValue: {
    required: true,
    trigger: ["blur", "change"],
    message: "Please select accountValue"
  },
  categoryValue: {
    required: false,
    trigger: ["blur", "change"],
    message: "Please select categoryValue"
  },
  dateValue: {
    type: "number",
    required: true,
    trigger: ["blur", "change"],
    message: "Please input dateValue"
  },
  amountValue: {
    type: "number",
    required: true,
    trigger: ["blur", "change"],
    message: "Please input amountValue"
  },
};

const handleValidateButtonClick = (e) => {
  e.preventDefault();
  formRef.value?.validate((errors) => {
    if (!errors) {
      emit('new-transaction', {
        key: model.value.key || Date.now(),
        date: new Date(model.value.dateValue),
        description: model.value.descriptionValue,
        category: model.value.categoryValue, 
        type: model.value.typeValue,
        account: model.value.accountValue,
        amount: model.value.amountValue
      });
      model.value = emptyData;
      showTransactionModal.value = false; 
    } else {
      console.log(errors);
    }
  });
};

</script>