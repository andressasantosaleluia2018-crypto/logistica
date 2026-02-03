
import { BaitRecord, BranchName, RecordStatus, RiskRecord, RiskType, ProcessStatus } from './types';

export const BRANCHES = [
  BranchName.CAMACARI,
  BranchName.LIMEIRA,
  BranchName.GUARULHOS,
  BranchName.POUSO_ALEGRE,
  BranchName.SUMARE,
];

// Helper to generate random dates
const getRandomDate = (start: Date, end: Date) => {
  return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
};

// Generate Mock Records for Baits
export const MOCK_RECORDS: BaitRecord[] = Array.from({ length: 150 }).map((_, index) => {
  const branch = BRANCHES[Math.floor(Math.random() * BRANCHES.length)];
  const date = getRandomDate(new Date(2025, 0, 1), new Date());
  
  return {
    id: `REC-${1000 + index}`,
    baitId: `ISCA-${5000 + index}`,
    branch: branch,
    driver: `Motorista ${index + 1}`,
    truckPlate: `ABC-${1000 + index}`,
    cpf: `123.456.789-${index % 99}`,
    status: Math.random() > 0.8 ? RecordStatus.MAINTENANCE : RecordStatus.ACTIVE,
    date: date.toISOString(),
    lastUpdate: date.toISOString(),
    history: []
  };
});

// Initial mock stats to be editable
export const INITIAL_KPI_STATS: Record<BranchName, { physical: number; withDriver: number; defective: number; otherBranch: number }> = {
  [BranchName.CAMACARI]: { physical: 120, withDriver: 45, defective: 2, otherBranch: 5 },
  [BranchName.LIMEIRA]: { physical: 98, withDriver: 30, defective: 5, otherBranch: 12 },
  [BranchName.GUARULHOS]: { physical: 210, withDriver: 80, defective: 8, otherBranch: 20 },
  [BranchName.POUSO_ALEGRE]: { physical: 65, withDriver: 15, defective: 1, otherBranch: 3 },
  [BranchName.SUMARE]: { physical: 145, withDriver: 50, defective: 4, otherBranch: 8 },
};

// --- RISK MANAGEMENT MOCKS ---
export const MOCK_RISK_RECORDS: RiskRecord[] = Array.from({ length: 45 }).map((_, index) => {
  const typeKeys = Object.keys(RiskType) as Array<keyof typeof RiskType>;
  const typeKey = typeKeys[Math.floor(Math.random() * typeKeys.length)];
  
  const statusKeys = Object.keys(ProcessStatus) as Array<keyof typeof ProcessStatus>;
  const statusKey = statusKeys[Math.floor(Math.random() * statusKeys.length)];
  
  const date = getRandomDate(new Date(2025, 0, 1), new Date());
  
  // Logic for due dates (some expiring soon for alerts)
  const futureDate = new Date();
  futureDate.setDate(futureDate.getDate() + Math.floor(Math.random() * 10)); // 0 to 10 days ahead

  const isMaintenance = RiskType[typeKey] === RiskType.MANUTENCAO || RiskType[typeKey] === RiskType.CHECKLIST;

  return {
    id: `RISK-${2000 + index}`,
    type: RiskType[typeKey],
    processStatus: ProcessStatus[statusKey],
    date: date.toISOString(),
    driver: `Condutor ${index + 1}`,
    truckPlate: `CAV-${1000 + index}`,
    cpf: `000.111.222-${index % 99}`,
    phone: `(11) 99999-${1000 + index}`,
    notes: 'Observação padrão do sistema.',
    
    // Maintenance fields (only relevant if maintenance, but populated for mock simplicity if needed)
    trailerPlate: isMaintenance ? `CAR-${5000 + index}` : undefined,
    maintenanceDueDate: isMaintenance ? futureDate.toISOString() : undefined,
    checklistDueDate: isMaintenance ? futureDate.toISOString() : undefined,
    location: isMaintenance ? 'Pátio Central' : undefined,

    lastUpdate: date.toISOString(),
    history: [
        {
            changedAt: date.toISOString(),
            changedBy: 'Admin User',
            contact: '(11) 98888-7777',
            description: 'Cadastro Inicial'
        }
    ]
  };
});
