import React, { useState, useEffect } from 'react';
import { 
  X, 
  Plus, 
  Trash2, 
  Gauge, 
  Sliders, 
  Save, 
  Building2 
} from 'lucide-react';
import { useCMMS } from '../../context/CMMSContext';
import { MeterDeviceCategory, MeterParameterConfig, HangarId, MeterDevice } from '../../types';

const COMMON_UNITS = [
  'Bar', 
  '°C', 
  'kW', 
  'Hz', 
  'A', 
  'V', 
  'm³/h', 
  'L/min', 
  'ppm', 
  'Hours', 
  '%', 
  'Bar g', 
  'rpm', 
  'dB'
];

export const EditMeterDeviceModal: React.FC = () => {
  const { 
    editingMeterDevice, 
    setEditingMeterDevice, 
    updateMeterDevice, 
    deleteMeterDevice,
    requestDeleteConfirmation,
    checkPermission,
    hangars 
  } = useCMMS();

  const [code, setCode] = useState('');
  const [name, setName] = useState('');
  const [nameEn, setNameEn] = useState('');
  const [category, setCategory] = useState<MeterDeviceCategory>('COMPRESSOR');
  const [hangarId, setHangarId] = useState<HangarId | ''>('');
  const [locationName, setLocationName] = useState('');
  const [model, setModel] = useState('');
  const [manufacturer, setManufacturer] = useState('');
  const [serialNumber, setSerialNumber] = useState('');
  const [installYear, setInstallYear] = useState<number>(2023);
  const [status, setStatus] = useState<MeterDevice['status']>('OPERATIONAL');
  const [readingFrequency, setReadingFrequency] = useState<'لكل وردية (Shift)' | 'يومي (Daily)' | 'أسبوعي (Weekly)' | 'مستمر (Continuous)'>('لكل وردية (Shift)');
  const [notes, setNotes] = useState('');
  const [parameters, setParameters] = useState<MeterParameterConfig[]>([]);

  useEffect(() => {
    if (editingMeterDevice) {
      setCode(editingMeterDevice.code);
      setName(editingMeterDevice.name);
      setNameEn(editingMeterDevice.nameEn || '');
      setCategory(editingMeterDevice.category);
      setHangarId(editingMeterDevice.hangarId || '');
      setLocationName(editingMeterDevice.locationName);
      setModel(editingMeterDevice.model);
      setManufacturer(editingMeterDevice.manufacturer);
      setSerialNumber(editingMeterDevice.serialNumber || '');
      setInstallYear(editingMeterDevice.installYear || 2023);
      setStatus(editingMeterDevice.status);
      setReadingFrequency(editingMeterDevice.readingFrequency);
      setNotes(editingMeterDevice.notes || '');
      setParameters(editingMeterDevice.parameters ? JSON.parse(JSON.stringify(editingMeterDevice.parameters)) : []);
    }
  }, [editingMeterDevice]);

  if (!editingMeterDevice) return null;

  const handleAddParameter = () => {
    const newId = `param_${Date.now().toString().slice(-4)}`;
    setParameters([
      ...parameters,
      {
        id: newId,
        name: '',
        nameEn: '',
        unit: 'Bar',
        targetValue: 0,
        minThreshold: undefined,
        maxThreshold: undefined,
        criticalMax: undefined,
        defaultValue: 0,
      }
    ]);
  };

  const handleRemoveParameter = (index: number) => {
    if (parameters.length <= 1) {
      alert('يجب أن يحتوي الجهاز على معيار قياس واحد على الأقل.');
      return;
    }
    setParameters(parameters.filter((_, idx) => idx !== index));
  };

  const handleParameterChange = (index: number, field: keyof MeterParameterConfig, value: any) => {
    const next = [...parameters];
    next[index] = { ...next[index], [field]: value };
    setParameters(next);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !code.trim()) {
      alert('يرجى التأكد من تعبئة اسم وكود الجهاز');
      return;
    }

    for (const p of parameters) {
      if (!p.name.trim()) {
        alert('يرجى تحديد اسم لكل معيار قراءة.');
        return;
      }
    }

    updateMeterDevice({
      ...editingMeterDevice,
      code: code.trim(),
      name: name.trim(),
      nameEn: nameEn.trim() || code.trim(),
      category,
      hangarId: hangarId ? (hangarId as HangarId) : undefined,
      locationName: locationName.trim(),
      model: model.trim(),
      manufacturer: manufacturer.trim(),
      serialNumber: serialNumber.trim(),
      installYear: Number(installYear) || 2023,
      status,
      readingFrequency,
      parameters,
      notes: notes.trim(),
    });

    setEditingMeterDevice(null);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm overflow-y-auto no-print">
      <div 
        className="bg-[#1e293b] border border-[#334155] rounded-xl w-full max-w-3xl overflow-hidden shadow-2xl my-8 text-right font-sans"
        dir="rtl"
      >
        {/* Modal Header */}
        <div className="px-6 py-4 bg-[#0f172a] border-b border-[#334155] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-amber-600/20 text-amber-400 border border-amber-500/30 flex items-center justify-center">
              <Gauge className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white">تعديل بيانات جهاز القياس والعداد [{editingMeterDevice.code}]</h2>
              <p className="text-xs text-slate-400">
                تعديل المعايير والوحدات والحدود الآمنة لـ {editingMeterDevice.name}
              </p>
            </div>
          </div>
          <button
            onClick={() => setEditingMeterDevice(null)}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-[#334155] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6 max-h-[80vh] overflow-y-auto">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                كود الجهاز (Tag) *
              </label>
              <input
                type="text"
                required
                value={code}
                onChange={(e) => setCode(e.target.value)}
                className="w-full bg-[#0f172a] border border-[#334155] rounded-lg px-3 py-2 text-sm text-white font-mono focus:outline-none focus:border-blue-500"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                اسم الجهاز بالعربية *
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full bg-[#0f172a] border border-[#334155] rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                نوع الجهاز / الفئة
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as MeterDeviceCategory)}
                className="w-full bg-[#0f172a] border border-[#334155] rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-blue-500"
              >
                <option value="COMPRESSOR">ضاغط هواء (Compressor)</option>
                <option value="CHILLER">مبرد مياه وشيلر (Chiller)</option>
                <option value="BOILER">مرجل بخار وغلاية (Boiler)</option>
                <option value="POWER_STATION">محطة ومحول طاقة (Power)</option>
                <option value="WATER_TREATMENT">معالجة مياه وتناضح (RO)</option>
                <option value="OTHER">مرافق أخرى (Other)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                الحالة التشغيلية للجهاز
              </label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as any)}
                className="w-full bg-[#0f172a] border border-[#334155] rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-blue-500"
              >
                <option value="OPERATIONAL">يعمل بكفاءة طبيعية (Operational)</option>
                <option value="WARNING">تحت المراقبة / تحذير (Warning)</option>
                <option value="MAINTENANCE">تحت الصيانة والإصلاح (Maintenance)</option>
                <option value="OFFLINE">متوقف / احتياطي (Offline/Standby)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                دورية أخذ القراءة
              </label>
              <select
                value={readingFrequency}
                onChange={(e) => setReadingFrequency(e.target.value as any)}
                className="w-full bg-[#0f172a] border border-[#334155] rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-blue-500"
              >
                <option value="لكل وردية (Shift)">لكل وردية (Shift)</option>
                <option value="يومي (Daily)">يومي (Daily)</option>
                <option value="أسبوعي (Weekly)">أسبوعي (Weekly)</option>
                <option value="مستمر (Continuous)">مستمر عبر لوحة الحساسات</option>
              </select>
            </div>

            <div className="sm:col-span-2">
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                الموقع الدقيق داخل المصنع *
              </label>
              <input
                type="text"
                required
                value={locationName}
                onChange={(e) => setLocationName(e.target.value)}
                className="w-full bg-[#0f172a] border border-[#334155] rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                القاعة أو المبنى
              </label>
              <select
                value={hangarId}
                onChange={(e) => setHangarId(e.target.value as HangarId)}
                className="w-full bg-[#0f172a] border border-[#334155] rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-blue-500"
              >
                <option value="">بدون ربط بقاعة محددة</option>
                {hangars.map((h) => (
                  <option key={h.id} value={h.id}>
                    {h.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                الشركة الصانعة
              </label>
              <input
                type="text"
                value={manufacturer}
                onChange={(e) => setManufacturer(e.target.value)}
                className="w-full bg-[#0f172a] border border-[#334155] rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                الموديل
              </label>
              <input
                type="text"
                value={model}
                onChange={(e) => setModel(e.target.value)}
                className="w-full bg-[#0f172a] border border-[#334155] rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                سنة التركيب
              </label>
              <input
                type="number"
                value={installYear}
                onChange={(e) => setInstallYear(parseInt(e.target.value) || 2023)}
                className="w-full bg-[#0f172a] border border-[#334155] rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-blue-500"
              />
            </div>
          </div>

          {/* DYNAMIC PARAMETERS BUILDER SECTION */}
          <div className="border border-[#334155] rounded-xl p-4 bg-[#0f172a]/60 space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <Sliders className="w-4 h-4 text-blue-400" />
                  معايير القياس المحددة للجهاز والوحدات
                </h3>
                <p className="text-[11px] text-slate-400">
                  تعديل أو إضافة المعايير والوحدات والحدود الآمنة التي يقيسها فني الصيانة
                </p>
              </div>
              <button
                type="button"
                onClick={handleAddParameter}
                className="px-3 py-1.5 bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold rounded-lg flex items-center gap-1.5 transition-colors shadow-sm"
              >
                <Plus className="w-3.5 h-3.5" />
                إضافة معيار جديد
              </button>
            </div>

            <div className="space-y-3 pt-2">
              {parameters.map((param, index) => (
                <div
                  key={param.id || index}
                  className="p-3 bg-[#1e293b] border border-[#334155] rounded-lg space-y-3"
                >
                  <div className="flex items-center justify-between gap-2 border-b border-[#334155] pb-2">
                    <span className="text-xs font-bold text-slate-300">
                      معيار القياس #{index + 1}
                    </span>
                    <button
                      type="button"
                      onClick={() => handleRemoveParameter(index)}
                      className="text-red-400 hover:text-red-300 p-1 rounded hover:bg-red-500/10 text-xs flex items-center gap-1 transition-colors"
                      title="حذف هذا المعيار"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      حذف
                    </button>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div className="sm:col-span-2">
                      <label className="block text-[11px] text-slate-400 mb-1">
                        اسم المعيار بالعربية *
                      </label>
                      <input
                        type="text"
                        required
                        value={param.name}
                        onChange={(e) => handleParameterChange(index, 'name', e.target.value)}
                        placeholder="مثال: ضغط الهواء الخارج"
                        className="w-full bg-[#0f172a] border border-[#334155] rounded px-2.5 py-1.5 text-xs text-white focus:outline-none focus:border-blue-500"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] text-slate-400 mb-1">
                        وحدة القياس (Unit) *
                      </label>
                      <div className="flex gap-1">
                        <input
                          type="text"
                          required
                          value={param.unit}
                          onChange={(e) => handleParameterChange(index, 'unit', e.target.value)}
                          className="w-full bg-[#0f172a] border border-[#334155] rounded px-2 py-1.5 text-xs text-white font-mono focus:outline-none focus:border-blue-500"
                        />
                        <select
                          value={COMMON_UNITS.includes(param.unit) ? param.unit : ''}
                          onChange={(e) => {
                            if (e.target.value) handleParameterChange(index, 'unit', e.target.value);
                          }}
                          className="bg-[#0f172a] border border-[#334155] rounded px-1.5 py-1.5 text-xs text-slate-300 focus:outline-none"
                        >
                          <option value="">قائمة</option>
                          {COMMON_UNITS.map((u) => (
                            <option key={u} value={u}>
                              {u}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>
                  </div>

                  {/* Thresholds & Safe Range */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-1 bg-[#0f172a]/40 p-2 rounded">
                    <div>
                      <label className="block text-[10px] text-emerald-400 mb-1 font-mono">
                        القيمة المثالية (Target)
                      </label>
                      <input
                        type="number"
                        step="any"
                        value={param.targetValue ?? ''}
                        onChange={(e) =>
                          handleParameterChange(
                            index,
                            'targetValue',
                            e.target.value === '' ? undefined : parseFloat(e.target.value)
                          )
                        }
                        placeholder="8.5"
                        className="w-full bg-[#1e293b] border border-[#334155] rounded px-2 py-1 text-xs text-white font-mono"
                      />
                    </div>

                    <div>
                      <label className="block text-[10px] text-amber-400 mb-1 font-mono">
                        الحد الأدنى (Min Warn)
                      </label>
                      <input
                        type="number"
                        step="any"
                        value={param.minThreshold ?? ''}
                        onChange={(e) =>
                          handleParameterChange(
                            index,
                            'minThreshold',
                            e.target.value === '' ? undefined : parseFloat(e.target.value)
                          )
                        }
                        placeholder="8.0"
                        className="w-full bg-[#1e293b] border border-[#334155] rounded px-2 py-1 text-xs text-white font-mono"
                      />
                    </div>

                    <div>
                      <label className="block text-[10px] text-amber-400 mb-1 font-mono">
                        الحد الأقصى (Max Warn)
                      </label>
                      <input
                        type="number"
                        step="any"
                        value={param.maxThreshold ?? ''}
                        onChange={(e) =>
                          handleParameterChange(
                            index,
                            'maxThreshold',
                            e.target.value === '' ? undefined : parseFloat(e.target.value)
                          )
                        }
                        placeholder="9.0"
                        className="w-full bg-[#1e293b] border border-[#334155] rounded px-2 py-1 text-xs text-white font-mono"
                      />
                    </div>

                    <div>
                      <label className="block text-[10px] text-red-400 mb-1 font-mono">
                        الحد الحرج (Critical Max)
                      </label>
                      <input
                        type="number"
                        step="any"
                        value={param.criticalMax ?? ''}
                        onChange={(e) =>
                          handleParameterChange(
                            index,
                            'criticalMax',
                            e.target.value === '' ? undefined : parseFloat(e.target.value)
                          )
                        }
                        placeholder="9.8"
                        className="w-full bg-[#1e293b] border border-[#334155] rounded px-2 py-1 text-xs text-white font-mono"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Notes */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">
              ملاحظات تشغيلية
            </label>
            <textarea
              rows={2}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full bg-[#0f172a] border border-[#334155] rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-blue-500"
            />
          </div>

          {/* Modal Footer */}
          <div className="pt-4 border-t border-[#334155] flex items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setEditingMeterDevice(null)}
                className="px-4 py-2 bg-[#334155] hover:bg-[#475569] text-white text-xs font-semibold rounded-lg transition-colors"
              >
                إلغاء
              </button>

              {editingMeterDevice && (
                <button
                  type="button"
                  id="btn-delete-meter-device-modal"
                  onClick={() => {
                    if (!checkPermission('canManageMeters', 'حذف جهاز قياس وعداد صناعي')) return;
                    requestDeleteConfirmation({
                      title: 'حذف جهاز قياس وعداد',
                      message: `هل أنت متأكد من رغبتك في حذف جهاز القياس [${editingMeterDevice.name}] (${editingMeterDevice.code}) نهائياً؟`,
                      itemDetails: `${editingMeterDevice.code} - ${editingMeterDevice.name} (${editingMeterDevice.location})`,
                      confirmLabel: 'حذف جهاز القياس',
                      onConfirm: () => {
                        deleteMeterDevice(editingMeterDevice.id);
                        setEditingMeterDevice(null);
                      },
                    });
                  }}
                  className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold text-red-400 hover:text-red-300 bg-red-500/10 hover:bg-red-500/25 border border-red-500/30 rounded-lg transition-colors active:scale-95"
                  title="حذف هذا العداد نهائياً"
                >
                  <Trash2 className="w-4 h-4" />
                  <span>حذف العداد</span>
                </button>
              )}
            </div>

            <button
              type="submit"
              className="px-5 py-2 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold rounded-lg flex items-center gap-1.5 shadow-md shadow-emerald-600/30 transition-all"
            >
              <Save className="w-4 h-4" />
              حفظ التعديلات والتحديثات
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
