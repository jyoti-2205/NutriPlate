import React from 'react';

const NutritionTags = ({ tags }) => {
  if (!tags) return null;
  const list = typeof tags === 'string' ? tags.split(',').map((t) => t.trim()).filter(Boolean) : tags;
  if (!list.length) return null;

  return (
    <div className="nutrition-tags">
      {list.map((tag) => (
        <span key={tag} className="nutrition-tag">{tag}</span>
      ))}
    </div>
  );
};

export default NutritionTags;
