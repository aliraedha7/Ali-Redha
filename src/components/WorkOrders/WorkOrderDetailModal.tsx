import React, { useState } from 'react';
import { 
  X, 
  Wrench, 
  CheckCircle2, 
  AlertTriangle, 
  Clock, 
  UserCheck, 
  Package, 
  Plus, 
  Minus, 
  FileText, 
  CheckSquare, 
  ShieldAlert,
  ArrowRight,
  Send,
  Building,
  Edit3,
  Shield,
  Trash2
} from 'lucide-react';
import { useCMMS } from '../../context/CMMSContext';
import { WorkOrder, WorkOrderStatus, SparePart } from '../../types';

export const WorkOrderDetailModal: React.FC = () => {
  const { 
    selectedWOForDetail, 
    setSelectedWOForDetail, 
    setEditingWorkOrder,
    updateWorkOrderStatus, 
    updateWorkOrder, 
    deleteWorkOrder,
    requestDeleteConfirmation,
    spareParts, 
    consumePartInWorkOrder,
    currentUser
  } = useCMMS();

  const isDeveloper = Boolean(
    currentUser?.isSuperDeveloper || 
    currentUser?.role === 'DEVELOPER' || 
    currentUser?.permissions?.canViewDeveloperHub
  );

  const [rootCause, setRootCause] = useState<string>('');
  const [actionTaken, setActionTaken] = useState<string>('');
  const [downtimeMinutes, setDowntimeMinutes] = useState<number>(0);
  const [selectedPartId, setSelectedPartId] = useState<string>('');
  const [partQty, setPartQty] = useState<number>(1);
  const [activeTab, setActiveTab] = useState<'details' | 'parts' | 'closure'>('details');

  if (!selectedWOForDetail) return null;

  const wo = selectedWOForDetail;

  const handleStatusChange = (newStatus: WorkOrderStatus) => {
    updateWorkOrderStatus(wo.id, newStatus);
  };

  const handleSaveClosureDetails = (e: React.FormEvent) => {
    e.preventDefault();
    updateWorkOrder({
      ...wo,
      rootCause: rootCause || wo.rootCause,
      actionTaken: actionTaken || wo.actionTaken,
      downtimeMinutes: Number(downtimeMinutes) || wo.downtimeMinutes,
    });
  };

  const handleConsumePart = () => {
    if (!selectedPartId || partQty <= 0) return;
    const success = consumePartInWorkOrder(wo.id, selectedPartId, partQty);
    if (success) {
      setPartQty(1);
    }
  };

  const statusProgression: { id: WorkOrderStatus; label: string }[] = [
    { id: 'REQUESTED', label: '1. قيد البلاغ' },
    { id: 'APPROVED', label: '2. معتمد' },
    { id: 'IN_PROGRESS', label: '3. قيد التنفيذ' },
    { id: 'PENDING_PARTS', label: '4. بانتظار قطع غيار' },
    { id: 'COMPLETED', label: '5. منجز' },
    { id: 'CLOSED', label: '6. مغلق ومؤرشف' },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm overflow-y-auto no-print">
      <div className="relative w-full max-w-2xl bg-[#1e293b] border border-[#334155] rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 my-6">
        {/* Header */}
        <div className="flex items-start justify-between px-6 py-4 border-b border-[#334155] bg-[#0f172a]">
          <div className="space-y-1">
            <div className="flex items-center gap-3">
              <span className="font-mono text-xl font-extrabold bg-blue-600 text-white px-2.5 py-0.5 rounded-lg shadow-md">
                {wo.id}
              </span>
              <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${
                wo.priority === 'CRITICAL_STOPPAGE'
                  ? 'bg-red-500/20 text-red-300 border border-red-500/40'
                  : 'bg-blue-500/20 text-blue-300 border border-blue-500/40'
              }`}>
                {wo.priority === 'CRITICAL_STOPPAGE' ? 'توقف خط إنتاج حرج' : wo.priority}
              </span>
            </div>
            <h2 className="text-base font-bold text-white pt-1">{wo.title}</h2>
            <div className="text-xs text-slate-400 flex items-center gap-2">
              <span className="text-blue-400 font-mono font-bold">[{wo.assetId}]</span>
              <span>{wo.assetName}</span>
              <span>•</span>
              <span className="text-slate-400">{wo.reportedAt}</span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => {
                const current = wo;
                setSelectedWOForDetail(null);
                setEditingWorkOrder(current);
              }}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-500/15 hover:bg-amber-500/25 text-amber-300 border border-amber-500/30 text-xs font-bold transition"
              title="تعديل وتصحيح تفاصيل أمر العمل"
            >
              <Edit3 className="w-3.5 h-3.5 text-amber-400" />
              <span>تعديل أمر العمل</span>
            </button>

            <button
              onClick={() => setSelectedWOForDetail(null)}
              className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-[#334155]/40 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Status Pipeline Buttons */}
        <div className="bg-[#0f172a]/90 p-3 border-b border-[#334155]">
          <div className="text-[11px] text-slate-400 mb-2 font-bold flex items-center justify-between">
            <span>مرحلة تقدم أمر العمل (Workflow Stage):</span>
            <span className="text-green-400 font-mono">
              {wo.status === 'COMPLETED' || wo.status === 'CLOSED'
                ? '✓ تم إنجاز العمل وإعادة تشغيل الأصل'
                : 'الأمر نشط'}
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-1.5">
            {statusProgression.map((stage) => {
              const isCurrent = wo.status === stage.id;
              return (
                <button
                  key={stage.id}
                  onClick={() => handleStatusChange(stage.id)}
                  className={`px-2 py-2 rounded-lg text-xs font-bold transition-all text-center leading-tight ${
                    isCurrent
                      ? 'bg-blue-600 text-white shadow-md font-black'
                      : 'bg-[#1e293b] hover:bg-[#334155] text-slate-300 border border-[#334155]'
                  }`}
                >
                  {stage.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Tab Controls */}
        <div className="flex border-b border-[#334155] bg-[#0f172a]/50 px-6">
          <button
            onClick={() => setActiveTab('details')}
            className={`py-3 px-4 text-xs font-bold border-b-2 transition-colors flex items-center gap-2 ${
              activeTab === 'details'
                ? 'border-blue-500 text-blue-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <FileText className="w-4 h-4" />
            <span>بيانات البلاغ والتكليف</span>
          </button>

          <button
            onClick={() => setActiveTab('parts')}
            className={`py-3 px-4 text-xs font-bold border-b-2 transition-colors flex items-center gap-2 ${
              activeTab === 'parts'
                ? 'border-blue-500 text-blue-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Package className="w-4 h-4" />
            <span>قطع الغيار المصروفة ({wo.consumedParts.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('closure')}
            className={`py-3 px-4 text-xs font-bold border-b-2 transition-colors flex items-center gap-2 ${
              activeTab === 'closure'
                ? 'border-blue-500 text-blue-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <CheckSquare className="w-4 h-4" />
            <span>الإغلاق والسبب الجذري والتوقف</span>
          </button>
        </div>

        {/* Tab Contents */}
        <div className="p-6 max-h-[60vh] overflow-y-auto space-y-4 text-xs">
          {activeTab === 'details' && (
            <div className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-slate-400 font-bold block">الوصف الفني للأعراض:</label>
                <div className="p-3.5 rounded-lg bg-[#0f172a] border border-[#334155] text-slate-200 leading-relaxed">
                  {wo.description}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="p-3.5 rounded-lg bg-[#0f172a] border border-[#334155] space-y-1">
                  <span className="text-slate-400 block text-[11px]">الفني المكلف:</span>
                  <span className="font-bold text-slate-200 block">{wo.assignedTo}</span>
                  <span className="text-blue-400 text-[10px] font-mono">تخصص: {wo.technicianSpecialty}</span>
                </div>

                {isDeveloper ? (
                  <div className="p-3.5 rounded-lg bg-purple-950/30 border border-purple-500/40 space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="text-purple-300 flex items-center gap-1 font-bold text-[11px]">
                        <Shield className="w-3.5 h-3.5 text-purple-400" />
                        <span>من رفع طلب الصيانة:</span>
                      </span>
                      <span className="text-[9px] bg-purple-500/30 text-purple-300 px-1.5 py-0.5 rounded font-bold">صلاحية مطور</span>
                    </div>
                    <span className="font-bold text-white block text-xs">{wo.reportedBy || 'غير محدد'}</span>
                    <span className="text-purple-300/80 text-[10px] font-mono">الاعتماد: {wo.approvedBy || 'مدير الصيانة'}</span>
                  </div>
                ) : (
                  <div className="p-3.5 rounded-lg bg-[#0f172a] border border-[#334155] space-y-1">
                    <span className="text-slate-400 block text-[11px]">الاعتماد الفني:</span>
                    <span className="font-bold text-slate-200 block">{wo.approvedBy || 'مدير الصيانة'}</span>
                    <span className="text-slate-500 text-[10px] block">بيانات رافع الطلب حصرية لصلاحيات المطور</span>
                  </div>
                )}
              </div>

              <div className="p-3.5 rounded-lg bg-[#0f172a] border border-[#334155] flex items-center justify-between">
                <div>
                  <span className="text-slate-400 block text-[11px]">زمن التوقف المسجل:</span>
                  <span className="text-base font-black text-red-400 font-mono">
                    {wo.downtimeMinutes} دقيقة
                  </span>
                </div>
                <div className="text-right">
                  <span className="text-slate-400 block text-[11px]">تاريخ ووقت الإنجاز:</span>
                  <span className="font-mono text-green-400 font-bold">
                    {wo.completedAt || 'قيد المتابعة والتنفيذ'}
                  </span>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'parts' && (
            <div className="space-y-4">
              {/* Add Part to WO with real-time deduction */}
              <div className="p-4 rounded-xl bg-[#0f172a] border border-[#334155] space-y-3">
                <div className="font-bold text-slate-200 flex items-center gap-2">
                  <Package className="w-4 h-4 text-blue-400" />
                  <span>صرف قطع غيار مباشرة من المستودع لأمر العمل</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div className="sm:col-span-2">
                    <select
                      value={selectedPartId}
                      onChange={(e) => setSelectedPartId(e.target.value)}
                      className="w-full bg-[#1e293b] border border-[#334155] rounded-lg px-3 py-2 text-slate-100 text-xs focus:outline-none focus:border-blue-500"
                    >
                      <option value="">-- اختر قطعة الغيار المتوافقة --</option>
                      {spareParts.map((part) => (
                        <option key={part.id} value={part.id}>
                          {part.name} (المتوفر: {part.quantity} {part.unit} • رف: {part.binLocation})
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="flex items-center gap-2">
                    <input
                      type="number"
                      min="1"
                      value={partQty}
                      onChange={(e) => setPartQty(Math.max(1, parseInt(e.target.value) || 1))}
                      className="w-20 bg-[#1e293b] border border-[#334155] rounded-lg px-2 py-2 text-slate-100 text-center font-mono text-xs focus:outline-none focus:border-blue-500"
                    />
                    <button
                      type="button"
                      onClick={handleConsumePart}
                      disabled={!selectedPartId}
                      className="flex-1 bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white font-bold px-3 py-2 rounded-lg text-xs transition-colors"
                    >
                      صرف وخصم
                    </button>
                  </div>
                </div>
              </div>

              {/* Consumed Parts Table */}
              <div className="space-y-2">
                <h4 className="font-bold text-slate-300">القطع المصروفة في هذا الأمر:</h4>
                {wo.consumedParts.length === 0 ? (
                  <div className="p-4 text-center rounded-lg bg-[#0f172a] border border-[#334155] text-slate-500">
                    لم يتم استهلاك قطع غيار مسجلة في هذا الأمر حتى الآن
                  </div>
                ) : (
                  <div className="overflow-x-auto border border-[#334155] rounded-lg">
                    <table className="w-full text-right text-xs">
                      <thead className="bg-[#0f172a] text-slate-400 border-b border-[#334155]">
                        <tr>
                          <th className="p-2.5">رقم القطعة</th>
                          <th className="p-2.5">اسم الصنف</th>
                          <th className="p-2.5 text-center">الكمية</th>
                          <th className="p-2.5">سعر الوحدة</th>
                          <th className="p-2.5">الإجمالي</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-[#334155] bg-[#1e293b]">
                        {wo.consumedParts.map((cp, idx) => (
                          <tr key={idx}>
                            <td className="p-2.5 font-mono text-slate-400">{cp.partNumber}</td>
                            <td className="p-2.5 text-slate-200 font-semibold">{cp.partName}</td>
                            <td className="p-2.5 text-center font-mono font-bold text-blue-400">{cp.quantity}</td>
                            <td className="p-2.5 font-mono">${cp.unitCost}</td>
                            <td className="p-2.5 font-mono font-bold text-green-400">
                              ${cp.quantity * cp.unitCost}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </div>
          )}

          {activeTab === 'closure' && (
            <form onSubmit={handleSaveClosureDetails} className="space-y-4">
              <div className="space-y-1.5">
                <label className="font-bold text-slate-300 block">
                  السبب الجذري للعطل (Root Cause Analysis - RCA)
                </label>
                <textarea
                  value={rootCause || wo.rootCause || ''}
                  onChange={(e) => setRootCause(e.target.value)}
                  placeholder="مثال: تآكل حافة شفرة الدكتور بليد نتيجة انتهاء العمر الافتراضي أو ارتفاع حرارة الحبر..."
                  rows={2}
                  className="w-full bg-[#0f172a] border border-[#334155] rounded-lg px-3 py-2 text-slate-100 focus:outline-none focus:border-blue-500"
                />
              </div>

              <div className="space-y-1.5">
                <label className="font-bold text-slate-300 block">
                  الإجراء التصحيحي المتخذ (Corrective Action Taken)
                </label>
                <textarea
                  value={actionTaken || wo.actionTaken || ''}
                  onChange={(e) => setActionTaken(e.target.value)}
                  placeholder="مثال: استبدال الشفرة الكربونية، ضبط ضغط النيوماتيك لغرفة الحبر، وتنظيف أنيلوكس سيراميكي..."
                  rows={2}
                  className="w-full bg-[#0f172a] border border-[#334155] rounded-lg px-3 py-2 text-slate-100 focus:outline-none focus:border-blue-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="font-bold text-slate-300 block">زمن التوقف الفعلي (دقيقة)</label>
                  <input
                    type="number"
                    min="0"
                    step="5"
                    value={downtimeMinutes || wo.downtimeMinutes || 0}
                    onChange={(e) => setDowntimeMinutes(parseInt(e.target.value) || 0)}
                    className="w-full bg-[#0f172a] border border-[#334155] rounded-lg px-3 py-2 text-slate-100 font-mono focus:outline-none focus:border-blue-500"
                  />
                </div>

                <div className="flex items-end">
                  <button
                    type="submit"
                    className="w-full bg-[#0f172a] hover:bg-[#334155] text-slate-200 font-bold py-2 px-4 rounded-lg border border-[#334155] transition-colors"
                  >
                    حفظ التعديلات
                  </button>
                </div>
              </div>

              {/* Complete & Restore Machine Banner */}
              <div className="p-4 rounded-xl bg-green-500/10 border border-green-500/30 flex items-center justify-between">
                <div>
                  <div className="font-bold text-green-400 text-sm">
                    إنجاز أمر العمل وإعادة تشغيل الماكينة
                  </div>
                  <div className="text-[11px] text-slate-400">
                    عند إتمام الأمر، ستعود الماكينة تلقائياً إلى حالة التشغيل الطبيعي (OPERATIONAL)
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => handleStatusChange('COMPLETED')}
                  className="bg-green-600 hover:bg-green-500 text-white font-bold px-4 py-2 rounded-lg text-xs shadow-lg shadow-green-600/30 transition-all active:scale-95"
                >
                  إنجاز أمر العمل الآن
                </button>
              </div>
            </form>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between px-6 py-4 border-t border-[#334155] bg-[#0f172a]">
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => {
                const current = wo;
                setSelectedWOForDetail(null);
                setEditingWorkOrder(current);
              }}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/30 text-xs font-bold transition"
            >
              <Edit3 className="w-4 h-4 text-amber-400" />
              <span>تعديل وتصحيح تفاصيل أمر العمل</span>
            </button>

            <button
              type="button"
              onClick={() => {
                requestDeleteConfirmation({
                  title: 'حذف أمر العمل',
                  message: `هل أنت متأكد من رغبتك في حذف أمر العمل [${wo.id}] (${wo.title}) نهائياً؟`,
                  itemDetails: `${wo.id} - ${wo.assetName}`,
                  confirmLabel: 'حذف أمر العمل',
                  onConfirm: () => {
                    deleteWorkOrder(wo.id);
                    setSelectedWOForDetail(null);
                  },
                });
              }}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-red-500/15 hover:bg-red-500/25 text-red-400 hover:text-red-300 border border-red-500/30 text-xs font-bold transition active:scale-95"
              title="حذف هذا الأمر نهائياً"
            >
              <Trash2 className="w-4 h-4" />
              <span>حذف الأمر</span>
            </button>
          </div>

          <button
            onClick={() => setSelectedWOForDetail(null)}
            className="px-4 py-2 rounded-lg bg-[#1e293b] hover:bg-[#334155] text-slate-200 text-xs font-bold border border-[#334155] transition-colors"
          >
            إغلاق
          </button>
        </div>
      </div>
    </div>
  );
};
