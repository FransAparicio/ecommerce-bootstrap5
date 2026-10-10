/* =========================================================
   BOOTSERVICE STORE
   NAVBAR.JS
   Select de categorías (estilo Select2), mega menú
   y buscador.
   ========================================================= */

document.addEventListener("DOMContentLoaded", () => {

    "use strict";

    /* Select de categorías */

    const categoryList =
        document.getElementById("categoryList");

    const categoryFilterInput =
        document.getElementById("categoryFilterInput");

    const categorySelectBtn =
        document.getElementById("categorySelectBtn");

    const categorySelectIcon =
        document.getElementById("categorySelectIcon");

    const categorySelectLabel =
        document.getElementById("categorySelectLabel");

    /* Campo oculto que guarda la categoría elegida */

    const searchCategory =
        document.getElementById("searchCategory");

    /* Mega menú */

    const megaCategories =
        document.getElementById("megaCategories");

    const megaSubcategories =
        document.getElementById("megaSubcategories");

    const categoryMainButton =
        document.getElementById("categoryMainButton");

    const categoryMegaWrapper =
        document.querySelector(".category-mega-wrapper");

    /* Buscador */

    const searchForm =
        document.getElementById("searchForm");

    const searchInput =
        document.getElementById("searchInput");

    /* Categorías destacadas */

    const categoryLinks =
        document.getElementById("categoryLinks");


    /*
        Inicializa el dropdown con autoClose "outside":
        así el filtro no cierra el menú al escribir.
        (data-bs-auto-close del HTML refuerza esto)
    */

    let categoryDropdown = null;

    if (categorySelectBtn && window.bootstrap) {

        categoryDropdown =
            new bootstrap.Dropdown(
                categorySelectBtn,
                {
                    autoClose: "outside"
                }
            );

    }


    let categorias = [];


    /* =====================================================
       CERRAR MEGA MENÚ
       ===================================================== */

    function cerrarMegaMenu() {

        categoryMegaWrapper.classList.remove("active");

        categoryMainButton.setAttribute(
            "aria-expanded",
            "false"
        );

    }


    /* =====================================================
       CARGAR JSON
       Nota: fetch() requiere un servidor local; no funciona
       abriendo el archivo directamente (file://).
       ===================================================== */

    async function cargarCategorias() {

        try {

            const response =
                await fetch("./data/categorias.json");


            if (!response.ok) {

                throw new Error(
                    `HTTP ${response.status}`
                );

            }


            const data =
                await response.json();

            categorias =
                data.categorias || [];


            cargarCategoryDropdown();

            cargarMenuCategorias();

            cargarMegaMenu();


        } catch (error) {

            console.error(
                "Error cargando categorías:",
                error
            );

        }

    }


    /* =====================================================
       SELECT DE CATEGORÍAS (estilo Select2)
       ===================================================== */

    function cargarCategoryDropdown() {

        categoryList.innerHTML = "";


        /* Opción "Todas" */

        const todas = document.createElement("button");

        todas.type = "button";

        todas.className = "category-option active";

        todas.dataset.id = "";

        todas.dataset.nombre = "todas las categorías";

        todas.innerHTML = `
            <span class="category-option-icon">
                <i class="bi-grid-1x2"></i>
            </span>

            <span class="category-option-label">
                Todas las categorías
            </span>

            <i class="bi-chevron-right category-option-arrow"></i>
        `;

        todas.addEventListener("click", () => {

            seleccionarCategoria(
                "",
                "Todas las categorías",
                "bi-grid-1x2",
                todas
            );

        });

        categoryList.appendChild(todas);


        /* Categorías del JSON */

        categorias.forEach(categoria => {

            const opcion = document.createElement("button");

            opcion.type = "button";

            opcion.className = "category-option";

            opcion.dataset.id = String(categoria.id);

            opcion.dataset.nombre =
                categoria.nombre.toLowerCase();

            opcion.innerHTML = `
                <span class="category-option-icon">
                    <i class="${categoria.icono}"></i>
                </span>

                <span class="category-option-label">
                    ${categoria.nombre}
                </span>

                <i class="bi-chevron-right category-option-arrow"></i>
            `;

            opcion.addEventListener("click", () => {

                seleccionarCategoria(
                    String(categoria.id),
                    categoria.nombre,
                    categoria.icono,
                    opcion
                );

            });

            categoryList.appendChild(opcion);

        });

    }


    function seleccionarCategoria(id, nombre, icono, opcionElemento) {

        searchCategory.value = id;

        categorySelectLabel.textContent = nombre;

        categorySelectIcon.className = icono;


        categoryList
            .querySelectorAll(".category-option")
            .forEach(opcion =>
                opcion.classList.remove("active")
            );


        if (opcionElemento) {
            opcionElemento.classList.add("active");
        }


        /* Cerrar el desplegable */

        if (categoryDropdown) {

            categoryDropdown.hide();

        } else if (window.bootstrap) {

            bootstrap.Dropdown
                .getOrCreateInstance(categorySelectBtn)
                .hide();

        }

    }


    /* Filtro dentro del select (tipo Select2) */

    if (categoryFilterInput) {

        categoryFilterInput.addEventListener(
            "input",
            function () {

                const texto =
                    this.value.trim().toLowerCase();


                categoryList
                    .querySelectorAll(".category-option")
                    .forEach(opcion => {

                        const nombre =
                            (opcion.dataset.nombre || "")
                                .toLowerCase();

                        opcion.style.display =
                            nombre.includes(texto)
                                ? ""
                                : "none";

                    });


                /* Estado "sin resultados" */

                const hayVisibles = Array.from(
                    categoryList.querySelectorAll(
                        ".category-option"
                    )
                ).some(
                    opcion => opcion.style.display !== "none"
                );


                let vacio = categoryList.querySelector(
                    ".category-dropdown-empty"
                );


                if (!hayVisibles && !vacio) {

                    vacio = document.createElement("div");

                    vacio.className =
                        "category-dropdown-empty";

                    vacio.textContent = "Sin resultados";

                    categoryList.appendChild(vacio);

                } else if (hayVisibles && vacio) {

                    vacio.remove();

                }

            }
        );

    }


    /* Limpiar el filtro y enfocar al abrir */

    if (categorySelectBtn) {

        categorySelectBtn.addEventListener(
            "shown.bs.dropdown",
            () => {

                if (!categoryFilterInput) {
                    return;
                }

                categoryFilterInput.value = "";

                categoryFilterInput.dispatchEvent(
                    new Event("input")
                );

                setTimeout(() => {

                    categoryFilterInput.focus();

                }, 100);

            }
        );

    }


    /* =====================================================
       MENÚ INFERIOR (categorías destacadas)
       ===================================================== */

    function cargarMenuCategorias() {

        categoryLinks.innerHTML = "";


        categorias
            .slice(0, 10)
            .forEach(categoria => {

                const link =
                    document.createElement("a");

                link.href =
                    `#categoria-${categoria.id}`;

                link.className =
                    "category-link";

                link.textContent =
                    categoria.nombre;

                categoryLinks.appendChild(link);

            });

    }


    /* =====================================================
       MEGA MENÚ
       ===================================================== */

    function cargarMegaMenu() {

        megaCategories.innerHTML =
            '<span class="mega-categories-title">Categorías</span>';


        categorias.forEach((categoria, index) => {

            const button =
                document.createElement("button");

            button.type =
                "button";

            button.className =
                "mega-category-item";


            if (index === 0) {

                button.classList.add("active");

            }


            button.innerHTML = `
                <span class="mc-icon">
                    <i class="${categoria.icono}"></i>
                </span>

                <span>
                    ${categoria.nombre}
                </span>

                <i class="bi-chevron-right mc-arrow"></i>
            `;


            button.addEventListener(
                "mouseenter",
                () => {

                    mostrarSubcategorias(categoria);

                    document
                        .querySelectorAll(".mega-category-item")
                        .forEach(item =>
                            item.classList.remove("active")
                        );

                    button.classList.add("active");

                }
            );


            button.addEventListener(
                "click",
                () => {

                    mostrarSubcategorias(categoria);

                }
            );


            megaCategories.appendChild(button);

        });


        if (categorias.length > 0) {

            mostrarSubcategorias(
                categorias[0]
            );

        }

    }


    /* =====================================================
       SUBCATEGORÍAS
       ===================================================== */

    function mostrarSubcategorias(categoria) {

        const subcategorias =
            categoria.subcategorias || [];


        megaSubcategories.innerHTML = `

            <div class="mega-sub-header">

                <span class="ms-icon">
                    <i class="${categoria.icono}"></i>
                </span>

                <h4>
                    ${categoria.nombre}
                </h4>

                <a href="#" class="ms-view">
                    Ver todo
                    <i class="bi-arrow-right"></i>
                </a>

            </div>


            <div class="subcategory-grid">

                ${subcategorias.map(sub => `

                    <a
                        href="#"
                        class="subcategory-link"
                    >
                        ${sub}
                    </a>

                `).join("")}

            </div>

        `;

    }


    /* =====================================================
       ABRIR / CERRAR MEGA MENU
       ===================================================== */

    categoryMainButton.addEventListener(
        "click",
        event => {

            event.stopPropagation();

            const abierto =
                categoryMegaWrapper.classList.toggle(
                    "active"
                );

            categoryMainButton
                .setAttribute(
                    "aria-expanded",
                    abierto
                );

        }
    );


    /* =====================================================
       CERRAR AL HACER CLICK FUERA
       ===================================================== */

    document.addEventListener(
        "click",
        event => {

            if (
                !categoryMegaWrapper.contains(
                    event.target
                )
            ) {

                cerrarMegaMenu();

            }

        }
    );


    /* =====================================================
       CERRAR CON LA TECLA ESC
       ===================================================== */

    document.addEventListener(
        "keydown",
        event => {

            if (
                event.key === "Escape" &&
                categoryMegaWrapper.classList.contains(
                    "active"
                )
            ) {

                cerrarMegaMenu();

                categoryMainButton.focus();

            }

        }
    );


    /* =====================================================
       BUSCADOR
       ===================================================== */

    searchForm.addEventListener(
        "submit",
        event => {

            event.preventDefault();


            const texto =
                searchInput.value.trim();

            const categoriaId =
                searchCategory.value;

            const categoria =
                categorias.find(
                    c => String(c.id) === String(categoriaId)
                );


            if (!texto && !categoriaId) {

                searchInput.focus();

                Toaster.push({
                    title: "Búsqueda vacía",
                    message: "Escribe algo para buscar.",
                    type: "warning",
                    icon: "bi-search"
                });

                return;

            }


            const nombreCategoria = categoria
                ? categoria.nombre
                : "todas las categorías";


            Toaster.push({
                title: "Buscador",
                message: texto
                    ? `Buscando "${texto}" en ${nombreCategoria}.`
                    : `Mostrando ${nombreCategoria}.`,
                type: "info",
                icon: "bi-search"
            });


            /*
             * Posteriormente aquí conectaremos
             * el buscador con Laravel/API.
             */

        }
    );


    /* Atajo de teclado: "/" enfoca el buscador */

    document.addEventListener(
        "keydown",
        event => {

            const escribiendo =
                /^(INPUT|TEXTAREA|SELECT)$/.test(
                    document.activeElement.tagName
                );


            if (event.key === "/" && !escribiendo) {

                event.preventDefault();

                searchInput.focus();

            }

        }
    );


    /* =====================================================
       INICIAR
       ===================================================== */

    cargarCategorias();

});
