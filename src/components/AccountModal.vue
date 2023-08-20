<template>
  <n-modal v-model:show="showAccountModal">
    <n-card
      :title="title"
      :bordered="false"
      size="large"
      role="dialog"
      aria-modal="true"
      class=" w-11/12 max-w-xl"
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
          size="medium"
          label-width="auto"
        >
          <n-form-item label="Account Name" path="name">
            <n-input v-model:value="model.name" placeholder="Account Name" />
          </n-form-item>
          <n-form-item label="Account Type" path="type">
            <n-select
              v-model:value="model.type"
              placeholder="Select Account Type"
              :options="typeOptions"
              :render-label="renderLabel"
              class="capitalize"
            />
          </n-form-item>
           <n-form-item label="Opening Balance" path="balance" v-if="!editing">
            <n-input-number 
              v-model:value="model.balance" :precision="2" clearable>
              <template #prefix>$</template>
            </n-input-number>
          </n-form-item>
          <div class="flex justify-end gap-4">
            <n-button @click="showAccountModal = false">
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
import { ref, h } from "vue";
import { 
  NButton, 
  NModal,
  NCard, 
  NForm, 
  NFormItem, 
  NSelect, 
  NInput, 
  useMessage, 
  NInputNumber 
} from 'naive-ui';
import { Icon } from '@iconify/vue';

const emit = defineEmits(['handle-save']);
const message = useMessage();
const showAccountModal = ref(false);
const title = ref(null);
const editing = ref(false);
const formRef = ref(null);
const emptyData = {
    name: null,
    type: null,
    balance: null
  }
const model = ref({...emptyData});

const openModal = (account) => {
  editing.value = !!account;
  if (account) {
    title.value = 'Edit Account';
    model.value = {
      _id: account._id,
      name: account.name,
      type: account.type,
      balance: account.balance
    };
  } else {
    title.value = 'Add Account';
    model.value = {...emptyData};
  }
  showAccountModal.value = true;
};

const closeModal = () => {
  showAccountModal.value = false;
};

defineExpose({ openModal, closeModal });

const getOptions = (options) => options.map((v) => ({ label: v, value: v }));

const renderLabel = (option) => {
  const label = option.label === 'credit' ? 'Credit Card' : option.label;
  return h("span", { class: 'capitalize' }, label);
};

const getRuleObject = (message, required=true, trigger=["blur", "input"]) => {
  return { required, message, trigger };
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

const rules = {
  name: getRuleObject("Please input account name"),
  type: getRuleObject("Please select type"),
  balance: {
    ...getRuleObject("Please enter opening balance"),
    type: "number",
    required: false
  }
};

const handleValidateButtonClick = (e) => {
  e.preventDefault();
  formRef.value?.validate((errors) => {
    if (!errors) {
      const account = {
        name: model.value.name,
        type: model.value.type,
        balance: model.value.balance || 0,
      }
      editing.value && (account._id = model.value._id);
      emit('handle-save', account, editing.value);
    } 
    else {
      message.error('Unknow error, please try again.');
      console.log(errors);
    }
  });
  closeModal();
};
</script>