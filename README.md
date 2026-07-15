# JWT Auth API

A Node.js + Express REST API implementing secure, production-oriented JWT authentication. Built as the auth foundation for a larger multi-service project.

## Features

- User registration with bcrypt password hashing
- Login with JWT-based authentication
- Access tokens (short-lived, 15 min) + refresh tokens (long-lived, 7 days)
- RS256 (asymmetric) signing — access tokens can be verified by other services using only a public key, without exposing the signing secret
- Protected routes via reusable authentication middleware
- Refresh token revocation (logout support)
- Repository-pattern data layer, ready to swap in a real database later

## Tech Stack

- **Node.js** + **Express** — server and routing
- **bcrypt** — password hashing
- **jsonwebtoken** — JWT creation and verification (RS256)
- **dotenv** — environment variable management

## Getting Started

### Prerequisites

- Node.js installed

### Installation

```bash
git clone https://github.com/Bernardkay19/jwt-auth-api.git
cd jwt-auth-api
npm install
```

### Generate RSA key pair (required — not included in repo)

```bash
node -e "const {generateKeyPairSync} = require('crypto'); const {publicKey, privateKey} = generateKeyPairSync('rsa', {modulusLength: 2048, publicKeyEncoding:{type:'pkcs1',format:'pem'}, privateKeyEncoding:{type:'pkcs1',format:'pem'}}); require('fs').writeFileSync('private.pem', privateKey); require('fs').writeFileSync('public.pem', publicKey); console.log('Keys generated!');"
```

### Environment variables

Create a `.env` file in the project root:

```
PORT=3000
```

### Run the server

```bash
npm run dev
```

Server runs at `http://localhost:3000`.

## API Endpoints

### `POST /register`

Create a new user.

**Body:**

```json
{ "username": "alice", "password": "yourpassword" }
```

### `POST /login`

Authenticate and receive tokens.

**Body:**

```json
{ "username": "alice", "password": "yourpassword" }
```

**Response:**

```json
{ "accessToken": "...", "refreshToken": "..." }
```

### `GET /profile`

Protected route — requires a valid access token.

**Header:**

```
Authorization: Bearer <accessToken>
```

### `POST /refresh-token`

Exchange a valid refresh token for a new access token.

**Body:**

```json
{ "refreshToken": "..." }
```

### `POST /logout`

Revoke a refresh token.

**Body:**

```json
{ "refreshToken": "..." }
```

## Security Notes

- `private.pem` and `.env` are excluded from version control and must be generated/configured locally
- `public.pem` can be safely shared with other services that need to verify tokens issued by this API

## Roadmap

- [ ] Persistent database (SQLite/Postgres)
- [ ] Rate limiting
- [ ] CORS + Helmet security headers
- [ ] Centralized error handling
- [ ] Logging
