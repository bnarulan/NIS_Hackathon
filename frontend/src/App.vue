<template>
  <LayoutMain>
    <RouterView />
  </LayoutMain>
</template>

<script setup>
import { RouterView } from "vue-router";
import LayoutMain from "./components/LayoutMain.vue";
</script>