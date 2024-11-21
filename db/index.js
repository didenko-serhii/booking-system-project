import postgres from 'postgres'
import { drizzle } from 'drizzle-orm/postgres-js'
import * as schema from './schema.js'

const queryClient = postgres(Deno.env.get('DATABASE_URL'))

export const db = drizzle(queryClient, { schema })
