<template>
  <ion-app style="font-family: var(--app-font)">
    <!-- Fond animé -->
    <AnimatedBackground />

    <!-- Router -->
    <ion-router-outlet />
  </ion-app>
</template>

<script setup lang="ts">
import { IonApp, IonRouterOutlet } from '@ionic/vue'
import AnimatedBackground from '@/components/AnimatedBackground.vue'

</script>
