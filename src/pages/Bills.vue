<template>
  <n-space>
    <n-button @click="handleConfirm">
      Confirm
    </n-button>
    <n-button @click="handleSuccess">
      Success
    </n-button>
    <n-button @click="handleError">
      Error
    </n-button>
  </n-space>
</template>

<script setup>
import { useMessage, useDialog } from "naive-ui";
import { NSpace, NButton } from 'naive-ui';


const message = useMessage();
const dialog = useDialog();

const handleConfirm = () => {
  dialog.warning({
    title: "Confirm",
    content: "Are you sure?",
    positiveText: "Sure",
    negativeText: "Not Sure",
    onPositiveClick: () => {
      message.success("Sure");
    },
    onNegativeClick: () => {
      message.error("Not Sure");
    }
  });
};

const handleSuccess = () => {
  dialog.success({
    title: "Success",
    content: "Cool",
    positiveText: "Wow!",
    onPositiveClick: () => {
      message.success("Great!");
    }
  });
};

const handleError = () => {
  dialog.error({
    title: "Error",
    content: "A mistake.",
    positiveText: "Ahhh!",
    onPositiveClick: () => {
      message.success("I knew it...");
    }
  });
};
</script>
