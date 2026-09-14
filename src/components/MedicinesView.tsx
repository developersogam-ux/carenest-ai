import React, { useState } from 'react';
import { Medicine } from '../types';
import {
  Pill,
  Search,
  CheckCircle2,
  AlertTriangle,
  Info,
  ShieldCheck,
  Tag
} from 'lucide-react';

interface MedicinesViewProps {
  medicines: Medicine[];
}

export const MedicinesView: React.FC<MedicinesViewProps> = ({ medicines }) => {
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');

  const categories = Array.from(new Set(medicines.map((m) => m.category)));

  const filtered = medicines.filter((m) => {
    const matchesSearch =
      m.name.toLowerCase().includes(search.toLowerCase()) ||
      m.category.toLowerCase().includes(search.toLowerCase()) ||
      m.usage_instructions.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = categoryFilter ? m.category === categoryFilter : true;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="space-y-6 font-sans text-[#2D3436]">
      {/* Header and Search */}
      <div className="p-6 rounded-[22px] bg-white border border-[#E9ECEF] shadow-xs">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-4">
          <div>
            <h2 className="text-xl font-bold text-[#2D3436] flex items-center gap-2">
              <Pill className="w-5 h-5 text-[#2D6A4F]" />
              Prescription & OTC Pharmaceutical Formulary
            </h2>
            <p className="text-xs text-[#6C757D]">
              Explore verified pharmaceutical therapeutics, recommended dosages, indications, and estimated retail prices.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-12 gap-3">
          <div className="sm:col-span-8 relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search by drug name (e.g. Paracetamol), category, or symptom keyword..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-[#DEE2E6] text-xs bg-[#F8F9FA] focus:bg-white focus:border-[#2D6A4F] outline-hidden"
            />
          </div>

          <div className="sm:col-span-4">
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="w-full px-3 py-2.5 rounded-xl border border-[#DEE2E6] text-xs bg-[#F8F9FA] focus:bg-white focus:border-[#2D6A4F] outline-hidden"
            >
              <option value="">All Pharmaceutical Classes</option>
              {categories.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Medicines Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filtered.map((m) => (
          <div key={m.id} className="p-5 rounded-[22px] bg-white border border-[#E9ECEF] shadow-xs flex flex-col justify-between hover:border-[#74C69D] hover:shadow-md transition-all">
            <div>
              <div className="flex items-start justify-between gap-2 mb-2">
                <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-[#F8F9FA] text-[#2D3436] border border-[#E9ECEF]">
                  {m.category}
                </span>
                <span
                  className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                    m.stock_status === 'In Stock'
                      ? 'bg-[#D8F3DC] text-[#1B4332]'
                      : 'bg-amber-100 text-amber-800'
                  }`}
                >
                  {m.stock_status}
                </span>
              </div>

              <h3 className="text-base font-bold text-[#2D3436] mb-1">{m.name}</h3>
              <p className="text-[11px] text-[#6C757D] mb-3">{m.manufacturer || 'CareNest Formulary Lab'}</p>

              <div className="space-y-2 mb-4 text-xs">
                <div className="p-2.5 bg-[#F8F9FA] rounded-xl border border-[#E9ECEF]">
                  <span className="font-bold text-[#2D3436] block text-[10px] uppercase tracking-wider mb-0.5">Indications / Usage:</span>
                  <p className="text-[#6C757D] text-[11px]">{m.usage_instructions}</p>
                </div>

                <div className="p-2.5 bg-[#D8F3DC]/40 rounded-xl border border-[#74C69D]/30">
                  <span className="font-bold text-[#1B4332] block text-[10px] uppercase tracking-wider mb-0.5">Recommended Dosage:</span>
                  <p className="text-[#1B4332] text-[11px] font-medium">{m.dosage}</p>
                </div>

                {m.side_effects && (
                  <div className="text-[10px] text-[#6C757D]">
                    <strong>Side Effects:</strong> {m.side_effects}
                  </div>
                )}
              </div>
            </div>

            <div className="pt-3 border-t border-[#E9ECEF] flex items-center justify-between">
              <div>
                <span className="text-[10px] text-[#6C757D] block">Est. Retail Price</span>
                <span className="text-base font-extrabold text-[#1B4332]">₹{m.price.toFixed(2)}</span>
              </div>
              <span className="text-[11px] font-semibold text-[#6C757D] flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5 text-[#2D6A4F]" />
                Verified
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
