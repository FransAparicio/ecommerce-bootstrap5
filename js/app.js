/* =========================================================
   BOOTSERVICE - APP.JS
   Año actual, tema claro/oscuro, carrito (drawer),
   favoritos y animaciones al hacer scroll.
   ========================================================= */

"use strict";

/* =========================================================
   AÑO ACTUAL
   ========================================================= */

const currentYear = document.getElementById("currentYear");

if (currentYear) {

    currentYear.textContent = new Date().getFullYear();

}


/* =========================================================
   ALMACENAMIENTO SEGURO (localStorage)
   Evita errores en modo privado o con el
   almacenamiento deshabilitado.
   ========================================================= */

const storage = {

    get(key) {

        try {

            return window.localStorage.getItem(key);

        } catch (error) {

            return null;

        }

    },

    set(key, value) {

        try {

            window.localStorage.setItem(key, value);

        } catch (error) {

            /* Almacenamiento no disponible */

        }

    }

};


/* =========================================================
   TEMA CLARO / OSCURO
   La luna cambia a oscuro, el sol vuelve a claro.
   ========================================================= */

const THEME_KEY = "bootservice_theme";

const themeToggle = document.getElementById("themeToggle");

const themeIcon = document.getElementById("themeIcon");


function temaActual() {

    return document.documentElement.getAttribute("data-theme") === "dark"
        ? "dark"
        : "light";

}


function aplicarTema(tema) {

    document.documentElement.setAttribute("data-theme", tema);


    if (themeIcon) {

        themeIcon.className = tema === "dark"
            ? "bi-sun-fill"
            : "bi-moon-stars";

    }


    if (themeToggle) {

        const etiqueta = tema === "dark"
            ? "Cambiar a tema claro"
            : "Cambiar a tema oscuro";

        themeToggle.setAttribute("aria-label", etiqueta);

        themeToggle.setAttribute("title", etiqueta);

    }

}


if (themeToggle) {

    themeToggle.addEventListener("click", function () {

        const nuevo = temaActual() === "dark" ? "light" : "dark";

        aplicarTema(nuevo);

        storage.set(THEME_KEY, nuevo);

    });

}


/* Sincroniza el icono (el script de <head> ya evita el parpadeo) */

aplicarTema(temaActual());


/* =========================================================
   CARRITO
   Productos con cantidad, subtotal y persistencia.
   ========================================================= */

const CART_KEY = "bootservice_cart_items";

let carrito = [];


try {

    carrito = JSON.parse(storage.get(CART_KEY) || "[]");


    if (!Array.isArray(carrito)) {
        carrito = [];
    }

} catch (error) {

    carrito = [];

}


const cartItems = document.getElementById("cartItems");

const cartEmpty = document.getElementById("cartEmpty");

const cartBadge = document.getElementById("cartBadge");

const cartSubtotal = document.getElementById("cartSubtotal");

const checkoutBtn = document.getElementById("checkoutBtn");

const clearCartBtn = document.getElementById("clearCartBtn");

const cartCount = document.getElementById("cartCount");


function guardarCarrito() {

    storage.set(CART_KEY, JSON.stringify(carrito));

}


function totalCantidad() {

    return carrito.reduce((acc, item) => acc + item.qty, 0);

}


function totalPrecio() {

    return carrito.reduce(
        (acc, item) => acc + item.price * item.qty,
        0
    );

}


function formatoPrecio(valor) {

    return `Bs. ${valor.toLocaleString("es-BO")}`;

}


function bumpBadge() {

    if (!cartCount) {
        return;
    }

    cartCount.classList.remove("bump");

    /* Reinicia la animación */
    void cartCount.offsetWidth;

    cartCount.classList.add("bump");

}


function renderCarrito() {

    const cantidad = totalCantidad();


    /* Badge del navbar */

    if (cartCount) {

        cartCount.textContent = cantidad;

        cartCount.classList.toggle("d-none", cantidad === 0);

    }


    /* Badge del drawer */

    if (cartBadge) {
        cartBadge.textContent = cantidad;
    }


    /* Subtotal */

    if (cartSubtotal) {
        cartSubtotal.textContent = formatoPrecio(totalPrecio());
    }


    /* Checkout */

    if (checkoutBtn) {
        checkoutBtn.disabled = cantidad === 0;
    }


    if (!cartItems || !cartEmpty) {
        return;
    }


    cartItems.innerHTML = "";


    const vacio = carrito.length === 0;

    cartEmpty.style.display = vacio ? "flex" : "none";

    cartItems.style.display = vacio ? "none" : "flex";


    carrito.forEach((item, indice) => {

        const elemento = document.createElement("div");

        elemento.className = "cart-item";


        elemento.innerHTML = `
            <div class="cart-item-img">
                <img
                    src=""
                    alt=""
                    width="54"
                    height="54"
                    loading="lazy"
                >
            </div>

            <div class="cart-item-body">
                <div class="cart-item-name"></div>
                <div class="cart-item-price">${formatoPrecio(item.price)}</div>

                <div class="cart-item-actions">
                    <button
                        type="button"
                        class="qty-btn qty-minus"
                        aria-label="Disminuir cantidad"
                    >−</button>

                    <span class="qty-value">${item.qty}</span>

                    <button
                        type="button"
                        class="qty-btn qty-plus"
                        aria-label="Aumentar cantidad"
                    >+</button>

                    <button
                        type="button"
                        class="cart-item-remove"
                        aria-label="Eliminar del carrito"
                    >
                        <i class="bi-trash"></i>
                    </button>
                </div>
            </div>
        `;


        const img = elemento.querySelector(".cart-item-img img");

        img.src = item.image || "img/logo.png";

        img.alt = item.name || "Producto";


        elemento
            .querySelector(".cart-item-name")
            .textContent = item.name || "Producto";


        elemento
            .querySelector(".qty-minus")
            .addEventListener("click", () => {
                cambiarCantidad(indice, -1);
            });


        elemento
            .querySelector(".qty-plus")
            .addEventListener("click", () => {
                cambiarCantidad(indice, 1);
            });


        elemento
            .querySelector(".cart-item-remove")
            .addEventListener("click", () => {
                eliminarDelCarrito(indice);
            });


        cartItems.appendChild(elemento);

    });

}


function agregarAlCarrito({ name, price, image }) {

    const existente = carrito.find(item => item.name === name);


    if (existente) {

        existente.qty++;

    } else {

        carrito.push({ name, price, image, qty: 1 });

    }


    guardarCarrito();

    renderCarrito();

    bumpBadge();


    Toaster.push({
        title: "Producto agregado",
        message: `${name} — ${formatoPrecio(price)}`,
        type: "success",
        icon: "bi-cart-check"
    });

}


function cambiarCantidad(indice, delta) {

    if (!carrito[indice]) {
        return;
    }


    carrito[indice].qty += delta;


    if (carrito[indice].qty <= 0) {
        carrito.splice(indice, 1);
    }


    guardarCarrito();

    renderCarrito();

}


function eliminarDelCarrito(indice) {

    const item = carrito[indice];


    if (!item) {
        return;
    }


    carrito.splice(indice, 1);

    guardarCarrito();

    renderCarrito();


    Toaster.push({
        title: "Carrito actualizado",
        message: `${item.name} fue eliminado.`,
        type: "info",
        icon: "bi-trash"
    });

}


/* Botones "agregar al carrito" */

document.querySelectorAll(".add-cart").forEach(button => {

    button.addEventListener("click", function () {

        agregarAlCarrito({
            name: this.dataset.product || "Producto",
            price: parseFloat(this.dataset.price) || 0,
            image: this.dataset.image || "img/logo.png"
        });


        /* Animación del botón (solo el icono:
           preserva la onda del ripple) */

        const icono = this.querySelector("i");

        const claseOriginal = icono ? icono.className : "";


        if (icono) {
            icono.className = "bi-check-lg";
        }


        setTimeout(() => {

            if (icono) {
                icono.className = claseOriginal;
            }

        }, 1000);

    });

});


/* Checkout (pendiente en esta etapa del curso) */

if (checkoutBtn) {

    checkoutBtn.addEventListener("click", () => {

        if (carrito.length === 0) {
            return;
        }


        Toaster.push({
            title: "Checkout",
            message:
                "El pago seguro estará disponible en la siguiente etapa del curso.",
            type: "info",
            icon: "bi-lock"
        });

    });

}


/* Vaciar carrito */

if (clearCartBtn) {

    clearCartBtn.addEventListener("click", () => {

        if (carrito.length === 0) {
            return;
        }


        carrito = [];

        guardarCarrito();

        renderCarrito();


        Toaster.push({
            title: "Carrito vaciado",
            message: "Todos los productos fueron eliminados.",
            type: "warning",
            icon: "bi-trash"
        });

    });

}


renderCarrito();


/* =========================================================
   FAVORITOS
   ========================================================= */

const favoriteButtons =
    document.querySelectorAll(".favorite-btn");


favoriteButtons.forEach(button => {

    button.addEventListener("click", function () {

        const icon =
            this.querySelector("i");


        if (!icon) {
            return;
        }


        const isFavorite =
            icon.classList.contains("bi-heart-fill");


        if (isFavorite) {

            icon.classList.remove("bi-heart-fill");

            icon.classList.add("bi-heart");

            this.setAttribute("aria-pressed", "false");

        } else {

            icon.classList.remove("bi-heart");

            icon.classList.add("bi-heart-fill");

            this.setAttribute("aria-pressed", "true");

        }

    });

});


/* =========================================================
   RIPPLE DE MATERIAL DESIGN
   Se delega el evento: funciona con elementos
   estáticos y dinámicos (mega menú, carrito).
   ========================================================= */

const RIPPLE_SELECTORS = [
    ".btn-primary-custom",
    ".btn-outline-custom",
    ".add-cart",
    ".search-button",
    ".category-select-btn",
    ".category-main-button",
    ".theme-toggle",
    ".favorite-btn",
    ".carousel-control-prev",
    ".carousel-control-next",
    ".bs-social-link",
    ".social-links a",
    ".category-card",
    ".category-link",
    ".btn-mega-promo",
    ".qty-btn",
    ".btn-checkout",
    ".btn-clean",
    ".category-option",
    ".mega-category-item"
].join(", ");


function crearRipple(contenedor, x, y) {

    const rect = contenedor.getBoundingClientRect();

    const tamaño =
        Math.max(rect.width, rect.height) * 2.2;


    const onda = document.createElement("span");

    onda.className = "ripple-onda";

    onda.style.width = `${tamaño}px`;

    onda.style.height = `${tamaño}px`;

    onda.style.left = `${x - rect.left - tamaño / 2}px`;

    onda.style.top = `${y - rect.top - tamaño / 2}px`;


    contenedor.appendChild(onda);

    setTimeout(() => onda.remove(), 600);

}


/* Mouse / táctil */

document.addEventListener("pointerdown", event => {

    const objetivo =
        event.target.closest(RIPPLE_SELECTORS);


    if (objetivo) {

        crearRipple(
            objetivo,
            event.clientX,
            event.clientY
        );

    }

});


/* Teclado (Enter / Espacio en botones) */

document.addEventListener("keydown", event => {

    if (
        event.key !== "Enter" &&
        event.key !== " "
    ) {
        return;
    }


    if (!(event.target instanceof HTMLButtonElement)) {
        return;
    }


    const objetivo =
        event.target.closest(RIPPLE_SELECTORS);


    if (!objetivo) {
        return;
    }


    const rect = objetivo.getBoundingClientRect();


    crearRipple(
        objetivo,
        rect.left + rect.width / 2,
        rect.top + rect.height / 2
    );

});


/* =========================================================
   ANIMACIÓN AL HACER SCROLL
   La clase "animate-on-scroll" la agrega JS:
   sin JS el contenido se ve normalmente.
   ========================================================= */

const animatedElements =
    document.querySelectorAll(
        ".category-card, .product-card, .service-card"
    );


if (
    "IntersectionObserver" in window &&
    animatedElements.length > 0
) {

    const observer =
        new IntersectionObserver(
            entries => {

                entries.forEach(entry => {

                    if (entry.isIntersecting) {

                        entry.target.classList.add(
                            "visible"
                        );

                        observer.unobserve(entry.target);

                    }

                });

            },
            {
                threshold: 0.1
            }
        );


    animatedElements.forEach(element => {

        element.classList.add("animate-on-scroll");

        observer.observe(element);

    });

}
