import { serve } from "https://deno.land/std@0.199.0/http/server.ts";
import { loginUser } from "./routes/login.js";
import { registerUser, getAccountInfo } from "./routes/register.js";
import { registerResource, getResources } from "./routes/resource.js";
import { registerReservation, handleReservationForm } from "./routes/reservation.js";
import { handleIndex, handleDefaultIndex } from "./routes/indexPage.js";
import { getSession, destroySession, getCookieValue } from "./sessionService.js";

let connectionInfo = {};

const _sessionStore = new Map();

async function addSecurityHeaders(req, handler) {
	const response = await handler(req);

	response.headers.set("Content-Security-Policy",
		"default-src 'self'; " +
		"script-src 'self'; " +
		"style-src 'self'; " +
		"img-src 'self'; " +
		"frame-ancestors 'none'; " +
		"form-action 'self';"
	);
	response.headers.set("X-Frame-Options", "DENY"); 
	response.headers.set("X-Content-Type-Options", "nosniff");

	return response;
}

async function serveStaticFile(path, contentType) {
		try {
			const data = await Deno.readFile(path);

			return new Response(data, {
				headers: { "Content-Type": contentType },
			});
		} catch {
			return new Response("File not found", { status: 404 });
		}
}

async function handler(req) {
		const url = new URL(req.url);

		if (url.pathname.startsWith("/static/")) {
			const filePath = `.${url.pathname}`;
			const contentType = getContentType(filePath);

			return await serveStaticFile(filePath, contentType);
		}

		if (url.pathname === "/" && req.method === "GET") {
			const session = getSession(req);

			if (session) {
				return await handleIndex(req);
			}

			return await handleDefaultIndex(req);
		}

		if (url.pathname === "/register" && req.method === "GET") {
			return await serveStaticFile("./views/register.html", "text/html");
		}

		if (url.pathname === "/register" && req.method === "POST") {
			const formData = await req.formData();

			return await registerUser(formData);
		}

		if (url.pathname === "/login" && req.method === "GET") {
			return await serveStaticFile("./views/login.html", "text/html");
		}

		if (url.pathname === "/login" && req.method === "POST") {
			const formData = await req.formData();
			return await loginUser(formData, connectionInfo);
		}

		if (url.pathname === "/logout" && req.method === "GET") {
			const cookies = req.headers.get("Cookie") || "";
			const sessionId = getCookieValue(cookies, "session_id");

			if (sessionId) {
				destroySession(sessionId);
			}

			return new Response(null, {
				status: 302,
				headers: {
						Location: "/",
						"Set-Cookie": "session_id=; HttpOnly; Secure; SameSite=Strict; Path=/; Max-Age=0",
				},
			});
		}

		if (url.pathname === "/resources" && req.method === "GET") {
			const session = getSession(req);
			
			if (!session) {
				return new Response("Unauthorized", { status: 401 });
			}

			if (session.role != "administrator") {
				return new Response("Unauthorized", { status: 401 });
			}

			return await serveStaticFile("./views/resource.html", "text/html");
		}

		if (url.pathname === "/resources" && req.method === "POST") {
			const formData = await req.formData();

			return registerResource(formData);
		}

		if (url.pathname === "/reservation" && req.method === "GET") {
			return handleReservationForm(req);
		}

	if (url.pathname === "/resourcesList" && req.method === "GET") {
		return getResources();
	}

	if (url.pathname === "/reservation" && req.method === "POST") {
		const formData = await req.formData();

		return registerReservation(formData);
	}

	if (url.pathname === "/terms" && req.method === "GET") {
		return serveStaticFile("./views/terms.html", "text/html");
	}

	if (url.pathname === "/privacynotice" && req.method === "GET") {
		return serveStaticFile("./views/privacyNotice.html", "text/html");
	}

	if (url.pathname === "/account" && req.method === "GET") {
		return serveStaticFile("./views/account.html", "text/html");
	}

	if (url.pathname === "/accountInfo" && req.method === "GET") {
		const session = getSession(req);

		return getAccountInfo(session.username);
	}

	return new Response("Not Found", { status: 404 });
}

function getContentType(filePath) {
		const ext = filePath.split(".").pop();
		const mimeTypes = {
				html: "text/html",
				css: "text/css",
				js: "application/javascript",
				png: "image/png",
				jpg: "image/jpeg",
				jpeg: "image/jpeg",
				gif: "image/gif",
				svg: "image/svg+xml",
				json: "application/json",
		};
		return mimeTypes[ext] || "application/octet-stream";
}

async function mainHandler(req, info) {
		connectionInfo = info;
		return await addSecurityHeaders(req, handler);
}

serve(mainHandler, { port: 8000 });

// Run: deno run --allow-net --allow-env --allow-read --watch app.js
