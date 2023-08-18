<template>
  <h1>Accounts</h1>
  <AccountModal
    ref="modal"
    @handle-save="handleSave"
  />
  <account-summary :formatCurrency="formatCurrency"/>
  <div class="flex justify-start my-10 gap-4">
    <n-button type="primary" @click="openAccountModal('Add Account')">
      <Icon icon="material-symbols:add" class="pr-2"/>
      Add Account
    </n-button>
    <account-modal />
  </div>
  <account-table :formatCurrency="formatCurrency"/>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { Icon } from "@iconify/vue";
import { NButton, useMessage } from "naive-ui";
import AccountModal from "@/components/AccountModal.vue";
import AccountSummary from '@/components/AccountSummary.vue';
import AccountTable from "@/components/AccountTable.vue";


import useUserStore from '@/store/user';
const store = useUserStore();

const message = useMessage();
const modal = ref(null);

const openAccountModal = (currentTitle, account) => {
  modal.value.openModal(currentTitle, account);
};

onMounted(()=> {
  store.fetchAccounts();
});

const formatCurrency = (amount) => {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amount);
};

const handleSave = async (newAccount, editing) => {
  if (editing) {
    store.editAccount(newAccount);
    message.success(
      `${newAccount.name} account edited successfully!`,
      { duration: 5e3 }
    )
  } else {
    store.addAccount(newAccount);
    message.success(
      `${newAccount.name} account added successfully!`,
      { duration: 5e3 }
    )
  }
}
</script>
