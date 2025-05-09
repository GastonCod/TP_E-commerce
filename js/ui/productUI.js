import { fetchProductById } from '../api.js';
import { displayModal } from './modalUI.js';

export function displayProducts(products) {
  const container = document.getElementById('products-container');
  container.innerHTML = '';

  products.forEach(product => {
    const card = document.createElement('div');
    card.classList.add('product-card');
    card.innerHTML = `
      <img src="${product.image}" alt="${product.title}">
      <h3>${product.title}</h3>
      <p>$${product.price}</p>
      <button class="view-details-btn" data-product-id="${product.id}">View Details</button>
    `;
    container.appendChild(card);
  });

  container.querySelectorAll('.view-details-btn').forEach(button => {
    button.addEventListener('click', async (e) => {
      const product = await fetchProductById(e.target.dataset.productId);
      displayModal(product);
    });
  });
}
