<template>
  <div class="border-t border-slate-100 pt-2 mt-1">
    <div class="flex gap-2 items-center">
      <input
        v-model="text"
        :disabled="submitted"
        type="text"
        placeholder="Оставьте один комментарий..."
        class="flex-1 border rounded-md px-2 py-1 text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500"
      />
      <button
        class="bg-slate-900 text-white text-xs px-3 py-1 rounded-md disabled:bg-slate-400"
        :disabled="submitted || !text"
        @click="submit"
      >
        Отправить
      </button>
    </div>
    <p v-if="error" class="text-xs text-red-500 mt-1">{{ error }}</p>
    <p v-if="submitted" class="text-xs text-emerald-600 mt-1">
      Комментарий сохранён (1 комментарий на пользователя).
    </p>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { usePostsStore } from "../stores/posts.js";

const props = defineProps({
  postId: {
    type: Number,
    required: true
  }
});

const posts = usePostsStore();

const text = ref("");
const submitted = ref(false);
const error = ref(null);

async function submit() {
  error.value = null;
  try {
    await posts.commentPost(props.postId, text.value);
    submitted.value = true;
  } catch (e) {
    error.value = e.response?.data?.error || "Ошибка при отправке комментария";
  }
}
</script>