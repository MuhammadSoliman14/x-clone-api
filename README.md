# X Clone API

A REST API for a small Twitter/X style social network, built with Node.js, Express 5, TypeScript and MongoDB. Users can register, post tweets, follow each other, like and bookmark tweets, and receive notifications when something happens to them.

## Stack

- Node.js with Express 5
- TypeScript, run in development with tsx
- MongoDB with Mongoose
- JWT authentication with bcrypt password hashing
- Zod request validation
- Helmet, CORS and express-rate-limit
- Vitest, Supertest and mongodb-memory-server for tests

## Getting started

You need Node.js 20 or newer and a MongoDB instance (local or Atlas).

```bash
git clone https://github.com/MuhammadSoliman14/x-clone-api.git
cd x-clone-api
npm install
cp .env.example .env
```

Fill in `.env`:

| Variable     | Description                                   |
| ------------ | --------------------------------------------- |
| `PORT`       | Port to listen on. Defaults to 8080.          |
| `MONGO_URI`  | MongoDB connection string. Required.          |
| `JWT_SECRET` | Secret used to sign tokens. Required.         |

The server exits on startup if `MONGO_URI` or `JWT_SECRET` is missing.

Start the development server with reload on change:

```bash
npm run dev
```

Or build and run the compiled output:

```bash
npm run build
npm start
```

## Authentication

Register, then log in to receive a token. Send it on protected routes as a bearer token:

```
Authorization: Bearer <token>
```

Tokens carry the user id and role. Protected routes accept the `user` and `admin` roles. Requests without a token or with an invalid one receive a 401.

## API reference

Routes marked "auth" require a bearer token.

### Auth

| Method | Path             | Description                          |
| ------ | ---------------- | ------------------------------------ |
| POST   | `/auth/register` | Create an account                    |
| POST   | `/auth/login`    | Log in and receive `{ "token": ... }` |

Registration expects `username` (3 to 20 characters), `name`, `email` and `password` (at least 6 characters). Login expects `username` and `password`.

### Users

| Method | Path                | Auth | Description                                |
| ------ | ------------------- | ---- | ------------------------------------------ |
| GET    | `/users`            | no   | List users                                 |
| GET    | `/users/search?q=`  | no   | Search users by username prefix (max 20)   |
| GET    | `/users/:id`        | no   | Get a user                                 |
| DELETE | `/users/:id`        | yes  | Delete a user                              |

### Tweets

| Method | Path                    | Auth | Description               |
| ------ | ----------------------- | ---- | ------------------------- |
| POST   | `/tweets`               | yes  | Create a tweet            |
| GET    | `/tweets/:id`           | no   | Get a tweet               |
| DELETE | `/tweets/:id`           | yes  | Delete a tweet            |
| GET    | `/tweets/users/:id/tweets` | no | List a user's tweets     |
| POST   | `/tweets/:id/like`      | yes  | Like a tweet              |
| POST   | `/tweets/:id/unlike`    | yes  | Remove a like             |
| POST   | `/tweets/:id/bookmark`  | yes  | Bookmark a tweet          |
| POST   | `/tweets/:id/unbookmark`| yes  | Remove a bookmark         |

Tweet `content` must be between 1 and 280 characters.

### Follows

| Method | Path                    | Auth | Description                     |
| ------ | ----------------------- | ---- | ------------------------------- |
| POST   | `/follow/:id/follow`    | yes  | Follow a user                   |
| POST   | `/follow/:id/unfollow`  | yes  | Unfollow a user                 |
| GET    | `/follow/:id/followers` | yes  | List a user's followers         |
| GET    | `/follow/:id/following` | yes  | List who a user follows         |

### Notifications

| Method | Path                         | Auth | Description                  |
| ------ | ---------------------------- | ---- | ---------------------------- |
| GET    | `/notifications`             | yes  | List your notifications      |
| PATCH  | `/notifications/:id/read`    | yes  | Mark one as read             |
| PATCH  | `/notifications/read-all`    | yes  | Mark all as read             |

Following, unfollowing and similar actions create a notification for the affected user.

### Errors

Errors are returned as JSON in the form `{ "message": "..." }`. Unknown routes return 404. The API is rate limited to 100 requests per IP every 15 minutes.

## Testing

```bash
npm test
```

Tests run against an in-memory MongoDB provided by `mongodb-memory-server`, so no database setup is needed. The first run downloads a MongoDB binary, which can take a minute. Collections are cleared after every test.

## Project structure

```
src/
  app.ts          Express app: middleware and route mounting
  index.ts        Entry point: env checks, database connection, server start
  config/         Configuration
  controllers/    Request handlers
  middleware/     Authentication and validation
  models/         Mongoose models
  routes/         Route definitions
  validators/     Zod schemas
  utils/          Shared helpers
  tests/          Vitest suites
```

`app.ts` is kept separate from `index.ts` so tests can import the app without opening a database connection or a port.
