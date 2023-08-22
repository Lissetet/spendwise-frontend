<template>
  <h1>Accounts</h1>
  <AccountModal
    ref="modal"
    @handle-save="handleSave"
  />
  <account-summary/>
  <div class="flex justify-start my-10 gap-4">
    <n-button type="primary" @click="openAccountModal()">
      <Icon icon="material-symbols:add" class="pr-2"/>
      Add Account
    </n-button>
    <account-modal />
  </div>
  <account-table />
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

const openAccountModal = () => {
  modal.value.openModal();
};

const handleSave = async (newAccount) => {
  store.addAccount(newAccount);
  message.success(`${newAccount.name} added successfully!`)
}

onMounted(store.fetchAccounts);
</script>
