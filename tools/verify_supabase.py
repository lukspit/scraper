import os
import sys
from supabase import create_client, Client

# Load environment variables manually since we don't have python-dotenv installed yet
# in the standard environment, or we can just read the file.
# For robustness in this environment, I'll read .env manually.

def load_env():
    env_path = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), '.env')
    with open(env_path, 'r') as f:
        for line in f:
            if line.strip() and not line.startswith('#'):
                key, value = line.strip().split('=', 1)
                os.environ[key] = value

def verify_connection():
    try:
        load_env()
        url = os.environ.get("SUPABASE_URL")
        key = os.environ.get("SUPABASE_KEY")
        
        if not url or not key:
            print("❌ Error: SUPABASE_URL or SUPABASE_KEY not found in .env")
            return

        print(f"Connecting to {url}...")
        supabase: Client = create_client(url, key)
        
        # Try a simple select to verify connection and table existence
        # This checks if 'articles' table exists and is accessible
        response = supabase.table("articles").select("*").limit(1).execute()
        
        print("✅ Connection successful!")
        print(f"✅ 'articles' table accessible. Row count: {len(response.data)}")
        
    except Exception as e:
        print(f"❌ Connection failed: {str(e)}")
        sys.exit(1)

if __name__ == "__main__":
    verify_connection()
