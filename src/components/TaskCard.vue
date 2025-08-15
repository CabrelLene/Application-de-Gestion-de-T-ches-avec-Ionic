<template>
    <div
      class="glass tilt task-card"
      @pointermove="onMove"
      @pointerleave="onLeave"
      @click="$emit('open', task.id)"
      :style="tiltStyle"
    >
      <div class="task-head">
        <h3 class="task-title">{{ task.title }}</h3>
        <span :class="['badge', badgeClass]">
          <span class="badge-dot"></span>
          {{ label }}
        </span>
      </div>
  
      <p class="task-desc" v-if="task.description">{{ task.description }}</p>
  
      <div class="task-meta">
        <span>Créée le {{ new Date(task.createdAt).toLocaleString() }}</span>
        <span>par <strong>{{ task.ownerName }}</strong></span>
      </div>
    </div>
  </template>
  
  <script setup lang="ts">
  import { computed, reactive } from 'vue'
  
  type Task = {
    id: string,
    title: string,
    description?: string,
    status: 'active'|'fermee'|'archivee',
    ownerName: string,
    createdAt: string
  }
  const props = defineProps<{ task: Task }>()
  
  const label = computed(() =>
    props.task.status === 'active' ? 'Active'
    : props.task.status === 'fermee' ? 'Fermée'
    : 'Archivée'
  )
  const badgeClass = computed(() =>
    props.task.status === 'active' ? 'badge-active' :
    props.task.status === 'fermee' ? 'badge-closed' : 'badge-arch'
  )
  
  const state = reactive({ rx: 0, ry: 0 })
  const tiltStyle = computed(() => ({
    transform: `perspective(900px) rotateX(${state.rx}deg) rotateY(${state.ry}deg)`
  }))
  function onMove(e: PointerEvent) {
    const el = (e.currentTarget as HTMLElement)
    const rect = el.getBoundingClientRect()
    const px = (e.clientX - rect.left) / rect.width
    const py = (e.clientY - rect.top) / rect.height
    state.ry = (px - 0.5) * 14
    state.rx = -(py - 0.5) * 12
  }
  function onLeave() { state.rx = 0; state.ry = 0 }
  </script>
  
  <style scoped>
  .task-card { padding: 1rem 1.1rem; cursor: pointer; }
  .task-head { display:flex; align-items:center; justify-content:space-between; gap: .75rem; }
  .task-title { margin: 0; font-size: 1.05rem; letter-spacing: .2px; }
  .task-desc { opacity:.9; margin:.4rem 0 .6rem; }
  .task-meta { display:flex; gap:1rem; opacity:.7; font-size:.85rem; }
  </style>
  