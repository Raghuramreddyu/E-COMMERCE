const express = require('express');
const db = require('../db');
const authMiddleware = require('../middleware/authMiddleware');
const adminMiddleware = require('../middleware/adminMiddleware');

const router = express.Router();

// GET all products, with optional category filtering
router.get('/', async (req, res) => {
  const { category } = req.query; // e.g., /api/products?category=CPU

  try {
    let query = 'SELECT * FROM products';
    const params = [];

    if (category) {
      query += ' WHERE category = ?';
      params.push(category);
    }

    const [products] = await db.query(query, params);
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch products.' });
  }
});

// GET a single product by ID
router.get('/:id', async (req, res) => {
  try {
    const [products] = await db.query('SELECT * FROM products WHERE id = ?', [req.params.id]);
    if (products.length === 0) {
      return res.status(404).json({ message: 'Product not found.' });
    }
    res.json(products[0]);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch product.' });
  }
});

// POST a new product (Admin only)
router.post('/', [authMiddleware, adminMiddleware], async (req, res) => {
  const { name, description, price, image_url, slug, category } = req.body;
  try {
    const [result] = await db.query(
      'INSERT INTO products (name, description, price, image_url, slug, category) VALUES (?, ?, ?, ?, ?, ?)',
      [name, description, price, image_url, slug, category]
    );
    res.status(201).json({ id: result.insertId, ...req.body });
  } catch (error) {
    res.status(500).json({ message: 'Failed to create product.' });
  }
});

// DELETE a product (Admin only)
router.delete('/:id', [authMiddleware, adminMiddleware], async (req, res) => {
  try {
    const [result] = await db.query('DELETE FROM products WHERE id = ?', [req.params.id]);
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Product not found.' });
    }
    res.status(200).json({ message: 'Product deleted successfully.' });
  } catch (error) {
    res.status(500).json({ message: 'Failed to delete product.' });
  }
});

module.exports = router;
