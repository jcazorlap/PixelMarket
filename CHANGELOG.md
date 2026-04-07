# Changelog - PixelMarket

## 2026-04-07
- **Configuración Dinámica del Scraper**: Integración de un nuevo modal de configuración en el Panel de Administración ("🕷️ Scraper").
    - **Selector de IA Actualizado**: Lista exhaustiva de modelos Gemini oficiales (3.1 Pro, 3 Flash, 2.5 Pro, etc.) con tipografía limpia y sin descripciones redundantes.
    - **Editor de URLs**: Panel de texto para modificar en bloque las páginas objetivo del bot de extracción.
    - **Sincronización Backend-Python**: Los ajustes se guardan permanentemente en `config.json` y `urls.txt` para que el script de Python lea las preferencias del entorno administrativo antes de arrancar.

## 2026-04-06
- **Gestión Avanzada de Categorías (CRUD)**: Transformación del panel de administración en una plataforma multi-recurso mediante un alternador inteligente de doble vista (Juegos/Categorías).
    - **Integración de Etiquetas**: El formulario de juegos ahora cuenta con un selector de múltiples etiquetas (chips) para asociar el catálogo con las categorías.
    - **Contador en Tiempo Real**: Sincronización continua (`withCount('games')`) que muestra cuántos títulos activos están vinculados a cada género directamente en la tabla.
    - **Mejoras Estéticas Acumulativas**: Optimización del encabezado del administrador, reubicando las acciones masivas debajo del panel de control principal para una experiencia espaciada y jerárquica.

## 2026-04-05
- **Panel de Administración Premium**: Implementación de la nueva interfaz altamente segura y refinada en la ruta `/pxm_admin` para gestión interna del catálogo.
    - **Persistencia de Autenticación Definitiva**: Corrección de bloqueos de pantalla en blanco, garantizando la retención segura de la sesión sin pedir contraseñas excesivas en recargas, pero protegiendo al cambiar de sección.
    - **Gestión Intuitiva de Títulos**: Soporte completo para añadir, editar, controlar visibilidad y eliminar con ventanas "glassmorphism" premium e imágenes previsualizadas a mayor resolución.
    - **Acciones y Limpieza**: Botón de "Borrar Todo" masivo.

## 2026-04-04
- **Migración Crítica del Scraper**: Actualización profunda del motor a la nueva SDK unificada `google-genai`.
    - **Resolución de Deprecación**: Eliminación permanente de advertencias vinculadas a la librería obsoleta `google-generativeai`.
    - **Optimización de Procesamiento**: Refactorización del código Python para usar modelos modernos (`Gemini 2.5-flash`) de forma nativa e importaciones eficientes (`php artisan app:import-games`).

## 2026-03-18
- **Rediseño Minimalista del Footer**: Implementación de un nuevo componente de cierre de página con un diseño ultra-limpio y centrado.
- **Identidad de Marca Consistente**: Integración del logo oficial y descripción de PixelMarket con efectos de cristal (glassmorphism) y bordes sutiles.
- **Iconografía Social Actualizada**: Actualización de los enlaces a redes sociales con iconos de **X (Twitter)**, **Instagram** y **GitHub**.
- **UX Simplificada**: Eliminación de navegación secundaria y formularios de newsletter en el footer para priorizar la limpieza visual y el foco en la marca.
- **Animaciones Sutiles**: Implementación de efectos hover y transiciones fluidas en los enlaces sociales y el logo.
- **Minijuego Dino Integrado**: Implementación de un minijuego interactivo (estilo Chrome Dino) que aparece automáticamente cuando el catálogo de juegos está vacío.
- **Persistencia de Récords**:
    - **Sincronización con Base de Datos**: Los récords ahora se guardan en el perfil del usuario autenticado, permitiendo persistencia entre dispositivos.
    - **Local Storage**: Soporte para guardado local en el navegador para usuarios invitados.
- **Recompensa Legendaria**: Los usuarios que alcancen los 9999 puntos desbloquean un icono de **Corona (👑)** exclusivo en la barra de navegación.
- **Experiencia de Juego Refinada**: Sistema de velocidad progresiva, detección de colisiones optimizada y estética "PixelMarket" con efectos de brillo y transparencia.
- **Limpieza Masiva de Infraestructura**:
    - Eliminación de todos los **Factories** (`User`, `Game`, `Store`, `GamePrice`) para un entorno más ligero.
    - Simplificación extrema del `DatabaseSeeder`, dejando solo las cuentas de prueba fundamentales y eliminando datos de ejemplo obsoletos.

## 2026-03-17
- **Portal de Contacto Premium**: Implementación de una página de soporte con un formulario moderno y estéticamente superior.
- **Integración con Mailtrap**: Configuración del sistema de envío de correos electrónicos mediante SMTP, permitiendo recibir consultas de usuarios directamente en el sandbox de Mailtrap.
- **Diseño de Correo "Dark Mode"**: Rediseño del mailable de Laravel con una estética oscura coherente con la web, usando gradientes cian-púrpura y tipografía de marca.
- **UX Optimizada**:
    - **Pre-rellenado Inteligente**: El formulario detecta automáticamente el nombre y email del usuario si tiene la sesión iniciada.
    - **Checkmark Animado**: Sistema de feedback visual tras el envío exitoso con una tarjeta de éxito centrada y animaciones personalizadas.
    - **Reseteo de Formulario**: Añadida la lógica para limpiar campos manuales al pulsar "Volver a escribir" para mayor agilidad.
- **Infraestructura Backend**: Creación del controlador `ContactController`, el mailable `ContactMail` y las rutas API correspondientes.

## 2026-03-16
- **Rediseño Estético de Marcadores**: Actualización del icono de "Deseados", reemplazando el corazón por un marcador (bookmark) más alineado con la temática de colección.
- **Identidad Visual Cyan**: El estado activo de los marcadores y filtros de la lista de deseos ahora utiliza el color cian vibrante (`#1FB6E9`) para una coherencia visual total.
- **Optimización de Estabilidad**: Resolución de conflictos de renderizado y restauración de dependencias críticas de React que aseguraron la carga correcta del catálogo.

## 2026-03-15
- **Integración de Lista de Deseos (Frontend)**: Implementación de la infraestructura frontend para gestionar la lista de deseos en tiempo real.
- **Botón de Guardado Dinámico**: Añadida la funcionalidad de "Añadir a Deseados" en la página de detalles del juego, con estados de carga y sincronización con la sesión del usuario.
- **Filtro de Catálogo "Deseados"**: Nuevo interruptor inteligente al lado del buscador que permite filtrar instantáneamente la biblioteca para ver solo los juegos guardados.

## 2026-03-14
- **Infraestructura de Base de Datos**: Creación de la tabla pivote `wishlists` y establecimiento de las relaciones muchos-a-muchos en los modelos `User` y `Game`.
- **API de Deseos**: Desarrollo de controladores y rutas protegidas con Sanctum para recuperar, añadir y eliminar juegos de la lista de deseos del usuario.
- **Actualización de Entorno**: Upgrade del motor de ejecución Node.js a la versión 24.14 para compatibilidad total con las herramientas de construcción modernas.

## 2026-03-13
- **Inicio de Sesión con Google**: Integración completa con Google OAuth mediante Laravel Socialite y React, permitiendo un acceso rápido y seguro.
- **Corrección de Autenticación**: Resolución del error de "doble-hashing" que impedía el inicio de sesión y registro de usuarios convencionales.
- **Mejoras de Navegación**: Implementación de un sistema de scroll automático al inicio (`ScrollToTop`) en cada cambio de ruta para una navegación más fluida.
- **Redirección Post-Login**: Ahora los usuarios son redirigidos automáticamente a su panel de configuración de perfil tras iniciar sesión o registrarse.
- **Localización al Español**: El scraper ahora extrae descripciones y categorías directamente en español para una mejor experiencia de usuario.
- **Extracción de Imágenes**: Optimización masiva de la captura de imágenes de portada reales desde los CDNs de las tiendas, asegurando que cada juego tenga su imagen correcta.
- **Comandos de Importación**: Se han añadido las opciones `--fresh` y `--skip-scraper` al comando de Artisan para permitir limpiezas de base de datos e importaciones de JSON rápidas.
- **Filtros Dinámicos de Género**: El menú lateral ahora se genera automáticamente basándose solo en los géneros que tienen juegos asociados en la base de datos.
- **Calibración de Precios**: El slider de filtros de precio ahora se ajusta dinámicamente al precio máximo real detectado entre todos los productos.
- **Documentación y Correcciones**: Actualización del README con los nuevos comandos, configuración de Google Auth y resolución de errores de renderizado.

## 2026-03-12
- **Sistema de Autenticación**: Implementación completa de registro, inicio de sesión, sesión persistente con Sanctum y gestión de perfil de usuario.
- **Filtros Avanzados**: Añadido un slider de rango de precios (ahora hasta 150€) y un mega-menú de géneros inspirado en Steam.
- **Estabilización del Scraper**: Corrección de errores de dependencias y actualización al modelo Gemini 2.5-flash para una extracción de datos más robusta.
- **Importación de Datos**: Importación exitosa de 109 videojuegos reales con soporte completo para descripciones y sincronización de géneros/categorías.
- **Páginas de Detalle**: Ahora muestran la descripción completa del juego y etiquetas de género dinámicas.
- **Limpieza de Proyecto**: Eliminación de scripts de prueba y archivos temporales para un entorno de desarrollo limpio.
- Simplificación del diseño de las tarjetas para un aspecto más limpio, eliminando indicadores innecesarios de categoría y precio mínimo.
- Rediseño de la sección principal (hero) con mayor tamaño de fuente y degradados de color más atractivos.
- Optimización de los enlaces de compra; en caso de no encontrar la URL específica, se redirige automáticamente a la página de la tienda oficial.

## 2026-03-11
- Integración del logo oficial y ajuste de la paleta de colores de toda la web para que coincida con la imagen de marca.
- Implementación de enlaces directos en los precios; ahora al pulsar sobre el precio de una tienda se abre su web de compra.
- Aplicación de mejoras estéticas como efectos de cristal (glassmorphism) y luces neón para un estilo más gaming.

## 2026-03-10
- Creación de la estructura base del proyecto, incluyendo el portal web, el servidor de datos y el scraper.
- Generación de datos de prueba con 10 juegos para facilitar el desarrollo visual de la interfaz.
- Configuración inicial de la inteligencia artificial para la extracción de información desde las tiendas digitales.
