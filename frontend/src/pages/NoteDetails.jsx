import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import {
  ArrowLeft,
  Calendar,
  Clock,
  Tag as TagIcon,
  Edit3,
  Trash2,
  Loader2,
  AlertCircle,
  Pin,
  Copy,
  Check,
  Download,
} from 'lucide-react';
import { getNoteById, deleteNote, togglePinNote } from '../services/noteService';
import ConfirmModal from '../components/ConfirmModal';

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

const formatFullDate = (dateString) => {
  if (!dateString) return '';
  const date = new Date(dateString);
  return new Intl.DateTimeFormat('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(date);
};

const NoteDetails = ({ showToast }) => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [note, setNote] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [copied, setCopied] = useState(false);

  // Delete modal
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const fetchNote = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await getNoteById(id);
        setNote(data);
      } catch (err) {
        console.error('Failed to load note details:', err);
        const msg = err.response?.data?.message || 'Note not found.';
        setError(msg);
        showToast?.({ type: 'error', message: msg });
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchNote();
    }
  }, [id, showToast]);

  const handleTogglePin = async () => {
    try {
      const updated = await togglePinNote(id);
      setNote(updated);
      showToast?.({
        type: 'success',
        message: updated.isPinned ? 'Note pinned to top.' : 'Note unpinned.',
      });
    } catch (err) {
      console.error('Failed to toggle pin:', err);
      showToast?.({ type: 'error', message: 'Failed to update pin.' });
    }
  };

  const handleCopy = () => {
    if (!note) return;
    navigator.clipboard.writeText(`${note.title}\n\n${note.content}`);
    setCopied(true);
    showToast?.({ type: 'success', message: 'Note copied to clipboard!' });
    setTimeout(() => setCopied(false), 2000);
  };

  const handleExportMarkdown = () => {
    if (!note) return;
    const markdownContent = `# ${note.title}

**Category:** ${note.category || 'General'}
**Tags:** ${note.tags && note.tags.length ? note.tags.map((t) => `#${t}`).join(' ') : 'None'}
**Created:** ${new Date(note.createdAt).toLocaleString()}
${note.updatedAt ? `**Updated:** ${new Date(note.updatedAt).toLocaleString()}\n` : ''}
---

${note.content}
`;
    const blob = new Blob([markdownContent], { type: 'text/markdown;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    const safeTitle = note.title.replace(/[^a-z0-9]/gi, '_').toLowerCase();
    link.download = `${safeTitle || 'note'}.md`;
    link.click();
    URL.revokeObjectURL(url);
    showToast?.({ type: 'success', message: 'Note exported as Markdown file (.md)!' });
  };

  const handleDelete = async () => {
    try {
      setIsDeleting(true);
      await deleteNote(id);
      showToast?.({ type: 'success', message: 'Note deleted successfully.' });
      navigate('/');
    } catch (err) {
      console.error('Error deleting note:', err);
      const msg = err.response?.data?.message || 'Failed to delete note.';
      showToast?.({ type: 'error', message: msg });
    } finally {
      setIsDeleting(false);
      setIsDeleteModalOpen(false);
    }
  };

  return (
    <div className="container details-container">
      {/* Navigation Header */}
      <div className="details-nav">
        <Link to="/" className="back-link" id="details-back-link">
          <ArrowLeft size={18} />
          <span>Back to Notes</span>
        </Link>
        {note && !loading && (
          <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
            {/* Pin Toggle Button */}
            <button
              type="button"
              className={`btn-secondary ${note.isPinned ? 'active' : ''}`}
              id="details-pin-btn"
              onClick={handleTogglePin}
              style={{ padding: '0.45rem 0.85rem', fontSize: '0.88rem' }}
              title={note.isPinned ? 'Unpin note' : 'Pin note to top'}
            >
              <Pin size={15} style={{ color: note.isPinned ? '#d97706' : 'inherit', transform: note.isPinned ? 'rotate(45deg)' : 'none' }} />
              <span>{note.isPinned ? 'Pinned' : 'Pin'}</span>
            </button>

            {/* Copy Button */}
            <button
              type="button"
              className="btn-secondary"
              id="details-copy-btn"
              onClick={handleCopy}
              style={{ padding: '0.45rem 0.85rem', fontSize: '0.88rem' }}
              title="Copy note content"
            >
              {copied ? <Check size={15} style={{ color: 'var(--color-success)' }} /> : <Copy size={15} />}
              <span>{copied ? 'Copied' : 'Copy'}</span>
            </button>

            {/* Export Markdown Button */}
            <button
              type="button"
              className="btn-secondary"
              id="details-export-btn"
              onClick={handleExportMarkdown}
              style={{ padding: '0.45rem 0.85rem', fontSize: '0.88rem' }}
              title="Download note as Markdown file"
            >
              <Download size={15} />
              <span>Export</span>
            </button>

            {/* Edit Button */}
            <Link
              to={`/edit/${note._id}`}
              className="btn-secondary"
              id="details-edit-btn"
              style={{ padding: '0.45rem 0.85rem', fontSize: '0.88rem' }}
            >
              <Edit3 size={15} />
              <span>Edit</span>
            </Link>

            {/* Delete Button */}
            <button
              type="button"
              className="btn-danger"
              id="details-delete-btn"
              style={{ padding: '0.45rem 0.85rem', fontSize: '0.88rem' }}
              onClick={() => setIsDeleteModalOpen(true)}
            >
              <Trash2 size={15} />
              <span>Delete</span>
            </button>
          </div>
        )}
      </div>

      {/* Loading state */}
      {loading && (
        <div style={{ textAlign: 'center', padding: '4rem' }}>
          <Loader2 size={36} style={{ animation: 'spin 1s linear infinite', color: 'var(--color-primary)' }} />
          <p style={{ marginTop: '1rem', color: 'var(--color-text-secondary)' }}>Loading note...</p>
        </div>
      )}

      {/* Error state */}
      {error && !loading && (
        <div
          style={{
            background: 'var(--color-danger-bg)',
            border: '1px solid var(--color-danger-border)',
            color: '#991b1b',
            borderRadius: 'var(--radius-md)',
            padding: '2rem',
            textAlign: 'center',
          }}
        >
          <AlertCircle size={32} style={{ margin: '0 auto 0.75rem' }} />
          <h2 style={{ fontSize: '1.25rem', marginBottom: '0.5rem' }}>{error}</h2>
          <p style={{ color: 'var(--color-text-secondary)', marginBottom: '1.5rem' }}>
            The note you are looking for may have been deleted or the link is incorrect.
          </p>
          <Link to="/" className="btn-primary">
            Back to Dashboard
          </Link>
        </div>
      )}

      {/* Details Card */}
      {!loading && !error && note && (
        <article className="details-card">
          {/* Metadata Row */}
          <div className="details-meta-header">
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
              <span className={`category-badge ${getCategoryClass(note.category)}`}>
                {note.category || 'General'}
              </span>
              {note.isPinned && (
                <span className="pin-indicator-badge" title="Pinned Note">
                  <Pin size={11} style={{ transform: 'rotate(45deg)' }} /> Pinned to Top
                </span>
              )}
            </div>
            <div className="details-timestamps">
              <span className="timestamp-item" title="Created date">
                <Calendar size={14} />
                Created {formatFullDate(note.createdAt)}
              </span>
              {note.updatedAt && (
                <span className="timestamp-item" title="Last modified date">
                  <Clock size={14} />
                  Updated {formatFullDate(note.updatedAt)}
                </span>
              )}
            </div>
          </div>

          {/* Title */}
          <h1 className="details-title" id="note-details-title">{note.title}</h1>

          {/* Full Content */}
          <div className="details-body" id="note-details-content">{note.content}</div>

          {/* Tags */}
          {note.tags && note.tags.length > 0 && (
            <div className="details-tags-section">
              <span style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--color-text-secondary)', display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                <TagIcon size={14} /> Tags:
              </span>
              {note.tags.map((tag, i) => (
                <span key={i} className="tag-pill" style={{ fontSize: '0.82rem', padding: '0.25rem 0.6rem' }}>
                  #{tag}
                </span>
              ))}
            </div>
          )}
        </article>
      )}

      {/* Delete Confirmation Modal */}
      <ConfirmModal
        isOpen={isDeleteModalOpen}
        title="Delete Note"
        message={
          note
            ? `Are you sure you want to permanently delete "${note.title}"?`
            : 'Are you sure you want to delete this note?'
        }
        onConfirm={handleDelete}
        onCancel={() => setIsDeleteModalOpen(false)}
        isDeleting={isDeleting}
      />
    </div>
  );
};

export default NoteDetails;
