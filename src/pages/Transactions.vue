<template>
  <h1>Transactions</h1>
  <TransactionModal
    ref="modal"
    @handle-save="handleSave"
    @handle-edit-multiple="handleEditMultiple"
  />
  <div class="flex gap-10 justify-between items-center mb-4 -mt-2">
    <p align="center">
      {{ checkedRowKeys.length === 0  ? '' :
      `You have selected ${ checkedRowKeys.length } row${
        checkedRowKeys.length === 1 ? '' : 's'}`
      }}
    </p>
    <div class="flex gap-4">
      <n-button :disabled="!multipleChecked" @click="handleDeleteMultiple">
        <Icon icon="mdi:delete" class="pr-2"/>
        Delete Multiple
      </n-button>
      <n-button :disabled="!multipleChecked" @click="openMultipleModal()">
        <Icon icon="material-symbols:edit" class="pr-2" />
        Edit Multiple
      </n-button>
      <n-button type="primary" @click="openTransactionModal()">
        <Icon icon="mdi:add" class="pr-2"/>
        Add Transaction
      </n-button>
    </div>
  </div>
  <n-data-table
    size="small"
    :columns="columns"
    :data="store.transactions"
    :pagination="pagination"
    :bordered="true"
    :row-key="row => row._id"
    @update:checked-row-keys="handleCheck"
  />
  <n-button text type="primary" @click="exportToCSV">
    Export {{ store.transactions.length }} rows to CSV
  </n-button>
</template>


<script setup>
import { h, reactive, ref, onMounted } from "vue";
import { Icon } from "@iconify/vue";
import { 
  NTag, 
  NButton, 
  NDropdown, 
  useMessage, 
  useDialog, 
  NDataTable
} from "naive-ui";
import { formatCurrency } from "@/utils";
import useUserStore from '@/store/user';
import TransactionModal from "@/components/TransactionModal.vue";

const store = useUserStore();
const message = useMessage();
const dialog = useDialog();
const modal = ref(null);
const multipleChecked = ref(false);

const openTransactionModal = (transaction) => {
  modal.value.openModal(transaction);
};

const openMultipleModal = () => {
  modal.value.openModalMultiple();
};

const columns = [
  { 
    type: "selection", 
    options: ['all','none'],
  },
  {
    title: "Date", 
    key: "date", 
    width: 100,
    sorter: (row1, row2) => row1.date - row2.date,
    render(row) {
      return new Date(row.date).toLocaleDateString(undefined, { day: '2-digit', month: '2-digit', year: 'numeric' });
    }
  },
  { 
    title: "Description", 
    key: "description", 
    ellipsis: {
      tooltip: true
    },
    sorter: (row1, row2) => row1.description.localeCompare(row2.description) 
  },
  { 
    title: "Amount",
    key: "amount", 
    width: 150,
    align: "center",
    sorter: (row1, row2) => row1.amount - row2.amount, 
    render: (row) => {
      const className = row.amount < 0 ? 'text-red-500' : '';
      return h("span", { class: className }, formatCurrency(row.amount));
    }
  },
  {
    title: "Type",
    key: "type",
    width: 125,
    render(row) {
      return h(
        NTag, 
        { type: row.type === 'income' ? 'success' : row.type === 'expense' ? 'error' : 'default',
        class: 'capitalize' }, 
        { default: () => row.type }
      )
    },
    filterOptions: store.transactionFilters.type,
    filter: (value, row) => {
      return row.type === value
    }
  },
  { 
    title: "Category", 
    key: "category", 
    width: 150,
    render(row) {
      return store.sortedCategories.find((category) => category.alias === row.category).name;
    },
    filterOptions: store.transactionFilters.category,
    filter: (value, row) => {
      return row.category === value
    }
  },
  { 
    title: "Account", 
    key: "account", 
    width: 150,
    filterOptions: store.transactionFilters.account,
    filter: (value, row) => {
      return row.account === value
    }, 
    render(row) {
      return store.accounts.find((account) => account._id === row.account)?.name;
    },
  },
  {
    title: "",
    key: "options",
    align: "center",
    width: 50,
    render(row) {
      const renderIcon = icon => () => h(Icon, { icon });
      const handleDropdownSelection = (selectedKey) => {
        selectedKey === 'edit' ? openTransactionModal(row) : handleDelete(row);
      };

      return h(
        NDropdown,
        {
          options: [
            { label: 'Edit', key: 'edit', icon: renderIcon('mdi:edit') },
            { label: 'Delete', key: 'delete', icon: renderIcon('mdi:delete') },
          ],
          placement: 'left-start',
          onSelect: handleDropdownSelection,
        },
        {
          default: () => [
            h(
              NButton,
              { text: true },
              { default: renderIcon('mdi:dots-vertical')}
            )
          ]
        }
      )
    }
  },
];

const pagination = reactive({
  page: 1,
  pageSize: 10,
  showSizePicker: true,
  pageSizes: [10, 25, 50, 100],
  prefix ({ itemCount }) {
    return `${(pagination.page - 1) * pagination.pageSize + 1}-${Math.min(pagination.page * pagination.pageSize, itemCount)} out of ${itemCount}`
  },
  onChange: (page) => {
    pagination.page = page;
  },
  onUpdatePageSize: (pageSize) => {
    pagination.pageSize = pageSize;
    pagination.page = 1;
  }
});

const checkedRowKeys = ref([]);
const handleCheck = (rowKeys) => {
  checkedRowKeys.value = rowKeys;
  multipleChecked.value = rowKeys.length > 1;
};

const exportToCSV = () => {
  let csvContent = "Date,Description,Amount,Category,Type,Account\n";

  store.transactions.forEach(row => {
    const account = store.accounts.find((acc) => acc._id === row.account).name;
    const category = store.sortedCategories.find((category) => category.alias === row.category).name;
    const date = new Date(row.date).toLocaleDateString(undefined, { day: '2-digit', month: '2-digit', year: 'numeric' });
    csvContent += `${date},"${row.description}",${row.amount},${category},${row.type},${account}\n`;
  });

  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
  const link = document.createElement("a");
  const url = URL.createObjectURL(blob);
  link.setAttribute("href", url);
  link.setAttribute("download", "transactions.csv");
  link.style.visibility = "hidden";
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};


const handleDelete = (transaction) => {
  dialog.error({
    title: 'Delete Transaction',
    content: () => {
      return h('div', [
        h('p', 'Are you sure you want to delete this transaction? This action cannot be undone.'),
        h('p', { class: 'font-semibold' }, `This action cannot be undone.`)
      ]);
    },
    positiveText: 'Delete',
    negativeText: 'Cancel',
    onPositiveClick: () => { 
      store.deleteTransaction(transaction._id);
      message.success(`${transaction.description} deleted successfully!`)
     }
  })
};

const handleDeleteMultiple = () => {
  dialog.error({
    title: 'Delete Transactions',
    content: () => {
      return h('div', [
        h('p', 'Are you sure you want to delete these transactions? This action cannot be undone.'),
        h('p', { class: 'font-semibold' }, `This action cannot be undone.`)
      ]);
    },
    positiveText: 'Delete',
    negativeText: 'Cancel',
    onPositiveClick: () => { 
      checkedRowKeys.value.forEach((key) => {
        store.deleteTransaction(key);
      })
      message.success(
        `${checkedRowKeys.value.length} transactions deleted successfully!`,
        { duration: 5e3 }
      );
      checkedRowKeys.value.splice(0, checkedRowKeys.value.length);
    }
  })
};

const handleSave = async (transaction, editing) => { 
  if (editing) {
    store.editTransaction(transaction);
    message.success(`${transaction.description} updated successfully!`);
  } else {
    store.addTransaction(transaction);
    message.success(`${transaction.description} added successfully!`);
  }
};

const handleEditMultiple = (obj) => {
  const allNull = Object.values(obj).every((value) => value === null);
  allNull && message.error(
    `Please select at least one field to edit!`,
    { duration: 5e3 }
  );
  if (!allNull) {
    const requestBody = {};
    Object.keys(obj).forEach((transactionKey) => {
      if (obj[transactionKey] !== null) {
        requestBody[transactionKey] = obj[transactionKey];
      }
    });
    checkedRowKeys.value.forEach((_id) => {
      store.editTransaction({...requestBody, _id});
    })
    message.success(
      `${checkedRowKeys.value.length} transactions updated successfully!`,
      { duration: 5e3 }
    );
    checkedRowKeys.value.splice(0, checkedRowKeys.value.length);
  }
}

onMounted(()=> {
  store.fetchTransactions();
});
</script>
