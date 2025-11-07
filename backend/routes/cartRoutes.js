const express = require('express');
const router = express.Router();
const products = require('../data/products');
let nextCartItemId = 1;
router.get('/cart', (req, res) => {
  const cart = req.app.get('cart');
  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  res.json({ items: cart, total: parseFloat(total.toFixed(2)) });
});
router.post('/cart', (req, res) => {
  const { productId, quantity } = req.body;
  const cart = req.app.get('cart');
  const productToAdd = products.find(p => p.id === productId);
  if (!productToAdd) {
    return res.status(404).json({ message: 'Product not found' });
  }
  const existingItemIndex = cart.findIndex(item => item.productId === productId);
  if (existingItemIndex > -1) {
    cart[existingItemIndex].quantity += quantity;
  } else {
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
router.delete('/cart/:cartItemId', (req, res) => {
  const cartItemId = parseInt(req.params.cartItemId, 10);
  let cart = req.app.get('cart');
  const itemIndex = cart.findIndex(item => item.cartItemId === cartItemId);
  if (itemIndex === -1) {
    return res.status(404).json({ message: 'Item not found in cart' });
  }
  const updatedCart = cart.filter(item => item.cartItemId !== cartItemId);
  req.app.set('cart', updatedCart);
  res.status(200).json({ message: 'Item removed successfully' });
});
router.put('/cart/:cartItemId', (req, res) => {
  const cartItemId = parseInt(req.params.cartItemId, 10);
  const { quantity } = req.body;
  let cart = req.app.get('cart');
  const itemIndex = cart.findIndex(item => item.cartItemId === cartItemId);
  if (itemIndex === -1) {
    return res.status(404).json({ message: 'Item not found in cart' });
  }
  if (quantity <= 0) {
    cart = cart.filter(item => item.cartItemId !== cartItemId);
  } else {
    cart[itemIndex].quantity = quantity;
  }
  req.app.set('cart', cart);
  res.status(200).json(cart);
});
router.post('/checkout', (req, res) => {
    const { cartItems } = req.body;
    if (!cartItems || cartItems.length === 0) {
        return res.status(400).json({ message: "Cannot checkout with an empty cart." });
    }
    const total = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const receipt = {
        receiptId: `receipt-${Date.now()}`,
        items: cartItems,
        total: parseFloat(total.toFixed(2)),
        checkoutTimestamp: new Date().toISOString(),
    };
    req.app.set('cart', []);
    nextCartItemId = 1; 
    res.status(200).json(receipt);
});
module.exports = (req, res, next) => {
    router(req, res, next);
};
