<template>
  <event-modal
    ref="modal"
    @handle-save="handleSave"
  />
  <n-calendar>
    <template #default="{ year, month, date }">
      <div class="flex flex-col gap-1">
        <template v-for="item in store.events">
          <div 
            :key="item._id"
            class="flex gap-2" 
            v-if="year === item.year && month === item.month && date === item.day"
          >
            <n-tag :type="item.type">{{ item.tag }}</n-tag>
            <n-dropdown :options="dropDownOptions.map(option => ({ ...option, id: item._id }))" @select="(key) => handleDropdownSelection(key, item._id)">
              <n-button text>
                <Icon icon="material-symbols:settings" />
              </n-button>
            </n-dropdown>
          </div>
        </template>
      </div>
    </template>
  </n-calendar>
</template>

`<script setup>
import { ref, h, onMounted } from "vue";
import { Icon } from '@iconify/vue';
import { NCalendar, NTag, NDropdown, NButton,  useMessage, useDialog } from "naive-ui";
import EventModal from '@/components/EventModal.vue';
import useUserStore from '@/store/user';
const store = useUserStore();

const message = useMessage();
const dialog = useDialog();
const modal = ref(null);


const openEventModal = (title, event) => {
  modal.value.openModal(title, event)
};

defineExpose({ openEventModal });

const renderIcon = icon => () => h(Icon, { icon });

const dropDownOptions = [
  {
    label: "Edit",
    icon: renderIcon("material-symbols:edit"),
    key: "edit",
  },
  {
    label: "Delete",
    icon: renderIcon("material-symbols:delete"),
    key: "delete",
  },
];

const handleEdit = (id) => {
  const index = store.events.findIndex((item) => item._id === id);
  const { year, month, day, tag, type } = store.events[index];

  const event = {
    date: new Date(year, month - 1, day),
    tag,
    type,
    id
  }

  modal.value.openModal("Edit Event", event);
};

const handleDropdownSelection = (key, id) => {
  if (key === "delete") {
    handleDelete(id);
  } else {
    handleEdit(id);
  }
};

const getYearMonthDate = (date) => {
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const day = date.getDate();
  return { year, month, day };
};

const handleSave = (newEvent, editing) => {
  const { date, tag, type } = newEvent;
  const dateObj = getYearMonthDate(new Date(date));
  const editedDateObj = {
    ...dateObj,
    tag,
    type
  }
  if (!editing) {
    store.addEvent({...editedDateObj, user: store.user.sub});
  } else {
    store.editEvent(editedDateObj, newEvent._id);

  }
  message.success(
    `${editedDateObj.tag} ${ editing ? 'added' : 'updated' } successfully!`,
    { duration: 5e3 }
  );
  modal.value.closeModal();
};

const handleDelete = (id) => {
  dialog.error({
    title: "Delete Event",
    content: () => {
      return h('div', [
        h('p', `Are you sure you want to delete this event?`),
        h('p', { class: 'font-semibold' }, `This action cannot be undone.`)
      ]);
    },
    positiveText: "Delete",
    negativeText: "Cancel",
    onPositiveClick: () => {
      store.deleteEvent(id);
      message.success(
        `Event deleted successfully!`,
        { duration: 5e3 }
      );
    }
  });
};

onMounted(() => {
  store.fetchEvents();
});
</script>
