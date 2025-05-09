const { carrito, precioTotal, tableBody, btnComprar } = require("./checkout");

// LÓGICA
export function recuperarCarrito() {
    const recuperarCarrito = JSON.parse(localStorage.getItem('shoppingKart'));

    if (Array.isArray(recuperarCarrito)) {
        carrito.push(...recuperarCarrito);
    }
}
function calcularTotalCarrito() {
    if (carrito.length > 0) {
        precioTotal.textContent = carrito.reduce((acc, prod) => acc + prod.precio, 0).toFixed(2) || 0.00;
    }
}
function crearFilaCarrito(prod) {
    return `<tr>
                <td id="pImagen">${prod.imagen}</td>
                <td id="nombre">${prod.nombre}</td>
                <td id="price">$ ${prod.precio.toFixed(2)}</td>
                <td id="delButton" 
                    data-codigo="${prod.id}"
                    title="Clic para eliminar">
                    ⛔️
                </td>
            </tr>`;
}
export function mostrarCarrito() {
    if (carrito.length > 0) {
        tableBody.innerHTML = '';
        carrito.forEach((prod) => {
            tableBody.innerHTML += crearFilaCarrito(prod);
        });
        calcularTotalCarrito();
        btnComprar.removeAttribute('disabled');
    }
}
