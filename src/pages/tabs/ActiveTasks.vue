<template>
    <ion-page>
      <ion-header translucent>
        <ion-toolbar class="glass-toolbar">
          <ion-title>🚀 Tâches actives</ion-title>
          <ion-buttons slot="start">
            <ion-item lines="none" class="glass" style="--background:transparent;">
              <ion-label>Mes tâches</ion-label>
              <ion-toggle v-model="ownerOnlyModel" />
            </ion-item>
          </ion-buttons>
          <ion-buttons slot="end">
            <ion-button class="btn-glow" @click="openNew">Ajouter</ion-button>
          </ion-buttons>
        </ion-toolbar>
      </ion-header>
  
      <ion-content class="ion-padding">
        <div v-if="loading" class="glass" style="padding:1rem">
          <div class="shimmer" style="height:80px; border-radius:16px"></div>
        </div>
  
        <div style="display:grid; gap:1rem">
          <!-- 👇 on normalise l'item avant de le passer à TaskCard -->
          <TaskCard
            v-for="t in tasks"
            :key="t.id"
            :task="normalizeForCard(t)"
            @open="openEdit(t as Task)"
          />
        </div>
  
        <!-- Infinite Scroll -->
        <ion-infinite-scroll @ionInfinite="more">
          <ion-infinite-scroll-content loading-text="Chargement..." />
        </ion-infinite-scroll>
  
        <!-- Modales -->
        <TaskEditorModal
          :open="editorOpen"
          :task="selectedTask"
          @close="editorOpen=false"
          @save="createTask"
          @update="patchTask"
          @status="setStatus(selectedTask!.id, $event)"
          @transfer="transferOpen=true" />
        <TransferTaskModal :open="transferOpen" @close="transferOpen=false" @submit="transfer"/>
  
        <ion-toast :is-open="toast.open" :message="toast.msg" :duration="2200" @didDismiss="toast.open=false" />
      </ion-content>
    </ion-page>
  </template>
  
  <script setup lang="ts">
  import { ref, watch } from 'vue'
  import {
    IonPage, IonHeader, IonToolbar, IonTitle, IonContent, IonButtons, IonButton, IonToast,
    IonItem, IonLabel, IonToggle, IonInfiniteScroll, IonInfiniteScrollContent
  } from '@ionic/vue'
  import { onIonViewDidEnter, onIonViewDidLeave } from '@ionic/vue'
  import TaskCard from '@/components/TaskCard.vue'
  import TaskEditorModal from '@/components/modals/TaskEditorModal.vue'
  import TransferTaskModal from '@/components/modals/TransferTaskModal.vue'
  import { useTasks } from '@/composables/useTasks'
  import type { Task, TaskStatus } from '@/types'
  import { ownerOnlyDefault } from '@/composables/usePrefs'
  
  const { tasks, loading, ownerOnly, start, stop, loadMore, createTask: _create, updateTask, setStatus: _setStatus, transferTask } =
    useTasks('active', { ownerOnly: false, pageSize: 20 })
  
  const toast = ref({ open:false, msg:'' })
  const editorOpen = ref(false)
  const transferOpen = ref(false)
  const selectedTask = ref<Task|null>(null)
  
  const ownerOnlyModel = ref(ownerOnly.value)
  watch(ownerOnlyModel, async (v) => {
    ownerOnly.value = v
    await start() // relance la requête avec le nouveau filtre
  })
  
  // Initialise le toggle et le filtre avec la préférence, puis démarre le listener
  onIonViewDidEnter(async () => {
    ownerOnly.value = ownerOnlyDefault.value
    ownerOnlyModel.value = ownerOnlyDefault.value
    await start()
  })
  
  onIonViewDidLeave(stop)
  
  /** Normalise un item venant de Firestore pour garantir ownerName:string */
  function normalizeForCard(t: any): Task {
    return {
      id: t.id,
      title: t.title ?? '',
      description: t.description ?? '',
      status: (t.status ?? 'active') as TaskStatus,
      ownerId: t.ownerId ?? '',
      ownerName: t.ownerName ?? 'Utilisateur', // 👈 toujours une string
      createdAt: t.createdAt,
      updatedAt: t.updatedAt,
    }
  }
  
  function openNew(){ selectedTask.value = null; editorOpen.value = true }
  function openEdit(t: Task){ selectedTask.value = t; editorOpen.value = true }
  
  async function createTask(payload: { title: string; description?: string }) {
    try { await _create(payload) }
    catch(e:any){ toast.value = { open:true, msg:e.message || 'Erreur création' } }
  }
  async function patchTask(patch: Partial<Task>) {
    if(!selectedTask.value) return
    try { await updateTask(selectedTask.value.id, patch) }
    catch(e:any){ toast.value = { open:true, msg:e.message || 'Erreur sauvegarde' } }
  }
  async function setStatus(id: string, s: 'active'|'fermee'|'archivee') {
    try { await _setStatus(id, s) }
    catch(e:any){ toast.value = { open:true, msg:e.message || 'Erreur statut' } }
  }
  async function transfer(email: string){
    if(!selectedTask.value) return
    try { await transferTask(selectedTask.value.id, email) }
    catch(e:any){ toast.value = { open:true, msg:e.message || 'Erreur transfert' } }
  }
  async function more(ev: CustomEvent) {
    await loadMore()
    ;(ev.target as any).complete()
  }
  </script>
  