import React, { useState } from 'react';
import { 
  X, 
  CheckCircle2, 
  AlertTriangle, 
  ShieldAlert, 
  Clock, 
  User, 
  Wrench, 
  FileText,
  AlertOctagon,
  CalendarCheck
} from 'lucide-react';
import { useCMMS } from '../../context/CMMSContext';
import { PreventiveMaintenancePlan } from '../../types';

export const ExecutePMModal: React.FC = () => {
  const { 
    selectedPMPlanForExecution, 
    setSelectedPMPlanForExecution, 
    executePMPlan, 
    createWorkOrder 
  } = useCMMS();

  const plan = selectedPMPlanForExecution;

  const [completedBy, setCompletedBy] = useState(plan?.assignedTechnician || 'م. علي رضا');
  const [actualDuration, setActualDuration] = useState(plan?.estimatedDurationMinutes || 45);
  const [result, setResult] = useState<'PASSED' | 'FAILED'>('PASSED');
  const [notes, setNotes] = useState('');
  const [checkedSteps, setCheckedSteps] = useState<Record<string, boolean>>({});
  const [createCorrectiveWO, setCreateCorrectiveWO] = useState(false);

  if (!plan) return null;

  const handleToggleStep = (stepId: string) => {
    setCheckedSteps((prev) => ({
      ...prev,
      [stepId]: !prev[stepId],
    }));
  };

  const handleExecute = (e: React.FormEvent) => {
    e.preventDefault();

    // Check if at least one step was checked
    const totalSteps = plan.steps.length;
    const checkedCount = Object.values(checkedSteps).filter(Boolean).length;

    if (totalSteps > 0 && checkedCount < totalSteps && result === 'PASSED') {
      const confirmIncomplete = window.confirm(
        `تنبيه: تم فحص (${checkedCount} من ${totalSteps}) خطوة فقط. هل أنت متأكد من تسجيل نتيجة الفحص كمطابقة؟`
      );
      if (!confirmIncomplete) return;
    }

    // Call execution
    executePMPlan(plan.id, {
      passed: result === 'PASSED',
      completedBy: completedBy.trim() || 'فني الصيانة',
      durationMinutes: Number(actualDuration) || 45,
      notes: notes.trim() || (result === 'PASSED' ? 'تم إجراء الفحص الوقائي بنجاح وكافة البنود مطابقة.' : 'تم رصد ملاحظات تستدعي تدخلاً إصلاحياً.'),
      createWorkOrderOnFail: result === 'FAILED' || createCorrectiveWO,
    });

    setSelectedPMPlanForExecution(null);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm overflow-y-auto no-print">
      <div 
        className="bg-[#1e293b] border border-[#334155] rounded-xl w-full max-w-2xl overflow-hidden shadow-2xl my-8 text-right font-sans"
        dir="rtl"
      >
        {/* Header */}
        <div className="px-6 py-4 bg-[#0f172a] border-b border-[#334155] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-emerald-600/20 text-emerald-400 border border-emerald-500/30 flex items-center justify-center">
              <CalendarCheck className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-bold text-white">
                تنفيذ وتوثيق الصيانة الوقائية [{plan.id}]
              </h2>
              <p className="text-xs text-slate-400">
                {plan.title} — {plan.assetName}
              </p>
            </div>
          </div>
          <button
            onClick={() => setSelectedPMPlanForExecution(null)}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-[#334155] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <form onSubmit={handleExecute} className="p-6 space-y-5 max-h-[80vh] overflow-y-auto">
          {/* Plan Info Banner */}
          <div className="p-3 bg-[#0f172a] rounded-lg border border-[#334155] flex flex-wrap items-center justify-between gap-3 text-xs">
            <div>
              <span className="text-slate-400">الماكينة:</span>{' '}
              <strong className="text-white">{plan.assetName}</strong>
            </div>
            <div>
              <span className="text-slate-400">الدورية:</span>{' '}
              <span className="font-mono text-blue-400 font-bold">{plan.frequency}</span>
            </div>
            <div>
              <span className="text-slate-400">تاريخ الاستحقاق:</span>{' '}
              <span className="font-mono text-amber-400">{plan.nextDueDate}</span>
            </div>
          </div>

          {/* Safety Checklist Warning */}
          {plan.safetyRequirements && plan.safetyRequirements.length > 0 && (
            <div className="p-3 bg-amber-950/20 border border-amber-500/30 rounded-lg text-xs space-y-1.5">
              <span className="font-bold text-amber-300 flex items-center gap-1.5">
                <ShieldAlert className="w-4 h-4 text-amber-400" />
                شروط السلامة المهنية الإلزامية قبل البدء:
              </span>
              <ul className="list-disc list-inside text-slate-300 space-y-0.5 pr-2">
                {plan.safetyRequirements.map((req, idx) => (
                  <li key={idx}>{req}</li>
                ))}
              </ul>
            </div>
          )}

          {/* Operational Steps Checklist */}
          <div className="border border-[#334155] rounded-xl p-4 bg-[#0f172a]/50 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-white flex items-center gap-1.5">
                <Wrench className="w-4 h-4 text-blue-400" />
                قائمة خطوات الفحص التشغيلية (Checklist)
              </span>
              <span className="text-[11px] text-slate-400">
                حدد البنود التي تم فحصها والتأكد منها
              </span>
            </div>

            <div className="space-y-2 pt-1">
              {plan.steps.map((step) => {
                const isChecked = !!checkedSteps[step.id];
                return (
                  <label
                    key={step.id}
                    className={`p-2.5 rounded-lg border flex items-center gap-3 cursor-pointer transition-all ${
                      isChecked
                        ? 'bg-emerald-950/20 border-emerald-500/40 text-emerald-200'
                        : 'bg-[#1e293b] border-[#334155] text-slate-300 hover:border-slate-500'
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={isChecked}
                      onChange={() => handleToggleStep(step.id)}
                      className="w-4 h-4 rounded text-blue-600 focus:ring-0 focus:outline-none"
                    />
                    <span className="text-xs flex-1">{step.description}</span>
                    {isChecked && (
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                    )}
                  </label>
                );
              })}
            </div>
          </div>

          {/* Execution Details & Result */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                الفني القائم بالفحص *
              </label>
              <input
                type="text"
                required
                value={completedBy}
                onChange={(e) => setCompletedBy(e.target.value)}
                placeholder="اسم الفني"
                className="w-full bg-[#0f172a] border border-[#334155] rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                الوقت الفعلي المستغرق (بالدقائق) *
              </label>
              <input
                type="number"
                min={5}
                required
                value={actualDuration}
                onChange={(e) => setActualDuration(parseInt(e.target.value) || 30)}
                className="w-full bg-[#0f172a] border border-[#334155] rounded-lg px-3 py-2 text-sm text-white font-mono focus:outline-none focus:border-blue-500"
              />
            </div>

            {/* Evaluation Result */}
            <div className="sm:col-span-2">
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                النتيجة التقييمية للفحص الوقائي *
              </label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => {
                    setResult('PASSED');
                    setCreateCorrectiveWO(false);
                  }}
                  className={`p-3 rounded-lg border text-right transition-all flex items-center justify-between ${
                    result === 'PASSED'
                      ? 'bg-emerald-600/20 border-emerald-500 text-emerald-300 shadow-sm'
                      : 'bg-[#0f172a] border-[#334155] text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <div>
                    <span className="text-xs font-bold block">مطابق وسليم (PASSED)</span>
                    <span className="text-[10px] text-slate-400">الماكينة تعمل بحالة ممتازة</span>
                  </div>
                  <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setResult('FAILED');
                    setCreateCorrectiveWO(true);
                  }}
                  className={`p-3 rounded-lg border text-right transition-all flex items-center justify-between ${
                    result === 'FAILED'
                      ? 'bg-red-600/20 border-red-500 text-red-300 shadow-sm'
                      : 'bg-[#0f172a] border-[#334155] text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <div>
                    <span className="text-xs font-bold block">غير مطابق / ملاحظات (FAILED)</span>
                    <span className="text-[10px] text-slate-400">يوجد خلل أو تآكل يستوجب إصلاحاً</span>
                  </div>
                  <AlertOctagon className="w-5 h-5 text-red-400" />
                </button>
              </div>
            </div>

            {/* Auto Work Order Option */}
            <div className="sm:col-span-2 bg-[#0f172a] p-3 rounded-lg border border-[#334155] flex items-center justify-between">
              <div>
                <span className="text-xs font-bold text-white block">
                  إصدار أمر عمل إصلاحي فوري تلقائياً
                </span>
                <span className="text-[11px] text-slate-400">
                  توليد تذكرة صيانة إصلاحية وتكليف الفني بها بناءً على نتائج هذا الفحص
                </span>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={createCorrectiveWO}
                  onChange={(e) => setCreateCorrectiveWO(e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-slate-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
              </label>
            </div>
          </div>

          {/* Notes */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">
              ملاحظات الفني وتقرير الإنجاز
            </label>
            <textarea
              rows={3}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="اكتب أية ملاحظات تم رصدها، خلوصات، مستويات زيت، أجزاء تم استبدالها..."
              className="w-full bg-[#0f172a] border border-[#334155] rounded-lg px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
            />
          </div>

          {/* Footer */}
          <div className="pt-4 border-t border-[#334155] flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={() => setSelectedPMPlanForExecution(null)}
              className="px-4 py-2 bg-[#334155] hover:bg-[#475569] text-white text-xs font-semibold rounded-lg transition-colors"
            >
              إلغاء
            </button>
            <button
              type="submit"
              className={`px-5 py-2 text-white text-xs font-semibold rounded-lg flex items-center gap-1.5 shadow-md transition-all ${
                result === 'PASSED'
                  ? 'bg-emerald-600 hover:bg-emerald-500 shadow-emerald-600/30'
                  : 'bg-red-600 hover:bg-red-500 shadow-red-600/30'
              }`}
            >
              <CheckCircle2 className="w-4 h-4" />
              تأكيد وإتمام توثيق الفحص وتحديث الموعد القادم
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
