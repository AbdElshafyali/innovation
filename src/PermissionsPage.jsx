import React from 'react';
import { Shield, UserPlus, Trash2 } from 'lucide-react';

const PermissionsPage = ({ users, setUsers }) => {

  // ملاحظة: بما أننا لا نملك صلاحيات مفصلة الآن،
  // هذه الصفحة ستكون مجرد واجهة لعرض المستخدمين وحذفهم.
  // يمكن تطويرها لاحقاً لإضافة صلاحيات محددة لكل مستخدم.

  const handleDeleteUser = (id) => {
    if (window.confirm('هل أنت متأكد من حذف هذا المستخدم؟ سيتم حذف كل بياناته.')) {
      setUsers(prev => prev.filter(user => user.id !== id));
    }
  };

  return (
    <div className="p-4 md:p-6 bg-gray-50 h-full overflow-y-auto">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-800 mb-6 flex items-center gap-3">
          <Shield className="text-blue-600" />
          إدارة المستخدمين والصلاحيات
        </h1>

        <div className="bg-white p-6 rounded-xl shadow-md">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">قائمة المستخدمين</h2>
            <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center gap-2 transition-colors disabled:opacity-50" disabled>
              <UserPlus size={18} />
              إضافة مستخدم
            </button>
          </div>
          <p className="text-sm text-gray-500 mb-6">
            ميزة إضافة مستخدمين جدد من هنا غير متاحة حالياً. يتم إنشاء المستخدمين من شاشة التسجيل.
          </p>

          <div className="space-y-3">
            {users.map(user => (
              <div key={user.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border hover:shadow-sm transition-shadow">
                <div className="flex items-center gap-4">
                  <img src={user.profilePic} alt={user.name} className="w-12 h-12 rounded-full object-cover border-2 border-white ring-1 ring-gray-200" />
                  <div>
                    <p className="font-bold text-gray-800">{user.name}</p>
                    <p className="text-sm text-gray-600 font-mono">{user.username}</p>
                  </div>
                </div>
                <button 
                  onClick={() => handleDeleteUser(user.id)}
                  className="text-gray-400 hover:text-red-600 p-2 rounded-full hover:bg-red-50 transition-colors"
                  title="حذف المستخدم"
                >
                  <Trash2 size={20} />
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PermissionsPage;