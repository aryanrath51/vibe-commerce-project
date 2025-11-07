import React from 'react';

function SkeletonCard() {
  return (
    <div className="skeleton-card">
      <div className="skeleton skeleton-image"></div>
      <div className="skeleton skeleton-text"></div>
      <div className="skeleton skeleton-text short"></div>
      <div className="skeleton skeleton-button"></div>
    </div>
  );
}

export default SkeletonCard;