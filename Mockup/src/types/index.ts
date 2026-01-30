// Employee Types
export interface Employee {
  id: string;
  name: string;
  email: string;
  employeeId: string;
  phone?: string;
  department: string;
  branch: string;
  jobTitle: string;
  manager?: string;
  salary?: number;
  status: 'active' | 'inactive' | 'terminated';
  createdAt: string;
  updatedAt: string;
}

export interface EmployeeFormData {
  name: string;
  email: string;
  employeeId: string;
  phone?: string;
  department: string;
  branch: string;
  jobTitle: string;
  manager?: string;
  salary?: number;
  status: 'active' | 'inactive' | 'terminated';
}

// Department Types
export interface Department {
  id: string;
  name: string;
  description?: string;
  manager?: string;
  employeeCount: number;
}

// Branch Types
export interface Branch {
  id: string;
  name: string;
  location?: string;
  manager?: string;
  employeeCount: number;
}

// Framework / Dimension Types
export interface Indicator {
  id: string;
  name: string;
  description?: string;
  type: 'quantitative' | 'qualitative';
  unit?: string;
  minValue?: number;
  maxValue?: number;
  weight: number;
  isInput: boolean;
  scale?: number[];
  scaleLabels?: Record<number, string>;
}

export interface Framework {
  id: string;
  name: string;
  department: string;
  description?: string;
  indicators: Indicator[];
  status: 'active' | 'inactive';
  createdAt: string;
  updatedAt: string;
}

// Cycle Types
export type CycleStatus = 'draft' | 'active' | 'completed' | 'closed' | 'archived';
export type CycleType = 'annual' | 'bi-annual' | 'quarterly' | 'monthly' | 'ad-hoc';
export type EvaluationMode = 'self-manager' | 'self-only' | '360-degree';

export interface Cycle {
  id: string;
  name: string;
  description?: string;
  type: CycleType;
  status: CycleStatus;
  startDate: string;
  endDate: string;
  evaluationDeadline?: string;
  frameworkId: string;
  frameworkName?: string;
  participantIds: string[];
  participantCount: number;
  evaluatedCount: number;
  evaluationMode: EvaluationMode;
  previousCycleId?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CycleFormData {
  name: string;
  description?: string;
  type: CycleType;
  startDate: string;
  endDate: string;
  evaluationDeadline?: string;
  frameworkId: string;
  participantIds: string[];
  evaluationMode: EvaluationMode;
  previousCycleId?: string;
}

// Evaluation Types
export interface EvaluationScore {
  indicatorId: string;
  indicatorName?: string;
  value: number;
  comment?: string;
}

export interface Evaluation {
  id: string;
  cycleId: string;
  employeeId: string;
  employeeName?: string;
  evaluatorId: string;
  status: 'pending' | 'in-progress' | 'completed';
  scores: EvaluationScore[];
  overallScore?: number;
  comments?: string;
  createdAt: string;
  submittedAt?: string;
}

// Results / DEA Analysis Types
export interface EfficiencyScore {
  employeeId: string;
  employeeName?: string;
  selfEvaluation: number;
  crossEfficiency: number;
  percentile: number;
}

export interface ShapleyValue {
  indicatorId: string;
  indicatorName?: string;
  value: number;
}

export interface InteractionWeight {
  indicatorPair: string;
  value: number;
}

export interface NineBoxCell {
  position: string;
  count: number;
  profile: string;
  employees: string[];
}

export interface CycleResults {
  cycleId: string;
  computationTimeMs: number;
  efficiencyScores: Record<string, EfficiencyScore>;
  shapleyValues: Record<string, number>;
  interactionWeights: Record<string, number>;
  tercileThresholds: {
    efficiency: [number, number];
    effectiveness: [number, number];
  };
  nineBoxMatrix: Record<string, NineBoxCell>;
  populationStats: {
    totalDmus: number;
    meanEfficiency: number;
    stdEfficiency: number;
  };
}

// Company Settings Types
export interface CompanySettings {
  name: string;
  logo?: string;
  email: string;
  address?: string;
  phone?: string;
  industry?: string;
  size?: string;
}

// Dashboard Types
export interface DashboardMetrics {
  totalEmployees: number;
  activeEmployees: number;
  inactiveEmployees: number;
  activeCycles: number;
  completedEvaluations: number;
  pendingEvaluations: number;
  totalFrameworks: number;
  totalIndicators: number;
}

export interface ActionItem {
  id: string;
  type: 'cycle' | 'evaluation' | 'configuration';
  title: string;
  description: string;
  priority: 'high' | 'medium' | 'low';
  dueDate?: string;
  link?: string;
}

export interface ActiveCycleSummary {
  id: string;
  name: string;
  progress: number;
  startDate: string;
  endDate: string;
  participantCount: number;
  completedCount: number;
  status: CycleStatus;
}

// Chart Data Types
export interface ChartDataPoint {
  name: string;
  value: number;
  [key: string]: string | number;
}

export interface PerformanceTrend {
  cycle: string;
  average: number;
  top: number;
  bottom: number;
}

// Filter Types
export interface EmployeeFilters {
  status?: 'all' | 'active' | 'inactive' | 'terminated';
  department?: string;
  branch?: string;
  manager?: string;
  search?: string;
}

export interface CycleFilters {
  status?: CycleStatus | 'all';
  dateRange?: [Date, Date];
  search?: string;
}

// Notification Types
export interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
  read: boolean;
  createdAt: string;
}

// User Types
export interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'manager' | 'employee';
  avatar?: string;
  department?: string;
}
