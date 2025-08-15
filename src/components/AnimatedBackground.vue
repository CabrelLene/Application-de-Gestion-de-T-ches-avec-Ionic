<template>
    <div class="app-bg"></div>
    <!-- Lottie subtil (étoiles / particules) -->
    <div class="lottie-layer" aria-hidden="true">
      <lottie-player
        autoplay
        loop
        mode="normal"
        src="https://lottie.host/0e2b8f0f-7f5c-4a0f-bf9b-41c9e6a40ea1/sparkles.json"
        style="width: 100%; height: 100%; opacity: .18">
      </lottie-player>
    </div>
  </template>
  
  <script setup lang="ts"></script>
  
  <style scoped>
  .lottie-layer {
    position: fixed; inset: 0; z-index: -1; pointer-events: none;
    mix-blend-mode: screen;
  }
  </style>
  