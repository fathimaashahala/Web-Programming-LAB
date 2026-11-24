
from flask import Flask, render_template, request
import sqlite3

app = Flask(__name__, template_folder=".")

# Create database and table
def create_table():
    conn = sqlite3.connect("contact.db")

    conn.execute("""
        CREATE TABLE IF NOT EXISTS contacts (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            email TEXT NOT NULL,
            subject TEXT NOT NULL,
            message TEXT NOT NULL
        )
    """)

    conn.commit()
    conn.close()


# Home page
@app.route("/")
def home():
    return render_template("index.html")


# Handle form submission
@app.route("/submit", methods=["POST"])
def submit():

    name = request.form.get("name", "").strip()
    email = request.form.get("email", "").strip()
    subject = request.form.get("subject", "").strip()
    message = request.form.get("message", "").strip()

    if not all([name, email, subject, message]):
        return "Please fill in all fields!"

    conn = sqlite3.connect("contact.db")

    conn.execute("""
        INSERT INTO contacts (name, email, subject, message)
        VALUES (?, ?, ?, ?)
    """, (name, email, subject, message))

    conn.commit()
    conn.close()

    return """
        <h1>Message Submitted Successfully!</h1>
        <p>Thank you for contacting us.</p>
        <a href="/">Go Back</a>
    """


if __name__ == "__main__":
    create_table()
    app.run(debug=True)
