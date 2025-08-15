<template>
    <ion-page>
      <ion-content :fullscreen="true" class="ion-padding">
        <div class="glass" style="max-width:440px;margin:10vh auto;padding:1.2rem; animation: floaty 7s ease-in-out infinite;">
          <h1 style="margin:.2rem 0 1rem">Créer un compte</h1>
  
          <ion-item class="glass"><ion-input v-model="displayName" label="Nom à afficher" label-placement="floating" /></ion-item>
          <ion-item class="glass" style="margin-top:.6rem"><ion-input v-model="email" label="Email" label-placement="floating" /></ion-item>
          <ion-item class="glass" style="margin-top:.6rem"><ion-input type="password" v-model="password" label="Mot de passe" label-placement="floating" /></ion-item>
  
          <ion-button expand="block" class="btn-glow" style="margin-top:1rem" @click="onRegister" :disabled="loading">S’inscrire</ion-button>
          <ion-button fill="clear" router-link="/auth/login" style="margin-top:.4rem">J’ai déjà un compte</ion-button>
        </div>
  
        <ion-loading :is-open="loading" message="Création du compte..." />
        <ion-toast :is-open="toast.open" :message="toast.msg" :duration="2400" @didDismiss="toast.open=false" />
      </ion-content>
    </ion-page>
  </template>
  
  <script setup lang="ts">
  import { ref } from 'vue'
  import { useRouter } from 'vue-router'
  import { IonPage, IonContent, IonItem, IonInput, IonButton, IonLoading, IonToast } from '@ionic/vue'
  import { register } from '@/composables/useAuth'
  
  const router = useRouter()
  const displayName = ref('')
  const email = ref('')
  const password = ref('')
  const loading = ref(false)
  const toast = ref({ open:false, msg:'' })
  
  async function onRegister() {
    loading.value = true
    try {
      if (!displayName.value.trim()) throw new Error('Veuillez indiquer votre nom.')
      if ((password.value ?? '').length < 6) throw new Error('Mot de passe trop faible (min 6).')
      await register(email.value.trim(), password.value, displayName.value.trim())
      toast.value = { open:true, msg:'Compte créé 🎉' }
      router.push('/tabs')
    } catch (e:any) {
      toast.value = { open:true, msg:e.message }
    } finally {
      loading.value = false
    }
  }
  </script>
  