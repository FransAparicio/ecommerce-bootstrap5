/* =========================================================
   BOOTSERVICE - TOASTER 2.0
   Notificaciones apiladas con barra de progreso,
   pausa al pasar el mouse y tipos (success / info /
   warning / danger).
   ========================================================= */

"use strict";

const Toaster = (function () {

    const TOASTER_ID = "toaster";

    const MAX_TOASTS = 4;

    const DURACION = 3200;

    const TIPOS = {

        success: {
            icono: "bi-check-circle",
            clase: "toast-success"
        },

        info: {
            icono: "bi-info-circle",
            clase: "toast-info"
        },

        warning: {
            icono: "bi-exclamation-triangle",
            clase: "toast-warning"
        },

        danger: {
            icono: "bi-x-circle",
            clase: "toast-danger"
        }

    };


    /* Contenedor global (se crea si no existe) */

    function contenedor() {

        let elemento = document.getElementById(TOASTER_ID);


        if (!elemento) {

            elemento = document.createElement("div");

            elemento.id = TOASTER_ID;

            elemento.className = "toaster";

            elemento.setAttribute("aria-live", "polite");

            elemento.setAttribute("aria-atomic", "false");

            document.body.appendChild(elemento);

        }


        return elemento;

    }


    /*
        push({ title, message, type, icon, duration })
     */

    function push(opciones) {

        const {
            title = "BootService",
            message = "",
            type = "success",
            icon = null,
            duration = DURACION
        } = opciones || {};


        const raiz = contenedor();


        /* Limitar la pila: saca el más antiguo */

        while (raiz.children.length >= MAX_TOASTS) {

            raiz.firstElementChild.remove();

        }


        const tipo = TIPOS[type] || TIPOS.success;


        const toast = document.createElement("div");

        toast.className = `toast-item ${tipo.clase}`;

        toast.setAttribute("role", "status");


        toast.innerHTML = `
            <div class="toast-icon">
                <i class="bi ${icon || tipo.icono}"></i>
            </div>

            <div class="toast-body">
                <div class="toast-title"></div>
                <div class="toast-message"></div>
            </div>

            <button
                type="button"
                class="toast-close"
                aria-label="Cerrar notificación"
            >
                <i class="bi-x"></i>
            </button>

            <div class="toast-progress"></div>
        `;


        /* textContent: evita inyección de HTML */

        toast.querySelector(".toast-title").textContent = title;

        toast.querySelector(".toast-message").textContent = message;


        const progress = toast.querySelector(".toast-progress");

        progress.style.animationDuration = `${duration}ms`;


        raiz.appendChild(toast);


        /* Animación de entrada */

        requestAnimationFrame(() => {

            requestAnimationFrame(() => {

                toast.classList.add("show");

            });

        });


        /* Temporizador con pausa al pasar el mouse */

        let temporizador = setTimeout(cerrar, duration);

        let restante = duration;

        let inicio = Date.now();


        function pausar() {

            clearTimeout(temporizador);

            restante -= Date.now() - inicio;

            progress.style.animationPlayState = "paused";

        }


        function reanudar() {

            inicio = Date.now();

            progress.style.animationPlayState = "running";

            temporizador = setTimeout(cerrar, restante);

        }


        toast.addEventListener("mouseenter", pausar);

        toast.addEventListener("mouseleave", reanudar);

        toast.addEventListener("focusin", pausar);

        toast.addEventListener("focusout", reanudar);


        toast
            .querySelector(".toast-close")
            .addEventListener("click", cerrar);


        function cerrar() {

            clearTimeout(temporizador);

            toast.classList.remove("show");

            toast.classList.add("hide");

            setTimeout(() => toast.remove(), 350);

        }


        return { cerrar };

    }


    return { push };

})();
