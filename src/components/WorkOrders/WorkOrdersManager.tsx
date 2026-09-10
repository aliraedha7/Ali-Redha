import React, { useState, useMemo } from 'react';
import { 
  ClipboardList, 
  Plus, 
  Search, 
  Filter, 
  Kanban, 
  Table as TableIcon, 
  ShieldAlert, 
  Clock, 
  Wrench, 
  User, 
  Package, 
  ChevronRight, 
  ChevronLeft, 
  CheckCircle2, 
  AlertCircle,
  FileSpreadsheet,
  Edit3,
  Shield,
  Trash2
} from 'lucide-react';
import { useCMMS } from '../../context/CMMSContext';
import { WorkOrder, WorkOrderStatus, WorkOrderType, WorkOrderPriority } from '../../types';

export const WorkOrdersManager: React.FC = () => {
  const { 
    workOrders, 
    updateWorkOrderStatus, 
    deleteWorkOrder,
    requestDeleteConfirmation,
    setIsCreateWOOpen, 
    setSelectedWOForDetail,
    setEditingWorkOrder,
    globalSearch,
    setGlobalSearch,
    checkPermission,
    currentUser
  } = useCMMS();

  const isDeveloper = Boolean(
    currentUser?.isSuperDeveloper || 
    currentUser?.role === 'DEVELOPER' || 
    currentUser?.permissions?.canViewDeveloperHub
  );

  const [viewMode, setViewMode] = useState<'kanban' | 'table'>('kanban');
  const [statusFilter, setStatusFilter] = useState<WorkOrderStatus | 'ALL'>('ALL');
  const [priorityFilter, setPriorityFilter] = useState<WorkOrderPriority | 'ALL'>('ALL');
  const [typeFilter, setTypeFilter] = useState<WorkOrderType | 'ALL'>('ALL');

  const kanbanColumns: { id: WorkOrderStatus; title: string; color: string }[] = [
    { id: 'REQUESTED', title: 'قيد البلاغ (Requested)', color: 'border-slate-500 text-slate-300' },
    { id: 'APPROVED', title: 'معتمد (Approved)', color: 'border-blue-500 text-blue-400' },
    { id: 'IN_PROGRESS', title: 'قيد التنفيذ (In Progress)', color: 'border-amber-500 text-amber-400' },
    { id: 'PENDING_PARTS', title: 'بانتظار قطع غيار (Parts)', color: 'border-purple-500 text-purple-400' },
    { id: 'COMPLETED', title: 'منجز (Completed)', color: 'border-emerald-500 text-emerald-400' },
    { id: 'CLOSED', title: 'مغلق ومؤرشف (Closed)', color: 'border-slate-600 text-slate-400' },
  ];

  const filteredWorkOrders = useMemo(() => {
    return workOrders.filter((wo) => {
      if (statusFilter !== 'ALL' && wo.status !== statusFilter) return false;
      if (priorityFilter !== 'ALL' && wo.priority !== priorityFilter) return false;
      if (typeFilter !== 'ALL' && wo.type !== typeFilter) return false;
      const search = globalSearch.toLowerCase().trim();
      if (search) {
        const matchesId = wo.id.toLowerCase().includes(search);
        const matchesTitle = wo.title.toLowerCase().includes(search);
        const matchesAsset = wo.assetId.toLowerCase().includes(search) || wo.assetName.toLowerCase().includes(search);
        const matchesTech = wo.assignedTo.toLowerCase().includes(search);
        if (!matchesId && !matchesTitle && !matchesAsset && !matchesTech) return false;
      }
      return true;
    });
  }, [workOrders, statusFilter, priorityFilter, typeFilter, globalSearch]);

  const getPriorityBadge = (priority: WorkOrderPriority) => {
    switch (priority) {
      case 'CRITICAL_STOPPAGE':
        return (
          <span className="bg-red-500/20 text-red-300 border border-red-500/40 px-2 py-0.5 rounded text-[10px] font-bold flex items-center gap-1 animate-pulse">
            <ShieldAlert className="w-3 h-3" />
            <span>توقف خط إنتاج</span>
          </span>
        );
      case 'HIGH':
        return (
          <span className="bg-yellow-500/20 text-yellow-300 border border-yellow-500/40 px-2 py-0.5 rounded text-[10px] font-bold">
            عالية (HIGH)
          </span>
        );
      case 'MEDIUM':
        return (
          <span className="bg-blue-500/20 text-blue-300 border border-blue-500/40 px-2 py-0.5 rounded text-[10px] font-bold">
            متوسطة (MED)
          </span>
        );
      case 'LOW':
        return (
          <span className="bg-[#334155] text-slate-300 border border-[#475569] px-2 py-0.5 rounded text-[10px] font-bold">
            منخفضة (LOW)
          </span>
        );
    }
  };

  const getTypeLabel = (type: WorkOrderType) => {
    switch (type) {
      case 'EMERGENCY_BREAKDOWN':
        return <span className="text-red-400 font-bold">توقف طارئ</span>;
      case 'PREVENTIVE':
        return <span className="text-green-400 font-bold">وقائية</span>;
      case 'CORRECTIVE':
        return <span className="text-yellow-400 font-bold">تصحيحية</span>;
      case 'INSPECTION':
        return <span className="text-blue-400 font-bold">فحص ومعايرة</span>;
    }
  };

  const handleExportCSV = () => {
    const headers = ['رقم الأمر', 'الماكينة', 'العنوان', 'النوع', 'الأولوية', 'الحالة', 'الفني المكلف', 'التوقف (دقيقة)', 'تاريخ البلاغ'];
    const rows = filteredWorkOrders.map((wo) => [
      wo.id,
      wo.assetId,
      `"${wo.title.replace(/"/g, '""')}"`,
      wo.type,
      wo.priority,
      wo.status,
      `"${wo.assignedTo}"`,
      wo.downtimeMinutes,
      wo.reportedAt,
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,\uFEFF' + [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `CMMS_WorkOrders_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-4">
      {/* Action and Filter Controls */}
      <div className="p-5 rounded-xl bg-[#1e293b] border border-[#334155] shadow-md space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <ClipboardList className="w-5 h-5 text-blue-400" />
            <h2 className="text-base font-bold text-white">
              إدارة أوامر العمل والتدخلات الفنية ({filteredWorkOrders.length})
            </h2>
          </div>

          <div className="flex items-center gap-2">
            {/* View Switcher */}
            <div className="flex items-center bg-[#0f172a] p-1 rounded-lg border border-[#334155]">
              <button
                onClick={() => setViewMode('kanban')}
                className={`flex items-center gap-1 px-2.5 py-1 rounded text-xs transition-colors ${
                  viewMode === 'kanban' ? 'bg-blue-600 text-white font-bold' : 'text-slate-400 hover:text-white'
                }`}
              >
                <Kanban className="w-3.5 h-3.5" />
                <span>لوحة كانبان (Kanban)</span>
              </button>
              <button
                onClick={() => setViewMode('table')}
                className={`flex items-center gap-1 px-2.5 py-1 rounded text-xs transition-colors ${
                  viewMode === 'table' ? 'bg-blue-600 text-white font-bold' : 'text-slate-400 hover:text-white'
                }`}
              >
                <TableIcon className="w-3.5 h-3.5" />
                <span>جدول البيانات</span>
              </button>
            </div>

            <button
              onClick={handleExportCSV}
              className="flex items-center gap-1 bg-[#0f172a] hover:bg-[#334155] text-slate-300 px-3 py-1.5 rounded-lg text-xs border border-[#334155] transition-colors"
              title="تصدير كملف إكسل CSV"
            >
              <FileSpreadsheet className="w-4 h-4 text-green-400" />
              <span>تصدير CSV</span>
            </button>

            <button
              onClick={() => {
                if (!checkPermission('canManageWorkOrders', 'إصدار أوامر عمل جديدة')) return;
                setIsCreateWOOpen(true);
              }}
              className="flex items-center gap-1.5 bg-blue-600 hover:bg-blue-500 text-white px-3.5 py-1.5 rounded-lg text-xs font-bold shadow-md shadow-blue-600/20 transition-all active:scale-95"
            >
              <Plus className="w-4 h-4" />
              <span>إصدار أمر عمل جديد</span>
            </button>
          </div>
        </div>

        {/* Filter Dropdowns */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5 pt-1 text-xs">
          <div className="relative">
            <Search className="w-3.5 h-3.5 absolute right-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="بحث في رقم الأمر، الماكينة، الفني..."
              value={globalSearch}
              onChange={(e) => setGlobalSearch(e.target.value)}
              className="w-full bg-[#0f172a] border border-[#334155] rounded-lg pr-9 pl-3 py-2 text-slate-200 placeholder-slate-500 focus:outline-none focus:border-blue-500"
            />
          </div>

          <div>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as any)}
              className="w-full bg-[#0f172a] border border-[#334155] rounded-lg px-3 py-2 text-slate-200 focus:outline-none focus:border-blue-500"
            >
              <option value="ALL">جميع المراحل والحالات</option>
              <option value="REQUESTED">قيد البلاغ (Requested)</option>
              <option value="APPROVED">معتمد (Approved)</option>
              <option value="IN_PROGRESS">قيد التنفيذ (In Progress)</option>
              <option value="PENDING_PARTS">بانتظار قطع غيار (Pending Parts)</option>
              <option value="COMPLETED">منجز (Completed)</option>
              <option value="CLOSED">مغلق ومؤرشف (Closed)</option>
            </select>
          </div>

          <div>
            <select
              value={priorityFilter}
              onChange={(e) => setPriorityFilter(e.target.value as any)}
              className="w-full bg-[#0f172a] border border-[#334155] rounded-lg px-3 py-2 text-slate-200 focus:outline-none focus:border-blue-500"
            >
              <option value="ALL">جميع الأولويات</option>
              <option value="CRITICAL_STOPPAGE">توقف خط إنتاج (CRITICAL)</option>
              <option value="HIGH">عالية (HIGH)</option>
              <option value="MEDIUM">متوسطة (MEDIUM)</option>
              <option value="LOW">منخفضة (LOW)</option>
            </select>
          </div>

          <div>
            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value as any)}
              className="w-full bg-[#0f172a] border border-[#334155] rounded-lg px-3 py-2 text-slate-200 focus:outline-none focus:border-blue-500"
            >
              <option value="ALL">جميع أنواع أوامر العمل</option>
              <option value="EMERGENCY_BREAKDOWN">توقف طارئ (EMERGENCY)</option>
              <option value="PREVENTIVE">صيانة وقائية (PREVENTIVE)</option>
              <option value="CORRECTIVE">تصحيحية وعلاجية (CORRECTIVE)</option>
              <option value="INSPECTION">فحص ومعايرة (INSPECTION)</option>
            </select>
          </div>
        </div>
      </div>

      {/* 1. Kanban Board View */}
      {viewMode === 'kanban' && (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-6 gap-3 overflow-x-auto pb-4">
          {kanbanColumns.map((col) => {
            const colWOs = filteredWorkOrders.filter((wo) => wo.status === col.id);

            return (
              <div
                key={col.id}
                className="bg-[#1e293b] border border-[#334155] rounded-xl p-3 flex flex-col min-h-[500px]"
              >
                {/* Column Header */}
                <div className={`pb-2.5 mb-2.5 border-b-2 flex items-center justify-between ${col.color}`}>
                  <h3 className="text-xs font-bold leading-tight">{col.title}</h3>
                  <span className="font-mono text-xs px-2 py-0.5 rounded-full bg-[#0f172a] font-bold">
                    {colWOs.length}
                  </span>
                </div>

                {/* Cards List */}
                <div className="space-y-2.5 flex-1 overflow-y-auto pr-0.5">
                  {colWOs.length === 0 ? (
                    <div className="text-center py-8 text-[11px] text-slate-500 border border-dashed border-[#334155] rounded-lg">
                      لا توجد أوامر في هذه المرحلة
                    </div>
                  ) : (
                    colWOs.map((wo) => (
                      <div
                        key={wo.id}
                        onClick={() => setSelectedWOForDetail(wo)}
                        className={`p-3 rounded-lg border transition-all cursor-pointer shadow-md hover:shadow-lg space-y-2 bg-[#0f172a] hover:bg-[#1a2333] ${
                          wo.priority === 'CRITICAL_STOPPAGE'
                            ? 'border-red-500/60 hover:border-red-400'
                            : 'border-[#334155] hover:border-blue-500/50'
                        }`}
                      >
                        {/* ID and Priority */}
                        <div className="flex items-center justify-between gap-1">
                          <span className="font-mono text-xs font-bold text-blue-400">
                            {wo.id}
                          </span>
                          {getPriorityBadge(wo.priority)}
                        </div>

                        {/* Title */}
                        <h4 className="text-xs font-bold text-white leading-snug line-clamp-2">
                          {wo.title}
                        </h4>

                        {/* Machine & Hangar */}
                        <div className="text-[11px] text-slate-400 flex items-center gap-1.5">
                          <span className="font-mono font-bold text-blue-400 bg-blue-600/15 px-1.5 py-0.2 rounded border border-blue-500/30">
                            {wo.assetId}
                          </span>
                          <span className="truncate">{wo.assetName}</span>
                        </div>

                        {/* Assigned Tech & Downtime */}
                        <div className="text-[10px] text-slate-400 flex items-center justify-between border-t border-[#334155] pt-1.5">
                          <div className="flex items-center gap-1 truncate max-w-[120px]">
                            <User className="w-3 h-3 text-slate-500" />
                            <span className="truncate">{wo.assignedTo}</span>
                          </div>

                          {wo.downtimeMinutes > 0 && (
                            <div className="font-mono text-red-400 font-bold flex items-center gap-0.5">
                              <Clock className="w-3 h-3" />
                              <span>{wo.downtimeMinutes}د</span>
                            </div>
                          )}
                        </div>

                        {/* Consumed Parts Count Indicator */}
                        {wo.consumedParts.length > 0 && (
                          <div className="text-[10px] text-yellow-300/80 flex items-center gap-1 bg-yellow-500/10 px-1.5 py-0.5 rounded">
                            <Package className="w-3 h-3" />
                            <span>{wo.consumedParts.length} قطع غيار مصروفة</span>
                          </div>
                        )}

                        {/* Developer-Only Field: Who reported the work order */}
                        {isDeveloper && (
                          <div className="text-[10px] text-purple-200 bg-purple-950/60 border border-purple-500/40 rounded px-2 py-1 flex items-center justify-between gap-1 shadow-sm">
                            <span className="flex items-center gap-1 text-purple-400 font-bold">
                              <Shield className="w-3 h-3 text-purple-400 flex-shrink-0" />
                              <span>رافع الطلب:</span>
                            </span>
                            <span className="font-semibold text-white truncate max-w-[130px]" title={wo.reportedBy}>
                              {wo.reportedBy || 'غير محدد'}
                            </span>
                          </div>
                        )}

                        {/* Quick Action Stage Jumpers & Edit Button */}
                        <div 
                          className="flex items-center justify-between pt-2 border-t border-[#334155]"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <div className="flex items-center gap-1.5">
                            <button
                              type="button"
                              onClick={() => {
                                if (!checkPermission('canManageWorkOrders', 'تعديل وتحديث أمر العمل')) return;
                                setEditingWorkOrder(wo);
                              }}
                              className="flex items-center gap-1 text-[11px] text-amber-300 hover:text-white bg-amber-500/15 hover:bg-amber-500/30 px-2 py-0.5 rounded border border-amber-500/30 transition-colors font-medium"
                              title="تعديل وتصحيح بيانات أمر العمل"
                            >
                              <Edit3 className="w-3 h-3 text-amber-400" />
                              <span>تعديل</span>
                            </button>

                            <button
                              type="button"
                              onClick={() => {
                                if (!checkPermission('canManageWorkOrders', 'حذف أمر العمل')) return;
                                requestDeleteConfirmation({
                                  title: 'حذف أمر العمل',
                                  message: `هل أنت متأكد من رغبتك في حذف أمر العمل [${wo.id}] (${wo.title}) نهائياً من المنظومة؟`,
                                  itemDetails: `${wo.id} - ${wo.assetName}`,
                                  confirmLabel: 'حذف أمر العمل',
                                  onConfirm: () => {
                                    deleteWorkOrder(wo.id);
                                  },
                                });
                              }}
                              className="p-1 rounded bg-red-500/10 hover:bg-red-500/25 text-red-400 hover:text-red-300 border border-red-500/30 transition-colors"
                              title="حذف أمر العمل نهائياً"
                            >
                              <Trash2 className="w-3 h-3" />
                            </button>
                          </div>

                          <div className="flex items-center gap-1">
                            <span className="text-[10px] text-slate-500 ml-1">المرحلة:</span>
                            {col.id !== 'REQUESTED' && (
                              <button
                                onClick={() => {
                                  if (!checkPermission('canManageWorkOrders', 'تغيير مرحلة أمر العمل')) return;
                                  const prevIdx = kanbanColumns.findIndex((c) => c.id === col.id) - 1;
                                  if (prevIdx >= 0) updateWorkOrderStatus(wo.id, kanbanColumns[prevIdx].id);
                                }}
                                className="p-1 rounded bg-[#1e293b] hover:bg-[#334155] text-slate-300 border border-[#334155]"
                                title="إرجاع للمرحلة السابقة"
                              >
                                <ChevronRight className="w-3 h-3" />
                              </button>
                            )}

                            {col.id !== 'CLOSED' && (
                              <button
                                onClick={() => {
                                  if (!checkPermission('canManageWorkOrders', 'تغيير مرحلة أمر العمل واعتماده')) return;
                                  const nextIdx = kanbanColumns.findIndex((c) => c.id === col.id) + 1;
                                  if (nextIdx < kanbanColumns.length) updateWorkOrderStatus(wo.id, kanbanColumns[nextIdx].id);
                                }}
                                className="p-1 rounded bg-[#1e293b] hover:bg-blue-600 hover:text-white text-slate-300 border border-[#334155] transition-colors"
                                title="تقديم للمرحلة التالية"
                              >
                                <ChevronLeft className="w-3 h-3" />
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* 2. Table View */}
      {viewMode === 'table' && (
        <div className="overflow-x-auto rounded-xl border border-[#334155] shadow-xl bg-[#1e293b]">
          <table className="w-full text-right text-xs">
            <thead className="bg-[#0f172a] text-slate-400 border-b border-[#334155] font-bold">
              <tr>
                <th className="p-3.5">رقم الأمر</th>
                <th className="p-3.5">عنوان البلاغ / التدخل</th>
                <th className="p-3.5">الماكينة</th>
                <th className="p-3.5">النوع</th>
                <th className="p-3.5">الأولوية</th>
                <th className="p-3.5">الحالة الراهنة</th>
                {isDeveloper && (
                  <th className="p-3.5 bg-purple-950/40 text-purple-300 border-x border-purple-500/30 whitespace-nowrap">
                    <div className="flex items-center gap-1.5">
                      <Shield className="w-3.5 h-3.5 text-purple-400" />
                      <span>من رفع طلب الصيانة (صلاحية مطور)</span>
                    </div>
                  </th>
                )}
                <th className="p-3.5">الفني المكلف</th>
                <th className="p-3.5 text-center">التوقف (د)</th>
                <th className="p-3.5">تاريخ البلاغ</th>
                <th className="p-3.5 text-center">الإجراءات</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#334155]">
              {filteredWorkOrders.map((wo) => (
                <tr 
                  key={wo.id}
                  onClick={() => setSelectedWOForDetail(wo)}
                  className={`hover:bg-[#334155]/20 transition-colors cursor-pointer ${
                    wo.priority === 'CRITICAL_STOPPAGE' ? 'bg-red-950/20' : ''
                  }`}
                >
                  <td className="p-3.5 font-mono font-bold text-blue-400 whitespace-nowrap">
                    {wo.id}
                  </td>
                  <td className="p-3.5 font-medium text-white max-w-xs">
                    <div className="truncate font-semibold">{wo.title}</div>
                  </td>
                  <td className="p-3.5 whitespace-nowrap">
                    <span className="font-mono font-bold text-blue-400">{wo.assetId}</span>
                    <div className="text-[11px] text-slate-400 truncate max-w-[140px]">{wo.assetName}</div>
                  </td>
                  <td className="p-3.5 whitespace-nowrap">
                    {getTypeLabel(wo.type)}
                  </td>
                  <td className="p-3.5 whitespace-nowrap">
                    {getPriorityBadge(wo.priority)}
                  </td>
                  <td className="p-3.5 whitespace-nowrap">
                    <span className={`px-2.5 py-1 rounded-full text-[11px] font-bold ${
                      wo.status === 'COMPLETED' || wo.status === 'CLOSED'
                        ? 'bg-green-500/15 text-green-400 border border-green-500/30'
                        : wo.status === 'IN_PROGRESS'
                        ? 'bg-yellow-500/15 text-yellow-400 border border-yellow-500/30'
                        : 'bg-[#334155] text-slate-300'
                    }`}>
                      {wo.status}
                    </span>
                  </td>
                  {isDeveloper && (
                    <td className="p-3.5 whitespace-nowrap bg-purple-950/20 border-x border-purple-500/20 text-purple-200">
                      <div className="flex items-center gap-1.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-purple-400 flex-shrink-0" />
                        <span className="font-semibold text-xs text-white">{wo.reportedBy || 'غير محدد'}</span>
                      </div>
                    </td>
                  )}
                  <td className="p-3.5 text-slate-300 whitespace-nowrap">
                    {wo.assignedTo}
                  </td>
                  <td className="p-3.5 text-center font-mono font-bold text-red-400 whitespace-nowrap">
                    {wo.downtimeMinutes}
                  </td>
                  <td className="p-3.5 text-slate-400 font-mono text-[11px] whitespace-nowrap">
                    {wo.reportedAt}
                  </td>
                  <td className="p-3.5 text-center whitespace-nowrap" onClick={(e) => e.stopPropagation()}>
                    <div className="flex items-center justify-center gap-1.5">
                      <button
                        type="button"
                        onClick={() => {
                          if (!checkPermission('canManageWorkOrders', 'تعديل وتحديث أمر العمل')) return;
                          setEditingWorkOrder(wo);
                        }}
                        className="p-1.5 rounded-lg bg-amber-500/10 hover:bg-amber-500/25 text-amber-400 border border-amber-500/30 transition-colors inline-flex items-center gap-1 font-bold text-xs"
                        title="تعديل وتصحيح بيانات أمر العمل"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                        <span>تعديل</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => {
                          if (!checkPermission('canManageWorkOrders', 'حذف أمر العمل')) return;
                          requestDeleteConfirmation({
                            title: 'حذف أمر العمل',
                            message: `هل أنت متأكد من رغبتك في حذف أمر العمل [${wo.id}] (${wo.title}) نهائياً من المنظومة؟`,
                            itemDetails: `${wo.id} - ${wo.assetName}`,
                            confirmLabel: 'حذف أمر العمل',
                            onConfirm: () => {
                              deleteWorkOrder(wo.id);
                            },
                          });
                        }}
                        className="p-1.5 rounded-lg bg-red-500/10 hover:bg-red-500/25 text-red-400 hover:text-red-300 border border-red-500/30 transition-colors"
                        title="حذف أمر العمل نهائياً"
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
