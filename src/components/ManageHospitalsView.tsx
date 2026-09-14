import React, { useState } from 'react';
import { Hospital } from '../types';
import { Building2, PlusCircle, Trash2, X, Star } from 'lucide-react';

interface ManageHospitalsViewProps {
  hospitals: Hospital[];
  onAddHospital: (hosp: Partial<Hospital>) => void;
  onDeleteHospital: (id: number) => void;
}

export const ManageHospitalsView: React.FC<ManageHospitalsViewProps> = ({
  hospitals,
  onAddHospital,
  onDeleteHospital,
}) => {
  const [modalOpen, setModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    city: 'Mumbai',
    address: 'Healthcare District, Link Road',
    phone: '+91 (022) 2600-0000',
    emergency_phone: '+91 (022) 2600-9999',
    beds_available: 120,
    specialties: 'Cardiology, Neurology, Pediatrics, Orthopedics',
    image_url: 'https://images.unsplash.com/photo-1587351021759-3e566b6af7cc?w=600&auto=format&fit=crop&q=80',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onAddHospital({
      ...formData,
      rating: 4.8,
      beds_available: Number(formData.beds_available),
    });
    setModalOpen(false);
    setFormData({
      name: '',
      city: 'Mumbai',
      address: 'Healthcare District, Link Road',
      phone: '+91 (022) 2600-0000',
      emergency_phone: '+91 (022) 2600-9999',
      beds_available: 120,
      specialties: 'Cardiology, Neurology, Pediatrics, Orthopedics',
      image_url: 'https://images.unsplash.com/photo-1587351021759-3e566b6af7cc?w=600&auto=format&fit=crop&q=80',
    });
  };

  return (
    <div className="space-y-6 font-sans text-[#2D3436]">
      <div className="p-6 rounded-[22px] bg-white border border-[#E9ECEF] shadow-xs flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-xl font-bold text-[#2D3436] flex items-center gap-2">
            <Building2 className="w-5 h-5 text-[#2D6A4F]" />
            Hospital Center & Clinic Network
          </h2>
          <p className="text-xs text-[#6C757D]">
            Register partner medical facilities, manage inpatient bed numbers and emergency hotlines.
          </p>
        </div>
        <button
          onClick={() => setModalOpen(true)}
          className="px-4 py-2 rounded-full bg-[#2D6A4F] hover:bg-[#1B4332] text-white font-bold text-xs flex items-center gap-1.5 shadow-sm cursor-pointer"
        >
          <PlusCircle className="w-4 h-4 text-[#74C69D]" /> Register Hospital
        </button>
      </div>

      <div className="p-6 rounded-[22px] bg-white border border-[#E9ECEF] shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#F8F9FA] text-[#2D3436] font-bold border-b border-[#E9ECEF]">
              <tr>
                <th className="p-3">Hospital Center</th>
                <th className="p-3">Location & Address</th>
                <th className="p-3">Helpline</th>
                <th className="p-3">Emergency</th>
                <th className="p-3">Available Beds</th>
                <th className="p-3">Specialties</th>
                <th className="p-3 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E9ECEF]">
              {hospitals.map((h) => (
                <tr key={h.id} className="hover:bg-[#F8F9FA]/80">
                  <td className="p-3">
                    <div className="font-bold text-[#2D3436]">{h.name}</div>
                    <div className="text-[10px] text-amber-600 flex items-center gap-1 mt-0.5">
                      <Star className="w-3 h-3 fill-amber-400 text-amber-400" /> {h.rating} rating
                    </div>
                  </td>
                  <td className="p-3 text-[#6C757D] max-w-[200px]">
                    <span className="font-semibold block text-[#2D3436]">{h.city}</span>
                    <span className="truncate block text-[#6C757D] text-[11px]">{h.address}</span>
                  </td>
                  <td className="p-3 text-[#6C757D]">{h.phone}</td>
                  <td className="p-3 text-rose-600 font-bold">{h.emergency_phone || '911'}</td>
                  <td className="p-3">
                    <span className="px-2 py-0.5 rounded-full bg-[#D8F3DC] text-[#1B4332] font-bold text-[10px]">
                      {h.beds_available} Beds
                    </span>
                  </td>
                  <td className="p-3 text-[#6C757D] max-w-[200px] truncate">{h.specialties}</td>
                  <td className="p-3 text-right">
                    <button
                      onClick={() => onDeleteHospital(h.id)}
                      className="p-1.5 text-slate-400 hover:text-rose-600 rounded-lg hover:bg-rose-50 cursor-pointer"
                      title="Delete hospital"
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
              <Building2 className="w-5 h-5 text-[#2D6A4F]" />
              Register New Hospital Center
            </h3>

            <form onSubmit={handleSubmit} className="space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div className="col-span-2">
                  <label className="block font-semibold text-[#2D3436] mb-1">Hospital Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. St. Jude Regional Clinic"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-[#DEE2E6] bg-[#F8F9FA] focus:bg-white focus:border-[#2D6A4F] outline-hidden"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-[#2D3436] mb-1">City Location *</label>
                  <input
                    type="text"
                    required
                    value={formData.city}
                    onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-[#DEE2E6] bg-[#F8F9FA] focus:bg-white focus:border-[#2D6A4F] outline-hidden"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-[#2D3436] mb-1">Inpatient Beds</label>
                  <input
                    type="number"
                    value={formData.beds_available}
                    onChange={(e) => setFormData({ ...formData, beds_available: Number(e.target.value) })}
                    className="w-full px-3 py-2 rounded-xl border border-[#DEE2E6] bg-[#F8F9FA] focus:bg-white focus:border-[#2D6A4F] outline-hidden"
                  />
                </div>

                <div className="col-span-2">
                  <label className="block font-semibold text-[#2D3436] mb-1">Address *</label>
                  <input
                    type="text"
                    required
                    value={formData.address}
                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-[#DEE2E6] bg-[#F8F9FA] focus:bg-white focus:border-[#2D6A4F] outline-hidden"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-[#2D3436] mb-1">Helpline Phone *</label>
                  <input
                    type="text"
                    required
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-[#DEE2E6] bg-[#F8F9FA] focus:bg-white focus:border-[#2D6A4F] outline-hidden"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-[#2D3436] mb-1">Emergency Phone</label>
                  <input
                    type="text"
                    value={formData.emergency_phone}
                    onChange={(e) => setFormData({ ...formData, emergency_phone: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-[#DEE2E6] bg-[#F8F9FA] focus:bg-white focus:border-[#2D6A4F] outline-hidden"
                  />
                </div>

                <div className="col-span-2">
                  <label className="block font-semibold text-[#2D3436] mb-1">Specialties (Comma separated)</label>
                  <input
                    type="text"
                    value={formData.specialties}
                    onChange={(e) => setFormData({ ...formData, specialties: e.target.value })}
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
                  Register Center
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
