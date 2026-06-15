from flask import Flask, request, jsonify, render_template
from flask_cors import CORS
import mysql.connector
import re
from datetime import datetime

app = Flask(__name__, template_folder="./", static_folder="./", static_url_path="")
CORS(app)

# --- Konfigurasi Koneksi Database ---
db_config = {
    "host": "localhost",
    "user": "your_username",          
    "password": "your_password",          
    "database": "pendaftaran_siswa"
}

# Membuat koneksi
def get_db_connection():
    return mysql.connector.connect(**db_config)

# --- Fungsi Validasi ---
def validate_registration_data(data):
    errors = {}
    required_fields = ['fullName', 'dob', 'gender', 'grade', 'address', 
                       'email', 'phone', 'parentName', 'parentPhone', 'termsAgreed']
    for field in required_fields:
        if not data.get(field):
            errors[field] = f"Bidang '{field}' wajib diisi."

    email_regex = r'^[^\s@]+@[^\s@]+\.[^\s@]+$'
    phone_regex = r'^[0-9]{10,15}$'

    if not re.match(email_regex, data.get('email', '')):
        errors['email'] = "Format email tidak valid."

    if not re.match(phone_regex, data.get('phone', '')):
        errors['phone'] = "Nomor telepon siswa tidak valid."

    if not re.match(phone_regex, data.get('parentPhone', '')):
        errors['parentPhone'] = "Nomor telepon orang tua tidak valid."

    try:
        datetime.strptime(data['dob'], '%Y-%m-%d')
    except ValueError:
        errors['dob'] = "Format tanggal lahir tidak valid (YYYY-MM-DD)."

    if data.get('termsAgreed') is not True:
        errors['termsAgreed'] = "Anda harus menyetujui syarat dan ketentuan."

    return not errors, errors

# --- Endpoint Pendaftaran ---
@app.route('/api/register', methods=['POST'])
def register_student():
    if not request.is_json:
        return jsonify({"success": False, "message": "Format data harus JSON."}), 400

    data = request.get_json()
    is_valid, errors = validate_registration_data(data)

    if not is_valid:
        return jsonify({"success": False, "message": "Validasi gagal.", "errors": errors}), 400

    try:
        conn = get_db_connection()
        cursor = conn.cursor()

        sql = """
            INSERT INTO siswa_baru
            (full_name, dob, gender, grade, address, email, phone, parent_name, parent_phone, terms_agreed)
            VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
        """
        values = (
            data['fullName'],
            data['dob'],
            data['gender'],
            data['grade'],
            data['address'],
            data['email'],
            data['phone'],
            data['parentName'],
            data['parentPhone'],
            data['termsAgreed']
        )

        cursor.execute(sql, values)
        conn.commit()

        cursor.close()
        conn.close()

        return jsonify({
            "success": True,
            "message": "Pendaftaran berhasil! Data telah disimpan ke database."
        }), 201

    except mysql.connector.Error as err:
        print(f"[DB ERROR] {err}")
        return jsonify({"success": False, "message": f"Kesalahan database: {err}"}), 500

@app.route("/sekolah")
def sekolah():
    return render_template("skul.html")

if __name__ == '__main__':
    app.run(debug=True, port=5001)