
import React, { useState } from 'react';
import { X, Save, Box } from 'lucide-react';
import { BaitRecord, BranchName, RecordStatus } from '../types';

interface RegistrationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (record: Omit<BaitRecord, 'id' | 'lastUpdate' | 'history'>) => void;
  currentBranch: BranchName;
}

export const RegistrationModal = ({ isOpen, onClose, onSave, currentBranch }: RegistrationModalProps) => {
  if (!isOpen) return null;

  const [formData, setFormData] = useState({
    baitId: '',
    driver: '',
    truckPlate: '',
    cpf: '',
    status: RecordStatus.ACTIVE,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      ...formData,
      branch: currentBranch,
      date: new Date().toISOString(),
    });
    onClose();
    setFormData({ baitId: '', driver: '', truckPlate: '', cpf: '', status: RecordStatus.ACTIVE });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/50 dark:bg-slate-950/80 backdrop-blur-sm p-4">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-2xl shadow-2xl dark:shadow-[0_0_40px_-10px_rgba(0,0,0,0.7)] w-full max-w-md overflow-hidden animate-in fade-in zoom-in duration-200">
        
        {/* Header */}
        <div className="bg-slate-50 dark:bg-slate-950 px-6 py-5 flex justify-between items-center border-b border-slate-200 dark:border-slate-800 relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 to-cyan-500"></div>
          <div className="flex items-center gap-3">
             <div className="p-2 bg-blue-100 dark:bg-blue-500/10 rounded-lg border border-blue-200 dark:border-blue-500/20">
                <Box size={20} className="text-blue-600 dark:text-blue-500" />
             </div>
             <h3 className="text-slate-800 dark:text-white font-bold text-lg tracking-tight">Nova Isca <span className="text-slate-400 dark:text-slate-500 font-normal">| {currentBranch}</span></h3>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 dark:text-slate-500 dark:hover:text-white transition-colors bg-white dark:bg-slate-900 hover:bg-slate-100 dark:hover:bg-slate-800 p-2 rounded-lg border border-transparent hover:border-slate-200 dark:hover:border-slate-700">
            <X size={20} />
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          <div>
            <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">ID do Dispositivo</label>
            <input 
              required
              type="text" 
              className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-800 rounded-xl px-4 py-3 text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-700 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 font-mono transition-all"
              placeholder="Ex: ISCA-9999"
              value={formData.baitId}
              onChange={e => setFormData({...formData, baitId: e.target.value})}
            />
          </div>

          <div className="grid grid-cols-2 gap-5">
            <div>
              <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">Motorista</label>
              <input 
                required
                type="text" 
                className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-800 rounded-xl px-4 py-3 text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-700 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all"
                placeholder="Nome"
                value={formData.driver}
                onChange={e => setFormData({...formData, driver: e.target.value})}
              />
            </div>
             <div>
              <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">CPF</label>
              <input 
                required
                type="text" 
                className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-800 rounded-xl px-4 py-3 text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-700 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 font-mono text-sm transition-all"
                placeholder="000..."
                value={formData.cpf}
                onChange={e => setFormData({...formData, cpf: e.target.value})}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-5">
            <div>
              <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">Placa (Cavalo)</label>
              <input 
                required
                type="text" 
                className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-800 rounded-xl px-4 py-3 text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-700 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 font-mono uppercase transition-all"
                placeholder="ABC-1234"
                value={formData.truckPlate}
                onChange={e => setFormData({...formData, truckPlate: e.target.value})}
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">Status Inicial</label>
              <div className="relative">
                <select 
                    className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-800 rounded-xl px-4 py-3 text-slate-900 dark:text-white appearance-none focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all"
                    value={formData.status}
                    onChange={e => setFormData({...formData, status: e.target.value as RecordStatus})}
                >
                    {Object.values(RecordStatus).map(s => (
                    <option key={s} value={s}>{s}</option>
                    ))}
                </select>
                <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-500">
                    <svg width="10" height="6" viewBox="0 0 10 6" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M1 1L5 5L9 1" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                </div>
              </div>
            </div>
          </div>

          <div className="pt-6 flex justify-end gap-3 border-t border-slate-200 dark:border-slate-800 mt-2">
            <button 
              type="button" 
              onClick={onClose}
              className="px-5 py-2.5 text-sm font-medium text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
            >
              Cancelar
            </button>
            <button 
              type="submit" 
              className="flex items-center gap-2 px-6 py-2.5 text-sm font-bold text-white bg-blue-600 hover:bg-blue-500 rounded-lg shadow-lg shadow-blue-500/20 transition-all hover:scale-105"
            >
              <Save size={18} />
              Confirmar Registro
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
