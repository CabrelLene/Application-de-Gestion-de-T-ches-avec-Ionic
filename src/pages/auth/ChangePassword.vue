<template>
    <ion-page>
      <ion-content :fullscreen="true" class="ion-padding">
        <div class="glass" style="max-width:440px;margin:12vh auto;padding:1.2rem; animation: floaty 6s ease-in-out infinite;">
          <h1 style="margin:.2rem 0 1rem">Changer le mot de passe</h1>
  
          <ion-item class="glass"><ion-input type="password" v-model="currentPass" label="Mot de passe actuel" label-placement="floating" /></ion-item>
          <ion-item class="glass" style="margin-top:.6rem"><ion-input type="password" v-model="newPass" label="Nouveau mot de passe" label-placement="floating" /></ion-item>
  
          <ion-button expand="block" class="btn-glow" style="margin-top:1rem" @click="onChange" :disabled="loading">Mettre à jour</ion-button>
          <ion-button fill="clear" router-link="/tabs" style="margin-top:.4rem">Retour</ion-button>
        </div>
  
        <ion-loading :is-open="loading" message="Mise à jour..." />
        <ion-toast :is-open="toast.open" :message="toast.msg" :duration="2400" @didDismiss="toast.open=false" />
      </ion-content>
    </ion-page>
  </template>
  
  <script setup lang="ts">
  import { ref } from 'vue'
  import { IonPage, IonContent, IonItem, IonInput, IonButton, IonLoading, IonToast } from '@ionic/vue'
  import { changePassword } from '@/composables/useAuth'
  
  const currentPass = ref('')
  const newPass = ref('')
  const loading = ref(false)
  const toast = ref({ open:false, msg:'' })
  
  async function onChange() {
    loading.value = true
    try {
      if ((newPass.value ?? '').length < 6) throw new Error('Mot de passe trop faible (min 6).')
      await changePassword(currentPass.value, newPass.value)
      toast.value = { open:true, msg:'Mot de passe mis à jour ✅' }
    } catch (e:any) {
      toast.value = { open:true, msg:e.message }
    } finally {
      loading.value = false
    }
  }
  </script>
  