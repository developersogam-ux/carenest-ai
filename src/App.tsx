import React, { useState, useEffect } from 'react';
import { PageView, User, Hospital, Doctor, Medicine, Symptom, Report, Appointment } from './types';
import {
  initialAdmin,
  initialPatient,
  initialHospitals,
  initialDoctors,
  initialMedicines,
  initialSymptoms,
  initialReports,
  initialAppointments,
} from './data/initialData';
import { Navbar } from './components/Navbar';
import { Sidebar } from './components/Sidebar';
import { LoginView } from './components/LoginView';
import { RegisterView } from './components/RegisterView';
import { HomeView } from './components/HomeView';
import { DashboardView } from './components/DashboardView';
import { SymptomCheckerView } from './components/SymptomCheckerView';
import { HospitalsView } from './components/HospitalsView';
import { MedicinesView } from './components/MedicinesView';
import { ReportsView } from './components/ReportsView';
import { ProfileView } from './components/ProfileView';
import { AdminLoginView } from './components/AdminLoginView';
import { AdminDashboardView } from './components/AdminDashboardView';
import { ManageDoctorsView } from './components/ManageDoctorsView';
import { ManageMedicinesView } from './components/ManageMedicinesView';
import { ManageHospitalsView } from './components/ManageHospitalsView';
import { AnalyticsView } from './components/AnalyticsView';

export default function App() {
  // State Initialization with LocalStorage fallback
  const [users, setUsers] = useState<User[]>(() => {
    const saved = localStorage.getItem('carenest_users');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) {
          return parsed.map((u: User) => (u.id === 2 && u.blood_group === 'A+' ? { ...u, blood_group: '' } : u));
        }
      } catch (_) {}
    }
    return [initialAdmin, initialPatient];
  });

  const [currentUser, setCurrentUser] = useState<User | null>(() => {
    const saved = localStorage.getItem('carenest_current_user');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (parsed && parsed.id === 2 && parsed.blood_group === 'A+') {
          return { ...parsed, blood_group: '' };
        }
        return parsed;
      } catch (_) {}
    }
    return null;
  });

  // Strict Login-First Rule: If not logged in, only 'login', 'register', or 'admin_login' are allowed
  const [currentPage, setCurrentPage] = useState<PageView>(() => {
    const savedUser = localStorage.getItem('carenest_current_user');
    if (!savedUser) return 'login';
    const parsed = JSON.parse(savedUser);
    return parsed.role === 'admin' ? 'admin_dashboard' : 'dashboard';
  });

  const [hospitals, setHospitals] = useState<Hospital[]>(() => {
    const saved = localStorage.getItem('carenest_hospitals');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length >= 15 && parsed.some(h => h.city === 'Mumbai')) {
          return parsed;
        }
      } catch (_) {}
    }
    return initialHospitals;
  });

  const [doctors, setDoctors] = useState<Doctor[]>(() => {
    const saved = localStorage.getItem('carenest_doctors');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length >= 15) {
          return parsed;
        }
      } catch (_) {}
    }
    return initialDoctors;
  });

  const [medicines, setMedicines] = useState<Medicine[]>(() => {
    const saved = localStorage.getItem('carenest_medicines');
    return saved ? JSON.parse(saved) : initialMedicines;
  });

  const [reports, setReports] = useState<Report[]>(() => {
    const saved = localStorage.getItem('carenest_reports');
    return saved ? JSON.parse(saved) : initialReports;
  });

  const [appointments, setAppointments] = useState<Appointment[]>(() => {
    const saved = localStorage.getItem('carenest_appointments');
    return saved ? JSON.parse(saved) : initialAppointments;
  });

  // Sync to LocalStorage
  useEffect(() => {
    localStorage.setItem('carenest_users', JSON.stringify(users));
  }, [users]);

  useEffect(() => {
    if (currentUser) {
      localStorage.setItem('carenest_current_user', JSON.stringify(currentUser));
    } else {
      localStorage.removeItem('carenest_current_user');
    }
  }, [currentUser]);

  useEffect(() => {
    localStorage.setItem('carenest_hospitals', JSON.stringify(hospitals));
  }, [hospitals]);

  useEffect(() => {
    localStorage.setItem('carenest_doctors', JSON.stringify(doctors));
  }, [doctors]);

  useEffect(() => {
    localStorage.setItem('carenest_medicines', JSON.stringify(medicines));
  }, [medicines]);

  useEffect(() => {
    localStorage.setItem('carenest_reports', JSON.stringify(reports));
  }, [reports]);

  useEffect(() => {
    localStorage.setItem('carenest_appointments', JSON.stringify(appointments));
  }, [appointments]);

  // Auth Handlers
  const handleLogin = (email: string, role: 'patient' | 'admin') => {
    const found = users.find((u) => u.email.toLowerCase() === email.toLowerCase());
    if (found) {
      setCurrentUser(found);
      setCurrentPage(found.role === 'admin' ? 'admin_dashboard' : 'dashboard');
    } else {
      // Default demo user creation if not found
      const newUser: User = {
        id: Date.now(),
        name: email.split('@')[0],
        email,
        role,
        blood_group: 'O+',
        age: 28,
        gender: 'Female',
        created_at: new Date().toISOString().split('T')[0],
      };
      setUsers((prev) => [...prev, newUser]);
      setCurrentUser(newUser);
      setCurrentPage(role === 'admin' ? 'admin_dashboard' : 'dashboard');
    }
  };

  const handleRegister = (userPartial: Partial<User>) => {
    const newUser: User = {
      id: Date.now(),
      name: userPartial.name || 'New Patient',
      email: userPartial.email || 'patient@example.com',
      role: 'patient',
      phone: userPartial.phone,
      blood_group: userPartial.blood_group || '',
      age: userPartial.age || 25,
      gender: userPartial.gender || 'Female',
      allergies: userPartial.allergies || 'None',
      emergency_contact: userPartial.emergency_contact,
      created_at: new Date().toISOString().split('T')[0],
    };
    setUsers((prev) => [...prev, newUser]);
    setCurrentUser(newUser);
    setCurrentPage('dashboard');
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setCurrentPage('login');
  };

  // Handlers for Patient features
  const handleSaveReport = (reportPartial: Partial<Report>) => {
    const newReport: Report = {
      id: Date.now(),
      user_id: currentUser ? currentUser.id : 2,
      user_name: currentUser ? currentUser.name : 'Sarah Jenkins',
      user_email: currentUser ? currentUser.email : 'sarah.jenkins@example.com',
      report_title: reportPartial.report_title || 'General Assessment',
      symptoms_logged: reportPartial.symptoms_logged || '',
      diagnosis_summary: reportPartial.diagnosis_summary || '',
      severity_level: reportPartial.severity_level || 'Mild',
      recommended_specialist: reportPartial.recommended_specialist || 'General Physician',
      precautions: reportPartial.precautions || '',
      notes: reportPartial.notes,
      created_at: reportPartial.created_at || new Date().toISOString().replace('T', ' ').slice(0, 16),
    };
    setReports((prev) => [newReport, ...prev]);
  };

  const handleDeleteReport = (id: number) => {
    setReports((prev) => prev.filter((r) => r.id !== id));
  };

  const handleBookAppointment = (appointmentPartial: Partial<Appointment>) => {
    const newApt: Appointment = {
      id: Date.now(),
      user_id: currentUser ? currentUser.id : 2,
      patient_name: currentUser ? currentUser.name : 'Sarah Jenkins',
      doctor_id: appointmentPartial.doctor_id || 1,
      doctor_name: appointmentPartial.doctor_name || 'Dr. Marcus Vance',
      doctor_specialty: appointmentPartial.doctor_specialty || 'Cardiologist',
      hospital_id: appointmentPartial.hospital_id || 1,
      hospital_name: appointmentPartial.hospital_name || 'CareNest Apex Center',
      appointment_date: appointmentPartial.appointment_date || '2026-03-12',
      appointment_time: appointmentPartial.appointment_time || '10:00 AM',
      status: 'Confirmed',
      reason: appointmentPartial.reason || 'General Consultation',
      created_at: new Date().toISOString().split('T')[0],
    };
    setAppointments((prev) => [...prev, newApt]);
  };

  const handleUpdateProfile = (updated: Partial<User>) => {
    if (!currentUser) return;
    const nextUser = { ...currentUser, ...updated };
    setCurrentUser(nextUser);
    setUsers((prev) => prev.map((u) => (u.id === currentUser.id ? nextUser : u)));
  };

  // Handlers for Admin features
  const handleAddDoctor = (doc: Partial<Doctor>) => {
    const newDoc: Doctor = {
      id: Date.now(),
      hospital_id: doc.hospital_id || 1,
      hospital_name: doc.hospital_name || 'CareNest Center',
      name: doc.name || 'Dr. New Specialist',
      specialty: doc.specialty || 'General Medicine',
      qualification: doc.qualification || 'MD',
      experience_years: doc.experience_years || 5,
      availability: doc.availability || 'Mon - Fri',
      consultation_fee: doc.consultation_fee || 500,
      rating: 4.9,
      phone: doc.phone,
      contact_email: doc.contact_email,
    };
    setDoctors((prev) => [newDoc, ...prev]);
  };

  const handleDeleteDoctor = (id: number) => {
    setDoctors((prev) => prev.filter((d) => d.id !== id));
  };

  const handleAddMedicine = (med: Partial<Medicine>) => {
    const newMed: Medicine = {
      id: Date.now(),
      name: med.name || 'New Medicine',
      category: med.category || 'Analgesic',
      dosage: med.dosage || '1 tablet daily',
      usage_instructions: med.usage_instructions || 'Take with water',
      price: med.price || 10.0,
      stock_status: med.stock_status || 'In Stock',
      manufacturer: med.manufacturer || 'CareNest Labs',
    };
    setMedicines((prev) => [newMed, ...prev]);
  };

  const handleDeleteMedicine = (id: number) => {
    setMedicines((prev) => prev.filter((m) => m.id !== id));
  };

  const handleAddHospital = (hosp: Partial<Hospital>) => {
    const newHosp: Hospital = {
      id: Date.now(),
      name: hosp.name || 'New Healthcare Center',
      city: hosp.city || 'Metro City',
      address: hosp.address || 'Medical Blvd',
      phone: hosp.phone || '+1 (555) 000-0000',
      emergency_phone: hosp.emergency_phone || '911',
      rating: hosp.rating || 4.8,
      beds_available: hosp.beds_available || 50,
      specialties: hosp.specialties || 'General Medicine',
      image_url: hosp.image_url || 'https://images.unsplash.com/photo-1587351021759-3e566b6af7cc?w=600&auto=format&fit=crop&q=80',
    };
    setHospitals((prev) => [newHosp, ...prev]);
  };

  const handleDeleteHospital = (id: number) => {
    setHospitals((prev) => prev.filter((h) => h.id !== id));
  };

  // Route Rendering with Login First Enforcement
  if (!currentUser) {
    if (currentPage === 'register') {
      return <RegisterView onRegister={handleRegister} onNavigate={setCurrentPage} />;
    }
    if (currentPage === 'admin_login') {
      return (
        <AdminLoginView
          onAdminLogin={(email) => handleLogin(email, 'admin')}
          onNavigate={setCurrentPage}
        />
      );
    }
    return <LoginView onLogin={handleLogin} onNavigate={setCurrentPage} />;
  }

  // Logged-in View Layout
  return (
    <div className="min-h-screen bg-[#F4F7F6] flex flex-col font-sans text-[#2D3436]">
      <Navbar
        currentUser={currentUser}
        currentPage={currentPage}
        onNavigate={setCurrentPage}
        onLogout={handleLogout}
      />

      <div className="flex-1 flex overflow-hidden">
        {/* Persistent Sidebar */}
        <Sidebar
          currentUser={currentUser}
          currentPage={currentPage}
          onNavigate={setCurrentPage}
          onLogout={handleLogout}
        />

        {/* Main Content Area */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto max-w-7xl mx-auto w-full">
          {currentPage === 'home' && (
            <HomeView
              user={currentUser}
              hospitals={hospitals}
              doctors={doctors}
              onNavigate={setCurrentPage}
              onOpenBooking={() => setCurrentPage('hospitals')}
            />
          )}

          {currentPage === 'dashboard' && (
            <DashboardView
              user={currentUser}
              reports={reports.filter((r) => r.user_id === currentUser.id)}
              appointments={appointments.filter((a) => a.user_id === currentUser.id)}
              totalHospitals={hospitals.length}
              totalDoctors={doctors.length}
              onNavigate={setCurrentPage}
            />
          )}

          {currentPage === 'symptom_checker' && (
            <SymptomCheckerView
              symptoms={initialSymptoms}
              onSaveReport={handleSaveReport}
              onNavigate={setCurrentPage}
            />
          )}

          {currentPage === 'hospitals' && (
            <HospitalsView
              hospitals={hospitals}
              doctors={doctors}
              onBookAppointment={handleBookAppointment}
              onNavigate={setCurrentPage}
            />
          )}

          {currentPage === 'medicines' && <MedicinesView medicines={medicines} />}

          {currentPage === 'reports' && (
            <ReportsView
              user={currentUser}
              reports={reports.filter((r) => r.user_id === currentUser.id)}
              onDeleteReport={handleDeleteReport}
            />
          )}

          {currentPage === 'profile' && (
            <ProfileView user={currentUser} onUpdateProfile={handleUpdateProfile} />
          )}

          {/* Admin Routes */}
          {currentPage === 'admin_dashboard' && (
            <AdminDashboardView
              users={users}
              hospitals={hospitals}
              doctors={doctors}
              medicines={medicines}
              appointments={appointments}
              onNavigate={setCurrentPage}
            />
          )}

          {currentPage === 'manage_doctors' && (
            <ManageDoctorsView
              doctors={doctors}
              hospitals={hospitals}
              onAddDoctor={handleAddDoctor}
              onDeleteDoctor={handleDeleteDoctor}
            />
          )}

          {currentPage === 'manage_medicines' && (
            <ManageMedicinesView
              medicines={medicines}
              onAddMedicine={handleAddMedicine}
              onDeleteMedicine={handleDeleteMedicine}
            />
          )}

          {currentPage === 'manage_hospitals' && (
            <ManageHospitalsView
              hospitals={hospitals}
              onAddHospital={handleAddHospital}
              onDeleteHospital={handleDeleteHospital}
            />
          )}

          {currentPage === 'analytics' && (
            <AnalyticsView reports={reports} medicines={medicines} />
          )}
        </main>
      </div>
    </div>
  );
}
