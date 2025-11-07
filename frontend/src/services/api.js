import axios from 'axios';

// Use environment variables for the API URL for better flexibility across environments.
const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5001/api';

const api = axios.create({
  baseURL: API_URL,
});

export const getProducts = (page = 1, sort = '', search = '', category = '') => {
  // Use the `params` object to handle query parameters.
  // This is cleaner and prevents potential URL encoding issues.
  const params = {
    page,
    limit: 6,
  };

  if (sort) params.sort = sort;
  if (search) params.search = search;
  if (category) params.category = category;

  return api.get('/products', { params });
};

export const getProductById = (id) => api.get(`/products/${id}`);

export const getCart = () => api.get('/cart');

export const removeFromCart = (cartItemId) => api.delete(`/cart/${cartItemId}`);

export const checkout = (checkoutData) => api.post('/checkout', checkoutData);

export const updateCartQuantity = (cartItemId, quantity) => api.put(`/cart/${cartItemId}`, { quantity });
