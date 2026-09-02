# Simple Notes App – Full-Stack CRUD Application (NoteNest)

A clean, modern, and responsive Full-Stack Notes Application built using **React (Vite)**, **Node.js**, **Express.js**, and **MongoDB with Mongoose**.

This project was built to demonstrate how a decoupled frontend interacts with an Express REST API and a MongoDB database through full **CRUD** (Create, Read, Update, Delete) operations, search, category filtering, tag management, and responsive UI design.

---

## Table of Contents
- [What is CRUD?](#what-is-crud)
- [Key Features](#key-features)
- [Technology Stack](#technology-stack)
- [How It Works (Architecture Overview)](#how-it-works-architecture-overview)
- [Project Directory Structure](#project-directory-structure)
- [Prerequisites](#prerequisites)
- [Installation & Setup](#installation--setup)
  - [1. Clone Repository](#1-clone-repository)
  - [2. Backend Setup](#2-backend-setup)
  - [3. Frontend Setup](#3-frontend-setup)
  - [4. MongoDB Database Setup (Atlas or Local)](#4-mongodb-database-setup-atlas-or-local)
- [Running the Application](#running-the-application)
- [API Documentation](#api-documentation)
- [Testing the Application](#testing-the-application)
  - [UI Verification Checklist](#ui-verification-checklist)
  - [Testing with Postman / cURL](#testing-with-postman--curl)
- [Common Errors & Troubleshooting](#common-errors--troubleshooting)
- [Git & GitHub Commands](#git--github-commands)
- [Future Improvements](#future-improvements)
- [Internship / Interview Cheat Sheet](#internship--interview-cheat-sheet)

---

## What is CRUD?

**CRUD** stands for the four fundamental operations of persistent storage:

| Operation | HTTP Verb | Description in this App |
| :--- | :--- | :--- |
| **C** - Create | `POST` | Add a new note with title, content, category, and tags |
| **R** - Read | `GET` | Retrieve all notes, search/filter notes, or view a single note by ID |
| **U** - Update | `PUT` | Modify the title, body content, category, or tags of an existing note |
| **D** - Delete | `DELETE` | Permanently remove a note with safe modal confirmation |

---

## Key Features

- **Create Notes**: Add notes with title validation (1–100 characters), formatted content, category selector, and interactive tag chips.
- **View All Notes**: Responsive dashboard displaying cards with category badges, tag pills, created/updated timestamps, and action buttons.
- **View Single Note**: Dedicated details page showing complete note content, timestamps, and quick action toolbar.
- **Edit & Update**: Pre-populated form to update existing notes with validation.
- **Delete Confirmation**: Safe confirmation dialog before deletion to prevent accidental data loss.
- **Real-Time Search**: Search through note titles, contents, and tags via the backend API.
- **Category Filtering**: Filter notes by `All`, `Personal`, `Work`, `Study`, `Ideas`, and `General` with live counts.
- **Tag System**: Add tags easily by pressing <kbd>Enter</kbd> or typing commas.
- **Loading & Empty States**: Polished skeleton loading shimmer and helpful empty state illustrations.
- **User-Friendly Notifications**: Non-intrusive toast messages for creation, updates, deletions, and error handling.
- **Responsive Design**: Adapts seamlessly to Mobile (1 column), Tablet (2 columns), and Desktop (multi-column) layouts.

---

## Technology Stack

### Frontend
- **React.js (v18)**: Component-based UI library.
- **Vite**: Fast, modern frontend build tool and dev server.
- **CSS3 (Vanilla CSS)**: Custom design system, CSS variables, glassmorphic navbar, responsive CSS Grid and Flexbox.
- **React Router (v6)**: Declarative client-side routing (`/`, `/create`, `/edit/:id`, `/notes/:id`).
- **Axios**: Promise-based HTTP client for centralized backend communication.
- **Lucide React**: Modern, consistent SVG icons.

### Backend
- **Node.js**: Asynchronous JavaScript runtime.
- **Express.js (v4)**: Minimalist web framework for building REST APIs.
- **MongoDB**: NoSQL document database.
- **Mongoose (v8)**: Object Data Modeling (ODM) library for schema definition, validation, and queries.
- **dotenv**: Secure environment variable management.
- **CORS**: Cross-Origin Resource Sharing middleware.

---

## How It Works (Architecture Overview)

```
┌─────────────────────────────────────────────────────────────┐
│                      User / Web Browser                     │
└──────────────────────────────┬──────────────────────────────┘
                               │
                               ▼
┌─────────────────────────────────────────────────────────────┐
│                 React Frontend (Vite)                       │
│  - Pages: Home, CreateNote, EditNote, NoteDetails           │
│  - Components: Navbar, NoteCard, NoteForm, SearchBar        │
│  - Centralized API Service (noteService.js with Axios)      │
└──────────────────────────────┬──────────────────────────────┘
                               │ HTTP JSON Requests (port 5000)
                               ▼
┌─────────────────────────────────────────────────────────────┐
│                 Express.js REST API Backend                 │
│  - server.js: CORS, JSON parser, Route Mounting             │
│  - routes/noteRoutes.js: Endpoint routing                   │
│  - controllers/noteController.js: Business & CRUD logic     │
│  - middleware/errorMiddleware.js: 404 & CastError handlers  │
└──────────────────────────────┬──────────────────────────────┘
                               │ Mongoose Queries
                               ▼
┌─────────────────────────────────────────────────────────────┐
│                  MongoDB Database (Atlas / Local)           │
│  - Collection: notes                                        │
│  - Schema: title, content, category, tags, timestamps       │
└─────────────────────────────────────────────────────────────┘
```

1. **User Interaction**: The user clicks a button (e.g. "Save Note") in the React interface.
2. **Frontend Service**: `noteService.js` sends an HTTP request (e.g. `POST /api/notes`) with the payload.
3. **Express Router & Controller**: Express parses the JSON request body, runs validation, and calls `Note.create()`.
4. **Mongoose & MongoDB**: Mongoose validates types/constraints and saves the document to MongoDB, returning the saved record with generated `_id`, `createdAt`, and `updatedAt`.
5. **Response & UI Update**: Express sends back HTTP 201 with the created note. The React state updates, shows a success toast, and redirects to the Home page.

---

## Project Directory Structure

```
note app/
├── backend/
│   ├── config/
│   │   └── db.js                 # Database connection logic
│   ├── controllers/
│   │   └── noteController.js     # CRUD handler functions
│   ├── middleware/
│   │   └── errorMiddleware.js    # 404 & global error handling
│   ├── models/
│   │   └── Note.js               # Mongoose schema and model
│   ├── routes/
│   │   └── noteRoutes.js         # API route definitions
│   ├── .env                      # Backend environment variables
│   ├── .env.example              # Sample environment file
│   ├── .gitignore                # Backend git ignore rules
│   ├── package.json              # Backend dependencies and scripts
│   └── server.js                 # Express server entry point
│
├── frontend/
│   ├── public/                   # Static assets
│   ├── src/
│   │   ├── components/
│   │   │   ├── CategoryFilter.jsx# Category filter buttons
│   │   │   ├── ConfirmModal.jsx  # Deletion confirmation modal
│   │   │   ├── EmptyState.jsx    # Placeholder when no notes match
│   │   │   ├── Navbar.jsx        # Sticky navigation bar
│   │   │   ├── NoteCard.jsx      # Individual note card in grid
│   │   │   ├── NoteForm.jsx      # Form for creating & editing notes
│   │   │   ├── SearchBar.jsx     # Search input with clear button
│   │   │   └── Toast.jsx         # Toast alert notifications
│   │   ├── pages/
│   │   │   ├── CreateNote.jsx    # New note page
│   │   │   ├── EditNote.jsx      # Note editing page
│   │   │   ├── Home.jsx          # Dashboard with search & grid
│   │   │   └── NoteDetails.jsx   # Single note view page
│   │   ├── services/
│   │   │   └── noteService.js    # Centralized Axios API requests
│   │   ├── App.jsx               # Application layout & routing
│   │   ├── index.css             # Complete design system
│   │   └── main.jsx              # React DOM entry point
│   ├── .env                      # Frontend environment variables
│   ├── .env.example              # Sample frontend environment file
│   ├── .gitignore                # Frontend git ignore rules
│   ├── index.html                # HTML entry point with Google Fonts
│   ├── package.json              # Frontend dependencies and scripts
│   └── vite.config.js            # Vite configuration
│
├── .gitignore                    # Root repository git ignore
└── README.md                     # Comprehensive documentation
```

---

## Prerequisites

Ensure you have installed on your machine:
- **Node.js** (v16 or higher, recommended v18+)
- **npm** (v8 or higher)
- A **MongoDB Atlas** account (free tier) OR a **local MongoDB** installation.

---

## Installation & Setup

### 1. Clone Repository
```bash
git clone <your-repository-url>
cd "note app"
```

### 2. Backend Setup
Open a terminal in the project root:
```bash
cd backend
npm install
```

Create your `.env` file in the `backend/` directory:
```bash
cp .env.example .env
```
Ensure `backend/.env` contains:
```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
NODE_ENV=development
```

### 3. Frontend Setup
Open a second terminal window in the project root:
```bash
cd frontend
npm install
```

Create your `.env` file in the `frontend/` directory:
```bash
cp .env.example .env
```
Ensure `frontend/.env` contains:
```env
VITE_API_URL=http://localhost:5000/api
```

### 4. MongoDB Database Setup (Atlas or Local)

#### Option A: MongoDB Atlas (Cloud - Recommended)
1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) and create a free account.
2. Build a free **M0 Shared Cluster**.
3. Under **Database Access**, create a user with a username and password.
4. Under **Network Access**, add IP Address `0.0.0.0/0` (allow access from anywhere) for development.
5. Click **Connect** → **Drivers** (Node.js) and copy your connection string:
   ```
   mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/notes-app?retryWrites=true&w=majority
   ```
6. Replace `<username>` and `<password>` with your database user credentials and paste into `backend/.env` as `MONGO_URI`.

#### Option B: Local MongoDB
If you have MongoDB installed locally, set:
```env
MONGO_URI=mongodb://127.0.0.1:27017/notes-app
```

*(Note: If no database is detected, the backend includes a development memory fallback so you can test CRUD operations right away!)*

---

## Running the Application

### 1. Start the Backend Server
In the `backend` terminal:
```bash
npm run dev
```
You will see output:
```
Server running on port 5000
API Base URL: http://localhost:5000/api/notes
MongoDB connected successfully
```

### 2. Start the Frontend Application
In the `frontend` terminal:
```bash
npm run dev
```
Open your browser and navigate to:
```
http://localhost:5173
```

---

## API Documentation

Base URL: `http://localhost:5000/api/notes`

| Method | Endpoint | Description | Query Params | Status Codes |
| :--- | :--- | :--- | :--- | :--- |
| **GET** | `/api/notes` | Get all notes | `?search=...`<br>`?category=...` | `200 OK` |
| **POST** | `/api/notes` | Create a new note | N/A | `201 Created`<br>`400 Bad Request` |
| **GET** | `/api/notes/:id` | Get note by ID | N/A | `200 OK`<br>`404 Not Found` |
| **PUT** | `/api/notes/:id` | Update note by ID | N/A | `200 OK`<br>`400 Bad Request`<br>`404 Not Found` |
| **DELETE** | `/api/notes/:id` | Delete note by ID | N/A | `200 OK`<br>`404 Not Found` |
| **GET** | `/api/health` | API Health check | N/A | `200 OK` |

### Sample Payloads

#### 1. Create Note (`POST /api/notes`)
**Request Body:**
```json
{
  "title": "Study System Architecture",
  "content": "Review client-server communication, REST standards, and database indexing.",
  "category": "Study",
  "tags": ["architecture", "backend", "interview"]
}
```
**Response (`201 Created`):**
```json
{
  "_id": "65e01234567890abcdef1234",
  "title": "Study System Architecture",
  "content": "Review client-server communication, REST standards, and database indexing.",
  "category": "Study",
  "tags": ["architecture", "backend", "interview"],
  "createdAt": "2026-09-01T16:00:00.000Z",
  "updatedAt": "2026-09-01T16:00:00.000Z",
  "__v": 0
}
```

#### 2. Update Note (`PUT /api/notes/:id`)
**Request Body:**
```json
{
  "title": "Study System Architecture & Caching",
  "content": "Added Redis notes to the architecture study plan.",
  "category": "Study",
  "tags": ["architecture", "backend", "redis"]
}
```

#### 3. Delete Note (`DELETE /api/notes/:id`)
**Response (`200 OK`):**
```json
{
  "message": "Note deleted successfully"
}
```

---

## Testing the Application

### UI Verification Checklist
- [x] **Home Dashboard**: Displays header, search bar, category filters, and note cards.
- [x] **Create Note**: Form validates required title and content; saves and redirects with success toast.
- [x] **Character Counter**: Real-time counter tracks title length (1–100 characters).
- [x] **Tags Input**: Allows pressing <kbd>Enter</kbd> or comma to add multiple tags; tag badges have delete buttons.
- [x] **Search**: Typing in search bar queries backend and filters notes by title, content, or tag.
- [x] **Category Filter**: Clicking categories (Work, Personal, Study, Ideas, General) filters the list.
- [x] **Note Details**: Viewing a note shows full formatted text and creation/update timestamps.
- [x] **Edit Note**: Form pre-populates with existing data; saving updates backend record.
- [x] **Delete Confirmation**: Deleting triggers a modal dialog; confirming deletes note and displays success toast.
- [x] **Empty State**: Displays helpful graphics when no notes exist or filters return zero matches.
- [x] **Mobile Responsiveness**: Layout shifts from 3 columns on desktop to 2 on tablet and 1 on mobile.

### Testing with Postman / cURL

#### Create a note:
```bash
curl -X POST http://localhost:5000/api/notes \
  -H "Content-Type: application/json" \
  -d '{"title":"API Test Note","content":"Testing API via curl","category":"Work","tags":["test"]}'
```

#### Get all notes:
```bash
curl http://localhost:5000/api/notes
```

#### Search notes:
```bash
curl http://localhost:5000/api/notes?search=API
```

---

## Common Errors & Troubleshooting

| Error / Issue | Cause | Solution |
| :--- | :--- | :--- |
| `MongooseServerSelectionError: connect ECONNREFUSED` | MongoDB is not running locally and no valid Atlas URI was provided | Check that `MONGO_URI` in `backend/.env` is correct or start your local MongoDB daemon. |
| `CORS Error: No 'Access-Control-Allow-Origin' header` | Frontend URL differs from backend CORS whitelist | In `backend/server.js`, confirm that `http://localhost:5173` is listed in allowed origins. |
| `CastError: Cast to ObjectId failed` | Invalid ID string passed in `/api/notes/:id` | The app includes Mongoose ID validation and returns a clean 404 response instead of crashing. |
| `Validation Error: Please enter a note title` | Empty or whitespace-only title submitted | Ensure both frontend form validation and backend Mongoose schema validation pass. |

---

## Git & GitHub Commands

To initialize and push this project to your GitHub account:

```bash
# 1. Initialize Git repository in the root directory
git init

# 2. Stage all files (respecting .gitignore)
git add .

# 3. Create initial commit
git commit -m "Initial commit - Notes App Full-Stack CRUD"

# 4. Set main branch
git branch -M main

# 5. Link to your GitHub repository
git remote add origin https://github.com/<your-username>/<your-repo-name>.git

# 6. Push code to GitHub
git push -u origin main
```

---

## Future Improvements

- **User Authentication**: Implement JWT or OAuth (Google Login) for multi-user private notes.
- **Dark Mode**: Add a theme switcher using CSS custom properties.
- **Rich Text / Markdown Editor**: Support bold, italics, code blocks, and markdown preview.
- **Pin & Archive**: Allow pinning priority notes to the top of the dashboard.
- **Cloud Image Attachments**: Support uploading images via Cloudinary or AWS S3.
- **Export Notes**: Export notes as PDF, Markdown, or JSON files.

---

## Internship / Interview Cheat Sheet

> **How to explain this project in an interview or project evaluation:**
>
> *"NoteNest is a full-stack CRUD application built on the MERN stack architecture (MongoDB, Express, React, Node.js).
>
> On the frontend, I used **React with Vite** for fast builds, **Vanilla CSS** with a design system for modern aesthetics, and **Axios** encapsulated in a dedicated service layer to keep components decoupled from network logic.
>
> On the backend, I built an **Express.js REST API** following the Model-Controller-Route pattern. I used **Mongoose** for data modeling, input validation, and automatic timestamping.
>
> The API supports full CRUD operations, regex-based multi-field search across titles and content, and category filtering.
>
> I implemented robust error handling with custom middleware to gracefully catch invalid ObjectIds, validation errors, and 404 routes, ensuring friendly feedback to the user via toast alerts."*
