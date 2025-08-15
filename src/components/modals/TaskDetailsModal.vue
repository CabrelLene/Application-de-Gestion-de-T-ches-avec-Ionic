<template>
    <ion-modal :is-open="open" @didDismiss="$emit('close')">
      <ion-header translucent>
        <ion-toolbar class="glass-toolbar">
          <ion-title>Détails & activité</ion-title>
          <ion-buttons slot="end">
            <ion-button fill="clear" @click="$emit('close')">Fermer</ion-button>
          </ion-buttons>
        </ion-toolbar>
      </ion-header>
  
      <ion-content class="ion-padding">
        <div class="glass" style="padding:1rem; animation: floaty 7s ease-in-out infinite;">
          <h2 style="margin:.1rem 0 .5rem">{{ task?.title }}</h2>
          <p v-if="task?.description" style="opacity:.9">{{ task?.description }}</p>
          <div style="display:flex;gap:.6rem;flex-wrap:wrap;margin-top:.6rem;opacity:.85">
            <span class="badge"><span class="badge-dot"></span>Statut: {{ task?.status }}</span>
            <span class="badge"><span class="badge-dot"></span>Owner: {{ task?.ownerName }}</span>
            <span class="badge"><span class="badge-dot"></span>ID: <code style="opacity:.9">{{ task?.id }}</code></span>
          </div>
        </div>
  
        <h3 style="margin:1rem 0 .5rem">Activité</h3>
        <div class="timeline">
          <div v-for="l in logs" :key="l.id" class="timeline-item glass">
            <div class="t-head">
              <strong>{{ mapType(l.type) }}</strong>
              <small>{{ l.byName ?? '—' }}</small>
              <small>{{ formatDate(l.at?.toDate?.() ?? new Date()) }}</small>
            </div>
            <p class="t-msg">{{ l.message }}</p>
          </div>
          <div v-if="logs.length === 0" class="glass" style="padding:.8rem">Aucune activité pour le moment.</div>
        </div>
      </ion-content>
    </ion-modal>
  </template>
  
  <script setup lang="ts">
  import { IonModal, IonHeader, IonToolbar, IonTitle, IonButtons, IonButton, IonContent } from '@ionic/vue'
  import type { Task } from '@/types'
  import { useTaskLogs } from '@/composables/useTaskLogs'
  import { watch } from 'vue'
  
  const props = defineProps<{ open: boolean; task: Task | null }>()
  const emit = defineEmits<{ (e:'close'):void }>()
  const { logs, start, stop } = useTaskLogs(props.task?.id ?? null)
  
  watch(() => props.open, (v) => { v ? start() : stop() })
  watch(() => props.task?.id, () => { if(props.open) start() })
  
  function mapType(t:string){ return t==='create'?'Création':t==='update'?'Mise à jour':t==='status'?'Changement de statut':'Transfert' }
  function formatDate(d: Date){ return new Intl.DateTimeFormat(undefined, { dateStyle:'medium', timeStyle:'short' }).format(d) }
  </script>
  
  <style scoped>
  .timeline { display:grid; gap:.6rem }
  .timeline-item { padding:.7rem .9rem; border-radius:16px }
  .t-head { display:flex; gap:.6rem; align-items:center; opacity:.85 }
  .t-head small { opacity:.8 }
  .t-msg { margin:.25rem 0 0 }
  </style>
  