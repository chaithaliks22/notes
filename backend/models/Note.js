import mongoose from 'mongoose';

const noteSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Please enter a note title.'],
      trim: true,
      minlength: [1, 'Title must be at least 1 character long.'],
      maxlength: [100, 'Title cannot exceed 100 characters.'],
    },
    content: {
      type: String,
      required: [true, 'Note content cannot be empty.'],
      trim: true,
    },
    category: {
      type: String,
      default: 'General',
      enum: {
        values: ['Personal', 'Work', 'Study', 'Ideas', 'General'],
        message: '{VALUE} is not a valid category. Choose from Personal, Work, Study, Ideas, General.',
      },
    },
    tags: {
      type: [String],
      default: [],
      set: (tags) => {
        if (!tags) return [];
        if (Array.isArray(tags)) {
          return tags
            .map((t) => t.trim())
            .filter((t) => t.length > 0);
        }
        if (typeof tags === 'string') {
          return tags
            .split(',')
            .map((t) => t.trim())
            .filter((t) => t.length > 0);
        }
        return [];
      },
    },
    isPinned: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true, // Automatically manages createdAt and updatedAt fields
  }
);

// Compound index to quickly sort pinned notes first, then by creation date
noteSchema.index({ isPinned: -1, createdAt: -1 });

// Optional text index on title and content for enhanced search capability
noteSchema.index({ title: 'text', content: 'text' });

const Note = mongoose.model('Note', noteSchema);

export default Note;
