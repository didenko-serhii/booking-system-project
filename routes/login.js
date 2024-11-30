import client from '../db/db.js'
import * as bcrypt from 'https://deno.land/x/bcrypt/mod.ts' // For password comparison
import { z } from 'https://deno.land/x/zod@v3.23.8/mod.ts'
import {createSession} from '../sessionService.js'

const loginSchema = z.object({
  email: z.string().email({ message: 'Invalid email address' }),
  password: z.string().min(6).max(24),
})

async function logLogin(userUUID, ipAddress) {
  try {
      await client.queryArray(`INSERT INTO login_logs (user_id, ip) VALUES ($1, $2)`, [userUUID, ipAddress]);
  } catch (error) {
      console.error("Error logging login event:", error);
  }
}


async function getUserByEmail(email) {
  const result = await client.queryArray(
    `SELECT id, username, password, email, role FROM users WHERE email = $1`,
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

    const [storedId, storedUsername, storedPassword, storedEmail, role] = user

    console.log(storedPassword)

    const passwordMatches = await bcrypt.compare(password, storedPassword)
    if (!passwordMatches) {
      return new Response('Invalid email or password', { status: 400 })
    }

    const sessionId = createSession({ username: storedUsername, role });


    const ip = info.remoteAddr.hostname
    logLogin(storedId, ip)

    return new Response(null, { status: 302,  headers: { Location: "/", "Set-Cookie": `session_id=${sessionId}; HttpOnly; Secure; SameSite=Strict; Path=/`, } })
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

