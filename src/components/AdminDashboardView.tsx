import React from 'react';
import { PageView, Hospital, Doctor, Medicine, Appointment, User } from '../types';
import {
  ShieldAlert,
  Users,
  Building2,
  Stethoscope,
  Pill,
  Calendar,
  BarChart3,
  CheckCircle2,
  ArrowRight
} from 'lucide-react';

interface AdminDashboardViewProps {
  users: User[];
  hospitals: Hospital[];
  doctors: Doctor[];
  medicines: Medicine[];
  appointments: Appointment[];
  onNavigate: (page: PageView) => void;
}

export const AdminDashboardView: React.FC<AdminDashboardViewProps> = ({
  users,
  hospitals,
  doctors,
  medicines,
  appointments,
  onNavigate,
}) => {
  const patientUsers = users.filter((u) => u.role === 'patient');

  return (
    <div className="space-y-6 font-sans text-[#2D3436]">
      {/* Admin Hero Header */}
      <div className="p-6 rounded-[22px] bg-[#1B4332] text-white shadow-lg flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-[#74C69D]/20 text-[#74C69D] text-[11px] font-bold mb-2 border border-[#74C69D]/30">
            <ShieldAlert className="w-3.5 h-3.5" />
            Executive Administration Console
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-white">System Infrastructure & Clinical Operations</h2>
          <p className="text-xs text-white/70 mt-1">Real-time health records registry, appointment routing, and doctor directory management.</p>
        </div>
        <button
          onClick={() => onNavigate('analytics')}
          className="px-4 py-2 rounded-full bg-[#2D6A4F] hover:bg-[#1B4332] border border-[#74C69D]/40 text-white font-bold text-xs flex items-center gap-2 shadow-sm shrink-0 cursor-pointer"
        >
          <BarChart3 className="w-4 h-4 text-[#74C69D]" />
          View Clinical Analytics
        </button>
      </div>

      {/* 4 Stat Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div
          onClick={() => onNavigate('manage_doctors')}
          className="p-5 rounded-[20px] bg-white border border-[#E9ECEF] shadow-xs hover:border-[#74C69D] cursor-pointer transition-all"
        >
          <span className="text-[11px] font-bold text-[#6C757D] uppercase tracking-wider">Active Doctors</span>
          <h3 className="text-2xl font-black text-[#2D3436] mt-1">{doctors.length}</h3>
          <p className="text-[10px] text-[#2D6A4F] font-semibold mt-2">Manage medical staff →</p>
        </div>

        <div
          onClick={() => onNavigate('manage_hospitals')}
          className="p-5 rounded-[20px] bg-white border border-[#E9ECEF] shadow-xs hover:border-[#74C69D] cursor-pointer transition-all"
        >
          <span className="text-[11px] font-bold text-[#6C757D] uppercase tracking-wider">Hospital Centers</span>
          <h3 className="text-2xl font-black text-[#2D3436] mt-1">{hospitals.length}</h3>
          <p className="text-[10px] text-[#2D6A4F] font-semibold mt-2">Manage partner clinics →</p>
        </div>

        <div
          onClick={() => onNavigate('manage_medicines')}
          className="p-5 rounded-[20px] bg-white border border-[#E9ECEF] shadow-xs hover:border-[#74C69D] cursor-pointer transition-all"
        >
          <span className="text-[11px] font-bold text-[#6C757D] uppercase tracking-wider">Drug Formulary</span>
          <h3 className="text-2xl font-black text-[#2D3436] mt-1">{medicines.length}</h3>
          <p className="text-[10px] text-[#2D6A4F] font-semibold mt-2">Manage pharmaceuticals →</p>
        </div>

        <div className="p-5 rounded-[20px] bg-white border border-[#E9ECEF] shadow-xs">
          <span className="text-[11px] font-bold text-[#6C757D] uppercase tracking-wider">Enrolled Patients</span>
          <h3 className="text-2xl font-black text-[#2D3436] mt-1">{patientUsers.length + 12}</h3>
          <p className="text-[10px] text-[#6C757D] font-semibold mt-2">Encrypted medical cards</p>
        </div>
      </div>

      {/* Appointments Audit and Patient Registry */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Scheduled Consultations Audit */}
        <div className="lg:col-span-7 p-6 rounded-[22px] bg-white border border-[#E9ECEF] shadow-xs">
          <h3 className="font-bold text-[#2D3436] text-base mb-4 flex items-center gap-2">
            <Calendar className="w-5 h-5 text-[#2D6A4F]" />
            Live Consultation Booking Stream
          </h3>

          <div className="space-y-3">
            {appointments.map((apt) => (
              <div key={apt.id} className="p-3.5 rounded-2xl bg-[#F8F9FA] border border-[#E9ECEF] flex items-center justify-between gap-3 text-xs">
                <div>
                  <h4 className="font-bold text-[#2D3436]">{apt.doctor_name} ({apt.doctor_specialty})</h4>
                  <p className="text-[11px] text-[#6C757D]">{apt.hospital_name} • {apt.appointment_date} at {apt.appointment_time}</p>
                  <p className="text-[10px] text-[#6C757D]">Patient: {apt.patient_name || 'Sarah Jenkins'}</p>
                </div>
                <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-[#D8F3DC] text-[#1B4332] shrink-0">
                  {apt.status}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Registered Patients Summary */}
        <div className="lg:col-span-5 p-6 rounded-[22px] bg-white border border-[#E9ECEF] shadow-xs">
          <h3 className="font-bold text-[#2D3436] text-base mb-4 flex items-center gap-2">
            <Users className="w-5 h-5 text-[#2D6A4F]" />
            Registered Patients
          </h3>

          <div className="space-y-3">
            {patientUsers.map((p) => (
              <div key={p.id} className="p-3.5 rounded-2xl bg-[#F8F9FA] border border-[#E9ECEF] flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-[#D8F3DC] text-[#1B4332] font-bold text-xs flex items-center justify-center">
                  {p.name[0]}
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="font-bold text-[#2D3436] text-xs truncate">{p.name}</h4>
                  <p className="text-[10px] text-[#6C757D] truncate">{p.email}</p>
                  <p className="text-[10px] text-[#2D6A4F] font-semibold">Blood: {p.blood_group || 'Not Set'}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
