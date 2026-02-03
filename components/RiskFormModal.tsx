
import React, { useState, useEffect } from 'react';
import { X, Save, ShieldAlert, Truck, Calendar, User, FileText, Phone } from 'lucide-react';
import { RiskRecord, RiskType, ProcessStatus } from '../types';

interface RiskFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (record: RiskRecord) => void;
  initialData?: RiskRecord;
  preSelectedType?: RiskType;
}

export const RiskFormModal = ({ isOpen, onClose, onSave, initialData, preSelectedType }: RiskFormModalProps) => {
  if (!isOpen) return null;

  const [formData, setFormData] = useState<Partial<RiskRecord>>({
    type: preSelectedType || RiskType.PPA,
    processStatus: ProcessStatus.PENDENTE,
    date: new Date().toISOString(),
    driver: '',
    truckPlate: '',
    cpf: '',
    phone: '',
    notes: '',
    trailerPlate: '',
    location: '',
  });

  // Load initial data for editing
  useEffect(() => {
    if (initialData) {
      setFormData({ ...initialData });
    } else {
        // Reset for new entry
        setFormData({
            type: preSelectedType || RiskType.PPA,
            processStatus: ProcessStatus.PENDENTE,
            date: new Date().toISOString(),
            driver: '',
            truckPlate: '',
            cpf: '',
            phone: '',
            notes: '',
            trailerPlate: '',
            location: '',
        });
    }
  }, [initialData, preSelectedType, isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Simulate Email Sending as requested
    console.log(`📧 ENVIANDO E-MAIL PARA: andressa.aleluia@novaminas.com.br`);
    console.log(`ASSUNTO: Atualização de Cadastro - ${formData.truckPlate}`);
    console.log(`CORPO: O registro do motorista ${formData.driver} (Placa: ${formData.truckPlate}) foi atualizado/criado. Status: ${formData.processStatus}.`);
    
    // Create history entry with WhatsApp contact mock
    const newHistoryItem = {
        changedAt: new Date().toISOString(),
        changedBy: 'Admin User', // Mock user
        contact: '(11) 98888-7777', // Mock whatsapp of the user editing
        description: initialData ? `Status alterado para ${formData.processStatus}` : 'Novo cadastro realizado'
    };

    const recordToSave = {
        ...formData,
        lastUpdate: new Date().toISOString(),
        history: initialData ? [newHistoryItem, ...initialData.history] : [newHistoryItem]
    } as RiskRecord;

    onSave(recordToSave);
    onClose();
  };

  const isMaintenance = formData.type === RiskType.MANUTENCAO || formData.type === RiskType.CHECKLIST;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/50 dark:bg-slate-950/80 backdrop-blur-sm p-4 overflow-y-auto">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-2xl shadow-2xl dark:shadow-[0_0_50px_-10px_rgba(0,0,0,0.7)] w-full max-w-2xl animate-in fade-in zoom-in duration-200 my-8 transition-colors">
        
        {/* Header */}
        <div className="bg-slate-50 dark:bg-slate-950 px-6 py-5 flex justify-between items-center border-b border-slate-200 dark:border-slate-800 relative overflow-hidden rounded-t-2xl">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-orange-500 to-red-500"></div>
          <div className="flex items-center gap-3">
             <div className="p-2 bg-orange-100 dark:bg-orange-500/10 rounded-lg border border-orange-200 dark:border-orange-500/20">
                <ShieldAlert size={20} className="text-orange-600 dark:text-orange-500" />
             </div>
             <div>
                <h3 className="text-slate-800 dark:text-white font-bold text-lg tracking-tight">Gerenciamento de Risco</h3>
                <p className="text-xs text-slate-500">Nova Minas</p>
             </div>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 dark:text-slate-500 dark:hover:text-white transition-colors bg-white dark:bg-slate-900 hover:bg-slate-100 dark:hover:bg-slate-800 p-2 rounded-lg border border-transparent hover:border-slate-200 dark:hover:border-slate-700">
            <X size={20} />
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          
          {/* Top Row: Type and Status */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                  <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">Tipo de Processo</label>
                  <select 
                      className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-800 rounded-xl px-4 py-3 text-slate-900 dark:text-white focus:border-orange-500 focus:ring-1 focus:ring-orange-500 transition-all text-sm"
                      value={formData.type}
                      onChange={e => setFormData({...formData, type: e.target.value as RiskType})}
                      disabled={!!initialData}
                  >
                      {Object.values(RiskType).map(t => (
                          <option key={t} value={t}>{t}</option>
                      ))}
                  </select>
              </div>
              <div>
                  <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">Status (Filtro Suspenso)</label>
                  <select 
                      className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-800 rounded-xl px-4 py-3 text-slate-900 dark:text-white focus:border-orange-500 focus:ring-1 focus:ring-orange-500 transition-all text-sm font-bold"
                      value={formData.processStatus}
                      onChange={e => setFormData({...formData, processStatus: e.target.value as ProcessStatus})}
                  >
                      {Object.values(ProcessStatus).map(s => (
                          <option key={s} value={s}>{s}</option>
                      ))}
                  </select>
              </div>
          </div>

          <div className="h-px bg-slate-200 dark:bg-slate-800 w-full"></div>

          {/* Core Fields */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
             <div>
                <label className="flex items-center gap-2 text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">
                   <Calendar size={12}/> Data
                </label>
                <input 
                  type="date"
                  required
                  className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-800 rounded-xl px-4 py-3 text-slate-900 dark:text-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all"
                  value={formData.date ? formData.date.split('T')[0] : ''}
                  onChange={e => setFormData({...formData, date: new Date(e.target.value).toISOString()})}
                />
            </div>
            <div>
              <label className="flex items-center gap-2 text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">
                  <User size={12}/> Motorista
              </label>
              <input 
                required
                className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-800 rounded-xl px-4 py-3 text-slate-900 dark:text-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all"
                value={formData.driver}
                onChange={e => setFormData({...formData, driver: e.target.value})}
              />
            </div>
            <div>
              <label className="flex items-center gap-2 text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">
                  <FileText size={12}/> CPF
              </label>
              <input 
                required
                className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-800 rounded-xl px-4 py-3 text-slate-900 dark:text-white font-mono focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all"
                value={formData.cpf}
                onChange={e => setFormData({...formData, cpf: e.target.value})}
              />
            </div>
            <div>
              <label className="flex items-center gap-2 text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">
                  <Truck size={12}/> Placa Cavalo
              </label>
              <input 
                required
                className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-800 rounded-xl px-4 py-3 text-slate-900 dark:text-white font-mono uppercase focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all"
                value={formData.truckPlate}
                onChange={e => setFormData({...formData, truckPlate: e.target.value})}
              />
            </div>
            <div>
              <label className="flex items-center gap-2 text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">
                  <Phone size={12}/> Contato (Opcional)
              </label>
              <input 
                className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-800 rounded-xl px-4 py-3 text-slate-900 dark:text-white font-mono focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all"
                value={formData.phone}
                onChange={e => setFormData({...formData, phone: e.target.value})}
                placeholder="(xx) xxxxx-xxxx"
              />
            </div>
          </div>

          {/* Maintenance Specific Fields */}
          {isMaintenance && (
              <div className="bg-slate-50 dark:bg-slate-950/50 border border-slate-200 dark:border-slate-800 p-4 rounded-xl space-y-4 animate-in fade-in slide-in-from-top-2">
                  <div className="flex items-center gap-2 text-orange-600 dark:text-orange-400 text-sm font-bold border-b border-slate-200 dark:border-slate-800 pb-2 mb-2">
                      <Truck size={16}/> Dados Específicos da Carreta
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-xs font-bold text-slate-500 mb-1">Placa Carreta</label>
                        <input 
                            required
                            className="w-full bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg px-3 py-2 text-slate-900 dark:text-white font-mono uppercase"
                            value={formData.trailerPlate}
                            onChange={e => setFormData({...formData, trailerPlate: e.target.value})}
                        />
                    </div>
                    <div>
                        <label className="block text-xs font-bold text-slate-500 mb-1">Local</label>
                        <input 
                            className="w-full bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg px-3 py-2 text-slate-900 dark:text-white"
                            value={formData.location}
                            onChange={e => setFormData({...formData, location: e.target.value})}
                        />
                    </div>
                    <div>
                        <label className="block text-xs font-bold text-slate-500 mb-1">Vencimento Manutenção</label>
                        <input 
                            type="date"
                            required
                            className="w-full bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg px-3 py-2 text-slate-900 dark:text-white"
                            value={formData.maintenanceDueDate ? formData.maintenanceDueDate.split('T')[0] : ''}
                            onChange={e => setFormData({...formData, maintenanceDueDate: new Date(e.target.value).toISOString()})}
                        />
                    </div>
                    <div>
                        <label className="block text-xs font-bold text-slate-500 mb-1">Vencimento Checklist</label>
                        <input 
                            type="date"
                            required
                            className="w-full bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg px-3 py-2 text-slate-900 dark:text-white"
                            value={formData.checklistDueDate ? formData.checklistDueDate.split('T')[0] : ''}
                            onChange={e => setFormData({...formData, checklistDueDate: new Date(e.target.value).toISOString()})}
                        />
                    </div>
                  </div>
              </div>
          )}

          <div>
              <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">Observações (Opcional)</label>
              <textarea 
                className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-800 rounded-xl px-4 py-3 text-slate-900 dark:text-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all min-h-[80px]"
                value={formData.notes}
                onChange={e => setFormData({...formData, notes: e.target.value})}
              />
          </div>

          <div className="pt-4 flex justify-end gap-3 border-t border-slate-200 dark:border-slate-800">
            <button 
              type="button" 
              onClick={onClose}
              className="px-5 py-2.5 text-sm font-medium text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
            >
              Cancelar
            </button>
            <button 
              type="submit" 
              className="flex items-center gap-2 px-6 py-2.5 text-sm font-bold text-white dark:text-emerald-950 bg-emerald-600 dark:bg-emerald-500 hover:bg-emerald-500 dark:hover:bg-emerald-400 rounded-lg shadow-lg dark:shadow-emerald-500/20 transition-all hover:scale-105"
            >
              <Save size={18} />
              Salvar Processo
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
