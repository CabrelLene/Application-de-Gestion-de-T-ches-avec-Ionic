<template>
    <ion-page>
      <ion-content :fullscreen="true" class="ion-padding">
        <div class="glass" style="max-width:420px;margin:12vh auto;padding:1.2rem; animation: floaty 6s ease-in-out infinite;">
          <h1 style="margin:.2rem 0 1rem">Connexion</h1>
  
          <ion-item class="glass"><ion-input v-model="email" label="Email" label-placement="floating" /></ion-item>
          <ion-item class="glass" style="margin-top:.6rem"><ion-input type="password" v-model="password" label="Mot de passe" label-placement="floating" /></ion-item>
  
          <ion-button expand="block" class="btn-glow" style="margin-top:1rem" @click="onLogin" :disabled="loading">Se connecter</ion-button>
  
          <div style="display:flex;justify-content:space-between;margin-top:.6rem">
            <ion-button fill="clear" router-link="/auth/register">Créer un compte</ion-button>
            <ion-button fill="clear" router-link="/auth/forgot">Mot de passe oublié</ion-button>
          </div>
        </div>
  
        <ion-loading :is-open="loading" message="Connexion..." />
        <ion-toast :is-open="toast.open" :message="toast.msg" :duration="2200" @didDismiss="toast.open=false" />
      </ion-content>
    </ion-page>
  </template>
  
  <script setup lang="ts">
  import { ref } from 'vue'
  import { useRouter } from 'vue-router'
  import { IonPage, IonContent, IonItem, IonInput, IonButton, IonLoading, IonToast } from '@ionic/vue'
  import { login } from '@/composables/useAuth'
  
  const router = useRouter()
  const email = ref(''); const password = ref('')
  const loading = ref(false)
  const toast = ref({ open:false, msg:'' })
  
  async function onLogin() {
    loading.value = true
    try {
      await login(email.value.trim(), password.value)
      toast.value = { open:true, msg:'Bienvenue 👋' }
      router.push('/tabs')
    } catch (e:any) {
      toast.value = { open:true, msg:e.message }
    } finally {
      loading.value = false
    }
  }
  </script>
  