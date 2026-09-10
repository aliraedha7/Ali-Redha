import React, { useState } from 'react';
import { 
  X, 
  Plus, 
  Trash2, 
  CalendarCheck, 
  Clock, 
  ShieldAlert, 
  Package, 
  Wrench, 
  AlertTriangle,
  Building2
} from 'lucide-react';
import { useCMMS } from '../../context/CMMSContext';
import { 
  PreventiveMaintenancePlan, 
  PMFrequency, 
  PMCategory, 
  PMStep, 
  HangarId 
} from '../../types';

export const CreatePMPlanModal: React.FC = () => {
  const { 
    isCreatePMPlanOpen, 
    setIsCreatePMPlanOpen, 
    addPMPlan, 
    assets, 
    hangars 
  } = useCMMS();

  const [title, setTitle] = useState('');
  const [titleEn, setTitleEn] = useState('');
  const [assetId, setAssetId] = useState(assets[0]?.id || '');
  const [category, setCategory] = useState<PMCategory>('MECHANICAL');
  const [frequency, setFrequency] = useState<PMFrequency>('MONTHLY');
  const [frequencyCustomText, setFrequencyCustomText] = useState('');
  const [priority, setPriority] = useState<'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL_STOPPAGE'>('HIGH');
  const [estimatedDurationMinutes, setEstimatedDurationMinutes] = useState(60);
  const [requiresMachineStop, setRequiresMachineStop] = useState(true);
  const [assignedTechnician, setAssignedTechnician] = useState('فريق الصيانة الميكانيكية');
  const [technicianSpecialty, setTechnicianSpecialty] = useState<'MECHANICAL' | 'ELECTRICAL' | 'AUTOMATION' | 'UTILITIES'>('MECHANICAL');
  const [nextDueDate, setNextDueDate] = useState(() => {
    const d = new Date();
    d.setDate(d.getDate() + 7);
    return d.toISOString().slice(0, 10);
  });
  const [reminderDaysBefore, setReminderDaysBefore] = useState(3);
  const [procedureNotes, setProcedureNotes] = useState('');
  const [criticalPoints, setCriticalPoints] = useState('');
  
  // Safety Tags
  const [safetyList, setSafetyList] = useState<string[]>([
    'عزل وإقفال مصادر الطاقة (LOTO)',
    'ارتداء قفازات ونظارات السلامة'
  ]);
  const [newSafetyItem, setNewSafetyItem] = useState('');

  // Spare Parts Tags
  const [partsList, setPartsList] = useState<string[]>([]);
  const [newPartItem, setNewPartItem] = useState('');

  // Steps
  const [steps, setSteps] = useState<PMStep[]>([
    { id: 'step_1', order: 1, description: 'فحص الحالة العامة وعزل الماكينة وتثبيت بطاقة السلامة LOTO' },
    { id: 'step_2', order: 2, description: 'فحص التثبيت الميكانيكي، السيور، ومستويات الزيت والشحوم' },
    { id: 'step_3', order: 3, description: 'تشغيل تجريبي ومراقبة درجات الحرارة والأصوات والاهتزازات' },
  ]);

  if (!isCreatePMPlanOpen) return null;

  const handleAddStep = () => {
    const nextOrder = steps.length + 1;
    setSteps([
      ...steps,
      {
        id: `step_${Date.now().toString().slice(-4)}`,
        order: nextOrder,
        description: '',
      }
    ]);
  };

  const handleRemoveStep = (index: number) => {
    if (steps.length <= 1) {
      alert('يجب أن تحتوي خطة الصيانة على خطوة فحص واحدة على الأقل');
      return;
    }
    const updated = steps.filter((_, idx) => idx !== index).map((s, idx) => ({ ...s, order: idx + 1 }));
    setSteps(updated);
  };

  const handleStepChange = (index: number, desc: string) => {
    const next = [...steps];
    next[index] = { ...next[index], description: desc };
    setSteps(next);
  };

  const handleAddSafety = () => {
    if (newSafetyItem.trim() && !safetyList.includes(newSafetyItem.trim())) {
      setSafetyList([...safetyList, newSafetyItem.trim()]);
      setNewSafetyItem('');
    }
  };

  const handleRemoveSafety = (tag: string) => {
    setSafetyList(safetyList.filter((s) => s !== tag));
  };

  const handleAddPart = () => {
    if (newPartItem.trim() && !partsList.includes(newPartItem.trim())) {
      setPartsList([...partsList, newPartItem.trim()]);
      setNewPartItem('');
    }
  };

  const handleRemovePart = (tag: string) => {
    setPartsList(partsList.filter((p) => p !== tag));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      alert('يرجى كتابة عنوان الخطة الوقائية');
      return;
    }
    const selectedAsset = assets.find((a) => a.id === assetId);
    if (!selectedAsset) {
      alert('يرجى تحديد الماكينة المستهدفة');
      return;
    }

    addPMPlan({
      title: title.trim(),
      titleEn: titleEn.trim() || undefined,
      description: procedureNotes.trim() || `خطة صيانة وقائية مجدولة لـ ${selectedAsset.name}`,
      priority,
      assetId: selectedAsset.id,
      assetName: selectedAsset.name,
      hangarId: selectedAsset.hangarId,
      hangarName: selectedAsset.hangarName,
      category,
      frequency,
      frequencyCustomText: frequencyCustomText.trim() || undefined,
      estimatedDurationMinutes: Number(estimatedDurationMinutes) || 60,
      requiresMachineStop,
      assignedTechnician: assignedTechnician.trim() || 'فريق الصيانة المعتمد',
      technicianSpecialty,
      safetyRequirements: safetyList,
      requiredSpareParts: partsList,
      steps,
      procedureNotes: procedureNotes.trim(),
      criticalPoints: criticalPoints.trim(),
      status: 'SCHEDULED',
      nextDueDate,
      reminderDaysBefore: Number(reminderDaysBefore) || 3,
    });

    setIsCreatePMPlanOpen(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm overflow-y-auto no-print">
      <div 
        className="bg-[#1e293b] border border-[#334155] rounded-xl w-full max-w-3xl overflow-hidden shadow-2xl my-8 text-right font-sans"
        dir="rtl"
      >
        {/* Header */}
        <div className="px-6 py-4 bg-[#0f172a] border-b border-[#334155] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-blue-600/20 text-blue-400 border border-blue-500/30 flex items-center justify-center">
              <CalendarCheck className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-bold text-white">إضافة خطة صيانة وقائية احترافية جديدة</h2>
              <p className="text-xs text-slate-400">
                جدولة دورية، تذكير مسبق، خطوات فحص تشغيلية ومتطلبات سلامة وقفل طاقة
              </p>
            </div>
          </div>
          <button
            onClick={() => setIsCreatePMPlanOpen(false)}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-[#334155] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5 max-h-[80vh] overflow-y-auto">
          {/* Basic Fields */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="sm:col-span-2">
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                عنوان خطة الصيانة الوقائية *
              </label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="مثال: فحص ومعايرة أنظمة الشد الإلكتروني والدكتور بليد"
                className="w-full bg-[#0f172a] border border-[#334155] rounded-lg px-3 py-2 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                الماكينة أو المعدة المستهدفة *
              </label>
              <select
                value={assetId}
                onChange={(e) => setAssetId(e.target.value)}
                className="w-full bg-[#0f172a] border border-[#334155] rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-blue-500 font-semibold"
              >
                {assets.map((a) => (
                  <option key={a.id} value={a.id}>
                    [{a.id}] {a.name} — {a.hangarName}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                تصنيف الصيانة (Category) *
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as PMCategory)}
                className="w-full bg-[#0f172a] border border-[#334155] rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-blue-500"
              >
                <option value="MECHANICAL">صيانة ميكانيكية وضبط محاذاة (Mechanical)</option>
                <option value="ELECTRICAL">صيانة كهربائية ومحركات ولوحات (Electrical)</option>
                <option value="AUTOMATION">أتمتة وحساسات وبرمجة PLC (Automation)</option>
                <option value="LUBRICATION">تزييت وتشحيم ونقاط هيدروليك (Lubrication)</option>
                <option value="PNEUMATIC_HYDRAULIC">أنظمة هوائية وهيدروليكية (Pneumatic)</option>
                <option value="UTILITIES">مرافق وخدمات وتبريد وضواغط (Utilities)</option>
                <option value="SAFETY">سلامة وصمامات أمان وبيئة (Safety)</option>
              </select>
            </div>

            {/* Recurrence & Frequency */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                التكرار الدوري حسب الوقت (Frequency) *
              </label>
              <select
                value={frequency}
                onChange={(e) => setFrequency(e.target.value as PMFrequency)}
                className="w-full bg-[#0f172a] border border-[#334155] rounded-lg px-3 py-2 text-sm text-white font-semibold focus:outline-none focus:border-blue-500"
              >
                <option value="DAILY">يومي (Daily) - كل 24 ساعة</option>
                <option value="WEEKLY">أسبوعي (Weekly) - كل 7 أيام</option>
                <option value="BIWEEKLY">كل أسبوعين (Bi-weekly) - كل 14 يوم</option>
                <option value="MONTHLY">شهري (Monthly) - كل 30 يوم</option>
                <option value="QUARTERLY">ربع سنوي (Quarterly) - كل 3 أشهر</option>
                <option value="SEMI_ANNUAL">نصف سنوي (Semi-Annual) - كل 6 أشهر</option>
                <option value="ANNUAL">سنوي (Annual) - كل عام</option>
                <option value="RUNNING_HOURS">تكرار حسب ساعات التشغيل (Running Hours)</option>
              </select>
            </div>

            {frequency === 'RUNNING_HOURS' && (
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  تفاصيل ساعات التشغيل
                </label>
                <input
                  type="text"
                  value={frequencyCustomText}
                  onChange={(e) => setFrequencyCustomText(e.target.value)}
                  placeholder="مثال: كل 500 ساعة تشغيل أو 2,000 ساعة"
                  className="w-full bg-[#0f172a] border border-[#334155] rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-blue-500"
                />
              </div>
            )}

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                موعد الاستحقاق الأول (Next Due Date) *
              </label>
              <input
                type="date"
                required
                value={nextDueDate}
                onChange={(e) => setNextDueDate(e.target.value)}
                className="w-full bg-[#0f172a] border border-[#334155] rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-blue-500 font-mono"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                التذكير المسبق (أيام قبل الموعد)
              </label>
              <select
                value={reminderDaysBefore}
                onChange={(e) => setReminderDaysBefore(parseInt(e.target.value))}
                className="w-full bg-[#0f172a] border border-[#334155] rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-blue-500"
              >
                <option value={1}>تذكير قبل يوم واحد</option>
                <option value={2}>تذكير قبل يومين</option>
                <option value={3}>تذكير قبل 3 أيام (الموصى به)</option>
                <option value={7}>تذكير قبل أسبوع</option>
                <option value={14}>تذكير قبل أسبوعين</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                الوقت التقديري للإنجاز (بالدقائق)
              </label>
              <input
                type="number"
                min={10}
                step={5}
                value={estimatedDurationMinutes}
                onChange={(e) => setEstimatedDurationMinutes(parseInt(e.target.value) || 60)}
                className="w-full bg-[#0f172a] border border-[#334155] rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-blue-500 font-mono"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                الفني أو الفريق المكلف
              </label>
              <input
                type="text"
                required
                value={assignedTechnician}
                onChange={(e) => setAssignedTechnician(e.target.value)}
                placeholder="مثال: م. علي رضا / فني الميكانيك"
                className="w-full bg-[#0f172a] border border-[#334155] rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                تخصص الفني
              </label>
              <select
                value={technicianSpecialty}
                onChange={(e) => setTechnicianSpecialty(e.target.value as any)}
                className="w-full bg-[#0f172a] border border-[#334155] rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-blue-500"
              >
                <option value="MECHANICAL">فني ميكانيك عام</option>
                <option value="ELECTRICAL">فني كهرباء صناعية</option>
                <option value="AUTOMATION">مهندس أتمتة وتحكم</option>
                <option value="UTILITIES">فني خدمات ومرافق</option>
              </select>
            </div>

            {/* Machine Stoppage Toggle */}
            <div className="sm:col-span-2 bg-[#0f172a] p-3 rounded-lg border border-[#334155] flex items-center justify-between">
              <div>
                <span className="text-xs font-bold text-white block">
                  هل يتطلب إجراء الفحص إيقاف خط الإنتاج / الماكينة؟
                </span>
                <span className="text-[11px] text-slate-400">
                  عند التفعيل، سيتم التنبيه بضرورة تطبيق بروتوكول قفل وعزل الطاقة LOTO
                </span>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={requiresMachineStop}
                  onChange={(e) => setRequiresMachineStop(e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-slate-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-amber-600"></div>
              </label>
            </div>
          </div>

          {/* CHECKLIST STEPS BUILDER */}
          <div className="border border-[#334155] rounded-xl p-4 bg-[#0f172a]/60 space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <Wrench className="w-4 h-4 text-blue-400" />
                  خطوات الفحص والإجراءات التشغيلية التفصيلية
                </h3>
                <p className="text-[11px] text-slate-400">
                  الخطوات التي يقوم بها الفني خطوة بخطوة عند تنفيذ أمر الصيانة الوقائية
                </p>
              </div>
              <button
                type="button"
                onClick={handleAddStep}
                className="px-3 py-1.5 bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold rounded-lg flex items-center gap-1.5 transition-colors"
              >
                <Plus className="w-3.5 h-3.5" />
                إضافة خطوة
              </button>
            </div>

            <div className="space-y-2.5 pt-2">
              {steps.map((step, idx) => (
                <div key={step.id || idx} className="flex items-center gap-2">
                  <span className="w-7 h-7 rounded-full bg-[#1e293b] border border-[#334155] flex items-center justify-center text-xs font-mono font-bold text-blue-400 shrink-0">
                    {idx + 1}
                  </span>
                  <input
                    type="text"
                    required
                    value={step.description}
                    onChange={(e) => handleStepChange(idx, e.target.value)}
                    placeholder={`الإجراء رقم ${idx + 1}...`}
                    className="flex-1 bg-[#0f172a] border border-[#334155] rounded-lg px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
                  />
                  <button
                    type="button"
                    onClick={() => handleRemoveStep(idx)}
                    className="p-2 text-slate-400 hover:text-red-400 rounded-lg hover:bg-red-500/10 transition-colors"
                    title="حذف هذه الخطوة"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Safety and Spare Parts */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Safety tags */}
            <div className="border border-[#334155] rounded-xl p-3 bg-[#0f172a]/40 space-y-2">
              <label className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
                <ShieldAlert className="w-4 h-4 text-amber-400" />
                شروط السلامة المهنية المطلوبة
              </label>
              <div className="flex gap-1.5">
                <input
                  type="text"
                  value={newSafetyItem}
                  onChange={(e) => setNewSafetyItem(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      handleAddSafety();
                    }
                  }}
                  placeholder="أضف شرط سلامة (مثل: LOTO)..."
                  className="flex-1 bg-[#1e293b] border border-[#334155] rounded px-2.5 py-1.5 text-xs text-white"
                />
                <button
                  type="button"
                  onClick={handleAddSafety}
                  className="px-2.5 py-1.5 bg-[#334155] hover:bg-slate-600 text-white rounded text-xs"
                >
                  إضافة
                </button>
              </div>
              <div className="flex flex-wrap gap-1.5 pt-1">
                {safetyList.map((tag) => (
                  <span
                    key={tag}
                    className="px-2 py-0.5 rounded text-[11px] bg-amber-500/10 text-amber-400 border border-amber-500/20 flex items-center gap-1"
                  >
                    {tag}
                    <button
                      type="button"
                      onClick={() => handleRemoveSafety(tag)}
                      className="hover:text-red-300"
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>
            </div>

            {/* Spare Parts tags */}
            <div className="border border-[#334155] rounded-xl p-3 bg-[#0f172a]/40 space-y-2">
              <label className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
                <Package className="w-4 h-4 text-sky-400" />
                قطع الغيار والمستهلكات المطلوبة
              </label>
              <div className="flex gap-1.5">
                <input
                  type="text"
                  value={newPartItem}
                  onChange={(e) => setNewPartItem(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      handleAddPart();
                    }
                  }}
                  placeholder="أضف قطعة (مثل: فلتر زيت، شفرة)..."
                  className="flex-1 bg-[#1e293b] border border-[#334155] rounded px-2.5 py-1.5 text-xs text-white"
                />
                <button
                  type="button"
                  onClick={handleAddPart}
                  className="px-2.5 py-1.5 bg-[#334155] hover:bg-slate-600 text-white rounded text-xs"
                >
                  إضافة
                </button>
              </div>
              <div className="flex flex-wrap gap-1.5 pt-1">
                {partsList.map((tag) => (
                  <span
                    key={tag}
                    className="px-2 py-0.5 rounded text-[11px] bg-sky-500/10 text-sky-400 border border-sky-500/20 flex items-center gap-1"
                  >
                    {tag}
                    <button
                      type="button"
                      onClick={() => handleRemovePart(tag)}
                      className="hover:text-red-300"
                    >
                      ×
                    </button>
                  </span>
                ))}
                {partsList.length === 0 && (
                  <span className="text-[11px] text-slate-500">لا تتطلب قطع غيار مسبقة (فحص وضبط فقط)</span>
                )}
              </div>
            </div>
          </div>

          {/* Procedure Notes & Critical Points */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                إرشادات تنفيذية إضافية
              </label>
              <textarea
                rows={2}
                value={procedureNotes}
                onChange={(e) => setProcedureNotes(e.target.value)}
                placeholder="تعليمات أو اشتراطات للمهندس والفني..."
                className="w-full bg-[#0f172a] border border-[#334155] rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                النقاط الحرجة التي تسبب توقفاً أو عطلاً
              </label>
              <textarea
                rows={2}
                value={criticalPoints}
                onChange={(e) => setCriticalPoints(e.target.value)}
                placeholder="مثال: في حال تجاوز الخلوص 0.3 مم يجب استبدال الرولمانات فوراً..."
                className="w-full bg-[#0f172a] border border-[#334155] rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-blue-500"
              />
            </div>
          </div>

          {/* Footer */}
          <div className="pt-4 border-t border-[#334155] flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={() => setIsCreatePMPlanOpen(false)}
              className="px-4 py-2 bg-[#334155] hover:bg-[#475569] text-white text-xs font-semibold rounded-lg transition-colors"
            >
              إلغاء
            </button>
            <button
              type="submit"
              className="px-5 py-2 bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold rounded-lg flex items-center gap-1.5 shadow-md shadow-blue-600/30 transition-all"
            >
              <Plus className="w-4 h-4" />
              تأكيد وجدولة خطة الصيانة الوقائية
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
