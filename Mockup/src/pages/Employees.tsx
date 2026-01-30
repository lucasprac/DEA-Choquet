import { useState, useMemo } from 'react';
import { 
  Plus, 
  Search, 
  Edit2, 
  Trash2, 
  Download, 
  Upload,
  ChevronLeft,
  ChevronRight,
  X,
  User
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { 
  mockEmployees, 
  mockDepartments, 
  mockBranches,
  getDepartmentName
} from '@/data/mockData';
import type { Employee, EmployeeFormData } from '@/types';

// Status Badge Component
function StatusBadge({ status }: { status: Employee['status'] }) {
  const styles = {
    active: 'bg-teal/10 text-teal border-teal/20',
    inactive: 'bg-slate/10 text-slate border-slate/20',
    terminated: 'bg-red/10 text-red border-red/20',
  };

  return (
    <span className={cn("px-2 py-0.5 text-xs font-medium rounded border", styles[status])}>
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </span>
  );
}

// Add/Edit Employee Modal
interface EmployeeModalProps {
  isOpen: boolean;
  onClose: () => void;
  employee?: Employee | null;
  onSave: (data: EmployeeFormData) => void;
}

function EmployeeModal({ isOpen, onClose, employee, onSave }: EmployeeModalProps) {
  const [formData, setFormData] = useState<EmployeeFormData>({
    name: employee?.name || '',
    email: employee?.email || '',
    employeeId: employee?.employeeId || '',
    phone: employee?.phone || '',
    department: employee?.department || '',
    branch: employee?.branch || '',
    jobTitle: employee?.jobTitle || '',
    manager: employee?.manager || '',
    salary: employee?.salary || undefined,
    status: employee?.status || 'active',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  if (!isOpen) return null;

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.name.trim()) newErrors.name = 'Name is required';
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Invalid email format';
    }
    if (!formData.employeeId.trim()) newErrors.employeeId = 'Employee ID is required';
    if (!formData.department) newErrors.department = 'Department is required';
    if (!formData.branch) newErrors.branch = 'Branch is required';
    if (!formData.jobTitle.trim()) newErrors.jobTitle = 'Job title is required';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validate()) {
      onSave(formData);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#e5e5e5]">
          <h2 className="text-lg font-semibold text-charcoal">
            {employee ? 'Edit Employee' : 'Add New Employee'}
          </h2>
          <button onClick={onClose} className="p-1 text-slate hover:text-charcoal">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
          <div className="grid grid-cols-2 gap-4">
            {/* Name */}
            <div>
              <label className="block text-sm font-medium text-charcoal mb-1">
                Full Name <span className="text-red">*</span>
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className={cn(
                  "w-full px-3 py-2 border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-charcoal/10",
                  errors.name ? "border-red" : "border-[#e5e5e5]"
                )}
                placeholder="Enter full name"
              />
              {errors.name && <p className="text-xs text-red mt-1">{errors.name}</p>}
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-charcoal mb-1">
                Email <span className="text-red">*</span>
              </label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className={cn(
                  "w-full px-3 py-2 border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-charcoal/10",
                  errors.email ? "border-red" : "border-[#e5e5e5]"
                )}
                placeholder="Enter email address"
              />
              {errors.email && <p className="text-xs text-red mt-1">{errors.email}</p>}
            </div>

            {/* Employee ID */}
            <div>
              <label className="block text-sm font-medium text-charcoal mb-1">
                Employee ID <span className="text-red">*</span>
              </label>
              <input
                type="text"
                value={formData.employeeId}
                onChange={(e) => setFormData({ ...formData, employeeId: e.target.value })}
                className={cn(
                  "w-full px-3 py-2 border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-charcoal/10",
                  errors.employeeId ? "border-red" : "border-[#e5e5e5]"
                )}
                placeholder="e.g., EMP001"
              />
              {errors.employeeId && <p className="text-xs text-red mt-1">{errors.employeeId}</p>}
            </div>

            {/* Phone */}
            <div>
              <label className="block text-sm font-medium text-charcoal mb-1">
                Phone Number
              </label>
              <input
                type="tel"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="w-full px-3 py-2 border border-[#e5e5e5] rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-charcoal/10"
                placeholder="Enter phone number"
              />
            </div>

            {/* Department */}
            <div>
              <label className="block text-sm font-medium text-charcoal mb-1">
                Department <span className="text-red">*</span>
              </label>
              <select
                value={formData.department}
                onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                className={cn(
                  "w-full px-3 py-2 border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-charcoal/10",
                  errors.department ? "border-red" : "border-[#e5e5e5]"
                )}
              >
                <option value="">Select department</option>
                {mockDepartments.map((dept) => (
                  <option key={dept.id} value={dept.id}>{dept.name}</option>
                ))}
              </select>
              {errors.department && <p className="text-xs text-red mt-1">{errors.department}</p>}
            </div>

            {/* Branch */}
            <div>
              <label className="block text-sm font-medium text-charcoal mb-1">
                Branch <span className="text-red">*</span>
              </label>
              <select
                value={formData.branch}
                onChange={(e) => setFormData({ ...formData, branch: e.target.value })}
                className={cn(
                  "w-full px-3 py-2 border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-charcoal/10",
                  errors.branch ? "border-red" : "border-[#e5e5e5]"
                )}
              >
                <option value="">Select branch</option>
                {mockBranches.map((branch) => (
                  <option key={branch.id} value={branch.id}>{branch.name}</option>
                ))}
              </select>
              {errors.branch && <p className="text-xs text-red mt-1">{errors.branch}</p>}
            </div>

            {/* Job Title */}
            <div>
              <label className="block text-sm font-medium text-charcoal mb-1">
                Job Title <span className="text-red">*</span>
              </label>
              <input
                type="text"
                value={formData.jobTitle}
                onChange={(e) => setFormData({ ...formData, jobTitle: e.target.value })}
                className={cn(
                  "w-full px-3 py-2 border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-charcoal/10",
                  errors.jobTitle ? "border-red" : "border-[#e5e5e5]"
                )}
                placeholder="Enter job title"
              />
              {errors.jobTitle && <p className="text-xs text-red mt-1">{errors.jobTitle}</p>}
            </div>

            {/* Manager */}
            <div>
              <label className="block text-sm font-medium text-charcoal mb-1">
                Manager
              </label>
              <select
                value={formData.manager}
                onChange={(e) => setFormData({ ...formData, manager: e.target.value })}
                className="w-full px-3 py-2 border border-[#e5e5e5] rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-charcoal/10"
              >
                <option value="">Select manager</option>
                {mockEmployees.filter(e => e.status === 'active').map((emp) => (
                  <option key={emp.id} value={emp.id}>{emp.name}</option>
                ))}
              </select>
            </div>

            {/* Salary */}
            <div>
              <label className="block text-sm font-medium text-charcoal mb-1">
                Salary
              </label>
              <input
                type="number"
                value={formData.salary || ''}
                onChange={(e) => setFormData({ ...formData, salary: e.target.value ? Number(e.target.value) : undefined })}
                className="w-full px-3 py-2 border border-[#e5e5e5] rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-charcoal/10"
                placeholder="Enter salary"
              />
            </div>

            {/* Status */}
            <div>
              <label className="block text-sm font-medium text-charcoal mb-1">
                Status
              </label>
              <select
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value as Employee['status'] })}
                className="w-full px-3 py-2 border border-[#e5e5e5] rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-charcoal/10"
              >
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
                <option value="terminated">Terminated</option>
              </select>
            </div>
          </div>
        </form>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-[#e5e5e5] bg-gray-50">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-sm text-slate hover:text-charcoal transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            className="px-4 py-2 bg-yellow-accent hover:bg-yellow-accent/80 text-charcoal text-sm font-medium rounded-md transition-colors"
          >
            {employee ? 'Save Changes' : 'Add Employee'}
          </button>
        </div>
      </div>
    </div>
  );
}

// Delete Confirmation Modal
function DeleteModal({ 
  isOpen, 
  onClose, 
  onConfirm, 
  employeeName 
}: { 
  isOpen: boolean; 
  onClose: () => void; 
  onConfirm: () => void;
  employeeName: string;
}) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md p-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 bg-red/10 rounded-full flex items-center justify-center">
            <Trash2 className="w-5 h-5 text-red" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-charcoal">Delete Employee</h3>
            <p className="text-sm text-slate">This action cannot be undone</p>
          </div>
        </div>
        
        <p className="text-sm text-charcoal mb-6">
          Are you sure you want to delete <strong>{employeeName}</strong>? All associated evaluation data will be permanently removed.
        </p>

        <div className="flex items-center justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm text-slate hover:text-charcoal transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="px-4 py-2 bg-red hover:bg-red/90 text-white text-sm font-medium rounded-md transition-colors"
          >
            Delete Employee
          </button>
        </div>
      </div>
    </div>
  );
}

// Main Employees Component
export function Employees() {
  const [employees, setEmployees] = useState<Employee[]>(mockEmployees);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'inactive' | 'terminated'>('all');
  const [departmentFilter, setDepartmentFilter] = useState<string>('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingEmployee, setEditingEmployee] = useState<Employee | null>(null);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [employeeToDelete, setEmployeeToDelete] = useState<Employee | null>(null);

  const itemsPerPage = 10;

  // Filter employees
  const filteredEmployees = useMemo(() => {
    return employees.filter((employee) => {
      const matchesSearch = 
        employee.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        employee.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        employee.employeeId.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesStatus = statusFilter === 'all' || employee.status === statusFilter;
      const matchesDepartment = departmentFilter === 'all' || employee.department === departmentFilter;

      return matchesSearch && matchesStatus && matchesDepartment;
    });
  }, [employees, searchQuery, statusFilter, departmentFilter]);

  // Pagination
  const totalPages = Math.ceil(filteredEmployees.length / itemsPerPage);
  const paginatedEmployees = filteredEmployees.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handleAddEmployee = (data: EmployeeFormData) => {
    const newEmployee: Employee = {
      ...data,
      id: `emp_${Date.now()}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    setEmployees([...employees, newEmployee]);
  };

  const handleEditEmployee = (data: EmployeeFormData) => {
    if (!editingEmployee) return;
    
    setEmployees(employees.map(emp => 
      emp.id === editingEmployee.id 
        ? { ...emp, ...data, updatedAt: new Date().toISOString() }
        : emp
    ));
    setEditingEmployee(null);
  };

  const handleDeleteEmployee = () => {
    if (!employeeToDelete) return;
    
    setEmployees(employees.filter(emp => emp.id !== employeeToDelete.id));
    setEmployeeToDelete(null);
    setDeleteModalOpen(false);
  };

  const openEditModal = (employee: Employee) => {
    setEditingEmployee(employee);
    setIsModalOpen(true);
  };

  const openDeleteModal = (employee: Employee) => {
    setEmployeeToDelete(employee);
    setDeleteModalOpen(true);
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-charcoal">Employees</h1>
          <p className="text-sm text-slate mt-1">Manage your employee database</p>
        </div>
        <div className="flex items-center gap-3">
          <button className="flex items-center gap-2 px-4 py-2 border border-[#e5e5e5] rounded-md text-sm text-charcoal hover:bg-gray-50 transition-colors">
            <Upload className="w-4 h-4" />
            Import
          </button>
          <button className="flex items-center gap-2 px-4 py-2 border border-[#e5e5e5] rounded-md text-sm text-charcoal hover:bg-gray-50 transition-colors">
            <Download className="w-4 h-4" />
            Export
          </button>
          <button 
            onClick={() => {
              setEditingEmployee(null);
              setIsModalOpen(true);
            }}
            className="flex items-center gap-2 px-4 py-2 bg-yellow-accent hover:bg-yellow-accent/80 text-charcoal text-sm font-medium rounded-md transition-colors"
          >
            <Plus className="w-4 h-4" />
            Add Employee
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-3 bg-white p-4 rounded-lg border border-[#e5e5e5]">
        {/* Search */}
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate" />
          <input
            type="text"
            placeholder="Search by name, email, or ID..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-[#e5e5e5] rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-charcoal/10"
          />
        </div>

        {/* Status Filter */}
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value as typeof statusFilter)}
          className="px-3 py-2 border border-[#e5e5e5] rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-charcoal/10"
        >
          <option value="all">All Status</option>
          <option value="active">Active</option>
          <option value="inactive">Inactive</option>
          <option value="terminated">Terminated</option>
        </select>

        {/* Department Filter */}
        <select
          value={departmentFilter}
          onChange={(e) => setDepartmentFilter(e.target.value)}
          className="px-3 py-2 border border-[#e5e5e5] rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-charcoal/10"
        >
          <option value="all">All Departments</option>
          {mockDepartments.map((dept) => (
            <option key={dept.id} value={dept.id}>{dept.name}</option>
          ))}
        </select>

        {/* Results count */}
        <span className="text-sm text-slate ml-auto">
          {filteredEmployees.length} employees
        </span>
      </div>

      {/* Employees Table */}
      <div className="bg-white rounded-lg border border-[#e5e5e5] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50 border-b border-[#e5e5e5]">
                <th className="text-left py-3 px-4 text-xs font-medium text-slate uppercase tracking-wider">Employee</th>
                <th className="text-left py-3 px-4 text-xs font-medium text-slate uppercase tracking-wider">Department</th>
                <th className="text-left py-3 px-4 text-xs font-medium text-slate uppercase tracking-wider">Job Title</th>
                <th className="text-left py-3 px-4 text-xs font-medium text-slate uppercase tracking-wider">Status</th>
                <th className="text-left py-3 px-4 text-xs font-medium text-slate uppercase tracking-wider">Manager</th>
                <th className="text-right py-3 px-4 text-xs font-medium text-slate uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody>
              {paginatedEmployees.map((employee) => (
                <tr key={employee.id} className="border-b border-[#e5e5e5] last:border-b-0 hover:bg-gray-50 transition-colors">
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-charcoal/10 rounded-full flex items-center justify-center">
                        <User className="w-4 h-4 text-charcoal" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-charcoal">{employee.name}</p>
                        <p className="text-xs text-slate">{employee.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    <span className="text-sm text-charcoal">{getDepartmentName(employee.department)}</span>
                  </td>
                  <td className="py-3 px-4">
                    <span className="text-sm text-charcoal">{employee.jobTitle}</span>
                  </td>
                  <td className="py-3 px-4">
                    <StatusBadge status={employee.status} />
                  </td>
                  <td className="py-3 px-4">
                    <span className="text-sm text-charcoal">
                      {employee.manager ? getDepartmentName(employee.manager) : '-'}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex items-center justify-end gap-1">
                      <button 
                        onClick={() => openEditModal(employee)}
                        className="p-1.5 text-slate hover:text-charcoal hover:bg-gray-100 rounded transition-colors"
                        title="Edit"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button 
                        onClick={() => openDeleteModal(employee)}
                        className="p-1.5 text-slate hover:text-red hover:bg-red/5 rounded transition-colors"
                        title="Delete"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between px-4 py-3 border-t border-[#e5e5e5]">
            <p className="text-sm text-slate">
              Showing {(currentPage - 1) * itemsPerPage + 1} to {Math.min(currentPage * itemsPerPage, filteredEmployees.length)} of {filteredEmployees.length} results
            </p>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="p-1.5 text-slate hover:text-charcoal disabled:opacity-50 disabled:cursor-not-allowed rounded transition-colors"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <span className="text-sm text-charcoal">
                Page {currentPage} of {totalPages}
              </span>
              <button
                onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
                className="p-1.5 text-slate hover:text-charcoal disabled:opacity-50 disabled:cursor-not-allowed rounded transition-colors"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Modals */}
      <EmployeeModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditingEmployee(null);
        }}
        employee={editingEmployee}
        onSave={editingEmployee ? handleEditEmployee : handleAddEmployee}
      />

      <DeleteModal
        isOpen={deleteModalOpen}
        onClose={() => {
          setDeleteModalOpen(false);
          setEmployeeToDelete(null);
        }}
        onConfirm={handleDeleteEmployee}
        employeeName={employeeToDelete?.name || ''}
      />
    </div>
  );
}
