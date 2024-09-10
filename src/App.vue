<template>
  <div class="flex flex-col min-h-screen font-sans bg-weather-primary">
    <Navbar />
    <RouterView />
  </div>
</template>

<script setup>
import { RouterView } from "vue-router";
import Navbar from "./components/Navbar.vue";
</script>
