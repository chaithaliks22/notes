import axios from 'axios';

// Base URL configured from environment variable with fallback
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const apiClient = axios.create({
  baseURL: `${API_BASE_URL}/notes`,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000,
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
