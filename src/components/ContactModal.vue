<template>
  <n-button quaternary @click="showContactModal = true">
    <Icon icon="material-symbols:help-outline" class="pr-2"/>
    Contact
  </n-button>
  <n-modal v-model:show="showContactModal">
    <n-card
      :bordered="false"
      size="large"
      role="dialog"
      aria-modal="true"
      class=" w-11/12 max-w-xl"
    >
      <template #header-extra>
        <n-button text @click="showContactModal = false">
          <Icon icon="material-symbols:close-rounded" class="text-lg" />
        </n-button>
      </template>
      <h1 class="text-center">Contact</h1>
      <p class="text-center mb-6">
        Found a bug or need help? Please contact me below or email me at 
        <a href="mailto:liz@liztrejo.dev">
          <n-text type="primary">liz@liztrejo.dev</n-text>
        </a>.
      </p>
      <contact-form :radioButtons="radioButtons" />
    </n-card>
  </n-modal>
</template>

<script setup>
import { ref } from "vue";
import { NButton, NModal, NCard, NText } from 'naive-ui';
import { Icon } from '@iconify/vue';
import ContactForm from "./ContactForm.vue";

const showContactModal = ref(false);

const radioButtons = {
  help: 'Help',
  bug: 'Report A Bug',
}

const openModal = () => {
  showContactModal.value = true;
};

const closeModal = () => {
  showContactModal.value = false;
};

defineExpose({ openModal, closeModal });

</script>