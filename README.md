# PixelMarket 🎮

PixelMarket es un comparador de precios de videojuegos que agrega ofertas de múltiples tiendas digitales. Utiliza inteligencia artificial para extraer y categorizar datos, ofreciendo una experiencia de búsqueda avanzada con filtros y datos recopilados para recomendar juegos al usuario.

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

**Frontend (Web):**
```bash
cd frontend
npm install
npm run dev
```

---

## 🔒 Panel de Administración

El proyecto incluye un panel de control para la gestión de datos:
- **Ruta**: `/pxm_admin`
- **Contraseña**: `adminPixelMarket123`
- **Funcionalidades**: Crear nuevos juegos, editar descripciones/imágenes, ocultar juegos del catálogo público y borrado masivo.
