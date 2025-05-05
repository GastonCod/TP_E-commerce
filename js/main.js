// IMPORTS

// DOM: enlaces y variables globales
const categorias = [];
const carrito = [];
const producto = [];

const container = document.querySelector("div.card-container");
const buttonCarrito = document.querySelector("div.shoping-cart");

const inputSearch = document.querySelector("input#inputSearch");
const seccionCategorias = document.querySelector("article.categories");

// LÓGICA
function crearCardHTML(producto) {
    const card = document.createElement('div');
    card.className = 'w-full max-w-xs rounded overflow-hidden shadow-lg bg-white cursor-pointer transform transition duration-300 hover:scale-105 hover:shadow-xl';

    card.innerHTML = `
        <img class="w-full h-48 object-contain bg-white p-4" src="${producto.image}" alt="${producto.title}">
        <div class="px-6 py-4">
            <div class="font-normal text-l text-center">${producto.title}</div>
        </div>
    `;

    card.addEventListener('click', () => abrirModal(producto));

    return card;
}

function agregarProductos() {
    fetch(`https://fakestoreapi.com/products`)
        .then((res) => res.json())
        .then((productos) => {
            container.innerHTML = "";

            productos.forEach(producto => {
                const cardHTML = crearCardHTML(producto); // Devuelve un nodo DOM
                container.appendChild(cardHTML); // Lo agrega correctamente al DOM
            });
        })
        .catch((error) => console.error("Error al cargar los productos:", error));
}


function abrirModal(producto) {
    // Insertar datos dinámicos
    document.getElementById('modal-title').textContent = producto.title;
    document.getElementById('modal-description').textContent = producto.description;
    document.getElementById('modal-image').src = producto.image;
    document.getElementById('modal-image').alt = producto.title;
    document.getElementById('modal-price').textContent = producto.price;
    
    // Mostrar modal y backdrop
    document.getElementById('modal-producto').classList.remove('hidden');
}

function cerrarModal() {
    // Ocultar modal y backdrop
    document.getElementById('modal-producto').classList.add('hidden');
}


function agregarAlCarrito(titulo, precio, imagen) {
    // Asignar los valores del producto a la variable global
    productoLocal = {
        imagen: imagen,
        titulo: titulo,
        precio: precio,
    };
    console.log(productoLocal)

    // Actualizar el contenido del modal con la información del producto
    // document.getElementById('modal-title').innerText = titulo;
    // document.getElementById('modal-price').innerText = precio;
    // document.getElementById('modal-description').innerText = descripcion;

    // Obtener el carrito actual del localStorage (si existe)
    let carrito = JSON.parse(localStorage.getItem('carrito')) || [];

    // Verificar si el producto ya está en el carrito
    // const productoExistente = carrito.find(item => item.titulo === producto.titulo);
    carrito.push(productoLocal);
    localStorage.setItem('carrito', JSON.stringify(carrito));  // Guardamos el carrito en el localStorage
    cerrarModal();

//     if (productoExistente) {
//         // Si el producto ya está, no lo agregamos de nuevo (o puedes incrementar su cantidad si lo deseas)
//         alert('Este producto ya está en tu carrito');
//     } else {
//         // Si no está, lo agregamos al carrito
//         localStorage.setItem('carrito', JSON.stringify(carrito));  // Guardamos el carrito en el localStorage
//         alert('Producto agregado al carrito');
//     }
// }
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