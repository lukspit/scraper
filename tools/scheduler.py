import time
import schedule
from scraper_engine import run_pipeline
import sys

def job():
    print(f"⏰ Starting scheduled job at {time.strftime('%Y-%m-%d %H:%M:%S')}")
    try:
        run_pipeline()
        print("✅ Job completed successfully.")
    except Exception as e:
        print(f"❌ Job failed: {e}")

def start_scheduler():
    print("🛰️ B.L.A.S.T. Scheduler Active")
    print("⏳ Running scraper every 24 hours...")
    
    # Run once immediately on start
    job()
    
    # Schedule every 24 hours
    schedule.every(24).hours.do(job)
    
    while True:
        schedule.run_pending()
        time.sleep(60)

if __name__ == "__main__":
    # Ensure schedule library is installed
    try:
        import schedule
    except ImportError:
        print("Installing schedule library...")
        import subprocess
        subprocess.check_call([sys.executable, "-m", "pip", "install", "schedule"])
        import schedule

    try:
        start_scheduler()
    except KeyboardInterrupt:
        print("\n🛑 Scheduler stopped by user.")
