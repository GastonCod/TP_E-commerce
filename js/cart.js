// cart.js

import { displayCartItems } from "./ui/cartUI.js";

export function getCart() {
  return JSON.parse(localStorage.getItem("cart")) || [];
}

export function saveCart(cart) {
  localStorage.setItem("cart", JSON.stringify(cart));
}

export function addToCart(product) {
  const cart = getCart();
  const existing = cart.find((p) => p.id === product.id);

  if (existing) {
    existing.quantity += 1;
  } else {
    product.quantity = 1;
    cart.push(product);
  }

  saveCart(cart);
}

export function removeFromCart(productId) {
  let cart = getCart();
  cart = cart.filter((p) => p.id !== productId);
  saveCart(cart);
}

export function clearCart() {
  saveCart([]);
}

export function getCartTotal() {
  const cart = getCart();
  return cart.reduce((total, p) => total + p.price * p.quantity, 0).toFixed(2);
}

export function updateQuantity(productId, newQuantity) {
  const cart = getCart();
  const product = cart.find((p) => p.id === productId);

  if (product) {
    product.quantity = newQuantity > 0 ? newQuantity : 1;
    saveCart(cart);
  }
}

export function isInCart(productId) {
  const cart = getCart();
  return cart.some((p) => p.id === productId);
}

export function deleteProduct(productId) {
  const cart = JSON.parse(localStorage.getItem("cart")) || [];
  const updatedCart = cart.filter((product) => product.id !== productId);
  localStorage.setItem("cart", JSON.stringify(updatedCart));
}

export function finalizarCompra() {
  const cart = getCart();
  if (cart.length === 0) {
    alert("No hay productos en el carrito.");
    return;
  }
  alert("¡Gracias por tu compra!"); 
  clearCart();
  displayCartItems();
}
