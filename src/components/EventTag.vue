<template>
  <div 
    :key="item._id"
    class="hidden md:flex w-full max-w-full items-center" 
    v-if="year === item.year && month === item.month && date === item.day"
  >
    <n-tag 
      size="small" 
      :bordered="false" 
      :type="item.type" 
      class="flex-grow max-w-full h-fit p-2 whitespace-break-spaces"
    >
      {{ item.tag }}
    </n-tag>
    <n-dropdown 
      class="capitalize"
      :options="dropDownOptions.map(option => ({ ...option, id: item._id }))" 
      @select="(key) => handleDropdownSelection(key, item._id)"
    >
      <n-button text size="small">
        <Icon icon="mdi:dots-vertical" class="-mr-1"/>
      </n-button>
    </n-dropdown>
  </div>
</template>

<script setup>
import { h,defineEmits } from 'vue';
import { NTag, NDropdown } from "naive-ui";
import { Icon } from '@iconify/vue';

// Props
const props = defineProps({
  item: Object,
  year: Number,
  month: Number,
  date: Number,
});

const renderIcon = icon => () => h(Icon, { icon });
const getOption = (key) => ({ key, label: key, icon: renderIcon(`mdi:${key}`) });
const dropDownOptions = ['edit', 'delete'].map(getOption);

// Emit
const emit = defineEmits(['dropdown-selected']);

const handleDropdownSelection = (key) => {
  emit('dropdown-selected', key, props.item._id);
}
</script>



