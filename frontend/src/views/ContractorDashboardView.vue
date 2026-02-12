<template>
  <div class="flex flex-col gap-4">
    <div class="flex items-center justify-between">
      <h1 class="text-base font-semibold text-slate-900">Задачи подрядчика</h1>
      <button
        class="text-xs text-slate-500 hover:text-slate-800"
        @click="load"
      >
        Обновить
      </button>
    </div>
    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
      <ContractorTaskCard
        v-for="task in contractor.tasks"
        :key="task.id"
        :task="task"
      />
    </div>
    <p v-if="!contractor.tasks.length && !contractor.loading" class="text-xs text-slate-500">
      Задач нет.
    </p>
    <p v-if="contractor.loading" class="text-xs text-slate-500">Загрузка...</p>
    <p v-if="contractor.error" class="text-xs text-red-500">{{ contractor.error }}</p>
  </div>
</template>

<script setup>
import { onMounted } from "vue";
import { useContractorStore } from "../stores/contractor.js";
import ContractorTaskCard from "../components/ContractorTaskCard.vue";

const contractor = useContractorStore();

async function load() {
  await contractor.fetchTasks();
}

onMounted(load);
</script>