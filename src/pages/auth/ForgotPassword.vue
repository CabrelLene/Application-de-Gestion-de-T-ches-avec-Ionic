<template>
    <ion-page>
      <ion-content :fullscreen="true" class="ion-padding">
        <div class="glass" style="max-width:420px;margin:14vh auto;padding:1.2rem; animation: floaty 6.5s ease-in-out infinite;">
          <h1 style="margin:.2rem 0 1rem">Mot de passe oublié</h1>
  
          <ion-item class="glass"><ion-input v-model="email" label="Email" label-placement="floating" /></ion-item>
  
          <ion-button expand="block" class="btn-glow" style="margin-top:1rem" @click="onSend" :disabled="loading">Envoyer le lien</ion-button>
          <ion-button fill="clear" router-link="/auth/login" style="margin-top:.4rem">Retour à la connexion</ion-button>
        </div>
  
        <ion-loading :is-open="loading" message="Envoi en cours..." />
        <ion-toast :is-open="toast.open" :message="toast.msg" :duration="2400" @didDismiss="toast.open=false" />
      </ion-content>
    </ion-page>
  </template>
  
  <script setup lang="ts">
  import { ref } from 'vue'
  import { IonPage, IonContent, IonItem, IonInput, IonButton, IonLoading, IonToast } from '@ionic/vue'
  import { resetPassword } from '@/composables/useAuth'
  
  const email = ref('')
  const loading = ref(false)
  const toast = ref({ open:false, msg:'' })
  
  async function onSend() {
    loading.value = true
    try {
      await resetPassword(email.value.trim())
      toast.value = { open:true, msg:'Email envoyé 📬' }
    } catch (e:any) {
      toast.value = { open:true, msg:e.message }
    } finally {
      loading.value = false
    }
  }
  </script>
  