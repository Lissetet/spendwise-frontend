<template>
  <h1>Accounts</h1>
  <AccountModal
    ref="modal"
    @handle-save="handleSave"
  />
  <n-card class="w-fit">
  <div class="flex">
    <n-statistic label="Total Cash">
      <span class="font-semibold text-base">
        {{ formatCurrency(totalValues.cash) }}
      </span>
    </n-statistic>
    <div :class="`${isDark ? 'bg-neutral-800' : 'bg-neutral-100'} w-px mx-6`"/>
    <n-statistic label="Total Debt">
      <span class="font-semibold text-base">
        {{ formatCurrency(totalValues.debt) }}
      </span>
    </n-statistic>
    <div :class="`${isDark ? 'bg-neutral-800' : 'bg-neutral-100'} w-px mx-6`"/>
    <n-statistic label="Total Investments">
      <span class="font-semibold text-base">
        {{ formatCurrency(totalValues.investments) }}
      </span>
    </n-statistic>
    <div :class="`${isDark ? 'bg-neutral-800' : 'bg-neutral-100'} w-px mx-6`"/>
    <n-statistic label="Total Property">
      <span class="font-semibold text-base">
        {{ formatCurrency(totalValues.property) }}
      </span>
    </n-statistic>
    <div :class="`${isDark ? 'bg-neutral-800' : 'bg-neutral-100'} w-px mx-6`"/>
    <n-statistic label="Net Total">
      <span class="font-semibold text-base">
        {{ formatCurrency(totalValues.all) }}
      </span>
    </n-statistic>
  </div>
</n-card>
  <div class="flex justify-start my-10 gap-4">
    <n-button type="primary" @click="openAccountModal('Add Account')">
      <Icon icon="material-symbols:add" class="pr-2"/>
      Add Account
    </n-button>
    <account-modal />
  </div>
  <n-data-table
    :columns="columns"
    :data="data"
    :row-class-name="row => row.children && 'font-bold'"
    :summary="createSummary"
    :row-key="row => row._id ? row._id : row.key"
    default-expand-all
    class="mb-10"
  />
</template>

<script setup>


import { ref, h, reactive, onMounted, inject } from "vue";
import { useAuth0 } from '@auth0/auth0-vue';
const { user } = useAuth0();
import { Icon } from "@iconify/vue";
import { NDataTable, NButton, NStatistic, NDropdown, useMessage, useDialog, NCard } from "naive-ui";
import axios from "axios";
import AccountModal from "@/components/AccountModal.vue";

const baseURL = import.meta.env.VITE_BASE_URL;
const userId = user._rawValue.sub;
const isDark = inject('isDarkTheme', ref('isDarkTheme'));

const message = useMessage();
const dialog = useDialog();
const modal = ref(null);

const openAccountModal = (currentTitle, account) => {
  modal.value.openModal(currentTitle, account);
};

const rawData = reactive([]);

const accountTypes = reactive({
  cash: {},
  checking: {},
  savings: {},
  investment: {},
  credit: {},
  loan: {},
  property: {},
})

const totalValues = reactive({})
const data = ref([]);

const setData = (rawData) => {
  const accountTypesList = ['cash', 'checking', 'savings', 'investment', 'credit', 'loan', 'property']
  accountTypesList.forEach((accountType, index) => {
    const children = rawData.filter(account => account.type === accountType);
    accountTypes[accountType] = {
      name: accountType,
      children: children,
      balance: children.reduce((acc, account) => acc + account.balance, 0),
    };

    data.value[index] = {};
    data.value[index].key = accountType;
    data.value[index].name = accountType;
    data.value[index].balance = accountTypes[accountType].balance;
    data.value[index].children = accountTypes[accountType].children;
  });

  totalValues.cash = accountTypes.cash.balance + accountTypes.checking.balance + accountTypes.savings.balance;
  totalValues.debt = accountTypes.credit.balance + accountTypes.loan.balance;
  totalValues.investments = accountTypes.investment.balance;
  totalValues.property = accountTypes.property.balance;
  totalValues.all = accountTypes.cash.balance + accountTypes.checking.balance + accountTypes.savings.balance + accountTypes.credit.balance + accountTypes.loan.balance + accountTypes.investment.balance + accountTypes.property.balance;
};

const getAllAccounts = async () => {
  axios.get(`${baseURL}/accounts?user=${userId}`)
    .then(response => {
      rawData.push(...response.data)
      setData(rawData)
    })
    .catch(error => {
      console.log(error)
    })
};

onMounted(getAllAccounts);

const formatCurrency = (amount) => {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amount);
};

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
      value: h("span", { class: 'font-bold' }, formatCurrency(totalBalance)),
      colSpan: 2
    },
  };
};

const addAccount = (accountData) => {
  let newAccount = {}
  const accountBody = {
    user: userId,
    name: accountData.name,
    type: accountData.type,
  }
  axios.post(`${baseURL}/accounts`, accountBody)
    .then(response => {
      newAccount = response.data;
      if (accountData.balance !== 0) {
        const transactionBody = {
          user: userId,
          account: newAccount._id,
          amount: accountData.balance,
          description: 'Opening Balance',
        }
        axios.post(`${baseURL}/transactions`, transactionBody)
          .then(response => {
            const balance = response.data.amount;
            newAccount = { ...newAccount, balance }
            rawData.push(newAccount);
            setData(rawData);
          })
          .catch(error => {
            console.log(error)
          })
      } else {
        newAccount = { ...newAccount, balance: 0 }
        rawData.push(newAccount);
        setData(rawData);
      }
    })
    .catch(error => {
      console.log(error)
    })
    .finally(() => {
      message.success(
        `${accountData.name} account added successfully!`,
        { duration: 5e3 }
      )
    })
};

const updateAccount = (editedAccount) => {
  const accountIndex = rawData.findIndex(account => account._id === editedAccount._id);
  rawData[accountIndex] = {
    ...rawData[accountIndex],
    name: editedAccount.name,
    type: editedAccount.type,
  };
  setData(rawData);
};

const editAccount = (editedAccount) => {
  axios.patch(`${baseURL}/accounts/${editedAccount._id}`, {
    name: editedAccount.name,
    type: editedAccount.type,
  })
    .then(response => {
      updateAccount(response.data);
      setData(rawData);
      message.success(
        `${editedAccount.name} account edited successfully!`,
        { duration: 5e3 }
      )
    })
    .catch(error => {
      console.log(error)
    })
};

const deleteAccount = (row, displayMessage=true) => {
  axios.delete(`${baseURL}/accounts/${row._id}`)
    .then(response => {
      const accountIndex = rawData.findIndex(account => account._id === row._id);
      rawData.splice(accountIndex, 1);
      setData(rawData);
      displayMessage && message.success(
        `${row.name} account deleted successfully!`,
        { duration: 5e3 }
      )
    })
    .catch(error => {
      console.log(error)
    })
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
    onPositiveClick: () => deleteAccount(row)
  });
}


const handleSave = async (newAccount, editing) => {
  if (editing) {
    editAccount(newAccount);
  } else {
    addAccount(newAccount);
  }
}
</script>
