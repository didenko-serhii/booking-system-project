import { serve } from 'https://deno.land/std@0.199.0/http/server.ts'
import { loginUser } from './routes/login.js'
import { registerUser } from './routes/register.js'

let connectionInfo = {}

async function addSecurityHeaders(req, handler) {
  const response = await handler(req)

  response.headers.set(
    'Content-Security-Policy',
    "default-src 'self'; " +
      "script-src 'self'; " +
      "style-src 'self'; " +
      "img-src 'self'; " +
      "frame-ancestors 'none'; " +
      "form-action 'self';"
  )
  response.headers.set('X-Frame-Options', 'DENY')
  response.headers.set('X-Content-Type-Options', 'nosniff')

  return response
}

async function serveStaticFile(path, contentType) {
  try {
    const data = await Deno.readFile(path)
    return new Response(data, {
      headers: { 'Content-Type': contentType },
    })
  } catch {
    return new Response('File not found', { status: 404 })
  }
}

async function handler(req) {
  const url = new URL(req.url)

  if (url.pathname.startsWith('/static/')) {
    const filePath = `.${url.pathname}`
    const contentType = getContentType(filePath)
    return await serveStaticFile(filePath, contentType)
  }

  if (url.pathname === '/' && req.method === 'GET') {
    return await serveStaticFile('./views/index.html', 'text/html')
  }

  if (url.pathname === '/register' && req.method === 'GET') {
    return await serveStaticFile('./views/register.html', 'text/html')
  }

  if (url.pathname === '/register' && req.method === 'POST') {
    const formData = await req.formData()
    return await registerUser(formData)
  }

  if (url.pathname === '/login' && req.method === 'GET') {
    return await serveStaticFile('./views/login.html', 'text/html')
  }

  if (url.pathname === '/login' && req.method === 'POST') {
    const formData = await req.formData()
    return await loginUser(formData, connectionInfo)
  }

  return new Response('Not Found', { status: 404 })
}

function getContentType(filePath) {
  const ext = filePath.split('.').pop()
  const mimeTypes = {
    html: 'text/html',
    css: 'text/css',
    js: 'application/javascript',
    png: 'image/png',
    jpg: 'image/jpeg',
    jpeg: 'image/jpeg',
    gif: 'image/gif',
    svg: 'image/svg+xml',
    json: 'application/json',
  }
  return mimeTypes[ext] || 'application/octet-stream'
}

async function mainHandler(req, info) {
  connectionInfo = info
  return await addSecurityHeaders(req, handler)
}

serve(mainHandler, { port: 8000 })
