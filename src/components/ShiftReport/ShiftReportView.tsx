import React, { useState } from 'react';
import { 
  FileText, 
  Printer, 
  CheckCircle2, 
  AlertOctagon, 
  Clock, 
  UserCheck, 
  Calendar, 
  ShieldAlert, 
  Wrench, 
  Gauge, 
  Package,
  Layers,
  Plus,
  Edit3,
  CheckCircle,
  Clock3,
  Award,
  ChevronDown,
  ShieldCheck,
  AlertTriangle,
  Trash2,
  MapPin,
  CheckSquare,
  Thermometer,
  Wind,
  Droplets,
  Flame,
  Zap,
  Volume2,
  Lock,
  Unlock,
  KeyRound,
  Eye,
  Search,
  Filter,
  Users,
  Database,
  Download,
  RefreshCw,
  Link2,
  X
} from 'lucide-react';
import { useCMMS } from '../../context/CMMSContext';
import { CreateShiftLogModal } from './CreateShiftLogModal';
import { ChecklistModal, ChecklistItemData } from './ChecklistModal';
import { LinkMeterModal } from './LinkMeterModal';
import { CustomEnvParamModal } from './CustomEnvParamModal';
import { PatrolDetailModal } from './PatrolDetailModal';
import { ShiftLog, ShiftType, LinkedMeterReading, CustomEnvironmentalParam } from '../../types';

export const ShiftReportView: React.FC = () => {
  const { 
    shiftLogs, 
    activeShiftLog, 
    setActiveShiftLog, 
    setIsShiftModalOpen, 
    setEditingShiftLog, 
    deleteShiftLog,
    updateShiftLog,
    signShiftHandover, 
    requestDeleteConfirmation,
    currentUser,
    users,
    assets,
    workOrders,
    spareParts,
    kpis,
    meterDevices,
    checkPermission,
    addNotification
  } = useCMMS();

  // Active sub-tab inside Patrol Report view
  const [activeSubTab, setActiveSubTab] = useState<'document' | 'patrol-route' | 'environmental-specs' | 'breakdowns-parts' | 'archive'>('document');
  const [archiveSearch, setArchiveSearch] = useState('');

  // Developer quick engineer reassignment modal state
  const [isDevAssignModalOpen, setIsDevAssignModalOpen] = useState(false);
  const [devLeadEngineer, setDevLeadEngineer] = useState('');
  const [devHandoverEngineer, setDevHandoverEngineer] = useState('');
  const [devSafetyOfficer, setDevSafetyOfficer] = useState('');

  // Checklist dynamic modal
  const [isChecklistModalOpen, setIsChecklistModalOpen] = useState(false);
  const [editingChecklistItem, setEditingChecklistItem] = useState<ChecklistItemData | null>(null);

  // Meter linking & custom environmental parameter modals
  const [isLinkMeterModalOpen, setIsLinkMeterModalOpen] = useState(false);
  const [editingLinkedMeter, setEditingLinkedMeter] = useState<LinkedMeterReading | null>(null);
  const [isEnvParamModalOpen, setIsEnvParamModalOpen] = useState(false);
  const [editingEnvParam, setEditingEnvParam] = useState<CustomEnvironmentalParam | null>(null);

  // Deep Archive & Database Details Modal
  const [selectedArchiveLogForDetail, setSelectedArchiveLogForDetail] = useState<ShiftLog | null>(null);
  const [isArchiveDetailModalOpen, setIsArchiveDetailModalOpen] = useState(false);
  const [isDbSyncInfoModalOpen, setIsDbSyncInfoModalOpen] = useState(false);

  // Handlers for dynamic checklist
  const handleSaveChecklistItem = (item: ChecklistItemData) => {
    const currentChecklist = activeShiftLog.patrolChecklist || [];
    const exists = currentChecklist.some(c => c.id === item.id);
    let updatedList;
    if (exists) {
      updatedList = currentChecklist.map(c => c.id === item.id ? item : c);
    } else {
      updatedList = [...currentChecklist, item];
    }
    const updatedShift: ShiftLog = {
      ...activeShiftLog,
      patrolChecklist: updatedList
    };
    updateShiftLog(updatedShift);
    setActiveShiftLog(updatedShift);
    addNotification(`تم حفظ وتحديث بند الفحص [${item.id}] بنجاح`, 'success');
  };

  const handleDeleteChecklistItem = (itemId: string) => {
    const currentChecklist = activeShiftLog.patrolChecklist || [];
    const updatedList = currentChecklist.filter(c => c.id !== itemId);
    const updatedShift: ShiftLog = {
      ...activeShiftLog,
      patrolChecklist: updatedList
    };
    updateShiftLog(updatedShift);
    setActiveShiftLog(updatedShift);
    addNotification(`تم حذف بند الفحص [${itemId}] من الدورية`, 'info');
  };

  const handleToggleChecklistStatus = (itemId: string) => {
    const currentChecklist = activeShiftLog.patrolChecklist || [];
    const updatedList = currentChecklist.map(c => {
      if (c.id !== itemId) return c;
      const nextStatus: 'PASSED' | 'WARNING' | 'FAILED' = 
        c.status === 'PASSED' ? 'WARNING' : c.status === 'WARNING' ? 'FAILED' : 'PASSED';
      return { ...c, status: nextStatus };
    });
    const updatedShift: ShiftLog = {
      ...activeShiftLog,
      patrolChecklist: updatedList
    };
    updateShiftLog(updatedShift);
    setActiveShiftLog(updatedShift);
  };

  // Handlers for meter sync & linking
  const handleSyncAllMeterDevices = () => {
    if (!meterDevices || meterDevices.length === 0) return;
    
    const cmp1 = meterDevices.find(d => d.code === 'CMP-01' || d.category === 'AIR_COMPRESSOR');
    const chl1 = meterDevices.find(d => d.code === 'CHL-01' || d.category === 'CHILLER');
    const blr1 = meterDevices.find(d => d.code === 'BLR-01' || d.category === 'BOILER');
    const ups1 = meterDevices.find(d => d.code === 'UPS-01' || d.category === 'POWER_ENERGY');
    const ro1 = meterDevices.find(d => d.code === 'RO-01' || d.category === 'WATER_TREATMENT');

    const nowTime = new Date().toLocaleTimeString('ar-EG', { hour: '2-digit', minute: '2-digit' });

    const newReadings: LinkedMeterReading[] = [];

    if (cmp1 && cmp1.parameters[0]) {
      newReadings.push({
        deviceId: cmp1.id,
        deviceCode: cmp1.code,
        deviceName: cmp1.name,
        parameterId: cmp1.parameters[0].id,
        parameterName: cmp1.parameters[0].name,
        value: cmp1.parameters[0].defaultValue || 8.52,
        unit: cmp1.parameters[0].unit,
        status: 'NORMAL',
        recordedAt: nowTime,
        notes: 'ضغط مخرج مستقر لكافة شبكة المعمل'
      });
    }

    if (chl1 && chl1.parameters[0]) {
      newReadings.push({
        deviceId: chl1.id,
        deviceCode: chl1.code,
        deviceName: chl1.name,
        parameterId: chl1.parameters[0].id,
        parameterName: chl1.parameters[0].name,
        value: chl1.parameters[0].defaultValue || 8.2,
        unit: chl1.parameters[0].unit,
        status: 'NORMAL',
        recordedAt: nowTime,
        notes: 'مياه تبريد درافيل الطباعة الفليكسو والروتو'
      });
    }

    if (blr1 && blr1.parameters[0]) {
      newReadings.push({
        deviceId: blr1.id,
        deviceCode: blr1.code,
        deviceName: blr1.name,
        parameterId: blr1.parameters[0].id,
        parameterName: blr1.parameters[0].name,
        value: blr1.parameters[0].defaultValue || 248,
        unit: blr1.parameters[0].unit,
        status: 'NORMAL',
        recordedAt: nowTime,
        notes: 'حرارة الزيت الحراري لتجفيف الأحبار'
      });
    }

    if (ups1 && ups1.parameters[0]) {
      newReadings.push({
        deviceId: ups1.id,
        deviceCode: ups1.code,
        deviceName: ups1.name,
        parameterId: ups1.parameters[0].id,
        parameterName: ups1.parameters[0].name,
        value: ups1.parameters[0].defaultValue || 50.02,
        unit: ups1.parameters[0].unit,
        status: 'NORMAL',
        recordedAt: nowTime,
        notes: 'تردد شبكة الكهرباء المغذية لكونترولات شنايدر'
      });
    }

    if (ro1 && ro1.parameters[0]) {
      newReadings.push({
        deviceId: ro1.id,
        deviceCode: ro1.code,
        deviceName: ro1.name,
        parameterId: ro1.parameters[0].id,
        parameterName: ro1.parameters[0].name,
        value: ro1.parameters[0].defaultValue || 7.2,
        unit: ro1.parameters[0].unit,
        status: 'NORMAL',
        recordedAt: nowTime,
        notes: 'درجة حموضة ومعالجة مياه الغسيل والشيلرات'
      });
    }

    const updatedShift: ShiftLog = {
      ...activeShiftLog,
      linkedMeterReadings: newReadings,
      utilitiesSummary: {
        airPressureBar: cmp1?.parameters[0]?.defaultValue || 8.52,
        chillerTempC: chl1?.parameters[0]?.defaultValue || 8.2,
        boilerTempC: blr1?.parameters[0]?.defaultValue || 248,
        powerFrequencyHz: ups1?.parameters[0]?.defaultValue || 50.02
      }
    };

    updateShiftLog(updatedShift);
    setActiveShiftLog(updatedShift);
    addNotification('تمت مزامنة وجلب كافة القراءات الحية من أجهزة القياس والعدادات بنجاح إلى تقرير الدورية!', 'success');
  };

  const handleSaveLinkedMeter = (reading: LinkedMeterReading) => {
    const currentReadings = activeShiftLog.linkedMeterReadings || [];
    const existingIdx = currentReadings.findIndex(r => r.deviceId === reading.deviceId && r.parameterId === reading.parameterId);
    let updatedReadings;
    if (existingIdx >= 0) {
      updatedReadings = [...currentReadings];
      updatedReadings[existingIdx] = reading;
    } else {
      updatedReadings = [...currentReadings, reading];
    }

    const updatedShift: ShiftLog = {
      ...activeShiftLog,
      linkedMeterReadings: updatedReadings
    };
    updateShiftLog(updatedShift);
    setActiveShiftLog(updatedShift);
    addNotification(`تم ربط قراءة العداد [${reading.deviceCode}] بنجاح`, 'success');
  };

  const handleDeleteLinkedMeter = (index: number) => {
    const currentReadings = activeShiftLog.linkedMeterReadings || [];
    const updatedReadings = currentReadings.filter((_, idx) => idx !== index);
    const updatedShift: ShiftLog = {
      ...activeShiftLog,
      linkedMeterReadings: updatedReadings
    };
    updateShiftLog(updatedShift);
    setActiveShiftLog(updatedShift);
    addNotification('تم إلغاء ربط قراءة العداد من المحضر', 'info');
  };

  // Handlers for custom environmental parameters
  const handleSaveCustomEnvParam = (param: CustomEnvironmentalParam) => {
    const currentParams = activeShiftLog.customEnvironmentalParams || [];
    const exists = currentParams.some(p => p.id === param.id);
    let updatedParams;
    if (exists) {
      updatedParams = currentParams.map(p => p.id === param.id ? param : p);
    } else {
      updatedParams = [...currentParams, param];
    }
    const updatedShift: ShiftLog = {
      ...activeShiftLog,
      customEnvironmentalParams: updatedParams
    };
    updateShiftLog(updatedShift);
    setActiveShiftLog(updatedShift);
    addNotification(`تم حفظ المؤشر البيئي [${param.name}] بنجاح`, 'success');
  };

  const handleDeleteCustomEnvParam = (paramId: string) => {
    const currentParams = activeShiftLog.customEnvironmentalParams || [];
    const updatedParams = currentParams.filter(p => p.id !== paramId);
    const updatedShift: ShiftLog = {
      ...activeShiftLog,
      customEnvironmentalParams: updatedParams
    };
    updateShiftLog(updatedShift);
    setActiveShiftLog(updatedShift);
    addNotification('تم حذف المؤشر من المحضر', 'info');
  };

  // Database JSON export handler
  const handleExportDatabaseJSON = () => {
    const dbPayload = {
      databaseName: 'AL_MORJAN_PRINTING_CMMS_PATROLS_DB',
      exportedAt: new Date().toISOString(),
      format: 'JSON_RELATIONAL_SCHEMA_V2',
      schemaVersion: '2.4.0',
      totalRecords: shiftLogs.length,
      facility: 'معمل المرجان للمطبوعات',
      developerAuthorized: 'م. علي رضا',
      records: shiftLogs.map(log => ({
        ...log,
        databaseMetadata: {
          syncStatus: 'SERVER_READY',
          table: 'patrol_shift_logs',
          primaryKey: log.id,
          exportedTimestamp: Date.now()
        }
      }))
    };

    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(dbPayload, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `قاعدة_بيانات_الدوريات_معمل_المرجان_${new Date().toISOString().slice(0, 10)}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();

    addNotification('تم تصدير قاعدة بيانات سجلات الدوريات بصيغة JSON مهيأة للربط السحابي والسيرفر بنجاح!', 'success');
  };

  // Check developer privileges
  const isDeveloper = 
    currentUser?.role === 'DEVELOPER' || 
    currentUser?.isSuperDeveloper || 
    currentUser?.permissions?.canManageUsers ||
    currentUser?.permissions?.canViewDeveloperHub;

  const handlePrint = () => {
    window.print();
  };

  const handleCreateNewShift = () => {
    if (!checkPermission('canManageShifts', 'فتح تقرير دورية جديد')) return;
    setEditingShiftLog(null);
    setIsShiftModalOpen(true);
  };

  const handleEditShift = () => {
    if (!checkPermission('canManageShifts', 'تعديل بيانات تقرير الدورية')) return;
    setEditingShiftLog(activeShiftLog);
    setIsShiftModalOpen(true);
  };

  const handleDeleteShift = (log: ShiftLog) => {
    if (!checkPermission('canManageShifts', 'حذف تقرير الدورية')) return;
    requestDeleteConfirmation({
      title: 'حذف تقرير الدورية التفتيشية',
      message: `هل أنت متأكد من رغبتك في حذف محضر الدورية [${log.shiftName}] المؤرخ في [${log.date}] نهائياً من سجلات النظام؟`,
      itemDetails: `${log.id} • مهندس الدورية: ${log.responsibleEngineers?.leadEngineer || log.shiftEngineer || log.supervisorName}`,
      confirmLabel: 'حذف محضر الدورية',
      onConfirm: () => {
        deleteShiftLog(log.id);
      }
    });
  };

  // Open Developer Quick Reassignment modal
  const openDevAssignModal = () => {
    if (!isDeveloper) {
      addNotification('عذراً، تغيير أسماء المهندسين محصور بحساب مطور النظام ومدير الصيانة (م. علي رضا)', 'warning');
      return;
    }
    setDevLeadEngineer(activeShiftLog.responsibleEngineers?.leadEngineer || activeShiftLog.shiftEngineer || activeShiftLog.supervisorName || 'م. حسام التميمي');
    setDevHandoverEngineer(activeShiftLog.responsibleEngineers?.handoverEngineer || activeShiftLog.receivedBy?.name || 'م. كريم السعدي');
    setDevSafetyOfficer(activeShiftLog.responsibleEngineers?.safetyOfficer || 'م. رافد الشمري');
    setIsDevAssignModalOpen(true);
  };

  // Save Developer Reassignment
  const handleSaveDevAssign = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isDeveloper) return;

    const updated: ShiftLog = {
      ...activeShiftLog,
      shiftEngineer: devLeadEngineer,
      supervisorName: devLeadEngineer,
      responsibleEngineers: {
        leadEngineer: devLeadEngineer,
        handoverEngineer: devHandoverEngineer,
        safetyOfficer: devSafetyOfficer,
        assignedByDeveloper: true,
        lastModifiedBy: currentUser?.fullName || 'م. علي رضا',
        lastModifiedAt: new Date().toISOString().slice(0, 16).replace('T', ' ')
      },
      handedOverBy: {
        ...activeShiftLog.handedOverBy,
        name: devLeadEngineer
      },
      receivedBy: activeShiftLog.receivedBy ? {
        ...activeShiftLog.receivedBy,
        name: devHandoverEngineer
      } : {
        name: devHandoverEngineer,
        role: 'مهندس الاستلام المناوب القادم',
        timestamp: '',
        signed: false
      }
    };

    updateShiftLog(updated);
    setIsDevAssignModalOpen(false);
    addNotification(`تم تحديث طاقم المهندسين المسؤولين عن دورية [${activeShiftLog.shiftName}] بنجاح بصلاحية المطور ✓`, 'success');
  };

  // Filtered archive logs
  const filteredArchive = shiftLogs.filter(log => {
    const q = archiveSearch.toLowerCase();
    return (
      log.shiftName.toLowerCase().includes(q) ||
      log.date.includes(q) ||
      (log.responsibleEngineers?.leadEngineer && log.responsibleEngineers.leadEngineer.toLowerCase().includes(q)) ||
      (log.shiftEngineer && log.shiftEngineer.toLowerCase().includes(q)) ||
      (log.supervisorName && log.supervisorName.toLowerCase().includes(q))
    );
  });

  // Stoppages & Critical WOs for this shift
  const criticalWOs = workOrders.filter((wo) => wo.priority === 'CRITICAL_STOPPAGE');
  const completedWOs = workOrders.filter((wo) => wo.status === 'COMPLETED' || wo.status === 'CLOSED');
  const activeWOs = workOrders.filter((wo) => !['COMPLETED', 'CLOSED'].includes(wo.status));

  // Consumed parts
  const consumedPartsSummary = workOrders
    .flatMap((wo) => wo.consumedParts || [])
    .slice(0, 6);

  const getStatusBadge = (status: ShiftLog['status']) => {
    switch (status) {
      case 'APPROVED':
        return (
          <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 flex items-center gap-1.5">
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>معتمد ومصادق رسمياً</span>
          </span>
        );
      case 'HANDED_OVER':
        return (
          <span className="px-3 py-1 rounded-full text-xs font-bold bg-blue-500/20 text-blue-400 border border-blue-500/40 flex items-center gap-1.5">
            <Clock3 className="w-3.5 h-3.5" />
            <span>تم التسليم (بانتظار مصادقة المدير)</span>
          </span>
        );
      case 'IN_PROGRESS':
      default:
        return (
          <span className="px-3 py-1 rounded-full text-xs font-bold bg-amber-500/20 text-amber-400 border border-amber-500/40 flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5" />
            <span>الدورية قيد العمل والتفتيش الميداني</span>
          </span>
        );
    }
  };

  if (!activeShiftLog) {
    return (
      <div className="p-8 rounded-2xl bg-[#1e293b] border border-[#334155] text-center space-y-4 font-sans text-slate-200">
        <FileText className="w-12 h-12 text-blue-400 mx-auto" />
        <h3 className="text-base font-bold text-white">لا توجد دورية محددة حالياً</h3>
        <p className="text-xs text-slate-400 max-w-md mx-auto">
          يرجى فتح دورية تفتيشية جديدة أو اختيار دورية من الأرشيف لعرض التقرير واعتماده.
        </p>
        <button
          onClick={handleCreateNewShift}
          className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-bold transition-all shadow-md shadow-blue-600/20"
        >
          + فتح دورية جديدة
        </button>
        <CreateShiftLogModal />
      </div>
    );
  }

  const leadEng = activeShiftLog.responsibleEngineers?.leadEngineer || activeShiftLog.shiftEngineer || activeShiftLog.supervisorName || 'م. حسام التميمي';
  const nextEng = activeShiftLog.responsibleEngineers?.handoverEngineer || activeShiftLog.receivedBy?.name || 'م. كريم السعدي';
  const safetyOff = activeShiftLog.responsibleEngineers?.safetyOfficer || 'م. رافد الشمري';

  return (
    <div className="space-y-6 font-sans text-slate-100">
      {/* Top Action Control Bar */}
      <div className="p-4 sm:p-5 rounded-2xl bg-[#1e293b] border border-[#334155] shadow-lg flex flex-wrap items-center justify-between gap-4 no-print">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-xl bg-blue-600/20 border border-blue-500/40 flex items-center justify-center text-blue-400 shadow-inner">
            <FileText className="w-6 h-6" />
          </div>
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <h2 className="text-base sm:text-lg font-bold text-white">
                تقرير الدوريات الهندسية والتفتيشية
              </h2>
              {getStatusBadge(activeShiftLog.status)}
              {isDeveloper && (
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-500/15 text-amber-300 border border-amber-500/30 flex items-center gap-1">
                  <KeyRound className="w-3 h-3 text-amber-400" />
                  <span>صلاحية المطور لتعديل المهندسين متاحة</span>
                </span>
              )}
            </div>
            <p className="text-xs text-slate-400">
              محضر التفتيش الميداني، مؤشرات التشغيل ومحطات الطاقة، واستلام وتسليم الدوريات • مدير الصيانة: <strong className="text-slate-200">م. علي رضا</strong>
            </p>
          </div>
        </div>

        {/* Action Buttons & Shift Picker */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Shift Picker Dropdown */}
          <div className="relative">
            <select
              value={activeShiftLog.id}
              onChange={(e) => {
                const found = shiftLogs.find(s => s.id === e.target.value);
                if (found) setActiveShiftLog(found);
              }}
              className="bg-[#0f172a] border border-[#334155] rounded-xl px-3 py-2 text-xs text-white font-medium focus:outline-none focus:border-blue-500"
            >
              {shiftLogs.map((log) => (
                <option key={log.id} value={log.id}>
                  {log.date} — {log.shiftName} ({log.status === 'APPROVED' ? 'معتمد' : 'جاري'})
                </option>
              ))}
            </select>
          </div>

          <button
            id="btn-create-shift"
            onClick={handleCreateNewShift}
            className="flex items-center gap-1.5 bg-blue-600 hover:bg-blue-500 text-white px-3.5 py-2 rounded-xl text-xs font-bold shadow-md shadow-blue-600/20 transition-all active:scale-95"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>+ فتح دورية جديدة</span>
          </button>

          <button
            id="btn-edit-shift"
            onClick={handleEditShift}
            className="flex items-center gap-1.5 bg-[#334155] hover:bg-slate-600 text-slate-200 px-3 py-2 rounded-xl text-xs font-bold transition-colors"
          >
            <Edit3 className="w-3.5 h-3.5" />
            <span>تعديل التقرير</span>
          </button>

          {isDeveloper && (
            <button
              id="btn-dev-reassign-engineers"
              onClick={openDevAssignModal}
              className="flex items-center gap-1.5 bg-amber-500/15 hover:bg-amber-500/25 text-amber-300 border border-amber-500/40 px-3 py-2 rounded-xl text-xs font-bold transition-all shadow-sm"
              title="تعديل وتعيين أسماء المهندسين المسؤولين عن هذه الدورية بصلاحية المطور"
            >
              <KeyRound className="w-3.5 h-3.5 text-amber-400" />
              <span>تغيير المهندسين (المطور)</span>
            </button>
          )}

          <button
            id="btn-delete-active-shift"
            onClick={() => handleDeleteShift(activeShiftLog)}
            className="flex items-center gap-1.5 bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/30 px-3 py-2 rounded-xl text-xs font-bold transition-all active:scale-95"
            title="حذف محضر هذه الدورية نهائياً"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>حذف الدورية</span>
          </button>

          <button
            onClick={handlePrint}
            className="flex items-center gap-1.5 bg-slate-700 hover:bg-slate-600 text-white px-3.5 py-2 rounded-xl text-xs font-bold shadow-sm transition-all"
          >
            <Printer className="w-3.5 h-3.5 text-cyan-400" />
            <span>طباعة المحضر</span>
          </button>
        </div>
      </div>

      {/* Sub-Tabs Switcher */}
      <div className="flex items-center gap-2 border-b border-[#334155] pb-2 overflow-x-auto no-print">
        <button
          onClick={() => setActiveSubTab('document')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
            activeSubTab === 'document'
              ? 'bg-blue-600 text-white shadow-md shadow-blue-600/20'
              : 'bg-[#1e293b] text-slate-300 hover:bg-slate-700'
          }`}
        >
          <FileText className="w-4 h-4" />
          <span>المحضر الرسمي المعتمد ومحضر التسليم</span>
        </button>

        <button
          onClick={() => setActiveSubTab('patrol-route')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
            activeSubTab === 'patrol-route'
              ? 'bg-blue-600 text-white shadow-md shadow-blue-600/20'
              : 'bg-[#1e293b] text-slate-300 hover:bg-slate-700'
          }`}
        >
          <MapPin className="w-4 h-4 text-cyan-400" />
          <span>المسار التفقدي وقائمة الفحص الميداني</span>
        </button>

        <button
          onClick={() => setActiveSubTab('environmental-specs')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
            activeSubTab === 'environmental-specs'
              ? 'bg-blue-600 text-white shadow-md shadow-blue-600/20'
              : 'bg-[#1e293b] text-slate-300 hover:bg-slate-700'
          }`}
        >
          <Thermometer className="w-4 h-4 text-emerald-400" />
          <span>الظروف البيئية ومحطات الطاقة المركزية</span>
        </button>

        <button
          onClick={() => setActiveSubTab('breakdowns-parts')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
            activeSubTab === 'breakdowns-parts'
              ? 'bg-blue-600 text-white shadow-md shadow-blue-600/20'
              : 'bg-[#1e293b] text-slate-300 hover:bg-slate-700'
          }`}
        >
          <Wrench className="w-4 h-4 text-amber-400" />
          <span>الأعطال المنفذة وقطع الغيار المنصرفة</span>
        </button>

        <button
          onClick={() => setActiveSubTab('archive')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
            activeSubTab === 'archive'
              ? 'bg-blue-600 text-white shadow-md shadow-blue-600/20'
              : 'bg-[#1e293b] text-slate-300 hover:bg-slate-700'
          }`}
        >
          <Layers className="w-4 h-4 text-purple-400" />
          <span>سجل وأرشيف كافة الدوريات ({shiftLogs.length})</span>
        </button>
      </div>

      {/* SUB-VIEW 1: Formal Document View */}
      {activeSubTab === 'document' && (
        <div className="bg-[#1e293b] border border-[#334155] rounded-2xl shadow-2xl p-6 sm:p-9 space-y-7 print-area font-sans text-slate-100">
          {/* Document Formal Header */}
          <div className="border-b-2 border-[#334155] pb-6 flex flex-wrap items-start justify-between gap-4">
            <div className="space-y-1.5">
              <div className="flex items-center gap-2">
                <span className="text-[11px] font-mono font-bold text-blue-400 tracking-wider uppercase block">
                  AL-MURJAN PRINTING PLANT — CMMS SYSTEM
                </span>
                <span className="text-[10px] px-2 py-0.5 rounded bg-blue-500/10 text-blue-300 font-mono">
                  REF: {activeShiftLog.id}
                </span>
              </div>
              <h1 className="text-xl sm:text-2xl font-black text-white">
                معمل المرجان للمطبوعات — تقرير الدوريات الفنية اليومي ومحضر التسليم
              </h1>
              <p className="text-xs text-slate-400">
                إدارة الشؤون الهندسية والصيانة العامة • مدير الصيانة ومطور النظام: <strong className="text-white">م. علي رضا</strong>
              </p>
            </div>

            <div className="p-3.5 rounded-xl bg-[#0f172a] border border-[#334155] text-xs space-y-1 font-mono text-left min-w-[240px]">
              <div className="flex justify-between gap-4">
                <span className="text-slate-400">تاريخ الدورية:</span>
                <span className="text-white font-bold">{activeShiftLog.date || '2026-09-08'}</span>
              </div>
              <div className="flex justify-between gap-4">
                <span className="text-slate-400">الدورية:</span>
                <span className="text-blue-400 font-bold">{(activeShiftLog.shiftName || 'الوردية الأولى (الصباحية)').split('(')[0]}</span>
              </div>
              <div className="flex justify-between gap-4">
                <span className="text-slate-400">مهندس الدورية المسؤول:</span>
                <span className="text-slate-200 font-sans font-bold">
                  {leadEng}
                </span>
              </div>
              <div className="flex justify-between gap-4">
                <span className="text-slate-400">مهندس الاستلام القادم:</span>
                <span className="text-slate-300 font-sans font-medium">
                  {nextEng}
                </span>
              </div>
              <div className="flex justify-between gap-4 pt-1 border-t border-[#334155]">
                <span className="text-slate-400">مسؤول السلامة:</span>
                <span className="text-[11px] text-slate-300 font-sans">
                  {safetyOff}
                </span>
              </div>
            </div>
          </div>

          {/* Responsible Engineers Status Ribbon */}
          <div className="p-3.5 rounded-xl bg-gradient-to-r from-blue-950/40 via-[#0f172a] to-[#0f172a] border border-blue-500/30 flex flex-wrap items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-blue-500/20 text-blue-400 flex items-center justify-center">
                <Users className="w-4 h-4" />
              </div>
              <div>
                <span className="font-bold text-white block">
                  طاقم الإشراف الهندسي المعتمد للدورية:
                </span>
                <span className="text-slate-300 text-[11px]">
                  قائد الدورية: <strong className="text-white font-semibold">{leadEng}</strong> • مهندس الاستلام: <strong className="text-white font-semibold">{nextEng}</strong> • مسؤول السلامة: <strong className="text-white font-semibold">{safetyOff}</strong>
                </span>
              </div>
            </div>

            {isDeveloper ? (
              <button
                onClick={openDevAssignModal}
                className="px-3 py-1.5 rounded-lg bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/40 text-[11px] font-bold flex items-center gap-1.5 no-print"
              >
                <KeyRound className="w-3.5 h-3.5 text-amber-400" />
                <span>تغيير طاقم المهندسين (صلاحية المطور)</span>
              </button>
            ) : (
              <div className="flex items-center gap-1.5 text-slate-400 text-[11px]">
                <Lock className="w-3 h-3 text-slate-500" />
                <span>أسماء المهندسين معتمدة ومقفولة</span>
              </div>
            )}
          </div>

          {/* Operational Performance Summary KPI Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="p-4 rounded-xl bg-[#0f172a] border border-[#334155] text-center">
              <div className="text-[11px] text-slate-400 font-bold">نسبة الجاهزية التشغيلية</div>
              <div className="text-2xl sm:text-3xl font-black font-mono text-cyan-400 mt-1">
                {kpis.availabilityRate}%
              </div>
              <div className="text-[10px] text-slate-500 mt-0.5">جاهزية مستهدفة: ≥ 98.5%</div>
            </div>

            <div className="p-4 rounded-xl bg-[#0f172a] border border-[#334155] text-center">
              <div className="text-[11px] text-slate-400 font-bold">الماكينات العاملة بالمعمل</div>
              <div className="text-2xl sm:text-3xl font-black font-mono text-green-400 mt-1">
                {kpis.operationalAssets} / {kpis.totalAssets}
              </div>
              <div className="text-[10px] text-slate-500 mt-0.5">عبر 9 قاعات صناعية</div>
            </div>

            <div className="p-4 rounded-xl bg-[#0f172a] border border-[#334155] text-center">
              <div className="text-[11px] text-slate-400 font-bold">إجمالي دقائق التوقف بالدورية</div>
              <div className={`text-2xl sm:text-3xl font-black font-mono mt-1 ${
                (activeShiftLog.totalStoppageMinutes ?? 0) > 0 ? 'text-amber-400' : 'text-slate-300'
              }`}>
                {activeShiftLog.totalStoppageMinutes ?? 0} دقيقة
              </div>
              <div className="text-[10px] text-slate-500 mt-0.5">توقفات اضطرارية مسجلة</div>
            </div>

            <div className="p-4 rounded-xl bg-[#0f172a] border border-[#334155] text-center">
              <div className="text-[11px] text-slate-400 font-bold">أوامر الصيانة المنفذة</div>
              <div className="text-2xl sm:text-3xl font-black font-mono text-blue-400 mt-1">
                {completedWOs.length}
              </div>
              <div className="text-[10px] text-slate-500 mt-0.5">أوامر طارئة ووقائية</div>
            </div>
          </div>

          {/* Quick Patrol Route & Coverage Overview */}
          <div className="p-4 rounded-xl bg-[#0f172a] border border-[#334155] space-y-2.5">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold text-white flex items-center gap-1.5">
                <MapPin className="w-4 h-4 text-cyan-400" />
                <span>المسار التفقدي الميداني للدورية:</span>
              </h3>
              <span className="text-[11px] text-cyan-400 font-bold font-mono">
                تغطية التفتيش: {activeShiftLog.patrolCoveragePercent ?? 100}% ✓
              </span>
            </div>

            <div className="flex flex-wrap gap-2">
              {(activeShiftLog.patrolRoute && activeShiftLog.patrolRoute.length > 0
                ? activeShiftLog.patrolRoute
                : ['قاعة الروتو (ROTO)', 'قاعة الفليكسو (FLEXO)', 'قاعة البولي إيثيلين (PE)', 'قاعة صناعة الأكياس (BAG)', 'محطة الطاقة والمرافق (POWER)']
              ).map((hall, idx) => (
                <span
                  key={idx}
                  className="px-2.5 py-1 rounded-lg text-[11px] font-medium bg-blue-600/15 text-blue-300 border border-blue-500/30"
                >
                  ✓ {hall}
                </span>
              ))}
            </div>

            {activeShiftLog.productionLinesInspected && activeShiftLog.productionLinesInspected.length > 0 && (
              <div className="pt-2 border-t border-[#334155] text-xs text-slate-300">
                <strong className="text-slate-200">الخطوط الرئيسية المفحوصة:</strong>{' '}
                {activeShiftLog.productionLinesInspected.join(' • ')}
              </div>
            )}
          </div>

          {/* Central Utilities Meter Readings Section */}
          {activeShiftLog.utilitiesSummary && (
            <div className="space-y-3">
              <h3 className="text-sm font-bold text-white flex items-center gap-2 border-b border-[#334155] pb-2">
                <Gauge className="w-4 h-4 text-cyan-400" />
                <span>مؤشرات المحطات المركزية خلال الدورية (هواء مضغوط • تشيلر • غلايات حرارية)</span>
              </h3>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs font-mono">
                <div className="p-3.5 rounded-xl bg-[#0f172a] border border-[#334155]">
                  <span className="text-slate-400 block text-[11px] font-sans">ضغط الهواء المضغوط:</span>
                  <span className="text-cyan-400 font-bold text-lg">
                    {activeShiftLog.utilitiesSummary.airPressureBar} Bar
                  </span>
                  <span className="text-slate-500 block text-[10px]">الحد المقبول: 7.8 - 8.6 Bar</span>
                </div>

                <div className="p-3.5 rounded-xl bg-[#0f172a] border border-[#334155]">
                  <span className="text-slate-400 block text-[11px] font-sans">حرارة ماء التشيلر:</span>
                  <span className="text-blue-400 font-bold text-lg">
                    {activeShiftLog.utilitiesSummary.chillerTempC}°C
                  </span>
                  <span className="text-slate-500 block text-[10px]">نطاق التبريد: 6 - 11°C</span>
                </div>

                <div className="p-3.5 rounded-xl bg-[#0f172a] border border-[#334155]">
                  <span className="text-slate-400 block text-[11px] font-sans">حرارة الزيت الحراري:</span>
                  <span className="text-yellow-400 font-bold text-lg">
                    {activeShiftLog.utilitiesSummary.boilerTempC}°C
                  </span>
                  <span className="text-slate-500 block text-[10px]">غلايات تجفيف أحبار الطباعة</span>
                </div>

                <div className="p-3.5 rounded-xl bg-[#0f172a] border border-[#334155]">
                  <span className="text-slate-400 block text-[11px] font-sans">تردد الشبكة الكهربائية:</span>
                  <span className="text-green-400 font-bold text-lg">
                    {activeShiftLog.utilitiesSummary.powerFrequencyHz} Hz
                  </span>
                  <span className="text-slate-500 block text-[10px]">معامل القدرة: 0.94 PF</span>
                </div>
              </div>
            </div>
          )}

          {/* Handover Directives & Operational Notes */}
          <div className="space-y-3">
            <h3 className="text-sm font-bold text-white flex items-center gap-2 border-b border-[#334155] pb-2">
              <Clock className="w-4 h-4 text-blue-400" />
              <span>توجيهات وملاحظات تسليم الدورية للنوبة القادمة (Handover Directives)</span>
            </h3>

            <div className="p-4 rounded-xl bg-[#0f172a] border border-[#334155] text-xs leading-relaxed space-y-2">
              <p className="text-slate-200">
                {activeShiftLog.handoverNotes || 'لا توجد ملاحظات استثنائية. الخطوط بحالة تشغيلية منتظمة.'}
              </p>
              {activeShiftLog.pendingForNextShift && (
                <div className="p-2.5 rounded-lg bg-blue-950/30 border border-blue-500/20 text-blue-200">
                  <strong className="text-blue-400">المهام المفتوحة الموجهة للدورية القادمة:</strong>{' '}
                  {activeShiftLog.pendingForNextShift}
                </div>
              )}
              <div className="pt-2 border-t border-[#334155] flex flex-wrap items-center justify-between text-[11px] text-slate-400">
                <span>الأعمال المفتوحة والمتابعة: {activeWOs.length} أمر عمل قيد الاستكمال</span>
                <span>حوادث السلامة والأمان: {activeShiftLog.safetyIncidents ?? 0} حوادث (صفر حوادث ✓)</span>
              </div>
            </div>
          </div>

          {/* Signatures & Formal Digital Approvals Block */}
          <div className="border-t-2 border-[#334155] pt-6 grid grid-cols-1 sm:grid-cols-3 gap-6 text-xs text-center">
            {/* Handed Over By */}
            <div className="p-4 rounded-xl bg-[#0f172a] border border-[#334155] space-y-2 flex flex-col justify-between">
              <div>
                <div className="text-slate-400 font-bold">مهندس الدورية المسلِّم</div>
                <div className="text-white font-bold text-sm pt-2 font-sans">
                  {leadEng}
                </div>
                <div className="text-[10px] text-slate-400 font-mono mt-0.5">
                  {activeShiftLog.handedOverBy?.timestamp || 'بانتظار التوقيع'}
                </div>
              </div>

              <div className="pt-3 border-t border-dashed border-[#334155]">
                {activeShiftLog.handedOverBy?.signed ? (
                  <div className="flex items-center justify-center gap-1.5 text-emerald-400 font-bold text-xs py-1">
                    <CheckCircle2 className="w-4 h-4" />
                    <span>تم توقيع التسليم إلكترونياً</span>
                  </div>
                ) : (
                  <button
                    onClick={() => signShiftHandover(activeShiftLog.id, 'handedOver', leadEng)}
                    className="w-full py-1.5 rounded-lg bg-blue-600/20 hover:bg-blue-600 text-blue-300 hover:text-white border border-blue-500/30 text-xs font-bold transition-all no-print"
                  >
                    توقيع تسليم الدورية (Sign)
                  </button>
                )}
              </div>
            </div>

            {/* Received By */}
            <div className="p-4 rounded-xl bg-[#0f172a] border border-[#334155] space-y-2 flex flex-col justify-between">
              <div>
                <div className="text-slate-400 font-bold">مهندس الدورية المستلِم</div>
                <div className="text-white font-bold text-sm pt-2 font-sans">
                  {nextEng}
                </div>
                <div className="text-[10px] text-slate-400 font-mono mt-0.5">
                  {activeShiftLog.receivedBy?.timestamp || 'بانتظار الاستلام'}
                </div>
              </div>

              <div className="pt-3 border-t border-dashed border-[#334155]">
                {activeShiftLog.receivedBy?.signed ? (
                  <div className="flex items-center justify-center gap-1.5 text-emerald-400 font-bold text-xs py-1">
                    <CheckCircle2 className="w-4 h-4" />
                    <span>تم توقيع الاستلام إلكترونياً</span>
                  </div>
                ) : (
                  <button
                    onClick={() => signShiftHandover(activeShiftLog.id, 'received', nextEng)}
                    className="w-full py-1.5 rounded-lg bg-blue-600/20 hover:bg-blue-600 text-blue-300 hover:text-white border border-blue-500/30 text-xs font-bold transition-all no-print"
                  >
                    توقيع استلام الدورية (Sign)
                  </button>
                )}
              </div>
            </div>

            {/* Approved By Maintenance Manager (Eng. Ali Reda) */}
            <div className="p-4 rounded-xl bg-gradient-to-b from-blue-950/30 to-[#0f172a] border border-blue-500/40 space-y-2 flex flex-col justify-between relative overflow-hidden">
              <div>
                <div className="text-blue-400 font-bold flex items-center justify-center gap-1.5">
                  <Award className="w-4 h-4 text-amber-400" />
                  <span>مصادقة مدير إدارة الصيانة العامة</span>
                </div>
                <div className="text-white font-black text-base pt-1 font-sans">
                  م. علي رضا
                </div>
                <div className="text-[10px] text-blue-300 font-mono mt-0.5">
                  {activeShiftLog.approvedByManager?.timestamp || 'مطور النظام ومدير الصيانة'}
                </div>
              </div>

              <div className="pt-3 border-t border-dashed border-blue-500/40">
                {activeShiftLog.approvedByManager?.signed ? (
                  <div className="space-y-1">
                    <div className="flex items-center justify-center gap-1.5 text-emerald-400 font-black text-xs">
                      <ShieldCheck className="w-4 h-4" />
                      <span>معتمد ومصدق رسمياً بالختم</span>
                    </div>
                    <div className="inline-block px-3 py-0.5 rounded-full border border-emerald-500/40 text-[10px] font-mono text-emerald-300 bg-emerald-500/10">
                      SEAL CERTIFIED • ENG. ALI REDA
                    </div>
                  </div>
                ) : (
                  <button
                    onClick={() => signShiftHandover(activeShiftLog.id, 'approved', 'م. علي رضا')}
                    className="w-full py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-md shadow-emerald-600/20 transition-all no-print"
                  >
                    مصادقة واعتماد المدير (Approve)
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* SUB-VIEW 2: Patrol Route & Inspection Checklist */}
      {activeSubTab === 'patrol-route' && (
        <div className="space-y-6">
          <div className="p-5 rounded-2xl bg-[#1e293b] border border-[#334155] space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#334155] pb-3">
              <div>
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <MapPin className="w-5 h-5 text-cyan-400" />
                  <span>المسار التفقدي الميداني المعتمد للدورية</span>
                </h3>
                <p className="text-xs text-slate-400">
                  المحطات والقاعات الصناعية التي تم تفقدها ميدانياً والتأكد من سلامتها التشغيلية
                </p>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-xs text-slate-300 font-bold">نسبة تغطية المسار:</span>
                <span className="px-3 py-1 rounded-full bg-cyan-500/20 border border-cyan-500/40 text-cyan-300 font-mono font-bold text-xs">
                  {activeShiftLog.patrolCoveragePercent ?? 100}% مكتملة
                </span>
              </div>
            </div>

            {/* Progress bar */}
            <div className="w-full bg-[#0f172a] rounded-full h-2.5 overflow-hidden border border-[#334155]">
              <div 
                className="bg-gradient-to-r from-cyan-500 to-blue-500 h-full rounded-full transition-all duration-500"
                style={{ width: `${activeShiftLog.patrolCoveragePercent ?? 100}%` }}
              />
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 pt-2">
              {(activeShiftLog.patrolRoute && activeShiftLog.patrolRoute.length > 0
                ? activeShiftLog.patrolRoute
                : ['قاعة الروتو (ROTO)', 'قاعة الفليكسو (FLEXO)', 'قاعة البولي إيثيلين (PE)', 'قاعة صناعة الأكياس (BAG)', 'محطة الطاقة والمرافق (POWER)']
              ).map((hall, idx) => (
                <div
                  key={idx}
                  className="p-3 rounded-xl bg-[#0f172a] border border-blue-500/30 flex items-center gap-2.5"
                >
                  <div className="w-7 h-7 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center text-xs font-bold">
                    ✓
                  </div>
                  <div>
                    <span className="text-xs font-bold text-white block">{hall}</span>
                    <span className="text-[10px] text-emerald-400">تم التفتيش الميداني</span>
                  </div>
                </div>
              ))}
            </div>

            {activeShiftLog.productionLinesInspected && activeShiftLog.productionLinesInspected.length > 0 && (
              <div className="p-3.5 rounded-xl bg-[#0f172a] border border-[#334155] space-y-1.5">
                <span className="text-xs font-bold text-slate-300 block">
                  خطوط الإنتاج والطباعة المفحوصة خلال هذه الدورية:
                </span>
                <div className="flex flex-wrap gap-2">
                  {(activeShiftLog.productionLinesInspected || []).map((line, idx) => (
                    <span
                      key={idx}
                      className="px-2.5 py-1 rounded bg-[#1e293b] border border-[#334155] text-xs font-mono text-slate-200"
                    >
                      ⚙️ {line}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Inspection Checklist Table */}
          <div className="p-5 rounded-2xl bg-[#1e293b] border border-[#334155] space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#334155] pb-3">
              <div>
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <CheckSquare className="w-5 h-5 text-blue-400" />
                  <span>قائمة بنود الفحص الميداني المعتمدة للدورية ({activeShiftLog.patrolChecklist?.length || 5} بنود)</span>
                </h3>
                <p className="text-xs text-slate-400">
                  إمكانية إضافة بنود تفتيش جديدة، حذفها، تعديل تفاصيلها، والنقر لتبديل الحالة فورياً
                </p>
              </div>

              <button
                type="button"
                onClick={() => {
                  setEditingChecklistItem(null);
                  setIsChecklistModalOpen(true);
                }}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold shadow-md shadow-blue-600/20 transition-all active:scale-95"
              >
                <Plus className="w-4 h-4" />
                <span>+ إضافة بند فحص ميداني جديد</span>
              </button>
            </div>

            <div className="space-y-2.5">
              {(activeShiftLog.patrolChecklist && activeShiftLog.patrolChecklist.length > 0
                ? activeShiftLog.patrolChecklist
                : [
                    { id: 'CHK-01', title: 'فحص استقرار ضغط خط الهواء الرئيسي وخلوه من الرطوبة', area: 'محطة الطاقة والضواغط', status: 'PASSED' as const, notes: 'الضغط 8.5 بار مع كفاءة تامة لمجفف الفريون' },
                    { id: 'CHK-02', title: 'مراقبة سحب أبخرة المذيبات والتهوية بقاعة الروتو', area: 'قاعة الروتو', status: 'PASSED' as const, notes: 'مراوح السحب المركزية تعمل بكفاءة 100%' },
                    { id: 'CHK-03', title: 'فحص درجات حرارة محامل ودرافيل ماكينات الطباعة الفليكسو', area: 'قاعة الفليكسو', status: 'PASSED' as const, notes: 'الحرارة ضمن النطاق الآمن 42 مئوية' },
                    { id: 'CHK-04', title: 'معاينة جاهزية أزرار الإيقاف الطارئ LOTO & E-Stops', area: 'كافة الخطوط', status: 'PASSED' as const, notes: 'تم التأكد من السلامة وممرات الطوارئ سالكة' },
                    { id: 'CHK-05', title: 'معايرة لزوجة الأحبار وضغط كشط سكين الدكتور بليد', area: 'الروتو والفليكسو', status: 'PASSED' as const, notes: 'تم استبدال شفرة ماكينة F&K بنجاح' }
                  ]
              ).map((item) => (
                <div
                  key={item.id}
                  className="p-3.5 rounded-xl bg-[#0f172a] border border-[#334155] flex flex-wrap items-center justify-between gap-3 text-xs hover:border-slate-500 transition-colors"
                >
                  <div className="flex items-center gap-3 min-w-0 flex-1">
                    <span className="font-mono text-blue-400 font-bold text-xs bg-blue-900/30 px-2 py-0.5 rounded border border-blue-700/30 shrink-0">
                      {item.id}
                    </span>
                    <div className="min-w-0">
                      <span className="font-bold text-white block truncate">{item.title}</span>
                      <span className="text-[11px] text-slate-400 block truncate">
                        {item.area} {item.method ? `• طريقة الفحص: ${item.method}` : ''} — {item.notes}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      type="button"
                      onClick={() => handleToggleChecklistStatus(item.id)}
                      title="انقر لتبديل الحالة فورياً (مطابق / تنبيه / عطل)"
                      className="cursor-pointer transition-transform active:scale-95"
                    >
                      {item.status === 'PASSED' && (
                        <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 flex items-center gap-1.5 hover:bg-emerald-500/30">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span>مطابق وسليم</span>
                        </span>
                      )}
                      {item.status === 'WARNING' && (
                        <span className="px-3 py-1 rounded-full text-xs font-bold bg-amber-500/20 text-amber-300 border border-amber-500/40 flex items-center gap-1.5 hover:bg-amber-500/30">
                          <AlertTriangle className="w-3.5 h-3.5" />
                          <span>تنبيه / متابعة</span>
                        </span>
                      )}
                      {item.status === 'FAILED' && (
                        <span className="px-3 py-1 rounded-full text-xs font-bold bg-red-500/20 text-red-300 border border-red-500/40 flex items-center gap-1.5 hover:bg-red-500/30">
                          <AlertOctagon className="w-3.5 h-3.5" />
                          <span>عطل مستوجب تدخل</span>
                        </span>
                      )}
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        setEditingChecklistItem(item);
                        setIsChecklistModalOpen(true);
                      }}
                      className="p-1.5 rounded-lg bg-[#1e293b] hover:bg-blue-600/20 text-slate-300 hover:text-blue-400 border border-[#334155] transition-colors"
                      title="تعديل تفاصيل هذا البند"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                    </button>

                    <button
                      type="button"
                      onClick={() => handleDeleteChecklistItem(item.id)}
                      className="p-1.5 rounded-lg bg-[#1e293b] hover:bg-red-500/20 text-slate-400 hover:text-red-400 border border-[#334155] transition-colors"
                      title="حذف هذا البند نهائياً من الدورية"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* SUB-VIEW 3: Environmental Specs & Utilities */}
      {activeSubTab === 'environmental-specs' && (
        <div className="space-y-6">
          {/* Action Toolbar for Meters & Environmental Data */}
          <div className="p-4 rounded-2xl bg-[#1e293b] border border-blue-500/30 flex flex-wrap items-center justify-between gap-3 shadow-lg">
            <div className="space-y-0.5">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Gauge className="w-5 h-5 text-cyan-400" />
                <span>إدارة قراءات أجهزة القياس والظروف البيئية للمنشأة الصناعية</span>
              </h3>
              <p className="text-xs text-slate-400">
                ربط المحطات المركزية (الضواغط، التشيلرات، البويلر، محطة الـ RO) بالعدادات الميدانية
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <button
                type="button"
                onClick={handleSyncAllMeterDevices}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-cyan-600/20 hover:bg-cyan-600/30 text-cyan-300 border border-cyan-500/40 text-xs font-bold transition-all active:scale-95"
                title="جلب وتحديث القراءات اللحظية من كافة أجهزة القياس المسجلة بالمعمل"
              >
                <RefreshCw className="w-4 h-4 text-cyan-400" />
                <span>مزامنة قراءات العدادات اللحظية</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setEditingLinkedMeter(null);
                  setIsLinkMeterModalOpen(true);
                }}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-blue-600/20 hover:bg-blue-600/30 text-blue-300 border border-blue-500/40 text-xs font-bold transition-all active:scale-95"
              >
                <Link2 className="w-4 h-4" />
                <span>+ ربط جهاز قياس / عداد</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setEditingEnvParam(null);
                  setIsEnvParamModalOpen(true);
                }}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-300 border border-emerald-500/40 text-xs font-bold transition-all active:scale-95"
              >
                <Plus className="w-4 h-4" />
                <span>+ إضافة مؤشر بيئي مخصص</span>
              </button>
            </div>
          </div>

          {/* Environmental Conditions Overview */}
          <div className="p-5 rounded-2xl bg-[#1e293b] border border-[#334155] space-y-4">
            <h3 className="text-sm font-bold text-emerald-400 flex items-center gap-2 border-b border-[#334155] pb-3">
              <Thermometer className="w-5 h-5" />
              <span>المواصفات والظروف البيئية والصناعية الأساسية للدورية</span>
            </h3>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div className="p-4 rounded-xl bg-[#0f172a] border border-[#334155] text-center">
                <span className="text-slate-400 text-xs block font-bold">الحرارة المحيطة</span>
                <div className="text-2xl sm:text-3xl font-black font-mono text-emerald-400 mt-1">
                  {activeShiftLog.environmentalConditions?.ambientTempC ?? 24.5} °C
                </div>
                <span className="text-[10px] text-slate-500">نطاق التكييف: 22 - 26°C</span>
              </div>

              <div className="p-4 rounded-xl bg-[#0f172a] border border-[#334155] text-center">
                <span className="text-slate-400 text-xs block font-bold">الرطوبة النسبية (RH)</span>
                <div className="text-2xl sm:text-3xl font-black font-mono text-cyan-400 mt-1">
                  {activeShiftLog.environmentalConditions?.humidityPercent ?? 48} %
                </div>
                <span className="text-[10px] text-slate-500">نطاق مثالي لطباعة الأفلام</span>
              </div>

              <div className="p-4 rounded-xl bg-[#0f172a] border border-[#334155] text-center">
                <span className="text-slate-400 text-xs block font-bold">أبخرة المذيبات العضوية</span>
                <div className="text-2xl sm:text-3xl font-black font-mono text-amber-400 mt-1">
                  {activeShiftLog.environmentalConditions?.solventVaporPpm ?? 12} PPM
                </div>
                <span className="text-[10px] text-slate-500">الحد الآمن المسموح: &lt; 25 PPM</span>
              </div>

              <div className="p-4 rounded-xl bg-[#0f172a] border border-[#334155] text-center">
                <span className="text-slate-400 text-xs block font-bold">مستوى الضجيج الصناعي</span>
                <div className="text-2xl sm:text-3xl font-black font-mono text-blue-400 mt-1">
                  {activeShiftLog.environmentalConditions?.noiseLevelDb ?? 78} dB
                </div>
                <span className="text-[10px] text-slate-500">ارتداء واقيات السمع إلزامي</span>
              </div>
            </div>
          </div>

          {/* Central Utilities Overview */}
          <div className="p-5 rounded-2xl bg-[#1e293b] border border-[#334155] space-y-4">
            <h3 className="text-sm font-bold text-cyan-400 flex items-center gap-2 border-b border-[#334155] pb-3">
              <Gauge className="w-5 h-5" />
              <span>مؤشرات المحطات والخدمات المركزية التشغيلية</span>
            </h3>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs font-mono">
              <div className="p-4 rounded-xl bg-[#0f172a] border border-[#334155]">
                <span className="text-slate-400 block text-xs font-sans">ضغط الهواء المضغوط الرئيسي:</span>
                <span className="text-cyan-400 font-bold text-2xl mt-1 block">
                  {activeShiftLog.utilitiesSummary?.airPressureBar ?? 8.5} Bar
                </span>
                <span className="text-slate-500 block text-[11px] mt-1 font-sans">ضاغط أطلس كوبكو GA 90 VSD+</span>
              </div>

              <div className="p-4 rounded-xl bg-[#0f172a] border border-[#334155]">
                <span className="text-slate-400 block text-xs font-sans">حرارة مياه تبريد الجلرات:</span>
                <span className="text-blue-400 font-bold text-2xl mt-1 block">
                  {activeShiftLog.utilitiesSummary?.chillerTempC ?? 8.2} °C
                </span>
                <span className="text-slate-500 block text-[11px] mt-1 font-sans">محطة مبردات Daikin EWAD 250</span>
              </div>

              <div className="p-4 rounded-xl bg-[#0f172a] border border-[#334155]">
                <span className="text-slate-400 block text-xs font-sans">حرارة مرجل الزيت الحراري:</span>
                <span className="text-yellow-400 font-bold text-2xl mt-1 block">
                  {activeShiftLog.utilitiesSummary?.boilerTempC ?? 248} °C
                </span>
                <span className="text-slate-500 block text-[11px] mt-1 font-sans">بويلر Bono Energia 1.5M kcal</span>
              </div>

              <div className="p-4 rounded-xl bg-[#0f172a] border border-[#334155]">
                <span className="text-slate-400 block text-xs font-sans">تردد الشبكة و UPS:</span>
                <span className="text-green-400 font-bold text-2xl mt-1 block">
                  {activeShiftLog.utilitiesSummary?.powerFrequencyHz ?? 50.02} Hz
                </span>
                <span className="text-slate-500 block text-[11px] mt-1 font-sans">Schneider Galaxy 300 UPS</span>
              </div>
            </div>
          </div>

          {/* Linked Meter Readings Section */}
          <div className="p-5 rounded-2xl bg-[#1e293b] border border-[#334155] space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#334155] pb-3">
              <div>
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <Link2 className="w-5 h-5 text-cyan-400" />
                  <span>أجهزة القياس والعدادات المربوطة بمحضر الدورية ({activeShiftLog.linkedMeterReadings?.length || 0})</span>
                </h3>
                <p className="text-xs text-slate-400">
                  قراءات حية موثقة من أجهزة القياس الصناعية مرتبطة مباشرة بتقرير الدورية
                </p>
              </div>

              <button
                type="button"
                onClick={() => {
                  setEditingLinkedMeter(null);
                  setIsLinkMeterModalOpen(true);
                }}
                className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-cyan-600/20 hover:bg-cyan-600/30 text-cyan-300 border border-cyan-500/40 text-xs font-bold transition-all"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>ربط عداد جديد</span>
              </button>
            </div>

            {(!activeShiftLog.linkedMeterReadings || activeShiftLog.linkedMeterReadings.length === 0) ? (
              <div className="p-6 rounded-xl bg-[#0f172a] border border-dashed border-[#334155] text-center space-y-2">
                <Gauge className="w-8 h-8 text-slate-500 mx-auto" />
                <p className="text-xs text-slate-400">
                  لم يتم ربط عدادات أو أجهزة قياس بعد بهذه الدورية.
                </p>
                <button
                  type="button"
                  onClick={handleSyncAllMeterDevices}
                  className="px-4 py-1.5 rounded-lg bg-cyan-600/20 hover:bg-cyan-600/30 text-cyan-300 border border-cyan-500/40 text-xs font-bold inline-flex items-center gap-1.5 mt-1"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  <span>جلب وقراءة العدادات المركزية آلياً</span>
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                {(activeShiftLog.linkedMeterReadings || []).map((reading, idx) => (
                  <div
                    key={idx}
                    className="p-3.5 rounded-xl bg-[#0f172a] border border-[#334155] hover:border-cyan-500/40 transition-colors space-y-2 text-xs"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <span className="font-mono text-[10px] text-cyan-400 font-bold bg-cyan-950/50 px-1.5 py-0.5 rounded border border-cyan-800/40 block w-max mb-1">
                          {reading.deviceCode}
                        </span>
                        <span className="font-bold text-white block">{reading.deviceName}</span>
                        <span className="text-[11px] text-slate-400">{reading.parameterName}</span>
                      </div>

                      <div className="flex items-center gap-1">
                        <button
                          type="button"
                          onClick={() => {
                            setEditingLinkedMeter(reading);
                            setIsLinkMeterModalOpen(true);
                          }}
                          className="p-1 rounded text-slate-400 hover:text-cyan-300 hover:bg-cyan-500/10"
                          title="تعديل القراءة"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDeleteLinkedMeter(idx)}
                          className="p-1 rounded text-slate-400 hover:text-red-400 hover:bg-red-500/10"
                          title="إلغاء ربط القراءة"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>

                    <div className="flex items-baseline justify-between pt-1 border-t border-[#334155]">
                      <div className="font-mono font-bold text-lg text-cyan-300">
                        {reading.value} <span className="text-xs text-slate-400 font-normal">{reading.unit}</span>
                      </div>
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                        reading.status === 'NORMAL'
                          ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                          : reading.status === 'WARNING'
                          ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                          : 'bg-red-500/20 text-red-300 border border-red-500/30'
                      }`}>
                        {reading.status === 'NORMAL' ? 'طبيعي' : reading.status === 'WARNING' ? 'تنبيه' : 'حرج'}
                      </span>
                    </div>

                    {reading.notes && (
                      <p className="text-[10px] text-slate-400 bg-[#1e293b] p-1.5 rounded-lg border border-[#334155]">
                        {reading.notes}
                      </p>
                    )}

                    <div className="text-[10px] text-slate-500 font-mono text-left">
                      التوقيت: {reading.recordedAt}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Custom Environmental Parameters Section */}
          <div className="p-5 rounded-2xl bg-[#1e293b] border border-[#334155] space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#334155] pb-3">
              <div>
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <Thermometer className="w-5 h-5 text-emerald-400" />
                  <span>المؤشرات البيئية والصناعية التفصيلية المخصصة ({activeShiftLog.customEnvironmentalParams?.length || 0})</span>
                </h3>
                <p className="text-xs text-slate-400">
                  إمكانية إضافة مؤشرات بيئية وحذفها وتوثيق النطاقات المسموحة والنتائج
                </p>
              </div>

              <button
                type="button"
                onClick={() => {
                  setEditingEnvParam(null);
                  setIsEnvParamModalOpen(true);
                }}
                className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-300 border border-emerald-500/40 text-xs font-bold transition-all"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>+ إضافة مؤشر بيئي جديد</span>
              </button>
            </div>

            {(!activeShiftLog.customEnvironmentalParams || activeShiftLog.customEnvironmentalParams.length === 0) ? (
              <div className="p-5 rounded-xl bg-[#0f172a] border border-dashed border-[#334155] text-center space-y-2">
                <p className="text-xs text-slate-400">
                  لا توجد مؤشرات بيئية مخصصة إضافية مسجلة بعد في هذه الدورية.
                </p>
                <button
                  type="button"
                  onClick={() => {
                    setEditingEnvParam(null);
                    setIsEnvParamModalOpen(true);
                  }}
                  className="px-3.5 py-1.5 rounded-lg bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-300 border border-emerald-500/40 text-xs font-bold inline-flex items-center gap-1"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>إضافة مؤشر لقاعة أو معدة</span>
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {(activeShiftLog.customEnvironmentalParams || []).map((param) => (
                  <div
                    key={param.id}
                    className="p-3.5 rounded-xl bg-[#0f172a] border border-[#334155] hover:border-emerald-500/40 transition-colors space-y-2 text-xs"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <span className="font-bold text-white block">{param.name}</span>
                        {param.targetRange && (
                          <span className="text-[10px] text-slate-400 font-mono">النطاق المثالي: {param.targetRange}</span>
                        )}
                      </div>

                      <div className="flex items-center gap-1">
                        <button
                          type="button"
                          onClick={() => {
                            setEditingEnvParam(param);
                            setIsEnvParamModalOpen(true);
                          }}
                          className="p-1 rounded text-slate-400 hover:text-emerald-300 hover:bg-emerald-500/10"
                          title="تعديل هذا المؤشر"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDeleteCustomEnvParam(param.id)}
                          className="p-1 rounded text-slate-400 hover:text-red-400 hover:bg-red-500/10"
                          title="حذف هذا المؤشر"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>

                    <div className="flex items-baseline justify-between pt-1 border-t border-[#334155]">
                      <div className="font-mono font-bold text-lg text-emerald-400">
                        {param.value} <span className="text-xs text-slate-400 font-normal">{param.unit}</span>
                      </div>
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                        param.status === 'NORMAL'
                          ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                          : param.status === 'WARNING'
                          ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                          : 'bg-red-500/20 text-red-300 border border-red-500/30'
                      }`}>
                        {param.status === 'NORMAL' ? 'طبيعي / مثالي' : param.status === 'WARNING' ? 'مقبول / مراقبة' : 'حرج'}
                      </span>
                    </div>

                    {param.notes && (
                      <p className="text-[10px] text-slate-400 bg-[#1e293b] p-1.5 rounded-lg border border-[#334155]">
                        {param.notes}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* SUB-VIEW 4: Breakdowns & Consumed Parts */}
      {activeSubTab === 'breakdowns-parts' && (
        <div className="space-y-6">
          {/* Work Orders Table */}
          <div className="p-5 rounded-2xl bg-[#1e293b] border border-[#334155] space-y-4">
            <div className="flex items-center justify-between border-b border-[#334155] pb-3">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <ShieldAlert className="w-5 h-5 text-red-400" />
                <span>سجل الأعطال وأوامر العمل المنفذة بالدورية ({workOrders.length})</span>
              </h3>
              <span className="text-xs text-slate-400 font-mono">
                {criticalWOs.length} حرج • {completedWOs.length} منجز
              </span>
            </div>

            <div className="overflow-x-auto rounded-xl border border-[#334155]">
              <table className="w-full text-right text-xs">
                <thead className="bg-[#0f172a] text-slate-400 font-bold border-b border-[#334155]">
                  <tr>
                    <th className="p-3">رقم الأمر</th>
                    <th className="p-3">الماكينة</th>
                    <th className="p-3">وصف العطل والإجراء</th>
                    <th className="p-3">الفني</th>
                    <th className="p-3 text-center">التوقف (د)</th>
                    <th className="p-3 text-center">الحالة</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#334155] bg-[#0f172a]/40">
                  {workOrders.map((wo) => (
                    <tr key={wo.id} className="hover:bg-[#0f172a]/70">
                      <td className="p-3 font-mono font-bold text-blue-400 whitespace-nowrap">{wo.id}</td>
                      <td className="p-3 whitespace-nowrap">
                        <div className="font-bold text-white">[{wo.assetId}]</div>
                        <div className="text-[11px] text-slate-400">{wo.assetName}</div>
                      </td>
                      <td className="p-3">
                        <div className="font-medium text-slate-200">{wo.title}</div>
                        {wo.actionTaken && (
                          <div className="text-[11px] text-slate-400 mt-0.5">
                            الإجراء: {wo.actionTaken}
                          </div>
                        )}
                      </td>
                      <td className="p-3 text-slate-300 font-medium whitespace-nowrap">
                        {wo.assignedTo}
                      </td>
                      <td className="p-3 text-center font-mono font-bold text-red-400">
                        {wo.downtimeMinutes || 0}
                      </td>
                      <td className="p-3 text-center whitespace-nowrap">
                        <span className={`px-2.5 py-1 rounded text-[10px] font-bold ${
                          wo.status === 'COMPLETED' || wo.status === 'CLOSED'
                            ? 'bg-green-500/15 text-green-400 border border-green-500/30'
                            : wo.priority === 'CRITICAL_STOPPAGE'
                            ? 'bg-red-500/15 text-red-300 border border-red-500/30'
                            : 'bg-blue-500/15 text-blue-300 border border-blue-500/30'
                        }`}>
                          {wo.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Consumed Spare Parts */}
          <div className="p-5 rounded-2xl bg-[#1e293b] border border-[#334155] space-y-4">
            <h3 className="text-sm font-bold text-amber-400 flex items-center gap-2 border-b border-[#334155] pb-3">
              <Package className="w-5 h-5" />
              <span>قطع الغيار والمستهلكات المنصرفة من المستودع</span>
            </h3>

            {consumedPartsSummary.length === 0 ? (
              <div className="p-4 rounded-xl bg-[#0f172a] text-slate-400 text-xs text-center border border-[#334155]">
                لم تسجل حركات صرف قطع جديدة خلال هذه الدورية.
              </div>
            ) : (
              <div className="overflow-x-auto rounded-xl border border-[#334155]">
                <table className="w-full text-right text-xs">
                  <thead className="bg-[#0f172a] text-slate-400 font-bold border-b border-[#334155]">
                    <tr>
                      <th className="p-3">رمز القطعة</th>
                      <th className="p-3">اسم القطعة والمواصفة</th>
                      <th className="p-3 text-center">الكمية المنصرفة</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#334155] bg-[#0f172a]/40">
                    {consumedPartsSummary.map((item, idx) => (
                      <tr key={idx}>
                        <td className="p-3 font-mono font-bold text-amber-400">{item.partId}</td>
                        <td className="p-3 font-medium text-white">{item.partName}</td>
                        <td className="p-3 text-center font-mono font-bold text-emerald-400">
                          {item.quantity} {item.unit || 'قطع'}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      )}

      {/* SUB-VIEW 5: Patrols Archive & Management Table */}
      {activeSubTab === 'archive' && (
        <div className="p-5 rounded-2xl bg-[#1e293b] border border-[#334155] space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#334155] pb-3">
            <div>
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Layers className="w-5 h-5 text-purple-400" />
                <span>سجل وأرشيف كافة تقارير الدوريات والمحاضر ({shiftLogs.length})</span>
              </h3>
              <p className="text-xs text-slate-400">
                قاعدة بيانات متكاملة لجميع الورديات والدوريات مهيأة للمزامنة التلقائية مع السيرفر وقواعد البيانات
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <button
                type="button"
                onClick={() => setIsDbSyncInfoModalOpen(true)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-purple-600/20 hover:bg-purple-600/30 text-purple-300 border border-purple-500/40 text-xs font-bold transition-all"
                title="معلومات ربط السيرفر وقاعدة البيانات"
              >
                <Database className="w-4 h-4 text-purple-400" />
                <span>حالة قاعدة البيانات والسيرفر</span>
              </button>

              <button
                type="button"
                onClick={handleExportDatabaseJSON}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-cyan-600/20 hover:bg-cyan-600/30 text-cyan-300 border border-cyan-500/40 text-xs font-bold transition-all"
                title="تصدير الأرشيف بالكامل كملف JSON علائقي مهيأ للسيرفر"
              >
                <Download className="w-4 h-4 text-cyan-400" />
                <span>تصدير الـ Database</span>
              </button>

              <div className="relative min-w-[200px]">
                <Search className="w-4 h-4 text-slate-400 absolute right-3 top-2.5" />
                <input
                  type="text"
                  value={archiveSearch}
                  onChange={(e) => setArchiveSearch(e.target.value)}
                  placeholder="بحث بالتاريخ أو اسم المهندس..."
                  className="w-full bg-[#0f172a] border border-[#334155] rounded-xl pr-9 pl-3 py-1.5 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-blue-500"
                />
              </div>
            </div>
          </div>

          <div className="overflow-x-auto rounded-xl border border-[#334155]">
            <table className="w-full text-right text-xs">
              <thead className="bg-[#0f172a] text-slate-400 font-bold border-b border-[#334155]">
                <tr>
                  <th className="p-3">رقم المحضر</th>
                  <th className="p-3">التاريخ</th>
                  <th className="p-3">الدورية والفترة</th>
                  <th className="p-3">مهندس الدورية المسؤول</th>
                  <th className="p-3">مهندس الاستلام</th>
                  <th className="p-3 text-center">العدادات المربوطة</th>
                  <th className="p-3 text-center">التوقفات (د)</th>
                  <th className="p-3 text-center">الحالة</th>
                  <th className="p-3 text-center">الإجراءات</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#334155] bg-[#0f172a]/40">
                {filteredArchive.map((log) => {
                  const isCurrentActive = log.id === activeShiftLog.id;
                  const logLead = log.responsibleEngineers?.leadEngineer || log.shiftEngineer || log.supervisorName || 'مهندس الدورية';
                  const logNext = log.responsibleEngineers?.handoverEngineer || log.receivedBy?.name || 'مهندس الاستلام';
                  const linkedCount = log.linkedMeterReadings?.length || 0;

                  return (
                    <tr 
                      key={log.id} 
                      className={`hover:bg-[#0f172a]/80 transition-colors ${
                        isCurrentActive ? 'bg-blue-600/10' : ''
                      }`}
                    >
                      <td className="p-3 font-mono font-bold text-blue-400 whitespace-nowrap">
                        {log.id}
                        {isCurrentActive && (
                          <span className="mr-1.5 px-1.5 py-0.5 rounded text-[9px] bg-blue-500/20 text-blue-300">
                            نشط حالياً
                          </span>
                        )}
                      </td>
                      <td className="p-3 font-mono text-slate-300 whitespace-nowrap">{log.date}</td>
                      <td className="p-3">
                        <div className="font-bold text-white">{log.shiftName}</div>
                        <div className="text-[10px] text-slate-400 font-mono">{log.shiftHours || '07:00 - 15:00'}</div>
                      </td>
                      <td className="p-3 font-medium text-slate-200 whitespace-nowrap">
                        {logLead}
                      </td>
                      <td className="p-3 text-slate-400 whitespace-nowrap">
                        {logNext}
                      </td>
                      <td className="p-3 text-center whitespace-nowrap">
                        {linkedCount > 0 ? (
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                            {linkedCount} أجهزة
                          </span>
                        ) : (
                          <span className="text-[10px] text-slate-500">لا يوجد</span>
                        )}
                      </td>
                      <td className="p-3 text-center font-mono font-bold text-amber-400">
                        {log.totalStoppageMinutes ?? 0}
                      </td>
                      <td className="p-3 text-center whitespace-nowrap">
                        {log.status === 'APPROVED' ? (
                          <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
                            معتمد ✓
                          </span>
                        ) : (
                          <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-500/15 text-amber-400 border border-amber-500/30">
                            قيد العمل
                          </span>
                        )}
                      </td>
                      <td className="p-3 text-center whitespace-nowrap">
                        <div className="flex items-center justify-center gap-1.5">
                          {/* Detail & DB Records Modal Button */}
                          <button
                            type="button"
                            onClick={() => {
                              setSelectedArchiveLogForDetail(log);
                              setIsArchiveDetailModalOpen(true);
                            }}
                            className="p-1.5 rounded-lg bg-purple-600/20 hover:bg-purple-600/30 text-purple-300 border border-purple-500/30 transition-colors"
                            title="عرض سجل وتفاصيل الدورية وقاعدة البيانات"
                          >
                            <FileText className="w-3.5 h-3.5" />
                          </button>

                          <button
                            type="button"
                            onClick={() => {
                              setActiveShiftLog(log);
                              setActiveSubTab('document');
                            }}
                            className="p-1.5 rounded-lg bg-[#334155] hover:bg-slate-600 text-slate-200 transition-colors"
                            title="تحميل المحضر كتقرير حالي نشط"
                          >
                            <Eye className="w-3.5 h-3.5" />
                          </button>

                          <button
                            type="button"
                            onClick={() => {
                              setEditingShiftLog(log);
                              setIsShiftModalOpen(true);
                            }}
                            className="p-1.5 rounded-lg bg-blue-600/20 hover:bg-blue-600/30 text-blue-300 border border-blue-500/30 transition-colors"
                            title="تعديل هذا المحضر"
                          >
                            <Edit3 className="w-3.5 h-3.5" />
                          </button>

                          <button
                            id={`btn-delete-shift-row-${log.id}`}
                            type="button"
                            onClick={() => handleDeleteShift(log)}
                            className="p-1.5 rounded-lg bg-red-500/10 hover:bg-red-500/25 text-red-400 border border-red-500/30 transition-colors active:scale-95"
                            title="حذف هذا المحضر نهائياً"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
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

      {/* Developer Quick Reassign Modal */}
      {isDevAssignModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in">
          <div className="bg-[#1e293b] border border-blue-500/40 rounded-2xl w-full max-w-lg shadow-2xl p-6 space-y-5 text-right font-sans">
            <div className="flex items-center justify-between border-b border-[#334155] pb-3">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center">
                  <KeyRound className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-white">
                    لوحة المطور: تغيير أسماء المهندسين المسؤولين
                  </h3>
                  <p className="text-[11px] text-slate-400">
                    دورية: {activeShiftLog.shiftName} ({activeShiftLog.date})
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsDevAssignModalOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-white"
              >
                ✕
              </button>
            </div>

            <div className="p-3 rounded-xl bg-blue-950/30 border border-blue-500/30 text-xs text-blue-200">
              بصفتك مطور النظام (م. علي رضا)، يمكنك هنا تغيير وتثبيت أسماء المهندسين المسؤولين عن هذه الدورية مباشرة.
            </div>

            <form onSubmit={handleSaveDevAssign} className="space-y-4 text-xs">
              <div className="space-y-1">
                <label className="font-bold text-slate-300 block">
                  مهندس الدورية المسؤول (قائد الدورية) *
                </label>
                <select
                  value={devLeadEngineer}
                  onChange={(e) => setDevLeadEngineer(e.target.value)}
                  className="w-full bg-[#0f172a] border border-[#334155] rounded-xl px-3 py-2 text-white text-xs font-semibold focus:outline-none focus:border-blue-500"
                >
                  {users.map(u => (
                    <option key={u.id} value={u.fullName}>
                      {u.fullName} ({u.roleTitle})
                    </option>
                  ))}
                  <option value={devLeadEngineer}>{devLeadEngineer} (مخصص)</option>
                </select>
                <input
                  type="text"
                  value={devLeadEngineer}
                  onChange={(e) => setDevLeadEngineer(e.target.value)}
                  placeholder="أو اكتب اسماً جديداً..."
                  className="w-full bg-[#0f172a] border border-[#334155] rounded-lg px-2.5 py-1 text-[11px] text-slate-300 mt-1"
                />
              </div>

              <div className="space-y-1">
                <label className="font-bold text-slate-300 block">
                  مهندس الاستلام المناوب القادم *
                </label>
                <select
                  value={devHandoverEngineer}
                  onChange={(e) => setDevHandoverEngineer(e.target.value)}
                  className="w-full bg-[#0f172a] border border-[#334155] rounded-xl px-3 py-2 text-white text-xs font-semibold focus:outline-none focus:border-blue-500"
                >
                  {users.map(u => (
                    <option key={u.id} value={u.fullName}>
                      {u.fullName} ({u.roleTitle})
                    </option>
                  ))}
                  <option value={devHandoverEngineer}>{devHandoverEngineer} (مخصص)</option>
                </select>
                <input
                  type="text"
                  value={devHandoverEngineer}
                  onChange={(e) => setDevHandoverEngineer(e.target.value)}
                  placeholder="أو اكتب اسماً جديداً..."
                  className="w-full bg-[#0f172a] border border-[#334155] rounded-lg px-2.5 py-1 text-[11px] text-slate-300 mt-1"
                />
              </div>

              <div className="space-y-1">
                <label className="font-bold text-slate-300 block">
                  مسؤول السلامة والأمن الصناعي
                </label>
                <select
                  value={devSafetyOfficer}
                  onChange={(e) => setDevSafetyOfficer(e.target.value)}
                  className="w-full bg-[#0f172a] border border-[#334155] rounded-xl px-3 py-2 text-white text-xs font-semibold focus:outline-none focus:border-blue-500"
                >
                  {users.map(u => (
                    <option key={u.id} value={u.fullName}>
                      {u.fullName} ({u.roleTitle})
                    </option>
                  ))}
                  <option value={devSafetyOfficer}>{devSafetyOfficer} (مخصص)</option>
                </select>
                <input
                  type="text"
                  value={devSafetyOfficer}
                  onChange={(e) => setDevSafetyOfficer(e.target.value)}
                  placeholder="أو اكتب اسماً جديداً..."
                  className="w-full bg-[#0f172a] border border-[#334155] rounded-lg px-2.5 py-1 text-[11px] text-slate-300 mt-1"
                />
              </div>

              <div className="pt-3 border-t border-[#334155] flex items-center justify-end gap-2.5">
                <button
                  type="button"
                  onClick={() => setIsDevAssignModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-[#334155] hover:bg-slate-600 text-slate-200 text-xs font-bold"
                >
                  إلغاء
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-amber-600 hover:bg-amber-500 text-white text-xs font-bold shadow-md shadow-amber-600/20 flex items-center gap-1.5"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>تثبيت واعتماد المهندسين</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Database & Cloud Server Status Modal */}
      {isDbSyncInfoModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in">
          <div className="bg-[#1e293b] border border-purple-500/40 rounded-2xl w-full max-w-xl shadow-2xl p-6 space-y-4 text-right font-sans">
            <div className="flex items-center justify-between border-b border-[#334155] pb-3">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-purple-500/20 text-purple-400 flex items-center justify-center">
                  <Database className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-white">
                    حالة قاعدة البيانات والربط مع خادم المعمل (Server & Database)
                  </h3>
                  <p className="text-[11px] text-slate-400">
                    معمل المرجان للمطبوعات • Schema V2.4.0 • جاهز للربط السحابي والـ API
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsDbSyncInfoModalOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-[#334155]"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="p-3 rounded-xl bg-[#0f172a] border border-[#334155] space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-300">اسم جدول قاعدة البيانات:</span>
                  <span className="font-mono text-purple-300 font-bold bg-purple-950/60 px-2 py-0.5 rounded border border-purple-800/40">
                    patrol_shift_logs
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-300">المفتاح الرئيسي (Primary Key):</span>
                  <span className="font-mono text-cyan-300">id (UUID / String)</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-300">حالة التخزين الحالي:</span>
                  <span className="text-emerald-400 font-bold flex items-center gap-1">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                    محفوظ محلياً وموثق كـ State جاهز للإرسال
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-300">مسار خادم الربط المقترح (API Endpoint):</span>
                  <span className="font-mono text-blue-300 text-[11px]">POST /api/v1/patrols/sync</span>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-purple-950/20 border border-purple-500/30 space-y-1.5">
                <span className="font-bold text-purple-300 block">
                  مواصفات تخزين البيانات عند الربط بالسيرفر:
                </span>
                <p className="text-slate-300 text-[11px] leading-relaxed">
                  يتم حفظ كل دورية بكل بنود الفحص الميداني، العدادات المربوطة، الظروف البيئية، أوامر العمل، وقطع الغيار في سجل وثائقي علائقي، مما يتيح استرجاع أي دورية سابقة بضغطة زر ومشاهدة ما تم تنفيذه بكل دقة.
                </p>
              </div>
            </div>

            <div className="pt-2 border-t border-[#334155] flex items-center justify-between">
              <button
                type="button"
                onClick={() => {
                  handleExportDatabaseJSON();
                  setIsDbSyncInfoModalOpen(false);
                }}
                className="px-4 py-2 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-bold shadow-md shadow-cyan-600/20 flex items-center gap-1.5"
              >
                <Download className="w-4 h-4" />
                <span>تحميل نسخة قاعدة البيانات كـ JSON الآن</span>
              </button>

              <button
                type="button"
                onClick={() => setIsDbSyncInfoModalOpen(false)}
                className="px-4 py-2 rounded-xl bg-[#334155] hover:bg-slate-600 text-slate-200 text-xs font-bold"
              >
                إغلاق
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Detailed Patrol & Database Records Modal */}
      {isArchiveDetailModalOpen && selectedArchiveLogForDetail && (
        <PatrolDetailModal
          shiftLog={selectedArchiveLogForDetail}
          isOpen={isArchiveDetailModalOpen}
          onClose={() => {
            setIsArchiveDetailModalOpen(false);
            setSelectedArchiveLogForDetail(null);
          }}
        />
      )}

      {/* Modal for adding/editing checklist item in active shift */}
      <ChecklistModal
        isOpen={isChecklistModalOpen}
        onClose={() => {
          setIsChecklistModalOpen(false);
          setEditingChecklistItem(null);
        }}
        onSave={handleSaveChecklistItem}
        initialItem={editingChecklistItem}
        existingCount={activeShiftLog?.patrolChecklist?.length || 0}
      />

      {/* Modal for linking meter reading to active shift */}
      <LinkMeterModal
        isOpen={isLinkMeterModalOpen}
        onClose={() => {
          setIsLinkMeterModalOpen(false);
          setEditingLinkedMeter(null);
        }}
        meterDevices={meterDevices || []}
        onSave={handleSaveLinkedMeter}
        initialReading={editingLinkedMeter}
      />

      {/* Modal for adding/editing custom environmental parameter */}
      <CustomEnvParamModal
        isOpen={isEnvParamModalOpen}
        onClose={() => {
          setIsEnvParamModalOpen(false);
          setEditingEnvParam(null);
        }}
        onSave={handleSaveCustomEnvParam}
        initialParam={editingEnvParam}
      />

      {/* Modal for creating/editing shifts */}
      <CreateShiftLogModal />
    </div>
  );
};
