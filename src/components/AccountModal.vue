<template>
  <n-modal v-model:show="showAccountModal">
    <n-card
      style="width: 600px"
      :title="title"
      :bordered="false"
      size="large"
      role="dialog"
      aria-modal="true"
    >
      <template #header-extra>
        <n-button text @click="showAccountModal = false">
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
          <n-form-item label="Account Name" path="nameValue">
            <n-input v-model:value="model.nameValue" placeholder="Account Name" />
          </n-form-item>
          <n-form-item label="Account Type" path="typeValue">
            <n-select
              v-model:value="model.typeValue"
              placeholder="Select Account Type"
              :options="typeOptions"
              :render-label="renderLabel"
              class="capitalize"
            />
          </n-form-item>
           <n-form-item label="Opening Balance" path="balanceValue" placeholder="Opening Balance" v-if="!editing">
            <n-input-number v-model:value="model.balanceValue"/>
          </n-form-item>
          <div style="display: flex; justify-content: flex-end">
            <n-button style="margin-right: 8px" @click="showAccountModal = false">
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
import { ref, defineEmits, h } from "vue";
import { NButton, NModal, NCard, NForm, NFormItem, NSelect, NInput, useMessage, NInputNumber } from 'naive-ui';
import { Icon } from '@iconify/vue';

const emit = defineEmits(['handle-edit-multiple']);
const message = useMessage();
const showAccountModal = ref(false);
const title = ref(null);
const editing = ref(false);
const formRef = ref(null);
const emptyData = {
    nameValue: null,
    typeValue: null,
    balanceValue: null
  }
const model = ref({...emptyData});

const openModal = (modalTitle, account) => {
  title.value = modalTitle;
  editing.value = !!account;
  if (account) {
    model.value = {
      _id: account._id,
      nameValue: account.name,
      typeValue: account.type,
      balanceValue: account.balance
    }
  } else {
    model.value = {...emptyData}
  }
  showAccountModal.value = true;
};

const closeModal = () => {
  showAccountModal.value = false;
};

defineExpose({ openModal, closeModal });

const getOptions = (options) => {
  return options.map((v) => {
    return {
      label: v,
      value: v
    };
  });
};

const renderLabel = (option, selected) => {
  const label = option.label === 'credit' ? 'Credit Card' : option.label;
  return h("span", { class: 'capitalize' }, label);
};

const typeOptions = getOptions([
  'cash',
  'checking', 
  'savings', 
  'investment', 
  'credit',
  'loan', 
  'property',
]);

const getRuleObject = (message, required=true) => {
  return {
    required,
    trigger: ["blur", "input"],
    message
  };
};

const rules = {
  nameValue: getRuleObject("Please input account name"),
  typeValue: getRuleObject("Please select type"),
  balanceValue: {
    ...getRuleObject("Please enter opening balance"),
    type: "number",
    required: false
  }
};

const handleValidateButtonClick = (e) => {
  e.preventDefault();
  formRef.value?.validate((errors) => {
    if (!errors) {
      emit('handle-save', {
        _id: model.value._id,
        name: model.value.nameValue,
        type: model.value.typeValue,
        balance: model.value.balanceValue || 0,
      }, editing.value);
    } 
    else {
      message.error('Unknow error, please try again.');
      console.log(errors);
    }
  });
  closeModal();
};
</script>