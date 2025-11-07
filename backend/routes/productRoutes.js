const express = require('express');
const router = express.Router();
const products = require('../data/products');
router.get('/', (req, res) => {
  const page = parseInt(req.query.page, 10) || 1;
  const limit = parseInt(req.query.limit, 10) || 6; // Show 6 products per page
  const sortOrder = req.query.sort || 'default';
  const searchQuery = req.query.search || '';
  let resultingProducts = [...products];
  if (searchQuery) {
    resultingProducts = resultingProducts.filter(product =>
      product.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }
  if (sortOrder === 'price-asc') {
    resultingProducts.sort((a, b) => a.price - b.price);
  } else if (sortOrder === 'price-desc') {
    resultingProducts.sort((a, b) => b.price - a.price);
  } else if (sortOrder === 'name-asc') {
    resultingProducts.sort((a, b) => a.name.localeCompare(b.name));
  } else if (sortOrder === 'name-desc') {
    resultingProducts.sort((a, b) => b.name.localeCompare(a.name));
  }
  const startIndex = (page - 1) * limit;
  const endIndex = page * limit;
  const paginatedProducts = resultingProducts.slice(startIndex, endIndex);
  const totalPages = Math.ceil(resultingProducts.length / limit);
  res.json({
    products: paginatedProducts,
    currentPage: page,
    totalPages: totalPages,
    totalProducts: resultingProducts.length,
  });
});
module.exports = router;
