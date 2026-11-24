
from flask import Flask, render_template, request, redirect, session, flash
import sqlite3
from werkzeug.security import generate_password_hash, check_password_hash
from functools import wraps
import re
import os

app = Flask(__name__)

# Secret key for session management
app.secret_key = os.environ.get("SECRET_KEY", "dev-secret-change-this")

# Database connection
def get_db():
    conn = sqlite3.connect("users.db")
    conn.row_factory = sqlite3.Row
    return conn


# Create database
def create_table():
    conn = get_db()

    conn.execute("""
        CREATE TABLE IF NOT EXISTS users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            username TEXT NOT NULL UNIQUE,
            email TEXT NOT NULL UNIQUE,
            password TEXT NOT NULL
        )
    """)

    conn.commit()
    conn.close()


# Registration page
@app.route("/register", methods=["GET", "POST"])
def register():

    if request.method == "POST":

        username = request.form["username"].strip()
        email = request.form["email"].strip().lower()
        password = request.form["password"]

        # Validate inputs
        if not username or not email or not password:
            flash("All fields are required!")
            return redirect("/register")

        if not re.fullmatch(r"[^@\s]+@[^@\s]+\.[^@\s]+", email):
            flash("Enter a valid email address!")
            return redirect("/register")

        if len(password) < 8:
            flash("Password must contain at least 8 characters!")
            return redirect("/register")

        conn = get_db()

        # Check existing email
        existing_user = conn.execute(
            "SELECT id FROM users WHERE email = ?",
            (email,)
        ).fetchone()

        if existing_user:
            conn.close()
            flash("Email already registered!")
            return redirect("/register")

        # Hash password securely
        hashed_password = generate_password_hash(password)

        # Save user
        conn.execute(
            "INSERT INTO users (username, email, password) VALUES (?, ?, ?)",
            (username, email, hashed_password)
        )

        conn.commit()
        conn.close()

        flash("Registration successful! Please login.")
        return redirect("/login")

    return render_template("register.html")


# Login page
@app.route("/login", methods=["GET", "POST"])
def login():

    if request.method == "POST":

        email = request.form["email"].strip().lower()
        password = request.form["password"]

        conn = get_db()

        user = conn.execute(
            "SELECT * FROM users WHERE email = ?",
            (email,)
        ).fetchone()

        conn.close()

        if user and check_password_hash(user["password"], password):

            session.clear()
            session["user_id"] = user["id"]
            session["username"] = user["username"]

            return redirect("/dashboard")

        flash("Invalid email or password!")

    return render_template("login.html")


# Login required decorator
def login_required(func):

    @wraps(func)
    def wrapper(*args, **kwargs):

        if "user_id" not in session:
            return redirect("/login")

        return func(*args, **kwargs)

    return wrapper


# Dashboard page
@app.route("/dashboard")
@login_required
def dashboard():

    return render_template(
        "dashboard.html",
        username=session["username"]
    )


# Logout
@app.route("/logout")
def logout():

    session.clear()
    flash("You have logged out successfully!")

    return redirect("/login")


if __name__ == "__main__":
    create_table()
    app.run(debug=True)
