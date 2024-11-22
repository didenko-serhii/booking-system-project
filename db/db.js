import { Client } from 'https://deno.land/x/postgres/mod.ts'

const client = new Client({
  user: 'postgres',
  database: 'postgres',
  hostname: 'localhost',
  password: 'passw',
  port: 5432,
})

await client.connect()

export default client
