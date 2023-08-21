<template>
  <n-form
  ref="formRef"
  :model="model"
  :rules="rules"
  label-placement="left"
  require-mark-placement="right-hanging"
  :size="size"
  label-width="auto"
  :style="{
    maxWidth: '640px'
  }"
  >
    <n-form-item label="Type of Message" path="messageTypeValue">
      <n-radio-group v-model:value="model.messageTypeValue" name="radiogroup">
        <template v-for="button in Object.keys(radioButtons)">
          <n-radio-button :value="button">
            {{ radioButtons[button] }}
          </n-radio-button>

        </template>
      </n-radio-group>
    </n-form-item>
    <n-form-item label="Subject" path="subjectValue">
      <n-input v-model:value="model.subjectValue" placeholder="Subject" />
    </n-form-item>
    <n-form-item label="Message" path="messageValue">
      <n-input
        v-model:value="model.messageValue"
        placeholder="Message"
        type="textarea"
        :autosize="{
          minRows: 3,
          maxRows: 5
        }"
      />
    </n-form-item>
    <div class="flex justify-end">
      <n-button round type="primary" @click="handleValidateButtonClick">
        Send
      </n-button>
    </div>
  </n-form>
  <n-alert 
    v-if="showAlert" 
    title="Message Sent"
    type="success" 
    class="mt-10 mb-4"
  >
    Thank you for your message! I will get back to you as soon as possible.
  </n-alert>
</template>

<script setup>
import { useAuth0 } from '@auth0/auth0-vue';
const { user } = useAuth0();
const userId = user._rawValue.sub;
import axios from "axios";
const baseURL = import.meta.env.VITE_BASE_URL;
const props = defineProps(['radioButtons'])

import { NForm, NFormItem, NButton, NRadioGroup, NRadioButton, NInput, NAlert } from 'naive-ui'
import { ref } from 'vue';
import { useMessage } from 'naive-ui';

const formRef = ref(null);
const message = useMessage();
const size = ref('medium');
const showAlert = ref(false);
const model = ref({
  subjectValue: null,
  messageValue: null,
  messageTypeValue: null,
});

const getRule = (required, ruleMessage) => {
  return {
    required,
    message: ruleMessage,
    trigger: ["blur", "input"],
  };
};

const rules = {
  subjectValue: getRule(false, 'Please enter a subject'),
  messageValue: getRule(true, 'Please enter a message'),
  messageTypeValue: getRule(true, 'Please select a message type'),
};

const clearForm = () => {
  model.value.subjectValue = null;
  model.value.messageValue = null;
  model.value.messageTypeValue = null;
};

const sendMessage = async (data) => {
  axios.post(`${baseURL}/messages`, data)
    .then((res) => {
      clearForm();
      showAlert.value = true;
      setTimeout(() => {
        showAlert.value = false;
      }, 5000);
    })
    .catch((err) => {
      console.log(err);
      message.error({
        content: 'Message failed to send',
        duration: 3
      });
    });
};

const handleValidateButtonClick = (e) => {
  e.preventDefault();
  formRef.value?.validate((errors) => {
    if (!errors) {
      const data = {
        subject: model.value.subjectValue,
        message: model.value.messageValue,
        type: model.value.messageTypeValue,
        user: userId,
      };
      sendMessage(data);
    } else {
      console.log(errors);
    }
  });
};

const openEmailClient = () => {
  const recipient = "liz@liztrejo.dev";
  const subject = "SpendWise Contact Form";
  const mailtoUrl = `mailto:${recipient}?subject=${encodeURIComponent(subject)}`;
  window.location.href = mailtoUrl;
}
</script>