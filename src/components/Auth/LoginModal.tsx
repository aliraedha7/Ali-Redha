import React, { useState, useEffect } from 'react';
import { 
  X, 
  Key, 
  Lock, 
  User, 
  CheckCircle2, 
  AlertCircle, 
  ShieldCheck, 
  Eye, 
  EyeOff, 
  LogIn, 
  Shield
} from 'lucide-react';
import { useCMMS } from '../../context/CMMSContext';

export const LoginModal: React.FC = () => {
  const { 
    isLoginModalOpen, 
    setIsLoginModalOpen, 
    isLoggedIn,
    loginWithCredentials, 
    currentUser 
  } = useCMMS();

  const [username, setUsername] = useState<string>('');
  const [passcode, setPasscode] = useState<string>('');
  const [showPasscode, setShowPasscode] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [successMessage, setSuccessMessage] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  // Initialize or reset when modal opens
  useEffect(() => {
    if (isLoginModalOpen) {
      setErrorMessage('');
      setSuccessMessage('');
      setPasscode('');
      if (!isLoggedIn) {
        setUsername('');
      }
    }
  }, [isLoginModalOpen, isLoggedIn]);

  if (!isLoginModalOpen) return null;

  const handleClose = () => {
    // Only allow closing if already logged in
    if (isLoggedIn) {
      setIsLoginModalOpen(false);
      setErrorMessage('');
    }
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    setSuccessMessage('');
    setIsSubmitting(true);

    setTimeout(() => {
      const result = loginWithCredentials(username, passcode);
      if (result.success) {
        setSuccessMessage(`أهلاً بك م. ${result.user?.fullName}! جاري توجيهك لمنظومة الصيانة...`);
        setTimeout(() => {
          setIsSubmitting(false);
          setIsLoginModalOpen(false);
        }, 500);
      } else {
        setIsSubmitting(false);
        setErrorMessage(result.message);
      }
    }, 250);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-md overflow-y-auto animate-in fade-in">
      <div 
        className="bg-[#1e293b] border border-[#334155] rounded-3xl w-full max-w-md shadow-2xl overflow-hidden text-right font-sans text-slate-100 my-6 relative"
        role="dialog"
      >
        {/* Top Decorative Industrial Banner */}
        <div className="bg-gradient-to-r from-blue-700 via-indigo-700 to-purple-800 p-6 text-white relative overflow-hidden">
          <div className="absolute -right-8 -top-8 w-36 h-36 bg-white/10 rounded-full blur-2xl pointer-events-none" />
          <div className="absolute -left-6 -bottom-6 w-32 h-32 bg-blue-400/15 rounded-full blur-xl pointer-events-none" />

          <div className="flex items-start justify-between relative z-10">
            <div className="flex items-center gap-3.5">
              <div className="w-12 h-12 rounded-2xl bg-white/15 border border-white/25 backdrop-blur-md flex items-center justify-center text-white shadow-inner">
                <ShieldCheck className="w-7 h-7" />
              </div>
              <div>
                <h2 className="text-lg font-black tracking-tight text-white flex items-center gap-2">
                  <span>تسجيل الدخول إلى منظومة الصيانة</span>
                </h2>
                <p className="text-xs text-blue-100 font-medium">
                  معمل المرجان للمطبوعات — CMMS Enterprise
                </p>
              </div>
            </div>

            {isLoggedIn && (
              <button
                onClick={handleClose}
                className="p-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-white/80 hover:text-white transition-colors"
                title="إغلاق"
              >
                <X className="w-5 h-5" />
              </button>
            )}
          </div>

          <div className="mt-4 pt-3 border-t border-white/15 flex items-center justify-between text-[11px] text-blue-100">
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
              <span className="w-2 h-2 rounded-full bg-emerald-400 -mr-2" />
              <span>خادم المصنع الداخلي: محمي ومشفر</span>
            </div>
            <div className="font-mono text-[10px] bg-black/20 px-2 py-0.5 rounded-full">
              SECURE V2.5
            </div>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-4">
          {/* Error Banner */}
          {errorMessage && (
            <div className="p-3 rounded-xl bg-red-500/15 border border-red-500/30 text-red-300 text-xs flex items-start gap-2.5 animate-in fade-in">
              <AlertCircle className="w-4 h-4 text-red-400 flex-shrink-0 mt-0.5" />
              <div className="space-y-0.5">
                <span className="font-bold block">تعذر تسجيل الدخول:</span>
                <span>{errorMessage}</span>
              </div>
            </div>
          )}

          {/* Success Banner */}
          {successMessage && (
            <div className="p-3 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-xs flex items-center gap-2.5 animate-in fade-in">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
              <span className="font-bold">{successMessage}</span>
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            {/* Field 1: Username */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-200 flex items-center justify-between">
                <span className="flex items-center gap-1.5">
                  <User className="w-3.5 h-3.5 text-blue-400" />
                  <span>اسم المستخدم (Username)</span>
                </span>
                <span className="text-[10px] text-slate-400 font-mono">
                  اسم الحساب المسجل
                </span>
              </label>
              <div className="relative">
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 font-mono text-xs">@</span>
                <input
                  type="text"
                  required
                  autoFocus
                  value={username}
                  onChange={(e) => {
                    setUsername(e.target.value);
                    if (errorMessage) setErrorMessage('');
                  }}
                  placeholder="ادخل اسم المستخدم..."
                  className="w-full bg-[#0f172a] border border-[#334155] rounded-xl pr-8 pl-3 py-2.5 text-sm text-white focus:outline-none focus:border-blue-500 font-mono transition-colors"
                />
              </div>
            </div>

            {/* Field 2: Password / PIN Code */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-200 flex items-center justify-between">
                <span className="flex items-center gap-1.5">
                  <Lock className="w-3.5 h-3.5 text-amber-400" />
                  <span>الرمز السري / كلمة المرور (PIN Code)</span>
                </span>
                <span className="text-[10px] text-slate-400 font-mono">
                  الرمز الخاص بحسابك
                </span>
              </label>
              <div className="relative">
                <div className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500">
                  <Key className="w-4 h-4" />
                </div>
                <input
                  type={showPasscode ? 'text' : 'password'}
                  required
                  value={passcode}
                  onChange={(e) => {
                    setPasscode(e.target.value);
                    if (errorMessage) setErrorMessage('');
                  }}
                  placeholder="ادخل الرمز السري الخاص بك..."
                  className="w-full bg-[#0f172a] border border-[#334155] rounded-xl pr-9 pl-10 py-2.5 text-sm text-white focus:outline-none focus:border-blue-500 font-mono tracking-wider font-bold transition-colors"
                />
                <button
                  type="button"
                  onClick={() => setShowPasscode(!showPasscode)}
                  className="absolute left-3 top-1/2 -translate-y-1/2 p-1 text-slate-400 hover:text-slate-200 transition-colors"
                  title={showPasscode ? 'إخفاء الرمز' : 'إظهار الرمز'}
                >
                  {showPasscode ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="pt-2">
              <button
                type="submit"
                disabled={isSubmitting || !username.trim() || !passcode.trim()}
                className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold text-sm shadow-lg shadow-blue-600/25 transition-all flex items-center justify-center gap-2 active:scale-98 disabled:opacity-50 disabled:pointer-events-none"
              >
                <LogIn className="w-4 h-4" />
                <span>{isSubmitting ? 'جاري التحقق من بيانات الدخول...' : 'تسجيل الدخول'}</span>
              </button>
            </div>
          </form>

          {/* Footer Note */}
          <div className="pt-3 border-t border-[#334155] flex items-center justify-between text-[11px] text-slate-400">
            <span className="flex items-center gap-1">
              <Shield className="w-3.5 h-3.5 text-blue-400" />
              <span>تسجيل دخول محمي — معمل المرجان للمطبوعات</span>
            </span>
            {isLoggedIn && (
              <button
                type="button"
                onClick={handleClose}
                className="text-slate-400 hover:text-slate-200 underline text-xs"
              >
                إغلاق
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
