import React, { useState } from 'react';
import { User } from '../types';
import {
  User as UserIcon,
  ShieldCheck,
  Droplet,
  Phone,
  Mail,
  AlertTriangle,
  Save,
  QrCode,
  HeartPulse
} from 'lucide-react';

interface ProfileViewProps {
  user: User;
  onUpdateProfile: (updated: Partial<User>) => void;
}

export const ProfileView: React.FC<ProfileViewProps> = ({ user, onUpdateProfile }) => {
  const [formData, setFormData] = useState({
    name: user.name,
    email: user.email,
    phone: user.phone || '+91 0000000000',
    blood_group: user.blood_group || '',
    age: user.age || 29,
    gender: user.gender || 'Female',
    allergies: user.allergies || 'Penicillin, Peanuts',
    emergency_contact: user.emergency_contact || 'Robert Jenkins (+1 555-987-6543)',
  });
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  React.useEffect(() => {
    setFormData({
      name: user.name,
      email: user.email,
      phone: user.phone || '+91 0000000000',
      blood_group: user.blood_group || '',
      age: user.age || 29,
      gender: user.gender || 'Female',
      allergies: user.allergies || 'Penicillin, Peanuts',
      emergency_contact: user.emergency_contact || 'Robert Jenkins (+1 555-987-6543)',
    });
  }, [user]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.blood_group) {
      setErrorMessage('Please select a valid Blood Group. This field is mandatory.');
      return;
    }
    setErrorMessage('');
    onUpdateProfile(formData);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  return (
    <div className="space-y-6 font-sans text-[#2D3436]">
      {/* Header */}
      <div className="p-6 rounded-[22px] bg-white border border-[#E9ECEF] shadow-xs">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#D8F3DC] text-[#2D6A4F] flex items-center justify-center">
            <UserIcon className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-[#2D3436]">Patient Profile & Digital Emergency Card</h2>
            <p className="text-xs text-[#6C757D]">
              Manage your personal demographics, critical blood group, known drug allergies, and emergency contacts.
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Profile Edit Form */}
        <div className="lg:col-span-7 p-6 rounded-[22px] bg-white border border-[#E9ECEF] shadow-xs">
          <h3 className="font-bold text-[#2D3436] text-base mb-4">Edit Demographics & Medical Profile</h3>

          {errorMessage && (
            <div className="p-3 mb-4 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-700 font-medium flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-rose-500 shrink-0" />
              {errorMessage}
            </div>
          )}

          {savedSuccess && (
            <div className="p-3 mb-4 rounded-xl bg-[#D8F3DC] border border-[#74C69D] text-xs text-[#1B4332] font-bold flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-[#2D6A4F]" />
              Profile updated and re-encrypted successfully.
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-[#2D3436] mb-1">Full Legal Name *</label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-[#DEE2E6] text-xs bg-[#F8F9FA] focus:bg-white focus:border-[#2D6A4F] outline-hidden"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#2D3436] mb-1">Account Email (Permanent)</label>
                <input
                  type="email"
                  disabled
                  value={formData.email}
                  className="w-full px-3 py-2 rounded-xl border border-[#DEE2E6] text-xs bg-[#F8F9FA] text-[#6C757D] outline-hidden cursor-not-allowed"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#2D3436] mb-1">Primary Phone</label>
                <input
                  type="text"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-[#DEE2E6] text-xs bg-[#F8F9FA] focus:bg-white focus:border-[#2D6A4F] outline-hidden"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#2D3436] mb-1">
                  Blood Group <span className="text-rose-500">*</span>
                </label>
                <select
                  required
                  value={formData.blood_group}
                  onChange={(e) => {
                    setFormData({ ...formData, blood_group: e.target.value });
                    if (e.target.value) setErrorMessage('');
                  }}
                  className="w-full px-3 py-2 rounded-xl border border-[#DEE2E6] text-xs bg-[#F8F9FA] focus:bg-white focus:border-[#2D6A4F] outline-hidden"
                >
                  <option value=""selected>Select Blood Group</option>
                  {['A+', 'A-', 'B+', 'B-', 'O+', 'O-', 'AB+', 'AB-'].map((bg) => (
                    <option key={bg} value={bg}>{bg}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#2D3436] mb-1">Age</label>
                <input
                  type="number"
                  value={formData.age}
                  onChange={(e) => setFormData({ ...formData, age: Number(e.target.value) })}
                  className="w-full px-3 py-2 rounded-xl border border-[#DEE2E6] text-xs bg-[#F8F9FA] focus:bg-white focus:border-[#2D6A4F] outline-hidden"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#2D3436] mb-1">Gender</label>
                <select
                  value={formData.gender}
                  onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-[#DEE2E6] text-xs bg-[#F8F9FA] focus:bg-white focus:border-[#2D6A4F] outline-hidden"
                >
                  <option value=""disabled selected hidden>Select your gender</option>
                  <option value="Female">Female</option>
                  <option value="Male">Male</option>
                  <option value="Non-Binary">Non-Binary</option>
                  <option value="Prefer not to say">Prefer not to say</option>
                </select>
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-semibold text-[#2D3436] mb-1">Known Allergies / Warnings</label>
                <input
                  type="text"
                  value={formData.allergies}
                  onChange={(e) => setFormData({ ...formData, allergies: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-[#DEE2E6] text-xs bg-[#F8F9FA] focus:bg-white focus:border-[#2D6A4F] outline-hidden"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-semibold text-[#2D3436] mb-1">Emergency Contact Person & Phone *</label>
                <input
                  type="text"
                  value={formData.emergency_contact}
                  onChange={(e) => setFormData({ ...formData, emergency_contact: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-[#DEE2E6] text-xs bg-[#F8F9FA] focus:bg-white focus:border-[#2D6A4F] outline-hidden"
                />
              </div>
            </div>

            <button
              type="submit"
              className="mt-4 px-5 py-2.5 rounded-xl bg-[#2D6A4F] hover:bg-[#1B4332] text-white font-bold text-xs shadow-sm flex items-center gap-2 cursor-pointer transition-all"
            >
              <Save className="w-4 h-4" /> Save Profile Details
            </button>
          </form>
        </div>

        {/* Digital Emergency Medical Badge */}
        <div className="lg:col-span-5 p-6 rounded-[22px] bg-[#1B4332] text-white shadow-xl flex flex-col justify-between relative overflow-hidden">
          <div className="relative z-10">
            <div className="flex items-center justify-between mb-4 border-b border-white/15 pb-3">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-[#74C69D] text-[#1B4332] flex items-center justify-center font-bold">
                  <HeartPulse className="w-4 h-4 text-[#1B4332]" />
                </div>
                <span className="font-extrabold text-sm tracking-tight text-white">CARENEST MEDICAL BADGE</span>
              </div>
              <span className="text-[10px] uppercase font-bold text-[#74C69D] border border-[#74C69D]/40 px-2 py-0.5 rounded-full">
                EMERGENCY ID
              </span>
            </div>

            <div className="flex items-center gap-4 mb-6">
              <div className="w-14 h-14 rounded-2xl bg-[#2D6A4F] text-white font-bold text-xl flex items-center justify-center shadow-lg border border-[#74C69D]/30">
                {formData.name[0]}
              </div>
              <div>
                <h4 className="font-extrabold text-base text-white">{formData.name}</h4>
                <p className="text-xs text-white/70">{formData.age} yrs • {formData.gender}</p>
                <p className="text-[11px] text-white/60">{formData.phone}</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 mb-4">
              <div className="p-3 bg-white/10 rounded-2xl border border-white/15">
                <span className="text-[10px] text-white/70 uppercase font-bold block">Blood Group</span>
                <span className="text-lg font-black text-rose-300">{formData.blood_group || 'Not Set'}</span>
              </div>
              <div className="p-3 bg-white/10 rounded-2xl border border-white/15">
                <span className="text-[10px] text-white/70 uppercase font-bold block">Status</span>
                <span className="text-xs font-bold text-[#74C69D]">Verified Patient</span>
              </div>
            </div>

            <div className="p-3 bg-rose-950/40 border border-rose-800/50 rounded-2xl mb-3 text-xs">
              <span className="text-[10px] uppercase font-bold text-rose-300 block mb-0.5">Critical Allergies / Warnings:</span>
              <span className="font-semibold text-white">{formData.allergies || 'No known allergies reported'}</span>
            </div>

            <div className="p-3 bg-white/10 rounded-2xl border border-white/15 text-xs">
              <span className="text-[10px] uppercase font-bold text-white/70 block mb-0.5">Emergency Contact:</span>
              <span className="font-semibold text-white">{formData.emergency_contact || 'None registered'}</span>
            </div>
          </div>

          <div className="relative z-10 pt-4 border-t border-white/15 flex justify-between items-center text-[10px] text-white/60">
            <span>ID: CN-PT-#{user.id.toString().padStart(5, '0')}</span>
            <span>CareNest Global Health Network</span>
          </div>

          {/* Background Glow */}
          <div className="absolute top-0 right-0 w-48 h-48 bg-[#74C69D]/15 rounded-full blur-3xl pointer-events-none" />
        </div>
      </div>
    </div>
  );
};
