import React, { useState, useEffect } from 'react';
import { 
  X, 
  Gauge, 
  CheckCircle2, 
  AlertTriangle, 
  AlertOctagon, 
  Save, 
  Clock, 
  User, 
  Sliders 
} from 'lucide-react';
import { useCMMS } from '../../context/CMMSContext';
import { MeterDevice } from '../../types';

export const LogDeviceReadingModal: React.FC = () => {
  const { 
    selectedDeviceForReading, 
    setSelectedDeviceForReading, 
    meterDevices, 
    logDeviceReading 
  } = useCMMS();

  const [selectedDeviceId, setSelectedDeviceId] = useState<string>('');
  const [shift, setShift] = useState<'صباحي (07:00 - 15:00)' | 'مسائي (15:00 - 23:00)' | 'ليلي (23:00 - 07:00)'>('صباحي (07:00 - 15:00)');
  const [loggedBy, setLoggedBy] = useState('فني وردية المرافق والخدمات');
  const [values, setValues] = useState<Record<string, number>>({});
  const [notes, setNotes] = useState('');

  const currentDevice = meterDevices.find((d) => d.id === selectedDeviceId) || selectedDeviceForReading;

  useEffect(() => {
    if (selectedDeviceForReading) {
      setSelectedDeviceId(selectedDeviceForReading.id);
      // Initialize with default or last reading values
      const initVals: Record<string, number> = {};
      selectedDeviceForReading.parameters.forEach((p) => {
        if (selectedDeviceForReading.lastReadingValues && selectedDeviceForReading.lastReadingValues[p.id] !== undefined) {
          initVals[p.id] = selectedDeviceForReading.lastReadingValues[p.id];
        } else if (p.defaultValue !== undefined) {
          initVals[p.id] = p.defaultValue;
        } else if (p.targetValue !== undefined) {
          initVals[p.id] = p.targetValue;
        } else {
          initVals[p.id] = 0;
        }
      });
      setValues(initVals);
    }
  }, [selectedDeviceForReading]);

  useEffect(() => {
    // Detect shift from current hour
    const hour = new Date().getHours();
    if (hour >= 7 && hour < 15) {
      setShift('صباحي (07:00 - 15:00)');
    } else if (hour >= 15 && hour < 23) {
      setShift('مسائي (15:00 - 23:00)');
    } else {
      setShift('ليلي (23:00 - 07:00)');
    }
  }, []);

  if (!selectedDeviceForReading && !selectedDeviceId) return null;

  const handleDeviceChange = (deviceId: string) => {
    setSelectedDeviceId(deviceId);
    const dev = meterDevices.find((d) => d.id === deviceId);
    if (dev) {
      const initVals: Record<string, number> = {};
      dev.parameters.forEach((p) => {
        if (dev.lastReadingValues && dev.lastReadingValues[p.id] !== undefined) {
          initVals[p.id] = dev.lastReadingValues[p.id];
        } else if (p.defaultValue !== undefined) {
          initVals[p.id] = p.defaultValue;
        } else if (p.targetValue !== undefined) {
          initVals[p.id] = p.targetValue;
        } else {
          initVals[p.id] = 0;
        }
      });
      setValues(initVals);
    }
  };

  const handleValueChange = (paramId: string, val: string) => {
    const num = parseFloat(val);
    setValues((prev) => ({
      ...prev,
      [paramId]: isNaN(num) ? 0 : num,
    }));
  };

  // Evaluate overall reading status
  const evaluateStatus = (): 'NORMAL' | 'WARNING' | 'CRITICAL' => {
    if (!currentDevice) return 'NORMAL';
    let status: 'NORMAL' | 'WARNING' | 'CRITICAL' = 'NORMAL';

    for (const p of currentDevice.parameters) {
      const v = values[p.id];
      if (typeof v === 'number') {
        if (p.criticalMax && v >= p.criticalMax) {
          return 'CRITICAL';
        }
        if ((p.minThreshold && v < p.minThreshold) || (p.maxThreshold && v > p.maxThreshold)) {
          status = 'WARNING';
        }
      }
    }
    return status;
  };

  const overallStatus = evaluateStatus();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentDevice) return;

    logDeviceReading({
      deviceId: currentDevice.id,
      deviceName: currentDevice.name,
      deviceCategory: currentDevice.category,
      date: new Date().toISOString().slice(0, 10),
      time: new Date().toLocaleTimeString('ar-EG', { hour: '2-digit', minute: '2-digit' }),
      shift,
      loggedBy: loggedBy.trim() || 'فني الوردية',
      values,
      status: overallStatus,
      notes: notes.trim(),
    });

    setSelectedDeviceForReading(null);
    setSelectedDeviceId('');
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
            <div className="w-10 h-10 rounded-lg bg-blue-600/20 text-blue-400 border border-blue-500/30 flex items-center justify-center">
              <Gauge className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-bold text-white">تسجيل قراءة عداد دورية للجهاز</h2>
              <p className="text-xs text-slate-400">
                تسجيل ومطابقة قيم العداد اللحظية لفحص السلامة التشغيلية
              </p>
            </div>
          </div>
          <button
            onClick={() => {
              setSelectedDeviceForReading(null);
              setSelectedDeviceId('');
            }}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-[#334155] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Content */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5 max-h-[80vh] overflow-y-auto">
          {/* Device Selection & Shift Details */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="sm:col-span-2">
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                الجهاز أو العداد المراد تسجيل قراءته *
              </label>
              <select
                value={currentDevice?.id || selectedDeviceId}
                onChange={(e) => handleDeviceChange(e.target.value)}
                className="w-full bg-[#0f172a] border border-[#334155] rounded-lg px-3 py-2.5 text-sm text-white font-semibold focus:outline-none focus:border-blue-500"
              >
                {meterDevices.map((d) => (
                  <option key={d.id} value={d.id}>
                    [{d.code}] {d.name} — {d.locationName}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                الوردية الحالية
              </label>
              <select
                value={shift}
                onChange={(e) => setShift(e.target.value as any)}
                className="w-full bg-[#0f172a] border border-[#334155] rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-blue-500"
              >
                <option value="صباحي (07:00 - 15:00)">الوردية الأولى: صباحي (07:00 - 15:00)</option>
                <option value="مسائي (15:00 - 23:00)">الوردية الثانية: مسائي (15:00 - 23:00)</option>
                <option value="ليلي (23:00 - 07:00)">الوردية الثالثة: ليلي (23:00 - 07:00)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                اسم الفني القائم بالتسجيل
              </label>
              <input
                type="text"
                required
                value={loggedBy}
                onChange={(e) => setLoggedBy(e.target.value)}
                placeholder="اسم فني الوردية"
                className="w-full bg-[#0f172a] border border-[#334155] rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-blue-500"
              />
            </div>
          </div>

          {/* Dynamic Parameters Entry with Live Feedback */}
          {currentDevice && (
            <div className="border border-[#334155] rounded-xl p-4 bg-[#0f172a]/50 space-y-4">
              <div className="flex items-center justify-between border-b border-[#334155] pb-2">
                <span className="text-xs font-bold text-white flex items-center gap-1.5">
                  <Sliders className="w-4 h-4 text-blue-400" />
                  معايير القياس المخصصة لجهاز [{currentDevice.code}]
                </span>
                
                {/* Real-time Status Badge */}
                <div className="flex items-center gap-1.5">
                  <span className="text-[11px] text-slate-400">تقييم القراءة:</span>
                  {overallStatus === 'NORMAL' && (
                    <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      طبيعي وآمن
                    </span>
                  )}
                  {overallStatus === 'WARNING' && (
                    <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-500/10 text-amber-400 border border-amber-500/20 flex items-center gap-1">
                      <AlertTriangle className="w-3.5 h-3.5" />
                      تنبيه: خارج النطاق المعتاد
                    </span>
                  )}
                  {overallStatus === 'CRITICAL' && (
                    <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-red-500/10 text-red-400 border border-red-500/20 flex items-center gap-1 animate-pulse">
                      <AlertOctagon className="w-3.5 h-3.5" />
                      تحذير حرج! تعدي الحد الأقصى
                    </span>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {currentDevice.parameters.map((param) => {
                  const val = values[param.id] ?? 0;
                  const isCrit = param.criticalMax && val >= param.criticalMax;
                  const isWarn =
                    !isCrit &&
                    ((param.minThreshold && val < param.minThreshold) ||
                      (param.maxThreshold && val > param.maxThreshold));

                  return (
                    <div
                      key={param.id}
                      className={`p-3 rounded-lg border transition-all ${
                        isCrit
                          ? 'bg-red-950/30 border-red-500/50'
                          : isWarn
                          ? 'bg-amber-950/20 border-amber-500/40'
                          : 'bg-[#1e293b] border-[#334155]'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1.5">
                        <span className="text-xs font-bold text-white">
                          {param.name}
                        </span>
                        <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-[#0f172a] text-slate-300 border border-[#334155]">
                          {param.unit}
                        </span>
                      </div>

                      <div className="flex items-center gap-2">
                        <input
                          type="number"
                          step="any"
                          required
                          value={values[param.id] ?? ''}
                          onChange={(e) => handleValueChange(param.id, e.target.value)}
                          className={`w-full bg-[#0f172a] border rounded-lg px-3 py-2 text-sm font-mono text-white focus:outline-none ${
                            isCrit
                              ? 'border-red-500 text-red-300'
                              : isWarn
                              ? 'border-amber-500 text-amber-300'
                              : 'border-[#334155] focus:border-blue-500'
                          }`}
                        />
                      </div>

                      {/* Threshold Guide */}
                      <div className="flex items-center justify-between mt-2 text-[10px] text-slate-400 font-mono">
                        <span>
                          النطاق الآمن: {param.minThreshold ?? '-'} ~ {param.maxThreshold ?? '-'} {param.unit}
                        </span>
                        {param.criticalMax && (
                          <span className="text-red-400">
                            الحرج: &gt;={param.criticalMax}
                          </span>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Notes */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">
              ملاحظات فحص الوردية
            </label>
            <textarea
              rows={2}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="مثال: أصوات الضاغط طبيعية، تم تفريغ مصائد المتكاثف، لا توجد تسريبات زيت..."
              className="w-full bg-[#0f172a] border border-[#334155] rounded-lg px-3 py-2 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
            />
          </div>

          {/* Actions */}
          <div className="pt-4 border-t border-[#334155] flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={() => {
                setSelectedDeviceForReading(null);
                setSelectedDeviceId('');
              }}
              className="px-4 py-2 bg-[#334155] hover:bg-[#475569] text-white text-xs font-semibold rounded-lg transition-colors"
            >
              إلغاء
            </button>
            <button
              type="submit"
              className={`px-5 py-2 text-white text-xs font-semibold rounded-lg flex items-center gap-1.5 shadow-md transition-all ${
                overallStatus === 'CRITICAL'
                  ? 'bg-red-600 hover:bg-red-500 shadow-red-600/30'
                  : overallStatus === 'WARNING'
                  ? 'bg-amber-600 hover:bg-amber-500 shadow-amber-600/30'
                  : 'bg-blue-600 hover:bg-blue-500 shadow-blue-600/30'
              }`}
            >
              <Save className="w-4 h-4" />
              تأكيد وحفظ القراءة اللحظية
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
