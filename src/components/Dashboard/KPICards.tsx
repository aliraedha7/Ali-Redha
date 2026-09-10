import React from 'react';
import { 
  CheckCircle2, 
  AlertOctagon, 
  Clock, 
  Wrench, 
  Layers, 
  ShieldAlert,
  Percent,
  Zap
} from 'lucide-react';
import { useCMMS } from '../../context/CMMSContext';

export const KPICards: React.FC = () => {
  const { kpis, setActiveTab } = useCMMS();

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
      {/* 1. Total Plant Assets */}
      <div 
        onClick={() => setActiveTab('assets')}
        className="bg-[#1e293b] p-5 rounded-xl border border-[#334155] hover:border-blue-500/50 transition-all cursor-pointer shadow-md group flex flex-col justify-between"
      >
        <div>
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-semibold text-slate-400">إجمالي الأصول</span>
            <Layers className="w-4 h-4 text-blue-400 group-hover:scale-110 transition-transform" />
          </div>
          <div className="text-3xl font-bold font-mono text-white">
            {kpis.totalAssets}
          </div>
        </div>
        <div className="text-[11px] text-slate-400 mt-2 flex items-center justify-between pt-2 border-t border-[#334155]/60">
          <span>7 جمالين ومحطات</span>
          <span className="text-blue-400 font-mono font-bold">100% مسجل</span>
        </div>
      </div>

      {/* 2. Operational Assets */}
      <div 
        onClick={() => setActiveTab('assets')}
        className="bg-[#1e293b] p-5 rounded-xl border border-[#334155] hover:border-green-500/50 transition-all cursor-pointer shadow-md group flex flex-col justify-between"
      >
        <div>
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-semibold text-slate-400">جاهز للعمل</span>
            <CheckCircle2 className="w-4 h-4 text-green-500 group-hover:scale-110 transition-transform" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-bold font-mono text-white">
              {kpis.operationalAssets}
            </span>
            <span className="text-xs text-slate-400 font-mono">
              + {kpis.standbyAssets} ستاندباي
            </span>
          </div>
        </div>
        <div className="text-[11px] text-green-400 mt-2 flex items-center gap-1.5 pt-2 border-t border-[#334155]/60">
          <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-ping" />
          <span>خطوط إنتاج نشطة</span>
        </div>
      </div>

      {/* 3. Down / Stoppage */}
      <div 
        onClick={() => setActiveTab('work-orders')}
        className={`p-5 rounded-xl border transition-all cursor-pointer shadow-md group flex flex-col justify-between ${
          kpis.stoppedAssets > 0 
            ? 'bg-[#1e293b] border-red-500/60 hover:border-red-400' 
            : 'bg-[#1e293b] border-[#334155]'
        }`}
      >
        <div>
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-semibold text-slate-400">التوقفات الطارئة</span>
            <AlertOctagon className={`w-4 h-4 ${kpis.stoppedAssets > 0 ? 'text-red-500 animate-bounce' : 'text-slate-500'}`} />
          </div>
          <div className={`text-3xl font-bold font-mono ${kpis.stoppedAssets > 0 ? 'text-red-500' : 'text-white'}`}>
            {kpis.stoppedAssets}
          </div>
        </div>
        <div className="text-[11px] mt-2 pt-2 border-t border-[#334155]/60">
          {kpis.stoppedAssets > 0 ? (
            <span className="text-red-400 font-bold flex items-center gap-1">
              <ShieldAlert className="w-3 h-3" /> استجابة صيانة فورية
            </span>
          ) : (
            <span className="text-slate-400">لا توجد توقفات حرجة</span>
          )}
        </div>
      </div>

      {/* 4. Availability % */}
      <div className="bg-[#1e293b] p-5 rounded-xl border border-[#334155] shadow-md flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-semibold text-slate-400">جاهزية المصنع (Availability)</span>
            <Percent className="w-4 h-4 text-green-500" />
          </div>
          <div className="flex items-baseline justify-between">
            <span className="text-3xl font-bold font-mono text-white">
              {kpis.availabilityRate}%
            </span>
            <span className="text-green-500 text-xs font-mono font-bold">↑ 1.2%</span>
          </div>
        </div>
        <div className="text-[11px] text-slate-400 mt-2 flex items-center justify-between pt-2 border-t border-[#334155]/60">
          <span>الهدف المصنعي:</span>
          <span className="font-mono text-slate-300 font-bold">≥ 98.0%</span>
        </div>
      </div>

      {/* 5. MTTR (Mean Time to Repair) */}
      <div className="bg-[#1e293b] p-5 rounded-xl border border-[#334155] shadow-md flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-semibold text-slate-400">متوسط وقت الإصلاح (MTTR)</span>
            <Clock className="w-4 h-4 text-blue-400" />
          </div>
          <div className="flex items-baseline justify-between">
            <span className="text-3xl font-bold font-mono text-white">
              {kpis.mttrHours}
            </span>
            <span className="text-slate-500 text-xs">ساعة / عطل</span>
          </div>
        </div>
        <div className="text-[11px] text-slate-400 mt-2 flex items-center justify-between pt-2 border-t border-[#334155]/60">
          <span>MTBF بين الأعطال:</span>
          <span className="font-mono text-slate-300 font-bold">{kpis.mtbfHours} س</span>
        </div>
      </div>

      {/* 6. Active Work Orders */}
      <div 
        onClick={() => setActiveTab('work-orders')}
        className="bg-[#1e293b] p-5 rounded-xl border border-[#334155] hover:border-blue-500/50 transition-all cursor-pointer shadow-md group flex flex-col justify-between"
      >
        <div>
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-semibold text-slate-400">أوامر العمل المفتوحة</span>
            <Wrench className="w-4 h-4 text-blue-400 group-hover:scale-110 transition-transform" />
          </div>
          <div className="text-3xl font-bold font-mono text-blue-500">
            {kpis.activeWorkOrders}
          </div>
        </div>
        <div className="text-[11px] text-slate-400 mt-2 pt-2 border-t border-[#334155]/60 flex items-center justify-between">
          <span>{kpis.lowStockItemsCount} قطع غيار حرجة</span>
          <span className="text-blue-400 text-[10px] font-bold">عرض ←</span>
        </div>
      </div>
    </div>
  );
};
