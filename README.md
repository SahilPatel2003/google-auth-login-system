# Google OAuth User Authentication System

This repository contains a user authentication system with Google OAuth integration. Users can register and log in using email/password or directly authenticate via Google for a smoother experience. The system also includes secure password recovery and session management.

---

## Features

### 1. User Registration
- **Email/Password Registration**: Users can register using their username, password, and email address.
- **Google OAuth Registration**: Users can skip manual input and register directly using their Google account.

### 2. Login
- **Email/Password Login**: Login with registered credentials.
- **Google OAuth Login**: Login seamlessly using Google OAuth.
- **"Remember Me" Option**: 
  - When selected, the session lasts for a defined period.
  - Without "Remember Me," users are logged out when the browser closes.

### 3. Forgot Password
- **Password Recovery**: Users can request a password reset link via email.
- **One-Time Use Link**: The reset link expires after a specific time or upon use.

### 4. Security Features
- **Session Management**: Securely handles session expiration and "Remember Me" functionality.
- **Token Expiry**: Password reset tokens expire after a single use or after the time limit.

---

## Technology Stack

### Backend:
- **HTTP**  
- **Node.js**  
- **MySQL**  

### Frontend:
- **HTML**  
- **CSS**

---

## Getting Started

### Prerequisites
1. **Node.js** installed on your machine.
2. **MySQL** database set up.
3. A **Google OAuth Client ID and Secret** (Create credentials in Google Cloud Console).
