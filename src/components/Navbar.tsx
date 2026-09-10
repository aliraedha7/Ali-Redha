import React, { useState, useEffect } from 'react';
import { 
  Wrench, 
  AlertTriangle, 
  QrCode, 
  ClipboardList, 
  Activity, 
  Layers, 
  Package, 
  FileText, 
  RotateCcw, 
  Bell, 
  Clock, 
  UserCheck, 
  ShieldAlert,
  Search,
  CheckCircle2,
  X,
  Gauge,
  CalendarCheck,
  Shield,
  Key,
  ArrowRightLeft,
  Award,
  LogIn,
  LogOut,
  FileCode,
  Download,
  Server
} from 'lucide-react';
import { useCMMS } from '../context/CMMSContext';

export const Navbar: React.FC = () => {
  const { 
    activeTab, 
    setActiveTab, 
    kpis, 
    meterDevices,
    pmPlans,
    users,
    currentUser,
    setCurrentUser,
    isLoggedIn,
    setIsLoginModalOpen,
    logoutCurrentUser,
    canViewTab,
    triggerEmergencyBreakdown, 
    resetToDefaultData,
    notifications,
    dismissNotification,
    globalSearch,
    setGlobalSearch
  } = useCMMS();

  const [currentTime, setCurrentTime] = useState<string>('');
  const [showNotifications, setShowNotifications] = useState<boolean>(false);
  const [showUserSwitcher, setShowUserSwitcher] = useState<boolean>(false);
  const [showPhpModal, setShowPhpModal] = useState<boolean>(false);

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setCurrentTime(
        now.toLocaleTimeString('ar-EG', {
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
          hour12: false,
        })
      );
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  // Determine current active shift
  const getShiftName = () => {
    const hours = new Date().getHours();
    if (hours >= 7 && hours < 15) return 'الوردية الأولى (الصباحية)';
    if (hours >= 15 && hours < 23) return 'الوردية الثانية (المسائية)';
    return 'الوردية الثالثة (الليلية)';
  };

  interface NavItem {
    id: 'dashboard' | 'assets' | 'work-orders' | 'meters' | 'preventive' | 'warehouse' | 'shift-report' | 'developer-hub';
    label: string;
    icon: React.ComponentType<{ className?: string }>;
    badge?: number;
    badgeAlert?: boolean;
    specialHighlight?: boolean;
  }

  const allNavItems: NavItem[] = [
    { id: 'dashboard', label: 'لوحة المؤشرات', icon: Activity },
    { id: 'assets', label: 'سجل الأصول والباركود (43)', icon: QrCode, badge: kpis.totalAssets },
    { 
      id: 'work-orders', 
      label: 'أوامر العمل', 
      icon: ClipboardList, 
      badge: kpis.activeWorkOrders,
      badgeAlert: kpis.emergencyStoppages > 0 
    },
    { 
      id: 'meters', 
      label: 'العدادات وأجهزة القياس', 
      icon: Gauge, 
      badge: meterDevices.length 
    },
    { 
      id: 'preventive', 
      label: 'الصيانة الوقائية الاحترافية', 
      icon: CalendarCheck, 
      badge: pmPlans.length 
    },
    { 
      id: 'warehouse', 
      label: 'مستودع قطع الغيار', 
      icon: Package, 
      badge: kpis.lowStockItemsCount > 0 ? kpis.lowStockItemsCount : undefined,
      badgeAlert: kpis.lowStockItemsCount > 0
    },
    { id: 'shift-report', label: 'تقرير الدوريات', icon: FileText },
    { 
      id: 'developer-hub', 
      label: 'لوحة المطور والصلاحيات', 
      icon: Shield, 
      badge: users.length,
      specialHighlight: true
    },
  ];

  // Dynamic permission filter
  const visibleNavItems = allNavItems.filter((item) => canViewTab(item.id));

  return (
    <header className="sticky top-0 z-40 bg-[#0f172a] border-b border-[#334155] shadow-xl no-print">
      {/* Top Banner: Plant Identity, Shift & Manager */}
      <div className="px-4 sm:px-6 py-2.5 bg-[#1e293b]/90 border-b border-[#334155] flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-3">
          <div className="w-7 h-7 bg-blue-600 rounded flex items-center justify-center font-bold text-white text-xs shadow-sm">
            م
          </div>
          <div className="flex flex-col">
            <span className="font-bold text-white text-xs sm:text-sm leading-tight">
              مركز الصيانة — معمل المرجان للمطبوعات
            </span>
            <span className="text-[10px] text-blue-400 font-normal uppercase tracking-wider hidden sm:inline">
              Al-Morjan Printing CMMS Enterprise
            </span>
          </div>

          <div className="hidden md:flex items-center gap-2 mr-2">
            <div className="px-3 py-1 bg-green-500/10 text-green-400 text-xs rounded-full border border-green-500/20 flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
              <span>حالة المصنع: تشغيل طبيعي (43 أصل)</span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3 text-slate-300">
          {!isLoggedIn || !currentUser ? (
            <button
              onClick={() => setIsLoginModalOpen(true)}
              className="flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold shadow-lg shadow-blue-600/25 transition-all active:scale-95 border border-blue-400/40"
              title="تسجيل الدخول إلى النظام"
            >
              <LogIn className="w-3.5 h-3.5" />
              <span>تسجيل الدخول</span>
            </button>
          ) : (
            /* Active User Switcher / Profile Badge */
            <div className="relative">
              <button
                onClick={() => setShowUserSwitcher(!showUserSwitcher)}
                className={`flex items-center gap-2.5 px-3 py-1 rounded-lg border transition-all ${
                  currentUser.isSuperDeveloper 
                    ? 'bg-purple-950/30 border-purple-500/40 hover:border-purple-400 text-purple-200'
                    : 'bg-[#1a2333] border-[#334155] hover:border-slate-500 text-slate-200'
                }`}
                title="الحساب الحالي — انقر للتبديل السريع"
              >
                <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold ${
                  currentUser.isSuperDeveloper ? 'bg-purple-600 text-white' : 'bg-slate-700 text-slate-200'
                }`}>
                  {currentUser.avatarInitials}
                </div>
                <div className="flex flex-col text-right">
                  <div className="flex items-center gap-1">
                    <span className="text-xs font-semibold text-white">{currentUser.fullName}</span>
                    {currentUser.isSuperDeveloper && (
                      <span className="text-[9px] px-1 rounded bg-purple-500/30 text-purple-300 font-bold">★ مطور</span>
                    )}
                  </div>
                  <span className="text-[9px] text-slate-400 uppercase tracking-wider">
                    {currentUser.roleTitle}
                  </span>
                </div>
              </button>

              {/* Quick Switch Dropdown */}
              {showUserSwitcher && (
                <div className="absolute left-0 mt-2 w-72 bg-[#1e293b] border border-[#334155] rounded-xl shadow-2xl p-3 z-50 animate-in fade-in slide-in-from-top-2 text-right font-sans">
                  <div className="flex items-center justify-between pb-2 border-b border-[#334155] mb-2">
                    <div className="flex items-center gap-1.5 text-xs font-bold text-slate-200">
                      <ArrowRightLeft className="w-3.5 h-3.5 text-blue-400" />
                      <span>تبديل الحساب النشط:</span>
                    </div>
                    <button 
                      onClick={() => setShowUserSwitcher(false)}
                      className="text-slate-400 hover:text-slate-200"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <div className="max-h-60 overflow-y-auto space-y-1.5 pr-1">
                    {users.map((u) => (
                      <button
                        key={u.id}
                        onClick={() => {
                          setCurrentUser(u);
                          setShowUserSwitcher(false);
                        }}
                        className={`w-full text-right p-2 rounded-lg text-xs flex items-center justify-between transition-colors ${
                          u.id === currentUser.id 
                            ? 'bg-blue-600/20 text-blue-300 border border-blue-500/40 font-bold'
                            : 'hover:bg-[#0f172a] text-slate-300'
                        }`}
                      >
                        <div className="space-y-0.5">
                          <div className="flex items-center gap-1">
                            <span className="text-white">{u.fullName}</span>
                            {u.isSuperDeveloper && <span className="text-amber-400 text-[10px]">★</span>}
                          </div>
                          <span className="text-[10px] text-slate-400 block">{u.roleTitle}</span>
                        </div>
                        {u.id === currentUser.id && (
                          <CheckCircle2 className="w-3.5 h-3.5 text-blue-400" />
                        )}
                      </button>
                    ))}
                  </div>

                  <div className="pt-2 mt-2 border-t border-[#334155] space-y-1.5">
                    <button
                      onClick={() => {
                        setShowUserSwitcher(false);
                        logoutCurrentUser();
                      }}
                      className="w-full py-1.5 px-2 bg-red-500/10 hover:bg-red-500/20 text-red-300 hover:text-red-200 border border-red-500/20 rounded-lg text-xs font-bold transition-colors flex items-center justify-center gap-1.5"
                    >
                      <LogOut className="w-3.5 h-3.5 text-red-400" />
                      <span>تسجيل الخروج من الحساب</span>
                    </button>

                    {currentUser.permissions.canViewDeveloperHub && (
                      <button
                        onClick={() => {
                          setShowUserSwitcher(false);
                          setActiveTab('developer-hub');
                        }}
                        className="w-full py-1.5 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-xs font-bold transition-colors text-center block"
                      >
                        لوحة المطور وإدارة الحسابات ←
                      </button>
                    )}
                  </div>
                </div>
              )}
            </div>
          )}

          <div className="hidden lg:flex items-center gap-2 text-slate-400">
            <div className="text-left font-mono">
              <span className="text-[9px] text-slate-500 uppercase block leading-none">GMT+3 • {getShiftName()}</span>
              <span className="text-xs text-slate-200 font-bold">{currentTime || '10:45:00'}</span>
            </div>
          </div>

          <button
            onClick={resetToDefaultData}
            title="إعادة ضبط البيانات المصنعية الأولية"
            className="text-slate-400 hover:text-slate-200 transition-colors p-1.5 rounded hover:bg-[#334155]"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Main Bar: Nav Tabs & Emergency Action */}
      <div className="px-4 sm:px-6 py-3 flex flex-wrap items-center justify-between gap-4">
        {/* Navigation Tabs */}
        <nav className="flex items-center gap-1.5 sm:gap-2 overflow-x-auto max-w-full pb-1 sm:pb-0 scrollbar-none">
          {visibleNavItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-sm font-medium transition-all whitespace-nowrap ${
                  isActive
                    ? item.specialHighlight
                      ? 'bg-purple-600/25 text-purple-300 border border-purple-500/50 font-semibold shadow-sm'
                      : 'bg-blue-600/20 text-blue-400 border border-blue-500/40 font-semibold shadow-sm'
                    : item.specialHighlight
                    ? 'text-purple-300 hover:text-white hover:bg-purple-950/40 border border-purple-500/20'
                    : 'text-slate-400 hover:text-slate-100 hover:bg-[#334155]/60 border border-transparent'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? (item.specialHighlight ? 'text-purple-300' : 'text-blue-400') : 'text-slate-400'}`} />
                <span>{item.label}</span>
                {item.badge !== undefined && (
                  <span
                    className={`text-xs px-2 py-0.2 rounded-full font-mono font-bold ${
                      isActive
                        ? item.specialHighlight ? 'bg-purple-600 text-white' : 'bg-blue-600 text-white'
                        : item.badgeAlert
                        ? 'bg-red-500/20 text-red-400 border border-red-500/40 animate-pulse'
                        : 'bg-[#1e293b] text-slate-300 border border-[#334155]'
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        {/* Search & Actions */}
        <div className="flex items-center gap-3">
          {/* Quick Search */}
          <div className="relative hidden xl:block w-56">
            <Search className="w-3.5 h-3.5 absolute right-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="بحث في الأصول والطلبات..."
              value={globalSearch}
              onChange={(e) => setGlobalSearch(e.target.value)}
              className="w-full bg-[#0f172a] border border-[#334155] rounded-lg pr-9 pl-3 py-1.5 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-blue-500 transition-colors"
            />
          </div>

          {/* PHP & MySQL Package Modal Toggle */}
          <button
            onClick={() => setShowPhpModal(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-300 border border-emerald-500/40 text-xs font-bold transition-colors shadow-sm"
            title="حزمة نظام PHP & MySQL الكاملة"
          >
            <FileCode className="w-4 h-4 text-emerald-400" />
            <span className="hidden sm:inline">نسخة PHP & MySQL</span>
          </button>

          {/* Notifications Dropdown Toggle */}
          <div className="relative">
            <button
              onClick={() => setShowNotifications(!showNotifications)}
              className="relative p-2 rounded-lg bg-[#1e293b] hover:bg-[#334155] text-slate-300 hover:text-white border border-[#334155] transition-colors"
              title="سجل الإشعارات والتنبيهات"
            >
              <Bell className="w-4 h-4" />
              {notifications.length > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 bg-blue-600 text-white rounded-full text-[10px] font-bold flex items-center justify-center font-mono">
                  {notifications.length}
                </span>
              )}
            </button>

            {/* Notification Drawer */}
            {showNotifications && (
              <div className="absolute left-0 mt-2 w-80 sm:w-96 bg-[#1e293b] border border-[#334155] rounded-xl shadow-2xl p-3 z-50 animate-in fade-in slide-in-from-top-2">
                <div className="flex items-center justify-between pb-2 border-b border-[#334155] mb-2">
                  <div className="flex items-center gap-2 text-xs font-bold text-slate-200">
                    <Bell className="w-3.5 h-3.5 text-blue-400" />
                    <span>إشعارات أوامر العمل الصادرة ({notifications.length})</span>
                  </div>
                  <button 
                    onClick={() => setShowNotifications(false)}
                    className="text-slate-400 hover:text-slate-200"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
                <div className="max-h-72 overflow-y-auto space-y-2 pr-1">
                  {notifications.length === 0 ? (
                    <div className="text-center py-6 text-slate-500 text-xs">
                      لا توجد أوامر عمل جديدة صادرة حالياً
                    </div>
                  ) : (
                    notifications.map((notif) => (
                      <div
                        key={notif.id}
                        className={`p-2.5 rounded-lg border text-xs flex items-start justify-between gap-2 ${
                          notif.type === 'error'
                            ? 'bg-red-500/10 border-red-500/30 text-red-300'
                            : notif.type === 'warning'
                            ? 'bg-yellow-500/10 border-yellow-500/30 text-yellow-300'
                            : notif.type === 'success'
                            ? 'bg-green-500/10 border-green-500/30 text-green-300'
                            : 'bg-[#0f172a] border-[#334155] text-slate-300'
                        }`}
                      >
                        <div className="space-y-1">
                          <p className="leading-relaxed">{notif.message}</p>
                          <span className="text-[10px] text-slate-500 font-mono block">
                            {notif.timestamp}
                          </span>
                        </div>
                        <button
                          onClick={() => dismissNotification(notif.id)}
                          className="text-slate-500 hover:text-slate-300 text-xs"
                        >
                          ×
                        </button>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Emergency Breakdown Trigger Button */}
          <button
            onClick={() => triggerEmergencyBreakdown()}
            className="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md text-sm font-bold shadow-md shadow-red-600/20 transition-all active:scale-95"
          >
            <ShieldAlert className="w-4 h-4" />
            <span>+ بلاغ عطل طارئ</span>
          </button>
        </div>
      </div>

      {/* PHP Package Export Info Modal */}
      {showPhpModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm text-right">
          <div className="bg-[#1e293b] border border-emerald-500/40 rounded-2xl w-full max-w-2xl shadow-2xl p-6 space-y-4 font-sans text-slate-200 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between border-b border-[#334155] pb-3">
              <div className="flex items-center gap-2">
                <Server className="w-5 h-5 text-emerald-400" />
                <h3 className="text-base font-bold text-white">حزمة نظام إدارة الصيانة بلغة PHP & HTML5 & MySQL</h3>
              </div>
              <button 
                onClick={() => setShowPhpModal(false)}
                className="text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs leading-relaxed">
              <p className="text-slate-300">
                تمت برمجة وإعداد النسخة الكاملة والمستقلة للنظام بلغة <strong className="text-emerald-400">PHP 7.4/8+ و HTML5 وقاعدة بيانات MySQL</strong> مع الحفاظ على كافة الماكينات، أوامر العمل، محطات الخدمات، وتقارير الدوريات داخل مجلد <code className="bg-slate-900 px-2 py-0.5 rounded text-emerald-300 font-mono">/php_cmms/</code>.
              </p>

              <div className="p-3.5 rounded-xl bg-[#0f172a] border border-[#334155] space-y-2">
                <div className="font-bold text-white flex items-center gap-1.5">
                  <Download className="w-4 h-4 text-blue-400" />
                  <span>طريقة تحميل وتشغيل حزمة PHP:</span>
                </div>
                <ol className="list-decimal list-inside space-y-1 text-slate-300 pr-2">
                  <li>من قائمة الإعدادات أعلى الشاشة، اختر <strong>Export as ZIP</strong> لتحميل المشروع بالكامل.</li>
                  <li>ستجد مجلد <code className="text-emerald-300 font-mono">php_cmms</code> جاهزاً للنقل إلى سيرفر محلي (XAMPP / WAMP) أو استضافة cPanel.</li>
                  <li>يتضمن المجلد ملف <code className="text-amber-300 font-mono">database/schema.sql</code> لاستيراده بنقرة واحدة في phpMyAdmin.</li>
                  <li>كما يحتوي على محرك تخزين تلقائي (Fallback) يتيح تشغيله فوراً حتى بدون ربط قاعدة بيانات عبر الأمر: <code className="text-blue-300 font-mono">php -S localhost:8000</code>.</li>
                </ol>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-center">
                <div className="p-2 rounded-lg bg-slate-800/60 border border-slate-700">
                  <span className="block text-slate-400 text-[10px]">الملف الرئيسي</span>
                  <span className="font-mono font-bold text-white text-[11px]">index.php</span>
                </div>
                <div className="p-2 rounded-lg bg-slate-800/60 border border-slate-700">
                  <span className="block text-slate-400 text-[10px]">أوامر العمل</span>
                  <span className="font-mono font-bold text-white text-[11px]">work_orders.php</span>
                </div>
                <div className="p-2 rounded-lg bg-slate-800/60 border border-slate-700">
                  <span className="block text-slate-400 text-[10px]">محضر الدوريات</span>
                  <span className="font-mono font-bold text-white text-[11px]">shift_reports.php</span>
                </div>
                <div className="p-2 rounded-lg bg-slate-800/60 border border-slate-700">
                  <span className="block text-slate-400 text-[10px]">قاعدة البيانات</span>
                  <span className="font-mono font-bold text-emerald-400 text-[11px]">schema.sql</span>
                </div>
              </div>
            </div>

            <div className="pt-3 border-t border-[#334155] flex justify-end">
              <button 
                onClick={() => setShowPhpModal(false)}
                className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs shadow-md shadow-blue-600/20"
              >
                إغلاق النافذة
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
