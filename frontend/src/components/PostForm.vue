<template>
  <form
    class="bg-white border border-slate-200 rounded-xl shadow-sm p-4 flex flex-col gap-3"
    @submit.prevent="submit"
  >
    <h2 class="text-sm font-semibold text-slate-800">Новая проблема</h2>

    <div class="grid grid-cols-1 md:grid-cols-2 gap-3">
      <div>
        <label class="block text-xs text-slate-500 mb-1">Категория</label>
        <input
          v-model="category"
          type="text"
          required
          class="w-full border rounded-md px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
        />
      </div>
      <div>
        <label class="block text-xs text-slate-500 mb-1">Фото</label>
        <input
          type="file"
          accept="image/*"
          @change="onFileChange"
          class="w-full text-xs"
        />
      </div>
    </div>

    <div>
      <label class="block text-xs text-slate-500 mb-1">Описание</label>
      <textarea
        v-model="description"
        required
        rows="3"
        class="w-full border rounded-md px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
      ></textarea>
    </div>

    <div class="grid grid-cols-2 gap-3">
      <div>
        <label class="block text-xs text-slate-500 mb-1">Широта</label>
        <input
          v-model.number="lat"
          type="number"
          step="0.000001"
          class="w-full border rounded-md px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
        />
      </div>
      <div>
        <label class="block text-xs text-slate-500 mb-1">Долгота</label>
        <input
          v-model.number="lng"
          type="number"
          step="0.000001"
          class="w-full border rounded-md px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
        />
      </div>
    </div>

    <div class="flex items-center justify-between mt-2">
      <span class="text-xs text-slate-400">
        Максимум 3 поста в сутки
      </span>
      <button
        type="submit"
        :disabled="submitting"
        class="bg-emerald-500 hover:bg-emerald-400 disabled:bg-emerald-300 text-white text-xs px-3 py-1.5 rounded-md"
      >
        {{ submitting ? "Сохраняем..." : "Опубликовать" }}
      </button>
    </div>

    <p v-if="error" class="text-xs text-red-500 mt-1">{{ error }}</p>
  </form>
</template>

<script setup>
import { ref } from "vue";
import { usePostsStore } from "../stores/posts.js";

const posts = usePostsStore();

const category = ref("");
const description = ref("");
const lat = ref(null);
const lng = ref(null);
const file = ref(null);
const submitting = ref(false);
const error = ref(null);

function onFileChange(e) {
  file.value = e.target.files?.[0] || null;
}

async function submit() {
  submitting.value = true;
  error.value = null;
  try {
    await posts.createPost({
      category: category.value,
      description: description.value,
      lat: lat.value,
      lng: lng.value,
      photo: file.value
    });
    category.value = "";
    description.value = "";
    lat.value = null;
    lng.value = null;
    file.value = null;
  } catch (e) {
    error.value = e.response?.data?.error || "Не удалось создать пост";
  } finally {
    submitting.value = false;
  }
}
</script>