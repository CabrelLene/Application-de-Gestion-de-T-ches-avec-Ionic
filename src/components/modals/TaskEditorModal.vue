<template>
    <ion-modal :is-open="open" @didDismiss="$emit('close')">
      <ion-header translucent>
        <ion-toolbar class="glass-toolbar">
          <ion-title>{{ isNew ? 'Nouvelle tâche' : 'Éditer la tâche' }}</ion-title>
          <ion-buttons slot="end">
            <ion-button fill="clear" @click="$emit('close')">Fermer</ion-button>
          </ion-buttons>
        </ion-toolbar>
      </ion-header>
  
      <ion-content class="ion-padding">
        <div class="glass" style="padding:1rem; animation: floaty 7s ease-in-out infinite;">
          <ion-item class="glass"><ion-input v-model="title" label="Titre" label-placement="floating" /></ion-item>
          <ion-item class="glass" style="margin-top:.6rem">
            <ion-textarea v-model="description" auto-grow label="Description" label-placement="floating" />
          </ion-item>
  
          <div style="display:flex; gap:.6rem; margin-top:1rem; flex-wrap:wrap;">
            <ion-button class="btn-glow" @click="save" :disabled="saving">{{ isNew ? 'Créer' : 'Sauvegarder' }}</ion-button>
            <ion-button fill="outline" color="medium" @click="$emit('close')" :disabled="saving">Annuler</ion-button>
  
            <ion-button v-if="!isNew && editable" fill="outline" @click="closeTask" :disabled="saving">Marquer fermée</ion-button>
            <ion-button v-if="!isNew && editable" fill="outline" color="dark" @click="archiveTask" :disabled="saving">Archiver</ion-button>
            <ion-button v-if="!isNew && editable" fill="outline" color="tertiary" @click="$emit('transfer')" :disabled="saving">Transférer</ion-button>
          </div>
  
          <div v-if="!editable && !isNew" style="margin-top: .6rem; opacity:.8">
            🔒 Lecture seule (vous n’êtes pas propriétaire).
          </div>
        </div>
  
        <ion-toast :is-open="toast.open" :message="toast.msg" :duration="2000" @didDismiss="toast.open=false" />
        <ion-loading :is-open="saving" message="Enregistrement..." />
      </ion-content>
    </ion-modal>
  </template>
  
  <script setup lang="ts">
  import { ref, watch, computed } from 'vue'
  import { auth } from '@/firebase/firebase'
  import { IonModal, IonHeader, IonToolbar, IonTitle, IonButtons, IonButton, IonContent, IonItem, IonInput, IonTextarea, IonToast, IonLoading } from '@ionic/vue'
  import type { Task } from '@/types'
  
  const props = defineProps<{
    open: boolean
    task?: Task | null
  }>()
  const emit = defineEmits<{
    (e:'close'): void
    (e:'save', payload: { title: string; description?: string }): void
    (e:'update', payload: Partial<Task>): void
    (e:'status', payload: 'fermee' | 'archivee' | 'active'): void
    (e:'transfer'): void
  }>()
  
  const isNew = computed(() => !props.task?.id)
  const title = ref(''); const description = ref('')
  watch(() => props.task, t => {
    title.value = t?.title ?? ''
    description.value = t?.description ?? ''
  }, { immediate: true })
  
  const editable = computed(() => {
    const u = auth.currentUser
    return !!props.task && !!u && props.task.ownerId === u.uid && props.task.status !== 'archivee'
  })
  
  const saving = ref(false)
  const toast = ref({ open:false, msg:'' })
  
  async function save(){
    saving.value = true
    try{
      if(!title.value.trim()) throw new Error('Titre requis.')
      if(isNew.value) emit('save', { title: title.value, description: description.value })
      else emit('update', { title: title.value, description: description.value })
      toast.value = { open:true, msg: isNew.value ? 'Créée ✅' : 'Sauvegardée ✅' }
      emit('close')
    }catch(e:any){ toast.value = { open:true, msg: e.message || 'Erreur' } }
    finally{ saving.value = false }
  }
  function closeTask(){ emit('status','fermee') }
  function archiveTask(){ emit('status','archivee') }
  </script>
  