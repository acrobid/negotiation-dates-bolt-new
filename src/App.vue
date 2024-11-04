<script setup lang="ts">
import { ref, onMounted } from "vue";
import Timeline from "./components/Timeline.vue";
import AnimatedBackground from "./components/AnimatedBackground.vue";
import "@khmyznikov/pwa-install";

const isVisible = ref(false);

onMounted(() => {
  isVisible.value = true;
});
</script>

<template>
  <div class="app-container">
    <AnimatedBackground />
    <main :class="{ visible: isVisible }">
      <h1>Negotiation dates</h1>
      <Timeline />
    </main>
    <pwa-install></pwa-install>
  </div>
</template>

<style>
.app-container {
  width: 100vw;
  height: 100vh;
  position: relative;
}

main {
  position: relative;
  z-index: 1;
  padding: 2rem;
  opacity: 0;
  transform: translateY(20px);
  transition: all 0.8s ease-out;
}

main.visible {
  opacity: 1;
  transform: translateY(0);
}

h1 {
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto,
    "Helvetica Neue", Arial, sans-serif;
  font-size: 2.5rem;
  font-weight: bold;
  color: var(--accent-color);
  text-transform: uppercase;
  letter-spacing: 0.1rem;
  margin: 0;
  padding: 0.5rem 0;
  border-bottom: 2px solid var(--accent-color);
  text-align: center;
}

@media (max-width: 600px) {
  h1 {
    font-size: 2rem;
  }
}
</style>
