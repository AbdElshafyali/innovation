import React, { useMemo } from 'react';
import { LayoutDashboard, Users, Package, FileText } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useSettings } from './SettingsContext';
import StatCard from './components/StatCard';

const DashboardPage = ({ employees, products, invoices }) => {
  const { t } = useTranslation();
  const { currency } = useSettings();

  // Employee Stats
  const totalEmployees = employees.length;
  const activeEmployees = employees.filter(emp => emp.status === 'Active').length;
  const employeesByDepartment = useMemo(() => {
    const counts = employees.reduce((acc, emp) => {
      const dept = emp.department || t('unspecified');
      acc[dept] = (acc[dept] || 0) + 1;
      return acc;
    }, {});
    return Object.entries(counts).map(([name, value]) => ({ name, value }));
  }, [employees, t]);

  // Product Stats
  const totalProducts = products.length;
  const totalStock = products.reduce((sum, p) => sum + p.stock, 0);
  const productsByCategory = useMemo(() => {
    const counts = products.reduce((acc, p) => {
      const cat = p.category || t('unspecified');
      acc[cat] = (acc[cat] || 0) + 1;
      return acc;
    }, {});
    return Object.entries(counts).map(([name, value]) => ({ name, value }));
  }, [products, t]);

  // Invoice Stats (simplified for dashboard overview)
  const totalInvoices = invoices.length;
  const totalSales = invoices.reduce((sum, inv) => sum + (parseFloat(inv.amount) || 0), 0);
  const latestInvoices = useMemo(() => invoices.slice(0, 5), [invoices]); // Get last 5 invoices

  return (
    <div className="flex-1 bg-gray-50 p-4 md:p-8 overflow-y-auto">
      <header className="mb-8">
        <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-3">
          <LayoutDashboard />
          {t('dashboard')}
        </h1>
        <p className="text-gray-500 text-sm">{t('dashboard_subtitle')}</p>
      </header>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard 
          icon={<Users size={24} className="text-blue-600"/>} 
          label={t('total_employees')} 
          value={totalEmployees} 
          color="bg-blue-100" 
        />
        <StatCard 
          icon={<Package size={24} className="text-purple-600"/>} 
          label={t('total_products')} 
          value={totalProducts} 
          color="bg-purple-100" 
        />
        <StatCard 
          icon={<Package size={24} className="text-green-600"/>} 
          label={t('total_stock')} 
          value={totalStock} 
          color="bg-green-100" 
        />
        <StatCard 
          icon={<FileText size={24} className="text-orange-600"/>} 
          label={t('total_invoices')} 
          value={totalInvoices} 
          color="bg-orange-100" 
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Invoices */}
        <div className="bg-white p-6 rounded-2xl shadow-md border">
          <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
            <FileText size={20} /> {t('latest_invoices')}
          </h2>
          {latestInvoices.length > 0 ? (
            <ul className="divide-y divide-gray-200">
              {latestInvoices.map(inv => (
                <li key={inv.id} className="py-3 flex justify-between items-center">
                  <div>
                    <p className="font-semibold text-gray-800">{t('invoice_no')}{inv.id}</p>
                    <p className="text-sm text-gray-500">{inv.description || t('no_description')}</p>
                  </div>
                  <p className="font-bold text-green-600">{parseFloat(inv.amount).toLocaleString(undefined, { style: 'currency', currency })}</p>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-center text-gray-500 py-8">{t('no_recent_invoices')}</p>
          )}
        </div>

        {/* Employee Summary (simplified) */}
        <div className="bg-white p-6 rounded-2xl shadow-md border">
          <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
            <Users size={20} /> {t('employees_summary')}
          </h2>
          <div className="flex justify-between items-center mb-4">
            <p className="text-gray-600">{t('active_employees')}</p>
            <p className="font-bold text-gray-800">{activeEmployees} / {totalEmployees}</p>
          </div>
          {employeesByDepartment.length > 0 ? (
            <div>
              <p className="text-gray-600 mb-2">{t('employees_by_department')}</p>
              <ul className="space-y-1">
                {employeesByDepartment.map(data => (
                  <li key={data.name} className="flex justify-between text-sm text-gray-700">
                    <span>{data.name}</span>
                    <span>{data.value}</span>
                  </li>
                ))}
              </ul>
            </div>
          ) : (
            <p className="text-center text-gray-500 py-8">{t('no_employee_data')}</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
