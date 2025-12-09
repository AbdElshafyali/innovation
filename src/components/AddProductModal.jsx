import React, { useState } from 'react';
import { X, PackagePlus } from 'lucide-react';
import { useNotification } from './NotificationContext';

const AddProductModal = ({ isOpen, onClose, onAddProduct }) => {
  const initialState = {
    name: '',
    sku: '',
    category: '',
    price: '',
    stock: '',
    imageUrl: '',
  };
  const [formData, setFormData] = useState(initialState);
  // const [errors, setErrors] = useState({}); // Removed local error state
  const { showNotification } = useNotification();

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
    if (!formData.name) newErrors.push('اسم المنتج مطلوب.');
    if (!formData.sku) newErrors.push('SKU مطلوب.');
    if (!formData.category) newErrors.push('الفئة مطلوبة.');
    if (!formData.price || parseFloat(formData.price) <= 0) newErrors.push('يجب أن يكون السعر رقمًا موجبًا.');
    if (formData.stock === '' || parseInt(formData.stock, 10) < 0) newErrors.push('يجب أن تكون الكمية رقمًا غير سالب.');
    
    if (newErrors.length > 0) {
      showNotification(newErrors.join(' '), 'error');
      return false;
    }
    return true;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    onAddProduct({
      ...formData,
      id: Date.now(),
      price: parseFloat(formData.price),
      stock: parseInt(formData.stock, 10),
    });
    setFormData(initialState);
    onClose();
    showNotification('تم إضافة المنتج بنجاح!', 'success');
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl shadow-2xl w-full max-w-xl p-6 md:p-8 mx-4 max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-3">
            <PackagePlus size={28} className="text-indigo-600" />
            إضافة منتج جديد
          </h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X size={24} />
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">اسم المنتج</label>
              <input type="text" name="name" value={formData.name} onChange={handleInputChange} className="w-full p-2 border rounded-lg border-gray-300" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">SKU (رقم التعريف)</label>
              <input type="text" name="sku" value={formData.sku} onChange={handleInputChange} className="w-full p-2 border rounded-lg border-gray-300" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">الفئة</label>
              <input type="text" name="category" value={formData.category} onChange={handleInputChange} className="w-full p-2 border rounded-lg border-gray-300" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">السعر (ج.م)</label>
              <input type="number" name="price" value={formData.price} onChange={handleInputChange} className="w-full p-2 border rounded-lg border-gray-300" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">كمية المخزون</label>
              <input type="number" name="stock" value={formData.stock} onChange={handleInputChange} className="w-full p-2 border rounded-lg border-gray-300" />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">صورة المنتج (اختياري)</label>
              <div className="mt-1 flex items-center gap-4">
                {formData.imageUrl ? (
                  <img src={formData.imageUrl} alt="Preview" className="w-20 h-20 rounded-lg object-cover" />
                ) : (
                  <div className="w-20 h-20 rounded-lg bg-gray-100 flex items-center justify-center text-gray-400">
                    <PackagePlus size={32} />
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
              <PackagePlus size={18} />
              حفظ المنتج
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddProductModal;
