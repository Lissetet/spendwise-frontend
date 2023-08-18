<template>
  <h1>Categories</h1>
  <n-card v-for="category in visibleCategories" :key="category._id" class="mb-4">
    <span class="text-sm font-extrabold">{{ category.name }}
      <Icon
        icon="ion:chevron-down"
        :style="{ transform: show[category.alias] ? 'rotate(180deg)' : '' }"
        @click="show[category.alias] = !show[category.alias]"
        class="transition-all duration-300"
      />
    </span>
    <n-collapse-transition :show="loading === false && show[category.alias]" class="mt-4 flex flex-wrap gap-20">
      <div class="flex-grow">
        <n-divider title-placement="left">
          <span class="text-xs">Subcategories</span>
        </n-divider>
        <div v-for="subcategory in categories.filter((subcategory)=>subcategory.parent === category.alias)">
          {{ subcategory.name }}
        </div>
      </div>
      <div class="flex-grow">
        <n-divider title-placement="left">
          <span class="text-xs">Your Subcategories</span>
        </n-divider>
        <article class="mb-4" v-if="showAdd[category.alias] !== 'edit'">
          <div class="flex items-center"
            v-for="subcategory in userSubcategories.filter((subcategory)=>subcategory.parent === category.alias)"
          >
            {{ subcategory.name }}
            <n-button text @click="handleDelete(subcategory._id)" class="ml-4">
              <Icon icon="mdi:trash"/>
            </n-button>
            <n-button text @click="handleEdit(subcategory._id, category.alias)" class="ml-2">
              <Icon icon="mdi:pencil"/>
            </n-button>
          </div>
        </article>
        <n-button
          @click="showAdd[category.alias] = 'add'"
          v-if="showAdd[category.alias] === 'none'"
        >
          <Icon icon="mdi:plus" class="pr-2"/>
          Add Subcategory
        </n-button>
        <div class="flex flex-col max-w-xs gap-4 mt-4" v-if="showAdd[category.alias] !== 'none'" >
          <n-input
            v-model:value="inputValues[category.alias]"
            type="text"
            placeholder="Subcategory Name"
          />
          <div class="flex gap-4">
            <n-button
              class="mb-2"
              type="primary"
              v-if="showAdd[category.alias] === 'add'"
              @click="handleAdd(category.alias)"
            >
              Save Add
            </n-button>
            <n-button
              class="mb-2"
              type="primary"
              v-if="showAdd[category.alias] === 'edit'"
              @click="editSubcategory(category.alias)"
            >
              Save Edit
            </n-button>
            <n-button @click="showAdd[category.alias] = 'none'">
              Cancel
            </n-button>
          </div>
        </div>
      </div>
    </n-collapse-transition>
  </n-card>
</template>

<script setup>
import { onMounted, reactive, ref } from 'vue';
import { Icon } from '@iconify/vue';
import { 
  useDialog, 
  NCard, 
  NButton, 
  NCollapseTransition, 
  NDivider, 
  NInput 
} from 'naive-ui';

import useUserStore from '@/store/user';
const store = useUserStore();

const loading = ref(true);
const show = reactive({});
const showAdd =reactive({});
const inputValues = reactive({});
const editingID = reactive({})
const userId = store.user.sub;
const dialog = useDialog();
const categories = store.categories;
const userSubcategories = store.userSubcategories;
const visibleCategories = store.parentCategories.filter((category) =>  category.alias !== 'uncategorized' );

onMounted(()=> {
  store.fetchCategories();
  visibleCategories.forEach((category) => {
    show[category.alias] = false;
    showAdd[category.alias] = 'none';
    inputValues[category.alias] = '';
    editingID[category.alias] = null;
  });
  loading.value = false;
}); 
 
const handleDelete = (id) => {
  dialog.error({
    title: 'Delete Subcategory',
    content: 'Are you sure you want to delete this subcategory? This action cannot be undone.',
    positiveText: 'Delete',
    negativeText: 'Cancel',
    onPositiveClick: () => { store.deleteSubcategory(id) }
  })
}

const createAlias = (category) => {
  return category
        .toLowerCase()
        .replace(/&/g, '')         // Remove '&' character
        .replace(/[^a-z0-9]+/g, '-') // Replace non-alphanumeric characters with hyphens
        .replace(/^-|-$/g, '');    // Remove hyphens from the start or end of the alias
};

const handleAdd = (alias) => {
  const name = inputValues[alias];
  const body = { 
    name,
    parent: alias,
    alias: `${createAlias(name)}-${userId}`,
    user: userId
  }
  store.addSubcategory(body);
  showAdd[alias] = 'none';
  inputValues[alias] = '';
};

const handleEdit = (id, alias) => {
  showAdd[alias] = 'edit';
  editingID[alias] = id;
  inputValues[alias] = userSubcategories.find((subcategory) => subcategory._id === id).name;
};

const editSubcategory = (alias) => {
  const body = { 
    name: inputValues[alias],
    alias: `${createAlias(inputValues[alias])}-${userId}`
  }

  store.editSubcategory(body, editingID[alias]);
  showAdd[alias] = 'none';
  inputValues[alias] = '';
  editingID[alias] = null;
};

</script>