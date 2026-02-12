// contractor.js store placeholder
import { defineStore } from "pinia";
import api from "../api/axios.js";

export const useContractorStore = defineStore("contractor", {
  state: () => ({
    tasks: [],
    loading: false,
    error: null
  }),
  actions: {
    async fetchTasks() {
      this.loading = true;
      this.error = null;
      try {
        const { data } = await api.get("/contractor/tasks");
        this.tasks = data;
      } catch (e) {
        this.error = e.response?.data?.error || "Failed to load tasks";
      } finally {
        this.loading = false;
      }
    },
    async updateTask({ postId, status, beforePhoto, afterPhoto }) {
      const form = new FormData();
      form.append("status", status);
      if (beforePhoto) form.append("before", beforePhoto);
      if (afterPhoto) form.append("after", afterPhoto);

      const { data } = await api.put(`/contractor/tasks/${postId}`, form, {
        headers: { "Content-Type": "multipart/form-data" }
      });

      const idx = this.tasks.findIndex((t) => t.id === data.post.id);
      if (idx !== -1) this.tasks[idx] = data.post;
    }
  }
});