
import React, { useMemo } from 'react';
import { Activity, Info, Truck, Wrench, Archive, Zap } from 'lucide-react';
import { BranchName, BaitRecord, RecordStatus } from '../types';

interface KPICardsProps {
  currentBranch: BranchName;
  records: BaitRecord[];
}

export const KPICards: React.FC<KPICardsProps> = ({ currentBranch, records }) => {
  
  const stats = useMemo(() => {
    const branchRecords = records.filter(r => r.branch === currentBranch);
    
    return branchRecords.reduce((acc, record) => {
      switch (record.status) {
        case RecordStatus.ACTIVE: acc.physical++; break;
        case RecordStatus.TRANSIT: acc.withDriver++; break;
        case RecordStatus.MAINTENANCE: acc.defective++; break;
        case RecordStatus.INACTIVE: acc.otherBranch++; break;
      }
      return acc;
    }, { physical: 0, withDriver: 0, defective: 0, otherBranch: 0 });
  }, [currentBranch, records]);

  const Card = ({ title, value, icon: Icon, variant, tooltipText }: { title: string, value: number, icon: any, variant: 'blue'|'emerald'|'red'|'amber', tooltipText: string }) => {
    
    // Design System Tokens for 3D Laminated Effect
    const styles = {
      blue: {
        bg: "from-blue-500 to-blue-600",
        shadow: "shadow-blue-500/30",
        text: "text-blue-600 dark:text-blue-400",
        border: "border-blue-100 dark:border-blue-900/30"
      },
      emerald: {
        bg: "from-emerald-500 to-emerald-600",
        shadow: "shadow-emerald-500/30",
        text: "text-emerald-600 dark:text-emerald-400",
        border: "border-emerald-100 dark:border-emerald-900/30"
      },
      red: {
        bg: "from-red-500 to-red-600",
        shadow: "shadow-red-500/30",
        text: "text-red-600 dark:text-red-400",
        border: "border-red-100 dark:border-red-900/30"
      },
      amber: {
        bg: "from-amber-400 to-amber-500",
        shadow: "shadow-amber-500/30",
        text: "text-amber-600 dark:text-amber-400",
        border: "border-amber-100 dark:border-amber-900/30"
      }
    };

    const s = styles[variant];

    return (
      <div className={`
        relative bg-white dark:bg-slate-900 rounded-xl p-5 
        border border-slate-200 dark:border-slate-800 
        shadow-sm hover:shadow-md transition-all duration-300 group
      `}>
        <div className="flex items-start justify-between">
          <div className="flex items-start gap-4">
            {/* 3D Icon Container */}
            <div className={`
              relative flex items-center justify-center w-14 h-14 rounded-xl 
              bg-gradient-to-br ${s.bg} 
              ${s.shadow} shadow-lg 
              transform transition-transform duration-300 group-hover:scale-105 group-hover:-rotate-3
            `}>
              {/* Laminated Lighting Effects */}
              <div className="absolute inset-0 rounded-xl bg-gradient-to-b from-white/20 to-transparent pointer-events-none"></div>
              <div className="absolute top-0 left-0 right-0 h-[1px] bg-white/40 opacity-70"></div>
              <div className="absolute bottom-0 left-0 right-0 h-[1px] bg-black/10 opacity-50"></div>
              
              <Icon size={26} className="text-white relative z-10 drop-shadow-md stroke-[2.5px]" />
            </div>

            <div className="flex flex-col pt-0.5">
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-0.5">
                {title}
              </span>
              <div className="flex items-baseline gap-1.5">
                <span className="text-2xl font-bold text-slate-900 dark:text-white font-mono tracking-tight">
                  {value}
                </span>
                <span className="text-[10px] text-slate-400 font-medium">unid.</span>
              </div>
            </div>
          </div>

          <div className="group/info relative">
            <Info size={16} className="text-slate-300 dark:text-slate-600 hover:text-slate-500 dark:hover:text-slate-400 cursor-help transition-colors" />
            
            {/* SaaS Style Tooltip */}
            <div className="absolute right-0 top-6 w-48 p-2 bg-slate-800 text-slate-200 text-xs rounded-lg shadow-xl opacity-0 group-hover/info:opacity-100 transition-opacity pointer-events-none z-20 translate-y-2 group-hover/info:translate-y-0 duration-200">
              {tooltipText}
            </div>
          </div>
        </div>

        {/* Micro-interaction Line */}
        <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800/50 flex items-center justify-between">
          <div className={`text-[10px] font-medium flex items-center gap-1.5 ${s.text}`}>
             <div className={`w-1.5 h-1.5 rounded-full bg-current animate-pulse`}></div>
             Monitoramento em tempo real
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-bold text-slate-800 dark:text-white tracking-tight flex items-center gap-2">
            <Activity size={18} className="text-blue-500" />
            Visão Geral da Operação
          </h2>
          <p className="text-xs text-slate-500 mt-1">Indicadores chave de desempenho (KPIs) da unidade atual.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
        <Card 
          title="Ativos Físicos" 
          value={stats.physical} 
          icon={Zap} 
          variant="blue"
          tooltipText="Total de iscas ativas fisicamente no estoque."
        />
        <Card 
          title="Em Rota" 
          value={stats.withDriver} 
          icon={Truck} 
          variant="emerald"
          tooltipText="Iscas atualmente vinculadas a viagens."
        />
        <Card 
          title="Manutenção" 
          value={stats.defective} 
          icon={Wrench} 
          variant="red"
          tooltipText="Dispositivos aguardando reparo ou triagem."
        />
        <Card 
          title="Inativos" 
          value={stats.otherBranch} 
          icon={Archive} 
          variant="amber"
          tooltipText="Dispositivos baixados ou em transferência."
        />
      </div>
    </div>
  );
};
