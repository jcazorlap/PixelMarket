# Changelog - PixelMarket

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
