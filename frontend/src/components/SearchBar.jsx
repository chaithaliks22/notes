import React from 'react';
import { Search, X } from 'lucide-react';

const SearchBar = ({ searchQuery, onSearchChange, onClear }) => {
  return (
    <div className="search-bar-wrapper">
      <Search className="search-icon" size={20} />
      <input
        type="text"
        id="search-input"
        className="search-input"
        placeholder="Search your notes by title, content, or tag..."
        value={searchQuery}
        onChange={(e) => onSearchChange(e.target.value)}
      />
      {searchQuery && (
        <button
          type="button"
          id="search-clear-btn"
          className="search-clear-btn"
          onClick={onClear}
          title="Clear search"
          aria-label="Clear search"
        >
          <X size={18} />
        </button>
      )}
    </div>
  );
};

export default SearchBar;
