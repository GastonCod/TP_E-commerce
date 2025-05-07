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
        <button class="view-details-btn" data-product-id="${product.id}">View Details</button>
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
        <button class="add-to-cart-btn" data-product-id="${product.id}">Add to Cart</button>
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
    cart.push(product);
    localStorage.setItem('cart', JSON.stringify(cart));
    alert('Product added to cart!');
  };

  const cartIcon = document.getElementById('cart-icon');
  const cartSidebar = document.getElementById('cart-sidebar');
  const cartItemsContainer = document.getElementById('cart-items');

  cartIcon.addEventListener('click', () => {
    cartSidebar.classList.toggle('hide-cart-sidebar');
    displayCartItems();
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
        <p class="final-price">Price: $${product.price * (product.quantity || 1)}</p>
        <button class="delete-btn" data-product-id="${product.id}">Delete</button>
      `;
      cartItemsContainer.appendChild(cartItem);

      const decrementBtn = cartItem.querySelector('.decrement-btn');
      const incrementBtn = cartItem.querySelector('.increment-btn');
      const deleteBtn = cartItem.querySelector('.delete-btn');

      decrementBtn.addEventListener('click', () => {
        updateQuantity(product.id, -1);
      });

      incrementBtn.addEventListener('click', () => {
        updateQuantity(product.id, 1);
      });

      deleteBtn.addEventListener('click', () => {
        deleteProduct(product.id);
      });
    });
  };

  const updateQuantity = (productId, change) => {
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    const productIndex = cart.findIndex(product => product.id === productId);

    if (productIndex !== -1) {
      cart[productIndex].quantity = (cart[productIndex].quantity || 1) + change;

      if (cart[productIndex].quantity <= 0) {
        cart.splice(productIndex, 1);
      }

      localStorage.setItem('cart', JSON.stringify(cart));
      displayCartItems();
    }
  };

  const deleteProduct = (productId) => {
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    const productIndex = cart.findIndex(product => product.id === productId);

    if (productIndex !== -1) {
      cart.splice(productIndex, 1);
      localStorage.setItem('cart', JSON.stringify(cart));
      displayCartItems();
    }
  };

  fetchProducts();
});
