const jwt = require("jsonwebtoken");
const { v4: uuidv4 } = require("uuid");
require("dotenv").config();
const JWTKey = process.env.JWT_SECREATE_KEY;
const pool = require("../config/pool");

async function createSession(req, res, email, rememberMe) {
  const sessionId = uuidv4();
  const token = jwt.sign({ email }, JWTKey);
  const expirationTime = new Date();
  if (rememberMe === true) {
    // Set expiration time to 7 days
    expirationTime.setDate(expirationTime.getDate() + 7);
  } else {
    // Set expiration time to 5 hours from now
    expirationTime.setHours(expirationTime.getHours() + 5);
  }
  try {
    const query = `
        INSERT INTO sessions (session_id, email, token, expiration_time, remember_me)
        VALUES (?, ?, ?, ?, ?)
    `;
    const values = [sessionId, email, token, expirationTime, rememberMe];
    await pool.query(query, values);
    if (rememberMe === true) {
      const expires = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
      res.setHeader("Set-Cookie", [
        `session_id=${sessionId}; Expires=${expires.toUTCString()} Path=/;`,
        `token=${token}; Path=/;Expires=${expires.toUTCString()} HttpOnly;`,
      ]);
    } else {
      res.setHeader("Set-Cookie", [
        `session_id=${sessionId}; Path=/;`,
        `token=${token}; Path=/;HttpOnly;`,
      ]);
    }

    console.log("sessionId,token", sessionId, token);
    res.writeHead(200, { "Content-Type": "text/plain" });
    res.end("ok");
  } catch (error) {
    console.error("Error inserting session data:", error);
    throw error;
  }
}

module.exports = { createSession };
