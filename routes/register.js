import client from '../db/db.js'
import * as bcrypt from 'https://deno.land/x/bcrypt/mod.ts'
import { z } from 'https://deno.land/x/zod@v3.23.8/mod.ts' // Import Zod

const registerSchema = z.object({
  email: z
    .string()
    .email({ message: 'Invalid email address' })
    .max(50, 'Email must not exceed 50 characters'),
  username: z.string(),
  password: z.string().min(8, 'Password must be at least 8 characters long'),
  age: z.coerce.number(),
  role: z.enum(['reserver', 'administrator'], { message: 'Invalid role' }),
})

async function isUniqueUsername(email) {
  const result = await client.queryArray(
    `SELECT username FROM users WHERE username = $1`,
    [email]
  )
  return result.rows.length === 0
}

export async function registerUser(c) {
  const username = c.get('username')
  const email = c.get('email')
  const password = c.get('password')
  const age = c.get('age')
  const role = c.get('role')
  try {
    registerSchema.parse({ username, password, age, email, role })

    if (!(await isUniqueUsername(username))) {
      return new Response('Email already in use', { status: 400 })
    }

    const salt = await bcrypt.genSalt(10)
    const hashedPassword = await bcrypt.hash(password, salt)

    await client.queryArray(
      `INSERT INTO users (username, password, role, age, email) VALUES ($1, $2, $3, $4, $5)`,
      [username, hashedPassword, role, age, email]
    )

    return new Response(null, { status: 302, headers: { Location: '/' } })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return new Response(
        `Validation Error: ${error.errors.map((e) => e).join(', ')}`,
        { status: 400 }
      )
    }
    console.error(error)
    return new Response('Error during registration', { status: 500 })
  }
}
