<template>
    <ion-page>
      <ion-header translucent>
        <ion-toolbar class="glass-toolbar">
          <ion-title>✅ Tâches fermées</ion-title>
        </ion-toolbar>
      </ion-header>
  
      <ion-content class="ion-padding">
        <div v-if="loading" class="glass" style="padding:1rem">
          <div class="shimmer" style="height:80px; border-radius:16px"></div>
        </div>
  
        <div style="display:grid; gap:1rem">
          <TaskCard v-for="t in tasks" :key="t.id" :task="t" @open="openEdit(t)" />
        </div>
  
        <TaskEditorModal
          :open="editorOpen"
          :task="selectedTask"
          @close="editorOpen=false"
          @update="patchTask"
          @status="setStatusLocal(selectedTask!.id, $event)" />
  
        <ion-toast :is-open="toast.open" :message="toast.msg" :duration="2200" @didDismiss="toast.open=false" />
      </ion-content>
    </ion-page>
  </template>
  
  <script setup lang="ts">
  import { ref } from 'vue'
  import { IonPage, IonHeader, IonToolbar, IonTitle, IonContent, IonToast } from '@ionic/vue'
  import TaskCard from '@/components/TaskCard.vue'
  import TaskEditorModal from '@/components/modals/TaskEditorModal.vue'
  import { useTasks } from '@/composables/useTasks'
  import type { Task } from '@/types'
  
  /* ⬅️ Aliasser setStatus pour éviter la collision */
  const { tasks, loading, updateTask, setStatus: setTaskStatus } = useTasks('fermee')
  
  const toast = ref({ open:false, msg:'' })
  const editorOpen = ref(false)
  const selectedTask = ref<Task|null>(null)
  
  function openEdit(t: Task){ selectedTask.value = t; editorOpen.value = true }
  
  async function patchTask(patch: Partial<Task>) {
    if(!selectedTask.value) return
    try {
      await updateTask(selectedTask.value.id, patch)
    } catch (e:any) {
      toast.value = { open:true, msg:e.message || 'Erreur' }
    }
  }
  
  /* ⬅️ Renommer la fonction locale */
  async function setStatusLocal(id: string, s: 'active'|'fermee'|'archivee') {
    try {
      await setTaskStatus(id, s)
    } catch (e:any) {
      toast.value = { open:true, msg:e.message || 'Erreur statut' }
    }
  }
  </script>
  