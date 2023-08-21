<template>
  <AccountModal
    ref="modal"
    @handle-save="handleSave"
  />
  <n-data-table
    :columns="columns"
    :data="store.accountNestedData"
    :row-class-name="row => row.children && 'font-bold'"
    :summary="createSummary"
    :row-key="row => row._id ? row._id : row.key"
    default-expand-all
  />
</template>

<script setup>
import { ref, h, reactive } from "vue";
import { Icon } from "@iconify/vue";
import { NDataTable, NDropdown, useMessage, useDialog } from "naive-ui";
import { formatCurrency } from "@/utils";
import AccountModal from "@/components/AccountModal.vue";
import useUserStore from '@/store/user';

const store = useUserStore();
const message = useMessage();
const dialog = useDialog();
const modal = ref(null);

const getName = name => name === 'credit' ? 'Credit Card' : name;

const columns = reactive([
  {
    title: "Account",
    key: "name", 
    render: (row) => h('span', { class: 'capitalize' }, getName(row.name)),
  },
  {
    title: "Balance",
    key: "balance",
    width: 200,
    align: "center",
    render: (row) => {
        return h(
          'span',
          formatCurrency(row.balance)
        );
    }
  },
  {
    title: "",
    key: "actions",
    align: "center",
    width: 75,
    render(row) {
      const renderIcon = icon => () => h(Icon, { icon });
      const getOption = (key) => ({ key, label: key, icon: renderIcon(`mdi:${key}`) });
      const handleDropdownSelection = (selectedKey) => {
        selectedKey === 'edit' ? modal.value.openModal(row) : handleDelete(row);
      };
      const element = h(
        NDropdown,
        {
          class: 'capitalize',
          options: ['edit', 'delete'].map(getOption),
          placement: 'left-start',
          onSelect: handleDropdownSelection,
        },
        {
          default: renderIcon('mdi:settings'),
        }
      )
      return row.children ? null : element;
    }
  },
]);

const createSummary = (data) => {
  const totalBalance = data.reduce((prevValue, row) => prevValue + row.balance, 0);
  const getSpan = (value) => h('span', { class: 'font-bold' }, value);
  return {
    name: {
      value: getSpan('Total')
    },
    balance: {
      value: getSpan(formatCurrency(totalBalance))
    },
    actions: {},
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
      message.success(`${row.name} account deleted successfully!`)
    }
  });
}

const handleSave = async (newAccount) => {
  store.editAccount(newAccount);
  message.success(`${newAccount.name} account edited successfully!`)
}
</script>
