import React from 'react';
import { 
  FileText, 
  Printer, 
  X, 
  CheckCircle2, 
  AlertTriangle, 
  AlertOctagon, 
  Clock, 
  Users, 
  MapPin, 
  CheckSquare, 
  Thermometer, 
  Gauge, 
  Wrench, 
  Package, 
  ShieldCheck, 
  Award, 
  Database,
  Calendar,
  Layers,
  Sparkles
} from 'lucide-react';
import { ShiftLog } from '../../types';

interface PatrolDetailModalProps {
  shiftLog: ShiftLog | null;
  isOpen: boolean;
  onClose: () => void;
  onSelectForActive?: (log: ShiftLog) => void;
}

export const PatrolDetailModal: React.FC<PatrolDetailModalProps> = ({
  shiftLog,
  isOpen,
  onClose,
  onSelectForActive,
}) => {
  if (!isOpen || !shiftLog) return null;

  const leadEng = 
    shiftLog.responsibleEngineers?.leadEngineer || 
    shiftLog.shiftEngineer || 
    shiftLog.supervisorName || 
    'م. حسام التميمي';

  const nextEng = 
    shiftLog.responsibleEngineers?.handoverEngineer || 
    shiftLog.receivedBy?.name || 
    'م. كريم السعدي';

  const safetyOff = 
    shiftLog.responsibleEngineers?.safetyOfficer || 
    'م. رافد الشمري';

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/85 backdrop-blur-md overflow-y-auto font-sans text-right animate-in fade-in">
      <div className="bg-[#1e293b] border border-[#334155] rounded-2xl w-full max-w-5xl max-h-[92vh] flex flex-col shadow-2xl overflow-hidden text-slate-100">
        {/* Modal Header */}
        <div className="p-4 sm:p-5 bg-[#0f172a] border-b border-[#334155] flex flex-wrap items-center justify-between gap-3 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-600/20 border border-blue-500/40 flex items-center justify-center text-blue-400">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base sm:text-lg font-black text-white">
                  سجل وقائع وتفاصيل الدورية الكاملة [{shiftLog.id}]
                </h3>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-blue-500/20 text-blue-300 border border-blue-500/30 flex items-center gap-1">
                  <Database className="w-3 h-3 text-cyan-400" />
                  <span>سجل قاعدة بيانات معتمد</span>
                </span>
              </div>
              <p className="text-xs text-slate-400">
                {shiftLog.date} • {shiftLog.shiftName} ({shiftLog.shiftHours || '07:00 - 15:00'}) • معمل المرجان للمطبوعات
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-700 hover:bg-slate-600 text-white text-xs font-bold transition-all"
            >
              <Printer className="w-3.5 h-3.5 text-cyan-400" />
              <span>طباعة السجل</span>
            </button>

            {onSelectForActive && (
              <button
                onClick={() => {
                  onSelectForActive(shiftLog);
                  onClose();
                }}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold shadow-md shadow-blue-600/20 transition-all"
              >
                <span>تعيين كدورية نشطة</span>
              </button>
            )}

            <button
              onClick={onClose}
              className="p-1.5 rounded-xl bg-[#1e293b] hover:bg-slate-700 text-slate-400 hover:text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Scrollable Body */}
        <div className="flex-1 overflow-y-auto p-5 sm:p-7 space-y-6">
          {/* Section 1: Overview & Status Banner */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="p-3.5 rounded-xl bg-[#0f172a] border border-[#334155]">
              <span className="text-[11px] text-slate-400 block font-bold">تاريخ وساعات الدورية</span>
              <div className="font-bold text-white text-sm mt-1">{shiftLog.date}</div>
              <div className="text-[10px] text-slate-500 font-mono">{shiftLog.shiftHours || '07:00 - 15:00'}</div>
            </div>

            <div className="p-3.5 rounded-xl bg-[#0f172a] border border-[#334155]">
              <span className="text-[11px] text-slate-400 block font-bold">حالة اعتماد المحضر</span>
              <div className="mt-1">
                {shiftLog.status === 'APPROVED' ? (
                  <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 inline-flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3" />
                    <span>معتمد ومختوم رسمياً</span>
                  </span>
                ) : (
                  <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/40 inline-flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    <span>قيد الإنجاز والتسليم</span>
                  </span>
                )}
              </div>
            </div>

            <div className="p-3.5 rounded-xl bg-[#0f172a] border border-[#334155]">
              <span className="text-[11px] text-slate-400 block font-bold">إجمالي دقائق التوقف</span>
              <div className="font-mono font-black text-amber-400 text-lg mt-0.5">
                {shiftLog.totalStoppageMinutes ?? 0} دقيقة
              </div>
              <span className="text-[10px] text-slate-500">توقفات أعطال مسجلة</span>
            </div>

            <div className="p-3.5 rounded-xl bg-[#0f172a] border border-[#334155]">
              <span className="text-[11px] text-slate-400 block font-bold">تغطية المسار الميداني</span>
              <div className="font-mono font-black text-cyan-400 text-lg mt-0.5">
                {shiftLog.patrolCoveragePercent ?? 100}%
              </div>
              <span className="text-[10px] text-slate-500">تم التفتيش الميداني</span>
            </div>
          </div>

          {/* Section 2: Responsible Engineers Audit */}
          <div className="p-4 rounded-xl bg-gradient-to-r from-blue-950/30 via-[#0f172a] to-[#0f172a] border border-blue-500/30 space-y-2">
            <div className="flex items-center justify-between border-b border-[#334155] pb-2">
              <div className="flex items-center gap-2 text-xs font-bold text-white">
                <Users className="w-4 h-4 text-blue-400" />
                <span>الطاقم الهندسي والإشرافي المعتمد للدورية:</span>
              </div>
              {shiftLog.responsibleEngineers?.assignedByDeveloper && (
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-purple-500/20 text-purple-300 border border-purple-500/30">
                  معتمد بصلاحية المطور: {shiftLog.responsibleEngineers.lastModifiedBy || 'م. علي رضا'}
                </span>
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs pt-1">
              <div>
                <span className="text-slate-400 block text-[11px]">مهندس الدورية المسؤول:</span>
                <span className="font-bold text-white text-sm">{leadEng}</span>
              </div>
              <div>
                <span className="text-slate-400 block text-[11px]">مهندس الاستلام القادم:</span>
                <span className="font-bold text-slate-200 text-sm">{nextEng}</span>
              </div>
              <div>
                <span className="text-slate-400 block text-[11px]">مسؤول السلامة والأمن الصناعي:</span>
                <span className="font-bold text-slate-300 text-sm">{safetyOff}</span>
              </div>
            </div>
          </div>

          {/* Section 3: Patrol Route & Detailed Checklist */}
          <div className="p-5 rounded-2xl bg-[#0f172a] border border-[#334155] space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[#334155] pb-2.5">
              <h4 className="text-xs font-bold text-white flex items-center gap-2">
                <CheckSquare className="w-4 h-4 text-cyan-400" />
                <span>سجل الفحص الميداني والبنود التفتيشية للدورية ({shiftLog.patrolChecklist?.length || 0})</span>
              </h4>
              <span className="text-[11px] text-cyan-400 font-mono">
                المسار: {(shiftLog.patrolRoute || []).join(' ← ') || 'كافة القاعات'}
              </span>
            </div>

            <div className="space-y-2.5">
              {(shiftLog.patrolChecklist && shiftLog.patrolChecklist.length > 0) ? (
                shiftLog.patrolChecklist.map((item) => (
                  <div
                    key={item.id}
                    className="p-3 rounded-xl bg-[#1e293b] border border-[#334155] flex flex-wrap items-start justify-between gap-3 text-xs"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-blue-400 font-bold bg-blue-950/50 px-2 py-0.5 rounded text-[10px] border border-blue-800/40">
                          {item.id}
                        </span>
                        <span className="font-bold text-white">{item.title}</span>
                      </div>
                      <div className="text-slate-400 text-[11px]">
                        <strong>القاعة/المنطقة:</strong> {item.area}
                        {item.notes && <span className="mr-2 text-slate-300"> • <strong>الملاحظات:</strong> {item.notes}</span>}
                        {item.method && <span className="mr-2 text-slate-400 font-mono"> • [{item.method}]</span>}
                      </div>
                    </div>

                    <div>
                      {item.status === 'PASSED' && (
                        <span className="px-2.5 py-1 rounded text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 flex items-center gap-1">
                          <CheckCircle2 className="w-3 h-3" />
                          <span>مطابق وسليم</span>
                        </span>
                      )}
                      {item.status === 'WARNING' && (
                        <span className="px-2.5 py-1 rounded text-[10px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/40 flex items-center gap-1">
                          <AlertTriangle className="w-3 h-3" />
                          <span>تنبيه ومتابعة</span>
                        </span>
                      )}
                      {item.status === 'FAILED' && (
                        <span className="px-2.5 py-1 rounded text-[10px] font-bold bg-red-500/20 text-red-300 border border-red-500/40 flex items-center gap-1">
                          <AlertOctagon className="w-3 h-3" />
                          <span>عطل مسجل</span>
                        </span>
                      )}
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-4 text-slate-500 text-xs">
                  لا توجد بنود فحص مخصصة مسجلة لهذه الدورية.
                </div>
              )}
            </div>
          </div>

          {/* Section 4: Environmental & Linked Meter Readings */}
          <div className="p-5 rounded-2xl bg-[#0f172a] border border-[#334155] space-y-4">
            <h4 className="text-xs font-bold text-emerald-400 flex items-center gap-2 border-b border-[#334155] pb-2.5">
              <Thermometer className="w-4 h-4" />
              <span>الظروف البيئية وقراءات أجهزة القياس والعدادات المركزية المسجلة</span>
            </h4>

            {/* Standard Ambient Readings */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs font-mono">
              <div className="p-3 rounded-xl bg-[#1e293b] border border-[#334155]">
                <span className="text-slate-400 block text-[10px] font-sans">الحرارة المحيطة</span>
                <span className="text-emerald-400 font-bold text-lg">
                  {shiftLog.environmentalConditions?.ambientTempC ?? 24.5} °C
                </span>
              </div>
              <div className="p-3 rounded-xl bg-[#1e293b] border border-[#334155]">
                <span className="text-slate-400 block text-[10px] font-sans">الرطوبة النسبية</span>
                <span className="text-cyan-400 font-bold text-lg">
                  {shiftLog.environmentalConditions?.humidityPercent ?? 48} %
                </span>
              </div>
              <div className="p-3 rounded-xl bg-[#1e293b] border border-[#334155]">
                <span className="text-slate-400 block text-[10px] font-sans">أبخرة المذيبات</span>
                <span className="text-amber-400 font-bold text-lg">
                  {shiftLog.environmentalConditions?.solventVaporPpm ?? 12} PPM
                </span>
              </div>
              <div className="p-3 rounded-xl bg-[#1e293b] border border-[#334155]">
                <span className="text-slate-400 block text-[10px] font-sans">مستوى الضجيج</span>
                <span className="text-blue-400 font-bold text-lg">
                  {shiftLog.environmentalConditions?.noiseLevelDb ?? 78} dB
                </span>
              </div>
            </div>

            {/* Linked Meter Readings from Plant Devices */}
            {shiftLog.linkedMeterReadings && shiftLog.linkedMeterReadings.length > 0 && (
              <div className="space-y-2 pt-2 border-t border-[#334155]">
                <span className="text-xs font-bold text-cyan-400 block">
                  القراءات المرتبطة بأجهزة القياس والعدادات اللحظية:
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5">
                  {shiftLog.linkedMeterReadings.map((reading, idx) => (
                    <div
                      key={idx}
                      className="p-2.5 rounded-xl bg-[#1e293b] border border-cyan-500/30 text-xs space-y-1"
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-white">{reading.parameterName}</span>
                        <span className="font-mono font-bold text-cyan-300">
                          {reading.value} {reading.unit}
                        </span>
                      </div>
                      <div className="text-[10px] text-slate-400">
                        الجهاز: <span className="text-slate-300">[{reading.deviceId}] {reading.deviceName}</span>
                      </div>
                      {reading.notes && (
                        <div className="text-[10px] text-slate-400">
                          الملاحظة: {reading.notes}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Section 5: Work Orders & Actions Taken */}
          <div className="p-5 rounded-2xl bg-[#0f172a] border border-[#334155] space-y-3">
            <h4 className="text-xs font-bold text-amber-400 flex items-center gap-2 border-b border-[#334155] pb-2">
              <Wrench className="w-4 h-4" />
              <span>الأعطال وأوامر العمل المنفذة أثناء هذه الدورية</span>
            </h4>

            {shiftLog.workOrdersHandled && shiftLog.workOrdersHandled.length > 0 ? (
              <div className="overflow-x-auto rounded-xl border border-[#334155]">
                <table className="w-full text-right text-xs">
                  <thead className="bg-[#1e293b] text-slate-400 font-bold border-b border-[#334155]">
                    <tr>
                      <th className="p-2.5">رقم الأمر</th>
                      <th className="p-2.5">الماكينة</th>
                      <th className="p-2.5">وصف العطل والإجراء</th>
                      <th className="p-2.5">الفني</th>
                      <th className="p-2.5 text-center">التوقف (د)</th>
                      <th className="p-2.5 text-center">الحالة</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#334155] bg-[#1e293b]/40">
                    {shiftLog.workOrdersHandled.map((wo, idx) => (
                      <tr key={idx}>
                        <td className="p-2.5 font-mono text-blue-400 font-bold">{wo.woNumber || wo.woId}</td>
                        <td className="p-2.5 font-bold text-white">{wo.assetName}</td>
                        <td className="p-2.5 text-slate-300">
                          {wo.title}
                          {wo.actionTaken && <div className="text-[10px] text-slate-400">الإجراء: {wo.actionTaken}</div>}
                        </td>
                        <td className="p-2.5 text-slate-300">{wo.assignedTechnician}</td>
                        <td className="p-2.5 text-center font-mono text-amber-400 font-bold">{wo.timeSpentMinutes || 0}</td>
                        <td className="p-2.5 text-center">
                          <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
                            {wo.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="text-center py-3 text-slate-500 text-xs">
                لم تسجل أوامر عمل كبرى خلال هذه الدورية.
              </div>
            )}
          </div>

          {/* Section 6: Handover Notes & Signatures */}
          <div className="p-5 rounded-2xl bg-[#0f172a] border border-[#334155] space-y-4">
            <h4 className="text-xs font-bold text-white flex items-center gap-2 border-b border-[#334155] pb-2">
              <Award className="w-4 h-4 text-amber-400" />
              <span>ملاحظات التسليم والمصادقة الرسمية</span>
            </h4>

            <div className="p-3.5 rounded-xl bg-[#1e293b] border border-[#334155] text-xs text-slate-200 leading-relaxed space-y-1.5">
              <div><strong>توجيهات الاستلام والتسليم:</strong> {shiftLog.handoverNotes || 'تم التسليم بحالة تشغيلية منتظمة دون حوادث.'}</div>
              {shiftLog.pendingForNextShift && (
                <div className="text-blue-300">
                  <strong>المهام المعلقة للنوبة القادمة:</strong> {shiftLog.pendingForNextShift}
                </div>
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2 text-center text-xs">
              <div className="p-3 rounded-xl bg-[#1e293b] border border-[#334155]">
                <span className="text-slate-400 block text-[11px]">مهندس التسليم</span>
                <span className="font-bold text-white block mt-1">{leadEng}</span>
                <span className="text-emerald-400 text-[10px] font-mono mt-0.5 block">
                  {shiftLog.handedOverBy?.signed ? '✓ تم التوقيع الإلكتروني' : 'بانتظار التوقيع'}
                </span>
              </div>

              <div className="p-3 rounded-xl bg-[#1e293b] border border-[#334155]">
                <span className="text-slate-400 block text-[11px]">مهندس الاستلام</span>
                <span className="font-bold text-white block mt-1">{nextEng}</span>
                <span className="text-emerald-400 text-[10px] font-mono mt-0.5 block">
                  {shiftLog.receivedBy?.signed ? '✓ تم التوقيع الإلكتروني' : 'بانتظار الاستلام'}
                </span>
              </div>

              <div className="p-3 rounded-xl bg-[#1e293b] border border-blue-500/40">
                <span className="text-blue-300 block text-[11px]">مصادقة مدير إدارة الصيانة</span>
                <span className="font-bold text-white block mt-1">م. علي رضا</span>
                <span className="text-emerald-400 text-[10px] font-mono mt-0.5 block">
                  {shiftLog.approvedByManager?.signed ? '✓ مصادق ومعتمد بالختم' : 'بانتظار الاعتماد'}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="p-4 bg-[#0f172a] border-t border-[#334155] flex items-center justify-between shrink-0 text-xs">
          <div className="text-slate-400 font-mono text-[11px]">
            DATABASE RECORD ID: <span className="text-white font-bold">{shiftLog.id}</span> • SYNC: LOCAL_PERSISTENT
          </div>
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-[#334155] hover:bg-slate-600 text-white font-bold transition-colors"
          >
            إغلاق السجل
          </button>
        </div>
      </div>
    </div>
  );
};
