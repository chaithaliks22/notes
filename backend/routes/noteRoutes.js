import express from 'express';
import {
  getNotes,
  getNoteById,
  createNote,
  updateNote,
  deleteNote,
  togglePinNote,
} from '../controllers/noteController.js';

const router = express.Router();

// Route: /api/notes
router.route('/')
  .get(getNotes)
  .post(createNote);

// Route: /api/notes/:id
router.route('/:id')
  .get(getNoteById)
  .put(updateNote)
  .delete(deleteNote);

// Route: /api/notes/:id/pin (toggle pin status)
router.patch('/:id/pin', togglePinNote);

export default router;
