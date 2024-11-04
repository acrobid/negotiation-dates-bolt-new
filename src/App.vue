<script setup lang="ts">
import { ref, onMounted } from "vue";
import Timeline from "./components/Timeline.vue";
import AnimatedBackground from "./components/AnimatedBackground.vue";

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
  </div>
</template>

<style>
.app-container {
  width: 100vw;
  height: 100vh;
  overflow: hidden;
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
  font-size: 4rem;
  margin-bottom: 2rem;
  background: linear-gradient(45deg, #ffffff, #ffffff22);
  background-clip: text;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  text-align: center;
}
</style>
