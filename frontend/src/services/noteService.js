import axios from 'axios';

// Determine API Base URL dynamically:
// In production (Render) or local with Vite proxy, use '/api'.
// This completely avoids hardcoded localhost URLs failing from a user's browser.
const getApiBaseUrl = () => {
  const envUrl = (import.meta.env.VITE_API_URL || '').trim();

  // If running in browser on a production domain (e.g. *.onrender.com), never call localhost
  if (typeof window !== 'undefined') {
    const isLiveDomain = window.location.hostname !== 'localhost' && window.location.hostname !== '127.0.0.1';
    if (isLiveDomain) {
      if (!envUrl || envUrl.includes('localhost') || envUrl.includes('127.0.0.1')) {
        return '/api';
      }
    }
  }

  return envUrl ? envUrl.replace(/\/$/, '') : '/api';
};

const API_BASE_URL = getApiBaseUrl();

const apiClient = axios.create({
  baseURL: `${API_BASE_URL}/notes`,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 15000,
});

/**
 * Fetch all notes with optional search and category filters
 * @param {string} search - Search query (matches title or content)
 * @param {string} category - Category filter ('Personal', 'Work', etc.)
 */
export const getNotes = async (search = '', category = '') => {
  const params = {};
  if (search && search.trim()) params.search = search.trim();
  if (category && category.trim() && category.toLowerCase() !== 'all') {
    params.category = category.trim();
  }

  const response = await apiClient.get('/', { params });
  return response.data;
};

/**
 * Fetch a single note by MongoDB ID
 * @param {string} id - MongoDB ObjectId
 */
export const getNoteById = async (id) => {
  const response = await apiClient.get(`/${id}`);
  return response.data;
};

/**
 * Create a new note
 * @param {Object} noteData - { title, content, category, tags }
 */
export const createNote = async (noteData) => {
  const response = await apiClient.post('/', noteData);
  return response.data;
};

/**
 * Update an existing note by ID
 * @param {string} id - MongoDB ObjectId
 * @param {Object} noteData - Updated fields
 */
export const updateNote = async (id, noteData) => {
  const response = await apiClient.put(`/${id}`, noteData);
  return response.data;
};

/**
 * Toggle pinned status of a note
 * @param {string} id - MongoDB ObjectId
 */
export const togglePinNote = async (id) => {
  const response = await apiClient.patch(`/${id}/pin`);
  return response.data;
};

/**
 * Delete a note by ID
 * @param {string} id - MongoDB ObjectId
 */
export const deleteNote = async (id) => {
  const response = await apiClient.delete(`/${id}`);
  return response.data;
};

export default {
  getNotes,
  getNoteById,
  createNote,
  updateNote,
  togglePinNote,
  deleteNote,
};
