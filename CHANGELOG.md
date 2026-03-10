# Changelog - PixelMarket

Todos los cambios notables en este proyecto serán documentados en este archivo.

## [1.1.0] - 2026-03-10

### Mejoras
- Unificación del flujo: El comando `php artisan app:import-games` ahora ejecuta automáticamente el scraper de Python antes de procesar los datos.

## [1.0.0] - 2026-03-10

### Inicialización del Proyecto
- Creación de la estructura base: `frontend/`, `backend/`, `scraper/`.
- Configuración de repositorio y documentación inicial (`README.md`, `CHANGELOG.md`).
- Vinculación del proyecto con el repositorio de GitHub: `https://github.com/jcazorlap/PixelMarket.git`.

### Scraper (Python)
- Implementación de `main.py` con **Playwright** para scraping asíncrono.
- Integración con **Google Gemini AI** para extracción de datos estructurados (JSON) a partir de texto plano.
- Creación de `requirements.txt` y gestión de variables de entorno mediante `.env`.
- Definición de entrada de datos a través de `urls.txt`.

### Backend (Laravel)
- Creación de proyecto base con **Laravel 11**.
- Configuración de base de datos **SQLite**.
- Implementación de modelos y migraciones:
    - `Game`: Almacena nombre e imagen de portada.
    - `Store`: Gestión de tiendas (Steam, Epic, etc.).
    - `GamePrice`: Relación pivote con precios e históricos de enlaces.
- Creación del comando de Artisan `app:import-games` para la ingesta automática de datos desde el scraper.

### Frontend (React)
- Inicialización de proyecto base con **Vite** y **React**.
