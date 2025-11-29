import React, { useState } from 'react';
import { UserPlus, Shield, Trash2 } from 'lucide-react';

const PermissionsPage = ({ employees = [], setEmployees }) => {
    const [newEmployeeEmail, setNewEmployeeEmail] = useState('');

    const handleAddEmployee = (e) => {
        e.preventDefault();
        if (!newEmployeeEmail.trim()) return;

        const newEmployee = {
            id: `emp_${Date.now()}`,
            email: newEmployeeEmail,
            permissions: {
                canViewInvoices: true,
                canAddInvoices: false,
                canDeleteInvoices: false,
            }
        };
        // In a real app, you'd invite this user via email. Here, we just add them.
        setEmployees(prev => [...prev, newEmployee]);
        setNewEmployeeEmail('');
    };

    return (
        <div className="flex-1 bg-gray-50 p-4 md:p-8 overflow-y-auto">
            <header className="mb-8">
                <h1 className="text-3xl font-bold text-gray-800">إدارة الموظفين والصلاحيات</h1>
                <p className="text-gray-500 mt-1">أضف موظفين جدد وتحكم في صلاحياتهم.</p>
            </header>

            {/* Add Employee Form */}
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 mb-8">
                <h3 className="text-lg font-bold text-gray-800 mb-4">إضافة موظف جديد</h3>
                <form onSubmit={handleAddEmployee} className="flex items-center gap-4">
                    <input
                        type="email"
                        value={newEmployeeEmail}
                        onChange={(e) => setNewEmployeeEmail(e.target.value)}
                        placeholder="أدخل البريد الإلكتروني للموظف"
                        className="flex-1 p-3 bg-gray-50 border border-gray-200 rounded-lg"
                    />
                    <button type="submit" className="p-3 font-bold text-white bg-blue-600 rounded-lg hover:bg-blue-700 flex items-center gap-2">
                        <UserPlus size={18} /> دعوة
                    </button>
                </form>
            </div>

            {/* Employees List */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
                <table className="w-full text-right">
                    <thead className="bg-gray-50/50 text-gray-500 text-xs uppercase font-bold border-b">
                        <tr>
                            <th className="px-6 py-4">البريد الإلكتروني</th>
                            <th className="px-6 py-4">الصلاحيات</th>
                            <th className="px-6 py-4">إجراءات</th>
                        </tr>
                    </thead>
                    {/* ... Table body would go here ... */}
                </table>
            </div>
        </div>
    );
};

export default PermissionsPage;