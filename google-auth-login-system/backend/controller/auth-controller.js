const url = require("url");
require("dotenv").config();
const axios = require("axios");
const response = require("../utils/response");
const qs = require("qs");
const jwt = require("jsonwebtoken");
const JWTKey = process.env.JWT_SECREATE_KEY;
const { options, params } = require("../config/google-auth");
const pool = require("../config/pool");
const { v4: uuid } = require("uuid");
const { createSession } = require("../utils/create-session");

async function getAccounts(req, res) {
  const rootUrl = "https://accounts.google.com/o/oauth2/v2/auth";
  const qs1 = new URLSearchParams(options);
  res.end(JSON.stringify({ redirectto: `${rootUrl}?${qs1.toString()}` }));
}

async function authenticate(req, res) {
  const { code } = req.body;
  try {
    const tokenParams = params(code);
    const tokenResponse = await axios.post(
      "https://oauth2.googleapis.com/token",
      qs.stringify(tokenParams),
      {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
      }
    );
    //  console.log(tokenParams);
    const accessToken = tokenResponse.data.access_token;

    const userInfoResponse = await axios.get(
      "https://www.googleapis.com/oauth2/v3/userinfo",
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );

    // console.log(userInfoResponse);
    const userData = userInfoResponse.data;
    const { name, email } = userData;

    try {
      console.log(name, email);

      if (name) {
        const query = "INSERT INTO users (id,username, email) VALUES (?,?, ?)";
        await pool.query(query, [uuid(), name, email]);
      } else {
        const query = "INSERT INTO users (id,email) VALUES (?,?)";
        await pool.query(query, [uuid(), email]);
      }
    } catch (error) {
    } finally {
      createSession(req, res, email, false);
    }
  } catch (error) {
    await response(res, "error", 400, "text/plain", "code invalid");
  }
}

module.exports = { getAccounts, authenticate };
