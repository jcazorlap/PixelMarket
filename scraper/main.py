import asyncio
import json
import os
from pathlib import Path
from dotenv import load_dotenv
import google.generativeai as genai
from playwright.async_api import async_playwright

load_dotenv()

# Configure Gemini
genai.configure(api_key=os.getenv("GEMINI_API_KEY"))
model = genai.GenerativeModel('models/gemini-2.5-flash')

async def scrape_url(browser, url):
    print(f"Scraping: {url}")
    page = await browser.new_page()
    try:
        await page.goto(url, wait_until="domcontentloaded", timeout=60000)
        # Scroll more to trigger lazy loading
        await page.mouse.wheel(0, 5000)
        await asyncio.sleep(3)
        await page.mouse.wheel(0, -2000)
        await asyncio.sleep(1)
        # Extract visible text only to avoid HTML bloat
        text_content = await page.evaluate("document.body.innerText")
        print(f"Extracted {len(text_content)} characters from {url}")
        return text_content
    except Exception as e:
        print(f"Error scraping {url}: {e}")
        return None
    finally:
        await page.close()

async def get_game_data_from_gemini(text):
    api_key = os.getenv("GEMINI_API_KEY")
    if not api_key:
        print("Error: GEMINI_API_KEY is not set.")
        return None

    print(f"Sending {len(text)} characters to Gemini...")
    prompt = f"""
    Extract as many videogames as possible from the text below and return them as a valid JSON list of objects.
    Each object must have these fields:
    - name: Name of the videogame
    - category: Category of the game (e.g., Action, RPG, Indie, Adventure, etc.)
    - description: A brief description or summary of the game (approx 200-300 characters)
    - cover_image: URL of the cover image
    - store: Name of the store (e.g., Steam, Epic Games, etc.)
    - price: Current price as a decimal number (or 0 if free)

    Text:
    {text[:15000]}
    """
    
    try:
        temp_model = genai.GenerativeModel('models/gemini-2.5-flash')
        response = temp_model.generate_content(prompt)
        
        if not response or not response.text:
            print("Error: Gemini returned an empty response.")
            return None

        content = response.text.strip()
        print(f"Gemini response (first 100 chars): {content[:100]}...")

        # Clean response text
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
                            
                        # If Gemini didn't find a specific URL, or if we want to ensure we have one
                        if not game.get('url_link'):
                            game['url_link'] = url # Use the source URL as fallback
                        
                        # Ensure a fallback based on store name if everything else fails
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
