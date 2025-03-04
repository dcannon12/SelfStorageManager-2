import psycopg2
import os

DATABASE_URL = os.getenv("DATABASE_URL")

if not DATABASE_URL:
    raise ValueError("DATABASE_URL environment variable is required")

try:
    conn = psycopg2.connect(DATABASE_URL)
    cursor = conn.cursor()
    print("Successfully connected to PostgreSQL database")
    try:
        cursor.execute("SELECT * FROM StorageManagerData;")
        rows = cursor.fetchall()
        #Removed insecure print statement
    except Exception as e:
        print(f"Error executing query: {e}")

except Exception as e:
    print(f"Error connecting to database: {e}")
finally:
    if 'cursor' in locals():
        cursor.close()
    if 'conn' in locals():
        conn.close()