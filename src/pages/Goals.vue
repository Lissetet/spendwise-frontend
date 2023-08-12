<template>
  <h1>Goals</h1>
  <div class="flex gap-10" v-if="view==='circle'">
    <n-space vertical>
      <n-el>
        <n-progress
          type="multiple-circle"
          :stroke-width="6"
          :circle-gap="0.5"
          :percentage="[
            percentage2,
            (percentage2 + 10) % 100,
            (percentage2 + 20) % 100,
            (percentage2 + 30) % 100
          ]"
          :color="[
            'var(--info-color)',
            'var(--success-color)',
            'var(--warning-color)',
            'var(--error-color)'
          ]"
          :rail-style="[
            { stroke: 'var(--info-color)', opacity: 0.3 },
            { stroke: 'var(--success-color)', opacity: 0.3 },
            { stroke: 'var(--warning-color)', opacity: 0.3 },
            { stroke: 'var(--error-color)', opacity: 0.3 }
          ]"
          show-indicator="true"
        >
          <div style="text-align: center">
            All Goals
          </div>
        </n-progress>
      </n-el>
      <n-space>
        <n-button @click="minus2">
          Minus 10%
        </n-button>
        <n-button @click="add2">
          Add 10%
        </n-button>
      </n-space>
    </n-space>
    <n-space vertical>
    <n-progress
      type="line"
      :percentage="percentage"
      :indicator-placement="'inside'"
    />
    <n-progress
      type="line"
      status="success"
      :percentage="percentage"
      :indicator-placement="'inside'"
    />
    <n-progress
      type="line"
      status="warning"
      :percentage="percentage"
      :indicator-placement="'inside'"
    />
    <n-progress
      type="line"
      status="error"
      :percentage="percentage"
      :indicator-placement="'inside'"
    />
    <n-space>
      <n-button @click="minus">
        Minus 10%
      </n-button>
      <n-button @click="add">
        Add 10%
      </n-button>
    </n-space>
  </n-space>
  </div>
</template>

<script setup>
import { ref } from "vue";

const percentage = ref(0)
const percentage2 = ref(0)
const view = ref('circle')

const add = () => {
  percentage.value += 10
  if (percentage.value > 100) {
    percentage.value = 0
  }
}

const add2 = () => {
  percentage2.value += 10
  if (percentage2.value > 100) {
    percentage2.value = 0
  }
}

const minus2 = () => {
  percentage2.value -= 10
  if (percentage2.value < 0) {
    percentage2.value = 100
  }
}

const minus = () => {
  percentage.value -= 10
  if (percentage.value < 0) {
    percentage.value = 100
  }
}
</script>