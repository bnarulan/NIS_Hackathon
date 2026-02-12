import { createRouter, createWebHistory } from "vue-router";
import { useAuthStore } from "../stores/auth.js";

import LoginView from "../views/LoginView.vue";
import RegisterView from "../views/RegisterView.vue";
import FeedView from "../views/FeedView.vue";
import ContractorDashboardView from "../views/ContractorDashboardView.vue";
import AdminDashboardView from "../views/AdminDashboardView.vue";
import LeaderboardView from "../views/LeaderboardView.vue";

const routes = [
  { path: "/login", name: "login", component: LoginView },
  { path: "/register", name: "register", component: RegisterView },
  { path: "/", name: "feed", component: FeedView, meta: { requiresAuth: true } },
  {
    path: "/contractor",
    name: "contractor",
    component: ContractorDashboardView,
    meta: { requiresAuth: true, role: "CONTRACTOR" }
  },
  {
    path: "/admin",
    name: "admin",
    component: AdminDashboardView,
    meta: { requiresAuth: true, role: "CONTROLLER" }
  },
  {
    path: "/leaderboard",
    name: "leaderboard",
    component: LeaderboardView,
    meta: { requiresAuth: true }
  }
];

const router = createRouter({
  history: createWebHistory(),
  routes
});

router.beforeEach((to, from, next) => {
  const auth = useAuthStore();
  if (to.meta.requiresAuth && !auth.isAuthenticated) {
    return next({ name: "login" });
  }
  if (to.meta.role && auth.user?.role !== to.meta.role) {
    return next({ name: "feed" });
  }
  next();
});

export default router;