import React, { useState, useEffect } from 'react';
import { 
  X, 
  Package, 
  Layers, 
  Tag, 
  MapPin, 
  DollarSign, 
  AlertTriangle, 
  Clock, 
  CheckCircle2, 
  Wrench, 
  Building2, 
  FileText,
  ShieldAlert,
  Save,
  Plus,
  Trash2,
  Cpu,
  Factory
} from 'lucide-react';
import { useCMMS } from '../../context/CMMSContext';
import { SparePart, SparePartCriticality, SparePartCondition } from '../../types';

interface SparePartFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  partToEdit?: SparePart | null;
}

const COMMON_CATEGORIES = [
  'ميكانيك',
  'هوائيات ونيوماتيك',
  'كهرباء وأتمتة',
  'أنظمة تسخين وتجفيف',
  'سيور وسلاسل نقل',
  'حساسات وخلايا بصرية',
  'إلكترونيات وتحكم PLC',
  'هيدروليك وتزييت',
  'أختام وجوانات (Seals)',
  'شفرات وقواطع',
  'قطع استهلاكية عامة'
];

const COMMON_OEM_BRANDS = [
  'SMC',
  'Festo',
  'Siemens',
  'Schneider Electric',
  'SKF',
  'FAG / Schaeffler',
  'Nordson',
  'Omron',
  'Sick',
  'Bobst',
  'W&H (Windmöller & Hölscher)',
  'Comexi',
  'Atlas Copco',
  'Lenze',
  'Rexroth Bosch',
  'أخرى / محلي'
];

export const SparePartFormModal: React.FC<SparePartFormModalProps> = ({
  isOpen,
  onClose,
  partToEdit
}) => {
  const { 
    addSparePart, 
    updateSparePart, 
    deleteSparePart,
    requestDeleteConfirmation,
    checkPermission,
    assets, 
    hangars 
  } = useCMMS();

  const isEditMode = Boolean(partToEdit);

  // Form states
  const [name, setName] = useState('');
  const [partNumber, setPartNumber] = useState('');
  const [category, setCategory] = useState('ميكانيك');
  const [customCategory, setCustomCategory] = useState('');
  const [isCustomCategory, setIsCustomCategory] = useState(false);

  const [oemBrand, setOemBrand] = useState('SMC');
  const [customOemBrand, setCustomOemBrand] = useState('');
  const [isCustomOem, setIsCustomOem] = useState(false);
  const [oemPartNumber, setOemPartNumber] = useState('');

  const [condition, setCondition] = useState<SparePartCondition>('NEW');
  const [criticality, setCriticality] = useState<SparePartCriticality>('MEDIUM');

  const [specifications, setSpecifications] = useState('');
  const [binLocation, setBinLocation] = useState('');
  const [compatibleHangarId, setCompatibleHangarId] = useState('');
  const [compatibleMachines, setCompatibleMachines] = useState<string[]>([]);
  const [newMachineTag, setNewMachineTag] = useState('');

  const [quantity, setQuantity] = useState<number>(1);
  const [unit, setUnit] = useState('قطعة');
  const [minThreshold, setMinThreshold] = useState<number>(2);
  const [maxThreshold, setMaxThreshold] = useState<number>(10);

  const [unitCost, setUnitCost] = useState<number>(50);
  const [currency, setCurrency] = useState('USD');
  const [leadTimeDays, setLeadTimeDays] = useState<number>(7);
  const [supplierName, setSupplierName] = useState('');
  const [supplierContact, setSupplierContact] = useState('');
  const [notes, setNotes] = useState('');

  // Active tab in modal for organization
  const [activeTab, setActiveTab] = useState<'basic' | 'technical' | 'stock' | 'supplier'>('basic');

  useEffect(() => {
    if (partToEdit) {
      setName(partToEdit.name || '');
      setPartNumber(partToEdit.partNumber || '');
      
      if (COMMON_CATEGORIES.includes(partToEdit.category)) {
        setCategory(partToEdit.category);
        setIsCustomCategory(false);
      } else {
        setCategory('CUSTOM');
        setCustomCategory(partToEdit.category);
        setIsCustomCategory(true);
      }

      if (partToEdit.oemBrand && COMMON_OEM_BRANDS.includes(partToEdit.oemBrand)) {
        setOemBrand(partToEdit.oemBrand);
        setIsCustomOem(false);
      } else if (partToEdit.oemBrand) {
        setOemBrand('CUSTOM');
        setCustomOemBrand(partToEdit.oemBrand);
        setIsCustomOem(true);
      } else {
        setOemBrand('SMC');
        setIsCustomOem(false);
      }

      setOemPartNumber(partToEdit.oemPartNumber || '');
      setCondition(partToEdit.condition || 'NEW');
      setCriticality(partToEdit.criticality || 'MEDIUM');
      setSpecifications(partToEdit.specifications || '');
      setBinLocation(partToEdit.binLocation || '');
      setCompatibleHangarId(partToEdit.compatibleHangarId || '');
      setCompatibleMachines(partToEdit.compatibleMachines || []);
      setQuantity(partToEdit.quantity ?? 0);
      setUnit(partToEdit.unit || 'قطعة');
      setMinThreshold(partToEdit.minThreshold ?? 2);
      setMaxThreshold(partToEdit.maxThreshold ?? 10);
      setUnitCost(partToEdit.unitCost ?? 0);
      setCurrency(partToEdit.currency || 'USD');
      setLeadTimeDays(partToEdit.leadTimeDays ?? 7);
      setSupplierName(partToEdit.supplierName || '');
      setSupplierContact(partToEdit.supplierContact || '');
      setNotes(partToEdit.notes || '');
    } else {
      // Reset defaults for creation
      setName('');
      setPartNumber('');
      setCategory('ميكانيك');
      setIsCustomCategory(false);
      setCustomCategory('');
      setOemBrand('SMC');
      setIsCustomOem(false);
      setCustomOemBrand('');
      setOemPartNumber('');
      setCondition('NEW');
      setCriticality('MEDIUM');
      setSpecifications('');
      setBinLocation('رف A-01');
      setCompatibleHangarId('');
      setCompatibleMachines([]);
      setQuantity(5);
      setUnit('قطعة');
      setMinThreshold(2);
      setMaxThreshold(15);
      setUnitCost(45);
      setCurrency('USD');
      setLeadTimeDays(7);
      setSupplierName('');
      setSupplierContact('');
      setNotes('');
    }
    setActiveTab('basic');
  }, [partToEdit, isOpen]);

  if (!isOpen) return null;

  const handleAddMachineTag = (machineId: string) => {
    const trimmed = machineId.trim();
    if (trimmed && !compatibleMachines.includes(trimmed)) {
      setCompatibleMachines([...compatibleMachines, trimmed]);
    }
    setNewMachineTag('');
  };

  const handleRemoveMachineTag = (machineId: string) => {
    setCompatibleMachines(compatibleMachines.filter((m) => m !== machineId));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const finalCategory = isCustomCategory ? customCategory.trim() || 'عام' : category;
    const finalOemBrand = isCustomOem ? customOemBrand.trim() || 'أخرى' : oemBrand;

    if (!name.trim()) {
      alert('يرجى كتابة اسم قطعة الغيار');
      return;
    }

    if (!partNumber.trim()) {
      alert('يرجى كتابة كود القطعة (Part Number)');
      return;
    }

    const payload = {
      name: name.trim(),
      partNumber: partNumber.trim(),
      category: finalCategory,
      oemBrand: finalOemBrand,
      oemPartNumber: oemPartNumber.trim(),
      condition,
      criticality,
      specifications: specifications.trim(),
      binLocation: binLocation.trim() || 'المستودع الرئيسي',
      compatibleHangarId: compatibleHangarId || undefined,
      compatibleMachines,
      quantity: Number(quantity) || 0,
      unit: unit.trim() || 'قطعة',
      minThreshold: Number(minThreshold) || 1,
      maxThreshold: Number(maxThreshold) || (Number(minThreshold) * 4),
      unitCost: Number(unitCost) || 0,
      currency,
      leadTimeDays: Number(leadTimeDays) || 7,
      supplierName: supplierName.trim(),
      supplier: supplierName.trim() || 'مورد معتمد',
      supplierContact: supplierContact.trim(),
      nameEn: partToEdit?.nameEn || name.trim(),
      notes: notes.trim(),
      lastRestockedDate: partToEdit ? partToEdit.lastRestockedDate : new Date().toISOString().slice(0, 10),
      movementHistory: partToEdit?.movementHistory || []
    };

    if (isEditMode && partToEdit) {
      updateSparePart({
        ...partToEdit,
        ...payload
      });
    } else {
      addSparePart(payload);
    }

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-md overflow-y-auto">
      <div 
        id="spare-part-form-modal"
        className="relative w-full max-w-4xl bg-[#1e293b] border border-[#334155] rounded-2xl shadow-2xl overflow-hidden my-4 flex flex-col max-h-[92vh]"
        dir="rtl"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#334155] bg-gradient-to-r from-blue-900/30 to-[#0f172a]">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-blue-600/20 text-blue-400 border border-blue-500/30">
              <Package className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-black text-white">
                {isEditMode ? 'تعديل بيانات قطعة الغيار الفنية' : 'إضافة صنف وقطعة غيار جديدة للمستودع'}
              </h2>
              <p className="text-xs text-slate-400">
                {isEditMode 
                  ? `تحديث الكتالوج والمواصفات الصناعية للصنف [${partToEdit?.partNumber}]`
                  : 'تسجيل قطعة صناعية جديدة ببيانات OEM دقيقة وحدود الأمان والمواصفات'}
              </p>
            </div>
          </div>

          <button
            id="btn-close-part-form"
            onClick={onClose}
            className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center gap-1 px-6 pt-3 border-b border-[#334155] bg-[#0f172a]/60 text-xs overflow-x-auto">
          <button
            type="button"
            id="tab-btn-basic"
            onClick={() => setActiveTab('basic')}
            className={`flex items-center gap-1.5 px-4 py-2.5 font-bold rounded-t-lg transition-all border-b-2 whitespace-nowrap ${
              activeTab === 'basic'
                ? 'text-blue-400 border-blue-500 bg-[#1e293b]'
                : 'text-slate-400 border-transparent hover:text-slate-200 hover:bg-[#1e293b]/40'
            }`}
          >
            <Tag className="w-3.5 h-3.5" />
            <span>1. التعريف والتصنيف الأساسي</span>
          </button>

          <button
            type="button"
            id="tab-btn-technical"
            onClick={() => setActiveTab('technical')}
            className={`flex items-center gap-1.5 px-4 py-2.5 font-bold rounded-t-lg transition-all border-b-2 whitespace-nowrap ${
              activeTab === 'technical'
                ? 'text-blue-400 border-blue-500 bg-[#1e293b]'
                : 'text-slate-400 border-transparent hover:text-slate-200 hover:bg-[#1e293b]/40'
            }`}
          >
            <Cpu className="w-3.5 h-3.5" />
            <span>2. المواصفات الأصلية OEM والتوافق</span>
          </button>

          <button
            type="button"
            id="tab-btn-stock"
            onClick={() => setActiveTab('stock')}
            className={`flex items-center gap-1.5 px-4 py-2.5 font-bold rounded-t-lg transition-all border-b-2 whitespace-nowrap ${
              activeTab === 'stock'
                ? 'text-blue-400 border-blue-500 bg-[#1e293b]'
                : 'text-slate-400 border-transparent hover:text-slate-200 hover:bg-[#1e293b]/40'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>3. الرصيد والموقع وحدود الأمان</span>
          </button>

          <button
            type="button"
            id="tab-btn-supplier"
            onClick={() => setActiveTab('supplier')}
            className={`flex items-center gap-1.5 px-4 py-2.5 font-bold rounded-t-lg transition-all border-b-2 whitespace-nowrap ${
              activeTab === 'supplier'
                ? 'text-blue-400 border-blue-500 bg-[#1e293b]'
                : 'text-slate-400 border-transparent hover:text-slate-200 hover:bg-[#1e293b]/40'
            }`}
          >
            <DollarSign className="w-3.5 h-3.5" />
            <span>4. المورد والتكاليف والملاحظات</span>
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-5 text-xs">
          
          {/* TAB 1: BASIC INFORMATION */}
          {activeTab === 'basic' && (
            <div className="space-y-4 animate-fadeIn">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Part Name */}
                <div className="space-y-1.5">
                  <label className="font-bold text-slate-200 flex items-center gap-1">
                    <span>اسم قطعة الغيار / التوصيف العربي</span>
                    <span className="text-red-400">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="مثال: بستن هوائي لتغذية فيلم الطباعة (Pneumatic Cylinder)"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full bg-[#0f172a] border border-[#334155] rounded-xl px-3.5 py-2.5 text-slate-100 placeholder-slate-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                  />
                  <span className="text-[11px] text-slate-400">الاسم الفني المتداول بين مهندسي وفنيي الصيانة بالمصنع.</span>
                </div>

                {/* Internal Part Number */}
                <div className="space-y-1.5">
                  <label className="font-bold text-slate-200 flex items-center gap-1">
                    <span>كود / رقم القطعة الداخلي (Internal Part #)</span>
                    <span className="text-red-400">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="مثال: SP-CYL-25100 أو P-FLEX-041"
                    value={partNumber}
                    onChange={(e) => setPartNumber(e.target.value)}
                    className="w-full bg-[#0f172a] border border-[#334155] rounded-xl px-3.5 py-2.5 text-slate-100 font-mono font-bold placeholder-slate-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                  />
                  <span className="text-[11px] text-slate-400">الباركود أو الرمز التعريفي الداخلي المعتمد في نظام المستودع.</span>
                </div>
              </div>

              {/* Category & Condition & Criticality */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {/* Category */}
                <div className="space-y-1.5">
                  <label className="font-bold text-slate-200">التصنيف الهندسي</label>
                  <select
                    value={isCustomCategory ? 'CUSTOM' : category}
                    onChange={(e) => {
                      if (e.target.value === 'CUSTOM') {
                        setIsCustomCategory(true);
                      } else {
                        setIsCustomCategory(false);
                        setCategory(e.target.value);
                      }
                    }}
                    className="w-full bg-[#0f172a] border border-[#334155] rounded-xl px-3 py-2.5 text-slate-100 focus:outline-none focus:border-blue-500"
                  >
                    {COMMON_CATEGORIES.map((cat) => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                    <option value="CUSTOM">+ تصنيف مخصص آخر...</option>
                  </select>
                  {isCustomCategory && (
                    <input
                      type="text"
                      placeholder="اكتب اسم التصنيف المخصص..."
                      value={customCategory}
                      onChange={(e) => setCustomCategory(e.target.value)}
                      className="w-full mt-2 bg-[#0f172a] border border-blue-500/50 rounded-lg px-3 py-1.5 text-slate-100"
                    />
                  )}
                </div>

                {/* Criticality */}
                <div className="space-y-1.5">
                  <label className="font-bold text-slate-200 flex items-center gap-1.5">
                    <ShieldAlert className="w-3.5 h-3.5 text-amber-400" />
                    <span>درجة الأهمية والخطورة</span>
                  </label>
                  <select
                    value={criticality}
                    onChange={(e) => setCriticality(e.target.value as SparePartCriticality)}
                    className="w-full bg-[#0f172a] border border-[#334155] rounded-xl px-3 py-2.5 text-slate-100 focus:outline-none focus:border-blue-500 font-bold"
                  >
                    <option value="CRITICAL" className="text-red-400 bg-[#0f172a]">
                      حرجة جداً (CRITICAL) - يوقف الخط فوراً عند تعطله
                    </option>
                    <option value="MEDIUM" className="text-amber-400 bg-[#0f172a]">
                      متوسطة (MEDIUM) - يؤثر جزئياً على الأداء أو الجودة
                    </option>
                    <option value="LOW" className="text-blue-400 bg-[#0f172a]">
                      منخفضة (LOW) - استهلاكية دورية غير عاجلة
                    </option>
                  </select>
                </div>

                {/* Condition */}
                <div className="space-y-1.5">
                  <label className="font-bold text-slate-200">حالة القطعة</label>
                  <select
                    value={condition}
                    onChange={(e) => setCondition(e.target.value as SparePartCondition)}
                    className="w-full bg-[#0f172a] border border-[#334155] rounded-xl px-3 py-2.5 text-slate-100 focus:outline-none focus:border-blue-500 font-bold"
                  >
                    <option value="NEW">جديدة بالكرتون الأصلي (NEW)</option>
                    <option value="REFURBISHED">مجددة ومفحوصة معملياً (REFURBISHED)</option>
                    <option value="USABLE">مستعملة صالحة للاستخدام (USABLE)</option>
                  </select>
                </div>
              </div>

              {/* Brief specs highlight */}
              <div className="p-3.5 rounded-xl bg-blue-950/20 border border-blue-500/30 text-blue-200">
                <div className="font-bold mb-1 flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-blue-400" />
                  <span>نصيحة المهندس المشرف (م. علي رضا):</span>
                </div>
                <p className="text-[11px] leading-relaxed text-slate-300">
                  تصنيف القطع الحرجة (Critical Parts) يعطي الأولوية القصوى لإشعارات التوريد المسبقة لتفادي توقف خطوط الطباعة والفيلم في مصنع التغليف المرن.
                </p>
              </div>
            </div>
          )}

          {/* TAB 2: TECHNICAL & OEM SPECS */}
          {activeTab === 'technical' && (
            <div className="space-y-4 animate-fadeIn">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* OEM Brand */}
                <div className="space-y-1.5">
                  <label className="font-bold text-slate-200 flex items-center gap-1">
                    <Factory className="w-3.5 h-3.5 text-blue-400" />
                    <span>الشركة الصانعة الأصلية (OEM Brand)</span>
                  </label>
                  <select
                    value={isCustomOem ? 'CUSTOM' : oemBrand}
                    onChange={(e) => {
                      if (e.target.value === 'CUSTOM') {
                        setIsCustomOem(true);
                      } else {
                        setIsCustomOem(false);
                        setOemBrand(e.target.value);
                      }
                    }}
                    className="w-full bg-[#0f172a] border border-[#334155] rounded-xl px-3 py-2.5 text-slate-100 focus:outline-none focus:border-blue-500"
                  >
                    {COMMON_OEM_BRANDS.map((brand) => (
                      <option key={brand} value={brand}>{brand}</option>
                    ))}
                    <option value="CUSTOM">+ علامة صناعية أخرى...</option>
                  </select>
                  {isCustomOem && (
                    <input
                      type="text"
                      placeholder="اكتب اسم الشركة الصانعة..."
                      value={customOemBrand}
                      onChange={(e) => setCustomOemBrand(e.target.value)}
                      className="w-full mt-2 bg-[#0f172a] border border-blue-500/50 rounded-lg px-3 py-1.5 text-slate-100"
                    />
                  )}
                </div>

                {/* OEM Part Number */}
                <div className="space-y-1.5">
                  <label className="font-bold text-slate-200">
                    رقم القطعة لدى المصنع الأصلي (OEM Part Number)
                  </label>
                  <input
                    type="text"
                    placeholder="مثال: CDQ2B25-100DZ أو 6ES7 315-2EH14-0AB0"
                    value={oemPartNumber}
                    onChange={(e) => setOemPartNumber(e.target.value)}
                    className="w-full bg-[#0f172a] border border-[#334155] rounded-xl px-3.5 py-2.5 text-slate-100 font-mono placeholder-slate-500 focus:outline-none focus:border-blue-500"
                  />
                  <span className="text-[11px] text-slate-400">يسهل طلب القطعة الأصلية مباشرة من كتالوج المورد دون التباس.</span>
                </div>
              </div>

              {/* Technical Specifications */}
              <div className="space-y-1.5">
                <label className="font-bold text-slate-200 flex items-center gap-1.5">
                  <Wrench className="w-3.5 h-3.5 text-cyan-400" />
                  <span>المواصفات الفنية والهندسية الدقيقة (Technical Specifications)</span>
                </label>
                <textarea
                  rows={3}
                  placeholder="مثال: Ø25mm Bore × 100mm Stroke, Max Operating Pressure 10 Bar, Temperature Range -10°C to +70°C, M5 Port Thread, NBR Seals..."
                  value={specifications}
                  onChange={(e) => setSpecifications(e.target.value)}
                  className="w-full bg-[#0f172a] border border-[#334155] rounded-xl p-3 text-slate-100 placeholder-slate-500 focus:outline-none focus:border-blue-500 font-mono text-[11px]"
                />
              </div>

              {/* Compatibility Section */}
              <div className="p-4 rounded-xl bg-[#0f172a] border border-[#334155] space-y-3">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-white flex items-center gap-1.5">
                    <Building2 className="w-4 h-4 text-blue-400" />
                    <span>الماكينات وقاعات الإنتاج المتوافقة</span>
                  </span>
                  <span className="text-[11px] text-slate-400">اربط القطعة بالماكينات المعنية</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {/* Compatible Hangar / Hall */}
                  <div className="space-y-1">
                    <label className="text-slate-300">قاعة التشغيل الرئيسية المرتبطة</label>
                    <select
                      value={compatibleHangarId}
                      onChange={(e) => setCompatibleHangarId(e.target.value)}
                      className="w-full bg-[#1e293b] border border-[#334155] rounded-lg px-3 py-2 text-slate-100 focus:outline-none focus:border-blue-500"
                    >
                      <option value="">جميع القاعات / عام</option>
                      {hangars.map((h) => (
                        <option key={h.id} value={h.id}>
                          {h.name} ({h.nameEn})
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Add Machine by Tag / Suggestion */}
                  <div className="space-y-1">
                    <label className="text-slate-300">إضافة ماكينة متوافقة</label>
                    <div className="flex gap-2">
                      <select
                        value={newMachineTag}
                        onChange={(e) => {
                          if (e.target.value) {
                            handleAddMachineTag(e.target.value);
                          }
                        }}
                        className="flex-1 bg-[#1e293b] border border-[#334155] rounded-lg px-2.5 py-2 text-slate-100 focus:outline-none focus:border-blue-500"
                      >
                        <option value="">اختر ماكينة من قائمة الأصول...</option>
                        {assets.map((asset) => (
                          <option key={asset.id} value={asset.name}>
                            [{asset.id}] {asset.name}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>

                {/* Selected Machines Tags */}
                <div className="pt-2">
                  <span className="text-[11px] text-slate-400 block mb-1.5">الماكينات المتوافقة حالياً:</span>
                  <div className="flex flex-wrap gap-1.5">
                    {compatibleMachines.length === 0 && (
                      <span className="text-[11px] text-slate-500 italic">لم يتم تحديد ماكينات محددة (متوافق عام).</span>
                    )}
                    {compatibleMachines.map((machine) => (
                      <span
                        key={machine}
                        className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-blue-950/40 text-blue-300 border border-blue-500/30 text-[11px] font-mono"
                      >
                        <span>{machine}</span>
                        <button
                          type="button"
                          onClick={() => handleRemoveMachineTag(machine)}
                          className="hover:text-red-400 p-0.5 rounded"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: STOCK & THRESHOLDS & LOCATION */}
          {activeTab === 'stock' && (
            <div className="space-y-4 animate-fadeIn">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {/* Bin / Shelf Location */}
                <div className="space-y-1.5 sm:col-span-2">
                  <label className="font-bold text-slate-200 flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-emerald-400" />
                    <span>موقع التخزين داخل المستودع (Bin / Shelf Location)</span>
                    <span className="text-red-400">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="مثال: رف B-04 / الخانة 2 / صندوق C أو قاطع كهرباء المستودع"
                    value={binLocation}
                    onChange={(e) => setBinLocation(e.target.value)}
                    className="w-full bg-[#0f172a] border border-[#334155] rounded-xl px-3.5 py-2.5 text-slate-100 placeholder-slate-500 focus:outline-none focus:border-blue-500 font-mono"
                  />
                  <span className="text-[11px] text-slate-400">تحديد الموقع الدقيق يقلل زمن الاستجابة في حالات الأعطال الطارئة.</span>
                </div>

                {/* Measuring Unit */}
                <div className="space-y-1.5">
                  <label className="font-bold text-slate-200">وحدة القياس (Unit)</label>
                  <select
                    value={unit}
                    onChange={(e) => setUnit(e.target.value)}
                    className="w-full bg-[#0f172a] border border-[#334155] rounded-xl px-3 py-2.5 text-slate-100 focus:outline-none focus:border-blue-500 font-bold"
                  >
                    <option value="قطعة">قطعة (Piece)</option>
                    <option value="طقم">طقم كامل (Set/Kit)</option>
                    <option value="متر">متر طولي (Meter)</option>
                    <option value="لتر">لتر (Liter)</option>
                    <option value="كيلوجرام">كيلوجرام (KG)</option>
                    <option value="عبوة">عبوة / كرتون (Pack)</option>
                    <option value="لفة">لفة (Roll)</option>
                  </select>
                </div>
              </div>

              {/* Quantity and Safety Thresholds */}
              <div className="p-4 rounded-xl bg-[#0f172a] border border-[#334155] space-y-4">
                <div className="font-bold text-white flex items-center gap-2">
                  <Layers className="w-4 h-4 text-blue-400" />
                  <span>مستويات الأرصدة وحدود الأمان التخزينية</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  {/* Current Quantity */}
                  <div className="space-y-1.5 p-3 rounded-xl bg-[#1e293b] border border-[#334155]">
                    <label className="font-bold text-blue-300 block">
                      الرصيد الفعلي الحالي
                    </label>
                    <input
                      type="number"
                      min="0"
                      value={quantity}
                      onChange={(e) => setQuantity(Math.max(0, parseInt(e.target.value) || 0))}
                      className="w-full bg-[#0f172a] border border-[#334155] rounded-lg px-3 py-2 text-white font-mono text-center text-lg font-black focus:outline-none focus:border-blue-500"
                    />
                    <span className="text-[10px] text-slate-400 block text-center">بوحدة ({unit})</span>
                  </div>

                  {/* Min Safety Threshold */}
                  <div className="space-y-1.5 p-3 rounded-xl bg-[#1e293b] border border-red-500/30">
                    <label className="font-bold text-red-300 flex items-center justify-between">
                      <span>حد الطلب الأدنى (Safety Stock)</span>
                      <AlertTriangle className="w-3.5 h-3.5 text-red-400" />
                    </label>
                    <input
                      type="number"
                      min="0"
                      value={minThreshold}
                      onChange={(e) => setMinThreshold(Math.max(0, parseInt(e.target.value) || 0))}
                      className="w-full bg-[#0f172a] border border-[#334155] rounded-lg px-3 py-2 text-red-400 font-mono text-center text-lg font-black focus:outline-none focus:border-red-500"
                    />
                    <span className="text-[10px] text-slate-400 block text-center">يرسل تنبيهاً إذا انخفض الرصيد عن هذا الحد</span>
                  </div>

                  {/* Max Threshold */}
                  <div className="space-y-1.5 p-3 rounded-xl bg-[#1e293b] border border-[#334155]">
                    <label className="font-bold text-slate-300 block">
                      السعة القصوى للتخزين (Max Level)
                    </label>
                    <input
                      type="number"
                      min={minThreshold}
                      value={maxThreshold}
                      onChange={(e) => setMaxThreshold(Math.max(minThreshold, parseInt(e.target.value) || minThreshold))}
                      className="w-full bg-[#0f172a] border border-[#334155] rounded-lg px-3 py-2 text-slate-200 font-mono text-center text-lg font-black focus:outline-none focus:border-blue-500"
                    />
                    <span className="text-[10px] text-slate-400 block text-center">لتفادي تراكم رأس المال الراكد</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: SUPPLIER & PROCUREMENT & COSTS */}
          {activeTab === 'supplier' && (
            <div className="space-y-4 animate-fadeIn">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {/* Unit Cost */}
                <div className="space-y-1.5">
                  <label className="font-bold text-slate-200 flex items-center gap-1">
                    <DollarSign className="w-3.5 h-3.5 text-green-400" />
                    <span>سعر شراء الوحدة</span>
                  </label>
                  <input
                    type="number"
                    min="0"
                    step="0.1"
                    value={unitCost}
                    onChange={(e) => setUnitCost(Math.max(0, parseFloat(e.target.value) || 0))}
                    className="w-full bg-[#0f172a] border border-[#334155] rounded-xl px-3.5 py-2.5 text-green-400 font-mono font-bold text-base focus:outline-none focus:border-blue-500"
                  />
                </div>

                {/* Currency */}
                <div className="space-y-1.5">
                  <label className="font-bold text-slate-200">العملة</label>
                  <select
                    value={currency}
                    onChange={(e) => setCurrency(e.target.value)}
                    className="w-full bg-[#0f172a] border border-[#334155] rounded-xl px-3 py-2.5 text-slate-100 focus:outline-none focus:border-blue-500 font-bold"
                  >
                    <option value="USD">دولار أمريكي (USD $)</option>
                    <option value="EUR">يورو أوروبي (EUR €)</option>
                    <option value="IQD">دينار عراقي (IQD)</option>
                    <option value="AED">درهم إماراتي (AED)</option>
                  </select>
                </div>

                {/* Lead Time Days */}
                <div className="space-y-1.5">
                  <label className="font-bold text-slate-200 flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 text-amber-400" />
                    <span>مدة التوريد المتوقعة (Lead Time)</span>
                  </label>
                  <div className="relative">
                    <input
                      type="number"
                      min="1"
                      value={leadTimeDays}
                      onChange={(e) => setLeadTimeDays(Math.max(1, parseInt(e.target.value) || 1))}
                      className="w-full bg-[#0f172a] border border-[#334155] rounded-xl pr-3.5 pl-12 py-2.5 text-slate-100 font-mono font-bold focus:outline-none focus:border-blue-500"
                    />
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">أيام</span>
                  </div>
                </div>
              </div>

              {/* Total Stock Value Calculation */}
              <div className="p-3.5 rounded-xl bg-green-950/20 border border-green-500/30 flex items-center justify-between text-xs">
                <span className="text-slate-300 font-bold">القيمة التقديرية الحالية لرصيد هذا الصنف بالمستودع:</span>
                <span className="font-mono text-base font-black text-green-400">
                  ${(quantity * unitCost).toLocaleString()} {currency}
                </span>
              </div>

              {/* Supplier Info */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="font-bold text-slate-200">اسم المورد المعتمد (Primary Supplier)</label>
                  <input
                    type="text"
                    placeholder="مثال: شركة التقنية الهوائية المعتمدة / وكيل SMC"
                    value={supplierName}
                    onChange={(e) => setSupplierName(e.target.value)}
                    className="w-full bg-[#0f172a] border border-[#334155] rounded-xl px-3.5 py-2.5 text-slate-100 placeholder-slate-500 focus:outline-none focus:border-blue-500"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="font-bold text-slate-200">وسيلة التواصل مع المورد (هاتف / إيميل)</label>
                  <input
                    type="text"
                    placeholder="مثال: +964 770 123 4567 / orders@smc-distributor.iq"
                    value={supplierContact}
                    onChange={(e) => setSupplierContact(e.target.value)}
                    className="w-full bg-[#0f172a] border border-[#334155] rounded-xl px-3.5 py-2.5 text-slate-100 placeholder-slate-500 focus:outline-none focus:border-blue-500 font-mono text-[11px]"
                  />
                </div>
              </div>

              {/* Notes */}
              <div className="space-y-1.5">
                <label className="font-bold text-slate-200 flex items-center gap-1.5">
                  <FileText className="w-3.5 h-3.5 text-blue-400" />
                  <span>ملاحظات فنية وتوصيات التخزين والتركيب</span>
                </label>
                <textarea
                  rows={2}
                  placeholder="ملاحظات حول عزم الشد، شروط التخزين ضد الرطوبة، الفحص قبل التركيب..."
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="w-full bg-[#0f172a] border border-[#334155] rounded-xl p-3 text-slate-100 placeholder-slate-500 focus:outline-none focus:border-blue-500"
                />
              </div>
            </div>
          )}

          {/* Footer Actions */}
          <div className="flex items-center justify-between pt-4 border-t border-[#334155] mt-6">
            <div className="flex items-center gap-2">
              <span className="text-[11px] text-slate-400">
                الحقول المعلمة بـ (<span className="text-red-400">*</span>) إلزامية.
              </span>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                id="btn-cancel-part-form"
                onClick={onClose}
                className="px-4 py-2.5 rounded-xl bg-[#0f172a] text-slate-300 hover:bg-[#334155] border border-[#334155] font-bold transition-colors"
              >
                إلغاء
              </button>

              {isEditMode && partToEdit && (
                <button
                  type="button"
                  id="btn-delete-part-form"
                  onClick={() => {
                    if (!checkPermission('canManageWarehouse', 'حذف قطعة غيار من المستودع')) return;
                    requestDeleteConfirmation({
                      title: 'حذف صنف من المستودع',
                      message: `هل أنت متأكد من رغبتك في حذف الصنف [${partToEdit.name}] (${partToEdit.partNumber}) نهائياً من المستودع؟`,
                      itemDetails: `${partToEdit.partNumber} - ${partToEdit.name} (رصيد: ${partToEdit.quantity} ${partToEdit.unit})`,
                      confirmLabel: 'حذف الصنف نهائياً',
                      onConfirm: () => {
                        deleteSparePart(partToEdit.id);
                        onClose();
                      },
                    });
                  }}
                  className="flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl bg-red-500/10 hover:bg-red-500/20 text-red-400 hover:text-red-300 border border-red-500/30 font-bold transition-all active:scale-95"
                  title="حذف هذا الصنف نهائياً"
                >
                  <Trash2 className="w-4 h-4" />
                  <span>حذف القطعة</span>
                </button>
              )}

              <button
                type="submit"
                id="btn-save-part-form"
                className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold shadow-lg shadow-blue-600/30 transition-all"
              >
                <Save className="w-4 h-4" />
                <span>{isEditMode ? 'حفظ التعديلات' : 'إضافة القطعة إلى الكتالوج'}</span>
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
