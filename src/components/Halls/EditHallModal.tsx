import React, { useState, useEffect } from 'react';
import { 
  X, 
  Building2, 
  Check, 
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
  Edit3,
  Trash2
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

export const EditHallModal: React.FC = () => {
  const { 
    editingHangar, 
    setEditingHangar, 
    updateHangar, 
    deleteHangar,
    requestDeleteConfirmation,
    assets,
    hangars 
  } = useCMMS();

  const [code, setCode] = useState('');
  const [name, setName] = useState('');
  const [nameEn, setNameEn] = useState('');
  const [description, setDescription] = useState('');
  const [supervisor, setSupervisor] = useState('');
  const [dedicatedUpsName, setDedicatedUpsName] = useState('');
  const [iconType, setIconType] = useState<any>('printer');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (editingHangar) {
      setCode(editingHangar.code || editingHangar.id);
      setName(editingHangar.name || '');
      setNameEn(editingHangar.nameEn || '');
      setDescription(editingHangar.description || '');
      setSupervisor(editingHangar.supervisor || '');
      setDedicatedUpsName(editingHangar.dedicatedUpsName || '');
      setIconType(editingHangar.iconType || 'printer');
      setError(null);
    }
  }, [editingHangar]);

  if (!editingHangar) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const trimmedName = name.trim();
    const trimmedNameEn = nameEn.trim() || trimmedName;

    if (!trimmedName) {
      setError('يرجى إدخال اسم قاعة الإنتاج');
      return;
    }

    updateHangar({
      ...editingHangar,
      code: code.trim() || editingHangar.code,
      name: trimmedName,
      nameEn: trimmedNameEn,
      description: description.trim(),
      supervisor: supervisor.trim(),
      dedicatedUpsName: dedicatedUpsName.trim() || editingHangar.dedicatedUpsName,
      iconType: iconType,
    });

    setEditingHangar(null);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm overflow-y-auto animate-in fade-in zoom-in-95 no-print">
      <div 
        id="edit-hall-modal-container"
        className="relative w-full max-w-2xl bg-slate-900 border border-slate-700/80 rounded-2xl shadow-2xl overflow-hidden my-8"
        dir="rtl"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-slate-800 bg-gradient-to-r from-slate-900 via-slate-800/80 to-slate-900">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400">
              <Edit3 className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-bold text-white tracking-wide">
                  تعديل بيانات قاعة الإنتاج
                </h2>
                <span className="font-mono text-xs px-2 py-0.5 rounded bg-blue-500/20 text-blue-300 border border-blue-500/30">
                  {editingHangar.id}
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                تعديل وتصحيح معلومات القاعة والمشرف الهندسي والوصف التشغيلي
              </p>
            </div>
          </div>

          <button
            type="button"
            id="btn-close-edit-hall-modal"
            onClick={() => setEditingHangar(null)}
            className="p-2 text-slate-400 hover:text-white rounded-xl hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5 max-h-[80vh] overflow-y-auto">
          {error && (
            <div className="p-3 bg-red-500/10 border border-red-500/30 rounded-xl text-red-400 text-xs font-bold flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-red-400" />
              <span>{error}</span>
            </div>
          )}

          {/* Hall Code & Identifier */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1.5">
                رمز ومعرّف القاعة (ID / Code)
              </label>
              <div className="relative">
                <Tag className="w-4 h-4 text-slate-400 absolute right-3 top-3" />
                <input
                  type="text"
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  placeholder="مثال: HALL-ROTO"
                  className="w-full bg-slate-800/80 border border-slate-700 rounded-xl pr-9 pl-3 py-2.5 text-white font-mono text-xs uppercase tracking-wider focus:outline-none focus:border-amber-500"
                />
              </div>
              <p className="text-[10px] text-slate-500 mt-1">
                رمز القاعة المرجعي الداخلي في المنظومة
              </p>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1.5">
                المشرف الهندسي المسؤول
              </label>
              <div className="relative">
                <User className="w-4 h-4 text-slate-400 absolute right-3 top-3" />
                <input
                  type="text"
                  value={supervisor}
                  onChange={(e) => setSupervisor(e.target.value)}
                  placeholder="مثال: م. علي رضا"
                  className="w-full bg-slate-800/80 border border-slate-700 rounded-xl pr-9 pl-3 py-2.5 text-white text-xs focus:outline-none focus:border-amber-500"
                />
              </div>
            </div>
          </div>

          {/* Names */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1.5">
                اسم القاعة بالعربية <span className="text-red-400">*</span>
              </label>
              <div className="relative">
                <Building2 className="w-4 h-4 text-slate-400 absolute right-3 top-3" />
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="مثال: قاعة الروتوغرافور الحديثة"
                  className="w-full bg-slate-800/80 border border-slate-700 rounded-xl pr-9 pl-3 py-2.5 text-white text-xs font-semibold focus:outline-none focus:border-amber-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1.5">
                الاسم بالإنجليزية (Name EN)
              </label>
              <input
                type="text"
                value={nameEn}
                onChange={(e) => setNameEn(e.target.value)}
                placeholder="e.g. Rotogravure Printing Hall"
                className="w-full bg-slate-800/80 border border-slate-700 rounded-xl px-3 py-2.5 text-white text-xs font-mono focus:outline-none focus:border-amber-500"
              />
            </div>
          </div>

          {/* Icon Selector */}
          <div>
            <label className="block text-xs font-bold text-slate-300 mb-2">
              أيقونة القاعة ونوع النشاط
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {ICON_OPTIONS.map((opt) => {
                const IconComponent = opt.icon;
                const isSelected = iconType === opt.id;
                return (
                  <button
                    key={opt.id}
                    type="button"
                    onClick={() => setIconType(opt.id)}
                    className={`flex items-center gap-2 p-2.5 rounded-xl border text-right text-xs transition ${
                      isSelected
                        ? 'bg-amber-500/20 border-amber-500 text-amber-300 font-bold'
                        : 'bg-slate-800/60 border-slate-700 text-slate-400 hover:text-slate-200 hover:bg-slate-800'
                    }`}
                  >
                    <IconComponent className="w-4 h-4 shrink-0 text-amber-400" />
                    <span className="truncate">{opt.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Dedicated Line UPS */}
          <div>
            <label className="block text-xs font-bold text-slate-300 mb-1.5">
              نظام الـ UPS الكهربائي الصناعي المخصص للقاعة
            </label>
            <div className="relative">
              <Zap className="w-4 h-4 text-slate-400 absolute right-3 top-3" />
              <input
                type="text"
                value={dedicatedUpsName}
                onChange={(e) => setDedicatedUpsName(e.target.value)}
                placeholder="مثال: Schneider Galaxy Industrial UPS 160 kVA"
                className="w-full bg-slate-800/80 border border-slate-700 rounded-xl pr-9 pl-3 py-2.5 text-white text-xs focus:outline-none focus:border-amber-500"
              />
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-xs font-bold text-slate-300 mb-1.5">
              الوصف الفني والعمليات الإنتاجية
            </label>
            <textarea
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="اكتب تفاصيل خطوط الإنتاج والعمليات الحيوية داخل هذه القاعة..."
              className="w-full bg-slate-800/80 border border-slate-700 rounded-xl p-3 text-white text-xs leading-relaxed focus:outline-none focus:border-amber-500"
            />
          </div>

          {/* Footer Actions */}
          <div className="flex items-center justify-between gap-3 pt-4 border-t border-slate-800">
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setEditingHangar(null)}
                className="px-4 py-2.5 text-xs text-slate-400 hover:text-white rounded-xl bg-slate-800/60 hover:bg-slate-800 border border-slate-700 transition"
              >
                إلغاء التعديل
              </button>

              {editingHangar && (
                <button
                  type="button"
                  onClick={() => {
                    const assetsInHall = assets.filter((a) => a.hangarId === editingHangar.id);
                    requestDeleteConfirmation({
                      title: 'حذف قاعة إنتاج',
                      message: assetsInHall.length > 0
                        ? `تحتوي هذه القاعة على (${assetsInHall.length}) ماكينة مسجلة. هل أنت متأكد من رغبتك في حذف القاعة [${editingHangar.name}] نهائياً؟`
                        : `هل أنت متأكد من رغبتك في حذف القاعة [${editingHangar.name}] نهائياً؟`,
                      itemDetails: `قاعة: ${editingHangar.name} (${editingHangar.id}) - ${assetsInHall.length} ماكينة`,
                      confirmLabel: 'حذف القاعة نهائياً',
                      onConfirm: () => {
                        deleteHangar(editingHangar.id);
                        setEditingHangar(null);
                      },
                    });
                  }}
                  className="flex items-center gap-1.5 px-3.5 py-2.5 text-xs font-bold text-red-400 hover:text-red-300 bg-red-500/10 hover:bg-red-500/25 border border-red-500/30 rounded-xl transition active:scale-95"
                  title="حذف هذه القاعة نهائياً"
                >
                  <Trash2 className="w-4 h-4" />
                  <span>حذف القاعة</span>
                </button>
              )}
            </div>

            <button
              type="submit"
              id="btn-save-hall-changes"
              className="flex items-center gap-2 px-6 py-2.5 text-xs font-bold text-slate-900 bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 rounded-xl shadow-lg shadow-amber-500/20 transition"
            >
              <Check className="w-4 h-4" />
              <span>حفظ التعديلات على القاعة</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
