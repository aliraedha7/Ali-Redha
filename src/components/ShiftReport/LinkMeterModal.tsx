import React, { useState, useEffect } from 'react';
import { X, Gauge, Zap, CheckCircle2, AlertTriangle, AlertOctagon, Link2 } from 'lucide-react';
import { MeterDevice, LinkedMeterReading } from '../../types';

interface LinkMeterModalProps {
  isOpen: boolean;
  onClose: () => void;
  meterDevices: MeterDevice[];
  onSave: (reading: LinkedMeterReading) => void;
  initialReading?: LinkedMeterReading | null;
}

export const LinkMeterModal: React.FC<LinkMeterModalProps> = ({
  isOpen,
  onClose,
  meterDevices = [],
  onSave,
  initialReading,
}) => {
  const safeDevices = meterDevices || [];
  const [selectedDeviceId, setSelectedDeviceId] = useState<string>(
    safeDevices[0]?.id || ''
  );
  const selectedDevice = safeDevices.find((d) => d.id === selectedDeviceId) || safeDevices[0];

  const [selectedParamId, setSelectedParamId] = useState<string>(
    selectedDevice?.parameters?.[0]?.id || ''
  );
  const selectedParam =
    selectedDevice?.parameters?.find((p) => p.id === selectedParamId) ||
    selectedDevice?.parameters?.[0];

  const [value, setValue] = useState<number>(selectedParam?.defaultValue || 8.5);
  const [status, setStatus] = useState<'NORMAL' | 'WARNING' | 'CRITICAL'>('NORMAL');
  const [notes, setNotes] = useState('');

  // Update param selection when device changes
  useEffect(() => {
    if (selectedDevice && selectedDevice.parameters.length > 0) {
      if (!selectedDevice.parameters.some((p) => p.id === selectedParamId)) {
        setSelectedParamId(selectedDevice.parameters[0].id);
        setValue(selectedDevice.parameters[0].defaultValue || 0);
      }
    }
  }, [selectedDeviceId, selectedDevice]);

  useEffect(() => {
    if (initialReading) {
      setSelectedDeviceId(initialReading.deviceId);
      setSelectedParamId(initialReading.parameterId);
      setValue(initialReading.value);
      setStatus(initialReading.status);
      setNotes(initialReading.notes || '');
    } else if (selectedParam) {
      setValue(selectedParam.defaultValue || 0);
      setStatus('NORMAL');
      setNotes('');
    }
  }, [initialReading, isOpen]);

  // Auto-calculate status based on thresholds if available
  useEffect(() => {
    if (selectedParam) {
      const v = value;
      if (
        (selectedParam.criticalMax !== undefined && v >= selectedParam.criticalMax) ||
        ((selectedParam as any).criticalMin !== undefined && v <= (selectedParam as any).criticalMin)
      ) {
        setStatus('CRITICAL');
      } else if (
        (selectedParam.maxThreshold !== undefined && v > selectedParam.maxThreshold) ||
        (selectedParam.minThreshold !== undefined && v < selectedParam.minThreshold)
      ) {
        setStatus('WARNING');
      } else {
        setStatus('NORMAL');
      }
    }
  }, [value, selectedParam]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedDevice || !selectedParam) return;

    const nowTime = new Date().toLocaleTimeString('ar-EG', { hour: '2-digit', minute: '2-digit' });

    onSave({
      deviceId: selectedDevice.id,
      deviceCode: selectedDevice.code,
      deviceName: selectedDevice.name,
      parameterId: selectedParam.id,
      parameterName: selectedParam.name,
      value: Number(value),
      unit: selectedParam.unit,
      status,
      recordedAt: nowTime,
      notes: notes.trim() || undefined,
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in">
      <div className="bg-[#1e293b] border border-cyan-500/40 rounded-2xl w-full max-w-lg shadow-2xl p-6 space-y-5 text-right font-sans text-slate-100">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-[#334155] pb-3">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-cyan-500/20 text-cyan-400 flex items-center justify-center">
              <Gauge className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white">
                {initialReading ? 'تعديل قراءة العداد المربوط' : 'ربط جهاز قياس أو عداد بمحضر الدورية'}
              </h3>
              <p className="text-[11px] text-slate-400">
                تسجيل ومزامنة القراءات الحية من أجهزة محطة الطاقة والخدمات
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-300">
              اختر جهاز القياس أو العداد المركزي *
            </label>
            <select
              value={selectedDeviceId}
              onChange={(e) => setSelectedDeviceId(e.target.value)}
              className="w-full bg-[#0f172a] border border-[#334155] rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-cyan-500 font-mono"
            >
              {meterDevices.map((d) => (
                <option key={d.id} value={d.id}>
                  [{d.code}] {d.name} — ({d.locationName})
                </option>
              ))}
            </select>
          </div>

          {selectedDevice && (
            <div className="p-3 rounded-xl bg-[#0f172a] border border-[#334155] space-y-1 text-xs">
              <div className="flex items-center justify-between text-slate-400">
                <span>الموديل والمصنع:</span>
                <span className="text-white font-mono">{selectedDevice.manufacturer} • {selectedDevice.model}</span>
              </div>
              <div className="flex items-center justify-between text-slate-400">
                <span>الموقع الميداني:</span>
                <span className="text-slate-200">{selectedDevice.locationName}</span>
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-300">المؤشر أو المعامل المقاس</label>
              <select
                value={selectedParamId}
                onChange={(e) => {
                  setSelectedParamId(e.target.value);
                  const p = selectedDevice?.parameters.find((param) => param.id === e.target.value);
                  if (p) setValue(p.defaultValue || 0);
                }}
                className="w-full bg-[#0f172a] border border-[#334155] rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-cyan-500"
              >
                {selectedDevice?.parameters.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.name} ({p.unit})
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-300">
                القيمة المرصودة ({selectedParam?.unit || ''}) *
              </label>
              <div className="relative">
                <input
                  type="number"
                  step="0.01"
                  required
                  value={value}
                  onChange={(e) => setValue(parseFloat(e.target.value) || 0)}
                  className="w-full bg-[#0f172a] border border-[#334155] rounded-xl px-3 py-2 text-xs text-white font-mono focus:outline-none focus:border-cyan-500 pl-12"
                />
                <span className="absolute left-3 top-2 text-xs font-mono text-slate-400">
                  {selectedParam?.unit}
                </span>
              </div>
            </div>
          </div>

          {selectedParam && (
            <div className="p-2.5 rounded-lg bg-cyan-950/20 border border-cyan-500/30 text-[11px] text-cyan-200 flex flex-wrap items-center justify-between gap-2">
              <span>القيمة المستهدفة: <strong className="font-mono">{selectedParam.targetValue} {selectedParam.unit}</strong></span>
              <span>النطاق الآمن: <strong className="font-mono">{selectedParam.minThreshold} - {selectedParam.maxThreshold} {selectedParam.unit}</strong></span>
              <span>الحد الحرج: <strong className="font-mono">{selectedParam.criticalMax ?? '—'} {selectedParam.unit}</strong></span>
            </div>
          )}

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-300">تقييم حالة القراءة</label>
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => setStatus('NORMAL')}
                className={`py-2 px-2 rounded-xl text-xs font-bold border transition-all flex items-center justify-center gap-1.5 ${
                  status === 'NORMAL'
                    ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500 shadow-sm'
                    : 'bg-[#0f172a] text-slate-400 border-[#334155] hover:border-slate-500'
                }`}
              >
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                <span>طبيعي ومطابق</span>
              </button>

              <button
                type="button"
                onClick={() => setStatus('WARNING')}
                className={`py-2 px-2 rounded-xl text-xs font-bold border transition-all flex items-center justify-center gap-1.5 ${
                  status === 'WARNING'
                    ? 'bg-amber-500/20 text-amber-300 border-amber-500 shadow-sm'
                    : 'bg-[#0f172a] text-slate-400 border-[#334155] hover:border-slate-500'
                }`}
              >
                <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />
                <span>تنبيه / انحراف</span>
              </button>

              <button
                type="button"
                onClick={() => setStatus('CRITICAL')}
                className={`py-2 px-2 rounded-xl text-xs font-bold border transition-all flex items-center justify-center gap-1.5 ${
                  status === 'CRITICAL'
                    ? 'bg-red-500/20 text-red-300 border-red-500 shadow-sm'
                    : 'bg-[#0f172a] text-slate-400 border-[#334155] hover:border-slate-500'
                }`}
              >
                <AlertOctagon className="w-3.5 h-3.5 text-red-400" />
                <span>حرج يستوجب صيانة</span>
              </button>
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-300">
              ملاحظات المهندس أو الفاحص على القراءة
            </label>
            <textarea
              rows={2}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="مثال: الضغط مستقر، لا يوجد اهتزازات غير طبيعية في رأس الضغط..."
              className="w-full bg-[#0f172a] border border-[#334155] rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-cyan-500"
            />
          </div>

          <div className="flex items-center justify-end gap-2 pt-2 border-t border-[#334155]">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl bg-[#334155] hover:bg-slate-600 text-white text-xs font-bold transition-colors"
            >
              إلغاء
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-bold shadow-lg shadow-cyan-600/20 transition-all flex items-center gap-1.5"
            >
              <Link2 className="w-3.5 h-3.5" />
              <span>{initialReading ? 'تحديث الربط' : 'تأكيد وربط القراءة بالتقرير'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
