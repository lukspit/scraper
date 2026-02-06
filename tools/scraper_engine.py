import requests
from bs4 import BeautifulSoup
import datetime
import json
from typing import List, Dict

# Local import (assuming running from root or properly strictly)
# In B.L.A.S.T., we run scripts from root usually, but let's handle path imports if needed.
try:
    from tools import db_manager
except ImportError:
    import db_manager

USER_AGENT = "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"

def get_headers():
    return {
        "User-Agent": USER_AGENT,
        "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8"
    }

def scrape_bens_bites() -> List[Dict]:
    """
    Scrapes Ben's Bites (simulated via requests logic).
    Target: https://bensbites.co/ (Using a known structure or fallback to generic)
    """
    url = "https://bensbites.co/"
    articles = []
    print(f"Scraping {url}...")
    try:
        response = requests.get(url, headers=get_headers(), timeout=15)
        if response.status_code != 200:
            print(f"Failed to fetch {url}: {response.status_code}")
            return []
            
        soup = BeautifulSoup(response.content, 'html.parser')
        
        # Logic for Ben's Bites (approximate structure based on common newsletter archives)
        # Note: Selectors here are best-guess generic for now to ensure robustness.
        # We look for links inside headers or list items.
        
        # Generic approach for robustness: Find all links with substantial text
        links = soup.find_all('a', href=True)
        for link in links:
            href = link['href']
            text = link.get_text(strip=True)
            
            # Simple heuristic filter
            if len(text) > 20 and "http" in href and "bensbites" not in href:
                 articles.append({
                    "title": text,
                    "url": href,
                    "source": "bens_bites",
                    "published_at": datetime.datetime.now().isoformat(),
                    "summary": "Scraped from Ben's Bites homepage.",
                    "raw_html_content": str(link)
                })
                
        # Dedupe by URL within the batch
        unique_articles = {a['url']: a for a in articles}.values()
        return list(unique_articles)[:10] # Limit to top 10 to avoid noise
        
    except Exception as e:
        print(f"Error scraping Ben's Bites: {e}")
        return []

def scrape_generic_tech_news() -> List[Dict]:
    """
    Fallback/Secondary source: Hacker News or similar (for reliable testing data)
    """
    url = "https://news.ycombinator.com/"
    articles = []
    print(f"Scraping {url}...")
    try:
        response = requests.get(url, headers=get_headers(), timeout=10)
        soup = BeautifulSoup(response.content, 'html.parser')
        
        for item in soup.select('.titleline > a'):
            title = item.get_text()
            link = item['href']
            
            if "http" in link: # valid external link
                articles.append({
                    "title": title,
                    "url": link,
                    "source": "hacker_news_ai", # labeling as such for now
                    "published_at": datetime.datetime.now().isoformat(),
                    "summary": "Trending tech news.",
                    "raw_html_content": str(item)
                })
        return articles[:10]
    except Exception as e:
        print(f"Error scraping generic: {e}")
        return []

def run_pipeline():
    print("🚀 Starting B.L.A.S.T. Scraper Pipeline...")
    
    # 1. Gather Data
    all_articles = []
    all_articles.extend(scrape_bens_bites())
    all_articles.extend(scrape_generic_tech_news())
    
    print(f"📦 Collected {len(all_articles)} potential articles.")
    
    # 2. Upsert to DB
    count = 0
    for article in all_articles:
        result = db_manager.upsert_article(article)
        if result:
            count += 1
            
    print(f"✅ Successfully processed {count} articles into Supabase.")

if __name__ == "__main__":
    run_pipeline()
