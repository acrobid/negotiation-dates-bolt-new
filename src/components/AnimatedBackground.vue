<script setup lang="ts">
import { onMounted, onUnmounted, ref } from 'vue'

const canvas = ref<HTMLCanvasElement | null>(null)
let animationFrame: number

const initCanvas = () => {
  if (!canvas.value) return
  
  const ctx = canvas.value.getContext('2d')
  if (!ctx) return

  const particles: Array<{x: number, y: number, speed: number, size: number, opacity: number}> = []
  const particleCount = 50

  const resize = () => {
    if (!canvas.value || !ctx) return
    canvas.value.width = window.innerWidth
    canvas.value.height = window.innerHeight
  }

  const createParticles = () => {
    for (let i = 0; i < particleCount; i++) {
      particles.push({
        x: Math.random() * canvas.value!.width,
        y: Math.random() * canvas.value!.height,
        speed: 0.2 + Math.random() * 0.8,
        size: Math.random() * 2,
        opacity: 0.1 + Math.random() * 0.3
      })
    }
  }

  const animate = () => {
    if (!ctx || !canvas.value) return
    
    ctx.fillStyle = 'rgba(18, 18, 18, 0.1)'
    ctx.fillRect(0, 0, canvas.value.width, canvas.value.height)
    
    particles.forEach(particle => {
      particle.y -= particle.speed
      if (particle.y < 0) {
        particle.y = canvas.value!.height
        particle.x = Math.random() * canvas.value!.width
        particle.opacity = 0.1 + Math.random() * 0.3
      }
      
      ctx.fillStyle = `rgba(255, 255, 255, ${particle.opacity})`
      ctx.beginPath()
      ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2)
      ctx.fill()
    })
    
    animationFrame = requestAnimationFrame(animate)
  }

  window.addEventListener('resize', resize)
  resize()
  createParticles()
  animate()
}

onMounted(() => {
  initCanvas()
})

onUnmounted(() => {
  if (animationFrame) {
    cancelAnimationFrame(animationFrame)
  }
})
</script>

<template>
  <canvas ref="canvas" class="animated-background"></canvas>
</template>

<style scoped>
.animated-background {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 0;
  background-color: #121212;
}
</style>