<template>
  <event-modal
    ref="modal"
    @handle-save="handleSave"
  />
  <n-calendar v-if="store.isLarge">
    <template #default="{ year, month, date }">
      <div class="events flex flex-col gap-1 -m-1">
        <EventTag 
          v-for="item in store.events" 
          :key="item._id" 
          :item="item" 
          :year="year" 
          :month="month" 
          :date="date" 
          @dropdown-selected="handleDropdownSelection"
        />
      </div>
    </template>
  </n-calendar>
  <n-el v-if="!store.isLarge" class="date-picker-wrapper">
    <n-date-picker
      panel
      type="date"
      :is-date-disabled="dateDisabled"
      :actions="[]"
      v-model:value="dateValue"
      @update-value="handleSelect"
      style="border: 1px solid var(--divider-color);"
    />
    <div class="flex flex-col gap-4 my-4">
      <template v-for="event in events">
        <n-tag :bordered="false" :type="event.type" size="large" :style="{width: '290px'}">
          {{ event.tag }}
        </n-tag>
      </template>
    </div>
  </n-el>
</template>

<script setup>
import { ref, h } from "vue";
import { 
  NCalendar, 
  NTag, 
  NDatePicker, 
  NEl,
  useMessage, 
  useDialog
} from "naive-ui";
import EventModal from '@/components/EventModal.vue';
import EventTag from '@/components/EventTag.vue';
import useUserStore from '@/store/user';

const store = useUserStore();
const message = useMessage();
const dialog = useDialog();
const modal = ref(null);
const dateValue = ref(null);
const events = ref([]);

const datesMap = store.events.reduce((acc, event) => {
  if (!acc[event.timestamp]) {
    acc[event.timestamp] = [];
  }
  acc[event.timestamp].push(event);
  return acc;
}, {});

const dateDisabled = (ts) => !datesMap[ts];

const openEventModal = (event) => {
  modal.value.openModal(event)
};

const handleEdit = (id) => {
  const index = store.events.findIndex((item) => item._id === id);
  const { year, month, day, tag, type } = store.events[index];
  const event = {
    date: new Date(year, month - 1, day),
    tag,
    type,
    id
  }
  modal.value.openModal(event);
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
  const timestamp = new Date(date).getTime();
  console.log('timestamp', timestamp)
  const dateObj = getYearMonthDate(new Date(date));
  const editedDateObj = {
    ...dateObj,
    timestamp,
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

const handleSelect = (date) => {
  events.value = datesMap[date];
};

defineExpose({ openEventModal });
</script>

<style>
.n-calendar-cell.n-calendar-cell--current>.n-calendar-date>.n-calendar-date__date {
  @apply h-4 w-4;
}

.date-picker-wrapper .n-date-panel-calendar {
  background: var(--card-color) !important;
}

.date-picker-wrapper .n-date-panel .n-date-panel-dates .n-date-panel-date.n-date-panel-date--disabled {
  font-weight: 400;
}

.date-picker-wrapper .n-date-panel .n-date-panel-dates .n-date-panel-date {
  font-weight: 900;
  padding-bottom: .25rem;
}

.date-picker-wrapper .n-date-panel .n-date-panel-dates .n-date-panel-date::after {
  content: '.';
  position: absolute;
  top: .5rem;
}

.date-picker-wrapper .n-date-panel .n-date-panel-dates .n-date-panel-date.n-date-panel-date--disabled::after {
  content: '';
}

.date-picker-wrapper .n-date-panel .n-date-panel-dates .n-date-panel-date.n-date-panel-date--selected {
  background: var(--n-item-color-active);
}

.date-picker-wrapper .n-date-panel-date.n-date-panel-date--current>.n-date-panel-date__sup{
  display: none;
}

.date-picker-wrapper .n-date-panel.n-date-panel--date {
  transform-origin: top left;
}
</style>