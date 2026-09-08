async function searchItem() {
  const item = document.getElementById('searchBox').value.trim();
  const resultsDiv = document.getElementById('results');

  if (!item) {
    resultsDiv.innerHTML = '<p>Please enter an item or store name to search.</p>';
    return;
  }

  resultsDiv.innerHTML = '<p>Searching...</p>';

  try {
    const response = await fetch(`/search?item=${encodeURIComponent(item)}`);
    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || 'Search failed.');
    }

    resultsDiv.innerHTML = '';

    if (data.length === 0) {
      resultsDiv.innerHTML = `<p>No items found for <strong>${escapeHtml(item)}</strong>.</p>`;
      return;
    }

    data.forEach(row => {
      const stockText = row.stock > 0
        ? `${row.stock} in stock`
        : 'Out of stock';

      const mapsLink = row.google_maps_link
        ? `<a href="${escapeAttribute(row.google_maps_link)}" target="_blank" rel="noopener noreferrer">📍 View on Maps</a>`
        : '';

      const websiteLink = row.website_link
        ? `<a href="${escapeAttribute(row.website_link)}" target="_blank" rel="noopener noreferrer">🌐 Visit Website</a>`
        : '';

      const links = [mapsLink, websiteLink].filter(Boolean).join(' | ');

      resultsDiv.innerHTML += `
        <div class="result-card">
          <h3>${escapeHtml(row.item_name)}</h3>
          <p>${escapeHtml(row.description || 'No description available.')}</p>
          <p><b>Stock:</b> ${escapeHtml(stockText)}</p>
          <p><b>Store:</b> ${escapeHtml(row.store_name)}</p>
          <p><b>Address:</b> ${escapeHtml(row.address)}</p>
          ${links ? `<p>${links}</p>` : ''}
        </div>
      `;
    });
  } catch (error) {
    console.error('Search error:', error);
    resultsDiv.innerHTML = `<p>Unable to search right now. Please make sure the server is running.</p>`;
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

function escapeAttribute(value) {
  return escapeHtml(value);
}

// Press Enter in the search box to search.
document.addEventListener('DOMContentLoaded', () => {
  const searchBox = document.getElementById('searchBox');
  if (searchBox) {
    searchBox.addEventListener('keydown', event => {
      if (event.key === 'Enter') {
        searchItem();
      }
    });
  }
});
