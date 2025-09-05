// Replace with your public Google Apps Script URL
const API_URL = "https://script.google.com/macros/s/AKfycbzvYQEgbW1nJD7FUJ9-rfBvGBUdkrk-8_IyRsPkC4da6IS6iVjLPPZPLn4_9YXaWHOm8g/exec";

let allProperties = [];

function renderCards(properties) {
  const container = document.getElementById('cards-container');
  container.innerHTML = '';

  properties.forEach((item) => {
    const card = document.createElement('div');
    card.classList.add('card');

    card.innerHTML = `
      <img src="${item.ImageURL}" alt="${item.Title}">
      <div class="card-body">
        <h2>${item.Title}</h2>
        <p><strong>Location:</strong> ${item.Location}</p>
        <p><strong>Price:</strong> ${item.Price}</p>
        <p>${item.Description}</p>
        <span class="status ${item.Status === 'Sold' ? 'sold' : 'for-sale'}">${item.Status}</span>
      </div>
    `;

    card.addEventListener('click', () => showDetails(item));
    container.appendChild(card);
  });
}

function filterProperties() {
  const searchTerm = document.getElementById('searchInput').value.toLowerCase();
  const statusTerm = document.getElementById('statusFilter').value;

  const filtered = allProperties.filter(item => {
    const matchesSearch = item.Title.toLowerCase().includes(searchTerm) || item.Location.toLowerCase().includes(searchTerm);
    const matchesStatus = statusTerm === '' || item.Status === statusTerm;
    return matchesSearch && matchesStatus;
  });

  renderCards(filtered);
}

function showDetails(item) {
  document.getElementById('cards-container').style.display = 'none';
  document.getElementById('controls-bar').style.display = 'none';
  const detailsView = document.getElementById('details-view');

  detailsView.innerHTML = `
    <div class="details-card">
      <img src="${item.ImageURL}" alt="${item.Title}">
      <h2>${item.Title}</h2>
      <p><strong>Location:</strong> ${item.Location}</p>
      <p><strong>Price:</strong> ${item.Price}</p>
      <p><strong>Status:</strong> ${item.Status}</p>
      <p>${item.Description}</p>
      <button class="back-btn" onclick="goBack()">⬅ Back</button>
    </div>
  `;

  detailsView.classList.add('active');
}

function goBack() {
  document.getElementById('details-view').classList.remove('active');
  document.getElementById('cards-container').style.display = 'flex';
  document.getElementById('controls-bar').style.display = 'flex';
}

// Fetch data directly from public API
fetch(API_URL)
  .then(res => res.json())
  .then(data => {
    allProperties = data;
    renderCards(allProperties);
  })
  .catch(err => console.error("Error fetching data:", err));

document.getElementById('searchInput').addEventListener('input', filterProperties);
document.getElementById('statusFilter').addEventListener('change', filterProperties);
