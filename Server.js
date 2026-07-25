const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const bodyParser = require('body-parser');
const app = express();
const db = new sqlite3.Database('./test.db');

app.use(bodyParser.json());
app.use(express.static(__dirname)); // serve HTML/CSS/JS

// Add Store
app.post('/addStore', (req, res) => {
  const { store_name, address, google_maps_link, website_link } = req.body;
  db.run(`INSERT INTO stores (store_name, address, google_maps_link, website_link)
          VALUES (?, ?, ?, ?)`,
          [store_name, address, google_maps_link, website_link],
          function(err) {
            if (err) return res.status(500).json({ error: err.message });
            res.json({ store_id: this.lastID });
          });
});

// Add Item
app.post('/addItem', (req, res) => {
  const { item_name, description, store_id } = req.body;
  db.run(`INSERT INTO items (item_name, description, store_id)
          VALUES (?, ?, ?)`,
          [item_name, description, store_id],
          function(err) {
            if (err) return res.status(500).json({ error: err.message });
            res.json({ item_id: this.lastID });
          });
});

app.listen(3000, () => console.log('Server running on http://localhost:3000'));

// Add stock column to items table if not yet present
db.run(`ALTER TABLE items ADD COLUMN stock INTEGER`, (err) => {
  if (err && !err.message.includes('duplicate column')) console.error(err.message);
});

// Add Item
app.post('/addItem', (req, res) => {
  const { item_name, description, stock, store_id } = req.body;
  db.run(`INSERT INTO items (item_name, description, stock, store_id)
          VALUES (?, ?, ?, ?)`,
          [item_name, description, stock, store_id],
          function(err) {
            if (err) return res.status(500).json({ error: err.message });
            res.json({ item_id: this.lastID });
          });
});

// Get all items
app.get('/getItems', (req, res) => {
  db.all(`SELECT * FROM items`, [], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});
