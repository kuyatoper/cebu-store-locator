const storeForm = document.getElementById('storeForm');
const itemForm = document.getElementById('itemForm');
const itemTableBody = document.querySelector('#itemTable tbody');
const refreshItemsButton = document.getElementById('refreshItems');

storeForm.addEventListener('submit', async event => {
  event.preventDefault();

  const store = {
    store_name: document.getElementById('storeName').value.trim(),
    address: document.getElementById('storeAddress').value.trim(),
    google_maps_link: document.getElementById('storeMaps').value.trim(),
    website_link: document.getElementById('storeWebsite').value.trim()
  };

  try {
    const response = await fetch('/addStore', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(store)
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || 'Failed to add store.');
    }

    alert(`Store added successfully! Store ID: ${data.store_id}`);
    storeForm.reset();
  } catch (error) {
    console.error(error);
    alert(error.message);
  }
});

itemForm.addEventListener('submit', async event => {
  event.preventDefault();

  const item = {
    item_name: document.getElementById('itemName').value.trim(),
    description: document.getElementById('itemDesc').value.trim(),
    stock: Number(document.getElementById('itemStock').value),
    store_id: Number(document.getElementById('itemStoreId').value)
  };

  try {
    const response = await fetch('/addItem', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(item)
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || 'Failed to add item.');
    }

    alert(`Item added successfully! Item ID: ${data.item_id}`);
    itemForm.reset();
    loadItems();
  } catch (error) {
    console.error(error);
    alert(error.message);
  }
});

async function loadItems() {
  itemTableBody.innerHTML = '<tr><td colspan="6">Loading...</td></tr>';

  try {
    const response = await fetch('/getItems');
    const items = await response.json();

    if (!response.ok) {
      throw new Error(items.error || 'Failed to load items.');
    }

    itemTableBody.innerHTML = '';

    if (items.length === 0) {
      itemTableBody.innerHTML = '<tr><td colspan="6">No items found.</td></tr>';
      return;
    }

    items.forEach(item => {
      const row = document.createElement('tr');
      row.innerHTML = `
        <td>${escapeHtml(item.item_id)}</td>
        <td>${escapeHtml(item.item_name)}</td>
        <td>${escapeHtml(item.description || '')}</td>
        <td>${escapeHtml(item.stock)}</td>
        <td>${escapeHtml(item.store_name)}</td>
        <td>${escapeHtml(item.address)}</td>
      `;
      itemTableBody.appendChild(row);
    });
  } catch (error) {
    console.error(error);
    itemTableBody.innerHTML = `<tr><td colspan="6">Unable to load items.</td></tr>`;
  }
}

function escapeHtml(value) {
  return String(value)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#039;');
}

refreshItemsButton.addEventListener('click', loadItems);

document.addEventListener('DOMContentLoaded', loadItems);
