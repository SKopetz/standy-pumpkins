import React from 'react';

interface CategoryFilterProps {
  categories: string[];
  selectedCategories: Set<string>;
  onToggle: (category: string) => void;
}

export function CategoryFilter({
  categories,
  selectedCategories,
  onToggle
}: CategoryFilterProps) {
  return (
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
  );
}