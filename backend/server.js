import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import mongoose from 'mongoose';
import { connectDB } from './config/db.js';
import noteRoutes from './routes/noteRoutes.js';
import { notFound, errorHandler } from './middleware/errorMiddleware.js';

// Load environment variables from .env
dotenv.config();

// Connect to MongoDB
connectDB();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const distPath = path.resolve(__dirname, '../frontend/dist');

const app = express();

// Middleware: Enable CORS for frontend requests
const allowedOrigins = [
  'http://localhost:5173',
  'http://127.0.0.1:5173',
  'http://localhost:3000',
];
if (process.env.CLIENT_URL) {
  allowedOrigins.push(process.env.CLIENT_URL.replace(/\/$/, ''));
}

app.use(cors({
  origin: (origin, callback) => {
    // Allow requests with no origin (like curl, postman, or same-origin requests)
    if (!origin || allowedOrigins.includes(origin) || process.env.NODE_ENV === 'production') {
      callback(null, true);
    } else {
      callback(null, true);
    }
  },
  credentials: true,
}));

// Middleware: Parse incoming JSON request bodies
app.use(express.json());

// API Root Health Check
app.get('/api/health', (req, res) => {
  const isDbConnected = mongoose.connection.readyState === 1;
  res.status(200).json({
    status: 'success',
    database: isDbConnected ? 'connected' : 'disconnected',
    message: isDbConnected
      ? 'NoteNest API is running smoothly'
      : 'NoteNest server is running. Database connection is pending (check MONGO_URI).',
    timestamp: new Date().toISOString(),
  });
});

// Mount Notes Routes
app.use('/api/notes', noteRoutes);

// Optional: Serve frontend static build if frontend/dist exists
if (fs.existsSync(distPath)) {
  console.log(`📁 Serving frontend static build from: ${distPath}`);
  app.use(express.static(distPath));
  app.get('*', (req, res, next) => {
    // Only serve index.html for non-API routes
    if (req.originalUrl.startsWith('/api')) {
      return next();
    }
    res.sendFile(path.join(distPath, 'index.html'));
  });
} else {
  console.warn(`⚠️ Warning: frontend/dist not found at ${distPath}`);
  app.get('/', (req, res) => {
    res.status(200).send(`
      <!DOCTYPE html>
      <html>
        <head><title>NoteNest API</title><meta name="viewport" content="width=device-width, initial-scale=1.0"></head>
        <body style="font-family: system-ui, -apple-system, sans-serif; text-align: center; padding: 4rem 1rem; line-height: 1.6; color: #1e293b;">
          <h1 style="color: #4f46e5;">🚀 NoteNest API Server is Live</h1>
          <p>The Express REST API is running on Render.</p>
          <p><a href="/api/health" style="color: #4f46e5;">Check /api/health</a> | <a href="/api/notes" style="color: #4f46e5;">View /api/notes</a></p>
        </body>
      </html>
    `);
  });
}

// Fallback & Error Handling Middlewares
app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`API Base URL: http://localhost:${PORT}/api/notes`);
});
