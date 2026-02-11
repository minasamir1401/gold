import sqlite3
import json
import os

DB_NAME = "gold_prices.db"
OUTPUT_FILE = "database_view.txt"

def read_latest_snapshot():
    if not os.path.exists(DB_NAME):
        print(f"Error: {DB_NAME} not found.")
        return

    try:
        conn = sqlite3.connect(DB_NAME)
        c = conn.cursor()
        
        c.execute('SELECT COUNT(*) FROM snapshots')
        count = c.fetchone()[0]
        
        c.execute('SELECT id, timestamp, data FROM snapshots ORDER BY id DESC LIMIT 1')
        row = c.fetchone()
        
        with open(OUTPUT_FILE, "w", encoding="utf-8") as f:
            f.write(f"Total snapshots in database: {count}\n")
            
            if row:
                snapshot_id, timestamp, data_json = row
                f.write(f"\n--- Latest Snapshot (ID: {snapshot_id}, Time: {timestamp}) ---\n")
                
                data = json.loads(data_json)
                f.write("\nSummary of data:\n")
                if "prices" in data:
                    f.write(f"  Gold Era Prices: {len(data['prices'])} items\n")
                if "countries" in data:
                    f.write(f"  Countries: {list(data['countries'].keys())}\n")
                if "sarf_currencies" in data:
                    f.write(f"  Currencies: {len(data['sarf_currencies'])} items\n")
                
                f.write("\nFull JSON Data:\n")
                f.write(json.dumps(data, indent=2, ensure_ascii=False))
                print(f"Success! Data has been written to {OUTPUT_FILE}")
            else:
                f.write("No snapshots found in database.")
                print("No snapshots found.")
            
        conn.close()
    except Exception as e:
        print(f"Error reading database: {e}")

if __name__ == "__main__":
    read_latest_snapshot()
