<?php
/**
 * نظام إدارة الصيانة المحوسب (CMMS) - معمل المرجان للمطبوعات
 * Database Connection & Data Store Handler
 */

session_start();

// Database configuration
define('DB_HOST', 'localhost');
define('DB_USER', 'root');
define('DB_PASS', '');
define('DB_NAME', 'almorjan_cmms');
define('DB_PORT', 3306);

// JSON file fallback path (works immediately if MySQL is not yet configured)
define('DATA_FILE', __DIR__ . '/data_store.json');

class Database {
    private static ?PDO $pdo = null;
    private static bool $useJsonFallback = false;

    public static function getConnection(): ?PDO {
        if (self::$useJsonFallback) {
            return null;
        }

        if (self::$pdo === null) {
            try {
                $dsn = "mysql:host=" . DB_HOST . ";port=" . DB_PORT . ";dbname=" . DB_NAME . ";charset=utf8mb4";
                self::$pdo = new PDO($dsn, DB_USER, DB_PASS, [
                    PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
                    PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
                    PDO::ATTR_EMULATE_PREPARES => false,
                ]);
            } catch (PDOException $e) {
                // If MySQL is not available, gracefully use JSON file fallback
                self::$useJsonFallback = true;
                self::initJsonFallback();
            }
        }
        return self::$pdo;
    }

    public static function isUsingFallback(): bool {
        if (self::$pdo === null) {
            self::getConnection();
        }
        return self::$useJsonFallback;
    }

    public static function getJsonData(): array {
        if (!file_exists(DATA_FILE)) {
            self::initJsonFallback();
        }
        $json = file_get_contents(DATA_FILE);
        return json_decode($json, true) ?: [];
    }

    public static function saveJsonData(array $data): bool {
        return (bool)file_put_contents(DATA_FILE, json_encode($data, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE));
    }

    public static function initJsonFallback(): void {
        if (file_exists(DATA_FILE)) {
            return;
        }

        // Seed default comprehensive data for Al-Morjan
        $initialData = [
            'app_info' => [
                'name' => 'نظام إدارة الصيانة الشاملة (CMMS)',
                'factory' => 'معمل المرجان للطباعة والتغليف الحديث',
                'version' => 'V3.2.0 - PHP Production Edition',
                'updated_at' => date('Y-m-d H:i:s')
            ],
            'hangars' => [
                ['id' => 'HALL-ROTO', 'code' => 'HALL-ROTO', 'name' => 'قاعة الروتو (ROTO HALL)', 'supervisor' => 'م. علي رضا / م. حسام التميمي', 'assets_count' => 4],
                ['id' => 'HALL-FLX', 'code' => 'HALL-FLX', 'name' => 'قاعة الفليكسو (FLEXO HALL)', 'supervisor' => 'م. أحمد الجابري', 'assets_count' => 6],
                ['id' => 'HALL-PE', 'code' => 'HALL-PE', 'name' => 'قاعة البولي إيثيلين (PE HALL)', 'supervisor' => 'م. كريم عبدالحسين', 'assets_count' => 4],
                ['id' => 'HALL-BAG', 'code' => 'HALL-BAG', 'name' => 'قاعة صناعة الأكياس (BAG MAKING)', 'supervisor' => 'م. حيدر كاظم', 'assets_count' => 5],
                ['id' => 'HALL-CYL', 'code' => 'HALL-CYL', 'name' => 'قاعة السلندرات والكليشات', 'supervisor' => 'م. عمار الياسري', 'assets_count' => 3],
                ['id' => 'HALL-LAM', 'code' => 'HALL-LAM', 'name' => 'قاعة التبطين والقص (LAMINATION)', 'supervisor' => 'م. مصطفى الشمري', 'assets_count' => 4],
                ['id' => 'HALL-UTILITY', 'code' => 'HALL-UTILITY', 'name' => 'محطات الخدمات المركزية (UTILITIES)', 'supervisor' => 'م. حسين عبد الأمير', 'assets_count' => 7],
                ['id' => 'HALL-RECYCLE', 'code' => 'HALL-RECYCLE', 'name' => 'محطة إعادة التدوير والمعالجة', 'supervisor' => 'م. سجاد البصري', 'assets_count' => 2],
            ],
            'equipment' => [
                [
                    'id' => 'EQ-ROTO-01',
                    'code' => 'ROTO-01',
                    'name' => 'ماكينة طباعة روتوغرافور 8 ألوان Rotomec',
                    'hall_id' => 'HALL-ROTO',
                    'hall_name' => 'قاعة الروتو (ROTO HALL)',
                    'status' => 'OPERATIONAL',
                    'manufacturer' => 'Bobst Rotomec',
                    'model' => 'MW 80',
                    'power_kw' => 145,
                    'last_maintenance' => '2026-09-01',
                    'next_pm' => '2026-09-15'
                ],
                [
                    'id' => 'EQ-FLX-01',
                    'code' => 'FLX-01',
                    'name' => 'ماكينة فليكسوغرافيك مركزية CI 8 ألوان Uteco',
                    'hall_id' => 'HALL-FLX',
                    'hall_name' => 'قاعة الفليكسو (FLEXO HALL)',
                    'status' => 'OPERATIONAL',
                    'manufacturer' => 'Uteco Onyx',
                    'model' => 'Onyx 870',
                    'power_kw' => 180,
                    'last_maintenance' => '2026-08-28',
                    'next_pm' => '2026-09-12'
                ],
                [
                    'id' => 'EQ-FLX-02',
                    'code' => 'FLX-02',
                    'name' => 'ماكينة فليكسو 10 ألوان Windmoller & Holscher',
                    'hall_id' => 'HALL-FLX',
                    'hall_name' => 'قاعة الفليكسو (FLEXO HALL)',
                    'status' => 'MAINTENANCE_REQUIRED',
                    'manufacturer' => 'W&H Miraflex',
                    'model' => 'Miraflex II',
                    'power_kw' => 210,
                    'last_maintenance' => '2026-08-20',
                    'next_pm' => '2026-09-10'
                ],
                [
                    'id' => 'EQ-PE-01',
                    'code' => 'EXT-01',
                    'name' => 'برج بثق فيلم البولي إيثيلين 3 طبقات Macchi',
                    'hall_id' => 'HALL-PE',
                    'hall_name' => 'قاعة البولي إيثيلين (PE HALL)',
                    'status' => 'OPERATIONAL',
                    'manufacturer' => 'Macchi Extrusion',
                    'model' => 'Plastex 3-Layer',
                    'power_kw' => 260,
                    'last_maintenance' => '2026-08-25',
                    'next_pm' => '2026-09-25'
                ],
                [
                    'id' => 'EQ-LAM-01',
                    'code' => 'LAM-01',
                    'name' => 'ماكينة تبطين بدون مذيبات Nordmeccanica Simplex',
                    'hall_id' => 'HALL-LAM',
                    'hall_name' => 'قاعة التبطين والقص',
                    'status' => 'OPERATIONAL',
                    'manufacturer' => 'Nordmeccanica',
                    'model' => 'Simplex SL',
                    'power_kw' => 45,
                    'last_maintenance' => '2026-09-03',
                    'next_pm' => '2026-09-20'
                ],
                [
                    'id' => 'EQ-BAG-01',
                    'code' => 'BAG-01',
                    'name' => 'خط تفصيل أكياس التسوق عالي السرعة HEMINGSTONE',
                    'hall_id' => 'HALL-BAG',
                    'hall_name' => 'قاعة صناعة الأكياس',
                    'status' => 'OPERATIONAL',
                    'manufacturer' => 'Hemingstone',
                    'model' => 'HM-800V',
                    'power_kw' => 28,
                    'last_maintenance' => '2026-08-30',
                    'next_pm' => '2026-09-14'
                ],
                [
                    'id' => 'EQ-CMP-01',
                    'code' => 'CMP-01',
                    'name' => 'ضاغط هواء حلزوني مركزي أطلس كوبكو Atlas Copco GA75',
                    'hall_id' => 'HALL-UTILITY',
                    'hall_name' => 'محطات الخدمات المركزية',
                    'status' => 'OPERATIONAL',
                    'manufacturer' => 'Atlas Copco',
                    'model' => 'GA75 VSD+',
                    'power_kw' => 75,
                    'last_maintenance' => '2026-08-15',
                    'next_pm' => '2026-09-15'
                ],
                [
                    'id' => 'EQ-CHL-01',
                    'code' => 'CHL-01',
                    'name' => 'تشيلر تبريد مركزي صناعي Daikin 120TR',
                    'hall_id' => 'HALL-UTILITY',
                    'hall_name' => 'محطات الخدمات المركزية',
                    'status' => 'OPERATIONAL',
                    'manufacturer' => 'Daikin Applied',
                    'model' => 'EWAD-TZ',
                    'power_kw' => 110,
                    'last_maintenance' => '2026-08-18',
                    'next_pm' => '2026-09-18'
                ],
                [
                    'id' => 'EQ-BLR-01',
                    'code' => 'BLR-01',
                    'name' => 'مرجل زيت حراري صناعي Bono Energia 1,200,000 kcal',
                    'hall_id' => 'HALL-UTILITY',
                    'hall_name' => 'محطات الخدمات المركزية',
                    'status' => 'OPERATIONAL',
                    'manufacturer' => 'Bono Energia',
                    'model' => 'OMV 1200',
                    'power_kw' => 35,
                    'last_maintenance' => '2026-08-12',
                    'next_pm' => '2026-09-12'
                ],
                [
                    'id' => 'EQ-UPS-01',
                    'code' => 'UPS-01',
                    'name' => 'وحدة طاقة غير منقطعة مركزية Schneider Galaxy 300 (80kVA)',
                    'hall_id' => 'HALL-UTILITY',
                    'hall_name' => 'محطات الخدمات المركزية',
                    'status' => 'OPERATIONAL',
                    'manufacturer' => 'Schneider Electric',
                    'model' => 'Galaxy 300',
                    'power_kw' => 64,
                    'last_maintenance' => '2026-08-01',
                    'next_pm' => '2026-10-01'
                ]
            ],
            'work_orders' => [
                [
                    'id' => 'WO-2026-0901',
                    'code' => 'WO-0901',
                    'title' => 'استبدال شفرات تنظيف السلندرات (Doctor Blades) والرمان في الروتو',
                    'equipment_id' => 'EQ-ROTO-01',
                    'equipment_name' => 'ماكينة طباعة روتوغرافور 8 ألوان Rotomec',
                    'hall_name' => 'قاعة الروتو (ROTO HALL)',
                    'type' => 'CORRECTIVE',
                    'priority' => 'HIGH',
                    'status' => 'IN_PROGRESS',
                    'assigned_to' => 'م. حسام التميمي + فني حيدر كريم',
                    'created_at' => '2026-09-09 08:30:00',
                    'description' => 'ظهور خطوط حبر خفيفة عند سرعة 220 م/دقيقة في البرج رقم 3، يتطلب استبدال شفرة الدكتور بليد ومراجعة ضغط السلندر.'
                ],
                [
                    'id' => 'WO-2026-0902',
                    'code' => 'WO-0902',
                    'title' => 'فحص ومعايرة حساسات التوتر (Tension Load Cells) لوحدة فك الرول',
                    'equipment_id' => 'EQ-FLX-01',
                    'equipment_name' => 'ماكينة فليكسوغرافيك مركزية CI 8 ألوان Uteco',
                    'hall_name' => 'قاعة الفليكسو (FLEXO HALL)',
                    'type' => 'PREVENTIVE',
                    'priority' => 'MEDIUM',
                    'status' => 'PENDING',
                    'assigned_to' => 'م. أحمد الجابري + فني وسام علي',
                    'created_at' => '2026-09-08 14:15:00',
                    'description' => 'معايرة دورية لحساسات الشد الرقمية في وحدة Unwinder لضمان استقرار فيلم التغليف.'
                ],
                [
                    'id' => 'WO-2026-0903',
                    'code' => 'WO-0903',
                    'title' => 'صيانة طارئة: تذبذب ضغط الهواء للبرج رقم 2 في الفليكسو W&H',
                    'equipment_id' => 'EQ-FLX-02',
                    'equipment_name' => 'ماكينة فليكسو 10 ألوان Windmoller & Holscher',
                    'hall_name' => 'قاعة الفليكسو (FLEXO HALL)',
                    'type' => 'EMERGENCY',
                    'priority' => 'URGENT',
                    'status' => 'IN_PROGRESS',
                    'assigned_to' => 'م. علي رضا (مدير الصيانة)',
                    'created_at' => '2026-09-09 09:10:00',
                    'description' => 'تنبيه هبوط ضغط الهواء الهوائي النيوماتيكي، فحص صمام الملف اللولبي (Solenoid Valve) والمرشح.'
                ],
                [
                    'id' => 'WO-2026-0904',
                    'code' => 'WO-0904',
                    'title' => 'تنظيف فلاتر زيت مرجل الزيت الحراري وفحص مضخات التدوير',
                    'equipment_id' => 'EQ-BLR-01',
                    'equipment_name' => 'مرجل زيت حراري صناعي Bono Energia',
                    'hall_name' => 'محطات الخدمات المركزية',
                    'type' => 'PREVENTIVE',
                    'priority' => 'LOW',
                    'status' => 'COMPLETED',
                    'assigned_to' => 'م. حسين عبد الأمير',
                    'created_at' => '2026-09-07 10:00:00',
                    'completed_at' => '2026-09-07 15:30:00',
                    'description' => 'تم استبدال الفلاتر وفحص حرارة الزيت 240 مئوية والضغط 4.2 بار والحالة ممتازة.'
                ]
            ],
            'shift_logs' => [
                [
                    'id' => 'SHIFT-2026-0909-M',
                    'shift_code' => 'SHF-MORNING-09',
                    'shift_name' => 'الوردية الصباحية (07:00 ص - 03:00 م)',
                    'date' => '2026-09-09',
                    'status' => 'ACTIVE',
                    'responsible_engineers' => [
                        'lead_engineer' => 'م. حسام التميمي',
                        'handover_engineer' => 'م. كريم السعدي',
                        'safety_officer' => 'م. رافد الشمري',
                        'developer_assigned' => 'م. علي رضا',
                        'updated_by' => 'مهندس الصيانة المعتمد'
                    ],
                    'environmental' => [
                        'ambient_temp_c' => 24.2,
                        'relative_humidity_pct' => 54.0,
                        'air_pressure_bar' => 7.8,
                        'chiller_temp_c' => 7.2,
                        'boiler_temp_c' => 238.0,
                        'ups_freq_hz' => 50.0
                    ],
                    'checklist' => [
                        ['id' => 'CHK-01', 'title' => 'فحص ضغط الهواء وتفريغ متكثفات خزان أطلس كوبكو', 'area' => 'محطة الضواغط المركزية', 'status' => 'PASSED', 'method' => 'فحص بصري ومقياس ضغط'],
                        ['id' => 'CHK-02', 'title' => 'مراقبة حرارة مياه تبريد سلندرات الفليكسو والروتو', 'area' => 'دائرة التشيلر المركزية', 'status' => 'PASSED', 'method' => 'حساس رقمي PT100'],
                        ['id' => 'CHK-03', 'title' => 'فحص أنظمة سحب وتبخير مذيبات الأحبار والتأريض الاستاتيكي', 'area' => 'قاعة الروتو والفليكسو', 'status' => 'WARNING', 'method' => 'جهاز قياس الأبخرة والتأريض'],
                        ['id' => 'CHK-04', 'title' => 'فحص لوحات التوزيع ومغذيات الـ UPS وقواطع الحماية', 'area' => 'غرفة الكهرباء المركزية', 'status' => 'PASSED', 'method' => 'كاميرا حرارية وفحص جهد'],
                        ['id' => 'CHK-05', 'title' => 'فحص نقاوة وضغط مياه المعالجة بالتناضح العكسي RO', 'area' => 'محطة تحلية المياه', 'status' => 'PASSED', 'method' => 'مقياس TDS ومقياس ضغط']
                    ],
                    'notes' => 'سير الإنتاج يسير بانتظام. تم فتح أمر عمل طارئ لمعايرة صمام نيوماتيك في فليكسو W&H.'
                ]
            ],
            'spare_parts' => [
                ['id' => 'SP-01', 'code' => 'BLD-M01', 'name' => 'شفرات دكتور بليد سويسرية 100 م (Doctor Blades)', 'category' => 'Mechanical', 'stock' => 14, 'min_stock' => 5, 'unit' => 'لفة', 'price' => 120.0],
                ['id' => 'SP-02', 'code' => 'BRG-6205', 'name' => 'رمان بلي سرعات SKF 6205-2RSH', 'category' => 'Mechanical', 'stock' => 28, 'min_stock' => 10, 'unit' => 'قطعة', 'price' => 18.5],
                ['id' => 'SP-03', 'code' => 'SOL-24V', 'name' => 'صمام ملف لولبي Festo 24V DC نيوماتيكي', 'category' => 'Pneumatic', 'stock' => 6, 'min_stock' => 4, 'unit' => 'قطعة', 'price' => 65.0],
                ['id' => 'SP-04', 'code' => 'OIL-TH46', 'name' => 'زيت نقل حراري لمرجل البويلر Mobiltherm 605', 'category' => 'Consumable', 'stock' => 850, 'min_stock' => 300, 'unit' => 'لتر', 'price' => 4.2],
                ['id' => 'SP-05', 'code' => 'SNS-COR', 'name' => 'شريط تفريغ كهرباء استاتيكية لكورونا التريتر', 'category' => 'Electrical', 'stock' => 8, 'min_stock' => 3, 'unit' => 'متر', 'price' => 85.0]
            ],
            'users' => [
                ['id' => 'USR-01', 'name' => 'م. علي رضا', 'role' => 'مدير الصيانة والمطور', 'dept' => 'الإدارة الهندسية', 'phone' => '+964 770 000 0001', 'status' => 'ACTIVE'],
                ['id' => 'USR-02', 'name' => 'م. حسام التميمي', 'role' => 'مهندس وردية الصيانة', 'dept' => 'هندسة ميكانيك', 'phone' => '+964 770 000 0002', 'status' => 'ACTIVE'],
                ['id' => 'USR-03', 'name' => 'م. كريم السعدي', 'role' => 'مهندس استلام الوردية', 'dept' => 'هندسة كهروميكانيك', 'phone' => '+964 770 000 0003', 'status' => 'ACTIVE'],
                ['id' => 'USR-04', 'name' => 'م. رافد الشمري', 'role' => 'مسؤول السلامة والبيئة (HSE)', 'dept' => 'السلامة الصناعية', 'phone' => '+964 770 000 0004', 'status' => 'ACTIVE']
            ]
        ];

        self::saveJsonData($initialData);
    }
}
