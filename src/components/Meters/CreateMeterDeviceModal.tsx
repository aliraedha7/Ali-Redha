import React, { useState } from 'react';
import { 
  X, 
  Plus, 
  Trash2, 
  Gauge, 
  Sliders, 
  AlertTriangle, 
  CheckCircle2, 
  Settings,
  HelpCircle,
  Building2
} from 'lucide-react';
import { useCMMS } from '../../context/CMMSContext';
import { MeterDeviceCategory, MeterParameterConfig, HangarId } from '../../types';

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

export const CreateMeterDeviceModal: React.FC = () => {
  const { 
    isCreateDeviceOpen, 
    setIsCreateDeviceOpen, 
    addMeterDevice, 
    hangars 
  } = useCMMS();

  const [code, setCode] = useState('');
  const [name, setName] = useState('');
  const [nameEn, setNameEn] = useState('');
  const [category, setCategory] = useState<MeterDeviceCategory>('COMPRESSOR');
  const [hangarId, setHangarId] = useState<HangarId | ''>('UTILITIES');
  const [locationName, setLocationName] = useState('محطة المرافق المركزية');
  const [model, setModel] = useState('');
  const [manufacturer, setManufacturer] = useState('');
  const [serialNumber, setSerialNumber] = useState('');
  const [installYear, setInstallYear] = useState<number>(2023);
  const [readingFrequency, setReadingFrequency] = useState<'لكل وردية (Shift)' | 'يومي (Daily)' | 'أسبوعي (Weekly)' | 'مستمر (Continuous)'>('لكل وردية (Shift)');
  const [notes, setNotes] = useState('');

  // Dynamic parameters builder
  const [parameters, setParameters] = useState<MeterParameterConfig[]>([
    {
      id: 'param_1',
      name: 'ضغط التشغيل',
      nameEn: 'Operating Pressure',
      unit: 'Bar',
      targetValue: 8.5,
      minThreshold: 8.0,
      maxThreshold: 9.0,
      criticalMax: 9.5,
      defaultValue: 8.5,
    },
    {
      id: 'param_2',
      name: 'درجة حرارة الزيت / التشغيل',
      nameEn: 'Operating Temperature',
      unit: '°C',
      targetValue: 75,
      minThreshold: 60,
      maxThreshold: 95,
      criticalMax: 105,
      defaultValue: 75,
    }
  ]);

  if (!isCreateDeviceOpen) return null;

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

  const applyCategoryDefaults = (newCategory: MeterDeviceCategory) => {
    setCategory(newCategory);
    if (newCategory === 'COMPRESSOR') {
      setCode(`CMP-0${Math.floor(Math.random() * 5) + 5}`);
      setName('ضاغط هواء حلزوني جديد');
      setLocationName('محطة الضواغط المركزية');
      setParameters([
        { id: 'p_press', name: 'ضغط الهواء الخارج', unit: 'Bar', targetValue: 8.5, minThreshold: 8.0, maxThreshold: 9.0, criticalMax: 9.8 },
        { id: 'p_temp', name: 'حرارة مرحلة الضغط', unit: '°C', targetValue: 78, minThreshold: 65, maxThreshold: 95, criticalMax: 105 },
        { id: 'p_curr', name: 'تيار المحرك الرئيسي', unit: 'A', targetValue: 120, maxThreshold: 155, criticalMax: 175 },
        { id: 'p_dew', name: 'نقطة ندى المجفف', unit: '°C', targetValue: 3, minThreshold: 1, maxThreshold: 7, criticalMax: 12 },
      ]);
    } else if (newCategory === 'CHILLER') {
      setCode(`CHL-0${Math.floor(Math.random() * 5) + 5}`);
      setName('مبرد مياه صناعي (شيلر) جديد');
      setLocationName('محطة التبريد المركزي والشيلرات');
      setParameters([
        { id: 'p_supply_temp', name: 'حرارة ماء التغذية المبرد', unit: '°C', targetValue: 7.0, minThreshold: 5.5, maxThreshold: 10.0, criticalMax: 13.0 },
        { id: 'p_return_temp', name: 'حرارة ماء الراجع', unit: '°C', targetValue: 12.0, minThreshold: 9.0, maxThreshold: 16.0, criticalMax: 19.0 },
        { id: 'p_wat_pres', name: 'ضغط مضخة المياه', unit: 'Bar', targetValue: 3.5, minThreshold: 2.8, maxThreshold: 4.2, criticalMax: 5.0 },
        { id: 'p_ref_pres', name: 'ضغط غاز التبريد R410A', unit: 'Bar', targetValue: 28.0, minThreshold: 22.0, maxThreshold: 34.0, criticalMax: 38.0 },
      ]);
    } else if (newCategory === 'BOILER') {
      setCode(`BLR-0${Math.floor(Math.random() * 5) + 3}`);
      setName('مرجل بخار / غلاية صناعية جديدة');
      setLocationName('محطة الغلايات والبخار');
      setParameters([
        { id: 'p_steam_pres', name: 'ضغط البخار بالمرجل', unit: 'Bar', targetValue: 10.0, minThreshold: 8.5, maxThreshold: 11.5, criticalMax: 13.0 },
        { id: 'p_flue_temp', name: 'حرارة غازات العادم', unit: '°C', targetValue: 190, minThreshold: 150, maxThreshold: 230, criticalMax: 260 },
        { id: 'p_water_level', name: 'مستوى مياه الغلاية', unit: '%', targetValue: 65, minThreshold: 45, maxThreshold: 80, criticalMax: 90 },
      ]);
    } else if (newCategory === 'POWER_STATION') {
      setCode(`TRF-0${Math.floor(Math.random() * 5) + 3}`);
      setName('محول طاقة ومحطة توزيع كهربائية');
      setLocationName('غرفة الجهد المتوسط والمحولات');
      setParameters([
        { id: 'p_voltage', name: 'الجهد الفعلي', unit: 'V', targetValue: 395, minThreshold: 375, maxThreshold: 415, criticalMax: 430 },
        { id: 'p_total_curr', name: 'الحمل الإجمالي', unit: 'A', targetValue: 950, maxThreshold: 1400, criticalMax: 1650 },
        { id: 'p_power_factor', name: 'معامل القدرة Cos φ', unit: '%', targetValue: 97, minThreshold: 92, maxThreshold: 100 },
        { id: 'p_trf_temp', name: 'حرارة ملفات المحول', unit: '°C', targetValue: 65, minThreshold: 40, maxThreshold: 85, criticalMax: 105 },
      ]);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      alert('يرجى إدخال اسم الجهاز أو المعدة');
      return;
    }
    if (!code.trim()) {
      alert('يرجى تحديد كود أو معرف الجهاز');
      return;
    }

    // Verify parameters have names
    for (const p of parameters) {
      if (!p.name.trim()) {
        alert('يرجى كتابة اسم لجميع معايير القياس المحددة.');
        return;
      }
    }

    addMeterDevice({
      code: code.trim(),
      name: name.trim(),
      nameEn: nameEn.trim() || code.trim(),
      category,
      hangarId: hangarId ? (hangarId as HangarId) : undefined,
      locationName: locationName.trim() || 'المرافق المركزية',
      model: model.trim() || 'Standard Industrial Unit',
      manufacturer: manufacturer.trim() || 'صناعي',
      serialNumber: serialNumber.trim() || `SN-${Date.now().toString().slice(-6)}`,
      installYear: Number(installYear) || 2024,
      status: 'OPERATIONAL',
      readingFrequency,
      parameters,
      notes: notes.trim(),
      lastReadingValues: {},
    });

    setIsCreateDeviceOpen(false);
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
            <div className="w-10 h-10 rounded-lg bg-blue-600/20 text-blue-400 border border-blue-500/30 flex items-center justify-center">
              <Gauge className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white">إضافة جهاز قياس / عداد صناعي جديد</h2>
              <p className="text-xs text-slate-400">
                تسجيل ضواغط الهواء، الجلرات، البويلرات، أو محطات الطاقة مع تخصيص معايير ووحدات القراءة
              </p>
            </div>
          </div>
          <button
            onClick={() => setIsCreateDeviceOpen(false)}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-[#334155] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6 max-h-[80vh] overflow-y-auto">
          {/* Category Selector with Quick Preset */}
          <div className="space-y-2">
            <label className="text-xs font-semibold text-slate-300">
              نوع الجهاز ومجال الخدمة المصنعية *
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              <button
                type="button"
                onClick={() => applyCategoryDefaults('COMPRESSOR')}
                className={`p-3 rounded-lg border text-right transition-all flex flex-col gap-1 ${
                  category === 'COMPRESSOR'
                    ? 'bg-blue-600/20 border-blue-500 text-white shadow-sm'
                    : 'bg-[#0f172a] border-[#334155] text-slate-400 hover:text-slate-200 hover:border-slate-500'
                }`}
              >
                <span className="text-xs font-bold">💨 ضاغط هواء (Compressor)</span>
                <span className="text-[10px] text-slate-400">ضغط، حرارة زيت، تيار</span>
              </button>

              <button
                type="button"
                onClick={() => applyCategoryDefaults('CHILLER')}
                className={`p-3 rounded-lg border text-right transition-all flex flex-col gap-1 ${
                  category === 'CHILLER'
                    ? 'bg-blue-600/20 border-blue-500 text-white shadow-sm'
                    : 'bg-[#0f172a] border-[#334155] text-slate-400 hover:text-slate-200 hover:border-slate-500'
                }`}
              >
                <span className="text-xs font-bold">❄️ مبرد مياه (Chiller)</span>
                <span className="text-[10px] text-slate-400">حرارة التغذية والراجع، غاز</span>
              </button>

              <button
                type="button"
                onClick={() => applyCategoryDefaults('BOILER')}
                className={`p-3 rounded-lg border text-right transition-all flex flex-col gap-1 ${
                  category === 'BOILER'
                    ? 'bg-blue-600/20 border-blue-500 text-white shadow-sm'
                    : 'bg-[#0f172a] border-[#334155] text-slate-400 hover:text-slate-200 hover:border-slate-500'
                }`}
              >
                <span className="text-xs font-bold">🔥 مرجل بخار (Boiler)</span>
                <span className="text-[10px] text-slate-400">ضغط بخار، حرارة عادم</span>
              </button>

              <button
                type="button"
                onClick={() => applyCategoryDefaults('POWER_STATION')}
                className={`p-3 rounded-lg border text-right transition-all flex flex-col gap-1 ${
                  category === 'POWER_STATION'
                    ? 'bg-blue-600/20 border-blue-500 text-white shadow-sm'
                    : 'bg-[#0f172a] border-[#334155] text-slate-400 hover:text-slate-200 hover:border-slate-500'
                }`}
              >
                <span className="text-xs font-bold">⚡ طاقة ومحولات (Power)</span>
                <span className="text-[10px] text-slate-400">جهد، تيار، معامل قدرة</span>
              </button>
            </div>
          </div>

          {/* Basic Device Information */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                كود الجهاز (Tag / Code) *
              </label>
              <input
                type="text"
                required
                value={code}
                onChange={(e) => setCode(e.target.value)}
                placeholder="مثال: CMP-05 أو CHL-03"
                className="w-full bg-[#0f172a] border border-[#334155] rounded-lg px-3 py-2 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 font-mono"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                اسم الجهاز بالعربية *
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="مثال: ضاغط أطلس كوبكو GA-75 #3"
                className="w-full bg-[#0f172a] border border-[#334155] rounded-lg px-3 py-2 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                اسم الجهاز بالإنجليزية (اختياري)
              </label>
              <input
                type="text"
                value={nameEn}
                onChange={(e) => setNameEn(e.target.value)}
                placeholder="e.g. Atlas Copco GA-75 Compressor"
                className="w-full bg-[#0f172a] border border-[#334155] rounded-lg px-3 py-2 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
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
                    {h.name} ({h.nameEn})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                الموقع الدقيق داخل المصنع *
              </label>
              <input
                type="text"
                required
                value={locationName}
                onChange={(e) => setLocationName(e.target.value)}
                placeholder="مثال: محطة الضواغط المركزية - مبنى المرافق"
                className="w-full bg-[#0f172a] border border-[#334155] rounded-lg px-3 py-2 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                دورية أخذ القراءة المطلوبة
              </label>
              <select
                value={readingFrequency}
                onChange={(e) => setReadingFrequency(e.target.value as any)}
                className="w-full bg-[#0f172a] border border-[#334155] rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-blue-500"
              >
                <option value="لكل وردية (Shift)">لكل وردية (Shift) - 3 مرات يومياً</option>
                <option value="يومي (Daily)">يومي (Daily) - مرة صباحاً</option>
                <option value="أسبوعي (Weekly)">أسبوعي (Weekly)</option>
                <option value="مستمر (Continuous)">مستمر عبر لوحة الحساسات (Continuous)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                الشركة الصانعة (Manufacturer)
              </label>
              <input
                type="text"
                value={manufacturer}
                onChange={(e) => setManufacturer(e.target.value)}
                placeholder="مثال: Atlas Copco, Trane, Clayton, ABB"
                className="w-full bg-[#0f172a] border border-[#334155] rounded-lg px-3 py-2 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                الموديل ورقم الطراز
              </label>
              <input
                type="text"
                value={model}
                onChange={(e) => setModel(e.target.value)}
                placeholder="مثال: VSD+ 90kW / Series R"
                className="w-full bg-[#0f172a] border border-[#334155] rounded-lg px-3 py-2 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
              />
            </div>
          </div>

          {/* DYNAMIC PARAMETERS BUILDER SECTION */}
          <div className="border border-[#334155] rounded-xl p-4 bg-[#0f172a]/60 space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <Sliders className="w-4 h-4 text-blue-400" />
                  معايير القياس والوحدات المطلوب مراقبتها لهذا الجهاز
                </h3>
                <p className="text-[11px] text-slate-400">
                  حدد ما تريد أن يقرأه الفني في كل وردية (الضغط، الحرارة، الأمبير، إلخ) مع النطاقات الآمنة
                </p>
              </div>
              <button
                type="button"
                onClick={handleAddParameter}
                className="px-3 py-1.5 bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold rounded-lg flex items-center gap-1.5 transition-colors shadow-sm"
              >
                <Plus className="w-3.5 h-3.5" />
                إضافة معيار قراءة
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
                        placeholder="مثال: ضغط الهواء الخارج أو حرارة الزيت"
                        className="w-full bg-[#0f172a] border border-[#334155] rounded px-2.5 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
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
                          placeholder="مثال: Bar, °C"
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
              ملاحظات تشغيلية أو تعليمات أخذ القراءة
            </label>
            <textarea
              rows={2}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="مثال: تؤخذ القراءة أثناء الحمل الكامل (Under Load) للضاغط بعد 10 دقائق من الإقلاع..."
              className="w-full bg-[#0f172a] border border-[#334155] rounded-lg px-3 py-2 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
            />
          </div>

          {/* Modal Footer */}
          <div className="pt-4 border-t border-[#334155] flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={() => setIsCreateDeviceOpen(false)}
              className="px-4 py-2 bg-[#334155] hover:bg-[#475569] text-white text-xs font-semibold rounded-lg transition-colors"
            >
              إلغاء
            </button>
            <button
              type="submit"
              className="px-5 py-2 bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold rounded-lg flex items-center gap-1.5 shadow-md shadow-blue-600/30 transition-all"
            >
              <Plus className="w-4 h-4" />
              حفظ وتثبيت جهاز العداد الجديد
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
