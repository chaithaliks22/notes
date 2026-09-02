import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Plus, RefreshCw, AlertCircle } from 'lucide-react';
import { getNotes, deleteNote, togglePinNote } from '../services/noteService';
import SearchBar from '../components/SearchBar';
import CategoryFilter from '../components/CategoryFilter';
import NoteCard from '../components/NoteCard';
import EmptyState from '../components/EmptyState';
import ConfirmModal from '../components/ConfirmModal';

const Home = ({ showToast }) => {
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');

  // Delete modal state
  const [noteToDelete, setNoteToDelete] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Fetch notes from backend
  const fetchNotes = useCallback(async (search = '', category = '') => {
    try {
      setLoading(true);
      setError(null);
      const data = await getNotes(search, category);
      setNotes(data || []);
    } catch (err) {
      console.error('Error fetching notes:', err);
      const msg = err.response?.data?.message || 'Unable to load notes. Please check if backend server is running.';
      setError(msg);
      showToast?.({ type: 'error', message: msg });
    } finally {
      setLoading(false);
    }
  }, [showToast]);

  // Debounced search & filter trigger
  useEffect(() => {
    const timer = setTimeout(() => {
      fetchNotes(searchQuery, selectedCategory);
    }, 280);

    return () => clearTimeout(timer);
  }, [searchQuery, selectedCategory, fetchNotes]);

  // Delete note confirmation handler
  const handleConfirmDelete = async () => {
    if (!noteToDelete) return;

    try {
      setIsDeleting(true);
      await deleteNote(noteToDelete._id);
      // Remove deleted note from state
      setNotes((prevNotes) => prevNotes.filter((n) => n._id !== noteToDelete._id));
      showToast?.({ type: 'success', message: 'Note deleted successfully.' });
      setNoteToDelete(null);
    } catch (err) {
      console.error('Failed to delete note:', err);
      const msg = err.response?.data?.message || 'Failed to delete note. Please try again.';
      showToast?.({ type: 'error', message: msg });
    } finally {
      setIsDeleting(false);
    }
  };

  // Toggle note pin status
  const handleTogglePin = async (note) => {
    try {
      const updated = await togglePinNote(note._id);
      setNotes((prev) => {
        const next = prev.map((n) => (n._id === note._id ? updated : n));
        return next.sort((a, b) => {
          if (a.isPinned === b.isPinned) {
            return new Date(b.createdAt) - new Date(a.createdAt);
          }
          return a.isPinned ? -1 : 1;
        });
      });
      showToast?.({
        type: 'success',
        message: updated.isPinned
          ? `Pinned "${updated.title}" to top.`
          : `Unpinned "${updated.title}".`,
      });
    } catch (err) {
      console.error('Failed to toggle pin:', err);
      showToast?.({ type: 'error', message: 'Failed to update pin status.' });
    }
  };

  const handleCopyNote = (title) => {
    showToast?.({ type: 'success', message: `Copied "${title}" to clipboard.` });
  };

  const handleResetFilters = () => {
    setSearchQuery('');
    setSelectedCategory('All');
  };

  // Compute category counts for pills
  const categoryCounts = useMemo(() => {
    const counts = { All: notes.length };
    ['Personal', 'Work', 'Study', 'Ideas', 'General'].forEach((cat) => {
      counts[cat] = notes.filter((n) => n.category === cat).length;
    });
    return counts;
  }, [notes]);

  const isFiltered = Boolean(searchQuery.trim() || selectedCategory !== 'All');

  return (
    <div className="container">
      {/* Header / Hero */}
      <section className="hero-section">
        <h1 className="hero-title">
          Your <span>Notes</span>
        </h1>
        <p className="hero-subtitle">
          Capture your ideas, organize your thoughts, and keep everything in one place.
        </p>
      </section>

      {/* Toolbar: Search & Category Filters */}
      <section className="toolbar-section">
        <SearchBar
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          onClear={() => setSearchQuery('')}
        />

        <CategoryFilter
          selectedCategory={selectedCategory}
          onSelectCategory={setSelectedCategory}
          counts={categoryCounts}
        />
      </section>

      {/* Notes Grid Header */}
      <div className="notes-grid-header">
        <div className="notes-count-info">
          {!loading && (
            <span>
              {notes.length} {notes.length === 1 ? 'note' : 'notes'} found
              {isFiltered && ` (filtered)`}
            </span>
          )}
        </div>
        <Link to="/create" className="btn-primary" id="add-note-inline-btn" style={{ padding: '0.45rem 0.9rem', fontSize: '0.88rem' }}>
          <Plus size={16} />
          <span>New Note</span>
        </Link>
      </div>

      {/* Error Banner */}
      {error && !loading && (
        <div
          style={{
            background: 'var(--color-danger-bg)',
            border: '1px solid var(--color-danger-border)',
            color: '#991b1b',
            borderRadius: 'var(--radius-md)',
            padding: '1rem 1.25rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: '1.5rem',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <AlertCircle size={20} />
            <span>{error}</span>
          </div>
          <button
            type="button"
            className="btn-secondary"
            style={{ padding: '0.35rem 0.75rem', fontSize: '0.82rem' }}
            onClick={() => fetchNotes(searchQuery, selectedCategory)}
          >
            <RefreshCw size={14} /> Retry
          </button>
        </div>
      )}

      {/* Loading Skeletons */}
      {loading && (
        <div className="notes-grid">
          {[1, 2, 3, 4, 5, 6].map((item) => (
            <div key={item} className="skeleton-card">
              <div className="skeleton" style={{ width: '35%', height: '22px' }} />
              <div className="skeleton" style={{ width: '80%', height: '26px' }} />
              <div className="skeleton" style={{ width: '100%', height: '50px' }} />
              <div className="skeleton" style={{ width: '45%', height: '18px', marginTop: 'auto' }} />
            </div>
          ))}
        </div>
      )}

      {/* Loaded Notes or Empty State */}
      {!loading && !error && (
        <>
          {notes.length === 0 ? (
            <EmptyState
              isFiltered={isFiltered}
              onResetFilters={isFiltered ? handleResetFilters : null}
            />
          ) : (
            <div className="notes-grid" id="notes-grid">
              {notes.map((note) => (
                <NoteCard
                  key={note._id}
                  note={note}
                  onDeleteClick={(n) => setNoteToDelete(n)}
                  onTogglePin={handleTogglePin}
                  onCopyNote={handleCopyNote}
                />
              ))}
            </div>
          )}
        </>
      )}

      {/* Delete Confirmation Modal */}
      <ConfirmModal
        isOpen={Boolean(noteToDelete)}
        title="Delete Note"
        message={
          noteToDelete
            ? `Are you sure you want to delete "${noteToDelete.title}"? This action cannot be undone.`
            : 'Are you sure you want to delete this note?'
        }
        onConfirm={handleConfirmDelete}
        onCancel={() => setNoteToDelete(null)}
        isDeleting={isDeleting}
      />
    </div>
  );
};

export default Home;
