import React, { useState, useEffect } from 'react';
import { X, CheckSquare, Plus, CheckCircle2, AlertTriangle, AlertOctagon } from 'lucide-react';

export interface ChecklistItemData {
  id: string;
  title: string;
  area: string;
  status: 'PASSED' | 'WARNING' | 'FAILED';
  notes?: string;
  method?: string;
  checkedAt?: string;
}

interface ChecklistModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (item: ChecklistItemData) => void;
  initialItem?: ChecklistItemData | null;
  existingCount?: number;
}

const COMMON_AREAS = [
  'محطة الطاقة والضواغط المركزية',
  'قاعة الروتو (ROTO)',
  'قاعة الفليكسو (FLEXO)',
  'قاعة بثق البولي إيثيلين (PE)',
  'قاعة صناعة الأكياس (BAG)',
  'قاعة السلندرات والمونتاج (CYL)',
  'قاعة الشرائط الضيقة (NARROW)',
  'قاعة التبطين والتصفيح (COAT)',
  'قاعة طباعة وتفصيل الصفيح (TIN)',
  'محطة مبردات الشيلر والبويلر',
  'كافة القاعات والخطوط'
];

const INSPECTION_METHODS = [
  'فحص بصري وميداني (Visual)',
  'قياس حراري ليزري (Thermal IR)',
  'قياس ضغط واهتزاز (Pressure & Vibration)',
  'فحص كهربائي وتأريض (Electrical & LOTO)',
  'معايرة مخبرية ولزوجة (Lab & Viscosity)',
  'اختبار تشغيل وأمان (Operational E-Stop)'
];

export const ChecklistModal: React.FC<ChecklistModalProps> = ({
  isOpen,
  onClose,
  onSave,
  initialItem,
  existingCount = 0,
}) => {
  const [title, setTitle] = useState('');
  const [area, setArea] = useState(COMMON_AREAS[0]);
  const [status, setStatus] = useState<'PASSED' | 'WARNING' | 'FAILED'>('PASSED');
  const [method, setMethod] = useState(INSPECTION_METHODS[0]);
  const [notes, setNotes] = useState('');

  useEffect(() => {
    if (initialItem) {
      setTitle(initialItem.title || '');
      setArea(initialItem.area || COMMON_AREAS[0]);
      setStatus(initialItem.status || 'PASSED');
      setMethod(initialItem.method || INSPECTION_METHODS[0]);
      setNotes(initialItem.notes || '');
    } else {
      setTitle('');
      setArea(COMMON_AREAS[0]);
      setStatus('PASSED');
      setMethod(INSPECTION_METHODS[0]);
      setNotes('');
    }
  }, [initialItem, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    const autoId = initialItem?.id || `CHK-${String(existingCount + 1).padStart(2, '0')}`;
    const nowTime = new Date().toLocaleTimeString('ar-EG', { hour: '2-digit', minute: '2-digit' });

    onSave({
      id: autoId,
      title: title.trim(),
      area,
      status,
      method,
      notes: notes.trim() || undefined,
      checkedAt: nowTime,
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in">
      <div className="bg-[#1e293b] border border-blue-500/40 rounded-2xl w-full max-w-lg shadow-2xl p-6 space-y-5 text-right font-sans text-slate-100">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-[#334155] pb-3">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-blue-600/20 text-blue-400 flex items-center justify-center">
              <CheckSquare className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white">
                {initialItem ? 'تعديل بند الفحص الميداني' : 'إضافة بند فحص ميداني جديد للدورية'}
              </h3>
              <p className="text-[11px] text-slate-400">
                تسجيل نقاط التفتيش والمواصفات الفنية المعتمدة
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-300">
              عنوان بند الفحص والمعدة المراد تفتيشها *
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="مثال: فحص تسريب زيت هيدروليك درافيل الطباعة وماكينة F&K..."
              className="w-full bg-[#0f172a] border border-[#334155] rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-blue-500"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-300">القاعة أو المحطة الميدانية</label>
              <select
                value={area}
                onChange={(e) => setArea(e.target.value)}
                className="w-full bg-[#0f172a] border border-[#334155] rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-blue-500"
              >
                {COMMON_AREAS.map((a) => (
                  <option key={a} value={a}>{a}</option>
                ))}
              </select>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-300">طريقة الفحص والقياس</label>
              <select
                value={method}
                onChange={(e) => setMethod(e.target.value)}
                className="w-full bg-[#0f172a] border border-[#334155] rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-blue-500"
              >
                {INSPECTION_METHODS.map((m) => (
                  <option key={m} value={m}>{m}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-300">نتيجة الفحص وحالة البند</label>
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => setStatus('PASSED')}
                className={`py-2 px-2 rounded-xl text-xs font-bold border transition-all flex items-center justify-center gap-1.5 ${
                  status === 'PASSED'
                    ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500 shadow-sm'
                    : 'bg-[#0f172a] text-slate-400 border-[#334155] hover:border-slate-500'
                }`}
              >
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                <span>مطابق وسليم</span>
              </button>

              <button
                type="button"
                onClick={() => setStatus('WARNING')}
                className={`py-2 px-2 rounded-xl text-xs font-bold border transition-all flex items-center justify-center gap-1.5 ${
                  status === 'WARNING'
                    ? 'bg-amber-500/20 text-amber-300 border-amber-500 shadow-sm'
                    : 'bg-[#0f172a] text-slate-400 border-[#334155] hover:border-slate-500'
                }`}
              >
                <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />
                <span>تنبيه ومتابعة</span>
              </button>

              <button
                type="button"
                onClick={() => setStatus('FAILED')}
                className={`py-2 px-2 rounded-xl text-xs font-bold border transition-all flex items-center justify-center gap-1.5 ${
                  status === 'FAILED'
                    ? 'bg-red-500/20 text-red-300 border-red-500 shadow-sm'
                    : 'bg-[#0f172a] text-slate-400 border-[#334155] hover:border-slate-500'
                }`}
              >
                <AlertOctagon className="w-3.5 h-3.5 text-red-400" />
                <span>عطل مسجل</span>
              </button>
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-300">
              التفاصيل والملاحظات الفنية والإجراء الميداني
            </label>
            <textarea
              rows={3}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="سجل القراءات اللحظية أو الملاحظات أو الإجراء المتخذ فوراً..."
              className="w-full bg-[#0f172a] border border-[#334155] rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-blue-500"
            />
          </div>

          <div className="flex items-center justify-end gap-2 pt-2 border-t border-[#334155]">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl bg-[#334155] hover:bg-slate-600 text-white text-xs font-bold transition-colors"
            >
              إلغاء
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold shadow-lg shadow-blue-600/20 transition-all flex items-center gap-1.5"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>{initialItem ? 'حفظ التعديلات' : 'إضافة البند للمحضر'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
