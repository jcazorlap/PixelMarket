# PixelMarket - Comparador de Precios de Videojuegos

PixelMarket es una plataforma integral diseñada para rastrear y comparar precios de videojuegos en diversas tiendas digitales (Steam, Epic Games, etc.). El sistema utiliza Inteligencia Artificial (Gemini) para procesar datos de sitios web y ofrece una interfaz moderna para los usuarios.

## Estructura del Proyecto

El proyecto está dividido en tres módulos principales:

- **[`/scraper`](./scraper)**: Script en Python que utiliza Playwright para navegación web y Google Gemini AI para la extracción inteligente de datos.
- **[`/backend`](./backend)**: API y sistema de gestión desarrollado en Laravel 11 con base de datos SQLite.
- **[`/frontend`](./frontend)**: Interfaz de usuario construida con React y Vite.

---

## Requisitos Previos

- **Python 3.10+**
- **PHP 8.2+** y **Composer**
- **Node.js** y **npm**
- **Clave de API de Google Gemini**

---

## Configuración y Ejecución

### 1. Scraper (Extracción de Datos)
El scraper lee URLs de `urls.txt`, navega a ellas y extrae información estructurada.

```bash
cd scraper
python -m venv venv
source venv/bin/activate  # En Windows: .\venv\Scripts\activate
pip install -r requirements.txt
playwright install chromium
# Crea un archivo .env basado en .env.example y añade tu GEMINI_API_KEY
python main.py
```

### 2. Backend (Servidor y Base de Datos)
El backend procesa los datos scrapeados y los sirve a través de una API.

```bash
cd backend
composer install
php artisan migrate
# Importa los datos generados por el scraper
php artisan app:import-games
php artisan serve
```

### 3. Frontend (Interfaz de Usuario)
```bash
cd frontend
npm install
npm run dev
```

---

## Flujo de Trabajo
1. El **Scraper** genera un archivo `games_data.json` con la información de los juegos.
2. El **Backend** importa este JSON mediante un comando de Artisan y lo guarda en la base de datos SQLite.
3. El **Frontend** (pendiente de implementación) consumirá la API del backend para mostrar los precios.

---

## Documentación de Cambios
Para ver el historial detallado de cambios y actualizaciones del proyecto, consulta el archivo [**CHANGELOG.md**](./CHANGELOG.md).
