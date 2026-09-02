import React from 'react';
import { Link } from 'react-router-dom';
import { FileQuestion, PlusCircle, RefreshCw } from 'lucide-react';

const EmptyState = ({ isFiltered = false, onResetFilters }) => {
  if (isFiltered) {
    return (
      <div className="empty-state" id="empty-state-filtered">
        <div className="empty-state-icon">
          <FileQuestion size={32} />
        </div>
        <h3 className="empty-state-title">No matching notes found</h3>
        <p className="empty-state-desc">
          Try adjusting your search query or switching to another category.
        </p>
        {onResetFilters && (
          <button
            type="button"
            id="empty-state-reset-btn"
            className="btn-secondary"
            onClick={onResetFilters}
          >
            <RefreshCw size={16} />
            <span>Clear Filters</span>
          </button>
        )}
      </div>
    );
  }

  return (
    <div className="empty-state" id="empty-state-initial">
      <div className="empty-state-icon">
        <FileQuestion size={32} />
      </div>
      <h3 className="empty-state-title">No notes yet</h3>
      <p className="empty-state-desc">
        Create your first note and start organizing your ideas, tasks, and thoughts.
      </p>
      <Link to="/create" id="empty-state-create-btn" className="btn-primary">
        <PlusCircle size={18} />
        <span>Create Note</span>
      </Link>
    </div>
  );
};

export default EmptyState;
