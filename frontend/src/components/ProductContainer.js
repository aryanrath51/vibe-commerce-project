import React from 'react';
import ProductList from './ProductList';
import Pagination from './Pagination';

function ProductContainer({
  searchTerm,
  handleSearchChange,
  loadingSearch,
  searchedProducts,
  loading,
  products,
  currentPage,
  totalPages,
  sortOrder,
  onSortChange,
  onPageChange,
  onAddToCart,
}) {
  return (
    <div className="products-container">
      <div className="product-list-header">
        <input
          type="text"
          placeholder="Search products..."
          className="search-bar"
          value={searchTerm}
          onChange={(e) => handleSearchChange(e.target.value)}
        />
        <select
          className="sort-dropdown"
          value={sortOrder}
          onChange={(e) => onSortChange(e.target.value)}
        >
          <option value="">Sort by</option>
          <option value="price-asc">Price: Low to High</option>
          <option value="price-desc">Price: High to Low</option>
          <option value="name-asc">Name: A to Z</option>
          <option value="name-desc">Name: Z to A</option>
        </select>
      </div>

      {searchTerm ? (
        <ProductList
          title={`Search Results for "${searchTerm}"`}
          loading={loadingSearch}
          products={searchedProducts}
          onAddToCart={onAddToCart}
        />
      ) : (
        <>
          <ProductList
            title="All Products"
            loading={loading}
            products={products}
            onAddToCart={onAddToCart}
          />
        </>
      )}
      {(totalPages > 1) && (
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={onPageChange}
        />
      )}
    </div>
  );
}

export default ProductContainer;