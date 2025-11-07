const express = require('express');
const cors = require('cors');
const productRoutes = require('./routes/productRoutes');
const cartRoutes = require('./routes/cartRoutes');

const app = express();
const PORT = process.env.PORT || 5001;

// Middleware
app.use(cors()); // Enable Cross-Origin Resource Sharing
app.use(express.json()); // To parse JSON bodies

// Initialize an in-memory cart on the app instance.
app.set('cart', []);
// API Routes
app.use('/api/products', productRoutes);
app.use('/api', cartRoutes); // Use cart routes for /cart and /checkout

// ... (rest of your server.js file)

// Simple root endpoint
app.get('/', (req, res) => {
  res.send('Welcome to the Vibe Commerce Mock API!');
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});