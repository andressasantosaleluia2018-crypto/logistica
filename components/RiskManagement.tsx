
import React, { useState } from 'react';
import { RiskRecord, RiskType, ProcessStatus, PeriodFilter } from '../types';
import { MOCK_RISK_RECORDS } from '../constants';
import { RiskFormModal } from './RiskFormModal';
import { Search, Plus, AlertTriangle, CheckCircle2, Clock, FileText, Phone, LayoutDashboard, Calendar, User } from 'lucide-react';

export const RiskManagement = () => {
  // 'DASHBOARD' is a special view state, otherwise it's a RiskType
  const [activeView, setActiveView] = useState<RiskType | 'DASHBOARD'>('DASHBOARD');
  const [records, setRecords] = useState<RiskRecord[]>(MOCK_RISK_RECORDS);
  const [period, setPeriod] = useState<PeriodFilter>(PeriodFilter.TODAY);
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingRecord, setEditingRecord] = useState<RiskRecord | undefined>(undefined);

  // --- Logic for Filtering ---

  const filterByPeriod = (recDate: string) => {
    const date = new Date(recDate);
    const now = new Date();
    
    // Normalize dates to ignore time for 'TODAY' comparison
    const d1 = new Date(date.getFullYear(), date.getMonth(), date.getDate());
    const d2 = new Date(now.getFullYear(), now.getMonth(), now.getDate());

    if (period === PeriodFilter.TODAY) return d1.getTime() === d2.getTime();
    if (period === PeriodFilter.MONTH) return date.getMonth() === now.getMonth() && date.getFullYear() === now.getFullYear();
    if (period === PeriodFilter.YEAR) return date.getFullYear() === now.getFullYear();
    return true;
  };

  const getFilteredRecords = () => {
    return records.filter(r => {
      // If in Dashboard, we might show everything or specific logic. 
      // The prompt says "deixar somente pendencias do dia" for the main view or initial view.
      // But typically a dashboard shows aggregates. The table below the dashboard usually shows details.
      
      const matchesType = activeView === 'DASHBOARD' ? true : r.type === activeView;
      const matchesSearch = 
          r.driver.toLowerCase().includes(searchTerm.toLowerCase()) ||
          r.truckPlate.toLowerCase().includes(searchTerm.toLowerCase()) ||
          r.processStatus.toLowerCase().includes(searchTerm.toLowerCase());
      
      // If we are in Dashboard view and listing records, user requested "Pendencias do dia"
      // However, we also have the period filter. Let's respect the period filter for the list.
      const matchesPeriod = filterByPeriod(r.date);
      
      return matchesType && matchesSearch && matchesPeriod;
    });
  };

  const filteredRecords = getFilteredRecords();

  const getStatusCount = (status: ProcessStatus) => {
    // KPI sums based on the current period filter across ALL types (if in dashboard) or specific type
    return records.filter(r => {
        const matchesType = activeView === 'DASHBOARD' ? true : r.type === activeView;
        return matchesType && r.processStatus === status && filterByPeriod(r.date);
    }).length;
  };

  // --- Alert Logic for Maintenance ---
  const getDaysUntilDue = (dateStr?: string) => {
      if (!dateStr) return null;
      const due = new Date(dateStr);
      const now = new Date();
      const diffTime = due.getTime() - now.getTime();
      return Math.ceil(diffTime / (1000 * 60 * 60 * 24)); 
  };

  // --- Handlers ---

  const handleSave = (record: RiskRecord) => {
      if (editingRecord) {
          setRecords(prev => prev.map(r => r.id === record.id ? record : r));
      } else {
          setRecords(prev => [{ ...record, id: `RISK-${Date.now()}` }, ...prev]);
      }
      setEditingRecord(undefined);
  };

  const handleEdit = (record: RiskRecord) => {
      setEditingRecord(record);
      setIsModalOpen(true);
  };

  const handleOpenNew = () => {
      setEditingRecord(undefined);
      setIsModalOpen(true);
  };

  // --- Components ---

  const KPICard = ({ title, count, color, icon: Icon }: any) => (
      <div className={`flex-1 bg-white dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800 p-4 rounded-xl flex items-center gap-4 shadow-sm dark:shadow-lg transition-colors`}>
          <div className={`p-3 rounded-full ${color} bg-opacity-20`}>
              <Icon size={24} className={color.replace('bg-', 'text-')} />
          </div>
          <div>
              <p className="text-slate-500 dark:text-slate-400 text-xs uppercase font-bold tracking-wider">{title}</p>
              <p className="text-2xl font-mono font-bold text-slate-800 dark:text-white">{count}</p>
          </div>
      </div>
  );

  return (
    <div className="flex flex-col lg:flex-row h-full min-h-screen">
        
        {/* Sub-Sidebar / Menu */}
        <div className="w-full lg:w-64 bg-white dark:bg-slate-950/50 border-r border-slate-200 dark:border-slate-800 p-4 flex flex-col gap-2 transition-colors">
            <h3 className="text-slate-500 text-xs font-bold uppercase tracking-widest mb-4 px-2">Menu</h3>
            
            <button
                onClick={() => setActiveView('DASHBOARD')}
                className={`text-left px-4 py-3 rounded-lg text-sm font-medium transition-all flex items-center gap-2 ${
                    activeView === 'DASHBOARD'
                    ? 'bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-200 dark:border-blue-500/20' 
                    : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-900 hover:text-slate-800 dark:hover:text-slate-200'
                }`}
            >
                <LayoutDashboard size={16}/> Dashboard
            </button>

            <div className="h-px bg-slate-200 dark:bg-slate-800 my-2 mx-2"></div>

            {Object.values(RiskType).map(type => (
                <button
                    key={type}
                    onClick={() => setActiveView(type)}
                    className={`text-left px-4 py-3 rounded-lg text-sm font-medium transition-all ${
                        activeView === type 
                        ? 'bg-orange-50 dark:bg-orange-500/10 text-orange-600 dark:text-orange-400 border border-orange-200 dark:border-orange-500/20' 
                        : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-900 hover:text-slate-800 dark:hover:text-slate-200'
                    }`}
                >
                    {type}
                </button>
            ))}
        </div>

        {/* Main Content */}
        <div className="flex-1 p-8 overflow-y-auto">
            
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
                <div>
                    <h2 className="text-2xl font-bold text-slate-800 dark:text-white tracking-tight">Nova Minas</h2>
                    <p className="text-slate-500 text-sm">
                        {activeView === 'DASHBOARD' ? 'Gerenciamento de Risco - Visão Geral' : activeView}
                    </p>
                </div>
                
                <div className="flex items-center gap-3">
                     <div className="flex bg-slate-100 dark:bg-slate-900 p-1 rounded-lg border border-slate-200 dark:border-slate-800">
                        {[PeriodFilter.TODAY, PeriodFilter.MONTH, PeriodFilter.YEAR].map(p => (
                            <button
                                key={p}
                                onClick={() => setPeriod(p)}
                                className={`px-3 py-1.5 rounded-md text-xs font-bold transition-all ${
                                period === p ? 'bg-white dark:bg-slate-800 text-slate-800 dark:text-white shadow-sm' : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'
                                }`}
                            >
                                {p}
                            </button>
                        ))}
                    </div>
                    <button 
                        onClick={handleOpenNew}
                        className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-lg text-sm font-bold flex items-center gap-2 transition-all hover:scale-105 shadow-md dark:shadow-lg dark:shadow-orange-500/20"
                    >
                        <Plus size={16} /> Novo Registro
                    </button>
                </div>
            </div>

            {/* Dashboard KPIs - Only show if in Dashboard view */}
            {activeView === 'DASHBOARD' && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8 animate-in fade-in slide-in-from-top-4">
                    <KPICard 
                        title={`Pendentes (${period})`}
                        count={getStatusCount(ProcessStatus.PENDENTE)} 
                        color="bg-yellow-500 text-yellow-500" 
                        icon={Clock}
                    />
                    <KPICard 
                        title={`Concluídos (${period})`}
                        count={getStatusCount(ProcessStatus.CONCLUIDO)} 
                        color="bg-emerald-500 text-emerald-500" 
                        icon={CheckCircle2}
                    />
                </div>
            )}

            {/* Search & Table */}
            <div className="bg-white dark:bg-slate-900/60 dark:backdrop-blur-md rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm dark:shadow-xl overflow-hidden transition-colors">
                <div className="p-4 border-b border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <h3 className="text-slate-800 dark:text-white font-bold flex items-center gap-2">
                        <FileText size={18} className="text-slate-400" />
                        {activeView === 'DASHBOARD' ? `Registros - ${period}` : 'Registros do Processo'}
                    </h3>
                    <div className="relative w-full sm:w-auto">
                        <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
                        <input 
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            placeholder="Buscar Placa, Nome, Status..."
                            className="bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-300 text-sm rounded-lg pl-9 pr-3 py-1.5 focus:outline-none focus:border-orange-500/50 w-full sm:w-64 transition-colors"
                        />
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead className="bg-slate-50 dark:bg-slate-950/80">
                            <tr>
                                <th className="px-6 py-3 text-xs font-bold text-slate-500 uppercase tracking-wider">Status</th>
                                <th className="px-6 py-3 text-xs font-bold text-slate-500 uppercase tracking-wider">Data</th>
                                <th className="px-6 py-3 text-xs font-bold text-slate-500 uppercase tracking-wider">Motorista / CPF / Contato</th>
                                <th className="px-6 py-3 text-xs font-bold text-slate-500 uppercase tracking-wider">Cavalo</th>
                                {activeView === 'DASHBOARD' && (
                                     <th className="px-6 py-3 text-xs font-bold text-slate-500 uppercase tracking-wider">Tipo</th>
                                )}
                                {(activeView === RiskType.MANUTENCAO || activeView === RiskType.CHECKLIST) && (
                                    <>
                                        <th className="px-6 py-3 text-xs font-bold text-slate-500 uppercase tracking-wider">Carreta</th>
                                        <th className="px-6 py-3 text-xs font-bold text-slate-500 uppercase tracking-wider">Vencimentos</th>
                                    </>
                                )}
                                <th className="px-6 py-3 text-xs font-bold text-slate-500 uppercase tracking-wider">Última Alteração</th>
                                <th className="px-6 py-3 text-xs font-bold text-slate-500 uppercase tracking-wider">Ações</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 dark:divide-slate-800/50">
                            {filteredRecords.map(record => {
                                // Alert logic for maintenance
                                let showAlert = false;
                                let daysLeft = null;
                                if ((record.type === RiskType.MANUTENCAO || record.type === RiskType.CHECKLIST) && record.maintenanceDueDate) {
                                    daysLeft = getDaysUntilDue(record.maintenanceDueDate);
                                    if (daysLeft !== null && daysLeft <= 7 && daysLeft >= 0) showAlert = true;
                                }

                                return (
                                    <tr key={record.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors group">
                                        <td className="px-6 py-4">
                                            <span className={`px-2 py-1 rounded-md text-[10px] uppercase font-bold tracking-wider border ${
                                                record.processStatus === ProcessStatus.CONCLUIDO ? 'bg-emerald-100 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border-emerald-200 dark:border-emerald-500/20' :
                                                'bg-yellow-100 dark:bg-yellow-500/10 text-yellow-700 dark:text-yellow-400 border-yellow-200 dark:border-yellow-500/20'
                                            }`}>
                                                {record.processStatus}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-xs text-slate-600 dark:text-slate-400 font-mono">
                                            {new Date(record.date).toLocaleDateString('pt-BR')}
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="text-slate-800 dark:text-white text-sm font-medium flex items-center gap-1">
                                                <User size={12} className="text-slate-400"/> {record.driver}
                                            </div>
                                            <div className="text-slate-500 text-xs font-mono ml-4">{record.cpf}</div>
                                            {record.phone && (
                                                <div className="text-slate-500 dark:text-slate-600 text-xs flex items-center gap-1 mt-1 ml-4">
                                                    <Phone size={10}/> {record.phone}
                                                </div>
                                            )}
                                        </td>
                                        <td className="px-6 py-4 text-sm font-mono text-slate-700 dark:text-slate-300 uppercase">
                                            {record.truckPlate}
                                        </td>
                                        
                                        {activeView === 'DASHBOARD' && (
                                            <td className="px-6 py-4 text-xs text-slate-500 dark:text-slate-400">
                                                {record.type}
                                            </td>
                                        )}

                                        {(activeView === RiskType.MANUTENCAO || activeView === RiskType.CHECKLIST) && (
                                            <>
                                                <td className="px-6 py-4 text-sm font-mono text-slate-700 dark:text-slate-300 uppercase">{record.trailerPlate || '-'}</td>
                                                <td className="px-6 py-4">
                                                    {showAlert ? (
                                                        <div className="flex items-center gap-2 text-red-500 dark:text-red-400 text-xs font-bold animate-pulse">
                                                            <AlertTriangle size={14} /> Vence em {daysLeft} dias
                                                        </div>
                                                    ) : (
                                                        <div className="text-slate-500 text-xs">
                                                            M: {record.maintenanceDueDate ? new Date(record.maintenanceDueDate).toLocaleDateString() : '-'}
                                                        </div>
                                                    )}
                                                </td>
                                            </>
                                        )}

                                        <td className="px-6 py-4">
                                            <div className="text-slate-500 dark:text-slate-400 text-xs">
                                                {new Date(record.lastUpdate).toLocaleString('pt-BR')}
                                            </div>
                                            {record.history[0] && (
                                                <div className="text-slate-400 dark:text-slate-500 text-[10px] mt-1 flex flex-col">
                                                    <span>por {record.history[0].changedBy}</span>
                                                    <span className="text-slate-400 flex items-center gap-1"><Phone size={8}/> {record.history[0].contact}</span>
                                                </div>
                                            )}
                                        </td>
                                        <td className="px-6 py-4">
                                            <button 
                                                onClick={() => handleEdit(record)}
                                                className="text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-blue-600 px-3 py-1 rounded text-xs transition-colors"
                                            >
                                                Editar
                                            </button>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                    {filteredRecords.length === 0 && (
                        <div className="p-8 text-center text-slate-500 text-sm">Nenhum registro encontrado para este filtro.</div>
                    )}
                </div>
            </div>
        </div>

        <RiskFormModal 
            isOpen={isModalOpen}
            onClose={() => setIsModalOpen(false)}
            onSave={handleSave}
            initialData={editingRecord}
            preSelectedType={activeView === 'DASHBOARD' ? RiskType.PPA : activeView}
        />
    </div>
  );
};
