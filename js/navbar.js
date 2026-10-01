/* =========================================================
   BOOTSERVICE STORE
   NAVBAR
========================================================= */

document.addEventListener("DOMContentLoaded", () => {

    const searchCategory =
        document.getElementById("searchCategory");

    const categoryLinks =
        document.getElementById("categoryLinks");

    const megaCategories =
        document.getElementById("megaCategories");

    const megaSubcategories =
        document.getElementById("megaSubcategories");

    const categoryMainButton =
        document.getElementById("categoryMainButton");

    const categoryMegaWrapper =
        document.querySelector(".category-mega-wrapper");

    const searchForm =
        document.getElementById("searchForm");

    const searchInput =
        document.getElementById("searchInput");


    let categorias = [];


    /* =====================================================
       CARGAR JSON
    ===================================================== */

    async function cargarCategorias() {
        console.log("🔄 Cargando categorías...");
        try {

            const response =
                await fetch("./data/categorias.json");

            if (!response.ok) {

                throw new Error(
                    "No se pudo cargar categorias.json"
                );

            }

            const data =
                await response.json();

            categorias =
                data.categorias || [];


            cargarSelectCategorias();

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
       SELECT DEL BUSCADOR
    ===================================================== */

    function cargarSelectCategorias() {

        searchCategory.innerHTML = `
            <option value="">
                Todas
            </option>
        `;


        categorias.forEach(categoria => {

            const option =
                document.createElement("option");

            option.value =
                categoria.id;

            option.textContent =
                categoria.nombre;

            searchCategory.appendChild(option);

        });

    }


    /* =====================================================
       MENU INFERIOR
    ===================================================== */

    function cargarMenuCategorias() {

        categoryLinks.innerHTML = "";


        categorias
            .slice(0, 8)
            .forEach(categoria => {

                const link =
                    document.createElement("a");

                link.href =
                    `#categoria-${categoria.id}`;

                link.className =
                    "category-link";

                link.innerHTML = `
                    ${categoria.nombre}
                `;

                categoryLinks.appendChild(link);

            });

    }


    /* =====================================================
       MEGA MENU
    ===================================================== */

    function cargarMegaMenu() {

        megaCategories.innerHTML = "";


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
                <i class="${categoria.icono}"></i>

                <span>
                    ${categoria.nombre}
                </span>
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

                <i class="${categoria.icono}"></i>

                <h4>
                    ${categoria.nombre}
                </h4>

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

                categoryMegaWrapper
                    .classList.remove("active");

                categoryMainButton
                    .setAttribute(
                        "aria-expanded",
                        "false"
                    );

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

            const categoria =
                searchCategory.value;


            console.log({
                busqueda: texto,
                categoria: categoria
            });


            if (!texto && !categoria) {

                searchInput.focus();

                return;

            }


            /*
             * Posteriormente aquí conectaremos
             * el buscador con Laravel/API.
             */

        }
    );


    /* =====================================================
       INICIAR
    ===================================================== */

    cargarCategorias();

});