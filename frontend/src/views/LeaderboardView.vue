<template>
  <div class="bg-white rounded-xl border border-slate-200 shadow-sm p-4">
    <div class="flex items-center justify-between mb-3">
      <h1 class="text-base font-semibold text-slate-900">Рейтинг пользователей</h1>
      <button
        class="text-xs text-slate-500 hover:text-slate-800"
        @click="load"
      >
        Обновить
      </button>
    </div>
    <table class="w-full text-xs">
      <thead class="bg-slate-50 text-slate-500">
        <tr>
          <th class="text-left px-3 py-2">#</th>
          <th class="text-left px-3 py-2">Роль</th>
          <th class="text-right px-3 py-2">Очки</th>
        </tr>
      </thead>
      <tbody>
        <tr
          v-for="row in rows"
          :key="row.userId"
          class="border-t border-slate-100"
        >
          <td class="px-3 py-2">{{ row.rank }}</td>
          <td class="px-3 py-2">{{ roleLabel(row.role) }}</td>
          <td class="px-3 py-2 text-right font-semibold">{{ row.points }}</td>
        </tr>
      </tbody>
    </table>
    <p v-if="loading" class="text-xs text-slate-500 mt-2">Загрузка...</p>
    <p v-if="error" class="text-xs text-red-500 mt-2">{{ error }}</p>
  </div>
</template>

<script setup>
import { ref } from "vue";
import api from "../api/axios.js";

const rows = ref([]);
const loading = ref(false);
const error = ref(null);

function roleLabel(role) {
  switch (role) {
    case "RESIDENT":
      return "Житель";
    case "CONTRACTOR":
      return "Подрядчик";
    case "CONTROLLER":
      return "Админ";
    default:
      return role;
  }
}

async function load() {
  loading.value = true;
  error.value = null;
  try {
    const { data } = await api.get("/leaderboard");
    rows.value = data;
  } catch (e) {
    error.value = e.response?.data?.error || "Не удалось загрузить рейтинг";
  } finally {
    loading.value = false;
  }
}

load();
</script>