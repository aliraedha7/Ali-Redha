import React, { useEffect } from 'react';
import { Trash2, AlertTriangle, X } from 'lucide-react';
import { useCMMS } from '../../context/CMMSContext';

export const ConfirmDeleteModal: React.FC = () => {
  const { deleteConfirmation, closeDeleteConfirmation } = useCMMS();

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && deleteConfirmation?.isOpen) {
        closeDeleteConfirmation();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [deleteConfirmation, closeDeleteConfirmation]);

  if (!deleteConfirmation || !deleteConfirmation.isOpen) return null;

  const handleConfirm = () => {
    try {
      deleteConfirmation.onConfirm();
    } finally {
      closeDeleteConfirmation();
    }
  };

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div 
        className="relative w-full max-w-md bg-[#1e293b] border border-red-500/40 rounded-2xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200 text-right font-sans"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top ambient red accent glow */}
        <div className="absolute -top-24 -left-24 w-48 h-48 bg-red-500/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -top-24 -right-24 w-48 h-48 bg-rose-600/15 rounded-full blur-3xl pointer-events-none" />

        {/* Header */}
        <div className="p-5 pb-4 flex items-start justify-between border-b border-[#334155] relative z-10">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-red-500/15 border border-red-500/30 flex items-center justify-center text-red-400 shadow-inner">
              <Trash2 className="w-6 h-6 animate-pulse" />
            </div>
            <div>
              <h3 className="text-lg font-black text-white flex items-center gap-2">
                <span>{deleteConfirmation.title || 'تأكيد الحذف النهائي'}</span>
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">عملية حذف لا رجعة فيها من قاعدة البيانات</p>
            </div>
          </div>

          <button
            onClick={closeDeleteConfirmation}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-700/60 transition-colors"
            title="إلغاء"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-5 space-y-4 relative z-10">
          <p className="text-sm text-slate-200 leading-relaxed font-medium">
            {deleteConfirmation.message}
          </p>

          {deleteConfirmation.itemDetails && (
            <div className="p-3 bg-[#0f172a] rounded-xl border border-red-500/20 text-xs font-mono text-red-300 flex items-center justify-between">
              <span className="text-slate-400 font-sans">العنصر المحدد:</span>
              <span className="font-bold text-white bg-red-950/60 px-2 py-0.5 rounded border border-red-500/30">
                {deleteConfirmation.itemDetails}
              </span>
            </div>
          )}

          <div className="p-3 bg-amber-500/10 border border-amber-500/20 rounded-xl flex items-center gap-2.5 text-xs text-amber-300">
            <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0" />
            <span>تنبيه: سيتم استبعاد هذا السجل فوراً ولن تتمكن من استرجاعه.</span>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-4 bg-[#0f172a]/90 border-t border-[#334155] flex items-center justify-end gap-3 relative z-10">
          <button
            type="button"
            onClick={closeDeleteConfirmation}
            className="px-4 py-2.5 rounded-xl bg-slate-700 hover:bg-slate-600 text-slate-200 text-xs font-bold transition-all active:scale-95"
          >
            إلغاء وتراجع
          </button>

          <button
            type="button"
            onClick={handleConfirm}
            className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 text-white text-xs font-black shadow-lg shadow-red-600/30 transition-all active:scale-95 flex items-center gap-2 border border-red-400/30"
          >
            <Trash2 className="w-4 h-4" />
            <span>{deleteConfirmation.confirmLabel || 'تأكيد الحذف النهائي'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
