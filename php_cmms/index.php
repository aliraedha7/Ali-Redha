<?php
$pageTitle = 'لوحة التحكم والعمليات الهندسية';
require_once __DIR__ . '/includes/header.php';

$equipment = $data['equipment'] ?? [];
$workOrders = $data['work_orders'] ?? [];
$hangars = $data['hangars'] ?? [];
$spareParts = $data['spare_parts'] ?? [];

$totalEquipment = count($equipment);
$operationalCount = count(array_filter($equipment, fn($e) => $e['status'] === 'OPERATIONAL'));
$availabilityPct = $totalEquipment > 0 ? round(($operationalCount / $totalEquipment) * 100, 1) : 100;
?>

<!-- Top Welcome & KPIs Header -->
<div class="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-2 border-b border-[#334155]">
    <div>
        <h1 class="text-xl lg:text-2xl font-black text-white flex items-center gap-2.5">
            <span class="w-3 h-3 rounded-full bg-blue-500 animate-ping"></span>
            لوحة المراقبة والتحكم في صيانة معمل المرجان
        </h1>
        <p class="text-xs text-slate-400 mt-1">
            متابعة فورية لأوامر العمل، كفاءة الماكينات، العدادات المركزية، والتسليم والتسلم الهندسي.
        </p>
    </div>

    <!-- Quick Actions -->
    <div class="flex items-center gap-2 flex-wrap">
        <a href="work_orders.php?action=new" class="px-3.5 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold shadow-lg shadow-blue-600/20 flex items-center gap-1.5 transition">
            <i data-lucide="plus-circle" class="w-4 h-4"></i>
            <span>أمر عمل جديد</span>
        </a>
        <a href="shift_reports.php" class="px-3.5 py-2 rounded-xl bg-[#1e293b] hover:bg-slate-700 text-slate-200 border border-[#334155] text-xs font-bold flex items-center gap-1.5 transition">
            <i data-lucide="file-text" class="w-4 h-4 text-cyan-400"></i>
            <span>تقرير الدورية الميدانية</span>
        </a>
        <a href="inventory.php" class="px-3.5 py-2 rounded-xl bg-[#1e293b] hover:bg-slate-700 text-slate-200 border border-[#334155] text-xs font-bold flex items-center gap-1.5 transition">
            <i data-lucide="box" class="w-4 h-4 text-amber-400"></i>
            <span>المستودع</span>
        </a>
    </div>
</div>

<!-- KPI Metric Cards Grid -->
<div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
    <!-- Card 1: Availability -->
    <div class="p-4 rounded-2xl bg-[#1e293b] border border-[#334155] relative overflow-hidden group hover:border-emerald-500/50 transition">
        <div class="flex items-center justify-between">
            <span class="text-xs font-bold text-slate-400">جاهزية الماكينات والخطوط</span>
            <div class="w-8 h-8 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
                <i data-lucide="activity" class="w-4 h-4"></i>
            </div>
        </div>
        <div class="mt-3 flex items-baseline gap-2">
            <span class="text-2xl font-black text-white"><?= $availabilityPct ?>%</span>
            <span class="text-[11px] text-emerald-400 font-bold"><?= $operationalCount ?> من <?= $totalEquipment ?> عاملة</span>
        </div>
        <div class="mt-2 w-full h-1.5 rounded-full bg-slate-800">
            <div class="h-full bg-emerald-500 rounded-full" style="width: <?= $availabilityPct ?>%"></div>
        </div>
    </div>

    <!-- Card 2: Active Work Orders -->
    <div class="p-4 rounded-2xl bg-[#1e293b] border border-[#334155] relative overflow-hidden group hover:border-blue-500/50 transition">
        <div class="flex items-center justify-between">
            <span class="text-xs font-bold text-slate-400">أوامر العمل الجارية</span>
            <div class="w-8 h-8 rounded-xl bg-blue-500/20 text-blue-400 flex items-center justify-center">
                <i data-lucide="clipboard-list" class="w-4 h-4"></i>
            </div>
        </div>
        <div class="mt-3 flex items-baseline gap-2">
            <span class="text-2xl font-black text-white"><?= $activeWOCount ?></span>
            <span class="text-[11px] text-blue-400 font-bold">تحت المعالجة الفنية</span>
        </div>
        <p class="text-[10px] text-slate-400 mt-2">منها <?= $urgentWOCount ?> أمر طارئ مستوجب سرعة التدخل</p>
    </div>

    <!-- Card 3: MTTR / MTBF -->
    <div class="p-4 rounded-2xl bg-[#1e293b] border border-[#334155] relative overflow-hidden group hover:border-amber-500/50 transition">
        <div class="flex items-center justify-between">
            <span class="text-xs font-bold text-slate-400">متوسط زمن الإصلاح (MTTR)</span>
            <div class="w-8 h-8 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center">
                <i data-lucide="timer" class="w-4 h-4"></i>
            </div>
        </div>
        <div class="mt-3 flex items-baseline gap-2">
            <span class="text-2xl font-black text-white">42 دقيقة</span>
            <span class="text-[11px] text-amber-400 font-bold">-14% عن الشهر السابق</span>
        </div>
        <p class="text-[10px] text-slate-400 mt-2">متوسط زمن التشغيل بين الأعطال (MTBF): 168 ساعة</p>
    </div>

    <!-- Card 4: Spare Parts Safety Stock -->
    <div class="p-4 rounded-2xl bg-[#1e293b] border border-[#334155] relative overflow-hidden group hover:border-purple-500/50 transition">
        <div class="flex items-center justify-between">
            <span class="text-xs font-bold text-slate-400">مخزون قطع الغيار الحرج</span>
            <div class="w-8 h-8 rounded-xl bg-purple-500/20 text-purple-400 flex items-center justify-center">
                <i data-lucide="archive" class="w-4 h-4"></i>
            </div>
        </div>
        <div class="mt-3 flex items-baseline gap-2">
            <span class="text-2xl font-black text-white"><?= count($spareParts) ?> صنف</span>
            <span class="text-[11px] text-purple-400 font-bold">مؤمن بالمستودع</span>
        </div>
        <p class="text-[10px] text-slate-400 mt-2">شفرات دكتور بليد، صمامات Festo، ورمان بلي SKF متوفرة</p>
    </div>
</div>

<!-- Active Shift Banner with Responsible Engineers -->
<div class="p-5 rounded-2xl bg-gradient-to-r from-blue-950/40 via-[#1e293b] to-slate-900 border border-blue-500/30 space-y-4">
    <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#334155] pb-3">
        <div class="flex items-center gap-3">
            <div class="w-10 h-10 rounded-xl bg-blue-500/20 text-blue-400 flex items-center justify-center">
                <i data-lucide="shield-check" class="w-5 h-5"></i>
            </div>
            <div>
                <h2 class="text-sm font-bold text-white flex items-center gap-2">
                    <?= htmlspecialchars($activeShift['shift_name'] ?? 'الوردية الصباحية الميدانية') ?>
                    <span class="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">نشطة الآن</span>
                </h2>
                <p class="text-[11px] text-slate-400">تاريخ اليوم: <?= date('Y-m-d') ?> • محضر الدورية والتسليم الهندسي</p>
            </div>
        </div>
        <a href="shift_reports.php" class="px-3 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold flex items-center gap-1.5 transition self-start sm:self-auto">
            <span>فتح محضر الدورية والاعتماد</span>
            <i data-lucide="arrow-left" class="w-3.5 h-3.5"></i>
        </a>
    </div>

    <!-- Engineers Row -->
    <div class="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
        <div class="p-3 rounded-xl bg-[#0f172a]/70 border border-[#334155] flex items-center gap-3">
            <div class="w-8 h-8 rounded-lg bg-blue-500/20 text-blue-400 flex items-center justify-center font-bold text-xs">
                1
            </div>
            <div>
                <span class="text-[10px] text-slate-400 block font-bold">مهندس الوردية المسؤول:</span>
                <span class="text-xs font-bold text-slate-200"><?= htmlspecialchars($activeShift['responsible_engineers']['lead_engineer'] ?? 'م. حسام التميمي') ?></span>
            </div>
        </div>

        <div class="p-3 rounded-xl bg-[#0f172a]/70 border border-[#334155] flex items-center gap-3">
            <div class="w-8 h-8 rounded-lg bg-cyan-500/20 text-cyan-400 flex items-center justify-center font-bold text-xs">
                2
            </div>
            <div>
                <span class="text-[10px] text-slate-400 block font-bold">مهندس استلام الوردية:</span>
                <span class="text-xs font-bold text-slate-200"><?= htmlspecialchars($activeShift['responsible_engineers']['handover_engineer'] ?? 'م. كريم السعدي') ?></span>
            </div>
        </div>

        <div class="p-3 rounded-xl bg-[#0f172a]/70 border border-[#334155] flex items-center gap-3">
            <div class="w-8 h-8 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold text-xs">
                3
            </div>
            <div>
                <span class="text-[10px] text-slate-400 block font-bold">مسؤول السلامة والبيئة:</span>
                <span class="text-xs font-bold text-slate-200"><?= htmlspecialchars($activeShift['responsible_engineers']['safety_officer'] ?? 'م. رافد الشمري') ?></span>
            </div>
        </div>
    </div>
</div>

<!-- Two Columns: Work Orders & Central Utilities -->
<div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
    <!-- Active Work Orders (2 Cols) -->
    <div class="lg:col-span-2 space-y-4">
        <div class="flex items-center justify-between">
            <h2 class="text-sm font-bold text-white flex items-center gap-2">
                <i data-lucide="clipboard-check" class="w-4 h-4 text-blue-400"></i>
                أحدث أوامر العمل والصيانة الفنية
            </h2>
            <a href="work_orders.php" class="text-xs text-blue-400 hover:text-blue-300 font-bold">عرض كافة الأوامر (<?= count($workOrders) ?>)</a>
        </div>

        <div class="space-y-3">
            <?php foreach (array_slice($workOrders, 0, 4) as $wo): ?>
            <div class="p-4 rounded-2xl bg-[#1e293b] border border-[#334155] hover:border-slate-500 transition space-y-3">
                <div class="flex items-start justify-between gap-3">
                    <div>
                        <div class="flex items-center gap-2">
                            <span class="font-mono text-xs font-bold text-blue-400"><?= htmlspecialchars($wo['code']) ?></span>
                            <span class="text-xs text-slate-400">• <?= htmlspecialchars($wo['hall_name'] ?? 'قاعة الإنتاج') ?></span>
                        </div>
                        <h3 class="text-sm font-bold text-white mt-1"><?= htmlspecialchars($wo['title']) ?></h3>
                    </div>
                    <!-- Priority badge -->
                    <span class="px-2 py-1 rounded-full text-[10px] font-bold <?= $wo['priority'] === 'URGENT' ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30' : ($wo['priority'] === 'HIGH' ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30' : 'bg-blue-500/20 text-blue-300 border border-blue-500/30') ?>">
                        <?= $wo['priority'] === 'URGENT' ? 'طارئ جداً' : ($wo['priority'] === 'HIGH' ? 'أولوية عالية' : 'عادي') ?>
                    </span>
                </div>

                <p class="text-xs text-slate-300 leading-relaxed"><?= htmlspecialchars($wo['description']) ?></p>

                <div class="flex items-center justify-between pt-2 border-t border-[#334155] text-xs">
                    <span class="text-slate-400">الفني المسؤول: <strong class="text-slate-200"><?= htmlspecialchars($wo['assigned_to']) ?></strong></span>
                    <span class="px-2 py-0.5 rounded text-[11px] font-bold <?= $wo['status'] === 'IN_PROGRESS' ? 'text-amber-400 bg-amber-500/10' : ($wo['status'] === 'COMPLETED' ? 'text-emerald-400 bg-emerald-500/10' : 'text-blue-400 bg-blue-500/10') ?>">
                        <?= $wo['status'] === 'IN_PROGRESS' ? 'قيد التنفيذ الفني' : ($wo['status'] === 'COMPLETED' ? 'مكتمل ومعتمد' : 'بانتظار البدء') ?>
                    </span>
                </div>
            </div>
            <?php endforeach; ?>
        </div>
    </div>

    <!-- Central Utilities Status (1 Col) -->
    <div class="space-y-4">
        <div class="flex items-center justify-between">
            <h2 class="text-sm font-bold text-white flex items-center gap-2">
                <i data-lucide="gauge" class="w-4 h-4 text-cyan-400"></i>
                قراءات المحطات والعدادات المركزية
            </h2>
            <a href="meters.php" class="text-xs text-cyan-400 hover:text-cyan-300 font-bold">التفاصيل</a>
        </div>

        <div class="p-4 rounded-2xl bg-[#1e293b] border border-[#334155] space-y-4">
            <!-- Compressor -->
            <div class="flex items-center justify-between p-3 rounded-xl bg-[#0f172a] border border-[#334155]">
                <div class="flex items-center gap-2.5">
                    <div class="w-8 h-8 rounded-lg bg-blue-500/20 text-blue-400 flex items-center justify-center">
                        <i data-lucide="wind" class="w-4 h-4"></i>
                    </div>
                    <div>
                        <span class="text-xs font-bold text-white block">ضاغط أطلس كوبكو GA75</span>
                        <span class="text-[10px] text-slate-400">ضغط شبكة الهواء المضغوط</span>
                    </div>
                </div>
                <div class="text-left">
                    <span class="text-sm font-black text-cyan-400">7.8 Bar</span>
                    <span class="block text-[10px] text-emerald-400 font-bold">طبيعي ومثالي</span>
                </div>
            </div>

            <!-- Chiller -->
            <div class="flex items-center justify-between p-3 rounded-xl bg-[#0f172a] border border-[#334155]">
                <div class="flex items-center gap-2.5">
                    <div class="w-8 h-8 rounded-lg bg-cyan-500/20 text-cyan-400 flex items-center justify-center">
                        <i data-lucide="snowflake" class="w-4 h-4"></i>
                    </div>
                    <div>
                        <span class="text-xs font-bold text-white block">تشيلر Daikin 120TR</span>
                        <span class="text-[10px] text-slate-400">حرارة تبريد سلندرات الروتو</span>
                    </div>
                </div>
                <div class="text-left">
                    <span class="text-sm font-black text-blue-400">7.2 °C</span>
                    <span class="block text-[10px] text-emerald-400 font-bold">مستقر</span>
                </div>
            </div>

            <!-- Thermal Boiler -->
            <div class="flex items-center justify-between p-3 rounded-xl bg-[#0f172a] border border-[#334155]">
                <div class="flex items-center gap-2.5">
                    <div class="w-8 h-8 rounded-lg bg-amber-500/20 text-amber-400 flex items-center justify-center">
                        <i data-lucide="flame" class="w-4 h-4"></i>
                    </div>
                    <div>
                        <span class="text-xs font-bold text-white block">بويلر الزيت Bono Energia</span>
                        <span class="text-[10px] text-slate-400">حرارة تجفيف أفران الطباعة</span>
                    </div>
                </div>
                <div class="text-left">
                    <span class="text-sm font-black text-amber-400">238 °C</span>
                    <span class="block text-[10px] text-emerald-400 font-bold">ضغط 4.2 Bar</span>
                </div>
            </div>

            <!-- UPS Power -->
            <div class="flex items-center justify-between p-3 rounded-xl bg-[#0f172a] border border-[#334155]">
                <div class="flex items-center gap-2.5">
                    <div class="w-8 h-8 rounded-lg bg-purple-500/20 text-purple-400 flex items-center justify-center">
                        <i data-lucide="zap" class="w-4 h-4"></i>
                    </div>
                    <div>
                        <span class="text-xs font-bold text-white block">مغذي شنايدر UPS 80kVA</span>
                        <span class="text-[10px] text-slate-400">استقرار تردد جهد الكنترول</span>
                    </div>
                </div>
                <div class="text-left">
                    <span class="text-sm font-black text-purple-400">50.0 Hz</span>
                    <span class="block text-[10px] text-emerald-400 font-bold">شحن 98%</span>
                </div>
            </div>
        </div>
    </div>
</div>

<?php require_once __DIR__ . '/includes/footer.php'; ?>
