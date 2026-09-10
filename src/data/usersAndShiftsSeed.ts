import { UserAccount, ShiftLog } from '../types';

export const INITIAL_USERS: UserAccount[] = [
  {
    id: 'USR-DEV-01',
    username: 'ali.reda',
    fullName: 'م. علي رضا',
    fullNameEn: 'Eng. Ali Reda',
    role: 'DEVELOPER',
    roleTitle: 'مطور النظام ومدير إدارة الصيانة',
    department: 'إدارة الشؤون الهندسية والصيانة العامة',
    phone: '+964 770 123 4567',
    email: 'ali.reda@flexpack-cmms.com',
    avatarInitials: 'AR',
    isActive: true,
    isSuperDeveloper: true,
    pinCode: '1234',
    createdAt: '2026-01-01',
    lastLogin: 'الآن (جلسة نشطة)',
    notes: 'الحساب الرئيسي للمطور ومدير الصيانة - يمتلك كامل الصلاحيات الإدارية والفنية وإدارة المستخدمين',
    permissions: {
      canViewDashboard: true,
      canViewAssets: true,
      canViewWorkOrders: true,
      canViewMeters: true,
      canViewPreventive: true,
      canViewWarehouse: true,
      canViewShiftReport: true,
      canViewReports: true,
      canViewDeveloperHub: true,

      canManageAssets: true,
      canManageWorkOrders: true,
      canManageMeters: true,
      canManagePreventive: true,
      canManageWarehouse: true,
      canManageShifts: true,
      canManageUsers: true,
    }
  },
  {
    id: 'USR-SUP-01',
    username: 'hussam.t',
    fullName: 'م. حسام التميمي',
    fullNameEn: 'Eng. Hussam Al-Tamimi',
    role: 'SHIFT_SUPERVISOR',
    roleTitle: 'مهندس صيانة أول / مسؤول الوردية الأولى',
    department: 'قسم الصيانة الميكانيكية والتشغيل',
    phone: '+964 771 234 5678',
    email: 'hussam.t@flexpack-cmms.com',
    avatarInitials: 'HT',
    isActive: true,
    isSuperDeveloper: false,
    pinCode: '2233',
    createdAt: '2026-01-10',
    lastLogin: '2026-09-08 07:15',
    notes: 'مسؤول عن استلام الوردية وأوامر العمل الميدانية ومتابعة أجهزة القياس',
    permissions: {
      canViewDashboard: true,
      canViewAssets: true,
      canViewWorkOrders: true,
      canViewMeters: true,
      canViewPreventive: true,
      canViewWarehouse: true,
      canViewShiftReport: true,
      canViewReports: true,
      canViewDeveloperHub: false, // لا يرى لوحة المطور

      canManageAssets: false,     // لا يعدل في أصول المصنع
      canManageWorkOrders: true,  // يدير أوامر العمل
      canManageMeters: true,      // يسجل قراءات العدادات
      canManagePreventive: true,  // ينفذ الصيانة الوقائية
      canManageWarehouse: false,  // لا يعدل في المستودع
      canManageShifts: true,      // يسلم ويستلم الوردية
      canManageUsers: false,      // لا يدير الحسابات
    }
  },
  {
    id: 'USR-ENG-02',
    username: 'karim.s',
    fullName: 'م. كريم السعدي',
    fullNameEn: 'Eng. Karim Al-Saadi',
    role: 'MAINTENANCE_ENGINEER',
    roleTitle: 'مهندس كهرباء وأتمتة صناعية PLC',
    department: 'قسم الصيانة الكهربائية والتحكم الآلي',
    phone: '+964 772 345 6789',
    email: 'karim.s@flexpack-cmms.com',
    avatarInitials: 'KS',
    isActive: true,
    isSuperDeveloper: false,
    pinCode: '3344',
    createdAt: '2026-01-15',
    lastLogin: '2026-09-08 06:45',
    notes: 'مختص ببرمجة شنايدر وسيمنز ومحطة الـ UPS ومولدات الطاقة',
    permissions: {
      canViewDashboard: true,
      canViewAssets: true,
      canViewWorkOrders: true,
      canViewMeters: true,
      canViewPreventive: true,
      canViewWarehouse: true,
      canViewShiftReport: true,
      canViewReports: true,
      canViewDeveloperHub: false,

      canManageAssets: false,
      canManageWorkOrders: true,
      canManageMeters: true,
      canManagePreventive: true,
      canManageWarehouse: false,
      canManageShifts: true,
      canManageUsers: false,
    }
  },
  {
    id: 'USR-STR-01',
    username: 'fouad.store',
    fullName: 'فؤاد عبد الأمير',
    fullNameEn: 'Fouad Abdul-Ameer',
    role: 'WAREHOUSE_KEEPER',
    roleTitle: 'أمين مستودع قطع الغيار والمهمات الهندسية',
    department: 'إدارة المستودعات وسلاسل الإمداد',
    phone: '+964 773 456 7890',
    email: 'fouad.store@flexpack-cmms.com',
    avatarInitials: 'FA',
    isActive: true,
    isSuperDeveloper: false,
    pinCode: '4455',
    createdAt: '2026-02-01',
    lastLogin: '2026-09-08 08:00',
    notes: 'المسؤول الحصري عن أذونات التوريد والصرف والجرد الفعلي للأصناف',
    permissions: {
      canViewDashboard: true,
      canViewAssets: true,
      canViewWorkOrders: true,
      canViewMeters: false,
      canViewPreventive: false,
      canViewWarehouse: true,
      canViewShiftReport: true,
      canViewReports: true,
      canViewDeveloperHub: false,

      canManageAssets: false,
      canManageWorkOrders: false,
      canManageMeters: false,
      canManagePreventive: false,
      canManageWarehouse: true,  // يمتلك صلاحية إدارة المستودع والتوريد والصرف
      canManageShifts: false,
      canManageUsers: false,
    }
  },
  {
    id: 'USR-TECH-01',
    username: 'samer.mech',
    fullName: 'سامر الكعبي',
    fullNameEn: 'Samer Al-Kaabi',
    role: 'TECHNICIAN',
    roleTitle: 'فني صيانة ميكانيكية وهيدروليك',
    department: 'ورشة الصيانة الميكانيكية الميدانية',
    phone: '+964 774 567 8901',
    email: 'samer.k@flexpack-cmms.com',
    avatarInitials: 'SK',
    isActive: true,
    isSuperDeveloper: false,
    pinCode: '5566',
    createdAt: '2026-02-15',
    lastLogin: '2026-09-08 07:30',
    notes: 'فني صيانة لتنفيذ أوامر العمل الميكانيكية وخطط التزييت والتشحيم',
    permissions: {
      canViewDashboard: true,
      canViewAssets: true,
      canViewWorkOrders: true,
      canViewMeters: true,
      canViewPreventive: true,
      canViewWarehouse: true,  // للاطلاع على توافر القطع
      canViewShiftReport: true,
      canViewReports: false,
      canViewDeveloperHub: false,

      canManageAssets: false,
      canManageWorkOrders: true, // يمكنه تحديث حالة الأعمال المكلف بها
      canManageMeters: true,     // يسجل قراءات
      canManagePreventive: true, // ينفذ الصيانة
      canManageWarehouse: false, // لا يصرف بدون إذن
      canManageShifts: false,
      canManageUsers: false,
    }
  },
  {
    id: 'USR-OPS-01',
    username: 'marwan.ops',
    fullName: 'مروان الخالدي',
    fullNameEn: 'Marwan Al-Khalidi',
    role: 'OPERATOR_VIEWER',
    roleTitle: 'مشغل رئيسي / مراقب خطوط الإنتاج',
    department: 'إدارة العمليات وتشغيل خطوط الروتو والفليكسو',
    phone: '+964 775 678 9012',
    email: 'marwan.ops@flexpack-cmms.com',
    avatarInitials: 'MK',
    isActive: true,
    isSuperDeveloper: false,
    pinCode: '6677',
    createdAt: '2026-03-01',
    lastLogin: '2026-09-08 07:05',
    notes: 'صلاحية عرض وطلب بلاغات الصيانة الطارئة ومتابعة حالة الماكينات فقط',
    permissions: {
      canViewDashboard: true,
      canViewAssets: true,
      canViewWorkOrders: true,
      canViewMeters: false,
      canViewPreventive: false,
      canViewWarehouse: false,
      canViewShiftReport: true,
      canViewReports: false,
      canViewDeveloperHub: false,

      canManageAssets: false,
      canManageWorkOrders: true, // مسموح له إنشاء بلاغ عطل
      canManageMeters: false,
      canManagePreventive: false,
      canManageWarehouse: false,
      canManageShifts: false,
      canManageUsers: false,
    }
  }
];

export const INITIAL_SHIFT_LOGS: ShiftLog[] = [
  {
    id: 'SHIFT-2026-09-08-M',
    date: '2026-09-08',
    shiftType: 'MORNING',
    shiftName: 'الدورية الأولى (الصباحية)',
    shiftHours: '07:00 - 15:00',
    supervisorId: 'USR-SUP-01',
    supervisorName: 'م. حسام التميمي',
    shiftEngineer: 'م. حسام التميمي',
    technicians: ['سامر الكعبي (ميكانيك)', 'أحمد المنصوري (كهرباء)', 'علاء حسين (تحكم وتزييت)'],
    supervisingTechnicians: ['سامر الكعبي (ميكانيك)', 'أحمد المنصوري (كهرباء)', 'علاء حسين (تحكم وتزييت)'],
    productionSupervisor: 'عمر القيسي',
    status: 'ACTIVE',
    patrolRoute: [
      'قاعة الروتوغرافور (ROTO)',
      'قاعة الفليكسوغرافيك (FLEXO)',
      'قاعة بثق البولي إيثيلين (PE)',
      'قاعة صناعة وتشكيل الأكياس (BAG)',
      'محطة الطاقة والخدمات المركزية (POWER)'
    ],
    patrolCoveragePercent: 100,
    productionLinesInspected: [
      'Rotomec R960 (8 ألوان)',
      'Cerutti R960 الطباعة العميقة',
      'F&K 20SIX CI الفليكسو المتطورة',
      'Macchi 5-Layers فيلم البثق',
      'Atlas Copco GA 90 VSD+ #1',
      'Daikin Chiller EWAD 250'
    ],
    patrolChecklist: [
      { id: 'CHK-01', title: 'فحص استقرار ضغط خط الهواء الرئيسي والنيتروجين', area: 'محطة الخدمات', status: 'PASSED', notes: 'الضغط 8.5 بار مع كفاءة تامة لمجفف الفريون' },
      { id: 'CHK-02', title: 'مراقبة سحب أبخرة المذيبات والتهوية بقاعة الروتو', area: 'قاعة الروتو', status: 'PASSED', notes: 'مراوح السحب المركزية تعمل بكفاءة تامة 100%' },
      { id: 'CHK-03', title: 'فحص حرارة محامل محركات السحب ودرافيل الطباعة', area: 'قاعة الفليكسو', status: 'PASSED', notes: 'الحرارة ضمن النطاق الآمن 42°C' },
      { id: 'CHK-04', title: 'معاينة جاهزية أزرار الإيقاف الطارئ E-Stops وتطبيق LOTO', area: 'جميع الخطوط', status: 'PASSED', notes: 'تم الفحص الدوري وممرات الطوارئ سالكة' },
      { id: 'CHK-05', title: 'معايرة لزوجة الأحبار وضغط كشط سكين الدكتور بليد', area: 'الروتو والفليكسو', status: 'PASSED', notes: 'تم استبدال شفرة ماكينة F&K بنجاح' }
    ],
    environmentalConditions: {
      ambientTempC: 24.5,
      humidityPercent: 48,
      solventVaporPpm: 12,
      noiseLevelDb: 78
    },
    criticalEvents: [
      {
        id: 'EVT-01',
        time: '11:20',
        event: 'ارتفاع مؤقت في حرارة محرك سحب المحطة 4 بماكينة Cerutti R960',
        actionTaken: 'تم تخفيض الحمل وضبط مروحة التبريد ثم استقرت الحرارة عند 55°C',
        severity: 'MEDIUM'
      }
    ],
    responsibleEngineers: {
      leadEngineer: 'م. حسام التميمي',
      handoverEngineer: 'م. كريم السعدي',
      safetyOfficer: 'م. رافد الشمري',
      assignedByDeveloper: true,
      lastModifiedBy: 'م. علي رضا',
      lastModifiedAt: '2026-09-08 07:15'
    },
    hallStatuses: [
      { hallId: 'HALL-ROTO', hallName: 'قاعة الروتو (ROTO)', status: 'OPERATIONAL', downtimeMinutes: 0, notes: 'خطوط Rotomec وCerutti تعمل بطاقتها التصميمية بكفاءة 98%' },
      { hallId: 'HALL-FLX', hallName: 'قاعة الفليكسو (FLEXO)', status: 'OPERATIONAL', downtimeMinutes: 15, notes: 'تم استبدال شفرة Doctor Blade لماكينة F&K 8 ألوان بنجاح' },
      { hallId: 'HALL-PE', hallName: 'قاعة البولي إيثيلين (PE)', status: 'OPERATIONAL', downtimeMinutes: 0, notes: 'أبراج البثق الثلاثية والخماسية مستقرة مع درجات حرارة مثالية' },
      { hallId: 'HALL-BAG', hallName: 'قاعة صناعة الأكياس (BAG)', status: 'OPERATIONAL', downtimeMinutes: 0, notes: '5 خطوط أكياس لحام قاع وجنب تعمل بشكل متواصل' },
      { hallId: 'HALL-CYL', hallName: 'قاعة تحضير السلندرات (CYL)', status: 'OPERATIONAL', downtimeMinutes: 0, notes: 'ماكينة الحفر الإلكتروميكانيكي منتهية من 6 سلندرات' },
      { hallId: 'HALL-NW', hallName: 'قاعة الشرائط الضيقة (NARROW)', status: 'OPERATIONAL', downtimeMinutes: 0, notes: 'طباعة الليبل واللاصق الذاتي مستمرة' },
      { hallId: 'HALL-COAT', hallName: 'قاعة التبطين والتصفيح (COAT)', status: 'WARNING', downtimeMinutes: 25, notes: 'فحص دوري لسخان الزيت الحراري لوحدة التصفيح الخالي من المذيبات' },
      { hallId: 'HALL-TCP', hallName: 'قاعة طباعة الصفيح (TIN PRINT)', status: 'OPERATIONAL', downtimeMinutes: 0, notes: 'أفران التجفيف UV تعمل بحرارة منتظمة' },
      { hallId: 'HALL-TCC', hallName: 'قاعة تفصيل الصفيح (TIN CUTTER)', status: 'OPERATIONAL', downtimeMinutes: 0, notes: 'مقصات الصفيح الأوتوماتيكية في وضع تشغيلي طبيعي' },
      { hallId: 'HALL-PWR', hallName: 'محطة الطاقة والمرافق (POWER)', status: 'OPERATIONAL', downtimeMinutes: 0, notes: 'ضواغط الأطلس كوبكو 8.5 بار، والجلرات 8 درجات مئوية' }
    ],
    workOrdersHandled: [
      {
        woId: 'WO-2026-001',
        woNumber: 'WO-2026-001',
        assetName: 'ماكينة طباعة الروتوغرافور Cerutti R960',
        title: 'ارتفاع حرارة محرك سحب الفيلم الرئيسي للمحطة 4',
        type: 'EMERGENCY_BREAKDOWN',
        priority: 'HIGH',
        status: 'IN_PROGRESS',
        assignedTechnician: 'سامر الكعبي',
        timeSpentMinutes: 45,
        actionTaken: 'تم فحص الرولمان والمروحة وتخفيض الحمل، بانتظار تغيير الحزام'
      },
      {
        woId: 'WO-2026-003',
        woNumber: 'WO-2026-003',
        assetName: 'ماكينة طباعة الفليكسو F&K 20SIX CI',
        title: 'تنظيف ومعايرة حساسات اللزوجة ومضخات الأحبار',
        type: 'PREVENTIVE',
        priority: 'MEDIUM',
        status: 'COMPLETED',
        assignedTechnician: 'أحمد المنصوري',
        timeSpentMinutes: 60,
        actionTaken: 'تنظيف كامل للحساسات الكهروضوئية وإجراء اختبار ضبط أوتوماتيكي'
      }
    ],
    utilitiesReadings: [
      { parameterName: 'ضغط الهواء المضغوط الرئيسي (Main Air Header)', readingValue: 8.5, unit: 'Bar', status: 'NORMAL', location: 'محطة الضواغط Atlas Copco GA 90' },
      { parameterName: 'حرارة مياه تبريد الجلرات (Chilled Water Supply)', readingValue: 8.2, unit: '°C', status: 'NORMAL', location: 'محطة مبردات Daikin EWAD 250' },
      { parameterName: 'حرارة مرجل الزيت الحراري (Thermal Oil Boiler)', readingValue: 248.0, unit: '°C', location: 'محطة البويلر Bono Energia 1.5M kcal', status: 'NORMAL' },
      { parameterName: 'تردد الشبكة الكهربائية ونظام الـ UPS', readingValue: 50.02, unit: 'Hz', location: 'Schneider Galaxy 300 Central UPS', status: 'NORMAL' }
    ],
    partsConsumed: [
      {
        partId: 'SP-002',
        partNumber: 'DOC-BLD-STEEL-100',
        partName: 'سكين كشط الحبر فولاذية دكتور بليد (Doctor Blade)',
        quantity: 2,
        unit: 'متر',
        unitCost: 14.5,
        totalCost: 29.0,
        machineName: 'ماكينة طباعة الفليكسو F&K 20SIX CI',
        referenceWoId: 'WO-2026-003'
      },
      {
        partId: 'SP-006',
        partNumber: 'FLT-AIR-ATLAS-GA90',
        partName: 'فلتر سحب هواء ضاغط Atlas Copco GA 90',
        quantity: 1,
        unit: 'قطعة',
        unitCost: 85.0,
        totalCost: 85.0,
        machineName: 'ضاغط هواء Atlas Copco GA 90 VSD+ #1',
        referenceWoId: 'WO-2026-PM-01'
      }
    ],
    safetyNotes: '✓ تم التأكد من ارتداء معدات الوقاية الشخصية PPE وتطبيق إجراءات LOTO لقفل الطاقة قبل أي تدخل فني. لا توجد أي إصابات أو حوادث.',
    environmentalNotes: '✓ تم تجميع الأحبار والمذيبات التالفة في البراميل المغلقة المخصصة لتدوير المذيبات.',
    generalObservations: 'ضغط الهواء ومياه التبريد مستقرة تماماً. خط الروتو R960 مستمر في سحب طلبية رقائق رقاقات الألمنيوم.',
    pendingForNextShift: 'متابعة حرارة محامل محرك المحطة 4 في روتو Cerutti عند الساعة 16:30، واستلام شحنة زيوت شل كورينا 46 للمستودع.',
    handedOverBy: {
      name: 'م. حسام التميمي',
      role: 'مهندس صيانة أول / مسؤول الوردية الأولى',
      timestamp: '2026-09-08 14:55',
      signed: true
    },
    receivedBy: {
      name: 'م. كريم السعدي',
      role: 'مهندس وردية الصيانة الثانية (المسائية)',
      timestamp: '2026-09-08 15:00',
      signed: false
    },
    approvedByManager: {
      name: 'م. علي رضا',
      role: 'مطور النظام ومدير إدارة الصيانة',
      timestamp: '2026-09-08 15:10',
      signed: true
    }
  },
  {
    id: 'SHIFT-2026-09-07-E',
    date: '2026-09-07',
    shiftType: 'EVENING',
    shiftName: 'الدورية الثانية (المسائية)',
    shiftHours: '15:00 - 23:00',
    supervisorId: 'USR-ENG-02',
    supervisorName: 'م. كريم السعدي',
    shiftEngineer: 'م. كريم السعدي',
    technicians: ['حيدر عبد الخالق (كهرباء)', 'زيدون مهدي (ميكانيك)'],
    supervisingTechnicians: ['حيدر عبد الخالق (كهرباء)', 'زيدون مهدي (ميكانيك)'],
    productionSupervisor: 'بهاء الدين فاضل',
    status: 'APPROVED',
    patrolRoute: [
      'قاعة الروتو (ROTO)',
      'قاعة الفليكسو (FLEXO)',
      'قاعة البولي إيثيلين (PE)',
      'قاعة صناعة الأكياس (BAG)',
      'محطة الطاقة والمرافق (POWER)'
    ],
    patrolCoveragePercent: 100,
    productionLinesInspected: [
      'Cerutti R960',
      'Macchi 5-Layers Co-Extrusion',
      'Atlas Copco GA 90',
      'Schneider Galaxy UPS'
    ],
    responsibleEngineers: {
      leadEngineer: 'م. كريم السعدي',
      handoverEngineer: 'م. حسام التميمي',
      assignedByDeveloper: true,
      lastModifiedBy: 'م. علي رضا',
      lastModifiedAt: '2026-09-07 15:10'
    },
    hallStatuses: [
      { hallId: 'HALL-ROTO', hallName: 'قاعة الروتو', status: 'OPERATIONAL', downtimeMinutes: 0 },
      { hallId: 'HALL-FLX', hallName: 'قاعة الفليكسو', status: 'OPERATIONAL', downtimeMinutes: 0 },
      { hallId: 'HALL-PE', hallName: 'قاعة البولي إيثيلين', status: 'OPERATIONAL', downtimeMinutes: 0 },
      { hallId: 'HALL-BAG', hallName: 'قاعة صناعة الأكياس', status: 'OPERATIONAL', downtimeMinutes: 0 },
      { hallId: 'HALL-PWR', hallName: 'محطة الطاقة والمرافق', status: 'OPERATIONAL', downtimeMinutes: 0 }
    ],
    workOrdersHandled: [
      {
        woId: 'WO-2026-002',
        woNumber: 'WO-2026-002',
        assetName: 'برج بثق البولي إيثيلين خماسي الطبقات',
        title: 'استبدال شمعات التسخين الخزفية للداي هد Zone 3',
        type: 'CORRECTIVE',
        priority: 'HIGH',
        status: 'COMPLETED',
        assignedTechnician: 'حيدر عبد الخالق',
        timeSpentMinutes: 90,
        actionTaken: 'تم استبدال شمعتين بقدرة 2500 واط وتثبيت درجات الحرارة عند 195 مئوية'
      }
    ],
    utilitiesReadings: [
      { parameterName: 'ضغط الهواء', readingValue: 8.4, unit: 'Bar', status: 'NORMAL', location: 'الضواغط المركزية' },
      { parameterName: 'حرارة التبريد', readingValue: 8.5, unit: '°C', status: 'NORMAL', location: 'محطة الجلرات' }
    ],
    partsConsumed: [
      {
        partId: 'SP-005',
        partNumber: 'HTR-BAND-CERAMIC-2500W',
        partName: 'سخان شريطي خزفي داي هد 2500W',
        quantity: 2,
        unit: 'قطعة',
        unitCost: 110.0,
        totalCost: 220.0,
        machineName: 'برج بثق البولي إيثيلين خماسي الطبقات',
        referenceWoId: 'WO-2026-002'
      }
    ],
    safetyNotes: '✓ التزام كامل بإجراءات السلامة الصناعية وإخلاء ممرات الطوارئ.',
    generalObservations: 'استقرار تام لجميع خطوط الإنتاج والضغوط التشغيلية طوال فترة الوردية.',
    pendingForNextShift: 'الوردية الصباحية مكلفة بإجراء فحص روتيني لفلتر الهواء المركزي.',
    handedOverBy: {
      name: 'م. كريم السعدي',
      role: 'مهندس الوردية المسائية',
      timestamp: '2026-09-07 22:50',
      signed: true
    },
    receivedBy: {
      name: 'م. حسام التميمي',
      role: 'مهندس الوردية الصباحية',
      timestamp: '2026-09-07 23:00',
      signed: true
    },
    approvedByManager: {
      name: 'م. علي رضا',
      role: 'مدير إدارة الصيانة',
      timestamp: '2026-09-08 08:30',
      signed: true
    }
  }
];
