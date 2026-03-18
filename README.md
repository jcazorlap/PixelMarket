# PixelMarket 🎮

PixelMarket es un comparador de precios de videojuegos que agrega ofertas de múltiples tiendas digitales. Utiliza inteligencia artificial para extraer y categorizar datos, ofreciendo una experiencia de búsqueda avanzada con filtros y datos recopilados para recomendar juegos al usuario.

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
php artisan app:import-games # Ejecuta el scraper e importa los datos
# También puedes usar:
# php artisan app:import-games --fresh        # Borra juegos antiguos antes de importar
# php artisan app:import-games --skip-scraper # Importa el JSON actual sin ejecutar el scraper

# Variables para Google Auth y Mailtrap (en .env):
# GOOGLE_CLIENT_ID=...
# GOOGLE_CLIENT_SECRET=...
# GOOGLE_REDIRECT_URI=http://localhost:8000/api/auth/google/callback
# 
# MAIL_MAILER=smtp
# MAIL_HOST=sandbox.smtp.mailtrap.io
# MAIL_PORT=2525
# MAIL_USERNAME=tu_usuario_mailtrap
# MAIL_PASSWORD=tu_password_mailtrap
# MAIL_ENCRYPTION=tls
# MAIL_FROM_ADDRESS=soporte@pixelmarket.com
# 
# FRONTEND_URL=http://localhost:5173

php artisan serve
```

### 📩 Sistema de Soporte
Se ha implementado un portal de contacto premium que:
- Pre-rellena datos si el usuario está autenticado.
- Envía correos electrónicos con diseño "Dark Mode" personalizado.
- Utiliza Mailtrap para el entorno de pruebas.

**Frontend (Web):**
```bash
cd frontend
npm install
npm run dev
```
