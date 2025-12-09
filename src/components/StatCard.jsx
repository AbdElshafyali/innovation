import React from 'react';

const StatCard = ({ icon, label, value, color }) => (
  <div className="bg-white p-4 rounded-lg shadow-sm flex items-center gap-4">
    <div className={`p-3 rounded-full ${color}`}>{icon}</div>
    <div>
      <p className="text-sm text-gray-500">{label}</p>
      <p className="text-xl font-bold text-gray-800">{String(value).toLocaleString()}</p>
    </div>
  </div>
);

export default StatCard;
