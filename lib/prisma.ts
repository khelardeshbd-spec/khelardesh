import 'server-only'
import { PrismaClient } from '@prisma/client'

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

export function getPrisma(): PrismaClient {
  if (globalForPrisma.prisma) {
    return globalForPrisma.prisma
  }

  let client: PrismaClient

  if (process.env.NODE_ENV === 'production' || process.env.NEXT_RUNTIME === 'edge') {
    const { PrismaPg } = require('@prisma/adapter-pg')
    const { Pool } = require('pg')
    
    const connectionString = process.env.DATABASE_URL
    const pool = new Pool({ connectionString })
    const adapter = new PrismaPg(pool)
    
    client = new PrismaClient({
      adapter,
      log: ['error'],
    })
  } else {
    client = new PrismaClient({
      log: ['query', 'error', 'warn'],
    })
  }

  globalForPrisma.prisma = client
  return client
}

// Lazy proxy for prisma
export const prisma = new Proxy({} as PrismaClient, {
  get(target, prop, receiver) {
    const client = getPrisma()
    const value = Reflect.get(client, prop)
    if (typeof value === 'function') {
      return value.bind(client)
    }
    return value
  }
})


