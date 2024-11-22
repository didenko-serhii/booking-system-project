import client from '../db/db.js'
import * as bcrypt from 'https://deno.land/x/bcrypt/mod.ts' // For password comparison
import { z } from 'https://deno.land/x/zod@v3.16.1/mod.ts' // For validation

const loginSchema = z.object({
  username: z.string().email({ message: 'Invalid email address' }),
})

async function logLogin(userUUID, ipAddress) {
  try {
    await client.queryArray(
      `INSERT INTO login_logs (user_token, ip_address) VALUES ($1, $2)`,
      [userUUID, ipAddress]
    )
  } catch (error) {
    console.error('Error logging login event:', error)
  }
}

async function getUserByEmail(email) {
  const result = await client.queryArray(
    `SELECT username, password_hash, user_token FROM users WHERE username = $1`,
    [email]
  )
  return result.rows.length > 0 ? result.rows[0] : null
}

export async function loginUser(c, info) {
  const username = c.get('username')
  const password = c.get('password')
  try {
    loginSchema.parse({ username })

    const user = await getUserByEmail(username)
    if (!user) {
      return new Response('Invalid email or password', { status: 400 })
    }

    const [storedUsername, storedPasswordHash, userUUID] = user

    const passwordMatches = await bcrypt.compare(password, storedPasswordHash)
    if (!passwordMatches) {
      return new Response('Invalid email or password', { status: 400 })
    }

    const ipAddress = info.remoteAddr.hostname
    await logLogin(userUUID, ipAddress)

    return new Response(null, { status: 302, headers: { Location: '/' } })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return new Response(
        `Validation Error: ${error.errors.map((e) => e.message).join(', ')}`,
        { status: 400 }
      )
    }
    console.error(error)
    return new Response('Error during login', { status: 500 })
  }
}
