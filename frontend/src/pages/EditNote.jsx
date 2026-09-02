import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, Loader2, AlertCircle } from 'lucide-react';
import NoteForm from '../components/NoteForm';
import { getNoteById, updateNote } from '../services/noteService';

const EditNote = ({ showToast }) => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [note, setNote] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const fetchNote = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await getNoteById(id);
        setNote(data);
      } catch (err) {
        console.error('Error fetching note for edit:', err);
        const msg = err.response?.data?.message || 'Note not found or unable to fetch.';
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

  const handleSubmit = async (formData) => {
    try {
      setIsSubmitting(true);
      await updateNote(id, formData);
      showToast?.({ type: 'success', message: 'Note updated successfully!' });
      navigate('/');
    } catch (err) {
      console.error('Failed to update note:', err);
      const msg = err.response?.data?.message || 'Failed to update note. Please try again.';
      showToast?.({ type: 'error', message: msg });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="container form-page-container">
      {/* Header */}
      <div className="form-header">
        <div>
          <Link to="/" className="back-link" style={{ marginBottom: '0.75rem' }}>
            <ArrowLeft size={16} />
            <span>Back to Notes</span>
          </Link>
          <h1 style={{ fontSize: '1.85rem', fontWeight: 800 }}>Edit Note</h1>
          <p style={{ color: 'var(--color-text-secondary)', fontSize: '0.95rem' }}>
            Modify the content, category, or tags of your note.
          </p>
        </div>
      </div>

      {/* Loading state */}
      {loading && (
        <div style={{ textAlign: 'center', padding: '3rem' }}>
          <Loader2 className="spinner" size={32} style={{ animation: 'spin 1s linear infinite', color: 'var(--color-primary)' }} />
          <p style={{ marginTop: '0.75rem', color: 'var(--color-text-muted)' }}>Loading note details...</p>
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
            padding: '1.5rem',
            textAlign: 'center',
          }}
        >
          <AlertCircle size={24} style={{ margin: '0 auto 0.5rem' }} />
          <p style={{ fontWeight: 600 }}>{error}</p>
          <Link to="/" className="btn-secondary" style={{ marginTop: '1rem', display: 'inline-flex' }}>
            Return to Dashboard
          </Link>
        </div>
      )}

      {/* Form Card */}
      {!loading && !error && note && (
        <div className="form-card">
          <NoteForm
            initialData={note}
            onSubmit={handleSubmit}
            isSubmitting={isSubmitting}
            submitLabel="Save Changes"
          />
        </div>
      )}
    </div>
  );
};

export default EditNote;
