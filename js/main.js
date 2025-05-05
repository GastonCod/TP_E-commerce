// IMPORTS

// DOM: enlaces y variables globales
const categorias = [];
const carrito = [];

const container = document.querySelector("div.card-container");
const buttonCarrito = document.querySelector("div.shoping-cart");
const inputSearch = document.querySelector("input#inputSearch");
const seccionCategorias = document.querySelector("article.categories");

// LÓGICA

// function crearCardHTML(producto) {
//     return `
//     <div class="max-w-xs rounded overflow-hidden shadow-lg bg-white">
//         <img class="w-full h-48 object-contain bg-white p-4" src="${producto.image}" alt="${producto.title}">
//         <div class="px-6 py-4">
//             <div class="font-bold text-xl mb-2">${producto.title}</div>
//             <p class="text-gray-700 text-base">
//                 ${producto.description.substring(0, 100)}...
//             </p>
//         </div>
//         <div class="px-6 pt-4 pb-2">
//             <span class="inline-block bg-green-100 rounded-full px-3 py-1 text-sm font-semibold text-green-800 mr-2 mb-2">
//                 $${producto.price}
//             </span>
//             <span class="inline-block bg-blue-100 rounded-full px-3 py-1 text-sm font-semibold text-blue-800 mr-2 mb-2">
//                 ${producto.category}
//             </span>
//         </div>
//         <div class="px-6 pb-4 text-center">
//             <button id="buttonComprar" data-codigo="${producto.id}" class="bg-yellow-500 hover:bg-yellow-600 text-white font-bold py-2 px-4 rounded">
//                 COMPRAR
//             </button>
//         </div>
//     </div>`;
// }

function crearCardHTML(producto) {
    const productoStr = encodeURIComponent(JSON.stringify(producto));

    return `
    <div 
        class="w-full max-w-xs rounded overflow-hidden shadow-lg bg-white cursor-pointer transform transition duration-300 hover:scale-105 hover:shadow-xl" 
        onclick="abrirModal('${productoStr}')"
    >
        <img class="w-full h-48 object-contain bg-white p-4" src="${producto.image}" alt="${producto.title}">
        <div class="px-6 py-4">
            <div class="font-normal text-l text-center">${producto.title}</div>
        </div>
    </div>`;
}


function agregarProductos() {
    fetch(`https://fakestoreapi.com/products`)
        .then((res) => res.json())
        .then((productos) => {
            container.innerHTML = "";

            productos.forEach(producto => {
                const cardHTML = crearCardHTML(producto);
                container.innerHTML += cardHTML;
            });
        })
        .catch((error) => console.error("Error al cargar los productos:", error));
}

// function abrirModal(producto) {
//     const prod = typeof producto === "string" ? JSON.parse(decodeURIComponent(producto)) : producto;

//     document.getElementById("modal-title").textContent = prod.title;
//     document.getElementById("modal-price").textContent = `$${prod.price}`;
//     document.getElementById("modal-description").textContent = prod.description;
//     document.getElementById("modal-image").src = prod.image;

//     document.getElementById("producto-modal-backdrop").classList.remove("hidden");
// }


function abrirModal(producto) {
    const prod = typeof producto === "string" ? JSON.parse(decodeURIComponent(producto)) : producto;

    // // Si ya existe un modal abierto, lo eliminamos primero
    // const modalExistente = document.getElementById("producto-modal-backdrop");
    // if (modalExistente) {
    //     modalExistente.remove();
    // }

    // Crear el contenedor del modal
    const modalHTML = `
    <div id="producto-modal-backdrop" class="fixed inset-0 z-[999] grid place-items-center bg-black bg-opacity-60 backdrop-blur-sm transition-opacity duration-300">
        <div class="relative w-11/12 max-w-md rounded-lg bg-white shadow-sm p-6">
            <div class="flex justify-between items-start">
                <div>
                    <h5 class="text-xl font-medium text-slate-800">${prod.title}</h5>
                    <p class="text-green-600 font-bold text-lg mt-1">$${prod.price}</p>
                </div>
                <button onclick="cerrarModal()" class="text-gray-500 hover:bg-gray-100 rounded-full p-2">✖</button>
            </div>
            <img class="w-full h-64 object-contain my-4" src="${prod.image}" />
            <p class="text-slate-600 text-sm">${prod.description}</p>
            <div class="mt-6 text-right">
                <button class="bg-yellow-500 hover:bg-yellow-600 text-white font-bold py-2 px-4 rounded">
                    Agregar al carrito
                </button>
            </div>
        </div>
    </div>
    `;

    // Insertar el modal en el body
    document.body.insertAdjacentHTML("beforeend", modalHTML);
}

function cerrarModal() {
    document.getElementById("producto-modal-backdrop").classList.add("hidden");
}




function mostrarToast(mensaje, estilo) {
    ToastIt.now({
        style: estilo,
        message: mensaje,
        close: true,
    });
}

function agregarEventosClick() {
    const botonesComprar = document.querySelectorAll("button#buttonComprar");
    if (botonesComprar.length > 0) {
        botonesComprar.forEach((boton) => {
            boton.addEventListener("click", () => {
                let productoElegido = productos.find(
                    (producto) => producto.id === boton.dataset.codigo
                );
                if (productoElegido !== undefined) {
                    carrito.push(productoElegido);
                    let mensaje = `'${productoElegido.nombre}' agregado al carrito`;
                    mostrarToast(mensaje, "success");
                    guardarCarrito();
                } else {
                    alert(" No se encontró el producto.");
                }
            });
        });
    }
}

function guardarCarrito() {
    if (carrito.length > 0) {
        let kart = JSON.stringify(carrito);
        localStorage.setItem("shoppingKart", kart);
    }
}

function recuperarCarrito() {
    const recuperarCarrito = JSON.parse(localStorage.getItem("shoppingKart"));

    if (Array.isArray(recuperarCarrito)) {
        carrito.push(...recuperarCarrito);
    }
}

function cargarProductos(arrayProductos) {
    if (arrayProductos.length > 0) {
        container.innerHTML = "";
        arrayProductos.forEach((producto) => {
            container.innerHTML += crearCardHTML(producto);
        });
        agregarEventosClick();
    } else {
        container.innerHTML = crearCardError();
        console.error("No se pudieron cargar los productos.");
    }
}

// EVENTOS
buttonCarrito.addEventListener("click", () => {
    if (carrito.length > 0) {
        location.href = "checkout.html";
    } else {
        alert("⛔️ Agrega al menos un producto al carrito.");
    }
});

inputSearch.addEventListener("search", () => {
    let valor = inputSearch.value.trim().toLowerCase();
    let productosEncontrados = productos.filter((producto) =>
        producto.nombre.toLowerCase().includes(valor)
    );

    if (productosEncontrados.length > 0) {
        cargarProductos(productosEncontrados);
    } else {
        alert("🔎 No se encontraron coincidencias.");
    }
});

// FUNCIÓN PRINCIPAL
// cargarProductos(productos);
// agregarProducto(1);
agregarProductos();
recuperarCarrito();