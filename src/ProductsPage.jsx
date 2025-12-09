import React, { useState, useMemo, useRef } from 'react';
import { Package, Trash2, Filter, PackagePlus, Edit, Upload, Download } from 'lucide-react';
import AddProductModal from './components/AddProductModal';
import ConfirmDeleteModal from './components/ConfirmDeleteModal';
import ProductDashboard from './components/ProductDashboard';
import * as XLSX from 'xlsx'; // Import the xlsx library
import { useNotification } from './components/NotificationContext';
import { useTranslation } from 'react-i18next';
import { useSettings } from './SettingsContext';

const ProductsPage = ({ products, setProducts }) => {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [productToDelete, setProductToDelete] = useState(null);
  const [filters, setFilters] = useState({ searchTerm: '', category: 'All' });
  const { showNotification } = useNotification();
  const { t } = useTranslation();
  const { currency } = useSettings();

  const fileInputRef = useRef(null); // Ref for the hidden file input

  // Add a new product
  const handleAddProduct = (productData) => {
    setProducts(prev => [productData, ...prev]);
  };

  // Request to delete a product
  const handleDeleteRequest = (id) => {
    setProductToDelete(id);
    setIsDeleteModalOpen(true);
  };

  // Confirm deletion
  const confirmDelete = () => {
    setProducts(prev => prev.filter(p => p.id !== productToDelete));
    setProductToDelete(null);
    setIsDeleteModalOpen(false);
    showNotification(t('product_deleted_successfully'), 'success');
  };

  // Handle filter changes
  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({ ...prev, [name]: value }));
  };

  // Memoized categories for filter dropdown
  const categories = useMemo(() => 
    [t('all_categories'), ...new Set(products.map(p => p.category).filter(Boolean))]
  , [products, t]);

  // Memoized filtered products
  const filteredProducts = useMemo(() => 
    products.filter(p => {
      const { searchTerm, category } = filters;
      const searchLower = searchTerm.toLowerCase();

      const matchesSearch = !searchTerm ||
        p.name.toLowerCase().includes(searchLower) ||
        p.sku.toLowerCase().includes(searchLower);
      
      const matchesCategory = category === t('all_categories') || p.category === category;

      return matchesSearch && matchesCategory;
    }), 
  [products, filters, t]);

  // Handle download template
  const handleDownloadTemplate = () => {
    const ws_data = [
      ["name", "sku", "category", "price", "stock", "imageUrl"], // Headers
      [t('demo_product_1'), "SKU001", t('electronics'), 150.75, 100, "https://via.placeholder.com/40"],
      [t('demo_product_2'), "SKU002", t('clothing'), 25.00, 200, "https://via.placeholder.com/40"],
    ];
    const ws = XLSX.utils.aoa_to_sheet(ws_data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Products Template");
    XLSX.writeFile(wb, "products_template.xlsx");
  };

  // Trigger file input click
  const handleImportClick = () => {
    fileInputRef.current.click();
  };

  // Handle product import from Excel
  const handleImportProducts = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const data = new Uint8Array(e.target.result);
        const workbook = XLSX.read(data, { type: 'array' });
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        const json = XLSX.utils.sheet_to_json(worksheet);

        const imported = json.map(row => ({
          id: Date.now() + Math.random(), // Generate unique ID
          name: row.name || t('untitled_product'),
          sku: row.sku ? String(row.sku) : `SKU-${Date.now()}`,
          category: row.category || t('uncategorized'),
          price: parseFloat(row.price) || 0,
          stock: parseInt(row.stock, 10) || 0,
          imageUrl: row.imageUrl || '',
        })).filter(p => p.name && p.sku); // Filter out rows that are too malformed

        if (imported.length > 0) {
          setProducts(prev => [...prev, ...imported]);
          showNotification(t('products_imported_successfully', { count: imported.length }), 'success');
        } else {
          showNotification(t('no_valid_products_found'), 'warning');
        }
      };
      reader.onerror = () => {
        showNotification(t('error_reading_file'), 'error');
      };
      reader.readAsArrayBuffer(file);
    } else {
      showNotification(t('please_select_file_to_import'), 'warning');
    }
  };

  return (
    <div className="flex-1 bg-gray-50 p-4 md:p-8 overflow-y-auto">
      <AddProductModal 
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onAddProduct={handleAddProduct}
      />
      <ConfirmDeleteModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={confirmDelete}
        title={t('confirm_delete_product')}
        message={t('confirm_delete_product_message')}
      />

      {/* Hidden file input */}
      <input 
        type="file" 
        ref={fileInputRef} 
        onChange={handleImportProducts} 
        accept=".xlsx, .xls" 
        style={{ display: 'none' }} 
      />

      <header className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-3">
            <Package />
            {t('products_management')}
          </h1>
          <p className="text-gray-500 text-sm">{t('products_management_subtitle')}</p>
        </div>
        <div className="mt-4 md:mt-0 flex gap-2">
          <button 
            onClick={handleDownloadTemplate}
            className="bg-gray-200 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-300 flex items-center gap-2 transition-colors">
            <Download size={18} />
            {t('import_template')}
          </button>
          <button 
            onClick={handleImportClick}
            className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 flex items-center gap-2 transition-colors">
            <Upload size={18} />
            {t('import_excel')}
          </button>
          <button 
            onClick={() => setIsAddModalOpen(true)}
            className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 flex items-center gap-2 transition-colors">
            <PackagePlus size={18} />
            {t('add_product')}
          </button>
        </div>
      </header>

      <ProductDashboard products={products} />

      {/* Filters and Table Container */}
      <div className="bg-white rounded-xl shadow-sm border p-4">
        {/* Filter Bar */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-4">
          <div className="relative md:col-span-2">
            <Filter size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input 
                type="text" 
                name="searchTerm"
                placeholder={t('search_by_name_or_sku')} 
                value={filters.searchTerm}
                onChange={handleFilterChange}
                className="w-full p-2 pr-10 border rounded-lg"
            />
          </div>
          <select name="category" value={filters.category} onChange={handleFilterChange} className="w-full p-2 border rounded-lg bg-white">
            {categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
          </select>
        </div>
        
        {/* Products Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-right">
            <thead className="text-xs text-gray-500 uppercase bg-gray-50/50 sticky top-0">
              <tr>
                <th className="px-4 py-3">{t('product')}</th>
                <th className="px-4 py-3">{t('sku')}</th>
                <th className="px-4 py-3">{t('category')}</th>
                <th className="px-4 py-3">{t('price')}</th>
                <th className="px-4 py-3">{t('stock')}</th>
                <th className="px-4 py-3 text-center">{t('actions')}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredProducts.length > 0 ? (
                filteredProducts.map(p => (
                  <tr key={p.id} className="hover:bg-gray-50">
                    <td className="px-4 py-2">
                      <div className="flex items-center gap-3">
                        <img src={p.imageUrl || 'https://via.placeholder.com/40'} alt={p.name} className="w-10 h-10 rounded-lg object-cover" />
                        <span className="font-semibold text-gray-800">{p.name}</span>
                      </div>
                    </td>
                    <td className="px-4 py-2 font-mono text-gray-600">{p.sku}</td>
                    <td className="px-4 py-2 text-gray-600">{p.category}</td>
                    <td className="px-4 py-2 font-semibold text-gray-800">{p.price.toLocaleString(undefined, { style: 'currency', currency })}</td>
                    <td className="px-4 py-2">
                      <span className={`px-2.5 py-1 text-sm font-bold rounded-full ${p.stock > 10 ? 'text-green-800 bg-green-100' : p.stock > 0 ? 'text-yellow-800 bg-yellow-100' : 'text-red-800 bg-red-100'}`}>
                        {p.stock}
                      </span>
                    </td>
                    <td className="px-4 py-2 text-center">
                      <div className="flex items-center justify-center gap-2" onClick={(e) => e.stopPropagation()}>
                         <button onClick={() => showNotification(t('edit_not_implemented'), 'info')} className="text-gray-400 hover:text-blue-500 p-1"><Edit size={18} /></button>
                         <button onClick={() => handleDeleteRequest(p.id)} className="text-gray-400 hover:text-red-500 p-1"><Trash2 size={18} /></button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="text-center py-16 text-gray-500">
                    <Package size={48} className="mx-auto mb-2" />
                    <h3 className="text-lg font-semibold">{t('no_products')}</h3>
                    <p className="text-sm">{t('no_products_subtitle')}</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ProductsPage;
