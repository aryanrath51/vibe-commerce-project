import React from 'react';
import SkeletonCard from './SkeletonCard.js';

function ProductList({ title, products, loading, onAddToCart }) {
  return (
    <div className="product-list-container">
      <h2>{title}</h2>
      <div className="product-list">
        {loading
          ? Array.from({ length: 6 }).map((_, index) => <SkeletonCard key={index} />)
          : products.map((product) => (
              <div key={product.id} className="product-card">
                <img src={product.image} alt={product.name} />
                <h3>{product.name}</h3>
                <p>₹{product.price.toFixed(2)}</p>
                 <button onClick={() => onAddToCart(product)}>
                  Add to Cart
                </button>
              </div>
            ))}
      </div>
    </div>
  );
}

export default ProductList;