import React, { useState } from 'react';
import { 
  CalendarCheck, 
  Plus, 
  Search, 
  Filter, 
  Clock, 
  CheckCircle2, 
  AlertTriangle, 
  AlertOctagon, 
  Wrench, 
  ShieldAlert, 
  Edit3, 
  Trash2, 
  ClipboardList, 
  Play, 
  Layers, 
  Calendar,
  History,
  FileCheck,
  ChevronDown,
  ChevronUp,
  Cpu,
  Zap,
  Droplet
} from 'lucide-react';
import { useCMMS } from '../../context/CMMSContext';
import { 
  PreventiveMaintenancePlan, 
  PMFrequency, 
  PMCategory 
} from '../../types';
import { CreatePMPlanModal } from './CreatePMPlanModal';
import { EditPMPlanModal } from './EditPMPlanModal';
import { ExecutePMModal } from './ExecutePMModal';

export const PreventiveMaintenanceManager: React.FC = () => {
  const { 
    pmPlans, 
    deletePMPlan, 
    requestDeleteConfirmation,
    createWOFromPMPlan, 
    setIsCreatePMPlanOpen, 
    setSelectedPMPlanForExecution, 
    setEditingPMPlan,
    checkPermission
  } = useCMMS();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFrequency, setSelectedFrequency] = useState<PMFrequency | 'ALL'>('ALL');
  const [selectedCategory, setSelectedCategory] = useState<PMCategory | 'ALL'>('ALL');
  const [selectedStatus, setSelectedStatus] = useState<'ALL' | 'OVERDUE' | 'SCHEDULED' | 'COMPLETED'>('ALL');
  const [expandedPlanId, setExpandedPlanId] = useState<string | null>(null);

  const todayStr = new Date().toISOString().slice(0, 10);

  // Filter plans
  const filteredPlans = pmPlans.filter((plan) => {
    const matchesSearch = 
      plan.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      plan.assetName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      plan.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      plan.assignedTechnician.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesFrequency = selectedFrequency === 'ALL' || plan.frequency === selectedFrequency;
    const matchesCategory = selectedCategory === 'ALL' || plan.category === selectedCategory;
    
    let matchesStatus = true;
    if (selectedStatus === 'OVERDUE') {
      matchesStatus = plan.nextDueDate < todayStr;
    } else if (selectedStatus === 'SCHEDULED') {
      matchesStatus = plan.nextDueDate >= todayStr && plan.status !== 'COMPLETED';
    } else if (selectedStatus === 'COMPLETED') {
      matchesStatus = plan.status === 'COMPLETED';
    }

    return matchesSearch && matchesFrequency && matchesCategory && matchesStatus;
  });

  // Calculate Metrics
  const totalPlans = pmPlans.length;
  const overduePlans = pmPlans.filter((p) => p.nextDueDate < todayStr).length;
  const dueSoonPlans = pmPlans.filter((p) => {
    const diff = (new Date(p.nextDueDate).getTime() - new Date(todayStr).getTime()) / (1000 * 3600 * 24);
    return diff >= 0 && diff <= (p.reminderDaysBefore || 3);
  }).length;
  const complianceRate = totalPlans > 0 ? Math.round(((totalPlans - overduePlans) / totalPlans) * 100) : 100;

  const handleDelete = (plan: PreventiveMaintenancePlan) => {
    if (!checkPermission('canManagePreventive', 'حذف خطة صيانة وقائية')) return;
    requestDeleteConfirmation({
      title: 'حذف خطة صيانة وقائية',
      message: `هل أنت متأكد من رغبتك في حذف خطة الصيانة الوقائية [${plan.title}] المرتبطة بالأصل [${plan.assetName}] نهائياً؟`,
      itemDetails: `${plan.id} - ${plan.title} (الدورية: ${getFrequencyLabel(plan.frequency)})`,
      confirmLabel: 'حذف خطة الصيانة',
      onConfirm: () => {
        deletePMPlan(plan.id);
      },
    });
  };

  const getFrequencyLabel = (freq: PMFrequency, custom?: string) => {
    switch (freq) {
      case 'DAILY': return 'يومي (24 س)';
      case 'WEEKLY': return 'أسبوعي (7 أيام)';
      case 'BIWEEKLY': return 'كل أسبوعين';
      case 'MONTHLY': return 'شهري (30 يوم)';
      case 'QUARTERLY': return 'ربع سنوي (3 أشهر)';
      case 'SEMI_ANNUAL': return 'نصف سنوي (6 أشهر)';
      case 'ANNUAL': return 'سنوي (سنة)';
      case 'RUNNING_HOURS': return custom || 'ساعات تشغيل';
      default: return freq;
    }
  };

  const getCategoryLabel = (cat: PMCategory) => {
    switch (cat) {
      case 'MECHANICAL': return 'ميكانيكي';
      case 'ELECTRICAL': return 'كهربائي';
      case 'AUTOMATION': return 'أتمتة وتحكم';
      case 'LUBRICATION': return 'تزييت وتشحيم';
      case 'PNEUMATIC_HYDRAULIC': return 'هوائي وهيدروليك';
      case 'UTILITIES': return 'مرافق وخدمات';
      case 'SAFETY': return 'سلامة وبيئة';
      default: return cat;
    }
  };

  return (
    <div className="space-y-6" dir="rtl">
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-[#1e293b] p-5 rounded-xl border border-[#334155] shadow-lg">
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-xl bg-blue-600/20 text-blue-400 border border-blue-500/30 flex items-center justify-center shadow-inner">
            <CalendarCheck className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-bold text-white">منظومة الصيانة الوقائية الاحترافية المجدولة</h1>
              <span className="px-2.5 py-0.5 text-[11px] font-bold rounded-full bg-blue-500/10 text-blue-400 border border-blue-500/20">
                Scheduled PM System
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-1">
              إدارة الجداول الدورية، التذكيرات الذكية، إجراءات الفحص التفصيلية، وأوامر العمل الوقائية
            </p>
          </div>
        </div>

        <button
          onClick={() => {
            if (!checkPermission('canManagePreventive', 'إضافة خطة صيانة وقائية جديدة')) return;
            setIsCreatePMPlanOpen(true);
          }}
          className="px-4 py-2.5 bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold rounded-lg flex items-center gap-2 shadow-md shadow-blue-600/20 transition-all self-start md:self-auto"
        >
          <Plus className="w-4 h-4" />
          إضافة خطة صيانة وقائية جديدة
        </button>
      </div>

      {/* KPI Metrics Strip */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="bg-[#1e293b] border border-[#334155] rounded-xl p-4 flex items-center justify-between">
          <div>
            <span className="text-xs text-slate-400 font-medium">إجمالي الخطط المجدولة</span>
            <div className="text-2xl font-bold text-white mt-1 font-mono">{totalPlans}</div>
            <span className="text-[10px] text-slate-400">على خطوط الإنتاج والمرافق</span>
          </div>
          <div className="w-10 h-10 rounded-lg bg-blue-500/10 text-blue-400 flex items-center justify-center">
            <CalendarCheck className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-[#1e293b] border border-[#334155] rounded-xl p-4 flex items-center justify-between">
          <div>
            <span className="text-xs text-slate-400 font-medium">مستحقة قريباً (خلال أيام)</span>
            <div className="text-2xl font-bold text-amber-400 mt-1 font-mono">{dueSoonPlans}</div>
            <span className="text-[10px] text-amber-500/80">تذكير فوري للفرق الفنية</span>
          </div>
          <div className="w-10 h-10 rounded-lg bg-amber-500/10 text-amber-400 flex items-center justify-center">
            <Clock className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-[#1e293b] border border-[#334155] rounded-xl p-4 flex items-center justify-between">
          <div>
            <span className="text-xs text-slate-400 font-medium">متأخرة عن الموعد (Overdue)</span>
            <div className={`text-2xl font-bold mt-1 font-mono ${overduePlans > 0 ? 'text-red-400 animate-pulse' : 'text-slate-400'}`}>
              {overduePlans}
            </div>
            <span className="text-[10px] text-red-500/80">تتطلب تدخلاً عاجلاً</span>
          </div>
          <div className="w-10 h-10 rounded-lg bg-red-500/10 text-red-400 flex items-center justify-center">
            <AlertOctagon className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-[#1e293b] border border-[#334155] rounded-xl p-4 flex items-center justify-between">
          <div>
            <span className="text-xs text-slate-400 font-medium">نسبة الامتثال الوقائي (Compliance)</span>
            <div className="text-2xl font-bold text-emerald-400 mt-1 font-mono">{complianceRate}%</div>
            <span className="text-[10px] text-emerald-500/80">مؤشر الجودة الشاملة TPM</span>
          </div>
          <div className="w-10 h-10 rounded-lg bg-emerald-500/10 text-emerald-400 flex items-center justify-center">
            <CheckCircle2 className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-[#1e293b] p-4 rounded-xl border border-[#334155] space-y-3">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
          {/* Search */}
          <div className="relative flex-1">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="بحث في خطط الصيانة، اسم الماكينة، الكود، أو الفني المكلف..."
              className="w-full bg-[#0f172a] border border-[#334155] rounded-lg pl-3 pr-9 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
            />
            <Search className="w-4 h-4 text-slate-500 absolute right-3 top-2.5" />
          </div>

          {/* Quick Status Pill */}
          <div className="flex items-center gap-1 bg-[#0f172a] p-1 rounded-lg border border-[#334155] text-xs">
            <button
              onClick={() => setSelectedStatus('ALL')}
              className={`px-3 py-1 rounded-md font-semibold transition-all ${
                selectedStatus === 'ALL' ? 'bg-blue-600 text-white shadow-sm' : 'text-slate-400 hover:text-white'
              }`}
            >
              الكل ({pmPlans.length})
            </button>
            <button
              onClick={() => setSelectedStatus('SCHEDULED')}
              className={`px-3 py-1 rounded-md font-semibold transition-all ${
                selectedStatus === 'SCHEDULED' ? 'bg-blue-600 text-white shadow-sm' : 'text-slate-400 hover:text-white'
              }`}
            >
              مجدولة
            </button>
            <button
              onClick={() => setSelectedStatus('OVERDUE')}
              className={`px-3 py-1 rounded-md font-semibold transition-all ${
                selectedStatus === 'OVERDUE' ? 'bg-red-600 text-white shadow-sm' : 'text-slate-400 hover:text-white'
              }`}
            >
              متأخرة ({overduePlans})
            </button>
          </div>
        </div>

        {/* Filters dropdowns */}
        <div className="flex flex-wrap items-center gap-2 pt-1 border-t border-[#334155] text-xs">
          <div className="flex items-center gap-1.5 text-slate-400">
            <Filter className="w-3.5 h-3.5 text-blue-400" />
            <span>فلترة متقدمة:</span>
          </div>

          {/* Frequency Filter */}
          <select
            value={selectedFrequency}
            onChange={(e) => setSelectedFrequency(e.target.value as any)}
            className="bg-[#0f172a] border border-[#334155] rounded-lg px-2.5 py-1 text-slate-200 focus:outline-none focus:border-blue-500"
          >
            <option value="ALL">كافة الدوريات الزمنية</option>
            <option value="DAILY">يومي (Daily)</option>
            <option value="WEEKLY">أسبوعي (Weekly)</option>
            <option value="BIWEEKLY">كل أسبوعين</option>
            <option value="MONTHLY">شهري (Monthly)</option>
            <option value="QUARTERLY">ربع سنوي (Quarterly)</option>
            <option value="SEMI_ANNUAL">نصف سنوي</option>
            <option value="ANNUAL">سنوي</option>
            <option value="RUNNING_HOURS">ساعات تشغيل</option>
          </select>

          {/* Category Filter */}
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value as any)}
            className="bg-[#0f172a] border border-[#334155] rounded-lg px-2.5 py-1 text-slate-200 focus:outline-none focus:border-blue-500"
          >
            <option value="ALL">كافة تخصصات الصيانة</option>
            <option value="MECHANICAL">ميكانيكي</option>
            <option value="ELECTRICAL">كهربائي</option>
            <option value="AUTOMATION">أتمتة وتحكم</option>
            <option value="LUBRICATION">تزييت وتشحيم</option>
            <option value="PNEUMATIC_HYDRAULIC">هوائي وهيدروليك</option>
            <option value="UTILITIES">مرافق وخدمات</option>
            <option value="SAFETY">سلامة وبيئة</option>
          </select>
        </div>
      </div>

      {/* Plans List / Grid */}
      <div className="space-y-4">
        {filteredPlans.length === 0 ? (
          <div className="p-12 text-center bg-[#1e293b] rounded-xl border border-[#334155] text-slate-400">
            <CalendarCheck className="w-12 h-12 mx-auto text-slate-500 mb-3 opacity-50" />
            <p className="text-sm font-semibold text-slate-300">لم يتم العثور على خطط صيانة وقائية مطابقة</p>
            <p className="text-xs text-slate-500 mt-1">يمكنك إضافة خطة صيانة وقائية دورية جديدة وتحديد خطوات الفحص والتكرار</p>
            <button
              onClick={() => setIsCreatePMPlanOpen(true)}
              className="mt-4 px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold rounded-lg inline-flex items-center gap-1.5 transition-colors"
            >
              <Plus className="w-4 h-4" />
              إضافة خطة الآن
            </button>
          </div>
        ) : (
          filteredPlans.map((plan) => {
            const isOverdue = plan.nextDueDate < todayStr;
            const isExpanded = expandedPlanId === plan.id;
            const diffDays = Math.round(
              (new Date(plan.nextDueDate).getTime() - new Date(todayStr).getTime()) / (1000 * 3600 * 24)
            );
            const isDueSoon = diffDays >= 0 && diffDays <= (plan.reminderDaysBefore || 3);

            return (
              <div
                key={plan.id}
                className={`bg-[#1e293b] border rounded-xl overflow-hidden transition-all shadow-md ${
                  isOverdue
                    ? 'border-red-500/40 bg-red-950/10'
                    : isDueSoon
                    ? 'border-amber-500/40'
                    : 'border-[#334155] hover:border-slate-500'
                }`}
              >
                {/* Plan Header Bar */}
                <div className="p-4 sm:p-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="flex items-start gap-3.5">
                    <div className="w-10 h-10 rounded-lg bg-[#0f172a] border border-[#334155] flex items-center justify-center shrink-0 mt-0.5">
                      <Wrench className="w-5 h-5 text-blue-400" />
                    </div>

                    <div className="space-y-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="font-mono text-xs font-bold text-blue-400 bg-blue-950/60 px-2 py-0.5 rounded border border-blue-800/40">
                          {plan.id}
                        </span>

                        <span className="px-2 py-0.5 rounded text-[11px] font-semibold bg-purple-500/10 text-purple-400 border border-purple-500/20">
                          {getCategoryLabel(plan.category)}
                        </span>

                        <span className="px-2 py-0.5 rounded text-[11px] font-semibold bg-sky-500/10 text-sky-400 border border-sky-500/20">
                          تكرار: {getFrequencyLabel(plan.frequency, plan.frequencyCustomText)}
                        </span>

                        {plan.requiresMachineStop && (
                          <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-500/10 text-amber-400 border border-amber-500/20 flex items-center gap-1">
                            <ShieldAlert className="w-3 h-3" />
                            يتطلب إيقاف LOTO
                          </span>
                        )}
                      </div>

                      <h3 className="text-base font-bold text-white leading-tight">
                        {plan.title}
                      </h3>

                      <div className="flex flex-wrap items-center gap-3 text-xs text-slate-400 pt-0.5">
                        <span>الماكينة: <strong className="text-slate-200">{plan.assetName}</strong> ({plan.assetId})</span>
                        <span>•</span>
                        <span>القاعة: <strong className="text-slate-300">{plan.hangarName}</strong></span>
                        <span>•</span>
                        <span>الفني المكلف: <strong className="text-slate-300">{plan.assignedTechnician}</strong></span>
                        <span>•</span>
                        <span>الوقت التقديري: <strong className="text-slate-300 font-mono">{plan.estimatedDurationMinutes} دقيقة</strong></span>
                      </div>
                    </div>
                  </div>

                  {/* Right Side: Due Date & Action Buttons */}
                  <div className="flex flex-col sm:flex-row sm:items-center gap-3 self-end md:self-auto">
                    {/* Due Date Indicator */}
                    <div className="text-right sm:text-left">
                      <div className="text-[11px] text-slate-400">موعد الاستحقاق:</div>
                      <div className="flex items-center gap-1.5 mt-0.5">
                        <span className={`text-sm font-bold font-mono ${
                          isOverdue ? 'text-red-400' : isDueSoon ? 'text-amber-400' : 'text-emerald-400'
                        }`}>
                          {plan.nextDueDate}
                        </span>
                        {isOverdue && (
                          <span className="px-1.5 py-0.2 rounded text-[10px] bg-red-500/20 text-red-300 border border-red-500/30">
                            متأخر!
                          </span>
                        )}
                        {isDueSoon && !isOverdue && (
                          <span className="px-1.5 py-0.2 rounded text-[10px] bg-amber-500/20 text-amber-300 border border-amber-500/30">
                            مستحق قريباً
                          </span>
                        )}
                      </div>
                      {plan.lastCompletedDate && (
                        <div className="text-[10px] text-slate-500 mt-0.5">
                          آخر إنجاز: {plan.lastCompletedDate}
                        </div>
                      )}
                    </div>

                    {/* Action Group */}
                    <div className="flex items-center gap-1.5">
                      {/* Execute Button */}
                      <button
                        onClick={() => {
                          if (!checkPermission('canManagePreventive', 'تنفيذ خطة صيانة وقائية')) return;
                          setSelectedPMPlanForExecution(plan);
                        }}
                        className="px-3.5 py-2 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold rounded-lg flex items-center gap-1.5 shadow-sm transition-all"
                        title="تنفيذ الفحص وتوثيق الإجراءات"
                      >
                        <Play className="w-3.5 h-3.5" />
                        تنفيذ الفحص
                      </button>

                      {/* Generate Work Order Button */}
                      <button
                        onClick={() => {
                          if (!checkPermission('canManagePreventive', 'إصدار أمر عمل وقائي')) return;
                          createWOFromPMPlan(plan);
                        }}
                        className="px-3 py-2 bg-blue-600/20 hover:bg-blue-600/30 text-blue-300 border border-blue-500/30 text-xs font-semibold rounded-lg flex items-center gap-1.5 transition-all"
                        title="إصدار أمر عمل رسمي في قسم أوامر العمل"
                      >
                        <ClipboardList className="w-3.5 h-3.5" />
                        أمر عمل
                      </button>

                      {/* Prominent Edit Button requested by user! */}
                      <button
                        onClick={() => {
                          if (!checkPermission('canManagePreventive', 'تعديل خطة الصيانة الوقائية')) return;
                          setEditingPMPlan(plan);
                        }}
                        className="p-2 bg-[#334155] hover:bg-slate-600 text-slate-200 hover:text-white rounded-lg transition-colors"
                        title="تعديل الخطة والجدول"
                      >
                        <Edit3 className="w-4 h-4 text-amber-400" />
                      </button>

                      {/* Delete Button */}
                      <button
                        onClick={() => handleDelete(plan)}
                        className="p-2 text-slate-400 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
                        title="حذف الخطة"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>

                      {/* Expand Details Toggle */}
                      <button
                        onClick={() => setExpandedPlanId(isExpanded ? null : plan.id)}
                        className="p-2 text-slate-400 hover:text-white hover:bg-[#334155] rounded-lg transition-colors"
                        title="عرض خطوات الفحص والتفاصيل"
                      >
                        {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>
                </div>

                {/* Expanded Details Section */}
                {isExpanded && (
                  <div className="p-4 sm:p-5 border-t border-[#334155] bg-[#0f172a]/60 space-y-4">
                    {/* Steps Checklist Preview */}
                    <div className="space-y-2">
                      <span className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
                        <Wrench className="w-4 h-4 text-blue-400" />
                        خطوات الفحص التشغيلية المجدولة ({plan.steps.length}):
                      </span>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                        {plan.steps.map((s, idx) => (
                          <div
                            key={s.id || idx}
                            className="p-2.5 rounded-lg bg-[#1e293b] border border-[#334155] flex items-center gap-2.5 text-xs text-slate-200"
                          >
                            <span className="w-5 h-5 rounded-full bg-blue-600/20 text-blue-400 font-mono text-[11px] font-bold flex items-center justify-center shrink-0">
                              {idx + 1}
                            </span>
                            <span>{s.description}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Safety, Parts, Notes Grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                      {/* Safety */}
                      <div className="p-3 bg-[#1e293b] border border-[#334155] rounded-lg space-y-1.5">
                        <span className="font-bold text-amber-400 flex items-center gap-1">
                          <ShieldAlert className="w-3.5 h-3.5" />
                          اشتراطات السلامة (LOTO)
                        </span>
                        {plan.safetyRequirements && plan.safetyRequirements.length > 0 ? (
                          <ul className="list-disc list-inside text-slate-300 space-y-0.5 text-[11px]">
                            {plan.safetyRequirements.map((r, i) => (
                              <li key={i}>{r}</li>
                            ))}
                          </ul>
                        ) : (
                          <p className="text-slate-500 text-[11px]">لا توجد اشتراطات خاصة</p>
                        )}
                      </div>

                      {/* Required Parts */}
                      <div className="p-3 bg-[#1e293b] border border-[#334155] rounded-lg space-y-1.5">
                        <span className="font-bold text-sky-400 flex items-center gap-1">
                          <Layers className="w-3.5 h-3.5" />
                          قطع الغيار والمستهلكات
                        </span>
                        {plan.requiredSpareParts && plan.requiredSpareParts.length > 0 ? (
                          <ul className="list-disc list-inside text-slate-300 space-y-0.5 text-[11px]">
                            {plan.requiredSpareParts.map((p, i) => (
                              <li key={i}>{p}</li>
                            ))}
                          </ul>
                        ) : (
                          <p className="text-slate-500 text-[11px]">فحص ومعايرة فقط بدون استبدال قطع</p>
                        )}
                      </div>

                      {/* Critical Points */}
                      <div className="p-3 bg-[#1e293b] border border-[#334155] rounded-lg space-y-1.5">
                        <span className="font-bold text-red-400 flex items-center gap-1">
                          <AlertTriangle className="w-3.5 h-3.5" />
                          النقاط الحرجة ومسببات التوقف
                        </span>
                        <p className="text-slate-300 text-[11px]">
                          {plan.criticalPoints || 'اتباع معايير الصيانة والتشغيل الدورية'}
                        </p>
                      </div>
                    </div>

                    {/* Execution History */}
                    {plan.history && plan.history.length > 0 && (
                      <div className="pt-2 border-t border-[#334155] space-y-2">
                        <span className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
                          <History className="w-4 h-4 text-emerald-400" />
                          سجل التنفيذ السابق ({plan.history.length}):
                        </span>
                        <div className="space-y-1.5">
                          {plan.history.slice(0, 3).map((h, i) => (
                            <div
                              key={i}
                              className="p-2 rounded bg-[#1e293b] border border-[#334155] flex items-center justify-between text-xs text-slate-300"
                            >
                              <div className="flex items-center gap-2">
                                <span className="font-mono text-[11px] text-slate-400">{h.completedAt}</span>
                                <span>بواسطة: <strong>{h.completedBy}</strong></span>
                                <span className="text-slate-500">({h.durationMinutes} دقيقة)</span>
                              </div>
                              <div>
                                {h.passed ? (
                                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                                    مطابق وسليم
                                  </span>
                                ) : (
                                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-red-500/10 text-red-400 border border-red-500/20">
                                    غير مطابق / ملاحظات
                                  </span>
                                )}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>

      {/* Modals */}
      <CreatePMPlanModal />
      <EditPMPlanModal />
      <ExecutePMModal />
    </div>
  );
};
