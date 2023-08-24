<template>
  <n-button quaternary @click="showFeedbackModal = true">
    <Icon icon="mdi:feedback-outline" class="pr-2"/>
    <span>Leave Feedback</span>
  </n-button>
  <n-modal v-model:show="showFeedbackModal">
    <n-card
      title=" "
      :bordered="false"
      size="huge"
      role="dialog"
      aria-modal="true"
      class=" w-11/12 max-w-xl"
    >
      <template #header-extra>
        <n-button text @click="showFeedbackModal = false">
          <Icon icon="material-symbols:close-rounded" class="text-lg" />
        </n-button>
      </template>
      <div class="text-center">
        <h2 class="text-xl">How would you rate SpendWise?</h2>
        <p class="text-sm mb-8">We would love to hear your feedback!</p>
        <n-rate 
          size="large" 
          clearable 
          :count="10"
          @update:value="(v)=>model.selectedStars = v"
        />
        <n-form
          ref="formRef"
          label-width="auto"
          class="max-w-xl"
        >
          <n-form-item path="model.message">
            <n-input
              v-model:value="model.message"
              placeholder="Leave a message"
              type="textarea"
              :autosize="{
                minRows: 3,
                maxRows: 5
              }"
            />
          </n-form-item>
          <div class="flex justify-center">
            <n-button round type="primary" @click="sendFeedback">
              Send
            </n-button>
          </div>
        </n-form>
        <n-alert 
          v-if="showErrorAlert" 
          title="Error"
          type="error" 
          class="mt-10 mb-4"
        >
          {{ errorMessage }}
        </n-alert>
        <n-alert 
          v-if="showSuccessAlert" 
          title="Feedback Sent!"
          type="success" 
          class="mt-10 mb-4"
        >
          Thank you for your feedback!
        </n-alert>
      </div>
    </n-card>
  </n-modal>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { Icon } from '@iconify/vue'
import { 
  NButton, 
  NModal, 
  NRate, 
  NFormItem, 
  NCard, 
  NInput, 
  NForm, 
  NAlert 
} from 'naive-ui';
import axios from "axios";
import useUserStore from '@/store/user';

const store = useUserStore();
const baseURL = import.meta.env.VITE_BASE_URL;
const showFeedbackModal = ref(false)
const emptyData = {
  message: null,
  selectedStars: null,
}
const model = ref(null)
const selectedStars = ref(null);
const messageValue = ref(null);
const showErrorAlert = ref(false);
const showSuccessAlert = ref(false);
const errorMessage = ref('Please select a rating.');

const sendFeedback = async () => {
  const feedback = {
    user: store.user.sub,
    rating: model.value.selectedStars,
    message: model.value.message || 'No message',
    type: 'feedback'
  }
  if(feedback.rating === null) {
    showErrorAlert.value = true;
    setTimeout(() => {
      showErrorAlert.value = false;
    }, 3000);
  } else {
    axios.post(`${baseURL}/messages`, feedback)
      .then((res) => {
        showSuccessAlert.value = true;
        setTimeout(() => {
          showSuccessAlert.value = false;
          showFeedbackModal.value = false;
          model.value = emptyData;
        }, 3000);
      })
      .catch((err) => {
        showErrorAlert.value = true;
        errorMessage.value = err.response.data.message;
      })
  }
}

onMounted(() => {
  model.value = emptyData;
})
</script>