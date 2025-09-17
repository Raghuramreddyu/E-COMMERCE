const express = require('express');
const db = require('../db');
const authMiddleware = require('../middleware/authMiddleware');
const crypto = require('crypto');

const router = express.Router();

// Helper function to generate a random alphanumeric string
const generatePublicOrderId = () => {
  return crypto.randomBytes(4).toString('hex').toUpperCase();
};

// --- GET /api/orders - Fetch all orders for the logged-in user ---
router.get('/', authMiddleware, async (req, res) => {
  const userId = req.user.userId;

  try {
    const [orders] = await db.query(
      'SELECT id, public_order_id, order_date, total_amount FROM orders WHERE user_id = ? ORDER BY order_date DESC', 
      [userId]
    );

    if (orders.length === 0) {
      return res.json([]);
    }

    for (const order of orders) {
      const [items] = await db.query(`
        SELECT oi.quantity, oi.price_at_purchase, p.name, p.image_url
        FROM order_items oi
        JOIN products p ON oi.product_id = p.id
        WHERE oi.order_id = ?
      `, [order.id]);
      
      order.items = items;
    }

    res.json(orders);

  } catch (error) {
    console.error('Failed to fetch orders:', error);
    res.status(500).json({ message: 'Server error while fetching orders.' });
  }
});


// --- POST /api/orders - Create a new order ---
router.post('/', authMiddleware, async (req, res) => {
  const userId = req.user.userId;
  const { items } = req.body;

  if (!items || items.length === 0) {
    return res.status(400).json({ message: 'Cannot place an empty order.' });
  }

  let connection;
  try {
    connection = await db.getConnection();
    await connection.beginTransaction();

    let totalAmount = 0;
    for (const item of items) {
      const [productRows] = await connection.query('SELECT price FROM products WHERE id = ?', [item.product.id]);
      if (productRows.length === 0) {
        throw new Error(`Product with ID ${item.product.id} not found.`);
      }
      totalAmount += productRows[0].price * item.quantity;
    }

    const publicOrderId = generatePublicOrderId();

    const [orderResult] = await connection.query(
      'INSERT INTO orders (user_id, total_amount, order_date, public_order_id) VALUES (?, ?, NOW(), ?)',
      [userId, totalAmount, publicOrderId]
    );
    const orderId = orderResult.insertId;

    const orderItemsValues = items.map(item => [orderId, item.product.id, item.quantity, item.product.price]);
    
    await connection.query(
      'INSERT INTO order_items (order_id, product_id, quantity, price_at_purchase) VALUES ?',
      [orderItemsValues]
    );

    await connection.commit();
    res.status(201).json({ message: 'Order created successfully!', publicOrderId: publicOrderId });

  } catch (error) {
    if (connection) await connection.rollback();
    console.error('Failed to create order:', error);
    res.status(500).json({ message: 'Server error while placing order.' });
  } finally {
    if (connection) connection.release();
  }
});

module.exports = router;

// GET a single order by public ID
router.get('/:publicOrderId', authMiddleware, async (req, res) => {
  const { publicOrderId } = req.params;
  const userId = req.user.userId;

  try {
    const [orders] = await db.query(
      'SELECT * FROM orders WHERE public_order_id = ? AND user_id = ?',
      [publicOrderId, userId]
    );

    if (orders.length === 0) {
      return res.status(404).json({ message: 'Order not found.' });
    }
    
    const order = orders[0];

    const [items] = await db.query(`
      SELECT oi.quantity, oi.price_at_purchase, p.name, p.image_url
      FROM order_items oi
      JOIN products p ON oi.product_id = p.id
      WHERE oi.order_id = ?
    `, [order.id]);

    order.items = items;
    res.json(order);

  } catch (error) {
    console.error('Failed to fetch order:', error);
    res.status(500).json({ message: 'Server error while fetching order.' });
  }
});