import React, { useState } from 'react';
import { 
  X, 
  Package, 
  Tag, 
  MapPin, 
  DollarSign, 
  AlertTriangle, 
  Clock, 
  CheckCircle2, 
  Wrench, 
  Building2, 
  FileText,
  ShieldAlert,
  Edit3,
  Trash2,
  ArrowDownRight,
  ArrowUpRight,
  History,
  Cpu,
  Factory,
  Boxes,
  Phone,
  Calendar,
  AlertCircle
} from 'lucide-react';
import { useCMMS } from '../../context/CMMSContext';
import { SparePart, SparePartCriticality, SparePartCondition } from '../../types';

interface SparePartDetailModalProps {
  part: SparePart | null;
  onClose: () => void;
  onEdit: (part: SparePart) => void;
}

export const SparePartDetailModal: React.FC<SparePartDetailModalProps> = ({
  part,
  onClose,
  onEdit
}) => {
  const { 
    restockPart, 
    consumePart, 
    deleteSparePart, 
    requestDeleteConfirmation,
    setIsCreateWOOpen,
    hangars
  } = useCMMS();

  const [activeTab, setActiveTab] = useState<'overview' | 'procurement' | 'history'>('overview');

  // Quick stock operation inline state
  const [showStockOp, setShowStockOp] = useState<'IN' | 'OUT' | null>(null);
  const [stockOpQty, setStockOpQty] = useState<number>(1);
  const [stockOpReason, setStockOpReason] = useState<string>('');
  const [stockOpRef, setStockOpRef] = useState<string>('');
  const [stockOpUser, setStockOpUser] = useState<string>('م. علي رضا');

  if (!part) return null;

  const isLowStock = part.quantity <= part.minThreshold;
  const isOutOfStock = part.quantity === 0;

  const associatedHangar = hangars.find((h) => h.id === part.compatibleHangarId);

  const handleStockOpSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!part || stockOpQty <= 0) return;

    const details = {
      reason: stockOpReason.trim() || (showStockOp === 'IN' ? 'توريد وإضافة رصيد' : 'صرف لخط إنتاج'),
      referenceNumber: stockOpRef.trim() || (showStockOp === 'IN' ? 'PO-MANUAL' : 'REQ-MANUAL'),
      performedBy: stockOpUser.trim() || 'فني صيانة معتمد',
    };

    if (showStockOp === 'IN') {
      restockPart(part.id, stockOpQty, details);
    } else {
      consumePart(part.id, stockOpQty, details);
    }

    setShowStockOp(null);
    setStockOpQty(1);
    setStockOpReason('');
    setStockOpRef('');
  };

  const handleDelete = () => {
    requestDeleteConfirmation({
      title: 'حذف صنف من المستودع',
      message: `هل أنت متأكد من رغبتك في حذف الصنف [${part.partNumber}] ${part.name} نهائياً من المستودع؟`,
      itemDetails: `${part.partNumber} - ${part.name} (رصيد: ${part.quantity} ${part.unit})`,
      confirmLabel: 'حذف قطعة الغيار',
      onConfirm: () => {
        deleteSparePart(part.id);
        onClose();
      },
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-md overflow-y-auto">
      <div 
        id="spare-part-detail-modal"
        className="relative w-full max-w-4xl bg-[#1e293b] border border-[#334155] rounded-2xl shadow-2xl overflow-hidden my-4 flex flex-col max-h-[92vh]"
        dir="rtl"
      >
        {/* Header Bar */}
        <div className="p-6 border-b border-[#334155] bg-gradient-to-r from-slate-900 via-[#1e293b] to-slate-900">
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-start gap-4">
              <div className={`p-3.5 rounded-2xl border ${
                isOutOfStock
                  ? 'bg-red-950/40 text-red-400 border-red-500/40'
                  : isLowStock
                  ? 'bg-amber-950/40 text-amber-400 border-amber-500/40'
                  : 'bg-blue-950/40 text-blue-400 border-blue-500/40'
              }`}>
                <Package className="w-8 h-8" />
              </div>

              <div>
                <div className="flex flex-wrap items-center gap-2 mb-1.5">
                  <span className="font-mono text-xs font-black px-2.5 py-0.5 rounded-md bg-[#0f172a] text-blue-400 border border-blue-500/30">
                    {part.partNumber}
                  </span>
                  
                  {part.oemBrand && (
                    <span className="text-xs font-bold px-2 py-0.5 rounded-md bg-[#0f172a] text-cyan-300 border border-cyan-500/30 flex items-center gap-1 font-mono">
                      <Factory className="w-3 h-3 text-cyan-400" />
                      {part.oemBrand}
                    </span>
                  )}

                  {/* Criticality Badge */}
                  <span className={`text-xs font-bold px-2.5 py-0.5 rounded-md flex items-center gap-1 border ${
                    part.criticality === 'CRITICAL'
                      ? 'bg-red-500/20 text-red-400 border-red-500/40'
                      : part.criticality === 'MEDIUM'
                      ? 'bg-amber-500/20 text-amber-400 border-amber-500/40'
                      : 'bg-blue-500/20 text-blue-400 border-blue-500/40'
                  }`}>
                    <ShieldAlert className="w-3.5 h-3.5" />
                    <span>
                      {part.criticality === 'CRITICAL' ? 'أهمية حرجة جداً (CRITICAL)' :
                       part.criticality === 'MEDIUM' ? 'أهمية متوسطة (MEDIUM)' : 'أهمية منخفضة (LOW)'}
                    </span>
                  </span>

                  {/* Condition Badge */}
                  {part.condition && (
                    <span className="text-[11px] px-2 py-0.5 rounded-md bg-slate-800 text-slate-300 border border-slate-700">
                      {part.condition === 'NEW' ? 'جديدة بالكرتون' :
                       part.condition === 'REFURBISHED' ? 'مجددة ومفحوصة' : 'مستعملة صالحة'}
                    </span>
                  )}
                </div>

                <h2 className="text-lg sm:text-xl font-black text-white leading-snug">
                  {part.name}
                </h2>

                <div className="flex flex-wrap items-center gap-3 mt-2 text-xs text-slate-400">
                  <span className="flex items-center gap-1">
                    <Tag className="w-3.5 h-3.5 text-blue-400" />
                    <span>التصنيف: {part.category}</span>
                  </span>
                  <span>•</span>
                  <span className="flex items-center gap-1 font-mono">
                    <MapPin className="w-3.5 h-3.5 text-emerald-400" />
                    <span>الموقع: {part.binLocation}</span>
                  </span>
                  {part.oemPartNumber && (
                    <>
                      <span>•</span>
                      <span className="font-mono text-slate-300">
                        كود OEM: {part.oemPartNumber}
                      </span>
                    </>
                  )}
                </div>
              </div>
            </div>

            <div className="flex items-center gap-1.5">
              <button
                id="btn-edit-part"
                onClick={() => {
                  onEdit(part);
                  onClose();
                }}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold transition-all shadow-md"
              >
                <Edit3 className="w-3.5 h-3.5" />
                <span>تعديل الصنف</span>
              </button>

              <button
                id="btn-close-part-detail"
                onClick={onClose}
                className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Quick Actions Bar */}
          <div className="flex flex-wrap items-center justify-between gap-3 mt-4 pt-4 border-t border-[#334155] text-xs">
            <div className="flex items-center gap-2">
              <button
                id="btn-quick-stock-in"
                onClick={() => {
                  setShowStockOp('IN');
                  setStockOpQty(part.minThreshold);
                }}
                className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-emerald-950/40 hover:bg-emerald-600 text-emerald-300 hover:text-white border border-emerald-500/30 font-bold transition-all"
              >
                <ArrowDownRight className="w-4 h-4" />
                <span>إذن توريد مستودعي (+)</span>
              </button>

              <button
                id="btn-quick-stock-out"
                onClick={() => {
                  setShowStockOp('OUT');
                  setStockOpQty(1);
                }}
                className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-rose-950/40 hover:bg-rose-600 text-rose-300 hover:text-white border border-rose-500/30 font-bold transition-all"
              >
                <ArrowUpRight className="w-4 h-4" />
                <span>إذن صرف لخط إنتاج (-)</span>
              </button>
            </div>

            <div className="flex items-center gap-2">
              <button
                id="btn-create-wo-for-part"
                onClick={() => {
                  setIsCreateWOOpen(true);
                  onClose();
                }}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#0f172a] hover:bg-slate-800 text-slate-300 border border-[#334155] transition-colors"
              >
                <Wrench className="w-3.5 h-3.5 text-cyan-400" />
                <span>إنشاء أمر عمل مرتبط</span>
              </button>

              <button
                id="btn-delete-part"
                onClick={handleDelete}
                className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-red-400 hover:bg-red-500/20 border border-red-500/20 transition-colors"
                title="حذف القطعة من النظام"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>

        {/* Modal Tabs */}
        <div className="flex items-center gap-2 px-6 pt-3 border-b border-[#334155] bg-[#0f172a]/60 text-xs overflow-x-auto">
          <button
            onClick={() => setActiveTab('overview')}
            className={`flex items-center gap-1.5 px-4 py-2.5 font-bold rounded-t-lg transition-all border-b-2 whitespace-nowrap ${
              activeTab === 'overview'
                ? 'text-blue-400 border-blue-500 bg-[#1e293b]'
                : 'text-slate-400 border-transparent hover:text-slate-200 hover:bg-[#1e293b]/40'
            }`}
          >
            <Cpu className="w-3.5 h-3.5" />
            <span>المواصفات الهندسية والتوافق</span>
          </button>

          <button
            onClick={() => setActiveTab('procurement')}
            className={`flex items-center gap-1.5 px-4 py-2.5 font-bold rounded-t-lg transition-all border-b-2 whitespace-nowrap ${
              activeTab === 'procurement'
                ? 'text-blue-400 border-blue-500 bg-[#1e293b]'
                : 'text-slate-400 border-transparent hover:text-slate-200 hover:bg-[#1e293b]/40'
            }`}
          >
            <DollarSign className="w-3.5 h-3.5" />
            <span>الرصيد والتكاليف والمورد</span>
          </button>

          <button
            onClick={() => setActiveTab('history')}
            className={`flex items-center gap-1.5 px-4 py-2.5 font-bold rounded-t-lg transition-all border-b-2 whitespace-nowrap ${
              activeTab === 'history'
                ? 'text-blue-400 border-blue-500 bg-[#1e293b]'
                : 'text-slate-400 border-transparent hover:text-slate-200 hover:bg-[#1e293b]/40'
            }`}
          >
            <History className="w-3.5 h-3.5" />
            <span>سجل الحركات والتوريد والتدقيق ({part.movementHistory?.length || 0})</span>
          </button>
        </div>

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-5 text-xs">

          {/* Quick Stock Operation Box (IN/OUT) */}
          {showStockOp && (
            <div className="p-4 rounded-xl bg-blue-950/30 border border-blue-500/40 space-y-3 animate-fadeIn">
              <div className="flex items-center justify-between">
                <span className="font-bold text-white flex items-center gap-2">
                  {showStockOp === 'IN' ? (
                    <>
                      <ArrowDownRight className="w-4 h-4 text-emerald-400" />
                      <span>إجراء حركة توريد وإيداع بالمستودع (Stock In)</span>
                    </>
                  ) : (
                    <>
                      <ArrowUpRight className="w-4 h-4 text-rose-400" />
                      <span>إجراء حركة صرف لخط الإنتاج (Stock Out)</span>
                    </>
                  )}
                </span>
                <button
                  onClick={() => setShowStockOp(null)}
                  className="text-slate-400 hover:text-white"
                >
                  ✕
                </button>
              </div>

              <form onSubmit={handleStockOpSubmit} className="grid grid-cols-1 sm:grid-cols-4 gap-3">
                <div className="space-y-1">
                  <label className="text-slate-300 font-bold">الكمية ({part.unit})</label>
                  <input
                    type="number"
                    min="1"
                    max={showStockOp === 'OUT' ? part.quantity : 9999}
                    value={stockOpQty}
                    onChange={(e) => setStockOpQty(Math.max(1, parseInt(e.target.value) || 1))}
                    className="w-full bg-[#0f172a] border border-[#334155] rounded-lg px-3 py-2 text-white font-mono font-bold text-center focus:outline-none focus:border-blue-500"
                    required
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-slate-300 font-bold">رقم الإذن / الفاتورة / أمر العمل</label>
                  <input
                    type="text"
                    placeholder={showStockOp === 'IN' ? 'مثال: PO-2026-09-01' : 'مثال: WO-2026-003'}
                    value={stockOpRef}
                    onChange={(e) => setStockOpRef(e.target.value)}
                    className="w-full bg-[#0f172a] border border-[#334155] rounded-lg px-3 py-2 text-white font-mono focus:outline-none focus:border-blue-500"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-slate-300 font-bold">سبب الحركة / الوصف</label>
                  <input
                    type="text"
                    placeholder={showStockOp === 'IN' ? 'توريد دفعة دورية' : 'استبدال عاجل بماكينة الطباعة'}
                    value={stockOpReason}
                    onChange={(e) => setStockOpReason(e.target.value)}
                    className="w-full bg-[#0f172a] border border-[#334155] rounded-lg px-3 py-2 text-white focus:outline-none focus:border-blue-500"
                  />
                </div>

                <div className="flex items-end gap-2">
                  <button
                    type="submit"
                    className={`w-full py-2 px-3 rounded-lg font-bold text-white shadow-md ${
                      showStockOp === 'IN'
                        ? 'bg-emerald-600 hover:bg-emerald-500'
                        : 'bg-rose-600 hover:bg-rose-500'
                    }`}
                  >
                    تأكيد وتسجيل الحركة
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* TAB 1: OVERVIEW & TECHNICAL SPECS */}
          {activeTab === 'overview' && (
            <div className="space-y-4">
              {/* Technical Specs Box */}
              <div className="p-4 rounded-xl bg-[#0f172a] border border-[#334155] space-y-2">
                <div className="flex items-center justify-between text-slate-300 font-bold">
                  <span className="flex items-center gap-1.5 text-white">
                    <Wrench className="w-4 h-4 text-cyan-400" />
                    <span>المواصفات الفنية التفصيلية (Technical Specifications)</span>
                  </span>
                  <span className="text-[11px] text-slate-400 font-mono">
                    OEM: {part.oemBrand || 'غير محدد'}
                  </span>
                </div>
                <div className="p-3 rounded-lg bg-[#1e293b] border border-[#334155] font-mono text-slate-200 leading-relaxed text-xs">
                  {part.specifications || 'لم يتم تسجيل مواصفات فنية تفصيلية لهذا الصنف.'}
                </div>
              </div>

              {/* Grid: Location & Compatibility */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Storage Location Card */}
                <div className="p-4 rounded-xl bg-[#0f172a] border border-[#334155] space-y-2.5">
                  <div className="font-bold text-white flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-emerald-400" />
                    <span>موقع التخزين بالمستودع</span>
                  </div>
                  <div className="p-3 rounded-lg bg-[#1e293b] border border-[#334155] flex items-center justify-between">
                    <span className="text-slate-400">الرف / الخانة / الصندوق:</span>
                    <span className="font-mono text-sm font-bold text-emerald-400">{part.binLocation}</span>
                  </div>
                  {associatedHangar && (
                    <div className="flex items-center justify-between text-slate-400 pt-1">
                      <span>القاعة المخصصة للخدمة:</span>
                      <span className="text-white font-bold">{associatedHangar.name} ({associatedHangar.nameEn})</span>
                    </div>
                  )}
                </div>

                {/* Compatibility Card */}
                <div className="p-4 rounded-xl bg-[#0f172a] border border-[#334155] space-y-2.5">
                  <div className="font-bold text-white flex items-center gap-2">
                    <Building2 className="w-4 h-4 text-blue-400" />
                    <span>الماكينات وخطوط الإنتاج المتوافقة</span>
                  </div>
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {part.compatibleMachines && part.compatibleMachines.length > 0 ? (
                      part.compatibleMachines.map((machine) => (
                        <span
                          key={machine}
                          className="px-2.5 py-1 rounded-lg bg-[#1e293b] text-cyan-300 border border-cyan-500/30 font-mono text-xs"
                        >
                          {machine}
                        </span>
                      ))
                    ) : (
                      <span className="text-slate-500 italic">متوافق عام مع جميع ماكينات المصنع</span>
                    )}
                  </div>
                </div>
              </div>

              {/* Engineering Notes */}
              {part.notes && (
                <div className="p-4 rounded-xl bg-[#0f172a] border border-[#334155] space-y-2">
                  <div className="font-bold text-white flex items-center gap-2">
                    <FileText className="w-4 h-4 text-amber-400" />
                    <span>ملاحظات الصيانة والتركيب وشروط التخزين</span>
                  </div>
                  <p className="text-slate-300 leading-relaxed bg-[#1e293b] p-3 rounded-lg border border-[#334155]">
                    {part.notes}
                  </p>
                </div>
              )}
            </div>
          )}

          {/* TAB 2: STOCK, VALUATION & PROCUREMENT */}
          {activeTab === 'procurement' && (
            <div className="space-y-4">
              {/* Stock Gauge & Safety Margins */}
              <div className="p-4 rounded-xl bg-[#0f172a] border border-[#334155] space-y-4">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-white flex items-center gap-2">
                    <Boxes className="w-4 h-4 text-blue-400" />
                    <span>حالة الرصيد المخزني الفعلي</span>
                  </span>
                  <div className="flex items-center gap-2">
                    <span className="text-slate-400">الرصيد المتاح:</span>
                    <span className={`font-mono text-xl font-black ${
                      isOutOfStock ? 'text-red-500' : isLowStock ? 'text-amber-400' : 'text-emerald-400'
                    }`}>
                      {part.quantity}
                    </span>
                    <span className="text-slate-300 font-bold">{part.unit}</span>
                  </div>
                </div>

                {/* Progress bar with safety threshold marker */}
                <div className="space-y-1.5">
                  <div className="w-full bg-[#1e293b] h-3 rounded-full overflow-hidden relative">
                    <div
                      className={`h-full transition-all ${
                        isOutOfStock ? 'bg-red-600' : isLowStock ? 'bg-amber-500' : 'bg-emerald-500'
                      }`}
                      style={{
                        width: `${Math.min(100, (part.quantity / (part.maxThreshold || part.minThreshold * 3)) * 100)}%`,
                      }}
                    />
                  </div>

                  <div className="flex items-center justify-between text-[11px] text-slate-400 pt-1">
                    <span className="text-red-400 font-bold">حد الأمان الأدنى: {part.minThreshold} {part.unit}</span>
                    <span className="text-slate-300">الحد الأقصى للتخزين: {part.maxThreshold || part.minThreshold * 4} {part.unit}</span>
                  </div>
                </div>

                {/* Status Callout */}
                {isLowStock && (
                  <div className="p-3 rounded-xl bg-red-950/30 border border-red-500/40 text-red-300 flex items-center gap-3">
                    <AlertTriangle className="w-5 h-5 text-red-400 shrink-0" />
                    <div>
                      <div className="font-bold">تنبيه حرج: الرصيد انخفض تحت حد الأمان المطلوب!</div>
                      <div className="text-[11px] text-red-400/80">
                        فترة التوريد المتوقعة هي {part.leadTimeDays || 7} أيام. يجب إصدار طلب شراء فوري لتجنب توقف خطوط الإنتاج.
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Financial & Cost Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="p-3.5 rounded-xl bg-[#0f172a] border border-[#334155] space-y-1">
                  <span className="text-slate-400">سعر شراء الوحدة</span>
                  <div className="text-lg font-black font-mono text-emerald-400">
                    ${part.unitCost} <span className="text-xs text-slate-400">{part.currency || 'USD'}</span>
                  </div>
                </div>

                <div className="p-3.5 rounded-xl bg-[#0f172a] border border-[#334155] space-y-1">
                  <span className="text-slate-400">إجمالي القيمة المخزنية للصنف</span>
                  <div className="text-lg font-black font-mono text-white">
                    ${(part.quantity * part.unitCost).toLocaleString()} <span className="text-xs text-slate-400">{part.currency || 'USD'}</span>
                  </div>
                </div>

                <div className="p-3.5 rounded-xl bg-[#0f172a] border border-[#334155] space-y-1">
                  <span className="text-slate-400">مدة التوريد (Lead Time)</span>
                  <div className="text-lg font-black font-mono text-amber-400 flex items-center gap-1">
                    <Clock className="w-4 h-4" />
                    <span>{part.leadTimeDays || 7} أيام عمل</span>
                  </div>
                </div>
              </div>

              {/* Supplier Details Card */}
              <div className="p-4 rounded-xl bg-[#0f172a] border border-[#334155] space-y-3">
                <div className="font-bold text-white flex items-center justify-between">
                  <span className="flex items-center gap-2">
                    <Factory className="w-4 h-4 text-blue-400" />
                    <span>بيانات المورد الأساسي المعتمد</span>
                  </span>
                  <span className="text-slate-400 font-mono text-[11px]">
                    آخر توريد: {part.lastRestockedDate || 'غير مسجل'}
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="p-3 rounded-lg bg-[#1e293b] border border-[#334155]">
                    <span className="text-slate-400 block mb-1">اسم المورد / الوكيل:</span>
                    <span className="font-bold text-white text-sm">{part.supplierName || 'وكيل ومورد محلي معتمد'}</span>
                  </div>

                  <div className="p-3 rounded-lg bg-[#1e293b] border border-[#334155]">
                    <span className="text-slate-400 block mb-1">معلومات الاتصال والطلب:</span>
                    <span className="font-mono text-cyan-300 text-sm flex items-center gap-1.5">
                      <Phone className="w-3.5 h-3.5 text-cyan-400" />
                      {part.supplierContact || 'orders@flex-maintenance.com'}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: STOCK MOVEMENTS AUDIT TRAIL */}
          {activeTab === 'history' && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="font-bold text-white flex items-center gap-2">
                  <History className="w-4 h-4 text-blue-400" />
                  <span>سجل حركات الإدخال والصرف التدقيقي (Stock Movement Audit Trail)</span>
                </span>
                <span className="text-slate-400 font-mono">
                  إجمالي الحركات: {part.movementHistory?.length || 0}
                </span>
              </div>

              {part.movementHistory && part.movementHistory.length > 0 ? (
                <div className="rounded-xl border border-[#334155] overflow-hidden bg-[#0f172a]">
                  <table className="w-full text-right">
                    <thead className="bg-[#1e293b] text-slate-300 font-bold border-b border-[#334155]">
                      <tr>
                        <th className="p-3">التاريخ والوقت</th>
                        <th className="p-3">نوع الحركة</th>
                        <th className="p-3">الكمية</th>
                        <th className="p-3">الرصيد بعد الحركة</th>
                        <th className="p-3">رقم المرجع / الإذن</th>
                        <th className="p-3">السبب / الغرض</th>
                        <th className="p-3">القائم بالحركة</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#334155]">
                      {part.movementHistory.map((mov) => (
                        <tr key={mov.id} className="hover:bg-slate-800/50 transition-colors">
                          <td className="p-3 font-mono text-slate-300 whitespace-nowrap">
                            {mov.timestamp}
                          </td>
                          <td className="p-3 whitespace-nowrap">
                            {mov.type === 'IN' ? (
                              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 font-bold">
                                <ArrowDownRight className="w-3 h-3" />
                                وارد (+)
                              </span>
                            ) : (
                              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md bg-rose-500/20 text-rose-300 border border-rose-500/30 font-bold">
                                <ArrowUpRight className="w-3 h-3" />
                                صادر (-)
                              </span>
                            )}
                          </td>
                          <td className="p-3 font-mono font-bold text-white whitespace-nowrap">
                            {mov.type === 'IN' ? `+${mov.quantity}` : `-${mov.quantity}`} {part.unit}
                          </td>
                          <td className="p-3 font-mono font-bold text-cyan-300 whitespace-nowrap">
                            {mov.balanceAfter} {part.unit}
                          </td>
                          <td className="p-3 font-mono text-slate-300 text-[11px] whitespace-nowrap">
                            {mov.referenceNumber || '—'}
                          </td>
                          <td className="p-3 text-slate-200 max-w-xs truncate">
                            {mov.reason || '—'}
                          </td>
                          <td className="p-3 text-slate-300 text-[11px] whitespace-nowrap">
                            {mov.performedBy || 'فني صيانة'}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="p-8 rounded-xl bg-[#0f172a] border border-[#334155] text-center space-y-2">
                  <Boxes className="w-8 h-8 text-slate-500 mx-auto" />
                  <div className="font-bold text-slate-300">لا توجد حركات مخزنية مسجلة بعد لهذا الصنف</div>
                  <p className="text-slate-500 text-[11px]">
                    سيتم قيد حركات الصرف والتوريد آلياً عند إجراء أي حركة أو استهلاك بأوامر العمل.
                  </p>
                </div>
              )}
            </div>
          )}

        </div>

        {/* Modal Footer */}
        <div className="flex items-center justify-between px-6 py-3.5 border-t border-[#334155] bg-[#0f172a] text-xs">
          <div className="flex items-center gap-2 text-slate-400">
            <span>الصنف مسجل بكود: <strong className="text-white font-mono">{part.id}</strong></span>
          </div>

          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold transition-colors"
          >
            إغلاق
          </button>
        </div>
      </div>
    </div>
  );
};
