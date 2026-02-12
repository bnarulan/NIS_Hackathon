<template>
  <article class="bg-white rounded-xl shadow-sm border border-slate-200 p-4 flex flex-col gap-3">
    <div class="flex items-center justify-between text-xs text-slate-500">
      <span class="font-semibold uppercase tracking-wide text-emerald-700">
        {{ post.category }}
      </span>
      <span :class="['px-2 py-0.5 rounded-full', statusBadgeClass]">
        {{ statusLabel }}
      </span>
    </div>

    <p class="text-sm text-slate-800">
      {{ post.description }}
    </p>

    <div v-if="post.photoUrl" class="mt-1">
      <img
        :src="apiBase.replace('/api', '') + post.photoUrl"
        alt="photo"
        class="w-full h-48 object-cover rounded-lg"
      />
    </div>

    <div class="flex flex-wrap items-center justify-between gap-2 text-xs text-slate-500 mt-2">
      <span>Приоритет: <span class="font-semibold">{{ post.priorityScore }}</span></span>
      <span>Лайки: {{ post.likesCount || 0 }}</span>
      <span>Комментарии: {{ post.commentsCount || 0 }}</span>
      <span>{{ new Date(post.createdAt).toLocaleString() }}</span>
    </div>

    <div class="flex items-center gap-3 mt-2">
      <LikeButton :post-id="post.id" />
      <button
        class="text-xs text-slate-500 hover:text-slate-700"
        @click="toggleComments"
      >
        Комментарии
      </button>
    </div>

    <CommentSection
      v-if="showComments"
      :post-id="post.id"
      class="mt-2"
    />
  </article>
</template>

<script setup>
import { computed, ref } from "vue";
import LikeButton from "./LikeButton.vue";
import CommentSection from "./CommentSection.vue";

const props = defineProps({
  post: {
    type: Object,
    required: true
  }
});

const showComments = ref(false);
const apiBase = import.meta.env.VITE_API_BASE_URL || "http://localhost:3000/api";

function toggleComments() {
  showComments.value = !showComments.value;
}

const statusLabel = computed(() => {
  switch (props.post.status) {
    case "OPEN":
      return "Открыта";
    case "IN_PROGRESS":
      return "В работе";
    case "DONE":
      return "Закрыта";
    default:
      return props.post.status;
  }
});

const statusBadgeClass = computed(() => {
  switch (props.post.status) {
    case "OPEN":
      return "bg-red-50 text-red-700 border border-red-100";
    case "IN_PROGRESS":
      return "bg-amber-50 text-amber-700 border border-amber-100";
    case "DONE":
      return "bg-emerald-50 text-emerald-700 border border-emerald-100";
    default:
      return "bg-slate-100 text-slate-600";
  }
});
</script>