# NestJS + Mongoose Boilerplate (TypeScript, DTOs, Swagger)

## Overview
Minimal NestJS project with:
- TypeScript
- DTOs using `class-validator` / `class-transformer`
- Swagger (OpenAPI)
- Mongoose integration
- Example `users` module (CRUD)

## Setup
1. Copy `.env.example` to `.env` and set `MONGO_URI` and `PORT`.
2. Install dependencies:
   ```bash
   npm install
   ```
3. Run in dev:
   ```bash
   npm run start:dev
   ```
4. Build:
   ```bash
   npm run build
   npm run start:prod
   ```

Swagger UI will be available at `http://localhost:3000/api` (if PORT=3000).

## Notes
- Passwords are stored as plain strings in this example. Add hashing before saving to DB.
- This is a minimal starting point—adapt to your project's needs.
