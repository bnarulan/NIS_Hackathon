<template>
  <button
    class="text-xs bg-slate-900 text-white px-3 py-1 rounded-md hover:bg-slate-800 disabled:bg-slate-500"
    :disabled="clicked"
    @click="like"
  >
    {{ clicked ? "Лайк учтён" : "Лайк" }}
  </button>
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
const clicked = ref(false);

async function like() {
  try {
    await posts.likePost(props.postId);
    clicked.value = true;
  } catch {
    clicked.value = true;
  }
}
</script>