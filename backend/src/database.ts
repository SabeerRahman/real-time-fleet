import mongoose from 'mongoose'
import { seedDemo } from './seed.js'

let connecting: Promise<void> | undefined

export async function connectDatabase() {
  if (mongoose.connection.readyState === 1) return
  if (!connecting) {
    const uri = process.env.MONGODB_URI
    if (!uri) throw new Error('MONGODB_URI is required for the independent Fleet demo API.')
    connecting = mongoose.connect(uri).then(async () => { await seedDemo() })
  }
  await connecting
}
