import { useState } from 'react';
import { 
  Plus, 
  Search, 
  MoreHorizontal, 
  Edit2, 
  Trash2, 
  Copy,
  ChevronDown,
  ChevronUp,
  X,
  Layers,
  BarChart3,
  Hash,
  Text,
  AlertCircle
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { 
  mockFrameworks,
  mockDepartments,
  getDepartmentName
} from '@/data/mockData';
import type { Framework, Indicator } from '@/types';

// Indicator Type Badge
function IndicatorTypeBadge({ type }: { type: Indicator['type'] }) {
  const styles = {
    quantitative: 'bg-teal/10 text-teal border-teal/20',
    qualitative: 'bg-info/10 text-info border-info/20',
  };

  return (
    <span className={cn("px-2 py-0.5 text-xs font-medium rounded border", styles[type])}>
      {type.charAt(0).toUpperCase() + type.slice(1)}
    </span>
  );
}

// Framework Card Component
function FrameworkCard({ 
  framework, 
  isExpanded, 
  onToggle,
  onEdit,
  onDelete,
  onDuplicate
}: { 
  framework: Framework;
  isExpanded: boolean;
  onToggle: () => void;
  onEdit: () => void;
  onDelete: () => void;
  onDuplicate: () => void;
}) {
  return (
    <div className="bg-white rounded-lg border border-[#e5e5e5] overflow-hidden">
      {/* Header */}
      <div 
        className="flex items-center justify-between p-4 cursor-pointer hover:bg-gray-50 transition-colors"
        onClick={onToggle}
      >
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-yellow-accent/50 rounded-lg flex items-center justify-center">
            <Layers className="w-5 h-5 text-charcoal" />
          </div>
          <div>
            <h3 className="font-semibold text-charcoal">{framework.name}</h3>
            <div className="flex items-center gap-2 text-sm text-slate">
              <span>{getDepartmentName(framework.department)}</span>
              <span>•</span>
              <span>{framework.indicators.length} indicators</span>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className={cn(
            "px-2 py-0.5 text-xs font-medium rounded border",
            framework.status === 'active' 
              ? 'bg-teal/10 text-teal border-teal/20' 
              : 'bg-slate/10 text-slate border-slate/20'
          )}>
            {framework.status}
          </span>
          <button 
            onClick={(e) => {
              e.stopPropagation();
              onToggle();
            }}
            className="p-1.5 text-slate hover:text-charcoal"
          >
            {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>
          <div className="relative group">
            <button 
              onClick={(e) => e.stopPropagation()}
              className="p-1.5 text-slate hover:text-charcoal hover:bg-gray-100 rounded transition-colors"
            >
              <MoreHorizontal className="w-4 h-4" />
            </button>
            <div className="absolute right-0 top-full mt-1 w-36 bg-white rounded-lg shadow-card border border-[#e5e5e5] opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-10">
              <button 
                onClick={(e) => { e.stopPropagation(); onEdit(); }}
                className="w-full flex items-center gap-2 px-3 py-2 text-sm text-charcoal hover:bg-gray-50"
              >
                <Edit2 className="w-4 h-4" />
                Edit
              </button>
              <button 
                onClick={(e) => { e.stopPropagation(); onDuplicate(); }}
                className="w-full flex items-center gap-2 px-3 py-2 text-sm text-charcoal hover:bg-gray-50"
              >
                <Copy className="w-4 h-4" />
                Duplicate
              </button>
              <button 
                onClick={(e) => { e.stopPropagation(); onDelete(); }}
                className="w-full flex items-center gap-2 px-3 py-2 text-sm text-red hover:bg-red/5"
              >
                <Trash2 className="w-4 h-4" />
                Delete
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Expanded Content */}
      {isExpanded && (
        <div className="border-t border-[#e5e5e5]">
          {framework.description && (
            <div className="px-4 py-3 bg-gray-50 border-b border-[#e5e5e5]">
              <p className="text-sm text-slate">{framework.description}</p>
            </div>
          )}
          
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50 border-b border-[#e5e5e5]">
                  <th className="text-left py-2 px-4 text-xs font-medium text-slate uppercase">Indicator</th>
                  <th className="text-left py-2 px-4 text-xs font-medium text-slate uppercase">Type</th>
                  <th className="text-left py-2 px-4 text-xs font-medium text-slate uppercase">Unit</th>
                  <th className="text-left py-2 px-4 text-xs font-medium text-slate uppercase">Range</th>
                  <th className="text-left py-2 px-4 text-xs font-medium text-slate uppercase">Weight</th>
                  <th className="text-left py-2 px-4 text-xs font-medium text-slate uppercase">I/O</th>
                </tr>
              </thead>
              <tbody>
                {framework.indicators.map((indicator) => (
                  <tr key={indicator.id} className="border-b border-[#e5e5e5] last:border-b-0 hover:bg-gray-50">
                    <td className="py-2 px-4">
                      <div>
                        <p className="text-sm font-medium text-charcoal">{indicator.name}</p>
                        {indicator.description && (
                          <p className="text-xs text-slate">{indicator.description}</p>
                        )}
                      </div>
                    </td>
                    <td className="py-2 px-4">
                      <IndicatorTypeBadge type={indicator.type} />
                    </td>
                    <td className="py-2 px-4">
                      <span className="text-sm text-charcoal">{indicator.unit || '-'}</span>
                    </td>
                    <td className="py-2 px-4">
                      <span className="text-sm text-charcoal">
                        {indicator.minValue !== undefined && indicator.maxValue !== undefined
                          ? `${indicator.minValue} - ${indicator.maxValue}`
                          : '-'}
                      </span>
                    </td>
                    <td className="py-2 px-4">
                      <span className="text-sm text-charcoal">{indicator.weight.toFixed(1)}</span>
                    </td>
                    <td className="py-2 px-4">
                      <span className={cn(
                        "text-xs px-2 py-0.5 rounded",
                        indicator.isInput ? "bg-blue-100 text-blue-700" : "bg-green-100 text-green-700"
                      )}>
                        {indicator.isInput ? 'Input' : 'Output'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Indicator Count Warning */}
          {framework.indicators.length > 8 && (
            <div className="flex items-start gap-2 p-3 bg-orange/10 border-t border-orange/20">
              <AlertCircle className="w-4 h-4 text-orange mt-0.5" />
              <p className="text-sm text-orange">
                This framework has {framework.indicators.length} indicators. For optimal DEA performance, consider using 5-8 indicators.
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// Add/Edit Framework Modal
interface FrameworkModalProps {
  isOpen: boolean;
  onClose: () => void;
  framework?: Framework | null;
}

function FrameworkModal({ isOpen, onClose, framework }: FrameworkModalProps) {
  const [name, setName] = useState(framework?.name || '');
  const [department, setDepartment] = useState(framework?.department || '');
  const [description, setDescription] = useState(framework?.description || '');
  const [indicators, setIndicators] = useState<Indicator[]>(framework?.indicators || []);
  const [showAddIndicator, setShowAddIndicator] = useState(false);

  if (!isOpen) return null;

  const handleAddIndicator = (indicator: Indicator) => {
    setIndicators([...indicators, indicator]);
    setShowAddIndicator(false);
  };

  const handleRemoveIndicator = (id: string) => {
    setIndicators(indicators.filter(i => i.id !== id));
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-3xl max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#e5e5e5]">
          <h2 className="text-lg font-semibold text-charcoal">
            {framework ? 'Edit Framework' : 'Create Framework'}
          </h2>
          <button onClick={onClose} className="p-1 text-slate hover:text-charcoal">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-180px)]">
          <div className="space-y-4">
            {/* Name */}
            <div>
              <label className="block text-sm font-medium text-charcoal mb-1">
                Framework Name <span className="text-red">*</span>
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-3 py-2 border border-[#e5e5e5] rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-charcoal/10"
                placeholder="e.g., Sales Performance Framework"
              />
            </div>

            {/* Department */}
            <div>
              <label className="block text-sm font-medium text-charcoal mb-1">
                Department <span className="text-red">*</span>
              </label>
              <select
                value={department}
                onChange={(e) => setDepartment(e.target.value)}
                className="w-full px-3 py-2 border border-[#e5e5e5] rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-charcoal/10"
              >
                <option value="">Select department</option>
                {mockDepartments.map((dept) => (
                  <option key={dept.id} value={dept.id}>{dept.name}</option>
                ))}
              </select>
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-medium text-charcoal mb-1">
                Description
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full px-3 py-2 border border-[#e5e5e5] rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-charcoal/10"
                rows={3}
                placeholder="Describe the purpose of this framework..."
              />
            </div>

            {/* Indicators */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="block text-sm font-medium text-charcoal">
                  Indicators
                </label>
                <div className="flex items-center gap-2">
                  <span className={cn(
                    "text-sm",
                    indicators.length > 10 ? "text-red" :
                    indicators.length > 8 ? "text-orange" :
                    "text-slate"
                  )}>
                    {indicators.length}/10
                  </span>
                  <button
                    onClick={() => setShowAddIndicator(true)}
                    className="flex items-center gap-1 px-2 py-1 bg-yellow-accent hover:bg-yellow-accent/80 text-charcoal text-xs font-medium rounded transition-colors"
                  >
                    <Plus className="w-3 h-3" />
                    Add
                  </button>
                </div>
              </div>

              {indicators.length === 0 ? (
                <div className="text-center py-8 bg-gray-50 rounded-lg border border-dashed border-[#e5e5e5]">
                  <BarChart3 className="w-8 h-8 text-slate mx-auto mb-2" />
                  <p className="text-sm text-slate">No indicators added yet</p>
                  <button
                    onClick={() => setShowAddIndicator(true)}
                    className="mt-2 text-sm text-info hover:underline"
                  >
                    Add your first indicator
                  </button>
                </div>
              ) : (
                <div className="space-y-2">
                  {indicators.map((indicator, index) => (
                    <div key={indicator.id} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                      <span className="text-xs text-slate w-6">{index + 1}.</span>
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-medium text-charcoal">{indicator.name}</span>
                          <IndicatorTypeBadge type={indicator.type} />
                        </div>
                        <div className="flex items-center gap-3 text-xs text-slate mt-1">
                          <span>Weight: {indicator.weight.toFixed(1)}</span>
                          {indicator.unit && <span>Unit: {indicator.unit}</span>}
                          <span className={indicator.isInput ? 'text-blue-600' : 'text-green-600'}>
                            {indicator.isInput ? 'Input' : 'Output'}
                          </span>
                        </div>
                      </div>
                      <button
                        onClick={() => handleRemoveIndicator(indicator.id)}
                        className="p-1.5 text-slate hover:text-red hover:bg-red/5 rounded transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              )}

              {indicators.length > 8 && (
                <div className="flex items-start gap-2 mt-2 p-2 bg-orange/10 rounded">
                  <AlertCircle className="w-4 h-4 text-orange mt-0.5" />
                  <p className="text-xs text-orange">
                    For optimal DEA performance, use 5-8 indicators. Current: {indicators.length}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-[#e5e5e5] bg-gray-50">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm text-slate hover:text-charcoal transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={onClose}
            disabled={!name || !department}
            className="px-4 py-2 bg-yellow-accent hover:bg-yellow-accent/80 text-charcoal text-sm font-medium rounded-md transition-colors disabled:opacity-50"
          >
            {framework ? 'Save Changes' : 'Create Framework'}
          </button>
        </div>
      </div>

      {/* Add Indicator Modal */}
      {showAddIndicator && (
        <AddIndicatorModal
          isOpen={showAddIndicator}
          onClose={() => setShowAddIndicator(false)}
          onAdd={handleAddIndicator}
        />
      )}
    </div>
  );
}

// Add Indicator Modal
function AddIndicatorModal({ 
  isOpen, 
  onClose, 
  onAdd 
}: { 
  isOpen: boolean; 
  onClose: () => void; 
  onAdd: (indicator: Indicator) => void;
}) {
  const [name, setName] = useState('');
  const [type, setType] = useState<Indicator['type']>('quantitative');
  const [unit, setUnit] = useState('');
  const [minValue, setMinValue] = useState('');
  const [maxValue, setMaxValue] = useState('');
  const [weight, setWeight] = useState('1.0');
  const [isInput, setIsInput] = useState(true);

  if (!isOpen) return null;

  const handleSubmit = () => {
    onAdd({
      id: `ind_${Date.now()}`,
      name,
      type,
      unit: unit || undefined,
      minValue: minValue ? Number(minValue) : undefined,
      maxValue: maxValue ? Number(maxValue) : undefined,
      weight: Number(weight),
      isInput,
    });
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-charcoal">Add Indicator</h3>
          <button onClick={onClose} className="p-1 text-slate hover:text-charcoal">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-charcoal mb-1">Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-3 py-2 border border-[#e5e5e5] rounded-md text-sm"
              placeholder="e.g., Calls Made"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-charcoal mb-1">Type</label>
            <div className="flex gap-2">
              <button
                onClick={() => setType('quantitative')}
                className={cn(
                  "flex-1 flex items-center justify-center gap-2 px-3 py-2 border rounded-md text-sm transition-colors",
                  type === 'quantitative' 
                    ? "border-teal bg-teal/5 text-teal" 
                    : "border-[#e5e5e5] text-charcoal hover:bg-gray-50"
                )}
              >
                <Hash className="w-4 h-4" />
                Quantitative
              </button>
              <button
                onClick={() => setType('qualitative')}
                className={cn(
                  "flex-1 flex items-center justify-center gap-2 px-3 py-2 border rounded-md text-sm transition-colors",
                  type === 'qualitative' 
                    ? "border-info bg-info/5 text-info" 
                    : "border-[#e5e5e5] text-charcoal hover:bg-gray-50"
                )}
              >
                <Text className="w-4 h-4" />
                Qualitative
              </button>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-charcoal mb-1">Unit</label>
            <input
              type="text"
              value={unit}
              onChange={(e) => setUnit(e.target.value)}
              className="w-full px-3 py-2 border border-[#e5e5e5] rounded-md text-sm"
              placeholder="e.g., calls, %, hours"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium text-charcoal mb-1">Min Value</label>
              <input
                type="number"
                value={minValue}
                onChange={(e) => setMinValue(e.target.value)}
                className="w-full px-3 py-2 border border-[#e5e5e5] rounded-md text-sm"
                placeholder="0"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-charcoal mb-1">Max Value</label>
              <input
                type="number"
                value={maxValue}
                onChange={(e) => setMaxValue(e.target.value)}
                className="w-full px-3 py-2 border border-[#e5e5e5] rounded-md text-sm"
                placeholder="100"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-charcoal mb-1">Weight</label>
            <input
              type="number"
              step="0.1"
              value={weight}
              onChange={(e) => setWeight(e.target.value)}
              className="w-full px-3 py-2 border border-[#e5e5e5] rounded-md text-sm"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-charcoal mb-1">Indicator Type</label>
            <div className="flex gap-2">
              <button
                onClick={() => setIsInput(true)}
                className={cn(
                  "flex-1 px-3 py-2 border rounded-md text-sm transition-colors",
                  isInput 
                    ? "border-blue-500 bg-blue-50 text-blue-700" 
                    : "border-[#e5e5e5] text-charcoal hover:bg-gray-50"
                )}
              >
                Input
              </button>
              <button
                onClick={() => setIsInput(false)}
                className={cn(
                  "flex-1 px-3 py-2 border rounded-md text-sm transition-colors",
                  !isInput 
                    ? "border-green-500 bg-green-50 text-green-700" 
                    : "border-[#e5e5e5] text-charcoal hover:bg-gray-50"
                )}
              >
                Output
              </button>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-end gap-3 mt-6">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm text-slate hover:text-charcoal transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={!name}
            className="px-4 py-2 bg-yellow-accent hover:bg-yellow-accent/80 text-charcoal text-sm font-medium rounded-md transition-colors disabled:opacity-50"
          >
            Add Indicator
          </button>
        </div>
      </div>
    </div>
  );
}

// Main Dimensions Component
export function Dimensions() {
  const [frameworks, setFrameworks] = useState<Framework[]>(mockFrameworks);
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingFramework, setEditingFramework] = useState<Framework | null>(null);

  const filteredFrameworks = frameworks.filter(f => 
    f.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    getDepartmentName(f.department).toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleDuplicate = (framework: Framework) => {
    const duplicated: Framework = {
      ...framework,
      id: `fw_${Date.now()}`,
      name: `[Copy] ${framework.name}`,
      status: 'inactive',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    setFrameworks([duplicated, ...frameworks]);
  };

  const handleDelete = (framework: Framework) => {
    if (confirm(`Are you sure you want to delete "${framework.name}"?`)) {
      setFrameworks(frameworks.filter(f => f.id !== framework.id));
    }
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-charcoal">Dimensions & Frameworks</h1>
          <p className="text-sm text-slate mt-1">Manage evaluation frameworks and performance indicators</p>
        </div>
        <button 
          onClick={() => {
            setEditingFramework(null);
            setIsModalOpen(true);
          }}
          className="flex items-center gap-2 px-4 py-2 bg-yellow-accent hover:bg-yellow-accent/80 text-charcoal text-sm font-medium rounded-md transition-colors"
        >
          <Plus className="w-4 h-4" />
          Create Framework
        </button>
      </div>

      {/* Info Banner */}
      <div className="flex items-start gap-3 p-4 bg-info/10 rounded-lg border border-info/20">
        <AlertCircle className="w-5 h-5 text-info mt-0.5" />
        <div>
          <p className="text-sm font-medium text-info">Framework Optimization</p>
          <p className="text-sm text-info/80 mt-1">
            For optimal DEA performance, use 5-8 indicators per framework. The Choquet DEA engine works best with focused frameworks.
          </p>
        </div>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate" />
        <input
          type="text"
          placeholder="Search frameworks..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-10 pr-4 py-2 border border-[#e5e5e5] rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-charcoal/10"
        />
      </div>

      {/* Frameworks List */}
      <div className="space-y-4">
        {filteredFrameworks.map((framework) => (
          <FrameworkCard
            key={framework.id}
            framework={framework}
            isExpanded={expandedId === framework.id}
            onToggle={() => setExpandedId(expandedId === framework.id ? null : framework.id)}
            onEdit={() => {
              setEditingFramework(framework);
              setIsModalOpen(true);
            }}
            onDelete={() => handleDelete(framework)}
            onDuplicate={() => handleDuplicate(framework)}
          />
        ))}
      </div>

      {/* Empty State */}
      {filteredFrameworks.length === 0 && (
        <div className="text-center py-12 bg-white rounded-lg border border-[#e5e5e5]">
          <Layers className="w-12 h-12 text-slate mx-auto mb-4" />
          <h3 className="text-lg font-medium text-charcoal">No frameworks found</h3>
          <p className="text-sm text-slate mt-1">Create your first evaluation framework</p>
          <button 
            onClick={() => {
              setEditingFramework(null);
              setIsModalOpen(true);
            }}
            className="mt-4 px-4 py-2 bg-yellow-accent hover:bg-yellow-accent/80 text-charcoal text-sm font-medium rounded-md transition-colors"
          >
            Create Framework
          </button>
        </div>
      )}

      {/* Modal */}
      <FrameworkModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditingFramework(null);
        }}
        framework={editingFramework}
      />
    </div>
  );
}
