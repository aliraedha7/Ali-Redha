import React, { useState, useEffect } from 'react';
import { 
  X, 
  Cpu, 
  Plus, 
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
  Sparkles,
  Layers
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

export const CreateAssetModal: React.FC = () => {
  const { 
    isCreateAssetOpen, 
    setIsCreateAssetOpen, 
    preselectedHallForAsset, 
    setPreselectedHallForAsset, 
    hangars, 
    assets, 
    addAsset 
  } = useCMMS();

  const [id, setId] = useState('');
  const [name, setName] = useState('');
  const [nameEn, setNameEn] = useState('');
  const [hangarId, setHangarId] = useState('');
  const [category, setCategory] = useState<AssetCategory>('PRINTING');
  const [manufacturer, setManufacturer] = useState('');
  const [model, setModel] = useState('');
  const [serialNumber, setSerialNumber] = useState('');
  const [installYear, setInstallYear] = useState<number>(new Date().getFullYear());
  const [criticality, setCriticality] = useState<Criticality>('HIGH');
  const [status, setStatus] = useState<AssetStatus>('OPERATIONAL');
  const [runningHours, setRunningHours] = useState<number>(100);
  const [specifications, setSpecifications] = useState('');
  const [powerRating, setPowerRating] = useState('');
  const [voltage, setVoltage] = useState('400V / 3-Phase');
  const [error, setError] = useState<string | null>(null);

  // Set default hall when opened or preselected
  useEffect(() => {
    if (isCreateAssetOpen) {
      const defaultHall = preselectedHallForAsset || hangars[0]?.id || 'HALL-ROTO';
      setHangarId(defaultHall);
      
      // Auto-suggest prefix
      const hallObj = hangars.find((h) => h.id === defaultHall);
      const prefix = defaultHall.replace('HALL-', '');
      const count = assets.filter((a) => a.hangarId === defaultHall).length + 1;
      const suggestedId = `${prefix}-0${count}`;
      setId(suggestedId);
    }
  }, [isCreateAssetOpen, preselectedHallForAsset, hangars, assets]);

  // When hall changes, update suggested category and ID if not manually customized
  const handleHallChange = (newHallId: string) => {
    setHangarId(newHallId);
    const prefix = newHallId.replace('HALL-', '');
    const count = assets.filter((a) => a.hangarId === newHallId).length + 1;
    setId(`${prefix}-0${count}`);

    // Suggest suitable category
    if (newHallId === 'HALL-ROTO' || newHallId === 'HALL-FLX') setCategory('PRINTING');
    else if (newHallId === 'HALL-PE') setCategory('EXTRUSION');
    else if (newHallId === 'HALL-BAG') setCategory('BAG_MAKING');
    else if (newHallId === 'HALL-CYL') setCategory('CYLINDER');
    else if (newHallId === 'HALL-NW') setCategory('NARROW_WEB');
    else if (newHallId === 'HALL-COAT') setCategory('COATING');
    else if (newHallId === 'HALL-TCP') setCategory('TIN_CAN_PRINT');
    else if (newHallId === 'HALL-TCC') setCategory('TIN_CAN_CUTTER');
  };

  if (!isCreateAssetOpen) return null;

  const currentHall = hangars.find((h) => h.id === hangarId);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const trimmedId = id.trim().toUpperCase();
    const trimmedName = name.trim();

    if (!trimmedId) {
      setError('يرجى تحديد رمز الماكنة (Tag ID)');
      return;
    }
    if (!trimmedName) {
      setError('يرجى إدخال اسم الماكنة أو الخط الإنتاجي');
      return;
    }

    if (assets.some((a) => a.id.toUpperCase() === trimmedId)) {
      setError(`رمز الماكنة [${trimmedId}] مسجل مسبقاً في قاعدة البيانات، يرجى اختيار رمز فريد`);
      return;
    }

    const hallName = currentHall ? currentHall.name : hangarId;
    const associatedUps = currentHall?.dedicatedUpsName || 'وحدة طاقة احتياطية عامة';
    const associatedUpsId = currentHall?.dedicatedUpsId || 'UPS-MAIN';

    const newAsset: Omit<Asset, 'downtimeThisMonthMinutes'> = {
      id: trimmedId,
      name: trimmedName,
      nameEn: nameEn.trim() || trimmedName,
      hangarId,
      hangarName: hallName,
      category,
      manufacturer: manufacturer.trim() || 'صناعة ألمانية / إيطالية',
      model: model.trim() || 'Industrial Standard Model',
      serialNumber: serialNumber.trim() || `SN-${trimmedId}-${installYear}`,
      installYear: Number(installYear) || new Date().getFullYear(),
      criticality,
      status,
      runningHours: Number(runningHours) || 0,
      specifications: specifications.trim() || 'ماكينة إنتاجية حديثة خاضعة لجدول الفحوصات الوقائية الدورية',
      associatedUpsId,
      associatedUpsName: associatedUps,
      powerRating: powerRating.trim() || '75 kW',
      voltage: voltage.trim() || '400V / 50Hz',
      lastMaintenanceDate: new Date().toISOString().split('T')[0],
      nextMaintenanceDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    };

    addAsset(newAsset);

    // Reset and close
    setId('');
    setName('');
    setNameEn('');
    setManufacturer('');
    setModel('');
    setSerialNumber('');
    setSpecifications('');
    setPreselectedHallForAsset(null);
    setIsCreateAssetOpen(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm overflow-y-auto animate-fadeIn">
      <div 
        id="create-asset-modal-container"
        className="relative w-full max-w-3xl bg-slate-900 border border-slate-700/80 rounded-2xl shadow-2xl overflow-hidden my-8"
        dir="rtl"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-slate-800 bg-gradient-to-r from-slate-900 via-slate-800/80 to-slate-900">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-500/20 border border-blue-500/40 flex items-center justify-center text-blue-400">
              <Cpu className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                إضافة ماكنة أو خط إنتاجي جديد
                <span className="text-xs font-mono bg-blue-500/20 text-blue-300 px-2 py-0.5 rounded border border-blue-500/30">
                  New Industrial Machine
                </span>
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">
                تضمين ماكنة في قاعة الإنتاج وتوليد باركود تتبع الصيانة وسجلات أوامر العمل
              </p>
            </div>
          </div>
          <button
            id="btn-close-create-asset-modal"
            onClick={() => {
              setPreselectedHallForAsset(null);
              setIsCreateAssetOpen(false);
            }}
            className="p-2 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5 max-h-[80vh] overflow-y-auto">
          {error && (
            <div className="p-3 bg-red-500/10 border border-red-500/30 rounded-xl text-red-400 text-xs font-semibold">
              {error}
            </div>
          )}

          {/* Row 1: Hall & Machine Tag */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1.5 flex items-center gap-1.5">
                <Building2 className="w-3.5 h-3.5 text-blue-400" />
                قاعة الإنتاج التابعة لها <span className="text-red-400">*</span>
              </label>
              <select
                id="asset-hall-select"
                value={hangarId}
                onChange={(e) => handleHallChange(e.target.value)}
                className="w-full bg-slate-800/80 border border-slate-700 rounded-xl px-3.5 py-2 text-white text-sm focus:outline-none focus:border-blue-500"
              >
                {hangars.map((h) => (
                  <option key={h.id} value={h.id}>
                    {h.name} [{h.nameEn}]
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1.5 flex items-center gap-1.5">
                <Tag className="w-3.5 h-3.5 text-blue-400" />
                رمز الماكنة / كود التعريف (Tag ID) <span className="text-red-400">*</span>
              </label>
              <input
                id="asset-id-input"
                type="text"
                required
                placeholder="مثال: FLX-07 أو ROTO-05"
                value={id}
                onChange={(e) => setId(e.target.value.toUpperCase())}
                className="w-full bg-slate-800/80 border border-slate-700 rounded-xl px-3.5 py-2 text-white placeholder-slate-500 text-sm font-mono focus:outline-none focus:border-blue-500"
              />
            </div>
          </div>

          {/* Row 2: Arabic & English Names */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1.5 flex items-center gap-1.5">
                <Cpu className="w-3.5 h-3.5 text-blue-400" />
                اسم الماكنة بالعربية <span className="text-red-400">*</span>
              </label>
              <input
                id="asset-name-input"
                type="text"
                required
                placeholder="مثال: ماكينة فليكسو CI سنترال W&H Miraflex #7"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full bg-slate-800/80 border border-slate-700 rounded-xl px-3.5 py-2 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1.5">
                اسم الماكنة بالإنجليزية (English Tag)
              </label>
              <input
                id="asset-name-en-input"
                type="text"
                placeholder="مثال: W&H Miraflex CI 8-Color #7"
                value={nameEn}
                onChange={(e) => setNameEn(e.target.value)}
                className="w-full bg-slate-800/80 border border-slate-700 rounded-xl px-3.5 py-2 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-blue-500 font-mono"
              />
            </div>
          </div>

          {/* Row 3: Category & Manufacturer */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1.5 flex items-center gap-1.5">
                <Layers className="w-3.5 h-3.5 text-blue-400" />
                التصنيف التكنولوجي / نوع الماكنة
              </label>
              <select
                id="asset-category-select"
                value={category}
                onChange={(e) => setCategory(e.target.value as AssetCategory)}
                className="w-full bg-slate-800/80 border border-slate-700 rounded-xl px-3.5 py-2 text-white text-sm focus:outline-none focus:border-blue-500"
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
                الشركة الصانعة (Manufacturer)
              </label>
              <input
                id="asset-manufacturer-input"
                type="text"
                placeholder="مثال: Windmöller & Hölscher / Bobst / Comexi"
                value={manufacturer}
                onChange={(e) => setManufacturer(e.target.value)}
                className="w-full bg-slate-800/80 border border-slate-700 rounded-xl px-3.5 py-2 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-blue-500"
              />
            </div>
          </div>

          {/* Row 4: Model & Serial & Install Year */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1.5">
                الموديل والنوع (Model)
              </label>
              <input
                id="asset-model-input"
                type="text"
                placeholder="مثال: Miraflex II CM 8-Color"
                value={model}
                onChange={(e) => setModel(e.target.value)}
                className="w-full bg-slate-800/80 border border-slate-700 rounded-xl px-3.5 py-2 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-blue-500 font-mono"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1.5">
                الرقم التسلسلي (Serial Number)
              </label>
              <input
                id="asset-serial-input"
                type="text"
                placeholder="مثال: WH-MFX-2024-884"
                value={serialNumber}
                onChange={(e) => setSerialNumber(e.target.value)}
                className="w-full bg-slate-800/80 border border-slate-700 rounded-xl px-3.5 py-2 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-blue-500 font-mono"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1.5 flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-blue-400" />
                سنة التركيب والصنع
              </label>
              <input
                id="asset-year-input"
                type="number"
                min="1990"
                max="2030"
                value={installYear}
                onChange={(e) => setInstallYear(Number(e.target.value))}
                className="w-full bg-slate-800/80 border border-slate-700 rounded-xl px-3.5 py-2 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-blue-500 font-mono"
              />
            </div>
          </div>

          {/* Row 5: Criticality, Status, Running Hours */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1.5 flex items-center gap-1.5">
                <ShieldAlert className="w-3.5 h-3.5 text-amber-400" />
                درجة الأهمية والحرجة (Criticality)
              </label>
              <select
                id="asset-criticality-select"
                value={criticality}
                onChange={(e) => setCriticality(e.target.value as Criticality)}
                className="w-full bg-slate-800/80 border border-slate-700 rounded-xl px-3.5 py-2 text-white text-sm focus:outline-none focus:border-blue-500 font-semibold"
              >
                <option value="CRITICAL" className="text-red-400">حرجة جداً (CRITICAL)</option>
                <option value="HIGH" className="text-orange-400">عالية الأهمية (HIGH)</option>
                <option value="MEDIUM" className="text-blue-400">متوسطة الأهمية (MEDIUM)</option>
                <option value="LOW" className="text-slate-400">منخفضة الأهمية (LOW)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1.5 flex items-center gap-1.5">
                <Activity className="w-3.5 h-3.5 text-green-400" />
                الحالة التشغيلية الأولية
              </label>
              <select
                id="asset-status-select"
                value={status}
                onChange={(e) => setStatus(e.target.value as AssetStatus)}
                className="w-full bg-slate-800/80 border border-slate-700 rounded-xl px-3.5 py-2 text-white text-sm focus:outline-none focus:border-blue-500"
              >
                <option value="OPERATIONAL">تعمل بكفاءة (OPERATIONAL)</option>
                <option value="UNDER_MAINTENANCE">تحت الصيانة (UNDER MAINTENANCE)</option>
                <option value="STOPPED">متوقفة (STOPPED)</option>
                <option value="STANDBY">جاهزة بالانتظار (STANDBY)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1.5 flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-blue-400" />
                ساعات التشغيل الحالية
              </label>
              <input
                id="asset-hours-input"
                type="number"
                min="0"
                value={runningHours}
                onChange={(e) => setRunningHours(Number(e.target.value))}
                className="w-full bg-slate-800/80 border border-slate-700 rounded-xl px-3.5 py-2 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-blue-500 font-mono"
              />
            </div>
          </div>

          {/* Row 6: Electrical & Technical specs */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1.5 flex items-center gap-1.5">
                <Zap className="w-3.5 h-3.5 text-amber-400" />
                القدرة الكهربائية والجهد
              </label>
              <div className="grid grid-cols-2 gap-2">
                <input
                  id="asset-power-input"
                  type="text"
                  placeholder="مثال: 95 kW"
                  value={powerRating}
                  onChange={(e) => setPowerRating(e.target.value)}
                  className="bg-slate-800/80 border border-slate-700 rounded-xl px-3 py-2 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-blue-500"
                />
                <input
                  id="asset-voltage-input"
                  type="text"
                  placeholder="مثال: 400V / 50Hz"
                  value={voltage}
                  onChange={(e) => setVoltage(e.target.value)}
                  className="bg-slate-800/80 border border-slate-700 rounded-xl px-3 py-2 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-blue-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1.5 flex items-center gap-1.5">
                <Building2 className="w-3.5 h-3.5 text-blue-400" />
                وحدة الـ UPS المسؤولة عن الماكنة
              </label>
              <div className="bg-slate-800/50 border border-slate-700/60 rounded-xl px-3.5 py-2 text-slate-300 text-sm">
                {currentHall?.dedicatedUpsName || 'Schneider Industrial Central UPS'}
              </div>
            </div>
          </div>

          {/* Row 7: Detailed Specifications */}
          <div>
            <label className="block text-xs font-bold text-slate-300 mb-1.5 flex items-center gap-1.5">
              <FileText className="w-3.5 h-3.5 text-blue-400" />
              المواصفات والخصائص الفنية التشغيلية
            </label>
            <textarea
              id="asset-specs-textarea"
              rows={3}
              placeholder="مثال: 8 ألوان سنترال درام، عرض طباعة 1300 مم، سرعة 450 م/دقيقة، نظام أنيلوكس سيراميكي وتجفيف هواء ساخن..."
              value={specifications}
              onChange={(e) => setSpecifications(e.target.value)}
              className="w-full bg-slate-800/80 border border-slate-700 rounded-xl p-3 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-blue-500"
            />
          </div>

          {/* Footer Actions */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-800">
            <button
              id="btn-cancel-create-asset"
              type="button"
              onClick={() => {
                setPreselectedHallForAsset(null);
                setIsCreateAssetOpen(false);
              }}
              className="px-4 py-2 text-sm text-slate-400 hover:text-white hover:bg-slate-800 rounded-xl transition"
            >
              إلغاء
            </button>
            <button
              id="btn-submit-create-asset"
              type="submit"
              className="flex items-center gap-2 px-5 py-2 text-sm font-bold text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 rounded-xl transition shadow-lg shadow-blue-500/20"
            >
              <Plus className="w-4 h-4" />
              تثبيت الماكنة وتوليد رمز QR
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
