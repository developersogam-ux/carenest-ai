export type PageView =
  | 'login'
  | 'register'
  | 'home'
  | 'dashboard'
  | 'symptom_checker'
  | 'hospitals'
  | 'medicines'
  | 'reports'
  | 'profile'
  | 'admin_login'
  | 'admin_dashboard'
  | 'manage_doctors'
  | 'manage_medicines'
  | 'manage_hospitals'
  | 'analytics';

export interface User {
  id: number;
  name: string;
  email: string;
  role: 'patient' | 'admin';
  phone?: string;
  blood_group?: string;
  age?: number;
  gender?: string;
  allergies?: string;
  emergency_contact?: string;
  created_at: string;
}

export interface Hospital {
  id: number;
  name: string;
  city: string;
  address: string;
  phone: string;
  emergency_phone?: string;
  rating: number;
  beds_available: number;
  specialties: string;
  image_url: string;
}

export interface Doctor {
  id: number;
  hospital_id: number;
  hospital_name?: string;
  name: string;
  specialty: string;
  qualification: string;
  experience_years: number;
  contact_email?: string;
  phone?: string;
  availability: string;
  consultation_fee: number;
  rating: number;
}

export interface Medicine {
  id: number;
  name: string;
  category: string;
  dosage: string;
  usage_instructions: string;
  side_effects?: string;
  price: number;
  stock_status: 'In Stock' | 'Prescription Required' | 'Out of Stock';
  manufacturer?: string;
}

export interface Symptom {
  id: number;
  symptom_name: string;
  category: string;
  severity_weight: number;
}

export interface Report {
  id: number;
  user_id: number;
  user_name?: string;
  user_email?: string;
  report_title: string;
  symptoms_logged: string;
  diagnosis_summary: string;
  severity_level: string;
  recommended_specialist: string;
  precautions: string;
  notes?: string;
  created_at: string;
}

export interface Appointment {
  id: number;
  user_id: number;
  patient_name?: string;
  doctor_id: number;
  doctor_name: string;
  doctor_specialty: string;
  hospital_id: number;
  hospital_name: string;
  appointment_date: string;
  appointment_time: string;
  status: 'Confirmed' | 'Completed' | 'Pending';
  reason?: string;
  created_at: string;
}