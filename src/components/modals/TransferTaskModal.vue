<template>
    <ion-modal :is-open="open" @didDismiss="$emit('close')">
      <ion-header translucent>
        <ion-toolbar class="glass-toolbar">
          <ion-title>Transférer la tâche</ion-title>
          <ion-buttons slot="end"><ion-button fill="clear" @click="$emit('close')">Fermer</ion-button></ion-buttons>
        </ion-toolbar>
      </ion-header>
      <ion-content class="ion-padding">
        <div class="glass" style="padding:1rem; animation: floaty 7s ease-in-out infinite;">
          <ion-item class="glass"><ion-input v-model="email" label="Email du destinataire" label-placement="floating" /></ion-item>
          <div style="display:flex; gap:.6rem; margin-top:1rem;">
            <ion-button class="btn-glow" @click="doTransfer" :disabled="loading">Transférer</ion-button>
            <ion-button fill="outline" color="medium" @click="$emit('close')" :disabled="loading">Annuler</ion-button>
          </div>
        </div>
        <ion-loading :is-open="loading" message="Transfert..." />
        <ion-toast :is-open="toast.open" :message="toast.msg" :duration="2200" @didDismiss="toast.open=false" />
      </ion-content>
    </ion-modal>
  </template>
  
  <script setup lang="ts">
  import { ref } from 'vue'
  import { IonModal, IonHeader, IonToolbar, IonTitle, IonButtons, IonButton, IonContent, IonItem, IonInput, IonLoading, IonToast } from '@ionic/vue'
  const props = defineProps<{ open: boolean }>()
  const emit = defineEmits<{ (e:'close'):void; (e:'submit', email: string):void }>()
  const email = ref(''); const loading = ref(false); const toast = ref({open:false, msg:''})
  
  async function doTransfer(){
    loading.value = true
    try {
      if(!email.value.trim()) throw new Error('Email requis')
      emit('submit', email.value.trim())
      toast.value = { open:true, msg:'Transférée ✅' }
      emit('close')
    } catch(e:any) {
      toast.value = { open:true, msg:e.message || 'Erreur' }
    } finally { loading.value = false }
  }
  </script>
  