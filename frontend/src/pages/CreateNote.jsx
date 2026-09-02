import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, PlusCircle } from 'lucide-react';
import NoteForm from '../components/NoteForm';
import { createNote } from '../services/noteService';

const CreateNote = ({ showToast }) => {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (formData) => {
    try {
      setIsSubmitting(true);
      await createNote(formData);
      showToast?.({ type: 'success', message: 'Note created successfully!' });
      navigate('/');
    } catch (err) {
      console.error('Failed to create note:', err);
      const msg = err.response?.data?.message || 'Failed to create note. Please try again.';
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
          <h1 style={{ fontSize: '1.85rem', fontWeight: 800 }}>Create New Note</h1>
          <p style={{ color: 'var(--color-text-secondary)', fontSize: '0.95rem' }}>
            Add a new note with category and tags to organize your thoughts.
          </p>
        </div>
      </div>

      {/* Form Card */}
      <div className="form-card">
        <NoteForm
          onSubmit={handleSubmit}
          isSubmitting={isSubmitting}
          submitLabel="Save Note"
        />
      </div>
    </div>
  );
};

export default CreateNote;
