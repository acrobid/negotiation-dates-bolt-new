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
// @ts-ignore
const markdown = import.meta.glob("../src/assets/**.md", { eager: true });

const isVisible = ref(false);

onMounted(() => {
  isVisible.value = true;
});
</script>

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

.acrobid-logo {
  fill: white; /* Ensure the SVG text is white */
  width: clamp(60px, 20vw, 200px);
  margin-left: auto;
}

@media (max-width: 600px) {
  h1 {
    font-size: 2rem;
  }
}
</style>
