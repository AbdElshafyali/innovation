import React, { useState } from 'react';
import { X, UserPlus } from 'lucide-react';
import { useNotification } from './NotificationContext';

const AddEmployeeModal = ({ isOpen, onClose, onAddEmployee }) => {
  const { showNotification } = useNotification();
  const initialState = {
    name: '',
    email: '',
    phone: '',
    position: '',
    department: '',
    hireDate: '',
    baseSalary: '',
    imageUrl: '',
    status: 'Active',
  };
  const [formData, setFormData] = useState(initialState);
  // const [errors, setErrors] = useState({}); // Removed local error state

  const handleInputChange = (e) => {
    const { name, value, files } = e.target;
    if (name === 'imageUrl' && files && files[0]) {
      const file = files[0];
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData(prev => ({ ...prev, imageUrl: reader.result }));
      };
      reader.readAsDataURL(file);
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const validateForm = () => {
    const newErrors = [];
    if (!formData.name) newErrors.push('الاسم مطلوب.');
    else if (formData.name.length < 3) newErrors.push('الاسم يجب أن لا يقل عن 3 أحرف.');
    if (!formData.email) newErrors.push('البريد الإلكتروني مطلوب.');
    else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.push('صيغة البريد الإلكتروني غير صحيحة.');
    if (!formData.position) newErrors.push('المنصب مطلوب.');
    else if (formData.position.length < 3) newErrors.push('المنصب يجب أن لا يقل عن 3 أحرف.');
    if (!formData.department) newErrors.push('القسم مطلوب.');
    else if (formData.department.length < 2) newErrors.push('القسم يجب أن لا يقل عن حرفين.');
    if (!formData.hireDate) newErrors.push('تاريخ التعيين مطلوب.');
    if (!formData.baseSalary || parseFloat(formData.baseSalary) <= 0) newErrors.push('يجب أن يكون الراتب الأساسي رقمًا موجبًا.');
    else if (isNaN(parseFloat(formData.baseSalary))) newErrors.push('الراتب الأساسي يجب أن يكون رقماً.');
    if (formData.phone && !/^\d{10,15}$/.test(formData.phone)) newErrors.push('صيغة رقم الهاتف غير صحيحة (يجب أن يكون 10-15 رقم).');
    
    if (newErrors.length > 0) {
      showNotification(newErrors.join(' '), 'error');
      return false;
    }
    return true;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validateForm()) {
      return;
    }

    onAddEmployee({
      ...formData,
      id: Date.now(),
      baseSalary: parseFloat(formData.baseSalary),
      transactions: [],
      attendance: [],
    });
    setFormData(initialState);
    onClose();
    showNotification('تم إضافة الموظف بنجاح!', 'success');
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl p-6 md:p-8 mx-4 max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-3">
            <UserPlus size={28} className="text-indigo-600" />
            إضافة موظف جديد
          </h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X size={24} />
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">اسم الموظف</label>
              <input type="text" name="name" value={formData.name} onChange={handleInputChange} placeholder="مثال: أحمد محمد" className="w-full p-2 border rounded-lg border-gray-300" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">البريد الإلكتروني</label>
              <input type="email" name="email" value={formData.email} onChange={handleInputChange} placeholder="example@company.com" className="w-full p-2 border rounded-lg border-gray-300" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">رقم الهاتف</label>
              <input type="tel" name="phone" value={formData.phone} onChange={handleInputChange} placeholder="01xxxxxxxxx" className="w-full p-2 border rounded-lg border-gray-300" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">تاريخ التعيين</label>
              <input type="date" name="hireDate" value={formData.hireDate} onChange={handleInputChange} className="w-full p-2 border rounded-lg border-gray-300" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">المنصب الوظيفي</label>
              <input type="text" name="position" value={formData.position} onChange={handleInputChange} placeholder="مثال: مطور برمجيات" className="w-full p-2 border rounded-lg border-gray-300" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">القسم</label>
              <input type="text" name="department" value={formData.department} onChange={handleInputChange} placeholder="مثال: تكنولوجيا المعلومات" className="w-full p-2 border rounded-lg border-gray-300" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">الراتب الأساسي (ج.م)</label>
              <input type="number" name="baseSalary" value={formData.baseSalary} onChange={handleInputChange} placeholder="5000" className="w-full p-2 border rounded-lg border-gray-300" />
            </div>
             <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">الحالة</label>
              <select name="status" value={formData.status} onChange={handleInputChange} className="w-full p-2 border rounded-lg border-gray-300 bg-white">
                <option value="Active">نشط</option>
                <option value="On Leave">في إجازة</option>
                <option value="Terminated">منتهية خدمته</option>
              </select>
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">صورة الموظف (اختياري)</label>
              <div className="mt-1 flex items-center gap-4">
                {formData.imageUrl ? (
                  <img src={formData.imageUrl} alt="Preview" className="w-20 h-20 rounded-full object-cover" />
                ) : (
                  <div className="w-20 h-20 rounded-full bg-gray-100 flex items-center justify-center text-gray-400">
                    <UserPlus size={32} />
                  </div>
                )}
                <input 
                  type="file"
                  name="imageUrl"
                  accept="image/*"
                  onChange={handleInputChange}
                  className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-600 hover:file:bg-indigo-100"
                />
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-4 pt-4">
            <button type="button" onClick={onClose} className="px-6 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200">
              إلغاء
            </button>
            <button type="submit" className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 flex items-center gap-2">
              <UserPlus size={18} />
              حفظ الموظف
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddEmployeeModal;
