# Changelog - PixelMarket

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
