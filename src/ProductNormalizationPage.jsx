import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Tag, Check, Plus } from 'lucide-react';
import { useLocalStorage } from './useLocalStorage';

// Mock data for unrecognized items from invoices
const mockUnrecognizedItems = [
  { id: 1, name: 'جبنه استبولي', invoiceId: 'INV-001', addedAt: Date.now() },
  { id: 2, name: 'لبن جاف', invoiceId: 'INV-002', addedAt: Date.now() - 1000 * 60 * 5 },
  { id: 3, name: 'شاي ليبتون فتلة', invoiceId: 'INV-003', addedAt: Date.now() - 1000 * 60 * 10 },
  { id: 4, name: 'مياة معدنية', invoiceId: 'INV-004', addedAt: Date.now() - 1000 * 60 * 15 },
];

const ProductNormalizationPage = ({ products, setProducts, currentUser }) => {
  const { t } = useTranslation();
  const [unrecognizedItems, setUnrecognizedItems] = useState(mockUnrecognizedItems);
  const [selectedProduct, setSelectedProduct] = useState({}); // { unrecognizedItemId: selectedProductId }
  const [normalizationLogs, setNormalizationLogs] = useLocalStorage('normalization_logs_db', []);

  const handleSelectionChange = (unrecognizedItemId, selectedProductId) => {
    setSelectedProduct(prev => ({
      ...prev,
      [unrecognizedItemId]: selectedProductId,
    }));
  };

  const addLog = (action, item, details) => {
    const newLog = {
      logId: `log_${Date.now()}`,
      userId: currentUser.id,
      userName: currentUser.name,
      action: action, // 'mapped' or 'created'
      itemName: item.name,
      invoiceId: item.invoiceId,
      timestamp: new Date().toISOString(),
      processingTime: (Date.now() - item.addedAt) / 1000, // in seconds
      ...details, // e.g., { mappedTo: 'Product Name' } or { createdProduct: 'Product Name' }
    };
    setNormalizationLogs(prev => [newLog, ...prev]);
  };

  const handleMapProduct = (unrecognizedItem) => {
    const targetProductId = selectedProduct[unrecognizedItem.id];
    if (!targetProductId) {
      // In a real app, use a toast notification
      alert(t('select_product_to_map_alert', 'Please select a product to map to.')); 
      return;
    }

    const targetProduct = products.find(p => p.id === targetProductId);

    addLog('mapped', unrecognizedItem, { mappedTo: targetProduct.name });
    
    console.log(`Mapping '${unrecognizedItem.name}' to product '${targetProduct.name}'`);
    setUnrecognizedItems(prev => prev.filter(item => item.id !== unrecognizedItem.id));
  };

  const handleCreateNewProduct = (unrecognizedItem) => {
    const newProduct = {
      id: `prod_${Date.now()}`,
      name: unrecognizedItem.name,
      category: 'Uncategorized',
      stock: 0,
      price: 0,
    };

    addLog('created', unrecognizedItem, { createdProduct: newProduct.name });
    
    setProducts(prev => [...prev, newProduct]);
    console.log(`Creating new product:`, newProduct);

    setUnrecognizedItems(prev => prev.filter(item => item.id !== unrecognizedItem.id));
  };

  return (
    <div className="p-4 md:p-8 flex-1 overflow-y-auto">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800 dark:text-white mb-2">{t('product_normalization')}</h1>
          <p className="text-gray-500 dark:text-gray-400">
            {t('product_normalization_subtitle', 'Review unrecognized product names from invoices and map them to existing products or create new ones.')}
          </p>
        </div>

        {unrecognizedItems.length > 0 ? (
          <div className="space-y-4">
            {unrecognizedItems.map(item => (
              <div key={item.id} className="bg-white dark:bg-slate-800 p-4 rounded-lg shadow-md border border-gray-200 dark:border-slate-700 flex flex-col md:flex-row items-center gap-4">
                <div className="flex-1">
                  <p className="font-bold text-lg text-blue-600 dark:text-blue-400">{item.name}</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">{t('from_invoice', 'From Invoice')}: {item.invoiceId}</p>
                </div>
                
                <div className="w-full md:w-auto flex flex-col sm:flex-row gap-2">
                  <div className="flex-1">
                    <select
                      className="w-full p-2 border rounded-md bg-gray-50 dark:bg-slate-700 dark:border-slate-600 focus:ring-2 focus:ring-blue-500"
                      onChange={(e) => handleSelectionChange(item.id, e.target.value)}
                      value={selectedProduct[item.id] || ''}
                    >
                      <option value="" disabled>{t('select_existing_product', 'Select existing product...')}</option>
                      {products.map(p => (
                        <option key={p.id} value={p.id}>{p.name}</option>
                      ))}
                    </select>
                  </div>

                  <button 
                    onClick={() => handleMapProduct(item)}
                    disabled={!selectedProduct[item.id]}
                    className="flex items-center justify-center gap-2 p-2 px-4 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
                  >
                    <Tag size={16} />
                    {t('map_product', 'Map')}
                  </button>

                  <button 
                    onClick={() => handleCreateNewProduct(item)}
                    className="flex items-center justify-center gap-2 p-2 px-4 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
                  >
                    <Plus size={16} />
                    {t('create_new', 'Create New')}
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12 bg-white dark:bg-slate-800 rounded-lg shadow-md">
            <Check size={48} className="mx-auto text-green-500" />
            <h2 className="mt-4 text-xl font-semibold">{t('all_caught_up', 'All Caught Up!')}</h2>
            <p className="mt-2 text-gray-500 dark:text-gray-400">{t('no_items_to_normalize', 'There are no new items to normalize at the moment.')}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductNormalizationPage;
