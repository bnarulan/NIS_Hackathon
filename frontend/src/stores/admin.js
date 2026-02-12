// admin.js store placeholder
import { defineStore } from "pinia";
import api from "../api/axios.js";

export const useAdminStore = defineStore("admin", {
  state: () => ({
    stats: null,
    loading: false,
    error: null
  }),
  actions: {
    async fetchStats() {
      this.loading = true;
      this.error = null;
      try {
        const { data } = await api.get("/admin/stats");
        this.stats = data;
      } catch (e) {
        this.error = e.response?.data?.error || "Failed to load stats";
      } finally {
        this.loading = false;
      }
    }
  }
});