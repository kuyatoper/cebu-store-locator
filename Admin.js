document.getElementById('storeForm').addEventListener('submit', async (e) => {
  e.preventDefault();
  const store = {
    store_name: document.getElementById('storeName').value,
    address: document.getElementById('storeAddress').value,
    google_maps_link: document.getElementById('storeMaps').value,
    website_link: document.getElementById('storeWebsite').value
  };

  await fetch('/addStore', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(store)
  });

  alert('Store added successfully!');
});

document.getElementById('itemForm').addEventListener('submit', async (e) => {
  e.preventDefault();
  const item = {
  item_name: document.getElementById('itemName').value,
  description: document.getElementById('itemDesc').value,
  stock: document.getElementById('itemStock').value,
  store_id: document.getElementById('itemStoreId').value
};


  await fetch('/addItem', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(item)
  });

  alert('Item added successfully!');
});
