import client from '../db/db.js'
import * as bcrypt from 'https://deno.land/x/bcrypt/mod.ts' // For password comparison
import { z } from 'https://deno.land/x/zod@v3.23.8/mod.ts'

const loginSchema = z.object({
  email: z.string().email({ message: 'Invalid email address' }),
  password: z.string().min(6).max(24),
})

async function getUserByEmail(email) {
  const result = await client.queryArray(
    `SELECT username, password, email FROM users WHERE email = $1`,
    [email]
  )
  return result.rows.length > 0 ? result.rows[0] : null
}

export async function loginUser(c, info) {
  const email = c.get('email')
  const password = c.get('password')
  try {
    loginSchema.parse({ email, password })

    const user = await getUserByEmail(email)
    if (!user) {
      return new Response('Invalid email or password', { status: 400 })
    }

    const [storedUserName, storedPassword, storedEmail] = user

    console.log(storedPassword)

    const passwordMatches = await bcrypt.compare(password, storedPassword)
    if (!passwordMatches) {
      return new Response('Invalid email or password', { status: 400 })
    }

    return new Response(null, { status: 302, headers: { Location: '/' } })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return new Response(
        `Validation Error: ${error.errors
          .map((e) => `${e.message}, ${e.path}`)
          .join(', ')}`,
        { status: 400 }
      )
    }
    console.error(error)
    return new Response('Error during login', { status: 500 })
  }
}

