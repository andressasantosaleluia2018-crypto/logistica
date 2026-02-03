
import React, { useState, useEffect } from 'react';
import { HashRouter as Router, Routes, Route, useNavigate, useParams } from 'react-router-dom';
import { LayoutDashboard, Package, MapPin, Truck, Settings, Plus, ChevronDown, Menu, Zap, BarChart2, ShieldAlert, Sun, Moon, ArrowRight } from 'lucide-react';

import { KPICards } from './components/KPICards';
import { EvolutionChart } from './components/EvolutionChart';
import { RecordsTable } from './components/RecordsTable';
import { RegistrationModal } from './components/RegistrationModal';
import { RiskManagement } from './components/RiskManagement';
import { BranchName, PeriodFilter, BaitRecord } from './types';
import { MOCK_RECORDS, BRANCHES } from './constants';
import { getAggregatedChartData, getFilteredRecords, getBranchTotal } from './services/dataService';
import { ThemeProvider, useTheme } from './ThemeContext';

// --- Improved Sidebar ---
const Sidebar = () => {
  const { theme, toggleTheme } = useTheme();

  return (
    <div className="hidden lg:flex flex-col w-64 bg-slate-950 border-r border-slate-800 h-screen fixed left-0 top-0 z-50 text-slate-400">
      <div className="p-6 flex items-center gap-3 mb-2">
        <div className="relative flex items-center justify-center w-8 h-8 rounded-lg bg-blue-600 shadow-lg shadow-blue-500/20">
          <Package className="text-white" size={18} />
        </div>
        <div>
          <h1 className="text-white font-bold text-base tracking-tight">SmartTrack</h1>
          <span className="text-[10px] text-slate-500 uppercase font-semibold">Enterprise</span>
        </div>
      </div>

      <nav className="flex-1 px-3 space-y-1">
        <div className="px-3 py-2 mt-4 text-[10px] font-bold text-slate-600 uppercase tracking-widest">Main</div>
        
        <a href="#/" className="flex items-center gap-3 px-3 py-2 bg-blue-600/10 text-blue-400 border border-blue-600/20 rounded-lg transition-all">
          <LayoutDashboard size={18} />
          <span className="font-medium text-sm">Dashboard</span>
        </a>
        <a href="#/" className="flex items-center gap-3 px-3 py-2 hover:bg-slate-900 hover:text-slate-200 rounded-lg transition-colors group">
          <MapPin size={18} className="group-hover:text-blue-400 transition-colors"/>
          <span className="font-medium text-sm">Unidades</span>
        </a>
        <a href="#/" className="flex items-center gap-3 px-3 py-2 hover:bg-slate-900 hover:text-slate-200 rounded-lg transition-colors group">
          <Truck size={18} className="group-hover:text-emerald-400 transition-colors"/>
          <span className="font-medium text-sm">Frota</span>
        </a>
        
        <div className="px-3 py-2 mt-6 text-[10px] font-bold text-slate-600 uppercase tracking-widest">Compliance</div>
        <a href="#/risk-management" className="flex items-center gap-3 px-3 py-2 hover:bg-slate-900 hover:text-slate-200 rounded-lg transition-colors group">
          <ShieldAlert size={18} className="group-hover:text-orange-400 transition-colors"/>
          <span className="font-medium text-sm">Gestão de Risco</span>
        </a>

        <div className="px-3 py-2 mt-6 text-[10px] font-bold text-slate-600 uppercase tracking-widest">System</div>
        <a href="#/" className="flex items-center gap-3 px-3 py-2 hover:bg-slate-900 hover:text-slate-200 rounded-lg transition-colors group">
          <BarChart2 size={18} />
          <span className="font-medium text-sm">Analytics</span>
        </a>
        <a href="#/" className="flex items-center gap-3 px-3 py-2 hover:bg-slate-900 hover:text-slate-200 rounded-lg transition-colors group">
          <Settings size={18} />
          <span className="font-medium text-sm">Settings</span>
        </a>
      </nav>

      <div className="p-4 border-t border-slate-900 space-y-3">
        <button 
          onClick={toggleTheme}
          className="w-full flex items-center justify-between px-3 py-2 rounded-lg bg-slate-900 hover:bg-slate-800 transition-colors"
        >
          <span className="text-xs font-medium text-slate-400">Theme</span>
          {theme === 'dark' ? <Moon size={14} /> : <Sun size={14} />}
        </button>

        <div className="flex items-center gap-3 px-1">
          <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-slate-700 to-slate-600 flex items-center justify-center text-white text-xs font-bold border border-slate-600">AD</div>
          <div className="overflow-hidden">
            <p className="text-xs text-white font-medium truncate">Admin User</p>
            <p className="text-[10px] text-slate-500 truncate">admin@smarttrack.io</p>
          </div>
        </div>
      </div>
    </div>
  );
};

// --- Refined Branch List Widget ---
const BranchOverviewList = ({ records, period, currentBranch }: { records: BaitRecord[], period: PeriodFilter, currentBranch: BranchName }) => {
  const navigate = useNavigate();

  return (
    <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm h-full flex flex-col">
      <div className="p-5 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center">
          <div>
            <h3 className="text-sm font-bold text-slate-800 dark:text-white">Rede Operacional</h3>
            <p className="text-xs text-slate-500 mt-0.5">Status em tempo real</p>
          </div>
          <Zap size={14} className="text-amber-500 fill-amber-500" />
      </div>
      
      <div className="p-4 space-y-3 flex-1 overflow-y-auto custom-scrollbar">
        {BRANCHES.map(branch => {
          const count = getBranchTotal(branch, records, period);
          const isSelected = branch === currentBranch;
          const max = Math.max(200, count * 1.5); // Contextual max
          const percent = Math.min((count / max) * 100, 100);

          return (
            <button 
              key={branch} 
              onClick={() => navigate(`/branch/${encodeURIComponent(branch)}`)}
              className={`w-full group text-left transition-all duration-200 rounded-lg p-2.5 hover:bg-slate-50 dark:hover:bg-slate-800/50 ${isSelected ? 'bg-slate-50 dark:bg-slate-800/80 ring-1 ring-slate-200 dark:ring-slate-700' : ''}`}
            >
              <div className="flex justify-between items-center mb-1.5">
                <span className={`text-xs font-medium ${isSelected ? 'text-blue-600 dark:text-blue-400' : 'text-slate-600 dark:text-slate-400 group-hover:text-slate-900 dark:group-hover:text-slate-200'}`}>
                  {branch}
                </span>
                <div className="flex items-center gap-2">
                   <span className={`text-xs font-mono font-bold ${isSelected ? 'text-slate-900 dark:text-white' : 'text-slate-500'}`}>{count}</span>
                   {isSelected && <ArrowRight size={12} className="text-blue-500"/>}
                </div>
              </div>
              
              <div className="w-full bg-slate-100 dark:bg-slate-800 rounded-full h-1">
                <div 
                  className={`h-full rounded-full transition-all duration-1000 ${isSelected ? 'bg-blue-500' : 'bg-slate-300 dark:bg-slate-600'}`} 
                  style={{ width: `${percent}%` }}
                ></div>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};

interface BranchPageProps {
  records: BaitRecord[];
  onUpdateRecord: (r: BaitRecord) => void;
  onAddRecord: (r: Omit<BaitRecord, 'id' | 'lastUpdate' | 'history'>) => void;
}

// --- Main Layout ---
const BranchPage: React.FC<BranchPageProps> = ({ records, onUpdateRecord, onAddRecord }) => {
  const { branchId } = useParams(); 
  const navigate = useNavigate();
  const [selectedBranch, setSelectedBranch] = useState<BranchName>(BranchName.CAMACARI);
  const [period, setPeriod] = useState<PeriodFilter>(PeriodFilter.TODAY);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    if (branchId) {
      const decoded = decodeURIComponent(branchId);
      const matched = BRANCHES.find(b => b === decoded);
      if (matched) setSelectedBranch(matched);
    }
  }, [branchId]);

  const handleBranchChange = (branch: BranchName) => {
    setSelectedBranch(branch);
    navigate(`/branch/${encodeURIComponent(branch)}`);
  };

  const filteredRecords = getFilteredRecords(selectedBranch, period, records);
  const chartData = getAggregatedChartData(period);

  return (
    <div className="min-h-screen bg-slate-50/50 dark:bg-slate-950 text-slate-900 dark:text-slate-200 pb-12">
      
      {/* SaaS Header */}
      <header className="h-16 border-b border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-slate-950/80 backdrop-blur-xl sticky top-0 z-30 px-6 sm:px-8 flex items-center justify-between">
        
        <div className="flex items-center gap-4">
          <div className="hidden md:flex flex-col">
            <div className="flex items-center gap-2 text-[10px] font-medium text-slate-400 uppercase tracking-wider">
               <span>Filiais</span>
               <span className="text-slate-300 dark:text-slate-700">/</span>
               <span className="text-blue-600 dark:text-blue-400">{selectedBranch}</span>
            </div>
            <h2 className="text-lg font-bold text-slate-900 dark:text-white tracking-tight leading-tight">
              Dashboard Operacional
            </h2>
          </div>
          
          {/* Mobile Selector */}
          <div className="md:hidden">
             <span className="text-sm font-bold">{selectedBranch}</span>
          </div>
        </div>

        <div className="flex items-center gap-3 sm:gap-4">
          
          {/* Context Selector */}
          <div className="hidden sm:block relative group">
             <button className="flex items-center gap-2 px-3 py-1.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg text-sm font-medium hover:border-slate-300 dark:hover:border-slate-700 transition-colors">
               <MapPin size={14} className="text-slate-400"/>
               <span>{selectedBranch}</span>
               <ChevronDown size={14} className="text-slate-400 ml-2"/>
             </button>
             <div className="absolute top-full right-0 mt-2 w-48 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg shadow-xl py-1 hidden group-hover:block z-50">
                {BRANCHES.map(b => (
                   <button 
                    key={b} 
                    onClick={() => handleBranchChange(b)}
                    className="w-full text-left px-4 py-2 text-xs font-medium hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-400 hover:text-blue-600"
                   >
                     {b}
                   </button>
                ))}
             </div>
          </div>

          <div className="h-6 w-px bg-slate-200 dark:bg-slate-800 hidden sm:block"></div>

          {/* Period Toggle */}
          <div className="flex bg-slate-100 dark:bg-slate-900 p-0.5 rounded-lg border border-slate-200 dark:border-slate-800">
             {[PeriodFilter.TODAY, PeriodFilter.MONTH, PeriodFilter.YEAR].map(p => (
               <button
                 key={p}
                 onClick={() => setPeriod(p)}
                 className={`px-3 py-1 rounded-[6px] text-[10px] font-bold uppercase tracking-wide transition-all ${
                   period === p ? 'bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-sm border border-slate-200 dark:border-slate-700' : 'text-slate-500 hover:text-slate-700'
                 }`}
               >
                 {p}
               </button>
             ))}
          </div>

          <button 
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-2 bg-slate-900 dark:bg-blue-600 hover:bg-slate-800 dark:hover:bg-blue-500 text-white px-3 py-1.5 rounded-lg text-sm font-medium transition-all shadow-sm"
          >
             <Plus size={16} />
             <span className="hidden sm:inline">Nova Isca</span>
          </button>
        </div>
      </header>

      <main className="px-6 sm:px-8 py-8 max-w-[1600px] mx-auto space-y-8">
        
        {/* Top Section */}
        <KPICards currentBranch={selectedBranch} records={records} />

        {/* Middle Section: Chart + List */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
          <div className="xl:col-span-2">
             <EvolutionChart data={chartData} />
          </div>
          <div className="xl:col-span-1 min-h-[400px]">
            <BranchOverviewList records={records} period={period} currentBranch={selectedBranch} />
          </div>
        </div>

        {/* Bottom Section: Table */}
        <div className="pt-2">
          <RecordsTable records={filteredRecords} onUpdateRecord={onUpdateRecord} />
        </div>

      </main>

      <RegistrationModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        onSave={onAddRecord}
        currentBranch={selectedBranch}
      />
    </div>
  );
};

const App = () => {
  const [records, setRecords] = useState<BaitRecord[]>(MOCK_RECORDS);

  const handleUpdateRecord = (updated: BaitRecord) => {
    setRecords(prev => prev.map(r => r.id === updated.id ? updated : r));
  };

  const handleAddRecord = (newRecordData: Omit<BaitRecord, 'id' | 'lastUpdate' | 'history'>) => {
    const newRecord: BaitRecord = {
      ...newRecordData,
      id: `REC-${Date.now()}`,
      lastUpdate: new Date().toISOString(),
      history: [{
         field: 'Criação',
         oldValue: '-',
         newValue: 'Criado Manualmente',
         changedAt: new Date().toISOString(),
         changedBy: 'Admin'
      }]
    };
    setRecords(prev => [newRecord, ...prev]);
  };

  return (
    <ThemeProvider>
      <Router>
        <div className="flex min-h-screen bg-slate-50 dark:bg-slate-950 font-sans">
          <Sidebar />
          <div className="flex-1 lg:ml-64 transition-all">
             {/* Mobile Top Bar */}
             <div className="lg:hidden bg-slate-900 text-white p-4 flex justify-between items-center sticky top-0 z-40">
                <span className="font-bold flex items-center gap-2"><Package className="text-blue-500"/> SmartTrack</span>
                <Menu size={24} className="text-slate-400"/>
             </div>

             <Routes>
               <Route path="/" element={<BranchPage records={records} onUpdateRecord={handleUpdateRecord} onAddRecord={handleAddRecord} />} />
               <Route path="/branch/:branchId" element={<BranchPage records={records} onUpdateRecord={handleUpdateRecord} onAddRecord={handleAddRecord} />} />
               <Route path="/risk-management" element={<RiskManagement />} />
             </Routes>
          </div>
        </div>
      </Router>
    </ThemeProvider>
  );
};

export default App;
