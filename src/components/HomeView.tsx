import React from 'react';
import { PageView, User, Hospital, Doctor } from '../types';
import {
  HeartPulse,
  Activity,
  Building2,
  Pill,
  FileText,
  ArrowRight,
  ShieldCheck,
  Star,
  Calendar,
  PhoneCall,
  UserCheck
} from 'lucide-react';

interface HomeViewProps {
  user: User;
  hospitals: Hospital[];
  doctors: Doctor[];
  onNavigate: (page: PageView) => void;
  onOpenBooking: (hospital: Hospital) => void;
}

export const HomeView: React.FC<HomeViewProps> = ({
  user,
  hospitals,
  doctors,
  onNavigate,
  onOpenBooking,
}) => {
  return (
    <div className="space-y-6">
      {/* Green Gradient Hero Banner */}
      <div className="rounded-[24px] bg-gradient-to-r from-[#1B4332] via-[#2D6A4F] to-[#74C69D] text-white p-6 sm:p-10 shadow-lg shadow-[#1B4332]/10 relative overflow-hidden">
        <div className="max-w-3xl relative z-10">
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-white/15 backdrop-blur-md text-[#D8F3DC] text-xs font-bold mb-4 border border-white/20">
            <ShieldCheck className="w-4 h-4 text-[#74C69D]" />
            CareNest Certified Health Network
          </div>
          <h1 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight mb-3">
            Welcome to CareNest, {user.name}
          </h1>
          <p className="text-[#D8F3DC]/90 text-sm sm:text-base leading-relaxed mb-6 max-w-2xl">
            Your single clinical gateway for preliminary symptom assessment, booking certified medical specialists, managing verified prescriptions, and accessing encrypted medical records.
          </p>
          <div className="flex flex-wrap gap-3">
            <button
              onClick={() => onNavigate('symptom_checker')}
              className="px-5 py-2.5 rounded-full bg-white text-[#1B4332] hover:bg-[#F4F7F6] font-bold text-xs sm:text-sm shadow-md flex items-center gap-2 transition-all cursor-pointer"
            >
              <Activity className="w-4 h-4 text-[#2D6A4F]" />
              Start Symptom Check
            </button>
            <button
              onClick={() => onNavigate('hospitals')}
              className="px-5 py-2.5 rounded-full bg-[#1B4332]/80 hover:bg-[#1B4332] text-white border border-white/30 font-bold text-xs sm:text-sm flex items-center gap-2 transition-all cursor-pointer"
            >
              <Building2 className="w-4 h-4" />
              Find Hospitals & Doctors
            </button>
          </div>
        </div>

        {/* Decorative Background Blob */}
        <div className="absolute top-0 right-0 -mr-16 -mt-16 w-80 h-80 bg-white/10 rounded-full blur-3xl pointer-events-none" />
      </div>

      {/* 4 Feature Module Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div
          onClick={() => onNavigate('symptom_checker')}
          className="p-5 rounded-[22px] bg-white border border-[#E9ECEF] shadow-xs hover:shadow-md hover:border-[#74C69D] transition-all cursor-pointer group"
        >
          <div className="w-10 h-10 rounded-xl bg-[#D8F3DC] text-[#2D6A4F] flex items-center justify-center mb-3 group-hover:scale-105 transition-transform">
            <Activity className="w-5 h-5" />
          </div>
          <h3 className="font-bold text-[#2D3436] text-sm mb-1">Symptom Checker</h3>
          <p className="text-xs text-[#6C757D] mb-3">Interactive triage engine to evaluate health indicators & specialists.</p>
          <span className="text-xs font-bold text-[#2D6A4F] flex items-center gap-1">
            Check Symptoms <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
          </span>
        </div>

        <div
          onClick={() => onNavigate('hospitals')}
          className="p-5 rounded-[22px] bg-white border border-[#E9ECEF] shadow-xs hover:shadow-md hover:border-[#74C69D] transition-all cursor-pointer group"
        >
          <div className="w-10 h-10 rounded-xl bg-[#D8F3DC] text-[#2D6A4F] flex items-center justify-center mb-3 group-hover:scale-105 transition-transform">
            <Building2 className="w-5 h-5" />
          </div>
          <h3 className="font-bold text-[#2D3436] text-sm mb-1">Hospital Network</h3>
          <p className="text-xs text-[#6C757D] mb-3">Browse multi-specialty centers, live bed counts, & emergency lines.</p>
          <span className="text-xs font-bold text-[#2D6A4F] flex items-center gap-1">
            View Hospitals <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
          </span>
        </div>

        <div
          onClick={() => onNavigate('medicines')}
          className="p-5 rounded-[22px] bg-white border border-[#E9ECEF] shadow-xs hover:shadow-md hover:border-[#74C69D] transition-all cursor-pointer group"
        >
          <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center mb-3 group-hover:scale-105 transition-transform">
            <Pill className="w-5 h-5" />
          </div>
          <h3 className="font-bold text-[#2D3436] text-sm mb-1">Medicines Directory</h3>
          <p className="text-xs text-[#6C757D] mb-3">Detailed drug catalog with dosages, indications, and side effects.</p>
          <span className="text-xs font-bold text-amber-700 flex items-center gap-1">
            Browse Drugs <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
          </span>
        </div>

        <div
          onClick={() => onNavigate('reports')}
          className="p-5 rounded-[22px] bg-white border border-[#E9ECEF] shadow-xs hover:shadow-md hover:border-[#74C69D] transition-all cursor-pointer group"
        >
          <div className="w-10 h-10 rounded-xl bg-[#D8F3DC] text-[#1B4332] flex items-center justify-center mb-3 group-hover:scale-105 transition-transform">
            <FileText className="w-5 h-5" />
          </div>
          <h3 className="font-bold text-[#2D3436] text-sm mb-1">My Health Reports</h3>
          <p className="text-xs text-[#6C757D] mb-3">Review past checkup summaries, export clinical notes, and print PDFs.</p>
          <span className="text-xs font-bold text-[#2D6A4F] flex items-center gap-1">
            Open Reports <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
          </span>
        </div>
      </div>

      {/* Featured Hospitals and Doctors Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Hospitals */}
        <div className="p-6 rounded-[22px] bg-white border border-[#E9ECEF] shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Building2 className="w-5 h-5 text-[#2D6A4F]" />
              <h3 className="font-bold text-[#2D3436] text-base">Accredited Healthcare Facilities</h3>
            </div>
            <button
              onClick={() => onNavigate('hospitals')}
              className="text-xs font-bold text-[#2D6A4F] hover:underline"
            >
              View All
            </button>
          </div>

          <div className="space-y-3">
            {hospitals.slice(0, 3).map((h) => (
              <div key={h.id} className="p-3.5 rounded-2xl bg-[#F8F9FA] border border-[#E9ECEF] flex items-center gap-3.5">
                <img
                  src={h.image_url}
                  alt={h.name}
                  className="w-16 h-16 rounded-xl object-cover shrink-0"
                />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <h4 className="font-bold text-[#2D3436] text-xs truncate">{h.name}</h4>
                    <span className="inline-flex items-center gap-1 text-[11px] font-bold text-amber-800 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200">
                      <Star className="w-3 h-3 fill-amber-400 text-amber-500" />
                      {h.rating}
                    </span>
                  </div>
                  <p className="text-[11px] text-[#6C757D] truncate mt-0.5">{h.city} • {h.address}</p>
                  <div className="flex items-center gap-2 mt-1.5">
                    <span className="text-[10px] font-semibold bg-[#D8F3DC] text-[#1B4332] px-2 py-0.5 rounded-full">
                      {h.beds_available} Available Beds
                    </span>
                    <button
                      onClick={() => onOpenBooking(h)}
                      className="text-[10px] font-bold text-[#2D6A4F] hover:underline ml-auto"
                    >
                      Book Visit
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Featured Specialists */}
        <div className="p-6 rounded-[22px] bg-white border border-[#E9ECEF] shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <UserCheck className="w-5 h-5 text-[#2D6A4F]" />
              <h3 className="font-bold text-[#2D3436] text-base">Featured Medical Specialists</h3>
            </div>
            <button
              onClick={() => onNavigate('hospitals')}
              className="text-xs font-bold text-[#2D6A4F] hover:underline"
            >
              Consult Doctors
            </button>
          </div>

          <div className="space-y-3">
            {doctors.slice(0, 3).map((d) => (
              <div key={d.id} className="p-3.5 rounded-2xl bg-[#F8F9FA] border border-[#E9ECEF] flex items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-[#D8F3DC] text-[#1B4332] flex items-center justify-center font-bold text-xs shrink-0">
                    {d.name.replace('Dr. ', '')[0]}
                  </div>
                  <div>
                    <h4 className="font-bold text-[#2D3436] text-xs">{d.name}</h4>
                    <p className="text-[11px] font-semibold text-[#2D6A4F]">{d.specialty} • {d.experience_years} yrs exp</p>
                    <p className="text-[10px] text-[#6C757D] truncate max-w-[200px]">{d.hospital_name || 'CareNest Apex Center'}</p>
                  </div>
                </div>
                <button
                  onClick={() => onNavigate('hospitals')}
                  className="px-3.5 py-1 rounded-full text-xs font-bold bg-white text-[#2D6A4F] border border-[#74C69D] hover:bg-[#D8F3DC]/40 transition-colors shrink-0"
                >
                  Consult
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
