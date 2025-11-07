import React from 'react';

function Cart({ cartItems, cartTotal, onRemoveFromCart, onCheckout, onUpdateQuantity }) {
  return (
    <aside className="cart">
      <h2>Shopping Cart</h2>
      {cartItems.length === 0 ? (
        <p>Your cart is empty.</p>
      ) : (
        <div>
          {cartItems.map((item) => (
            <div key={item.cartItemId} className="cart-item">
              <div className="cart-item-info">
                <span>{item.name}</span><br/>
                <span>₹{(item.price * item.quantity).toFixed(2)}</span>
              </div>
              <div className="cart-item-controls">
                <button onClick={() => onUpdateQuantity(item.cartItemId, item.quantity - 1)}>-</button>
                <span>{item.quantity}</span>
                <button onClick={() => onUpdateQuantity(item.cartItemId, item.quantity + 1)}>+</button>
                <button
                  className="remove-btn"
                  onClick={() => onRemoveFromCart(item.cartItemId)}
                >
                  Remove
                </button>
              </div>
            </div>
          ))}
          <div className="cart-total">
            <strong>Total: ₹{cartTotal.toFixed(2)}</strong>
          </div>
        </div>
      )}
      <button
        className="checkout-btn"
        onClick={onCheckout}
        disabled={cartItems.length === 0}
      >
        Checkout
      </button>
    </aside>
  );
}

export default Cart;