import React, { useState, useEffect } from 'react';
import { 
  X, 
  UserCheck, 
  Shield, 
  Eye, 
  EyeOff,
  Sliders, 
  Lock, 
  Key,
  RefreshCw,
  CheckSquare, 
  Square,
  Sparkles,
  Phone,
  Mail,
  Briefcase,
  AlertCircle,
  Trash2
} from 'lucide-react';
import { useCMMS } from '../../context/CMMSContext';
import { UserAccount, UserRole, UserPermissions } from '../../types';

export const UserAccountModal: React.FC = () => {
  const { 
    isUserModalOpen, 
    setIsUserModalOpen, 
    editingUser, 
    setEditingUser, 
    addUser, 
    updateUser,
    deleteUser,
    requestDeleteConfirmation,
    currentUser 
  } = useCMMS();

  const [fullName, setFullName] = useState('');
  const [username, setUsername] = useState('');
  const [pinCode, setPinCode] = useState('1234');
  const [showPin, setShowPin] = useState(false);
  const [roleTitle, setRoleTitle] = useState('');
  const [role, setRole] = useState<UserRole>('TECHNICIAN');
  const [department, setDepartment] = useState('إدارة الصيانة الميكانيكية والكهربائية');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [isActive, setIsActive] = useState(true);
  const [isSuperDeveloper, setIsSuperDeveloper] = useState(false);
  const [notes, setNotes] = useState('');

  const defaultPermissions: UserPermissions = {
    canViewDashboard: true,
    canViewAssets: true,
    canViewWorkOrders: true,
    canViewMeters: true,
    canViewPreventive: true,
    canViewWarehouse: true,
    canViewShiftReport: true,
    canViewReports: true,
    canViewDeveloperHub: false,
    canManageAssets: false,
    canManageWorkOrders: false,
    canManageMeters: false,
    canManagePreventive: false,
    canManageWarehouse: false,
    canManageShifts: false,
    canManageUsers: false,
  };

  const [permissions, setPermissions] = useState<UserPermissions>(defaultPermissions);

  const generateRandomPin = () => {
    const code = Math.floor(1000 + Math.random() * 9000).toString();
    setPinCode(code);
  };

  useEffect(() => {
    if (editingUser) {
      setFullName(editingUser.fullName);
      setUsername(editingUser.username);
      setPinCode(editingUser.pinCode || editingUser.password || '1234');
      setRoleTitle(editingUser.roleTitle);
      setRole(editingUser.role);
      setDepartment(editingUser.department);
      setEmail(editingUser.email || '');
      setPhone(editingUser.phone || '');
      setIsActive(editingUser.isActive);
      setIsSuperDeveloper(!!editingUser.isSuperDeveloper);
      setPermissions(editingUser.permissions || defaultPermissions);
      setNotes(editingUser.notes || '');
    } else {
      setFullName('');
      setUsername('');
      setPinCode(Math.floor(1000 + Math.random() * 9000).toString());
      setRoleTitle('فني صيانة ميكانيكية');
      setRole('TECHNICIAN');
      setDepartment('إدارة الصيانة الميكانيكية والكهربائية');
      setEmail('');
      setPhone('');
      setIsActive(true);
      setIsSuperDeveloper(false);
      setPermissions({
        ...defaultPermissions,
        canManageWorkOrders: true,
      });
      setNotes('');
    }
  }, [editingUser, isUserModalOpen]);

  if (!isUserModalOpen) return null;

  const handleClose = () => {
    setIsUserModalOpen(false);
    setEditingUser(null);
  };

  const togglePermission = (key: keyof UserPermissions) => {
    setPermissions(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  // Quick preset handlers
  const applyPreset = (presetType: 'DEVELOPER' | 'ENGINEER' | 'TECHNICIAN' | 'STOREKEEPER' | 'AUDITOR') => {
    if (presetType === 'DEVELOPER') {
      setRole('DEVELOPER');
      setRoleTitle('مطور النظام ومدير الصيانة');
      setPermissions({
        canViewDashboard: true,
        canViewAssets: true,
        canViewWorkOrders: true,
        canViewMeters: true,
        canViewPreventive: true,
        canViewWarehouse: true,
        canViewShiftReport: true,
        canViewReports: true,
        canViewDeveloperHub: true,
        canManageAssets: true,
        canManageWorkOrders: true,
        canManageMeters: true,
        canManagePreventive: true,
        canManageWarehouse: true,
        canManageShifts: true,
        canManageUsers: true,
      });
    } else if (presetType === 'ENGINEER') {
      setRole('MAINTENANCE_ENGINEER');
      setRoleTitle('مهندس صيانة خطوط الطباعة');
      setPermissions({
        canViewDashboard: true,
        canViewAssets: true,
        canViewWorkOrders: true,
        canViewMeters: true,
        canViewPreventive: true,
        canViewWarehouse: true,
        canViewShiftReport: true,
        canViewReports: true,
        canViewDeveloperHub: false,
        canManageAssets: true,
        canManageWorkOrders: true,
        canManageMeters: true,
        canManagePreventive: true,
        canManageWarehouse: false,
        canManageShifts: true,
        canManageUsers: false,
      });
    } else if (presetType === 'TECHNICIAN') {
      setRole('TECHNICIAN');
      setRoleTitle('فني صيانة وتشغيل');
      setPermissions({
        canViewDashboard: true,
        canViewAssets: true,
        canViewWorkOrders: true,
        canViewMeters: true,
        canViewPreventive: true,
        canViewWarehouse: true,
        canViewShiftReport: true,
        canViewReports: false,
        canViewDeveloperHub: false,
        canManageAssets: false,
        canManageWorkOrders: true,
        canManageMeters: true,
        canManagePreventive: true,
        canManageWarehouse: false,
        canManageShifts: false,
        canManageUsers: false,
      });
    } else if (presetType === 'STOREKEEPER') {
      setRole('STOREKEEPER');
      setRoleTitle('أمين مستودع قطع الغيار');
      setDepartment('مستودع الصيانة وقطع الغيار');
      setPermissions({
        canViewDashboard: true,
        canViewAssets: true,
        canViewWorkOrders: true,
        canViewMeters: false,
        canViewPreventive: false,
        canViewWarehouse: true,
        canViewShiftReport: true,
        canViewReports: false,
        canViewDeveloperHub: false,
        canManageAssets: false,
        canManageWorkOrders: false,
        canManageMeters: false,
        canManagePreventive: false,
        canManageWarehouse: true,
        canManageShifts: false,
        canManageUsers: false,
      });
    } else if (presetType === 'AUDITOR') {
      setRole('AUDITOR');
      setRoleTitle('مشرف ومراقب جودة وتشغيل');
      setPermissions({
        canViewDashboard: true,
        canViewAssets: true,
        canViewWorkOrders: true,
        canViewMeters: true,
        canViewPreventive: true,
        canViewWarehouse: true,
        canViewShiftReport: true,
        canViewReports: true,
        canViewDeveloperHub: false,
        canManageAssets: false,
        canManageWorkOrders: false,
        canManageMeters: false,
        canManagePreventive: false,
        canManageWarehouse: false,
        canManageShifts: false,
        canManageUsers: false,
      });
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName.trim()) return;

    const initials = fullName
      .trim()
      .split(' ')
      .map((w) => w[0])
      .join('')
      .slice(0, 2)
      .toUpperCase() || 'US';

    const safeUsername = username.trim() || `user_${Date.now().toString(36)}`;
    const safePin = pinCode.trim() || '1234';

    if (editingUser) {
      updateUser({
        ...editingUser,
        fullName: fullName.trim(),
        username: safeUsername,
        pinCode: safePin,
        password: safePin,
        roleTitle: roleTitle.trim(),
        role,
        department: department.trim(),
        email: email.trim(),
        phone: phone.trim(),
        isActive,
        isSuperDeveloper,
        permissions,
        notes: notes.trim(),
      });
    } else {
      addUser({
        username: safeUsername,
        fullName: fullName.trim(),
        avatarInitials: initials,
        pinCode: safePin,
        password: safePin,
        roleTitle: roleTitle.trim(),
        role,
        department: department.trim(),
        email: email.trim(),
        phone: phone.trim(),
        isActive,
        isSuperDeveloper: false,
        permissions,
        notes: notes.trim(),
      });
    }

    handleClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-sm overflow-y-auto animate-in fade-in">
      <div 
        className="bg-[#1e293b] border border-[#334155] rounded-2xl w-full max-w-3xl shadow-2xl overflow-hidden text-right font-sans text-slate-100 my-8"
        role="dialog"
      >
        {/* Header */}
        <div className="p-5 bg-gradient-to-r from-blue-950/40 via-[#1e293b] to-[#1e293b] border-b border-[#334155] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-600/20 border border-blue-500/40 flex items-center justify-center text-blue-400">
              <Shield className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">
                {editingUser ? `تعديل حساب وصلاحيات: ${editingUser.fullName}` : 'إنشاء حساب مستخدم جديد وتحديد الصلاحيات'}
              </h3>
              <p className="text-xs text-slate-400">
                إشراف مطور النظام: <span className="text-blue-400 font-bold">م. علي رضا</span>
              </p>
            </div>
          </div>
          <button
            onClick={handleClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-[#334155] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6 max-h-[80vh] overflow-y-auto">
          {/* Quick Presets Bar */}
          <div className="p-4 rounded-xl bg-[#0f172a] border border-[#334155] space-y-2">
            <div className="flex items-center gap-2 text-xs font-bold text-slate-300">
              <Sparkles className="w-4 h-4 text-amber-400" />
              <span>قوالب الصلاحيات السريعة (Role Presets):</span>
            </div>
            <div className="flex flex-wrap gap-2 pt-1">
              <button
                type="button"
                onClick={() => applyPreset('DEVELOPER')}
                className="px-3 py-1.5 rounded-lg text-xs font-bold bg-purple-600/20 text-purple-300 border border-purple-500/40 hover:bg-purple-600/30 transition-colors"
              >
                ★ مطور / مدير كامل الصلاحيات
              </button>
              <button
                type="button"
                onClick={() => applyPreset('ENGINEER')}
                className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-blue-600/20 text-blue-300 border border-blue-500/40 hover:bg-blue-600/30 transition-colors"
              >
                مهندس صيانة معتمد
              </button>
              <button
                type="button"
                onClick={() => applyPreset('TECHNICIAN')}
                className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-cyan-600/20 text-cyan-300 border border-cyan-500/40 hover:bg-cyan-600/30 transition-colors"
              >
                فني صيانة ميداني
              </button>
              <button
                type="button"
                onClick={() => applyPreset('STOREKEEPER')}
                className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-amber-600/20 text-amber-300 border border-amber-500/40 hover:bg-amber-600/30 transition-colors"
              >
                أمين مستودع قطع الغيار
              </button>
              <button
                type="button"
                onClick={() => applyPreset('AUDITOR')}
                className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-slate-700/60 text-slate-300 border border-slate-600 hover:bg-slate-700 transition-colors"
              >
                مشرف / قراءة فقط
              </button>
            </div>
          </div>

          {/* User Profile Fields */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-300">الاسم الكامل للمستخدم *</label>
              <input
                type="text"
                required
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="مثال: م. أحمد فهد"
                className="w-full bg-[#0f172a] border border-[#334155] rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-blue-500"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-300">المسمى الوظيفي والصفة *</label>
              <input
                type="text"
                required
                value={roleTitle}
                onChange={(e) => setRoleTitle(e.target.value)}
                placeholder="مثال: مهندس صيانة ميكانيكية"
                className="w-full bg-[#0f172a] border border-[#334155] rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-blue-500"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-300">اسم المستخدم / رقم التعريف</label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="مثال: eng_ahmed_m"
                className="w-full bg-[#0f172a] border border-[#334155] rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-blue-500 font-mono"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-300">الدور النظامي (System Role)</label>
              <select
                value={role}
                onChange={(e) => setRole(e.target.value as UserRole)}
                className="w-full bg-[#0f172a] border border-[#334155] rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-blue-500"
              >
                <option value="DEVELOPER">مطور النظام (Full Developer)</option>
                <option value="MAINTENANCE_MANAGER">مدير إدارة الصيانة (Manager)</option>
                <option value="MAINTENANCE_ENGINEER">مهندس صيانة (Engineer)</option>
                <option value="TECHNICIAN">فني صيانة وتنفيذ (Technician)</option>
                <option value="STOREKEEPER">أمين مستودع (Storekeeper)</option>
                <option value="OPERATOR">مشغل خط إنتاج (Operator)</option>
                <option value="AUDITOR">مراقب جودة وتدقيق (Auditor)</option>
              </select>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-300">القسم / الإدارة</label>
              <input
                type="text"
                value={department}
                onChange={(e) => setDepartment(e.target.value)}
                placeholder="مثال: صيانة خطوط الروتوغرافور"
                className="w-full bg-[#0f172a] border border-[#334155] rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-blue-500"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-300">رقم الهاتف الداخلي / الجوال</label>
              <input
                type="text"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="مثال: 07800000000 أو تحويلة 104"
                className="w-full bg-[#0f172a] border border-[#334155] rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-blue-500 font-mono"
              />
            </div>
          </div>

          {/* Authentication Credentials Section */}
          <div className="p-4 rounded-xl bg-gradient-to-r from-blue-950/40 via-[#0f172a] to-[#0f172a] border border-blue-500/30 space-y-3">
            <div className="flex items-center justify-between border-b border-[#334155] pb-2.5">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-blue-600/20 border border-blue-500/40 flex items-center justify-center text-blue-400">
                  <Key className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-white flex items-center gap-1.5">
                    <span>بيانات اعتماد تسجيل الدخول والرمز السري (Login Credentials)</span>
                    <span className="text-[10px] px-1.5 py-0.2 rounded bg-blue-500/20 text-blue-300 font-mono font-bold">مطلوب</span>
                  </h4>
                  <p className="text-[11px] text-slate-400">
                    الاسم والرمز السري اللذان سيستخدمهما هذا الحساب عند فتح شاشة تسجيل الدخول إلى الموقع
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={generateRandomPin}
                className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-[#1e293b] hover:bg-[#334155] text-slate-300 hover:text-white border border-[#334155] text-[11px] transition-colors"
                title="توليد رمز عشوائي جديد"
              >
                <RefreshCw className="w-3 h-3 text-blue-400" />
                <span>توليد رمز جديد</span>
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              {/* Login Username */}
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-200 flex items-center justify-between">
                  <span>اسم المستخدم لتسجيل الدخول (Username) *</span>
                  <span className="text-[10px] text-slate-500 font-mono">حروف إنجليزية أو أرقام</span>
                </label>
                <div className="relative">
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 font-mono text-xs">@</span>
                  <input
                    type="text"
                    required
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="مثال: ali.reda أو tech.hassan"
                    className="w-full bg-[#1e293b] border border-[#334155] rounded-xl pr-8 pl-3 py-2 text-sm text-white focus:outline-none focus:border-blue-500 font-mono"
                  />
                </div>
                <p className="text-[10px] text-slate-400">
                  سيقوم المستخدم بكتابة هذا الاسم في خانة تسجيل الدخول
                </p>
              </div>

              {/* Login PIN / Passcode */}
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-200 flex items-center justify-between">
                  <span>رمز الدخول السري / كلمة المرور (PIN Code) *</span>
                  <span className="text-[10px] text-amber-400/90 font-mono font-bold">الرمز السري</span>
                </label>
                <div className="relative">
                  <div className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500">
                    <Lock className="w-3.5 h-3.5" />
                  </div>
                  <input
                    type={showPin ? 'text' : 'password'}
                    required
                    value={pinCode}
                    onChange={(e) => setPinCode(e.target.value)}
                    placeholder="مثال: 1234 أو كود من 4 أرقام"
                    className="w-full bg-[#1e293b] border border-[#334155] rounded-xl pr-8 pl-10 py-2 text-sm text-white focus:outline-none focus:border-blue-500 font-mono tracking-wider font-bold"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPin(!showPin)}
                    className="absolute left-2.5 top-1/2 -translate-y-1/2 p-1 text-slate-400 hover:text-slate-200"
                    title={showPin ? 'إخفاء الرمز' : 'إظهار الرمز'}
                  >
                    {showPin ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                <p className="text-[10px] text-slate-400">
                  الرمز أو الرقم السري للتحقق عند الدخول (يمكن تعديله في أي وقت من لوحة المطور)
                </p>
              </div>
            </div>
          </div>

          {/* Account Status Toggle */}
          <div className="flex items-center justify-between p-3.5 rounded-xl bg-[#0f172a] border border-[#334155]">
            <div>
              <span className="font-bold text-xs text-white block">حالة تفعيل الحساب في المنظومة</span>
              <span className="text-[11px] text-slate-400">إذا تم التعطيل لن يتمكن المستخدم من الوصول لأي بيانات أو تسجيل دخول</span>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={isActive}
                disabled={editingUser?.isSuperDeveloper}
                onChange={(e) => setIsActive(e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-slate-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-600"></div>
            </label>
          </div>

          {/* Permissions Matrix Checklist */}
          <div className="space-y-4 pt-2">
            <div className="border-b border-[#334155] pb-2 flex items-center justify-between">
              <h4 className="text-sm font-bold text-white flex items-center gap-2">
                <Sliders className="w-4 h-4 text-blue-400" />
                <span>مصفوفة الصلاحيات التفصيلية (ماذا يرى وماذا يغير)</span>
              </h4>
              <span className="text-xs text-slate-400 font-mono">
                {Object.values(permissions).filter(Boolean).length} / {Object.keys(permissions).length} مفعل
              </span>
            </div>

            {/* Section 1: Viewing Permissions */}
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-xs font-bold text-cyan-400">
                <Eye className="w-3.5 h-3.5" />
                <span>1. صلاحيات العرض والمشاهدة (View Permissions):</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {[
                  { key: 'canViewDashboard', label: 'لوحة المؤشرات العامة والجاهزية (Dashboard)' },
                  { key: 'canViewAssets', label: 'سجل الأصول والماكينات والباركود (Assets)' },
                  { key: 'canViewWorkOrders', label: 'أوامر العمل والبلاغات (Work Orders)' },
                  { key: 'canViewMeters', label: 'العدادات وأجهزة القياس (Meters)' },
                  { key: 'canViewPreventive', label: 'الصيانة الوقائية الاحترافية (PM Plans)' },
                  { key: 'canViewWarehouse', label: 'مستودع قطع الغيار والمخزون (Warehouse)' },
                  { key: 'canViewShiftReport', label: 'تقرير الدوريات الهندسية والتفتيشية (Patrol Report)' },
                  { key: 'canViewReports', label: 'التقارير التحليلية والمؤشرات الفنية' },
                  { key: 'canViewDeveloperHub', label: 'لوحة المطور وإدارة الحسابات (Developer Hub)' },
                ].map((item) => {
                  const isChecked = !!permissions[item.key as keyof UserPermissions];
                  return (
                    <button
                      key={item.key}
                      type="button"
                      onClick={() => togglePermission(item.key as keyof UserPermissions)}
                      className={`flex items-center justify-between p-3 rounded-xl border text-xs text-right transition-all ${
                        isChecked
                          ? 'bg-blue-600/10 border-blue-500/40 text-white font-medium'
                          : 'bg-[#0f172a] border-[#334155] text-slate-400 hover:border-slate-500'
                      }`}
                    >
                      <span>{item.label}</span>
                      {isChecked ? (
                        <CheckSquare className="w-4 h-4 text-blue-400 shrink-0 ml-2" />
                      ) : (
                        <Square className="w-4 h-4 text-slate-500 shrink-0 ml-2" />
                      )}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Section 2: Management & Modification Permissions */}
            <div className="space-y-2 pt-3">
              <div className="flex items-center gap-2 text-xs font-bold text-amber-400">
                <Shield className="w-3.5 h-3.5" />
                <span>2. صلاحيات التعديل والحذف والإدارة (Management & Write Permissions):</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {[
                  { key: 'canManageAssets', label: 'إدارة وتعديل الأصول والقاعات (إضافة / تعديل / حذف أصل)' },
                  { key: 'canManageWorkOrders', label: 'إدارة أوامر العمل (إصدار / تحديث الحالة / إغلاق)' },
                  { key: 'canManageMeters', label: 'إدارة العدادات (تسجيل قراءات / إضافة أجهزة قياس)' },
                  { key: 'canManagePreventive', label: 'إدارة الصيانة الوقائية (إنشاء خطط / اعتماد وتنفيذ)' },
                  { key: 'canManageWarehouse', label: 'إدارة المستودع (إضافة قطع / صرف مخزني / توريد)' },
                  { key: 'canManageShifts', label: 'إدارة وتوقيع واعتماد تقارير الدوريات الفنية' },
                  { key: 'canManageUsers', label: 'إدارة حسابات النظام والصلاحيات (المطور ومدير الصيانة)' },
                ].map((item) => {
                  const isChecked = !!permissions[item.key as keyof UserPermissions];
                  return (
                    <button
                      key={item.key}
                      type="button"
                      onClick={() => togglePermission(item.key as keyof UserPermissions)}
                      className={`flex items-center justify-between p-3 rounded-xl border text-xs text-right transition-all ${
                        isChecked
                          ? 'bg-amber-500/10 border-amber-500/40 text-amber-200 font-semibold'
                          : 'bg-[#0f172a] border-[#334155] text-slate-400 hover:border-slate-500'
                      }`}
                    >
                      <span>{item.label}</span>
                      {isChecked ? (
                        <CheckSquare className="w-4 h-4 text-amber-400 shrink-0 ml-2" />
                      ) : (
                        <Square className="w-4 h-4 text-slate-500 shrink-0 ml-2" />
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Notes */}
          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-300">ملاحظات واعتماد المطور</label>
            <textarea
              rows={2}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="مثال: حساب مفوض لمهندس النوبة لمتابعة خطوط الطباعة والتحكم بأوامر العمل الطارئة."
              className="w-full bg-[#0f172a] border border-[#334155] rounded-xl p-3 text-xs text-white focus:outline-none focus:border-blue-500"
            />
          </div>

          {/* Footer Buttons */}
          <div className="pt-4 border-t border-[#334155] flex items-center justify-between gap-3">
            <div>
              {editingUser && (
                <button
                  type="button"
                  onClick={() => {
                    requestDeleteConfirmation({
                      title: 'حذف حساب المستخدم',
                      message: `هل أنت متأكد من رغبتك في حذف حساب [${editingUser.fullName}] نهائياً؟`,
                      itemDetails: `${editingUser.fullName} (@${editingUser.username})`,
                      confirmLabel: 'حذف الحساب نهائياً',
                      onConfirm: () => {
                        deleteUser(editingUser.id);
                        handleClose();
                      },
                    });
                  }}
                  className="px-4 py-2.5 rounded-xl bg-red-500/10 hover:bg-red-500/20 text-red-400 hover:text-red-300 border border-red-500/30 text-xs font-bold transition-all flex items-center gap-1.5 active:scale-95"
                  title="حذف هذا الحساب نهائياً"
                >
                  <Trash2 className="w-4 h-4" />
                  <span>حذف الحساب نهائياً</span>
                </button>
              )}
            </div>

            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={handleClose}
                className="px-5 py-2.5 rounded-xl bg-[#334155] hover:bg-slate-600 text-slate-200 text-xs font-bold transition-colors"
              >
                إلغاء
              </button>
              <button
                type="submit"
                className="px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold shadow-lg shadow-blue-600/20 transition-all active:scale-95 flex items-center gap-2"
              >
                <UserCheck className="w-4 h-4" />
                <span>{editingUser ? 'حفظ وتحديث الصلاحيات' : 'تأكيد إنشاء الحساب وتثبيت الصلاحيات'}</span>
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
