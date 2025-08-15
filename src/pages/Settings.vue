<template>
    <ion-page>
      <ion-header translucent>
        <ion-toolbar class="glass-toolbar">
          <ion-title>Paramètres</ion-title>
        </ion-toolbar>
      </ion-header>
  
      <ion-content class="ion-padding">
        <!-- Profil -->
        <section class="glass" style="padding:1rem; margin-bottom:1rem; animation: floaty 7s ease-in-out infinite;">
          <h2 style="margin:.2rem 0 .6rem">Profil</h2>
  
          <div style="display:flex; gap:1rem; align-items:center; margin-bottom:.6rem; flex-wrap:wrap">
            <ion-avatar style="width:64px;height:64px;">
              <img :src="avatarPreview" alt="Avatar" />
            </ion-avatar>
            <div style="opacity:.8">
              <div v-if="user?.email">{{ user.email }}</div>
              <div v-else>—</div>
            </div>
          </div>
  
          <ion-item class="glass"><ion-input v-model="displayName" label="Nom à afficher" label-placement="floating" /></ion-item>
          <ion-item class="glass" style="margin-top:.6rem"><ion-input v-model="photoURL" label="URL de la photo" label-placement="floating" /></ion-item>
  
          <div style="display:flex; gap:.6rem; margin-top:1rem; flex-wrap:wrap;">
            <ion-button class="btn-glow" :disabled="saving" @click="saveProfile">Sauvegarder</ion-button>
            <ion-button fill="outline" color="medium" :disabled="saving" @click="resetProfile">Réinitialiser</ion-button>
          </div>
        </section>
  
        <!-- Apparence -->
        <section class="glass" style="padding:1rem; margin-bottom:1rem;">
          <h2 style="margin:.2rem 0 .6rem">Apparence</h2>
          <ion-item class="glass">
            <ion-label>Thème</ion-label>
            <ion-select interface="popover" :value="theme" @ionChange="setTheme($event.detail.value as ThemeName)">
              <ion-select-option value="dark">Dark</ion-select-option>
              <ion-select-option value="neon">Neon</ion-select-option>
              <ion-select-option value="pastel">Pastel</ion-select-option>
              <ion-select-option value="classic">Classic</ion-select-option>
            </ion-select>
          </ion-item>
        </section>
  
        <!-- Préférences -->
        <section class="glass" style="padding:1rem; margin-bottom:1rem;">
          <h2 style="margin:.2rem 0 .6rem">Préférences</h2>
  
          <ion-item class="glass">
            <ion-label>Afficher “Mes tâches” par défaut</ion-label>
            <ion-toggle v-model="ownerOnly" />
          </ion-item>
  
          <ion-item class="glass" style="margin-top:.4rem">
            <ion-label>Langue</ion-label>
            <ion-segment :value="language" @ionChange="onLangChange">
              <ion-segment-button value="fr">FR</ion-segment-button>
              <ion-segment-button value="en">EN</ion-segment-button>
            </ion-segment>
          </ion-item>
        </section>
  
        <ion-toast :is-open="toast.open" :message="toast.msg" :duration="2200" @didDismiss="toast.open=false" />
        <ion-loading :is-open="saving" message="Enregistrement..." />
      </ion-content>
    </ion-page>
  </template>
  
  <script setup lang="ts">
  import {
    IonPage, IonHeader, IonToolbar, IonTitle, IonContent, IonItem, IonInput, IonButton,
    IonToast, IonLoading, IonAvatar, IonLabel, IonToggle, IonSelect, IonSelectOption, IonSegment, IonSegmentButton
  } from '@ionic/vue'
  import { computed, ref, watchEffect } from 'vue'
  import type { SegmentChangeEventDetail } from '@ionic/core'
  import { currentUser, updateUserProfile } from '@/composables/useAuth'
  import { theme as themeRef, applyTheme, type ThemeName } from '@/composables/useTheme'
  import { ownerOnlyDefault, lang as langRef } from '@/composables/usePrefs'
  
  const user = computed(() => currentUser.value)
  const displayName = ref(user.value?.displayName ?? '')
  const photoURL = ref(user.value?.photoURL ?? '')
  const avatarPreview = computed(() => photoURL.value || 'https://api.dicebear.com/7.x/identicon/svg?seed=' + (user.value?.uid ?? 'me'))
  
  const saving = ref(false)
  const toast = ref({ open:false, msg:'' })
  
  async function saveProfile(){
    saving.value = true
    try {
      await updateUserProfile(displayName.value.trim() || undefined, photoURL.value.trim() || undefined)
      toast.value = { open:true, msg:'Profil mis à jour ✅' }
    } catch(e:any){
      toast.value = { open:true, msg: e.message || 'Erreur profil' }
    } finally { saving.value = false }
  }
  function resetProfile(){
    displayName.value = user.value?.displayName ?? ''
    photoURL.value = user.value?.photoURL ?? ''
  }
  
  // Apparence
  const theme = computed(() => themeRef.value)
  function setTheme(v: ThemeName){ applyTheme(v) }
  
  // Préférences
  const ownerOnly = ref(ownerOnlyDefault.value)
  watchEffect(() => { ownerOnlyDefault.value = ownerOnly.value })
  
  const language = ref<'fr'|'en'>(langRef.value)
  watchEffect(() => { langRef.value = language.value })
  
  function onLangChange(ev: CustomEvent<SegmentChangeEventDetail>) {
    const v = ev.detail.value as 'fr' | 'en' | undefined
    if (v === 'fr' || v === 'en') language.value = v
  }
  </script>
  