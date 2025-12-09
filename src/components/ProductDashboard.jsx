import React, { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell, Sector } from 'recharts';
import { Package, DollarSign, Box } from 'lucide-react';

const ProductDashboard = ({ products }) => {
  const { t } = useTranslation();
  const productsByCategoryData = useMemo(() => {
    const counts = products.reduce((acc, p) => {
      const category = p.category || t('uncategorized', 'Uncategorized');
      acc[category] = (acc[category] || 0) + 1;
      return acc;
    }, {});
    return Object.entries(counts).map(([name, value]) => ({ name, [t('number_of_products', 'Number of Products')]: value }));
  }, [products, t]);

  const stockByCategoryData = useMemo(() => {
    const stockAmounts = products.reduce((acc, p) => {
      const category = p.category || t('uncategorized', 'Uncategorized');
      acc[category] = (acc[category] || 0) + p.stock;
      return acc;
    }, {});
    return Object.entries(stockAmounts).map(([name, value]) => ({ name, value }));
  }, [products, t]);

  const COLORS = ['#8884d8', '#82ca9d', '#ffc658', '#ff7300', '#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

  const totalProducts = products.length;
  const totalStockQuantity = products.reduce((sum, p) => sum + p.stock, 0);
  const totalStockValue = products.reduce((sum, p) => sum + (p.price * p.stock), 0);
  
  const renderActiveShape = (props) => {
    const { cx, cy, innerRadius, outerRadius, startAngle, endAngle, fill, payload, percent, value } = props;
    return (
      <g>
        <text x={cx} y={cy} dy={-5} textAnchor="middle" fill="#333" className="font-bold text-lg">{payload.name}</text>
        <text x={cx} y={cy} dy={15} textAnchor="middle" fill="#666">{`( ${value} | ${(percent * 100).toFixed(0)}% )`}</text>
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
      <h3 className="text-xl font-bold text-gray-800 mb-6">{t('products_dashboard', 'Products Dashboard')}</h3>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        {/* Stat Cards */}
        <div className="bg-blue-50 p-4 rounded-xl flex items-center gap-4">
            <div className="p-3 rounded-full bg-blue-200"><Package size={24} className="text-blue-600"/></div>
            <div><p className="text-sm text-blue-800">{t('total_products', 'Total Products')}</p><p className="text-2xl font-bold text-blue-900">{totalProducts}</p></div>
        </div>
        <div className="bg-green-50 p-4 rounded-xl flex items-center gap-4">
            <div className="p-3 rounded-full bg-green-200"><Box size={24} className="text-green-600"/></div>
            <div><p className="text-sm text-green-800">{t('total_stock', 'Total Stock')}</p><p className="text-2xl font-bold text-green-900">{totalStockQuantity}</p></div>
        </div>
        <div className="bg-purple-50 p-4 rounded-xl flex items-center gap-4">
            <div className="p-3 rounded-full bg-purple-200"><DollarSign size={24} className="text-purple-600"/></div>
            <div><p className="text-sm text-purple-800">{t('total_stock_value', 'Total Stock Value')}</p><p className="text-2xl font-bold text-purple-900">{totalStockValue.toLocaleString('ar-EG', { style: 'currency', currency: 'EGP' })}</p></div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Products by Category Bar Chart */}
        <div className="h-80">
          <h4 className="font-semibold text-gray-700 mb-2">{t('products_by_category', 'Products by Category')}</h4>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={productsByCategoryData} layout="vertical" margin={{ top: 5, right: 20, left: 10, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" horizontal={false} />
              <XAxis type="number" allowDecimals={false} />
              <YAxis dataKey="name" type="category" width={100} tick={{fontSize: 12}} />
              <Tooltip cursor={{fill: 'rgba(239, 246, 255, 0.5)'}} formatter={(value) => [`${value} ${t('product_singular', 'product')}`, t('the_number', 'The Number')]} />
              <Bar dataKey={t('number_of_products', 'Number of Products')} fill="#4f46e5" barSize={20} />
            </BarChart>
          </ResponsiveContainer>
        </div>
        
        {/* Stock by Category Pie Chart */}
        <div className="h-80">
          <h4 className="font-semibold text-gray-700 mb-2">{t('stock_by_category', 'Stock by Category')}</h4>
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                activeIndex={activeIndex}
                activeShape={renderActiveShape}
                data={stockByCategoryData}
                cx="50%"
                cy="50%"
                innerRadius={70}
                outerRadius={90}
                dataKey="value"
                onMouseEnter={onPieEnter}
              >
                {stockByCategoryData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Legend iconType="circle" formatter={(value) => t(value.toLowerCase(), value)} />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default ProductDashboard;
