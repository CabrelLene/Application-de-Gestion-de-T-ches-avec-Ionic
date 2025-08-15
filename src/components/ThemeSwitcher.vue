<template>
    <ion-button fill="clear" id="theme-trigger" aria-label="Changer de thème">🎨</ion-button>
    <ion-popover trigger="theme-trigger" side="bottom" alignment="end">
      <ion-content class="ion-padding">
        <div style="display:grid;gap:.4rem;min-width:180px">
          <ion-button expand="block" fill="outline" @click="set('dark')">Dark</ion-button>
          <ion-button expand="block" fill="outline" @click="set('neon')">Neon</ion-button>
          <ion-button expand="block" fill="outline" @click="set('pastel')">Pastel</ion-button>
          <ion-button expand="block" fill="outline" @click="set('classic')">Classic</ion-button>
        </div>
      </ion-content>
    </ion-popover>
  </template>
  
  <script setup lang="ts">
  import { IonButton, IonPopover, IonContent } from '@ionic/vue'
  import { applyTheme } from '@/composables/useTheme'
  function set(n: any){ applyTheme(n) }
  </script>
  