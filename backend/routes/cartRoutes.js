const express = require('express');
const router = express.Router();
const products = require('../data/products');
let nextCartItemId = 1; // To give each cart item a unique ID

// GET /api/cart - Get cart items and total
router.get('/cart', (req, res) => {
  const cart = req.app.get('cart');
  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  res.json({ items: cart, total: parseFloat(total.toFixed(2)) });
});

// POST /api/cart - Add item to cart
router.post('/cart', (req, res) => {
  const { productId, quantity } = req.body;
  const cart = req.app.get('cart');

  const productToAdd = products.find(p => p.id === productId);
  if (!productToAdd) {
    return res.status(404).json({ message: 'Product not found' });
  }

  const existingItemIndex = cart.findIndex(item => item.productId === productId);

  if (existingItemIndex > -1) {
    // If item exists, update quantity
    cart[existingItemIndex].quantity += quantity;
  } else {
    // If item doesn't exist, add it to cart
    cart.push({
      cartItemId: nextCartItemId++,
      productId: productToAdd.id,
      name: productToAdd.name,
      price: productToAdd.price,
      quantity: quantity,
    });
  }
  
  res.status(201).json(cart);
});

// DELETE /api/cart/:cartItemId - Remove item from cart
router.delete('/cart/:cartItemId', (req, res) => {
  const cartItemId = parseInt(req.params.cartItemId, 10);
  let cart = req.app.get('cart');
  
  const itemIndex = cart.findIndex(item => item.cartItemId === cartItemId);

  if (itemIndex === -1) {
    return res.status(404).json({ message: 'Item not found in cart' });
  }
  
  // Filter out the item to "delete" it
  const updatedCart = cart.filter(item => item.cartItemId !== cartItemId);
  req.app.set('cart', updatedCart);

  res.status(200).json({ message: 'Item removed successfully' });
});

// PUT /api/cart/:cartItemId - Update item quantity
router.put('/cart/:cartItemId', (req, res) => {
  const cartItemId = parseInt(req.params.cartItemId, 10);
  const { quantity } = req.body;
  let cart = req.app.get('cart');

  const itemIndex = cart.findIndex(item => item.cartItemId === cartItemId);

  if (itemIndex === -1) {
    return res.status(404).json({ message: 'Item not found in cart' });
  }

  if (quantity <= 0) {
    // If quantity is 0 or less, remove the item by filtering the array
    cart = cart.filter(item => item.cartItemId !== cartItemId);
  } else {
    // Otherwise, update the quantity
    cart[itemIndex].quantity = quantity;
  }

  req.app.set('cart', cart);
  res.status(200).json(cart);
});

// POST /api/checkout - Mock checkout process
router.post('/checkout', (req, res) => {
    // The cart items are now sent from the frontend
    const { cartItems } = req.body;
    if (!cartItems || cartItems.length === 0) {
        return res.status(400).json({ message: "Cannot checkout with an empty cart." });
    }

    const total = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);

    // Create a mock receipt
    const receipt = {
        receiptId: `receipt-${Date.now()}`,
        items: cartItems,
        total: parseFloat(total.toFixed(2)),
        checkoutTimestamp: new Date().toISOString(),
    };

    // Clear the cart after checkout
    req.app.set('cart', []);
    nextCartItemId = 1; // Reset cart item ID counter

    res.status(200).json(receipt);
});


// Middleware to pass the cart to each request
module.exports = (req, res, next) => {
    router(req, res, next);
};