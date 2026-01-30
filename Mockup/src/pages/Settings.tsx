import { useState } from 'react';
import { 
  Building2, 
  Users, 
  MapPin, 
  Plus, 
  Edit2, 
  Trash2, 
  Save,
  X,
  Upload,
  Mail,
  Phone,
  Briefcase
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { 
  mockCompanySettings,
  mockDepartments,
  mockBranches
} from '@/data/mockData';
import type { Department, Branch, CompanySettings } from '@/types';

// Tab Button Component
function TabButton({ 
  active, 
  onClick, 
  icon: Icon, 
  label 
}: { 
  active: boolean; 
  onClick: () => void; 
  icon: React.ElementType; 
  label: string;
}) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "flex items-center gap-2 px-4 py-2.5 text-sm font-medium rounded-lg transition-colors",
        active 
          ? "bg-yellow-accent text-charcoal" 
          : "text-slate hover:bg-gray-50 hover:text-charcoal"
      )}
    >
      <Icon className="w-4 h-4" />
      {label}
    </button>
  );
}

// Company Settings Tab
function CompanySettingsTab() {
  const [settings, setSettings] = useState<CompanySettings>(mockCompanySettings);
  const [hasChanges, setHasChanges] = useState(false);

  const handleChange = (field: keyof CompanySettings, value: string) => {
    setSettings({ ...settings, [field]: value });
    setHasChanges(true);
  };

  const handleSave = () => {
    // In a real app, this would save to the backend
    setHasChanges(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold text-charcoal">Company Information</h3>
          <p className="text-sm text-slate">Manage your company details and branding</p>
        </div>
        {hasChanges && (
          <button
            onClick={handleSave}
            className="flex items-center gap-2 px-4 py-2 bg-yellow-accent hover:bg-yellow-accent/80 text-charcoal text-sm font-medium rounded-md transition-colors"
          >
            <Save className="w-4 h-4" />
            Save Changes
          </button>
        )}
      </div>

      {/* Logo Upload */}
      <div className="flex items-center gap-6 p-4 bg-gray-50 rounded-lg">
        <div className="w-20 h-20 bg-charcoal rounded-lg flex items-center justify-center">
          <Building2 className="w-8 h-8 text-white" />
        </div>
        <div>
          <p className="text-sm font-medium text-charcoal">Company Logo</p>
          <p className="text-xs text-slate mt-1">Recommended: 200x200px, PNG or JPG</p>
          <button className="mt-2 flex items-center gap-1.5 px-3 py-1.5 border border-[#e5e5e5] rounded-md text-sm text-charcoal hover:bg-white transition-colors">
            <Upload className="w-3.5 h-3.5" />
            Upload Logo
          </button>
        </div>
      </div>

      {/* Form Fields */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-charcoal mb-1">
            Company Name
          </label>
          <input
            type="text"
            value={settings.name}
            onChange={(e) => handleChange('name', e.target.value)}
            className="w-full px-3 py-2 border border-[#e5e5e5] rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-charcoal/10"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-charcoal mb-1">
            Email Address
          </label>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate" />
            <input
              type="email"
              value={settings.email}
              onChange={(e) => handleChange('email', e.target.value)}
              className="w-full pl-10 pr-3 py-2 border border-[#e5e5e5] rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-charcoal/10"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-charcoal mb-1">
            Phone Number
          </label>
          <div className="relative">
            <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate" />
            <input
              type="tel"
              value={settings.phone || ''}
              onChange={(e) => handleChange('phone', e.target.value)}
              className="w-full pl-10 pr-3 py-2 border border-[#e5e5e5] rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-charcoal/10"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-charcoal mb-1">
            Industry
          </label>
          <div className="relative">
            <Briefcase className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate" />
            <input
              type="text"
              value={settings.industry || ''}
              onChange={(e) => handleChange('industry', e.target.value)}
              className="w-full pl-10 pr-3 py-2 border border-[#e5e5e5] rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-charcoal/10"
            />
          </div>
        </div>

        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-charcoal mb-1">
            Address
          </label>
          <div className="relative">
            <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate" />
            <input
              type="text"
              value={settings.address || ''}
              onChange={(e) => handleChange('address', e.target.value)}
              className="w-full pl-10 pr-3 py-2 border border-[#e5e5e5] rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-charcoal/10"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-charcoal mb-1">
            Company Size
          </label>
          <select
            value={settings.size || ''}
            onChange={(e) => handleChange('size', e.target.value)}
            className="w-full px-3 py-2 border border-[#e5e5e5] rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-charcoal/10"
          >
            <option value="">Select size</option>
            <option value="1-10">1-10 employees</option>
            <option value="11-50">11-50 employees</option>
            <option value="51-200">51-200 employees</option>
            <option value="201-500">201-500 employees</option>
            <option value="501-1000">501-1000 employees</option>
            <option value="1000+">1000+ employees</option>
          </select>
        </div>
      </div>
    </div>
  );
}

// Departments Tab
function DepartmentsTab() {
  const [departments, setDepartments] = useState<Department[]>(mockDepartments);
  const [isEditing, setIsEditing] = useState<string | null>(null);
  const [editName, setEditName] = useState('');
  const [editDescription, setEditDescription] = useState('');
  const [showAddForm, setShowAddForm] = useState(false);
  const [newName, setNewName] = useState('');
  const [newDescription, setNewDescription] = useState('');

  const handleAdd = () => {
    if (!newName.trim()) return;
    
    const newDept: Department = {
      id: `dept_${Date.now()}`,
      name: newName,
      description: newDescription,
      employeeCount: 0,
    };
    setDepartments([...departments, newDept]);
    setNewName('');
    setNewDescription('');
    setShowAddForm(false);
  };

  const handleEdit = (dept: Department) => {
    setIsEditing(dept.id);
    setEditName(dept.name);
    setEditDescription(dept.description || '');
  };

  const handleSaveEdit = (id: string) => {
    setDepartments(departments.map(d => 
      d.id === id ? { ...d, name: editName, description: editDescription } : d
    ));
    setIsEditing(null);
  };

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this department?')) {
      setDepartments(departments.filter(d => d.id !== id));
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold text-charcoal">Departments</h3>
          <p className="text-sm text-slate">Manage company departments and organizational structure</p>
        </div>
        <button
          onClick={() => setShowAddForm(true)}
          className="flex items-center gap-2 px-4 py-2 bg-yellow-accent hover:bg-yellow-accent/80 text-charcoal text-sm font-medium rounded-md transition-colors"
        >
          <Plus className="w-4 h-4" />
          Add Department
        </button>
      </div>

      {/* Add Form */}
      {showAddForm && (
        <div className="p-4 bg-gray-50 rounded-lg border border-[#e5e5e5]">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-charcoal mb-1">Department Name</label>
              <input
                type="text"
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                className="w-full px-3 py-2 border border-[#e5e5e5] rounded-md text-sm"
                placeholder="e.g., Engineering"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-charcoal mb-1">Description</label>
              <input
                type="text"
                value={newDescription}
                onChange={(e) => setNewDescription(e.target.value)}
                className="w-full px-3 py-2 border border-[#e5e5e5] rounded-md text-sm"
                placeholder="Brief description..."
              />
            </div>
          </div>
          <div className="flex items-center justify-end gap-2 mt-4">
            <button
              onClick={() => setShowAddForm(false)}
              className="px-3 py-1.5 text-sm text-slate hover:text-charcoal transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleAdd}
              disabled={!newName.trim()}
              className="px-3 py-1.5 bg-charcoal text-white text-sm font-medium rounded-md transition-colors disabled:opacity-50"
            >
              Add Department
            </button>
          </div>
        </div>
      )}

      {/* Departments List */}
      <div className="bg-white rounded-lg border border-[#e5e5e5] overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="bg-gray-50 border-b border-[#e5e5e5]">
              <th className="text-left py-3 px-4 text-xs font-medium text-slate uppercase">Department</th>
              <th className="text-left py-3 px-4 text-xs font-medium text-slate uppercase">Description</th>
              <th className="text-left py-3 px-4 text-xs font-medium text-slate uppercase">Employees</th>
              <th className="text-right py-3 px-4 text-xs font-medium text-slate uppercase">Actions</th>
            </tr>
          </thead>
          <tbody>
            {departments.map((dept) => (
              <tr key={dept.id} className="border-b border-[#e5e5e5] last:border-b-0">
                <td className="py-3 px-4">
                  {isEditing === dept.id ? (
                    <input
                      type="text"
                      value={editName}
                      onChange={(e) => setEditName(e.target.value)}
                      className="w-full px-2 py-1 border border-[#e5e5e5] rounded text-sm"
                    />
                  ) : (
                    <span className="text-sm font-medium text-charcoal">{dept.name}</span>
                  )}
                </td>
                <td className="py-3 px-4">
                  {isEditing === dept.id ? (
                    <input
                      type="text"
                      value={editDescription}
                      onChange={(e) => setEditDescription(e.target.value)}
                      className="w-full px-2 py-1 border border-[#e5e5e5] rounded text-sm"
                    />
                  ) : (
                    <span className="text-sm text-slate">{dept.description || '-'}</span>
                  )}
                </td>
                <td className="py-3 px-4">
                  <span className="text-sm text-charcoal">{dept.employeeCount}</span>
                </td>
                <td className="py-3 px-4">
                  <div className="flex items-center justify-end gap-1">
                    {isEditing === dept.id ? (
                      <>
                        <button
                          onClick={() => handleSaveEdit(dept.id)}
                          className="p-1.5 text-teal hover:bg-teal/10 rounded transition-colors"
                        >
                          <Save className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => setIsEditing(null)}
                          className="p-1.5 text-slate hover:bg-gray-100 rounded transition-colors"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </>
                    ) : (
                      <>
                        <button
                          onClick={() => handleEdit(dept)}
                          className="p-1.5 text-slate hover:text-charcoal hover:bg-gray-100 rounded transition-colors"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(dept.id)}
                          className="p-1.5 text-slate hover:text-red hover:bg-red/5 rounded transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// Branches Tab
function BranchesTab() {
  const [branches, setBranches] = useState<Branch[]>(mockBranches);
  const [isEditing, setIsEditing] = useState<string | null>(null);
  const [editName, setEditName] = useState('');
  const [editLocation, setEditLocation] = useState('');
  const [showAddForm, setShowAddForm] = useState(false);
  const [newName, setNewName] = useState('');
  const [newLocation, setNewLocation] = useState('');

  const handleAdd = () => {
    if (!newName.trim()) return;
    
    const newBranch: Branch = {
      id: `branch_${Date.now()}`,
      name: newName,
      location: newLocation,
      employeeCount: 0,
    };
    setBranches([...branches, newBranch]);
    setNewName('');
    setNewLocation('');
    setShowAddForm(false);
  };

  const handleEdit = (branch: Branch) => {
    setIsEditing(branch.id);
    setEditName(branch.name);
    setEditLocation(branch.location || '');
  };

  const handleSaveEdit = (id: string) => {
    setBranches(branches.map(b => 
      b.id === id ? { ...b, name: editName, location: editLocation } : b
    ));
    setIsEditing(null);
  };

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this branch?')) {
      setBranches(branches.filter(b => b.id !== id));
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold text-charcoal">Branches</h3>
          <p className="text-sm text-slate">Manage company branches and office locations</p>
        </div>
        <button
          onClick={() => setShowAddForm(true)}
          className="flex items-center gap-2 px-4 py-2 bg-yellow-accent hover:bg-yellow-accent/80 text-charcoal text-sm font-medium rounded-md transition-colors"
        >
          <Plus className="w-4 h-4" />
          Add Branch
        </button>
      </div>

      {/* Add Form */}
      {showAddForm && (
        <div className="p-4 bg-gray-50 rounded-lg border border-[#e5e5e5]">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-charcoal mb-1">Branch Name</label>
              <input
                type="text"
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                className="w-full px-3 py-2 border border-[#e5e5e5] rounded-md text-sm"
                placeholder="e.g., Headquarters"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-charcoal mb-1">Location</label>
              <input
                type="text"
                value={newLocation}
                onChange={(e) => setNewLocation(e.target.value)}
                className="w-full px-3 py-2 border border-[#e5e5e5] rounded-md text-sm"
                placeholder="e.g., New York, NY"
              />
            </div>
          </div>
          <div className="flex items-center justify-end gap-2 mt-4">
            <button
              onClick={() => setShowAddForm(false)}
              className="px-3 py-1.5 text-sm text-slate hover:text-charcoal transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleAdd}
              disabled={!newName.trim()}
              className="px-3 py-1.5 bg-charcoal text-white text-sm font-medium rounded-md transition-colors disabled:opacity-50"
            >
              Add Branch
            </button>
          </div>
        </div>
      )}

      {/* Branches List */}
      <div className="bg-white rounded-lg border border-[#e5e5e5] overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="bg-gray-50 border-b border-[#e5e5e5]">
              <th className="text-left py-3 px-4 text-xs font-medium text-slate uppercase">Branch</th>
              <th className="text-left py-3 px-4 text-xs font-medium text-slate uppercase">Location</th>
              <th className="text-left py-3 px-4 text-xs font-medium text-slate uppercase">Employees</th>
              <th className="text-right py-3 px-4 text-xs font-medium text-slate uppercase">Actions</th>
            </tr>
          </thead>
          <tbody>
            {branches.map((branch) => (
              <tr key={branch.id} className="border-b border-[#e5e5e5] last:border-b-0">
                <td className="py-3 px-4">
                  {isEditing === branch.id ? (
                    <input
                      type="text"
                      value={editName}
                      onChange={(e) => setEditName(e.target.value)}
                      className="w-full px-2 py-1 border border-[#e5e5e5] rounded text-sm"
                    />
                  ) : (
                    <span className="text-sm font-medium text-charcoal">{branch.name}</span>
                  )}
                </td>
                <td className="py-3 px-4">
                  {isEditing === branch.id ? (
                    <input
                      type="text"
                      value={editLocation}
                      onChange={(e) => setEditLocation(e.target.value)}
                      className="w-full px-2 py-1 border border-[#e5e5e5] rounded text-sm"
                    />
                  ) : (
                    <span className="text-sm text-slate">{branch.location || '-'}</span>
                  )}
                </td>
                <td className="py-3 px-4">
                  <span className="text-sm text-charcoal">{branch.employeeCount}</span>
                </td>
                <td className="py-3 px-4">
                  <div className="flex items-center justify-end gap-1">
                    {isEditing === branch.id ? (
                      <>
                        <button
                          onClick={() => handleSaveEdit(branch.id)}
                          className="p-1.5 text-teal hover:bg-teal/10 rounded transition-colors"
                        >
                          <Save className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => setIsEditing(null)}
                          className="p-1.5 text-slate hover:bg-gray-100 rounded transition-colors"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </>
                    ) : (
                      <>
                        <button
                          onClick={() => handleEdit(branch)}
                          className="p-1.5 text-slate hover:text-charcoal hover:bg-gray-100 rounded transition-colors"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(branch.id)}
                          className="p-1.5 text-slate hover:text-red hover:bg-red/5 rounded transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// Main Settings Component
export function Settings() {
  const [activeTab, setActiveTab] = useState<'company' | 'departments' | 'branches'>('company');

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-semibold text-charcoal">Settings</h1>
        <p className="text-sm text-slate mt-1">Manage your organization settings and configuration</p>
      </div>

      {/* Tabs */}
      <div className="flex flex-wrap gap-2 p-1 bg-gray-50 rounded-lg">
        <TabButton
          active={activeTab === 'company'}
          onClick={() => setActiveTab('company')}
          icon={Building2}
          label="Company"
        />
        <TabButton
          active={activeTab === 'departments'}
          onClick={() => setActiveTab('departments')}
          icon={Users}
          label="Departments"
        />
        <TabButton
          active={activeTab === 'branches'}
          onClick={() => setActiveTab('branches')}
          icon={MapPin}
          label="Branches"
        />
      </div>

      {/* Tab Content */}
      <div className="bg-white rounded-lg border border-[#e5e5e5] p-6">
        {activeTab === 'company' && <CompanySettingsTab />}
        {activeTab === 'departments' && <DepartmentsTab />}
        {activeTab === 'branches' && <BranchesTab />}
      </div>
    </div>
  );
}
