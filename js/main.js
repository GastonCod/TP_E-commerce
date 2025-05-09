import { fetchProducts } from './api.js';
import { displayProducts } from './ui/productUI.js';
import { setupCartEvents, setupCartIcon } from './ui/cartUI.js';
import { setupSearch } from './search.js';

// main.js
document.addEventListener('DOMContentLoaded', async () => {
  const products = await fetchProducts();
  displayProducts(products);
  setupCartIcon(); // ← ahora esto se encarga de todo lo relacionado al carrito
  setupSearch();
});
