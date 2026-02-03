import asyncio
import time
import main
import database

async def test():
    db = database.SessionLocal()
    print("Starting metrics calculation...")
    start = time.time()
    try:
        res = await main.get_dashboard_metrics(db)
        duration = time.time() - start
        print(f"Metrics calculated in {duration:.2f}s")
        print(f"Keys: {res.keys()}")
        print(f"Insights: {res.get('insights')}")
    except Exception as e:
        print(f"Error: {e}")
    finally:
        db.close()

if __name__ == "__main__":
    asyncio.run(test())
