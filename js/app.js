/* =========================================================
   BOOTSERVICE - APP.JS
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
   CARRITO
========================================================= */

let cartCount = 0;


/*
    Recuperar carrito guardado
*/

const savedCart = localStorage.getItem("bootservice_cart_count");

if (savedCart) {

    cartCount = parseInt(savedCart);

}


updateCartCounter();


/*
    Botones agregar al carrito
*/

const addCartButtons = document.querySelectorAll(".add-cart");


addCartButtons.forEach(button => {

    button.addEventListener("click", function () {

        const productName =
            this.dataset.product || "Producto";


        cartCount++;

        localStorage.setItem(
            "bootservice_cart_count",
            cartCount
        );


        updateCartCounter();


        showCartToast(productName);


        /*
            Animación del botón
        */

        this.innerHTML =
            '<i class="bi bi-check-lg"></i>';


        setTimeout(() => {

            this.innerHTML =
                '<i class="bi bi-cart-plus"></i>';

        }, 1000);

    });

});


/* =========================================================
   ACTUALIZAR CONTADOR
========================================================= */

function updateCartCounter() {

    const cartCounters =
        document.querySelectorAll(".cart-count");


    cartCounters.forEach(counter => {

        counter.textContent = cartCount;

    });

}


/* =========================================================
   TOAST
========================================================= */

function showCartToast(productName) {

    const toastElement =
        document.getElementById("cartToast");


    if (!toastElement) {
        return;
    }


    const toastBody =
        toastElement.querySelector(".toast-body");


    if (toastBody) {

        toastBody.innerHTML = `
            <strong>${productName}</strong>
            fue agregado al carrito.
        `;

    }


    const toast =
        bootstrap.Toast.getOrCreateInstance(
            toastElement,
            {
                delay: 2500
            }
        );


    toast.show();

}


/* =========================================================
   FAVORITOS
========================================================= */

const favoriteButtons =
    document.querySelectorAll(".favorite-btn");


favoriteButtons.forEach(button => {

    button.addEventListener("click", function (event) {

        event.preventDefault();


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

        } else {

            icon.classList.remove("bi-heart");

            icon.classList.add("bi-heart-fill");

        }

    });

});


/* =========================================================
   BUSCADOR
========================================================= */

const searchForm =
    document.querySelector(".search-wrapper");


if (searchForm) {

    searchForm.addEventListener("submit", function (event) {

        event.preventDefault();


        const input =
            this.querySelector("input");


        if (!input) {
            return;
        }


        const searchValue =
            input.value.trim();


        if (searchValue === "") {

            input.focus();

            return;

        }


        console.log(
            "Buscando producto:",
            searchValue
        );


        /*
            Por ahora mostramos el término.
            Posteriormente conectaremos esto
            con el catálogo/productos.
        */

        alert(
            `Buscar: ${searchValue}`
        );

    });

}


/* =========================================================
   ANIMACIÓN SUAVE
========================================================= */

const observer =
    new IntersectionObserver(
        entries => {

            entries.forEach(entry => {

                if (entry.isIntersecting) {

                    entry.target.classList.add(
                        "visible"
                    );

                }

            });

        },
        {
            threshold: 0.1
        }
    );


document
    .querySelectorAll(".category-card, .product-card, .service-card")
    .forEach(element => {

        observer.observe(element);

    });


/* =========================================================
   CONSOLA
========================================================= */

console.log(
    "BootService Ecommerce iniciado correctamente."
);