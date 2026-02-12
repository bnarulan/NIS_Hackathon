<template>
  <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
    <div class="bg-white rounded-xl border border-slate-200 p-4">
      <p class="text-xs text-slate-500">Среднее время решения</p>
      <p class="text-2xl font-semibold mt-1">
        {{ stats.avgResolutionHours.toFixed(1) }} ч
      </p>
    </div>
    <div class="bg-white rounded-xl border border-slate-200 p-4">
      <p class="text-xs text-slate-500">SLA нарушения</p>
      <p class="text-2xl font-semibold mt-1">
        {{ stats.slaBreaches }}
      </p>
    </div>
    <div class="bg-white rounded-xl border border-slate-200 p-4">
      <p class="text-xs text-slate-500">Подрядчиков в рейтинге</p>
      <p class="text-2xl font-semibold mt-1">
        {{ stats.contractorRanking.length }}
      </p>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  stats: {
    type: Object,
    required: true
  }
});
</script>