const { recuperarCarrito, mostrarCarrito } = require("./Carrito")

// VARIABLES
export const carrito = []

export const precioTotal = document.querySelector('table tfoot td#totalPrice span')
export const btnComprar = document.querySelector('button#btnBuy')
const btnRetornar = document.querySelector('button#btnReturn')
export const tableBody = document.querySelector('table tbody#tableBody')

// FUNCIÓN PRINCIPAL
recuperarCarrito()
mostrarCarrito()

// EVENTOS
btnRetornar.addEventListener('click', ()=> location.href = 'index.html')

btnComprar.addEventListener('click', ()=> {
    alert('🛍️ Compra finalizada. Muchas gracias!')
    localStorage.removeItem('shoppingKart')
    carrito.length = 0
    setTimeout(() => btnRetornar.click(), 2500)
})