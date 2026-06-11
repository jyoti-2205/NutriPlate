import React, { useState } from 'react';
import { getFoodImageUrl } from '../utils/foodImages';

const FoodImage = ({ src, alt, className = '' }) => {
  const [error, setError] = useState(false);
  const displaySrc = error ? getFoodImageUrl(alt) : getFoodImageUrl(alt || src);

  return (
    <img
      key={`${alt}-${displaySrc}`}
      src={displaySrc}
      alt={alt}
      className={`food-image ${className}`}
      loading="lazy"
      onError={() => setError(true)}
    />
  );
};

export default FoodImage;
