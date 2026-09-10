import React, { useState, useEffect } from 'react';
import { 
  X, 
  Plus, 
  Trash2, 
  CalendarCheck, 
  Save, 
  ShieldAlert, 
  Package, 
  Wrench, 
  AlertTriangle 
} from 'lucide-react';
import { useCMMS } from '../../context/CMMSContext';
import { 
  PreventiveMaintenancePlan, 
  PMFrequency, 
  PMCategory, 
  PMStep 
} from '../../types';

export const EditPMPlanModal: React.FC = () => {
  const { 
    editingPMPlan, 
    setEditingPMPlan, 
    updatePMPlan, 
    deletePMPlan,
    requestDeleteConfirmation,
    checkPermission,
    assets 
  } = useCMMS();

  const [title, setTitle] = useState('');
  const [titleEn, setTitleEn] = useState('');
  const [assetId, setAssetId] = useState('');
  const [category, setCategory] = useState<PMCategory>('MECHANICAL');
  const [frequency, setFrequency] = useState<PMFrequency>('MONTHLY');
  const [frequencyCustomText, setFrequencyCustomText] = useState('');
  const [priority, setPriority] = useState<'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL_STOPPAGE'>('HIGH');
  const [estimatedDurationMinutes, setEstimatedDurationMinutes] = useState(60);
  const [requiresMachineStop, setRequiresMachineStop] = useState(true);
  const [assignedTechnician, setAssignedTechnician] = useState('');
  const [technicianSpecialty, setTechnicianSpecialty] = useState<'MECHANICAL' | 'ELECTRICAL' | 'AUTOMATION' | 'UTILITIES'>('MECHANICAL');
  const [nextDueDate, setNextDueDate] = useState('');
  const [reminderDaysBefore, setReminderDaysBefore] = useState(3);
  const [status, setStatus] = useState<PreventiveMaintenancePlan['status']>('SCHEDULED');
  const [procedureNotes, setProcedureNotes] = useState('');
  const [criticalPoints, setCriticalPoints] = useState('');
  const [safetyList, setSafetyList] = useState<string[]>([]);
  const [newSafetyItem, setNewSafetyItem] = useState('');
  const [partsList, setPartsList] = useState<string[]>([]);
  const [newPartItem, setNewPartItem] = useState('');
  const [steps, setSteps] = useState<PMStep[]>([]);

  useEffect(() => {
    if (editingPMPlan) {
      setTitle(editingPMPlan.title);
      setTitleEn(editingPMPlan.titleEn || '');
      setAssetId(editingPMPlan.assetId);
      setCategory(editingPMPlan.category);
      setFrequency(editingPMPlan.frequency);
      setFrequencyCustomText(editingPMPlan.frequencyCustomText || '');
      setPriority(editingPMPlan.priority || 'HIGH');
      setEstimatedDurationMinutes(editingPMPlan.estimatedDurationMinutes);
      setRequiresMachineStop(editingPMPlan.requiresMachineStop);
      setAssignedTechnician(editingPMPlan.assignedTechnician);
      setTechnicianSpecialty(editingPMPlan.technicianSpecialty);
      setNextDueDate(editingPMPlan.nextDueDate);
      setReminderDaysBefore(editingPMPlan.reminderDaysBefore);
      setStatus(editingPMPlan.status);
      setProcedureNotes(editingPMPlan.procedureNotes || '');
      setCriticalPoints(editingPMPlan.criticalPoints || '');
      setSafetyList(editingPMPlan.safetyRequirements ? [...editingPMPlan.safetyRequirements] : []);
      setPartsList(editingPMPlan.requiredSpareParts ? [...editingPMPlan.requiredSpareParts] : []);
      setSteps(editingPMPlan.steps ? JSON.parse(JSON.stringify(editingPMPlan.steps)) : []);
    }
  }, [editingPMPlan]);

  if (!editingPMPlan) return null;

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
      alert('يجب أن تحتوي الخطة على خطوة واحدة على الأقل.');
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

    updatePMPlan({
      ...editingPMPlan,
      title: title.trim(),
      titleEn: titleEn.trim() || undefined,
      description: procedureNotes.trim() || `خطة صيانة وقائية مجدولة لـ ${selectedAsset?.name || editingPMPlan.assetName}`,
      priority,
      assetId: selectedAsset ? selectedAsset.id : editingPMPlan.assetId,
      assetName: selectedAsset ? selectedAsset.name : editingPMPlan.assetName,
      hangarId: selectedAsset ? selectedAsset.hangarId : editingPMPlan.hangarId,
      hangarName: selectedAsset ? selectedAsset.hangarName : editingPMPlan.hangarName,
      category,
      frequency,
      frequencyCustomText: frequencyCustomText.trim() || undefined,
      estimatedDurationMinutes: Number(estimatedDurationMinutes) || 60,
      requiresMachineStop,
      assignedTechnician: assignedTechnician.trim() || 'فريق الصيانة',
      technicianSpecialty,
      safetyRequirements: safetyList,
      requiredSpareParts: partsList,
      steps,
      procedureNotes: procedureNotes.trim(),
      criticalPoints: criticalPoints.trim(),
      status,
      nextDueDate,
      reminderDaysBefore: Number(reminderDaysBefore) || 3,
    });

    setEditingPMPlan(null);
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
            <div className="w-10 h-10 rounded-lg bg-amber-600/20 text-amber-400 border border-amber-500/30 flex items-center justify-center">
              <CalendarCheck className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-bold text-white">تعديل خطة الصيانة الوقائية [{editingPMPlan.id}]</h2>
              <p className="text-xs text-slate-400">
                تحديث الجداول الدورية، الفني المكلف، خطوات الفحص، وشروط العزل
              </p>
            </div>
          </div>
          <button
            onClick={() => setEditingPMPlan(null)}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-[#334155] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5 max-h-[80vh] overflow-y-auto">
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
                className="w-full bg-[#0f172a] border border-[#334155] rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-blue-500 font-semibold"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                الماكينة أو المعدة المستهدفة *
              </label>
              <select
                value={assetId}
                onChange={(e) => setAssetId(e.target.value)}
                className="w-full bg-[#0f172a] border border-[#334155] rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-blue-500"
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
                تصنيف الصيانة (Category)
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

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                التكرار الدوري حسب الوقت (Frequency) *
              </label>
              <select
                value={frequency}
                onChange={(e) => setFrequency(e.target.value as PMFrequency)}
                className="w-full bg-[#0f172a] border border-[#334155] rounded-lg px-3 py-2 text-sm text-white font-semibold focus:outline-none focus:border-blue-500"
              >
                <option value="DAILY">يومي (Daily)</option>
                <option value="WEEKLY">أسبوعي (Weekly)</option>
                <option value="BIWEEKLY">كل أسبوعين (Bi-weekly)</option>
                <option value="MONTHLY">شهري (Monthly)</option>
                <option value="QUARTERLY">ربع سنوي (Quarterly)</option>
                <option value="SEMI_ANNUAL">نصف سنوي (Semi-Annual)</option>
                <option value="ANNUAL">سنوي (Annual)</option>
                <option value="RUNNING_HOURS">تكرار حسب ساعات التشغيل (Running Hours)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                موعد الاستحقاق القادم (Next Due Date) *
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
                حالة الخطة
              </label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as any)}
                className="w-full bg-[#0f172a] border border-[#334155] rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-blue-500"
              >
                <option value="SCHEDULED">مجدول ومستقر (Scheduled)</option>
                <option value="IN_PROGRESS">قيد التنفيذ من قبل الفني (In Progress)</option>
                <option value="OVERDUE">متأخر عن موعده (Overdue)</option>
                <option value="COMPLETED">منجز ومطابق (Completed)</option>
              </select>
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
                <option value={1}>تذكير قبل يوم</option>
                <option value={2}>تذكير قبل يومين</option>
                <option value={3}>تذكير قبل 3 أيام</option>
                <option value={7}>تذكير قبل أسبوع</option>
                <option value={14}>تذكير قبل أسبوعين</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                الفني المكلف
              </label>
              <input
                type="text"
                required
                value={assignedTechnician}
                onChange={(e) => setAssignedTechnician(e.target.value)}
                className="w-full bg-[#0f172a] border border-[#334155] rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                الوقت التقديري (بالدقائق)
              </label>
              <input
                type="number"
                value={estimatedDurationMinutes}
                onChange={(e) => setEstimatedDurationMinutes(parseInt(e.target.value) || 60)}
                className="w-full bg-[#0f172a] border border-[#334155] rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-blue-500 font-mono"
              />
            </div>

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
                  خطوات الفحص والإجراءات التشغيلية
                </h3>
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
                    className="flex-1 bg-[#0f172a] border border-[#334155] rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-blue-500"
                  />
                  <button
                    type="button"
                    onClick={() => handleRemoveStep(idx)}
                    className="p-2 text-slate-400 hover:text-red-400 rounded-lg hover:bg-red-500/10 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
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
                className="w-full bg-[#0f172a] border border-[#334155] rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-blue-500"
              />
            </div>
          </div>

          {/* Footer */}
          <div className="pt-4 border-t border-[#334155] flex items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setEditingPMPlan(null)}
                className="px-4 py-2 bg-[#334155] hover:bg-[#475569] text-white text-xs font-semibold rounded-lg transition-colors"
              >
                إلغاء
              </button>

              {editingPMPlan && (
                <button
                  type="button"
                  id="btn-delete-pm-plan-modal"
                  onClick={() => {
                    if (!checkPermission('canManagePreventive', 'حذف خطة صيانة وقائية')) return;
                    requestDeleteConfirmation({
                      title: 'حذف خطة صيانة وقائية',
                      message: `هل أنت متأكد من رغبتك في حذف خطة الصيانة [${editingPMPlan.title}] نهائياً؟`,
                      itemDetails: `${editingPMPlan.id} - ${editingPMPlan.title} (${editingPMPlan.assetName})`,
                      confirmLabel: 'حذف الخطة نهائياً',
                      onConfirm: () => {
                        deletePMPlan(editingPMPlan.id);
                        setEditingPMPlan(null);
                      },
                    });
                  }}
                  className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold text-red-400 hover:text-red-300 bg-red-500/10 hover:bg-red-500/25 border border-red-500/30 rounded-lg transition-colors active:scale-95"
                  title="حذف هذه الخطة نهائياً"
                >
                  <Trash2 className="w-4 h-4" />
                  <span>حذف الخطة</span>
                </button>
              )}
            </div>

            <button
              type="submit"
              className="px-5 py-2 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold rounded-lg flex items-center gap-1.5 shadow-md shadow-emerald-600/30 transition-all"
            >
              <Save className="w-4 h-4" />
              حفظ التعديلات على الخطة
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
