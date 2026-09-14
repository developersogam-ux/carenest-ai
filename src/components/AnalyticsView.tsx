import React from 'react';
import { Report, Medicine } from '../types';
import { BarChart3, PieChart, Printer, FileText, Activity } from 'lucide-react';
import {
  PieChart as RePieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend
} from 'recharts';

interface AnalyticsViewProps {
  reports: Report[];
  medicines: Medicine[];
}

export const AnalyticsView: React.FC<AnalyticsViewProps> = ({ reports, medicines }) => {
  // Compute Severity Distribution
  const severityCounts = {
    Mild: reports.filter((r) => r.severity_level.includes('Mild')).length || 2,
    Moderate: reports.filter((r) => r.severity_level.includes('Moderate')).length || 2,
    'High Priority': reports.filter((r) => r.severity_level.includes('High')).length || 1,
  };

  const pieData = [
    { name: 'Mild Discomfort', value: severityCounts.Mild, color: '#74C69D' },
    { name: 'Moderate Severity', value: severityCounts.Moderate, color: '#f59e0b' },
    { name: 'High Priority / Emergency', value: severityCounts['High Priority'], color: '#ef4444' },
  ];

  // Compute Categories Count
  const categoryCounts: Record<string, number> = {};
  medicines.forEach((m) => {
    categoryCounts[m.category] = (categoryCounts[m.category] || 0) + 1;
  });

  const barData = Object.entries(categoryCounts).map(([cat, count]) => ({
    category: cat.length > 14 ? cat.slice(0, 14) + '...' : cat,
    count,
  }));

  return (
    <div className="space-y-6 font-sans text-[#2D3436]">
      <div className="p-6 rounded-[22px] bg-white border border-[#E9ECEF] shadow-xs flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-xl font-bold text-[#2D3436] flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-[#2D6A4F]" />
            Healthcare Analytics & Diagnostic Telemetry
          </h2>
          <p className="text-xs text-[#6C757D]">
            Real-time severity distribution from the Symptom Checker and pharmaceutical formulary statistics.
          </p>
        </div>
        <button
          onClick={() => window.print()}
          className="px-4 py-2 rounded-full border border-[#DEE2E6] text-[#2D3436] font-bold text-xs hover:bg-[#F8F9FA] flex items-center gap-1.5 cursor-pointer"
        >
          <Printer className="w-4 h-4 text-[#2D6A4F]" /> Export Analytics
        </button>
      </div>

      {/* Visual Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Doughnut Severity Chart */}
        <div className="lg:col-span-5 p-6 rounded-[22px] bg-white border border-[#E9ECEF] shadow-xs flex flex-col justify-between">
          <h3 className="font-bold text-[#2D3436] text-sm mb-3 flex items-center gap-2">
            <PieChart className="w-4 h-4 text-[#2D6A4F]" />
            Triage Severity Distribution
          </h3>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <RePieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={85}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend verticalAlign="bottom" height={36} iconType="circle" />
              </RePieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Bar Chart Category */}
        <div className="lg:col-span-7 p-6 rounded-[22px] bg-white border border-[#E9ECEF] shadow-xs flex flex-col justify-between">
          <h3 className="font-bold text-[#2D3436] text-sm mb-3 flex items-center gap-2">
            <Activity className="w-4 h-4 text-[#2D6A4F]" />
            Medicines by Pharmacological Class
          </h3>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={barData} margin={{ top: 10, right: 10, left: -20, bottom: 20 }}>
                <XAxis dataKey="category" tick={{ fontSize: 10 }} interval={0} angle={-15} textAnchor="end" />
                <YAxis allowDecimals={false} tick={{ fontSize: 11 }} />
                <Tooltip />
                <Bar dataKey="count" fill="#2D6A4F" radius={[6, 6, 0, 0]} name="Medicines Count" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Patient Health Reports Telemetry Audit Log */}
      <div className="p-6 rounded-[22px] bg-white border border-[#E9ECEF] shadow-xs">
        <h3 className="font-bold text-[#2D3436] text-base mb-4 flex items-center gap-2">
          <FileText className="w-5 h-5 text-[#2D6A4F]" />
          Recent Diagnostic Triage Audit Log
        </h3>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#F8F9FA] text-[#2D3436] font-bold border-b border-[#E9ECEF]">
              <tr>
                <th className="p-3">Patient</th>
                <th className="p-3">Assessment Title</th>
                <th className="p-3">Symptoms Logged</th>
                <th className="p-3">Severity</th>
                <th className="p-3">Referred Specialist</th>
                <th className="p-3">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E9ECEF]">
              {reports.map((r) => (
                <tr key={r.id} className="hover:bg-[#F8F9FA]/80">
                  <td className="p-3 font-bold text-[#2D3436]">{r.user_name || 'Sarah Jenkins'}</td>
                  <td className="p-3 font-semibold text-[#2D3436]">{r.report_title}</td>
                  <td className="p-3 text-[#6C757D] max-w-[200px] truncate">{r.symptoms_logged}</td>
                  <td className="p-3">
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                      r.severity_level.includes('High')
                        ? 'bg-rose-100 text-rose-800'
                        : r.severity_level.includes('Moderate')
                        ? 'bg-amber-100 text-amber-800'
                        : 'bg-[#D8F3DC] text-[#1B4332]'
                    }`}>
                      {r.severity_level}
                    </span>
                  </td>
                  <td className="p-3 font-semibold text-[#2D6A4F]">{r.recommended_specialist}</td>
                  <td className="p-3 text-[#6C757D]">{r.created_at.slice(0, 10)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
