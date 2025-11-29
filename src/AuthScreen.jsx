import React, { useState, useRef } from 'react';
import { Sparkles, Camera, Briefcase, User as UserIcon } from 'lucide-react';

const AuthScreen = ({ onLoginSuccess, users, setUsers }) => {
    const arabCountries = [
        { name: 'مصر', code: 'EG', key: '+20', flag: '🇪🇬', phoneLength: 10 },
        { name: 'السعودية', code: 'SA', key: '+966', flag: '🇸🇦', phoneLength: 9 },
        { name: 'الإمارات', code: 'AE', key: '+971', flag: '🇦🇪', phoneLength: 9 },
    ];

    const [isLogin, setIsLogin] = useState(true);
    const [accountType, setAccountType] = useState('company'); // 'company' or 'employee'
    const [name, setName] = useState('');
    const [nickname, setNickname] = useState('');
    const [email, setEmail] = useState('');
    const [country, setCountry] = useState(arabCountries[0]);
    const [phone, setPhone] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [profilePic, setProfilePic] = useState(null);
    const [passwordStrength, setPasswordStrength] = useState({ score: 0, label: 'ضعيف', color: 'bg-red-500' });
    const [error, setError] = useState('');
    const fileInputRef = useRef(null);

    const handleRegister = (e) => {
        e.preventDefault();
        setError('');
        if (!name || !nickname || !email || !phone || !password || !confirmPassword || !profilePic) {
            setError('الرجاء ملء جميع الحقول وتحميل صورة شخصية.');
            return;
        }
        if (password !== confirmPassword) {
            setError('كلمتا المرور غير متطابقتين.');
            return;
        }
        if (passwordStrength.score < 2) {
            setError('يجب أن تكون قوة كلمة المرور "متوسط" على الأقل.');
            return;
        }
        const phoneRegex = /^[0-9]+$/;
        if (!phoneRegex.test(phone) || phone.length !== country.phoneLength) {
            setError(`رقم الهاتف يجب أن يتكون من ${country.phoneLength} أرقام.`);
            return;
        }

        const newUser = {
            id: `user_${Date.now()}`,
            name, nickname, email, accountType,
            phone: `${country.key}${phone}`,
            profilePic, country: country.name,
            isEmailVerified: false, isPhoneVerified: false,
            password, // In a real app, you'd hash this on the server
        };

        // Add user to our fake DB and log them in
        setUsers(prev => [...prev, newUser]);
        onLoginSuccess(newUser);
    };

    const handleLogin = (e) => {
        e.preventDefault();
        setError('');
        if (!email || !password) {
            setError('الرجاء إدخال البريد الإلكتروني وكلمة المرور.');
            return;
        }
        // Find user in our fake DB
        const foundUser = users.find(u => u.email === email && u.password === password);
        if (foundUser) {
            onLoginSuccess(foundUser);
        } else {
            setError('البريد الإلكتروني أو كلمة المرور غير صحيحة.');
        }
    };

    const handlePasswordChange = (pass) => {
        const arabicRegex = /[\u0600-\u06FF]/;
        if (arabicRegex.test(pass)) {
            setError('كلمة المرور لا يمكن أن تحتوي على حروف عربية.');
            return;
        }
        setError('');
        setPassword(pass);
        let score = 0;
        if (pass.length > 8) score++;
        if (/[A-Z]/.test(pass)) score++;
        if (/[0-9]/.test(pass)) score++;
        if (/[^A-Za-z0-9]/.test(pass)) score++;
        if (score <= 1) setPasswordStrength({ score, label: 'ضعيف', color: 'bg-red-500' });
        else if (score <= 3) setPasswordStrength({ score, label: 'متوسط', color: 'bg-yellow-500' });
        else setPasswordStrength({ score, label: 'قوي', color: 'bg-green-500' });
    };

    const handleImageUpload = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => setProfilePic(reader.result);
            reader.readAsDataURL(file);
        }
    };

    return (
        <div dir="rtl" className="flex items-center justify-center min-h-screen bg-slate-100 font-sans p-4">
            <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-2xl shadow-xl">
                <div className="text-center">
                    <div className="inline-block bg-gradient-to-tr from-blue-600 to-purple-600 p-3 rounded-xl shadow-lg mb-4"><Sparkles size={32} className="text-white" /></div>
                    <h1 className="text-2xl font-bold text-gray-800">{isLogin ? 'تسجيل الدخول' : 'إنشاء حساب جديد'}</h1>
                    <p className="text-gray-500 mt-2">{isLogin ? 'مرحباً بعودتك!' : 'انضم إلينا لإدارة فواتيرك بذكاء.'}</p>
                </div>

                <form onSubmit={isLogin ? handleLogin : handleRegister} className="space-y-4">
                    {!isLogin && (
                        <>
                            <div className="flex flex-col items-center">
                                <input type="file" accept="image/*" ref={fileInputRef} onChange={handleImageUpload} className="hidden" />
                                <div onClick={() => fileInputRef.current.click()} className="relative cursor-pointer group">
                                    <img src={profilePic || 'https://via.placeholder.com/100'} alt="Profile" className="w-24 h-24 rounded-full object-cover border-4 border-white shadow-md" />
                                    <div className="absolute inset-0 bg-black/50 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"><Camera size={24} className="text-white" /></div>
                                </div>
                                <label className="text-sm font-bold text-gray-600 block mt-2">الصورة الشخصية</label>
                            </div>

                            <div>
                                <label className="text-sm font-bold text-gray-600 block mb-2">نوع الحساب</label>
                                <div className="grid grid-cols-2 gap-2">
                                    <button type="button" onClick={() => setAccountType('company')} className={`flex items-center justify-center gap-2 p-3 rounded-lg border-2 transition-all ${accountType === 'company' ? 'border-blue-600 bg-blue-50' : 'border-gray-200 bg-gray-50'}`}>
                                        <Briefcase size={16} /> <span className="font-bold">شركة</span>
                                    </button>
                                    <button type="button" onClick={() => setAccountType('employee')} className={`flex items-center justify-center gap-2 p-3 rounded-lg border-2 transition-all ${accountType === 'employee' ? 'border-blue-600 bg-blue-50' : 'border-gray-200 bg-gray-50'}`}>
                                        <UserIcon size={16} /> <span className="font-bold">موظف</span>
                                    </button>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="text-sm font-bold text-gray-600 block mb-2">الاسم الكامل</label>
                                    <input type="text" value={name} onChange={(e) => setName(e.target.value)} className="w-full p-3 bg-gray-50 border border-gray-200 rounded-lg" placeholder="اسمك الكامل" />
                                </div>
                                <div>
                                    <label className="text-sm font-bold text-gray-600 block mb-2">اللقب</label>
                                    <input type="text" value={nickname} onChange={(e) => setNickname(e.target.value)} className="w-full p-3 bg-gray-50 border border-gray-200 rounded-lg" placeholder="اللقب" />
                                </div>
                            </div>
                        </>
                    )}

                    <div>
                        <label className="text-sm font-bold text-gray-600 block mb-2">البريد الإلكتروني</label>
                        <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full p-3 bg-gray-50 border border-gray-200 rounded-lg" placeholder="example@mail.com" />
                    </div>

                    {!isLogin && (
                        <div>
                            <label className="text-sm font-bold text-gray-600 block mb-2">رقم الهاتف</label>
                            <div className="flex">
                                <select value={country.code} onChange={(e) => setCountry(arabCountries.find(c => c.code === e.target.value))} className="bg-gray-100 border border-gray-200 rounded-r-lg p-3 outline-none">
                                    {arabCountries.map(c => <option key={c.code} value={c.code}>{c.flag} {c.key}</option>)}
                                </select>
                                <input type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} className="w-full p-3 bg-gray-50 border-t border-b border-l border-gray-200 rounded-l-lg" placeholder="1012345678" />
                            </div>
                        </div>
                    )}

                    <div>
                        <label className="text-sm font-bold text-gray-600 block mb-2">كلمة المرور</label>
                        <input type="password" value={password} onChange={(e) => handlePasswordChange(e.target.value)} className="w-full p-3 bg-gray-50 border border-gray-200 rounded-lg" placeholder="••••••••" />
                    </div>

                    {!isLogin && (
                        <>
                            <div className="w-full bg-gray-200 rounded-full h-2.5">
                                <div className={`h-2.5 rounded-full transition-all duration-300 ${passwordStrength.color}`} style={{ width: `${(passwordStrength.score / 4) * 100}%` }}></div>
                            </div>
                            <p className="text-xs text-center text-gray-500">قوة كلمة المرور: <span className="font-bold">{passwordStrength.label}</span></p>

                            <div>
                                <label className="text-sm font-bold text-gray-600 block mb-2">تأكيد كلمة المرور</label>
                                <input type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} className="w-full p-3 bg-gray-50 border border-gray-200 rounded-lg" placeholder="••••••••" />
                            </div>
                        </>
                    )}

                    {error && <p className="text-red-500 text-sm text-center">{error}</p>}

                    <button type="submit" className="w-full p-3 font-bold text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors">
                        {isLogin ? 'دخول' : 'إنشاء حساب'}
                    </button>
                </form>

                <p className="text-center text-sm text-gray-600">
                    {isLogin ? 'ليس لديك حساب؟' : 'لديك حساب بالفعل؟'}{' '}
                    <button onClick={() => setIsLogin(!isLogin)} className="font-bold text-blue-600 hover:underline">
                        {isLogin ? 'أنشئ حساباً' : 'سجل الدخول'}
                    </button>
                </p>
            </div>
        </div>
    );
};

export default AuthScreen;