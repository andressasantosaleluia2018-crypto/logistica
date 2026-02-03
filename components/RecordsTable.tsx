
import React, { useState } from 'react';
import { BaitRecord, BranchName, RecordStatus } from '../types';
import { Edit3, Clock, CheckCircle2, XCircle, Search, Filter, X, Calendar, MapPin, Tag, SlidersHorizontal, ArrowUpDown } from 'lucide-react';
import { BRANCHES } from '../constants';

interface RecordsTableProps {
  records: BaitRecord[];
  onUpdateRecord: (updatedRecord: BaitRecord) => void;
}

export const RecordsTable: React.FC<RecordsTableProps> = ({ records, onUpdateRecord }) => {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<Partial<BaitRecord>>({});
  const [showHistoryId, setShowHistoryId] = useState<string | null>(null);
  
  // Filter States
  const [showFilters, setShowFilters] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterDate, setFilterDate] = useState('');
  const [filterBranch, setFilterBranch] = useState<string>('');
  const [filterStatus, setFilterStatus] = useState<string>('');

  // --- Handlers ---
  const startEdit = (record: BaitRecord) => {
    setEditingId(record.id);
    setEditForm({ ...record });
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditForm({});
  };

  const saveEdit = () => {
    if (!editingId) return;
    const originalRecord = records.find(r => r.id === editingId);
    if (!originalRecord) return;

    const newHistoryEntry = {
      field: 'Vários',
      oldValue: 'Edição Manual',
      newValue: 'Registro Atualizado',
      changedAt: new Date().toISOString(),
      changedBy: 'Admin'
    };

    const updatedRecord: BaitRecord = {
      ...originalRecord,
      ...editForm,
      lastUpdate: new Date().toISOString(),
      history: [newHistoryEntry, ...originalRecord.history]
    };

    onUpdateRecord(updatedRecord);
    setEditingId(null);
  };

  const handleInputChange = (field: keyof BaitRecord, value: string) => {
    setEditForm(prev => ({ ...prev, [field]: value }));
  };

  const clearFilters = () => {
    setFilterDate('');
    setFilterBranch('');
    setFilterStatus('');
    setSearchTerm('');
  };

  // --- Filtering Logic ---
  const filteredRecords = records.filter(record => {
    const searchLower = searchTerm.toLowerCase();
    const matchesSearch = 
        record.baitId.toLowerCase().includes(searchLower) || 
        record.truckPlate.toLowerCase().includes(searchLower) ||
        record.driver.toLowerCase().includes(searchLower);

    let matchesDate = true;
    if (filterDate) {
        const recordDate = new Date(record.date).toISOString().split('T')[0];
        matchesDate = recordDate === filterDate;
    }

    let matchesBranch = filterBranch ? record.branch === filterBranch : true;
    let matchesStatus = filterStatus ? record.status === filterStatus : true;

    return matchesSearch && matchesDate && matchesBranch && matchesStatus;
  });

  const hasActiveFilters = filterDate || filterBranch || filterStatus;

  // --- Components ---
  const StatusBadge = ({ status }: { status: RecordStatus }) => {
    const config = {
      [RecordStatus.ACTIVE]: { bg: 'bg-emerald-50 dark:bg-emerald-500/10', text: 'text-emerald-700 dark:text-emerald-400', border: 'border-emerald-200 dark:border-emerald-500/20' },
      [RecordStatus.INACTIVE]: { bg: 'bg-slate-50 dark:bg-slate-500/10', text: 'text-slate-600 dark:text-slate-400', border: 'border-slate-200 dark:border-slate-500/20' },
      [RecordStatus.MAINTENANCE]: { bg: 'bg-red-50 dark:bg-red-500/10', text: 'text-red-700 dark:text-red-400', border: 'border-red-200 dark:border-red-500/20' },
      [RecordStatus.TRANSIT]: { bg: 'bg-blue-50 dark:bg-blue-500/10', text: 'text-blue-700 dark:text-blue-400', border: 'border-blue-200 dark:border-blue-500/20' },
    };
    const style = config[status];
    return (
      <span className={`inline-flex items-center px-2 py-0.5 rounded text-[11px] font-semibold border ${style.bg} ${style.text} ${style.border}`}>
        {status}
      </span>
    );
  };

  return (
    <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden flex flex-col">
      
      {/* Toolbar */}
      <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50 backdrop-blur-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          
          <div>
            <h3 className="text-sm font-bold text-slate-800 dark:text-white flex items-center gap-2">
              <div className="w-1 h-4 bg-blue-500 rounded-full"></div>
              Matriz de Registros
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">Gerenciamento granular de ativos ({filteredRecords.length})</p>
          </div>

          <div className="flex items-center gap-2">
            <div className="relative group">
              <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-500 transition-colors" />
              <input 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Filtrar por ID, Placa..." 
                className="pl-9 pr-4 py-2 h-9 text-xs font-medium bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-700 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 w-64 transition-all"
              />
            </div>
            
            <button 
              onClick={() => setShowFilters(!showFilters)}
              className={`h-9 px-3 flex items-center gap-2 rounded-lg border text-xs font-medium transition-all ${
                showFilters || hasActiveFilters
                 ? 'bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-200 dark:border-blue-500/30' 
                 : 'bg-white dark:bg-slate-950 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-700 hover:bg-slate-50'
              }`}
            >
              <SlidersHorizontal size={14} />
              <span className="hidden sm:inline">Filtros</span>
              {hasActiveFilters && <span className="w-1.5 h-1.5 rounded-full bg-blue-500"></span>}
            </button>
          </div>
        </div>

        {/* Extended Filters Panel */}
        {showFilters && (
          <div className="mt-4 pt-4 border-t border-slate-200 dark:border-slate-800 grid grid-cols-1 sm:grid-cols-4 gap-4 animate-in slide-in-from-top-2 fade-in duration-200">
            
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1">
                <Calendar size={10} /> Data
              </label>
              <input 
                type="date" 
                className="w-full h-8 px-2 bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-700 rounded-md text-xs text-slate-700 dark:text-slate-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                value={filterDate}
                onChange={(e) => setFilterDate(e.target.value)}
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1">
                <MapPin size={10} /> Filial
              </label>
              <select
                className="w-full h-8 px-2 bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-700 rounded-md text-xs text-slate-700 dark:text-slate-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                value={filterBranch}
                onChange={(e) => setFilterBranch(e.target.value)}
              >
                <option value="">Todas</option>
                {BRANCHES.map(b => <option key={b} value={b}>{b}</option>)}
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1">
                <Tag size={10} /> Status
              </label>
              <select
                className="w-full h-8 px-2 bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-700 rounded-md text-xs text-slate-700 dark:text-slate-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
              >
                <option value="">Todos</option>
                {Object.values(RecordStatus).map(s => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>

            <div className="flex items-end">
               <button 
                  onClick={clearFilters}
                  disabled={!hasActiveFilters && !searchTerm}
                  className="h-8 px-3 w-full flex items-center justify-center gap-2 text-xs font-medium text-slate-500 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
               >
                  <X size={12} /> Limpar
               </button>
            </div>
          </div>
        )}
      </div>

      {/* Data Grid */}
      <div className="overflow-x-auto custom-scrollbar bg-white dark:bg-slate-900">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950">
              {[
                { label: 'ID Dispositivo', width: 'w-32' },
                { label: 'Filial', width: 'w-32' },
                { label: 'Condutor', width: 'w-48' },
                { label: 'Veículo', width: 'w-28' },
                { label: 'Documento', width: 'w-32' },
                { label: 'Status', width: 'w-32' },
                { label: 'Data', width: 'w-32' },
                { label: '', width: 'w-20' }
              ].map((h, i) => (
                <th key={i} className={`px-6 py-3 text-[10px] font-bold text-slate-500 uppercase tracking-wider ${h.width}`}>
                  <div className="flex items-center gap-1 cursor-pointer hover:text-slate-700 dark:hover:text-slate-300">
                    {h.label}
                    {h.label && <ArrowUpDown size={10} className="opacity-50" />}
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800/50">
            {filteredRecords.length === 0 ? (
                <tr>
                    <td colSpan={8}>
                        <div className="flex flex-col items-center justify-center py-16 text-slate-400">
                            <Search size={48} className="mb-4 text-slate-200 dark:text-slate-800" strokeWidth={1} />
                            <p className="text-sm font-medium">Nenhum registro encontrado</p>
                            <p className="text-xs mt-1">Tente ajustar os filtros ou sua busca.</p>
                            <button onClick={clearFilters} className="mt-4 text-blue-500 hover:underline text-xs">Limpar filtros</button>
                        </div>
                    </td>
                </tr>
            ) : filteredRecords.map(record => {
              const isEditing = editingId === record.id;
              
              return (
                <React.Fragment key={record.id}>
                  <tr className="group hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors">
                    {/* ID Column */}
                    <td className="px-6 py-3.5">
                       {isEditing ? (
                         <input className="w-full bg-white dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded px-2 py-1 text-xs" value={editForm.baitId} onChange={e => handleInputChange('baitId', e.target.value)} />
                       ) : (
                         <span className="font-mono text-xs font-medium text-blue-600 dark:text-blue-400">{record.baitId}</span>
                       )}
                    </td>

                    {/* Branch */}
                    <td className="px-6 py-3.5 text-xs text-slate-700 dark:text-slate-300">
                      {record.branch}
                    </td>

                    {/* Driver */}
                    <td className="px-6 py-3.5 text-xs font-medium text-slate-900 dark:text-white">
                      {isEditing ? (
                        <input className="w-full bg-white dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded px-2 py-1 text-xs" value={editForm.driver} onChange={e => handleInputChange('driver', e.target.value)} />
                      ) : record.driver}
                    </td>

                    {/* Plate */}
                    <td className="px-6 py-3.5">
                       {isEditing ? (
                         <input className="w-full bg-white dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded px-2 py-1 text-xs uppercase" value={editForm.truckPlate} onChange={e => handleInputChange('truckPlate', e.target.value)} />
                       ) : (
                         <span className="font-mono text-xs text-slate-600 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 px-1.5 py-0.5 rounded border border-slate-200 dark:border-slate-700">{record.truckPlate}</span>
                       )}
                    </td>

                    {/* Document */}
                    <td className="px-6 py-3.5 text-xs font-mono text-slate-500">
                       {isEditing ? (
                         <input className="w-full bg-white dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded px-2 py-1 text-xs" value={editForm.cpf} onChange={e => handleInputChange('cpf', e.target.value)} />
                       ) : record.cpf}
                    </td>

                    {/* Status */}
                    <td className="px-6 py-3.5">
                       {isEditing ? (
                         <select className="w-full bg-white dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded px-2 py-1 text-xs" value={editForm.status} onChange={e => handleInputChange('status', e.target.value)}>
                           {Object.values(RecordStatus).map(s => <option key={s} value={s}>{s}</option>)}
                         </select>
                       ) : (
                         <StatusBadge status={record.status} />
                       )}
                    </td>

                    {/* Date */}
                    <td className="px-6 py-3.5 text-xs text-slate-500">
                      {new Date(record.date).toLocaleDateString('pt-BR')}
                    </td>

                    {/* Actions */}
                    <td className="px-6 py-3.5 text-right">
                      <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        {isEditing ? (
                          <>
                            <button onClick={saveEdit} className="text-emerald-600 hover:bg-emerald-50 p-1 rounded"><CheckCircle2 size={16} /></button>
                            <button onClick={cancelEdit} className="text-red-600 hover:bg-red-50 p-1 rounded"><XCircle size={16} /></button>
                          </>
                        ) : (
                          <>
                            <button onClick={() => startEdit(record)} className="text-slate-400 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/30 p-1 rounded transition-colors" title="Editar">
                              <Edit3 size={14} />
                            </button>
                            <button 
                              onClick={() => setShowHistoryId(showHistoryId === record.id ? null : record.id)} 
                              className={`p-1 rounded transition-colors ${showHistoryId === record.id ? 'text-blue-600 bg-blue-50 dark:bg-blue-900/20' : 'text-slate-400 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/30'}`}
                              title="Histórico"
                            >
                              <Clock size={14} />
                            </button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>

                  {/* Log Expansion */}
                  {showHistoryId === record.id && (
                    <tr className="bg-slate-50/50 dark:bg-slate-950/30 shadow-inner">
                      <td colSpan={8} className="px-6 py-4">
                        <div className="max-w-3xl ml-12 border-l-2 border-slate-200 dark:border-slate-700 pl-6 py-1">
                          <h4 className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-3">Audit Log</h4>
                          <div className="space-y-3">
                             {record.history.length === 0 ? (
                               <span className="text-xs text-slate-400 italic">Sem registros de alteração.</span>
                             ) : (
                               record.history.map((h, idx) => (
                                 <div key={idx} className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-4 text-xs">
                                    <span className="font-mono text-slate-400 min-w-[120px]">{new Date(h.changedAt).toLocaleString('pt-BR')}</span>
                                    <div className="flex items-center gap-2">
                                        <span className="font-medium text-slate-700 dark:text-slate-200">{h.changedBy}</span>
                                        <span className="text-slate-400">alterou</span>
                                        <span className="px-1.5 py-0.5 rounded bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 font-mono text-[10px]">{h.field}</span>
                                    </div>
                                    <div className="flex items-center gap-2 text-slate-500">
                                        <span className="line-through decoration-red-400/50 text-red-400">{h.oldValue}</span>
                                        <span>→</span>
                                        <span className="text-emerald-600 dark:text-emerald-400">{h.newValue}</span>
                                    </div>
                                 </div>
                               ))
                             )}
                          </div>
                        </div>
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              );
            })}
          </tbody>
        </table>
      </div>
      
      {/* Footer / Pagination Mock */}
      <div className="px-6 py-3 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 flex justify-between items-center">
          <span className="text-xs text-slate-500">Mostrando {Math.min(filteredRecords.length, 10)} de {filteredRecords.length} resultados</span>
          <div className="flex gap-1">
              <button disabled className="px-3 py-1 text-xs border border-slate-200 dark:border-slate-700 rounded bg-white dark:bg-slate-900 text-slate-400 cursor-not-allowed">Anterior</button>
              <button disabled className="px-3 py-1 text-xs border border-slate-200 dark:border-slate-700 rounded bg-white dark:bg-slate-900 text-slate-400 cursor-not-allowed">Próximo</button>
          </div>
      </div>
    </div>
  );
};
