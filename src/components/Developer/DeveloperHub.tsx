import React, { useState } from 'react';
import { 
  Shield, 
  ShieldCheck, 
  UserPlus, 
  Users, 
  Key, 
  Edit3, 
  Trash2, 
  Power, 
  CheckCircle2, 
  XCircle, 
  Search, 
  Sliders, 
  Eye, 
  Lock, 
  ArrowRightLeft,
  Sparkles,
  Info,
  Check,
  X,
  FileSpreadsheet,
  Layers,
  Award
} from 'lucide-react';
import { useCMMS } from '../../context/CMMSContext';
import { UserAccount, UserRole, UserPermissions } from '../../types';

export const DeveloperHub: React.FC = () => {
  const { 
    users, 
    currentUser, 
    setCurrentUser, 
    setIsUserModalOpen, 
    setEditingUser, 
    deleteUser, 
    toggleUserStatus,
    canAccess,
    setIsLoginModalOpen,
    requestDeleteConfirmation
  } = useCMMS();

  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState<string>('ALL');
  const [activeSubTab, setActiveSubTab] = useState<'ACCOUNTS' | 'MATRIX' | 'AUDIT'>('ACCOUNTS');

  // Filtered users
  const filteredUsers = users.filter((u) => {
    const matchesSearch = 
      u.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.roleTitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.department.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesRole = roleFilter === 'ALL' || u.role === roleFilter;

    return matchesSearch && matchesRole;
  });

  const getRoleBadge = (role: UserRole, isSuper?: boolean) => {
    if (isSuper) {
      return (
        <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-purple-500/20 text-purple-300 border border-purple-500/40 flex items-center gap-1">
          <Award className="w-3 h-3 text-amber-400" />
          <span>مطور رئيسي (Super Developer)</span>
        </span>
      );
    }
    switch (role) {
      case 'DEVELOPER':
        return <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-purple-500/20 text-purple-300 border border-purple-500/40">مطور النظام</span>;
      case 'MAINTENANCE_DIRECTOR':
      case 'MAINTENANCE_MANAGER':
        return <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-blue-500/20 text-blue-300 border border-blue-500/40">مدير الصيانة</span>;
      case 'SHIFT_SUPERVISOR':
        return <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-cyan-500/20 text-cyan-300 border border-cyan-500/40">مسؤول الوردية</span>;
      case 'MAINTENANCE_ENGINEER':
        return <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-cyan-500/20 text-cyan-300 border border-cyan-500/40">مهندس صيانة</span>;
      case 'TECHNICIAN':
        return <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">فني صيانة</span>;
      case 'WAREHOUSE_KEEPER':
      case 'STOREKEEPER':
        return <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/40">أمين مستودع</span>;
      case 'OPERATOR':
      case 'OPERATOR_VIEWER':
        return <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-slate-600/30 text-slate-300 border border-slate-500">مشغل إنتاج</span>;
      case 'AUDITOR':
        return <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-indigo-500/20 text-indigo-300 border border-indigo-500/40">مراقب جودة</span>;
      default:
        return null;
    }
  };

  const handleEditUser = (user: UserAccount) => {
    setEditingUser(user);
    setIsUserModalOpen(true);
  };

  const handleCreateNewUser = () => {
    setEditingUser(null);
    setIsUserModalOpen(true);
  };

  if (!currentUser) {
    return (
      <div className="p-8 rounded-2xl bg-[#1e293b] border border-[#334155] text-center space-y-4 max-w-lg mx-auto my-12">
        <Shield className="w-12 h-12 text-purple-400 mx-auto" />
        <h2 className="text-xl font-bold text-white">لوحة المطور مقفلة</h2>
        <p className="text-xs text-slate-400 leading-relaxed">
          يرجى تسجيل الدخول بحساب المطور المعتمد للوصول إلى مركز إدارة الحسابات والصلاحيات.
        </p>
        <button
          onClick={() => setIsLoginModalOpen(true)}
          className="px-5 py-2.5 bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold rounded-xl shadow-md transition-all"
        >
          تسجيل الدخول
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6 font-sans text-slate-100">
      {/* Top Banner: Developer Command Center */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-[#1e293b] via-[#1a2436] to-[#0f172a] border border-[#334155] shadow-xl relative overflow-hidden">
        <div className="relative z-10 flex flex-wrap items-center justify-between gap-4">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="px-3 py-1 bg-purple-500/20 text-purple-300 rounded-full text-xs font-bold border border-purple-500/30 flex items-center gap-1.5 font-mono">
                <Shield className="w-3.5 h-3.5 text-purple-400" />
                <span>DEVELOPER SECURITY HUB</span>
              </span>
              <span className="text-xs text-slate-400">إصدار التحكم الأمني v2.5</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-white flex items-center gap-3">
              <span>لوحة المطور: إدارة الحسابات وتخصيص الصلاحيات</span>
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 max-w-2xl leading-relaxed">
              خاص بمطور النظام ومدير الصيانة <strong className="text-white">م. علي رضا</strong> — يمكنك هنا إنشاء حسابات المستخدمين الجدد وتحديد ما يراه وما يغيره كل مستخدم بدقة (الأصول، أوامر العمل، العدادات، الصيانة الوقائية، المستودع، ومحاضر الوردية).
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
            <button
              onClick={handleCreateNewUser}
              className="flex items-center justify-center gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white px-5 py-3 rounded-xl text-xs sm:text-sm font-bold shadow-lg shadow-blue-600/30 transition-all active:scale-95"
            >
              <UserPlus className="w-4 h-4" />
              <span>+ إنشاء حساب مستخدم جديد</span>
            </button>
          </div>
        </div>

        {/* Decorative ambient glow */}
        <div className="absolute -left-20 -bottom-20 w-72 h-72 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />
      </div>

      {/* Active User Testing & Simulation Card */}
      <div className="p-4 rounded-xl bg-[#1e293b] border border-blue-500/30 shadow-md flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-xl bg-blue-600 text-white font-black text-lg flex items-center justify-center shadow-md">
            {currentUser.avatarInitials}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs text-slate-400">الحساب النشط حالياً في الجلسة:</span>
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            </div>
            <div className="flex items-center gap-2 mt-0.5">
              <span className="text-base font-black text-white">{currentUser.fullName}</span>
              {getRoleBadge(currentUser.role, currentUser.isSuperDeveloper)}
            </div>
            <span className="text-xs text-slate-400 font-mono block">
              {currentUser.roleTitle} • {currentUser.department}
            </span>
          </div>
        </div>

        {/* Account switcher quick list */}
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs font-bold text-slate-400 flex items-center gap-1.5 ml-2">
            <ArrowRightLeft className="w-3.5 h-3.5 text-blue-400" />
            <span>محاكاة وتبديل الحساب لتجربة الصلاحيات:</span>
          </span>
          <div className="flex flex-wrap gap-1.5">
            {users.map((u) => {
              const isSelected = u.id === currentUser.id;
              return (
                <button
                  key={u.id}
                  onClick={() => setCurrentUser(u)}
                  title={`التبديل إلى ${u.fullName} (${u.roleTitle})`}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                    isSelected
                      ? 'bg-blue-600 text-white font-bold shadow-sm ring-2 ring-blue-400/50'
                      : 'bg-[#0f172a] text-slate-300 hover:bg-[#334155] border border-[#334155]'
                  }`}
                >
                  {u.fullName.split(' ')[1] || u.fullName}
                  {u.isSuperDeveloper && ' ★'}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Hub Navigation Sub-Tabs */}
      <div className="flex items-center justify-between border-b border-[#334155] pb-2">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveSubTab('ACCOUNTS')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold transition-all ${
              activeSubTab === 'ACCOUNTS'
                ? 'bg-blue-600/20 text-blue-400 border border-blue-500/40'
                : 'text-slate-400 hover:text-white hover:bg-[#1e293b]'
            }`}
          >
            <Users className="w-4 h-4" />
            <span>قائمة الحسابات والمستخدمين ({users.length})</span>
          </button>

          <button
            onClick={() => setActiveSubTab('MATRIX')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold transition-all ${
              activeSubTab === 'MATRIX'
                ? 'bg-blue-600/20 text-blue-400 border border-blue-500/40'
                : 'text-slate-400 hover:text-white hover:bg-[#1e293b]'
            }`}
          >
            <FileSpreadsheet className="w-4 h-4" />
            <span>مصفوفة الصلاحيات الموحدة (Permissions Matrix)</span>
          </button>
        </div>

        {/* Quick Search */}
        {activeSubTab === 'ACCOUNTS' && (
          <div className="flex items-center gap-2">
            <div className="relative w-64">
              <Search className="w-3.5 h-3.5 absolute right-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="بحث بالاسم، الوظيفة، أو المعرف..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-[#0f172a] border border-[#334155] rounded-lg pr-9 pl-3 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
              />
            </div>

            <select
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
              className="bg-[#0f172a] border border-[#334155] rounded-lg px-3 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-blue-500"
            >
              <option value="ALL">جميع الأدوار</option>
              <option value="DEVELOPER">مطور النظام</option>
              <option value="MAINTENANCE_ENGINEER">مهندسو الصيانة</option>
              <option value="TECHNICIAN">فنيو الصيانة</option>
              <option value="STOREKEEPER">أمناء المستودع</option>
              <option value="OPERATOR">مشغلو الإنتاج</option>
            </select>
          </div>
        )}
      </div>

      {/* Sub-Tab 1: Users Cards & List */}
      {activeSubTab === 'ACCOUNTS' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredUsers.map((user) => {
            const isMe = currentUser.id === user.id;
            const canManageCount = [
              user.permissions.canManageAssets,
              user.permissions.canManageWorkOrders,
              user.permissions.canManageMeters,
              user.permissions.canManagePreventive,
              user.permissions.canManageWarehouse,
              user.permissions.canManageShifts,
              user.permissions.canManageUsers,
            ].filter(Boolean).length;

            return (
              <div 
                key={user.id}
                className={`p-5 rounded-2xl border transition-all flex flex-col justify-between ${
                  isMe 
                    ? 'bg-[#1e293b] border-blue-500/50 shadow-lg shadow-blue-500/5' 
                    : user.isActive 
                    ? 'bg-[#1e293b]/80 border-[#334155] hover:border-slate-500' 
                    : 'bg-[#161f2e] border-slate-800 opacity-60'
                }`}
              >
                <div>
                  {/* Card Header */}
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div className={`w-11 h-11 rounded-xl flex items-center justify-center font-bold text-sm shadow-sm ${
                        user.isSuperDeveloper 
                          ? 'bg-purple-600 text-white ring-2 ring-purple-400/40' 
                          : user.role === 'MAINTENANCE_ENGINEER'
                          ? 'bg-cyan-600 text-white'
                          : user.role === 'STOREKEEPER'
                          ? 'bg-amber-600 text-white'
                          : 'bg-slate-700 text-slate-200'
                      }`}>
                        {user.avatarInitials}
                      </div>
                      <div>
                        <h3 className="text-sm font-bold text-white flex items-center gap-1.5">
                          <span>{user.fullName}</span>
                          {isMe && (
                            <span className="text-[10px] px-1.5 py-0.2 rounded bg-blue-500/20 text-blue-300 font-bold">
                              (أنت)
                            </span>
                          )}
                        </h3>
                        <p className="text-xs text-slate-300">{user.roleTitle}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-1">
                      {user.isActive ? (
                        <span className="w-2 h-2 rounded-full bg-emerald-400" title="حساب نشط" />
                      ) : (
                        <span className="w-2 h-2 rounded-full bg-red-500" title="حساب معطل" />
                      )}
                    </div>
                  </div>

                  {/* Metadata */}
                  <div className="mt-3 pt-3 border-t border-[#334155] space-y-2 text-xs text-slate-400">
                    <div className="flex items-center justify-between">
                      <span>القسم:</span>
                      <span className="text-slate-200 font-medium">{user.department}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>اسم الدخول (Username):</span>
                      <span className="text-blue-300 font-mono text-[11px] font-bold">@{user.username}</span>
                    </div>
                    <div className="flex items-center justify-between bg-[#0f172a]/60 px-2.5 py-1.5 rounded-lg border border-[#334155]">
                      <span className="flex items-center gap-1.5 text-slate-300 font-medium">
                        <Key className="w-3 h-3 text-amber-400" />
                        <span>رمز الدخول السري:</span>
                      </span>
                      <span className="text-amber-300 font-mono text-[11px] font-bold bg-amber-500/15 px-2 py-0.5 rounded border border-amber-500/30">
                        {user.pinCode || user.password || '1234'}
                      </span>
                    </div>
                    {user.phone && (
                      <div className="flex items-center justify-between">
                        <span>الهاتف:</span>
                        <span className="text-slate-300 font-mono text-[11px]">{user.phone}</span>
                      </div>
                    )}
                  </div>

                  {/* Permissions Summary Badges */}
                  <div className="mt-4 p-3 rounded-xl bg-[#0f172a] border border-[#334155] space-y-2">
                    <div className="flex items-center justify-between text-[11px]">
                      <span className="text-slate-400 font-bold flex items-center gap-1">
                        <Key className="w-3 h-3 text-amber-400" />
                        <span>صلاحيات التعديل والإدارة:</span>
                      </span>
                      <span className="font-mono font-bold text-amber-400">
                        {canManageCount} / 7
                      </span>
                    </div>

                    <div className="flex flex-wrap gap-1">
                      {user.permissions.canManageAssets && (
                        <span className="text-[10px] px-2 py-0.5 rounded bg-amber-500/10 text-amber-300 border border-amber-500/30">
                          الأصول
                        </span>
                      )}
                      {user.permissions.canManageWorkOrders && (
                        <span className="text-[10px] px-2 py-0.5 rounded bg-blue-500/10 text-blue-300 border border-blue-500/30">
                          أوامر العمل
                        </span>
                      )}
                      {user.permissions.canManageMeters && (
                        <span className="text-[10px] px-2 py-0.5 rounded bg-cyan-500/10 text-cyan-300 border border-cyan-500/30">
                          العدادات
                        </span>
                      )}
                      {user.permissions.canManagePreventive && (
                        <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-300 border border-emerald-500/30">
                          الصيانة الوقائية
                        </span>
                      )}
                      {user.permissions.canManageWarehouse && (
                        <span className="text-[10px] px-2 py-0.5 rounded bg-amber-600/20 text-amber-200 border border-amber-500/40">
                          المستودع
                        </span>
                      )}
                      {user.permissions.canManageShifts && (
                        <span className="text-[10px] px-2 py-0.5 rounded bg-indigo-500/10 text-indigo-300 border border-indigo-500/30">
                          الوردية
                        </span>
                      )}
                      {user.permissions.canManageUsers && (
                        <span className="text-[10px] px-2 py-0.5 rounded bg-purple-500/20 text-purple-300 border border-purple-500/40 font-bold">
                          إدارة الصلاحيات
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Card Actions */}
                <div className="mt-5 pt-4 border-t border-[#334155] flex items-center justify-between gap-2">
                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => handleEditUser(user)}
                      className="px-3 py-1.5 rounded-lg bg-[#334155] hover:bg-slate-600 text-white text-xs font-bold transition-colors flex items-center gap-1.5"
                    >
                      <Sliders className="w-3.5 h-3.5 text-blue-400" />
                      <span>تعديل الصلاحيات</span>
                    </button>

                    {!isMe && (
                      <button
                        onClick={() => setCurrentUser(user)}
                        className="px-2.5 py-1.5 rounded-lg bg-blue-600/15 hover:bg-blue-600 text-blue-300 hover:text-white text-xs font-semibold border border-blue-500/30 transition-all"
                        title="تسجيل الدخول ومحاكاة هذا المستخدم"
                      >
                        تبديل
                      </button>
                    )}
                  </div>

                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => toggleUserStatus(user.id)}
                      className={`p-1.5 rounded-lg border transition-colors ${
                        user.isActive
                          ? 'text-emerald-400 hover:bg-emerald-500/10 border-emerald-500/30'
                          : 'text-slate-500 hover:bg-slate-700 border-[#334155]'
                      }`}
                      title={user.isActive ? 'تعطيل الحساب' : 'تفعيل الحساب'}
                    >
                      <Power className="w-3.5 h-3.5" />
                    </button>

                    <button
                      onClick={() => {
                        requestDeleteConfirmation({
                          title: 'حذف حساب المستخدم',
                          message: `هل أنت متأكد من رغبتك في حذف حساب [${user.fullName}] نهائياً؟ سيتم استبعاده فوراً من صلاحيات النظام.`,
                          itemDetails: `${user.fullName} (@${user.username}) - ${user.roleTitle}`,
                          confirmLabel: 'حذف الحساب نهائياً',
                          onConfirm: () => {
                            deleteUser(user.id);
                          },
                        });
                      }}
                      className="p-1.5 rounded-lg text-red-400 hover:bg-red-500/15 hover:text-red-300 border border-red-500/30 transition-colors"
                      title="حذف الحساب نهائياً"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Sub-Tab 2: Permissions Matrix Table */}
      {activeSubTab === 'MATRIX' && (
        <div className="bg-[#1e293b] border border-[#334155] rounded-2xl shadow-xl overflow-hidden">
          <div className="p-4 bg-[#0f172a] border-b border-[#334155] flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <FileSpreadsheet className="w-4 h-4 text-blue-400" />
                <span>مصفوفة التحكم في الوصول الشاملة (Access Control Matrix)</span>
              </h3>
              <p className="text-xs text-slate-400">
                مقارنة الصلاحيات التنفيذية لكل مستخدم عبر كافة وحدات معمل المرجان للمطبوعات
              </p>
            </div>
            <button
              onClick={handleCreateNewUser}
              className="px-3 py-1.5 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-xs font-bold"
            >
              + إضافة مستخدم
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-right text-xs">
              <thead className="bg-[#0f172a] text-slate-400 font-bold border-b border-[#334155]">
                <tr>
                  <th className="p-3">المستخدم والصفة</th>
                  <th className="p-3 text-center">الأصول والقاعات</th>
                  <th className="p-3 text-center">أوامر العمل</th>
                  <th className="p-3 text-center">العدادات والقياس</th>
                  <th className="p-3 text-center">الصيانة الوقائية</th>
                  <th className="p-3 text-center">المستودع والمخزون</th>
                  <th className="p-3 text-center">تقارير الدوريات</th>
                  <th className="p-3 text-center">إدارة الصلاحيات</th>
                  <th className="p-3 text-center">الإجراء</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#334155] bg-[#1e293b]/40">
                {users.map((user) => (
                  <tr key={user.id} className="hover:bg-[#0f172a]/50 transition-colors">
                    <td className="p-3">
                      <div className="font-bold text-white flex items-center gap-1.5">
                        <span>{user.fullName}</span>
                        {user.isSuperDeveloper && <span className="text-amber-400 text-xs">★</span>}
                      </div>
                      <div className="text-[11px] text-slate-400">{user.roleTitle}</div>
                    </td>

                    {/* canManageAssets */}
                    <td className="p-3 text-center">
                      {user.permissions.canManageAssets ? (
                        <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-emerald-500/20 text-emerald-400 font-bold">
                          ✓
                        </span>
                      ) : (
                        <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-slate-800 text-slate-600">
                          -
                        </span>
                      )}
                    </td>

                    {/* canManageWorkOrders */}
                    <td className="p-3 text-center">
                      {user.permissions.canManageWorkOrders ? (
                        <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-emerald-500/20 text-emerald-400 font-bold">
                          ✓
                        </span>
                      ) : (
                        <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-slate-800 text-slate-600">
                          -
                        </span>
                      )}
                    </td>

                    {/* canManageMeters */}
                    <td className="p-3 text-center">
                      {user.permissions.canManageMeters ? (
                        <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-emerald-500/20 text-emerald-400 font-bold">
                          ✓
                        </span>
                      ) : (
                        <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-slate-800 text-slate-600">
                          -
                        </span>
                      )}
                    </td>

                    {/* canManagePreventive */}
                    <td className="p-3 text-center">
                      {user.permissions.canManagePreventive ? (
                        <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-emerald-500/20 text-emerald-400 font-bold">
                          ✓
                        </span>
                      ) : (
                        <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-slate-800 text-slate-600">
                          -
                        </span>
                      )}
                    </td>

                    {/* canManageWarehouse */}
                    <td className="p-3 text-center">
                      {user.permissions.canManageWarehouse ? (
                        <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-emerald-500/20 text-emerald-400 font-bold">
                          ✓
                        </span>
                      ) : (
                        <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-slate-800 text-slate-600">
                          -
                        </span>
                      )}
                    </td>

                    {/* canManageShifts */}
                    <td className="p-3 text-center">
                      {user.permissions.canManageShifts ? (
                        <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-emerald-500/20 text-emerald-400 font-bold">
                          ✓
                        </span>
                      ) : (
                        <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-slate-800 text-slate-600">
                          -
                        </span>
                      )}
                    </td>

                    {/* canManageUsers */}
                    <td className="p-3 text-center">
                      {user.permissions.canManageUsers ? (
                        <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-purple-500/20 text-purple-300 font-bold border border-purple-500/40">
                          ★
                        </span>
                      ) : (
                        <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-slate-800 text-slate-600">
                          -
                        </span>
                      )}
                    </td>

                    <td className="p-3 text-center">
                      <div className="flex items-center justify-center gap-1.5">
                        <button
                          onClick={() => handleEditUser(user)}
                          className="px-2.5 py-1 rounded bg-[#334155] hover:bg-slate-600 text-white text-[11px] font-bold transition-colors"
                        >
                          تعديل
                        </button>
                        <button
                          onClick={() => {
                            requestDeleteConfirmation({
                              title: 'حذف حساب المستخدم',
                              message: `هل أنت متأكد من رغبتك في حذف حساب [${user.fullName}] نهائياً؟`,
                              itemDetails: `${user.fullName} (@${user.username})`,
                              confirmLabel: 'حذف الحساب نهائياً',
                              onConfirm: () => {
                                deleteUser(user.id);
                              },
                            });
                          }}
                          className="p-1 rounded bg-red-500/10 hover:bg-red-500/20 text-red-400 hover:text-red-300 border border-red-500/30 transition-colors"
                          title="حذف الحساب نهائياً"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Security Architecture Guidelines Card */}
      <div className="p-5 rounded-2xl bg-[#0f172a] border border-[#334155] text-xs text-slate-400 space-y-3">
        <div className="flex items-center gap-2 text-white font-bold text-sm">
          <Info className="w-4 h-4 text-blue-400" />
          <span>سياسة التوثيق والاعتماد في معمل المرجان للمطبوعات:</span>
        </div>
        <p className="leading-relaxed">
          1. <strong className="text-slate-200">صلاحية التعديل الحصرية:</strong> لا يمكن لأي مستخدم إضافة أو حذف أصل أو اعتماد خطة صيانة وقائية أو الصرف من المستودع ما لم يمنحه مطور النظام (م. علي رضا) الصلاحية المحددة صراحةً.
        </p>
        <p className="leading-relaxed">
          2. <strong className="text-slate-200">محاضر تسليم الوردية:</strong> مهندس النوبة هو المسؤول عن توقيع تسليم الوردية، وتعتبر الوردية غير معتمدة نهائياً إلا بعد مصادقة مدير إدارة الصيانة <strong className="text-blue-400 font-bold">م. علي رضا</strong> رقمياً.
        </p>
      </div>
    </div>
  );
};
