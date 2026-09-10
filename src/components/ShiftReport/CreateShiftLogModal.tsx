import React, { useState, useEffect } from 'react';
import { 
  X, 
  FileText, 
  Clock, 
  Calendar, 
  Users, 
  ShieldAlert, 
  Gauge, 
  CheckCircle2,
  Sparkles,
  Lock,
  Unlock,
  Shield,
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
  Volume2
} from 'lucide-react';
import { useCMMS } from '../../context/CMMSContext';
import { ShiftLog, ShiftType } from '../../types';

const DEFAULT_PATROL_HALLS = [
  'قاعة الروتو (ROTO)',
  'قاعة الفليكسو (FLEXO)',
  'قاعة بثق البولي إيثيلين (PE)',
  'قاعة صناعة الأكياس (BAG)',
  'قاعة السلندرات (CYL)',
  'قاعة الشرائط الضيقة (NARROW)',
  'قاعة التبطين والتصفيح (COAT)',
  'قاعة طباعة الصفيح (TIN PRINT)',
  'قاعة تفصيل الصفيح (TIN CUTTER)',
  'محطة الطاقة والمرافق (POWER)'
];

const DEFAULT_CHECKLIST = [
  { id: 'CHK-01', title: 'فحص استقرار ضغط خط الهواء الرئيسي والنيتروجين', area: 'محطة الخدمات', status: 'PASSED' as const, notes: '8.5 بار طبيعي' },
  { id: 'CHK-02', title: 'مراقبة سحب أبخرة المذيبات والتهوية بقاعة الروتو', area: 'قاعة الروتو', status: 'PASSED' as const, notes: 'سحب 100%' },
  { id: 'CHK-03', title: 'فحص حرارة محامل محركات السحب ودرافيل الطباعة', area: 'قاعة الفليكسو', status: 'PASSED' as const, notes: 'أقل من 45°C' },
  { id: 'CHK-04', title: 'معاينة جاهزية أزرار الإيقاف الطارئ E-Stops وتطبيق LOTO', area: 'كافة الخطوط', status: 'PASSED' as const, notes: 'تأمين كامل' },
  { id: 'CHK-05', title: 'معايرة لزوجة الأحبار وضغط كشط سكين الدكتور بليد', area: 'الروتو والفليكسو', status: 'PASSED' as const, notes: 'شفرات جديدة' }
];

export const CreateShiftLogModal: React.FC = () => {
  const { 
    isShiftModalOpen, 
    setIsShiftModalOpen, 
    editingShiftLog, 
    setEditingShiftLog, 
    addShiftLog, 
    updateShiftLog,
    deleteShiftLog,
    requestDeleteConfirmation,
    checkPermission,
    currentUser,
    users,
    hangars,
    kpis,
    meterDevices,
    addNotification
  } = useCMMS();

  const now = new Date();
  const todayStr = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;

  // Check developer privileges for changing responsible engineers
  const isDeveloper = 
    currentUser?.role === 'DEVELOPER' || 
    currentUser?.isSuperDeveloper || 
    currentUser?.permissions?.canManageUsers ||
    currentUser?.permissions?.canViewDeveloperHub;

  // Registered engineers and supervisors for developer quick-pick
  const engineerAccounts = users.filter(
    (u) => 
      u.role === 'DEVELOPER' || 
      u.role === 'MAINTENANCE_MANAGER' || 
      u.role === 'MAINTENANCE_ENGINEER' || 
      u.role === 'SHIFT_SUPERVISOR' ||
      u.role === 'TECHNICIAN' ||
      (u.role as string) === 'SAFETY_OFFICER' ||
      u.roleTitle.includes('مهندس') ||
      u.roleTitle.includes('سلامة')
  );

  const [date, setDate] = useState(todayStr);
  const [shiftType, setShiftType] = useState<ShiftType>('MORNING');
  const [shiftHours, setShiftHours] = useState('07:00 - 15:00');
  
  // Responsible Engineers (Developer Editable Only)
  const [leadEngineer, setLeadEngineer] = useState(currentUser?.fullName || 'م. حسام التميمي');
  const [handoverEngineer, setHandoverEngineer] = useState('م. كريم السعدي');
  const [safetyOfficer, setSafetyOfficer] = useState('م. رافد الشمري');
  const [supervisingTechnicians, setSupervisingTechnicians] = useState('سامر الكعبي (ميكانيك) • أحمد المنصوري (كهرباء) • علاء حسين (تحكم)');
  const [productionSupervisor, setProductionSupervisor] = useState('عمر القيسي');

  // Patrol Route & Coverage
  const [patrolRoute, setPatrolRoute] = useState<string[]>(DEFAULT_PATROL_HALLS.slice(0, 5));
  const [patrolCoveragePercent, setPatrolCoveragePercent] = useState<number>(100);
  const [productionLinesInspected, setProductionLinesInspected] = useState<string>(
    'Rotomec R960 • Cerutti R960 • F&K 20SIX CI • Macchi 5-Layers • Atlas Copco GA90'
  );

  // Environmental & Safety Specifications
  const [ambientTempC, setAmbientTempC] = useState<number>(24.5);
  const [humidityPercent, setHumidityPercent] = useState<number>(48);
  const [solventVaporPpm, setSolventVaporPpm] = useState<number>(12);
  const [noiseLevelDb, setNoiseLevelDb] = useState<number>(78);
  const [safetyIncidents, setSafetyIncidents] = useState<number>(0);

  // Checklist
  const [checklist, setChecklist] = useState(DEFAULT_CHECKLIST);
  const [showAddChecklistForm, setShowAddChecklistForm] = useState(false);
  const [newCheckTitle, setNewCheckTitle] = useState('');
  const [newCheckArea, setNewCheckArea] = useState('قاعة الروتو (ROTO)');
  const [newCheckNotes, setNewCheckNotes] = useState('');

  // Plant Utilities Snapshot
  const [airPressureBar, setAirPressureBar] = useState<number>(8.5);
  const [chillerTempC, setChillerTempC] = useState<number>(8.2);
  const [boilerTempC, setBoilerTempC] = useState<number>(248);
  const [powerFrequencyHz, setPowerFrequencyHz] = useState<number>(50.02);

  // Stoppages & Handover Notes
  const [totalStoppageMinutes, setTotalStoppageMinutes] = useState<number>(kpis.totalDowntimeMinutesToday || 0);
  const [handoverNotes, setHandoverNotes] = useState<string>('');
  const [pendingForNextShift, setPendingForNextShift] = useState<string>('');

  useEffect(() => {
    if (editingShiftLog) {
      setDate(editingShiftLog.date);
      setShiftType(editingShiftLog.shiftType);
      setShiftHours(editingShiftLog.shiftHours || (editingShiftLog.shiftType === 'MORNING' ? '07:00 - 15:00' : editingShiftLog.shiftType === 'EVENING' ? '15:00 - 23:00' : '23:00 - 07:00'));
      setLeadEngineer(editingShiftLog.responsibleEngineers?.leadEngineer || editingShiftLog.shiftEngineer || editingShiftLog.supervisorName || 'م. حسام التميمي');
      setHandoverEngineer(editingShiftLog.responsibleEngineers?.handoverEngineer || editingShiftLog.receivedBy?.name || 'م. كريم السعدي');
      setSafetyOfficer(editingShiftLog.responsibleEngineers?.safetyOfficer || 'م. رافد الشمري');
      setSupervisingTechnicians((editingShiftLog.supervisingTechnicians || editingShiftLog.technicians || []).join(' • '));
      setProductionSupervisor(editingShiftLog.productionSupervisor || 'عمر القيسي');

      if (editingShiftLog.patrolRoute && editingShiftLog.patrolRoute.length > 0) {
        setPatrolRoute(editingShiftLog.patrolRoute);
      }
      setPatrolCoveragePercent(editingShiftLog.patrolCoveragePercent ?? 100);
      setProductionLinesInspected((editingShiftLog.productionLinesInspected || []).join(' • ') || 'Rotomec R960 • Cerutti R960 • F&K 20SIX CI');

      if (editingShiftLog.environmentalConditions) {
        setAmbientTempC(editingShiftLog.environmentalConditions.ambientTempC ?? 24.5);
        setHumidityPercent(editingShiftLog.environmentalConditions.humidityPercent ?? 48);
        setSolventVaporPpm(editingShiftLog.environmentalConditions.solventVaporPpm ?? 12);
        setNoiseLevelDb(editingShiftLog.environmentalConditions.noiseLevelDb ?? 78);
      }

      if (editingShiftLog.patrolChecklist && editingShiftLog.patrolChecklist.length > 0) {
        setChecklist(editingShiftLog.patrolChecklist);
      }

      setHandoverNotes(editingShiftLog.handoverNotes || '');
      setPendingForNextShift(editingShiftLog.pendingForNextShift || '');
      setSafetyIncidents(editingShiftLog.safetyIncidents ?? 0);
      setTotalStoppageMinutes(editingShiftLog.totalStoppageMinutes ?? 0);

      if (editingShiftLog.utilitiesSummary) {
        setAirPressureBar(editingShiftLog.utilitiesSummary.airPressureBar);
        setChillerTempC(editingShiftLog.utilitiesSummary.chillerTempC);
        setBoilerTempC(editingShiftLog.utilitiesSummary.boilerTempC);
        setPowerFrequencyHz(editingShiftLog.utilitiesSummary.powerFrequencyHz);
      }
    } else {
      setDate(todayStr);
      setShiftType('MORNING');
      setShiftHours('07:00 - 15:00');
      setLeadEngineer(currentUser?.fullName || 'م. حسام التميمي');
      setHandoverEngineer('م. كريم السعدي');
      setSafetyOfficer('م. رافد الشمري');
      setPatrolRoute(DEFAULT_PATROL_HALLS.slice(0, 5));
      setPatrolCoveragePercent(100);
      setHandoverNotes('استمرار تشغيل خطوط الروتوغرافور والفليكسو بحالة مستقرة. مراقبة كشاط الدرفيل في ماكينة المونتاج.');
      setPendingForNextShift('متابعة حرارة محامل محرك المحطة 4 في روتو Cerutti عند الساعة 16:30.');
      setSafetyIncidents(0);
      setTotalStoppageMinutes(kpis.totalDowntimeMinutesToday || 0);
      setChecklist(DEFAULT_CHECKLIST);
    }
  }, [editingShiftLog, isShiftModalOpen]);

  if (!isShiftModalOpen) return null;

  const handleClose = () => {
    setIsShiftModalOpen(false);
    setEditingShiftLog(null);
  };

  const getShiftTitle = (type: ShiftType) => {
    switch (type) {
      case 'MORNING': return 'الدورية الأولى (الصباحية 07:00 - 15:00)';
      case 'EVENING': return 'الدورية الثانية (المسائية 15:00 - 23:00)';
      case 'NIGHT': return 'الدورية الثالثة (الليلية 23:00 - 07:00)';
    }
  };

  const togglePatrolHall = (hallName: string) => {
    setPatrolRoute(prev => 
      prev.includes(hallName)
        ? prev.filter(h => h !== hallName)
        : [...prev, hallName]
    );
  };

  const toggleChecklistStatus = (chkId: string) => {
    setChecklist(prev => 
      prev.map(c => {
        if (c.id !== chkId) return c;
        const nextStatus = c.status === 'PASSED' ? 'WARNING' : c.status === 'WARNING' ? 'FAILED' : 'PASSED';
        return { ...c, status: nextStatus };
      })
    );
  };

  const handleAddChecklistItem = () => {
    if (!newCheckTitle.trim()) return;
    const newId = `CHK-${String(checklist.length + 1).padStart(2, '0')}`;
    setChecklist(prev => [
      ...prev,
      {
        id: newId,
        title: newCheckTitle.trim(),
        area: newCheckArea,
        status: 'PASSED' as const,
        notes: newCheckNotes.trim() || 'فحص ميداني سليم'
      }
    ]);
    setNewCheckTitle('');
    setNewCheckNotes('');
    setShowAddChecklistForm(false);
  };

  const handleRemoveChecklistItem = (chkId: string) => {
    setChecklist(prev => prev.filter(c => c.id !== chkId));
  };

  const handleSyncMetersInModal = () => {
    if (!meterDevices || meterDevices.length === 0) return;
    const cmp = meterDevices.find(d => d.code === 'CMP-01' || d.category === 'AIR_COMPRESSOR');
    const chl = meterDevices.find(d => d.code === 'CHL-01' || d.category === 'CHILLER');
    const blr = meterDevices.find(d => d.code === 'BLR-01' || d.category === 'BOILER');
    const ups = meterDevices.find(d => d.code === 'UPS-01' || d.category === 'POWER_ENERGY');
    
    if (cmp && cmp.parameters[0]?.defaultValue) setAirPressureBar(cmp.parameters[0].defaultValue);
    if (chl && chl.parameters[0]?.defaultValue) setChillerTempC(chl.parameters[0].defaultValue);
    if (blr && blr.parameters[0]?.defaultValue) setBoilerTempC(blr.parameters[0].defaultValue);
    if (ups && ups.parameters[0]?.defaultValue) setPowerFrequencyHz(ups.parameters[0].defaultValue);
    
    addNotification('تم جلب ومزامنة قراءات أجهزة القياس والعدادات اللحظية بنجاح إلى التقرير.', 'success');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const techArray = supervisingTechnicians
      .split('•')
      .map(t => t.trim())
      .filter(Boolean);

    const linesArray = productionLinesInspected
      .split('•')
      .map(l => l.trim())
      .filter(Boolean);

    const responsibleEngineersData = {
      leadEngineer,
      handoverEngineer,
      safetyOfficer,
      assignedByDeveloper: isDeveloper,
      lastModifiedBy: currentUser?.fullName || 'م. علي رضا',
      lastModifiedAt: new Date().toISOString().slice(0, 16).replace('T', ' ')
    };

    if (editingShiftLog) {
      updateShiftLog({
        ...editingShiftLog,
        date,
        shiftType,
        shiftName: getShiftTitle(shiftType),
        shiftHours,
        shiftEngineer: leadEngineer,
        supervisorName: leadEngineer,
        productionSupervisor,
        supervisingTechnicians: techArray.length > 0 ? techArray : ['فني ميكانيك عام', 'فني كهرباء صناعية'],
        technicians: techArray.length > 0 ? techArray : ['فني ميكانيك عام', 'فني كهرباء صناعية'],
        handoverNotes: handoverNotes.trim(),
        pendingForNextShift: pendingForNextShift.trim(),
        safetyIncidents,
        totalStoppageMinutes,
        patrolRoute,
        patrolCoveragePercent,
        productionLinesInspected: linesArray,
        patrolChecklist: checklist,
        environmentalConditions: {
          ambientTempC,
          humidityPercent,
          solventVaporPpm,
          noiseLevelDb
        },
        responsibleEngineers: responsibleEngineersData,
        utilitiesSummary: {
          airPressureBar,
          chillerTempC,
          boilerTempC,
          powerFrequencyHz,
        }
      });
    } else {
      addShiftLog({
        date,
        shiftType,
        shiftName: getShiftTitle(shiftType),
        shiftHours,
        shiftEngineer: leadEngineer,
        supervisorName: leadEngineer,
        productionSupervisor,
        supervisingTechnicians: techArray.length > 0 ? techArray : ['فني ميكانيك عام', 'فني كهرباء صناعية'],
        technicians: techArray.length > 0 ? techArray : ['فني ميكانيك عام', 'فني كهرباء صناعية'],
        status: 'IN_PROGRESS',
        totalStoppageMinutes,
        safetyIncidents,
        handoverNotes: handoverNotes.trim(),
        pendingForNextShift: pendingForNextShift.trim(),
        patrolRoute,
        patrolCoveragePercent,
        productionLinesInspected: linesArray,
        patrolChecklist: checklist,
        environmentalConditions: {
          ambientTempC,
          humidityPercent,
          solventVaporPpm,
          noiseLevelDb
        },
        responsibleEngineers: responsibleEngineersData,
        hallStatuses: DEFAULT_PATROL_HALLS.map(h => ({
          hallId: h,
          hallName: h,
          status: 'OPERATIONAL' as const,
          downtimeMinutes: 0
        })),
        workOrdersHandled: [],
        workOrdersExecuted: [],
        sparePartsUsed: [],
        partsConsumed: [],
        utilitiesSummary: {
          airPressureBar,
          chillerTempC,
          boilerTempC,
          powerFrequencyHz,
        },
        handedOverBy: {
          name: leadEngineer,
          role: 'مهندس الدورية المسؤول',
          timestamp: new Date().toLocaleTimeString('ar-EG', { hour: '2-digit', minute: '2-digit' }),
          signed: false
        },
        receivedBy: {
          name: handoverEngineer,
          role: 'مهندس الاستلام المناوب القادم',
          timestamp: '',
          signed: false
        },
        approvedByManager: {
          name: 'م. علي رضا',
          role: 'مطور النظام ومدير إدارة الصيانة',
          timestamp: '',
          signed: false
        }
      });
    }

    handleClose();
  };

  const handleDeleteCurrentShift = () => {
    if (!editingShiftLog) return;
    if (!checkPermission('canManageShifts', 'حذف تقرير الدورية')) return;
    requestDeleteConfirmation({
      title: 'حذف تقرير الدورية التفتيشية',
      message: `هل أنت متأكد من رغبتك في حذف محضر الدورية [${editingShiftLog.shiftName}] المؤرخ في [${editingShiftLog.date}] نهائياً؟`,
      itemDetails: `${editingShiftLog.id} - مهندس الدورية: ${editingShiftLog.shiftEngineer || editingShiftLog.supervisorName}`,
      confirmLabel: 'حذف محضر الدورية',
      onConfirm: () => {
        deleteShiftLog(editingShiftLog.id);
        handleClose();
      }
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-sm overflow-y-auto animate-in fade-in">
      <div 
        className="bg-[#1e293b] border border-[#334155] rounded-2xl w-full max-w-4xl shadow-2xl overflow-hidden text-right font-sans text-slate-100 my-8"
        role="dialog"
      >
        {/* Header */}
        <div className="p-5 bg-gradient-to-r from-blue-950/50 via-[#1e293b] to-[#1e293b] border-b border-[#334155] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-600/20 border border-blue-500/40 flex items-center justify-center text-blue-400">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-white">
                  {editingShiftLog ? `تعديل تقرير الدورية الفنية (${editingShiftLog.shiftName})` : 'فتح محضر دورية تفتيشية جديدة معتمدة'}
                </h3>
                {isDeveloper && (
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30 flex items-center gap-1">
                    <ShieldCheck className="w-3 h-3 text-amber-400" />
                    <span>صلاحيات المطور نشطة</span>
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-400">
                إدارة الشؤون الهندسية والصيانة العامة • معمل المرجان للمطبوعات
              </p>
            </div>
          </div>
          <button
            onClick={handleClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-[#334155] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6 max-h-[82vh] overflow-y-auto">
          {/* Basic Shift Details */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-300 flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5 text-blue-400" />
                <span>تاريخ الدورية *</span>
              </label>
              <input
                type="date"
                required
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full bg-[#0f172a] border border-[#334155] rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-blue-500 font-mono"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-300 flex items-center gap-1">
                <Clock className="w-3.5 h-3.5 text-blue-400" />
                <span>فترة الدورية *</span>
              </label>
              <select
                value={shiftType}
                onChange={(e) => {
                  const val = e.target.value as ShiftType;
                  setShiftType(val);
                  setShiftHours(val === 'MORNING' ? '07:00 - 15:00' : val === 'EVENING' ? '15:00 - 23:00' : '23:00 - 07:00');
                }}
                className="w-full bg-[#0f172a] border border-[#334155] rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-blue-500"
              >
                <option value="MORNING">الدورية الأولى (الصباحية 07:00 - 15:00)</option>
                <option value="EVENING">الدورية الثانية (المسائية 15:00 - 23:00)</option>
                <option value="NIGHT">الدورية الثالثة (الليلية 23:00 - 07:00)</option>
              </select>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-300">ساعات العمل المعتمدة</label>
              <input
                type="text"
                value={shiftHours}
                onChange={(e) => setShiftHours(e.target.value)}
                className="w-full bg-[#0f172a] border border-[#334155] rounded-xl px-3 py-2 text-xs text-white font-mono focus:outline-none focus:border-blue-500"
                placeholder="07:00 - 15:00"
              />
            </div>
          </div>

          {/* Developer Exclusive: Responsible Engineers Panel */}
          <div className={`p-4 rounded-xl border transition-all ${
            isDeveloper 
              ? 'bg-gradient-to-r from-blue-950/30 via-[#0f172a] to-[#0f172a] border-blue-500/40 shadow-md shadow-blue-500/5' 
              : 'bg-[#0f172a]/60 border-[#334155]'
          }`}>
            <div className="flex flex-wrap items-center justify-between gap-2 pb-3 mb-3 border-b border-[#334155]">
              <div className="flex items-center gap-2">
                {isDeveloper ? (
                  <div className="w-7 h-7 rounded-lg bg-amber-500/20 text-amber-400 flex items-center justify-center">
                    <Unlock className="w-4 h-4" />
                  </div>
                ) : (
                  <div className="w-7 h-7 rounded-lg bg-slate-700/50 text-slate-400 flex items-center justify-center">
                    <Lock className="w-4 h-4" />
                  </div>
                )}
                <div>
                  <h4 className="text-xs font-bold text-white flex items-center gap-1.5">
                    <span>تشكيلة المهندسين المشرفين على الدورية</span>
                    {isDeveloper ? (
                      <span className="text-[11px] text-emerald-400 font-normal">
                        (متاح التعديل بصلاحية المطور)
                      </span>
                    ) : (
                      <span className="text-[11px] text-amber-400 font-normal">
                        (مقفول • متاح التعديل لمطور النظام فقط)
                      </span>
                    )}
                  </h4>
                  <p className="text-[10px] text-slate-400">
                    {isDeveloper 
                      ? 'بصفتك مطور النظام (م. علي رضا)، يمكنك تعيين وتغيير أسماء المهندسين المسؤولين عن كل دورية بحرية.'
                      : 'تغيير أو إعادة تعيين المهندس المسؤول محصور حصرياً بحساب مطور النظام ومدير الصيانة م. علي رضا.'}
                  </p>
                </div>
              </div>

              {isDeveloper && (
                <div className="text-[11px] px-2.5 py-1 rounded bg-blue-500/15 border border-blue-500/30 text-blue-300 font-semibold">
                  تحكم المطور نشط ✓
                </div>
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {/* Lead Patrol Engineer */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-300 flex items-center justify-between">
                  <span>مهندس الدورية المسؤول (قائد الدورية) *</span>
                  {!isDeveloper && <Lock className="w-3 h-3 text-amber-400" />}
                </label>
                {isDeveloper ? (
                  <div className="space-y-1">
                    <select
                      value={leadEngineer}
                      onChange={(e) => setLeadEngineer(e.target.value)}
                      className="w-full bg-[#1e293b] border border-blue-500/50 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-blue-400 font-semibold"
                    >
                      {engineerAccounts.map((u) => (
                        <option key={u.id} value={u.fullName}>
                          {u.fullName} ({u.roleTitle})
                        </option>
                      ))}
                      <option value={leadEngineer}>{leadEngineer} (مخصص)</option>
                    </select>
                    <input
                      type="text"
                      value={leadEngineer}
                      onChange={(e) => setLeadEngineer(e.target.value)}
                      placeholder="أو اكتب اسماً يدوياً..."
                      className="w-full bg-[#1e293b] border border-[#334155] rounded-lg px-2.5 py-1 text-[11px] text-slate-200"
                    />
                  </div>
                ) : (
                  <input
                    type="text"
                    disabled
                    value={leadEngineer}
                    className="w-full bg-[#0f172a] border border-[#334155] rounded-xl px-3 py-2 text-xs text-slate-300 cursor-not-allowed font-medium opacity-80"
                    title="خاص بصلاحية المطور"
                  />
                )}
              </div>

              {/* Handover / Next Engineer */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-300 flex items-center justify-between">
                  <span>مهندس الاستلام المناوب القادم *</span>
                  {!isDeveloper && <Lock className="w-3 h-3 text-amber-400" />}
                </label>
                {isDeveloper ? (
                  <div className="space-y-1">
                    <select
                      value={handoverEngineer}
                      onChange={(e) => setHandoverEngineer(e.target.value)}
                      className="w-full bg-[#1e293b] border border-blue-500/50 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-blue-400 font-semibold"
                    >
                      {engineerAccounts.map((u) => (
                        <option key={u.id} value={u.fullName}>
                          {u.fullName} ({u.roleTitle})
                        </option>
                      ))}
                      <option value={handoverEngineer}>{handoverEngineer} (مخصص)</option>
                    </select>
                    <input
                      type="text"
                      value={handoverEngineer}
                      onChange={(e) => setHandoverEngineer(e.target.value)}
                      placeholder="أو اكتب اسماً يدوياً..."
                      className="w-full bg-[#1e293b] border border-[#334155] rounded-lg px-2.5 py-1 text-[11px] text-slate-200"
                    />
                  </div>
                ) : (
                  <input
                    type="text"
                    disabled
                    value={handoverEngineer}
                    className="w-full bg-[#0f172a] border border-[#334155] rounded-xl px-3 py-2 text-xs text-slate-300 cursor-not-allowed font-medium opacity-80"
                    title="خاص بصلاحية المطور"
                  />
                )}
              </div>

              {/* Safety Officer / Supervisor */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-300 flex items-center justify-between">
                  <span>مسؤول السلامة والأمن الصناعي</span>
                  {!isDeveloper && <Lock className="w-3 h-3 text-amber-400" />}
                </label>
                {isDeveloper ? (
                  <div className="space-y-1">
                    <select
                      value={safetyOfficer}
                      onChange={(e) => setSafetyOfficer(e.target.value)}
                      className="w-full bg-[#1e293b] border border-blue-500/50 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-blue-400 font-semibold"
                    >
                      {engineerAccounts.map((u) => (
                        <option key={u.id} value={u.fullName}>
                          {u.fullName} ({u.roleTitle})
                        </option>
                      ))}
                      <option value={safetyOfficer}>{safetyOfficer} (مخصص)</option>
                    </select>
                    <input
                      type="text"
                      value={safetyOfficer}
                      onChange={(e) => setSafetyOfficer(e.target.value)}
                      placeholder="أو اكتب اسماً يدوياً..."
                      className="w-full bg-[#1e293b] border border-[#334155] rounded-lg px-2.5 py-1 text-[11px] text-slate-200"
                    />
                  </div>
                ) : (
                  <input
                    type="text"
                    disabled
                    value={safetyOfficer}
                    className="w-full bg-[#0f172a] border border-[#334155] rounded-xl px-3 py-2 text-xs text-slate-300 cursor-not-allowed font-medium opacity-80"
                    title="خاص بصلاحية المطور"
                  />
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-3 pt-3 border-t border-[#334155]/60">
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-300">طاقم الفنيين الميدانيين (مفصول بـ •)</label>
                <input
                  type="text"
                  value={supervisingTechnicians}
                  onChange={(e) => setSupervisingTechnicians(e.target.value)}
                  placeholder="فني ميكانيك • فني كهرباء • فني خدمات"
                  className="w-full bg-[#1e293b] border border-[#334155] rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-blue-500"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-300">مشرف تشغيل الإنتاج المناوب</label>
                <input
                  type="text"
                  value={productionSupervisor}
                  onChange={(e) => setProductionSupervisor(e.target.value)}
                  placeholder="مشرف وردية الإنتاج"
                  className="w-full bg-[#1e293b] border border-[#334155] rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-blue-500"
                />
              </div>
            </div>
          </div>

          {/* Patrol Route & Inspected Lines */}
          <div className="p-4 rounded-xl bg-[#0f172a] border border-[#334155] space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-bold text-white flex items-center gap-1.5">
                <MapPin className="w-4 h-4 text-cyan-400" />
                <span>المسار التفقدي الميداني للدورية (حدد القاعات المفحوصة):</span>
              </h4>
              <span className="text-[11px] font-mono text-cyan-400 font-bold">
                {patrolRoute.length} / {DEFAULT_PATROL_HALLS.length} قاعات مشمولة
              </span>
            </div>

            <div className="flex flex-wrap gap-2">
              {DEFAULT_PATROL_HALLS.map((hall) => {
                const isSelected = patrolRoute.includes(hall);
                return (
                  <button
                    key={hall}
                    type="button"
                    onClick={() => togglePatrolHall(hall)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all border ${
                      isSelected
                        ? 'bg-blue-600/20 text-blue-300 border-blue-500/50 shadow-sm'
                        : 'bg-[#1e293b] text-slate-400 border-[#334155] hover:border-slate-500'
                    }`}
                  >
                    {isSelected ? '✓ ' : '+ '} {hall}
                  </button>
                );
              })}
            </div>

            <div className="pt-2">
              <label className="text-xs font-bold text-slate-300 block mb-1">
                خطوط الإنتاج والطباعة المفحوصة تفصيلياً (مفصول بـ •)
              </label>
              <input
                type="text"
                value={productionLinesInspected}
                onChange={(e) => setProductionLinesInspected(e.target.value)}
                placeholder="Rotomec R960 • Cerutti R960 • F&K 20SIX CI"
                className="w-full bg-[#1e293b] border border-[#334155] rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-blue-500 font-mono"
              />
            </div>
          </div>

          {/* Environmental & Industrial Safety Specs */}
          <div className="p-4 rounded-xl bg-[#0f172a] border border-[#334155] space-y-3">
            <h4 className="text-xs font-bold text-emerald-400 flex items-center gap-1.5">
              <Thermometer className="w-3.5 h-3.5" />
              <span>المواصفات والظروف البيئية والصناعية أثناء الدورية:</span>
            </h4>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
              <div>
                <label className="text-[10px] text-slate-400 block mb-1">الحرارة المحيطة (°C)</label>
                <input
                  type="number"
                  step="0.1"
                  value={ambientTempC}
                  onChange={(e) => setAmbientTempC(parseFloat(e.target.value) || 0)}
                  className="w-full bg-[#1e293b] border border-[#334155] rounded-lg p-2 text-white font-mono"
                />
              </div>
              <div>
                <label className="text-[10px] text-slate-400 block mb-1">الرطوبة النسبية (%)</label>
                <input
                  type="number"
                  step="1"
                  value={humidityPercent}
                  onChange={(e) => setHumidityPercent(parseInt(e.target.value) || 0)}
                  className="w-full bg-[#1e293b] border border-[#334155] rounded-lg p-2 text-white font-mono"
                />
              </div>
              <div>
                <label className="text-[10px] text-slate-400 block mb-1">أبخرة المذيبات (PPM)</label>
                <input
                  type="number"
                  step="1"
                  value={solventVaporPpm}
                  onChange={(e) => setSolventVaporPpm(parseInt(e.target.value) || 0)}
                  className="w-full bg-[#1e293b] border border-[#334155] rounded-lg p-2 text-white font-mono"
                />
              </div>
              <div>
                <label className="text-[10px] text-slate-400 block mb-1">مستوى الضجيج (dB)</label>
                <input
                  type="number"
                  step="1"
                  value={noiseLevelDb}
                  onChange={(e) => setNoiseLevelDb(parseInt(e.target.value) || 0)}
                  className="w-full bg-[#1e293b] border border-[#334155] rounded-lg p-2 text-white font-mono"
                />
              </div>
            </div>
          </div>

          {/* Plant Central Utilities Snapshot */}
          <div className="p-4 rounded-xl bg-[#0f172a] border border-[#334155] space-y-3">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <h4 className="text-xs font-bold text-cyan-400 flex items-center gap-1.5">
                <Gauge className="w-3.5 h-3.5" />
                <span>مؤشرات المحطات المركزية خلال الدورية (هواء مضغوط • تشيلر • بويلر • طاقة):</span>
              </h4>
              <button
                type="button"
                onClick={handleSyncMetersInModal}
                className="px-2.5 py-1 rounded-lg bg-cyan-600/20 hover:bg-cyan-600/30 text-cyan-300 border border-cyan-500/40 text-[11px] font-bold transition-all flex items-center gap-1.5"
                title="جلب القراءات اللحظية من أجهزة القياس المسجلة"
              >
                <Zap className="w-3 h-3 text-cyan-400" />
                <span>مزامنة قراءات أجهزة القياس الحية</span>
              </button>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
              <div>
                <label className="text-[10px] text-slate-400 block mb-1">ضغط الهواء (Bar)</label>
                <input
                  type="number"
                  step="0.1"
                  value={airPressureBar}
                  onChange={(e) => setAirPressureBar(parseFloat(e.target.value) || 0)}
                  className="w-full bg-[#1e293b] border border-[#334155] rounded-lg p-2 text-white font-mono"
                />
              </div>
              <div>
                <label className="text-[10px] text-slate-400 block mb-1">ماء التشيلر (°C)</label>
                <input
                  type="number"
                  step="0.1"
                  value={chillerTempC}
                  onChange={(e) => setChillerTempC(parseFloat(e.target.value) || 0)}
                  className="w-full bg-[#1e293b] border border-[#334155] rounded-lg p-2 text-white font-mono"
                />
              </div>
              <div>
                <label className="text-[10px] text-slate-400 block mb-1">الزيت الحراري (°C)</label>
                <input
                  type="number"
                  value={boilerTempC}
                  onChange={(e) => setBoilerTempC(parseInt(e.target.value) || 0)}
                  className="w-full bg-[#1e293b] border border-[#334155] rounded-lg p-2 text-white font-mono"
                />
              </div>
              <div>
                <label className="text-[10px] text-slate-400 block mb-1">تردد الكهرباء (Hz)</label>
                <input
                  type="number"
                  step="0.01"
                  value={powerFrequencyHz}
                  onChange={(e) => setPowerFrequencyHz(parseFloat(e.target.value) || 50)}
                  className="w-full bg-[#1e293b] border border-[#334155] rounded-lg p-2 text-white font-mono"
                />
              </div>
            </div>
          </div>

          {/* Checklist Items */}
          <div className="p-4 rounded-xl bg-[#0f172a] border border-[#334155] space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-bold text-white flex items-center gap-1.5">
                <CheckSquare className="w-3.5 h-3.5 text-blue-400" />
                <span>قائمة الفحص الميداني للدورية ({checklist.length} بنود):</span>
              </h4>
              <button
                type="button"
                onClick={() => setShowAddChecklistForm(!showAddChecklistForm)}
                className="px-2.5 py-1 rounded-lg bg-blue-600/20 hover:bg-blue-600/30 text-blue-300 border border-blue-500/40 text-[11px] font-bold transition-all flex items-center gap-1"
              >
                <span>{showAddChecklistForm ? 'إلغاء الإضافة' : '+ إضافة بند فحص'}</span>
              </button>
            </div>

            {/* Inline Add Checklist Form */}
            {showAddChecklistForm && (
              <div className="p-3 rounded-xl bg-[#1e293b] border border-blue-500/40 space-y-2.5 animate-in fade-in">
                <div className="text-xs font-bold text-blue-400">إضافة بند فحص جديد:</div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  <input
                    type="text"
                    value={newCheckTitle}
                    onChange={(e) => setNewCheckTitle(e.target.value)}
                    placeholder="عنوان البند أو المعدة المراد فحصها..."
                    className="w-full bg-[#0f172a] border border-[#334155] rounded-lg px-2.5 py-1.5 text-xs text-white"
                  />
                  <select
                    value={newCheckArea}
                    onChange={(e) => setNewCheckArea(e.target.value)}
                    className="w-full bg-[#0f172a] border border-[#334155] rounded-lg px-2.5 py-1.5 text-xs text-white"
                  >
                    {DEFAULT_PATROL_HALLS.map((h) => (
                      <option key={h} value={h}>{h}</option>
                    ))}
                    <option value="محطة الطاقة والخدمات">محطة الطاقة والخدمات</option>
                    <option value="كافة القاعات">كافة القاعات</option>
                  </select>
                </div>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={newCheckNotes}
                    onChange={(e) => setNewCheckNotes(e.target.value)}
                    placeholder="ملاحظات وتفاصيل الفحص..."
                    className="flex-1 bg-[#0f172a] border border-[#334155] rounded-lg px-2.5 py-1.5 text-xs text-white"
                  />
                  <button
                    type="button"
                    onClick={handleAddChecklistItem}
                    className="px-4 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold shrink-0"
                  >
                    إضافة للقائمة
                  </button>
                </div>
              </div>
            )}

            <div className="space-y-2">
              {checklist.map((item) => (
                <div
                  key={item.id}
                  className="p-2.5 rounded-lg bg-[#1e293b] border border-[#334155] flex items-center justify-between gap-3 text-xs"
                >
                  <div className="flex items-center gap-2 flex-1 min-w-0">
                    <button
                      type="button"
                      onClick={() => handleRemoveChecklistItem(item.id)}
                      className="p-1 rounded text-slate-500 hover:text-red-400 hover:bg-red-500/10 transition-colors shrink-0"
                      title="حذف هذا البند من الدورية"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                    <div className="truncate">
                      <span className="font-bold text-white block truncate">{item.title}</span>
                      <span className="text-[11px] text-slate-400 font-mono block truncate">{item.area} — {item.notes}</span>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => toggleChecklistStatus(item.id)}
                    className={`px-3 py-1 rounded-full text-[11px] font-bold border transition-colors shrink-0 ${
                      item.status === 'PASSED'
                        ? 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30'
                        : item.status === 'WARNING'
                        ? 'bg-amber-500/15 text-amber-300 border-amber-500/30'
                        : 'bg-red-500/15 text-red-300 border-red-500/30'
                    }`}
                  >
                    {item.status === 'PASSED' && '✓ مطابق وسليم'}
                    {item.status === 'WARNING' && '⚠️ ملاحظة / تنبيه'}
                    {item.status === 'FAILED' && '✕ خلل يستوجب تدخل'}
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Stoppages & Safety Metrics */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-300">دقائق توقف خطوط الإنتاج الإجمالية بالدورية</label>
              <input
                type="number"
                value={totalStoppageMinutes}
                onChange={(e) => setTotalStoppageMinutes(parseInt(e.target.value) || 0)}
                className="w-full bg-[#0f172a] border border-[#334155] rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-blue-500 font-mono"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-300">حوادث السلامة والأمان (HSE)</label>
              <input
                type="number"
                value={safetyIncidents}
                onChange={(e) => setSafetyIncidents(parseInt(e.target.value) || 0)}
                className="w-full bg-[#0f172a] border border-[#334155] rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-blue-500 font-mono"
              />
            </div>
          </div>

          {/* Handover & Pending Tasks */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-300">
                ملاحظات ومحضر تسليم الدورية الفنية *
              </label>
              <textarea
                rows={3}
                required
                value={handoverNotes}
                onChange={(e) => setHandoverNotes(e.target.value)}
                placeholder="التوصيات الفنية وحالة الماكينات..."
                className="w-full bg-[#0f172a] border border-[#334155] rounded-xl p-3 text-xs text-white focus:outline-none focus:border-blue-500"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-300">
                المهام المفتوحة الموجهة للدورية القادمة (Pending Tasks)
              </label>
              <textarea
                rows={3}
                value={pendingForNextShift}
                onChange={(e) => setPendingForNextShift(e.target.value)}
                placeholder="المهام والأعمال المطلوب استكمالها في الدورية اللاحقة..."
                className="w-full bg-[#0f172a] border border-[#334155] rounded-xl p-3 text-xs text-white focus:outline-none focus:border-blue-500"
              />
            </div>
          </div>

          {/* Footer Actions */}
          <div className="pt-4 border-t border-[#334155] flex items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleClose}
                className="px-4 py-2.5 rounded-xl bg-[#334155] hover:bg-slate-600 text-slate-200 text-xs font-bold transition-colors"
              >
                إلغاء
              </button>

              {editingShiftLog && (
                <button
                  type="button"
                  id="btn-delete-shift-modal"
                  onClick={handleDeleteCurrentShift}
                  className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-xs font-bold text-red-400 hover:text-red-300 bg-red-500/10 hover:bg-red-500/20 border border-red-500/30 transition-all active:scale-95"
                  title="حذف هذا المحضر نهائياً"
                >
                  <Trash2 className="w-4 h-4" />
                  <span>حذف محضر الدورية</span>
                </button>
              )}
            </div>

            <button
              type="submit"
              className="px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold shadow-lg shadow-blue-600/20 transition-all active:scale-95 flex items-center gap-2"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>{editingShiftLog ? 'حفظ تعديلات تقرير الدورية' : 'اعتماد وتسجيل الدورية'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
