async function searchItem() {
  const item = document.getElementById('searchBox').value;
  const resultsDiv = document.getElementById('results');

  // Sample data (later connect to backend)
  const sampleData = [
    {
      item_name: "Laptop Bag",
      description: "Durable waterproof bag for 15-inch laptops",
      store_name: "TechZone",
      address: "Ayala Center Cebu, Cebu City",
      google_maps_link: "https://www.google.com/maps/search/?api=1&query=Ayala+Center+Cebu",
      website_link: "https://techzone.ph"
    },
    {
      item_name: "Gaming Mouse",
      description: "High precision RGB gaming mouse",
      store_name: "Gamer's Hub",
      address: "Parkmall, Mandaue City",
      google_maps_link: "https://www.google.com/maps/search/?api=1&query=Parkmall+Mandaue",
      website_link: "https://gamershub.ph"
    },
    {
      item_name: "Wireless Earbuds",
      description: "Noise-cancelling Bluetooth earbuds",
      store_name: "SoundWave",
      address: "Marina Mall, Lapu-Lapu City",
      google_maps_link: "https://www.google.com/maps/search/?api=1&query=Marina+Mall+Lapu-Lapu",
      website_link: "https://soundwave.ph"
    }
  ];

  const results = sampleData.filter(row =>
    row.item_name.toLowerCase().includes(item.toLowerCase())
  );

  resultsDiv.innerHTML = "";
  if (results.length === 0) {
    resultsDiv.innerHTML = "<p>No items found.</p>";
  } else {
    results.forEach(row => {
      resultsDiv.innerHTML += `
        <div class="result-card">
          <h3>${row.item_name}</h3>
          <p>${row.description}</p>
          <p><b>Store:</b> ${row.store_name}</p>
          <p><b>Address:</b> ${row.address}</p>
          <p>
            <a href="${row.google_maps_link}" target="_blank">📍 View on Maps</a> |
            <a href="${row.website_link}" target="_blank">🌐 Visit Website</a>
          </p>
        </div>
      `;
    });
  }
}
