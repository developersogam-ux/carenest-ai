import React, { useState } from 'react';
import { Hospital, Doctor, Appointment, PageView } from '../types';
import {
  Building2,
  Search,
  MapPin,
  Phone,
  ShieldAlert,
  Star,
  Calendar,
  X,
  CheckCircle2,
  Clock,
  User
} from 'lucide-react';

interface HospitalsViewProps {
  hospitals: Hospital[];
  doctors: Doctor[];
  onBookAppointment: (appointment: Partial<Appointment>) => void;
  onNavigate: (page: PageView) => void;
}

export const HospitalsView: React.FC<HospitalsViewProps> = ({
  hospitals,
  doctors,
  onBookAppointment,
  onNavigate,
}) => {
  const [search, setSearch] = useState('');
  const [cityFilter, setCityFilter] = useState('');
  const [selectedHospital, setSelectedHospital] = useState<Hospital | null>(null);

  // Booking Modal Form State
  const [doctorId, setDoctorId] = useState<number | ''>('');
  const [date, setDate] = useState('2026-03-12');
  const [time, setTime] = useState('10:00 AM');
  const [reason, setReason] = useState('General Health Consultation');
  const [bookingSuccess, setBookingSuccess] = useState(false);

  const cities = Array.from(new Set(hospitals.map((h) => h.city)));

  const filteredHospitals = hospitals.filter((h) => {
    const matchesSearch =
      h.name.toLowerCase().includes(search.toLowerCase()) ||
      h.specialties.toLowerCase().includes(search.toLowerCase()) ||
      h.address.toLowerCase().includes(search.toLowerCase());
    const matchesCity = cityFilter ? h.city === cityFilter : true;
    return matchesSearch && matchesCity;
  });

  const handleOpenBooking = (h: Hospital) => {
    setSelectedHospital(h);
    const firstDoc = doctors.find((d) => d.hospital_id === h.id);
    if (firstDoc) setDoctorId(firstDoc.id);
    setBookingSuccess(false);
  };

  const handleConfirmBooking = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedHospital || !doctorId) return;

    const doc = doctors.find((d) => d.id === Number(doctorId));
    if (!doc) return;

    onBookAppointment({
      doctor_id: doc.id,
      doctor_name: doc.name,
      doctor_specialty: doc.specialty,
      hospital_id: selectedHospital.id,
      hospital_name: selectedHospital.name,
      appointment_date: date,
      appointment_time: time,
      status: 'Confirmed',
      reason,
      created_at: new Date().toISOString().split('T')[0],
    });

    setBookingSuccess(true);

    setTimeout(() => {
      setSelectedHospital(null);
      setBookingSuccess(false);
      onNavigate('dashboard');
    }, 1200);
  };

  return (
    <div className="space-y-6 font-sans text-[#2D3436]">
      {/* Search and Filters Header */}
      <div className="p-6 rounded-[22px] bg-white border border-[#E9ECEF] shadow-xs">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-4">
          <div>
            <h2 className="text-xl font-bold text-[#2D3436] flex items-center gap-2">
              <Building2 className="w-5 h-5 text-[#2D6A4F]" />
              Partner Healthcare Facilities & Clinics
            </h2>
            <p className="text-xs text-[#6C757D]">
              Browse accredited hospital centers, check live inpatient bed capacity, and book consultations.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 mb-3">
          <div className="sm:col-span-8 relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search by facility name, specialty (e.g. Cardiology), or address..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-[#DEE2E6] text-xs bg-[#F8F9FA] focus:bg-white focus:border-[#2D6A4F] outline-hidden"
            />
          </div>

          <div className="sm:col-span-4">
            <select
              value={cityFilter}
              onChange={(e) => setCityFilter(e.target.value)}
              className="w-full px-3 py-2.5 rounded-xl border border-[#DEE2E6] text-xs bg-[#F8F9FA] focus:bg-white focus:border-[#2D6A4F] outline-hidden"
            >
              <option value="">All Partner Cities ({hospitals.length})</option>
              {cities.map((c) => {
                const count = hospitals.filter((h) => h.city === c).length;
                return (
                  <option key={c} value={c}>
                    {c} ({count} facilities)
                  </option>
                );
              })}
            </select>
          </div>
        </div>

        {/* Quick City Filter Badges */}
        <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-[#F1F3F5]">
          <span className="text-xs font-semibold text-[#6C757D] mr-1">Quick Filter:</span>
          <button
            onClick={() => setCityFilter('')}
            className={`px-3 py-1 rounded-full text-xs font-semibold transition-all ${
              cityFilter === ''
                ? 'bg-[#1B4332] text-white shadow-xs'
                : 'bg-[#F8F9FA] text-[#2D3436] hover:bg-[#E9ECEF] border border-[#DEE2E6]'
            }`}
          >
            All Cities ({hospitals.length})
          </button>
          {['Mumbai', 'Pune', 'Delhi'].map((c) => {
            const count = hospitals.filter((h) => h.city.toLowerCase() === c.toLowerCase()).length;
            const isActive = cityFilter.toLowerCase() === c.toLowerCase();
            return (
              <button
                key={c}
                onClick={() => setCityFilter(isActive ? '' : c)}
                className={`px-3 py-1 rounded-full text-xs font-semibold transition-all flex items-center gap-1.5 ${
                  isActive
                    ? 'bg-[#2D6A4F] text-white shadow-xs'
                    : 'bg-[#E8F5E9] text-[#1B4332] hover:bg-[#D8F3DC] border border-[#B7E4C7]'
                }`}
              >
                <span>{c}</span>
                <span className={`text-[10px] px-1.5 py-0.2 rounded-full ${isActive ? 'bg-white/20 text-white' : 'bg-[#2D6A4F]/10 text-[#2D6A4F]'}`}>
                  {count}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Hospitals Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredHospitals.map((h) => (
          <div key={h.id} className="p-5 rounded-[22px] bg-white border border-[#E9ECEF] shadow-xs flex flex-col justify-between hover:shadow-md transition-all">
            <div>
              <div className="relative rounded-2xl overflow-hidden mb-4 h-48">
                <img
                  src={h.image_url}
                  alt={h.name}
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-3 right-3 px-2.5 py-1 rounded-full bg-white/90 backdrop-blur-sm text-[#2D3436] font-bold text-xs shadow-xs flex items-center gap-1">
                  <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                  {h.rating} / 5.0
                </div>
                <div className="absolute bottom-3 left-3 px-3 py-1 rounded-full bg-[#2D6A4F] text-white font-bold text-xs shadow-xs">
                  {h.beds_available} Available Beds
                </div>
              </div>

              <h3 className="text-base font-extrabold text-[#2D3436] mb-1">{h.name}</h3>
              <p className="text-xs text-[#6C757D] flex items-center gap-1.5 mb-3">
                <MapPin className="w-3.5 h-3.5 text-rose-500 shrink-0" />
                {h.city} • {h.address}
              </p>

              <div className="mb-4">
                <span className="text-[10px] font-bold text-[#6C757D] uppercase tracking-wider block mb-1.5">Specialties</span>
                <div className="flex flex-wrap gap-1.5">
                  {h.specialties.split(',').map((spec, i) => (
                    <span key={i} className="text-[11px] font-medium bg-[#F8F9FA] text-[#2D3436] border border-[#E9ECEF] px-2.5 py-0.5 rounded-full">
                      {spec.trim()}
                    </span>
                  ))}
                </div>
              </div>

              <div className="p-3 bg-[#F8F9FA] rounded-2xl flex flex-wrap justify-between items-center text-xs gap-2 mb-4 border border-[#E9ECEF]">
                <span className="text-[#6C757D] flex items-center gap-1">
                  <Phone className="w-3.5 h-3.5 text-[#2D6A4F]" />
                  Helpline: <strong className="text-[#2D3436]">{h.phone}</strong>
                </span>
                <span className="text-rose-600 font-bold flex items-center gap-1">
                  <ShieldAlert className="w-3.5 h-3.5" />
                  Emergency: <strong>{h.emergency_phone || '911'}</strong>
                </span>
              </div>
            </div>

            <button
              onClick={() => handleOpenBooking(h)}
              className="w-full py-2.5 px-4 rounded-xl bg-[#2D6A4F] hover:bg-[#1B4332] text-white font-bold text-xs flex items-center justify-center gap-2 shadow-sm transition-all cursor-pointer"
            >
              <Calendar className="w-4 h-4" />
              Schedule Doctor Consultation
            </button>
          </div>
        ))}
      </div>

      {/* Booking Modal */}
      {selectedHospital && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-[24px] max-w-md w-full p-6 shadow-2xl border border-[#E9ECEF] animate-in fade-in zoom-in-95 duration-150 relative font-sans text-[#2D3436]">
            <button
              onClick={() => setSelectedHospital(null)}
              className="absolute top-4 right-4 p-1.5 text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-100"
            >
              <X className="w-5 h-5" />
            </button>

            {bookingSuccess ? (
              <div className="text-center py-8">
                <div className="w-14 h-14 bg-[#D8F3DC] text-[#1B4332] rounded-full flex items-center justify-center mx-auto mb-3">
                  <CheckCircle2 className="w-8 h-8 text-[#2D6A4F]" />
                </div>
                <h3 className="text-lg font-bold text-[#2D3436] mb-1">Appointment Confirmed!</h3>
                <p className="text-xs text-[#6C757D]">Redirecting to your patient dashboard...</p>
              </div>
            ) : (
              <form onSubmit={handleConfirmBooking} className="space-y-4">
                <div className="flex items-center gap-2">
                  <Calendar className="w-5 h-5 text-[#2D6A4F]" />
                  <h3 className="text-base font-bold text-[#2D3436]">Book Doctor Consultation</h3>
                </div>

                <div className="p-3 bg-[#D8F3DC]/60 rounded-2xl text-xs text-[#1B4332] border border-[#74C69D]/40">
                  <strong>Facility:</strong> {selectedHospital.name} ({selectedHospital.city})
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#2D3436] mb-1">Select Medical Specialist *</label>
                  <select
                    value={doctorId}
                    onChange={(e) => setDoctorId(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl border border-[#DEE2E6] text-xs bg-[#F8F9FA] focus:bg-white focus:border-[#2D6A4F] outline-hidden"
                    required
                  >
                    {doctors
                      .filter((d) => d.hospital_id === selectedHospital.id)
                      .map((doc) => (
                        <option key={doc.id} value={doc.id}>
                          {doc.name} ({doc.specialty} - ₹{doc.consultation_fee})
                        </option>
                      ))}
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-[#2D3436] mb-1">Preferred Date *</label>
                    <input
                      type="date"
                      value={date}
                      onChange={(e) => setDate(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl border border-[#DEE2E6] text-xs bg-[#F8F9FA] focus:bg-white focus:border-[#2D6A4F] outline-hidden"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-[#2D3436] mb-1">Preferred Time *</label>
                    <select
                      value={time}
                      onChange={(e) => setTime(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl border border-[#DEE2E6] text-xs bg-[#F8F9FA] focus:bg-white focus:border-[#2D6A4F] outline-hidden"
                    >
                      <option value="09:30 AM">09:30 AM</option>
                      <option value="11:00 AM">11:00 AM</option>
                      <option value="02:00 PM">02:00 PM</option>
                      <option value="04:30 PM">04:30 PM</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#2D3436] mb-1">Consultation Reason / Symptoms</label>
                  <input
                    type="text"
                    value={reason}
                    onChange={(e) => setReason(e.target.value)}
                    placeholder="e.g. Regular physical checkup, follow-up"
                    className="w-full px-3 py-2 rounded-xl border border-[#DEE2E6] text-xs bg-[#F8F9FA] focus:bg-white focus:border-[#2D6A4F] outline-hidden"
                  />
                </div>

                <div className="flex gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setSelectedHospital(null)}
                    className="flex-1 py-2.5 rounded-xl border border-[#DEE2E6] text-[#6C757D] font-bold text-xs hover:bg-[#F8F9FA]"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 py-2.5 rounded-xl bg-[#2D6A4F] hover:bg-[#1B4332] text-white font-bold text-xs shadow-sm transition-all"
                  >
                    Confirm Booking
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
