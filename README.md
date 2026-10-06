# Messaging App API

A robust backend service for a messaging application that enables users to communicate with each other through direct messages and group chats. Built with Node.js and Express, featuring authentication, file uploads, and user management.

## 🔗 Related Projects

- **[Messaging App Client](https://github.com/ChoforJr/messaging-app)** - Frontend repository for this API

## 📋 Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Environment Variables](#environment-variables)
- [Running the Project](#running-the-project)
- [Project Structure](#project-structure)
- [Troubleshooting](#troubleshooting)
- [Author](#author)
- [Related Projects](#related-projects)

## ✨ Features

- **User Authentication** - Secure login/signup with JWT tokens
- **Direct Messaging** - One-on-one messaging between users
- **Group Chats** - Create and manage group conversations
- **User Profiles** - Customizable user profiles with display names and bios
- **File Uploads** - Share files with Cloudinary integration
- **User Following** - Follow/unfollow other users
- **Contact Management** - Maintain a list of contacts
- **Realtime Messaging** - Authenticated Socket.IO message events for direct chats and groups
- **Password Hashing** - Secure password storage with bcryptjs
- **CORS Security** - Configurable CORS whitelisting

## 🛠 Tech Stack

- **Runtime:** Node.js (ES Modules)
- **Framework:** Express.js
- **Database:** PostgreSQL with Prisma ORM
- **Authentication:** Passport.js (JWT & Local Strategy)
- **Password Hashing:** bcryptjs
- **File Storage:** Cloudinary with Multer
- **Validation:** express-validator
- **Language:** TypeScript

## 📦 Prerequisites

- Node.js (v20.19+, v22.12+, or v24+; required by Prisma 7)
- PostgreSQL database
- Cloudinary account (for file uploads)
- npm

## 🚀 Installation

1. **Clone the repository**

   ```bash
   git clone https://github.com/ChoforJr/messaging-app-api.git
   cd messaging-app-api
   ```

2. **Install dependencies**

   ```bash
   npm ci
   ```

   The checked-in `.npmrc` enables `legacy-peer-deps` because `multer-storage-cloudinary@4` declares a Cloudinary 1.x peer range while this app uses Cloudinary 2.x. This setting is also used by Render installs.

3. **Set up the database**

   Put your PostgreSQL connection string in `.env` as `DATABASE_URL`, then apply the existing migrations:

   ```bash
   npm run prisma:migrate:dev
   ```

## 🔧 Environment Variables

Create a `.env` file in the root directory with the following variables:

```env
# Database
DATABASE_URL=postgresql://user:password@localhost:5432/messaging_app_api

# JWT Secret
SECRET_KEY=<your-secret-key-here>

# Cloudinary Configuration
CLOUDINARY_URL=cloudinary://cloud_name:api_key:api_secret

# CORS
ALLOWED_URL1=http://localhost:3000


# Port (optional)
PORT=5000
```

### Generating JWT Secret

To generate a secure JWT secret, run:

```bash
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
```

Copy the output and paste it as your `SECRET_KEY` in the `.env` file.

## ▶️ Running the Project

### Development Mode

```bash
npm run dev
```

Starts the TypeScript server with `tsx` file watching enabled.
In another terminal, use `npm run prisma:migrate:dev` after changing the Prisma schema.

### Production Build

```bash
npm run build
npm run prisma:migrate:deploy
npm start
```

Build generates the Prisma client, compiles TypeScript into `dist/`, and copies the runtime assets. Apply committed migrations separately during deployment with `npm run prisma:migrate:deploy`; do not run `prisma migrate dev` against production. The legacy `npm run prismaMg` command remains as a compatibility alias for `prisma migrate deploy` for existing Render service settings.

For Render, set the service root directory to the API repository root, build command to `npm ci --include=dev && npm run build`, pre-deploy command to `npm run prisma:migrate:deploy`, and start command to `npm start`. Do not run `npm start` in the build command; Render must launch the compiled server using its separate start command. If the existing build command still invokes `npm run prismaMg`, it works as a compatibility alias, but move migrations to Render's pre-deploy command so they run only after a successful build.

### Database Commands

```bash
# Generate Prisma Client
npm run prisma:generate

# Create/apply development migrations (name is optional; pass it after --)
npm run prisma:migrate:dev -- --name describe_the_change

# Apply committed migrations in deployment
npm run prisma:migrate:deploy

# Check migration state or open Prisma Studio
npm run prisma:migrate:status
npm run prisma:studio
```

Use `npm run typecheck` for a no-emit TypeScript check.

## 📂 Project Structure

```
messaging-app-api/
├── config/              # TypeScript configuration files
├── controllers/         # TypeScript request handlers
├── routes/              # TypeScript API route definitions
├── validations/         # TypeScript input validation middleware
│   └── validationChanges/
├── prisma_queries/      # Typed database queries
├── prisma/             # Prisma schema and migrations
├── public/             # Static files and client assets
├── app.ts              # Express app initialization
├── prisma.config.ts    # Prisma CLI configuration
├── tsconfig.json        # TypeScript compiler configuration
└── package.json        # Project dependencies
```

## 🐛 Troubleshooting

### Multer Dependency Conflict

The repository `.npmrc` configures npm to honor the existing Cloudinary 1.x peer-dependency mismatch. Make sure `.npmrc` is included in the deployed commit; use `npm ci` so Render installs from the checked-in lockfile.

### CORS Errors

Ensure your frontend URL is added to the `ALLOWED_URL1` (or `ALLOWED_URL2`, etc.) environment variable. The server logs blocked origins for debugging.

### Database Connection Issues

- Verify your `DATABASE_URL` in `.env` is correct
- Ensure PostgreSQL is running
- Check that the database exists

### Prisma Client Not Found

Regenerate the Prisma client:

```bash
npm run prisma:generate
```

## Realtime Messaging

Socket.IO runs on the same HTTP server and port as Express. Clients authenticate their socket handshake with the JWT returned by `/login`. After a text or image message is persisted through the existing REST API, the server emits a `message:new` event to the sender and intended recipients. For group messages, recipients are resolved from the group's current members. The event contains a message ID and conversation type; clients fetch the persisted messages over the authenticated REST endpoints.

The socket server accepts the same configured frontend origins as the HTTP API (`ALLOWED_URL1` through `ALLOWED_URL4`). Keep the REST API and WebSocket endpoint on the same public host when deploying.

Message history endpoints return the latest 100 messages first (newest first); the client displays them chronologically. Request older pages with `?before=<message-createdAt-ISO-date>&beforeId=<message-id>` on `/message/all` or `/message/all/groups`; continue using the oldest loaded message's date and ID as the cursor. The new message-history indexes are in Prisma migrations and should be applied with the normal deployment migration process.

## 👤 Author

**Forsakang Chofor Junior**

- [GitHub](https://github.com/ChoforJr)
- [LinkedIn](https://www.linkedin.com/in/choforforsakang/)
