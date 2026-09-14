import React from 'react';
import { PageView, User } from '../types';
import {
  LayoutDashboard,
  Activity,
  Building2,
  Pill,
  FileText,
  User as UserIcon,
  LogOut,
  Users,
  BarChart3,
  Stethoscope
} from 'lucide-react';

interface SidebarProps {
  currentUser: User;
  currentPage: PageView;
  onNavigate: (page: PageView) => void;
  onLogout: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentUser,
  currentPage,
  onNavigate,
  onLogout,
}) => {
  const isPatient = currentUser.role === 'patient';

  const patientLinks = [
    { page: 'dashboard' as PageView, label: 'Overview', icon: LayoutDashboard },
    { page: 'symptom_checker' as PageView, label: 'Symptom Checker', icon: Activity },
    { page: 'hospitals' as PageView, label: 'Find Hospitals', icon: Building2 },
    { page: 'medicines' as PageView, label: 'Medicine Directory', icon: Pill },
    { page: 'reports' as PageView, label: 'Health Reports', icon: FileText },
    { page: 'profile' as PageView, label: 'Profile & Medical Card', icon: UserIcon },
  ];

  const adminLinks = [
    { page: 'admin_dashboard' as PageView, label: 'System Overview', icon: LayoutDashboard },
    { page: 'manage_doctors' as PageView, label: 'Manage Doctors', icon: Stethoscope },
    { page: 'manage_medicines' as PageView, label: 'Manage Medicines', icon: Pill },
    { page: 'manage_hospitals' as PageView, label: 'Manage Hospitals', icon: Building2 },
    { page: 'analytics' as PageView, label: 'Reports & Analytics', icon: BarChart3 },
  ];

  const links = isPatient ? patientLinks : adminLinks;

  return (
    <aside className="w-64 shrink-0 bg-gradient-to-b from-[#1B4332] to-[#2D6A4F] text-white border-r border-[#1B4332]/40 p-4 flex flex-col justify-between hidden md:flex min-h-[calc(100vh-4rem)] shadow-xl">
      <div>
        {/* User Card Header */}
        <div className="p-3.5 mb-4 rounded-2xl text-center bg-white/10 border border-white/15">
          <div className={`w-12 h-12 mx-auto rounded-full font-bold text-lg flex items-center justify-center mb-2 shadow-xs ${isPatient ? 'bg-white text-[#2D6A4F]' : 'bg-rose-600 text-white'}`}>
            {currentUser.name[0]}
          </div>
          <h4 className="font-bold text-white text-sm truncate">{currentUser.name}</h4>
          <span className={`inline-block text-[11px] font-semibold px-2.5 py-0.5 rounded-full mt-1.5 ${isPatient ? 'bg-[#D8F3DC] text-[#1B4332]' : 'bg-rose-100 text-rose-800'}`}>
            {isPatient ? `Blood: ${currentUser.blood_group || 'Not Set'}` : 'Chief Admin'}
          </span>
        </div>

        {/* Nav Items */}
        <div className="space-y-1">
          {links.map((link) => {
            const Icon = link.icon;
            const active = currentPage === link.page;
            return (
              <button
                key={link.page}
                onClick={() => onNavigate(link.page)}
                className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all text-left ${
                  active
                    ? isPatient
                      ? 'bg-white/20 text-white font-semibold shadow-xs border border-white/25'
                      : 'bg-rose-600 text-white font-semibold shadow-sm shadow-rose-600/25'
                    : 'text-white/75 hover:bg-white/10 hover:text-white'
                }`}
              >
                <Icon className={`w-4 h-4 ${active ? 'text-[#74C69D]' : 'text-white/60'}`} />
                <span>{link.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Footer Sign Out */}
      <div className="pt-4 border-t border-white/15">
        <button
          onClick={onLogout}
          className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium text-rose-200 hover:bg-rose-500/20 hover:text-white transition-all text-left"
        >
          <LogOut className="w-4 h-4" />
          <span>Sign Out</span>
        </button>
      </div>
    </aside>
  );
};
