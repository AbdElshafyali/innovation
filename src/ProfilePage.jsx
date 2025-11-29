import React, { useState } from 'react';
import { Loader2, MailCheck, PhoneCall, ShieldCheck, Clock } from 'lucide-react';

const ProfilePage = ({ currentUser, setCurrentUser }) => {
  const [isEmailVerifying, setIsEmailVerifying] = useState(false);
  const [isPhoneVerifying, setIsPhoneVerifying] = useState(false);

  const handleVerifyEmail = () => {
    setIsEmailVerifying(true);
    setTimeout(() => {
      setCurrentUser(prev => ({ ...prev, isEmailVerified: true }));
      setIsEmailVerifying(false);
    }, 2000);
  };

  const handleVerifyPhone = () => {
    setIsPhoneVerifying(true);
    setTimeout(() => {
      setCurrentUser(prev => ({ ...prev, isPhoneVerified: true }));
      setIsPhoneVerifying(false);
    }, 2000);
  };

  const InfoCard = ({ title, children }) => (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
      <h3 className="text-lg font-bold text-gray-800 mb-4 border-b pb-3">{title}</h3>
      <div className="space-y-4">{children}</div>
    </div>
  );

  const InfoRow = ({ label, value, verified, onVerify, isVerifying }) => (
    <div className="flex items-center justify-between">
      <div>
        <p className="text-sm text-gray-500">{label}</p>
        <p className="font-semibold text-gray-700">{value}</p>
      </div>
      {verified ? (
        <span className="flex items-center gap-1.5 text-xs font-bold bg-green-100 text-green-700 px-3 py-1 rounded-full"><ShieldCheck size={14} /> تم التأكيد</span>
      ) : (
        <button onClick={onVerify} disabled={isVerifying} className="flex items-center gap-1.5 text-xs font-bold bg-blue-100 text-blue-700 px-3 py-1 rounded-full hover:bg-blue-200 disabled:opacity-50">
          {isVerifying ? <Loader2 size={14} className="animate-spin" /> : (label === 'البريد الإلكتروني' ? <MailCheck size={14} /> : <PhoneCall size={14} />)}
          {isVerifying ? 'جارِ التحقق...' : 'تأكيد'}
        </button>
      )}
    </div>
  );

  return (
    <div className="flex-1 bg-gray-50 p-4 md:p-8 overflow-y-auto">
      <header className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800">الملف الشخصي</h1>
        <p className="text-gray-500 mt-1">إدارة معلومات حسابك وتفضيلاتك.</p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <InfoCard title="المعلومات الأساسية">
            <div className="flex items-center gap-4">
              <img src={currentUser.profilePic} alt="Profile" className="w-20 h-20 rounded-full object-cover shadow-md" />
              <div>
                <p className="text-xl font-bold text-gray-800">{currentUser.name}</p>
                <p className="text-gray-500">@{currentUser.nickname}</p>
              </div>
            </div>
          </InfoCard>

          <InfoCard title="معلومات الاتصال">
            <InfoRow label="البريد الإلكتروني" value={currentUser.email} verified={currentUser.isEmailVerified} onVerify={handleVerifyEmail} isVerifying={isEmailVerifying} />
            <InfoRow label="رقم الهاتف" value={currentUser.phone} verified={currentUser.isPhoneVerified} onVerify={handleVerifyPhone} isVerifying={isPhoneVerifying} />
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">الدولة</p>
                <p className="font-semibold text-gray-700">{currentUser.country}</p>
              </div>
            </div>
          </InfoCard>
        </div>

        <div className="lg:col-span-1">
          <InfoCard title="الأمان">
            <div className="space-y-4">
              <p className="text-sm text-gray-600">
                حافظ على أمان حسابك. يمكنك هنا إضافة خيارات مثل المصادقة الثنائية (2FA).
              </p>
              <button className="w-full text-left flex items-center gap-3 p-3 rounded-xl hover:bg-slate-100">
                <ShieldCheck size={20} className="shrink-0 text-blue-600" />
                <span className="font-medium">تفعيل المصادقة الثنائية</span>
              </button>
              <button className="w-full text-left flex items-center gap-3 p-3 rounded-xl hover:bg-slate-100">
                <Clock size={20} className="shrink-0 text-blue-600" />
                <span className="font-medium">عرض سجل النشاط</span>
              </button>
            </div>
          </InfoCard>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
