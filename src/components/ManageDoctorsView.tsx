import React, { useState } from 'react';
import { Doctor, Hospital, PageView } from '../types';
import {
  Stethoscope,
  PlusCircle,
  Trash2,
  X,
  CheckCircle2,
  Search
} from 'lucide-react';

interface ManageDoctorsViewProps {
  doctors: Doctor[];
  hospitals: Hospital[];
  onAddDoctor: (doc: Partial<Doctor>) => void;
  onDeleteDoctor: (id: number) => void;
}

export const ManageDoctorsView: React.FC<ManageDoctorsViewProps> = ({
  doctors,
  hospitals,
  onAddDoctor,
  onDeleteDoctor,
}) => {
  const [modalOpen, setModalOpen] = useState(false);
  const [search, setSearch] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    specialty: 'Cardiologist',
    hospital_id: hospitals[0]?.id || 1,
    qualification: 'MBBS, MD, DM Cardiology',
    experience_years: 12,
    availability: 'Mon - Fri (09:00 AM - 03:00 PM)',
    consultation_fee: 850,
    phone: '+91 (022) 2600-1111',
    contact_email: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const hosp = hospitals.find((h) => h.id === Number(formData.hospital_id));
    onAddDoctor({
      ...formData,
      hospital_id: Number(formData.hospital_id),
      hospital_name: hosp?.name || 'Lilavati Hospital & Research Centre',
      rating: 4.9,
    });
    setModalOpen(false);
    setFormData({
      name: '',
      specialty: 'Cardiologist',
      hospital_id: hospitals[0]?.id || 1,
      qualification: 'MBBS, MD, DM Cardiology',
      experience_years: 12,
      availability: 'Mon - Fri (09:00 AM - 03:00 PM)',
      consultation_fee: 850,
      phone: '+91 (022) 2600-1111',
      contact_email: '',
    });
  };

  const filtered = doctors.filter(
    (d) =>
      d.name.toLowerCase().includes(search.toLowerCase()) ||
      d.specialty.toLowerCase().includes(search.toLowerCase()) ||
      (d.hospital_name && d.hospital_name.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <div className="space-y-6 font-sans text-[#2D3436]">
      <div className="p-6 rounded-[22px] bg-white border border-[#E9ECEF] shadow-xs flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-xl font-bold text-[#2D3436] flex items-center gap-2">
            <Stethoscope className="w-5 h-5 text-[#2D6A4F]" />
            Medical Staff & Doctor Registry
          </h2>
          <p className="text-xs text-[#6C757D]">
            Add attending physicians, set consultation fees, hospital assignments, and schedules.
          </p>
        </div>
        <button
          onClick={() => setModalOpen(true)}
          className="px-4 py-2 rounded-full bg-[#2D6A4F] hover:bg-[#1B4332] text-white font-bold text-xs flex items-center gap-1.5 shadow-sm cursor-pointer"
        >
          <PlusCircle className="w-4 h-4 text-[#74C69D]" /> Add Specialist
        </button>
      </div>

      <div className="p-6 rounded-[22px] bg-white border border-[#E9ECEF] shadow-xs">
        <div className="mb-4">
          <input
            type="text"
            placeholder="Search medical specialists by name or specialty..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full max-w-md px-3.5 py-2 rounded-xl border border-[#DEE2E6] text-xs bg-[#F8F9FA] focus:bg-white focus:border-[#2D6A4F] outline-hidden"
          />
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#F8F9FA] text-[#2D3436] font-bold border-b border-[#E9ECEF]">
              <tr>
                <th className="p-3">Doctor Name</th>
                <th className="p-3">Specialty</th>
                <th className="p-3">Hospital Center</th>
                <th className="p-3">Experience</th>
                <th className="p-3">Fee (₹)</th>
                <th className="p-3">Schedule</th>
                <th className="p-3 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E9ECEF]">
              {filtered.map((d) => (
                <tr key={d.id} className="hover:bg-[#F8F9FA]/80">
                  <td className="p-3 font-bold text-[#2D3436]">{d.name}</td>
                  <td className="p-3">
                    <span className="px-2 py-0.5 rounded-full bg-[#D8F3DC] text-[#1B4332] font-semibold text-[11px]">
                      {d.specialty}
                    </span>
                  </td>
                  <td className="p-3 text-[#6C757D] max-w-[180px] truncate">{d.hospital_name}</td>
                  <td className="p-3 text-[#6C757D]">{d.experience_years} yrs</td>
                  <td className="p-3 font-extrabold text-[#1B4332]">₹{d.consultation_fee}</td>
                  <td className="p-3 text-[#6C757D] text-[11px]">{d.availability}</td>
                  <td className="p-3 text-right">
                    <button
                      onClick={() => onDeleteDoctor(d.id)}
                      className="p-1.5 text-slate-400 hover:text-rose-600 rounded-lg hover:bg-rose-50 cursor-pointer"
                      title="Delete doctor"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Doctor Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-[24px] max-w-lg w-full p-6 shadow-2xl border border-[#E9ECEF] relative font-sans text-[#2D3436]">
            <button
              onClick={() => setModalOpen(false)}
              className="absolute top-4 right-4 p-1.5 text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-100 cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-base font-bold text-[#2D3436] mb-4 flex items-center gap-2">
              <Stethoscope className="w-5 h-5 text-[#2D6A4F]" />
              Register New Specialist Physician
            </h3>

            <form onSubmit={handleSubmit} className="space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div className="col-span-2">
                  <label className="block font-semibold text-[#2D3436] mb-1">Doctor Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Dr. Arthur Pendelton"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-[#DEE2E6] bg-[#F8F9FA] focus:bg-white focus:border-[#2D6A4F] outline-hidden"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-[#2D3436] mb-1">Medical Specialty *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Cardiologist, Neurologist"
                    value={formData.specialty}
                    onChange={(e) => setFormData({ ...formData, specialty: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-[#DEE2E6] bg-[#F8F9FA] focus:bg-white focus:border-[#2D6A4F] outline-hidden"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-[#2D3436] mb-1">Hospital Assignment *</label>
                  <select
                    value={formData.hospital_id}
                    onChange={(e) => setFormData({ ...formData, hospital_id: Number(e.target.value) })}
                    className="w-full px-3 py-2 rounded-xl border border-[#DEE2E6] bg-[#F8F9FA] focus:bg-white focus:border-[#2D6A4F] outline-hidden"
                  >
                    {hospitals.map((h) => (
                      <option key={h.id} value={h.id}>{h.name}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-[#2D3436] mb-1">Experience (Years)</label>
                  <input
                    type="number"
                    value={formData.experience_years}
                    onChange={(e) => setFormData({ ...formData, experience_years: Number(e.target.value) })}
                    className="w-full px-3 py-2 rounded-xl border border-[#DEE2E6] bg-[#F8F9FA] focus:bg-white focus:border-[#2D6A4F] outline-hidden"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-[#2D3436] mb-1">Consultation Fee (₹)</label>
                  <input
                    type="number"
                    value={formData.consultation_fee}
                    onChange={(e) => setFormData({ ...formData, consultation_fee: Number(e.target.value) })}
                    className="w-full px-3 py-2 rounded-xl border border-[#DEE2E6] bg-[#F8F9FA] focus:bg-white focus:border-[#2D6A4F] outline-hidden"
                  />
                </div>

                <div className="col-span-2">
                  <label className="block font-semibold text-[#2D3436] mb-1">Weekly Availability Schedule</label>
                  <input
                    type="text"
                    value={formData.availability}
                    onChange={(e) => setFormData({ ...formData, availability: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-[#DEE2E6] bg-[#F8F9FA] focus:bg-white focus:border-[#2D6A4F] outline-hidden"
                  />
                </div>
              </div>

              <div className="flex gap-2 pt-3">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="flex-1 py-2 rounded-xl border border-[#DEE2E6] text-[#6C757D] font-bold hover:bg-[#F8F9FA]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2 rounded-xl bg-[#2D6A4F] text-white font-bold hover:bg-[#1B4332] shadow-sm transition-all"
                >
                  Save Physician
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
