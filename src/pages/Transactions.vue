<template>
  <h1>Transactions</h1>
  <TransactionModal
    ref="modal"
    @handle-Save="handleSave"
  />
  <div class="flex gap-10 justify-between items-center mb-4 -mt-2">
    <p align="center">
      {{ checkedRowKeys.length === 0  ? '' :
      `You have selected ${ checkedRowKeys.length } row${
        checkedRowKeys.length === 1 ? '' : 's'}`
      }}
    </p>
    <div class="flex gap-4">
      <edit-multiple :disabled="!multipleChecked" @handle-edit-multiple="handleEditMultiple"/>
      <n-button :disabled="!multipleChecked" @click="handleDeleteMultiple">
        Delete Multiple
      </n-button>
      <n-button type="primary" @click="openTransactionModal('Add Transaction')">
        Add Transaction
      </n-button>
      <n-button @click="exportToCSV" role="button" aria-label="Export to CSV" type="primary" ghost>
        <Icon icon="carbon:download" aria-hidden="true"/>
      </n-button>
    </div>
  </div>
  <n-data-table
    size="small"
    :columns="columns"
    :data="data"
    :pagination="pagination"
    :bordered="true"
    @update:checked-row-keys="handleCheck"
  />
  <n-button text type="primary" @click="exportToCSV">
    Export {{ data.length }} rows to CSV
  </n-button>
</template>


<script setup>
import { h, reactive, ref } from "vue";
import { Icon } from "@iconify/vue";
import { NTag, NButton, NDropdown, useMessage, useDialog, NDataTable} from "naive-ui";
import TransactionModal from "@/components/TransactionModal.vue";
import EditMultiple from "@/components/EditMultiple.vue";

const message = useMessage();
const dialog = useDialog();
const modal = ref(null);

const multipleChecked = ref(false);

const openTransactionModal = (currentTitle, transaction) => {
  modal.value.openModal(currentTitle, transaction);
};

const accountTypes = {
  0: 'Checking',
  1: 'Savings',
  2: 'Credit Card',
  3: 'Cash',
  4: 'Investment'
}

const types = {
  0: 'Income',
  1: 'Expense',
  2: 'Other', 
}

const categoryTypes = {
  0: 'Salary',
  1: 'Bonuses',
  2: 'Investments',
  3: 'Business',
  4: 'Rentals',
  5: 'Royalties',
  6: 'Pensions',
  7: 'Interest',
  8: 'Alimony',
  9: 'Gifts',
  10: 'Housing',
  11: 'Utilities',
  12: 'Groceries',
  13: 'Dining',
  14: 'Transport',
  15: 'Vehicle',
  16: 'Health',
  17: 'Entertainment',
  18: 'Clothing',
  19: 'Education',
}

const getFilterOptions = (obj) => {
  return Object.values(obj).map((v) => {
    return {label: v, value: v};
  });
};

const getRandomInt = (max) => {
  return Math.floor(Math.random() * max);
}

// get random date between 2020 and currrent date
const getRandomDate = () => {
  const start = new Date(2020, 0, 1);
  const end = new Date();
  return new Date(
    start.getTime() + Math.random() * (end.getTime() - start.getTime())
  );
};

let data = reactive(Array.from({ length: 10 }).map((_, index) => ({
  key: index + 1,
  date: getRandomDate(),
  amount: getRandomInt(1000),
  description: `This is a description and it is so so so so long ${index + 1}`,
  category: categoryTypes[getRandomInt(20)],
  type: types[getRandomInt(3)],
  account: accountTypes[getRandomInt(5)]
})));

const columns = [
  { 
    type: "selection", 
    options: ['all','none'],
  },
  {
    title: "Date", 
    key: "date", 
    width: 125,
    sorter: (row1, row2) => row1.date - row2.date,
    render(row) {
      return row.date.toLocaleDateString(undefined, { day: '2-digit', month: '2-digit', year: 'numeric' });
    }
  },
  { 
    title: "Description", 
    key: "description", 
    ellipsis: {
      tooltip: true
    },
    resizable: true,
    sorter: (row1, row2) => row1.description.localeCompare(row2.description) 
  },
  { 
    title: "Amount",
    key: "amount", 
    width: 125,
    sorter: (row1, row2) => row1.amount - row2.amount, 
    render: (row) => {
      const amount = row.amount;
      return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amount);
    }
  },
  {
    title: "Type",
    key: "type",
    width: 110,
    render(row) {
      return h(
        NTag, 
        { type: row.type === 'Income' ? 'success' : row.type === 'Expense' ? 'error' : 'default' }, 
        { default: () => row.type }
      )
    },
    filterOptions: getFilterOptions(types),
    filter: (value, row) => {
      return row.type === value
    }
  },
  { 
    title: "Category", 
    key: "category", 
    width: 150,
    render(row) {
      return row.category ? row.category : "Uncategorized";
    },
    filterOptions: getFilterOptions(categoryTypes),
    filter: (value, row) => {
      return row.category === value
    }
  },
  { 
    title: "Account", 
    key: "account", 
    width: 150,
    filterOptions: getFilterOptions(accountTypes),
    filter: (value, row) => {
      return row.account === value
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
        selectedKey === 'edit' ? openTransactionModal("Edit Transaction", row) : handleDelete(row.key);
      };

      return h(
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
    }
  },
];

const pagination = reactive({
  page: 1,
  pageSize: 25,
  showSizePicker: true,
  pageSizes: [25, 50, 100],
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
  data.forEach(row => {
    csvContent += `${row.date},"${row.description}",${row.amount},${row.category},${row.type},${row.account}\n`;
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

const addTransaction = (newTransaction) => {
  data.push(newTransaction);
  message.success(
    `${newTransaction.description} added successfully!`,
    { duration: 5e3 }
  );
};

const editTransaction = (newTransaction) => {
  const index = data.findIndex((row) => row.key === newTransaction.key);
  data[index] = {...newTransaction};
  message.success(
    `${newTransaction.description} updated successfully!`,
    { duration: 5e3 }
  );
};

const deleteTransaction = (key, displayMessage=true) => {
  const index = data.findIndex((row) => row.key === key);
  const deletedTransaction = data[index];
  data.splice(index, 1);
  displayMessage && message.success(
    `${deletedTransaction.description} deleted successfully!`,
    { duration: 5e3 }
  );
};

const handleDelete = (key) => {
  dialog.error({
    title: 'Delete Transaction',
    content: 'Are you sure you want to delete this transaction? This action cannot be undone.',
    positiveText: 'Delete',
    negativeText: 'Cancel',
    onPositiveClick: () => { deleteTransaction(key) }
  })
};

const handleDeleteMultiple = () => {
  dialog.error({
    title: 'Delete Transactions',
    content: 'Are you sure you want to delete these transactions? This action cannot be undone.',
    positiveText: 'Delete',
    negativeText: 'Cancel',
    onPositiveClick: () => { 
      checkedRowKeys.value.forEach((key) => {
        deleteTransaction(key, false);
      })
      message.success(
        `${checkedRowKeys.value.length} transactions deleted successfully!`,
        { duration: 5e3 }
      );
      checkedRowKeys.value.splice(0, checkedRowKeys.value.length);
    }
  })
};

const handleSave = async (newTransaction, editing) => { 
  if (editing) {
    editTransaction(newTransaction);
  } else (
    addTransaction(newTransaction)
  )
};

const handleEditMultiple = (obj) => {
  const allNull = Object.values(obj).every((value) => value === null);
  allNull && message.error(
    `Please select at least one field to edit!`,
    { duration: 5e3 }
  );
  if (!allNull) {
    checkedRowKeys.value.forEach((key) => {
      const index = data.findIndex((row) => row.key === key);
      Object.keys(obj).forEach((transactionKey) => {
        // Only overwrite if the value in newTransaction is not null
        if (obj[transactionKey] !== null) {
          data[index][transactionKey] = obj[transactionKey];
        }
      });
    })
    message.success(
      `${checkedRowKeys.value.length} transactions updated successfully!`,
      { duration: 5e3 }
    );
    checkedRowKeys.value.splice(0, checkedRowKeys.value.length);
  }
}

</script>
