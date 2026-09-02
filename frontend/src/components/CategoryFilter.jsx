import React from 'react';

const CATEGORIES = ['All', 'Personal', 'Work', 'Study', 'Ideas', 'General'];

const CategoryFilter = ({ selectedCategory, onSelectCategory, counts = {} }) => {
  return (
    <div className="category-filter-wrapper" role="tablist" aria-label="Filter notes by category">
      {CATEGORIES.map((category) => {
        const isActive = selectedCategory === category;
        const count = counts[category];

        return (
          <button
            key={category}
            id={`filter-category-${category.toLowerCase()}`}
            type="button"
            role="tab"
            aria-selected={isActive}
            className={`category-pill ${isActive ? 'active' : ''}`}
            onClick={() => onSelectCategory(category)}
          >
            <span>{category}</span>
            {count !== undefined && (
              <span className="category-count">{count}</span>
            )}
          </button>
        );
      })}
    </div>
  );
};

export default CategoryFilter;
