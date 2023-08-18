<template>
  <n-data-table
    :columns="columns"
    :data="data"
    :row-class-name="row => row.children && 'font-bold'"
    :summary="createSummary"
    :row-key="row => row._id ? row._id : row.key"
    default-expand-all
  />
</template>

<script setup>
import { ref, h, reactive, onMounted } from "vue";
import { Icon } from "@iconify/vue";
import { NDataTable, NButton, NDropdown, useMessage, useDialog } from "naive-ui";

import useUserStore from '@/store/user';
const store = useUserStore();

const message = useMessage();
const dialog = useDialog();
const modal = ref(null);

const openAccountModal = (currentTitle, account) => {
  modal.value.openModal(currentTitle, account);
};

const data = store.accountNestedData;

const props = defineProps({
  formatCurrency: {
    type: Function,
    required: true
  }
})

const columns = reactive([
  {
    title: "Account",
    key: "name", 
    render: (row) => h('span', { class: 'capitalize' }, row.name === 'credit' ? 'Credit Card' : row.name),
  },
  {
    title: "Balance",
    key: "balance",
    width: 200,
    render: (row) => props.formatCurrency(row.balance)
  },
  {
    title: "",
    key: "actions",
    align: "center",
    width: 100,
    render(row) {
      const renderIcon = icon => () => h(Icon, { icon });
      const handleDropdownSelection = (selectedKey) => {
        selectedKey === 'edit' ? openAccountModal("Edit Account", row) : handleDelete(row);
      };
      const element = h(
        NDropdown,
        {
          options: [
            { label: 'Edit', key: 'edit', icon: renderIcon('material-symbols:edit') },
            { label: 'Delete', key: 'delete', icon: renderIcon('material-symbols:delete') },
          ],
          placement: 'left-start',
          onSelect: handleDropdownSelection,
        },
        {
          default: () => [
            h(
              NButton,
              { text: true },
              { default: renderIcon('material-symbols:settings')}
            )
          ]
        }
      )
      return row.children ? null : element;
    }
  },
]);

const createSummary = (data) => {
  const totalBalance = data.reduce((prevValue, row) => prevValue + row.balance, 0);
  return {
    name: {
      value: h(
        "span",
        { class: 'font-bold' },
        "Net Total"
      ),
      colSpan: 1
    },
    balance: {
      value: h("span", { class: 'font-bold' }, props.formatCurrency(totalBalance)),
      colSpan: 2
    },
  };
};

const handleDelete = (row) => {
  dialog.error({
    title: "Delete Account",
    content: () => {
      return h('div', [
        h('p', `Are you sure you want to delete this account? \
          All transactions associated with this account will also be deleted.`),
        h('p', { class: 'font-semibold' }, `This action cannot be undone.`)
      ]);
    },
    positiveText: "Delete",
    negativeText: "Cancel",
    onPositiveClick: () => {
      store.deleteAccount(row._id);
      message.success(
        `${row.name} account deleted successfully!`,
        { duration: 5e3 }
      )
    }
  });
}
</script>
