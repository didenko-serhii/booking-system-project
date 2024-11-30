import client from "../db/db.js";
import {getSession} from '../sessionService.js'

async function getReservations() {
    try {
        const query = `
            SELECT r.name, res.start_time, res.end_time
            FROM resources r
            join reservations res on r.id = res.resource_id;
        `;
        const result = await client.queryObject(query);

        // Generate HTML table dynamically
        const tableRows = result.rows
            .map(row => `
                <tr>
                    <td>${row.name}</td>
                    <td>${new Date(row.start_time).toLocaleString()}</td>
                    <td>${new Date(row.end_time).toLocaleString()}</td>
                </tr>
            `)
            .join("");
        return tableRows;
    } catch (error) {
        console.error("Error fetching booked resources:", error);
        return new Response("Internal Server Error", { status: 500 });
    }
}

async function getReservationsWithUser() {
    try {
        const query = `
        SELECT
            r.name,
            res.start_time,
            res.end_time,
            u.username AS reserver_username
        FROM resources r
        JOIN reservations res ON r.resource_id = res.resource_id
        JOIN users u ON res.user_id = u.id;
        `;
        const result = await client.queryObject(query);

        // Generate HTML table dynamically
        const tableRows = result.rows
            .map(row => `
                <tr>
                    <td>${row.name}</td>
                    <td>${new Date(row.start_time).toLocaleString()}</td>
                    <td>${new Date(row.end_time).toLocaleString()}</td>
                    <td>${row.reserver_username}</td>
                </tr>
            `)
            .join("");
        return tableRows;
    } catch (error) {
        console.error("Error fetching booked resources:", error);
        return new Response("Internal Server Error", { status: 500 });
    }
}


export async function handleIndex(req) {
    const session = getSession(req);
    // Generate HTML table dynamically
    const tableRows = await getReservationsWithUser();

    // Respond with a personalized welcome message
    const loggedHtml = `
            <!DOCTYPE html>
            <html lang="en">
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>Home</title>
                <link rel="stylesheet" href="/static/styles.css">
            </head>
            <body>
                <div class="container">
                    <h1>Welcome ${session.username}</h1>
                    <p>Please choose one of the options below:</p>
                    <ul>
                        <li><a href="/logout">Log Out</a></li>
                        <li><a href="/resources">Add a new resource</a></li>
                        <li><a href="/reservation">Add a new reservation</a></li>
                    </ul>
                <h1>Booked Resources</h1>
                <table border="1" cellpadding="5" cellspacing="0">
                    <thead>
                        <tr>
                            <th>Resource Name</th>
                            <th>Reservation Start</th>
                            <th>Reservation End</th>
                            <th>Reserver Username</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${tableRows}
                    </tbody>
                </table>
            </div>
            </body>
            </html>`;
    return new Response(loggedHtml, {
        headers: { "Content-Type": "text/html" },
    });
}

export async function handleDefaultIndex(req) {
    // Generate HTML table dynamically
    const tableRows = await getReservations();

    // Default HTML response
    const defaultHtml = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Home</title>
        <link rel="stylesheet" href="/static/styles.css">
    </head>
    <body>
        <div class="container">
            <h1>Welcome to the Booking System</h1>
            <p>Please choose one of the options below:</p>
            <ul>
                <li><a href="/login">Login</a></li>
                <li><a href="/register">Register</a></li>
            </ul>
            <h1>Booked Resources</h1>
                <table border="1" cellpadding="5" cellspacing="0">
                    <thead>
                        <tr>
                            <th>Resource Name</th>
                            <th>Reservation Start</th>
                            <th>Reservation End</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${tableRows}
                    </tbody>
                </table>
        </div>
    </body>
    </html>`;
    return new Response(defaultHtml, {
        headers: { "Content-Type": "text/html" },
    });
}