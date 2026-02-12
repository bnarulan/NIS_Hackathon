// posts.js store placeholder
import { defineStore } from "pinia";
import { io } from "socket.io-client";
import api from "../api/axios.js";

export const usePostsStore = defineStore("posts", {
  state: () => ({
    items: [],
    loading: false,
    error: null,
    socket: null
  }),
  actions: {
    async fetch() {
      this.loading = true;
      this.error = null;
      try {
        const { data } = await api.get("/posts");
        this.items = data;
      } catch (e) {
        this.error = e.response?.data?.error || "Failed to load feed";
      } finally {
        this.loading = false;
      }
    },
    async createPost({ category, description, lat, lng, photo }) {
      const form = new FormData();
      form.append("category", category);
      form.append("description", description);
      if (lat != null) form.append("lat", lat);
      if (lng != null) form.append("lng", lng);
      if (photo) form.append("photo", photo);

      const { data } = await api.post("/posts", form, {
        headers: { "Content-Type": "multipart/form-data" }
      });
      this.items.unshift(data);
    },
    async likePost(postId) {
      await api.post(`/posts/${postId}/likes`);
    },
    async commentPost(postId, text) {
      await api.post(`/posts/${postId}/comments`, { text });
    },
    initSocket() {
      if (this.socket) return;
      const baseUrl = new URL(api.defaults.baseURL);
      const socketUrl = `${baseUrl.protocol}//${baseUrl.hostname}:3000`;
      this.socket = io(socketUrl);

      this.socket.on("post:created", (post) => {
        this.items.unshift(post);
      });
      this.socket.on("post:liked", (payload) => {
        const p = this.items.find((i) => i.id === payload.postId);
        if (p) {
          p.likesCount = (p.likesCount || 0) + payload.likeCountIncrement;
          p.priorityScore = payload.priorityScore;
        }
      });
      this.socket.on("post:commented", (payload) => {
        const p = this.items.find((i) => i.id === payload.postId);
        if (p) {
          p.commentsCount =
            (p.commentsCount || 0) + payload.commentCountIncrement;
          p.priorityScore = payload.priorityScore;
        }
      });
      this.socket.on("contractor:taskUpdated", (payload) => {
        const p = this.items.find((i) => i.id === payload.postId);
        if (p) {
          p.status = payload.status;
        }
      });
    }
  }
});