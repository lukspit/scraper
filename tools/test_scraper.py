import requests
from bs4 import BeautifulSoup
import sys

def test_scraper():
    url = "https://news.ycombinator.com/" # Simple test target
    print(f"Testing scraper on {url}...")
    
    try:
        response = requests.get(url, timeout=10)
        print(f"Status Code: {response.status_code}")
        
        if response.status_code == 200:
            soup = BeautifulSoup(response.content, 'html.parser')
            title = soup.title.string if soup.title else "No title"
            print(f"✅ Page Title: {title}")
            print(f"✅ Scraper test successful! Content length: {len(response.content)}")
        else:
            print(f"❌ Failed to fetch page. Status: {response.status_code}")
            sys.exit(1)
            
    except Exception as e:
        print(f"❌ Scraper test failed: {str(e)}")
        sys.exit(1)

if __name__ == "__main__":
    test_scraper()
