# Team Task Manager

A full-stack Team Task Management web application built with React, Node.js, Express, MongoDB, and JWT authentication.

The app lets users create projects, invite team members, assign tasks, update task status, and track team progress through a dashboard.

## Features

- User signup and login with JWT authentication
- Project creation with the creator as `Admin`
- Admin/member role-based access
- Add and remove project members
- Create, assign, update, and delete tasks
- Members can view and update only their assigned tasks
- Dashboard metrics for total tasks, task status, assignments, and overdue work
- Responsive React UI with animated workspace interactions
- Production-ready Express server that serves the built frontend

## Tech Stack

- Frontend: React, Vite, Zustand, Tailwind CSS, GSAP
- Backend: Node.js, Express.js
- Database: MongoDB with Mongoose
- Authentication: JWT, bcrypt

## Project Structure

```text
.
|-- backend
|   |-- src
|   |   |-- config
|   |   |-- middleware
|   |   |-- models
|   |   |-- routes
|   |   |-- utils
|   |   `-- server.js
|   |-- .env.example
|   `-- package.json
|-- frontend
|   |-- src
|   |   |-- api
|   |   |-- components
|   |   |-- features
|   |   |-- hooks
|   |   |-- store
|   |   |-- utils
|   |   |-- App.jsx
|   |   |-- main.jsx
|   |   `-- styles.css
|   |-- .env.example
|   |-- vite.config.js
|   `-- package.json
|-- package.json
`-- README.md
```

## Prerequisites

- Node.js 18 or newer
- npm
- MongoDB running locally, or a MongoDB Atlas connection string

## Environment Variables

Create `backend/.env`:

```env
PORT=5000
MONGO_URI=mongodb://127.0.0.1:27017/team_task_manager
JWT_SECRET=replace-with-a-long-random-secret
CLIENT_URL=http://localhost:5173
```

Create `frontend/.env`:

```env
VITE_API_URL=http://localhost:5000/api
```

For production, the frontend is served by the backend after build, so `VITE_API_URL` is usually not required unless you deploy frontend and backend separately.

## Local Setup

Install dependencies from the project root:

```bash
npm install
```

The root `postinstall` script installs dependencies for both `backend` and `frontend`.

Start MongoDB locally, then run the app:

```bash
npm run dev
```

Local URLs:

```text
Frontend: http://localhost:5173
Backend:  http://localhost:5000
Health:   http://localhost:5000/api/health
```

Run only the backend:

```bash
npm run dev --prefix backend
```

Run only the frontend:

```bash
npm run dev --prefix frontend
```

## Production Build

Build the frontend from the project root:

```bash
npm run build
```

Start the production server:

```bash
npm start
```

In production mode, Express serves the Vite build from `frontend/dist`.

## Deployment

For deployment, build the frontend and run the backend server in production mode. The backend serves both the API and the compiled frontend from `frontend/dist`.

Required production variables:

```env
NODE_ENV=production
MONGO_URI=<your production MongoDB connection string>
JWT_SECRET=<a long random secret>
```

Optional production variable:

```env
CLIENT_URL=<your deployed frontend URL>
```

Recommended production commands:

```bash
npm install
npm run build
npm start
```

Use a hosted MongoDB database for deployment because production servers should not depend on a local MongoDB instance.

## Available Scripts

Root scripts:

```bash
npm install          # install root, backend, and frontend dependencies
npm run dev          # run backend and frontend together
npm run build        # build frontend for production
npm start            # start backend production server
```

Backend scripts:

```bash
npm run dev --prefix backend
npm start --prefix backend
```

Frontend scripts:

```bash
npm run dev --prefix frontend
npm run build --prefix frontend
npm run preview --prefix frontend
```

## API Overview

Base URL:

```text
http://localhost:5000/api
```

Authentication header for protected routes:

```http
Authorization: Bearer <jwt_token>
```

Main endpoints:

```text
GET    /health
POST   /auth/signup
POST   /auth/login
GET    /auth/me
GET    /projects
POST   /projects
POST   /projects/:projectId/members
DELETE /projects/:projectId/members/:userId
GET    /tasks/project/:projectId
POST   /tasks
PATCH  /tasks/:taskId
DELETE /tasks/:taskId
GET    /dashboard
```

## Roles

Admin:

- Create and manage projects
- Add or remove members
- Create, assign, update, and delete tasks
- View all project tasks

Member:

- View assigned projects
- View only assigned tasks
- Update assigned task status

## Database Models

User:

- `name`
- `email`
- `password`

Project:

- `name`
- `description`
- `createdBy`
- `members`: user reference and role

Task:

- `project`
- `title`
- `description`
- `dueDate`
- `priority`
- `status`
- `assignee`
- `createdBy`

## Deployment Notes

- Do not commit real `.env` files.
- Use a strong `JWT_SECRET` in production.
- Use a hosted MongoDB database for production.
- A typical deployment flow runs `npm install`, then `npm run build`, then `npm start`.
- The backend serves both `/api/*` routes and the production frontend.
