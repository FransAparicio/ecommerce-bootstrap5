# 🛒 BootService Store — Computación y Licencias

Tienda en línea para venta de **hardware de computación** y **licencias de software originales**: computadoras, laptops, componentes, monitores, accesorios, gaming y licencias de Windows, Microsoft Office, Adobe, Autodesk y antivirus.

---

## ✨ Características

* **Diseño premium con identidad tecnológica**: el **verde circuito (esmeralda)** es el color primario de marca, usado con moderación (CTAs, enlaces y estructura) para no sobrecargar la interfaz.
* **Paleta variada multicolor**: además del verde de marca, cada **categoría, servicio, beneficio y producto** recibe su propio acento (cian, azul, índigo, violeta, rosa, ámbar y naranja) mediante variables CSS (`--c-*` + `--accent`), y las **etiquetas de producto** ("Nuevo", "Oferta", "Popular", "Digital") tienen su propio color. El resultado es un catálogo vivo pero coherente.
* **Contraste accesible**: todos los acentos usados como texto cumplen **WCAG AA** (≥ 4.5:1) tanto en tema claro como oscuro.
* **Tipografías premium**: *Space Grotesk* para títulos e *Inter* para texto (con respaldo en fuentes del sistema).
* **Tema claro / oscuro** con interruptor en el topbar (luna / sol), persiste en `localStorage`, respeta la preferencia del sistema y sincroniza el tema nativo de Bootstrap 5.3 (`data-bs-theme`).
* **Logotipo siempre visible y protagonista**: tamaño mayor y suave efecto de *acercamiento* (zoom) al pasar el mouse; sobre fondos oscuros (cabecera en tema oscuro y footer) la marca se muestra sobre una "placa" clara, de modo que los colores verde y rojo del logo nunca se pierden.
* **Hero premium**: carrusel con 3 slides (Setup, Licencias y Servicio técnico) con tarjetas flotantes sobre el producto, textura de circuito sutil, degradados de marca, controles de navegación **siempre visibles y a prueba de clics** y una tira de confianza (garantía, envío, pago y clientes).
* **Buscador destacado con select estilo Select2**: barra más alta y elevada, selector de categorías resaltado, lista con iconos, filtro de búsqueda y atajo de teclado `/`.
* **Navegación clara**: acciones de *Mi cuenta* y *Carrito* como "chips" con realce al pasar el mouse, y una **barra de categorías a todo lo ancho** con iconografía y estados *hover*/activo resaltados.
* **Mega menú** dinámico con categorías, subcategorías y promo de licencias.
* **Carrito drawer** funcional: cantidades, subtotal, eliminación y persistencia en `localStorage`.
* **Toaster 2.0**: notificaciones apiladas con barra de progreso y pausa al pasar el mouse.
* Catálogo de categorías y subcategorías cargado desde JSON.
* Lista de favoritos.
* **Detalles de Material Design** con CSS propio: efecto ripple, elevación en capas, etiqueta flotante en el buscador y motion estándar (`cubic-bezier(.4,0,.2,1)`).
* Animaciones de aparición al hacer scroll (con `prefers-reduced-motion`).
* Diseño 100 % responsivo y accesible (skip link, `aria`, navegación por teclado).
* Iconos con **Bootstrap Icons** (una sola librería).

---

## 🛠️ Tecnologías Utilizadas

* **Estructura:** HTML5 semántico (`header`, `main`, `footer`, `section`, `article`).
* **Estilos:** [Bootstrap 5.3](https://getbootstrap.com) + CSS personalizado.
* **Iconos:** [Bootstrap Icons 1.11](https://icons.getbootstrap.com).
* **Interactividad:** JavaScript vanilla (ES6+): `fetch`, `localStorage`, `IntersectionObserver`, módulo `Toaster` propio.
* **Datos:** JSON (`data/categorias.json`).
* **Persistencia:** `localStorage` del navegador (tema, carrito y favoritos).

> ⚠️ **Nota:** este proyecto es un **front-end estático**. No usa MySQL ni Node.js; la base de datos/backend (Laravel + MySQL) es una etapa posterior del curso.

---

## ⚠️ Importante: ejecutar con un servidor local

El menú de categorías carga `data/categorias.json` con `fetch()`. Por seguridad, los navegadores **bloquean `fetch` al abrir el archivo directamente** (`file://`), por lo que el mega menú quedaría vacío. Usa siempre un servidor local:

* **VS Code:** extensión *Live Server* → clic derecho en `index.html` → *Open with Live Server*.
* **Python:** `python -m http.server 8080` → http://localhost:8080
* **PHP:** `php -S localhost:8080`
* **Node:** `npx serve`

---

## 📦 Instalación y Configuración

1. **Clona el repositorio:**

   ```bash
   git clone https://github.com/FransAparicio/ecommerce-bootstrap5.git
   ```

2. **Ingresa a la carpeta del proyecto:**

   ```bash
   cd ecommerce-bootstrap5
   ```

3. **Inicia un servidor local** (ver la sección anterior) y abre `http://localhost:8080`.

---

## 📁 Estructura del Proyecto

```
ecommerce-bootstrap5/
├── index.html              # Página principal
├── css/
│   └── style.css           # Estilos (temas claro/oscuro)
├── js/
│   ├── toaster.js          # Toaster 2.0 (notificaciones)
│   ├── app.js              # Tema, carrito, favoritos, animaciones
│   └── navbar.js           # Select de categorías, mega menú, buscador
├── data/
│   └── categorias.json     # Categorías y subcategorías
├── img/
│   ├── logo.png
│   ├── logo-horizontal.png
│   ├── hero/               # Carrusel: setup, licencias, servicio
│   └── productos/          # Imágenes SVG de productos y licencias
├── README.md
└── LICENSE
```

---

## 🔮 Próximos pasos (curso)

* Conectar el buscador y el catálogo con una API / Laravel.
* Carrito funcional con cantidades y totales.
* Persistencia en MySQL (usuarios, productos, pedidos).
* Checkout con pagos.

---

## 📄 Licencia

Este proyecto está bajo la [Licencia MIT](LICENSE).
