import { getCart, updateQuantity, removeFromCart, clearCart, finalizarCompra } from '../cart.js';


// cartUI.js
export function setupCartIcon() {
    const cartIcon = document.getElementById("cart-icon");
    const cartSidebar = document.getElementById("cart-sidebar");
    const cartSidebarCloseBtn = cartSidebar.querySelector(".close-btn");
  
    cartIcon.addEventListener("click", () => {
      cartSidebar.classList.toggle("hide-cart-sidebar");
      cartIcon.classList.toggle("cart-icon-shifted");
      displayCartItems();
      setupCartEvents(); // ← aquí lo llamás cuando los botones ya existen
    });
  
    cartSidebarCloseBtn.addEventListener("click", () => {
      cartSidebar.classList.add("hide-cart-sidebar");
      cartIcon.classList.remove("cart-icon-shifted");
    });
  }
  

  export function setupCartEvents() {
    const cartItemsContainer = document.getElementById("cart-items");
  
    // Delegación para +, -, eliminar
    cartItemsContainer.addEventListener("click", (e) => {
      const button = e.target;
      const id = Number(button.dataset.productId);
      if (!id) return;
  
      let cart = getCart();
      const product = cart.find((p) => p.id === id);
  
      if (button.classList.contains("decrement-btn")) {
        if (product.quantity > 1) {
          updateQuantity(id, product.quantity - 1);
          displayCartItems();
        }
      }
  
      if (button.classList.contains("increment-btn")) {
        updateQuantity(id, product.quantity + 1);
        displayCartItems();
      }
  
      if (button.classList.contains("delete-btn")) {
        removeFromCart(id);
        displayCartItems();
      }
    });
  
    // ✅ Listener directo para "Finalizar Compra"
    document
      .getElementById("finalizar-compra-btn")
      .addEventListener("click", () => {
        finalizarCompra(); // Asumimos que ya tenés esta función
      });
  
    // ✅ Listener directo para "Eliminar Carrito"
    document
      .getElementById("eliminar-carrito-btn")
      .addEventListener("click", () => {
        clearCart(); // También asumimos esta función
        displayCartItems();
      });
  }
  
  

export function displayCartItems() {
  const cart = getCart();
  const container = document.getElementById("cart-items");
  container.innerHTML = "";

  if (cart.length === 0) {
    container.innerHTML = "<p>No items in cart.</p>";
    return;
  }

  cart.forEach((product) => {
    const item = document.createElement("div");
    item.classList.add("cart-item");
    item.innerHTML = `
      <img src="${product.image}" alt="${product.title}">
      <h3>${product.title}</h3>
      <div class="quantity-controls">
        <button class="decrement-btn" data-product-id="${product.id}" ${
      product.quantity <= 1 ? "disabled" : ""
    }>-</button>
        <span class="quantity">${product.quantity}</span>
        <button class="increment-btn" data-product-id="${product.id}">+</button>
      </div>
      <p class="final-price">Price: $${product.price * product.quantity}</p>
      <button class="delete-btn" data-product-id="${product.id}">Delete</button>
    `;
    container.appendChild(item);
  });

  updateCartTotal(cart);

  setupCartEvents();
}

function updateCartTotal(cart) {
  const total = cart.reduce((sum, p) => sum + p.price * p.quantity, 0);
  document.getElementById("cart-total").textContent = `Total: $${total.toFixed(
    2
  )}`;
}
