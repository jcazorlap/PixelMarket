# Guía de Instalación Local - PixelMarket 🎮

Esta guía detalla los pasos necesarios para configurar y ejecutar **PixelMarket** en tu entorno local. El proyecto se divide en tres partes: **Backend (Laravel)**, **Frontend (React)** y **Scraper (Python)**.

---

## 📋 Requisitos Previos

Asegúrate de tener instalado lo siguiente:
- **PHP 8.2 o superior**
- **Composer** (Gestor de dependencias PHP)
- **Node.js (v20+)** y **NPM**
- **MySQL** o **SQLite** (Base de datos)
- **Python 3.10+** y **pip**
- **Git**

---

## 🚀 Pasos para la Instalación

### 1. Clonar el Repositorio
```bash
git clone https://github.com/tu-usuario/PixelMarket.git
cd PixelMarket
```

### 2. Configuración del Backend (Laravel)
El backend gestiona la API y la base de datos.

1. Entra en la carpeta del backend:
   ```bash
   cd backend
   ```
2. Instala las dependencias:
   ```bash
   composer install
   ```
3. Configura el archivo de entorno:
   ```bash
   cp .env.example .env
   ```
4. Genera la clave de la aplicación:
   ```bash
   php artisan key:generate
   ```
5. Configura tu base de datos en el archivo `.env`:
   - Para **SQLite** (más fácil):
     ```env
     DB_CONNECTION=sqlite
     # Comenta las demás líneas de DB_HOST, DB_PORT, etc.
     ```
     *Nota: Laravel creará automáticamente el archivo `database.sqlite` si no existe.*
   - Para **MySQL**:
     ```env
     DB_CONNECTION=mysql
     DB_HOST=127.0.0.1
     DB_PORT=3306
     DB_DATABASE=pixelmarket_db
     DB_USERNAME=tu_usuario
     DB_PASSWORD=tu_contraseña
     ```
6. Ejecuta las migraciones (y seeders si los hay):
   ```bash
   php artisan migrate
   ```
7. Inicia el servidor de desarrollo:
   ```bash
   php artisan serve
   ```
   *El backend estará disponible en `http://localhost:8000`.*

### 3. Configuración del Frontend (React + Vite)
El frontend es la interfaz de usuario.

1. Entra en la carpeta del frontend:
   ```bash
   cd ../frontend
   ```
2. Instala las dependencias:
   ```bash
   npm install
   ```
3. Inicia el servidor de Vite:
   ```bash
   npm run dev
   ```
   *El frontend estará disponible en `http://localhost:5173`.*

### 4. Configuración del Scraper (Python)
El scraper se encarga de recolectar los precios de las tiendas.

1. Entra en la carpeta del scraper:
   ```bash
   cd ../scraper
   ```
2. Crea un entorno virtual:
   ```bash
   python -m venv venv
   ```
3. Activa el entorno virtual:
   - **Windows:** `venv\Scripts\activate`
   - **macOS/Linux:** `source venv/bin/activate`
4. Instala las dependencias:
   ```bash
   pip install -r requirements.txt
   ```
5. Instala los navegadores de Playwright:
   ```bash
   playwright install
   ```
6. Configura tu API Key de Gemini en un archivo `.env` dentro de la carpeta `scraper/`:
   ```env
   GEMINI_API_KEY=tu_clave_de_api_aqui
   ```

---

## 🛠️ Configuraciones Adicionales

### Google Login (Opcional)
Si quieres probar el inicio de sesión con Google, debes configurar las siguientes variables en el `.env` del **Backend**:
```env
GOOGLE_CLIENT_ID=tu_id_de_cliente
GOOGLE_CLIENT_SECRET=tu_secreto_de_cliente
GOOGLE_REDIRECT_URI=http://localhost:8000/api/auth/google/callback
```

### URLs del Scraper
Puedes modificar las URLs que el scraper analiza editando el archivo `urls.txt` en la carpeta `scraper/` o a través del panel de administración en la web.

---

## 🏁 Resumen de Ejecución Rápida
Para tener todo funcionando al mismo tiempo, abre 3 terminales:

1. **Terminal 1 (Backend):** `php artisan serve`
2. **Terminal 2 (Frontend):** `npm run dev`
3. **Terminal 3 (Scraper):** Ejecutar `python main.py` cuando necesites actualizar datos.

---

¡Listo! Ya deberías tener **PixelMarket** funcionando en tu máquina local. 🚀
