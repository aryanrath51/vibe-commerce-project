import React, { useState } from 'react';

function CheckoutModal({ onClose, onCheckout, customerInfo }) {
  const [name, setName] = useState(customerInfo.name || '');
  const [email, setEmail] = useState(customerInfo.email || '');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (name && email) {
      onCheckout({ name, email });
    } else {
      alert('Please fill in all fields.');
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <h2>Checkout</h2>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Your Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
          <input
            type="email"
            placeholder="Your Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <div className="modal-actions">
            <button type="button" onClick={onClose}>Cancel</button>
            <button type="submit">Confirm Purchase</button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default CheckoutModal;