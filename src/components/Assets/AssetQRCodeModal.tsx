import React, { useRef } from 'react';
import { 
  X, 
  Printer, 
  ShieldAlert, 
  CheckCircle2, 
  Cpu, 
  Info,
  Calendar,
  Layers,
  Zap,
  Hash,
  Edit3
} from 'lucide-react';
import { useCMMS } from '../../context/CMMSContext';
import { QRCodeSVG } from '../Common/QRCodeGenerator';

export const AssetQRCodeModal: React.FC = () => {
  const { 
    selectedAssetForQR, 
    setSelectedAssetForQR, 
    triggerEmergencyBreakdown,
    setSelectedAssetForModal,
    setEditingAsset
  } = useCMMS();

  if (!selectedAssetForQR) return null;

  const asset = selectedAssetForQR;

  const handlePrint = () => {
    window.print();
  };

  const qrDataValue = JSON.stringify({
    cmms: 'FLEX_PACK_CMMS',
    manager: 'Eng. Ali Ridha',
    assetId: asset.id,
    name: asset.nameEn,
    hangar: asset.hangarId,
    serial: asset.serialNumber,
    criticality: asset.criticality,
    installYear: asset.installYear,
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm overflow-y-auto no-print">
      <div className="relative w-full max-w-lg bg-[#1e293b] border border-[#334155] rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#334155] bg-[#0f172a]">
          <div className="flex items-center gap-2.5">
            <span className="p-2 rounded-lg bg-blue-600/15 text-blue-400 border border-blue-500/30">
              <Hash className="w-5 h-5" />
            </span>
            <div>
              <h2 className="text-base font-bold text-white">بطاقة الأصل الصناعية وبطاقة الـ QR</h2>
              <p className="text-xs text-slate-400">جاهزة للطباعة والتثبيت على لوحة تشغيل الماكينة</p>
            </div>
          </div>
          <button
            onClick={() => setSelectedAssetForQR(null)}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-[#334155]/40 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Printable Industrial Badge Content */}
        <div className="p-6">
          <div 
            id="printable-asset-badge" 
            className="bg-white text-slate-900 border-2 border-slate-900 rounded-xl p-5 shadow-md relative overflow-hidden print-area"
          >
            {/* Top Badge Header */}
            <div className="flex items-center justify-between border-b-2 border-slate-900 pb-3 mb-4">
              <div>
                <div className="text-[11px] font-extrabold text-slate-600 tracking-wider">
                  AL-MURJAN PRINTING PLANT • CMMS
                </div>
                <div className="text-sm font-black text-slate-950">
                  معمل المرجان للمطبوعات — قسم الصيانة
                </div>
              </div>
              <div className="text-right">
                <span className={`inline-block px-2 py-0.5 text-[11px] font-black rounded border ${
                  asset.criticality === 'CRITICAL'
                    ? 'bg-red-100 text-red-800 border-red-400'
                    : 'bg-yellow-100 text-yellow-800 border-yellow-400'
                }`}>
                  {asset.criticality === 'CRITICAL' ? 'أصل حرج (CRITICAL)' : 'أصل عالي الأهمية (HIGH)'}
                </span>
                <div className="text-[10px] text-slate-500 mt-0.5">
                  إشراف: م. علي رضا
                </div>
              </div>
            </div>

            {/* Middle: Big Asset Code & QR Code */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 items-center mb-4">
              <div className="sm:col-span-2 space-y-2">
                <div className="bg-slate-900 text-blue-400 px-3 py-1.5 rounded-lg inline-block font-mono text-2xl font-black tracking-wider">
                  {asset.id}
                </div>
                <div className="text-base font-bold text-slate-950 leading-snug">
                  {asset.name}
                </div>
                <div className="text-xs font-semibold text-slate-600 font-mono">
                  {asset.model} • {asset.manufacturer}
                </div>
                <div className="text-xs text-slate-700 bg-slate-100 p-2 rounded border border-slate-300">
                  <span className="font-bold">الموقع: </span>
                  {asset.hangarName} ({asset.hangarId})
                </div>
              </div>

              <div className="flex flex-col items-center justify-center p-2 bg-slate-50 rounded-lg border border-slate-300">
                <QRCodeSVG value={qrDataValue} size={130} />
                <span className="text-[10px] font-mono text-slate-600 mt-1 font-bold">SCAN TO CMMS</span>
              </div>
            </div>

            {/* Bottom: Specifications and Barcode Strip */}
            <div className="border-t-2 border-slate-900 pt-3 text-[11px] grid grid-cols-2 gap-2 text-slate-800 font-mono">
              <div>
                <span className="text-slate-500 font-sans">الرقم التسلسلي S/N: </span>
                <span className="font-bold">{asset.serialNumber}</span>
              </div>
              <div>
                <span className="text-slate-500 font-sans">سنة التركيب: </span>
                <span className="font-bold">{asset.installYear}</span>
              </div>
              <div>
                <span className="text-slate-500 font-sans">ساعات التشغيل: </span>
                <span className="font-bold">{asset.runningHours.toLocaleString()} ساعة</span>
              </div>
              {asset.associatedUpsName && (
                <div className="truncate">
                  <span className="text-slate-500 font-sans">UPS: </span>
                  <span className="font-bold">{asset.associatedUpsId}</span>
                </div>
              )}
            </div>

            {/* Security stamp watermark effect */}
            <div className="absolute -bottom-4 -left-4 text-slate-200 text-6xl font-black select-none pointer-events-none opacity-40 font-mono">
              CMMS
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap items-center justify-between gap-3 mt-6">
            <div className="flex items-center gap-2">
              <button
                onClick={() => {
                  const current = asset;
                  setSelectedAssetForQR(null);
                  setEditingAsset(current);
                }}
                className="flex items-center gap-1.5 text-xs text-amber-300 hover:text-white bg-amber-500/15 hover:bg-amber-500/30 px-3 py-2 rounded-lg border border-amber-500/30 transition-colors font-bold"
                title="تعديل وتصحيح بيانات هذه الماكينة"
              >
                <Edit3 className="w-3.5 h-3.5 text-amber-400" />
                <span>تعديل الماكينة</span>
              </button>

              <button
                onClick={() => {
                  setSelectedAssetForQR(null);
                  setSelectedAssetForModal(asset);
                }}
                className="flex items-center gap-1.5 text-xs text-slate-300 hover:text-white bg-[#0f172a] hover:bg-[#334155] px-3 py-2 rounded-lg border border-[#334155] transition-colors"
              >
                <Info className="w-4 h-4 text-blue-400" />
                <span>عرض السجل</span>
              </button>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => {
                  setSelectedAssetForQR(null);
                  triggerEmergencyBreakdown(asset.id);
                }}
                className="flex items-center gap-1.5 bg-red-600/20 hover:bg-red-600/30 text-red-300 border border-red-500/40 px-3.5 py-2 rounded-lg text-xs font-bold transition-all"
              >
                <ShieldAlert className="w-4 h-4 text-red-400" />
                <span>بلاغ عطل طارئ</span>
              </button>

              <button
                onClick={handlePrint}
                className="flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded-lg text-xs font-bold shadow-md shadow-blue-600/20 transition-all active:scale-95"
              >
                <Printer className="w-4 h-4" />
                <span>طباعة بطاقة الباركود</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
