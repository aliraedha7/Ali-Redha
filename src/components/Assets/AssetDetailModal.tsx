import React from 'react';
import { 
  X, 
  Cpu, 
  Clock, 
  Calendar, 
  Zap, 
  ShieldAlert, 
  Wrench, 
  QrCode, 
  CheckCircle2, 
  AlertTriangle, 
  Layers, 
  FileText,
  Activity,
  Gauge,
  Edit3,
  Trash2
} from 'lucide-react';
import { useCMMS } from '../../context/CMMSContext';

export const AssetDetailModal: React.FC = () => {
  const { 
    selectedAssetForModal, 
    setSelectedAssetForModal, 
    setSelectedAssetForQR, 
    setEditingAsset,
    deleteAsset,
    requestDeleteConfirmation,
    triggerEmergencyBreakdown,
    workOrders,
    setSelectedWOForDetail,
    setActiveTab
  } = useCMMS();

  if (!selectedAssetForModal) return null;

  const asset = selectedAssetForModal;

  // Filter work orders for this asset
  const assetWorkOrders = workOrders.filter((wo) => wo.assetId === asset.id);

  const getStatusBadge = () => {
    switch (asset.status) {
      case 'OPERATIONAL':
        return (
          <span className="flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-green-500/15 text-green-400 border border-green-500/30">
            <span className="w-2 h-2 rounded-full bg-green-400 animate-ping" />
            <span>يعمل بحالة ممتازة (OPERATIONAL)</span>
          </span>
        );
      case 'STOPPED':
        return (
          <span className="flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-red-500/15 text-red-400 border border-red-500/30 animate-pulse">
            <span className="w-2 h-2 rounded-full bg-red-400" />
            <span>متوقف / عطل طارئ (STOPPED)</span>
          </span>
        );
      case 'UNDER_MAINTENANCE':
        return (
          <span className="flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-yellow-500/15 text-yellow-300 border border-yellow-500/30">
            <span className="w-2 h-2 rounded-full bg-yellow-400" />
            <span>تحت الصيانة (UNDER MAINTENANCE)</span>
          </span>
        );
      case 'STANDBY':
        return (
          <span className="flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-blue-500/15 text-blue-400 border border-blue-500/30">
            <span className="w-2 h-2 rounded-full bg-blue-400" />
            <span>في وضع الاستعداد (STANDBY)</span>
          </span>
        );
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm overflow-y-auto no-print">
      <div className="relative w-full max-w-2xl bg-[#1e293b] border border-[#334155] rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 my-6">
        {/* Header */}
        <div className="flex items-start justify-between px-6 py-4 border-b border-[#334155] bg-[#0f172a]">
          <div className="space-y-1">
            <div className="flex items-center gap-3">
              <span className="font-mono text-xl font-bold bg-blue-600 text-white px-2.5 py-0.5 rounded-lg">
                {asset.id}
              </span>
              <h2 className="text-lg font-bold text-white leading-tight">
                {asset.name}
              </h2>
            </div>
            <div className="text-xs text-slate-400 flex flex-wrap items-center gap-2">
              <span>{asset.manufacturer} • {asset.model}</span>
              <span>•</span>
              <span className="text-blue-400 font-medium">{asset.hangarName}</span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                const current = asset;
                setSelectedAssetForModal(null);
                setEditingAsset(current);
              }}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-500/15 hover:bg-amber-500/25 text-amber-300 border border-amber-500/30 text-xs font-bold transition"
              title="تعديل وتصحيح بيانات هذه الماكينة"
            >
              <Edit3 className="w-3.5 h-3.5 text-amber-400" />
              <span>تعديل الماكينة</span>
            </button>

            <button
              onClick={() => setSelectedAssetForModal(null)}
              className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-[#334155]/40 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-6 max-h-[75vh] overflow-y-auto">
          {/* Status & Criticality Row */}
          <div className="flex flex-wrap items-center justify-between gap-3 p-4 rounded-xl bg-[#0f172a] border border-[#334155]">
            <div>
              <div className="text-[11px] text-slate-400 mb-1">الحالة التشغيلية الحالية</div>
              {getStatusBadge()}
            </div>

            <div>
              <div className="text-[11px] text-slate-400 mb-1">درجة الأهمية والخطورة</div>
              <span className={`px-3 py-1 rounded-full text-xs font-bold border ${
                asset.criticality === 'CRITICAL'
                  ? 'bg-red-500/10 text-red-300 border-red-500/30'
                  : 'bg-yellow-500/10 text-yellow-300 border-yellow-500/30'
              }`}>
                {asset.criticality === 'CRITICAL' ? 'حرج جداً (CRITICAL)' : 'عالي الأهمية (HIGH)'}
              </span>
            </div>

            <div>
              <div className="text-[11px] text-slate-400 mb-1">ساعات التشغيل التراكمية</div>
              <div className="text-sm font-bold font-mono text-blue-400 flex items-center gap-1">
                <Clock className="w-3.5 h-3.5" />
                <span>{asset.runningHours.toLocaleString()} ساعة</span>
              </div>
            </div>
          </div>

          {/* Technical Specifications */}
          <div className="space-y-2">
            <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
              <Cpu className="w-4 h-4 text-blue-400" />
              <span>المواصفات الفنية المعتمدة للماكينة</span>
            </h3>
            <div className="p-3.5 rounded-xl bg-[#0f172a] border border-[#334155] text-xs text-slate-200 leading-relaxed font-sans">
              {asset.specifications}
            </div>
          </div>

          {/* Machine Details Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs">
            <div className="p-3 rounded-lg bg-[#0f172a] border border-[#334155]">
              <div className="text-slate-400 mb-1">الرقم التسلسلي (S/N)</div>
              <div className="font-mono font-bold text-slate-200">{asset.serialNumber}</div>
            </div>

            <div className="p-3 rounded-lg bg-[#0f172a] border border-[#334155]">
              <div className="text-slate-400 mb-1">سنة التركيب والتشغيل</div>
              <div className="font-mono font-bold text-slate-200">{asset.installYear}</div>
            </div>

            <div className="p-3 rounded-lg bg-[#0f172a] border border-[#334155]">
              <div className="text-slate-400 mb-1">توقفات هذا الشهر</div>
              <div className="font-mono font-bold text-yellow-400">
                {asset.downtimeThisMonthMinutes} دقيقة
              </div>
            </div>

            <div className="p-3 rounded-lg bg-[#0f172a] border border-[#334155]">
              <div className="text-slate-400 mb-1">آخر موعد صيانة</div>
              <div className="font-mono text-slate-300">{asset.lastMaintenanceDate}</div>
            </div>

            <div className="p-3 rounded-lg bg-[#0f172a] border border-[#334155]">
              <div className="text-slate-400 mb-1">الصيانة الدورية القادمة</div>
              <div className="font-mono text-blue-400 font-semibold">{asset.nextMaintenanceDate}</div>
            </div>

            {asset.associatedUpsName && (
              <div className="p-3 rounded-lg bg-[#0f172a] border border-[#334155]">
                <div className="text-slate-400 mb-1">نظام الـ UPS المرتبط</div>
                <div className="text-green-400 font-semibold truncate" title={asset.associatedUpsName}>
                  {asset.associatedUpsId}
                </div>
              </div>
            )}
          </div>

          {/* Dedicated UPS Info if this is a UPS or has UPS */}
          {asset.category === 'ELECTRICAL_UPS' && (
            <div className="p-4 rounded-xl bg-yellow-500/10 border border-yellow-500/30 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Zap className="w-6 h-6 text-yellow-400" />
                <div>
                  <div className="text-xs font-bold text-yellow-300">مؤشرات كفاءة الـ UPS اللحظية</div>
                  <div className="text-[11px] text-slate-400">الجهد: {asset.voltage || '400V'} • القدرة: {asset.powerRating}</div>
                </div>
              </div>
              <div className="text-right">
                <div className="text-xs text-slate-400">نسبة الحمل الحالية</div>
                <div className="text-base font-black text-yellow-400 font-mono">{asset.loadPercentage || 70}%</div>
              </div>
            </div>
          )}

          {/* Work Orders History for this Machine */}
          <div className="space-y-2.5">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                <FileText className="w-4 h-4 text-blue-400" />
                <span>سجل أوامر العمل والتوقفات للماكينة ({assetWorkOrders.length})</span>
              </h3>
            </div>

            {assetWorkOrders.length === 0 ? (
              <div className="p-4 rounded-xl bg-[#0f172a] border border-[#334155] text-center text-xs text-slate-500">
                سجل الماكينة نظيف ولا توجد بلاغات أو أوامر عمل مسجلة حديثاً
              </div>
            ) : (
              <div className="space-y-2">
                {assetWorkOrders.map((wo) => (
                  <div
                    key={wo.id}
                    onClick={() => {
                      setSelectedAssetForModal(null);
                      setSelectedWOForDetail(wo);
                      setActiveTab('work-orders');
                    }}
                    className="p-3 rounded-lg bg-[#0f172a] hover:bg-[#334155]/30 border border-[#334155] transition-all cursor-pointer flex items-center justify-between gap-3 text-xs"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-bold text-blue-400">{wo.id}</span>
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                          wo.priority === 'CRITICAL_STOPPAGE'
                            ? 'bg-red-500/20 text-red-300'
                            : 'bg-blue-500/20 text-blue-300'
                        }`}>
                          {wo.priority === 'CRITICAL_STOPPAGE' ? 'توقف خط' : 'صيانة'}
                        </span>
                        <span className="text-slate-400 font-mono text-[11px]">{wo.reportedAt}</span>
                      </div>
                      <div className="text-slate-200 font-medium">{wo.title}</div>
                    </div>

                    <div className="text-right">
                      <span className={`px-2.5 py-1 rounded text-[11px] font-bold ${
                        wo.status === 'COMPLETED' || wo.status === 'CLOSED'
                          ? 'bg-green-500/15 text-green-400'
                          : wo.status === 'IN_PROGRESS'
                          ? 'bg-yellow-500/15 text-yellow-400'
                          : 'bg-[#334155] text-slate-300'
                      }`}>
                        {wo.status === 'IN_PROGRESS' ? 'قيد التنفيذ' : wo.status === 'COMPLETED' ? 'منجز' : wo.status === 'CLOSED' ? 'مغلق' : 'معتمد'}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Footer Actions */}
        <div className="flex flex-wrap items-center justify-between gap-3 px-6 py-4 border-t border-[#334155] bg-[#0f172a]">
          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                const current = asset;
                setSelectedAssetForModal(null);
                setEditingAsset(current);
              }}
              className="flex items-center gap-2 bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 px-3.5 py-2 rounded-lg text-xs font-bold border border-amber-500/30 transition-colors"
            >
              <Edit3 className="w-4 h-4 text-amber-400" />
              <span>تعديل بيانات الماكينة</span>
            </button>

            <button
              onClick={() => {
                const current = asset;
                setSelectedAssetForModal(null);
                setSelectedAssetForQR(current);
              }}
              className="flex items-center gap-2 bg-[#1e293b] hover:bg-[#334155] text-slate-200 px-3.5 py-2 rounded-lg text-xs font-bold border border-[#334155] transition-colors"
            >
              <QrCode className="w-4 h-4 text-blue-400" />
              <span>بطاقة QR</span>
            </button>

            <button
              type="button"
              onClick={() => {
                requestDeleteConfirmation({
                  title: 'حذف ماكينة وأصل صناعي',
                  message: `هل أنت متأكد من رغبتك في حذف الماكينة [${asset.name}] (${asset.id}) نهائياً؟`,
                  itemDetails: `${asset.id} - ${asset.name}`,
                  confirmLabel: 'حذف الماكينة',
                  onConfirm: () => {
                    deleteAsset(asset.id);
                    setSelectedAssetForModal(null);
                  },
                });
              }}
              className="flex items-center gap-1.5 bg-red-500/15 hover:bg-red-500/25 text-red-400 hover:text-red-300 px-3.5 py-2 rounded-lg text-xs font-bold border border-red-500/30 transition-colors active:scale-95"
              title="حذف هذه الماكينة نهائياً"
            >
              <Trash2 className="w-4 h-4" />
              <span>حذف الماكينة</span>
            </button>
          </div>

          <button
            onClick={() => {
              const currentId = asset.id;
              setSelectedAssetForModal(null);
              triggerEmergencyBreakdown(currentId);
            }}
            className="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg text-xs font-bold shadow-lg shadow-red-600/20 transition-all"
          >
            <ShieldAlert className="w-4 h-4" />
            <span>بلاغ عطل طارئ لهذه الماكينة</span>
          </button>
        </div>
      </div>
    </div>
  );
};
