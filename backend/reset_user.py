from sqlalchemy.orm import Session
from database import SessionLocal
import models
from auth import get_password_hash

def reset_password(email, new_password):
    db = SessionLocal()
    user = db.query(models.User).filter(models.User.email == email).first()
    if user:
        user.hashed_password = get_password_hash(new_password)
        db.commit()
        print(f"Password for {email} has been reset to: {new_password}")
    else:
        print(f"User {email} not found")
    db.close()

if __name__ == "__main__":
    reset_password("rithiha@gmail.com", "admin123")
