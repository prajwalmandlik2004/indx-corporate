# backend/create_tables.py
from app.database import engine, Base
from app.models.user import User
from app.models.test import TestAttempt

print("Creating database tables...")

try:
    # This will create all tables defined in your models
    Base.metadata.create_all(bind=engine)
    print("✅ All tables created successfully!")
    print("\nTables created:")
    print("- users")
    print("- test_attempts")
except Exception as e:
    print(f"❌ Error creating tables: {e}")