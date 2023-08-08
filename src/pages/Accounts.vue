<template>
  <n-button @click="showTransactionModal = true" type="primary">
    Add Transaction
  </n-button>
  <n-modal v-model:show="showTransactionModal">
    <n-card
      style="width: 600px"
      title="Add Transaction"
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
          <n-form-item label="Input" path="inputValue">
            <n-input v-model:value="model.inputValue" placeholder="Input" />
          </n-form-item>
          <n-form-item label="Textarea" path="textareaValue">
            <n-input
              v-model:value="model.textareaValue"
              placeholder="Textarea"
              type="textarea"
              :autosize="{
                minRows: 3,
                maxRows: 5
              }"
            />
          </n-form-item>
          <n-form-item label="Select" path="selectValue">
            <n-select
              v-model:value="model.selectValue"
              placeholder="Select"
              :options="generalOptions"
            />
          </n-form-item>
          <n-form-item label="Multiple Select" path="multipleSelectValue">
            <n-select
              v-model:value="model.multipleSelectValue"
              placeholder="Select"
              :options="generalOptions"
              multiple
            />
          </n-form-item>
          <n-form-item label="Datetime" path="datetimeValue">
            <n-date-picker v-model:value="model.datetimeValue" type="datetime" />
          </n-form-item>
          <n-form-item label="Checkbox Group" path="checkboxGroupValue">
            <n-checkbox-group v-model:value="model.checkboxGroupValue">
              <n-space>
                <n-checkbox value="Option 1">
                  Option 1
                </n-checkbox>
                <n-checkbox value="Option 2">
                  Option 2
                </n-checkbox>
                <n-checkbox value="Option 3">
                  Option 3
                </n-checkbox>
              </n-space>
            </n-checkbox-group>
          </n-form-item>
          <n-form-item label="Radio Group" path="radioGroupValue">
            <n-radio-group v-model:value="model.radioGroupValue" name="radiogroup1">
              <n-space>
                <n-radio value="Radio 1">
                  Radio 1
                </n-radio>
                <n-radio value="Radio 2">
                  Radio 2
                </n-radio>
                <n-radio value="Radio 3">
                  Radio 3
                </n-radio>
              </n-space>
            </n-radio-group>
          </n-form-item>
          <n-form-item label="Radio Button Group" path="radioGroupValue">
            <n-radio-group v-model:value="model.radioGroupValue" name="radiogroup2">
              <n-radio-button value="Radio 1">
                Radio 1
              </n-radio-button>
              <n-radio-button value="Radio 2">
                Radio 2
              </n-radio-button>
              <n-radio-button value="Radio 3">
                Radio 3
              </n-radio-button>
            </n-radio-group>
          </n-form-item>
          <n-form-item label="Input Number" path="inputNumberValue">
            <n-input-number v-model:value="model.inputNumberValue" />
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
import { Icon } from '@iconify/vue';

const showTransactionModal = ref(false);
const formRef = ref(null);
const model = ref({
  inputValue: null,
  textareaValue: null,
  selectValue: null,
  multipleSelectValue: null,
  datetimeValue: null,
  checkboxGroupValue: null,
  radioGroupValue: null,
  radioButtonGroupValue: null,
  inputNumberValue: null,
});
const generalOptions = ["groode", "veli good", "emazing", "lidiculous"].map(
  (v) => ({
    label: v,
    value: v
  })
);
const rules = {
  inputValue: {
    required: true,
    trigger: ["blur", "input"],
    message: "Please input inputValue"
  },
  textareaValue: {
    required: true,
    trigger: ["blur", "input"],
    message: "Please input textareaValue"
  },
  selectValue: {
    required: true,
    trigger: ["blur", "change"],
    message: "Please select selectValue"
  },
  multipleSelectValue: {
    type: "array",
    required: true,
    trigger: ["blur", "change"],
    message: "Please select multipleSelectValue"
  },
  datetimeValue: {
    type: "number",
    required: true,
    trigger: ["blur", "change"],
    message: "Please input datetimeValue"
  },
  checkboxGroupValue: {
    type: "array",
    required: true,
    trigger: "change",
    message: "Please select checkboxGroupValue"
  },
  radioGroupValue: {
    required: true,
    trigger: "change",
    message: "Please select radioGroupValue"
  },
  radioButtonGroupValue: {
    required: true,
    trigger: "change",
    message: "Please select radioButtonGroupValue"
  },
  inputNumberValue: {
    type: "number",
    required: true,
    trigger: ["blur", "change"],
    message: "Please input inputNumberValue"
  },
};

const handleValidateButtonClick = (e) => {
  e.preventDefault();
  formRef.value?.validate((errors) => {
    if (!errors) {
    } else {
      console.log(errors);
    }
  });
};
</script>