export interface ProjectFile {
  path: string;
  filename: string;
  category: 'python' | 'template' | 'static' | 'doc';
  description: string;
  code: string;
}

export const carenestFlaskFiles: ProjectFile[] = [
  {
    path: 'requirements.txt',
    filename: 'requirements.txt',
    category: 'python',
    description: 'Python dependencies to install using pip',
    code: `Flask==3.0.3
Werkzeug==3.0.3
`
  },
  {
    path: 'app.py',
    filename: 'app.py',
    category: 'python',
    description: 'Main Flask backend application, SQLite database engine, auth decorators, and all patient/admin routes',
    code: `import os
import sqlite3
from datetime import datetime
from functools import wraps
from flask import (
    Flask,
    render_template,
    request,
    redirect,
    url_for,
    session,
    flash,
    g,
    jsonify
)
from werkzeug.security import generate_password_hash, check_password_hash

app = Flask(__name__)
app.config['SECRET_KEY'] = 'carenest-super-secret-key-2026-medical-portal'
DATABASE = os.path.join(os.path.abspath(os.path.dirname(__file__)), 'carenest.db')

def get_db():
    if 'db' not in g:
        g.db = sqlite3.connect(DATABASE)
        g.db.row_factory = sqlite3.Row
    return g.db

@app.teardown_appcontext
def close_db(error):
    db = g.pop('db', None)
    if db is not None:
        db.close()

def init_db():
    with sqlite3.connect(DATABASE) as conn:
        cursor = conn.cursor()
        
        cursor.execute('''
            CREATE TABLE IF NOT EXISTS users (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                name TEXT NOT NULL,
                email TEXT UNIQUE NOT NULL,
                password TEXT NOT NULL,
                role TEXT NOT NULL DEFAULT 'patient',
                phone TEXT,
                blood_group TEXT,
                age INTEGER,
                gender TEXT,
                allergies TEXT,
                emergency_contact TEXT,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        ''')
        
        cursor.execute('''
            CREATE TABLE IF NOT EXISTS hospitals (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                name TEXT NOT NULL,
                city TEXT NOT NULL,
                address TEXT NOT NULL,
                phone TEXT NOT NULL,
                emergency_phone TEXT,
                rating REAL DEFAULT 4.8,
                beds_available INTEGER DEFAULT 50,
                specialties TEXT NOT NULL,
                image_url TEXT
            )
        ''')
        
        cursor.execute('''
            CREATE TABLE IF NOT EXISTS doctors (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                hospital_id INTEGER,
                name TEXT NOT NULL,
                specialty TEXT NOT NULL,
                qualification TEXT NOT NULL,
                experience_years INTEGER NOT NULL,
                contact_email TEXT,
                phone TEXT,
                availability TEXT,
                consultation_fee REAL DEFAULT 500.0,
                rating REAL DEFAULT 4.9,
                FOREIGN KEY (hospital_id) REFERENCES hospitals (id) ON DELETE SET NULL
            )
        ''')
        
        cursor.execute('''
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
        
        cursor.execute('''
            CREATE TABLE IF NOT EXISTS symptoms (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                symptom_name TEXT NOT NULL,
                category TEXT NOT NULL,
                severity_weight INTEGER DEFAULT 1
            )
        ''')
        
        cursor.execute('''
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
                FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE
            )
        ''')
        
        cursor.execute('''
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
                FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE,
                FOREIGN KEY (doctor_id) REFERENCES doctors (id) ON DELETE CASCADE,
                FOREIGN KEY (hospital_id) REFERENCES hospitals (id) ON DELETE CASCADE
            )
        ''')
        
        # Seed Admin and Demo Data
        cursor.execute("SELECT id FROM users WHERE email = 'admin@carenest.com'")
        if not cursor.fetchone():
            admin_pwd = generate_password_hash('admin123')
            cursor.execute('''
                INSERT INTO users (name, email, password, role, phone, blood_group, age, gender)
                VALUES ('Dr. Evelyn Vance (Chief Admin)', 'admin@carenest.com', ?, 'admin', '+1 (800) 555-0199', 'O+', 38, 'Other')
            ''', (admin_pwd,))
            
            patient_pwd = generate_password_hash('patient123')
            cursor.execute('''
                INSERT INTO users (name, email, password, role, phone, blood_group, age, gender, allergies, emergency_contact)
                VALUES ('Sarah Jenkins', 'sarah.jenkins@example.com', ?, 'patient', '+1 (555) 234-5678', 'A+', 29, 'Select your gender', 'Penicillin, Peanuts', 'Robert Jenkins (+1 555-987-6543)')
            ''', (patient_pwd,))

        cursor.execute("SELECT COUNT(*) FROM hospitals")
        if cursor.fetchone()[0] == 0:
            cursor.executemany('''
                INSERT INTO hospitals (name, city, address, phone, emergency_phone, rating, beds_available, specialties, image_url)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
            ''', [
                ('CareNest Central Apex Hospital', 'Metro City', '742 Evergreen Terrace, Medical District', '+1 (555) 012-3456', '+1 (555) 911-0001', 4.9, 120, 'Cardiology, Neurology, Emergency, Pediatrics', 'https://images.unsplash.com/photo-1587351021759-3e566b6af7cc?w=600&auto=format&fit=crop&q=80'),
                ('Green Valley Multispecialty Center', 'Green Valley', '104 Healthcare Boulevard', '+1 (555) 019-8765', '+1 (555) 911-0002', 4.8, 85, 'Orthopedics, General Medicine, Dermatology', 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=600&auto=format&fit=crop&q=80'),
                ('Hope Children & Family Hospital', 'Riverside', '321 Hope Way, Riverside Center', '+1 (555) 014-9988', '+1 (555) 911-0003', 4.9, 64, 'Pediatrics, Gynecology, Neonatology', 'https://images.unsplash.com/photo-1516549655169-df83a0774514?w=600&auto=format&fit=crop&q=80'),
                ('St. Jude Cardio & Oncology Institute', 'Metro City', '88 Pulse Avenue, Biotech Park', '+1 (555) 018-2233', '+1 (555) 911-0004', 4.7, 95, 'Cardiology, Oncology, Pulmonology', 'https://images.unsplash.com/photo-1586773860418-d37222d8fce3?w=600&auto=format&fit=crop&q=80')
            ])

        cursor.execute("SELECT COUNT(*) FROM doctors")
        if cursor.fetchone()[0] == 0:
            cursor.executemany('''
                INSERT INTO doctors (hospital_id, name, specialty, qualification, experience_years, contact_email, phone, availability, consultation_fee, rating)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            ''', [
                (1, 'Dr. Marcus Vance', 'Cardiologist', 'MD, FACC, Harvard Medical', 14, 'm.vance@carenest.org', '+1 (555) 301-1001', 'Mon - Thu (09:00 AM - 03:00 PM)', 650.0, 4.9),
                (1, 'Dr. Sophia Lin', 'Neurologist', 'MD, PhD, Johns Hopkins', 11, 's.lin@carenest.org', '+1 (555) 301-1002', 'Tue - Sat (10:00 AM - 04:00 PM)', 700.0, 4.9),
                (2, 'Dr. Arthur Pendelton', 'Orthopedic Surgeon', 'MS (Ortho), Oxford Med', 16, 'a.pendelton@greenvalley.org', '+1 (555) 301-1003', 'Mon - Fri (08:30 AM - 02:30 PM)', 600.0, 4.8),
                (2, 'Dr. Elena Rostova', 'Dermatologist & Allergist', 'MD (Derm), Stanford', 9, 'e.rostova@greenvalley.org', '+1 (555) 301-1004', 'Mon, Wed, Fri (11:00 AM - 05:00 PM)', 500.0, 4.9),
                (3, 'Dr. David Kim', 'Pediatrician', 'MD, FAAP, Columbia University', 12, 'd.kim@hopechildren.org', '+1 (555) 301-1005', 'Mon - Sat (09:00 AM - 01:00 PM)', 450.0, 4.9),
                (4, 'Dr. Rebecca Foster', 'Pulmonologist', 'MD, FCCP, Mayo Clinic Fellow', 15, 'r.foster@stjude.org', '+1 (555) 301-1006', 'Tue - Fri (09:30 AM - 03:30 PM)', 550.0, 4.8)
            ])

        cursor.execute("SELECT COUNT(*) FROM medicines")
        if cursor.fetchone()[0] == 0:
            cursor.executemany('''
                INSERT INTO medicines (name, category, dosage, usage_instructions, side_effects, price, stock_status, manufacturer)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?)
            ''', [
                ('Paracetamol Extra 500mg', 'Analgesic & Antipyretic', '1 tablet every 6 hours after meals (Max 4/day)', 'For headache, fever, mild body aches and inflammation.', 'Mild nausea if taken on empty stomach', 6.50, 'In Stock', 'GlaxoSmith Bio'),
                ('Amoxicillin Clavulanate 625mg', 'Antibiotic', '1 tablet twice daily for 7 days', 'For bacterial infections of the respiratory tract, ear, and sinus.', 'Digestive upset, loose stools', 14.20, 'Prescription Required', 'Apex Pharma Labs'),
                ('Cetirizine Hydrochloride 10mg', 'Antihistamine', '1 tablet daily at bedtime', 'Relief of allergy symptoms, sneezing, runny nose, and hives.', 'Mild drowsiness, dry mouth', 8.00, 'In Stock', 'BioCare Solutions'),
                ('Omeprazole Gastro-Resistant 20mg', 'Antacid & PPI', '1 capsule daily in morning before breakfast', 'Treatment of acid reflux, heartburn, and stomach ulcers.', 'Headache, abdominal cramps', 11.50, 'In Stock', 'HealWell Health'),
                ('Azithromycin 500mg (3-Day Pack)', 'Antibiotic', '1 tablet once daily for 3 consecutive days', 'For acute bronchitis, sinusitis, and chest infections.', 'Nausea, temporary stomach discomfort', 16.80, 'Prescription Required', 'PharmaCare Global'),
                ('Ibuprofen 400mg Rapid Relief', 'NSAID Anti-inflammatory', '1 tablet every 8 hours with milk or food', 'For joint pain, muscle strain, dental pain, and arthritis.', 'Heartburn, mild stomach irritation', 7.90, 'In Stock', 'MedVance Pharmaceuticals'),
                ('Salbutamol Inhaler 100mcg', 'Respiratory Bronchodilator', '1-2 puffs as needed during wheezing', 'Relief of asthma, bronchospasm, and shortness of breath.', 'Mild tremors, rapid heartbeat', 18.50, 'In Stock', 'AeroHealth Devices'),
                ('Metformin Hydrochloride 500mg', 'Antidiabetic', '1 tablet with dinner daily', 'Blood glucose management in Type 2 Diabetes.', 'Metallic taste, mild nausea initial week', 9.20, 'Prescription Required', 'LifeGlyc Pharma')
            ])

        cursor.execute("SELECT COUNT(*) FROM symptoms")
        if cursor.fetchone()[0] == 0:
            cursor.executemany('''
                INSERT INTO symptoms (symptom_name, category, severity_weight)
                VALUES (?, ?, ?)
            ''', [
                ('High Fever (>101°F)', 'General', 2),
                ('Persistent Dry Cough', 'Respiratory', 2),
                ('Chest Tightness / Pain', 'Cardiovascular', 3),
                ('Shortness of Breath', 'Respiratory', 3),
                ('Severe Throbbing Headache', 'Neurology', 2),
                ('Fatigue & Muscle Weakness', 'General', 1),
                ('Nausea & Gastrointestinal Upset', 'Digestive', 2),
                ('Joint & Back Pain', 'Orthopedic', 1),
                ('Sore Throat & Hoarseness', 'ENT', 1),
                ('Dizziness / Lightheadedness', 'Neurology', 2),
                ('Skin Rash & Itching', 'Dermatology', 1),
                ('Stomach Cramps & Acidity', 'Digestive', 1),
                ('Frequent Sneezing & Runny Nose', 'Allergy', 1)
            ])

        cursor.execute("SELECT COUNT(*) FROM reports")
        if cursor.fetchone()[0] == 0:
            cursor.execute('''
                INSERT INTO reports (user_id, report_title, symptoms_logged, diagnosis_summary, severity_level, recommended_specialist, precautions, notes, created_at)
                VALUES (2, 'Seasonal Respiratory Assessment', 'Dry cough, Mild fever, Nasal congestion', 'Probable upper respiratory viral tract infection with low inflammatory markers.', 'Mild', 'General Physician / Pulmonologist', 'Stay hydrated, inhale warm steam, take Vitamin C, avoid cold environments.', 'Recommended to rest for 48 hours. Monitor temperature twice daily.', '2026-02-28 10:30:00')
            ''')
            cursor.execute('''
                INSERT INTO reports (user_id, report_title, symptoms_logged, diagnosis_summary, severity_level, recommended_specialist, precautions, notes, created_at)
                VALUES (2, 'Cardiopulmonary Screening', 'Shortness of breath, Fatigue & Weakness', 'Mild exercise-induced bronchospasm or physical deconditioning.', 'Moderate', 'Pulmonologist', 'Avoid heavy dust exposures, keep emergency bronchodilator on hand.', 'Schedule spirometry lung function test.', '2026-02-15 14:15:00')
            ''')

        cursor.execute("SELECT COUNT(*) FROM appointments")
        if cursor.fetchone()[0] == 0:
            cursor.execute('''
                INSERT INTO appointments (user_id, doctor_id, hospital_id, appointment_date, appointment_time, status, reason, created_at)
                VALUES (2, 1, 1, '2026-03-08', '10:30 AM', 'Confirmed', 'Annual cardiovascular checkup & blood pressure review', '2026-03-01 09:00:00')
            ''')
            cursor.execute('''
                INSERT INTO appointments (user_id, doctor_id, hospital_id, appointment_date, appointment_time, status, reason, created_at)
                VALUES (2, 6, 4, '2026-03-14', '02:00 PM', 'Confirmed', 'Follow-up on seasonal cough and lung allergy evaluation', '2026-03-01 11:20:00')
            ''')

        conn.commit()

# Route Protectors
def login_required(f):
    @wraps(f)
    def decorated_function(*args, **kwargs):
        if 'user_id' not in session:
            flash('Please log in first to access CareNest clinical features.', 'warning')
            return redirect(url_for('login'))
        return f(*args, **kwargs)
    return decorated_function

def admin_required(f):
    @wraps(f)
    def decorated_function(*args, **kwargs):
        if 'user_id' not in session or session.get('role') != 'admin':
            flash('Unauthorized access. Administrative privileges required.', 'danger')
            return redirect(url_for('admin_login'))
        return f(*args, **kwargs)
    return decorated_function

# Root / Auth Routes
@app.route('/')
def root():
    if 'user_id' in session:
        if session.get('role') == 'admin':
            return redirect(url_for('admin_dashboard'))
        return redirect(url_for('dashboard'))
    return redirect(url_for('login'))

@app.route('/login', methods=['GET', 'POST'])
def login():
    if 'user_id' in session:
        return redirect(url_for('dashboard') if session.get('role') == 'patient' else url_for('admin_dashboard'))
        
    if request.method == 'POST':
        email = request.form.get('email', '').strip().lower()
        password = request.form.get('password', '')
        
        db = get_db()
        user = db.execute("SELECT * FROM users WHERE email = ?", (email,)).fetchone()
        
        if user and check_password_hash(user['password'], password):
            session['user_id'] = user['id']
            session['name'] = user['name']
            session['email'] = user['email']
            session['role'] = user['role']
            session['blood_group'] = user['blood_group']
            
            flash(f"Welcome back, {user['name']}!", 'success')
            if user['role'] == 'admin':
                return redirect(url_for('admin_dashboard'))
            return redirect(url_for('dashboard'))
        else:
            flash('Invalid email or password. Please try again.', 'danger')
            
    return render_template('login.html')

@app.route('/register', methods=['GET', 'POST'])
def register():
    if 'user_id' in session:
        return redirect(url_for('dashboard'))
        
    if request.method == 'POST':
        name = request.form.get('name', '').strip()
        email = request.form.get('email', '').strip().lower()
        password = request.form.get('password', '')
        confirm_password = request.form.get('confirm_password', '')
        phone = request.form.get('phone', '').strip()
        blood_group = request.form.get('blood_group', 'O+')
        age = request.form.get('age', 25)
        gender = request.form.get('gender', 'Female')
        allergies = request.form.get('allergies', 'None').strip()
        emergency_contact = request.form.get('emergency_contact', '').strip()
        
        if not name or not email or not password:
            flash('Please fill in all mandatory fields.', 'warning')
            return render_template('register.html')
            
        if password != confirm_password:
            flash('Passwords do not match. Please re-enter.', 'danger')
            return render_template('register.html')
            
        db = get_db()
        existing = db.execute("SELECT id FROM users WHERE email = ?", (email,)).fetchone()
        if existing:
            flash('An account with this email address already exists. Please login.', 'warning')
            return redirect(url_for('login'))
            
        hashed_password = generate_password_hash(password)
        db.execute('''
            INSERT INTO users (name, email, password, role, phone, blood_group, age, gender, allergies, emergency_contact)
            VALUES (?, ?, ?, 'patient', ?, ?, ?, ?, ?, ?)
        ''', (name, email, hashed_password, phone, blood_group, age, gender, allergies, emergency_contact))
        db.commit()
        
        new_user = db.execute("SELECT * FROM users WHERE email = ?", (email,)).fetchone()
        session['user_id'] = new_user['id']
        session['name'] = new_user['name']
        session['email'] = new_user['email']
        session['role'] = 'patient'
        session['blood_group'] = new_user['blood_group']
        
        flash('Account successfully registered! Welcome to CareNest.', 'success')
        return redirect(url_for('dashboard'))
        
    return render_template('register.html')

@app.route('/logout')
def logout():
    session.clear()
    flash('You have been logged out securely.', 'info')
    return redirect(url_for('login'))

# Patient Portal Routes
@app.route('/home')
@login_required
def home():
    db = get_db()
    hospitals = db.execute("SELECT * FROM hospitals LIMIT 3").fetchall()
    doctors = db.execute('''
        SELECT d.*, h.name as hospital_name 
        FROM doctors d 
        LEFT JOIN hospitals h ON d.hospital_id = h.id 
        LIMIT 3
    ''').fetchall()
    return render_template('index.html', hospitals=hospitals, doctors=doctors)

@app.route('/dashboard')
@login_required
def dashboard():
    db = get_db()
    user_id = session['user_id']
    user = db.execute("SELECT * FROM users WHERE id = ?", (user_id,)).fetchone()
    reports = db.execute("SELECT * FROM reports WHERE user_id = ? ORDER BY created_at DESC", (user_id,)).fetchall()
    appointments = db.execute('''
        SELECT a.*, d.name as doctor_name, d.specialty as doctor_specialty, h.name as hospital_name
        FROM appointments a
        JOIN doctors d ON a.doctor_id = d.id
        JOIN hospitals h ON a.hospital_id = h.id
        WHERE a.user_id = ?
        ORDER BY a.appointment_date ASC
    ''', (user_id,)).fetchall()
    
    total_hospitals = db.execute("SELECT COUNT(*) FROM hospitals").fetchone()[0]
    total_doctors = db.execute("SELECT COUNT(*) FROM doctors").fetchone()[0]
    
    return render_template(
        'dashboard.html',
        user=user,
        reports=reports,
        appointments=appointments,
        total_hospitals=total_hospitals,
        total_doctors=total_doctors
    )

@app.route('/symptom-checker', methods=['GET', 'POST'])
@login_required
def symptom_checker():
    db = get_db()
    symptoms_list = db.execute("SELECT * FROM symptoms ORDER BY category, symptom_name").fetchall()
    
    if request.method == 'POST':
        selected_symptoms = request.form.getlist('symptoms')
        duration = request.form.get('duration', '1-3 Days')
        notes = request.form.get('notes', '')
        
        if not selected_symptoms:
            flash('Please select at least one symptom for evaluation.', 'warning')
            return render_template('symptom_checker.html', symptoms=symptoms_list)
            
        count = len(selected_symptoms)
        symptom_str = ", ".join(selected_symptoms)
        
        # Rule-based Clinical Triage Logic
        has_chest = any('chest' in s.lower() for s in selected_symptoms)
        has_breath = any('breath' in s.lower() or 'shortness' in s.lower() for s in selected_symptoms)
        has_fever = any('fever' in s.lower() for s in selected_symptoms)
        has_headache = any('headache' in s.lower() or 'dizziness' in s.lower() for s in selected_symptoms)
        has_digestive = any('nausea' in s.lower() or 'cramps' in s.lower() for s in selected_symptoms)
        
        if has_chest or (has_breath and has_fever):
            severity = 'High Priority'
            specialist = 'Emergency Physician / Cardiologist'
            diagnosis = 'Potential acute cardiovascular or severe pulmonary condition requiring rapid evaluation.'
            precautions = 'Avoid physical exertion. Seek immediate clinical assessment or visit nearest hospital emergency room.'
        elif count >= 3 or has_breath or (has_fever and any('cough' in s.lower() for s in selected_symptoms)):
            severity = 'Moderate'
            specialist = 'Pulmonologist / Internal Medicine'
            diagnosis = 'Acute viral/bacterial respiratory tract infection with elevated inflammation indicators.'
            precautions = 'Rest adequately, maintain oral electrolyte hydration, perform steam inhalation, and isolate if fever persists.'
        elif has_digestive:
            severity = 'Mild to Moderate'
            specialist = 'Gastroenterologist / General Physician'
            diagnosis = 'Gastrointestinal upset, acid reflux, or mild digestive tract irritation.'
            precautions = 'Consume light, non-greasy foods, drink plenty of water, and avoid excess caffeine and dairy.'
        elif has_headache:
            severity = 'Mild'
            specialist = 'Neurologist / General Practitioner'
            diagnosis = 'Tension headache, stress response, or mild ocular strain.'
            precautions = 'Ensure 8 hours of sleep, reduce screen exposure, keep hydrated, and monitor blood pressure.'
        else:
            severity = 'Mild'
            specialist = 'General Physician'
            diagnosis = 'Mild seasonal discomfort or early symptom onset.'
            precautions = 'Monitor condition for 48 hours, stay well hydrated, and maintain balanced rest.'
            
        report_title = f"Health Check Assessment ({datetime.now().strftime('%b %d, %Y')})"
        
        db.execute('''
            INSERT INTO reports (user_id, report_title, symptoms_logged, diagnosis_summary, severity_level, recommended_specialist, precautions, notes)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?)
        ''', (session['user_id'], report_title, symptom_str, diagnosis, severity, specialist, precautions, f"Duration: {duration}. {notes}"))
        db.commit()
        
        flash('Diagnostic assessment completed! A new report has been logged to your medical file.', 'success')
        return render_template(
            'symptom_checker.html',
            symptoms=symptoms_list,
            assessment_result={
                'title': report_title,
                'symptoms': selected_symptoms,
                'severity': severity,
                'specialist': specialist,
                'diagnosis': diagnosis,
                'precautions': precautions,
                'notes': notes
            }
        )
        
    return render_template('symptom_checker.html', symptoms=symptoms_list)

@app.route('/hospitals')
@login_required
def hospitals():
    db = get_db()
    search = request.args.get('search', '').strip()
    city = request.args.get('city', '').strip()
    
    query = "SELECT * FROM hospitals WHERE 1=1"
    params = []
    
    if search:
        query += " AND (name LIKE ? OR specialties LIKE ? OR address LIKE ?)"
        params.extend([f'%{search}%', f'%{search}%', f'%{search}%'])
    if city:
        query += " AND city = ?"
        params.append(city)
        
    hospitals_list = db.execute(query, params).fetchall()
    doctors_list = db.execute('''
        SELECT d.*, h.name as hospital_name 
        FROM doctors d 
        LEFT JOIN hospitals h ON d.hospital_id = h.id
    ''').fetchall()
    cities = db.execute("SELECT DISTINCT city FROM hospitals").fetchall()
    
    return render_template('hospitals.html', hospitals=hospitals_list, doctors=doctors_list, cities=cities, search=search, selected_city=city)

@app.route('/book-appointment', methods=['POST'])
@login_required
def book_appointment():
    db = get_db()
    doctor_id = request.form.get('doctor_id')
    hospital_id = request.form.get('hospital_id')
    appointment_date = request.form.get('appointment_date')
    appointment_time = request.form.get('appointment_time')
    reason = request.form.get('reason', 'General Consultation')
    
    if not doctor_id or not hospital_id or not appointment_date or not appointment_time:
        flash('Please provide all appointment details.', 'danger')
        return redirect(url_for('hospitals'))
        
    db.execute('''
        INSERT INTO appointments (user_id, doctor_id, hospital_id, appointment_date, appointment_time, status, reason)
        VALUES (?, ?, ?, ?, ?, 'Confirmed', ?)
    ''', (session['user_id'], doctor_id, hospital_id, appointment_date, appointment_time, reason))
    db.commit()
    
    flash('Consultation successfully scheduled and confirmed!', 'success')
    return redirect(url_for('dashboard'))

@app.route('/medicines')
@login_required
def medicines():
    db = get_db()
    search = request.args.get('search', '').strip()
    category = request.args.get('category', '').strip()
    
    query = "SELECT * FROM medicines WHERE 1=1"
    params = []
    if search:
        query += " AND (name LIKE ? OR usage_instructions LIKE ? OR category LIKE ?)"
        params.extend([f'%{search}%', f'%{search}%', f'%{search}%'])
    if category:
        query += " AND category = ?"
        params.append(category)
        
    medicines_list = db.execute(query, params).fetchall()
    categories = db.execute("SELECT DISTINCT category FROM medicines").fetchall()
    
    return render_template('medicines.html', medicines=medicines_list, categories=categories, search=search, selected_category=category)

@app.route('/reports')
@login_required
def reports():
    db = get_db()
    user_id = session['user_id']
    user = db.execute("SELECT * FROM users WHERE id = ?", (user_id,)).fetchone()
    reports_list = db.execute("SELECT * FROM reports WHERE user_id = ? ORDER BY created_at DESC", (user_id,)).fetchall()
    return render_template('reports.html', user=user, reports=reports_list)

@app.route('/reports/delete/<int:report_id>', methods=['POST'])
@login_required
def delete_report(report_id):
    db = get_db()
    db.execute("DELETE FROM reports WHERE id = ? AND user_id = ?", (report_id, session['user_id']))
    db.commit()
    flash('Medical assessment report removed from archive.', 'info')
    return redirect(url_for('reports'))

@app.route('/profile', methods=['GET', 'POST'])
@login_required
def profile():
    db = get_db()
    user_id = session['user_id']
    
    if request.method == 'POST':
        name = request.form.get('name', '').strip()
        phone = request.form.get('phone', '').strip()
        blood_group = request.form.get('blood_group', 'O+')
        age = request.form.get('age', 25)
        gender = request.form.get('gender', 'Female')
        allergies = request.form.get('allergies', 'None').strip()
        emergency_contact = request.form.get('emergency_contact', '').strip()
        
        db.execute('''
            UPDATE users 
            SET name = ?, phone = ?, blood_group = ?, age = ?, gender = ?, allergies = ?, emergency_contact = ?
            WHERE id = ?
        ''', (name, phone, blood_group, age, gender, allergies, emergency_contact, user_id))
        db.commit()
        
        session['name'] = name
        session['blood_group'] = blood_group
        flash('Medical card & personal profile updated successfully.', 'success')
        return redirect(url_for('profile'))
        
    user = db.execute("SELECT * FROM users WHERE id = ?", (user_id,)).fetchone()
    return render_template('profile.html', user=user)

# Admin Portal Routes
@app.route('/admin/login', methods=['GET', 'POST'])
def admin_login():
    if session.get('role') == 'admin':
        return redirect(url_for('admin_dashboard'))
        
    if request.method == 'POST':
        email = request.form.get('email', '').strip().lower()
        password = request.form.get('password', '')
        
        db = get_db()
        user = db.execute("SELECT * FROM users WHERE email = ? AND role = 'admin'", (email,)).fetchone()
        
        if user and check_password_hash(user['password'], password):
            session['user_id'] = user['id']
            session['name'] = user['name']
            session['email'] = user['email']
            session['role'] = 'admin'
            flash('Administrative session authorized.', 'success')
            return redirect(url_for('admin_dashboard'))
        else:
            flash('Invalid executive credentials. Access denied.', 'danger')
            
    return render_template('admin_login.html')

@app.route('/admin/dashboard')
@admin_required
def admin_dashboard():
    db = get_db()
    stats = {
        'doctors': db.execute("SELECT COUNT(*) FROM doctors").fetchone()[0],
        'hospitals': db.execute("SELECT COUNT(*) FROM hospitals").fetchone()[0],
        'medicines': db.execute("SELECT COUNT(*) FROM medicines").fetchone()[0],
        'patients': db.execute("SELECT COUNT(*) FROM users WHERE role = 'patient'").fetchone()[0],
        'appointments': db.execute("SELECT COUNT(*) FROM appointments").fetchone()[0],
        'reports': db.execute("SELECT COUNT(*) FROM reports").fetchone()[0]
    }
    recent_appointments = db.execute('''
        SELECT a.*, u.name as patient_name, d.name as doctor_name, d.specialty as doctor_specialty, h.name as hospital_name
        FROM appointments a
        JOIN users u ON a.user_id = u.id
        JOIN doctors d ON a.doctor_id = d.id
        JOIN hospitals h ON a.hospital_id = h.id
        ORDER BY a.created_at DESC LIMIT 5
    ''').fetchall()
    recent_patients = db.execute("SELECT * FROM users WHERE role = 'patient' ORDER BY created_at DESC LIMIT 5").fetchall()
    
    return render_template('admin_dashboard.html', stats=stats, appointments=recent_appointments, patients=recent_patients)

@app.route('/admin/manage-doctors', methods=['GET', 'POST'])
@admin_required
def manage_doctors():
    db = get_db()
    if request.method == 'POST':
        action = request.form.get('action')
        if action == 'add':
            name = request.form.get('name')
            specialty = request.form.get('specialty')
            hospital_id = request.form.get('hospital_id')
            qualification = request.form.get('qualification')
            experience_years = request.form.get('experience_years', 5)
            consultation_fee = request.form.get('consultation_fee', 500)
            availability = request.form.get('availability', 'Mon - Fri (09:00 AM - 04:00 PM)')
            phone = request.form.get('phone', '+1 (555) 301-9999')
            email = request.form.get('contact_email', 'doctor@carenest.org')
            
            db.execute('''
                INSERT INTO doctors (hospital_id, name, specialty, qualification, experience_years, contact_email, phone, availability, consultation_fee)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
            ''', (hospital_id, name, specialty, qualification, experience_years, email, phone, availability, consultation_fee))
            db.commit()
            flash(f"Physician {name} added to staff directory.", 'success')
            
        elif action == 'delete':
            doctor_id = request.form.get('doctor_id')
            db.execute("DELETE FROM doctors WHERE id = ?", (doctor_id,))
            db.commit()
            flash('Doctor profile deleted.', 'info')
            
    doctors_list = db.execute('''
        SELECT d.*, h.name as hospital_name 
        FROM doctors d 
        LEFT JOIN hospitals h ON d.hospital_id = h.id 
        ORDER BY d.id DESC
    ''').fetchall()
    hospitals_list = db.execute("SELECT id, name FROM hospitals").fetchall()
    return render_template('manage_doctors.html', doctors=doctors_list, hospitals=hospitals_list)

@app.route('/admin/manage-medicines', methods=['GET', 'POST'])
@admin_required
def manage_medicines():
    db = get_db()
    if request.method == 'POST':
        action = request.form.get('action')
        if action == 'add':
            name = request.form.get('name')
            category = request.form.get('category')
            dosage = request.form.get('dosage')
            usage = request.form.get('usage_instructions')
            price = request.form.get('price', 10.0)
            stock = request.form.get('stock_status', 'In Stock')
            manufacturer = request.form.get('manufacturer', 'Apex Pharma Labs')
            side_effects = request.form.get('side_effects', 'None reported')
            
            db.execute('''
                INSERT INTO medicines (name, category, dosage, usage_instructions, side_effects, price, stock_status, manufacturer)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?)
            ''', (name, category, dosage, usage, side_effects, price, stock, manufacturer))
            db.commit()
            flash(f"Drug {name} cataloged in formulary.", 'success')
            
        elif action == 'delete':
            med_id = request.form.get('medicine_id')
            db.execute("DELETE FROM medicines WHERE id = ?", (med_id,))
            db.commit()
            flash('Medicine removed from formulary.', 'info')
            
    medicines_list = db.execute("SELECT * FROM medicines ORDER BY id DESC").fetchall()
    return render_template('manage_medicines.html', medicines=medicines_list)

@app.route('/admin/manage-hospitals', methods=['GET', 'POST'])
@admin_required
def manage_hospitals():
    db = get_db()
    if request.method == 'POST':
        action = request.form.get('action')
        if action == 'add':
            name = request.form.get('name')
            city = request.form.get('city')
            address = request.form.get('address')
            phone = request.form.get('phone')
            emergency = request.form.get('emergency_phone', '+1 (555) 911-0000')
            beds = request.form.get('beds_available', 50)
            specialties = request.form.get('specialties', 'General Medicine, Emergency')
            image_url = request.form.get('image_url', 'https://images.unsplash.com/photo-1587351021759-3e566b6af7cc?w=600&auto=format&fit=crop&q=80')
            
            db.execute('''
                INSERT INTO hospitals (name, city, address, phone, emergency_phone, beds_available, specialties, image_url)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?)
            ''', (name, city, address, phone, emergency, beds, specialties, image_url))
            db.commit()
            flash(f"Hospital center {name} registered.", 'success')
            
        elif action == 'delete':
            hosp_id = request.form.get('hospital_id')
            db.execute("DELETE FROM hospitals WHERE id = ?", (hosp_id,))
            db.commit()
            flash('Hospital removed from network.', 'info')
            
    hospitals_list = db.execute("SELECT * FROM hospitals ORDER BY id DESC").fetchall()
    return render_template('manage_hospitals.html', hospitals=hospitals_list)

@app.route('/admin/analytics')
@admin_required
def analytics():
    db = get_db()
    reports_list = db.execute('''
        SELECT r.*, u.name as user_name, u.email as user_email
        FROM reports r
        JOIN users u ON r.user_id = u.id
        ORDER BY r.created_at DESC
    ''').fetchall()
    
    # Severity breakdown
    mild_count = db.execute("SELECT COUNT(*) FROM reports WHERE severity_level LIKE '%Mild%'").fetchone()[0]
    mod_count = db.execute("SELECT COUNT(*) FROM reports WHERE severity_level LIKE '%Moderate%'").fetchone()[0]
    high_count = db.execute("SELECT COUNT(*) FROM reports WHERE severity_level LIKE '%High%'").fetchone()[0]
    
    category_meds = db.execute("SELECT category, COUNT(*) as count FROM medicines GROUP BY category").fetchall()
    
    return render_template(
        'analytics.html',
        reports=reports_list,
        severity_counts={'Mild': mild_count, 'Moderate': mod_count, 'High Priority': high_count},
        category_meds=category_meds
    )

@app.route('/admin/logout')
def admin_logout():
    session.clear()
    flash('Administrative console logged out.', 'info')
    return redirect(url_for('login'))

if __name__ == '__main__':
    init_db()
    print("==================================================")
    print("CARENEST HEALTHCARE APPLICATION IS RUNNING!")
    print("Local URL: http://127.0.0.1:5000")
    print("==================================================")
    print("DEMO CREDENTIALS:")
    print("Patient: sarah.jenkins@example.com / patient123")
    print("Admin:   admin@carenest.com / admin123")
    print("==================================================")
    app.run(debug=True, port=5000)
`
  }
];