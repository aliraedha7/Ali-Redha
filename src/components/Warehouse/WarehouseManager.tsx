import React, { useState, useMemo } from 'react';
import { 
  Package, 
  Search, 
  AlertTriangle, 
  Plus, 
  Minus, 
  Layers, 
  DollarSign, 
  Tag, 
  MapPin, 
  CheckCircle2, 
  ArrowDownRight, 
  ArrowUpRight,
  ShieldAlert,
  Wrench,
  Boxes,
  Eye,
  Edit3,
  LayoutGrid,
  List,
  Factory,
  Cpu,
  Clock,
  Filter,
  Trash2
} from 'lucide-react';
import { useCMMS } from '../../context/CMMSContext';
import type { SparePart, SparePartCriticality, SparePartCondition } from '../../types';
import { SparePartFormModal } from './SparePartFormModal';
import { SparePartDetailModal } from './SparePartDetailModal';

export const WarehouseManager: React.FC = () => {
  const { 
    spareParts, 
    restockPart, 
    consumePart, 
    deleteSparePart,
    requestDeleteConfirmation,
    globalSearch, 
    setGlobalSearch,
    isCreatePartOpen,
    setIsCreatePartOpen,
    editingPart,
    setEditingPart,
    selectedPartDetail,
    setSelectedPartDetail,
    currentUser,
    checkPermission
  } = useCMMS();

  // Filters state
  const [categoryFilter, setCategoryFilter] = useState<string>('ALL');
  const [criticalityFilter, setCriticalityFilter] = useState<string>('ALL');
  const [conditionFilter, setConditionFilter] = useState<string>('ALL');
  const [onlyLowStock, setOnlyLowStock] = useState<boolean>(false);
  const [viewMode, setViewMode] = useState<'grid' | 'table'>('grid');

  // Quick Stock In / Out Modal State
  const [selectedPartForStockOp, setSelectedPartForStockOp] = useState<SparePart | null>(null);
  const [opType, setOpType] = useState<'IN' | 'OUT'>('IN');
  const [opQuantity, setOpQuantity] = useState<number>(1);
  const [opReason, setOpReason] = useState<string>('');
  const [opRef, setOpRef] = useState<string>('');

  // Categories list
  const categories = useMemo(() => {
    const set = new Set(spareParts.map((p) => p.category));
    return ['ALL', ...Array.from(set)];
  }, [spareParts]);

  // Filtered Parts
  const filteredParts = useMemo(() => {
    return spareParts.filter((part) => {
      if (categoryFilter !== 'ALL' && part.category !== categoryFilter) return false;
      if (criticalityFilter !== 'ALL' && part.criticality !== criticalityFilter) return false;
      if (conditionFilter !== 'ALL' && part.condition !== conditionFilter) return false;
      if (onlyLowStock && part.quantity > part.minThreshold) return false;

      const search = globalSearch.toLowerCase().trim();
      if (search) {
        const matchesName = part.name.toLowerCase().includes(search);
        const matchesNum = part.partNumber.toLowerCase().includes(search);
        const matchesBin = part.binLocation.toLowerCase().includes(search);
        const matchesOem = (part.oemBrand || '').toLowerCase().includes(search);
        const matchesOemNum = (part.oemPartNumber || '').toLowerCase().includes(search);
        const matchesSpecs = (part.specifications || '').toLowerCase().includes(search);
        const matchesCompat = (part.compatibleMachines || []).some((a) => a.toLowerCase().includes(search));
        
        if (!matchesName && !matchesNum && !matchesBin && !matchesOem && !matchesOemNum && !matchesSpecs && !matchesCompat) {
          return false;
        }
      }
      return true;
    });
  }, [spareParts, categoryFilter, criticalityFilter, conditionFilter, onlyLowStock, globalSearch]);

  // Inventory valuation calculation
  const totalValuation = useMemo(() => {
    return spareParts.reduce((sum, item) => sum + item.quantity * item.unitCost, 0);
  }, [spareParts]);

  const lowStockCount = useMemo(() => {
    return spareParts.filter((p) => p.quantity <= p.minThreshold).length;
  }, [spareParts]);

  const criticalPartsCount = useMemo(() => {
    return spareParts.filter((p) => p.criticality === 'CRITICAL').length;
  }, [spareParts]);

  const handleStockOperationSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!checkPermission('canManageWarehouse', 'اعتماد وتوثيق حركة التوريد أو الصرف')) return;
    if (!selectedPartForStockOp || opQuantity <= 0) return;

    const details = {
      reason: opReason.trim() || (opType === 'IN' ? 'توريد وإضافة رصيد' : 'صرف لخط إنتاج'),
      referenceNumber: opRef.trim() || (opType === 'IN' ? 'PO-MANUAL' : 'REQ-MANUAL'),
      performedBy: currentUser ? `${currentUser.fullName} (${currentUser.roleTitle})` : 'م. علي رضا',
    };

    if (opType === 'IN') {
      restockPart(selectedPartForStockOp.id, opQuantity, details);
    } else {
      consumePart(selectedPartForStockOp.id, opQuantity, details);
    }

    setSelectedPartForStockOp(null);
    setOpQuantity(1);
    setOpReason('');
    setOpRef('');
  };

  return (
    <div className="space-y-4" dir="rtl">
      {/* Overview Metric Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {/* Total items */}
        <div className="p-4 rounded-xl bg-[#1e293b] border border-[#334155] shadow-md flex items-center justify-between">
          <div>
            <span className="text-xs font-bold text-slate-400 block mb-1">إجمالي بنود قطع الغيار</span>
            <span className="text-2xl font-black font-mono text-white">{spareParts.length}</span>
            <span className="text-xs text-slate-400 mr-2">صنف مسجل بالكتالوج</span>
          </div>
          <div className="p-3 rounded-lg bg-blue-600/10 text-blue-400 border border-blue-500/20">
            <Boxes className="w-6 h-6" />
          </div>
        </div>

        {/* Critical items */}
        <div className="p-4 rounded-xl bg-[#1e293b] border border-red-500/30 shadow-md flex items-center justify-between">
          <div>
            <span className="text-xs font-bold text-slate-400 block mb-1">قطع حرجة جداً (Critical)</span>
            <span className="text-2xl font-black font-mono text-red-400">{criticalPartsCount}</span>
            <span className="text-xs text-slate-400 mr-2">توقف خطوط الإنتاج عند تعطلها</span>
          </div>
          <div className="p-3 rounded-lg bg-red-600/10 text-red-400 border border-red-500/20">
            <ShieldAlert className="w-6 h-6" />
          </div>
        </div>

        {/* Low Stock Alerts */}
        <div className={`p-4 rounded-xl border shadow-md flex items-center justify-between ${
          lowStockCount > 0 
            ? 'bg-amber-950/20 border-amber-500/50' 
            : 'bg-[#1e293b] border-[#334155]'
        }`}>
          <div>
            <span className="text-xs font-bold text-slate-400 block mb-1">تنبيهات انخفاض الرصيد</span>
            <span className="text-2xl font-black font-mono text-amber-400">{lowStockCount}</span>
            <span className="text-xs text-slate-400 mr-2">أصناف تحت حد الطلب الأدنى</span>
          </div>
          <div className="p-3 rounded-lg bg-amber-500/10 text-amber-400 border border-amber-500/20">
            <AlertTriangle className="w-6 h-6" />
          </div>
        </div>

        {/* Total Valuation */}
        <div className="p-4 rounded-xl bg-[#1e293b] border border-[#334155] shadow-md flex items-center justify-between">
          <div>
            <span className="text-xs font-bold text-slate-400 block mb-1">القيمة الإجمالية للمخزون</span>
            <span className="text-2xl font-black font-mono text-emerald-400">
              ${totalValuation.toLocaleString()}
            </span>
            <span className="text-xs text-slate-400 mr-2">دولار أمريكي</span>
          </div>
          <div className="p-3 rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
            <DollarSign className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* Main Toolbar & Search */}
      <div className="p-4 rounded-xl bg-[#1e293b] border border-[#334155] shadow-md space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <Package className="w-5 h-5 text-blue-400" />
            <h2 className="text-base font-bold text-white">
              كتالوج مستودع قطع الغيار والعدد الفنية ({filteredParts.length})
            </h2>
          </div>

          <div className="flex items-center gap-2">
            {/* View Mode Toggle */}
            <div className="flex items-center bg-[#0f172a] rounded-lg border border-[#334155] p-0.5">
              <button
                id="btn-view-grid"
                onClick={() => setViewMode('grid')}
                className={`p-1.5 rounded-md transition-colors ${
                  viewMode === 'grid' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-white'
                }`}
                title="عرض البطاقات الفنية"
              >
                <LayoutGrid className="w-4 h-4" />
              </button>
              <button
                id="btn-view-table"
                onClick={() => setViewMode('table')}
                className={`p-1.5 rounded-md transition-colors ${
                  viewMode === 'table' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-white'
                }`}
                title="عرض الجدول الهندسي"
              >
                <List className="w-4 h-4" />
              </button>
            </div>

            {/* Filter Low Stock Button */}
            <button
              id="btn-filter-low-stock"
              onClick={() => setOnlyLowStock(!onlyLowStock)}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-bold transition-all border ${
                onlyLowStock
                  ? 'bg-amber-600 text-white border-amber-500 shadow-md shadow-amber-600/30'
                  : 'bg-[#0f172a] text-slate-300 hover:text-white border-[#334155]'
              }`}
            >
              <AlertTriangle className="w-3.5 h-3.5" />
              <span>تحت حد الأمان ({lowStockCount})</span>
            </button>

            {/* Add New Part Button */}
            <button
              id="btn-add-spare-part"
              onClick={() => {
                if (!checkPermission('canManageWarehouse', 'إضافة صنف وقطعة غيار جديدة')) return;
                setEditingPart(null);
                setIsCreatePartOpen(true);
              }}
              className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold shadow-lg shadow-blue-600/30 transition-all"
            >
              <Plus className="w-4 h-4" />
              <span>إضافة قطعة غيار جديدة</span>
            </button>
          </div>
        </div>

        {/* Filter Controls Row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5 pt-1 text-xs">
          {/* Search Box */}
          <div className="relative sm:col-span-2 lg:col-span-1">
            <Search className="w-3.5 h-3.5 absolute right-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              id="input-search-parts"
              type="text"
              placeholder="بحث بالاسم، كود القطعة، OEM، الرف..."
              value={globalSearch}
              onChange={(e) => setGlobalSearch(e.target.value)}
              className="w-full bg-[#0f172a] border border-[#334155] rounded-lg pr-9 pl-3 py-2 text-slate-200 placeholder-slate-500 focus:outline-none focus:border-blue-500"
            />
          </div>

          {/* Category Filter */}
          <div>
            <select
              id="select-category-filter"
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="w-full bg-[#0f172a] border border-[#334155] rounded-lg px-3 py-2 text-slate-200 focus:outline-none focus:border-blue-500"
            >
              {categories.map((c) => (
                <option key={c} value={c}>
                  {c === 'ALL' ? 'جميع التصنيفات الهندسية' : c}
                </option>
              ))}
            </select>
          </div>

          {/* Criticality Filter */}
          <div>
            <select
              id="select-criticality-filter"
              value={criticalityFilter}
              onChange={(e) => setCriticalityFilter(e.target.value)}
              className="w-full bg-[#0f172a] border border-[#334155] rounded-lg px-3 py-2 text-slate-200 focus:outline-none focus:border-blue-500"
            >
              <option value="ALL">جميع درجات الخطورة</option>
              <option value="CRITICAL">حرجة جداً (CRITICAL)</option>
              <option value="MEDIUM">متوسطة (MEDIUM)</option>
              <option value="LOW">منخفضة (LOW)</option>
            </select>
          </div>

          {/* Condition Filter */}
          <div>
            <select
              id="select-condition-filter"
              value={conditionFilter}
              onChange={(e) => setConditionFilter(e.target.value)}
              className="w-full bg-[#0f172a] border border-[#334155] rounded-lg px-3 py-2 text-slate-200 focus:outline-none focus:border-blue-500"
            >
              <option value="ALL">جميع الحالات التخزينية</option>
              <option value="NEW">جديدة بالكرتون (NEW)</option>
              <option value="REFURBISHED">مجددة ومفحوصة (REFURBISHED)</option>
              <option value="USABLE">مستعملة صالحة (USABLE)</option>
            </select>
          </div>
        </div>
      </div>

      {/* Grid View of Spare Parts */}
      {viewMode === 'grid' && (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {filteredParts.map((part) => {
            const isLowStock = part.quantity <= part.minThreshold;
            const isOutOfStock = part.quantity === 0;

            return (
              <div
                key={part.id}
                id={`part-card-${part.id}`}
                className={`p-4 rounded-xl border transition-all shadow-md hover:shadow-lg flex flex-col justify-between group ${
                  isOutOfStock
                    ? 'bg-red-950/20 border-red-500/50 hover:border-red-400'
                    : isLowStock
                    ? 'bg-amber-950/15 border-amber-500/40 hover:border-amber-400'
                    : 'bg-[#1e293b] border-[#334155] hover:border-blue-500/40'
                }`}
              >
                <div className="space-y-2.5">
                  {/* Header: Part Number, OEM, Criticality */}
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex flex-wrap items-center gap-1.5">
                      <span className="font-mono text-xs font-black px-2 py-0.5 rounded bg-[#0f172a] text-blue-400 border border-blue-500/30">
                        {part.partNumber}
                      </span>
                      
                      {part.oemBrand && (
                        <span className="text-[11px] font-mono bg-[#0f172a] text-cyan-300 px-2 py-0.5 rounded border border-[#334155] flex items-center gap-1">
                          <Factory className="w-3 h-3 text-cyan-400" />
                          {part.oemBrand}
                        </span>
                      )}

                      {/* Criticality Badge */}
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded border flex items-center gap-1 ${
                        part.criticality === 'CRITICAL'
                          ? 'bg-red-500/20 text-red-400 border-red-500/40'
                          : part.criticality === 'MEDIUM'
                          ? 'bg-amber-500/20 text-amber-400 border-amber-500/40'
                          : 'bg-blue-500/20 text-blue-400 border-blue-500/40'
                      }`}>
                        <ShieldAlert className="w-3 h-3" />
                        <span>
                          {part.criticality === 'CRITICAL' ? 'حرجة' :
                           part.criticality === 'MEDIUM' ? 'متوسطة' : 'عادية'}
                        </span>
                      </span>
                    </div>

                    <div className="flex items-center gap-1 text-[11px] text-slate-400 font-mono">
                      <MapPin className="w-3.5 h-3.5 text-emerald-400" />
                      <span>رف: {part.binLocation}</span>
                    </div>
                  </div>

                  {/* Name & Category */}
                  <div>
                    <h3 
                      onClick={() => setSelectedPartDetail(part)}
                      className="text-sm font-bold text-white leading-snug cursor-pointer hover:text-blue-400 transition-colors line-clamp-2"
                    >
                      {part.name}
                    </h3>
                    <div className="text-[11px] text-slate-400 mt-0.5">
                      التصنيف: {part.category}
                    </div>
                  </div>

                  {/* Specifications snippet */}
                  {part.specifications && (
                    <div className="p-2 rounded-lg bg-[#0f172a] border border-[#334155]/70 text-[11px] font-mono text-slate-300 truncate">
                      {part.specifications}
                    </div>
                  )}

                  {/* Compatible Machines */}
                  <div className="flex flex-wrap items-center gap-1 text-[10px]">
                    <span className="text-slate-400">متوافق مع:</span>
                    {part.compatibleMachines && part.compatibleMachines.length > 0 ? (
                      part.compatibleMachines.slice(0, 3).map((assetId) => (
                        <span
                          key={assetId}
                          className="font-mono bg-[#0f172a] text-cyan-300 px-1.5 py-0.5 rounded border border-[#334155]"
                        >
                          {assetId}
                        </span>
                      ))
                    ) : (
                      <span className="text-slate-500 italic">عام للمعمل</span>
                    )}
                    {part.compatibleMachines && part.compatibleMachines.length > 3 && (
                      <span className="text-slate-400 text-[10px]">+{part.compatibleMachines.length - 3}</span>
                    )}
                  </div>

                  {/* Stock Level & Status Bar */}
                  <div className="p-3 rounded-lg bg-[#0f172a] border border-[#334155] space-y-2">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-slate-400">الرصيد المتاح:</span>
                      <div className="flex items-baseline gap-1">
                        <span className={`font-mono text-lg font-black ${
                          isOutOfStock ? 'text-red-500' : isLowStock ? 'text-amber-400' : 'text-emerald-400'
                        }`}>
                          {part.quantity}
                        </span>
                        <span className="text-[11px] text-slate-400">{part.unit}</span>
                      </div>
                    </div>

                    <div className="w-full bg-[#1e293b] h-2 rounded-full overflow-hidden">
                      <div
                        className={`h-full transition-all ${
                          isOutOfStock ? 'bg-red-600' : isLowStock ? 'bg-amber-500' : 'bg-emerald-500'
                        }`}
                        style={{
                          width: `${Math.min(100, (part.quantity / (part.minThreshold * 2.5 || 10)) * 100)}%`,
                        }}
                      />
                    </div>

                    <div className="flex items-center justify-between text-[11px] text-slate-400">
                      <span>حد الأمان: {part.minThreshold} {part.unit}</span>
                      <span className="font-mono text-emerald-400 font-bold">
                        ${part.unitCost} <span className="text-[10px] text-slate-400">/{part.unit}</span>
                      </span>
                    </div>
                  </div>

                  {/* Warning Banner */}
                  {isLowStock && (
                    <div className="p-2 rounded-lg bg-amber-500/15 border border-amber-500/30 text-amber-300 text-[11px] flex items-center gap-2 font-bold animate-pulse">
                      <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0" />
                      <span>تنبيه: الرصيد أقل من حد الأمان! (مدة التوريد: {part.leadTimeDays || 7} أيام)</span>
                    </div>
                  )}
                </div>

                {/* Card Actions Footer */}
                <div className="pt-3 mt-3 border-t border-[#334155] flex items-center justify-between gap-2 text-xs">
                  {/* Left: View Details & Edit */}
                  <div className="flex items-center gap-1.5">
                    <button
                      id={`btn-view-detail-${part.id}`}
                      onClick={() => setSelectedPartDetail(part)}
                      className="p-1.5 rounded-lg bg-[#0f172a] hover:bg-slate-800 text-slate-300 hover:text-white border border-[#334155] transition-colors"
                      title="عرض المواصفات الكاملة وسجل الحركات"
                    >
                      <Eye className="w-4 h-4 text-blue-400" />
                    </button>

                    <button
                      id={`btn-edit-part-${part.id}`}
                      onClick={() => {
                        if (!checkPermission('canManageWarehouse', 'تعديل مواصفات وبيانات قطعة الغيار')) return;
                        setEditingPart(part);
                        setIsCreatePartOpen(true);
                      }}
                      className="p-1.5 rounded-lg bg-[#0f172a] hover:bg-slate-800 text-slate-300 hover:text-white border border-[#334155] transition-colors"
                      title="تعديل تفاصيل القطعة"
                    >
                      <Edit3 className="w-4 h-4 text-amber-400" />
                    </button>

                    <button
                      id={`btn-delete-part-${part.id}`}
                      onClick={() => {
                        if (!checkPermission('canManageWarehouse', 'حذف قطعة غيار من المستودع')) return;
                        requestDeleteConfirmation({
                          title: 'حذف صنف من المستودع',
                          message: `هل أنت متأكد من رغبتك في حذف قطعة الغيار [${part.name}] (${part.partNumber}) نهائياً من المستودع؟`,
                          itemDetails: `${part.partNumber} - رصيد: ${part.quantity} ${part.unit}`,
                          confirmLabel: 'حذف قطعة الغيار',
                          onConfirm: () => {
                            deleteSparePart(part.id);
                          },
                        });
                      }}
                      className="p-1.5 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-400 hover:text-red-300 border border-red-500/30 transition-colors"
                      title="حذف هذا الصنف من المستودع"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                  {/* Right: Quick Stock In / Stock Out */}
                  <div className="flex items-center gap-1.5 font-bold">
                    <button
                      id={`btn-quick-in-${part.id}`}
                      onClick={() => {
                        if (!checkPermission('canManageWarehouse', 'تنفيذ حركة توريد مخزني')) return;
                        setSelectedPartForStockOp(part);
                        setOpType('IN');
                        setOpQuantity(part.minThreshold || 2);
                      }}
                      className="flex items-center gap-1 bg-emerald-950/40 hover:bg-emerald-600 text-emerald-300 hover:text-white py-1.5 px-2.5 rounded-lg border border-emerald-500/30 transition-all text-[11px]"
                    >
                      <ArrowDownRight className="w-3.5 h-3.5" />
                      <span>توريد (+)</span>
                    </button>

                    <button
                      id={`btn-quick-out-${part.id}`}
                      onClick={() => {
                        if (!checkPermission('canManageWarehouse', 'تنفيذ حركة صرف مخزني')) return;
                        setSelectedPartForStockOp(part);
                        setOpType('OUT');
                        setOpQuantity(1);
                      }}
                      className="flex items-center gap-1 bg-rose-950/40 hover:bg-rose-600 text-rose-300 hover:text-white py-1.5 px-2.5 rounded-lg border border-rose-500/30 transition-all text-[11px]"
                    >
                      <ArrowUpRight className="w-3.5 h-3.5" />
                      <span>صرف (-)</span>
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Table View of Spare Parts */}
      {viewMode === 'table' && (
        <div className="rounded-xl border border-[#334155] overflow-hidden bg-[#1e293b] shadow-md">
          <div className="overflow-x-auto">
            <table className="w-full text-right text-xs">
              <thead className="bg-[#0f172a] text-slate-300 font-bold border-b border-[#334155]">
                <tr>
                  <th className="p-3">كود القطعة</th>
                  <th className="p-3">اسم الصنف والتوصيف</th>
                  <th className="p-3">العلامة OEM</th>
                  <th className="p-3">التصنيف</th>
                  <th className="p-3">درجة الأهمية</th>
                  <th className="p-3">الرصيد / حد الأمان</th>
                  <th className="p-3">الموقع</th>
                  <th className="p-3">سعر الوحدة</th>
                  <th className="p-3 text-center">الإجراءات الفنية</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#334155]">
                {filteredParts.map((part) => {
                  const isLowStock = part.quantity <= part.minThreshold;
                  return (
                    <tr key={part.id} className="hover:bg-slate-800/60 transition-colors">
                      <td className="p-3 font-mono font-bold text-blue-400 whitespace-nowrap">
                        {part.partNumber}
                      </td>
                      <td className="p-3">
                        <div 
                          onClick={() => setSelectedPartDetail(part)}
                          className="font-bold text-white cursor-pointer hover:text-blue-400 transition-colors"
                        >
                          {part.name}
                        </div>
                        {part.specifications && (
                          <div className="text-[11px] text-slate-400 font-mono truncate max-w-xs">
                            {part.specifications}
                          </div>
                        )}
                      </td>
                      <td className="p-3 font-mono text-cyan-300 whitespace-nowrap">
                        {part.oemBrand || '—'}
                      </td>
                      <td className="p-3 text-slate-300 whitespace-nowrap">
                        {part.category}
                      </td>
                      <td className="p-3 whitespace-nowrap">
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded border flex items-center gap-1 w-fit ${
                          part.criticality === 'CRITICAL'
                            ? 'bg-red-500/20 text-red-400 border-red-500/40'
                            : part.criticality === 'MEDIUM'
                            ? 'bg-amber-500/20 text-amber-400 border-amber-500/40'
                            : 'bg-blue-500/20 text-blue-400 border-blue-500/40'
                        }`}>
                          <ShieldAlert className="w-3 h-3" />
                          <span>
                            {part.criticality === 'CRITICAL' ? 'حرج' :
                             part.criticality === 'MEDIUM' ? 'متوسط' : 'عادي'}
                          </span>
                        </span>
                      </td>
                      <td className="p-3 whitespace-nowrap font-mono">
                        <span className={`font-black ${isLowStock ? 'text-amber-400' : 'text-emerald-400'}`}>
                          {part.quantity}
                        </span>
                        <span className="text-slate-400 text-[10px]"> / {part.minThreshold} {part.unit}</span>
                      </td>
                      <td className="p-3 font-mono text-emerald-400 whitespace-nowrap">
                        {part.binLocation}
                      </td>
                      <td className="p-3 font-mono text-white whitespace-nowrap">
                        ${part.unitCost}
                      </td>
                      <td className="p-3 whitespace-nowrap text-center">
                        <div className="flex items-center justify-center gap-1.5">
                          <button
                            onClick={() => setSelectedPartDetail(part)}
                            className="p-1 rounded-md bg-[#0f172a] hover:bg-slate-700 text-blue-400 border border-[#334155]"
                            title="تفاصيل الصنف"
                          >
                            <Eye className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => {
                              if (!checkPermission('canManageWarehouse', 'تعديل مواصفات وبيانات قطعة الغيار')) return;
                              setEditingPart(part);
                              setIsCreatePartOpen(true);
                            }}
                            className="p-1 rounded-md bg-[#0f172a] hover:bg-slate-700 text-amber-400 border border-[#334155]"
                            title="تعديل"
                          >
                            <Edit3 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => {
                              if (!checkPermission('canManageWarehouse', 'حذف قطعة غيار من المستودع')) return;
                              requestDeleteConfirmation({
                                title: 'حذف صنف من المستودع',
                                message: `هل أنت متأكد من رغبتك في حذف قطعة الغيار [${part.name}] (${part.partNumber}) نهائياً من المستودع؟`,
                                itemDetails: `${part.partNumber} - رصيد: ${part.quantity} ${part.unit}`,
                                confirmLabel: 'حذف قطعة الغيار',
                                onConfirm: () => {
                                  deleteSparePart(part.id);
                                },
                              });
                            }}
                            className="p-1 rounded-md bg-red-500/10 hover:bg-red-500/25 text-red-400 border border-red-500/30 transition-colors"
                            title="حذف الصنف نهائياً"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => {
                              if (!checkPermission('canManageWarehouse', 'تنفيذ حركة توريد مخزني')) return;
                              setSelectedPartForStockOp(part);
                              setOpType('IN');
                              setOpQuantity(part.minThreshold || 2);
                            }}
                            className="p-1 rounded-md bg-emerald-950/40 hover:bg-emerald-600 text-emerald-300 hover:text-white border border-emerald-500/30"
                            title="توريد"
                          >
                            <ArrowDownRight className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => {
                              if (!checkPermission('canManageWarehouse', 'تنفيذ حركة صرف مخزني')) return;
                              setSelectedPartForStockOp(part);
                              setOpType('OUT');
                              setOpQuantity(1);
                            }}
                            className="p-1 rounded-md bg-rose-950/40 hover:bg-rose-600 text-rose-300 hover:text-white border border-rose-500/30"
                            title="صرف"
                          >
                            <ArrowUpRight className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Empty State */}
      {filteredParts.length === 0 && (
        <div className="p-12 rounded-xl bg-[#1e293b] border border-[#334155] text-center space-y-3">
          <Boxes className="w-12 h-12 text-slate-500 mx-auto" />
          <h3 className="text-base font-bold text-white">لا توجد قطع غيار مطابقة لمعايير البحث الحالية</h3>
          <p className="text-xs text-slate-400 max-w-md mx-auto">
            يمكنك مسح معايير التصفية والبحث، أو الضغط على زر إضافة قطعة غيار جديدة لإدراج صنف صناعي جديد إلى المستودع.
          </p>
          <button
            onClick={() => {
              setGlobalSearch('');
              setCategoryFilter('ALL');
              setCriticalityFilter('ALL');
              setConditionFilter('ALL');
              setOnlyLowStock(false);
            }}
            className="px-4 py-2 rounded-lg bg-[#0f172a] text-blue-400 hover:bg-slate-800 border border-[#334155] text-xs font-bold transition-colors"
          >
            إعادة تعيين الفلاتر
          </button>
        </div>
      )}

      {/* Quick Stock Operation (In / Out) Modal */}
      {selectedPartForStockOp && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div 
            id="quick-stock-op-modal"
            className="relative w-full max-w-md bg-[#1e293b] border border-[#334155] rounded-2xl shadow-2xl overflow-hidden p-6 space-y-4"
            dir="rtl"
          >
            <div className="flex items-center justify-between border-b border-[#334155] pb-3">
              <div className="flex items-center gap-2">
                <Package className="w-5 h-5 text-blue-400" />
                <h3 className="text-sm font-bold text-white">
                  {opType === 'IN' ? 'توريد وإضافة رصيد مستودعي' : 'صرف قطعة غيار لخط إنتاج'}
                </h3>
              </div>
              <button
                onClick={() => setSelectedPartForStockOp(null)}
                className="text-slate-400 hover:text-white p-1 rounded-lg"
              >
                ✕
              </button>
            </div>

            <div className="p-3 rounded-lg bg-[#0f172a] border border-[#334155] text-xs space-y-1">
              <div className="font-bold text-white">{selectedPartForStockOp.name}</div>
              <div className="text-slate-400 font-mono">
                كود: {selectedPartForStockOp.partNumber} • موقع الرف: {selectedPartForStockOp.binLocation}
              </div>
              <div className="text-emerald-400 font-bold">
                الرصيد الراهن بالمستودع: {selectedPartForStockOp.quantity} {selectedPartForStockOp.unit}
              </div>
            </div>

            <form onSubmit={handleStockOperationSubmit} className="space-y-3 text-xs">
              <div className="space-y-1">
                <label className="font-bold text-slate-300">
                  {opType === 'IN' ? 'الكمية الموردة' : 'الكمية المطلوب صرفها'}
                </label>
                <input
                  type="number"
                  min="1"
                  max={opType === 'OUT' ? selectedPartForStockOp.quantity : 9999}
                  value={opQuantity}
                  onChange={(e) => setOpQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                  className="w-full bg-[#0f172a] border border-[#334155] rounded-lg px-3 py-2 text-slate-100 font-mono text-center text-sm font-bold focus:outline-none focus:border-blue-500"
                  required
                />
              </div>

              <div className="space-y-1">
                <label className="font-bold text-slate-300">رقم الإذن / الفاتورة / أمر العمل</label>
                <input
                  type="text"
                  placeholder={opType === 'IN' ? 'مثال: PO-2026-09-441' : 'مثال: WO-2026-012'}
                  value={opRef}
                  onChange={(e) => setOpRef(e.target.value)}
                  className="w-full bg-[#0f172a] border border-[#334155] rounded-lg px-3 py-2 text-slate-100 font-mono focus:outline-none focus:border-blue-500"
                />
              </div>

              <div className="space-y-1">
                <label className="font-bold text-slate-300">
                  {opType === 'IN' ? 'ملاحظات التوريد أو اسم المورد' : 'سبب الصرف / الماكينة المستفيدة'}
                </label>
                <input
                  type="text"
                  placeholder={opType === 'IN' ? 'توريد دفعة دورية' : 'مثال: صيانة خط طباعة Bobst 01'}
                  value={opReason}
                  onChange={(e) => setOpReason(e.target.value)}
                  className="w-full bg-[#0f172a] border border-[#334155] rounded-lg px-3 py-2 text-slate-100 focus:outline-none focus:border-blue-500"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setSelectedPartForStockOp(null)}
                  className="px-4 py-2 rounded-lg bg-[#0f172a] text-slate-300 hover:bg-[#334155] border border-[#334155] font-bold"
                >
                  إلغاء
                </button>
                <button
                  type="submit"
                  className={`px-5 py-2 rounded-lg font-bold text-white shadow-md ${
                    opType === 'IN'
                      ? 'bg-emerald-600 hover:bg-emerald-500'
                      : 'bg-rose-600 hover:bg-rose-500'
                  }`}
                >
                  تأكيد الحركة وتحديث الرصيد
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Spare Part Form Modal (Create / Edit) */}
      <SparePartFormModal
        isOpen={isCreatePartOpen}
        onClose={() => {
          setIsCreatePartOpen(false);
          setEditingPart(null);
        }}
        partToEdit={editingPart}
      />

      {/* Spare Part Detail Modal */}
      <SparePartDetailModal
        part={selectedPartDetail}
        onClose={() => setSelectedPartDetail(null)}
        onEdit={(part) => {
          setEditingPart(part);
          setIsCreatePartOpen(true);
        }}
      />
    </div>
  );
};
