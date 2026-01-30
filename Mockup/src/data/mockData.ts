import type { 
  Employee, 
  Department, 
  Branch, 
  Framework, 
  Cycle, 
  CycleResults,
  DashboardMetrics,
  ActionItem,
  ActiveCycleSummary,
  CompanySettings,
  User,
  Notification,
  PerformanceTrend
} from '@/types';

// Mock User
export const mockUser: User = {
  id: 'user_001',
  name: 'Admin User',
  email: 'admin@company.com',
  role: 'admin',
  avatar: undefined,
};

// Mock Departments
export const mockDepartments: Department[] = [
  { id: 'dept_001', name: 'Sales', description: 'Sales and Business Development', manager: 'John Smith', employeeCount: 24 },
  { id: 'dept_002', name: 'Marketing', description: 'Marketing and Communications', manager: 'Sarah Johnson', employeeCount: 12 },
  { id: 'dept_003', name: 'Engineering', description: 'Software Engineering', manager: 'Michael Chen', employeeCount: 35 },
  { id: 'dept_004', name: 'HR', description: 'Human Resources', manager: 'Emily Davis', employeeCount: 8 },
  { id: 'dept_005', name: 'Finance', description: 'Finance and Accounting', manager: 'Robert Wilson', employeeCount: 10 },
  { id: 'dept_006', name: 'Operations', description: 'Operations and Logistics', manager: 'Lisa Anderson', employeeCount: 18 },
];

// Mock Branches
export const mockBranches: Branch[] = [
  { id: 'branch_001', name: 'Headquarters', location: 'New York, NY', manager: 'James Brown', employeeCount: 65 },
  { id: 'branch_002', name: 'West Coast Office', location: 'San Francisco, CA', manager: 'Maria Garcia', employeeCount: 28 },
  { id: 'branch_003', name: 'Chicago Office', location: 'Chicago, IL', manager: 'David Lee', employeeCount: 14 },
];

// Mock Employees
export const mockEmployees: Employee[] = [
  { id: 'emp_001', name: 'John Smith', email: 'john.smith@company.com', employeeId: 'EMP001', phone: '+1 (555) 123-4567', department: 'dept_001', branch: 'branch_001', jobTitle: 'Sales Manager', status: 'active', createdAt: '2023-01-15T00:00:00Z', updatedAt: '2024-01-20T00:00:00Z' },
  { id: 'emp_002', name: 'Sarah Johnson', email: 'sarah.johnson@company.com', employeeId: 'EMP002', phone: '+1 (555) 234-5678', department: 'dept_002', branch: 'branch_001', jobTitle: 'Marketing Director', status: 'active', createdAt: '2023-02-01T00:00:00Z', updatedAt: '2024-01-18T00:00:00Z' },
  { id: 'emp_003', name: 'Michael Chen', email: 'michael.chen@company.com', employeeId: 'EMP003', phone: '+1 (555) 345-6789', department: 'dept_003', branch: 'branch_001', jobTitle: 'Engineering Lead', status: 'active', createdAt: '2023-01-10T00:00:00Z', updatedAt: '2024-01-22T00:00:00Z' },
  { id: 'emp_004', name: 'Emily Davis', email: 'emily.davis@company.com', employeeId: 'EMP004', phone: '+1 (555) 456-7890', department: 'dept_004', branch: 'branch_001', jobTitle: 'HR Manager', status: 'active', createdAt: '2023-03-01T00:00:00Z', updatedAt: '2024-01-15T00:00:00Z' },
  { id: 'emp_005', name: 'Robert Wilson', email: 'robert.wilson@company.com', employeeId: 'EMP005', phone: '+1 (555) 567-8901', department: 'dept_005', branch: 'branch_001', jobTitle: 'Finance Director', status: 'active', createdAt: '2023-01-20T00:00:00Z', updatedAt: '2024-01-19T00:00:00Z' },
  { id: 'emp_006', name: 'Lisa Anderson', email: 'lisa.anderson@company.com', employeeId: 'EMP006', phone: '+1 (555) 678-9012', department: 'dept_006', branch: 'branch_001', jobTitle: 'Operations Manager', status: 'active', createdAt: '2023-02-15T00:00:00Z', updatedAt: '2024-01-21T00:00:00Z' },
  { id: 'emp_007', name: 'James Brown', email: 'james.brown@company.com', employeeId: 'EMP007', phone: '+1 (555) 789-0123', department: 'dept_001', branch: 'branch_001', jobTitle: 'Senior Sales Rep', manager: 'emp_001', status: 'active', createdAt: '2023-04-01T00:00:00Z', updatedAt: '2024-01-17T00:00:00Z' },
  { id: 'emp_008', name: 'Maria Garcia', email: 'maria.garcia@company.com', employeeId: 'EMP008', phone: '+1 (555) 890-1234', department: 'dept_002', branch: 'branch_002', jobTitle: 'Marketing Specialist', manager: 'emp_002', status: 'active', createdAt: '2023-05-01T00:00:00Z', updatedAt: '2024-01-16T00:00:00Z' },
  { id: 'emp_009', name: 'David Lee', email: 'david.lee@company.com', employeeId: 'EMP009', phone: '+1 (555) 901-2345', department: 'dept_003', branch: 'branch_002', jobTitle: 'Software Engineer', manager: 'emp_003', status: 'active', createdAt: '2023-06-01T00:00:00Z', updatedAt: '2024-01-14T00:00:00Z' },
  { id: 'emp_010', name: 'Jennifer White', email: 'jennifer.white@company.com', employeeId: 'EMP010', phone: '+1 (555) 012-3456', department: 'dept_003', branch: 'branch_001', jobTitle: 'Senior Developer', manager: 'emp_003', status: 'inactive', createdAt: '2023-03-15T00:00:00Z', updatedAt: '2024-01-10T00:00:00Z' },
  { id: 'emp_011', name: 'Thomas Martinez', email: 'thomas.martinez@company.com', employeeId: 'EMP011', phone: '+1 (555) 111-2222', department: 'dept_001', branch: 'branch_003', jobTitle: 'Sales Representative', manager: 'emp_001', status: 'active', createdAt: '2023-07-01T00:00:00Z', updatedAt: '2024-01-23T00:00:00Z' },
  { id: 'emp_012', name: 'Amanda Taylor', email: 'amanda.taylor@company.com', employeeId: 'EMP012', phone: '+1 (555) 222-3333', department: 'dept_004', branch: 'branch_002', jobTitle: 'HR Specialist', manager: 'emp_004', status: 'active', createdAt: '2023-08-01T00:00:00Z', updatedAt: '2024-01-12T00:00:00Z' },
];

// Mock Frameworks
export const mockFrameworks: Framework[] = [
  {
    id: 'fw_001',
    name: 'Sales Performance Framework',
    department: 'dept_001',
    description: 'Comprehensive evaluation framework for sales team performance',
    indicators: [
      { id: 'ind_001', name: 'Calls Made', description: 'Number of outbound calls', type: 'quantitative', unit: 'calls', minValue: 1, maxValue: 500, weight: 1.0, isInput: true },
      { id: 'ind_002', name: 'Conversion Rate', description: 'Percentage of leads converted', type: 'quantitative', unit: '%', minValue: 0.001, maxValue: 1, weight: 1.2, isInput: true },
      { id: 'ind_003', name: 'Revenue Generated', description: 'Total revenue from sales', type: 'quantitative', unit: '$', minValue: 1, maxValue: 1000000, weight: 1.5, isInput: false },
      { id: 'ind_004', name: 'Customer Satisfaction', description: 'Customer satisfaction score', type: 'quantitative', unit: 'score', minValue: 1, maxValue: 10, weight: 1.0, isInput: false },
      { id: 'ind_005', name: 'Response Time', description: 'Average response time to leads', type: 'quantitative', unit: 'hours', minValue: 0.1, maxValue: 48, weight: 0.8, isInput: true },
      { id: 'ind_006', name: 'Deals Closed', description: 'Number of deals closed', type: 'quantitative', unit: 'deals', minValue: 1, maxValue: 100, weight: 1.3, isInput: false },
      { id: 'ind_007', name: 'Retention Rate', description: 'Customer retention percentage', type: 'quantitative', unit: '%', minValue: 0.001, maxValue: 1, weight: 1.0, isInput: false },
    ],
    status: 'active',
    createdAt: '2023-06-01T00:00:00Z',
    updatedAt: '2024-01-15T00:00:00Z',
  },
  {
    id: 'fw_002',
    name: 'Engineering Performance Framework',
    department: 'dept_003',
    description: 'Technical performance evaluation for engineering team',
    indicators: [
      { id: 'ind_008', name: 'Code Commits', description: 'Number of code commits', type: 'quantitative', unit: 'commits', minValue: 1, maxValue: 500, weight: 0.8, isInput: true },
      { id: 'ind_009', name: 'Bug Fix Rate', description: 'Percentage of bugs fixed', type: 'quantitative', unit: '%', minValue: 0.001, maxValue: 1, weight: 1.2, isInput: false },
      { id: 'ind_010', name: 'Feature Delivery', description: 'Features delivered on time', type: 'quantitative', unit: 'features', minValue: 1, maxValue: 50, weight: 1.5, isInput: false },
      { id: 'ind_011', name: 'Code Review Quality', description: 'Quality score from code reviews', type: 'qualitative', unit: 'score', minValue: 1, maxValue: 5, weight: 1.0, isInput: false, scale: [1, 2, 3, 4, 5], scaleLabels: { 1: 'Poor', 2: 'Below Average', 3: 'Average', 4: 'Good', 5: 'Excellent' } },
      { id: 'ind_012', name: 'Technical Documentation', description: 'Documentation completeness', type: 'qualitative', unit: 'score', minValue: 1, maxValue: 5, weight: 0.7, isInput: true, scale: [1, 2, 3, 4, 5], scaleLabels: { 1: 'Poor', 2: 'Below Average', 3: 'Average', 4: 'Good', 5: 'Excellent' } },
    ],
    status: 'active',
    createdAt: '2023-07-01T00:00:00Z',
    updatedAt: '2024-01-10T00:00:00Z',
  },
  {
    id: 'fw_003',
    name: 'Marketing Performance Framework',
    department: 'dept_002',
    description: 'Marketing campaign and brand performance evaluation',
    indicators: [
      { id: 'ind_013', name: 'Campaign Reach', description: 'Total campaign reach', type: 'quantitative', unit: 'people', minValue: 1, maxValue: 1000000, weight: 1.0, isInput: true },
      { id: 'ind_014', name: 'Conversion Rate', description: 'Campaign conversion rate', type: 'quantitative', unit: '%', minValue: 0.001, maxValue: 1, weight: 1.5, isInput: false },
      { id: 'ind_015', name: 'Brand Awareness', description: 'Brand awareness score', type: 'qualitative', unit: 'score', minValue: 1, maxValue: 10, weight: 1.0, isInput: false, scale: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10] },
      { id: 'ind_016', name: 'Content Quality', description: 'Content quality rating', type: 'qualitative', unit: 'score', minValue: 1, maxValue: 5, weight: 0.8, isInput: true, scale: [1, 2, 3, 4, 5], scaleLabels: { 1: 'Poor', 2: 'Below Average', 3: 'Average', 4: 'Good', 5: 'Excellent' } },
    ],
    status: 'active',
    createdAt: '2023-08-01T00:00:00Z',
    updatedAt: '2024-01-05T00:00:00Z',
  },
];

// Mock Cycles
export const mockCycles: Cycle[] = [
  {
    id: 'cycle_001',
    name: 'Q1 2024 Performance Review',
    description: 'First quarter performance evaluation cycle',
    type: 'quarterly',
    status: 'active',
    startDate: '2024-01-01',
    endDate: '2024-03-31',
    evaluationDeadline: '2024-03-15',
    frameworkId: 'fw_001',
    frameworkName: 'Sales Performance Framework',
    participantIds: ['emp_001', 'emp_007', 'emp_011'],
    participantCount: 3,
    evaluatedCount: 2,
    evaluationMode: 'self-manager',
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-20T00:00:00Z',
  },
  {
    id: 'cycle_002',
    name: 'Annual 2023 Review',
    description: 'Full year performance evaluation for 2023',
    type: 'annual',
    status: 'completed',
    startDate: '2023-12-01',
    endDate: '2023-12-31',
    evaluationDeadline: '2023-12-20',
    frameworkId: 'fw_001',
    frameworkName: 'Sales Performance Framework',
    participantIds: ['emp_001', 'emp_007', 'emp_011'],
    participantCount: 3,
    evaluatedCount: 3,
    evaluationMode: 'self-manager',
    createdAt: '2023-12-01T00:00:00Z',
    updatedAt: '2024-01-05T00:00:00Z',
  },
  {
    id: 'cycle_003',
    name: 'Engineering Q4 2023',
    description: 'Q4 engineering team evaluation',
    type: 'quarterly',
    status: 'closed',
    startDate: '2023-10-01',
    endDate: '2023-12-31',
    evaluationDeadline: '2023-12-15',
    frameworkId: 'fw_002',
    frameworkName: 'Engineering Performance Framework',
    participantIds: ['emp_003', 'emp_009', 'emp_010'],
    participantCount: 3,
    evaluatedCount: 3,
    evaluationMode: 'self-manager',
    createdAt: '2023-10-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
  },
  {
    id: 'cycle_004',
    name: 'Marketing Campaign Review',
    description: 'Post-campaign performance evaluation',
    type: 'ad-hoc',
    status: 'draft',
    startDate: '2024-02-01',
    endDate: '2024-02-28',
    frameworkId: 'fw_003',
    frameworkName: 'Marketing Performance Framework',
    participantIds: ['emp_002', 'emp_008'],
    participantCount: 2,
    evaluatedCount: 0,
    evaluationMode: 'self-only',
    createdAt: '2024-01-25T00:00:00Z',
    updatedAt: '2024-01-25T00:00:00Z',
  },
];

// Mock Dashboard Metrics
export const mockDashboardMetrics: DashboardMetrics = {
  totalEmployees: 107,
  activeEmployees: 98,
  inactiveEmployees: 9,
  activeCycles: 1,
  completedEvaluations: 2,
  pendingEvaluations: 1,
  totalFrameworks: 3,
  totalIndicators: 16,
};

// Mock Action Items
export const mockActionItems: ActionItem[] = [
  {
    id: 'action_001',
    type: 'cycle',
    title: 'Complete Q1 2024 Evaluations',
    description: '1 evaluation pending for John Smith',
    priority: 'high',
    dueDate: '2024-03-15',
    link: '/cycles/cycle_001',
  },
  {
    id: 'action_002',
    type: 'evaluation',
    title: 'Review Marketing Campaign Results',
    description: 'Campaign review cycle ready to launch',
    priority: 'medium',
    dueDate: '2024-02-28',
    link: '/cycles/cycle_004',
  },
  {
    id: 'action_003',
    type: 'configuration',
    title: 'Update Engineering Framework',
    description: 'Add new security indicators',
    priority: 'low',
    link: '/dimensions/fw_002',
  },
];

// Mock Active Cycle Summary
export const mockActiveCycleSummary: ActiveCycleSummary = {
  id: 'cycle_001',
  name: 'Q1 2024 Performance Review',
  progress: 67,
  startDate: '2024-01-01',
  endDate: '2024-03-31',
  participantCount: 3,
  completedCount: 2,
  status: 'active',
};

// Mock Performance Trends
export const mockPerformanceTrends: PerformanceTrend[] = [
  { cycle: 'Q1 2023', average: 7.2, top: 9.1, bottom: 5.8 },
  { cycle: 'Q2 2023', average: 7.5, top: 9.3, bottom: 6.1 },
  { cycle: 'Q3 2023', average: 7.3, top: 9.0, bottom: 5.9 },
  { cycle: 'Q4 2023', average: 7.8, top: 9.5, bottom: 6.3 },
  { cycle: 'Q1 2024', average: 8.1, top: 9.7, bottom: 6.5 },
];

// Mock Company Settings
export const mockCompanySettings: CompanySettings = {
  name: 'Acme Corporation',
  email: 'hr@acmecorp.com',
  address: '123 Business Ave, New York, NY 10001',
  phone: '+1 (555) 000-0000',
  industry: 'Technology',
  size: '100-500 employees',
};

// Mock Notifications
export const mockNotifications: Notification[] = [
  {
    id: 'notif_001',
    title: 'Evaluation Due Soon',
    message: 'Q1 2024 evaluation deadline is approaching (March 15)',
    type: 'warning',
    read: false,
    createdAt: '2024-03-10T10:00:00Z',
  },
  {
    id: 'notif_002',
    title: 'Cycle Completed',
    message: 'Annual 2023 Review has been completed',
    type: 'success',
    read: true,
    createdAt: '2024-01-05T14:30:00Z',
  },
  {
    id: 'notif_003',
    title: 'New Employee Added',
    message: 'Thomas Martinez has been added to the Sales team',
    type: 'info',
    read: false,
    createdAt: '2024-01-23T09:15:00Z',
  },
];

// Mock Cycle Results
export const mockCycleResults: CycleResults = {
  cycleId: 'cycle_002',
  computationTimeMs: 1843,
  efficiencyScores: {
    'emp_001': { employeeId: 'emp_001', employeeName: 'John Smith', selfEvaluation: 0.87, crossEfficiency: 0.82, percentile: 0.68 },
    'emp_007': { employeeId: 'emp_007', employeeName: 'James Brown', selfEvaluation: 0.92, crossEfficiency: 0.89, percentile: 0.85 },
    'emp_011': { employeeId: 'emp_011', employeeName: 'Thomas Martinez', selfEvaluation: 0.75, crossEfficiency: 0.71, percentile: 0.42 },
  },
  shapleyValues: {
    'ind_001': 0.35,
    'ind_002': 0.42,
    'ind_003': 0.28,
    'ind_004': 0.31,
    'ind_005': 0.22,
    'ind_006': 0.38,
    'ind_007': 0.29,
  },
  interactionWeights: {
    'ind_001_x_ind_002': 0.18,
    'ind_003_x_ind_006': 0.12,
    'ind_004_x_ind_007': -0.08,
  },
  tercileThresholds: {
    efficiency: [6.21, 7.44],
    effectiveness: [0.52, 0.78],
  },
  nineBoxMatrix: {
    'high_high': { position: 'high_high', count: 1, profile: 'Star', employees: ['emp_007'] },
    'high_med': { position: 'high_med', count: 0, profile: 'High Potential', employees: [] },
    'high_low': { position: 'high_low', count: 0, profile: 'Enigma', employees: [] },
    'med_high': { position: 'med_high', count: 1, profile: 'Strong Performer', employees: ['emp_001'] },
    'med_med': { position: 'med_med', count: 0, profile: 'Core Player', employees: [] },
    'med_low': { position: 'med_low', count: 0, profile: 'Inconsistent', employees: [] },
    'low_high': { position: 'low_high', count: 0, profile: 'Workhorse', employees: [] },
    'low_med': { position: 'low_med', count: 0, profile: 'Underperformer', employees: [] },
    'low_low': { position: 'low_low', count: 1, profile: 'Critical Bottleneck', employees: ['emp_011'] },
  },
  populationStats: {
    totalDmus: 3,
    meanEfficiency: 7.14,
    stdEfficiency: 0.89,
  },
};

// Helper functions
export const getDepartmentById = (id: string): Department | undefined => {
  return mockDepartments.find(d => d.id === id);
};

export const getBranchById = (id: string): Branch | undefined => {
  return mockBranches.find(b => b.id === id);
};

export const getEmployeeById = (id: string): Employee | undefined => {
  return mockEmployees.find(e => e.id === id);
};

export const getFrameworkById = (id: string): Framework | undefined => {
  return mockFrameworks.find(f => f.id === id);
};

export const getCycleById = (id: string): Cycle | undefined => {
  return mockCycles.find(c => c.id === id);
};

export const getDepartmentName = (id: string): string => {
  const dept = getDepartmentById(id);
  return dept?.name || id;
};

export const getBranchName = (id: string): string => {
  const branch = getBranchById(id);
  return branch?.name || id;
};

export const getEmployeeName = (id: string): string => {
  const emp = getEmployeeById(id);
  return emp?.name || id;
};
