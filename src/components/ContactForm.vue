<template>
  <n-form
  ref="formRef"
  :model="model"
  :rules="rules"
  label-placement="left"
  size="medium"
  label-width="auto"
  class="max-w-xl"
  >
    <n-form-item label="Type of Message" path="messageType">
      <n-radio-group v-model:value="model.messageType" name="radiogroup">
        <template v-for="button in Object.keys(radioButtons)">
          <n-radio-button :value="button">
            {{ radioButtons[button] }}
          </n-radio-button>
        </template>
      </n-radio-group>
    </n-form-item>
    <n-form-item label="Subject" path="subject">
      <n-input v-model:value="model.subject" placeholder="Subject" />
    </n-form-item>
    <n-form-item label="Message" path="message">
      <n-input
        v-model:value="model.message"
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
import { ref } from 'vue';
import axios from "axios";
import useUserStore from '@/store/user';
import { 
  NForm, 
  NFormItem, 
  NButton, 
  NRadioGroup, 
  NRadioButton, 
  NInput, 
  NAlert,
  useMessage
} from 'naive-ui'

const store = useUserStore();
const props = defineProps(['radioButtons'])
const formRef = ref(null);
const message = useMessage();
const baseURL = import.meta.env.VITE_BASE_URL;
const showAlert = ref(false);
const model = ref({
  subject: null,
  message: null,
  messageType: null,
});

const getRule = (required, ruleMessage) => {
  return {
    required,
    message: ruleMessage,
    trigger: ["blur", "input"],
  };
};

const rules = {
  subject: getRule(false, 'Please enter a subject'),
  message: getRule(true, 'Please enter a message'),
  messageType: getRule(true, 'Please select a message type'),
};

const clearForm = () => {
  model.value.subject = null;
  model.value.message = null;
  model.value.messageType = null;
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
        subject: model.value.subject,
        message: model.value.message,
        type: model.value.messageType,
        user: store.user.sub,
      };
      sendMessage(data);
    } else {
      console.log(errors);
    }
  });
};
</script>