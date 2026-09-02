import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Save, X, Plus, Tag as TagIcon, AlertCircle, Pin } from 'lucide-react';

const CATEGORIES = ['Personal', 'Work', 'Study', 'Ideas', 'General'];

const NoteForm = ({ initialData = {}, onSubmit, isSubmitting = false, submitLabel = 'Save Note' }) => {
  const navigate = useNavigate();

  const [title, setTitle] = useState(initialData.title || '');
  const [content, setContent] = useState(initialData.content || '');
  const [category, setCategory] = useState(initialData.category || 'General');
  const [tags, setTags] = useState(initialData.tags || []);
  const [isPinned, setIsPinned] = useState(initialData.isPinned || false);
  const [tagInput, setTagInput] = useState('');
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (initialData.title !== undefined) setTitle(initialData.title);
    if (initialData.content !== undefined) setContent(initialData.content);
    if (initialData.category !== undefined) setCategory(initialData.category);
    if (initialData.tags !== undefined) setTags(initialData.tags);
    if (initialData.isPinned !== undefined) setIsPinned(Boolean(initialData.isPinned));
  }, [initialData]);

  // Validation
  const validate = () => {
    const errs = {};
    if (!title.trim()) {
      errs.title = 'Please enter a note title.';
    } else if (title.trim().length > 100) {
      errs.title = 'Title cannot exceed 100 characters.';
    }

    if (!content.trim()) {
      errs.content = 'Note content cannot be empty.';
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleAddTag = () => {
    const trimmed = tagInput.trim().toLowerCase();
    if (!trimmed) return;

    // Support comma-separated tags
    const newTags = trimmed
      .split(',')
      .map((t) => t.trim())
      .filter((t) => t && !tags.includes(t));

    if (newTags.length > 0) {
      setTags([...tags, ...newTags]);
    }
    setTagInput('');
  };

  const handleTagKeyDown = (e) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      handleAddTag();
    }
  };

  const handleRemoveTag = (tagToRemove) => {
    setTags(tags.filter((t) => t !== tagToRemove));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;

    onSubmit({
      title: title.trim(),
      content: content.trim(),
      category,
      tags,
      isPinned,
    });
  };

  return (
    <form onSubmit={handleSubmit} className="note-form" noValidate>
      {/* Title Field */}
      <div className="form-group">
        <div className="form-label-row">
          <label htmlFor="note-title" className="form-label">
            Note Title <span style={{ color: 'var(--color-danger)' }}>*</span>
          </label>
          <span
            className={`char-counter ${
              title.length > 90 ? (title.length > 100 ? 'limit' : 'warning') : ''
            }`}
          >
            {title.length}/100
          </span>
        </div>
        <input
          type="text"
          id="note-title"
          className="form-input"
          placeholder="e.g., Project Planning & Architecture"
          value={title}
          maxLength={100}
          onChange={(e) => {
            setTitle(e.target.value);
            if (errors.title) setErrors({ ...errors, title: null });
          }}
          disabled={isSubmitting}
        />
        {errors.title && (
          <p className="form-hint" style={{ color: 'var(--color-danger)', display: 'flex', alignItems: 'center', gap: '4px' }}>
            <AlertCircle size={14} /> {errors.title}
          </p>
        )}
      </div>

      {/* Category & Tags Row */}
      <div className="form-group" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.25rem' }}>
        {/* Category Selector */}
        <div>
          <label htmlFor="note-category" className="form-label" style={{ marginBottom: '0.5rem', display: 'block' }}>
            Category
          </label>
          <select
            id="note-category"
            className="form-select"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            disabled={isSubmitting}
          >
            {CATEGORIES.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </div>

        {/* Tags Field */}
        <div>
          <label htmlFor="note-tags-input" className="form-label" style={{ marginBottom: '0.5rem', display: 'block' }}>
            Tags <span style={{ fontWeight: 400, color: 'var(--color-text-muted)' }}>(press Enter or comma)</span>
          </label>
          <div className="tags-input-box">
            {tags.map((tag) => (
              <span key={tag} className="tag-chip">
                <TagIcon size={12} />
                {tag}
                <button
                  type="button"
                  className="tag-chip-remove"
                  onClick={() => handleRemoveTag(tag)}
                  aria-label={`Remove tag ${tag}`}
                >
                  <X size={13} />
                </button>
              </span>
            ))}
            <input
              type="text"
              id="note-tags-input"
              className="tags-input-field"
              placeholder={tags.length === 0 ? "e.g., react, express..." : "Add more..."}
              value={tagInput}
              onChange={(e) => setTagInput(e.target.value)}
              onKeyDown={handleTagKeyDown}
              onBlur={handleAddTag}
              disabled={isSubmitting}
            />
          </div>
        </div>
      </div>

      {/* Content Field */}
      <div className="form-group">
        <div className="form-label-row">
          <label htmlFor="note-content" className="form-label">
            Content <span style={{ color: 'var(--color-danger)' }}>*</span>
          </label>
        </div>
        <textarea
          id="note-content"
          className="form-textarea"
          placeholder="Write your thoughts, ideas, tasks, or meeting summaries here..."
          value={content}
          onChange={(e) => {
            setContent(e.target.value);
            if (errors.content) setErrors({ ...errors, content: null });
          }}
          disabled={isSubmitting}
        />
        {errors.content && (
          <p className="form-hint" style={{ color: 'var(--color-danger)', display: 'flex', alignItems: 'center', gap: '4px' }}>
            <AlertCircle size={14} /> {errors.content}
          </p>
        )}
      </div>

      {/* Pin Note Checkbox */}
      <div className="form-group" style={{ marginBottom: '1rem' }}>
        <label
          htmlFor="note-pinned-checkbox"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.6rem',
            cursor: 'pointer',
            fontSize: '0.95rem',
            fontWeight: 600,
            color: 'var(--color-text-main)',
            userSelect: 'none',
          }}
        >
          <input
            type="checkbox"
            id="note-pinned-checkbox"
            checked={isPinned}
            onChange={(e) => setIsPinned(e.target.checked)}
            disabled={isSubmitting}
            style={{ width: '18px', height: '18px', cursor: 'pointer', accentColor: 'var(--color-primary)' }}
          />
          <Pin size={16} style={{ color: isPinned ? '#d97706' : 'var(--color-text-muted)', transform: isPinned ? 'rotate(45deg)' : 'none' }} />
          <span>Pin this note to the top of your dashboard</span>
        </label>
      </div>

      {/* Action Buttons */}
      <div className="form-actions">
        <button
          type="button"
          id="note-cancel-btn"
          className="btn-secondary"
          onClick={() => navigate(-1)}
          disabled={isSubmitting}
        >
          Cancel
        </button>
        <button
          type="submit"
          id="note-save-btn"
          className="btn-primary"
          disabled={isSubmitting}
        >
          <Save size={18} />
          <span>{isSubmitting ? 'Saving...' : submitLabel}</span>
        </button>
      </div>
    </form>
  );
};

export default NoteForm;
