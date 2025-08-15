<template>
    <ion-page>
      <ion-header translucent>
        <ion-toolbar class="glass-toolbar">
          <ion-title>📦 Archivées</ion-title>
        </ion-toolbar>
      </ion-header>
      <ion-content class="ion-padding">
        <div v-if="loading" class="glass" style="padding:1rem"><div class="shimmer" style="height:80px; border-radius:16px"></div></div>
        <div style="display:grid; gap:1rem">
          <TaskCard v-for="t in tasks" :key="t.id" :task="t" @open="open(t.id)" />
        </div>
        <div class="glass" style="padding:.8rem; margin-top:1rem;">🔒 Les tâches archivées sont en lecture seule.</div>
      </ion-content>
    </ion-page>
  </template>
  
  <script setup lang="ts">
  import { IonPage, IonHeader, IonToolbar, IonTitle, IonContent } from '@ionic/vue'
  import TaskCard from '@/components/TaskCard.vue'
  import { useTasks } from '@/composables/useTasks'
  const { tasks, loading } = useTasks('archivee')
  function open(_id: string){ /* lecture seule */ }
  </script>
  