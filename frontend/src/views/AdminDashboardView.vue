<template>
  <div class="flex flex-col gap-4">
    <div class="flex items-center justify-between">
      <h1 class="text-base font-semibold text-slate-900">Админ панель</h1>
      <button
        class="text-xs text-slate-500 hover:text-slate-800"
        @click="load"
      >
        Обновить
      </button>
    </div>

    <StatsCards v-if="admin.stats" :stats="admin.stats" />

    <div v-if="admin.stats" class="mt-4">
      <h2 class="text-sm font-semibold mb-2 text-slate-900">Heatmap</h2>
      <MapView :points="admin.stats.heatmap" />
    </div>

    <div v-if="admin.stats" class="mt-4">
      <h2 class="text-sm font-semibold mb-2 text-slate-900">
        Рейтинг подрядчиков
      </h2>
      <table class="w-full text-xs bg-white rounded-xl border border-slate-200 overflow-hidden">
        <thead class="bg-slate-50 text-slate-500">
          <tr>
            <th class="text-left px-3 py-2">#</th>
            <th class="text-left px-3 py-2">ID</th>
            <th class="text-right px-3 py-2">Очки</th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="(c, idx) in admin.stats.contractorRanking"
            :key="c.id"
            class="border-t border-slate-100"
          >
            <td class="px-3 py-2">{{ idx + 1 }}</td>
            <td class="px-3 py-2">{{ c.id }}</td>
            <td class="px-3 py-2 text-right font-semibold">{{ c.points }}</td>
          </tr>
        </tbody>
      </table>
    </div>

    <p v-if="admin.loading" class="text-xs text-slate-500">Загрузка...</p>
    <p v-if="admin.error" class="text-xs text-red-500">{{ admin.error }}</p>
  </div>
</template>

<script setup>
import { onMounted } from "vue";
import { useAdminStore } from "../stores/admin.js";
import StatsCards from "../components/StatsCards.vue";
import MapView from "../components/MapView.vue";

const admin = useAdminStore();

async function load() {
  await admin.fetchStats();
}

onMounted(load);
</script>