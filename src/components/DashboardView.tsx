import React from 'react';
import { PageView, User, Report, Appointment } from '../types';
import {
  FileText,
  Calendar,
  Building2,
  Stethoscope,
  PlusCircle,
  Clock,
  ArrowRight,
  ShieldAlert,
  ChevronRight,
  CheckCircle2
} from 'lucide-react';

interface DashboardViewProps {
  user: User;
  reports: Report[];
  appointments: Appointment[];
  totalHospitals: number;
  totalDoctors: number;
  onNavigate: (page: PageView) => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  user,
  reports,
  appointments,
  totalHospitals,
  totalDoctors,
  onNavigate,
}) => {
  return (
    <div className="space-y-6">
      {/* Top Greeting Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
        <div>
          <h2 className="text-xl sm:text-2xl font-extrabold text-[#2D3436] tracking-tight">
            Hello, {user.name} 👋
          </h2>
          <p className="text-xs sm:text-sm text-[#6C757D] mt-0.5">
            Here is your daily medical overview and scheduled healthcare appointments.
          </p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => onNavigate('symptom_checker')}
            className="px-4 py-2 rounded-full bg-[#2D6A4F] hover:bg-[#1B4332] text-white font-bold text-xs flex items-center gap-1.5 shadow-sm shadow-[#1B4332]/20 transition-all cursor-pointer"
          >
            <PlusCircle className="w-3.5 h-3.5" />
            New Health Check
          </button>
          <button
            onClick={() => onNavigate('hospitals')}
            className="px-4 py-2 rounded-full bg-white text-[#1B4332] hover:bg-[#F4F7F6] border border-[#DEE2E6] font-bold text-xs flex items-center gap-1.5 transition-all cursor-pointer"
          >
            <Calendar className="w-3.5 h-3.5 text-[#2D6A4F]" />
            Book Doctor
          </button>
        </div>
      </div>

      {/* 4 Stat Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <div className="p-4 sm:p-5 rounded-[20px] bg-white border border-[#E9ECEF] shadow-xs">
          <div className="flex items-center justify-between">
            <div>
              <span className="text-[11px] font-bold text-[#6C757D] uppercase tracking-wider">Health Reports</span>
              <h3 className="text-2xl font-black text-[#2D3436] mt-1">{reports.length}</h3>
            </div>
            <div className="w-10 h-10 rounded-xl bg-[#D8F3DC] text-[#2D6A4F] flex items-center justify-center">
              <FileText className="w-5 h-5" />
            </div>
          </div>
        </div>

        <div className="p-4 sm:p-5 rounded-[20px] bg-white border border-[#E9ECEF] shadow-xs">
          <div className="flex items-center justify-between">
            <div>
              <span className="text-[11px] font-bold text-[#6C757D] uppercase tracking-wider">Appointments</span>
              <h3 className="text-2xl font-black text-[#2D3436] mt-1">{appointments.length}</h3>
            </div>
            <div className="w-10 h-10 rounded-xl bg-[#D8F3DC] text-[#1B4332] flex items-center justify-center">
              <Calendar className="w-5 h-5" />
            </div>
          </div>
        </div>

        <div className="p-4 sm:p-5 rounded-[20px] bg-white border border-[#E9ECEF] shadow-xs">
          <div className="flex items-center justify-between">
            <div>
              <span className="text-[11px] font-bold text-[#6C757D] uppercase tracking-wider">Partner Clinics</span>
              <h3 className="text-2xl font-black text-[#2D3436] mt-1">{totalHospitals}</h3>
            </div>
            <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center">
              <Building2 className="w-5 h-5" />
            </div>
          </div>
        </div>

        <div className="p-4 sm:p-5 rounded-[20px] bg-white border border-[#E9ECEF] shadow-xs">
          <div className="flex items-center justify-between">
            <div>
              <span className="text-[11px] font-bold text-[#6C757D] uppercase tracking-wider">Active Specialists</span>
              <h3 className="text-2xl font-black text-[#2D3436] mt-1">{totalDoctors}</h3>
            </div>
            <div className="w-10 h-10 rounded-xl bg-[#D8F3DC] text-[#2D6A4F] flex items-center justify-center">
              <Stethoscope className="w-5 h-5" />
            </div>
          </div>
        </div>
      </div>

      {/* Main Grid: Scheduled Consultations & Recent Reports */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Scheduled Consultations */}
        <div className="lg:col-span-7 p-6 rounded-[22px] bg-white border border-[#E9ECEF] shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Calendar className="w-5 h-5 text-[#2D6A4F]" />
              <h3 className="font-bold text-[#2D3436] text-base">Upcoming Doctor Consultations</h3>
            </div>
            <button
              onClick={() => onNavigate('hospitals')}
              className="text-xs font-bold text-[#2D6A4F] hover:underline"
            >
              + Book New
            </button>
          </div>

          {appointments.length > 0 ? (
            <div className="space-y-3">
              {appointments.map((apt) => (
                <div key={apt.id} className="p-4 rounded-2xl bg-[#F8F9FA] border border-[#E9ECEF] flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-[#D8F3DC] text-[#1B4332] flex items-center justify-center font-bold text-sm shrink-0">
                      <CheckCircle2 className="w-5 h-5 text-[#2D6A4F]" />
                    </div>
                    <div>
                      <h4 className="font-bold text-[#2D3436] text-xs sm:text-sm">{apt.doctor_name}</h4>
                      <p className="text-[11px] font-semibold text-[#2D6A4F]">{apt.doctor_specialty} • {apt.hospital_name}</p>
                      <p className="text-[10px] text-[#6C757D] truncate max-w-[240px]">{apt.reason || 'General health consultation'}</p>
                    </div>
                  </div>
                  <div className="sm:text-right shrink-0">
                    <span className="inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-[#D8F3DC] text-[#1B4332]">
                      {apt.status}
                    </span>
                    <div className="text-xs font-bold text-[#2D3436] mt-1">{apt.appointment_date}</div>
                    <div className="text-[10px] text-[#6C757D]">{apt.appointment_time}</div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-10">
              <Calendar className="w-10 h-10 text-slate-300 mx-auto mb-2" />
              <p className="text-xs text-[#6C757D] mb-3">No upcoming doctor appointments scheduled.</p>
              <button
                onClick={() => onNavigate('hospitals')}
                className="px-4 py-1.5 rounded-full bg-[#2D6A4F] text-white font-bold text-xs shadow-sm hover:bg-[#1B4332]"
              >
                Schedule Appointment
              </button>
            </div>
          )}
        </div>

        {/* Recent Health Assessment Reports */}
        <div className="lg:col-span-5 p-6 rounded-[22px] bg-white border border-[#E9ECEF] shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Clock className="w-5 h-5 text-[#2D6A4F]" />
              <h3 className="font-bold text-[#2D3436] text-base">Recent Health Reports</h3>
            </div>
            <button
              onClick={() => onNavigate('reports')}
              className="text-xs font-bold text-[#2D6A4F] hover:underline"
            >
              All Reports
            </button>
          </div>

          {reports.length > 0 ? (
            <div className="space-y-3">
              {reports.slice(0, 3).map((r) => (
                <div key={r.id} className="p-3.5 rounded-2xl bg-[#F8F9FA] border border-[#E9ECEF]">
                  <div className="flex items-center justify-between mb-1">
                    <h4 className="font-bold text-[#2D3436] text-xs truncate max-w-[180px]">{r.report_title}</h4>
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        r.severity_level.includes('High')
                          ? 'bg-rose-100 text-rose-800'
                          : r.severity_level.includes('Moderate')
                          ? 'bg-amber-100 text-amber-800'
                          : 'bg-[#D8F3DC] text-[#1B4332]'
                      }`}
                    >
                      {r.severity_level}
                    </span>
                  </div>
                  <p className="text-[11px] text-[#6C757D] line-clamp-1 mb-2">{r.symptoms_logged}</p>
                  <div className="flex items-center justify-between text-[10px] text-[#6C757D]">
                    <span>{r.created_at.slice(0, 10)}</span>
                    <button
                      onClick={() => onNavigate('reports')}
                      className="font-bold text-[#2D6A4F] hover:underline flex items-center gap-0.5"
                    >
                      Details <ChevronRight className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-10">
              <FileText className="w-10 h-10 text-slate-300 mx-auto mb-2" />
              <p className="text-xs text-[#6C757D] mb-3">No symptom assessment reports on file.</p>
              <button
                onClick={() => onNavigate('symptom_checker')}
                className="px-4 py-1.5 rounded-full bg-[#D8F3DC] text-[#1B4332] font-bold text-xs border border-[#74C69D] hover:bg-[#D8F3DC]/70"
              >
                Run Health Check
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
