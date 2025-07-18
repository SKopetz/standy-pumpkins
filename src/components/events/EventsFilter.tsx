import React from 'react';

interface EventsFilterProps {
  categories: string[];
  selectedCategories: Set<string>;
  onToggle: (category: string) => void;
}

export function EventsFilter({
  categories,
  selectedCategories,
  onToggle
}: EventsFilterProps) {
  return (
    <div className="mb-6">
      <h3 className="text-sm font-medium text-dark/70 mb-2">Filter by Category</h3>
      <div className="flex flex-wrap gap-2">
        {categories.map(category => (
          <button
            key={category}
            onClick={() => onToggle(category)}
            className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
              selectedCategories.has(category)
                ? 'bg-primary text-dark'
                : 'bg-light-hover text-dark/60 hover:text-dark'
            }`}
          >
            {category}
          </button>
        ))}
      </div>
    </div>
  );
}