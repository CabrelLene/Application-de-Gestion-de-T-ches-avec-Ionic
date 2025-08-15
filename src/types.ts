export type TaskStatus = 'active' | 'fermee' | 'archivee'
export type Task = {
  id: string
  title: string
  description?: string
  status: TaskStatus
  ownerId: string
  ownerName?: string
  createdAt: any // Firestore Timestamp
  updatedAt?: any
}
