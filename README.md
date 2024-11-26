# NestJS Product Management API

A RESTful API built with NestJS and MongoDB for product management with JWT authentication and role-based access control.

## Features

- 🔐 JWT Authentication
- 👥 Role-based Access Control (Admin/User)
- 📦 Product CRUD Operations
- 🛡️ Request Validation
- 📝 Detailed API Logging
- 🔍 Error Handling
- 📊 MongoDB Integration

## Prerequisites

- Node.js
- MongoDB
- npm

## Installation

1. Clone the repository:

```bash
git clone https://github.com/hassan-kamel/fixed-be-task.git
```

```bash
cd fixed-be-task
```

2. Install dependencies:

```bash
npm install
```

3. Configure Environment Variables:

Create a `.env` file in the root directory with the following variables:

```bash
# MongoDB Connection
MONGODB_URI=mongodb://localhost:27017/your_database

# JWT Configuration
JWT_SECRET=your_jwt_secret_key
JWT_EXPIRATION=24h

# Server Configuration
PORT=3000
NODE_ENV=development
```

## Compile and run the project

### Development mode

```bash
$ npm run start:dev
```

### Production mode

```bash
$ npm run start:prod
```
