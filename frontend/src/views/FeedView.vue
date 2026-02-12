<template>
  <div class="grid grid-cols-1 md:grid-cols-[2fr,1.5fr] gap-6 items-start">
    <div class="flex flex-col gap-4">
      <PostForm />
      <div class="flex items-center justify-between">
        <h1 class="text-base font-semibold text-slate-900">Лента проблем</h1>
        <button
          class="text-xs text-slate-500 hover:text-slate-800"
          @click="refresh"
        >
          Обновить
        </button>
      </div>
      <div class="flex flex-col gap-3">
        <PostCard
          v-for="post in posts.items"
          :key="post.id"
          :post="post"
        />
        <p v-if="!posts.items.length && !posts.loading" class="text-xs text-slate-500">
          Пока нет проблем.
        </p>
        <p v-if="posts.loading" class="text-xs text-slate-500">Загрузка...</p>
        <p v-if="posts.error" class="text-xs text-red-500">{{ posts.error }}</p>
      </div>
    </div>
    <div class="flex flex-col gap-4">
      <div>
        <h2 class="text-sm font-semibold mb-2 text-slate-900">Карта (heatmap)</h2>
        <MapView :points="posts.items" />
      </div>
    </div>
  </div>
</template>

<script setup>
import { onMounted } from "vue";
import { usePostsStore } from "../stores/posts.js";
import PostForm from "../components/PostForm.vue";
import PostCard from "../components/PostCard.vue";
import MapView from "../components/MapView.vue";

const posts = usePostsStore();

async function refresh() {
  await posts.fetch();
}

onMounted(async () => {
  posts.initSocket();
  await posts.fetch();
});
</script>