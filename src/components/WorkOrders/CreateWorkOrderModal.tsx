import React, { useState, useEffect } from 'react';
import { 
  X, 
  ShieldAlert, 
  Wrench, 
  Cpu, 
  Clock, 
  UserCheck, 
  AlertCircle,
  CheckCircle2,
  Zap,
  Sparkles
} from 'lucide-react';
import { useCMMS } from '../../context/CMMSContext';
import { WorkOrderType, WorkOrderPriority, TechnicianSpecialty } from '../../types';

export const CreateWorkOrderModal: React.FC = () => {
  const { 
    isCreateWOOpen, 
    setIsCreateWOOpen, 
    preselectedAssetForWO, 
    setPreselectedAssetForWO,
    assets,
    createWorkOrder,
    currentUser
  } = useCMMS();

  const [selectedAssetId, setSelectedAssetId] = useState<string>('');
  const [type, setType] = useState<WorkOrderType>('EMERGENCY_BREAKDOWN');
  const [priority, setPriority] = useState<WorkOrderPriority>('CRITICAL_STOPPAGE');
  const [title, setTitle] = useState<string>('');
  const [description, setDescription] = useState<string>('');
  const [reportedBy, setReportedBy] = useState<string>(
    currentUser ? `${currentUser.fullName} (${currentUser.roleTitle})` : 'مشغل خط الإنتاج - وردية أولى'
  );
  const [assignedTo, setAssignedTo] = useState<string>('فني ميكانيك أول - أحمد سالم');
  const [specialty, setSpecialty] = useState<TechnicianSpecialty>('MECHANICAL');
  const [downtimeMinutes, setDowntimeMinutes] = useState<number>(60);

  useEffect(() => {
    if (currentUser) {
      setReportedBy(`${currentUser.fullName} (${currentUser.roleTitle})`);
    }
  }, [currentUser]);

  useEffect(() => {
    if (preselectedAssetForWO) {
      setSelectedAssetId(preselectedAssetForWO.id);
      setTitle(`بلاغ عطل طارئ وتوقف خط: ${preselectedAssetForWO.name}`);
      setType('EMERGENCY_BREAKDOWN');
      setPriority('CRITICAL_STOPPAGE');
    } else if (assets.length > 0 && !selectedAssetId) {
      setSelectedAssetId(assets[0].id);
    }
  }, [preselectedAssetForWO, assets]);

  if (!isCreateWOOpen) return null;

  const currentSelectedAsset = assets.find((a) => a.id === selectedAssetId) || assets[0];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedAssetId || !title.trim() || !description.trim()) return;

    createWorkOrder({
      title,
      assetId: currentSelectedAsset.id,
      assetName: currentSelectedAsset.name,
      hangarId: currentSelectedAsset.hangarId,
      type,
      priority,
      status: priority === 'CRITICAL_STOPPAGE' ? 'IN_PROGRESS' : 'APPROVED',
      reportedBy,
      assignedTo,
      technicianSpecialty: specialty,
      description,
      downtimeMinutes: Number(downtimeMinutes) || 0,
      approvedBy: 'مدير الصيانة م. علي رضا',
    });

    // Reset & Close
    setIsCreateWOOpen(false);
    setPreselectedAssetForWO(null);
    setTitle('');
    setDescription('');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm overflow-y-auto no-print">
      <div className="relative w-full max-w-xl bg-[#1e293b] border border-[#334155] rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 my-6">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#334155] bg-[#0f172a]">
          <div className="flex items-center gap-3">
            <span className="p-2 rounded-lg bg-red-500/20 text-red-400 border border-red-500/40 animate-pulse">
              <ShieldAlert className="w-5 h-5" />
            </span>
            <div>
              <h2 className="text-base font-bold text-white">إصدار أمر عمل جديد / بلاغ عطل</h2>
              <p className="text-xs text-slate-400">معمل المرجان للمطبوعات — قسم إدارة الصيانة</p>
            </div>
          </div>
          <button
            onClick={() => {
              setIsCreateWOOpen(false);
              setPreselectedAssetForWO(null);
            }}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-[#334155]/40 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 text-xs">
          {/* Machine Selection */}
          <div className="space-y-1.5">
            <label className="font-bold text-slate-300 block">
              اختيار الماكينة أو الأصل المتأثر (43 أصل صناعي) <span className="text-red-400">*</span>
            </label>
            <select
              value={selectedAssetId}
              onChange={(e) => {
                setSelectedAssetId(e.target.value);
                const a = assets.find((item) => item.id === e.target.value);
                if (a && !title) {
                  setTitle(`بلاغ عطل على ${a.id}: ${a.name}`);
                }
              }}
              className="w-full bg-[#0f172a] border border-[#334155] rounded-lg px-3 py-2.5 text-slate-100 font-sans focus:outline-none focus:border-blue-500 transition-colors"
              required
            >
              {assets.map((asset) => (
                <option key={asset.id} value={asset.id}>
                  [{asset.id}] {asset.name} — {asset.hangarName} ({asset.status})
                </option>
              ))}
            </select>
          </div>

          {/* Quick info about selected asset */}
          {currentSelectedAsset && (
            <div className="p-3 rounded-lg bg-[#0f172a] border border-[#334155] flex items-center justify-between text-[11px]">
              <div>
                <span className="text-slate-400">الموقع: </span>
                <span className="text-slate-200 font-semibold">{currentSelectedAsset.hangarName}</span>
              </div>
              <div>
                <span className="text-slate-400">درجة الأهمية: </span>
                <span className={`font-bold ${currentSelectedAsset.criticality === 'CRITICAL' ? 'text-red-400' : 'text-yellow-400'}`}>
                  {currentSelectedAsset.criticality}
                </span>
              </div>
              <div>
                <span className="text-slate-400">الحالة الراهنة: </span>
                <span className="text-blue-400 font-mono font-bold">{currentSelectedAsset.status}</span>
              </div>
            </div>
          )}

          {/* Type & Priority in 2 Columns */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="font-bold text-slate-300 block">
                نوع أمر العمل (Type) <span className="text-red-400">*</span>
              </label>
              <select
                value={type}
                onChange={(e) => setType(e.target.value as WorkOrderType)}
                className="w-full bg-[#0f172a] border border-[#334155] rounded-lg px-3 py-2 text-slate-100 focus:outline-none focus:border-blue-500"
              >
                <option value="EMERGENCY_BREAKDOWN">توقف طارئ (EMERGENCY BREAKDOWN)</option>
                <option value="PREVENTIVE">صيانة وقائية دورية (PREVENTIVE)</option>
                <option value="CORRECTIVE">إجراء تصحيحي وعلاجي (CORRECTIVE)</option>
                <option value="INSPECTION">فحص فني ومعايرة (INSPECTION)</option>
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="font-bold text-slate-300 block">
                مستوى الأولوية (Priority) <span className="text-red-400">*</span>
              </label>
              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value as WorkOrderPriority)}
                className="w-full bg-[#0f172a] border border-[#334155] rounded-lg px-3 py-2 text-slate-100 focus:outline-none focus:border-blue-500"
              >
                <option value="CRITICAL_STOPPAGE">توقف خط الإنتاج (CRITICAL STOPPAGE)</option>
                <option value="HIGH">عالية - مؤثر على الجودة أو السرعة (HIGH)</option>
                <option value="MEDIUM">متوسطة - يمكن جدولتها (MEDIUM)</option>
                <option value="LOW">منخفضة - روتينية (LOW)</option>
              </select>
            </div>
          </div>

          {/* Title */}
          <div className="space-y-1.5">
            <label className="font-bold text-slate-300 block">
              عنوان البلاغ أو العطل <span className="text-red-400">*</span>
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="مثال: اهتزاز في رول الكبس أو تسريب حبر في الغرفة المغلقة"
              className="w-full bg-[#0f172a] border border-[#334155] rounded-lg px-3 py-2 text-slate-100 focus:outline-none focus:border-blue-500"
              required
            />
          </div>

          {/* Description */}
          <div className="space-y-1.5">
            <label className="font-bold text-slate-300 block">
              تفاصيل الأعراض والملاحظات الفنية <span className="text-red-400">*</span>
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
              placeholder="صف بدقة ما لاحظه المشغل أو الفني، الضغوط، الأصوات، أو الإنذارات على شاشة التحكم..."
              className="w-full bg-[#0f172a] border border-[#334155] rounded-lg px-3 py-2 text-slate-100 focus:outline-none focus:border-blue-500 resize-none"
              required
            />
          </div>

          {/* Assigned Technician & Specialty */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="font-bold text-slate-300 block">الفني أو المهندس المكلف</label>
              <select
                value={assignedTo}
                onChange={(e) => setAssignedTo(e.target.value)}
                className="w-full bg-[#0f172a] border border-[#334155] rounded-lg px-3 py-2 text-slate-100 focus:outline-none focus:border-blue-500"
              >
                <option value="فني ميكانيك أول - أحمد سالم">فني ميكانيك أول - أحمد سالم</option>
                <option value="مهندس الميكانيك - كريم السعدي">مهندس الميكانيك - كريم السعدي</option>
                <option value="مهندس كهرباء رئيسي - زياد طارق">مهندس كهرباء رئيسي - زياد طارق</option>
                <option value="فني أتمتة وسيطرة - حسن الموسوي">فني أتمتة وسيطرة - حسن الموسوي</option>
                <option value="فني مرافق وضواغط - محمود الجبوري">فني مرافق وضواغط - محمود الجبوري</option>
                <option value="مهندس المرافق والبويلر - مروان العاني">مهندس المرافق والبويلر - مروان العاني</option>
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="font-bold text-slate-300 block">التخصص الفني</label>
              <select
                value={specialty}
                onChange={(e) => setSpecialty(e.target.value as TechnicianSpecialty)}
                className="w-full bg-[#0f172a] border border-[#334155] rounded-lg px-3 py-2 text-slate-100 focus:outline-none focus:border-blue-500"
              >
                <option value="MECHANICAL">ميكانيكي وهيدروليك (MECHANICAL)</option>
                <option value="ELECTRICAL">كهرباء وتغذية وطاقة (ELECTRICAL)</option>
                <option value="AUTOMATION">أتمتة وحساسات وبرمجة PLC (AUTOMATION)</option>
                <option value="UTILITIES">مرافق مركزية وهواء وتبريد (UTILITIES)</option>
              </select>
            </div>
          </div>

          {/* Downtime & Reported By */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="font-bold text-slate-300 block">المبلغ عن العطل</label>
              <input
                type="text"
                value={reportedBy}
                onChange={(e) => setReportedBy(e.target.value)}
                className="w-full bg-[#0f172a] border border-[#334155] rounded-lg px-3 py-2 text-slate-100 focus:outline-none focus:border-blue-500"
              />
            </div>

            <div className="space-y-1.5">
              <label className="font-bold text-slate-300 block">
                زمن التوقف المقدر (بالدقائق)
              </label>
              <input
                type="number"
                value={downtimeMinutes}
                onChange={(e) => setDowntimeMinutes(Math.max(0, parseInt(e.target.value) || 0))}
                min="0"
                step="5"
                className="w-full bg-[#0f172a] border border-[#334155] rounded-lg px-3 py-2 text-slate-100 font-mono focus:outline-none focus:border-blue-500"
              />
            </div>
          </div>

          {/* Approval Notice */}
          <div className="p-3 rounded-lg bg-blue-600/10 border border-blue-500/30 text-blue-300 text-[11px] flex items-center justify-between">
            <div className="flex items-center gap-2">
              <UserCheck className="w-4 h-4" />
              <span>الاعتماد الفوري بموجب صلاحيات مدير الصيانة:</span>
            </div>
            <span className="font-bold text-white">م. علي رضا</span>
          </div>

          {/* Submit Buttons */}
          <div className="flex items-center justify-end gap-3 pt-3 border-t border-[#334155]">
            <button
              type="button"
              onClick={() => {
                setIsCreateWOOpen(false);
                setPreselectedAssetForWO(null);
              }}
              className="px-4 py-2 rounded-lg bg-[#0f172a] hover:bg-[#334155] text-slate-300 border border-[#334155] transition-colors"
            >
              إلغاء
            </button>
            <button
              type="submit"
              className="flex items-center gap-2 px-5 py-2.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-bold shadow-lg shadow-blue-600/20 transition-all active:scale-95"
            >
              <Wrench className="w-4 h-4" />
              <span>إصدار أمر العمل رسمياً</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
