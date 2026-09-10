import React, { useState, useEffect } from 'react';
import { X, Thermometer, Plus, CheckCircle2, AlertTriangle, AlertOctagon } from 'lucide-react';
import { CustomEnvironmentalParam } from '../../types';

interface CustomEnvParamModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (param: CustomEnvironmentalParam) => void;
  initialParam?: CustomEnvironmentalParam | null;
}

const COMMON_PRESETS = [
  { name: 'سرعة تدفق هواء التهوية وسحب المذيبات', category: 'ENVIRONMENTAL' as const, unit: 'm/s', targetRange: '1.2 - 2.5 m/s' },
  { name: 'تركيز غاز المذيبات بقاعة الروتو', category: 'ENVIRONMENTAL' as const, unit: 'PPM', targetRange: '< 25 PPM' },
  { name: 'الضغط التفاضلي لغرفة العمليات النظيفة', category: 'ENVIRONMENTAL' as const, unit: 'Pa', targetRange: '15 - 30 Pa' },
  { name: 'معامل القدرة الكهربائي للمصنع (Power Factor)', category: 'UTILITY' as const, unit: 'Cos φ', targetRange: '0.92 - 0.98' },
  { name: 'درجة نقاوة ماء معالجة الـ RO ومياه الجلرات', category: 'UTILITY' as const, unit: 'TDS (ppm)', targetRange: '< 80 ppm' },
  { name: 'درجة حرارة زيت التروس لمحطة البثق PE', category: 'UTILITY' as const, unit: '°C', targetRange: '55 - 70 °C' },
  { name: 'نسبة الأوكسجين في قاعة الأحبار', category: 'AIR_QUALITY' as const, unit: '%', targetRange: '19.5% - 21.5%' },
];

export const CustomEnvParamModal: React.FC<CustomEnvParamModalProps> = ({
  isOpen,
  onClose,
  onSave,
  initialParam,
}) => {
  const [name, setName] = useState('');
  const [category, setCategory] = useState<NonNullable<CustomEnvironmentalParam['category']>>('ENVIRONMENTAL');
  const [value, setValue] = useState<string>('24');
  const [unit, setUnit] = useState('°C');
  const [targetRange, setTargetRange] = useState('');
  const [status, setStatus] = useState<'NORMAL' | 'WARNING' | 'CRITICAL'>('NORMAL');
  const [notes, setNotes] = useState('');

  useEffect(() => {
    if (initialParam) {
      setName(initialParam.name);
      setCategory(initialParam.category);
      setValue(String(initialParam.value));
      setUnit(initialParam.unit);
      setTargetRange(initialParam.targetRange || '');
      setStatus(initialParam.status);
      setNotes(initialParam.notes || '');
    } else {
      setName('');
      setCategory('ENVIRONMENTAL');
      setValue('24');
      setUnit('°C');
      setTargetRange('20 - 26 °C');
      setStatus('NORMAL');
      setNotes('');
    }
  }, [initialParam, isOpen]);

  const handlePresetSelect = (preset: typeof COMMON_PRESETS[0]) => {
    setName(preset.name);
    setCategory(preset.category);
    setUnit(preset.unit);
    setTargetRange(preset.targetRange);
  };

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    onSave({
      id: initialParam?.id || `PARAM-${Date.now().toString(36).toUpperCase()}`,
      name: name.trim(),
      category,
      value: isNaN(Number(value)) ? 0 : Number(value),
      unit: unit.trim(),
      targetRange: targetRange.trim() || undefined,
      status,
      notes: notes.trim() || undefined,
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in">
      <div className="bg-[#1e293b] border border-emerald-500/40 rounded-2xl w-full max-w-lg shadow-2xl p-6 space-y-5 text-right font-sans text-slate-100">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-[#334155] pb-3">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
              <Thermometer className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white">
                {initialParam ? 'تعديل المؤشر البيئي أو محطة الطاقة' : 'إضافة مؤشر بيئي أو محطة طاقة جديدة للدورية'}
              </h3>
              <p className="text-[11px] text-slate-400">
                تخصيص مؤشرات القياس والظروف الصناعية ومحطات الطاقة
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

        {/* Quick Presets */}
        {!initialParam && (
          <div className="space-y-1.5">
            <label className="text-[11px] font-bold text-slate-400">مؤشرات صناعية جاهزة وسريعة:</label>
            <div className="flex flex-wrap gap-1.5">
              {COMMON_PRESETS.map((p, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => handlePresetSelect(p)}
                  className="px-2.5 py-1 rounded-lg bg-[#0f172a] hover:bg-emerald-500/20 border border-[#334155] hover:border-emerald-500/40 text-[11px] text-slate-300 transition-all text-right"
                >
                  + {p.name}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-300">
              اسم المؤشر أو المعامل الصناعي *
            </label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="مثال: سرعة تدفق الهواء، تركيز المذيبات، ضغط البويلر..."
              className="w-full bg-[#0f172a] border border-[#334155] rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-300">التصنيف</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as any)}
                className="w-full bg-[#0f172a] border border-[#334155] rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500"
              >
                <option value="ENVIRONMENTAL">ظروف بيئية وصناعية</option>
                <option value="UTILITY">محطة طاقة وخدمات</option>
                <option value="SAFETY">سلامة وأمان مهني</option>
              </select>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-300">القيمة المرصودة *</label>
              <input
                type="text"
                required
                value={value}
                onChange={(e) => setValue(e.target.value)}
                className="w-full bg-[#0f172a] border border-[#334155] rounded-xl px-3 py-2 text-xs text-white font-mono focus:outline-none focus:border-emerald-500"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-300">وحدة القياس</label>
              <input
                type="text"
                value={unit}
                onChange={(e) => setUnit(e.target.value)}
                placeholder="PPM, °C, Bar, m/s..."
                className="w-full bg-[#0f172a] border border-[#334155] rounded-xl px-3 py-2 text-xs text-white font-mono focus:outline-none focus:border-emerald-500"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-300">
              النطاق المستهدف أو المقبول
            </label>
            <input
              type="text"
              value={targetRange}
              onChange={(e) => setTargetRange(e.target.value)}
              placeholder="مثال: < 25 PPM أو 7.8 - 8.6 Bar"
              className="w-full bg-[#0f172a] border border-[#334155] rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-300">الحالة والتقييم</label>
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => setStatus('NORMAL')}
                className={`py-2 px-2 rounded-xl text-xs font-bold border transition-all flex items-center justify-center gap-1.5 ${
                  status === 'NORMAL'
                    ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500 shadow-sm'
                    : 'bg-[#0f172a] text-slate-400 border-[#334155] hover:border-slate-500'
                }`}
              >
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                <span>طبيعي</span>
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
                <span>تنبيه</span>
              </button>

              <button
                type="button"
                onClick={() => setStatus('CRITICAL')}
                className={`py-2 px-2 rounded-xl text-xs font-bold border transition-all flex items-center justify-center gap-1.5 ${
                  status === 'CRITICAL'
                    ? 'bg-red-500/20 text-red-300 border-red-500 shadow-sm'
                    : 'bg-[#0f172a] text-slate-400 border-[#334155] hover:border-slate-500'
                }`}
              >
                <AlertOctagon className="w-3.5 h-3.5 text-red-400" />
                <span>حرج</span>
              </button>
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-300">
              التفاصيل والملاحظات الإضافية
            </label>
            <textarea
              rows={2}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="سجل أي ملاحظات أو شروحات إضافية للمهندس..."
              className="w-full bg-[#0f172a] border border-[#334155] rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500"
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
              className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold shadow-lg shadow-emerald-600/20 transition-all flex items-center gap-1.5"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>{initialParam ? 'حفظ التعديلات' : 'إضافة المؤشر'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
