// Array para los productos
// Se añade una nueva propiedad 'talla' y 'cantidad' para simular un e-commerce más real
const productos = [
{
    id: 1,
    nombre: "Camisa blanca hombre", 
    precio: 70000, 
    imagen: "img/camisa hombre blanca.jpeg",
},

{
    id: 2,
    nombre: "Camisa blanca mujer",
    precio: 70000,
    imagen: "img/camisa mujer blanca.jpeg",
},

{
    id: 3,
    nombre: "Camisa beige hombre",
    precio: 70000,
    imagen: "img/camisa hombre beige.jpeg",
},

{
    id: 4,
    nombre: "Camisa beige mujer",
    precio: 70000,
    imagen: "img/camisa mujer beige.jpeg",
},

{
    id: 5,
    nombre: "Polo negra para hombre",
    precio: 90000,
    imagen: "img/camisahombreNegra.jpeg",
},

{
    id: 6,
    nombre: "Polo negra para mujer",
    precio: 90000,
    imagen: "img/poloMujerNegra.jpeg",
},

{
    id: 7,
    nombre: "Polo gris para hombre",
    precio: 90000,
    imagen: "img/poloHombreGris.jpeg",
},

{
    id: 8,
    nombre: "Polo gris para mujer",
    precio: 90000,
    imagen: "img/polo mujer gris.jpeg",
}
];

// Array para el carrito de compras
// El carrito contendrá objetos con {id: number, cantidad: number}
let carrito = JSON.parse(localStorage.getItem("carrito")) || [];


// --- FUNCIONES DE ALMACENAMIENTO Y CONTADOR ---

/**
 * Guarda el estado actual del carrito en localStorage.
 */
function guardarCarrito() {
    localStorage.setItem("carrito", JSON.stringify(carrito));
    actualizarContadorCarrito();
}

/**
 * Calcula el número total de artículos en el carrito y actualiza el contador visible.
 */
function actualizarContadorCarrito() {
    const contadorElement = document.getElementById("contador-carrito");
    if (contadorElement) {
        // Suma las cantidades de todos los productos en el carrito
        const totalItems = carrito.reduce((acc, item) => acc + item.cantidad, 0);
        contadorElement.textContent = totalItems;
        // Muestra u oculta el contador si está vacío
        contadorElement.style.display = totalItems > 0 ? "flex" : "none";
    }
}


// --- FUNCIONES DEL CATÁLOGO ---

// Elijo el contenedor donde iran los productos
const contenedorProductos = document.getElementById("contenedor-productos");
const contenedorDestacados = document.getElementById("inicio");

// Función para renderizar un botón de añadir al carrito en el catálogo
function crearBotonCatalogo(productoId) {
    const button = document.createElement("button");
    button.textContent = "Añadir al carrito";
    // Usamos data-id para manejar el ID en el script
    button.setAttribute("data-id", productoId); 
    button.onclick = function() {
        // En lugar de alert, llamamos a la función real de agregar.
        agregarAlCarrito(productoId);
    };
    return button;
}

// Recorremos el array y creamos las tarjetas en el CATÁLOGO (catalogo.html)
if (contenedorProductos) {
  productos.forEach(producto => {
    const card = document.createElement("div");   // Esta linea crea un div para cada producto
    card.classList.add("producto");

    // Con este codigo agrego contenido al div
    card.innerHTML = 
    `<img src="${producto.imagen}" alt="${producto.nombre}">
    <h3>${producto.nombre}</h3>
    <p>$${producto.precio.toLocaleString("es-CO")}</p>`;
    
    // Agregamos el botón creado dinámicamente
    card.appendChild(crearBotonCatalogo(producto.id));

    contenedorProductos.appendChild(card);
  });
}

// Función para inicializar los botones en la sección de destacados (index.html)
if (contenedorDestacados) {
    const botonesDestacados = contenedorDestacados.querySelectorAll('.tarjetas button');
    
    // Mapeamos los ID de los productos destacados (asumo que son 5, 6, 7 basados en el index.html)
    const idDestacados = [5, 6, 7]; 
    
    botonesDestacados.forEach((button, index) => {
        const id = idDestacados[index];
        button.onclick = function() {
            agregarAlCarrito(id);
        };
    });
}

/**
 * Añade un producto al carrito o incrementa su cantidad si ya existe.
 * @param {number} id - El ID del producto a agregar.
 */
function agregarAlCarrito(id) {
    // Busca si el producto ya existe en el carrito
    const itemExistente = carrito.find(item => item.id === id);

    if (itemExistente) {
        // Si existe, incrementa la cantidad
        itemExistente.cantidad++;
    } else {
        // Si no existe, lo añade con cantidad 1
        carrito.push({ id: id, cantidad: 1 });
    }

    guardarCarrito(); // Guarda en localStorage y actualiza el contador
    mostrarNotificacion("Producto añadido al carrito 🛒");

    // Si estamos en la página del carrito, la volvemos a renderizar
    if (document.getElementById("contenedor-carrito")) {
        renderizarCarrito();
    }
}

// --- FUNCIONES DEL CARRITO (carrito.html) ---

/**
 * Muestra el contenido del carrito en la página de carrito.
 */
function renderizarCarrito() {
    const contenedorCarrito = document.getElementById("contenedor-carrito");
    const totalElement = document.getElementById("total");
    
    if (!contenedorCarrito) return; // Si no estamos en la página del carrito, no hacemos nada.

    contenedorCarrito.innerHTML = ''; // Limpia el contenido previo

    if (carrito.length === 0) {
        contenedorCarrito.innerHTML = '<p class="carrito-vacio-mensaje">Tu carrito de compras está vacío. ¡Explora el <a href="catalogo.html">catálogo</a>!</p>';
        totalElement.textContent = '';
        return;
    }

    // Crea la lista de productos
    carrito.forEach(item => {
        // Busca la información completa del producto usando el ID
        const productoInfo = productos.find(p => p.id === item.id);

        if (productoInfo) {
            const itemDiv = document.createElement("div");
            itemDiv.classList.add("carrito-item");

            itemDiv.innerHTML = `
                <img src="${productoInfo.imagen}" alt="${productoInfo.nombre}">
                <div class="item-detalles">
                    <h4>${productoInfo.nombre}</h4>
                    <p>Precio: $${productoInfo.precio.toLocaleString("es-CO")}</p>
                    <div class="cantidad-control">
                        <button class="boton-restar" data-id="${item.id}">-</button>
                        <span>${item.cantidad}</span>
                        <button class="boton-sumar" data-id="${item.id}">+</button>
                    </div>
                    <p>Subtotal: $${(productoInfo.precio * item.cantidad).toLocaleString("es-CO")}</p>
                </div>
                <button class="boton-eliminar" data-id="${item.id}">X</button>
            `;
            contenedorCarrito.appendChild(itemDiv);
        }
    });

    // Calcula y muestra el total
    totalElement.textContent = `Total a pagar: $${calcularTotal().toLocaleString("es-CO")}`;

    // Agrega listeners a los botones de control de cantidad y eliminar
    document.querySelectorAll('.boton-eliminar').forEach(button => {
        button.addEventListener('click', (e) => eliminarProducto(parseInt(e.target.dataset.id)));
    });
    document.querySelectorAll('.boton-restar').forEach(button => {
        button.addEventListener('click', (e) => ajustarCantidad(parseInt(e.target.dataset.id), -1));
    });
    document.querySelectorAll('.boton-sumar').forEach(button => {
        button.addEventListener('click', (e) => ajustarCantidad(parseInt(e.target.dataset.id), 1));
    });
}

/**
 * Calcula el valor total de los productos en el carrito.
 * @returns {number} El total.
 */
function calcularTotal() {
    return carrito.reduce((total, item) => {
        const productoInfo = productos.find(p => p.id === item.id);
        if (productoInfo) {
            return total + (productoInfo.precio * item.cantidad);
        }
        return total;
    }, 0);
}

/**
 * Elimina un producto completamente del carrito.
 * @param {number} id - El ID del producto a eliminar.
 */
function eliminarProducto(id) {
    carrito = carrito.filter(item => item.id !== id);
    guardarCarrito();
    renderizarCarrito();
    mostrarNotificacion("Producto eliminado del carrito.");
}

/**
 * Ajusta la cantidad de un producto en el carrito.
 * @param {number} id - El ID del producto.
 * @param {number} delta - El cambio de cantidad (+1 o -1).
 */
function ajustarCantidad(id, delta) {
    const item = carrito.find(item => item.id === id);
    if (item) {
        item.cantidad += delta;
        
        // Si la cantidad llega a 0 o menos, lo eliminamos
        if (item.cantidad <= 0) {
            eliminarProducto(id);
        } else {
            guardarCarrito();
            renderizarCarrito();
        }
    }
}


// Manejador del botón "Vaciar carrito"
const botonVaciar = document.getElementById("vaciar-carrito");
if (botonVaciar) {
    botonVaciar.addEventListener("click", () => {
        // En lugar de alert o confirm, usamos una notificación/modal.
        mostrarConfirmacionModal("¿Estás seguro de que quieres vaciar el carrito?", vaciarCarrito);
    });
}

/**
 * Vacía completamente el carrito.
 */
function vaciarCarrito() {
    carrito = [];
    guardarCarrito();
    renderizarCarrito();
    mostrarNotificacion("¡Carrito vaciado con éxito!");
}


// --- LÓGICA DE INTERFAZ (Notificaciones y Modals) ---

/**
 * Muestra una notificación temporal.
 * @param {string} mensaje - El mensaje a mostrar.
 */
function mostrarNotificacion(mensaje) {
    let notificacion = document.getElementById('notificacion-modal');
    if (!notificacion) {
        // Crea la notificación si no existe
        notificacion = document.createElement('div');
        notificacion.id = 'notificacion-modal';
        document.body.appendChild(notificacion);
    }
    notificacion.textContent = mensaje;
    notificacion.classList.add('visible');
    
    setTimeout(() => {
        notificacion.classList.remove('visible');
    }, 2500);
}

/**
 * Muestra un modal de confirmación personalizado (ya que 'confirm()' está prohibido).
 * @param {string} mensaje - El mensaje de confirmación.
 * @param {function} callbackAceptar - Función a ejecutar si se acepta.
 */
function mostrarConfirmacionModal(mensaje, callbackAceptar) {
    let modal = document.getElementById('custom-modal');
    if (modal) modal.remove(); // Limpia modal anterior

    modal = document.createElement('div');
    modal.id = 'custom-modal';
    modal.className = 'modal-fondo';
    modal.innerHTML = `
        <div class="modal-contenido">
            <p>${mensaje}</p>
            <div class="modal-botones">
                <button id="modal-aceptar" class="boton-modal-aceptar">Aceptar</button>
                <button id="modal-cancelar" class="boton-modal-cancelar">Cancelar</button>
            </div>
        </div>
    `;

    document.body.appendChild(modal);

    document.getElementById('modal-aceptar').onclick = () => {
        callbackAceptar();
        modal.remove();
    };
    document.getElementById('modal-cancelar').onclick = () => {
        modal.remove();
    };
}


// --- INICIALIZACIÓN ---

// Se ejecuta cuando el DOM está completamente cargado
document.addEventListener('DOMContentLoaded', () => {
    // 1. Inicializa el contador del carrito en TODAS las páginas
    actualizarContadorCarrito();
    
    // 2. Si estamos en la página del carrito, lo renderizamos
    if (document.getElementById("contenedor-carrito")) {
        renderizarCarrito();
    }
});