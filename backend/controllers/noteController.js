import mongoose from 'mongoose';
import Note from '../models/Note.js';

// In-memory fallback store used whenever MongoDB connection is not active
let memoryNotes = [
  {
    _id: '65e01234567890abcdef0001',
    title: '🚀 MERN Stack Architecture Overview',
    content: 'Full-stack application structured into:\n- Frontend: React (Vite) + CSS Variables + Axios\n- Backend: Express.js REST API with clean MVC structure\n- Database: MongoDB with Mongoose schema validation\n- Features: Full CRUD, real-time debounced search, category filtering, and tag management.',
    category: 'Work',
    tags: ['mern', 'architecture', 'react', 'express', 'mongodb'],
    isPinned: true,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 4).toISOString(),
    updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 4).toISOString(),
  },
  {
    _id: '65e01234567890abcdef0002',
    title: '📚 System Design & Database Indexing',
    content: 'Key concepts to remember for technical evaluations:\n1. Compound Indexes: e.g. { isPinned: -1, createdAt: -1 } for fast sorted retrieval.\n2. Text Search: MongoDB text indexes support multi-field querying.\n3. Separation of Concerns: Route handling, controller logic, and database schemas should remain decoupled.',
    category: 'Study',
    tags: ['database', 'indexing', 'system-design', 'interview'],
    isPinned: true,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 3).toISOString(),
    updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 3).toISOString(),
  },
  {
    _id: '65e01234567890abcdef0003',
    title: '💡 NoteNest Product Roadmap & Ideas',
    content: 'Exciting future enhancements to consider:\n- Markdown live preview and code snippet formatting\n- Cloud backup with MongoDB Atlas\n- Note color themes and archive folders\n- Export notes as PDF or Markdown files',
    category: 'Ideas',
    tags: ['roadmap', 'features', 'brainstorming'],
    isPinned: false,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(),
    updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(),
  },
  {
    _id: '65e01234567890abcdef0004',
    title: '🏃 Daily Routine & Wellness Goals',
    content: 'Morning habits for high productivity:\n1. 20-minute morning jog or stretch\n2. Plan top 3 priority tasks before checking email\n3. Drink 2L of water throughout the day\n4. 30 minutes of deep reading or skill building in the evening.',
    category: 'Personal',
    tags: ['health', 'habits', 'productivity'],
    isPinned: false,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 1).toISOString(),
    updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 1).toISOString(),
  },
  {
    _id: '65e01234567890abcdef0005',
    title: '🛠️ Helpful Git Commands & Quick Reference',
    content: 'Useful git commands:\n- git status: check current working directory\n- git add . && git commit -m "feat: your message"\n- git log --oneline -n 5: review recent commits\n- git checkout -b feature/new-component: branch off',
    category: 'General',
    tags: ['git', 'cheatsheet', 'terminal'],
    isPinned: false,
    createdAt: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
    updatedAt: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
  },
  {
    _id: '65e01234567890abcdef0006',
    title: '☕ Weekly Sprint Planning Notes',
    content: 'Sprint 14 Priorities:\n- Complete frontend and backend CRUD integration\n- Ensure error boundaries and friendly toast alerts\n- Test responsiveness on mobile and tablet viewport widths\n- Final code cleanup and documentation polish.',
    category: 'Work',
    tags: ['sprint', 'scrum', 'team'],
    isPinned: false,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

const generateId = () => {
  return new mongoose.Types.ObjectId().toString();
};

/**
 * @desc    Get all notes (with optional search and category filter)
 * @route   GET /api/notes
 * @access  Public
 */
export const getNotes = async (req, res, next) => {
  try {
    const { search, category } = req.query;

    if (mongoose.connection.readyState === 1) {
      const filter = {};

      if (category && category.trim() && category.toLowerCase() !== 'all') {
        filter.category = category.trim();
      }

      if (search && search.trim()) {
        const searchRegex = new RegExp(search.trim(), 'i');
        filter.$or = [
          { title: { $regex: searchRegex } },
          { content: { $regex: searchRegex } },
          { tags: { $in: [searchRegex] } },
        ];
      }

      const notes = await Note.find(filter).sort({ isPinned: -1, createdAt: -1 });
      return res.status(200).json(notes);
    }

    // In-memory fallback
    let result = [...memoryNotes];

    if (category && category.trim() && category.toLowerCase() !== 'all') {
      result = result.filter(
        (n) => n.category?.toLowerCase() === category.trim().toLowerCase()
      );
    }

    if (search && search.trim()) {
      const q = search.trim().toLowerCase();
      result = result.filter(
        (n) =>
          n.title.toLowerCase().includes(q) ||
          n.content.toLowerCase().includes(q) ||
          (n.tags && n.tags.some((t) => t.toLowerCase().includes(q)))
      );
    }

    result.sort((a, b) => {
      if (Boolean(a.isPinned) === Boolean(b.isPinned)) {
        return new Date(b.createdAt) - new Date(a.createdAt);
      }
      return a.isPinned ? -1 : 1;
    });

    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get a single note by ID
 * @route   GET /api/notes/:id
 * @access  Public
 */
export const getNoteById = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id) && !id.startsWith('65e0')) {
      return res.status(404).json({ message: 'Note not found' });
    }

    if (mongoose.connection.readyState === 1) {
      const note = await Note.findById(id);
      if (!note) return res.status(404).json({ message: 'Note not found' });
      return res.status(200).json(note);
    }

    const note = memoryNotes.find((n) => n._id.toString() === id.toString());
    if (!note) return res.status(404).json({ message: 'Note not found' });
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

    if (!title || !title.trim()) {
      return res.status(400).json({ message: 'Please enter a note title.' });
    }
    if (title.trim().length > 100) {
      return res.status(400).json({ message: 'Title cannot exceed 100 characters.' });
    }
    if (!content || !content.trim()) {
      return res.status(400).json({ message: 'Note content cannot be empty.' });
    }

    if (mongoose.connection.readyState === 1) {
      const note = await Note.create({
        title: title.trim(),
        content: content.trim(),
        category: category || 'General',
        tags: tags || [],
        isPinned: Boolean(isPinned),
      });
      return res.status(201).json(note);
    }

    const newNote = {
      _id: generateId(),
      title: title.trim(),
      content: content.trim(),
      category: category || 'General',
      tags: Array.isArray(tags) ? tags : [],
      isPinned: Boolean(isPinned),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    memoryNotes.unshift(newNote);
    res.status(201).json(newNote);
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

    if (title !== undefined) {
      if (!title.trim()) return res.status(400).json({ message: 'Please enter a note title.' });
      if (title.trim().length > 100) return res.status(400).json({ message: 'Title cannot exceed 100 characters.' });
    }
    if (content !== undefined && !content.trim()) {
      return res.status(400).json({ message: 'Note content cannot be empty.' });
    }

    if (mongoose.connection.readyState === 1) {
      if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(404).json({ message: 'Note not found' });
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

      if (!updatedNote) return res.status(404).json({ message: 'Note not found' });
      return res.status(200).json(updatedNote);
    }

    const idx = memoryNotes.findIndex((n) => n._id.toString() === id.toString());
    if (idx === -1) return res.status(404).json({ message: 'Note not found' });

    memoryNotes[idx] = {
      ...memoryNotes[idx],
      ...(title !== undefined && { title: title.trim() }),
      ...(content !== undefined && { content: content.trim() }),
      ...(category !== undefined && { category }),
      ...(tags !== undefined && { tags }),
      ...(isPinned !== undefined && { isPinned: Boolean(isPinned) }),
      updatedAt: new Date().toISOString(),
    };

    res.status(200).json(memoryNotes[idx]);
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

    if (mongoose.connection.readyState === 1) {
      if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(404).json({ message: 'Note not found' });
      }
      const note = await Note.findById(id);
      if (!note) return res.status(404).json({ message: 'Note not found' });
      note.isPinned = !note.isPinned;
      await note.save();
      return res.status(200).json(note);
    }

    const note = memoryNotes.find((n) => n._id.toString() === id.toString());
    if (!note) return res.status(404).json({ message: 'Note not found' });

    note.isPinned = !note.isPinned;
    note.updatedAt = new Date().toISOString();
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

    if (mongoose.connection.readyState === 1) {
      if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(404).json({ message: 'Note not found' });
      }
      const deletedNote = await Note.findByIdAndDelete(id);
      if (!deletedNote) return res.status(404).json({ message: 'Note not found' });
      return res.status(200).json({ message: 'Note deleted successfully' });
    }

    const idx = memoryNotes.findIndex((n) => n._id.toString() === id.toString());
    if (idx === -1) return res.status(404).json({ message: 'Note not found' });

    memoryNotes.splice(idx, 1);
    res.status(200).json({ message: 'Note deleted successfully' });
  } catch (error) {
    next(error);
  }
};
