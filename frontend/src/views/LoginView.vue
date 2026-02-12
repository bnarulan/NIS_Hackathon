<template>
  <div class="max-w-sm mx-auto bg-white rounded-xl shadow-sm border border-slate-200 p-6">
    <h1 class="text-lg font-semibold mb-4 text-slate-900">Вход</h1>
    <form class="flex flex-col gap-3" @submit.prevent="submit">
      <div>
        <label class="block text-xs text-slate-500 mb-1">ИИН</label>
        <input
          v-model="iin"
          type="text"
          required
          class="w-full border rounded-md px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
        />
      </div>
      <div>
        <label class="block text-xs text-slate-500 mb-1">Пароль</label>
        <input
          v-model="password"
          type="password"
          required
          class="w-full border rounded-md px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
        />
      </div>
      <button
        type="submit"
        :disabled="loading"
        class="bg-emerald-500 hover:bg-emerald-400 text-white text-sm py-1.5 rounded-md"
      >
        {{ loading ? "Входим..." : "Войти" }}
      </button>
      <p v-if="error" class="text-xs text-red-500 mt-1">{{ error }}</p>
    </form>
    <p class="text-xs text-slate-500 mt-4">
      Нет аккаунта?
      <RouterLink to="/register" class="text-emerald-600">Регистрация</RouterLink>
    </p>
  </div>
</template>

<script setup>
import { ref, computed } from "vue";
import { RouterLink, useRouter } from "vue-router";
import { useAuthStore } from "../stores/auth.js";

const auth = useAuthStore();
const router = useRouter();

const iin = ref("");
const password = ref("");

const loading = computed(() => auth.loading);
const error = computed(() => auth.error);

async function submit() {
  try {
    await auth.login({ iin: iin.value, password: password.value });
    router.push({ name: "feed" });
  } catch {}
}
</script>