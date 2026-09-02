import mongoose from 'mongoose';
import Note from '../models/Note.js';

/**
 * @desc    Get all notes (with optional search and category filter)
 * @route   GET /api/notes
 * @access  Public
 */
export const getNotes = async (req, res, next) => {
  try {
    const { search, category } = req.query;
    const filter = {};

    // Filter by category (ignore 'All' or empty category)
    if (category && category.trim() && category.toLowerCase() !== 'all') {
      filter.category = category.trim();
    }

    // Search in title or content (case-insensitive regex)
    if (search && search.trim()) {
      const searchRegex = new RegExp(search.trim(), 'i');
      filter.$or = [
        { title: { $regex: searchRegex } },
        { content: { $regex: searchRegex } },
        { tags: { $in: [searchRegex] } },
      ];
    }

    // Retrieve notes: pinned notes first, then newest first
    const notes = await Note.find(filter).sort({ isPinned: -1, createdAt: -1 });

    res.status(200).json(notes);
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get a single note by MongoDB ID
 * @route   GET /api/notes/:id
 * @access  Public
 */
export const getNoteById = async (req, res, next) => {
  try {
    const { id } = req.params;

    // Validate MongoDB ObjectId format
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(404).json({ message: 'Note not found' });
    }

    const note = await Note.findById(id);

    if (!note) {
      return res.status(404).json({ message: 'Note not found' });
    }

    res.status(200).json(note);
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Create a new note
 * @route   POST /api/notes
 * @access  Public
 */
export const createNote = async (req, res, next) => {
  try {
    const { title, content, category, tags, isPinned } = req.body;

    // Backend validation
    if (!title || !title.trim()) {
      return res.status(400).json({ message: 'Please enter a note title.' });
    }

    if (title.trim().length > 100) {
      return res.status(400).json({ message: 'Title cannot exceed 100 characters.' });
    }

    if (!content || !content.trim()) {
      return res.status(400).json({ message: 'Note content cannot be empty.' });
    }

    const note = await Note.create({
      title: title.trim(),
      content: content.trim(),
      category: category || 'General',
      tags: tags || [],
      isPinned: Boolean(isPinned),
    });

    res.status(201).json(note);
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Update an existing note
 * @route   PUT /api/notes/:id
 * @access  Public
 */
export const updateNote = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { title, content, category, tags, isPinned } = req.body;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(404).json({ message: 'Note not found' });
    }

    // Backend validation if fields are provided
    if (title !== undefined) {
      if (!title.trim()) {
        return res.status(400).json({ message: 'Please enter a note title.' });
      }
      if (title.trim().length > 100) {
        return res.status(400).json({ message: 'Title cannot exceed 100 characters.' });
      }
    }

    if (content !== undefined && !content.trim()) {
      return res.status(400).json({ message: 'Note content cannot be empty.' });
    }

    const updatedNote = await Note.findByIdAndUpdate(
      id,
      {
        ...(title !== undefined && { title: title.trim() }),
        ...(content !== undefined && { content: content.trim() }),
        ...(category !== undefined && { category }),
        ...(tags !== undefined && { tags }),
        ...(isPinned !== undefined && { isPinned: Boolean(isPinned) }),
      },
      { new: true, runValidators: true }
    );

    if (!updatedNote) {
      return res.status(404).json({ message: 'Note not found' });
    }

    res.status(200).json(updatedNote);
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Toggle pinned status of a note
 * @route   PATCH /api/notes/:id/pin
 * @access  Public
 */
export const togglePinNote = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(404).json({ message: 'Note not found' });
    }

    const note = await Note.findById(id);
    if (!note) {
      return res.status(404).json({ message: 'Note not found' });
    }

    note.isPinned = !note.isPinned;
    await note.save();

    res.status(200).json(note);
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Delete a note by ID
 * @route   DELETE /api/notes/:id
 * @access  Public
 */
export const deleteNote = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(404).json({ message: 'Note not found' });
    }

    const deletedNote = await Note.findByIdAndDelete(id);

    if (!deletedNote) {
      return res.status(404).json({ message: 'Note not found' });
    }

    res.status(200).json({ message: 'Note deleted successfully' });
  } catch (error) {
    next(error);
  }
};
