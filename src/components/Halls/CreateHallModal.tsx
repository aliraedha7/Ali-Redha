import React, { useState } from 'react';
import { 
  X, 
  Building2, 
  Plus, 
  ShieldCheck, 
  User, 
  Zap, 
  FileText, 
  Tag, 
  LayoutGrid,
  Layers,
  Printer,
  Package,
  Wrench,
  Gauge,
  Sparkles
} from 'lucide-react';
import { useCMMS } from '../../context/CMMSContext';

const ICON_OPTIONS = [
  { id: 'printer', label: 'طباعة (Printer)', icon: Printer },
  { id: 'film', label: 'بثق وأفلام (Film)', icon: Layers },
  { id: 'package', label: 'أكياس وتغليف (Package)', icon: Package },
  { id: 'gauge', label: 'سلندرات ومحاور (Gauge)', icon: Gauge },
  { id: 'tool', label: 'ميكانيك وقص (Cutter)', icon: Wrench },
  { id: 'layers', label: 'طلاء وتصفيح (Coating)', icon: Layers },
  { id: 'zap', label: 'كهرباء ومرافق (Power)', icon: Zap },
];

export const CreateHallModal: React.FC = () => {
  const { isCreateHallOpen, setIsCreateHallOpen, addHangar, hangars } = useCMMS();

  const [code, setCode] = useState('');
  const [name, setName] = useState('');
  const [nameEn, setNameEn] = useState('');
  const [description, setDescription] = useState('');
  const [supervisor, setSupervisor] = useState('م. علي رضا');
  const [dedicatedUpsName, setDedicatedUpsName] = useState('');
  const [iconType, setIconType] = useState<"printer" | "film" | "package" | "gauge" | "zap" | "flame" | "layers" | "wind" | "tool">('printer');
  const [error, setError] = useState<string | null>(null);

  if (!isCreateHallOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const trimmedCode = code.trim().toUpperCase() || `HALL-${Date.now().toString().slice(-4)}`;
    const trimmedName = name.trim();
    const trimmedNameEn = nameEn.trim() || trimmedName;

    if (!trimmedName) {
      setError('يرجى كتابة اسم قاعة الإنتاج');
      return;
    }

    // Check duplicate code
    if (hangars.some((h) => h.id.toUpperCase() === trimmedCode || h.code?.toUpperCase() === trimmedCode)) {
      setError('رمز القاعة هذا مستخدم مسبقاً، يرجى اختيار رمز مختلف');
      return;
    }

    const upsId = `UPS-${trimmedCode.replace(/^HALL-/, '')}`;

    addHangar({
      id: trimmedCode,
      code: trimmedCode,
      name: trimmedName,
      nameEn: trimmedNameEn,
      description: description.trim() || 'قاعة إنتاجية مخصصة لعمليات التغليف المرن',
      supervisor: supervisor.trim() || 'مهندس الموقع',
      dedicatedUpsId: upsId,
      dedicatedUpsName: dedicatedUpsName.trim() || 'Schneider Galaxy Industrial UPS',
      iconType,
    });

    // Reset and close
    setCode('');
    setName('');
    setNameEn('');
    setDescription('');
    setDedicatedUpsName('');
    setIsCreateHallOpen(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm overflow-y-auto animate-fadeIn">
      <div 
        id="create-hall-modal-container"
        className="relative w-full max-w-2xl bg-slate-900 border border-slate-700/80 rounded-2xl shadow-2xl overflow-hidden my-8"
        dir="rtl"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-slate-800 bg-gradient-to-r from-slate-900 via-slate-800/80 to-slate-900">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400">
              <Building2 className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                إضافة قاعة إنتاج جديدة
                <span className="text-xs font-mono bg-amber-500/20 text-amber-300 px-2 py-0.5 rounded border border-amber-500/30">
                  New Production Hall
                </span>
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">
                توسعة المنظومة الصناعية وإضافة قسم أو خط إنتاجي جديد تحت إشراف الصيانة
              </p>
            </div>
          </div>
          <button
            id="btn-close-create-hall-modal"
            onClick={() => setIsCreateHallOpen(false)}
            className="p-2 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          {error && (
            <div className="p-3 bg-red-500/10 border border-red-500/30 rounded-xl text-red-400 text-xs font-semibold">
              {error}
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Hall Code */}
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1.5 flex items-center gap-1.5">
                <Tag className="w-3.5 h-3.5 text-amber-400" />
                رمز / كود القاعة (ID)
              </label>
              <input
                id="hall-code-input"
                type="text"
                placeholder="مثال: HALL-LBL أو HALL-EXT"
                value={code}
                onChange={(e) => setCode(e.target.value)}
                className="w-full bg-slate-800/80 border border-slate-700 rounded-xl px-3.5 py-2 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-amber-500 font-mono"
              />
              <span className="text-[11px] text-slate-500 mt-1 block">يترك فارغاً للتوليد التلقائي</span>
            </div>

            {/* Icon Picker */}
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1.5 flex items-center gap-1.5">
                <LayoutGrid className="w-3.5 h-3.5 text-amber-400" />
                طبيعة الأيقونة التعبيرية
              </label>
              <select
                id="hall-icon-select"
                value={iconType}
                onChange={(e) => setIconType(e.target.value as any)}
                className="w-full bg-slate-800/80 border border-slate-700 rounded-xl px-3.5 py-2 text-white text-sm focus:outline-none focus:border-amber-500"
              >
                {ICON_OPTIONS.map((opt) => (
                  <option key={opt.id} value={opt.id}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Arabic Name */}
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1.5 flex items-center gap-1.5">
                <Building2 className="w-3.5 h-3.5 text-amber-400" />
                اسم القاعة باللغة العربية <span className="text-red-400">*</span>
              </label>
              <input
                id="hall-name-input"
                type="text"
                required
                placeholder="مثال: قاعة الطباعة الرقمية (DIGITAL HALL)"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full bg-slate-800/80 border border-slate-700 rounded-xl px-3.5 py-2 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-amber-500"
              />
            </div>

            {/* English Name */}
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1.5">
                اسم القاعة بالإنجليزية (English Tag)
              </label>
              <input
                id="hall-name-en-input"
                type="text"
                placeholder="مثال: DIGITAL PRINT HALL"
                value={nameEn}
                onChange={(e) => setNameEn(e.target.value)}
                className="w-full bg-slate-800/80 border border-slate-700 rounded-xl px-3.5 py-2 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-amber-500 font-mono"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Supervisor */}
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1.5 flex items-center gap-1.5">
                <User className="w-3.5 h-3.5 text-amber-400" />
                المشرف الهندسي / مسؤول القاعة
              </label>
              <input
                id="hall-supervisor-input"
                type="text"
                placeholder="مثال: م. علي رضا / م. حسام"
                value={supervisor}
                onChange={(e) => setSupervisor(e.target.value)}
                className="w-full bg-slate-800/80 border border-slate-700 rounded-xl px-3.5 py-2 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-amber-500"
              />
            </div>

            {/* Dedicated UPS */}
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1.5 flex items-center gap-1.5">
                <Zap className="w-3.5 h-3.5 text-amber-400" />
                وحدة الـ UPS الكهربائية المخصصة
              </label>
              <input
                id="hall-ups-input"
                type="text"
                placeholder="مثال: Schneider Galaxy 300 (60 kVA)"
                value={dedicatedUpsName}
                onChange={(e) => setDedicatedUpsName(e.target.value)}
                className="w-full bg-slate-800/80 border border-slate-700 rounded-xl px-3.5 py-2 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-amber-500"
              />
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-xs font-bold text-slate-300 mb-1.5 flex items-center gap-1.5">
              <FileText className="w-3.5 h-3.5 text-amber-400" />
              الوصف الفني والنشاط الإنتاجي للقاعة
            </label>
            <textarea
              id="hall-description-textarea"
              rows={3}
              placeholder="وصف العمليات الإنتاجية، أنواع الخطوط، متطلبات الهواء المضغوط والحرارة ومياه التبريد..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full bg-slate-800/80 border border-slate-700 rounded-xl p-3 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-amber-500"
            />
          </div>

          {/* Footer Actions */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-800">
            <button
              id="btn-cancel-create-hall"
              type="button"
              onClick={() => setIsCreateHallOpen(false)}
              className="px-4 py-2 text-sm text-slate-400 hover:text-white hover:bg-slate-800 rounded-xl transition"
            >
              إلغاء
            </button>
            <button
              id="btn-submit-create-hall"
              type="submit"
              className="flex items-center gap-2 px-5 py-2 text-sm font-bold text-slate-950 bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 rounded-xl transition shadow-lg shadow-amber-500/20"
            >
              <Plus className="w-4 h-4" />
              تثبيت وإضافة القاعة للمنظومة
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
