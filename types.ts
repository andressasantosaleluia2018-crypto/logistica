
export enum BranchName {
  CAMACARI = 'Camaçari',
  LIMEIRA = 'Limeira',
  GUARULHOS = 'Guarulhos',
  POUSO_ALEGRE = 'Pouso Alegre',
  SUMARE = 'Sumaré',
}

export enum PeriodFilter {
  TODAY = 'Hoje',
  MONTH = 'Este Mês',
  YEAR = 'Este Ano',
}

export enum RecordStatus {
  ACTIVE = 'Ativo',
  INACTIVE = 'Inativo',
  MAINTENANCE = 'Manutenção',
  TRANSIT = 'Em Trânsito'
}

export interface BaitRecord {
  id: string;
  baitId: string; // "Isca"
  branch: BranchName;
  driver: string;
  truckPlate: string; // "Cavalo"
  cpf: string;
  status: RecordStatus;
  date: string; // ISO Date string
  lastUpdate: string; // ISO Date string
  history: Array<{
    field: string;
    oldValue: string;
    newValue: string;
    changedAt: string;
    changedBy: string;
  }>;
}

export interface KPIData {
  physical: number;
  withDriver: number;
  defective: number;
  otherBranch: number;
  lastUpdated: string;
}

// For the Chart
export interface ChartDataPoint {
  date: string;
  [BranchName.CAMACARI]: number;
  [BranchName.LIMEIRA]: number;
  [BranchName.GUARULHOS]: number;
  [BranchName.POUSO_ALEGRE]: number;
  [BranchName.SUMARE]: number;
}

// --- RISK MANAGEMENT TYPES ---

export enum RiskType {
  PPA = 'PPA – Programa de Prevenção de Acidentes',
  HOMOLOGACAO = 'Homologação de Posto',
  ESPELHAMENTO = 'Solicitação de espelhamento',
  MANUTENCAO = 'Manutenção de carreta',
  CHECKLIST = 'Checklist de carreta',
  AE_ESCOLTA = 'AE escolta',
}

export enum ProcessStatus {
  PENDENTE = 'Pendente',
  CONCLUIDO = 'Concluído',
}

export interface RiskHistory {
  changedAt: string;
  changedBy: string; // Name
  contact: string; // WhatsApp
  description: string;
}

export interface RiskRecord {
  id: string;
  type: RiskType;
  processStatus: ProcessStatus;
  date: string; // Data de Criação/Referência
  
  // Standard Fields
  driver: string;
  truckPlate: string; // Cavalo
  cpf: string;
  phone?: string; // Opcional - Contato
  notes?: string; // Observação (Opcional)

  // Maintenance Specific (Optional for generic types)
  trailerPlate?: string; // Placa Carreta
  maintenanceDueDate?: string; // Vencimento Manutenção
  checklistDueDate?: string; // Vencimento Checklist
  location?: string; // Local

  lastUpdate: string;
  history: RiskHistory[];
}
