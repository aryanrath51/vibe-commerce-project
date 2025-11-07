import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import * as api from '../services/api';
import { toast } from 'react-toastify';

function ProductDetail({ onAddToCart }) {
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const { id } = useParams();

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        const response = await api.getProductById(id);
        setProduct(response.data);
      } catch (error) {
        toast.error('Could not load product details.');
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  if (loading) {
    return <div className="product-detail-container"><h2>Loading...</h2></div>;
  }

  if (!product) {
    return (
      <div className="product-detail-container">
        <h2>Product not found</h2>
        <Link to="/">Go back to Products</Link>
      </div>
    );
  }

  return (
    <div className="product-detail-container">
      <Link to="/" className="back-link">← Back to Products</Link>
      <div className="product-detail">
        <img src={product.image} alt={product.name} />
        <div className="product-detail-info">
          <h1>{product.name}</h1>
          <p className="product-detail-price">₹{product.price.toFixed(2)}</p>
          <p>{product.description || 'No description available.'}</p>
          <button onClick={() => onAddToCart(product)}>Add to Cart</button>
        </div>
      </div>
    </div>
  );
}

export default ProductDetail;