import React, { useState } from 'react';
import { Report, User } from '../types';
import {
  FileText,
  Printer,
  Trash2,
  Calendar,
  Activity,
  HeartPulse,
  X,
  ShieldCheck,
  AlertCircle
} from 'lucide-react';

interface ReportsViewProps {
  user: User;
  reports: Report[];
  onDeleteReport: (id: number) => void;
}

export const ReportsView: React.FC<ReportsViewProps> = ({
  user,
  reports,
  onDeleteReport,
}) => {
  const [selectedReport, setSelectedReport] = useState<Report | null>(null);

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-6 font-sans text-[#2D3436]">
      {/* Header */}
      <div className="p-6 rounded-[22px] bg-white border border-[#E9ECEF] shadow-xs flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#D8F3DC] text-[#2D6A4F] flex items-center justify-center">
            <FileText className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-[#2D3436]">Personal Health & Triage Reports</h2>
            <p className="text-xs text-[#6C757D]">
              Archived health checkups, symptom evaluations, and specialist referral records.
            </p>
          </div>
        </div>
      </div>

      {reports.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {reports.map((r) => (
            <div
              key={r.id}
              className="p-5 rounded-[22px] bg-white border border-[#E9ECEF] shadow-xs flex flex-col justify-between hover:border-[#74C69D] transition-all"
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-2">
                  <span className="text-[11px] text-[#6C757D] font-medium flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5" />
                    {r.created_at.slice(0, 10)}
                  </span>
                  <span
                    className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full ${
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

                <h3 className="text-base font-bold text-[#2D3436] mb-2">{r.report_title}</h3>

                <div className="p-3 bg-[#F8F9FA] rounded-2xl mb-3 space-y-1.5 text-xs border border-[#E9ECEF]">
                  <div>
                    <span className="font-bold text-[#2D3436] text-[10px] uppercase tracking-wider block">Logged Symptoms:</span>
                    <p className="text-[#6C757D] font-medium">{r.symptoms_logged}</p>
                  </div>
                  <div>
                    <span className="font-bold text-[#2D3436] text-[10px] uppercase tracking-wider block">Clinical Indication:</span>
                    <p className="text-[#6C757D]">{r.diagnosis_summary}</p>
                  </div>
                </div>

                <div className="p-2.5 bg-[#D8F3DC]/50 rounded-xl text-xs text-[#1B4332] mb-4 border border-[#74C69D]/30">
                  <span className="font-bold block text-[10px] uppercase tracking-wider text-[#2D6A4F]">Specialist:</span>
                  <span className="font-semibold">{r.recommended_specialist}</span>
                </div>
              </div>

              <div className="flex items-center justify-between pt-3 border-t border-[#E9ECEF]">
                <button
                  onClick={() => setSelectedReport(r)}
                  className="px-3.5 py-1.5 rounded-full bg-[#2D6A4F] text-white font-bold text-xs hover:bg-[#1B4332] transition-all flex items-center gap-1.5"
                >
                  <FileText className="w-3.5 h-3.5" /> View / Print Report
                </button>
                <button
                  onClick={() => onDeleteReport(r.id)}
                  className="p-1.5 text-slate-400 hover:text-rose-600 rounded-lg hover:bg-rose-50 transition-colors cursor-pointer"
                  title="Delete report"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-16 bg-white rounded-[22px] border border-[#E9ECEF] p-8">
          <FileText className="w-12 h-12 text-slate-300 mx-auto mb-3" />
          <h3 className="font-bold text-[#2D3436] text-base mb-1">No Diagnostic Reports Saved</h3>
          <p className="text-xs text-[#6C757D] max-w-sm mx-auto mb-4">
            Run a quick symptom evaluation using the Symptom Checker to generate and archive your preliminary clinical reports.
          </p>
        </div>
      )}

      {/* Report Modal / Printable Summary */}
      {selectedReport && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-[24px] max-w-2xl w-full p-6 sm:p-8 shadow-2xl border border-[#E9ECEF] max-h-[90vh] overflow-y-auto animate-in fade-in zoom-in-95 duration-150 relative font-sans text-[#2D3436]">
            <button
              onClick={() => setSelectedReport(null)}
              className="absolute top-5 right-5 p-1.5 text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-100 cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Printable Report Header */}
            <div className="border-b-2 border-[#2D6A4F] pb-4 mb-6 flex justify-between items-start">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <div className="w-8 h-8 rounded-lg bg-[#2D6A4F] text-white flex items-center justify-center font-bold">
                    <HeartPulse className="w-5 h-5" />
                  </div>
                  <span className="text-xl font-extrabold text-[#2D3436]">CARE<span className="text-[#2D6A4F]">NEST</span> CLINICAL REPORT</span>
                </div>
                <p className="text-[11px] text-[#6C757D]">Automated Patient Health Assessment Record</p>
              </div>
              <div className="text-right text-xs">
                <span className="font-bold text-[#2D3436] block">Date: {selectedReport.created_at}</span>
                <span className="text-[#2D6A4F] font-semibold">Ref: CN-REP-#{selectedReport.id.toString().padStart(4, '0')}</span>
              </div>
            </div>

            {/* Patient Information Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-3 bg-[#F8F9FA] rounded-2xl mb-6 text-xs border border-[#E9ECEF]">
              <div>
                <span className="text-[10px] text-[#6C757D] block uppercase font-bold">Patient Name</span>
                <span className="font-bold text-[#2D3436]">{user.name}</span>
              </div>
              <div>
                <span className="text-[10px] text-[#6C757D] block uppercase font-bold">Blood Group</span>
                <span className="font-bold text-rose-600">{user.blood_group || 'Not Specified'}</span>
              </div>
              <div>
                <span className="text-[10px] text-[#6C757D] block uppercase font-bold">Age / Gender</span>
                <span className="font-bold text-[#2D3436]">{user.age || 29} yrs / {user.gender || 'Female'}</span>
              </div>
              <div>
                <span className="text-[10px] text-[#6C757D] block uppercase font-bold">Allergies</span>
                <span className="font-bold text-[#2D3436] truncate block">{user.allergies || 'None'}</span>
              </div>
            </div>

            {/* Assessment Details */}
            <div className="space-y-4 text-xs text-[#2D3436] mb-6">
              <div>
                <h4 className="font-bold text-[#2D3436] text-sm mb-1">{selectedReport.report_title}</h4>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] text-[#6C757D] font-bold uppercase">Severity Category:</span>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#D8F3DC] text-[#1B4332]">
                    {selectedReport.severity_level}
                  </span>
                </div>
              </div>

              <div className="p-3 bg-[#F8F9FA] rounded-xl border border-[#E9ECEF]">
                <strong className="block text-[#2D3436] mb-1">Symptoms Evaluated:</strong>
                <p className="text-[#6C757D]">{selectedReport.symptoms_logged}</p>
              </div>

              <div className="p-3 bg-[#F8F9FA] rounded-xl border border-[#E9ECEF]">
                <strong className="block text-[#2D3436] mb-1">Diagnostic Summary:</strong>
                <p className="text-[#6C757D] leading-relaxed">{selectedReport.diagnosis_summary}</p>
              </div>

              <div className="p-3 bg-[#D8F3DC]/40 rounded-xl border border-[#74C69D]/40">
                <strong className="block text-[#1B4332] mb-1">Recommended Specialist Department:</strong>
                <p className="text-[#2D6A4F] font-bold">{selectedReport.recommended_specialist}</p>
              </div>

              <div className="p-3 bg-[#F8F9FA] rounded-xl border border-[#E9ECEF]">
                <strong className="block text-[#2D3436] mb-1">Precautions & Self-Care Instructions:</strong>
                <p className="text-[#6C757D]">{selectedReport.precautions}</p>
              </div>

              {selectedReport.notes && (
                <div className="p-3 bg-[#F8F9FA] rounded-xl border border-[#E9ECEF]">
                  <strong className="block text-[#2D3436] mb-1">Clinical Notes / Triggers:</strong>
                  <p className="text-[#6C757D]">{selectedReport.notes}</p>
                </div>
              )}
            </div>

            {/* Modal Actions */}
            <div className="flex justify-end gap-3 pt-4 border-t border-[#E9ECEF]">
              <button
                onClick={() => setSelectedReport(null)}
                className="px-4 py-2 rounded-full border border-[#DEE2E6] text-[#6C757D] font-bold text-xs hover:bg-[#F8F9FA]"
              >
                Close
              </button>
              <button
                onClick={handlePrint}
                className="px-5 py-2 rounded-full bg-[#2D6A4F] hover:bg-[#1B4332] text-white font-bold text-xs shadow-sm flex items-center gap-2"
              >
                <Printer className="w-4 h-4" /> Print / Save as PDF
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
