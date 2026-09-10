import React, { useState } from 'react';
import { 
  Gauge, 
  Plus, 
  Search, 
  Sliders, 
  CheckCircle2, 
  AlertTriangle, 
  AlertOctagon, 
  Edit3, 
  Trash2, 
  Clock, 
  Calendar, 
  User, 
  Activity, 
  Wind, 
  Flame, 
  Zap, 
  Droplets, 
  Layers,
  FileSpreadsheet,
  Download,
  Filter
} from 'lucide-react';
import { useCMMS } from '../../context/CMMSContext';
import { MeterDeviceCategory, MeterDevice } from '../../types';
import { CreateMeterDeviceModal } from './CreateMeterDeviceModal';
import { EditMeterDeviceModal } from './EditMeterDeviceModal';
import { LogDeviceReadingModal } from './LogDeviceReadingModal';

export const MetersManager: React.FC = () => {
  const { 
    meterDevices, 
    deviceReadingLogs, 
    deleteMeterDevice, 
    deleteDeviceReading,
    requestDeleteConfirmation,
    setIsCreateDeviceOpen, 
    setSelectedDeviceForReading, 
    setEditingMeterDevice,
    checkPermission
  } = useCMMS();

  const [activeCategoryFilter, setActiveCategoryFilter] = useState<MeterDeviceCategory | 'ALL'>('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeSubView, setActiveSubView] = useState<'DEVICES' | 'READINGS_LOG'>('DEVICES');

  // Filtered devices
  const filteredDevices = meterDevices.filter((d) => {
    const matchesCategory = activeCategoryFilter === 'ALL' || d.category === activeCategoryFilter;
    const matchesSearch = 
      d.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      d.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
      d.locationName.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  // Filtered reading logs
  const filteredLogs = deviceReadingLogs.filter((log) => {
    const matchesCategory = activeCategoryFilter === 'ALL' || log.deviceCategory === activeCategoryFilter;
    const matchesSearch = 
      log.deviceName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.deviceId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.loggedBy.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  // Statistics
  const totalDevices = meterDevices.length;
  const operationalCount = meterDevices.filter((d) => d.status === 'OPERATIONAL').length;
  const warningCount = meterDevices.filter((d) => d.status === 'WARNING').length;
  const todayLogsCount = deviceReadingLogs.filter(
    (l) => l.date === new Date().toISOString().slice(0, 10)
  ).length;

  const handleDeleteDevice = (device: MeterDevice) => {
    if (!checkPermission('canManageMeters', 'حذف جهاز قياس وعداد صناعي')) return;
    requestDeleteConfirmation({
      title: 'حذف جهاز قياس وعداد',
      message: `هل أنت متأكد من رغبتك في حذف جهاز القياس [${device.name}] (${device.code}) نهائياً من المنظومة؟`,
      itemDetails: `${device.code} - ${device.name} (${device.location})`,
      confirmLabel: 'حذف جهاز القياس',
      onConfirm: () => {
        deleteMeterDevice(device.id);
      },
    });
  };

  const getCategoryIcon = (cat: MeterDeviceCategory) => {
    switch (cat) {
      case 'COMPRESSOR':
        return <Wind className="w-4 h-4 text-sky-400" />;
      case 'CHILLER':
        return <Droplets className="w-4 h-4 text-cyan-400" />;
      case 'BOILER':
        return <Flame className="w-4 h-4 text-amber-400" />;
      case 'POWER_STATION':
        return <Zap className="w-4 h-4 text-yellow-400" />;
      default:
        return <Gauge className="w-4 h-4 text-blue-400" />;
    }
  };

  const getCategoryBadge = (cat: MeterDeviceCategory) => {
    switch (cat) {
      case 'COMPRESSOR':
        return <span className="px-2 py-0.5 rounded text-[11px] font-semibold bg-sky-500/10 text-sky-400 border border-sky-500/20">ضواغط هواء (Compressors)</span>;
      case 'CHILLER':
        return <span className="px-2 py-0.5 rounded text-[11px] font-semibold bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">شيلرات وتبريد (Chillers)</span>;
      case 'BOILER':
        return <span className="px-2 py-0.5 rounded text-[11px] font-semibold bg-amber-500/10 text-amber-400 border border-amber-500/20">مراجل وبويلر (Boilers)</span>;
      case 'POWER_STATION':
        return <span className="px-2 py-0.5 rounded text-[11px] font-semibold bg-yellow-500/10 text-yellow-400 border border-yellow-500/20">طاقة ومحولات (Power)</span>;
      case 'WATER_TREATMENT':
        return <span className="px-2 py-0.5 rounded text-[11px] font-semibold bg-blue-500/10 text-blue-400 border border-blue-500/20">معالجة مياه (RO)</span>;
      default:
        return <span className="px-2 py-0.5 rounded text-[11px] font-semibold bg-slate-500/10 text-slate-400 border border-slate-500/20">مرافق أخرى</span>;
    }
  };

  return (
    <div className="space-y-6" dir="rtl">
      {/* Header & Title */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-[#1e293b] p-5 rounded-xl border border-[#334155] shadow-lg">
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-xl bg-blue-600/20 text-blue-400 border border-blue-500/30 flex items-center justify-center shadow-inner">
            <Gauge className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-bold text-white">منظومة أجهزة القياس والعدادات المركزية</h1>
              <span className="px-2.5 py-0.5 text-[11px] font-bold rounded-full bg-blue-500/10 text-blue-400 border border-blue-500/20">
                Meters & Instrumentation
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-1">
              مراقبة متخصصة لكل ضاغط هواء، جلر، بويلر، ومحطة طاقة مع إمكانية إضافة وتخصيص معايير القياس ووحداتها
            </p>
          </div>
        </div>

        {/* Top Action Buttons */}
        <div className="flex flex-wrap items-center gap-2.5">
          <button
            onClick={() => {
              if (!checkPermission('canManageMeters', 'تسجيل قراءة عداد جديدة')) return;
              if (meterDevices.length > 0) {
                setSelectedDeviceForReading(meterDevices[0]);
              }
            }}
            className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold rounded-lg flex items-center gap-1.5 shadow-md shadow-emerald-600/20 transition-all"
          >
            <Activity className="w-4 h-4" />
            تسجيل قراءة وردية
          </button>

          <button
            onClick={() => {
              if (!checkPermission('canManageMeters', 'إضافة جهاز عداد جديد')) return;
              setIsCreateDeviceOpen(true);
            }}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold rounded-lg flex items-center gap-1.5 shadow-md shadow-blue-600/20 transition-all"
          >
            <Plus className="w-4 h-4" />
            إضافة جهاز عداد جديد
          </button>
        </div>
      </div>

      {/* KPI Stats Strip */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="bg-[#1e293b] border border-[#334155] rounded-xl p-4 flex items-center justify-between">
          <div>
            <span className="text-xs text-slate-400 font-medium">أجهزة القياس المسجلة</span>
            <div className="text-2xl font-bold text-white mt-1 font-mono">{totalDevices}</div>
            <span className="text-[10px] text-slate-400">ضواغط، جلرات، بويلر، طاقة</span>
          </div>
          <div className="w-10 h-10 rounded-lg bg-blue-500/10 text-blue-400 flex items-center justify-center">
            <Gauge className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-[#1e293b] border border-[#334155] rounded-xl p-4 flex items-center justify-between">
          <div>
            <span className="text-xs text-slate-400 font-medium">جاهزة ومستقرة</span>
            <div className="text-2xl font-bold text-emerald-400 mt-1 font-mono">{operationalCount}</div>
            <span className="text-[10px] text-emerald-500/80">ضمن الحدود الآمنة</span>
          </div>
          <div className="w-10 h-10 rounded-lg bg-emerald-500/10 text-emerald-400 flex items-center justify-center">
            <CheckCircle2 className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-[#1e293b] border border-[#334155] rounded-xl p-4 flex items-center justify-between">
          <div>
            <span className="text-xs text-slate-400 font-medium">تحت الملاحظة / تحذير</span>
            <div className="text-2xl font-bold text-amber-400 mt-1 font-mono">{warningCount}</div>
            <span className="text-[10px] text-amber-500/80">تجاوزت بعض القيم</span>
          </div>
          <div className="w-10 h-10 rounded-lg bg-amber-500/10 text-amber-400 flex items-center justify-center">
            <AlertTriangle className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-[#1e293b] border border-[#334155] rounded-xl p-4 flex items-center justify-between">
          <div>
            <span className="text-xs text-slate-400 font-medium">قراءات اليوم المسجلة</span>
            <div className="text-2xl font-bold text-sky-400 mt-1 font-mono">{todayLogsCount}</div>
            <span className="text-[10px] text-slate-400">من إجمالي {deviceReadingLogs.length} قراءة</span>
          </div>
          <div className="w-10 h-10 rounded-lg bg-sky-500/10 text-sky-400 flex items-center justify-center">
            <Clock className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* Navigation Sub-Tabs & Filters */}
      <div className="bg-[#1e293b] p-3 rounded-xl border border-[#334155] flex flex-col md:flex-row md:items-center justify-between gap-3">
        {/* Main View Toggle */}
        <div className="flex items-center gap-1.5 bg-[#0f172a] p-1 rounded-lg border border-[#334155]">
          <button
            onClick={() => setActiveSubView('DEVICES')}
            className={`px-3.5 py-1.5 rounded-md text-xs font-bold transition-all flex items-center gap-1.5 ${
              activeSubView === 'DEVICES'
                ? 'bg-blue-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Gauge className="w-3.5 h-3.5" />
            أجهزة العدادات والمعدات ({filteredDevices.length})
          </button>

          <button
            onClick={() => setActiveSubView('READINGS_LOG')}
            className={`px-3.5 py-1.5 rounded-md text-xs font-bold transition-all flex items-center gap-1.5 ${
              activeSubView === 'READINGS_LOG'
                ? 'bg-blue-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Activity className="w-3.5 h-3.5" />
            سجل القراءات اليومي والتاريخي ({filteredLogs.length})
          </button>
        </div>

        {/* Search Input */}
        <div className="relative w-full md:w-72">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="بحث بالاسم، الكود، أو الموقع..."
            className="w-full bg-[#0f172a] border border-[#334155] rounded-lg pl-3 pr-9 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
          />
          <Search className="w-4 h-4 text-slate-500 absolute right-3 top-2.5" />
        </div>
      </div>

      {/* Equipment Category Filters */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs">
        <button
          onClick={() => setActiveCategoryFilter('ALL')}
          className={`px-3 py-1.5 rounded-lg font-semibold whitespace-nowrap transition-all flex items-center gap-1.5 ${
            activeCategoryFilter === 'ALL'
              ? 'bg-blue-600 text-white shadow-sm'
              : 'bg-[#1e293b] text-slate-400 hover:text-white border border-[#334155]'
          }`}
        >
          <Layers className="w-3.5 h-3.5" />
          كافة المرافق ({meterDevices.length})
        </button>

        <button
          onClick={() => setActiveCategoryFilter('COMPRESSOR')}
          className={`px-3 py-1.5 rounded-lg font-semibold whitespace-nowrap transition-all flex items-center gap-1.5 ${
            activeCategoryFilter === 'COMPRESSOR'
              ? 'bg-sky-600 text-white shadow-sm'
              : 'bg-[#1e293b] text-slate-400 hover:text-white border border-[#334155]'
          }`}
        >
          <Wind className="w-3.5 h-3.5" />
          ضواغط الهواء ({meterDevices.filter((d) => d.category === 'COMPRESSOR').length})
        </button>

        <button
          onClick={() => setActiveCategoryFilter('CHILLER')}
          className={`px-3 py-1.5 rounded-lg font-semibold whitespace-nowrap transition-all flex items-center gap-1.5 ${
            activeCategoryFilter === 'CHILLER'
              ? 'bg-cyan-600 text-white shadow-sm'
              : 'bg-[#1e293b] text-slate-400 hover:text-white border border-[#334155]'
          }`}
        >
          <Droplets className="w-3.5 h-3.5" />
          مبردات المياه والجلرات ({meterDevices.filter((d) => d.category === 'CHILLER').length})
        </button>

        <button
          onClick={() => setActiveCategoryFilter('BOILER')}
          className={`px-3 py-1.5 rounded-lg font-semibold whitespace-nowrap transition-all flex items-center gap-1.5 ${
            activeCategoryFilter === 'BOILER'
              ? 'bg-amber-600 text-white shadow-sm'
              : 'bg-[#1e293b] text-slate-400 hover:text-white border border-[#334155]'
          }`}
        >
          <Flame className="w-3.5 h-3.5" />
          المراجل والبويلرات ({meterDevices.filter((d) => d.category === 'BOILER').length})
        </button>

        <button
          onClick={() => setActiveCategoryFilter('POWER_STATION')}
          className={`px-3 py-1.5 rounded-lg font-semibold whitespace-nowrap transition-all flex items-center gap-1.5 ${
            activeCategoryFilter === 'POWER_STATION'
              ? 'bg-yellow-600 text-white shadow-sm'
              : 'bg-[#1e293b] text-slate-400 hover:text-white border border-[#334155]'
          }`}
        >
          <Zap className="w-3.5 h-3.5" />
          محطات وتوزيع الطاقة ({meterDevices.filter((d) => d.category === 'POWER_STATION').length})
        </button>

        <button
          onClick={() => setActiveCategoryFilter('WATER_TREATMENT')}
          className={`px-3 py-1.5 rounded-lg font-semibold whitespace-nowrap transition-all flex items-center gap-1.5 ${
            activeCategoryFilter === 'WATER_TREATMENT'
              ? 'bg-blue-600 text-white shadow-sm'
              : 'bg-[#1e293b] text-slate-400 hover:text-white border border-[#334155]'
          }`}
        >
          <Droplets className="w-3.5 h-3.5" />
          معالجة المياه ({meterDevices.filter((d) => d.category === 'WATER_TREATMENT').length})
        </button>
      </div>

      {/* SUBVIEW 1: METER DEVICES CARDS GRID */}
      {activeSubView === 'DEVICES' && (
        <div className="space-y-4">
          {filteredDevices.length === 0 ? (
            <div className="p-12 text-center bg-[#1e293b] rounded-xl border border-[#334155] text-slate-400">
              <Gauge className="w-12 h-12 mx-auto text-slate-500 mb-3 opacity-50" />
              <p className="text-sm font-semibold text-slate-300">لم يتم العثور على أجهزة قياس مطابقة للبحث أو الفئة</p>
              <p className="text-xs text-slate-500 mt-1">يمكنك إضافة جهاز عداد جديد وتحديد المعايير والوحدات التي تريد قراءتها</p>
              <button
                onClick={() => setIsCreateDeviceOpen(true)}
                className="mt-4 px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold rounded-lg inline-flex items-center gap-1.5 transition-colors"
              >
                <Plus className="w-4 h-4" />
                إضافة جهاز الآن
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
              {filteredDevices.map((device) => (
                <div
                  key={device.id}
                  className="bg-[#1e293b] border border-[#334155] rounded-xl overflow-hidden hover:border-slate-500 transition-all flex flex-col justify-between shadow-md group"
                >
                  {/* Card Header */}
                  <div className="p-4 border-b border-[#334155] bg-[#0f172a]/40">
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-center gap-2.5">
                        <div className="w-9 h-9 rounded-lg bg-[#0f172a] border border-[#334155] flex items-center justify-center">
                          {getCategoryIcon(device.category)}
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-mono text-xs font-bold text-blue-400 bg-blue-950/60 px-2 py-0.5 rounded border border-blue-800/40">
                              {device.code}
                            </span>
                            {getCategoryBadge(device.category)}
                          </div>
                          <h3 className="text-sm font-bold text-white mt-1 group-hover:text-blue-300 transition-colors">
                            {device.name}
                          </h3>
                        </div>
                      </div>

                      {/* Status Indicator */}
                      <div>
                        {device.status === 'OPERATIONAL' && (
                          <span className="px-2 py-0.5 text-[10px] font-bold rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                            طبيعي
                          </span>
                        )}
                        {device.status === 'WARNING' && (
                          <span className="px-2 py-0.5 text-[10px] font-bold rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/20">
                            تحذير
                          </span>
                        )}
                        {device.status === 'MAINTENANCE' && (
                          <span className="px-2 py-0.5 text-[10px] font-bold rounded-full bg-purple-500/10 text-purple-400 border border-purple-500/20">
                            صيانة
                          </span>
                        )}
                        {device.status === 'OFFLINE' && (
                          <span className="px-2 py-0.5 text-[10px] font-bold rounded-full bg-slate-500/10 text-slate-400 border border-slate-500/20">
                            احتياطي
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center justify-between text-[11px] text-slate-400 mt-3 pt-2 border-t border-[#334155]/60">
                      <span>{device.locationName}</span>
                      <span className="text-slate-500">{device.readingFrequency}</span>
                    </div>
                  </div>

                  {/* Card Body: Monitored Parameters */}
                  <div className="p-4 space-y-3 flex-1">
                    <div className="flex items-center justify-between text-[11px] font-bold text-slate-400">
                      <span className="flex items-center gap-1">
                        <Sliders className="w-3.5 h-3.5 text-blue-400" />
                        المعايير المقروءة ({device.parameters.length}):
                      </span>
                      {device.lastReadingDate ? (
                        <span className="text-[10px] text-slate-500 font-mono">
                          آخر قراءة: {device.lastReadingDate}
                        </span>
                      ) : (
                        <span className="text-[10px] text-slate-500">لا توجد قراءة مسجلة بعد</span>
                      )}
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                      {device.parameters.map((param) => {
                        const lastVal = device.lastReadingValues?.[param.id];
                        const isOverMax = param.maxThreshold && lastVal !== undefined && lastVal > param.maxThreshold;
                        const isUnderMin = param.minThreshold && lastVal !== undefined && lastVal < param.minThreshold;

                        return (
                          <div
                            key={param.id}
                            className={`p-2 rounded-lg border text-right transition-colors ${
                              isOverMax || isUnderMin
                                ? 'bg-amber-950/20 border-amber-500/30 text-amber-200'
                                : 'bg-[#0f172a] border-[#334155] text-slate-300'
                            }`}
                          >
                            <div className="text-[10px] text-slate-400 truncate mb-1" title={param.name}>
                              {param.name}
                            </div>
                            <div className="flex items-baseline justify-between font-mono">
                              <span className="text-sm font-bold text-white">
                                {lastVal !== undefined ? lastVal : '-'}
                              </span>
                              <span className="text-[10px] text-slate-400 font-sans mr-1">
                                {param.unit}
                              </span>
                            </div>
                            <div className="text-[9px] text-slate-500 mt-1 truncate">
                              النطاق: {param.minThreshold ?? 0} ~ {param.maxThreshold ?? '-'}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Card Actions Footer - Including Edit Button requested by user! */}
                  <div className="p-3 bg-[#0f172a]/70 border-t border-[#334155] flex items-center justify-between gap-2">
                    <button
                      onClick={() => {
                        if (!checkPermission('canManageMeters', 'تسجيل قراءة عداد جديدة')) return;
                        setSelectedDeviceForReading(device);
                      }}
                      className="flex-1 py-1.5 px-3 bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold rounded-lg flex items-center justify-center gap-1.5 transition-colors shadow-sm"
                    >
                      <Activity className="w-3.5 h-3.5" />
                      تسجيل قراءة
                    </button>

                    {/* Prominent Edit Button */}
                    <button
                      onClick={() => {
                        if (!checkPermission('canManageMeters', 'تعديل بيانات ومعايير جهاز العداد')) return;
                        setEditingMeterDevice(device);
                      }}
                      className="py-1.5 px-3 bg-[#334155] hover:bg-slate-600 text-slate-200 hover:text-white text-xs font-semibold rounded-lg flex items-center gap-1.5 transition-colors"
                      title="تعديل بيانات الجهاز والمعايير"
                    >
                      <Edit3 className="w-3.5 h-3.5 text-amber-400" />
                      تعديل
                    </button>

                    <button
                      onClick={() => handleDeleteDevice(device)}
                      className="p-1.5 text-slate-400 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
                      title="حذف الجهاز"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* SUBVIEW 2: HISTORICAL READINGS LOG TABLE */}
      {activeSubView === 'READINGS_LOG' && (
        <div className="bg-[#1e293b] border border-[#334155] rounded-xl overflow-hidden shadow-lg space-y-4">
          <div className="p-4 border-b border-[#334155] flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Activity className="w-5 h-5 text-blue-400" />
              <div>
                <h3 className="text-sm font-bold text-white">سجل قراءات العدادات اليومية والتاريخية</h3>
                <p className="text-xs text-slate-400">توثيق القراءات لكل وردية مع التحقق التلقائي من الحدود الآمنة</p>
              </div>
            </div>

            <div className="text-xs text-slate-400 font-mono">
              إجمالي السجلات: <span className="text-white font-bold">{filteredLogs.length}</span>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-right text-xs">
              <thead className="bg-[#0f172a] text-slate-400 border-b border-[#334155]">
                <tr>
                  <th className="py-3 px-4">رقم القراءة</th>
                  <th className="py-3 px-4">الجهاز والمعدة</th>
                  <th className="py-3 px-4">التاريخ والوقت</th>
                  <th className="py-3 px-4">الوردية والفني</th>
                  <th className="py-3 px-4">القيم والبارامترات المسجلة</th>
                  <th className="py-3 px-4 text-center">التقييم التشغيلي</th>
                  <th className="py-3 px-4 text-center">الإجراء</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#334155]">
                {filteredLogs.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="py-8 text-center text-slate-500">
                      لا توجد سجلات قراءات مدخلة تطابق البحث
                    </td>
                  </tr>
                ) : (
                  filteredLogs.map((log) => {
                    const dev = meterDevices.find((d) => d.id === log.deviceId);

                    return (
                      <tr key={log.id} className="hover:bg-[#0f172a]/40 transition-colors">
                        <td className="py-3 px-4 font-mono text-slate-400 text-[11px]">
                          {log.id}
                        </td>
                        <td className="py-3 px-4">
                          <div className="font-bold text-white">{log.deviceName}</div>
                          <div className="text-[10px] text-slate-400 font-mono">{log.deviceId}</div>
                        </td>
                        <td className="py-3 px-4 font-mono">
                          <div className="text-slate-200">{log.date}</div>
                          <div className="text-[10px] text-slate-400">{log.time}</div>
                        </td>
                        <td className="py-3 px-4">
                          <div className="text-slate-300 font-medium">{log.shift}</div>
                          <div className="text-[11px] text-slate-400 flex items-center gap-1 mt-0.5">
                            <User className="w-3 h-3 text-blue-400" />
                            {log.loggedBy}
                          </div>
                        </td>
                        <td className="py-3 px-4">
                          <div className="flex flex-wrap gap-1.5 max-w-md">
                            {Object.entries(log.values).map(([pId, val]) => {
                              const param = dev?.parameters.find((p) => p.id === pId);
                              const isOverMax = param?.maxThreshold && val > param.maxThreshold;
                              const isUnderMin = param?.minThreshold && val < param.minThreshold;

                              return (
                                <span
                                  key={pId}
                                  className={`px-2 py-0.5 rounded text-[11px] font-mono border ${
                                    isOverMax || isUnderMin
                                      ? 'bg-amber-950/40 text-amber-300 border-amber-500/40'
                                      : 'bg-[#0f172a] text-slate-300 border-[#334155]'
                                  }`}
                                >
                                  {param?.name || pId}: <strong className="text-white">{val}</strong> {param?.unit || ''}
                                </span>
                              );
                            })}
                          </div>
                          {log.notes && (
                            <p className="text-[11px] text-slate-400 mt-1 italic">
                              ملاحظات: "{log.notes}"
                            </p>
                          )}
                        </td>
                        <td className="py-3 px-4 text-center">
                          {log.status === 'NORMAL' && (
                            <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 inline-flex items-center gap-1">
                              <CheckCircle2 className="w-3 h-3" />
                              طبيعي ومطابق
                            </span>
                          )}
                          {log.status === 'WARNING' && (
                            <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-amber-500/10 text-amber-400 border border-amber-500/20 inline-flex items-center gap-1">
                              <AlertTriangle className="w-3 h-3" />
                              تنبيه في القيم
                            </span>
                          )}
                          {log.status === 'CRITICAL' && (
                            <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-red-500/10 text-red-400 border border-red-500/20 inline-flex items-center gap-1 animate-pulse">
                              <AlertOctagon className="w-3 h-3" />
                              حرج - إنذار فوري
                            </span>
                          )}
                        </td>
                        <td className="py-3 px-4 text-center">
                          <button
                            onClick={() => {
                              if (!checkPermission('canManageMeters', 'حذف سجل قراءة عداد')) return;
                              requestDeleteConfirmation({
                                title: 'حذف سجل قراءة عداد',
                                message: `هل أنت متأكد من رغبتك في حذف سجل قراءة العداد المؤرخ في [${log.date} ${log.time}] للأصل [${log.deviceName}]؟`,
                                itemDetails: `${log.id} - ${log.deviceName} (${log.date} ${log.time})`,
                                confirmLabel: 'حذف سجل القراءة',
                                onConfirm: () => {
                                  deleteDeviceReading(log.id);
                                },
                              });
                            }}
                            className="p-1 text-slate-400 hover:text-red-400 rounded hover:bg-red-500/10 transition-colors"
                            title="حذف السجل"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Modals */}
      <CreateMeterDeviceModal />
      <EditMeterDeviceModal />
      <LogDeviceReadingModal />
    </div>
  );
};
