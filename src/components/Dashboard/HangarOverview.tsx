import React from 'react';
import { 
  Layers, 
  Printer, 
  Film, 
  Package, 
  Gauge, 
  Zap, 
  CheckCircle2, 
  AlertTriangle, 
  AlertOctagon, 
  ChevronLeft,
  Activity,
  BatteryCharging,
  Plus,
  Building2,
  Cpu,
  User,
  Trash2,
  Edit3
} from 'lucide-react';
import { useCMMS } from '../../context/CMMSContext';
import { HangarId } from '../../types';

interface HangarOverviewProps {
  onSelectHangar?: (hangarId: HangarId) => void;
}

export const HangarOverview: React.FC<HangarOverviewProps> = ({ onSelectHangar }) => {
  const { 
    hangars, 
    assets, 
    setActiveTab, 
    setIsCreateHallOpen, 
    setEditingHangar,
    setIsCreateAssetOpen,
    setPreselectedHallForAsset,
    deleteHangar,
    requestDeleteConfirmation
  } = useCMMS();

  const getHangarIcon = (iconType: string) => {
    switch (iconType) {
      case 'printer':
        return <Printer className="w-5 h-5 text-blue-400" />;
      case 'film':
        return <Film className="w-5 h-5 text-cyan-400" />;
      case 'package':
        return <Package className="w-5 h-5 text-amber-400" />;
      case 'gauge':
        return <Gauge className="w-5 h-5 text-emerald-400" />;
      case 'tool':
        return <Layers className="w-5 h-5 text-rose-400" />;
      case 'layers':
        return <Layers className="w-5 h-5 text-purple-400" />;
      case 'zap':
        return <Zap className="w-5 h-5 text-yellow-400" />;
      default:
        return <Layers className="w-5 h-5 text-blue-400" />;
    }
  };

  const handleAddMachineToHall = (e: React.MouseEvent, hallId: string) => {
    e.stopPropagation();
    setPreselectedHallForAsset(hallId);
    setIsCreateAssetOpen(true);
  };

  const handleDeleteHall = (e: React.MouseEvent, hallId: string, hallName: string) => {
    e.stopPropagation();
    const assetsInHall = assets.filter((a) => a.hangarId === hallId);
    requestDeleteConfirmation({
      title: 'حذف قاعة إنتاج',
      message: assetsInHall.length > 0 
        ? `تحتوي هذه القاعة على (${assetsInHall.length}) ماكينة مسجلة. هل أنت متأكد من رغبتك في حذف القاعة [${hallName}] وجميع ارتباطاتها نهائياً؟`
        : `هل أنت متأكد من رغبتك في حذف القاعة [${hallName}] نهائياً من المنظومة؟`,
      itemDetails: `قاعة: ${hallName} (${hallId}) - ${assetsInHall.length} ماكينة`,
      confirmLabel: 'حذف القاعة نهائياً',
      onConfirm: () => {
        deleteHangar(hallId);
      },
    });
  };

  return (
    <div className="space-y-4">
      {/* Header with Title and Creation Action Buttons */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 bg-slate-800/80 border border-slate-700/80 rounded-2xl shadow-md">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-blue-500/20 border border-blue-500/40 flex items-center justify-center text-blue-400">
            <Building2 className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base font-bold text-white tracking-wide">
                المسح الميداني اللحظي لقاعات الإنتاج ({hangars.length} قاعات)
              </h2>
              <span className="text-[11px] font-mono px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                مباشر
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              إدارة خطوط وماكينات معمل المرجان للمطبوعات - إشراف م. علي رضا
            </p>
          </div>
        </div>

        {/* Action Buttons to Add Hall or Machine */}
        <div className="flex items-center gap-2">
          <button
            id="btn-add-production-hall"
            onClick={() => setIsCreateHallOpen(true)}
            className="flex items-center gap-2 px-3.5 py-2 text-xs font-bold text-slate-900 bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 rounded-xl transition shadow-md shadow-amber-500/20"
          >
            <Plus className="w-4 h-4" />
            <span>إضافة قاعة إنتاج</span>
          </button>

          <button
            id="btn-add-machine-asset"
            onClick={() => {
              setPreselectedHallForAsset(null);
              setIsCreateAssetOpen(true);
            }}
            className="flex items-center gap-2 px-3.5 py-2 text-xs font-bold text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 rounded-xl transition shadow-md shadow-blue-500/20"
          >
            <Cpu className="w-4 h-4" />
            <span>إضافة ماكنة جديدة</span>
          </button>
        </div>
      </div>

      {/* Grid of Halls */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {hangars.map((hangar) => {
          // Get assets belonging to this hangar
          const hangarAssets = assets.filter((a) => a.hangarId === hangar.id);
          const runningCount = hangarAssets.filter((a) => a.status === 'OPERATIONAL').length;
          const stoppedCount = hangarAssets.filter((a) => a.status === 'STOPPED').length;
          const maintenanceCount = hangarAssets.filter((a) => a.status === 'UNDER_MAINTENANCE').length;
          const standbyCount = hangarAssets.filter((a) => a.status === 'STANDBY').length;

          // Dedicated UPS asset if exists
          const dedicatedUps = hangar.dedicatedUpsId
            ? assets.find((a) => a.id === hangar.dedicatedUpsId)
            : null;

          const hasCriticalIssue = stoppedCount > 0;
          const hasMaintenance = maintenanceCount > 0;

          return (
            <div
              key={hangar.id}
              onClick={() => {
                if (onSelectHangar) {
                  onSelectHangar(hangar.id);
                } else {
                  setActiveTab('assets');
                }
              }}
              className={`p-5 rounded-2xl border transition-all cursor-pointer shadow-md hover:shadow-xl relative overflow-hidden flex flex-col justify-between group ${
                hasCriticalIssue
                  ? 'bg-slate-900 border-red-500/60 hover:border-red-400'
                  : hasMaintenance
                  ? 'bg-slate-900 border-amber-500/50 hover:border-amber-400'
                  : 'bg-slate-900 border-slate-700/80 hover:border-blue-500/60'
              }`}
            >
              {/* Header */}
              <div>
                <div className="flex items-start justify-between gap-3 mb-2">
                  <div className="flex items-center gap-2.5">
                    <span className="p-2.5 rounded-xl bg-slate-800 border border-slate-700 shadow-inner">
                      {getHangarIcon(hangar.iconType)}
                    </span>
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="text-sm font-bold text-white group-hover:text-blue-400 transition">
                          {hangar.name}
                        </h3>
                      </div>
                      <div className="flex items-center gap-2 mt-0.5">
                        <span className="font-mono text-[10px] text-blue-300 bg-blue-500/10 px-1.5 py-0.5 rounded border border-blue-500/20">
                          {hangar.code}
                        </span>
                        <span className="text-[11px] text-slate-400">{hangar.nameEn}</span>
                      </div>
                    </div>
                  </div>

                  {/* Status Pill */}
                  {hasCriticalIssue ? (
                    <span className="flex items-center gap-1 text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-red-500/20 text-red-400 border border-red-500/40 animate-pulse">
                      <AlertOctagon className="w-3 h-3" />
                      <span>توقف خط!</span>
                    </span>
                  ) : hasMaintenance ? (
                    <span className="flex items-center gap-1 text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/40">
                      <AlertTriangle className="w-3 h-3" />
                      <span>صيانة جارية</span>
                    </span>
                  ) : (
                    <span className="flex items-center gap-1 text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
                      <CheckCircle2 className="w-3 h-3" />
                      <span>تعمل بكفاءة</span>
                    </span>
                  )}
                </div>

                <p className="text-xs text-slate-300 line-clamp-2 mb-3 leading-relaxed">
                  {hangar.description}
                </p>

                {/* Supervisor row */}
                {hangar.supervisor && (
                  <div className="flex items-center gap-1.5 text-[11px] text-slate-400 mb-3 bg-slate-800/40 px-2.5 py-1 rounded-lg border border-slate-800">
                    <User className="w-3.5 h-3.5 text-blue-400" />
                    <span>المسؤول:</span>
                    <span className="text-slate-200 font-medium">{hangar.supervisor}</span>
                  </div>
                )}

                {/* Machines status breakdown */}
                <div className="flex flex-wrap items-center gap-1.5 mb-3">
                  <div className="text-xs bg-slate-800 px-2.5 py-1 rounded-lg border border-slate-700 flex items-center gap-1.5">
                    <span className="text-slate-400">الماكينات:</span>
                    <span className="font-mono font-bold text-white">{hangarAssets.length}</span>
                  </div>

                  <div className="text-xs bg-emerald-950/40 text-emerald-400 px-2 py-1 rounded-lg border border-emerald-500/30 flex items-center gap-1">
                    <span>تشغيل:</span>
                    <span className="font-mono font-bold">{runningCount}</span>
                  </div>

                  {stoppedCount > 0 && (
                    <div className="text-xs bg-red-950/60 text-red-300 px-2 py-1 rounded-lg border border-red-500/40 font-bold flex items-center gap-1">
                      <span>توقف:</span>
                      <span className="font-mono">{stoppedCount}</span>
                    </div>
                  )}

                  {maintenanceCount > 0 && (
                    <div className="text-xs bg-amber-950/50 text-amber-300 px-2 py-1 rounded-lg border border-amber-500/30 flex items-center gap-1">
                      <span>صيانة:</span>
                      <span className="font-mono font-bold">{maintenanceCount}</span>
                    </div>
                  )}

                  {standbyCount > 0 && (
                    <div className="text-xs bg-slate-800 text-blue-300 px-2 py-1 rounded-lg border border-blue-500/30 flex items-center gap-1">
                      <span>احتياطي:</span>
                      <span className="font-mono font-bold">{standbyCount}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Dedicated Line UPS Health & Card Actions */}
              <div className="space-y-2 mt-1 pt-2 border-t border-slate-800">
                {dedicatedUps ? (
                  <div className="p-2 rounded-xl bg-slate-800/80 border border-slate-700/80 text-xs flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <BatteryCharging className="w-4 h-4 text-emerald-400" />
                      <div>
                        <div className="text-[11px] font-bold text-slate-200">
                          {dedicatedUps.name}
                        </div>
                        <div className="text-[10px] text-slate-400 font-mono">
                          {dedicatedUps.powerRating} • {dedicatedUps.voltage || '400V'}
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <span className="text-[10px] text-slate-400 block">الحمل</span>
                      <span className="font-mono font-bold text-amber-400">
                        {dedicatedUps.loadPercentage || 65}%
                      </span>
                    </div>
                  </div>
                ) : (
                  <div className="p-2 rounded-xl bg-slate-800/60 border border-slate-700/60 text-xs text-slate-400 flex items-center justify-between">
                    <span>{hangar.dedicatedUpsName || 'تغذية كهربائية محمية'}</span>
                    <ChevronLeft className="w-3.5 h-3.5 text-slate-500" />
                  </div>
                )}

                {/* Card footer buttons */}
                <div className="flex items-center justify-between gap-2 pt-1">
                  <button
                    type="button"
                    onClick={(e) => handleAddMachineToHall(e, hangar.id)}
                    className="flex-1 flex items-center justify-center gap-1.5 py-1.5 px-2 bg-blue-600/15 hover:bg-blue-600/25 border border-blue-500/30 rounded-xl text-blue-300 text-xs font-bold transition"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>إضافة ماكنة</span>
                  </button>

                  <button
                    type="button"
                    title="تعديل وتصحيح بيانات القاعة"
                    onClick={(e) => {
                      e.stopPropagation();
                      setEditingHangar(hangar);
                    }}
                    className="flex items-center gap-1 py-1.5 px-2.5 bg-amber-500/15 hover:bg-amber-500/25 border border-amber-500/30 rounded-xl text-amber-300 text-xs font-bold transition"
                  >
                    <Edit3 className="w-3.5 h-3.5" />
                    <span>تعديل</span>
                  </button>

                  <button
                    type="button"
                    title="حذف القاعة"
                    onClick={(e) => handleDeleteHall(e, hangar.id, hangar.name)}
                    className="p-1.5 text-slate-500 hover:text-red-400 hover:bg-red-500/10 rounded-xl transition border border-transparent hover:border-red-500/20"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
