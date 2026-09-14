"""
CARENEST - Healthcare & Hospital Portal
Beginner-Friendly Flask Application with SQLite
"""

import sqlite3
import os
from functools import wraps
from datetime import datetime
from flask import (
    Flask, render_template, request, redirect, 
    url_for, session, flash, jsonify, g
)
from werkzeug.security import generate_password_hash, check_password_hash

app = Flask(__name__)
app.secret_key = os.environ.get('SECRET_KEY', 'carenest_super_secret_healthcare_key_2026')
DATABASE = os.path.join(os.path.abspath(os.path.dirname(__file__)), 'database.db')


# ==========================================
# DATABASE HELPER FUNCTIONS
# ==========================================

def get_db():
    """Connect to SQLite database and enable dictionary row factory."""
    db = getattr(g, '_database', None)
    if db is None:
        db = g._database = sqlite3.connect(DATABASE)
        db.row_factory = sqlite3.Row
        db.execute("PRAGMA foreign_keys = ON")
    return db

@app.teardown_appcontext
def close_connection(exception):
    """Close database connection when request ends."""
    db = getattr(g, '_database', None)
    if db is not None:
        db.close()

def query_db(query, args=(), one=False):
    """Execute a query and fetch results."""
    cur = get_db().execute(query, args)
    rv = cur.fetchall()
    cur.close()
    return (rv[0] if rv else None) if one else rv

def execute_db(query, args=()):
    """Execute insert, update, or delete query and commit changes."""
    db = get_db()
    cur = db.execute(query, args)
    db.commit()
    last_id = cur.lastrowid
    cur.close()
    return last_id


# ==========================================
# DATABASE INITIALIZATION & DEMO SEEDING
# ==========================================

def init_db():
    """Create all SQLite tables and seed demo data if not already seeded."""
    with app.app_context():
        db = get_db()
        
        # 1. Users Table
        db.execute('''
            CREATE TABLE IF NOT EXISTS users (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                name TEXT NOT NULL,
                email TEXT UNIQUE NOT NULL,
                password TEXT NOT NULL,
                role TEXT DEFAULT 'patient',
                phone TEXT,
                blood_group TEXT,
                age INTEGER,
                gender TEXT,
                allergies TEXT,
                emergency_contact TEXT,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        ''')

        # 2. Hospitals Table
        db.execute('''
            CREATE TABLE IF NOT EXISTS hospitals (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                name TEXT NOT NULL,
                city TEXT NOT NULL,
                address TEXT NOT NULL,
                phone TEXT NOT NULL,
                emergency_phone TEXT,
                rating REAL DEFAULT 4.8,
                beds_available INTEGER DEFAULT 45,
                specialties TEXT NOT NULL,
                image_url TEXT
            )
        ''')

        # 3. Doctors Table
        db.execute('''
            CREATE TABLE IF NOT EXISTS doctors (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                hospital_id INTEGER,
                name TEXT NOT NULL,
                specialty TEXT NOT NULL,
                qualification TEXT NOT NULL,
                experience_years INTEGER NOT NULL,
                contact_email TEXT,
                phone TEXT,
                availability TEXT DEFAULT 'Mon - Fri (09:00 AM - 04:00 PM)',
                consultation_fee INTEGER DEFAULT 500,
                rating REAL DEFAULT 4.9,
                FOREIGN KEY (hospital_id) REFERENCES hospitals(id) ON DELETE SET NULL
            )
        ''')

        # 4. Medicines Table
        db.execute('''
            CREATE TABLE IF NOT EXISTS medicines (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                name TEXT NOT NULL,
                category TEXT NOT NULL,
                dosage TEXT NOT NULL,
                usage_instructions TEXT NOT NULL,
                side_effects TEXT,
                price REAL NOT NULL,
                stock_status TEXT DEFAULT 'In Stock',
                manufacturer TEXT
            )
        ''')

        # 5. Symptoms Table
        db.execute('''
            CREATE TABLE IF NOT EXISTS symptoms (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                symptom_name TEXT NOT NULL,
                category TEXT NOT NULL,
                severity_weight INTEGER DEFAULT 1
            )
        ''')

        # 6. Reports Table
        db.execute('''
            CREATE TABLE IF NOT EXISTS reports (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                user_id INTEGER NOT NULL,
                report_title TEXT NOT NULL,
                symptoms_logged TEXT NOT NULL,
                diagnosis_summary TEXT NOT NULL,
                severity_level TEXT NOT NULL,
                recommended_specialist TEXT NOT NULL,
                precautions TEXT NOT NULL,
                notes TEXT,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
            )
        ''')

        # 7. Appointments Table
        db.execute('''
            CREATE TABLE IF NOT EXISTS appointments (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                user_id INTEGER NOT NULL,
                doctor_id INTEGER NOT NULL,
                hospital_id INTEGER NOT NULL,
                appointment_date TEXT NOT NULL,
                appointment_time TEXT NOT NULL,
                status TEXT DEFAULT 'Confirmed',
                reason TEXT,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
                FOREIGN KEY (doctor_id) REFERENCES doctors(id) ON DELETE CASCADE,
                FOREIGN KEY (hospital_id) REFERENCES hospitals(id) ON DELETE CASCADE
            )
        ''')

        db.commit()

        # Seed Admin if not exists
        admin = query_db("SELECT * FROM users WHERE email = ?", ('admin@carenest.com',), one=True)
        if not admin:
            admin_pwd = generate_password_hash('admin123')
            execute_db('''
                INSERT INTO users (name, email, password, role, phone, blood_group, age, gender)
                VALUES (?, ?, ?, 'admin', '+1 (800) 555-0199', 'O+', 38, 'Other')
            ''', ('Dr. Evelyn Vance (Chief Admin)', 'admin@carenest.com', admin_pwd))

        # Seed Demo Patient if not exists
        demo_user = query_db("SELECT * FROM users WHERE email = ?", ('sarah.jenkins@example.com',), one=True)
        if not demo_user:
            demo_pwd = generate_password_hash('patient123')
            patient_id = execute_db('''
                INSERT INTO users (name, email, password, role, phone, blood_group, age, gender, allergies, emergency_contact)
                VALUES (?, ?, ?, 'patient', '+1 (555) 234-5678', 'A+', 29, 'Select your gender', 'Penicillin, Peanuts', 'Robert Jenkins (+1 555-987-6543)')
            ''', ('Sarah Jenkins', 'sarah.jenkins@example.com', demo_pwd))

            # Seed sample report for demo user
            execute_db('''
                INSERT INTO reports (user_id, report_title, symptoms_logged, diagnosis_summary, severity_level, recommended_specialist, precautions, notes)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?)
            ''', (
                patient_id,
                'Seasonal Respiratory Assessment',
                'Dry cough, Mild fever, Nasal congestion',
                'Probable upper respiratory viral tract infection with low inflammatory markers.',
                'Mild',
                'General Physician / Pulmonologist',
                'Stay hydrated, inhale warm steam, take Vitamin C, avoid cold environments.',
                'Recommended to rest for 48 hours. Monitor temperature twice daily.'
            ))

        # Seed Hospitals if table is empty
        hospitals_count = query_db("SELECT COUNT(*) as count FROM hospitals", one=True)['count']
        if hospitals_count == 0:
            hospitals_data = [
                ('CareNest Central Apex Hospital', 'Metro City', '742 Evergreen Terrace, Medical District', '+1 (555) 012-3456', '+1 (555) 911-0001', 4.9, 120, 'Cardiology, Neurology, Emergency, Pediatrics', 'https://images.unsplash.com/photo-1587351021759-3e566b6af7cc?w=600&auto=format&fit=crop&q=80'),
                ('Green Valley Multispecialty Center', 'Green Valley', '104 Healthcare Boulevard', '+1 (555) 019-8765', '+1 (555) 911-0002', 4.8, 85, 'Orthopedics, General Medicine, Dermatology', 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=600&auto=format&fit=crop&q=80'),
                ('Hope Children & Family Hospital', 'Riverside', '321 Hope Way, Riverside Center', '+1 (555) 014-9988', '+1 (555) 911-0003', 4.9, 64, 'Pediatrics, Gynecology, Neonatology', 'https://images.unsplash.com/photo-1516549655169-df83a0774514?w=600&auto=format&fit=crop&q=80'),
                ('St. Jude Cardio & Oncology Institute', 'Metro City', '88 Pulse Avenue, Biotech Park', '+1 (555) 018-2233', '+1 (555) 911-0004', 4.7, 95, 'Cardiology, Oncology, Pulmonology', 'https://images.unsplash.com/photo-1586773860418-d37222d8fce3?w=600&auto=format&fit=crop&q=80')
            ]
            for h in hospitals_data:
                execute_db('''
                    INSERT INTO hospitals (name, city, address, phone, emergency_phone, rating, beds_available, specialties, image_url)
                    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
                ''', h)

        # Seed Doctors if table is empty
        doctors_count = query_db("SELECT COUNT(*) as count FROM doctors", one=True)['count']
        if doctors_count == 0:
            doctors_data = [
                (1, 'Dr. Marcus Vance', 'Cardiologist', 'MD, FACC, Harvard Medical', 14, 'm.vance@carenest.org', '+1 (555) 301-1001', 'Mon - Thu (09:00 AM - 03:00 PM)', 650, 4.9),
                (1, 'Dr. Sophia Lin', 'Neurologist', 'MD, PhD, Johns Hopkins', 11, 's.lin@carenest.org', '+1 (555) 301-1002', 'Tue - Sat (10:00 AM - 04:00 PM)', 700, 4.9),
                (2, 'Dr. Arthur Pendelton', 'Orthopedic Surgeon', 'MS (Ortho), Oxford Med', 16, 'a.pendelton@greenvalley.org', '+1 (555) 301-1003', 'Mon - Fri (08:30 AM - 02:30 PM)', 600, 4.8),
                (2, 'Dr. Elena Rostova', 'Dermatologist & Allergist', 'MD (Derm), Stanford', 9, 'e.rostova@greenvalley.org', '+1 (555) 301-1004', 'Mon, Wed, Fri (11:00 AM - 05:00 PM)', 500, 4.9),
                (3, 'Dr. David Kim', 'Pediatrician', 'MD, FAAP, Columbia University', 12, 'd.kim@hopechildren.org', '+1 (555) 301-1005', 'Mon - Sat (09:00 AM - 01:00 PM)', 450, 4.9),
                (4, 'Dr. Rebecca Foster', 'Pulmonologist', 'MD, FCCP, Mayo Clinic Fellow', 15, 'r.foster@stjude.org', '+1 (555) 301-1006', 'Tue - Fri (09:30 AM - 03:30 PM)', 550, 4.8)
            ]
            for d in doctors_data:
                execute_db('''
                    INSERT INTO doctors (hospital_id, name, specialty, qualification, experience_years, contact_email, phone, availability, consultation_fee, rating)
                    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
                ''', d)

        # Seed Medicines if table is empty
        medicines_count = query_db("SELECT COUNT(*) as count FROM medicines", one=True)['count']
        if medicines_count == 0:
            medicines_data = [
                ('Paracetamol Extra 500mg', 'Analgesic & Antipyretic', '1 tablet every 6 hours after meals (Max 4/day)', 'For headache, fever, mild body aches and inflammation.', 'Mild nausea, dizziness if taken on empty stomach', 6.50, 'In Stock', 'GlaxoSmith Bio'),
                ('Amoxicillin Clavulanate 625mg', 'Antibiotic', '1 tablet twice daily for 7 days', 'For bacterial infections of the respiratory tract, ear, and sinus.', 'Digestive upset, loose stools, skin rash', 14.20, 'Prescription Required', 'Apex Pharma Labs'),
                ('Cetirizine Hydrochloride 10mg', 'Antihistamine', '1 tablet daily at bedtime', 'Relief of allergy symptoms, sneezing, runny nose, and hives.', 'Mild drowsiness, dry mouth', 8.00, 'In Stock', 'BioCare Solutions'),
                ('Omeprazole Gastro-Resistant 20mg', 'Antacid & PPI', '1 capsule daily in the morning before breakfast', 'Treatment of acid reflux, heartburn, and stomach ulcers.', 'Headache, abdominal cramps', 11.50, 'In Stock', 'HealWell Health'),
                ('Azithromycin 500mg (3-Day Pack)', 'Antibiotic', '1 tablet once daily for 3 consecutive days', 'For acute bronchitis, sinusitis, and chest infections.', 'Nausea, temporary stomach discomfort', 16.80, 'Prescription Required', 'PharmaCare Global'),
                ('Ibuprofen 400mg Rapid Relief', 'NSAID Anti-inflammatory', '1 tablet every 8 hours with milk or food', 'For joint pain, muscle strain, dental pain, and arthritis.', 'Heartburn, mild stomach irritation', 7.90, 'In Stock', 'MedVance Pharmaceuticals'),
                ('Salbutamol Inhaler 100mcg', 'Respiratory Bronchodilator', '1-2 puffs as needed during wheezing or breathlessness', 'Relief of asthma, bronchospasm, and shortness of breath.', 'Mild tremors, rapid heartbeat', 18.50, 'In Stock', 'AeroHealth Devices'),
                ('Metformin Hydrochloride 500mg', 'Antidiabetic', '1 tablet with dinner daily', 'Blood glucose management in Type 2 Diabetes.', 'Metallic taste, mild nausea initial week', 9.20, 'Prescription Required', 'LifeGlyc Pharma')
            ]
            for m in medicines_data:
                execute_db('''
                    INSERT INTO medicines (name, category, dosage, usage_instructions, side_effects, price, stock_status, manufacturer)
                    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
                ''', m)

        # Seed Symptoms if table is empty
        symptoms_count = query_db("SELECT COUNT(*) as count FROM symptoms", one=True)['count']
        if symptoms_count == 0:
            symptoms_data = [
                ('High Fever (>101°F)', 'General', 2),
                ('Persistent Dry Cough', 'Respiratory', 2),
                ('Chest Tightness / Pain', 'Cardiovascular', 3),
                ('Shortness of Breath', 'Respiratory', 3),
                ('Severe Throbbing Headache', 'Neurology', 2),
                ('Fatigue & Weakness', 'General', 1),
                ('Nausea & Vomiting', 'Digestive', 2),
                ('Joint & Muscle Pain', 'Orthopedic', 1),
                ('Sore Throat & Hoarseness', 'ENT', 1),
                ('Dizziness / Lightheadedness', 'Neurology', 2),
                ('Skin Rash & Itching', 'Dermatology', 1),
                ('Stomach Cramps & Acidity', 'Digestive', 1),
                ('Frequent Sneezing & Runny Nose', 'Allergy', 1)
            ]
            for s in symptoms_data:
                execute_db('''
                    INSERT INTO symptoms (symptom_name, category, severity_weight)
                    VALUES (?, ?, ?)
                ''', s)


# ==========================================
# AUTHENTICATION DECORATORS & GUARDS
# ==========================================

def login_required(f):
    """Ensure user is logged in before accessing protected patient routes."""
    @wraps(f)
    def decorated_function(*args, **kwargs):
        if 'user_id' not in session:
            flash('Please log in first to access CareNest portal.', 'warning')
            return redirect(url_for('login'))
        return f(*args, **kwargs)
    return decorated_function

def admin_required(f):
    """Ensure current user is authenticated as an administrator."""
    @wraps(f)
    def decorated_function(*args, **kwargs):
        if 'user_id' not in session or session.get('role') != 'admin':
            flash('Administrator credentials required to access this portal.', 'danger')
            return redirect(url_for('admin_login'))
        return f(*args, **kwargs)
    return decorated_function


# ==========================================
# AUTHENTICATION & LOGIN-FIRST FLOW ROUTES
# ==========================================

@app.route('/')
def root():
    """
    CRITICAL LOGIN-FIRST FLOW:
    Root URL directly directs unauthenticated guests to login page.
    Authenticated users are directed to their respective dashboards.
    """
    if 'user_id' in session:
        if session.get('role') == 'admin':
            return redirect(url_for('admin_dashboard'))
        return redirect(url_for('dashboard'))
    return redirect(url_for('login'))

@app.route('/login', methods=['GET', 'POST'])
def login():
    """Patient login portal."""
    if request.method == 'POST':
        email = request.form.get('email', '').strip().lower()
        password = request.form.get('password', '')

        if not email or not password:
            flash('Please fill in both email and password.', 'danger')
            return render_template('login.html')

        user = query_db("SELECT * FROM users WHERE email = ?", (email,), one=True)
        if user and check_password_hash(user['password'], password):
            # Establish session
            session.clear()
            session['user_id'] = user['id']
            session['user_name'] = user['name']
            session['user_email'] = user['email']
            session['role'] = user['role']

            flash(f"Welcome back, {user['name']}! Your health portal is ready.", 'success')
            if user['role'] == 'admin':
                return redirect(url_for('admin_dashboard'))
            return redirect(url_for('dashboard'))
        else:
            flash('Invalid email address or password. Please try again.', 'danger')

    return render_template('login.html')

@app.route('/register', methods=['GET', 'POST'])
def register():
    """Patient registration portal."""
    if request.method == 'POST':
        name = request.form.get('name', '').strip()
        email = request.form.get('email', '').strip().lower()
        password = request.form.get('password', '')
        confirm_password = request.form.get('confirm_password', '')
        phone = request.form.get('phone', '').strip()
        blood_group = request.form.get('blood_group', 'Not Specified')
        age = request.form.get('age', 25)
        gender = request.form.get('gender', 'Other')
        allergies = request.form.get('allergies', 'None')
        emergency_contact = request.form.get('emergency_contact', '')

        if not name or not email or not password:
            flash('Name, email, and password are required.', 'danger')
            return render_template('register.html')

        if password != confirm_password:
            flash('Passwords do not match. Please verify.', 'danger')
            return render_template('register.html')

        if len(password) < 6:
            flash('Password should be at least 6 characters long.', 'danger')
            return render_template('register.html')

        # Check existing email
        existing = query_db("SELECT id FROM users WHERE email = ?", (email,), one=True)
        if existing:
            flash('An account with this email already exists. Please log in.', 'warning')
            return redirect(url_for('login'))

        hashed_pwd = generate_password_hash(password)
        try:
            user_id = execute_db('''
                INSERT INTO users (name, email, password, role, phone, blood_group, age, gender, allergies, emergency_contact)
                VALUES (?, ?, ?, 'patient', ?, ?, ?, ?, ?, ?)
            ''', (name, email, hashed_pwd, phone, blood_group, age, gender, allergies, emergency_contact))

            # Auto-login after registration
            session.clear()
            session['user_id'] = user_id
            session['user_name'] = name
            session['user_email'] = email
            session['role'] = 'patient'

            flash('Account created successfully! Welcome to CareNest.', 'success')
            return redirect(url_for('dashboard'))
        except Exception as e:
            flash(f'An error occurred during registration: {str(e)}', 'danger')

    return render_template('register.html')

@app.route('/logout')
def logout():
    """Log out patient or admin and clear session."""
    session.clear()
    flash('You have been safely logged out. Have a healthy day!', 'info')
    return redirect(url_for('login'))


# ==========================================
# PATIENT PORTAL ROUTES
# ==========================================

@app.route('/home')
@login_required
def index():
    """CareNest Home Overview for authenticated members."""
    user = query_db("SELECT * FROM users WHERE id = ?", (session['user_id'],), one=True)
    top_hospitals = query_db("SELECT * FROM hospitals ORDER BY rating DESC LIMIT 3")
    featured_doctors = query_db('''
        SELECT d.*, h.name as hospital_name 
        FROM doctors d 
        LEFT JOIN hospitals h ON d.hospital_id = h.id 
        ORDER BY d.rating DESC LIMIT 3
    ''')
    return render_template('index.html', user=user, top_hospitals=top_hospitals, featured_doctors=featured_doctors)

@app.route('/dashboard')
@login_required
def dashboard():
    """Main patient dashboard."""
    user_id = session['user_id']
    user = query_db("SELECT * FROM users WHERE id = ?", (user_id,), one=True)
    reports = query_db("SELECT * FROM reports WHERE user_id = ? ORDER BY created_at DESC LIMIT 4", (user_id,))
    appointments = query_db('''
        SELECT a.*, d.name as doctor_name, d.specialty as doctor_specialty, h.name as hospital_name
        FROM appointments a
        JOIN doctors d ON a.doctor_id = d.id
        JOIN hospitals h ON a.hospital_id = h.id
        WHERE a.user_id = ?
        ORDER BY a.appointment_date ASC
    ''', (user_id,))
    
    total_reports = query_db("SELECT COUNT(*) as c FROM reports WHERE user_id = ?", (user_id,), one=True)['c']
    total_appointments = query_db("SELECT COUNT(*) as c FROM appointments WHERE user_id = ?", (user_id,), one=True)['c']
    hospitals_count = query_db("SELECT COUNT(*) as c FROM hospitals", one=True)['c']
    doctors_count = query_db("SELECT COUNT(*) as c FROM doctors", one=True)['c']

    return render_template(
        'dashboard.html', 
        user=user, 
        reports=reports, 
        appointments=appointments,
        total_reports=total_reports,
        total_appointments=total_appointments,
        hospitals_count=hospitals_count,
        doctors_count=doctors_count
    )

@app.route('/symptom-checker', methods=['GET', 'POST'])
@login_required
def symptom_checker():
    """Interactive Symptom Checker & Health Assessment with report generator."""
    all_symptoms = query_db("SELECT * FROM symptoms ORDER BY category, symptom_name")
    
    assessment_result = None
    if request.method == 'POST':
        selected_symptom_names = request.form.getlist('symptoms')
        duration = request.form.get('duration', '1-3 Days')
        additional_notes = request.form.get('additional_notes', '')

        if not selected_symptom_names:
            flash('Please select at least one symptom for assessment.', 'warning')
        else:
            # Clinical Rule Assessment Engine
            selected_count = len(selected_symptom_names)
            has_chest_pain = any('chest' in s.lower() for s in selected_symptom_names)
            has_breathless = any('breath' in s.lower() or 'shortness' in s.lower() for s in selected_symptom_names)
            has_fever = any('fever' in s.lower() for s in selected_symptom_names)
            has_headache = any('headache' in s.lower() or 'dizziness' in s.lower() for s in selected_symptom_names)
            has_digestive = any('nausea' in s.lower() or 'cramps' in s.lower() for s in selected_symptom_names)
            has_respiratory = any('cough' in s.lower() or 'throat' in s.lower() or 'sneezing' in s.lower() for s in selected_symptom_names)

            if has_chest_pain or (has_breathless and has_fever):
                severity = 'High Priority'
                specialist = 'Emergency Physician / Cardiologist'
                diagnosis = 'Potential acute cardiovascular or severe pulmonary condition requiring rapid evaluation.'
                precautions = 'Avoid strenuous exertion. Seek immediate clinical assessment or visit nearest emergency room.'
            elif selected_count >= 3 or has_breathless or (has_fever and has_respiratory):
                severity = 'Moderate'
                specialist = 'Pulmonologist / Internal Medicine'
                diagnosis = 'Acute viral/bacterial respiratory infection or systemic inflammation.'
                precautions = 'Rest adequately, maintain oral rehydration, steam inhalation, and isolate if fever persists.'
            elif has_digestive:
                severity = 'Mild to Moderate'
                specialist = 'Gastroenterologist / General Physician'
                diagnosis = 'Gastrointestinal upset, acid reflux or mild food intolerance.'
                precautions = 'Consume light, non-spicy meals, drink electrolyte fluids, avoid caffeine and dairy.'
            elif has_headache:
                severity = 'Mild'
                specialist = 'Neurologist / General Practitioner'
                diagnosis = 'Tension headache, stress response, or mild ocular strain.'
                precautions = 'Ensure 8 hours of sleep, stay well-hydrated, reduce screen time, check blood pressure.'
            else:
                severity = 'Mild'
                specialist = 'General Physician'
                diagnosis = 'Mild seasonal discomfort or early symptom onset.'
                precautions = 'Monitor condition for 48 hours, stay warm, maintain balanced nutrition.'

            symptoms_str = ", ".join(selected_symptom_names)
            report_title = f"Health Check Assessment ({datetime.now().strftime('%b %d, %Y')})"

            # Auto-save report if requested or default
            report_id = execute_db('''
                INSERT INTO reports (user_id, report_title, symptoms_logged, diagnosis_summary, severity_level, recommended_specialist, precautions, notes)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?)
            ''', (
                session['user_id'],
                report_title,
                symptoms_str,
                diagnosis,
                severity,
                specialist,
                precautions,
                f"Duration: {duration}. Notes: {additional_notes}"
            ))

            flash('Assessment generated and saved securely to your Health Reports!', 'success')
            assessment_result = {
                'id': report_id,
                'title': report_title,
                'symptoms': selected_symptom_names,
                'severity': severity,
                'specialist': specialist,
                'diagnosis': diagnosis,
                'precautions': precautions,
                'duration': duration,
                'notes': additional_notes
            }

    return render_template('symptom_checker.html', all_symptoms=all_symptoms, assessment=assessment_result)

@app.route('/hospitals')
@login_required
def hospitals():
    """Directory of nearby hospitals and clinic facilities."""
    search_query = request.args.get('search', '').strip()
    city_filter = request.args.get('city', '').strip()

    sql = "SELECT * FROM hospitals WHERE 1=1"
    params = []

    if search_query:
        sql += " AND (name LIKE ? OR specialties LIKE ? OR address LIKE ?)"
        params.extend([f'%{search_query}%', f'%{search_query}%', f'%{search_query}%'])

    if city_filter:
        sql += " AND city = ?"
        params.append(city_filter)

    sql += " ORDER BY rating DESC"
    hospital_list = query_db(sql, params)
    cities = query_db("SELECT DISTINCT city FROM hospitals ORDER BY city")
    doctors = query_db("SELECT d.*, h.name as hospital_name FROM doctors d JOIN hospitals h ON d.hospital_id = h.id")

    return render_template('hospitals.html', hospitals=hospital_list, cities=cities, doctors=doctors, current_search=search_query, current_city=city_filter)

@app.route('/medicines')
@login_required
def medicines():
    """Medicine knowledge base & dosage guidance."""
    search_query = request.args.get('search', '').strip()
    category_filter = request.args.get('category', '').strip()

    sql = "SELECT * FROM medicines WHERE 1=1"
    params = []

    if search_query:
        sql += " AND (name LIKE ? OR usage_instructions LIKE ? OR manufacturer LIKE ?)"
        params.extend([f'%{search_query}%', f'%{search_query}%', f'%{search_query}%'])

    if category_filter:
        sql += " AND category = ?"
        params.append(category_filter)

    sql += " ORDER BY name ASC"
    medicine_list = query_db(sql, params)
    categories = query_db("SELECT DISTINCT category FROM medicines ORDER BY category")

    return render_template('medicines.html', medicines=medicine_list, categories=categories, current_search=search_query, current_category=category_filter)

@app.route('/reports')
@login_required
def reports():
    """Patient's saved health checkup and symptom assessment reports."""
    user_id = session['user_id']
    user = query_db("SELECT * FROM users WHERE id = ?", (user_id,), one=True)
    report_list = query_db("SELECT * FROM reports WHERE user_id = ? ORDER BY created_at DESC", (user_id,))
    return render_template('reports.html', user=user, reports=report_list)

@app.route('/reports/delete/<int:report_id>', methods=['POST'])
@login_required
def delete_report(report_id):
    """Delete a specific report owned by the patient."""
    user_id = session['user_id']
    execute_db("DELETE FROM reports WHERE id = ? AND user_id = ?", (report_id, user_id))
    flash('Health report deleted successfully.', 'info')
    return redirect(url_for('reports'))

@app.route('/profile', methods=['GET', 'POST'])
@login_required
def profile():
    """View and update patient profile & emergency medical card."""
    user_id = session['user_id']
    if request.method == 'POST':
        name = request.form.get('name', '').strip()
        phone = request.form.get('phone', '').strip()
        blood_group = request.form.get('blood_group', '')
        age = request.form.get('age', 25)
        gender = request.form.get('gender', '')
        allergies = request.form.get('allergies', '')
        emergency_contact = request.form.get('emergency_contact', '')

        if not name:
            flash('Name cannot be empty.', 'danger')
        else:
            execute_db('''
                UPDATE users 
                SET name = ?, phone = ?, blood_group = ?, age = ?, gender = ?, allergies = ?, emergency_contact = ?
                WHERE id = ?
            ''', (name, phone, blood_group, age, gender, allergies, emergency_contact, user_id))
            session['user_name'] = name
            flash('Your profile and medical information have been updated.', 'success')
            return redirect(url_for('profile'))

    user = query_db("SELECT * FROM users WHERE id = ?", (user_id,), one=True)
    return render_template('profile.html', user=user)

@app.route('/book-appointment', methods=['POST'])
@login_required
def book_appointment():
    """Book a new doctor appointment."""
    user_id = session['user_id']
    doctor_id = request.form.get('doctor_id')
    hospital_id = request.form.get('hospital_id')
    appointment_date = request.form.get('appointment_date')
    appointment_time = request.form.get('appointment_time')
    reason = request.form.get('reason', 'General Health Consultation')

    if not doctor_id or not hospital_id or not appointment_date or not appointment_time:
        flash('Please fill all required appointment details.', 'danger')
        return redirect(url_for('hospitals'))

    execute_db('''
        INSERT INTO appointments (user_id, doctor_id, hospital_id, appointment_date, appointment_time, status, reason)
        VALUES (?, ?, ?, ?, ?, 'Confirmed', ?)
    ''', (user_id, doctor_id, hospital_id, appointment_date, appointment_time, reason))

    flash('Doctor consultation successfully scheduled! View in your dashboard.', 'success')
    return redirect(url_for('dashboard'))


# ==========================================
# ADMIN PORTAL ROUTES
# ==========================================

@app.route('/admin/login', methods=['GET', 'POST'])
def admin_login():
    """Administrative security gate."""
    if request.method == 'POST':
        email = request.form.get('email', '').strip().lower()
        password = request.form.get('password', '')

        user = query_db("SELECT * FROM users WHERE email = ?", (email,), one=True)
        if user and check_password_hash(user['password'], password) and user['role'] == 'admin':
            session.clear()
            session['user_id'] = user['id']
            session['user_name'] = user['name']
            session['user_email'] = user['email']
            session['role'] = 'admin'

            flash('Welcome, Administrator. CareNest Management Console loaded.', 'success')
            return redirect(url_for('admin_dashboard'))
        else:
            flash('Invalid administrator credentials.', 'danger')

    return render_template('admin_login.html')

@app.route('/admin/logout')
def admin_logout():
    """Log out admin."""
    session.clear()
    flash('Admin session securely terminated.', 'info')
    return redirect(url_for('admin_login'))

@app.route('/admin/dashboard')
@admin_required
def admin_dashboard():
    """Administrative overview and health system metrics."""
    stats = {
        'total_patients': query_db("SELECT COUNT(*) as c FROM users WHERE role = 'patient'", one=True)['c'],
        'total_doctors': query_db("SELECT COUNT(*) as c FROM doctors", one=True)['c'],
        'total_hospitals': query_db("SELECT COUNT(*) as c FROM hospitals", one=True)['c'],
        'total_medicines': query_db("SELECT COUNT(*) as c FROM medicines", one=True)['c'],
        'total_reports': query_db("SELECT COUNT(*) as c FROM reports", one=True)['c'],
        'total_appointments': query_db("SELECT COUNT(*) as c FROM appointments", one=True)['c'],
    }
    
    recent_users = query_db("SELECT * FROM users ORDER BY created_at DESC LIMIT 5")
    recent_appointments = query_db('''
        SELECT a.*, u.name as patient_name, d.name as doctor_name, h.name as hospital_name
        FROM appointments a
        JOIN users u ON a.user_id = u.id
        JOIN doctors d ON a.doctor_id = d.id
        JOIN hospitals h ON a.hospital_id = h.id
        ORDER BY a.created_at DESC LIMIT 5
    ''')

    return render_template('admin_dashboard.html', stats=stats, recent_users=recent_users, recent_appointments=recent_appointments)

@app.route('/admin/doctors', methods=['GET', 'POST'])
@admin_required
def manage_doctors():
    """Admin: Add, view, edit doctors."""
    if request.method == 'POST':
        action = request.form.get('action', 'add')
        
        if action == 'add':
            hospital_id = request.form.get('hospital_id')
            name = request.form.get('name')
            specialty = request.form.get('specialty')
            qualification = request.form.get('qualification')
            experience_years = request.form.get('experience_years', 5)
            contact_email = request.form.get('contact_email')
            phone = request.form.get('phone')
            availability = request.form.get('availability', 'Mon - Fri (09:00 AM - 04:00 PM)')
            consultation_fee = request.form.get('consultation_fee', 500)

            execute_db('''
                INSERT INTO doctors (hospital_id, name, specialty, qualification, experience_years, contact_email, phone, availability, consultation_fee)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
            ''', (hospital_id, name, specialty, qualification, experience_years, contact_email, phone, availability, consultation_fee))
            flash(f"Doctor '{name}' added successfully.", 'success')

        elif action == 'delete':
            doc_id = request.form.get('doctor_id')
            execute_db("DELETE FROM doctors WHERE id = ?", (doc_id,))
            flash('Doctor profile removed.', 'info')

        return redirect(url_for('manage_doctors'))

    doctors = query_db('''
        SELECT d.*, h.name as hospital_name 
        FROM doctors d 
        LEFT JOIN hospitals h ON d.hospital_id = h.id 
        ORDER BY d.id DESC
    ''')
    hospitals = query_db("SELECT id, name FROM hospitals ORDER BY name")
    return render_template('manage_doctors.html', doctors=doctors, hospitals=hospitals)

@app.route('/admin/medicines', methods=['GET', 'POST'])
@admin_required
def manage_medicines():
    """Admin: Add, view, delete medicines."""
    if request.method == 'POST':
        action = request.form.get('action', 'add')
        
        if action == 'add':
            name = request.form.get('name')
            category = request.form.get('category')
            dosage = request.form.get('dosage')
            usage_instructions = request.form.get('usage_instructions')
            side_effects = request.form.get('side_effects', 'None reported')
            price = request.form.get('price', 10.0)
            stock_status = request.form.get('stock_status', 'In Stock')
            manufacturer = request.form.get('manufacturer', 'Pharma Lab')

            execute_db('''
                INSERT INTO medicines (name, category, dosage, usage_instructions, side_effects, price, stock_status, manufacturer)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?)
            ''', (name, category, dosage, usage_instructions, side_effects, price, stock_status, manufacturer))
            flash(f"Medicine '{name}' cataloged.", 'success')

        elif action == 'delete':
            med_id = request.form.get('medicine_id')
            execute_db("DELETE FROM medicines WHERE id = ?", (med_id,))
            flash('Medicine removed from database.', 'info')

        return redirect(url_for('manage_medicines'))

    medicines = query_db("SELECT * FROM medicines ORDER BY id DESC")
    return render_template('manage_medicines.html', medicines=medicines)

@app.route('/admin/hospitals', methods=['GET', 'POST'])
@admin_required
def manage_hospitals():
    """Admin: Add, view, delete hospitals."""
    if request.method == 'POST':
        action = request.form.get('action', 'add')
        
        if action == 'add':
            name = request.form.get('name')
            city = request.form.get('city')
            address = request.form.get('address')
            phone = request.form.get('phone')
            emergency_phone = request.form.get('emergency_phone')
            beds_available = request.form.get('beds_available', 50)
            specialties = request.form.get('specialties')
            image_url = request.form.get('image_url', 'https://images.unsplash.com/photo-1587351021759-3e566b6af7cc?w=600&auto=format&fit=crop&q=80')

            execute_db('''
                INSERT INTO hospitals (name, city, address, phone, emergency_phone, beds_available, specialties, image_url)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?)
            ''', (name, city, address, phone, emergency_phone, beds_available, specialties, image_url))
            flash(f"Hospital '{name}' registered in network.", 'success')

        elif action == 'delete':
            hosp_id = request.form.get('hospital_id')
            execute_db("DELETE FROM hospitals WHERE id = ?", (hosp_id,))
            flash('Hospital deregistered from network.', 'info')

        return redirect(url_for('manage_hospitals'))

    hospitals = query_db("SELECT * FROM hospitals ORDER BY id DESC")
    return render_template('manage_hospitals.html', hospitals=hospitals)

@app.route('/admin/analytics')
@admin_required
def analytics():
    """Admin: System analytics, reports overview and Chart.js telemetry."""
    all_reports = query_db('''
        SELECT r.*, u.name as user_name, u.email as user_email
        FROM reports r
        JOIN users u ON r.user_id = u.id
        ORDER BY r.created_at DESC LIMIT 10
    ''')
    
    # Statistical aggregations for Chart.js
    severity_counts = {
        'Mild': query_db("SELECT COUNT(*) as c FROM reports WHERE severity_level LIKE '%Mild%'", one=True)['c'],
        'Moderate': query_db("SELECT COUNT(*) as c FROM reports WHERE severity_level LIKE '%Moderate%'", one=True)['c'],
        'High Priority': query_db("SELECT COUNT(*) as c FROM reports WHERE severity_level LIKE '%High%'", one=True)['c'],
    }

    category_meds = query_db('''
        SELECT category, COUNT(*) as count FROM medicines GROUP BY category ORDER BY count DESC LIMIT 6
    ''')

    return render_template(
        'analytics.html', 
        reports=all_reports,
        severity_counts=severity_counts,
        category_meds=category_meds
    )


# ==========================================
# BOOTSTRAP ENTRY POINT
# ==========================================

if __name__ == '__main__':
    # Initialize DB schema and seed demo records
    init_db()
    print("==================================================")
    print(" CARENEST HEALTHCARE PORTAL READY")
    print(" Running on: http://127.0.0.1:5000")
    print(" Demo Patient: sarah.jenkins@example.com / patient123")
    print(" Demo Admin:   admin@carenest.com / admin123")
    print("==================================================")
    app.run(debug=True, host='0.0.0.0', port=5000)
