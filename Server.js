const express = require('express');
const db = require('./db');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(__dirname));

// Health check
app.get('/api/health', async (req, res) => {
  try {
    await db.query('SELECT 1');
    res.json({ status: 'ok', database: 'connected' });
  } catch (error) {
    res.status(500).json({ status: 'error', database: 'disconnected', error: error.message });
  }
});

// Add Store
app.post('/addStore', async (req, res) => {
  const { store_name, address, google_maps_link, website_link } = req.body;

  if (!store_name || !address) {
    return res.status(400).json({ error: 'Store name and address are required.' });
  }

  try {
    const [result] = await db.execute(
      `INSERT INTO stores (store_name, address, google_maps_link, website_link)
       VALUES (?, ?, ?, ?)`,
      [store_name.trim(), address.trim(), google_maps_link || null, website_link || null]
    );

    res.status(201).json({
      message: 'Store added successfully.',
      store_id: result.insertId
    });
  } catch (error) {
    console.error('Add store error:', error);
    res.status(500).json({ error: 'Failed to add store.', details: error.message });
  }
});

// Add Item
app.post('/addItem', async (req, res) => {
  const { item_name, description, stock, store_id } = req.body;
  const stockNumber = Number(stock);
  const storeIdNumber = Number(store_id);

  if (!item_name || !Number.isInteger(stockNumber) || stockNumber < 0 || !Number.isInteger(storeIdNumber)) {
    return res.status(400).json({
      error: 'Item name, a valid non-negative stock quantity, and a valid store ID are required.'
    });
  }

  try {
    const [store] = await db.execute(
      'SELECT store_id FROM stores WHERE store_id = ?',
      [storeIdNumber]
    );

    if (store.length === 0) {
      return res.status(400).json({ error: 'Store ID does not exist.' });
    }

    const [result] = await db.execute(
      `INSERT INTO items (item_name, description, stock, store_id)
       VALUES (?, ?, ?, ?)`,
      [item_name.trim(), description || null, stockNumber, storeIdNumber]
    );

    res.status(201).json({
      message: 'Item added successfully.',
      item_id: result.insertId
    });
  } catch (error) {
    console.error('Add item error:', error);
    res.status(500).json({ error: 'Failed to add item.', details: error.message });
  }
});

// Get all stores
app.get('/getStores', async (req, res) => {
  try {
    const [rows] = await db.query(
      `SELECT store_id, store_name, address, google_maps_link, website_link
       FROM stores
       ORDER BY store_name ASC`
    );

    res.json(rows);
  } catch (error) {
    console.error('Get stores error:', error);
    res.status(500).json({ error: 'Failed to retrieve stores.' });
  }
});

// Get all items with store information
app.get('/getItems', async (req, res) => {
  try {
    const [rows] = await db.query(
      `SELECT
         items.item_id,
         items.item_name,
         items.description,
         items.stock,
         items.store_id,
         stores.store_name,
         stores.address,
         stores.google_maps_link,
         stores.website_link
       FROM items
       INNER JOIN stores ON items.store_id = stores.store_id
       ORDER BY items.item_name ASC`
    );

    res.json(rows);
  } catch (error) {
    console.error('Get items error:', error);
    res.status(500).json({ error: 'Failed to retrieve items.' });
  }
});

// Search items
app.get('/search', async (req, res) => {
  const item = String(req.query.item || '').trim();

  if (!item) {
    return res.json([]);
  }

  try {
    const [rows] = await db.execute(
      `SELECT
         items.item_id,
         items.item_name,
         items.description,
         items.stock,
         items.store_id,
         stores.store_name,
         stores.address,
         stores.google_maps_link,
         stores.website_link
       FROM items
       INNER JOIN stores ON items.store_id = stores.store_id
       WHERE items.item_name LIKE ?
          OR items.description LIKE ?
          OR stores.store_name LIKE ?
          OR stores.address LIKE ?
       ORDER BY items.item_name ASC`,
      [`%${item}%`, `%${item}%`, `%${item}%`, `%${item}%`]
    );

    res.json(rows);
  } catch (error) {
    console.error('Search error:', error);
    res.status(500).json({ error: 'Failed to search items.' });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
