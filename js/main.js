document.addEventListener('DOMContentLoaded', () => {
  const productsContainer = document.getElementById('products-container');

  const fetchProducts = async () => {
    try {
      const response = await fetch('https://fakestoreapi.com/products');
      const products = await response.json();
      displayProducts(products);
    } catch (error) {
      console.error('Error fetching products:', error);
      productsContainer.innerHTML = '<p>Error fetching products. Please try again later.</p>';
    }
  };

  const displayProducts = (products) => {
    products.forEach(product => {
      const card = document.createElement('div');
      card.classList.add('product-card');
      card.innerHTML = `
        <img src="${product.image}" alt="${product.title}">
        <h3>${product.title}</h3>
        <p>$${product.price}</p>
        <button class="view-details-btn" data-product-id="${product.id}">Detalle</button>
      `;
      productsContainer.appendChild(card);
    });

    // Add event listeners to the "View Details" buttons after they are created
    const viewDetailsButtons = document.querySelectorAll('.view-details-btn');
    viewDetailsButtons.forEach(button => {
      button.addEventListener('click', openModal);
    });
  };

  const openModal = async (event) => {
    const productId = event.target.dataset.productId;
    try {
      const response = await fetch(`https://fakestoreapi.com/products/${productId}`);
      const product = await response.json();
      displayModal(product);
    } catch (error) {
      console.error('Error fetching product details:', error);
    }
  };

  const displayModal = (product) => {
    const modal = document.createElement('div');
    modal.classList.add('product-modal');
    modal.innerHTML = `
      <div class="modal-content">
        <span class="close-btn">&times;</span>
        <h2>${product.title}</h2>
        <img src="${product.image}" alt="${product.title}">
        <p>Price: $${product.price}</p>
        <p>${product.description}</p>
        <button class="add-to-cart-btn" data-product-id="${product.id}">Agregar al carrito</button>
      </div>
    `;
    document.body.appendChild(modal);

    const closeBtn = modal.querySelector('.close-btn');
    closeBtn.addEventListener('click', () => {
      modal.remove();
    });

    const addToCartBtn = modal.querySelector('.add-to-cart-btn');
    addToCartBtn.addEventListener('click', () => {
      addToCart(product);
      modal.remove();
    });
  };

  const addToCart = (product) => {
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    product.quantity = 1;
    cart.push(product);
    localStorage.setItem('cart', JSON.stringify(cart));
    displayCartItems();
    updateCartTotal();
    alert('Producto agregado al carrito!');
  };

  const cartIcon = document.getElementById('cart-icon');
  const cartSidebar = document.getElementById('cart-sidebar');
  const cartSidebarCloseBtn = cartSidebar.querySelector('.close-btn');
  const cartItemsContainer = document.getElementById('cart-items');

  cartSidebarCloseBtn.addEventListener('click', () => {
    cartSidebar.classList.add('hide-cart-sidebar');
    cartIcon.classList.remove('cart-icon-shifted');
  });

  cartIcon.addEventListener('click', () => {
    cartSidebar.classList.toggle('hide-cart-sidebar');
    cartIcon.classList.toggle('cart-icon-shifted');
    displayCartItems();
    updateCartTotal();
  });

  const displayCartItems = () => {
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    cartItemsContainer.innerHTML = '';

    if (cart.length === 0) {
      cartItemsContainer.innerHTML = '<p>No items in cart.</p>';
      return;
    }

    cart.forEach(product => {
      const cartItem = document.createElement('div');
      cartItem.classList.add('cart-item');
      cartItem.innerHTML = `
        <img src="${product.image}" alt="${product.title}">
        <h3>${product.title}</h3>
        <div class="quantity-controls">
          <button class="decrement-btn" data-product-id="${product.id}" ${product.quantity <= 1 ? 'disabled' : ''}>-</button>
          <span class="quantity">${product.quantity || 1}</span>
          <button class="increment-btn" data-product-id="${product.id}">+</button>
        </div>
        <p class="final-price">Precio: $${product.price * (product.quantity || 1)}</p>
        <button class="delete-btn" data-product-id="${product.id}">Eliminar</button>
      `;
      cartItemsContainer.appendChild(cartItem);
    });
  };

  cartItemsContainer.addEventListener('click', (event) => {
    if (event.target.classList.contains('decrement-btn')) {
      const productId = event.target.dataset.productId;
      updateQuantity(productId, -1);
    }

    if (event.target.classList.contains('increment-btn')) {
      const productId = event.target.dataset.productId;
      updateQuantity(productId, 1);
    }

    if (event.target.classList.contains('delete-btn')) {
      const productId = event.target.dataset.productId;
      deleteProduct(productId);
    }
  });

  const updateQuantity = (productId, change) => {
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    const productIndex = cart.findIndex(product => product.id == productId);

    if (productIndex !== -1) {
      cart[productIndex].quantity = (cart[productIndex].quantity || 1) + change;

      if (cart[productIndex].quantity <= 0) {
        cart.splice(productIndex, 1);
      }

      localStorage.setItem('cart', JSON.stringify(cart));
      displayCartItems();
      updateCartTotal();
    }
  };

  const deleteProduct = (productId) => {
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    const productIndex = cart.findIndex(product => product.id == productId);

    if (productIndex !== -1) {
      cart.splice(productIndex, 1);
      localStorage.setItem('cart', JSON.stringify(cart));
      displayCartItems();
      updateCartTotal();
    }
  };

  const updateCartTotal = () => {
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    let total = 0;
    cart.forEach(product => {
      total += product.price * (product.quantity || 1);
    });
    const cartTotalElement = document.getElementById('cart-total');
    cartTotalElement.textContent = `Total: $${total.toFixed(2)}`;
  };

  fetchProducts();

  // Finalizar Compra button functionality
  const finalizarCompraBtn = document.getElementById('finalizar-compra-btn');
  if (finalizarCompraBtn) {
    finalizarCompraBtn.addEventListener('click', finalizarCompra);
  }

  function finalizarCompra() {
    localStorage.removeItem('cart');
    cartItemsContainer.innerHTML = '<p>No items in cart.</p>';
    updateCartTotal();
    alert('Compra finalizada! Gracias por su compra.');
  }

  // Eliminar Carrito button functionality
  const eliminarCarritoBtn = document.getElementById('eliminar-carrito-btn');
  if (eliminarCarritoBtn) {
    eliminarCarritoBtn.addEventListener('click', eliminarCarrito);
  }

  function eliminarCarrito() {
    localStorage.removeItem('cart');
    cartItemsContainer.innerHTML = '<p>No items in cart.</p>';
    updateCartTotal();
  }

  // Search functionality
  const searchInput = document.getElementById('inputSearch');
  searchInput.addEventListener('input', searchProducts);

  function searchProducts() {
    const searchTerm = searchInput.value.toLowerCase();
    const productsContainer = document.getElementById('products-container');
    const productCards = productsContainer.querySelectorAll('.product-card');

    productCards.forEach(card => {
      const title = card.querySelector('h3').textContent.toLowerCase();
      if (title.includes(searchTerm)) {
        card.style.display = 'block';
      } else {
        card.style.display = 'none';
      }
    });
  }
});
