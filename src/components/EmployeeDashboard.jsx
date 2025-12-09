import React, { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell, Sector } from 'recharts';
import { Briefcase, Users, UserCheck, UserX } from 'lucide-react';

const EmployeeDashboard = ({ employees }) => {
  const { t } = useTranslation();
  const departmentData = useMemo(() => {
    const counts = employees.reduce((acc, emp) => {
      const dept = emp.department || t('not_available', 'N/A');
      acc[dept] = (acc[dept] || 0) + 1;
      return acc;
    }, {});
    return Object.entries(counts).map(([name, value]) => ({ name, [t('number_of_employees', 'Number of Employees')]: value }));
  }, [employees, t]);

  const statusData = useMemo(() => {
    const counts = employees.reduce((acc, emp) => {
      const status = emp.status || t('not_available', 'N/A');
      acc[status] = (acc[status] || 0) + 1;
      return acc;
    }, {});
    return Object.entries(counts).map(([name, value]) => ({ name, value }));
  }, [employees, t]);

  const COLORS = {
    'Active': '#22c55e',
    'On Leave': '#f59e0b',
    'Terminated': '#ef4444',
  };

  const totalEmployees = employees.length;
  const averageSalary = totalEmployees > 0 ? (employees.reduce((sum, emp) => sum + emp.baseSalary, 0) / totalEmployees) : 0;

  const renderActiveShape = (props) => {
    // ... (omitted for brevity - standard recharts active shape logic)
    const { cx, cy, innerRadius, outerRadius, startAngle, endAngle, fill, payload } = props;
    return (
      <g>
        <text x={cx} y={cy} dy={-5} textAnchor="middle" fill="#333" className="font-bold text-lg">{t(payload.name.toLowerCase().replace(' ', '_'), payload.name)}</text>
        <text x={cx} y={cy} dy={15} textAnchor="middle" fill="#666">{t('count_employee', '( {{count}} employee )', { count: payload.value })}</text>
        <Sector
          cx={cx}
          cy={cy}
          innerRadius={innerRadius}
          outerRadius={outerRadius}
          startAngle={startAngle}
          endAngle={endAngle}
          fill={fill}
        />
        <Sector
          cx={cx}
          cy={cy}
          startAngle={startAngle}
          endAngle={endAngle}
          innerRadius={outerRadius + 6}
          outerRadius={outerRadius + 10}
          fill={fill}
        />
      </g>
    );
  };
  
  const [activeIndex, setActiveIndex] = React.useState(0);
  const onPieEnter = (_, index) => setActiveIndex(index);


  return (
    <div className="bg-white p-4 md:p-6 rounded-2xl shadow-md mb-6 border">
      <h3 className="text-xl font-bold text-gray-800 mb-6">{t('employees_dashboard_title', 'Employees Dashboard')}</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {/* Stat Cards */}
        <div className="bg-blue-50 p-4 rounded-xl flex items-center gap-4">
            <div className="p-3 rounded-full bg-blue-200"><Users size={24} className="text-blue-600"/></div>
            <div><p className="text-sm text-blue-800">{t('total_employees', 'Total Employees')}</p><p className="text-2xl font-bold text-blue-900">{totalEmployees}</p></div>
        </div>
        <div className="bg-green-50 p-4 rounded-xl flex items-center gap-4">
            <div className="p-3 rounded-full bg-green-200"><UserCheck size={24} className="text-green-600"/></div>
            <div><p className="text-sm text-green-800">{t('average_salary', 'Average Salary')}</p><p className="text-2xl font-bold text-green-900">{averageSalary.toLocaleString('ar-EG', { style: 'currency', currency: 'EGP' })}</p></div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Department Bar Chart */}
        <div className="h-80">
          <h4 className="font-semibold text-gray-700 mb-2">{t('employee_distribution_by_department', 'Employee Distribution by Department')}</h4>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={departmentData} layout="vertical" margin={{ top: 5, right: 20, left: 10, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" horizontal={false} />
              <XAxis type="number" allowDecimals={false} />
              <YAxis dataKey="name" type="category" width={80} tick={{fontSize: 12}} />
              <Tooltip cursor={{fill: 'rgba(239, 246, 255, 0.5)'}} formatter={(value) => [`${value} ${t('employee_singular', 'employee')}`, t('the_number', 'The Number')]} />
              <Bar dataKey={t('number_of_employees', 'Number of Employees')} fill="#4f46e5" barSize={20} />
            </BarChart>
          </ResponsiveContainer>
        </div>
        
        {/* Status Pie Chart */}
        <div className="h-80">
          <h4 className="font-semibold text-gray-700 mb-2">{t('employee_status', 'Employee Status')}</h4>
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                activeIndex={activeIndex}
                activeShape={renderActiveShape}
                data={statusData}
                cx="50%"
                cy="50%"
                innerRadius={70}
                outerRadius={90}
                dataKey="value"
                onMouseEnter={onPieEnter}
              >
                {statusData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[entry.name] || '#8884d8'} />
                ))}
              </Pie>
              <Legend iconType="circle" formatter={(value) => t(value.toLowerCase().replace(' ', '_'), value)} />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default EmployeeDashboard;
