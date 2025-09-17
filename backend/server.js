require('dotenv').config();
const express = require('express');
const cors = require('cors');

// --- 1. IMPORT ALL ROUTE FILES ---
// Make sure all three of these lines are here.
const productRoutes = require('./routes/products');
const authRoutes = require('./routes/auth');
const orderRoutes = require('./routes/orders');

const app = express();

// --- Middleware ---
app.use(cors());
app.use(express.json());

// --- 2. USE ALL ROUTES ---
// This tells Express which URL path corresponds to which route file.
// The error is happening because the '/api/orders' line is likely missing.
app.use('/api/products', productRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/orders', orderRoutes); // This line is crucial!

// --- Health Check Endpoint ---
app.get('/healthz', (req, res) => {
  res.status(200).send('OK');
});

// --- Basic Error Handling ---
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});

const PORT = process.env.PORT || 3000;

const createTables = require('./db-init');

createTables().then(() => {
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
});
