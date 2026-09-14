import React, { useState } from 'react';
import { Medicine } from '../types';
import { Pill, PlusCircle, Trash2, X } from 'lucide-react';

interface ManageMedicinesViewProps {
  medicines: Medicine[];
  onAddMedicine: (med: Partial<Medicine>) => void;
  onDeleteMedicine: (id: number) => void;
}

export const ManageMedicinesView: React.FC<ManageMedicinesViewProps> = ({
  medicines,
  onAddMedicine,
  onDeleteMedicine,
}) => {
  const [modalOpen, setModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    category: 'Analgesic',
    dosage: '1 tablet twice daily after meals',
    usage_instructions: 'For pain, fever, and inflammation',
    price: 45.0,
    stock_status: 'In Stock' as const,
    manufacturer: 'Apex Pharma Labs',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onAddMedicine(formData);
    setModalOpen(false);
    setFormData({
      name: '',
      category: 'Analgesic',
      dosage: '1 tablet twice daily after meals',
      usage_instructions: 'For pain, fever, and inflammation',
      price: 45.0,
      stock_status: 'In Stock',
      manufacturer: 'Apex Pharma Labs',
    });
  };

  return (
    <div className="space-y-6 font-sans text-[#2D3436]">
      <div className="p-6 rounded-[22px] bg-white border border-[#E9ECEF] shadow-xs flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-xl font-bold text-[#2D3436] flex items-center gap-2">
            <Pill className="w-5 h-5 text-[#2D6A4F]" />
            Pharmaceutical Formulary & Inventory
          </h2>
          <p className="text-xs text-[#6C757D]">
            Add medicines, adjust retail pricing, update stock and prescription restrictions.
          </p>
        </div>
        <button
          onClick={() => setModalOpen(true)}
          className="px-4 py-2 rounded-full bg-[#2D6A4F] hover:bg-[#1B4332] text-white font-bold text-xs flex items-center gap-1.5 shadow-sm cursor-pointer"
        >
          <PlusCircle className="w-4 h-4 text-[#74C69D]" /> Catalog New Drug
        </button>
      </div>

      <div className="p-6 rounded-[22px] bg-white border border-[#E9ECEF] shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#F8F9FA] text-[#2D3436] font-bold border-b border-[#E9ECEF]">
              <tr>
                <th className="p-3">Drug Name</th>
                <th className="p-3">Category</th>
                <th className="p-3">Dosage & Instructions</th>
                <th className="p-3">Est. Price (₹)</th>
                <th className="p-3">Status</th>
                <th className="p-3">Manufacturer</th>
                <th className="p-3 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E9ECEF]">
              {medicines.map((m) => (
                <tr key={m.id} className="hover:bg-[#F8F9FA]/80">
                  <td className="p-3 font-bold text-[#2D3436]">{m.name}</td>
                  <td className="p-3">
                    <span className="px-2 py-0.5 rounded-full bg-[#E9ECEF] text-[#2D3436] font-semibold text-[11px]">
                      {m.category}
                    </span>
                  </td>
                  <td className="p-3 text-[#6C757D] max-w-[200px] truncate">{m.dosage}</td>
                  <td className="p-3 font-bold text-[#1B4332]">₹{m.price.toFixed(2)}</td>
                  <td className="p-3">
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                      m.stock_status === 'In Stock' ? 'bg-[#D8F3DC] text-[#1B4332]' : 'bg-amber-100 text-amber-800'
                    }`}>
                      {m.stock_status}
                    </span>
                  </td>
                  <td className="p-3 text-[#6C757D]">{m.manufacturer}</td>
                  <td className="p-3 text-right">
                    <button
                      onClick={() => onDeleteMedicine(m.id)}
                      className="p-1.5 text-slate-400 hover:text-rose-600 rounded-lg hover:bg-rose-50 cursor-pointer"
                      title="Delete drug"
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
              <Pill className="w-5 h-5 text-[#2D6A4F]" />
              Catalog New Therapeutic Drug
            </h3>

            <form onSubmit={handleSubmit} className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold text-[#2D3436] mb-1">Medicine Name & Strength *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Paracetamol Extra 500mg"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-[#DEE2E6] bg-[#F8F9FA] focus:bg-white focus:border-[#2D6A4F] outline-hidden"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-[#2D3436] mb-1">Category *</label>
                  <input
                    type="text"
                    required
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-[#DEE2E6] bg-[#F8F9FA] focus:bg-white focus:border-[#2D6A4F] outline-hidden"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-[#2D3436] mb-1">Price (₹)</label>
                  <input
                    type="number"
                    step="0.01"
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: Number(e.target.value) })}
                    className="w-full px-3 py-2 rounded-xl border border-[#DEE2E6] bg-[#F8F9FA] focus:bg-white focus:border-[#2D6A4F] outline-hidden"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-[#2D3436] mb-1">Dosage Schedule</label>
                <input
                  type="text"
                  value={formData.dosage}
                  onChange={(e) => setFormData({ ...formData, dosage: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-[#DEE2E6] bg-[#F8F9FA] focus:bg-white focus:border-[#2D6A4F] outline-hidden"
                />
              </div>

              <div>
                <label className="block font-semibold text-[#2D3436] mb-1">Usage Instructions / Indications</label>
                <input
                  type="text"
                  value={formData.usage_instructions}
                  onChange={(e) => setFormData({ ...formData, usage_instructions: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-[#DEE2E6] bg-[#F8F9FA] focus:bg-white focus:border-[#2D6A4F] outline-hidden"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-[#2D3436] mb-1">Stock Status</label>
                  <select
                    value={formData.stock_status}
                    onChange={(e) => setFormData({ ...formData, stock_status: e.target.value as any })}
                    className="w-full px-3 py-2 rounded-xl border border-[#DEE2E6] bg-[#F8F9FA] focus:bg-white focus:border-[#2D6A4F] outline-hidden"
                  >
                    <option value="In Stock">In Stock</option>
                    <option value="Prescription Required">Prescription Required</option>
                    <option value="Out of Stock">Out of Stock</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-[#2D3436] mb-1">Manufacturer</label>
                  <input
                    type="text"
                    value={formData.manufacturer}
                    onChange={(e) => setFormData({ ...formData, manufacturer: e.target.value })}
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
                  Save Drug to Formulary
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};