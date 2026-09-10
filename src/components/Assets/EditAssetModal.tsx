import React, { useState, useEffect } from 'react';
import { 
  X, 
  Cpu, 
  Check, 
  Building2, 
  Tag, 
  ShieldAlert, 
  Wrench, 
  Zap, 
  Calendar, 
  Clock, 
  Activity, 
  Sliders, 
  FileText,
  Edit3,
  Layers,
  Trash2
} from 'lucide-react';
import { useCMMS } from '../../context/CMMSContext';
import { Asset, AssetCategory, Criticality, AssetStatus } from '../../types';

const CATEGORIES: { id: AssetCategory; label: string }[] = [
  { id: 'PRINTING', label: 'طباعة فليكسو وروتو (Printing)' },
  { id: 'EXTRUSION', label: 'بثق أفلام PE (Extrusion)' },
  { id: 'BAG_MAKING', label: 'صناعة أكياس وتفصيل (Bag Making)' },
  { id: 'CYLINDER', label: 'سلندرات وحفر ومطابقة (Cylinder Lab)' },
  { id: 'NARROW_WEB', label: 'نارو ويب وليبل (Narrow Web M5)' },
  { id: 'COATING', label: 'طلاء وتصفيح لامينيشن (Coating)' },
  { id: 'TIN_CAN_PRINT', label: 'طباعة صفيح معدني (Tin Can Print)' },
  { id: 'TIN_CAN_CUTTER', label: 'تقطيع وتشكيل صفيح (Tin Can Cutter)' },
  { id: 'UTILITIES', label: 'مرافق وكمبريسورات وتبريد (Utilities)' },
  { id: 'ELECTRICAL_UPS', label: 'طاقة وUPS ومحولات (Electrical UPS)' },
];

export const EditAssetModal: React.FC = () => {
  const { 
    editingAsset, 
    setEditingAsset, 
    hangars, 
    updateAsset,
    deleteAsset,
    requestDeleteConfirmation
  } = useCMMS();

  const [id, setId] = useState('');
  const [name, setName] = useState('');
  const [nameEn, setNameEn] = useState('');
  const [hangarId, setHangarId] = useState('');
  const [category, setCategory] = useState<AssetCategory>('PRINTING');
  const [manufacturer, setManufacturer] = useState('');
  const [model, setModel] = useState('');
  const [serialNumber, setSerialNumber] = useState('');
  const [installYear, setInstallYear] = useState<number>(2020);
  const [criticality, setCriticality] = useState<Criticality>('HIGH');
  const [status, setStatus] = useState<AssetStatus>('OPERATIONAL');
  const [runningHours, setRunningHours] = useState<number>(0);
  const [specifications, setSpecifications] = useState('');
  const [powerRating, setPowerRating] = useState('');
  const [voltage, setVoltage] = useState('400V / 3-Phase');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (editingAsset) {
      setId(editingAsset.id || '');
      setName(editingAsset.name || '');
      setNameEn(editingAsset.nameEn || '');
      setHangarId(editingAsset.hangarId || hangars[0]?.id || 'HALL-ROTO');
      setCategory(editingAsset.category || 'PRINTING');
      setManufacturer(editingAsset.manufacturer || '');
      setModel(editingAsset.model || '');
      setSerialNumber(editingAsset.serialNumber || '');
      setInstallYear(editingAsset.installYear || 2020);
      setCriticality(editingAsset.criticality || 'HIGH');
      setStatus(editingAsset.status || 'OPERATIONAL');
      setRunningHours(editingAsset.runningHours || 0);
      setSpecifications(editingAsset.specifications || '');
      setPowerRating(editingAsset.powerRating || '');
      setVoltage(editingAsset.voltage || '400V / 3-Phase');
      setError(null);
    }
  }, [editingAsset, hangars]);

  if (!editingAsset) return null;

  const currentHall = hangars.find((h) => h.id === hangarId);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const trimmedName = name.trim();
    if (!trimmedName) {
      setError('يرجى كتابة اسم الماكينة بالعربية');
      return;
    }

    const trimmedId = id.trim().toUpperCase();
    if (!trimmedId) {
      setError('يرجى إدخال رمز الماكينة (Asset Tag ID)');
      return;
    }

    const selectedHangar = hangars.find((h) => h.id === hangarId);

    const updated: Asset = {
      ...editingAsset,
      id: trimmedId,
      name: trimmedName,
      nameEn: nameEn.trim() || trimmedName,
      hangarId: hangarId,
      hangarName: selectedHangar ? selectedHangar.name : editingAsset.hangarName,
      category,
      manufacturer: manufacturer.trim() || editingAsset.manufacturer,
      model: model.trim() || editingAsset.model,
      serialNumber: serialNumber.trim() || editingAsset.serialNumber,
      installYear: Number(installYear) || editingAsset.installYear,
      criticality,
      status,
      runningHours: Number(runningHours) || 0,
      specifications: specifications.trim() || editingAsset.specifications,
      powerRating: powerRating.trim() || editingAsset.powerRating,
      voltage: voltage.trim() || editingAsset.voltage,
      associatedUpsId: selectedHangar?.dedicatedUpsId || editingAsset.associatedUpsId,
      associatedUpsName: selectedHangar?.dedicatedUpsName || editingAsset.associatedUpsName,
    };

    updateAsset(updated);
    setEditingAsset(null);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm overflow-y-auto animate-in fade-in zoom-in-95 no-print">
      <div 
        id="edit-asset-modal-container"
        className="relative w-full max-w-3xl bg-slate-900 border border-slate-700/80 rounded-2xl shadow-2xl overflow-hidden my-8"
        dir="rtl"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-slate-800 bg-gradient-to-r from-slate-900 via-slate-800/80 to-slate-900">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-500/20 border border-blue-500/40 flex items-center justify-center text-blue-400">
              <Edit3 className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-bold text-white tracking-wide">
                  تعديل وتصحيح بيانات الماكينة
                </h2>
                <span className="font-mono text-xs px-2.5 py-0.5 rounded bg-blue-500/20 text-blue-300 border border-blue-500/30 font-bold">
                  {editingAsset.id}
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                تعديل المواصفات الفنية، القاعة التابعة، والبيانات التشغيلية
              </p>
            </div>
          </div>

          <button
            type="button"
            id="btn-close-edit-asset-modal"
            onClick={() => setEditingAsset(null)}
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

          {/* Hall & Tag ID */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1.5">
                قاعة الإنتاج التابعة لها <span className="text-red-400">*</span>
              </label>
              <div className="relative">
                <Building2 className="w-4 h-4 text-slate-400 absolute right-3 top-3" />
                <select
                  id="edit-asset-hall-select"
                  value={hangarId}
                  onChange={(e) => setHangarId(e.target.value)}
                  className="w-full bg-slate-800/80 border border-slate-700 rounded-xl pr-9 pl-3 py-2.5 text-white text-xs font-semibold focus:outline-none focus:border-blue-500"
                >
                  {hangars.map((h) => (
                    <option key={h.id} value={h.id}>
                      [{h.code || h.id}] {h.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1.5">
                رمز الماكينة التعريفي (Tag ID) <span className="text-red-400">*</span>
              </label>
              <div className="relative">
                <Tag className="w-4 h-4 text-slate-400 absolute right-3 top-3" />
                <input
                  type="text"
                  required
                  value={id}
                  onChange={(e) => setId(e.target.value)}
                  placeholder="مثال: ROTO-01"
                  className="w-full bg-slate-800/80 border border-slate-700 rounded-xl pr-9 pl-3 py-2.5 text-white font-mono text-xs uppercase tracking-wider focus:outline-none focus:border-blue-500"
                />
              </div>
            </div>
          </div>

          {/* Arabic and English Name */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1.5">
                اسم الماكينة بالعربية <span className="text-red-400">*</span>
              </label>
              <div className="relative">
                <Cpu className="w-4 h-4 text-slate-400 absolute right-3 top-3" />
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="مثال: خط طباعة الروتوغرافور 8 ألوان"
                  className="w-full bg-slate-800/80 border border-slate-700 rounded-xl pr-9 pl-3 py-2.5 text-white text-xs font-semibold focus:outline-none focus:border-blue-500"
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
                placeholder="e.g. Rotogravure Press 8-Color"
                className="w-full bg-slate-800/80 border border-slate-700 rounded-xl px-3 py-2.5 text-white text-xs font-mono focus:outline-none focus:border-blue-500"
              />
            </div>
          </div>

          {/* Category & Manufacturer */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1.5">
                التصنيف الفني
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as AssetCategory)}
                className="w-full bg-slate-800/80 border border-slate-700 rounded-xl px-3 py-2 text-white text-xs focus:outline-none focus:border-blue-500"
              >
                {CATEGORIES.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1.5">
                الشركة الصانعة
              </label>
              <input
                type="text"
                value={manufacturer}
                onChange={(e) => setManufacturer(e.target.value)}
                placeholder="مثال: Bobst / Windmöller"
                className="w-full bg-slate-800/80 border border-slate-700 rounded-xl px-3 py-2 text-white text-xs focus:outline-none focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1.5">
                الموديل / الطراز
              </label>
              <input
                type="text"
                value={model}
                onChange={(e) => setModel(e.target.value)}
                placeholder="مثال: Rotomec 4003 MP"
                className="w-full bg-slate-800/80 border border-slate-700 rounded-xl px-3 py-2 text-white text-xs font-mono focus:outline-none focus:border-blue-500"
              />
            </div>
          </div>

          {/* S/N, Install Year, Running Hours */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1.5">
                الرقم التسلسلي (S/N)
              </label>
              <input
                type="text"
                value={serialNumber}
                onChange={(e) => setSerialNumber(e.target.value)}
                placeholder="مثال: SN-2023-8891"
                className="w-full bg-slate-800/80 border border-slate-700 rounded-xl px-3 py-2 text-white font-mono text-xs focus:outline-none focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1.5">
                سنة التركيب
              </label>
              <input
                type="number"
                min={1990}
                max={2030}
                value={installYear}
                onChange={(e) => setInstallYear(Number(e.target.value))}
                className="w-full bg-slate-800/80 border border-slate-700 rounded-xl px-3 py-2 text-white font-mono text-xs focus:outline-none focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1.5">
                ساعات التشغيل التراكمية
              </label>
              <input
                type="number"
                min={0}
                value={runningHours}
                onChange={(e) => setRunningHours(Number(e.target.value))}
                className="w-full bg-slate-800/80 border border-slate-700 rounded-xl px-3 py-2 text-white font-mono text-xs focus:outline-none focus:border-blue-500"
              />
            </div>
          </div>

          {/* Criticality and Status */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1.5">
                درجة الأهمية والحرجة (Criticality)
              </label>
              <select
                id="edit-asset-criticality-select"
                value={criticality}
                onChange={(e) => setCriticality(e.target.value as Criticality)}
                className="w-full bg-slate-800/80 border border-slate-700 rounded-xl px-3.5 py-2 text-white text-sm focus:outline-none focus:border-blue-500 font-semibold"
              >
                <option value="CRITICAL" className="text-red-400">حرجة جداً (CRITICAL)</option>
                <option value="HIGH" className="text-amber-400">عالية الأهمية (HIGH)</option>
                <option value="MEDIUM" className="text-blue-400">متوسطة الأهمية (MEDIUM)</option>
                <option value="LOW" className="text-slate-400">منخفضة الأهمية (LOW)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1.5">
                الحالة التشغيلية
              </label>
              <select
                id="edit-asset-status-select"
                value={status}
                onChange={(e) => setStatus(e.target.value as AssetStatus)}
                className="w-full bg-slate-800/80 border border-slate-700 rounded-xl px-3.5 py-2 text-white text-sm focus:outline-none focus:border-blue-500"
              >
                <option value="OPERATIONAL">تعمل بكفاءة (OPERATIONAL)</option>
                <option value="UNDER_MAINTENANCE">تحت الصيانة (UNDER MAINTENANCE)</option>
                <option value="STOPPED">متوقفة / عطل طارئ (STOPPED)</option>
                <option value="STANDBY">في وضع الاستعداد (STANDBY)</option>
              </select>
            </div>
          </div>

          {/* Electrical Specs */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1.5">
                القدرة الكهربائية (Power Rating)
              </label>
              <input
                type="text"
                value={powerRating}
                onChange={(e) => setPowerRating(e.target.value)}
                placeholder="مثال: 185 kW"
                className="w-full bg-slate-800/80 border border-slate-700 rounded-xl px-3 py-2 text-white font-mono text-xs focus:outline-none focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1.5">
                الجهد والتردد الكهربائي (Voltage)
              </label>
              <input
                type="text"
                value={voltage}
                onChange={(e) => setVoltage(e.target.value)}
                placeholder="مثال: 400V / 3-Phase / 50Hz"
                className="w-full bg-slate-800/80 border border-slate-700 rounded-xl px-3 py-2 text-white font-mono text-xs focus:outline-none focus:border-blue-500"
              />
            </div>
          </div>

          {/* Specifications */}
          <div>
            <label className="block text-xs font-bold text-slate-300 mb-1.5">
              المواصفات الفنية التفصيلية للماكينة
            </label>
            <textarea
              rows={3}
              value={specifications}
              onChange={(e) => setSpecifications(e.target.value)}
              placeholder="اكتب المواصفات الميكانيكية والكهربائية (العرض، السرعة القصوى، وحدات التجفيف، إلخ)..."
              className="w-full bg-slate-800/80 border border-slate-700 rounded-xl p-3 text-white text-xs leading-relaxed focus:outline-none focus:border-blue-500"
            />
          </div>

          {/* Footer Actions */}
          <div className="flex items-center justify-between gap-3 pt-4 border-t border-slate-800">
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setEditingAsset(null)}
                className="px-4 py-2.5 text-xs text-slate-400 hover:text-white rounded-xl bg-slate-800/60 hover:bg-slate-800 border border-slate-700 transition"
              >
                إلغاء
              </button>

              {editingAsset && (
                <button
                  type="button"
                  onClick={() => {
                    requestDeleteConfirmation({
                      title: 'حذف ماكينة وأصل صناعي',
                      message: `هل أنت متأكد من رغبتك في حذف الماكينة [${editingAsset.name}] (${editingAsset.id}) نهائياً؟`,
                      itemDetails: `${editingAsset.id} - ${editingAsset.name}`,
                      confirmLabel: 'حذف الماكينة',
                      onConfirm: () => {
                        deleteAsset(editingAsset.id);
                        setEditingAsset(null);
                      },
                    });
                  }}
                  className="flex items-center gap-1.5 px-3.5 py-2.5 text-xs font-bold text-red-400 hover:text-red-300 bg-red-500/10 hover:bg-red-500/25 border border-red-500/30 rounded-xl transition active:scale-95"
                  title="حذف هذه الماكينة نهائياً"
                >
                  <Trash2 className="w-4 h-4" />
                  <span>حذف الماكينة</span>
                </button>
              )}
            </div>

            <button
              type="submit"
              id="btn-save-asset-changes"
              className="flex items-center gap-2 px-6 py-2.5 text-xs font-bold text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 rounded-xl shadow-lg shadow-blue-500/20 transition"
            >
              <Check className="w-4 h-4" />
              <span>حفظ التعديلات على الماكينة</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
