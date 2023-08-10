<template>
  <n-button quaternary @click="showFeedbackModal = true">
    <Icon icon="uil:comment" class="pr-2"/>
    <span>Leave Feedback</span>
  </n-button>
  <n-modal v-model:show="showFeedbackModal">
    <n-card
      title=" "
      style="width: 600px"
      :bordered="false"
      size="huge"
      role="dialog"
      aria-modal="true"
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
          color="#4fb233" 
          clearable 
          :count="10"
          @update:value="(v)=>selectedStars = v"
        />
        <n-form-item label="This is a FormItem">
          <n-input v-model:value="value" />
        </n-form-item>
      </div>
      <template #footer>
        Footer
      </template>
    </n-card>
  </n-modal>
</template>

<script setup>
import { ref } from 'vue'
import { Icon } from '@iconify/vue'
import { NButton, NModal, NRate, NFormItem, NCard, NInput } from 'naive-ui';
const showFeedbackModal = ref(false)
const selectedStars = ref(0);

const value = ref('');
</script>