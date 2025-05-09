import { addToCart } from '../cart.js';

export function displayModal(product) {
  const modal = document.createElement('div');
  modal.classList.add('product-modal');
  modal.innerHTML = `
    <div class="modal-content">
      <span class="close-btn">&times;</span>
      <h2>${product.title}</h2>
      <img src="${product.image}" alt="${product.title}">
      <p>Price: $${product.price}</p>
      <p>${product.description}</p>
      <button class="add-to-cart-btn" data-product-id="${product.id}">Add to Cart</button>
    </div>
  `;
  document.body.appendChild(modal);

  modal.querySelector('.close-btn').addEventListener('click', () => modal.remove());
  modal.querySelector('.add-to-cart-btn').addEventListener('click', () => {
    addToCart(product);
    modal.remove();
  });
}
