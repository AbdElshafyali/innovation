import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Search, Filter, Calendar, ImageIcon } from 'lucide-react';

const InvoicesDashboard = ({ invoices }) => {
  const { t } = useTranslation();
  const [searchTerm, setSearchTerm] = useState('');

  const filteredInvoices = invoices.filter(inv => {
    const searchLower = searchTerm.toLowerCase();
    return (
      inv.description?.toLowerCase().includes(searchLower) ||
      inv.amount?.toLowerCase().includes(searchLower) ||
      inv.id.toString().includes(searchLower)
    );
  });

  return (
    <div className="flex-1 bg-gray-50 p-4 md:p-8 overflow-y-auto">
      <header className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800 mb-1">{t('invoices_log_title', 'Invoices Log')}</h1>
        <p className="text-gray-500 text-sm">{t('invoices_log_subtitle', 'Search and filter your invoices with ease')}</p>
      </header>

      <div className="bg-white p-3 rounded-xl border border-gray-200 shadow-sm mb-6">
        <div className="relative w-full">
          <Search size={18} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder={t('search_invoices_placeholder', 'Search by invoice number, amount, or description...')}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-gray-50 border border-gray-200 rounded-lg pr-10 pl-4 py-2 outline-none text-sm"
          />
        </div>
      </div>

      {/* Mobile View: Cards */}
      <div className="grid grid-cols-1 gap-4 md:hidden">
        {filteredInvoices.map((inv) => (
          <div key={inv.id} className="bg-white rounded-xl shadow-sm border p-4 space-y-3">
            <div className="flex justify-between items-center">
              <p className="font-bold text-gray-800">#{inv.id}</p>
              <span className={`px-2.5 py-1 rounded-lg text-xs font-bold ${inv.type === 'فاتورة مبيعات' ? 'bg-purple-100 text-purple-700' : 'bg-orange-100 text-orange-700'}`}>
                {inv.type}
              </span>
            </div>
            <p className="text-gray-600 text-sm" title={inv.description}>{inv.description || '-'}</p>
            <div className="flex justify-between items-end text-sm border-t pt-3">
              <div className="text-gray-500">
                <p className="font-mono">{inv.date}</p>
                <p className="font-bold text-lg text-gray-800">{inv.amount}</p>
              </div>
              {inv.imageUrl ? (
                <img src={inv.imageUrl} alt="preview" className="w-16 h-16 rounded-lg object-cover border" />
              ) : (
                <div className="w-16 h-16 bg-gray-50 rounded-lg flex items-center justify-center text-gray-300"><ImageIcon size={20} /></div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Desktop View: Table */}
      <div className="hidden md:block bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
        <table className="w-full text-right">
          <thead className="bg-gray-50/50 text-gray-500 text-xs uppercase font-bold border-b">
            <tr>
              <th className="px-6 py-4">{t('invoice_no', 'Invoice No.')}</th>
              <th className="px-6 py-4">{t('invoice_type', 'Type')}</th>
              <th className="px-6 py-4">{t('description', 'Description')}</th>
              <th className="px-6 py-4 flex items-center gap-1">{t('date', 'Date')} <Calendar size={12} /></th>
              <th className="px-6 py-4">{t('amount', 'Amount')}</th>
              <th className="px-6 py-4">{t('image', 'Image')}</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {filteredInvoices.map((inv) => (
              <tr key={inv.id} className="hover:bg-indigo-50/30 transition-colors group">
                <td className="px-6 py-4 font-medium text-gray-800">#{inv.id}</td>
                <td className="px-6 py-4"><span className={`px-2.5 py-1 rounded-lg text-xs font-bold ${inv.type === 'فاتورة مبيعات' ? 'bg-purple-100 text-purple-700' : 'bg-orange-100 text-orange-700'}`}>{inv.type}</span></td>
                <td className="px-6 py-4 text-gray-600 text-sm max-w-[200px] truncate" title={inv.description}>{inv.description || '-'}</td>
                <td className="px-6 py-4 text-gray-600 text-sm font-mono">{inv.date}</td>
                <td className="px-6 py-4 font-bold text-gray-800">{inv.amount}</td>
                <td className="px-6 py-4">{inv.imageUrl ? <img src={inv.imageUrl} alt="preview" className="w-10 h-10 rounded-lg object-cover border-2 border-transparent group-hover:border-indigo-200" /> : <div className="w-10 h-10 bg-gray-50 rounded-lg flex items-center justify-center text-gray-300"><ImageIcon size={16} /></div>}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {filteredInvoices.length === 0 && (
        <div className="text-center py-20 text-gray-400">
          <div className="flex flex-col items-center gap-3">
            <div className="bg-gray-100 p-4 rounded-full"><Filter size={32} /></div>
            <p>{t('no_invoices', 'No invoices found.')}</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default InvoicesDashboard;
