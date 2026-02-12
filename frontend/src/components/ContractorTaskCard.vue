<template>
  <article class="bg-white border border-slate-200 rounded-xl shadow-sm p-4 flex flex-col gap-3">
    <div class="flex items-center justify-between text-xs text-slate-500">
      <span class="font-semibold text-emerald-700">{{ task.category }}</span>
      <span class="text-slate-400">
        Приоритет: {{ task.priorityScore }}
      </span>
    </div>
    <p class="text-sm text-slate-800">
      {{ task.description }}
    </p>
    <form class="flex flex-col gap-2" @submit.prevent="submit">
      <div class="flex gap-2">
        <select
          v-model="status"
          class="border rounded-md px-2 py-1 text-xs flex-1"
        >
          <option value="OPEN">Открыта</option>
          <option value="IN_PROGRESS">В работе</option>
          <option value="DONE">Закрыта</option>
        </select>
        <input
          type="file"
          accept="image/*"
          @change="onBeforeChange"
          class="text-xs"
        />
        <input
          type="file"
          accept="image/*"
          @change="onAfterChange"
          class="text-xs"
        />
      </div>
      <button
        type="submit"
        :disabled="saving"
        class="bg-slate-900 text-white text-xs px-3 py-1 rounded-md self-start"
      >
        {{ saving ? "Сохраняем..." : "Обновить" }}
      </button>
      <p v-if="error" class="text-xs text-red-500">{{ error }}</p>
    </form>
  </article>
</template>

<script setup>
import { ref } from "vue";
import { useContractorStore } from "../stores/contractor.js";

const props = defineProps({
  task: {
    type: Object,
    required: true
  }
});

const contractorStore = useContractorStore();

const status = ref(props.task.status);
const beforePhoto = ref(null);
const afterPhoto = ref(null);
const saving = ref(false);
const error = ref(null);

function onBeforeChange(e) {
  beforePhoto.value = e.target.files?.[0] || null;
}
function onAfterChange(e) {
  afterPhoto.value = e.target.files?.[0] || null;
}

async function submit() {
  saving.value = true;
  error.value = null;
  try {
    await contractorStore.updateTask({
      postId: props.task.id,
      status: status.value,
      beforePhoto: beforePhoto.value,
      afterPhoto: afterPhoto.value
    });
  } catch (e) {
    error.value = e.response?.data?.error || "Не удалось обновить задачу";
  } finally {
    saving.value = false;
  }
}
</script>