import React, { useState } from 'react';
import { Symptom, Report, PageView } from '../types';
import {
  Activity,
  AlertTriangle,
  CheckCircle2,
  AlertCircle,
  FileText,
  Calendar,
  Sparkles,
  ArrowRight,
  ShieldAlert
} from 'lucide-react';

interface SymptomCheckerViewProps {
  symptoms: Symptom[];
  onSaveReport: (report: Partial<Report>) => void;
  onNavigate: (page: PageView) => void;
}

export const SymptomCheckerView: React.FC<SymptomCheckerViewProps> = ({
  symptoms,
  onSaveReport,
  onNavigate,
}) => {
  const [selectedSymptoms, setSelectedSymptoms] = useState<string[]>([]);
  const [duration, setDuration] = useState('1-3 Days');
  const [notes, setNotes] = useState('');
  const [assessmentResult, setAssessmentResult] = useState<{
    title: string;
    symptoms: string[];
    severity: string;
    specialist: string;
    diagnosis: string;
    precautions: string;
    notes: string;
  } | null>(null);

  const toggleSymptom = (name: string) => {
    if (selectedSymptoms.includes(name)) {
      setSelectedSymptoms(selectedSymptoms.filter((s) => s !== name));
    } else {
      setSelectedSymptoms([...selectedSymptoms, name]);
    }
  };

  const handleAnalyze = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedSymptoms.length === 0) {
      alert('Please choose at least one symptom to analyze.');
      return;
    }

    const count = selectedSymptoms.length;
    const lower = selectedSymptoms.map((s) => s.toLowerCase());
    const hasChest = lower.some((s) => s.includes('chest'));
    const hasBreath = lower.some((s) => s.includes('breath') || s.includes('shortness'));
    const hasFever = lower.some((s) => s.includes('fever'));
    const hasHeadache = lower.some((s) => s.includes('headache') || s.includes('dizziness'));
    const hasDigestive = lower.some((s) => s.includes('nausea') || s.includes('cramps'));

    let severity = 'Mild';
    let specialist = 'General Physician';
    let diagnosis = 'Mild seasonal discomfort or early symptom onset.';
    let precautions = 'Monitor condition for 48 hours, stay well hydrated, and maintain balanced rest.';

    if (hasChest || (hasBreath && hasFever)) {
      severity = 'High Priority';
      specialist = 'Emergency Physician / Cardiologist';
      diagnosis = 'Potential acute cardiovascular or severe pulmonary condition requiring rapid evaluation.';
      precautions = 'Avoid physical exertion. Seek immediate clinical assessment or visit nearest hospital emergency room.';
    } else if (count >= 3 || hasBreath || (hasFever && lower.some((s) => s.includes('cough')))) {
      severity = 'Moderate';
      specialist = 'Pulmonologist / Internal Medicine';
      diagnosis = 'Acute viral/bacterial respiratory tract infection with elevated inflammation indicators.';
      precautions = 'Rest adequately, maintain oral electrolyte hydration, perform steam inhalation, and isolate if fever persists.';
    } else if (hasDigestive) {
      severity = 'Mild to Moderate';
      specialist = 'Gastroenterologist / General Physician';
      diagnosis = 'Gastrointestinal upset, acid reflux, or mild digestive tract irritation.';
      precautions = 'Consume light, non-greasy foods, drink plenty of water, and avoid excess caffeine and dairy.';
    } else if (hasHeadache) {
      severity = 'Mild';
      specialist = 'Neurologist / General Practitioner';
      diagnosis = 'Tension headache, stress response, or mild ocular strain.';
      precautions = 'Ensure 8 hours of sleep, reduce screen exposure, keep hydrated, and monitor blood pressure.';
    }

    const reportData = {
      title: `Health Check Assessment (${new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })})`,
      symptoms: selectedSymptoms,
      severity,
      specialist,
      diagnosis,
      precautions,
      notes: `Duration: ${duration}. ${notes ? `Notes: ${notes}` : ''}`,
    };

    setAssessmentResult(reportData);

    // Save to global state
    onSaveReport({
      report_title: reportData.title,
      symptoms_logged: selectedSymptoms.join(', '),
      diagnosis_summary: diagnosis,
      severity_level: severity,
      recommended_specialist: specialist,
      precautions,
      notes: reportData.notes,
      created_at: new Date().toISOString().replace('T', ' ').slice(0, 16),
    });
  };

  return (
    <div className="space-y-6 font-sans text-[#2D3436]">
      {/* Header */}
      <div className="p-6 rounded-[22px] bg-white border border-[#E9ECEF] shadow-xs">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#D8F3DC] text-[#2D6A4F] flex items-center justify-center">
            <Activity className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-[#2D3436]">Smart Symptom Triage & Assessment</h2>
            <p className="text-xs text-[#6C757D]">
              Select current physiological symptoms for rule-based clinical categorization, specialist referral, and auto-report logging.
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Form Column */}
        <div className="lg:col-span-7 p-6 rounded-[22px] bg-white border border-[#E9ECEF] shadow-xs">
          <form onSubmit={handleAnalyze} className="space-y-5">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[#6C757D] mb-2">
                1. Select Active Experiencing Symptoms *
              </label>
              <div className="flex flex-wrap gap-2">
                {symptoms.map((sym) => {
                  const isSelected = selectedSymptoms.includes(sym.symptom_name);
                  return (
                    <button
                      key={sym.id}
                      type="button"
                      onClick={() => toggleSymptom(sym.symptom_name)}
                      className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-all flex items-center gap-1.5 cursor-pointer ${
                        isSelected
                          ? 'bg-[#D8F3DC] text-[#1B4332] border-[#74C69D] shadow-xs font-semibold'
                          : 'bg-[#F8F9FA] text-[#6C757D] border-[#DEE2E6] hover:border-[#74C69D] hover:bg-[#F4F7F6]'
                      }`}
                    >
                      <span className={`w-2 h-2 rounded-full ${isSelected ? 'bg-[#2D6A4F]' : 'bg-slate-300'}`} />
                      {sym.symptom_name}
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#6C757D] mb-1.5">
                  2. Symptom Duration
                </label>
                <select
                  value={duration}
                  onChange={(e) => setDuration(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-[#DEE2E6] text-xs bg-[#F8F9FA] focus:bg-white focus:border-[#2D6A4F] outline-hidden"
                >
                  <option value="Less than 24 Hours">Less than 24 Hours</option>
                  <option value="1-3 Days">1-3 Days</option>
                  <option value="4-7 Days">4-7 Days</option>
                  <option value="More than a week">More than a week</option>
                  <option value="Chronic (Months)">Chronic (Months)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#6C757D] mb-1.5">
                  3. Additional Triggers / Notes
                </label>
                <input
                  type="text"
                  placeholder="e.g. Worsens after meals, at night"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-[#DEE2E6] text-xs bg-[#F8F9FA] focus:bg-white focus:border-[#2D6A4F] outline-hidden"
                />
              </div>
            </div>

            <div className="p-3.5 rounded-2xl bg-amber-50/70 border border-amber-200/80 text-[11px] text-amber-900 flex items-start gap-2.5">
              <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
              <span>
                <strong>Educational Notice:</strong> This preliminary triage tool does not replace emergency medical triage. If experiencing severe chest pain or sudden weakness, call 911 immediately.
              </span>
            </div>

            <button
              type="submit"
              className="w-full py-3 px-4 rounded-xl bg-[#2D6A4F] hover:bg-[#1B4332] text-white font-bold text-xs shadow-md shadow-[#1B4332]/20 flex items-center justify-center gap-2 transition-all cursor-pointer"
            >
              <Sparkles className="w-4 h-4 text-[#74C69D]" />
              <span>Run Assessment & Auto-Save to Health Reports</span>
            </button>
          </form>
        </div>

        {/* Assessment Results Column */}
        <div className="lg:col-span-5 p-6 rounded-[22px] bg-white border border-[#E9ECEF] shadow-xs flex flex-col justify-between">
          <div>
            <h3 className="font-bold text-[#2D3436] text-base mb-4 flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-[#2D6A4F]" />
              Clinical Triage Result
            </h3>

            {assessmentResult ? (
              <div className="space-y-4 animate-in fade-in duration-200">
                <div className="p-4 rounded-2xl bg-[#F8F9FA] border border-[#E9ECEF]">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[11px] text-[#6C757D] font-medium">{assessmentResult.title}</span>
                    <span
                      className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full ${
                        assessmentResult.severity.includes('High')
                          ? 'bg-rose-100 text-rose-800'
                          : assessmentResult.severity.includes('Moderate')
                          ? 'bg-amber-100 text-amber-800'
                          : 'bg-[#D8F3DC] text-[#1B4332]'
                      }`}
                    >
                      {assessmentResult.severity}
                    </span>
                  </div>

                  <h4 className="text-xs font-bold text-[#2D3436] mb-1">Diagnostic Indication:</h4>
                  <p className="text-xs text-[#6C757D] leading-relaxed mb-3">{assessmentResult.diagnosis}</p>

                  <div className="p-3 bg-white rounded-xl border border-[#E9ECEF] mb-3">
                    <span className="text-[10px] font-bold text-[#6C757D] uppercase tracking-wider block">Recommended Specialist</span>
                    <span className="text-xs font-bold text-[#1B4332]">{assessmentResult.specialist}</span>
                  </div>

                  <div>
                    <span className="text-[10px] font-bold text-[#6C757D] uppercase tracking-wider block mb-1">Precautions & Self-Care</span>
                    <p className="text-[11px] text-[#6C757D] bg-white p-2.5 rounded-xl border border-[#E9ECEF]">{assessmentResult.precautions}</p>
                  </div>
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={() => onNavigate('reports')}
                    className="flex-1 py-2 rounded-xl bg-[#D8F3DC] text-[#1B4332] hover:bg-[#D8F3DC]/70 font-bold text-xs border border-[#74C69D] transition-all flex items-center justify-center gap-1.5"
                  >
                    <FileText className="w-3.5 h-3.5" />
                    View in Reports
                  </button>
                  <button
                    onClick={() => onNavigate('hospitals')}
                    className="flex-1 py-2 rounded-xl bg-[#2D6A4F] text-white hover:bg-[#1B4332] font-bold text-xs shadow-sm transition-all flex items-center justify-center gap-1.5"
                  >
                    <Calendar className="w-3.5 h-3.5" />
                    Book Specialist
                  </button>
                </div>
              </div>
            ) : (
              <div className="text-center py-12 text-[#6C757D]">
                <Activity className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                <h4 className="font-bold text-[#2D3436] text-sm mb-1">Ready for Assessment</h4>
                <p className="text-xs text-[#6C757D] max-w-xs mx-auto">
                  Select your symptoms from the panel on the left to view immediate clinical triage and recommendations.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
