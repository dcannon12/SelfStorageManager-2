import psycopg2
import os

DATABASE_URL = os.getenv("DATABASE_URL")

conn = psycopg2.connect(DATABASE_URL)
cursor = conn.cursor()

cursor.execute("SELECT * FROM StorageManagerData;")
rows = cursor.fetchall()

for row in rows:
    print(row)

cursor.close()
conn.close()