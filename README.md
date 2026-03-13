# Messaging App API

A robust backend service for a messaging application that enables users to communicate with each other through direct messages and group chats. Built with Node.js and Express, featuring authentication, file uploads, and user management.

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
- **Language:** JavaScript with TypeScript definitions

## 📦 Prerequisites

- Node.js (v16 or higher recommended)
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
   npm install
   ```

   > **Note:** If you encounter dependency conflicts, use the following command:

   ```bash
   npm install multer-storage-cloudinary --legacy-peer-deps
   ```

3. **Set up the database**
   ```bash
   npm run prismaGen
   ```

## 🔧 Environment Variables

Create a `.env` file in the root directory with the following variables:

```env
# Database
DATABASE_URL=postgresql://user:password@localhost:5432/messaging_app_api

# JWT Secret
JWT_SECRET=<your-secret-key-here>

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

Copy the output and paste it as your `JWT_SECRET` in the `.env` file.

## ▶️ Running the Project

### Development Mode

```bash
npm run dev
```

Starts the server with file watching enabled using `--watch` flag.

### Production Build

```bash
npm run build
npm start
```

### Database Commands

```bash
# Generate Prisma Client
npm run prismaGen

# Run migrations
npm run prismaMg

# Generate raw SQL queries
npm run startRawSql
```

## 📂 Project Structure

```
messaging-app-api/
├── config/              # Configuration files
│   ├── cloudinary.js    # Cloudinary setup
│   ├── passport.js      # Authentication strategies
│   └── prisma.js        # Database client
├── controllers/         # Request handlers
│   ├── add.js          # Create operations
│   ├── edit.js         # Update operations
│   ├── read.js         # Retrieve operations
│   └── remove.js       # Delete operations
├── routes/             # API route definitions
│   ├── authRouter.js   # Authentication endpoints
│   ├── userRouter.js   # User management endpoints
│   ├── messageRouter.js# Message endpoints
│   ├── groupRouter.js  # Group chat endpoints
│   ├── fileRouter.js   # File upload endpoints
│   └── indexRouter.js  # Index routes
├── validations/        # Input validation middleware
│   ├── validateSignUp.js
│   ├── validateLogIn.js
│   ├── validateMessage.js
│   ├── validateGroup.js
│   └── validationChanges/
├── prisma_queries/     # Raw database queries
├── prisma/             # Prisma schema and migrations
├── public/             # Static files and client assets
├── app.js              # Express app initialization
└── package.json        # Project dependencies
```

## 🐛 Troubleshooting

### Multer Dependency Conflict

If you see dependency conflict errors with `multer-storage-cloudinary`:

```bash
npm install multer-storage-cloudinary --legacy-peer-deps
```

### CORS Errors

Ensure your frontend URL is added to the `ALLOWED_URL1` (or `ALLOWED_URL2`, etc.) environment variable. The server logs blocked origins for debugging.

### Database Connection Issues

- Verify your `DATABASE_URL` in `.env` is correct
- Ensure PostgreSQL is running
- Check that the database exists

### Prisma Client Not Found

Regenerate the Prisma client:

```bash
npm run prismaGen
```

## 👤 Author

**Forsakang Chofor Junior**

- [GitHub](https://github.com/ChoforJr)
- [LinkedIn](https://www.linkedin.com/in/choforforsakang/)

## 🔗 Related Projects

- **[Messaging App Client](https://github.com/ChoforJr/messaging-app)** - Frontend repository for this API
