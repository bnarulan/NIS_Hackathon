<template>
  <div ref="mapContainer" class="w-full h-80 rounded-xl overflow-hidden border border-slate-200"></div>
</template>

<script setup>
import { onMounted, ref, watch } from "vue";
import L from "leaflet";

const props = defineProps({
  points: {
    type: Array,
    required: true
  }
});

const mapContainer = ref(null);
let mapInstance;
let layerGroup;

onMounted(() => {
  mapInstance = L.map(mapContainer.value).setView([51.1605, 71.4704], 11);

  L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    attribution: "&copy; OpenStreetMap contributors"
  }).addTo(mapInstance);

  layerGroup = L.layerGroup().addTo(mapInstance);
  renderPoints();
});

watch(
  () => props.points,
  () => {
    renderPoints();
  },
  { deep: true }
);

function renderPoints() {
  if (!layerGroup) return;
  layerGroup.clearLayers();
  props.points.forEach((p) => {
    if (p.lat == null || p.lng == null) return;
    const intensity = (p.priorityScore || 0) / 100;
    const color =
      intensity > 0.7
        ? "#ef4444"
        : intensity > 0.4
        ? "#f97316"
        : "#22c55e";

    L.circleMarker([p.lat, p.lng], {
      radius: 6 + intensity * 8,
      color,
      fillColor: color,
      fillOpacity: 0.6
    })
      .bindPopup(
        `<div><strong>Приоритет: ${p.priorityScore}</strong><br/>Статус: ${p.status}</div>`
      )
      .addTo(layerGroup);
  });
}
</script>

<style scoped>
.leaflet-container {
  width: 100%;
  height: 100%;
}
</style>