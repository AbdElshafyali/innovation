import React, { useState, useMemo } from 'react';
import { Users, Trash2, DollarSign, Calendar, BarChart2, Filter, UserPlus, Pencil } from 'lucide-react';
import AddEmployeeModal from './components/AddEmployeeModal';
import EditEmployeeModal from './components/EditEmployeeModal';
import ConfirmDeleteModal from './components/ConfirmDeleteModal';
import EmployeeDashboard from './components/EmployeeDashboard';
import { useNotification } from './components/NotificationContext';
import StatCard from './components/StatCard';
import { useTranslation } from 'react-i18next';
import { useSettings } from './SettingsContext';

// Extracted Details View for clarity
const EmployeeDetails = ({ employee, calculateNetSalary, onAddTransaction, showNotification }) => {
  const { t } = useTranslation();
  const { currency } = useSettings();

  return (
    <div>
      <div className="flex justify-between items-start mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">{employee.name}</h1>
          <p className="text-lg text-gray-600">{employee.position}</p>
          <p className="text-sm text-gray-500 mt-1">{employee.department}</p>
        </div>
        <div className="text-left">
          <p className="text-sm text-gray-500">{t('expected_net_salary')}</p>
          <p className="text-2xl font-bold text-green-600">{calculateNetSalary(employee).toLocaleString(undefined, { style: 'currency', currency })}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <StatCard icon={<DollarSign size={24} className="text-green-500"/>} label={t('base_salary')} value={`${employee.baseSalary.toLocaleString(undefined, { style: 'currency', currency, minimumFractionDigits: 0, maximumFractionDigits: 0 })}`} color="bg-green-100" />
        <StatCard icon={<Calendar size={24} className="text-blue-500"/>} label={t('total_advances')} value={`${(employee.transactions || []).filter(t=>t.type==='advance').reduce((s,t)=>s+t.amount,0).toLocaleString(undefined, { style: 'currency', currency, minimumFractionDigits: 0, maximumFractionDigits: 0 })}`} color="bg-blue-100" />
        <StatCard icon={<BarChart2 size={24} className="text-red-500"/>} label={t('total_deductions')} value={`${(employee.transactions || []).filter(t=>t.type==='deduction').reduce((s,t)=>s+t.amount,0).toLocaleString(undefined, { style: 'currency', currency, minimumFractionDigits: 0, maximumFractionDigits: 0 })}`} color="bg-red-100" />
      </div>

      {/* Add Transaction Form */}
      <div className="bg-white p-4 rounded-lg shadow-sm mb-6">
        <h3 className="font-bold mb-3">{t('add_new_transaction')}</h3>
        <form onSubmit={(e) => {
            e.preventDefault();
            const type = e.target.type.value;
            const amount = parseFloat(e.target.amount.value);
            const description = e.target.description.value.trim();
            const newErrors = [];

            if (isNaN(amount) || amount <= 0) {
              newErrors.push(t('amount_must_be_positive'));
            }
            if (!description) {
              newErrors.push(t('description_is_required'));
            }

            if (newErrors.length > 0) {
              showNotification(newErrors.join(' '), 'error');
              return;
            }
            onAddTransaction(employee.id, type, amount, description);
            e.target.reset();
            showNotification(t('transaction_added_successfully'), 'success');
        }} className="grid grid-cols-1 md:grid-cols-4 gap-3 items-end">
            <select name="type" className="w-full p-2 border rounded bg-gray-50">
                <option value="deduction">{t('deduction')}</option>
                <option value="advance">{t('advance')}</option>
                <option value="bonus">{t('bonus')}</option>
            </select>
            <input type="number" name="amount" placeholder={t('amount')} className="w-full p-2 border rounded" required />
            <input type="text" name="description" placeholder={t('description_reason')} className="w-full p-2 border rounded md:col-span-1" required />
            <button type="submit" className="bg-blue-600 text-white p-2 rounded-lg hover:bg-blue-700 md:col-span-1">{t('add')}</button>
        </form>
      </div>

      {/* Transactions History */}
      <div className="bg-white p-4 rounded-lg shadow-sm">
        <h3 className="font-bold mb-3">{t('transactions_history')}</h3>
        <div className="max-h-60 overflow-y-auto">
            <table className="w-full text-sm text-right">
                <thead className="text-xs text-gray-700 uppercase bg-gray-50">
                    <tr>
                        <th className="px-4 py-2">{t('date')}</th>
                        <th className="px-4 py-2">{t('type')}</th>
                        <th className="px-4 py-2">{t('amount')}</th>
                        <th className="px-4 py-2">{t('description')}</th>
                    </tr>
                </thead>
                <tbody>
                    {(employee.transactions || []).slice().reverse().map(t => (
                        <tr key={t.id} className="bg-white border-b hover:bg-gray-50">
                            <td className="px-4 py-2">{new Date(t.date).toLocaleDateString()}</td>
                            <td className="px-4 py-2">
                                <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                                    t.type === 'bonus' ? 'bg-green-100 text-green-800' :
                                    t.type === 'advance' ? 'bg-yellow-100 text-yellow-800' :
                                    'bg-red-100 text-red-800'
                                }`}>
                                    {t(t.type)}
                                </span>
                            </td>
                            <td className="px-4 py-2 font-mono">{t.amount.toLocaleString(undefined, { style: 'currency', currency, minimumFractionDigits: 0, maximumFractionDigits: 0 })}</td>
                            <td className="px-4 py-2">{t.description}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
            {(employee.transactions || []).length === 0 && <p className="text-center text-gray-500 py-4">{t('no_transactions_yet')}</p>}
        </div>
      </div>
    </div>
  );
};


const EmployeesPage = ({ employees, setEmployees }) => {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false); // New state
  const [employeeToEdit, setEmployeeToEdit] = useState(null); // New state
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [employeeToDelete, setEmployeeToDelete] = useState(null);
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [filters, setFilters] = useState({ searchTerm: '', department: 'All', status: 'All' });
  const { showNotification } = useNotification();
  const { t } = useTranslation();

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({ ...prev, [name]: value }));
  };

  const departments = useMemo(() => 
    [t('all_departments'), ...new Set(employees.map(e => e.department).filter(Boolean))]
  , [employees, t]);

  const handleAddEmployee = (employeeData) => {
    setEmployees(prev => [...prev, employeeData]);
  };

  const handleDeleteRequest = (id) => {
    setEmployeeToDelete(id);
    setIsDeleteModalOpen(true);
  };

  const confirmDelete = () => {
    setEmployees(prev => prev.filter(emp => emp.id !== employeeToDelete));
    if (selectedEmployee?.id === employeeToDelete) {
      setSelectedEmployee(null);
    }
    setEmployeeToDelete(null);
    setIsDeleteModalOpen(false);
    showNotification(t('employee_deleted_successfully'), 'success');
  };
  
  const handleUpdateEmployee = (updatedEmployee) => {
    setEmployees(prev => prev.map(emp => emp.id === updatedEmployee.id ? updatedEmployee : emp));
    if (selectedEmployee?.id === updatedEmployee.id) {
      setSelectedEmployee(updatedEmployee); // Update selected employee if it's the one being edited
    }
    setIsEditModalOpen(false);
    setEmployeeToEdit(null);
    showNotification(t('employee_updated_successfully'), 'success');
  };
  
  const handleAddTransaction = (employeeId, type, amount, description) => {
    if (!amount || !description) return;

    const newTransaction = {
      id: Date.now(),
      date: new Date().toISOString(),
      type,
      amount: parseFloat(amount),
      description,
    };

    const updatedEmployees = employees.map(emp => 
      emp.id === employeeId 
        ? { ...emp, transactions: [...emp.transactions, newTransaction] }
        : emp
    );
    setEmployees(updatedEmployees);

    // Update selected employee state as well to force re-render
    if (selectedEmployee?.id === employeeId) {
      setSelectedEmployee(updatedEmployees.find(e => e.id === employeeId));
    }
  };

  const filteredEmployees = useMemo(() => 
    employees.filter(emp => {
      const { searchTerm, department, status } = filters;
      const searchLower = searchTerm.toLowerCase();

      const matchesSearch = !searchTerm || (
        emp.name.toLowerCase().includes(searchLower) ||
        emp.position.toLowerCase().includes(searchLower) ||
        emp.email.toLowerCase().includes(searchLower)
      );
      
      const matchesDept = department === t('all_departments') || emp.department === department;
      
      const matchesStatus = status === 'All' || emp.status === status;

      return matchesSearch && matchesDept && matchesStatus;
    }), 
  [employees, filters, t]);

  const calculateNetSalary = (employee) => {
    if (!employee) return 0;
    const transactions = employee.transactions || [];
    const totalDeductions = transactions
      .filter(t => t.type === 'deduction')
      .reduce((sum, t) => sum + t.amount, 0);
    const totalBonuses = transactions
      .filter(t => t.type === 'bonus')
      .reduce((sum, t) => sum + t.amount, 0);
    return employee.baseSalary + totalBonuses - totalDeductions;
  };

  return (
    <div className="flex flex-col lg:flex-row h-full bg-gray-100">
      <AddEmployeeModal 
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onAddEmployee={handleAddEmployee}
      />
      <EditEmployeeModal // New modal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        employee={employeeToEdit}
        onUpdateEmployee={handleUpdateEmployee}
      />
      <ConfirmDeleteModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={confirmDelete}
        title={t('confirm_delete_employee')}
        message={t('confirm_delete_employee_message')}
      />

      {/* Employee List Panel */}
      <div className="w-full lg:w-[400px] lg:border-l p-4 flex flex-col bg-white shadow-lg lg:shadow-none">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2"><Users /> {t('employees_list')}</h2>
          <button 
            onClick={() => setIsAddModalOpen(true)}
            className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 flex items-center gap-2 transition-colors">
            <UserPlus size={18} />
            {t('add')}
          </button>
        </div>
        
        {/* Filter Section */}
        <div className="border rounded-lg p-3 mb-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="relative sm:col-span-2">
              <Filter size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input 
                  type="text" 
                  name="searchTerm"
                  placeholder={t('search')} 
                  value={filters.searchTerm}
                  onChange={handleFilterChange}
                  className="w-full p-2 pr-10 border rounded-lg"
              />
            </div>
            <select name="department" value={filters.department} onChange={handleFilterChange} className="w-full p-2 border rounded-lg bg-white">
              {departments.map(dept => <option key={dept} value={dept}>{dept}</option>)}
            </select>
            <select name="status" value={filters.status} onChange={handleFilterChange} className="w-full p-2 border rounded-lg bg-white">
              <option value="All">{t('all_statuses', 'All Statuses')}</option>
              <option value="Active">{t('active', 'Active')}</option>
              <option value="On Leave">{t('on_leave', 'On Leave')}</option>
              <option value="Terminated">{t('terminated', 'Terminated')}</option>
            </select>
          </div>
          <button 
            onClick={() => setFilters({ searchTerm: '', department: 'All', status: 'All' })}
            className="text-sm text-indigo-600 hover:underline w-full text-center mt-3"
          >
            {t('clear_filters')}
          </button>
        </div>

        <div className="overflow-y-auto flex-1">
          <table className="w-full text-right">
            <thead className="text-xs text-gray-500 uppercase bg-gray-50/50 sticky top-0">
              <tr>
                <th className="px-4 py-3">{t('employee')}</th>
                <th className="px-4 py-3">{t('department')}</th>
                <th className="px-4 py-3">{t('status')}</th>
                <th className="px-4 py-3"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredEmployees.length > 0 ? (
                filteredEmployees.map(emp => (
                  <tr key={emp.id} onClick={() => setSelectedEmployee(emp)} className={`cursor-pointer transition-colors ${selectedEmployee?.id === emp.id ? 'bg-indigo-100' : 'hover:bg-gray-50'}`}>
                    <td className="px-4 py-2">
                      <div className="flex items-center gap-3">
                        <img src={emp.imageUrl || `https://ui-avatars.com/api/?name=${emp.name}&background=random`} alt={emp.name} className="w-10 h-10 rounded-full object-cover" />
                        <div>
                          <p className="font-semibold text-gray-800">{emp.name}</p>
                          <p className="text-sm text-gray-500">{emp.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-2 text-sm text-gray-600">{emp.department}</td>
                    <td className="px-4 py-2">
                      <span className={`px-2.5 py-1 text-xs font-semibold rounded-full ${
                        emp.status === 'Active' ? 'bg-green-100 text-green-800' :
                        emp.status === 'On Leave' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-red-100 text-red-800'
                      }`}>
                        {t(emp.status.toLowerCase().replace(' ', '_'))}
                      </span>
                    </td>
                    <td className="px-4 py-2 flex items-center justify-end gap-2"> {/* Added flex and gap */}
                      <button 
                        onClick={(e) => { 
                          e.stopPropagation(); 
                          setEmployeeToEdit(emp); 
                          setIsEditModalOpen(true); 
                        }} 
                        className="text-gray-400 hover:text-blue-500 p-1 rounded-full hover:bg-blue-100"
                        title={t('edit_employee')}
                      >
                        <Pencil size={18} />
                      </button>
                      <button onClick={(e) => { e.stopPropagation(); handleDeleteRequest(emp.id); }} className="text-gray-400 hover:text-red-500 p-1 rounded-full hover:bg-red-100" title={t('delete_employee')}>
                        <Trash2 size={18} />
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="4" className="text-center py-10 text-gray-500">
                    <p>{t('no_employees_found')}</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 p-4 md:p-6 overflow-y-auto">
        {selectedEmployee ? (
          <EmployeeDetails 
            employee={selectedEmployee} 
            calculateNetSalary={calculateNetSalary}
            onAddTransaction={handleAddTransaction}
            showNotification={showNotification}
          />
        ) : (
          <EmployeeDashboard employees={employees} />
        )}
      </div>
    </div>
  );
};

export default EmployeesPage;
