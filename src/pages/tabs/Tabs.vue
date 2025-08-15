<!-- src/pages/tabs/Tabs.vue -->
<template>
    <ion-page>
      <ion-tabs>
        <ion-router-outlet />
  
        <ion-tab-bar slot="bottom" class="glass">
          <ion-tab-button tab="active" href="/tabs/active" aria-label="Voir les tâches actives">
            <ion-icon :icon="play" />
            <ion-label>Actives</ion-label>
          </ion-tab-button>
  
          <ion-tab-button tab="closed" href="/tabs/closed" aria-label="Voir les tâches fermées">
            <ion-icon :icon="checkmarkDoneOutline" />
            <ion-label>Fermées</ion-label>
          </ion-tab-button>
  
          <ion-tab-button tab="archived" href="/tabs/archived" aria-label="Voir les tâches archivées">
            <ion-icon :icon="archiveOutline" />
            <ion-label>Archivées</ion-label>
          </ion-tab-button>
  
          <!-- 👇 Bouton Paramètres -->
          <ion-tab-button tab="settings" href="/tabs/settings" aria-label="Ouvrir les paramètres">
            <ion-icon :icon="settingsOutline" />
            <ion-label>Paramètres</ion-label>
          </ion-tab-button>
        </ion-tab-bar>
      </ion-tabs>
    </ion-page>
  </template>
  
  <script setup lang="ts">
  import { IonPage, IonTabs, IonRouterOutlet, IonTabBar, IonTabButton, IonIcon, IonLabel } from '@ionic/vue'
  import { archiveOutline, checkmarkDoneOutline, play, settingsOutline } from 'ionicons/icons'
  </script>
  
  <style scoped>
  /* Petit glow quand l’onglet est actif */
  ion-tab-button.tab-selected {
    box-shadow: 0 0 22px rgba(123,92,255,.25);
    transform: translateY(-2px);
    transition: transform .15s ease, box-shadow .2s ease;
  }
  </style>
  