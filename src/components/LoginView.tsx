import React, { useState } from 'react';
import { PageView } from '../types';
import {
  HeartPulse,
  Mail,
  Lock,
  ArrowRight,
  ShieldCheck,
  Building,
  Clock,
  KeyRound,
  ShieldAlert
} from 'lucide-react';

interface LoginViewProps {
  onLogin: (email: string, role: 'patient' | 'admin') => void;
  onNavigate: (page: PageView) => void;
}

export const LoginView: React.FC<LoginViewProps> = ({ onLogin, onNavigate }) => {
  const [email, setEmail] = useState('sarah.jenkins@example.com');
  const [password, setPassword] = useState('patient123');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setError('Please fill in both email and password.');
      return;
    }

    if (email.toLowerCase() === 'admin@carenest.com') {
      onLogin(email, 'admin');
    } else {
      onLogin(email, 'patient');
    }
  };

  const handleFillDemo = (type: 'patient' | 'admin') => {
    if (type === 'patient') {
      setEmail('sarah.jenkins@example.com');
      setPassword('patient123');
    } else {
      setEmail('admin@carenest.com');
      setPassword('admin123');
    }
    setError('');
  };

  return (
    <div className="min-h-screen bg-[#F4F7F6] flex items-center justify-center p-4 sm:p-6 lg:p-8 font-sans text-[#2D3436]">
      <div className="max-w-4xl w-full bg-white rounded-[24px] shadow-xl border border-[#E9ECEF] overflow-hidden grid grid-cols-1 lg:grid-cols-12">
        
        {/* Left Side: Medical Graphic & Info */}
        <div className="lg:col-span-5 bg-gradient-to-br from-[#1B4332] via-[#2D6A4F] to-[#74C69D] p-8 sm:p-10 text-white flex flex-col justify-between relative overflow-hidden">
          <div className="relative z-10">
            <div className="flex items-center gap-2.5 mb-8">
              <div className="w-10 h-10 rounded-xl bg-white text-[#2D6A4F] flex items-center justify-center shadow-md">
                <HeartPulse className="w-6 h-6" />
              </div>
              <div>
                <span className="text-2xl font-black tracking-tight text-white">
                  CARE<span className="text-[#D8F3DC]">NEST</span>
                </span>
                <p className="text-[10px] text-[#D8F3DC] font-bold uppercase tracking-wider">Clinical Care Network</p>
              </div>
            </div>

            <h2 className="text-2xl sm:text-3xl font-extrabold text-white leading-tight mb-4">
              Your Compassionate Digital Health Partner
            </h2>
            <p className="text-[#D8F3DC]/90 text-sm leading-relaxed mb-6">
              Check symptoms securely, consult certified specialists, manage drug regimens, and store your clinical diagnostic records.
            </p>

            <div className="p-4 bg-white/10 backdrop-blur-sm rounded-2xl border border-white/20 mb-4">
              <div className="flex items-center gap-3">
                <ShieldCheck className="w-6 h-6 text-amber-300 shrink-0" />
                <div>
                  <div className="text-xs font-bold text-white">HIPAA-Grade Security</div>
                  <div className="text-[11px] text-[#D8F3DC]">All medical cards and records are encrypted.</div>
                </div>
              </div>
            </div>
          </div>

          <div className="relative z-10 pt-6 border-t border-white/20 flex justify-between text-xs text-[#D8F3DC]">
            <span className="flex items-center gap-1.5"><Building className="w-3.5 h-3.5" /> 50+ Partner Clinics</span>
            <span className="flex items-center gap-1.5"><Clock className="w-3.5 h-3.5" /> 24/7 Triage</span>
          </div>

          {/* Background subtle circle decoration */}
          <div className="absolute -bottom-16 -right-16 w-64 h-64 bg-white/10 rounded-full blur-2xl pointer-events-none" />
        </div>

        {/* Right Side: Login Form */}
        <div className="lg:col-span-7 p-8 sm:p-10 flex flex-col justify-center bg-white">
          <div className="mb-6">
            <span className="inline-block px-3 py-1 bg-[#D8F3DC] text-[#1B4332] text-xs font-bold rounded-full mb-2">
              Patient Member Portal
            </span>
            <h2 className="text-2xl font-bold text-[#2D3436] tracking-tight">Welcome Back</h2>
            <p className="text-sm text-[#6C757D] mt-1">Sign in with your credentials to open your dashboard.</p>
          </div>

          {/* Demo Auto-fill Helper */}
          <div className="p-3.5 mb-6 rounded-2xl bg-[#F8F9FA] border border-[#E9ECEF] text-xs">
            <div className="flex items-center justify-between mb-1.5">
              <span className="font-bold text-[#1B4332] flex items-center gap-1.5">
                <KeyRound className="w-3.5 h-3.5 text-[#2D6A4F]" />
                Quick Demo Credentials:
              </span>
              <div className="flex gap-1.5">
                <button
                  type="button"
                  onClick={() => handleFillDemo('patient')}
                  className="px-2.5 py-0.5 rounded-full bg-[#2D6A4F] text-white font-semibold text-[11px] hover:bg-[#1B4332] transition-colors"
                >
                  Fill Patient
                </button>
                <button
                  type="button"
                  onClick={() => handleFillDemo('admin')}
                  className="px-2.5 py-0.5 rounded-full bg-slate-800 text-white font-semibold text-[11px] hover:bg-slate-900 transition-colors"
                >
                  Fill Admin
                </button>
              </div>
            </div>
            <div className="text-[#6C757D]">
              Patient: <code className="text-[#1B4332] bg-white px-1.5 py-0.5 rounded border border-[#E9ECEF] font-mono">sarah.jenkins@example.com</code> / <code className="text-[#1B4332] bg-white px-1.5 py-0.5 rounded border border-[#E9ECEF] font-mono">patient123</code>
            </div>
          </div>

          {error && (
            <div className="p-3 mb-4 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-700 font-medium">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[#6C757D] mb-1.5">
                Email Address
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@example.com"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-[#DEE2E6] focus:border-[#2D6A4F] focus:ring-2 focus:ring-[#74C69D]/20 bg-[#F8F9FA] text-sm text-[#2D3436] placeholder:text-slate-400 outline-hidden transition-all"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[#6C757D] mb-1.5">
                Password
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-[#DEE2E6] focus:border-[#2D6A4F] focus:ring-2 focus:ring-[#74C69D]/20 bg-[#F8F9FA] text-sm text-[#2D3436] placeholder:text-slate-400 outline-hidden transition-all"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full mt-2 py-3 px-4 rounded-xl bg-[#2D6A4F] hover:bg-[#1B4332] text-white font-bold text-sm shadow-md shadow-[#1B4332]/20 flex items-center justify-center gap-2 transition-all cursor-pointer"
            >
              <span>Log In to Health Dashboard</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          <div className="mt-6 text-center text-xs text-[#6C757D]">
            Don't have a CareNest account?{' '}
            <button
              onClick={() => onNavigate('register')}
              className="text-[#2D6A4F] font-bold hover:underline"
            >
              Register Here
            </button>
          </div>

          <div className="mt-6 pt-4 border-t border-[#E9ECEF] text-center">
            <button
              onClick={() => onNavigate('admin_login')}
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#6C757D] hover:text-[#2D3436]"
            >
              <ShieldAlert className="w-3.5 h-3.5 text-rose-500" />
              Switch to Executive Administrator Portal
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
