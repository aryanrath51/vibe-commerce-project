import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Cart from './components/Cart';
import CheckoutModal from './components/CheckoutModals.js';
import * as api from './services/api';
import ProductDetail from './components/ProductDetail.js';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './App.css';
import ProductContainer from './components/ProductContainer.js';

function App() {
  const [products, setProducts] = useState([]);
  const [cart, setCart] = useState(() => {
    // Initialize cart state from localStorage
    try {
      const savedCart = localStorage.getItem('cart');
      if (savedCart) {
        const parsedCart = JSON.parse(savedCart);
        // Recalculate total to ensure data integrity
        const total = parsedCart.items.reduce((sum, item) => sum + item.price * item.quantity, 0);
        return { items: parsedCart.items, total: parseFloat(total.toFixed(2)) };
      }
    } catch (error) {
      console.error("Failed to parse cart from localStorage", error);
    }
    return { items: [], total: 0 };
  });
  const [customerInfo, setCustomerInfo] = useState(() => {
    // Initialize customer info from localStorage
    try {
      const savedInfo = localStorage.getItem('customerInfo');
      return savedInfo ? JSON.parse(savedInfo) : { name: '', email: '' };
    } catch (error) {
      console.error("Failed to parse customer info from localStorage", error);
      return { name: '', email: '' };
    }
  });
  const [isModalOpen, setModalOpen] = useState(false);
  const [receipt, setReceipt] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [sortOrder, setSortOrder] = useState('');
  const [totalPages, setTotalPages] = useState(1);
  const [searchedProducts, setSearchedProducts] = useState([]);
  const [loadingSearch, setLoadingSearch] = useState(false);
  const [loading, setLoading] = useState(true);
  const [nextCartItemId, setNextCartItemId] = useState(() => {
    // Ensure unique IDs for cart items
    const maxId = cart.items.reduce((max, item) => Math.max(item.cartItemId, max), 0);
    return maxId + 1;
  });

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        // Fetch all products in a single call
        const response = await api.getProducts(currentPage, sortOrder, '');
        setProducts(response.data.products);
        setTotalPages(response.data.totalPages);
      } catch (err) {
        toast.error('Failed to fetch products. Please try again later.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    if (!searchTerm) {
      fetchProducts();
    }
  }, [searchTerm, currentPage, sortOrder]); // Re-run when sortOrder changes

  useEffect(() => {
    const fetchSearchResults = async () => {
      if (searchTerm) {
        setLoadingSearch(true);
        try {
          const response = await api.getProducts(currentPage, sortOrder, searchTerm);
          setSearchedProducts(response.data.products);
          setTotalPages(response.data.totalPages);
        } catch (err) {
          toast.error('Failed to fetch search results.');
          console.error(err);
        } finally {
          setLoadingSearch(false);
        }
      } else {
        setSearchedProducts([]); // Clear search results if search term is empty
      }
    };
    fetchSearchResults();
  }, [searchTerm, currentPage, sortOrder]); // Re-run when sortOrder changes

  // Persist cart to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cart));
  }, [cart]);

  // Persist customer info to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('customerInfo', JSON.stringify(customerInfo));
  }, [customerInfo]);

  const handleSearchChange = (searchValue) => {
    setSearchTerm(searchValue);
    setCurrentPage(1); // Reset to first page on new search
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handleSortChange = (sortValue) => {
    setSortOrder(sortValue);
    setCurrentPage(1); // Reset to first page when sort order changes
  };

  const handleAddToCart = async (productToAdd) => {
    if (!productToAdd) return;

    setCart(prevCart => {
      const existingItemIndex = prevCart.items.findIndex(item => item.productId === productToAdd.id);
      let newItems;

      if (existingItemIndex > -1) {
        // If item exists, update quantity
        newItems = prevCart.items.map((item, index) =>
          index === existingItemIndex ? { ...item, quantity: item.quantity + 1 } : item
        );
      } else {
        // If item doesn't exist, add it to cart
        newItems = [...prevCart.items, {
          cartItemId: nextCartItemId,
          productId: productToAdd.id,
          name: productToAdd.name,
          price: productToAdd.price,
          quantity: 1,
        }];
        setNextCartItemId(prevId => prevId + 1);
      }

      const newTotal = newItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
      return { items: newItems, total: parseFloat(newTotal.toFixed(2)) };
    });
    toast.success(`${productToAdd.name} added to cart!`);
  };

  const handleRemoveFromCart = async (cartItemId) => {
    setCart(prevCart => {
      const newItems = prevCart.items.filter(item => item.cartItemId !== cartItemId);
      const newTotal = newItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
      return { items: newItems, total: parseFloat(newTotal.toFixed(2)) };
    });
  };

  const handleUpdateCartQuantity = async (cartItemId, quantity) => {
    setCart(prevCart => {
      let newItems;
      if (quantity <= 0) {
        newItems = prevCart.items.filter(item => item.cartItemId !== cartItemId);
      } else {
        newItems = prevCart.items.map(item =>
          item.cartItemId === cartItemId ? { ...item, quantity: quantity } : item
        );
      }
      const newTotal = newItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
      return { items: newItems, total: parseFloat(newTotal.toFixed(2)) };
    });
  };

  const handleCheckout = async (newCustomerInfo) => {
    // The checkout logic still needs to talk to the backend.
    // We pass the current cart items from the state.
    try {
      // Update the customer info state so it's saved to localStorage
      setCustomerInfo(newCustomerInfo);
      const response = await api.checkout({ ...newCustomerInfo, cartItems: cart.items });
      setReceipt(response.data); // Show receipt from backend
      setModalOpen(false);
      // Clear the cart after successful checkout
      setCart({ items: [], total: 0 });
      toast.success('Checkout successful!');
    } catch (err) {
      toast.error('Checkout failed. Please try again.');
      console.error(err);
    }
  };

  const openCheckoutModal = () => {
    if (cart.items.length > 0) {
      setModalOpen(true);
    } else {
      toast.warn("Your cart is empty!");
    }
  };

  const closeReceipt = () => {
    setReceipt(null);
  };

  return (
    <Router future={{
      // Opt-in to the new behaviors
      v7_startTransition: true,
      v7_relativeSplatPath: true,
    }}>
      <div className="App">
        <ToastContainer position="top-right" autoClose={3000} hideProgressBar={false} />
        <header>
          <h1>Vibe Commerce</h1>
        </header>
        <Routes>
          <Route path="/" element={
            <main className="main-content">
              <ProductContainer
                searchTerm={searchTerm}
                handleSearchChange={handleSearchChange}
                loadingSearch={loadingSearch}
                searchedProducts={searchedProducts}
                loading={loading}
                products={products}
                currentPage={currentPage}
                totalPages={totalPages}
                sortOrder={sortOrder}
                onSortChange={handleSortChange}
                onPageChange={handlePageChange}
                onAddToCart={handleAddToCart}
              />
              <Cart
                cartItems={cart.items}
                cartTotal={cart.total}
                onRemoveFromCart={handleRemoveFromCart}
                onUpdateQuantity={handleUpdateCartQuantity}
                onCheckout={openCheckoutModal}
              />
            </main>
          } />
          <Route 
            path="/products/:id" 
            element={<ProductDetail onAddToCart={handleAddToCart} />} 
          />
        </Routes>
        
        {isModalOpen && (
          <CheckoutModal
            customerInfo={customerInfo}
            onClose={() => setModalOpen(false)}
            onCheckout={handleCheckout}
          />
        )}

        {receipt && (
          <div className="modal-overlay" onClick={closeReceipt}>
            <div className="modal-content receipt" onClick={(e) => e.stopPropagation()}>
              <h2>Checkout Successful!</h2>
              <h3>Receipt #{receipt.receiptId.split('-')[1]}</h3>
              <p><strong>Date:</strong> {new Date(receipt.checkoutTimestamp).toLocaleString()}</p>
              <ul>
                {receipt.items.map(item => (
                  <li key={item.cartItemId}>{item.name} (x{item.quantity}) - ₹{(item.price * item.quantity).toFixed(2)}</li>
                ))}
              </ul>
              <p><strong>Total: ₹{receipt.total.toFixed(2)}</strong></p>
              <div className="modal-actions">
                <button onClick={closeReceipt}>Close</button>
              </div>
            </div>
          </div>
        )}
      </div>
    </Router>
  );
}

export default App;