# Changelog — PixelMarket 🎮

Este documento es mi diario de desarrollo. Aquí voy anotando todo lo que he ido construyendo, día a día, para tener un registro claro de cómo ha ido evolucionando el proyecto.

---

## 7 de abril de 2026 — Le puse panel de control al scraper

Hasta este momento, para cambiar cualquier cosa del scraper tenía que abrir los archivos directamente y editarlos a mano, lo cual era bastante incómodo. Decidí crear un modal de configuración dentro del panel de administración, al que accedo con el botón 🕷️ Scraper. Con esto conseguí poder:

- **Elegir el modelo de Gemini** que quiero que use la IA para analizar las páginas. Puse opciones desde Gemini 1.5 Flash hasta el 3.1 Pro, para poder ajustar velocidad versus calidad según lo que necesite en cada momento.
- **Editar las URLs objetivo** directamente desde el navegador, sin tener que tocar ningún archivo de configuración.
- Los cambios se guardan automáticamente en `config.json` y `urls.txt`, de forma que el script de Python los lee la próxima vez que arranca sin que tenga que hacer nada más.

---

## 6 de abril de 2026 — Añadí gestión de categorías al panel admin

Me di cuenta de que el panel de administración solo gestionaba juegos, y necesitaba también poder manejar los géneros. Así que lo expandí para que se pueda alternar entre la vista de **Juegos** y la de **Categorías** con un solo botón.

Desde la vista de categorías puedo crear, editar y eliminar géneros. Además, en el formulario de juegos añadí un selector visual en formato de chips/etiquetas para asociar cada título con sus categorías de una forma mucho más cómoda e intuitiva. También hice que la tabla muestre en tiempo real cuántos juegos tiene vinculados cada género, algo que me parece muy útil para tener visibilidad del catálogo.

---

## 5 de abril de 2026 — Arreglé la sesión del admin y mejoré los modales

Estuve puliendo el panel admin en dos frentes principales:

**Primero arreglé la sesión rota.** Había un bug muy molesto: al recargar la página dentro del panel me pedía la contraseña de nuevo, incluso si acababa de entrar hace un momento. Lo corregí para que la sesión persista mientras esté en la ruta `/pxm_admin`, pero se limpie automáticamente si navego a cualquier otra parte. Es exactamente el comportamiento que quería.

**Después mejoré la gestión de juegos.** Las ventanas modales para añadir y editar juegos las rediseñé con glassmorphism, añadí previsualización de imágenes a buena resolución y soporte completo para visibilidad, de modo que puedo ocultar juegos del catálogo público sin tener que borrarlos. También añadí el botón de "Borrar Todo" para cuando necesito limpiar la base de datos entera de golpe.

---

## 4 de abril de 2026 — Migré el scraper a la nueva SDK de Google

El scraper llevaba un tiempo lanzando warnings en la consola porque usaba `google-generativeai`, una librería que ya estaba deprecada. Decidí no ignorarlo más y lo migré por completo a la nueva SDK unificada `google-genai`, que es la forma correcta de hacerlo ahora mismo.

Aproveché para refactorizar el código Python y adaptarlo mejor al modelo Gemini 2.5-flash, limpiando también las importaciones antiguas. El comando `php artisan app:import-games` sigue funcionando exactamente igual desde fuera, pero ahora sin los warnings molestos.

---

## 18 de marzo de 2026 — Footer nuevo, minijuego y limpieza de base de datos

Fue un día muy productivo en el que trabajé en tres bloques completamente distintos:

**Rediseñé el footer.** Lo dejé ultra-limpio y centrado: solo el logo de PixelMarket, los iconos de redes sociales (X, Instagram y GitHub) con animaciones hover suaves, y nada más. Quité el formulario de newsletter y la navegación secundaria para que quedara simple y elegante.

**Implementé el minijuego Dino.** Cuando el catálogo está vacío, en lugar de mostrar un aburrido mensaje de "no hay juegos", ahora aparece un minijuego al estilo del Dino de Chrome. Lo configuré para que se pueda saltar con la barra espaciadora y la velocidad vaya aumentando progresivamente. Lo que más me gustó fue el sistema de récords: si el usuario tiene sesión iniciada, su mejor puntuación se sincroniza con la base de datos y puede verla desde cualquier dispositivo. Si no ha iniciado sesión, se guarda localmente con `localStorage`. Y si se llega a 9999 puntos, se desbloquea una corona 👑 en la barra de navegación.

**Limpié la infraestructura.** Eliminé todos los Factories de la base de datos (User, Game, Store, GamePrice) que ya no usaba, y simplifiqué el `DatabaseSeeder` para dejarlo solo con lo esencial para crear las cuentas de prueba.

---

## 17 de marzo de 2026 — Creé la página de contacto con envío de correos real

Añadí una página de contacto completa en `/contacto`. El formulario tiene un diseño moderno y, lo más importante, **funciona de verdad**: los mensajes llegan al buzón a través de Mailtrap via SMTP.

Cuidé varios detalles que me parecían importantes:

- Si el usuario ya tiene sesión iniciada, el formulario rellena solo su nombre y email automáticamente.
- Cuando se envía el mensaje con éxito, aparece una tarjeta de confirmación con un checkmark animado, que visualmente queda muy satisfactoria.
- El correo que recibe el administrador lo diseñé en modo oscuro, coherente con la web, con gradientes cian-púrpura y tipografía de marca.

Por detrás, creé el controlador `ContactController`, el mailable `ContactMail` y las rutas necesarias en la API.

---

## 16 de marzo de 2026 — Ajustes de diseño y corrección de bugs de renderizado

Trabajé en tres ajustes que parecen pequeños pero marcan bastante la diferencia visual:

- Cambié el icono de "Deseados" de corazón a marcador/bookmark. Encaja mucho mejor con la temática de colección y biblioteca personal.
- Unifiqué el uso del color cian vibrante (`#1FB6E9`) en todos los estados activos: el marcador guardado, el filtro de wishlist activado, etc. Ahora hay consistencia visual.
- Resolví unos conflictos de renderizado raros que en ciertos casos impedían que el catálogo cargara correctamente.

---

## 15 de marzo de 2026 — Conecté la lista de deseos con el frontend

Después de preparar toda la base en el backend, hoy conecté todo con la interfaz de usuario:

- En la página de detalle de cada juego añadí el botón de marcador para guardar o quitar el título de la lista. Le puse estado de carga para que la interacción no se sienta como que no pasa nada.
- En el catálogo principal, al lado del buscador, implementé un interruptor que filtra la biblioteca para mostrar solo los juegos guardados del usuario.
- Todo se sincroniza en tiempo real con la sesión activa del usuario.

---

## 14 de marzo de 2026 — Construí los cimientos de la lista de deseos

Antes de que el usuario pudiera guardar juegos, necesitaba que la base de datos lo soportara. Creé la tabla pivote `wishlists` y establecí las relaciones muchos-a-muchos entre `User` y `Game`. En el backend añadí el controlador y las rutas protegidas con Sanctum para recuperar, añadir y eliminar entradas de la lista.

Aproveché también para actualizar Node.js a la versión 24.14 para tener compatibilidad total con las herramientas de build actuales.

---

## 13 de marzo de 2026 — Integré el login con Google y resolví varias cosas

**Implementé el login con Google.** Integré Google OAuth usando Laravel Socialite. Ahora se puede entrar con la cuenta de Google con un solo clic, sin necesidad de crear contraseña. Hice que funcione tanto para cuentas nuevas como para cuentas ya existentes.

**Arreglé un bug serio de autenticación.** Descubrí que había un problema de "doble hashing": las contraseñas se encriptaban dos veces al guardarse, por lo que luego no coincidían al verificar el login. Lo resolví y lo dejé correctamente.

**Añadí scroll automático al cambiar de ruta.** Implementé el componente `ScrollToTop` para que al navegar entre páginas siempre se empiece desde el principio, que es como debe comportarse cualquier web.

**El scraper ahora genera los textos en español.** Las descripciones y categorías que extrae la IA ya llegan directamente en español, sin necesidad de ninguna traducción posterior.

**Mejoré el comando de importación.** Añadí dos opciones nuevas al comando de Artisan: `--fresh` para limpiar la base de datos antes de importar, y `--skip-scraper` para importar directamente desde el JSON sin volver a scrapear. Son dos opciones que me ahorran mucho tiempo cuando quiero iterar rápido.

**El sidebar de géneros se volvió dinámico.** Ahora solo muestra los géneros que tienen al menos un juego asociado en la base de datos, en lugar de una lista fija que podría estar desactualizada.

**El slider de precio se calibra solo.** Hice que el límite superior del filtro de precio se ajuste automáticamente al precio más alto real entre todos los productos importados.

---

## 12 de marzo de 2026 — Completé el sistema de autenticación e importé 109 juegos

Implementé el sistema de autenticación completo: registro, inicio de sesión, sesión persistente con Sanctum y una página de perfil donde el usuario puede actualizar su nombre, email y contraseña.

También importé 109 videojuegos reales con descripciones, géneros e imágenes de portada. El scraper funcionó bien con Gemini 2.5-flash y los datos quedaron limpios.

En el frontend, añadí un slider de precio con rango hasta 150€ y un menú lateral de géneros inspirado en Steam, con agrupaciones por tipo (Acción, RPG, Estrategia...). Las páginas de detalle las actualicé para que muestren la descripción completa del juego y las etiquetas de género.

Simplifiqué las tarjetas del catálogo para que se vean más limpias, eliminando información redundante. También rediseñé el hero de la página principal con fuentes más grandes y degradados más llamativos.

---

## 11 de marzo de 2026 — El proyecto empezó a tener identidad propia

Integré el logo oficial y ajusté toda la paleta de colores para que coincida con la identidad de marca de PixelMarket. Añadí los enlaces directos en los precios: al pulsar sobre el precio de una tienda, se va directamente a esa página de compra. Y empecé a aplicar los efectos de glassmorphism y luces neón que le dan ese toque gaming característico al proyecto.

---

## 10 de marzo de 2026 — El primer día

Creé la estructura base del proyecto: el frontend en React, el backend en Laravel y el scraper en Python. Para poder trabajar con algo desde el primer día, generé 10 juegos de prueba y configuré la IA para que pudiera extraer información de las tiendas digitales.

---
