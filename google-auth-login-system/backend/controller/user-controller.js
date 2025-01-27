const crypto = require("crypto");
const response = require("../utils/response");
const { CONTENT_TYPE_JSON } = require("../utils/constant");
const jwt = require("jsonwebtoken");
const { v4: uuidv4 } = require("uuid");
require("dotenv").config();
const JWTKey = process.env.JWT_SECREATE_KEY;
const pool = require("../config/pool");
const nodemailer = require("nodemailer");
const url = require("url");
const { createSession } = require("../utils/create-session");
const { sessionVerify } = require("../middleware/check-session");

async function resetPassword(req, res) {
  const { email } = req.body;

  const token = jwt.sign({ email }, JWTKey, { expiresIn: "15m" });

  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: "mandanisahil304@gmail.com",
      pass: "ijch rehk cblz vahb",
    },
  });

  const mailOptions = {
    from: "mandanisahil304@gmail.com",
    to: email,
    subject: "Password Reset",
    html: `
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Password Reset</title>
        <style>
            body {
                font-family: Arial, sans-serif;
                background-color: #f8f9fa;
                margin: 0;
                padding: 0;
            }
            .container {
                max-width: 600px;
                margin: 50px auto;
                padding: 20px;
                background-color: #ffffff;
                border-radius: 8px;
                box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
                border: 1px solid #dee2e6;
            }
            h1 {
                color: #007bff;
                text-align: center;
                margin-bottom: 20px;
            }
            p {
                margin-bottom: 30px;
                line-height: 1.6;
            }
            .reset-container {
              display: flex;
              justify-content: center; /* Center horizontally */
              margin-top: 20px; /* Adjust as needed */
          }
          
          a.reset-button {
              display: inline-block;
              padding: 10px 20px;
              background-color: #007bff; /* Button background color */
              color: #ffffff; /* Text color */
              text-decoration: none;
              border-radius: 5px;
              border: none; /* Remove border */
              cursor: pointer;
              transition: background-color 0.3s;
          }
          
          a.reset-button:hover {
              background-color: #0056b3; /* Darker shade on hover */
          }
            
          
        </style>
    </head>
    <body>
        <div class="container">
            <h1>Password Reset</h1>
            <p>Dear User,</p>
            <p>You have requested to reset your password. Click the link below to proceed:</p>
            <div class="reset-container">
            <a href="http://localhost:5500/frontend/change-password.html?token=${token}" class="reset-button">Reset Password</a>
        </div>

            <p>If you did not request a password reset, please ignore this email.</p>
            <p>Thank you,</p>
            <p>Salesmate</p>
        </div>
    </body>
    </html>
    
      `,
  };

  transporter.sendMail(mailOptions, async (error, info) => {
    if (error) {
      console.error("Error sending email:", error);
      await response(
        res,
        "success",
        500,
        "text/plain",
        "Failed to send password reset email."
      );
    } else {
      console.log("Email sent:", info.response);
      await response(
        res,
        "success",
        200,
        "text/plain",
        "Password reset email sent successfully!"
      );
    }
  });
}

async function changePassword(req, res) {
  const { password, token } = req.body;

  jwt.verify(token, JWTKey, async (err, decoded) => {
    if (err) {
      console.log(err);
      return await response(
        res,
        "error",
        400,
        "text/plain",
        "Invalid or expired token"
      );
    } else {
      try {
        const { email } = jwt.decode(token);

        const query = "UPDATE users SET hash = ?,salt=? WHERE email = ?";
        const { salt, hash } = hashPassword(password);
        const values = [hash, salt, email];
        await pool.query(query, values);

        return await response(
          res,
          "success",
          200,
          "text/plain",
          "Password updated successfully"
        );
      } catch (error) {
        console.error("Error updating password:", error);
        return await response(
          res,
          "error",
          500,
          "text/plain",
          "Internal Server Error"
        );
      }
    }
  });
}

async function postUser(req, res) {
  const { username, password, email } = req.body;
  try {
    const emailExists = await checkIfEmailExists(email);
    if (emailExists) {
      return await response(
        res,
        "error",
        400,
        "text/plain",
        "Error: Email already exists. Please choose a different email"
      );
    }

    const id = uuidv4();

    const { salt, hash } = hashPassword(password);

    const query = `
      INSERT INTO users (id, username, email, hash,salt)
      VALUES (?, ?, ?, ?,?)
    `;
    await pool.query(query, [id, username, email, hash, salt]);

    const token = generateToken({ id, username, email, hash });
    createSession(req, res, email, false);
  } catch (error) {
    console.error("Error posting user:", error);
    await response(res, "error", 500, "text/plain", "Internal Server Error");
  }
}

async function checkIfEmailExists(email) {
  const query = `SELECT COUNT(*) AS count FROM users WHERE email = ?`;
  const [rows] = await pool.query(query, [email]);
  return rows[0].count > 0;
}

async function validateUser(req, res) {
  const { email, password, rememberMe } = req.body;
  try {
    const [rows] = await pool.query("SELECT * FROM users WHERE email = ?", [
      email,
    ]);

    if (rows.length === 0) {
      return await response(
        res,
        "error",
        404,
        "text/plain",
        "Error: Username not found. Please sign up first."
      );
    }

    const user = rows[0];
    const { hash, salt } = user;

    if (verifyPassword(password, hash, salt)) {
      const token = generateToken(user);
      createSession(req, res, email, rememberMe);
    } else {
      await response(
        res,
        "error",
        400,
        "text/plain",
        "Error: Incorrect password."
      );
    }
  } catch (error) {
    console.error("Error validating user:", error);
    await response(res, "error", 500, "text/plain", "Internal Server Error");
  }
}

const generateToken = (user) => {
  const { id, username, email, hash } = user;
  const token = jwt.sign({ id, username, email, hash }, JWTKey);
  return token;
};

async function updateUser(req, res) {
  const { username, email } = req.body;

  try {
    const query = `
      UPDATE users
      SET username=?
      WHERE email = ?
    `;
    const values = [username, email];
    await pool.query(query, values);

    await response(
      res,
      "success",
      200,
      "text/plain",
      `User ${username} updated successfully`
    );
  } catch (error) {
    console.error("Error updating user:", error);
    await response(res, "error", 500, "text/plain", "Internal Server Error");
  }
}

async function getUsers(req, res) {
  try {
    const query = `SELECT * FROM users`;
    const [rows] = await pool.query(query);
    await response(res, "success", 200, CONTENT_TYPE_JSON, rows);
  } catch (error) {
    console.error("Error fetching users:", error);
    await response(res, "error", 500, "text/plain", "Internal Server Error");
  }
}

async function getUser(req, res) {
  const { email } = req.params;

  try {
    const query = `SELECT * FROM users WHERE email = ?`;
    const [rows] = await pool.query(query, [email]);
    if (rows.length === 0) {
      await response(
        res,
        "success",
        404,
        "text/plain",
        `User ${email} not found`
      );
    } else {
      await response(res, "success", 200, "application/json", rows[0]);
    }
  } catch (error) {
    console.error("Error fetching user:", error);
    await response(res, "error", 500, "text/plain", "Internal Server Error");
  }
}

async function deleteUser(req, res) {
  const { email } = req.params;

  try {
    const query = `DELETE FROM users WHERE email = ?`;
    const [result] = await pool.query(query, [email]);
    if (result.affectedRows === 0) {
      await response(
        res,
        "success",
        404,
        "text/plain",
        `User ${email} not found`
      );
    } else {
      await response(
        res,
        "success",
        200,
        "text/plain",
        `User ${email} deleted successfully`
      );
    }
  } catch (error) {
    console.error("Error deleting user:", error);
    await response(res, "error", 500, "text/plain", "Internal Server Error");
  }
}

function hashPassword(password) {
  const salt = crypto.randomBytes(16).toString("hex");
  const hash = crypto
    .pbkdf2Sync(password, salt, 100000, 64, "sha512")
    .toString("hex");
  return { salt, hash };
}

function verifyPassword(password, hash, salt) {
  const hashedPassword = crypto
    .pbkdf2Sync(password, salt, 100000, 64, "sha512")
    .toString("hex");
  return hash === hashedPassword;
}

async function logout(req, res) {
  res.setHeader("Set-Cookie", [
    "session_id=; Path=/; Max-Age=0",
    "token=; Path=/; Max-Age=0",
  ]);

  await response(res, "success", 200, "text/plain", "Logged out successfully");
}

async function checkSession(req, res) {
  sessionVerify(req, res);
}

module.exports = {
  getUsers,
  getUser,
  postUser,
  deleteUser,
  updateUser,
  validateUser,
  resetPassword,
  changePassword,
  logout,
  checkSession,
};
