export type AssetStatus = 'OPERATIONAL' | 'UNDER_MAINTENANCE' | 'STOPPED' | 'STANDBY';

export type Criticality = 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW';

export type HangarId = 
  | 'HALL-ROTO' 
  | 'HALL-FLX' 
  | 'HALL-PE' 
  | 'HALL-BAG' 
  | 'HALL-CYL' 
  | 'HALL-NW' 
  | 'HALL-COAT'
  | 'HALL-TCP'
  | 'HALL-TCC'
  | string;

export type AssetCategory = 
  | 'PRINTING' 
  | 'EXTRUSION' 
  | 'BAG_MAKING' 
  | 'CYLINDER'
  | 'NARROW_WEB'
  | 'COATING'
  | 'TIN_CAN_PRINT'
  | 'TIN_CAN_CUTTER'
  | 'UTILITIES' 
  | 'POWER' 
  | 'ELECTRICAL_UPS'
  | string;

export interface Asset {
  id: string; // e.g. 'ROTO-01', 'FLX-01', 'UPS-ROTO', 'CMP-01'
  name: string;
  nameEn: string;
  hangarId: HangarId;
  hangarName: string;
  category: AssetCategory;
  manufacturer: string;
  model: string;
  specifications: string;
  serialNumber: string;
  criticality: Criticality;
  status: AssetStatus;
  runningHours: number;
  installYear: number;
  lastMaintenanceDate: string;
  nextMaintenanceDate: string;
  associatedUpsId?: string;
  associatedUpsName?: string;
  voltage?: string;
  powerRating?: string;
  loadPercentage?: number;
  downtimeThisMonthMinutes: number;
}

export interface HangarInfo {
  id: HangarId;
  code: string;
  name: string;
  nameEn: string;
  description: string;
  dedicatedUpsId?: string;
  dedicatedUpsName?: string;
  totalAssets: number;
  supervisor?: string;
  iconType: 'printer' | 'film' | 'package' | 'gauge' | 'zap' | 'wind' | 'layers' | 'tool' | 'flame';
}

export type WorkOrderStatus = 
  | 'REQUESTED' 
  | 'APPROVED' 
  | 'IN_PROGRESS' 
  | 'PENDING_PARTS' 
  | 'COMPLETED' 
  | 'CLOSED';

export type WorkOrderType = 
  | 'EMERGENCY_BREAKDOWN' 
  | 'PREVENTIVE' 
  | 'CORRECTIVE' 
  | 'INSPECTION';

export type WorkOrderPriority = 
  | 'CRITICAL_STOPPAGE' 
  | 'HIGH' 
  | 'MEDIUM' 
  | 'LOW';

export type TechnicianSpecialty = 
  | 'MECHANICAL' 
  | 'ELECTRICAL' 
  | 'AUTOMATION' 
  | 'UTILITIES';

export interface ConsumedPart {
  partId: string;
  partName: string;
  partNumber: string;
  quantity: number;
  unitCost: number;
  unit?: string;
}

export interface WorkOrder {
  id: string; // e.g. 'WO-2026-0002'
  title: string;
  assetId: string;
  assetName: string;
  hangarId: HangarId;
  type: WorkOrderType;
  priority: WorkOrderPriority;
  status: WorkOrderStatus;
  reportedBy: string;
  reportedAt: string;
  assignedTo: string;
  technicianSpecialty: TechnicianSpecialty;
  description: string;
  rootCause?: string;
  actionTaken?: string;
  consumedParts: ConsumedPart[];
  downtimeMinutes: number;
  completedAt?: string;
  approvedBy?: string;
  notes?: string;
}

export type SparePartCriticality = 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW';
export type SparePartCondition = 'NEW' | 'REFURBISHED' | 'USABLE';

export interface StockMovementLog {
  id: string;
  timestamp: string;
  type: 'IN' | 'OUT' | 'ADJUSTMENT';
  quantity: number;
  balanceAfter: number;
  reason?: string;
  referenceNumber?: string; // e.g. PO number, WO number, or supplier receipt
  performedBy?: string;
}

export interface SparePart {
  id: string;
  partNumber: string;
  name: string;
  nameEn?: string;
  category: string;
  quantity: number;
  minThreshold: number;
  maxThreshold?: number;
  reorderQuantity?: number;
  unit: string;
  unitCost: number;
  currency?: string;
  binLocation: string;
  warehouseSection?: string;
  supplier?: string;
  supplierName?: string;
  supplierContact?: string;
  supplierPhone?: string;
  supplierEmail?: string;
  compatibleMachines: string[];
  compatibleHangarId?: string;
  lastRestockedDate: string;

  // Professional CMMS Technical Attributes
  oemBrand?: string;           // e.g. SKF, Festo, Bobst, W&H, Gates, Schneider
  oemPartNumber?: string;      // e.g. 6205-2RSH/C3, VUVS-LK25-M52-AA-G14-1C1
  specifications?: string;     // Technical specs, dimensions, material, pressure rating
  criticality?: SparePartCriticality; // حرجية القطعة لخط الإنتاج
  condition?: SparePartCondition;     // حالة القطعة: جديدة، مجددة، صالحة
  leadTimeDays?: number;       // زمن التوريد بالأيام
  storageConditions?: string;  // شروط الحفظ والتخزين والحرارة
  barcode?: string;            // باركود / كود التتبع
  notes?: string;              // ملاحظات وتعليمات التركيب الفنية
  movementHistory?: StockMovementLog[];
}

export interface MeterReading {
  id: string;
  timestamp: string;
  date: string;
  time: string;
  shift: 'صباحي (07:00 - 15:00)' | 'مسائي (15:00 - 23:00)' | 'ليلي (23:00 - 07:00)';
  loggedBy: string;
  airPressureBar: number; // Target: 8.5 Bar (Range: 8.0 - 9.0)
  chillerTempC: number;   // Target: 8.0 °C (Range: 6.0 - 11.0)
  boilerTempC: number;    // Target: 250.0 °C (Range: 230 - 275)
  powerFrequencyHz: number; // Target: 50.0 Hz (Range: 49.5 - 50.5)
  runningHoursSample: number;
  status: 'NORMAL' | 'WARNING' | 'CRITICAL';
  notes?: string;
}

// -------------------------------------------------------------
// NEW: DEDICATED METERS & INSTRUMENTATION ARCHITECTURE
// -------------------------------------------------------------
export type MeterDeviceCategory = 
  | 'AIR_COMPRESSOR'     // ضواغط الهواء
  | 'COMPRESSOR'         // ضواغط الهواء
  | 'CHILLER'            // الجلرات ومبردات المياه
  | 'BOILER'             // البويلرات ومراجل الزيت الحراري والبخار
  | 'POWER_ENERGY'       // محولات ومقاييس الطاقة الكهربائية والـ UPS
  | 'POWER_STATION'      // محطات ومحولات الطاقة
  | 'WATER_TREATMENT'    // محطات معالجة المياه وتحلية RO
  | 'PUMP'               // مضخات السوائل والفاكيوم
  | 'OTHER';             // أجهزة وأدوات قياس أخرى

export interface MeterParameterConfig {
  id: string; // e.g. 'param_air_pres', 'param_oil_temp'
  name: string; // e.g. 'ضغط الهواء الخارج'
  nameEn?: string;
  unit: string; // e.g. 'Bar', '°C', 'Hz', 'kW', 'm³/h', 'A', 'ppm', 'Hours'
  targetValue?: number;
  minThreshold?: number; // Minimum acceptable
  maxThreshold?: number; // Maximum acceptable
  criticalMax?: number;  // Immediate critical alarm threshold
  defaultValue?: number;
}

export interface MeterDevice {
  id: string; // e.g. 'DEV-CMP-01'
  code: string; // e.g. 'CMP-01'
  name: string; // e.g. 'ضاغط هواء Atlas Copco GA 90 VSD+ #1'
  nameEn: string;
  category: MeterDeviceCategory;
  hangarId?: HangarId;
  locationName: string; // e.g. 'محطة الضواغط المركزية - مبنى الخدمات'
  location?: string;
  model: string;
  manufacturer: string;
  serialNumber?: string;
  installYear?: number;
  status: 'OPERATIONAL' | 'WARNING' | 'MAINTENANCE' | 'OFFLINE';
  readingFrequency: 'لكل وردية (Shift)' | 'يومي (Daily)' | 'أسبوعي (Weekly)' | 'مستمر (Continuous)';
  parameters: MeterParameterConfig[];
  lastReadingDate?: string;
  lastReadingValues?: Record<string, number>;
  notes?: string;
}

export interface DeviceReadingLog {
  id: string;
  deviceId: string;
  deviceName: string;
  deviceCategory: MeterDeviceCategory;
  timestamp: string;
  date: string;
  time: string;
  shift: 'صباحي (07:00 - 15:00)' | 'مسائي (15:00 - 23:00)' | 'ليلي (23:00 - 07:00)';
  loggedBy: string;
  values: Record<string, number>; // parameter id -> recorded numeric value
  status: 'NORMAL' | 'WARNING' | 'CRITICAL';
  notes?: string;
}

// -------------------------------------------------------------
// NEW: PROFESSIONAL RE-ENGINEERED PREVENTIVE MAINTENANCE ARCHITECTURE
// -------------------------------------------------------------
export type PMFrequency = 
  | 'DAILY'          // يومي
  | 'WEEKLY'         // أسبوعي
  | 'BIWEEKLY'       // كل أسبوعين
  | 'MONTHLY'        // شهري
  | 'QUARTERLY'      // ربع سنوي (كل 3 أشهر)
  | 'SEMI_ANNUAL'    // نصف سنوي (كل 6 أشهر)
  | 'ANNUAL'         // سنوي
  | 'RUNNING_HOURS'; // تكرار حسب ساعات التشغيل

export type PMCategory = 
  | 'MECHANICAL'           // صيانة ميكانيكية
  | 'ELECTRICAL'           // صيانة كهربائية
  | 'AUTOMATION'           // أتمتة وتحكم وبرمجة PLC
  | 'LUBRICATION'          // تزييت وتشحيم
  | 'PNEUMATIC_HYDRAULIC'    // أنظمة هوائية وهيدروليكية
  | 'UTILITIES'            // مرافق وضواغط وتبريد
  | 'SAFETY';              // سلامة وصمامات أمان

export interface PMStep {
  id: string;
  order: number;
  description: string;
  isDone?: boolean;
  notes?: string;
}

export interface PreventiveMaintenancePlan {
  id: string; // e.g. 'PM-2026-001'
  title: string;
  titleEn?: string;
  description?: string;
  priority?: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL_STOPPAGE';
  assetId: string;
  assetName: string;
  hangarId: HangarId;
  hangarName: string;
  category: PMCategory;
  frequency: PMFrequency;
  frequencyCustomText?: string; // e.g. 'كل 500 ساعة تشغيل'
  estimatedDurationMinutes: number; // e.g. 45 min
  requiresMachineStop: boolean;
  assignedTechnician: string;
  technicianSpecialty: 'MECHANICAL' | 'ELECTRICAL' | 'AUTOMATION' | 'UTILITIES';
  safetyRequirements: string[]; // e.g. ['LOTO قفل وعزل الطاقة', 'نظارات حماية', 'قفازات عازلة']
  requiredSpareParts: string[]; // e.g. ['فلتر زيت هوائي', 'زيت شل كورينا 46']
  steps: PMStep[];
  procedureNotes: string;
  criticalPoints: string;
  
  // Status & Timing
  status: 'SCHEDULED' | 'IN_PROGRESS' | 'COMPLETED' | 'OVERDUE';
  lastCompletedDate?: string;
  nextDueDate: string; // YYYY-MM-DD
  reminderDaysBefore: number; // e.g. 1, 2, 3, 7 days before
  
  // Historical Log of executions
  history?: {
    id: string;
    completedAt: string;
    completedBy: string;
    durationMinutes: number;
    passed: boolean;
    notes?: string;
    workOrderIdCreated?: string;
  }[];
}

export interface PMChecklistItem {
  id: string;
  assetId: string;
  assetName: string;
  hangarId: HangarId;
  title: string;
  frequency: 'يومي' | 'أسبوعي' | 'شهري' | 'نصف سنوي (1000 ساعة)';
  category: 'ميكانيكي' | 'كهربائي' | 'مرافق' | 'هيدروليك وهوائيات' | 'أتمتة';
  status: 'PASSED' | 'PENDING' | 'FAILED' | 'OVERDUE';
  lastCheckedDate: string;
  nextDueDate: string;
  checkedBy?: string;
  procedure: string;
  criticalPoints: string;
}

export interface PlantKPIs {
  totalAssets: number;
  operationalAssets: number;
  underMaintenanceAssets: number;
  stoppedAssets: number;
  standbyAssets: number;
  availabilityRate: number; // %
  mttrHours: number; // Mean Time to Repair
  mtbfHours: number; // Mean Time Between Failures
  activeWorkOrders: number;
  emergencyStoppages: number;
  lowStockItemsCount: number;
  totalDowntimeMinutesToday: number;
}

// -------------------------------------------------------------
// USER ACCOUNTS & GRANULAR PERMISSIONS ARCHITECTURE
// -------------------------------------------------------------
export type TabType = 
  | 'dashboard' 
  | 'assets' 
  | 'work-orders' 
  | 'meters' 
  | 'preventive' 
  | 'warehouse' 
  | 'shift-report' 
  | 'reports' 
  | 'developer-hub';

export type UserRole = 
  | 'DEVELOPER'             // مطور النظام ومدير الصيانة العام (Super Developer)
  | 'MAINTENANCE_DIRECTOR'  // مدير الصيانة والشؤون الهندسية
  | 'MAINTENANCE_MANAGER'   // مدير إدارة الصيانة
  | 'SHIFT_SUPERVISOR'      // مهندس ومسؤول الوردية
  | 'MAINTENANCE_ENGINEER'  // مهندس صيانة عام
  | 'TECHNICIAN'            // فني صيانة (ميكانيك / كهرباء / تحكم)
  | 'WAREHOUSE_KEEPER'      // أمين مستودع قطع الغيار والمهمات
  | 'STOREKEEPER'           // أمين مستودع
  | 'OPERATOR'              // مشغل خط إنتاج
  | 'OPERATOR_VIEWER'       // مشغل خط إنتاج / مراقب جودة (صلاحية عرض وطلب)
  | 'AUDITOR';              // مراقب وتدقيق جودة

export interface UserPermissions {
  // 1. Visibility Permissions (ماذا يرى في النظام)
  canViewDashboard: boolean;
  canViewAssets: boolean;
  canViewWorkOrders: boolean;
  canViewMeters: boolean;
  canViewPreventive: boolean;
  canViewWarehouse: boolean;
  canViewShiftReport: boolean;
  canViewReports: boolean;
  canViewDeveloperHub: boolean;

  // 2. Modification & Action Permissions (ماذا يغير في النظام)
  canManageAssets: boolean;      // إضافة وتعديل وحذف الأصول والقاعات
  canManageWorkOrders: boolean;  // إنشاء وتعديل وحذف وتغيير حالات أوامر العمل
  canManageMeters: boolean;      // إضافة وتعديل وحذف العدادات وتسجيل القراءات
  canManagePreventive: boolean;  // إنشاء وتعديل وحذف خطط الصيانة الوقائية واعتمادها
  canManageWarehouse: boolean;   // إضافة وتعديل وحذف قطع الغيار، وإجراء أذونات الصرف والتوريد
  canManageShifts: boolean;      // إنشاء وتعديل سجلات الوردية وتوقيع الاستلام والتسليم
  canManageUsers: boolean;       // إنشاء وتعديل الحسابات وتوزيع الصلاحيات (محصورة بالمطور)
}

export interface UserAccount {
  id: string;
  username: string;
  fullName: string;
  fullNameEn?: string;
  role: UserRole;
  roleTitle: string; // e.g. 'مطور النظام ومدير إدارة الصيانة'
  department: string; // e.g. 'إدارة الشؤون الهندسية والصيانة'
  phone?: string;
  email?: string;
  avatarInitials: string;
  isActive: boolean;
  isSuperDeveloper?: boolean; // Protected account (م. علي رضا)
  pinCode?: string;
  password?: string;
  permissions: UserPermissions;
  createdAt: string;
  lastLogin?: string;
  notes?: string;
}

// -------------------------------------------------------------
// COMPREHENSIVE SHIFT HANDOVER & LOG ARCHITECTURE
// -------------------------------------------------------------
export type ShiftPeriod = 'MORNING' | 'EVENING' | 'NIGHT';
export type ShiftType = ShiftPeriod;
export type ShiftStatus = 'ACTIVE' | 'IN_PROGRESS' | 'HANDED_OVER' | 'APPROVED';

export interface ShiftHallStatus {
  hallId: string;
  hallName: string;
  status: 'OPERATIONAL' | 'WARNING' | 'STOPPED';
  downtimeMinutes: number;
  notes?: string;
}

export interface ShiftWorkOrderSummary {
  woId: string;
  woNumber: string;
  assetName: string;
  title: string;
  type: WorkOrderType;
  priority: WorkOrderPriority;
  status: WorkOrderStatus;
  assignedTechnician: string;
  timeSpentMinutes: number;
  actionTaken?: string;
}

export interface ShiftSparePartConsumed {
  partId: string;
  partNumber: string;
  partName: string;
  quantity: number;
  unit: string;
  unitCost: number;
  totalCost: number;
  machineName: string;
  referenceWoId?: string;
}

export interface LinkedMeterReading {
  deviceId: string;
  deviceCode?: string;
  deviceName: string;
  parameterId?: string;
  parameterName: string;
  value: number;
  unit: string;
  status: 'NORMAL' | 'WARNING' | 'CRITICAL';
  locationName?: string;
  timestamp?: string;
  recordedAt?: string;
  notes?: string;
}

export interface CustomEnvironmentalParam {
  id: string;
  name: string;
  value: number;
  unit: string;
  targetRange?: string;
  status: 'NORMAL' | 'WARNING' | 'CRITICAL';
  notes?: string;
  category?: 'ENVIRONMENTAL' | 'UTILITY' | 'AIR_QUALITY' | 'THERMAL' | 'ACOUSTIC' | 'PRESSURE';
}

export interface ShiftUtilityReading {
  parameterName: string;
  readingValue: number;
  unit: string;
  status: 'NORMAL' | 'WARNING' | 'CRITICAL';
  location: string;
}

export interface ShiftLog {
  id: string;
  date: string; // YYYY-MM-DD
  shiftType: ShiftPeriod;
  shiftName: string; // e.g. 'الوردية الأولى (الصباحية)'
  shiftHours?: string; // e.g. '07:00 - 15:00'
  supervisorId?: string;
  supervisorName?: string;
  technicians?: string[];
  productionSupervisor?: string;
  status: ShiftStatus;

  // Additional convenience / backwards-compat properties
  shiftEngineer?: string;
  supervisingTechnicians?: string[];
  handoverNotes?: string;
  safetyIncidents?: number;
  totalStoppageMinutes?: number;
  utilitiesSummary?: {
    airPressureBar: number;
    chillerTempC: number;
    boilerTempC: number;
    powerFrequencyHz: number;
  };
  lineEquipmentStatus?: Array<{ lineName: string; status: string; notes?: string }>;
  workOrdersExecuted?: any[];
  sparePartsUsed?: any[];

  // Live Hall statuses
  hallStatuses?: ShiftHallStatus[];

  // Work orders handled
  workOrdersHandled?: ShiftWorkOrderSummary[];

  // Utilities snapshot
  utilitiesReadings?: ShiftUtilityReading[];

  // Spare parts consumed
  partsConsumed?: ShiftSparePartConsumed[];

  // Operational & Safety Logs
  safetyNotes?: string;
  environmentalNotes?: string;
  generalObservations?: string;
  pendingForNextShift?: string;

  // New Professional Patrol Specifications & Features
  patrolRoute?: string[]; // المسار التفقدي الميداني للدورية (القاعات والقطاعات)
  patrolCoveragePercent?: number; // نسبة تغطية مسار التفتيش (e.g. 100%)
  productionLinesInspected?: string[]; // خطوط الإنتاج والطباعة المفحوصة
  patrolChecklist?: Array<{
    id: string;
    title: string;
    area: string;
    status: 'PASSED' | 'WARNING' | 'FAILED';
    notes?: string;
    method?: string;
    checkedAt?: string;
  }>;
  environmentalConditions?: {
    ambientTempC?: number;
    humidityPercent?: number;
    solventVaporPpm?: number;
    noiseLevelDb?: number;
  };
  customEnvironmentalParams?: CustomEnvironmentalParam[];
  linkedMeterReadings?: LinkedMeterReading[];
  databaseMetadata?: {
    syncStatus: 'LOCAL_SYNCED' | 'SERVER_SYNCED';
    version: number;
    lastModified: string;
    serverTable?: string;
  };
  criticalEvents?: Array<{
    id: string;
    time: string;
    event: string;
    actionTaken: string;
    severity: 'LOW' | 'MEDIUM' | 'CRITICAL';
  }>;
  responsibleEngineers?: {
    leadEngineer: string; // مهندس الدورية المسؤول
    handoverEngineer: string; // مهندس الاستلام القادم
    safetyOfficer?: string; // مسؤول السلامة والأمن الصناعي
    assignedByDeveloper?: boolean; // تم التعديل بصلاحية المطور
    lastModifiedBy?: string; // اسم المطور الذي قام بالتعديل
    lastModifiedAt?: string;
  };

  // Signatures
  handedOverBy: {
    name: string;
    role: string;
    timestamp: string;
    signed: boolean;
  };
  receivedBy?: {
    name: string;
    role: string;
    timestamp: string;
    signed: boolean;
  };
  approvedByManager?: {
    name: string;
    role: string;
    timestamp: string;
    signed: boolean;
  };
}

export interface DeleteConfirmationDialog {
  isOpen: boolean;
  title: string;
  message: string;
  itemDetails?: string;
  confirmLabel?: string;
  onConfirm: () => void;
}
