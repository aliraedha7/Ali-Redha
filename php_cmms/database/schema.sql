-- ==========================================================
-- قاعدة بيانات نظام إدارة الصيانة المحوسب (CMMS)
-- معمل المرجان للطباعة والتغليف الحديث
-- التوافق: MySQL 5.7+ / MySQL 8.0+ / MariaDB 10.3+
-- ==========================================================

SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;

CREATE DATABASE IF NOT EXISTS `almorjan_cmms` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE `almorjan_cmms`;

-- 1. جدول قاعات الإنتاج (Production Halls / Hangars)
DROP TABLE IF EXISTS `hangars`;
CREATE TABLE `hangars` (
  `id` VARCHAR(50) NOT NULL,
  `code` VARCHAR(30) NOT NULL,
  `name` VARCHAR(150) NOT NULL,
  `name_en` VARCHAR(150) DEFAULT NULL,
  `supervisor` VARCHAR(100) DEFAULT NULL,
  `dedicated_ups` VARCHAR(100) DEFAULT NULL,
  `total_assets` INT DEFAULT 0,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 2. جدول الماكينات والمعدات (Equipment & Assets)
DROP TABLE IF EXISTS `equipment`;
CREATE TABLE `equipment` (
  `id` VARCHAR(50) NOT NULL,
  `code` VARCHAR(30) NOT NULL,
  `name` VARCHAR(200) NOT NULL,
  `hall_id` VARCHAR(50) NOT NULL,
  `status` ENUM('OPERATIONAL', 'MAINTENANCE_REQUIRED', 'DOWN', 'STANDBY') DEFAULT 'OPERATIONAL',
  `manufacturer` VARCHAR(100) DEFAULT NULL,
  `model` VARCHAR(100) DEFAULT NULL,
  `power_kw` DECIMAL(8,2) DEFAULT NULL,
  `last_maintenance` DATE DEFAULT NULL,
  `next_pm` DATE DEFAULT NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `fk_equipment_hall` (`hall_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 3. جدول أوامر العمل (Work Orders)
DROP TABLE IF EXISTS `work_orders`;
CREATE TABLE `work_orders` (
  `id` VARCHAR(50) NOT NULL,
  `code` VARCHAR(30) NOT NULL,
  `title` VARCHAR(255) NOT NULL,
  `equipment_id` VARCHAR(50) NOT NULL,
  `type` ENUM('CORRECTIVE', 'PREVENTIVE', 'EMERGENCY', 'INSPECTION') DEFAULT 'CORRECTIVE',
  `priority` ENUM('LOW', 'MEDIUM', 'HIGH', 'URGENT') DEFAULT 'MEDIUM',
  `status` ENUM('PENDING', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED') DEFAULT 'PENDING',
  `assigned_to` VARCHAR(150) DEFAULT NULL,
  `description` TEXT DEFAULT NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `completed_at` TIMESTAMP NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `fk_wo_equipment` (`equipment_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 4. جدول سجلات الورديات والدوريات (Shift & Patrol Logs)
DROP TABLE IF EXISTS `shift_logs`;
CREATE TABLE `shift_logs` (
  `id` VARCHAR(50) NOT NULL,
  `shift_code` VARCHAR(50) NOT NULL,
  `shift_name` VARCHAR(100) NOT NULL,
  `shift_date` DATE NOT NULL,
  `status` ENUM('ACTIVE', 'HANDED_OVER', 'ARCHIVED') DEFAULT 'ACTIVE',
  `lead_engineer` VARCHAR(100) NOT NULL,
  `handover_engineer` VARCHAR(100) NOT NULL,
  `safety_officer` VARCHAR(100) DEFAULT NULL,
  `ambient_temp_c` DECIMAL(5,2) DEFAULT 24.00,
  `relative_humidity_pct` DECIMAL(5,2) DEFAULT 55.00,
  `air_pressure_bar` DECIMAL(5,2) DEFAULT 7.50,
  `chiller_temp_c` DECIMAL(5,2) DEFAULT 7.00,
  `boiler_temp_c` DECIMAL(5,2) DEFAULT 235.00,
  `ups_freq_hz` DECIMAL(5,2) DEFAULT 50.00,
  `notes` TEXT DEFAULT NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 5. جدول بنود فحص الدوريات (Patrol Checklist)
DROP TABLE IF EXISTS `patrol_checklist_items`;
CREATE TABLE `patrol_checklist_items` (
  `id` VARCHAR(50) NOT NULL,
  `shift_id` VARCHAR(50) NOT NULL,
  `title` VARCHAR(255) NOT NULL,
  `area` VARCHAR(100) NOT NULL,
  `method` VARCHAR(150) DEFAULT NULL,
  `status` ENUM('PASSED', 'WARNING', 'FAILED') DEFAULT 'PASSED',
  `notes` TEXT DEFAULT NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `fk_chk_shift` (`shift_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 6. جدول أجهزة القياس والعدادات (Meters & Central Utilities)
DROP TABLE IF EXISTS `meter_readings`;
CREATE TABLE `meter_readings` (
  `id` VARCHAR(50) NOT NULL,
  `device_code` VARCHAR(50) NOT NULL,
  `device_name` VARCHAR(150) NOT NULL,
  `parameter_name` VARCHAR(100) NOT NULL,
  `reading_value` DECIMAL(10,2) NOT NULL,
  `unit` VARCHAR(20) NOT NULL,
  `status` ENUM('NORMAL', 'WARNING', 'CRITICAL') DEFAULT 'NORMAL',
  `location_name` VARCHAR(100) DEFAULT NULL,
  `recorded_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 7. جدول قطع الغيار والمستودع (Spare Parts Inventory)
DROP TABLE IF EXISTS `spare_parts`;
CREATE TABLE `spare_parts` (
  `id` VARCHAR(50) NOT NULL,
  `code` VARCHAR(50) NOT NULL,
  `name` VARCHAR(200) NOT NULL,
  `category` ENUM('Mechanical', 'Electrical', 'Pneumatic', 'Consumable', 'Hydraulic') DEFAULT 'Mechanical',
  `stock` INT DEFAULT 0,
  `min_stock` INT DEFAULT 5,
  `unit` VARCHAR(30) DEFAULT 'قطعة',
  `price_usd` DECIMAL(10,2) DEFAULT 0.00,
  `bin_location` VARCHAR(50) DEFAULT NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `idx_spare_code` (`code`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 8. جدول المهندسين والمستخدمين (Users & Engineering Team)
DROP TABLE IF EXISTS `users`;
CREATE TABLE `users` (
  `id` VARCHAR(50) NOT NULL,
  `name` VARCHAR(100) NOT NULL,
  `email` VARCHAR(100) DEFAULT NULL,
  `role` VARCHAR(100) NOT NULL,
  `department` VARCHAR(100) DEFAULT NULL,
  `phone` VARCHAR(50) DEFAULT NULL,
  `is_active` TINYINT(1) DEFAULT 1,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ==========================================================
-- إدراج البيانات الأولية القياسية لمعمل المرجان
-- ==========================================================

INSERT INTO `hangars` (`id`, `code`, `name`, `name_en`, `supervisor`, `dedicated_ups`, `total_assets`) VALUES
('HALL-ROTO', 'HALL-ROTO', 'قاعة الروتو (ROTO HALL)', 'ROTO HALL', 'م. علي رضا / م. حسام التميمي', 'Schneider Galaxy 300 (60 kVA)', 4),
('HALL-FLX', 'HALL-FLX', 'قاعة الفليكسو (FLEXO HALL)', 'FLEXO HALL', 'م. أحمد الجابري', 'Schneider Galaxy 300 (80 kVA)', 6),
('HALL-PE', 'HALL-PE', 'قاعة البولي إيثيلين (PE HALL)', 'PE HALL', 'م. كريم عبدالحسين', 'Schneider Galaxy 300 (60 kVA)', 4),
('HALL-BAG', 'HALL-BAG', 'قاعة صناعة الأكياس (BAG MAKING)', 'BAG MAKING HALL', 'م. حيدر كاظم', 'Schneider Galaxy 300 (40 kVA)', 5),
('HALL-LAM', 'HALL-LAM', 'قاعة التبطين والقص (LAMINATION)', 'LAMINATION HALL', 'م. مصطفى الشمري', 'Schneider Galaxy 300 (40 kVA)', 4),
('HALL-UTILITY', 'HALL-UTILITY', 'محطات الخدمات المركزية (UTILITIES)', 'UTILITIES', 'م. حسين عبد الأمير', 'Schneider Galaxy 300 (100 kVA)', 7);

INSERT INTO `equipment` (`id`, `code`, `name`, `hall_id`, `status`, `manufacturer`, `model`, `power_kw`, `last_maintenance`, `next_pm`) VALUES
('EQ-ROTO-01', 'ROTO-01', 'ماكينة طباعة روتوغرافور 8 ألوان Rotomec', 'HALL-ROTO', 'OPERATIONAL', 'Bobst Rotomec', 'MW 80', 145.00, '2026-09-01', '2026-09-15'),
('EQ-FLX-01', 'FLX-01', 'ماكينة فليكسوغرافيك مركزية CI 8 ألوان Uteco', 'HALL-FLX', 'OPERATIONAL', 'Uteco Onyx', 'Onyx 870', 180.00, '2026-08-28', '2026-09-12'),
('EQ-FLX-02', 'FLX-02', 'ماكينة فليكسو 10 ألوان Windmoller & Holscher', 'HALL-FLX', 'MAINTENANCE_REQUIRED', 'W&H Miraflex', 'Miraflex II', 210.00, '2026-08-20', '2026-09-10'),
('EQ-PE-01', 'EXT-01', 'برج بثق فيلم البولي إيثيلين 3 طبقات Macchi', 'HALL-PE', 'OPERATIONAL', 'Macchi Extrusion', 'Plastex 3-Layer', 260.00, '2026-08-25', '2026-09-25'),
('EQ-CMP-01', 'CMP-01', 'ضاغط هواء حلزوني مركزي أطلس كوبكو GA75', 'HALL-UTILITY', 'OPERATIONAL', 'Atlas Copco', 'GA75 VSD+', 75.00, '2026-08-15', '2026-09-15'),
('EQ-CHL-01', 'CHL-01', 'تشيلر تبريد مركزي صناعي Daikin 120TR', 'HALL-UTILITY', 'OPERATIONAL', 'Daikin Applied', 'EWAD-TZ', 110.00, '2026-08-18', '2026-09-18'),
('EQ-BLR-01', 'BLR-01', 'مرجل زيت حراري صناعي Bono Energia 1,200,000 kcal', 'HALL-UTILITY', 'OPERATIONAL', 'Bono Energia', 'OMV 1200', 35.00, '2026-08-12', '2026-09-12');

INSERT INTO `work_orders` (`id`, `code`, `title`, `equipment_id`, `type`, `priority`, `status`, `assigned_to`, `description`) VALUES
('WO-2026-0901', 'WO-0901', 'استبدال شفرات تنظيف السلندرات (Doctor Blades) في الروتو', 'EQ-ROTO-01', 'CORRECTIVE', 'HIGH', 'IN_PROGRESS', 'م. حسام التميمي + فني حيدر كريم', 'ظهور خطوط حبر خفيفة عند سرعة 220 م/دقيقة في البرج رقم 3.'),
('WO-2026-0902', 'WO-0902', 'فحص ومعايرة حساسات التوتر (Tension Load Cells) لوحدة فك الرول', 'EQ-FLX-01', 'PREVENTIVE', 'MEDIUM', 'PENDING', 'م. أحمد الجابري + فني وسام علي', 'معايرة دورية لحساسات الشد الرقمية في وحدة Unwinder.'),
('WO-2026-0903', 'WO-0903', 'صيانة طارئة: تذبذب ضغط الهواء للبرج رقم 2 في الفليكسو W&H', 'EQ-FLX-02', 'EMERGENCY', 'URGENT', 'IN_PROGRESS', 'م. علي رضا (مدير الصيانة)', 'تنبيه هبوط ضغط الهواء الهوائي، فحص صمام الملف اللولبي Solenoid.');

INSERT INTO `spare_parts` (`id`, `code`, `name`, `category`, `stock`, `min_stock`, `unit`, `price_usd`, `bin_location`) VALUES
('SP-01', 'BLD-M01', 'شفرات دكتور بليد سويسرية 100 م (Doctor Blades)', 'Mechanical', 14, 5, 'لفة', 120.00, 'رف A-04'),
('SP-02', 'BRG-6205', 'رمان بلي سرعات SKF 6205-2RSH', 'Mechanical', 28, 10, 'قطعة', 18.50, 'رف B-12'),
('SP-03', 'SOL-24V', 'صمام ملف لولبي Festo 24V DC نيوماتيكي', 'Pneumatic', 6, 4, 'قطعة', 65.00, 'رف C-01'),
('SP-04', 'OIL-TH46', 'زيت نقل حراري لمرجل البويلر Mobiltherm 605', 'Consumable', 850, 300, 'لتر', 4.20, 'براميل المستودع الخارجي'),
('SP-05', 'SNS-COR', 'شريط تفريغ كهرباء استاتيكية لكورونا التريتر', 'Electrical', 8, 3, 'متر', 85.00, 'خزانة الإلكترونيات E-02');

INSERT INTO `users` (`id`, `name`, `email`, `role`, `department`, `phone`) VALUES
('USR-01', 'م. علي رضا', 'ali.eng@almorjan.com', 'مدير الصيانة والمطور', 'الإدارة الهندسية', '+964 770 000 0001'),
('USR-02', 'م. حسام التميمي', 'hussam@almorjan.com', 'مهندس وردية الصيانة', 'هندسة ميكانيك', '+964 770 000 0002'),
('USR-03', 'م. كريم السعدي', 'kareem@almorjan.com', 'مهندس استلام الوردية', 'هندسة كهروميكانيك', '+964 770 000 0003'),
('USR-04', 'م. رافد الشمري', 'rafid@almorjan.com', 'مسؤول السلامة والبيئة (HSE)', 'السلامة الصناعية', '+964 770 000 0004');

SET FOREIGN_KEY_CHECKS = 1;
