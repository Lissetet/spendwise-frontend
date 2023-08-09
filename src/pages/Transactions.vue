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
      <n-button type="default" :disabled="checkedRowKeys.length <= 1">
        Edit Multiple
      </n-button>
      <n-button type="primary" @click="openModal('Add Transaction')">
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
import { NTag, NButton, useMessage } from "naive-ui";
import TransactionModal from "@/components/TransactionModal.vue";

const message = useMessage();
const modal = ref(null);
const transaction = ref(null);

const openModal = (currentTitle, transaction) => {
  // transaction.value = data ? data : null;
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
  0: 'income',
  1: 'expense',
  2: 'other', 
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

const capitalize = (str) => {
  return str.charAt(0).toUpperCase() + str.slice(1);
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
      return h(NTag, { type: row.type === 'income' ? 'success' : row.type === 'expense' ? 'error' : 'default' }, { default: () => capitalize(row.type) })
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
    key: "actions",
    align: "center",
    width: 75,
    render(row) {
      return h(
        NButton,
        {
          size: "small",
          onClick: () => { openModal("Edit Transaction", row) }
        },
        { default: () => "Edit" }
      );
    }
  }
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
  // const options =  { style: 'currency', currency: 'USD' }
  // const amount = new Intl.NumberFormat('en-US', options ).format(newTransaction.amount);
  // message.success(
  //   `${newTransaction.description} of ${amount} added successfully!`,
  //   { duration: 5e3 }
  // );
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

const handleSave = async (newTransaction, editing) => { 
  if (editing) {
    editTransaction(newTransaction);
  } else (
    addTransaction(newTransaction)
  )
};

</script>
