# PíxelMarket 🎮

PíxelMarket es un comparador de precios de videojuegos que agrega ofertas de múltiples tiendas digitales. Utiliza inteligencia artificial para extraer y categorizar datos, ofreciendo una experiencia de búsqueda avanzada con filtros y datos recopilados para recomendar juegos al usuario.

## 🚀 Funcionamiento

1.  **Scraping Inteligente**: Un script de Python recorre las tiendas digitales y utiliza la IA de Google Gemini para extraer nombres, precios, categorías y descripciones detalladas.
2.  **Sincronización**: Los datos extraídos se importan al backend de Laravel mediante un comando Artisan.
3.  **Exploración**: Los usuarios pueden navegar por el catálogo, utilizar el mega-menú de géneros, filtrar por rango de precio y gestionar su cuenta personal.

---

## 🛠️ Configuración para su uso

### Variables de Entorno
Crea `scraper/.env`:
```env
GEMINI_API_KEY=tu_clave_aquí
```

### Instalación y Ejecución

**Scraper:**
```bash
cd scraper
python -m venv venv
# Activa el venv según tu OS (L: source venv/bin/activate | W: .\venv\Scripts\activate)
pip install -r requirements.txt
python -m playwright install chromium
```

**Backend (API):**
```bash
cd backend
composer install
cp .env.example .env
php artisan key:generate
php artisan migrate
php artisan app:import-games # Importar datos iniciales
php artisan serve
```

**Frontend (Web):**
```bash
cd frontend
npm install
npm run dev
```
