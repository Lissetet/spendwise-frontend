<template>
  <div class="w-fit mx-auto">
  <h1 class="text-center">Contact</h1>
  <p class="text-center mb-10">
    Found a bug or have a suggestion? Please contact me below or email me at 
    <n-button text type="primary"  @click="openEmailClient">
      liz@liztrejo.dev
    </n-button>.
  </p>
  <n-card class="max-w-6xl mx-auto">
    <contact-form :radioButtons="radioButtons" />
  </n-card>

</div>
</template>

<script setup>
import { NCard, NButton } from 'naive-ui';
import ContactForm from '@/components/ContactForm.vue';

const radioButtons = {
  help: 'Help',
  bug: 'Report A Bug',
  suggestion: 'Leave a Suggestion',
  other: 'Other'
}
</script>