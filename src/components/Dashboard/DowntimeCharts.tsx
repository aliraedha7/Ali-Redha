import React from 'react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  LineChart, 
  Line, 
  Legend,
  Cell,
  PieChart,
  Pie
} from 'recharts';
import { 
  TrendingDown, 
  TrendingUp, 
  BarChart3, 
  Clock, 
  AlertTriangle,
  PieChart as PieIcon 
} from 'lucide-react';
import { DOWNTIME_BY_HANGAR_STATS, MONTHLY_AVAILABILITY_TREND } from '../../data/seedData';
import { useCMMS } from '../../context/CMMSContext';

export const DowntimeCharts: React.FC = () => {
  const { workOrders } = useCMMS();

  // Work Orders Type Distribution
  const typeCounts = {
    EMERGENCY_BREAKDOWN: workOrders.filter((wo) => wo.type === 'EMERGENCY_BREAKDOWN').length,
    PREVENTIVE: workOrders.filter((wo) => wo.type === 'PREVENTIVE').length,
    CORRECTIVE: workOrders.filter((wo) => wo.type === 'CORRECTIVE').length,
    INSPECTION: workOrders.filter((wo) => wo.type === 'INSPECTION').length,
  };

  const woTypeData = [
    { name: 'توقف طارئ', count: typeCounts.EMERGENCY_BREAKDOWN, color: '#f43f5e' },
    { name: 'وقائية مجدولة', count: typeCounts.PREVENTIVE, color: '#10b981' },
    { name: 'علاجية وتصحيحية', count: typeCounts.CORRECTIVE, color: '#f59e0b' },
    { name: 'فحص ومعايرة', count: typeCounts.INSPECTION, color: '#06b6d4' },
  ];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
      {/* 1. Downtime Pareto by Hangar */}
      <div className="p-5 rounded-xl bg-[#1e293b] border border-[#334155] shadow-md lg:col-span-2 space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <BarChart3 className="w-4 h-4 text-blue-400" />
            <h3 className="text-sm font-bold text-white">
              تحليل التوقفات حسب قاعات الإنتاج التسع (Downtime Pareto - دقيقة)
            </h3>
          </div>
          <span className="text-xs text-slate-400 font-mono">سبتمبر 2026</span>
        </div>

        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={DOWNTIME_BY_HANGAR_STATS} margin={{ top: 10, right: 10, left: -20, bottom: 20 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
              <XAxis 
                dataKey="name" 
                stroke="#94a3b8" 
                fontSize={11} 
                tick={{ fill: '#94a3b8' }}
                interval={0}
                angle={-15}
                textAnchor="end"
              />
              <YAxis stroke="#94a3b8" fontSize={11} tick={{ fill: '#94a3b8' }} />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: '#0f172a', 
                  borderColor: '#334155', 
                  borderRadius: '0.5rem',
                  color: '#f8fafc',
                  direction: 'rtl',
                  fontSize: '12px'
                }}
                formatter={(value: any) => [`${value} دقيقة توقف`, 'إجمالي التوقف']}
              />
              <Bar dataKey="minutes" name="دقائق التوقف" radius={[4, 4, 0, 0]}>
                {DOWNTIME_BY_HANGAR_STATS.map((entry, index) => (
                  <Cell 
                    key={`cell-${index}`} 
                    fill={entry.minutes > 300 ? '#ef4444' : entry.minutes > 150 ? '#eab308' : '#3b82f6'} 
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="text-[11px] text-slate-400 flex flex-wrap items-center justify-between border-t border-[#334155] pt-2 gap-2">
          <span>* خط الفليكسو يستحوذ على 41.5% من زمن التوقفات بسبب استبدال شفرات الدكتور بليد.</span>
          <span className="text-green-400 font-semibold">محطة التوليد: صفر دقائق توقف</span>
        </div>
      </div>

      {/* 2. Work Orders Type Distribution */}
      <div className="p-5 rounded-xl bg-[#1e293b] border border-[#334155] shadow-md space-y-3">
        <div className="flex items-center gap-2">
          <PieIcon className="w-4 h-4 text-blue-400" />
          <h3 className="text-sm font-bold text-white">توزيع أوامر العمل حسب النوع</h3>
        </div>

        <div className="h-44 w-full flex items-center justify-center">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={woTypeData}
                dataKey="count"
                nameKey="name"
                cx="50%"
                cy="50%"
                innerRadius={42}
                outerRadius={65}
                paddingAngle={4}
              >
                {woTypeData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: '#0f172a', 
                  borderColor: '#334155', 
                  borderRadius: '0.5rem',
                  fontSize: '12px',
                  direction: 'rtl'
                }} 
              />
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div className="space-y-1.5 text-xs">
          {woTypeData.map((item) => (
            <div key={item.name} className="flex items-center justify-between p-2 rounded bg-[#0f172a] border border-[#334155]">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: item.color }} />
                <span className="text-slate-300">{item.name}</span>
              </div>
              <span className="font-mono font-bold text-white">{item.count}</span>
            </div>
          ))}
        </div>
      </div>

      {/* 3. Availability & MTTR Trends (Full row on bottom) */}
      <div className="p-5 rounded-xl bg-[#1e293b] border border-[#334155] shadow-md lg:col-span-3 space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-green-400" />
            <h3 className="text-sm font-bold text-white">
              منحنى نسبة الجاهزية التشغيلية للمعمل (Plant Availability Rate %) ومعدل وقت الإصلاح (MTTR)
            </h3>
          </div>
          <div className="flex items-center gap-4 text-xs font-mono">
            <span className="flex items-center gap-1.5 text-green-400 font-bold">
              <span className="w-2 h-2 rounded-full bg-green-500" />
              الجاهزية (%)
            </span>
            <span className="flex items-center gap-1.5 text-blue-400 font-bold">
              <span className="w-2 h-2 rounded-full bg-blue-500" />
              MTTR (ساعة)
            </span>
          </div>
        </div>

        <div className="h-56 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={MONTHLY_AVAILABILITY_TREND} margin={{ top: 10, right: 10, left: -20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
              <XAxis dataKey="month" stroke="#94a3b8" fontSize={12} tick={{ fill: '#94a3b8' }} />
              <YAxis yAxisId="left" domain={[94, 100]} stroke="#22c55e" fontSize={11} tick={{ fill: '#22c55e' }} />
              <YAxis yAxisId="right" orientation="right" domain={[0, 3]} stroke="#3b82f6" fontSize={11} tick={{ fill: '#3b82f6' }} />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: '#0f172a', 
                  borderColor: '#334155', 
                  borderRadius: '0.5rem',
                  fontSize: '12px',
                  direction: 'rtl'
                }} 
              />
              <Line 
                yAxisId="left" 
                type="monotone" 
                dataKey="availability" 
                name="الجاهزية %" 
                stroke="#22c55e" 
                strokeWidth={3} 
                dot={{ r: 4, fill: '#22c55e' }} 
              />
              <Line 
                yAxisId="right" 
                type="monotone" 
                dataKey="mttr" 
                name="MTTR (ساعة)" 
                stroke="#3b82f6" 
                strokeWidth={2} 
                strokeDasharray="4 4"
                dot={{ r: 3, fill: '#3b82f6' }} 
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};
