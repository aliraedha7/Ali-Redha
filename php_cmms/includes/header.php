<?php
require_once __DIR__ . '/../config/db.php';

// Fetch system info or alert counts
$data = Database::getJsonData();
$activeShift = $data['shift_logs'][0] ?? null;
$workOrders = $data['work_orders'] ?? [];
$activeWOCount = count(array_filter($workOrders, fn($w) => in_array($w['status'], ['PENDING', 'IN_PROGRESS'])));
$urgentWOCount = count(array_filter($workOrders, fn($w) => $w['priority'] === 'URGENT' && in_array($w['status'], ['PENDING', 'IN_PROGRESS'])));
?>
<!DOCTYPE html>
<html lang="ar" dir="rtl">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title><?= htmlspecialchars($pageTitle ?? 'نظام إدارة الصيانة CMMS') ?> | معمل المرجان للمطبوعات</title>
    <!-- Tailwind CSS CDN -->
    <script src="https://cdn.tailwindcss.com"></script>
    <script>
        tailwind.config = {
            theme: {
                extend: {
                    fontFamily: {
                        sans: ['Cairo', 'Tajawal', 'sans-serif'],
                    },
                    colors: {
                        darkBg: '#0f172a',
                        cardBg: '#1e293b',
                        borderCol: '#334155',
                    }
                }
            }
        }
    </script>
    <!-- Google Fonts Arabic -->
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Cairo:wght@300;400;600;700;800;900&family=Tajawal:wght@400;500;700;800&display=swap" rel="stylesheet">
    <!-- Lucide Icons -->
    <script src="https://unpkg.com/lucide@latest"></script>
    <style>
        body {
            font-family: 'Cairo', 'Tajawal', sans-serif;
            background-color: #0b0f19;
            color: #f8fafc;
        }
        @media print {
            .no-print { display: none !important; }
            body { background: white !important; color: black !important; }
            .print-card { border: 1px solid #ccc !important; box-shadow: none !important; color: black !important; }
        }
    </style>
</head>
<body class="min-h-screen flex flex-col bg-[#0b0f19] text-slate-100 antialiased selection:bg-blue-600 selection:text-white">

    <!-- Top Navigation Header -->
    <header class="sticky top-0 z-40 bg-[#0f172a]/95 backdrop-blur-md border-b border-[#334155] px-4 lg:px-6 py-2.5 flex items-center justify-between no-print">
        <div class="flex items-center gap-3">
            <a href="index.php" class="flex items-center gap-3 group">
                <div class="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-cyan-400 p-0.5 shadow-lg shadow-blue-500/20">
                    <div class="w-full h-full bg-[#0f172a] rounded-[10px] flex items-center justify-center text-cyan-400">
                        <i data-lucide="wrench" class="w-5 h-5"></i>
                    </div>
                </div>
                <div>
                    <div class="flex items-center gap-2">
                        <span class="text-base font-extrabold text-white tracking-tight">معمل المرجان للمطبوعات</span>
                        <span class="text-[10px] font-bold px-2 py-0.5 rounded bg-blue-500/20 text-blue-400 border border-blue-500/30">PHP V3.2</span>
                    </div>
                    <p class="text-[11px] text-slate-400 font-medium">نظام إدارة الصيانة الشاملة والموثوقية (CMMS)</p>
                </div>
            </a>
        </div>

        <!-- Shift & Notification Badges -->
        <div class="flex items-center gap-3">
            <!-- Active Shift Badge -->
            <div class="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-xl bg-[#1e293b] border border-[#334155] text-xs">
                <span class="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
                <span class="text-slate-300 font-bold">الوردية الحالية:</span>
                <span class="text-cyan-400 font-bold"><?= htmlspecialchars($activeShift['shift_name'] ?? 'الوردية الصباحية') ?></span>
                <span class="text-slate-400">| مسؤول: <?= htmlspecialchars($activeShift['responsible_engineers']['lead_engineer'] ?? 'م. حسام التميمي') ?></span>
            </div>

            <!-- Urgent WO Alert -->
            <?php if ($urgentWOCount > 0): ?>
            <a href="work_orders.php?filter=urgent" class="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-rose-500/20 border border-rose-500/40 text-rose-300 text-xs font-bold hover:bg-rose-500/30 transition">
                <i data-lucide="alert-triangle" class="w-4 h-4 text-rose-400 animate-bounce"></i>
                <span><?= $urgentWOCount ?> أمر طارئ</span>
            </a>
            <?php endif; ?>

            <!-- User profile summary -->
            <div class="flex items-center gap-2.5 px-3 py-1.5 rounded-xl bg-[#1e293b] border border-[#334155]">
                <div class="w-7 h-7 rounded-lg bg-blue-600/30 border border-blue-500/40 flex items-center justify-center text-blue-300 text-xs font-bold">
                    م.ع
                </div>
                <div class="text-right hidden sm:block">
                    <p class="text-xs font-bold text-white leading-none">م. علي رضا</p>
                    <p class="text-[10px] text-slate-400">مدير الصيانة والمطور</p>
                </div>
            </div>
        </div>
    </header>

    <!-- Main Container Layout with Sidebar and Content -->
    <div class="flex flex-1 overflow-hidden">
        <?php include __DIR__ . '/sidebar.php'; ?>
        <main class="flex-1 overflow-y-auto p-4 lg:p-6 space-y-6">
