import React from 'react';
import { 
  AlertOctagon, 
  ShieldAlert, 
  Wrench, 
  ArrowRight, 
  Clock, 
  Layers, 
  Sparkles,
  Printer,
  ChevronLeft
} from 'lucide-react';
import { useCMMS } from '../../context/CMMSContext';
import { KPICards } from './KPICards';
import { HangarOverview } from './HangarOverview';
import { DowntimeCharts } from './DowntimeCharts';
import { HangarId } from '../../types';

interface DashboardProps {
  onSelectHangar: (hangarId: HangarId) => void;
}

export const Dashboard: React.FC<DashboardProps> = ({ onSelectHangar }) => {
  const { 
    kpis, 
    assets, 
    workOrders, 
    setActiveTab, 
    setSelectedWOForDetail, 
    triggerEmergencyBreakdown,
    setSelectedAssetForModal
  } = useCMMS();

  // Find any stopped machine for critical alert banner
  const stoppedAssets = assets.filter((a) => a.status === 'STOPPED');
  const activeCriticalWOs = workOrders.filter(
    (wo) => wo.priority === 'CRITICAL_STOPPAGE' && wo.status !== 'COMPLETED' && wo.status !== 'CLOSED'
  );

  return (
    <div className="space-y-6">
      {/* Critical Stoppage Emergency Alert Banner (Shown only when machines are stopped) */}
      {stoppedAssets.length > 0 && (
        <div className="p-4 rounded-xl bg-[#1e293b] border border-red-500/80 shadow-xl flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <span className="p-2.5 rounded-lg bg-red-600 text-white shadow-md">
              <AlertOctagon className="w-5 h-5" />
            </span>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-white">
                  إنذار توقف خط إنتاج حرج (CRITICAL MACHINE STOPPAGE)
                </h3>
                <span className="bg-red-600 text-white text-xs font-mono font-bold px-2 py-0.5 rounded-full">
                  {stoppedAssets.length} ماكينة متوقفة
                </span>
              </div>
              <p className="text-xs text-red-300 mt-0.5">
                الماكينات المتأثرة:{' '}
                {stoppedAssets.map((a) => `${a.name} [${a.id}] في ${a.hangarName}`).join(' • ')}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setActiveTab('work-orders')}
              className="bg-red-600 hover:bg-red-700 text-white font-bold px-4 py-2 rounded-lg text-xs shadow-md transition-all flex items-center gap-1.5"
            >
              <span>متابعة أوامر الإصلاح الفوري</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* 1. KPI Cards Row */}
      <KPICards />

      {/* 2. Hangars & Stations Field Overview */}
      <HangarOverview onSelectHangar={onSelectHangar} />

      {/* 3. Downtime Pareto & Availability Charts */}
      <DowntimeCharts />

      {/* 4. Active Work Orders Quick Stream & Plant Shift Status */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Active Work Orders Table */}
        <div className="lg:col-span-2 p-5 rounded-xl bg-[#1e293b] border border-[#334155] shadow-md space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Wrench className="w-4 h-4 text-blue-400" />
              <h3 className="text-sm font-bold text-white">
                أحدث بلاغات وأوامر الصيانة النشطة بالمعمل
              </h3>
            </div>
            <button
              onClick={() => setActiveTab('work-orders')}
              className="text-xs text-blue-400 hover:text-blue-300 font-bold flex items-center gap-1"
            >
              <span>عرض جميع أوامر العمل</span>
              <ChevronLeft className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="space-y-2.5">
            {workOrders.slice(0, 4).map((wo) => (
              <div
                key={wo.id}
                onClick={() => setSelectedWOForDetail(wo)}
                className="p-3.5 rounded-lg bg-[#0f172a] hover:bg-[#1a2333] border border-[#334155] transition-all cursor-pointer flex flex-wrap items-center justify-between gap-3 text-xs"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-bold text-blue-400">{wo.id}</span>
                    <span className="font-mono text-slate-400 font-medium">[{wo.assetId}]</span>
                    <span className="text-white font-semibold">{wo.title}</span>
                  </div>
                  <div className="text-[11px] text-slate-400 flex items-center gap-2">
                    <span>الفني: {wo.assignedTo}</span>
                    <span>•</span>
                    <span className="font-mono">{wo.reportedAt}</span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                    wo.priority === 'CRITICAL_STOPPAGE'
                      ? 'bg-red-500/20 text-red-400 border border-red-500/40'
                      : 'bg-blue-500/20 text-blue-300 border border-blue-500/30'
                  }`}>
                    {wo.priority === 'CRITICAL_STOPPAGE' ? 'توقف خط' : wo.priority}
                  </span>

                  <span className={`px-2.5 py-1 rounded text-[11px] font-bold ${
                    wo.status === 'COMPLETED'
                      ? 'bg-green-500/15 text-green-400 border border-green-500/30'
                      : wo.status === 'IN_PROGRESS'
                      ? 'bg-yellow-500/15 text-yellow-400 border border-yellow-500/30'
                      : 'bg-[#1e293b] text-slate-300 border border-[#334155]'
                  }`}>
                    {wo.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Maintenance Management Brief & Fast Actions */}
        <div className="p-5 rounded-xl bg-[#1e293b] border border-[#334155] shadow-md space-y-4 flex flex-col justify-between">
          <div className="space-y-3">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-blue-400" />
              <span>إجراءات التدخل والتقارير الفورية</span>
            </h3>

            <p className="text-xs text-slate-300 leading-relaxed">
              إدارة الصيانة الشاملة لمعمل المرجان للمطبوعات — المهندس علي رضا. يتم تتبع 43 أصلاً ومحطة تشغيل مركزية مع مراقبة حرجة لكفاءة الـ UPS واستقرار خطوط الطباعة.
            </p>

            <div className="p-3.5 rounded-lg bg-[#0f172a] border border-[#334155] space-y-1.5 text-xs">
              <div className="flex justify-between text-slate-400">
                <span>الوردية الحالية:</span>
                <span className="text-blue-400 font-bold font-sans">الصباحية الأولى (A)</span>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>مهندس النوبة المناوب:</span>
                <span className="text-white font-bold font-sans">م. كريم السعدي</span>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>تاريخ التقرير:</span>
                <span className="text-slate-300 font-mono">04 سبتمبر 2026</span>
              </div>
            </div>
          </div>

          <div className="space-y-2 pt-2 border-t border-[#334155]">
            <button
              onClick={() => triggerEmergencyBreakdown()}
              className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-2.5 px-4 rounded-lg text-xs shadow-md shadow-red-600/20 transition-all flex items-center justify-center gap-2"
            >
              <ShieldAlert className="w-4 h-4" />
              <span>إصدار بلاغ عطل طارئ وتوقف خط</span>
            </button>

            <button
              onClick={() => setActiveTab('preventive')}
              className="w-full bg-[#0f172a] hover:bg-[#1a2333] text-slate-200 font-bold py-2.5 px-4 rounded-lg text-xs border border-[#334155] transition-colors flex items-center justify-center gap-2"
            >
              <span>تسجيل قراءة عدادات الوردية</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
