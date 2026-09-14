import React, { useState } from 'react';
import { PageView } from '../types';
import {
  ShieldAlert,
  Lock,
  Mail,
  ArrowRight,
  ArrowLeft,
  KeyRound,
  ShieldCheck
} from 'lucide-react';

interface AdminLoginViewProps {
  onAdminLogin: (email: string) => void;
  onNavigate: (page: PageView) => void;
}

export const AdminLoginView: React.FC<AdminLoginViewProps> = ({ onAdminLogin, onNavigate }) => {
  const [email, setEmail] = useState('admin@carenest.com');
  const [password, setPassword] = useState('admin123');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setError('Please provide administrative email and password.');
      return;
    }
    if (email.toLowerCase() === 'admin@carenest.com' && password === 'admin123') {
      onAdminLogin(email);
    } else {
      setError('Invalid administrative credentials. Use admin@carenest.com / admin123');
    }
  };

  return (
    <div className="min-h-screen bg-[#F4F7F6] flex items-center justify-center p-4 sm:p-6 font-sans text-[#2D3436]">
      <div className="max-w-md w-full bg-white rounded-[24px] shadow-xl p-8 border border-[#E9ECEF]">
        <div className="text-center mb-6">
          <div className="w-14 h-14 bg-[#D8F3DC] text-[#1B4332] rounded-2xl flex items-center justify-center mx-auto mb-3 shadow-xs">
            <ShieldAlert className="w-8 h-8 text-[#2D6A4F]" />
          </div>
          <h2 className="text-2xl font-extrabold text-[#2D3436]">Hospital Administration</h2>
          <p className="text-xs text-[#6C757D] mt-1">Authorized Medical Officers & System Administrators Only</p>
        </div>

        {/* Demo Helper */}
        <div className="p-3 mb-5 rounded-2xl bg-[#F8F9FA] border border-[#E9ECEF] text-xs text-[#2D3436]">
          <div className="font-bold text-[#1B4332] mb-1 flex items-center gap-1.5">
            <KeyRound className="w-3.5 h-3.5 text-[#2D6A4F]" />
            Executive Admin Credentials:
          </div>
          <div>Email: <code className="bg-white px-1.5 py-0.5 rounded text-[#1B4332] border border-[#E9ECEF] font-mono">admin@carenest.com</code></div>
          <div>Password: <code className="bg-white px-1.5 py-0.5 rounded text-[#1B4332] border border-[#E9ECEF] font-mono">admin123</code></div>
        </div>

        {error && (
          <div className="p-3 mb-4 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-700 font-medium">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-[#6C757D] mb-1.5">Admin Email</label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-[#DEE2E6] text-xs bg-[#F8F9FA] focus:bg-white focus:border-[#2D6A4F] outline-hidden"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-[#6C757D] mb-1.5">Master Key / Password</label>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-[#DEE2E6] text-xs bg-[#F8F9FA] focus:bg-white focus:border-[#2D6A4F] outline-hidden"
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-3 px-4 rounded-xl bg-[#2D6A4F] hover:bg-[#1B4332] text-white font-bold text-xs shadow-md shadow-[#1B4332]/20 flex items-center justify-center gap-2 transition-all cursor-pointer"
          >
            <span>Authenticate Administrative Console</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        <div className="mt-6 pt-4 border-t border-[#E9ECEF] text-center">
          <button
            onClick={() => onNavigate('login')}
            className="text-xs font-semibold text-[#6C757D] hover:text-[#2D3436] flex items-center justify-center gap-1.5 mx-auto"
          >
            <ArrowLeft className="w-3.5 h-3.5" /> Back to Patient Member Login
          </button>
        </div>
      </div>
    </div>
  );
};
