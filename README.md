# PixelMarket - Comparador de Precios de Videojuegos

[![GitHub Repo](https://img.shields.io/badge/GitHub-Repository-blue?logo=github)](https://github.com/jcazorlap/PixelMarket.git)

PixelMarket es una plataforma integral diseñada para rastrear y comparar precios de videojuegos en diversas tiendas digitales (Steam, Epic Games, etc.). El sistema utiliza Inteligencia Artificial (Gemini) para procesar datos de sitios web y ofrece una interfaz moderna para los usuarios.

## Estructura del Proyecto

El proyecto está dividido en tres módulos principales:

- **[`/scraper`](./scraper)**: Script en Python que utiliza Playwright para navegación web y Google Gemini AI para la extracción inteligente de datos.
- **[`/backend`](./backend)**: API y sistema de gestión desarrollado en Laravel 11 con base de datos SQLite.
- **[`/frontend`](./frontend)**: Interfaz de usuario construida con React y Vite.

---

## Configuración y Ejecución

### Ejecución Unificada
Ahora puedes ejecutar todo el proceso (scraping + importación) con un solo comando desde la carpeta del backend:

```bash
cd backend
php artisan app:import-games
```

> [!IMPORTANT]
> Asegúrate de haber instalado las dependencias del scraper y del backend antes de ejecutar el comando. El scraper requiere que `python` esté en el PATH del sistema.

---

## Flujo de Trabajo
1. El comando **Artisan** lanza el script de Python.
2. El **Scraper** genera un archivo `games_data.json`.
3. El **Backend** importa este JSON automáticamente a la base de datos SQLite.
3. El **Frontend** (pendiente de implementación) consumirá la API del backend para mostrar los precios.

---

## Documentación de Cambios
Para ver el historial detallado de cambios y actualizaciones del proyecto, consulta el archivo [**CHANGELOG.md**](./CHANGELOG.md).
