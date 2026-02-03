import { MOCK_RECORDS, BRANCHES } from '../constants';
import { BaitRecord, BranchName, ChartDataPoint, PeriodFilter } from '../types';

export const isDateInPeriod = (dateStr: string, period: PeriodFilter): boolean => {
  const date = new Date(dateStr);
  const now = new Date();
  
  if (period === PeriodFilter.TODAY) {
    return date.getDate() === now.getDate() && 
           date.getMonth() === now.getMonth() && 
           date.getFullYear() === now.getFullYear();
  }
  
  if (period === PeriodFilter.MONTH) {
    return date.getMonth() === now.getMonth() && 
           date.getFullYear() === now.getFullYear();
  }
  
  if (period === PeriodFilter.YEAR) {
    return date.getFullYear() === now.getFullYear();
  }
  
  return true;
};

export const getAggregatedChartData = (period: PeriodFilter): ChartDataPoint[] => {
  // 1. Group by date (day)
  const groupedByDay: Record<string, any> = {};

  // Initialize dates for the chart based on period (simplified logic for demo)
  // In a real app, we'd fill gaps. Here we iterate records.
  
  MOCK_RECORDS.forEach(record => {
    if (!isDateInPeriod(record.date, period)) return;

    const dateKey = new Date(record.date).toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' });
    
    if (!groupedByDay[dateKey]) {
      groupedByDay[dateKey] = {
        date: dateKey,
        [BranchName.CAMACARI]: 0,
        [BranchName.LIMEIRA]: 0,
        [BranchName.GUARULHOS]: 0,
        [BranchName.POUSO_ALEGRE]: 0,
        [BranchName.SUMARE]: 0,
      };
    }
    
    groupedByDay[dateKey][record.branch] = (groupedByDay[dateKey][record.branch] || 0) + 1;
  });

  // Convert to array and sort
  return Object.values(groupedByDay).sort((a: any, b: any) => {
    const [dayA, monthA] = a.date.split('/');
    const [dayB, monthB] = b.date.split('/');
    return new Date(2025, parseInt(monthA) - 1, parseInt(dayA)).getTime() - 
           new Date(2025, parseInt(monthB) - 1, parseInt(dayB)).getTime();
  });
};

export const getFilteredRecords = (branch: BranchName, period: PeriodFilter, allRecords: BaitRecord[]) => {
  return allRecords.filter(r => r.branch === branch && isDateInPeriod(r.date, period));
};

export const getBranchTotal = (branch: BranchName, allRecords: BaitRecord[], period: PeriodFilter): number => {
  return allRecords.filter(r => r.branch === branch && isDateInPeriod(r.date, period)).length;
};