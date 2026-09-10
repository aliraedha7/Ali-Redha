import React from 'react';
import { ShieldAlert, Lock, UserCheck, X, CheckCircle2 } from 'lucide-react';
import { useCMMS } from '../../context/CMMSContext';

export const PermissionWarningModal: React.FC = () => {
  const { 
    permissionWarningModal, 
    closePermissionWarning, 
    currentUser, 
    users, 
    setCurrentUser,
    setActiveTab 
  } = useCMMS();

  if (!permissionWarningModal || !permissionWarningModal.isOpen) return null;

  // Find the system developer account to suggest switching
  const devAccount = users.find((u) => u.isSuperDeveloper || u.role === 'DEVELOPER');

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-in fade-in">
      <div 
        className="bg-[#1e293b] border border-amber-500/40 rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden text-right font-sans text-slate-100"
        role="dialog"
        aria-modal="true"
      >
        {/* Header */}
        <div className="p-5 bg-gradient-to-r from-amber-950/40 via-[#1e293b] to-[#1e293b] border-b border-[#334155] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
              <ShieldAlert className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">إجراء مقيد بالصلاحيات الأمنية</h3>
              <p className="text-xs text-amber-400 font-mono">Permission Restricted Action</p>
            </div>
          </div>
          <button
            onClick={closePermissionWarning}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-[#334155] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-4 text-sm">
          <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-200 text-xs leading-relaxed">
            <p className="font-semibold text-amber-300 mb-1">
              تنبيه أمني من نظام إدارة الصيانة:
            </p>
            حسابك الحالي <strong className="text-white">({currentUser ? `${currentUser.fullName} - ${currentUser.roleTitle}` : 'غير مسجل الدخول'})</strong> لا يملك الصلاحية المطلوبة لتنفيذ:
            <div className="mt-2 p-2 bg-[#0f172a] rounded-lg font-mono text-white text-xs border border-amber-500/30">
              • الإجراء: {permissionWarningModal.actionName}
              <br />
              • الصلاحية المطلوبة: {permissionWarningModal.requiredPermission}
            </div>
          </div>

          <div className="p-4 rounded-xl bg-[#0f172a] border border-[#334155] space-y-2 text-xs text-slate-300">
            <div className="flex items-center gap-2 text-blue-400 font-bold">
              <Lock className="w-4 h-4" />
              <span>سياسة التحكم في الوصول (RBAC):</span>
            </div>
            <p className="leading-relaxed text-slate-400">
              وفقاً لتعليمات وتفويض مطور النظام ومدير الصيانة <strong className="text-slate-200">م. علي رضا</strong>، يتم تقييد عمليات التعديل والحذف وإصدار أوامر العمل لتفادي الأخطاء التشغيلية وحفظ سجل الجودة.
            </p>
          </div>

          {/* Quick switch to developer option */}
          {devAccount && (!currentUser || currentUser.id !== devAccount.id) && (
            <div className="p-3.5 rounded-xl bg-blue-950/30 border border-blue-500/30 flex items-center justify-between gap-3 text-xs">
              <div className="space-y-0.5">
                <span className="font-bold text-blue-300 block">هل أنت م. علي رضا (مطور النظام)؟</span>
                <span className="text-slate-400 text-[11px]">يمكنك التبديل إلى حساب المطور فوراً لتجاوز القيد وإدارة الصلاحيات</span>
              </div>
              <button
                onClick={() => {
                  setCurrentUser(devAccount);
                  closePermissionWarning();
                }}
                className="px-3 py-1.5 bg-blue-600 hover:bg-blue-500 text-white rounded-lg font-bold text-xs whitespace-nowrap transition-colors"
              >
                تبديل لمطور النظام
              </button>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="p-4 bg-[#0f172a] border-t border-[#334155] flex items-center justify-between">
          {currentUser?.permissions?.canViewDeveloperHub ? (
            <button
              onClick={() => {
                closePermissionWarning();
                setActiveTab('developer-hub');
              }}
              className="text-xs text-blue-400 hover:text-blue-300 underline font-medium"
            >
              الانتقال إلى لوحة المطور والصلاحيات ←
            </button>
          ) : (
            <span className="text-xs text-slate-500">راجع مدير إدارة الصيانة م. علي رضا لمنحك الصلاحية</span>
          )}

          <button
            onClick={closePermissionWarning}
            className="px-5 py-2 rounded-xl bg-[#334155] hover:bg-slate-600 text-white text-xs font-bold transition-colors"
          >
            إغلاق
          </button>
        </div>
      </div>
    </div>
  );
};
