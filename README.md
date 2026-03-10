# PixelMarket - Comparador de Precios de Videojuegos

[![GitHub Repo](https://img.shields.io/badge/GitHub-Repository-blue?logo=github)](https://github.com/jcazorlap/PixelMarket.git)

## Configuración y ejecución

### 1. Variables de Entorno
Crea un archivo `.env` en la carpeta `scraper/` basado en `.env.example` y añade tu clave:
```env
GEMINI_API_KEY=tu_clave_aquí
```

### 2. Instalación de Dependencias

**Scraper (Python):**
```bash
cd scraper
python -m venv venv
# Windows: .\venv\Scripts\activate | Linux: source venv/bin/activate
pip install -r requirements.txt
playwright install chromium
```

**Backend (Laravel):**
```bash
cd backend
composer install
php artisan migrate
```

**Frontend (React):**
```bash
cd frontend
npm install
```

### 3. Uso del Proyecto

**Ejecutar el scraper:**
```bash
cd backend
php artisan app:import-games
```

**Servidor de desarrollo:**
```bash
# Backend
php artisan serve
# Frontend
npm run dev
```
