<template>
  <n-button @click="openMultipleModal" :disabled="disabled">
    <Icon icon="material-symbols:edit" class="pr-2" />
    Edit Multiple
  </n-button>
  <n-modal v-model:show="showEditMultiple">
    <n-card
      title="Edit Multiple Transactions"
      :bordered="false"
      size="large"
      role="dialog"
      aria-modal="true"
      class=" w-11/12 max-w-xl"
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
          size="medium"
          label-width="auto"
        >
          <n-form-item label="Date" path="date">
            <n-date-picker v-model:value="model.date" type="date" />
          </n-form-item>
          <n-form-item label="Description" path="description">
            <n-input v-model:value="model.description" placeholder="Description" />
          </n-form-item>
          <n-form-item label="Account" path="account">
            <n-select
              v-model:value="model.account"
              placeholder="Select Acccount"
              :options="accountOptions"
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
            />
          </n-form-item>
          <div class="flex justify-end gap-4">
            <n-button @click="showEditMultiple = false">
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
  useMessage 
} from 'naive-ui';
import { Icon } from '@iconify/vue';
import useUserStore from '@/store/user';

const store = useUserStore();
const message = useMessage();
const showEditMultiple = ref(false);
const formRef = ref(null);
const model = ref(null);
const props = defineProps({
  disabled: Boolean,
})
const emptyData = {
  description: null,
  type: null,
  category: null,
  date: null,
  account: null
};
const emit = defineEmits(['handle-edit-multiple']);


const openMultipleModal = () => {
  model.value = {...emptyData}
  showEditMultiple.value = true;
};

const getTypeOptions = (options) => {
  return options.map((v) => {
    return {
      label: v,
      value: v.toLowerCase(),
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

const getRuleObject = (message) => {
  return {
    required: false,
    trigger: ["blur", "input"],
    message
  };
};

const rules = {
  description: getRuleObject("Please input description"),
  type: getRuleObject("Please select type"),
  account: getRuleObject("Please select account"),
  category: getRuleObject("Please select category"),
  date: {
    ...getRuleObject("Please input date"),
    type: "number",
  },
};

const handleValidateButtonClick = (e) => {
  e.preventDefault();
  formRef.value?.validate((errors) => {
    if (!errors) {
      emit('handle-edit-multiple', {
        date: model.value.date ? new Date(model.value.date) : null,
        description: model.value.description,
        category: model.value.category, 
        type: model.value.type,
        account: model.value.account,
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

onMounted(() => {
  categoryOptions.value = getCatergoryOptions(store.sortedCategories);
  accountOptions.value = getAccountOptions(store.accounts);
});
</script>