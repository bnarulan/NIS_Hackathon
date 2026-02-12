<template>
  <div class="min-h-screen flex flex-col">
    <header class="bg-slate-900 text-white px-4 py-3 flex items-center justify-between">
      <div class="flex items-center gap-3">
        <span class="font-semibold text-lg">GovTech Issues</span>
        <span class="text-xs text-slate-300">MVP</span>
      </div>
      <nav class="flex items-center gap-4 text-sm">
        <RouterLink
          v-if="isAuth"
          to="/"
          class="hover:text-emerald-300 transition"
        >
          Лента
        </RouterLink>
        <RouterLink
          v-if="isAuth"
          to="/leaderboard"
          class="hover:text-emerald-300 transition"
        >
          Рейтинг
        </RouterLink>
        <RouterLink
          v-if="isAuth && user?.role === 'CONTRACTOR'"
          to="/contractor"
          class="hover:text-emerald-300 transition"
        >
          Подрядчик
        </RouterLink>
        <RouterLink
          v-if="isAuth && user?.role === 'CONTROLLER'"
          to="/admin"
          class="hover:text-emerald-300 transition"
        >
          Админ
        </RouterLink>
        <button
          v-if="isAuth"
          @click="logout"
          class="bg-emerald-500 hover:bg-emerald-400 text-white px-3 py-1 rounded-md text-xs"
        >
          Выйти
        </button>
        <RouterLink
          v-else
          to="/login"
          class="bg-emerald-500 hover:bg-emerald-400 text-white px-3 py-1 rounded-md text-xs"
        >
          Войти
        </RouterLink>
      </nav>
    </header>

    <main class="flex-1 max-w-6xl mx-auto w-full px-4 py-6">
      <slot />
    </main>
  </div>
</template>

<script setup>
import { RouterLink } from "vue-router";
import { storeToRefs } from "pinia";
import { useAuthStore } from "../stores/auth.js";

const auth = useAuthStore();
const { isAuthenticated: isAuth, user } = storeToRefs(auth);

function logout() {
  auth.logout();
}
</script>