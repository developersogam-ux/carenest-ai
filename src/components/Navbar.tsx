import React from 'react';
import { PageView, User } from '../types';
import {
  HeartPulse,
  Home,
  LayoutDashboard,
  Activity,
  Building2,
  Pill,
  FileText,
  User as UserIcon,
  LogOut,
  ShieldAlert,
  Menu,
  X
} from 'lucide-react';

interface NavbarProps {
  currentUser: User | null;
  currentPage: PageView;
  onNavigate: (page: PageView) => void;
  onLogout: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentUser,
  currentPage,
  onNavigate,
  onLogout,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = React.useState(false);

  if (!currentUser) return null;

  const isPatient = currentUser.role === 'patient';

  const patientNavItems = [
    { page: 'home' as PageView, label: 'Home', icon: Home },
    { page: 'dashboard' as PageView, label: 'Dashboard', icon: LayoutDashboard },
    { page: 'symptom_checker' as PageView, label: 'Symptom Checker', icon: Activity },
    { page: 'hospitals' as PageView, label: 'Hospitals', icon: Building2 },
    { page: 'medicines' as PageView, label: 'Medicines', icon: Pill },
    { page: 'reports' as PageView, label: 'My Reports', icon: FileText },
  ];

  return (
    <nav className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-[#E9ECEF] shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Logo */}
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => onNavigate(isPatient ? 'dashboard' : 'admin_dashboard')}>
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#1B4332] to-[#2D6A4F] flex items-center justify-center text-white shadow-md shadow-[#1B4332]/20">
              <HeartPulse className="w-5 h-5 text-[#74C69D]" />
            </div>
            <div className="flex flex-col">
              <span className="text-xl font-extrabold tracking-tight text-[#2D3436] leading-none">
                CARE<span className="text-[#2D6A4F]">NEST</span>
              </span>
              <span className="text-[10px] uppercase font-bold tracking-wider text-[#2D6A4F]">Healthcare Portal</span>
            </div>
          </div>

          {/* Desktop Patient Navigation */}
          {isPatient ? (
            <div className="hidden lg:flex items-center space-x-1">
              {patientNavItems.map((item) => {
                const Icon = item.icon;
                const active = currentPage === item.page;
                return (
                  <button
                    key={item.page}
                    onClick={() => onNavigate(item.page)}
                    className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-sm font-medium transition-all ${
                      active
                        ? 'bg-[#D8F3DC] text-[#1B4332] font-semibold shadow-xs'
                        : 'text-[#6C757D] hover:text-[#1B4332] hover:bg-[#F8F9FA]'
                    }`}
                  >
                    <Icon className={`w-4 h-4 ${active ? 'text-[#2D6A4F]' : 'text-[#6C757D]'}`} />
                    <span>{item.label}</span>
                  </button>
                );
              })}
            </div>
          ) : (
            <div className="hidden lg:flex items-center gap-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-rose-50 text-rose-700 border border-rose-200">
                <ShieldAlert className="w-3.5 h-3.5" />
                Hospital Executive Administration
              </span>
            </div>
          )}

          {/* Right Actions */}
          <div className="flex items-center gap-3">
            {/* User Profile Pill Dropdown */}
            <div className="relative">
              <button
                onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                className="flex items-center gap-2 p-1.5 pl-2 rounded-full border border-[#DEE2E6] hover:border-[#2D6A4F] bg-[#F8F9FA] transition-all text-left"
              >
                <div className="w-7 h-7 rounded-full bg-[#D8F3DC] text-[#1B4332] font-bold text-xs flex items-center justify-center">
                  {currentUser.name[0]}
                </div>
                <div className="hidden sm:block text-xs pr-1">
                  <div className="font-semibold text-[#2D3436] leading-tight truncate max-w-[120px]">{currentUser.name}</div>
                  <div className="text-[10px] text-[#6C757D] capitalize">{currentUser.role}</div>
                </div>
              </button>

              {userDropdownOpen && (
                <div
                  className="absolute right-0 mt-2 w-56 bg-white rounded-2xl shadow-xl border border-[#E9ECEF] py-2 z-50 animate-in fade-in slide-in-from-top-2 duration-150"
                  onClick={() => setUserDropdownOpen(false)}
                >
                  <div className="px-4 py-2 border-b border-[#E9ECEF]">
                    <p className="text-xs font-semibold text-[#2D3436]">{currentUser.name}</p>
                    <p className="text-[11px] text-[#6C757D] truncate">{currentUser.email}</p>
                  </div>

                  {isPatient && (
                    <>
                      <button
                        onClick={() => onNavigate('profile')}
                        className="w-full text-left px-4 py-2 text-xs text-[#2D3436] hover:bg-[#D8F3DC]/50 hover:text-[#1B4332] flex items-center gap-2"
                      >
                        <UserIcon className="w-3.5 h-3.5 text-[#2D6A4F]" />
                        My Profile & Medical Badge
                      </button>
                      <button
                        onClick={() => onNavigate('reports')}
                        className="w-full text-left px-4 py-2 text-xs text-[#2D3436] hover:bg-[#D8F3DC]/50 hover:text-[#1B4332] flex items-center gap-2"
                      >
                        <FileText className="w-3.5 h-3.5 text-[#2D6A4F]" />
                        Saved Health Reports
                      </button>
                      <div className="my-1 border-t border-[#E9ECEF]" />
                    </>
                  )}

                  <button
                    onClick={onLogout}
                    className="w-full text-left px-4 py-2 text-xs text-rose-600 hover:bg-rose-50 flex items-center gap-2"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                    Sign Out of CareNest
                  </button>
                </div>
              )}
            </div>

            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 text-[#6C757D] hover:text-[#2D3436] hover:bg-[#F8F9FA] rounded-lg"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-white border-b border-[#E9ECEF] px-4 pt-2 pb-4 space-y-1">
          {isPatient ? (
            patientNavItems.map((item) => {
              const Icon = item.icon;
              const active = currentPage === item.page;
              return (
                <button
                  key={item.page}
                  onClick={() => {
                    onNavigate(item.page);
                    setMobileMenuOpen(false);
                  }}
                  className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl text-sm font-medium ${
                    active ? 'bg-[#D8F3DC] text-[#1B4332] font-bold' : 'text-[#6C757D] hover:bg-[#F8F9FA]'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${active ? 'text-[#2D6A4F]' : 'text-[#6C757D]'}`} />
                  {item.label}
                </button>
              );
            })
          ) : (
            <div className="space-y-1">
              {[
                { page: 'admin_dashboard' as PageView, label: 'System Overview' },
                { page: 'manage_doctors' as PageView, label: 'Manage Doctors' },
                { page: 'manage_medicines' as PageView, label: 'Manage Medicines' },
                { page: 'manage_hospitals' as PageView, label: 'Manage Hospitals' },
                { page: 'analytics' as PageView, label: 'Reports & Analytics' },
              ].map((adm) => (
                <button
                  key={adm.page}
                  onClick={() => {
                    onNavigate(adm.page);
                    setMobileMenuOpen(false);
                  }}
                  className={`w-full text-left px-3 py-2 rounded-xl text-sm font-medium ${
                    currentPage === adm.page ? 'bg-rose-50 text-rose-700 font-bold' : 'text-[#6C757D] hover:bg-[#F8F9FA]'
                  }`}
                >
                  {adm.label}
                </button>
              ))}
            </div>
          )}
        </div>
      )}
    </nav>
  );
};
