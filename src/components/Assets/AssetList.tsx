import React, { useState, useMemo } from 'react';
import { 
  Search, 
  Filter, 
  QrCode, 
  Info, 
  ShieldAlert, 
  CheckCircle2, 
  AlertTriangle, 
  AlertOctagon, 
  LayoutGrid, 
  List, 
  Clock, 
  Layers, 
  Zap, 
  Printer,
  ChevronDown,
  Plus,
  Building2,
  Cpu,
  Trash2,
  Edit3
} from 'lucide-react';
import { useCMMS } from '../../context/CMMSContext';
import { Asset, AssetStatus, Criticality, HangarId } from '../../types';

interface AssetListProps {
  initialHangarFilter?: string | 'ALL';
}

export const AssetList: React.FC<AssetListProps> = ({ initialHangarFilter = 'ALL' }) => {
  const { 
    assets, 
    hangars, 
    setSelectedAssetForModal, 
    setSelectedAssetForQR, 
    setEditingAsset,
    triggerEmergencyBreakdown,
    globalSearch,
    setGlobalSearch,
    setIsCreateAssetOpen,
    setIsCreateHallOpen,
    setPreselectedHallForAsset,
    deleteAsset,
    requestDeleteConfirmation,
    checkPermission
  } = useCMMS();

  const [selectedHangar, setSelectedHangar] = useState<string | 'ALL'>(initialHangarFilter);
  const [selectedStatus, setSelectedStatus] = useState<AssetStatus | 'ALL'>('ALL');
  const [selectedCriticality, setSelectedCriticality] = useState<Criticality | 'ALL'>('ALL');
  const [viewMode, setViewMode] = useState<'grid' | 'table'>('grid');

  // Filtered Assets
  const filteredAssets = useMemo(() => {
    return assets.filter((asset) => {
      // Hangar filter
      if (selectedHangar !== 'ALL' && asset.hangarId !== selectedHangar) return false;
      // Status filter
      if (selectedStatus !== 'ALL' && asset.status !== selectedStatus) return false;
      // Criticality filter
      if (selectedCriticality !== 'ALL' && asset.criticality !== selectedCriticality) return false;
      // Search
      const search = globalSearch.toLowerCase().trim();
      if (search) {
        const matchesId = asset.id.toLowerCase().includes(search);
        const matchesName = asset.name.toLowerCase().includes(search);
        const matchesModel = asset.model?.toLowerCase().includes(search);
        const matchesMfr = asset.manufacturer?.toLowerCase().includes(search);
        const matchesSerial = asset.serialNumber?.toLowerCase().includes(search);
        const matchesHangar = asset.hangarName?.toLowerCase().includes(search);
        if (!matchesId && !matchesName && !matchesModel && !matchesMfr && !matchesSerial && !matchesHangar) {
          return false;
        }
      }
      return true;
    });
  }, [assets, selectedHangar, selectedStatus, selectedCriticality, globalSearch]);

  const handleDeleteAsset = (e: React.MouseEvent, assetId: string, assetName: string) => {
    e.stopPropagation();
    if (!checkPermission('canManageAssets', 'حذف أصل صناعي من النظام')) return;
    requestDeleteConfirmation({
      title: 'حذف ماكينة وأصل صناعي',
      message: `هل أنت متأكد من رغبتك في حذف الماكينة [${assetName}] (${assetId}) نهائياً من قاعدة بيانات المصنع؟`,
      itemDetails: `${assetId} - ${assetName}`,
      confirmLabel: 'حذف الماكينة',
      onConfirm: () => {
        deleteAsset(assetId);
      },
    });
  };

  const getStatusBadge = (status: AssetStatus) => {
    switch (status) {
      case 'OPERATIONAL':
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
            <span>تعمل (OPERATIONAL)</span>
          </span>
        );
      case 'STOPPED':
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 rounded-full bg-red-500/20 text-red-400 border border-red-500/40 animate-pulse">
            <AlertOctagon className="w-3 h-3" />
            <span>متوقفة (STOPPED)</span>
          </span>
        );
      case 'UNDER_MAINTENANCE':
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/40">
            <AlertTriangle className="w-3 h-3" />
            <span>صيانة (MAINTENANCE)</span>
          </span>
        );
      case 'STANDBY':
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 rounded-full bg-blue-500/15 text-blue-400 border border-blue-500/30">
            <Clock className="w-3 h-3" />
            <span>احتياطي (STANDBY)</span>
          </span>
        );
    }
  };

  return (
    <div className="space-y-4">
      {/* Controls & Action Bar */}
      <div className="p-5 rounded-2xl bg-slate-900 border border-slate-700/80 shadow-md space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-blue-500/20 border border-blue-500/30 flex items-center justify-center text-blue-400">
              <Cpu className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white">
                سجل الماكينات والأصول الصناعية ({filteredAssets.length} من {assets.length})
              </h2>
              <p className="text-xs text-slate-400">
                قواعد بيانات الماكينات موزعة على قاعات الإنتاج التسع
              </p>
            </div>
          </div>

          <div className="flex items-center flex-wrap gap-2">
            {/* Action Buttons to Add Hall or Machine */}
            <button
              id="btn-add-hall-from-assets"
              onClick={() => {
                if (!checkPermission('canManageAssets', 'إضافة قاعة إنتاج جديدة')) return;
                setIsCreateHallOpen(true);
              }}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-amber-500/15 hover:bg-amber-500/25 text-amber-300 border border-amber-500/30 rounded-xl text-xs font-bold transition"
            >
              <Building2 className="w-3.5 h-3.5" />
              <span>إضافة قاعة إنتاج</span>
            </button>

            <button
              id="btn-add-machine-from-assets"
              onClick={() => {
                if (!checkPermission('canManageAssets', 'إضافة ماكينة أو أصل جديد')) return;
                setPreselectedHallForAsset(selectedHangar !== 'ALL' ? selectedHangar : null);
                setIsCreateAssetOpen(true);
              }}
              className="flex items-center gap-1.5 px-3.5 py-1.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white rounded-xl text-xs font-bold shadow-md shadow-blue-500/20 transition"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>إضافة ماكنة جديدة</span>
            </button>

            {/* View Mode Toggle */}
            <div className="flex items-center bg-slate-800 p-1 rounded-xl border border-slate-700">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-1.5 rounded-lg text-xs transition-colors ${
                  viewMode === 'grid' ? 'bg-blue-600 text-white font-bold' : 'text-slate-400 hover:text-white'
                }`}
                title="عرض شبكي للماكينات"
              >
                <LayoutGrid className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode('table')}
                className={`p-1.5 rounded-lg text-xs transition-colors ${
                  viewMode === 'table' ? 'bg-blue-600 text-white font-bold' : 'text-slate-400 hover:text-white'
                }`}
                title="عرض جدول الأصول"
              >
                <List className="w-4 h-4" />
              </button>
            </div>

            <button
              onClick={() => triggerEmergencyBreakdown()}
              className="flex items-center gap-1.5 bg-red-600 hover:bg-red-700 text-white px-3 py-1.5 rounded-xl text-xs font-bold shadow-md shadow-red-600/20 transition-all"
            >
              <ShieldAlert className="w-3.5 h-3.5" />
              <span>عطل طارئ</span>
            </button>
          </div>
        </div>

        {/* Quick Filter Horizontal Pills by Hall */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs no-scrollbar">
          <button
            onClick={() => setSelectedHangar('ALL')}
            className={`px-3 py-1.5 rounded-xl whitespace-nowrap font-medium transition ${
              selectedHangar === 'ALL'
                ? 'bg-blue-600 text-white font-bold shadow-sm'
                : 'bg-slate-800/80 text-slate-400 hover:text-slate-200 border border-slate-700/60'
            }`}
          >
            كافة القاعات ({assets.length})
          </button>
          {hangars.map((h) => {
            const count = assets.filter((a) => a.hangarId === h.id).length;
            const isSelected = selectedHangar === h.id;
            return (
              <button
                key={h.id}
                onClick={() => setSelectedHangar(h.id)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl whitespace-nowrap transition text-xs ${
                  isSelected
                    ? 'bg-blue-600 text-white font-bold shadow-sm'
                    : 'bg-slate-800/80 text-slate-400 hover:text-slate-200 border border-slate-700/60'
                }`}
              >
                <span>{h.nameEn || h.name}</span>
                <span className={`text-[10px] px-1.5 py-0.2 rounded-full ${isSelected ? 'bg-blue-800 text-white' : 'bg-slate-700 text-slate-300'}`}>
                  {count}
                </span>
              </button>
            );
          })}
        </div>

        {/* Filters Dropdowns & Search */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5 pt-1 text-xs">
          {/* Search Box */}
          <div className="relative">
            <Search className="w-3.5 h-3.5 absolute right-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="بحث بالرمز (ROTO-01), الموديل، الماركة..."
              value={globalSearch}
              onChange={(e) => setGlobalSearch(e.target.value)}
              className="w-full bg-slate-800/80 border border-slate-700 rounded-xl pr-9 pl-3 py-2 text-slate-200 placeholder-slate-500 focus:outline-none focus:border-blue-500"
            />
          </div>

          {/* Hangar Filter */}
          <div>
            <select
              value={selectedHangar}
              onChange={(e) => setSelectedHangar(e.target.value)}
              className="w-full bg-slate-800/80 border border-slate-700 rounded-xl px-3 py-2 text-slate-200 focus:outline-none focus:border-blue-500"
            >
              <option value="ALL">جميع قاعات الإنتاج ({hangars.length})</option>
              {hangars.map((h) => (
                <option key={h.id} value={h.id}>
                  {h.name} [{h.code}]
                </option>
              ))}
            </select>
          </div>

          {/* Status Filter */}
          <div>
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value as any)}
              className="w-full bg-slate-800/80 border border-slate-700 rounded-xl px-3 py-2 text-slate-200 focus:outline-none focus:border-blue-500"
            >
              <option value="ALL">جميع الحالات التشغيلية</option>
              <option value="OPERATIONAL">تعمل بكفاءة (OPERATIONAL)</option>
              <option value="STOPPED">متوقفة / عطل طارئ (STOPPED)</option>
              <option value="UNDER_MAINTENANCE">تحت الصيانة (UNDER_MAINTENANCE)</option>
              <option value="STANDBY">في وضع الاستعداد (STANDBY)</option>
            </select>
          </div>

          {/* Criticality Filter */}
          <div>
            <select
              value={selectedCriticality}
              onChange={(e) => setSelectedCriticality(e.target.value as any)}
              className="w-full bg-slate-800/80 border border-slate-700 rounded-xl px-3 py-2 text-slate-200 focus:outline-none focus:border-blue-500"
            >
              <option value="ALL">جميع مستويات الخطورة</option>
              <option value="CRITICAL">حرجة جداً (CRITICAL)</option>
              <option value="HIGH">عالية الأهمية (HIGH)</option>
              <option value="MEDIUM">متوسطة الأهمية (MEDIUM)</option>
              <option value="LOW">منخفضة الأهمية (LOW)</option>
            </select>
          </div>
        </div>
      </div>

      {/* Grid View */}
      {viewMode === 'grid' && (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {filteredAssets.map((asset) => (
            <div
              key={asset.id}
              className={`p-5 rounded-2xl border transition-all shadow-md hover:shadow-xl flex flex-col justify-between group ${
                asset.status === 'STOPPED'
                  ? 'bg-slate-900 border-red-500/60 hover:border-red-400'
                  : asset.status === 'UNDER_MAINTENANCE'
                  ? 'bg-slate-900 border-amber-500/50 hover:border-amber-400'
                  : 'bg-slate-900 border-slate-700/80 hover:border-blue-500/60'
              }`}
            >
              <div className="space-y-2.5">
                {/* Top Code & Status */}
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-sm font-bold px-2.5 py-1 rounded-lg bg-slate-800 text-blue-400 border border-blue-500/30">
                      {asset.id}
                    </span>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded border ${
                      asset.criticality === 'CRITICAL'
                        ? 'bg-red-500/10 text-red-300 border-red-500/30'
                        : 'bg-amber-500/10 text-amber-300 border-amber-500/30'
                    }`}>
                      {asset.criticality}
                    </span>
                  </div>
                  {getStatusBadge(asset.status)}
                </div>

                {/* Name & Model */}
                <div>
                  <h3 className="text-sm font-bold text-white group-hover:text-blue-400 transition leading-snug">
                    {asset.name}
                  </h3>
                  <p className="text-xs text-slate-400 mt-0.5">
                    {asset.manufacturer} • {asset.model}
                  </p>
                </div>

                {/* Specs Snippet */}
                <p className="text-[11px] text-slate-300 line-clamp-2 bg-slate-800/80 p-2.5 rounded-xl border border-slate-700/80 font-sans leading-relaxed">
                  {asset.specifications}
                </p>

                {/* Location & S/N & Hours */}
                <div className="grid grid-cols-2 gap-2 text-[11px] text-slate-400 pt-1">
                  <div>
                    <span>القاعة: </span>
                    <span className="text-slate-200 font-semibold">{asset.hangarName}</span>
                  </div>
                  <div className="text-left font-mono">
                    <span className="text-slate-400 font-sans">التشغيل: </span>
                    <span className="text-blue-400 font-bold">{asset.runningHours?.toLocaleString()} س</span>
                  </div>
                  <div className="truncate font-mono">
                    <span>S/N: </span>
                    <span className="text-slate-300">{asset.serialNumber}</span>
                  </div>
                  <div className="text-left">
                    <span>التركيب: </span>
                    <span className="font-mono text-slate-300 font-bold">{asset.installYear}</span>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-between gap-2 pt-3 mt-3 border-t border-slate-800">
                <button
                  onClick={() => setSelectedAssetForQR(asset)}
                  className="flex items-center gap-1 text-xs text-blue-400 hover:text-blue-300 bg-blue-600/10 hover:bg-blue-600/20 border border-blue-500/30 px-2.5 py-1.5 rounded-xl font-bold transition-colors"
                  title="طباعة بطاقة الباركود الصناعية"
                >
                  <QrCode className="w-3.5 h-3.5" />
                  <span>بطاقة QR</span>
                </button>

                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => {
                      if (!checkPermission('canManageAssets', 'تعديل بيانات وتفاصيل الماكنة')) return;
                      setEditingAsset(asset);
                    }}
                    className="flex items-center gap-1 text-xs text-amber-300 hover:text-white bg-amber-500/15 hover:bg-amber-500/30 px-2.5 py-1.5 rounded-xl border border-amber-500/30 transition-colors font-semibold"
                    title="تعديل وتصحيح بيانات الماكنة"
                  >
                    <Edit3 className="w-3.5 h-3.5 text-amber-400" />
                    <span>تعديل</span>
                  </button>

                  <button
                    onClick={() => setSelectedAssetForModal(asset)}
                    className="flex items-center gap-1 text-xs text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 px-2.5 py-1.5 rounded-xl border border-slate-700 transition-colors"
                  >
                    <Info className="w-3.5 h-3.5 text-blue-400" />
                    <span>السجل</span>
                  </button>

                  <button
                    onClick={() => triggerEmergencyBreakdown(asset.id)}
                    className="flex items-center gap-1 text-xs text-red-300 hover:text-white bg-red-600/20 hover:bg-red-600 px-2.5 py-1.5 rounded-xl border border-red-500/40 transition-colors font-bold"
                    title="بلاغ عطل طارئ"
                  >
                    <ShieldAlert className="w-3.5 h-3.5" />
                    <span>عطل</span>
                  </button>

                  <button
                    onClick={(e) => handleDeleteAsset(e, asset.id, asset.name)}
                    className="p-1.5 text-slate-500 hover:text-red-400 hover:bg-red-500/10 rounded-xl transition border border-transparent hover:border-red-500/20"
                    title="حذف الماكنة"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Table View */}
      {viewMode === 'table' && (
        <div className="overflow-x-auto rounded-2xl border border-slate-700/80 shadow-xl bg-slate-900">
          <table className="w-full text-right text-xs">
            <thead className="bg-slate-800 text-slate-400 border-b border-slate-700 font-bold">
              <tr>
                <th className="p-3.5">رمز الأصل</th>
                <th className="p-3.5">اسم الماكينة والطراز</th>
                <th className="p-3.5">قاعة الإنتاج</th>
                <th className="p-3.5">الأهمية</th>
                <th className="p-3.5">الحالة التشغيلية</th>
                <th className="p-3.5 text-center">ساعات التشغيل</th>
                <th className="p-3.5">الرقم التسلسلي</th>
                <th className="p-3.5 text-center">الإجراءات</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {filteredAssets.map((asset) => (
                <tr 
                  key={asset.id} 
                  className={`hover:bg-slate-800/40 transition-colors ${
                    asset.status === 'STOPPED' ? 'bg-red-950/20' : ''
                  }`}
                >
                  <td className="p-3.5 font-mono font-bold text-blue-400 whitespace-nowrap">
                    {asset.id}
                  </td>
                  <td className="p-3.5">
                    <div className="font-bold text-white">{asset.name}</div>
                    <div className="text-[11px] text-slate-400">{asset.manufacturer} • {asset.model}</div>
                  </td>
                  <td className="p-3.5 text-slate-300 font-medium whitespace-nowrap">
                    {asset.hangarName}
                  </td>
                  <td className="p-3.5 whitespace-nowrap">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                      asset.criticality === 'CRITICAL' 
                        ? 'bg-red-500/15 text-red-400 border border-red-500/30' 
                        : 'bg-amber-500/15 text-amber-400 border border-amber-500/30'
                    }`}>
                      {asset.criticality}
                    </span>
                  </td>
                  <td className="p-3.5 whitespace-nowrap">
                    {getStatusBadge(asset.status)}
                  </td>
                  <td className="p-3.5 text-center font-mono font-bold text-blue-400 whitespace-nowrap">
                    {asset.runningHours?.toLocaleString()} س
                  </td>
                  <td className="p-3.5 font-mono text-slate-400 whitespace-nowrap">
                    {asset.serialNumber}
                  </td>
                  <td className="p-3.5 text-center whitespace-nowrap">
                    <div className="flex items-center justify-center gap-1.5">
                      <button
                        onClick={() => {
                          if (!checkPermission('canManageAssets', 'تعديل بيانات وتفاصيل الماكنة')) return;
                          setEditingAsset(asset);
                        }}
                        className="p-1.5 rounded-lg bg-amber-500/10 hover:bg-amber-500/25 text-amber-400 border border-amber-500/30"
                        title="تعديل وتصحيح بيانات الماكنة"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => setSelectedAssetForQR(asset)}
                        className="p-1.5 rounded-lg bg-blue-600/10 hover:bg-blue-600/20 text-blue-400 border border-blue-500/30"
                        title="طباعة بطاقة الباركود QR"
                      >
                        <QrCode className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => setSelectedAssetForModal(asset)}
                        className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700"
                        title="عرض السجل الفني الشامل"
                      >
                        <Info className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => triggerEmergencyBreakdown(asset.id)}
                        className="p-1.5 rounded-lg bg-red-600/20 hover:bg-red-600 text-red-300 hover:text-white border border-red-500/30"
                        title="بلاغ عطل طارئ"
                      >
                        <ShieldAlert className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={(e) => handleDeleteAsset(e, asset.id, asset.name)}
                        className="p-1.5 rounded-lg text-slate-500 hover:text-red-400 hover:bg-red-500/10 transition border border-transparent hover:border-red-500/20"
                        title="حذف الماكنة"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};
