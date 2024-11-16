<template>
  <div class="app-container">
    <AnimatedBackground />
    <main :class="{ visible: isVisible }">
      <h1>Negotiation dates</h1>
      <Timeline>
        <div class="acrobid-logo timeline-event">
          <a href="https://acrobid.com" target="_blank">
            <AcrobidLogoSvg />
          </a>
        </div>
      </Timeline>
    </main>
    <pwa-install></pwa-install>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import Timeline from "./components/Timeline.vue";
import AnimatedBackground from "./components/AnimatedBackground.vue";
import "@khmyznikov/pwa-install";
import AcrobidLogoSvg from "./components/AcrobidLogoSvg.vue";

const isVisible = ref(false);

onMounted(() => {
  isVisible.value = true;
});
</script>

<style>
@import url("https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&display=swap");

:root {
  --text-color: #213547;
  --border-color: rgba(0, 0, 0, 0.1);
}

.app-container {
  width: 100vw;
  height: 100vh;
  position: relative;
  font-family: "Inter", sans-serif;
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
  font-size: 2rem;
  font-weight: 500;
  color: var(--text-color);
  text-align: center;
  margin-bottom: 2rem;
  padding: 1rem;
  border: 1px solid var(--border-color);
  border-radius: 4px;
  background: rgba(0, 0, 0, 0.02);
}

h1::before,
h1::after {
  content: "";
  position: absolute;
  width: 20px;
  height: 20px;
  border: 2px solid var(--accent-color);
}

h1::before {
  top: -10px;
  left: -10px;
  border-right: none;
  border-bottom: none;
}

h1::after {
  bottom: -10px;
  right: -10px;
  border-left: none;
  border-top: none;
}

.acrobid-logo {
  fill: var(--accent-color);
  width: clamp(60px, 20vw, 200px);
  margin-left: auto;
}

@media (max-width: 600px) {
  h1 {
    font-size: 1.5rem;
  }
}
</style>
