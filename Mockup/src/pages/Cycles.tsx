import { useState, useMemo } from 'react';
import { 
  Plus, 
  Search, 
  MoreHorizontal, 
  Edit2, 
  Trash2, 
  Play,
  CheckCircle,
  XCircle,
  Archive,
  X,
  Check,
  Calendar,
  Users,
  Layers,
  ArrowRight,
  RotateCcw
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { 
  mockCycles, 
  mockFrameworks,
  mockEmployees,
  getFrameworkById
} from '@/data/mockData';
import type { Cycle, CycleFormData, CycleStatus, CycleType, EvaluationMode } from '@/types';

// Status Badge Component
function StatusBadge({ status }: { status: CycleStatus }) {
  const styles: Record<CycleStatus, string> = {
    draft: 'bg-slate/10 text-slate border-slate/20',
    active: 'bg-teal/10 text-teal border-teal/20',
    completed: 'bg-blue-500/10 text-blue-500 border-blue-500/20',
    closed: 'bg-gray-500/10 text-gray-500 border-gray-500/20',
    archived: 'bg-orange/10 text-orange border-orange/20',
  };

  return (
    <span className={cn("px-2 py-0.5 text-xs font-medium rounded border", styles[status])}>
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </span>
  );
}

// Create Cycle Wizard
interface WizardProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: CycleFormData) => void;
}

function CreateCycleWizard({ isOpen, onClose, onSave }: WizardProps) {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState<CycleFormData>({
    name: '',
    description: '',
    type: 'quarterly',
    startDate: '',
    endDate: '',
    evaluationDeadline: '',
    frameworkId: '',
    participantIds: [],
    evaluationMode: 'self-manager',
  });

  if (!isOpen) return null;

  const steps = [
    { number: 1, title: 'Basic Info' },
    { number: 2, title: 'Framework' },
    { number: 3, title: 'Participants' },
    { number: 4, title: 'Review' },
  ];

  const handleNext = () => {
    if (step < 4) setStep(step + 1);
  };

  const handleBack = () => {
    if (step > 1) setStep(step - 1);
  };

  const handleSubmit = () => {
    onSave(formData);
    onClose();
    setStep(1);
    setFormData({
      name: '',
      description: '',
      type: 'quarterly',
      startDate: '',
      endDate: '',
      evaluationDeadline: '',
      frameworkId: '',
      participantIds: [],
      evaluationMode: 'self-manager',
    });
  };

  const canProceed = () => {
    switch (step) {
      case 1:
        return formData.name && formData.startDate && formData.endDate;
      case 2:
        return formData.frameworkId;
      case 3:
        return formData.participantIds.length > 0;
      default:
        return true;
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-3xl max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#e5e5e5]">
          <div>
            <h2 className="text-lg font-semibold text-charcoal">Create Evaluation Cycle</h2>
            <p className="text-sm text-slate">Step {step} of 4: {steps[step - 1].title}</p>
          </div>
          <button onClick={onClose} className="p-1 text-slate hover:text-charcoal">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Step Indicator */}
        <div className="flex items-center justify-center gap-2 px-6 py-4 bg-gray-50 border-b border-[#e5e5e5]">
          {steps.map((s, index) => (
            <div key={s.number} className="flex items-center">
              <div className={cn(
                "w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-colors",
                step === s.number ? "bg-charcoal text-white" :
                step > s.number ? "bg-teal text-white" :
                "bg-gray-200 text-slate"
              )}>
                {step > s.number ? <Check className="w-4 h-4" /> : s.number}
              </div>
              <span className={cn(
                "ml-2 text-sm hidden sm:block",
                step === s.number ? "text-charcoal font-medium" :
                step > s.number ? "text-teal" :
                "text-slate"
              )}>
                {s.title}
              </span>
              {index < steps.length - 1 && (
                <div className={cn(
                  "w-8 h-0.5 mx-2",
                  step > s.number ? "bg-teal" : "bg-gray-200"
                )} />
              )}
            </div>
          ))}
        </div>

        {/* Form Content */}
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-240px)]">
          {/* Step 1: Basic Information */}
          {step === 1 && (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-charcoal mb-1">
                  Cycle Name <span className="text-red">*</span>
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-3 py-2 border border-[#e5e5e5] rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-charcoal/10"
                  placeholder="e.g., Q1 2024 Performance Review"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-charcoal mb-1">
                  Description
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-3 py-2 border border-[#e5e5e5] rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-charcoal/10"
                  rows={3}
                  placeholder="Enter cycle description..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-charcoal mb-1">
                  Cycle Type
                </label>
                <select
                  value={formData.type}
                  onChange={(e) => setFormData({ ...formData, type: e.target.value as CycleType })}
                  className="w-full px-3 py-2 border border-[#e5e5e5] rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-charcoal/10"
                >
                  <option value="annual">Annual</option>
                  <option value="bi-annual">Bi-annual</option>
                  <option value="quarterly">Quarterly</option>
                  <option value="monthly">Monthly</option>
                  <option value="ad-hoc">Ad-hoc</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-charcoal mb-1">
                    Start Date <span className="text-red">*</span>
                  </label>
                  <input
                    type="date"
                    value={formData.startDate}
                    onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                    className="w-full px-3 py-2 border border-[#e5e5e5] rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-charcoal/10"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-charcoal mb-1">
                    End Date <span className="text-red">*</span>
                  </label>
                  <input
                    type="date"
                    value={formData.endDate}
                    onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                    className="w-full px-3 py-2 border border-[#e5e5e5] rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-charcoal/10"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-charcoal mb-1">
                  Evaluation Deadline
                </label>
                <input
                  type="date"
                  value={formData.evaluationDeadline}
                  onChange={(e) => setFormData({ ...formData, evaluationDeadline: e.target.value })}
                  className="w-full px-3 py-2 border border-[#e5e5e5] rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-charcoal/10"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-charcoal mb-1">
                  Evaluation Mode
                </label>
                <select
                  value={formData.evaluationMode}
                  onChange={(e) => setFormData({ ...formData, evaluationMode: e.target.value as EvaluationMode })}
                  className="w-full px-3 py-2 border border-[#e5e5e5] rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-charcoal/10"
                >
                  <option value="self-manager">Self + Manager</option>
                  <option value="self-only">Self Only</option>
                  <option value="360-degree">360-degree</option>
                </select>
              </div>
            </div>
          )}

          {/* Step 2: Framework Selection */}
          {step === 2 && (
            <div className="space-y-4">
              <p className="text-sm text-slate">Select the evaluation framework for this cycle</p>
              
              <div className="space-y-3">
                {mockFrameworks.map((framework) => (
                  <div
                    key={framework.id}
                    onClick={() => setFormData({ ...formData, frameworkId: framework.id })}
                    className={cn(
                      "p-4 border rounded-lg cursor-pointer transition-colors",
                      formData.frameworkId === framework.id
                        ? "border-teal bg-teal/5"
                        : "border-[#e5e5e5] hover:border-charcoal/30"
                    )}
                  >
                    <div className="flex items-start gap-3">
                      <div className={cn(
                        "w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 mt-0.5",
                        formData.frameworkId === framework.id
                          ? "border-teal bg-teal"
                          : "border-gray-300"
                      )}>
                        {formData.frameworkId === framework.id && <Check className="w-3 h-3 text-white" />}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <h4 className="font-medium text-charcoal">{framework.name}</h4>
                          <span className="px-2 py-0.5 bg-gray-100 text-slate text-xs rounded">
                            {framework.indicators.length} indicators
                          </span>
                        </div>
                        <p className="text-sm text-slate mt-1">{framework.description}</p>
                        <div className="flex flex-wrap gap-2 mt-2">
                          {framework.indicators.slice(0, 4).map((ind) => (
                            <span key={ind.id} className="px-2 py-0.5 bg-gray-50 text-slate text-xs rounded border border-[#e5e5e5]">
                              {ind.name}
                            </span>
                          ))}
                          {framework.indicators.length > 4 && (
                            <span className="px-2 py-0.5 text-slate text-xs">
                              +{framework.indicators.length - 4} more
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Step 3: Participants */}
          {step === 3 && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <p className="text-sm text-slate">Select employees to evaluate in this cycle</p>
                <span className="text-sm font-medium text-charcoal">
                  {formData.participantIds.length} selected
                </span>
              </div>

              {/* Select All */}
              <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                <input
                  type="checkbox"
                  checked={formData.participantIds.length === mockEmployees.length}
                  onChange={(e) => {
                    if (e.target.checked) {
                      setFormData({ ...formData, participantIds: mockEmployees.map(e => e.id) });
                    } else {
                      setFormData({ ...formData, participantIds: [] });
                    }
                  }}
                  className="w-4 h-4 rounded border-gray-300"
                />
                <span className="text-sm font-medium text-charcoal">Select All Employees</span>
              </div>

              {/* Employee List */}
              <div className="border border-[#e5e5e5] rounded-lg overflow-hidden max-h-80 overflow-y-auto">
                {mockEmployees.map((employee) => (
                  <div
                    key={employee.id}
                    className="flex items-center gap-3 p-3 border-b border-[#e5e5e5] last:border-b-0 hover:bg-gray-50"
                  >
                    <input
                      type="checkbox"
                      checked={formData.participantIds.includes(employee.id)}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setFormData({ ...formData, participantIds: [...formData.participantIds, employee.id] });
                        } else {
                          setFormData({ ...formData, participantIds: formData.participantIds.filter(id => id !== employee.id) });
                        }
                      }}
                      className="w-4 h-4 rounded border-gray-300"
                    />
                    <div className="w-8 h-8 bg-charcoal/10 rounded-full flex items-center justify-center">
                      <Users className="w-4 h-4 text-charcoal" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-charcoal">{employee.name}</p>
                      <p className="text-xs text-slate">{employee.jobTitle}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Step 4: Review */}
          {step === 4 && (
            <div className="space-y-4">
              <p className="text-sm text-slate">Review your cycle configuration before creating</p>
              
              <div className="bg-gray-50 rounded-lg p-4 space-y-3">
                <div className="flex justify-between">
                  <span className="text-sm text-slate">Cycle Name</span>
                  <span className="text-sm font-medium text-charcoal">{formData.name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-slate">Type</span>
                  <span className="text-sm font-medium text-charcoal capitalize">{formData.type}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-slate">Date Range</span>
                  <span className="text-sm font-medium text-charcoal">
                    {formData.startDate} to {formData.endDate}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-slate">Framework</span>
                  <span className="text-sm font-medium text-charcoal">
                    {getFrameworkById(formData.frameworkId)?.name}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-slate">Participants</span>
                  <span className="text-sm font-medium text-charcoal">
                    {formData.participantIds.length} employees
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-slate">Evaluation Mode</span>
                  <span className="text-sm font-medium text-charcoal capitalize">
                    {formData.evaluationMode.replace('-', ' ')}
                  </span>
                </div>
              </div>

              <div className="flex items-start gap-2 p-3 bg-yellow-accent/20 rounded-lg">
                <Check className="w-4 h-4 text-charcoal mt-0.5" />
                <p className="text-sm text-charcoal">
                  This cycle will be created in <strong>Draft</strong> status. You can activate it when ready.
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between px-6 py-4 border-t border-[#e5e5e5] bg-gray-50">
          <button
            onClick={handleBack}
            disabled={step === 1}
            className="px-4 py-2 text-sm text-slate hover:text-charcoal disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            Back
          </button>
          
          {step < 4 ? (
            <button
              onClick={handleNext}
              disabled={!canProceed()}
              className="flex items-center gap-2 px-4 py-2 bg-charcoal hover:bg-charcoal/90 text-white text-sm font-medium rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Next
              <ArrowRight className="w-4 h-4" />
            </button>
          ) : (
            <button
              onClick={handleSubmit}
              className="flex items-center gap-2 px-4 py-2 bg-yellow-accent hover:bg-yellow-accent/80 text-charcoal text-sm font-medium rounded-md transition-colors"
            >
              <Check className="w-4 h-4" />
              Create Cycle
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

// Main Cycles Component
export function Cycles() {
  const [cycles, setCycles] = useState<Cycle[]>(mockCycles);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<CycleStatus | 'all'>('all');
  const [isWizardOpen, setIsWizardOpen] = useState(false);

  // Filter cycles
  const filteredCycles = useMemo(() => {
    return cycles.filter((cycle) => {
      const matchesSearch = 
        cycle.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        cycle.frameworkName?.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesStatus = statusFilter === 'all' || cycle.status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [cycles, searchQuery, statusFilter]);

  const handleCreateCycle = (data: CycleFormData) => {
    const newCycle: Cycle = {
      ...data,
      id: `cycle_${Date.now()}`,
      status: 'draft',
      participantCount: data.participantIds.length,
      evaluatedCount: 0,
      frameworkName: getFrameworkById(data.frameworkId)?.name,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    setCycles([newCycle, ...cycles]);
  };

  const handleStatusChange = (cycleId: string, newStatus: CycleStatus) => {
    setCycles(cycles.map(c => 
      c.id === cycleId ? { ...c, status: newStatus, updatedAt: new Date().toISOString() } : c
    ));
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-charcoal">Evaluation Cycles</h1>
          <p className="text-sm text-slate mt-1">Manage performance evaluation cycles</p>
        </div>
        <button 
          onClick={() => setIsWizardOpen(true)}
          className="flex items-center gap-2 px-4 py-2 bg-yellow-accent hover:bg-yellow-accent/80 text-charcoal text-sm font-medium rounded-md transition-colors"
        >
          <Plus className="w-4 h-4" />
          Create Cycle
        </button>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-3 bg-white p-4 rounded-lg border border-[#e5e5e5]">
        {/* Search */}
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate" />
          <input
            type="text"
            placeholder="Search cycles..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-[#e5e5e5] rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-charcoal/10"
          />
        </div>

        {/* Status Filter */}
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value as CycleStatus | 'all')}
          className="px-3 py-2 border border-[#e5e5e5] rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-charcoal/10"
        >
          <option value="all">All Status</option>
          <option value="draft">Draft</option>
          <option value="active">Active</option>
          <option value="completed">Completed</option>
          <option value="closed">Closed</option>
          <option value="archived">Archived</option>
        </select>

        {/* Results count */}
        <span className="text-sm text-slate ml-auto">
          {filteredCycles.length} cycles
        </span>
      </div>

      {/* Cycles Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredCycles.map((cycle) => {
          const progress = cycle.participantCount > 0 
            ? (cycle.evaluatedCount / cycle.participantCount) * 100 
            : 0;

          return (
            <div key={cycle.id} className="bg-white rounded-lg border border-[#e5e5e5] p-5 shadow-card hover:shadow-card-hover transition-shadow">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <StatusBadge status={cycle.status} />
                  <h3 className="text-lg font-semibold text-charcoal mt-2">{cycle.name}</h3>
                </div>
                <div className="relative group">
                  <button className="p-1.5 text-slate hover:text-charcoal hover:bg-gray-100 rounded transition-colors">
                    <MoreHorizontal className="w-4 h-4" />
                  </button>
                  {/* Dropdown */}
                  <div className="absolute right-0 top-full mt-1 w-40 bg-white rounded-lg shadow-card border border-[#e5e5e5] opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-10">
                    {cycle.status === 'draft' && (
                      <button 
                        onClick={() => handleStatusChange(cycle.id, 'active')}
                        className="w-full flex items-center gap-2 px-3 py-2 text-sm text-charcoal hover:bg-gray-50"
                      >
                        <Play className="w-4 h-4" />
                        Activate
                      </button>
                    )}
                    {cycle.status === 'active' && (
                      <button 
                        onClick={() => handleStatusChange(cycle.id, 'completed')}
                        className="w-full flex items-center gap-2 px-3 py-2 text-sm text-charcoal hover:bg-gray-50"
                      >
                        <CheckCircle className="w-4 h-4" />
                        Complete
                      </button>
                    )}
                    {cycle.status === 'completed' && (
                      <>
                        <button 
                          onClick={() => handleStatusChange(cycle.id, 'closed')}
                          className="w-full flex items-center gap-2 px-3 py-2 text-sm text-charcoal hover:bg-gray-50"
                        >
                          <XCircle className="w-4 h-4" />
                          Close
                        </button>
                        <button 
                          onClick={() => handleStatusChange(cycle.id, 'archived')}
                          className="w-full flex items-center gap-2 px-3 py-2 text-sm text-charcoal hover:bg-gray-50"
                        >
                          <Archive className="w-4 h-4" />
                          Archive
                        </button>
                      </>
                    )}
                    <button className="w-full flex items-center gap-2 px-3 py-2 text-sm text-charcoal hover:bg-gray-50">
                      <Edit2 className="w-4 h-4" />
                      Edit
                    </button>
                    <button className="w-full flex items-center gap-2 px-3 py-2 text-sm text-red hover:bg-red/5">
                      <Trash2 className="w-4 h-4" />
                      Delete
                    </button>
                  </div>
                </div>
              </div>

              <p className="text-sm text-slate mb-4 line-clamp-2">{cycle.description}</p>

              <div className="space-y-3">
                <div className="flex items-center gap-2 text-sm">
                  <Layers className="w-4 h-4 text-slate" />
                  <span className="text-charcoal">{cycle.frameworkName}</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Calendar className="w-4 h-4 text-slate" />
                  <span className="text-charcoal">
                    {new Date(cycle.startDate).toLocaleDateString()} - {new Date(cycle.endDate).toLocaleDateString()}
                  </span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Users className="w-4 h-4 text-slate" />
                  <span className="text-charcoal">{cycle.participantCount} participants</span>
                </div>
              </div>

              {cycle.status === 'active' && (
                <div className="mt-4">
                  <div className="flex items-center justify-between text-sm mb-1">
                    <span className="text-slate">Progress</span>
                    <span className="font-medium text-charcoal">{Math.round(progress)}%</span>
                  </div>
                  <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-teal rounded-full transition-all duration-500"
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                  <p className="text-xs text-slate mt-1">
                    {cycle.evaluatedCount} of {cycle.participantCount} evaluated
                  </p>
                </div>
              )}

              {cycle.status === 'active' && (
                <button className="w-full mt-4 py-2 bg-yellow-accent hover:bg-yellow-accent/80 text-charcoal text-sm font-medium rounded-md transition-colors">
                  Evaluate
                </button>
              )}
            </div>
          );
        })}
      </div>

      {/* Empty State */}
      {filteredCycles.length === 0 && (
        <div className="text-center py-12 bg-white rounded-lg border border-[#e5e5e5]">
          <RotateCcw className="w-12 h-12 text-slate mx-auto mb-4" />
          <h3 className="text-lg font-medium text-charcoal">No cycles found</h3>
          <p className="text-sm text-slate mt-1">Create your first evaluation cycle to get started</p>
          <button 
            onClick={() => setIsWizardOpen(true)}
            className="mt-4 px-4 py-2 bg-yellow-accent hover:bg-yellow-accent/80 text-charcoal text-sm font-medium rounded-md transition-colors"
          >
            Create Cycle
          </button>
        </div>
      )}

      {/* Wizard */}
      <CreateCycleWizard
        isOpen={isWizardOpen}
        onClose={() => setIsWizardOpen(false)}
        onSave={handleCreateCycle}
      />
    </div>
  );
}
