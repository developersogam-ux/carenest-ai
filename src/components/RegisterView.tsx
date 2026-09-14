import React, { useState } from 'react';
import { PageView, User } from '../types';
import {
  HeartPulse,
  User as UserIcon,
  Mail,
  Lock,
  Phone,
  Droplet,
  ShieldCheck,
  ArrowRight,
  ArrowLeft
} from 'lucide-react';

interface RegisterViewProps {
  onRegister: (user: Partial<User>) => void;
  onNavigate: (page: PageView) => void;
}

export const RegisterView: React.FC<RegisterViewProps> = ({ onRegister, onNavigate }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    phone: '',
    blood_group: '',
    age: 28,
    gender: 'Female',
    allergies: '',
    emergency_contact: '',
  });
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.password) {
      setError('Please fill in required fields: Name, Email, and Password.');
      return;
    }
    if (!formData.blood_group) {
      setError('Please select your Blood Group. It is mandatory for medical safety.');
      return;
    }
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match.');
      return;
    }
    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }

    onRegister({
      name: formData.name,
      email: formData.email.toLowerCase(),
      role: 'patient',
      phone: formData.phone,
      blood_group: formData.blood_group,
      age: Number(formData.age),
      gender: formData.gender,
      allergies: formData.allergies || 'None',
      emergency_contact: formData.emergency_contact,
      created_at: new Date().toISOString().split('T')[0],
    });
  };

  return (
    <div className="min-h-screen bg-[#F4F7F6] flex items-center justify-center p-4 sm:p-6 lg:p-8 font-sans text-[#2D3436]">
      <div className="max-w-4xl w-full bg-white rounded-[24px] shadow-xl border border-[#E9ECEF] overflow-hidden grid grid-cols-1 lg:grid-cols-12">
        
        {/* Left Informative Column */}
        <div className="lg:col-span-4 bg-gradient-to-br from-[#1B4332] via-[#2D6A4F] to-[#74C69D] p-8 text-white flex flex-col justify-between hidden lg:flex">
          <div>
            <div className="flex items-center gap-2 mb-6">
              <div className="w-8 h-8 rounded-lg bg-white text-[#2D6A4F] flex items-center justify-center font-bold">
                <HeartPulse className="w-5 h-5" />
              </div>
              <span className="text-xl font-bold tracking-tight">CARENEST</span>
            </div>

            <h3 className="text-xl font-extrabold text-white mb-3">Join CareNest Network</h3>
            <p className="text-xs text-[#D8F3DC]/90 leading-relaxed mb-6">
              Create your permanent medical card for streamlined hospital visits, symptom assessment logs, and automated clinical summaries.
            </p>

            <div className="space-y-3 text-xs text-white/90">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-[#74C69D]" />
                <span>Encrypted Patient Health Logs</span>
              </div>
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-[#74C69D]" />
                <span>Instant Specialist Referrals</span>
              </div>
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-[#74C69D]" />
                <span>Hospital Emergency Hotline Linking</span>
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-white/20 text-xs text-[#D8F3DC]">
            Already registered?{' '}
            <button onClick={() => onNavigate('login')} className="text-white font-bold underline">
              Log In
            </button>
          </div>
        </div>

        {/* Right Form Column */}
        <div className="lg:col-span-8 p-6 sm:p-8 bg-white">
          <div className="flex items-center justify-between mb-6">
            <div>
              <span className="inline-block px-3 py-0.5 bg-[#D8F3DC] text-[#1B4332] text-xs font-bold rounded-full mb-1">
                New Enrollment
              </span>
              <h2 className="text-xl sm:text-2xl font-bold text-[#2D3436]">Create Patient Account</h2>
            </div>
            <button
              onClick={() => onNavigate('login')}
              className="text-xs font-semibold text-[#6C757D] hover:text-[#1B4332] flex items-center gap-1"
            >
              <ArrowLeft className="w-3.5 h-3.5" /> Back to Login
            </button>
          </div>

          {error && (
            <div className="p-3 mb-4 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-700 font-medium">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-[#2D3436] mb-1">Full Legal Name *</label>
                <div className="relative">
                  <UserIcon className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    required
                    placeholder="e.g. Sarah Jenkins"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full pl-9 pr-3 py-2 rounded-xl border border-[#DEE2E6] text-xs bg-[#F8F9FA] focus:bg-white focus:border-[#2D6A4F] outline-hidden"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#2D3436] mb-1">Email Address *</label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="email"
                    required
                    placeholder="patient@example.com"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full pl-9 pr-3 py-2 rounded-xl border border-[#DEE2E6] text-xs bg-[#F8F9FA] focus:bg-white focus:border-[#2D6A4F] outline-hidden"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#2D3436] mb-1">Password (min 6 chars) *</label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="password"
                    required
                    minLength={6}
                    placeholder="Create password"
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    className="w-full pl-9 pr-3 py-2 rounded-xl border border-[#DEE2E6] text-xs bg-[#F8F9FA] focus:bg-white focus:border-[#2D6A4F] outline-hidden"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#2D3436] mb-1">Confirm Password *</label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="password"
                    required
                    minLength={6}
                    placeholder="Confirm password"
                    value={formData.confirmPassword}
                    onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                    className="w-full pl-9 pr-3 py-2 rounded-xl border border-[#DEE2E6] text-xs bg-[#F8F9FA] focus:bg-white focus:border-[#2D6A4F] outline-hidden"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#2D3436] mb-1">Contact Phone</label>
                <div className="relative">
                  <Phone className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    placeholder="+1 (555) 000-0000"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full pl-9 pr-3 py-2 rounded-xl border border-[#DEE2E6] text-xs bg-[#F8F9FA] focus:bg-white focus:border-[#2D6A4F] outline-hidden"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#2D3436] mb-1">
                  Blood Group <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <Droplet className="w-4 h-4 text-rose-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <select
                    required
                    value={formData.blood_group}
                    onChange={(e) => setFormData({ ...formData, blood_group: e.target.value })}
                    className="w-full pl-9 pr-3 py-2 rounded-xl border border-[#DEE2E6] text-xs bg-[#F8F9FA] focus:bg-white focus:border-[#2D6A4F] outline-hidden"
                  >
                    <option value=""selected>Select Blood Group</option>
                    {['A+', 'A-', 'B+', 'B-', 'O+', 'O-', 'AB+', 'AB-'].map((bg) => (
                      <option key={bg} value={bg}>{bg}</option>
                    ))}
                  </select>
                </div>
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
                  <option value=""disabled selected >Select your gender</option>
                  <option value="Female">Female</option>
                  <option value="Male">Male</option>
                  <option value="Non-Binary">Non-Binary</option>
                  <option value="Prefer not to say">Prefer not to say</option>
                </select>
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-semibold text-[#2D3436] mb-1">Known Allergies / Pre-existing Conditions</label>
                <input
                  type="text"
                  placeholder="e.g. Penicillin, Peanuts, Pollen (or None)"
                  value={formData.allergies}
                  onChange={(e) => setFormData({ ...formData, allergies: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-[#DEE2E6] text-xs bg-[#F8F9FA] focus:bg-white focus:border-[#2D6A4F] outline-hidden"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-semibold text-[#2D3436] mb-1">Emergency Contact Person & Phone</label>
                <input
                  type="text"
                  placeholder="e.g. Robert Jenkins (+1 555-987-6543)"
                  value={formData.emergency_contact}
                  onChange={(e) => setFormData({ ...formData, emergency_contact: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-[#DEE2E6] text-xs bg-[#F8F9FA] focus:bg-white focus:border-[#2D6A4F] outline-hidden"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full mt-4 py-2.5 px-4 rounded-xl bg-[#2D6A4F] hover:bg-[#1B4332] text-white font-bold text-xs shadow-sm flex items-center justify-center gap-2 cursor-pointer transition-all"
            >
              <span>Enroll & Open CareNest Health Portal</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};