<template>
  <h1>Accounts</h1>
  <AccountModal
    ref="modal"
    @handle-save="handleSave"
  />
  <div class="flex">
    <n-statistic label="Total Cash">
      <span class="font-semibold text-lg">
        {{ formatCurrency(totalValues.cash) }}
      </span>
    </n-statistic>
    <div class="bg-gray-200 w-px mx-6"/>
    <n-statistic label="Total Debt">
      <span class="font-semibold text-lg">
        {{ formatCurrency(totalValues.debt) }}
      </span>
    </n-statistic>
    <div class="bg-gray-200 w-px mx-6"/>
    <n-statistic label="Total Loans">
      <span class="font-semibold text-lg">
        {{ formatCurrency(totalValues.loans) }}
      </span>
    </n-statistic>
    <div class="bg-gray-200 w-px mx-6"/>
    <n-statistic label="Total Investments & Other">
      <span class="font-semibold text-lg">
        {{ formatCurrency(totalValues.investments) }}
      </span>
    </n-statistic>
    <div class="bg-gray-200 w-px mx-6"/>
    <n-statistic label="Net Total">
      <span class="font-semibold text-lg">
        {{ formatCurrency(totalValues.all) }}
      </span>
    </n-statistic>
  </div>
  <div class="flex justify-end my-6 gap-4">
    <n-button :disabled="!multipleChecked">
      <Icon icon="material-symbols:delete" class="pr-2"/>
      Delete Multiple
    </n-button>
    <n-button :disabled="!multipleChecked">
      <Icon icon="material-symbols:edit" class="pr-2"/>
      Edit Multiple
    </n-button>
    <n-button type="primary" @click="openAccountModal('Add Account')">
      <Icon icon="material-symbols:add" class="pr-2"/>
      Add Account
    </n-button>
    <account-modal />
  </div>
  <n-data-table
    :columns="columns"
    :data="data"
    :row-class-name="rowClassName"
    :row-key="row => row.name"
    :summary="createSummary"
    @update:checked-row-keys="handleCheck"
    default-expand-none
  />
</template>

<script setup>
import { ref, h, reactive } from "vue";
import { Icon } from "@iconify/vue";
import { NDataTable, NButton, NStatistic, NDropdown, useMessage, useDialog } from "naive-ui";
import AccountModal from "@/components/AccountModal.vue";

const message = useMessage();
const dialog = useDialog();
const modal = ref(null);

const multipleChecked = ref(false);

const openAccountModal = (currentTitle, account) => {
  modal.value.openModal(currentTitle, account);
};

const getRandomNumber = (max=100000) => {
  return Math.floor(Math.random() * max);
};

const getRawDataItem = (key, itemName, type, max) => {
  return {
    key,
    name: itemName,
    type,
    balance: getRandomNumber(max),
  }
}

const rawData = ref([
  getRawDataItem(0, "Petty Cash", "Cash", 1000),
  getRawDataItem(1, "Checking", "Checking", 10000),
  getRawDataItem(2, "BofA 1234", "Savings", 100000),
  getRawDataItem(3, "Chase 2343", "Savings", 100000),
  getRawDataItem(4, "Chase Quicksilver", "Credit Card", -10000),
  getRawDataItem(5, "Charles Schwab", "Investment", 100000),
  getRawDataItem(6, "Vanguard", "Investment", 100000),
  getRawDataItem(7, "Chase Mortage", "Loan", -1000000),
  getRawDataItem(8, "Home", "Property", 1000000),
]);

const accountTypes = {
  cash: {
    name: 'Cash',
    children: rawData.value.filter(account => account.type === 'Cash'),
  },
  checking: {
    name: 'Checking',
    children: rawData.value.filter(account => account.type === 'Checking'),
  },
  savings: {
    name: 'Savings',
    children: rawData.value.filter(account => account.type === 'Savings'),
  },
  investment: {
    name: 'Investment',
    children: rawData.value.filter(account => account.type === 'Investment'),
  },
  credit: {
    name: 'Credit Card',
    children: rawData.value.filter(account => account.type === 'Credit Card'),
  },
  loan: {
    name: 'Loan',
    children: rawData.value.filter(account => account.type === 'Loan'),
  },
  property: {
    name: 'Property',
    children: rawData.value.filter(account => account.type === 'Property'),
  },
  other: {
    name: 'Other',
    children: rawData.value.filter(account => account.type === 'Other'),
  }
}

Object.keys(accountTypes).forEach(key => {
  accountTypes[key].balance = accountTypes[key].children.reduce((acc, account) => acc + account.balance, 0);
});

const totalValues = {
  cash: accountTypes.cash.balance + accountTypes.checking.balance + accountTypes.savings.balance,
  debt: accountTypes.credit.balance,
  loans: accountTypes.loan.balance,
  investments: accountTypes.investment.balance + accountTypes.property.balance + accountTypes.other.balance,
  all: accountTypes.cash.balance + accountTypes.checking.balance + accountTypes.savings.balance + accountTypes.credit.balance + accountTypes.loan.balance + accountTypes.investment.balance + accountTypes.property.balance + accountTypes.other.balance,
}

const data = reactive([
  {
    name: "Cash",
    balance: accountTypes.cash.balance,
    children: accountTypes.cash.children,
  },
  {
    name: "Checking",
    balance: accountTypes.checking.balance,
    children: accountTypes.checking.children,
  },
  {
    name: "Savings",
    balance: accountTypes.savings.balance,
    children: accountTypes.savings.children,
  }, 
  {
    name: "Investment",
    balance: accountTypes.investment.balance,
    children: accountTypes.investment.children,
  },
  {
    name: "Credit Card",
    balance: accountTypes.credit.balance,
    children: accountTypes.credit.children,
  },
  {
    name: "Loan",
    balance: accountTypes.loan.balance,
    children: accountTypes.loan.children,
  },
  {
    name: "Property",
    balance: accountTypes.property.balance,
    children: accountTypes.property.children,
  },
  {
    name: "Other",
    balance: accountTypes.other.balance,
    children: accountTypes.other.children,
  }
]);

const formatCurrency = (amount) => {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amount);
};

const columns = ref([
  {
    type: "selection",
    disabled: (row) => !!row.children,
  },
  {
    title: "Account",
    key: "name"
  },
  {
    title: "Balance",
    key: "balance",
    width: 200,
    render: (row) => formatCurrency(row.balance)
  },
  {
    title: "",
    key: "actions",
    align: "center",
    width: 100,
    render(row) {
      const renderIcon = icon => () => h(Icon, { icon });
      const handleDropdownSelection = (selectedKey) => {
        selectedKey === 'edit' ? openAccountModal("Edit Account", row) : handleDelete(row.key);
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

const rowClassName = (row) => {
  if (row.children) {
    return 'font-bold'
  }
};

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
      value: h("span", { class: 'font-bold' }, formatCurrency(totalBalance)),
      colSpan: 2
    },
  };
};

const checkedRowKeys = ref([]);
const handleCheck = (rowKeys) => {
  checkedRowKeys.value = rowKeys;
  multipleChecked.value = rowKeys.length > 1;
};

const addAccount = (newAccount) => {
  const parent = data.find(account => account.name === newAccount.type);
  parent.children.push({
    name: newAccount.name,
    balance: newAccount.balance
  });
  message.success(
    `${newAccount.name} account added successfully!`,
    { duration: 5e3 }
  )
};

const editAccount = (editedAccount) => {
  const parent = data.find(account => account.name === editedAccount.type);
  const index = parent.children.find(account => account.key === editedAccount.key);
  console.log(parent)
  console.log(index)
  parent.children[index] = {
    name: editedAccount.name,
    balance: editedAccount.balance
  };
  message.success(
    `${editedAccount.name} account edited successfully!`,
    { duration: 5e3 }
  )
};

const handleSave = async (newAccount, editing) => {
  if (editing) {
    editAccount(newAccount);
  } else {
    addAccount(newAccount);
  }
}
</script>
