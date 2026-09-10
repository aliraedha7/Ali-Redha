import React, { useState } from 'react';
import { 
  Layers, 
  Gauge, 
  Thermometer, 
  Flame, 
  Zap, 
  CheckCircle2, 
  AlertTriangle, 
  Clock, 
  Plus, 
  FileCheck, 
  Calendar, 
  User, 
  ArrowRight,
  ShieldAlert,
  Sliders,
  Check,
  X
} from 'lucide-react';
import { useCMMS } from '../../context/CMMSContext';
import { MeterReading, PMChecklistItem } from '../../types';

export const PreventiveAndMeters: React.FC = () => {
  const { 
    meterReadings, 
    logMeterReading, 
    pmChecklist, 
    togglePMChecklistItem, 
    createWOFromPMItem 
  } = useCMMS();

  const [activeSubTab, setActiveSubTab] = useState<'meters' | 'pm-checklists'>('meters');

  // Meter form state
  const [airPressure, setAirPressure] = useState<number>(8.5);
  const [chillerTemp, setChillerTemp] = useState<number>(8.0);
  const [boilerTemp, setBoilerTemp] = useState<number>(250.0);
  const [powerFrequency, setPowerFrequency] = useState<number>(50.0);
  const [runningHours, setRunningHours] = useState<number>(24650);
  const [shift, setShift] = useState<MeterReading['shift']>('صباحي (07:00 - 15:00)');
  const [loggedBy, setLoggedBy] = useState<string>('فني التشغيل - باسم التميمي');
  const [notes, setNotes] = useState<string>('');

  const handleLogMeter = (e: React.FormEvent) => {
    e.preventDefault();
    const now = new Date();
    const dateStr = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;
    const timeStr = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;

    logMeterReading({
      date: dateStr,
      time: timeStr,
      shift,
      loggedBy,
      airPressureBar: Number(airPressure),
      chillerTempC: Number(chillerTemp),
      boilerTempC: Number(boilerTemp),
      powerFrequencyHz: Number(powerFrequency),
      runningHoursSample: Number(runningHours),
      status: 'NORMAL',
      notes: notes || undefined,
    });

    setNotes('');
  };

  const latestReading = meterReadings[0];

  return (
    <div className="space-y-4">
      {/* Sub-tab Navigation */}
      <div className="p-3.5 rounded-xl bg-[#1e293b] border border-[#334155] flex items-center justify-between gap-3 shadow-md">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveSubTab('meters')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold transition-all ${
              activeSubTab === 'meters'
                ? 'bg-blue-600 text-white shadow-md font-bold'
                : 'text-slate-300 hover:text-white hover:bg-[#334155]'
            }`}
          >
            <Gauge className="w-4 h-4" />
            <span>سجل العدادات اليومية المركزية (Meters Logger)</span>
          </button>

          <button
            onClick={() => setActiveSubTab('pm-checklists')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold transition-all ${
              activeSubTab === 'pm-checklists'
                ? 'bg-blue-600 text-white shadow-md font-bold'
                : 'text-slate-300 hover:text-white hover:bg-[#334155]'
            }`}
          >
            <FileCheck className="w-4 h-4" />
            <span>قوائم الفحص الدوري والوقائي (PM Checklists)</span>
            <span className="font-mono text-[10px] bg-[#0f172a] px-2 py-0.5 rounded-full text-blue-400 font-bold">
              {pmChecklist.length}
            </span>
          </button>
        </div>

        <div className="text-xs text-slate-400 hidden md:block">
          معايير المصنع: هواء 8.5 Bar • ماء تشيلر 8°C • زيت حراري 250°C
        </div>
      </div>

      {/* 1. Daily Meters View */}
      {activeSubTab === 'meters' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {/* Live Meter Gauges / Status Summary */}
          <div className="lg:col-span-3 grid grid-cols-2 sm:grid-cols-4 gap-3">
            {/* Air Pressure */}
            <div className="p-4 rounded-xl bg-[#1e293b] border border-[#334155] shadow-md relative overflow-hidden">
              <div className="flex items-center justify-between text-slate-400 mb-1 text-xs font-bold">
                <span>ضغط الهواء المضغوط</span>
                <Gauge className="w-4 h-4 text-cyan-400" />
              </div>
              <div className="text-2xl font-black font-mono text-cyan-400">
                {latestReading ? latestReading.airPressureBar : 8.5}{' '}
                <span className="text-xs font-sans text-slate-400">Bar</span>
              </div>
              <div className="text-[11px] text-slate-400 mt-1">
                الهدف: 8.5 Bar (الكمبريسورات 01-04)
              </div>
              <div className="absolute bottom-0 left-0 right-0 h-1 bg-cyan-500" />
            </div>

            {/* Chiller Water Temp */}
            <div className="p-4 rounded-xl bg-[#1e293b] border border-[#334155] shadow-md relative overflow-hidden">
              <div className="flex items-center justify-between text-slate-400 mb-1 text-xs font-bold">
                <span>حرارة ماء التشيلر</span>
                <Thermometer className="w-4 h-4 text-blue-400" />
              </div>
              <div className="text-2xl font-black font-mono text-blue-400">
                {latestReading ? latestReading.chillerTempC : 8.0}{' '}
                <span className="text-xs font-sans text-slate-400">°C</span>
              </div>
              <div className="text-[11px] text-slate-400 mt-1">
                النطاق الآمن: 6.0°C - 11.0°C
              </div>
              <div className="absolute bottom-0 left-0 right-0 h-1 bg-blue-500" />
            </div>

            {/* Boiler Oil Temp */}
            <div className="p-4 rounded-xl bg-[#1e293b] border border-[#334155] shadow-md relative overflow-hidden">
              <div className="flex items-center justify-between text-slate-400 mb-1 text-xs font-bold">
                <span>حرارة الزيت الحراري</span>
                <Flame className="w-4 h-4 text-yellow-400" />
              </div>
              <div className="text-2xl font-black font-mono text-yellow-400">
                {latestReading ? latestReading.boilerTempC : 250.0}{' '}
                <span className="text-xs font-sans text-slate-400">°C</span>
              </div>
              <div className="text-[11px] text-slate-400 mt-1">
                غلايات Babcock (القصوى: 280°C)
              </div>
              <div className="absolute bottom-0 left-0 right-0 h-1 bg-yellow-500" />
            </div>

            {/* Power Frequency */}
            <div className="p-4 rounded-xl bg-[#1e293b] border border-[#334155] shadow-md relative overflow-hidden">
              <div className="flex items-center justify-between text-slate-400 mb-1 text-xs font-bold">
                <span>تردد الشبكة الكهربائية</span>
                <Zap className="w-4 h-4 text-green-400" />
              </div>
              <div className="text-2xl font-black font-mono text-green-400">
                {latestReading ? latestReading.powerFrequencyHz : 50.0}{' '}
                <span className="text-xs font-sans text-slate-400">Hz</span>
              </div>
              <div className="text-[11px] text-slate-400 mt-1">
                استقرار الطاقة والـ UPS
              </div>
              <div className="absolute bottom-0 left-0 right-0 h-1 bg-green-500" />
            </div>
          </div>

          {/* Form to log new reading */}
          <div className="p-5 rounded-xl bg-[#1e293b] border border-[#334155] shadow-lg space-y-4">
            <div className="flex items-center gap-2 border-b border-[#334155] pb-3">
              <Sliders className="w-4 h-4 text-blue-400" />
              <h3 className="text-sm font-bold text-white">تسجيل قراءة الوردية الراهنة</h3>
            </div>

            <form onSubmit={handleLogMeter} className="space-y-3.5 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-bold text-slate-300">ضغط الهواء (Bar)</label>
                  <input
                    type="number"
                    step="0.05"
                    min="5"
                    max="12"
                    value={airPressure}
                    onChange={(e) => setAirPressure(parseFloat(e.target.value) || 0)}
                    className="w-full bg-[#0f172a] border border-[#334155] rounded-lg px-3 py-2 text-slate-100 font-mono focus:outline-none focus:border-blue-500"
                    required
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-slate-300">حرارة التشيلر (°C)</label>
                  <input
                    type="number"
                    step="0.1"
                    min="0"
                    max="30"
                    value={chillerTemp}
                    onChange={(e) => setChillerTemp(parseFloat(e.target.value) || 0)}
                    className="w-full bg-[#0f172a] border border-[#334155] rounded-lg px-3 py-2 text-slate-100 font-mono focus:outline-none focus:border-blue-500"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-bold text-slate-300">حرارة البويلر (°C)</label>
                  <input
                    type="number"
                    step="0.5"
                    min="150"
                    max="320"
                    value={boilerTemp}
                    onChange={(e) => setBoilerTemp(parseFloat(e.target.value) || 0)}
                    className="w-full bg-[#0f172a] border border-[#334155] rounded-lg px-3 py-2 text-slate-100 font-mono focus:outline-none focus:border-blue-500"
                    required
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-slate-300">تردد الطاقة (Hz)</label>
                  <input
                    type="number"
                    step="0.01"
                    min="45"
                    max="55"
                    value={powerFrequency}
                    onChange={(e) => setPowerFrequency(parseFloat(e.target.value) || 0)}
                    className="w-full bg-[#0f172a] border border-[#334155] rounded-lg px-3 py-2 text-slate-100 font-mono focus:outline-none focus:border-blue-500"
                    required
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="font-bold text-slate-300">الوردية التشغيلية</label>
                <select
                  value={shift}
                  onChange={(e) => setShift(e.target.value as any)}
                  className="w-full bg-[#0f172a] border border-[#334155] rounded-lg px-3 py-2 text-slate-100 focus:outline-none focus:border-blue-500"
                >
                  <option value="صباحي (07:00 - 15:00)">صباحي (07:00 - 15:00)</option>
                  <option value="مسائي (15:00 - 23:00)">مسائي (15:00 - 23:00)</option>
                  <option value="ليلي (23:00 - 07:00)">ليلي (23:00 - 07:00)</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="font-bold text-slate-300">اسم فني التسجيل</label>
                <input
                  type="text"
                  value={loggedBy}
                  onChange={(e) => setLoggedBy(e.target.value)}
                  className="w-full bg-[#0f172a] border border-[#334155] rounded-lg px-3 py-2 text-slate-100 focus:outline-none focus:border-blue-500"
                  required
                />
              </div>

              <div className="space-y-1">
                <label className="font-bold text-slate-300">ملاحظات تشغيلية</label>
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="أي ملاحظات حول الضغط أو التسريب أو استهلاك الطاقة..."
                  rows={2}
                  className="w-full bg-[#0f172a] border border-[#334155] rounded-lg px-3 py-2 text-slate-100 focus:outline-none focus:border-blue-500 resize-none"
                />
              </div>

              <button
                type="submit"
                className="w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-500 text-white font-bold py-2.5 px-4 rounded-lg shadow-md transition-all active:scale-95"
              >
                <Plus className="w-4 h-4" />
                <span>حفظ وتثبيت القراءة في السجل</span>
              </button>
            </form>
          </div>

          {/* Historical Log Table */}
          <div className="p-5 rounded-xl bg-[#1e293b] border border-[#334155] shadow-lg lg:col-span-2 space-y-3">
            <div className="flex items-center justify-between border-b border-[#334155] pb-3">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Clock className="w-4 h-4 text-blue-400" />
                <span>سجل قراءات العدادات التاريخية بالمصنع ({meterReadings.length})</span>
              </h3>
              <span className="text-xs text-slate-400 font-mono">آخر تحديث: قبل قليل</span>
            </div>

            <div className="overflow-x-auto rounded-lg border border-[#334155]">
              <table className="w-full text-right text-xs">
                <thead className="bg-[#0f172a] text-slate-400 border-b border-[#334155]">
                  <tr>
                    <th className="p-2.5">الوقت والتاريخ</th>
                    <th className="p-2.5">الوردية</th>
                    <th className="p-2.5 text-center">الهواء (Bar)</th>
                    <th className="p-2.5 text-center">التشيلر (°C)</th>
                    <th className="p-2.5 text-center">البويلر (°C)</th>
                    <th className="p-2.5 text-center">التردد (Hz)</th>
                    <th className="p-2.5">الحالة</th>
                    <th className="p-2.5">المسجل</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#334155] bg-[#0f172a]/40 font-mono">
                  {meterReadings.map((reading) => (
                    <tr key={reading.id} className="hover:bg-[#334155]/20">
                      <td className="p-2.5 text-slate-300 font-bold whitespace-nowrap">
                        {reading.timestamp}
                      </td>
                      <td className="p-2.5 text-slate-400 font-sans text-[11px] whitespace-nowrap">
                        {reading.shift.split(' ')[0]}
                      </td>
                      <td className="p-2.5 text-center font-bold text-cyan-400">
                        {reading.airPressureBar}
                      </td>
                      <td className="p-2.5 text-center font-bold text-blue-400">
                        {reading.chillerTempC}°
                      </td>
                      <td className="p-2.5 text-center font-bold text-yellow-400">
                        {reading.boilerTempC}°
                      </td>
                      <td className="p-2.5 text-center font-bold text-green-400">
                        {reading.powerFrequencyHz}
                      </td>
                      <td className="p-2.5 font-sans whitespace-nowrap">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                          reading.status === 'NORMAL'
                            ? 'bg-green-500/15 text-green-400'
                            : reading.status === 'WARNING'
                            ? 'bg-yellow-500/20 text-yellow-300'
                            : 'bg-red-500/20 text-red-300'
                        }`}>
                          {reading.status === 'NORMAL' ? 'طبيعي' : reading.status === 'WARNING' ? 'تحذير' : 'حرج'}
                        </span>
                      </td>
                      <td className="p-2.5 text-slate-400 font-sans text-[11px] whitespace-nowrap">
                        {reading.loggedBy}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* 2. Preventive Checklists View */}
      {activeSubTab === 'pm-checklists' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {pmChecklist.map((item) => (
              <div
                key={item.id}
                className={`p-4 rounded-xl border transition-all shadow-md space-y-3 bg-[#1e293b] ${
                  item.status === 'FAILED'
                    ? 'border-red-500/60 bg-red-950/20'
                    : item.status === 'PASSED'
                    ? 'border-green-500/40'
                    : 'border-[#334155]'
                }`}
              >
                {/* Header */}
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs font-bold text-blue-400 bg-[#0f172a] px-2 py-0.5 rounded border border-[#334155]">
                        {item.id}
                      </span>
                      <span className="text-xs bg-[#0f172a] text-slate-300 px-2 py-0.5 rounded border border-[#334155]">
                        {item.frequency}
                      </span>
                      <span className="text-xs bg-blue-600/15 text-blue-300 px-2 py-0.5 rounded border border-blue-500/30">
                        {item.category}
                      </span>
                    </div>
                    <h3 className="text-sm font-bold text-white mt-1.5 leading-snug">
                      {item.title}
                    </h3>
                    <p className="text-xs text-yellow-300/90 mt-0.5">
                      {item.assetName} ({item.assetId})
                    </p>
                  </div>

                  {/* Status Indicator */}
                  <div>
                    {item.status === 'PASSED' ? (
                      <span className="flex items-center gap-1 text-xs font-bold px-2.5 py-1 rounded-full bg-green-500/20 text-green-400 border border-green-500/40">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>مطابق</span>
                      </span>
                    ) : item.status === 'FAILED' ? (
                      <span className="flex items-center gap-1 text-xs font-bold px-2.5 py-1 rounded-full bg-red-500/20 text-red-400 border border-red-500/40 animate-pulse">
                        <AlertTriangle className="w-3.5 h-3.5" />
                        <span>فشل الفحص</span>
                      </span>
                    ) : (
                      <span className="flex items-center gap-1 text-xs font-bold px-2.5 py-1 rounded-full bg-yellow-500/20 text-yellow-300 border border-yellow-500/40">
                        <Clock className="w-3.5 h-3.5" />
                        <span>مستحق اليوم</span>
                      </span>
                    )}
                  </div>
                </div>

                {/* Procedure & Critical Points */}
                <div className="space-y-2 text-xs">
                  <div className="p-2.5 rounded-lg bg-[#0f172a] border border-[#334155] text-slate-300 leading-relaxed">
                    <span className="font-bold text-slate-200">إجراء الفحص: </span>
                    {item.procedure}
                  </div>

                  <div className="p-2 rounded-lg bg-yellow-500/10 border border-yellow-500/20 text-yellow-300 text-[11px]">
                    <span className="font-bold">نقطة حرجة: </span>
                    {item.criticalPoints}
                  </div>
                </div>

                {/* Dates & Signature */}
                <div className="flex items-center justify-between text-[11px] text-slate-400 pt-1 border-t border-[#334155] font-mono">
                  <span>آخر فحص: {item.lastCheckedDate}</span>
                  <span>الموعد القادم: {item.nextDueDate}</span>
                </div>

                {/* Action Buttons */}
                <div className="flex items-center justify-between gap-2 pt-2 border-t border-[#334155]">
                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => togglePMChecklistItem(item.id, 'PASSED')}
                      className={`flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                        item.status === 'PASSED'
                          ? 'bg-green-600 text-white'
                          : 'bg-[#0f172a] hover:bg-green-600/80 text-slate-300 hover:text-white border border-[#334155]'
                      }`}
                    >
                      <Check className="w-3.5 h-3.5" />
                      <span>مطابق وناجح</span>
                    </button>

                    <button
                      onClick={() => togglePMChecklistItem(item.id, 'FAILED')}
                      className={`flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                        item.status === 'FAILED'
                          ? 'bg-red-600 text-white'
                          : 'bg-[#0f172a] hover:bg-red-600/80 text-slate-300 hover:text-white border border-[#334155]'
                      }`}
                    >
                      <X className="w-3.5 h-3.5" />
                      <span>غير مطابق (خلل)</span>
                    </button>
                  </div>

                  {/* Convert to Work Order button if failed or needs intervention */}
                  <button
                    onClick={() => createWOFromPMItem(item)}
                    className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-bold bg-blue-600/15 hover:bg-blue-600 text-blue-400 hover:text-white border border-blue-500/30 transition-all"
                  >
                    <span>تحويل لأمر عمل</span>
                    <ArrowRight className="w-3 h-3" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
