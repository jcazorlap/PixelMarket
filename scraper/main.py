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
model = genai.GenerativeModel('gemini-2.5-flash')

async def scrape_url(browser, url):
    print(f"Scraping: {url}")
    page = await browser.new_page()
    try:
        await page.goto(url, wait_until="domcontentloaded", timeout=60000)
        # Extract visible text only to avoid HTML bloat
        text_content = await page.evaluate("document.body.innerText")
        return text_content
    except Exception as e:
        print(f"Error scraping {url}: {e}")
        return None
    finally:
        await page.close()

async def get_game_data_from_gemini(text):
    prompt = f"""
    Extract the following information from the text below and return it as a valid JSON object.
    Fields:
    - name: Name of the videogame
    - cover_image: URL of the cover image
    - store: Name of the store (e.g., Steam, Epic Games, etc.)
    - price: Current price as a decimal number (or 0 if free)

    Text:
    {text[:8000]}  # Limiting text to avoid token limits
    """
    
    try:
        response = model.generate_content(prompt)
        # Clean response text to ensure it's valid JSON
        content = response.text.strip()
        if content.startswith("```json"):
            content = content[7:-3].strip()
        return json.loads(content)
    except Exception as e:
        print(f"Error with Gemini API: {e}")
        return None

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
                data = await get_game_data_from_gemini(text)
                if data:
                    data['url_link'] = url # Keep track of the source
                    games_data.append(data)
        
        await browser.close()

    with open("games_data.json", "w", encoding="utf-8") as f:
        json.dump(games_data, f, indent=4, ensure_ascii=False)
    
    print("Scraping finished. Data saved to games_data.json")

if __name__ == "__main__":
    asyncio.run(main())
