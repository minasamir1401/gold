import sqlite3
import json
from datetime import datetime

DB_NAME = "gold_prices.db"

data_raw = """
١١ فبراير	٧٬٧٠٣	٧٬٠٦١	٦٬٧٤٠	٥٬٧٧٧	٤٬٤٩٣	٢٣٩٬٥٩٠٫٠٨	٥٣٬٩٢٠
١٠ فبراير	٧٬٦٨٦	٧٬٠٤٦	٦٬٧٢٥	٥٬٧٦٤	٤٤٨٤	٢٣٩٬٠٦١٫٣٢	٥٣٬٨٠٠
٩ فبراير	٧٬٧٢٦	٧٬٠٨٢	٦٬٧٦٠	٥٬٧٩٤	٤٬٥٠٧	٢٤٠٬٣٠٥٫٤٦	٥٤٬٠٨٠
٨ فبراير	٧٬٦٢٣	٦٬٩٨٨	٦٬٦٧٠	٥٬٧١٧	٤٬٤٤٧	٢٣٧٬١٠١٫٨	٥٣٬٣٦٠
٧ فبراير	٧٬٦٢٣	٦٬٩٨٨	٦٬٦٧٠	٥٬٧١٧	٤٬٤٤٧	٢٣٧٬١٠١٫٨	٥٣٬٣٦٠
٦ فبراير	٧٬٦٠٠	٦٬٩٦٧	٦٬٦٥٠	٥٬٧٠٠	٤٬٤٣٣	٢٣٦٬٣٨٦٫٤٢	٥٣٬٢٠٠
٥ فبراير	٧٬٣٨٣	٦٬٧٦٨	٦٬٤٦٠	٥٬٥٣٧	٤٬٣٠٧	٢٢٩٬٦٣٦٫٩٧	٥١٬٦٨٠
٤ فبراير	٧٬٦٣٤	٦٬٩٩٨	٦٬٦٨٠	٥٬٧٢٦	٤٬٤٥٣	٢٣٧٬٤٤٣٫٩٤	٥٣٬٤٤٠
٣ فبراير	٧٬٦٦٩	٧٬٠٣٠	٦٬٧١٠	٥٬٧٥٢	٤٬٤٧٤	٢٣٨٬٥٣٢٫٥٦	٥٣٬٦٨٠
٢ فبراير	٧٬٣٧١	٦٬٧٥٧	٦٬٤٥٠	٥٬٥٢٨	٤٬٣٠٠	٢٢٩٬٢٦٣٫٧٣	٥١٬٦٠٠
١ فبراير	٧٬٦٩٧	٧٬٠٥٦	٦٬٧٣٥	٥٬٧٧٣	٤٬٤٩٠	٢٣٩٬٤٠٣٫٤٦	٥٣٬٨٨٠
٣١ يناير	٧٬٧٩٤	٧٬١٤٤	٦٬٨٢٠	٥٬٨٤٦	٤٬٥٤٦	٢٤٢٬٤٢٠٫٥	٥٤٬٥٦٠
٣٠ يناير	٧٬٧١٤	٧٬٠٧١	٦٬٧٥٠	٥٬٧٨٦	٤٬٥٠٠	٢٣٩٬٩٣٢٫٢٢	٥٤٬٠٠٠
٢٩ يناير	٨٬٤٠٠	٧٬٧٠٠	٧٬٣٥٠	٦٬٣٠٠	٤٬٩٠٠	٢٦١٬٢٦٩٫٢١	٥٨٬٨٠٠
٢٨ يناير	٨٬٢٠٦	٧٬٥٢٢	٧٬١٨٠	٦٬١٥٤	٤٬٧٨٧	٢٥٥٬٢٣٥٫١٣	٥٧٬٤٤٠
٢٧ يناير	٧٬٨٢٩	٧٬١٧٧	٦٬٨٥٠	٥٬٨٧٢	٤٬٥٦٧	٢٤٣٬٥٠٩٫١٢	٥٤٬٨٠٠
٢٦ يناير	٧٬٦٩١	٧٬٠٥٠	٦٬٧٣٠	٥٬٧٦٨	٤٬٤٨٦	٢٣٩٬٢١٦٫٨٤	٥٣٬٨٤٠
٢٥ يناير	٧٬٦٨٠	٧٬٠٤٠	٦٬٧٢٠	٥٬٧٦٠	٤٬٤٨٠	٢٣٨٬٨٧٤٫٧	٥٣٬٧٦٠
٢٤ يناير	٧٬٦٩٧	٧٬٠٥٦	٦٬٧٣٥	٥٬٧٧٣	٤٬٤٩٠	٢٣٩٬٤٠٣٫٤٦	٥٣٬٨٨٠
٢٣ يناير	٧٬٦٢٩	٦٬٩٩٣	٦٬٦٧٥	٥٬٧٢٢	٤٬٤٥٠	٢٣٧٬٢٨٨٫٤٢	٥٣٬٤٠٠
٢٢ يناير	٧٬٥٤٣	٦٬٩١٤	٦٬٦٠٠	٥٬٦٥٧	٤٬٤٠٠	٢٣٤٬٦١٣٫٥٣	٥٢٬٨٠٠
٢١ يناير	٧٬٤١١	٦٬٧٩٣	٦٬٤٨٥	٥٬٥٥٨	٤٬٣٢٣	٢٣٠٬٥٠٧٫٨٧	٥١٬٨٨٠
٢٠ يناير	٧٬٣٠٩	٦٬٧٠٠	٦٬٣٩٥	٥٬٤٨٢	٤٬٢٦٤	٢٢٧٬٣٣٥٫٣١	٥١٬١٦٠
١٩ يناير	٧٬١٦٩	٦٬٥٧٢	٦٬٢٧٣	٥٬٣٧٧	٤٬١٨٢	٢٢٢٬٩٨٠٫٨٣	٥٠٬١٨٤
١٨ يناير	٧٬٠٥٧	٦٬٤٦٩	٦٬١٧٥	٥٬٢٩٣	٤٬١١٧	٢١٩٬٤٩٧٫٢٤	٤٩٬٤٠٠
١٧ يناير	٧٬٠٣٤	٦٬٤٤٨	٦٬١٥٥	٥٢٧٦	٤١٠٣	٢١٨٬٧٨١٫٨٦	٤٩٬٢٤٠
١٦ يناير	٧٬٠٢٩	٦٬٤٤٣	٦٬١٥٠	٥٬٢٧٢	٤٬١٠٠	٢١٨٬٦٢٦٫٣٤	٤٩٬٢٠٠
١٥ يناير	٧٬٠٥١	٦٬٤٦٣	٦٬١٧٠	٥٬٢٨٨	٤٬١١٣	٢١٩٬٣١٠٫٦١	٤٩٬٣٦٠
١٤ يناير	٧٬٠٨٦	٦٬٤٩٦	٦٬٢٠٠	٥٬٣١٤	٤٬١٣٤	٢٢٠٬٣٩٩٫٢٤	٤٩٬٦٠٠
١٣ يناير	٦٬٩٧٧	٦٬٣٩٦	٦٬١٠٥	٥٬٢٣٣	٤٬٠٧٠	٢١٧٬٠٠٨٫٩٦	٤٨٬٨٤٠
١٢ يناير	٦٬٩٧٧	٦٬٣٩٦	٦٬١٠٥	٥٬٢٣٣	٤٬٠٧٠	٢١٧٬٠٠٨٫٩٦	٤٨٬٨٤٠
"""

ar_months = {
    "يناير": 1, "فبراير": 2, "مارس": 3, "أبريل": 4, "مايو": 5, "يونيو": 6,
    "يوليو": 7, "أغسطس": 8, "سبتمبر": 9, "أكتوبر": 10, "نوفمبر": 11, "ديسمبر": 12
}

def clean_num(s):
    if not s: return "0"
    # Translate Arabic-Indic digits to standard Western digits
    arabic_digits = "٠١٢٣٤٥٦٧٨٩"
    western_digits = "0123456789"
    table = str.maketrans(arabic_digits, western_digits)
    s = s.translate(table)
    # Handle Arabic decimal point ٫
    s = s.replace('٫', '.')
    # Remove thousands separators (standard and Arabic)
    s = s.replace('٬', '').replace(',', '').strip()
    return s if s else "0"

conn = sqlite3.connect(DB_NAME)
c = conn.cursor()

# 1. Clear existing snapshots to ensure clean data
print("Clearing old snapshots...")
c.execute("DELETE FROM snapshots")

current_year = 2026

lines = [l.strip() for l in data_raw.strip().split('\n') if l.strip()]
for line in reversed(lines):
    # Try tab split first
    parts = line.split('\t')
    if len(parts) < 8:
        # Fallback to space split for mixed formatting
        # Arabic date name usually has space: "١١ فبراير"
        # We look for indices of prices
        tokens = [t.strip() for t in line.split() if t.strip()]
        if len(tokens) >= 9:
            date_str = tokens[0] + " " + tokens[1]
            vals = tokens[2:]
        else:
            continue
    else:
        date_str = parts[0]
        vals = parts[1:]

    # Parse date
    date_parts = date_str.split()
    day = "".join([char for char in date_parts[0] if char.isdigit()])
    month_name = date_parts[1]
    month = ar_months.get(month_name, 1)
    
    timestamp = f"{current_year}-{month:02d}-{int(day):02d}T00:00:00"
    
    # Format according to what the frontend expects for history display and charts
    mock_data = {
        "prices": {
            "عيار 24": {"sell": clean_num(vals[0]), "buy": clean_num(vals[0])},
            "عيار 22": {"sell": clean_num(vals[1]), "buy": clean_num(vals[1])},
            "عيار 21": {"sell": clean_num(vals[2]), "buy": clean_num(vals[2])},
            "عيار 18": {"sell": clean_num(vals[3]), "buy": clean_num(vals[3])},
            "عيار 14": {"sell": clean_num(vals[4]), "buy": clean_num(vals[4])},
            "gold_ounce": {"sell": clean_num(vals[5]), "buy": clean_num(vals[5])},
            "gold_pound": {"sell": clean_num(vals[6]), "buy": clean_num(vals[6])}
        },
        "last_updated": timestamp
    }
    
    c.execute("INSERT INTO snapshots (timestamp, data) VALUES (?, ?)", (timestamp, json.dumps(mock_data, ensure_ascii=False)))
    print(f"Inserted: {timestamp} (21k: {clean_num(vals[2])}, Ounce: {clean_num(vals[5])})")

conn.commit()
conn.close()
print("Done! Database is now highly accurate.")
