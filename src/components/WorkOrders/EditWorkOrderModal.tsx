import React, { useState, useEffect } from 'react';
import { 
  X, 
  Wrench, 
  Check, 
  User, 
  AlertTriangle, 
  Clock, 
  FileText, 
  Tag, 
  Building, 
  ShieldAlert,
  Edit3,
  Shield,
  Trash2
} from 'lucide-react';
import { useCMMS } from '../../context/CMMSContext';
import { 
  WorkOrder, 
  WorkOrderStatus, 
  WorkOrderType, 
  WorkOrderPriority, 
  TechnicianSpecialty 
} from '../../types';

export const EditWorkOrderModal: React.FC = () => {
  const { 
    editingWorkOrder, 
    setEditingWorkOrder, 
    assets, 
    updateWorkOrder,
    deleteWorkOrder,
    requestDeleteConfirmation,
    currentUser
  } = useCMMS();

  const isDeveloper = Boolean(
    currentUser?.isSuperDeveloper || 
    currentUser?.role === 'DEVELOPER' || 
    currentUser?.permissions?.canViewDeveloperHub
  );

  const [title, setTitle] = useState('');
  const [selectedAssetId, setSelectedAssetId] = useState('');
  const [type, setType] = useState<WorkOrderType>('CORRECTIVE');
  const [priority, setPriority] = useState<WorkOrderPriority>('MEDIUM');
  const [status, setStatus] = useState<WorkOrderStatus>('APPROVED');
  const [assignedTo, setAssignedTo] = useState('');
  const [technicianSpecialty, setTechnicianSpecialty] = useState<TechnicianSpecialty>('MECHANICAL');
  const [reportedBy, setReportedBy] = useState('');
  const [downtimeMinutes, setDowntimeMinutes] = useState<number>(0);
  const [description, setDescription] = useState('');
  const [rootCause, setRootCause] = useState('');
  const [actionTaken, setActionTaken] = useState('');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (editingWorkOrder) {
      setTitle(editingWorkOrder.title || '');
      setSelectedAssetId(editingWorkOrder.assetId || '');
      setType(editingWorkOrder.type || 'CORRECTIVE');
      setPriority(editingWorkOrder.priority || 'MEDIUM');
      setStatus(editingWorkOrder.status || 'APPROVED');
      setAssignedTo(editingWorkOrder.assignedTo || '');
      setTechnicianSpecialty(editingWorkOrder.technicianSpecialty || 'MECHANICAL');
      setReportedBy(editingWorkOrder.reportedBy || '');
      setDowntimeMinutes(editingWorkOrder.downtimeMinutes || 0);
      setDescription(editingWorkOrder.description || '');
      setRootCause(editingWorkOrder.rootCause || '');
      setActionTaken(editingWorkOrder.actionTaken || '');
      setError(null);
    }
  }, [editingWorkOrder]);

  if (!editingWorkOrder) return null;

  const currentAsset = assets.find((a) => a.id === selectedAssetId) || assets[0];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const trimmedTitle = title.trim();
    if (!trimmedTitle) {
      setError('يرجى إدخال عنوان أمر العمل');
      return;
    }

    const targetAsset = assets.find((a) => a.id === selectedAssetId) || currentAsset;

    const updated: WorkOrder = {
      ...editingWorkOrder,
      title: trimmedTitle,
      assetId: targetAsset.id,
      assetName: targetAsset.name,
      hangarId: targetAsset.hangarId,
      type,
      priority,
      status,
      assignedTo: assignedTo.trim() || 'فريق الصيانة العام',
      technicianSpecialty,
      reportedBy: reportedBy.trim() || editingWorkOrder.reportedBy,
      downtimeMinutes: Number(downtimeMinutes) || 0,
      description: description.trim(),
      rootCause: rootCause.trim() || undefined,
      actionTaken: actionTaken.trim() || undefined,
    };

    updateWorkOrder(updated);
    setEditingWorkOrder(null);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm overflow-y-auto animate-in fade-in zoom-in-95 no-print">
      <div 
        id="edit-work-order-modal-container"
        className="relative w-full max-w-2xl bg-[#1e293b] border border-[#334155] rounded-2xl shadow-2xl overflow-hidden my-8"
        dir="rtl"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-[#334155] bg-[#0f172a]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-600/20 border border-blue-500/40 flex items-center justify-center text-blue-400">
              <Edit3 className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-bold text-white tracking-wide">
                  تعديل وتصحيح بيانات أمر العمل
                </h2>
                <span className="font-mono text-xs px-2.5 py-0.5 rounded bg-blue-600 text-white font-bold">
                  {editingWorkOrder.id}
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                تعديل الماكينة، الأولوية، الفني المكلف، والملاحظات الفنية
              </p>
            </div>
          </div>

          <button
            type="button"
            id="btn-close-edit-wo-modal"
            onClick={() => setEditingWorkOrder(null)}
            className="p-2 text-slate-400 hover:text-white rounded-xl hover:bg-[#334155] transition"
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

          {/* Title */}
          <div>
            <label className="block text-xs font-bold text-slate-300 mb-1.5">
              عنوان البلاغ / أمر العمل <span className="text-red-400">*</span>
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="مثال: ضبط واستبدال شفرة الدكتور بليد لوحدة الطباعة 4"
              className="w-full bg-[#0f172a] border border-[#334155] rounded-xl px-3.5 py-2.5 text-white text-xs font-semibold focus:outline-none focus:border-blue-500"
            />
          </div>

          {/* Machine Asset Selection */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1.5">
                الماكينة المستهدفة
              </label>
              <select
                value={selectedAssetId}
                onChange={(e) => setSelectedAssetId(e.target.value)}
                className="w-full bg-[#0f172a] border border-[#334155] rounded-xl px-3 py-2 text-white text-xs font-medium focus:outline-none focus:border-blue-500"
              >
                {assets.map((a) => (
                  <option key={a.id} value={a.id}>
                    [{a.id}] {a.name} ({a.hangarName})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1.5">
                مرحلة حالة الأمر (Workflow Status)
              </label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as WorkOrderStatus)}
                className="w-full bg-[#0f172a] border border-[#334155] rounded-xl px-3 py-2 text-white text-xs focus:outline-none focus:border-blue-500"
              >
                <option value="REQUESTED">1. قيد البلاغ (Requested)</option>
                <option value="APPROVED">2. معتمد (Approved)</option>
                <option value="IN_PROGRESS">3. قيد التنفيذ (In Progress)</option>
                <option value="PENDING_PARTS">4. بانتظار قطع غيار (Pending Parts)</option>
                <option value="COMPLETED">5. منجز (Completed)</option>
                <option value="CLOSED">6. مغلق ومؤرشف (Closed)</option>
              </select>
            </div>
          </div>

          {/* Type & Priority */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1.5">
                نوع الصيانة
              </label>
              <select
                value={type}
                onChange={(e) => setType(e.target.value as WorkOrderType)}
                className="w-full bg-[#0f172a] border border-[#334155] rounded-xl px-3 py-2 text-white text-xs focus:outline-none focus:border-blue-500"
              >
                <option value="EMERGENCY_BREAKDOWN">توقف طارئ (EMERGENCY)</option>
                <option value="PREVENTIVE">صيانة وقائية (PREVENTIVE)</option>
                <option value="CORRECTIVE">تصحيحية وعلاجية (CORRECTIVE)</option>
                <option value="INSPECTION">فحص ومعايرة (INSPECTION)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1.5">
                درجة الأولوية
              </label>
              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value as WorkOrderPriority)}
                className="w-full bg-[#0f172a] border border-[#334155] rounded-xl px-3 py-2 text-white text-xs focus:outline-none focus:border-blue-500 font-bold"
              >
                <option value="CRITICAL_STOPPAGE" className="text-red-400">توقف خط إنتاج (CRITICAL)</option>
                <option value="HIGH" className="text-amber-400">عالية (HIGH)</option>
                <option value="MEDIUM" className="text-blue-400">متوسطة (MEDIUM)</option>
                <option value="LOW" className="text-slate-400">منخفضة (LOW)</option>
              </select>
            </div>
          </div>

          {/* Assigned Tech & Specialty & Downtime */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1.5">
                الفني المكلف
              </label>
              <input
                type="text"
                value={assignedTo}
                onChange={(e) => setAssignedTo(e.target.value)}
                placeholder="مثال: فني ميكانيك أول"
                className="w-full bg-[#0f172a] border border-[#334155] rounded-xl px-3 py-2 text-white text-xs focus:outline-none focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1.5">
                تخصص التدخل
              </label>
              <select
                value={technicianSpecialty}
                onChange={(e) => setTechnicianSpecialty(e.target.value as TechnicianSpecialty)}
                className="w-full bg-[#0f172a] border border-[#334155] rounded-xl px-3 py-2 text-white text-xs focus:outline-none focus:border-blue-500"
              >
                <option value="MECHANICAL">ميكانيكي (Mechanical)</option>
                <option value="ELECTRICAL">كهربائي (Electrical)</option>
                <option value="AUTOMATION">أتمتة وتحكم (Automation)</option>
                <option value="UTILITIES">مرافق وخدمات (Utilities)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1.5">
                مدة التوقف (بالدقائق)
              </label>
              <input
                type="number"
                min={0}
                value={downtimeMinutes}
                onChange={(e) => setDowntimeMinutes(Number(e.target.value))}
                className="w-full bg-[#0f172a] border border-[#334155] rounded-xl px-3 py-2 text-white font-mono text-xs focus:outline-none focus:border-blue-500"
              />
            </div>
          </div>

          {/* Developer-Only Field: Who reported the work order */}
          {isDeveloper && (
            <div className="p-3 rounded-xl bg-purple-950/30 border border-purple-500/40 space-y-1.5 animate-in fade-in">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-purple-300 flex items-center gap-1.5">
                  <Shield className="w-3.5 h-3.5 text-purple-400" />
                  <span>من قام برفع طلب الصيانة (صلاحية مطور حصرية):</span>
                </span>
                <span className="text-[10px] bg-purple-500/30 text-purple-300 font-mono px-2 py-0.5 rounded font-bold">
                  حقل مخصص للمطور
                </span>
              </div>
              <input
                type="text"
                value={reportedBy}
                onChange={(e) => setReportedBy(e.target.value)}
                placeholder="اسم أو جهة رافع الطلب..."
                className="w-full bg-[#0f172a] border border-purple-500/50 rounded-lg px-3 py-2 text-white text-xs focus:outline-none focus:border-purple-400 font-medium"
              />
            </div>
          )}

          {/* Description */}
          <div>
            <label className="block text-xs font-bold text-slate-300 mb-1.5">
              الوصف الفني للمشكلة والإجراء المطلوب
            </label>
            <textarea
              rows={2}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="اكتب تفاصيل البلاغ أو أعمال الصيانة المطلوبة..."
              className="w-full bg-[#0f172a] border border-[#334155] rounded-xl p-3 text-white text-xs leading-relaxed focus:outline-none focus:border-blue-500"
            />
          </div>

          {/* Root Cause & Action Taken */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1.5">
                السبب الجذري للعطل (Root Cause)
              </label>
              <textarea
                rows={2}
                value={rootCause}
                onChange={(e) => setRootCause(e.target.value)}
                placeholder="تحليل سبب العطل الجذري..."
                className="w-full bg-[#0f172a] border border-[#334155] rounded-xl p-2.5 text-white text-xs leading-relaxed focus:outline-none focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1.5">
                الإجراء التصحيحي المتخذ (Action Taken)
              </label>
              <textarea
                rows={2}
                value={actionTaken}
                onChange={(e) => setActionTaken(e.target.value)}
                placeholder="ما تم تنفيذه لعلاج العطل والتأكد من سلامة التشغيل..."
                className="w-full bg-[#0f172a] border border-[#334155] rounded-xl p-2.5 text-white text-xs leading-relaxed focus:outline-none focus:border-blue-500"
              />
            </div>
          </div>

          {/* Footer Actions */}
          <div className="flex items-center justify-between gap-3 pt-4 border-t border-[#334155]">
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setEditingWorkOrder(null)}
                className="px-4 py-2.5 text-xs text-slate-400 hover:text-white rounded-xl bg-[#0f172a] hover:bg-[#334155] border border-[#334155] transition"
              >
                إلغاء التعديل
              </button>

              {editingWorkOrder && (
                <button
                  type="button"
                  onClick={() => {
                    requestDeleteConfirmation({
                      title: 'حذف أمر العمل',
                      message: `هل أنت متأكد من رغبتك في حذف أمر العمل [${editingWorkOrder.id}] نهائياً؟`,
                      itemDetails: `${editingWorkOrder.id} - ${editingWorkOrder.title}`,
                      confirmLabel: 'حذف أمر العمل',
                      onConfirm: () => {
                        deleteWorkOrder(editingWorkOrder.id);
                        setEditingWorkOrder(null);
                      },
                    });
                  }}
                  className="flex items-center gap-1.5 px-3.5 py-2.5 text-xs font-bold text-red-400 hover:text-red-300 bg-red-500/10 hover:bg-red-500/25 border border-red-500/30 rounded-xl transition active:scale-95"
                  title="حذف هذا الأمر نهائياً"
                >
                  <Trash2 className="w-4 h-4" />
                  <span>حذف أمر العمل</span>
                </button>
              )}
            </div>

            <button
              type="submit"
              id="btn-save-wo-changes"
              className="flex items-center gap-2 px-6 py-2.5 text-xs font-bold text-white bg-blue-600 hover:bg-blue-500 rounded-xl shadow-lg shadow-blue-600/25 transition"
            >
              <Check className="w-4 h-4" />
              <span>حفظ التعديلات على أمر العمل</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
