// auth.js store placeholder
import { defineStore } from "pinia";
import api from "../api/axios.js";

export const useAuthStore = defineStore("auth", {
  state: () => ({
    user: null,
    token: localStorage.getItem("token") || null,
    loading: false,
    error: null
  }),
  getters: {
    isAuthenticated: (state) => !!state.token
  },
  actions: {
    async login({ iin, password }) {
      this.loading = true;
      this.error = null;
      try {
        const { data } = await api.post("/auth/login", { iin, password });
        this.token = data.token;
        this.user = data.user;
        localStorage.setItem("token", data.token);
      } catch (e) {
        this.error = e.response?.data?.error || "Login failed";
        throw e;
      } finally {
        this.loading = false;
      }
    },
    async register({ iin, password, role }) {
      this.loading = true;
      this.error = null;
      try {
        const { data } = await api.post("/auth/register", {
          iin,
          password,
          role
        });
        this.token = data.token;
        this.user = data.user;
        localStorage.setItem("token", data.token);
      } catch (e) {
        this.error = e.response?.data?.error || "Registration failed";
        throw e;
      } finally {
        this.loading = false;
      }
    },
    logout() {
      this.token = null;
      this.user = null;
      localStorage.removeItem("token");
    }
  }
});