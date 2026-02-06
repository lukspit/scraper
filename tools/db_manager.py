import os
from supabase import create_client, Client
from typing import Dict, List, Optional
import datetime

# Load env variables manually if not already present
if not os.environ.get("SUPABASE_URL"):
    env_path = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), '.env')
    try:
        with open(env_path, 'r') as f:
            for line in f:
                if line.strip() and not line.startswith('#'):
                    key, value = line.strip().split('=', 1)
                    os.environ[key] = value
    except FileNotFoundError:
        print("Warning: .env file not found.")

def get_client() -> Client:
    url = os.environ.get("SUPABASE_URL")
    key = os.environ.get("SUPABASE_KEY")
    if not url or not key:
        raise ValueError("Supabase URL and Key must be set in environment variables.")
    return create_client(url, key)

def upsert_article(article_data: Dict) -> Optional[Dict]:
    """
    Upserts an article into the 'articles' table.
    Enforces unique constraint on 'url'.
    Does not overwrite 'is_saved' status.
    """
    supabase = get_client()
    try:
        # Check if article exists to preserve 'is_saved'
        existing = supabase.table("articles").select("is_saved").eq("url", article_data["url"]).execute()
        
        if existing.data:
            # Preserve existing is_saved status
            article_data["is_saved"] = existing.data[0].get("is_saved", False)
        
        # Perform upsert
        # on_conflict="url" ensures uniqueness
        response = supabase.table("articles").upsert(article_data, on_conflict="url").execute()
        
        if response.data:
            return response.data[0]
        return None
        
    except Exception as e:
        print(f"Error upserting article {article_data.get('url')}: {e}")
        return None

def fetch_articles(limit: int = 50) -> List[Dict]:
    """
    Fetches the latest articles ordered by published_at DESC.
    """
    supabase = get_client()
    try:
        response = supabase.table("articles")\
            .select("*")\
            .order("published_at", desc=True)\
            .limit(limit)\
            .execute()
        return response.data
    except Exception as e:
        print(f"Error fetching articles: {e}")
        return []

def toggle_save_status(article_id: str, current_status: bool) -> bool:
    """
    Toggles the is_saved status of an article.
    Returns True if successful, False otherwise.
    """
    supabase = get_client()
    try:
        new_status = not current_status
        response = supabase.table("articles")\
            .update({"is_saved": new_status})\
            .eq("id", article_id)\
            .execute()
        return True if response.data else False
    except Exception as e:
        print(f"Error toggling save status for {article_id}: {e}")
        return False

# Self-test block
if __name__ == "__main__":
    print("Testing db_manager...")
    test_article = {
        "title": "Test Article B.L.A.S.T.",
        "url": "https://example.com/test-blast",
        "source": "test_script",
        "published_at": datetime.datetime.now().isoformat(),
        "summary": "This is a test article inserted by db_manager.",
        "raw_html_content": "<p>Test content</p>"
    }
    
    result = upsert_article(test_article)
    if result:
        print(f"✅ Upsert successful: {result['title']}")
        
        articles = fetch_articles(limit=5)
        print(f"✅ Fetched {len(articles)} articles.")
        
        if articles:
            latest = articles[0]
            if latest['url'] == test_article['url']:
                print("✅ Latest article matches inserted test.")
    else:
        print("❌ Upsert failed.")
