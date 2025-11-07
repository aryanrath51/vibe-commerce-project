const express = require('express');
const cors = require('cors');
const productRoutes = require('./routes/productRoutes');
const cartRoutes = require('./routes/cartRoutes');

const app = express();
const PORT = process.env.PORT || 5001;

app.use(cors());
app.use(express.json());

app.set('cart', []);
app.use('/api/products', productRoutes);
app.use('/api', cartRoutes);

app.get('/', (req, res) => {
  res.send('Welcome to the Vibe Commerce Mock API!');
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
