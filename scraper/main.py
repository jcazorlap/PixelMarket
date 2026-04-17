import asyncio
import json
import os
from pathlib import Path
from dotenv import load_dotenv
from google import genai
from playwright.async_api import async_playwright

load_dotenv()

# Configurar cliente de Gemini
client = genai.Client(api_key=os.getenv("GEMINI_API_KEY"))

MODEL_ID = "models/gemini-2.5-flash" # Valor por defecto
config_file = Path("config.json")
if config_file.exists():
    try:
        with open(config_file, "r") as f:
            config = json.load(f)
            if "model_id" in config:
                MODEL_ID = config["model_id"]
    except Exception as e:
        print(f"Error reading config.json: {e}")

async def scrape_url(browser, url):
    print(f"Scraping: {url}")
    page = await browser.new_page()
    try:
        await page.goto(url, wait_until="domcontentloaded", timeout=60000)
        # Desplazar más para activar la carga perezosa
        await page.mouse.wheel(0, 5000)
        await asyncio.sleep(3)
        await page.mouse.wheel(0, -2000)
        await asyncio.sleep(1)
        
        # Extraer texto visible e imágenes
        extraction_data = await page.evaluate("""() => {
            const images = Array.from(document.querySelectorAll('img')).map(img => ({
                src: img.src,
                alt: img.alt || '',
                score: (img.alt.toLowerCase().includes('cover') || img.src.toLowerCase().includes('cover') || img.alt.toLowerCase().includes('header') || img.src.toLowerCase().includes('header')) ? 10 : 0
            })).filter(img => img.src && img.src.startsWith('http') && !img.src.includes('icon') && !img.src.includes('avatar'));
            
            // Ordenar por puntuación y tomar los 30 primeros
            const sortedImages = images.sort((a, b) => b.score - a.score).slice(0, 30);
            
            return {
                text: document.body.innerText,
                images: sortedImages
            };
        }""")
        
        print(f"Extracted {len(extraction_data['text'])} characters and {len(extraction_data['images'])} images from {url}")
        return extraction_data
    except Exception as e:
        print(f"Error scraping {url}: {e}")
        return None
    finally:
        await page.close()

async def get_game_data_from_gemini(extraction_data):
    api_key = os.getenv("GEMINI_API_KEY")
    if not api_key:
        print("Error: GEMINI_API_KEY is not set.")
        return None

    text = extraction_data['text']
    images = extraction_data['images']

    print(f"Sending {len(text)} characters and {len(images)} image URLs to Gemini...")
    
    # Formatear las imágenes para el prompt de forma más concisa
    images_str = "\n".join([f"- URL: {img['src']} (Alt: {img['alt']})" for img in images])

    prompt = f"""
    Eres un experto en extracción de datos de videojuegos. Tu tarea es extraer la mayor cantidad posible de videojuegos del texto y la lista de URLs de imágenes proporcionadas.

    INSTRUCCIONES CRÍTICAS:
    1. IDIOMA: Los campos 'category' y 'description' DEBEN estar en ESPAÑOL.
    2. IMAGEN: El campo 'cover_image' NO puede estar vacío. Debes seleccionar la URL más probable de la lista proporcionada que corresponda a la portada o imagen principal del juego.
    3. JSON: Devuelve unicamente una lista JSON válida.

    CAMPOS POR JUEGO:
    - name: Nombre del videojuego.
    - category: Categoría en ESPAÑOL.
    - description: Resumen de 200-300 caracteres en ESPAÑOL.
    - cover_image: URL de la imagen de portada de la lista proporcionada (OBLIGATORIO).
    - store: Nombre de la tienda.
    - price: Precio decimal (0 si es gratis).

    LISTA DE URLs DE IMÁGENES DISPONIBLES:
    {images_str}

    TEXTO DE LA PÁGINA:
    {text[:10000]}
    """
    
    try:
        response = client.models.generate_content(
            model=MODEL_ID,
            contents=prompt,
        )
        
        if not response or not response.text:
            print("Error: Gemini returned an empty response.")
            return None

        content = response.text.strip()
        print(f"Gemini response (first 100 chars): {content[:100]}...")

        # Limpiar el texto de la respuesta
        if "```json" in content:
            content = content.split("```json")[1].split("```")[0].strip()
        elif "```" in content:
            content = content.split("```")[1].split("```")[0].strip()
        
        data = json.loads(content)
        if isinstance(data, dict):
            return [data]
        return data if isinstance(data, list) else None
    except Exception as e:
        print(f"Error with Gemini API: {str(e)}")
        return None

DEFAULT_STORE_URLS = {
    "Steam": "https://store.steampowered.com/",
    "Epic Games": "https://store.epicgames.com/",
    "GOG": "https://www.gog.com/",
    "PlayStation Store": "https://store.playstation.com/",
}

async def main():
    urls_file = Path("urls.txt")
    if not urls_file.exists():
        print("urls.txt not found.")
        return

    with open(urls_file, "r") as f:
        urls = [line.strip() for line in f if line.strip()]

    games_data = []

    async with async_playwright() as p:
        browser = await p.chromium.launch()
        for url in urls:
            text = await scrape_url(browser, url)
            if text:
                data_list = await get_game_data_from_gemini(text)
                if data_list and isinstance(data_list, list):
                    for game in data_list:
                        if not isinstance(game, dict):
                            continue
                            
                        # Si Gemini no encontró una URL específica, usar la URL de origen como respaldo
                        if not game.get('url_link'):
                            game['url_link'] = url # Usar la URL de origen como respaldo
                        
                        # Asegurar respaldo basado en el nombre de la tienda si todo lo demás falla
                        store_name = game.get('store', '')
                        if not game.get('url_link') and store_name in DEFAULT_STORE_URLS:
                            game['url_link'] = DEFAULT_STORE_URLS[store_name]
                            
                        games_data.append(game)
        
        await browser.close()

    if games_data:
        output_file = Path("games_data.json").absolute()
        with open(output_file, "w", encoding="utf-8") as f:
            json.dump(games_data, f, indent=4, ensure_ascii=False)
        print(f"Scraping finished. {len(games_data)} games saved to {output_file}")
    else:
        print("No games found.")

if __name__ == "__main__":
    asyncio.run(main())
