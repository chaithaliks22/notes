import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Calendar, Tag, Edit3, Trash2, Eye, Pin, Copy, Check } from 'lucide-react';

const getCategoryClass = (category) => {
  switch (category?.toLowerCase()) {
    case 'personal':
      return 'badge-personal';
    case 'work':
      return 'badge-work';
    case 'study':
      return 'badge-study';
    case 'ideas':
      return 'badge-ideas';
    default:
      return 'badge-general';
  }
};

const formatDate = (dateString) => {
  if (!dateString) return '';
  const date = new Date(dateString);
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  }).format(date);
};

const NoteCard = ({ note, onDeleteClick, onTogglePin, onCopyNote }) => {
  const { _id, title, content, category, tags = [], isPinned, createdAt, updatedAt } = note;
  const isEdited = updatedAt && createdAt && new Date(updatedAt).getTime() - new Date(createdAt).getTime() > 1000;
  const [copied, setCopied] = useState(false);

  const handleCopy = (e) => {
    e.stopPropagation();
    navigator.clipboard.writeText(`${title}\n\n${content}`);
    setCopied(true);
    onCopyNote?.(title);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <article className={`note-card ${isPinned ? 'is-pinned' : ''}`} id={`note-card-${_id}`}>
      {/* Card Header: Category badge & Actions */}
      <div className="note-card-top">
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <span className={`category-badge ${getCategoryClass(category)}`}>
            {category || 'General'}
          </span>
          {isPinned && (
            <span className="pin-indicator-badge" title="Pinned Note">
              <Pin size={11} style={{ transform: 'rotate(45deg)' }} /> Pinned
            </span>
          )}
        </div>

        <div className="note-actions">
          {/* Pin toggle button */}
          <button
            type="button"
            className={`icon-btn pin-btn ${isPinned ? 'active' : ''}`}
            onClick={() => onTogglePin?.(note)}
            title={isPinned ? 'Unpin note' : 'Pin note to top'}
            aria-label={isPinned ? 'Unpin note' : 'Pin note to top'}
            id={`pin-note-btn-${_id}`}
          >
            <Pin size={15} style={{ transform: isPinned ? 'rotate(45deg)' : 'none' }} />
          </button>

          {/* Quick Copy button */}
          <button
            type="button"
            className="icon-btn"
            onClick={handleCopy}
            title="Copy note content"
            aria-label="Copy note content"
            id={`copy-note-btn-${_id}`}
          >
            {copied ? <Check size={15} style={{ color: 'var(--color-success)' }} /> : <Copy size={15} />}
          </button>

          {/* View Details button */}
          <Link
            to={`/notes/${_id}`}
            className="icon-btn"
            title="View full note"
            aria-label={`View note: ${title}`}
            id={`view-note-btn-${_id}`}
          >
            <Eye size={15} />
          </Link>

          {/* Edit button */}
          <Link
            to={`/edit/${_id}`}
            className="icon-btn"
            title="Edit note"
            aria-label={`Edit note: ${title}`}
            id={`edit-note-btn-${_id}`}
          >
            <Edit3 size={15} />
          </Link>

          {/* Delete button */}
          <button
            type="button"
            className="icon-btn delete-btn"
            onClick={() => onDeleteClick(note)}
            title="Delete note"
            aria-label={`Delete note: ${title}`}
            id={`delete-note-btn-${_id}`}
          >
            <Trash2 size={15} />
          </button>
        </div>
      </div>

      {/* Title */}
      <h3 className="note-card-title">
        <Link to={`/notes/${_id}`}>{title}</Link>
      </h3>

      {/* Content excerpt preview */}
      <p className="note-card-excerpt">
        {content}
      </p>

      {/* Tags chips */}
      {tags && tags.length > 0 && (
        <div className="note-tags-container" aria-label="Note tags">
          {tags.map((tag, idx) => (
            <span key={idx} className="tag-pill">
              <Tag size={11} />
              {tag}
            </span>
          ))}
        </div>
      )}

      {/* Footer: Date */}
      <div className="note-card-footer">
        <span className="note-date" title={isEdited ? `Updated on ${formatDate(updatedAt)}` : `Created on ${formatDate(createdAt)}`}>
          <Calendar size={13} />
          {isEdited ? `Updated ${formatDate(updatedAt)}` : `Created ${formatDate(createdAt)}`}
        </span>
      </div>
    </article>
  );
};

export default NoteCard;
