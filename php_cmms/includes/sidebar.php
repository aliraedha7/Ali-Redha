<?php
$currentPage = basename($_SERVER['PHP_SELF']);
?>
<aside class="w-64 bg-[#0f172a] border-l border-[#334155] flex flex-col justify-between p-4 hidden md:flex no-print">
    <div class="space-y-6">
        <!-- Navigation Section -->
        <div>
            <span class="text-[10px] font-bold text-slate-400 uppercase tracking-wider px-3 block mb-2">أقسام الصيانة والعمليات</span>
            <nav class="space-y-1">
                <a href="index.php" class="flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-bold transition <?= $currentPage === 'index.php' ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/20' : 'text-slate-300 hover:bg-[#1e293b] hover:text-white' ?>">
                    <i data-lucide="layout-dashboard" class="w-4 h-4"></i>
                    <span>لوحة التحكم الرئيسية</span>
                </a>
                <a href="work_orders.php" class="flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-bold transition <?= $currentPage === 'work_orders.php' ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/20' : 'text-slate-300 hover:bg-[#1e293b] hover:text-white' ?>">
                    <i data-lucide="clipboard-list" class="w-4 h-4"></i>
                    <span>أوامر العمل والصيانة</span>
                    <?php if (isset($activeWOCount) && $activeWOCount > 0): ?>
                        <span class="mr-auto px-1.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30"><?= $activeWOCount ?></span>
                    <?php endif; ?>
                </a>
                <a href="shift_reports.php" class="flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-bold transition <?= $currentPage === 'shift_reports.php' ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/20' : 'text-slate-300 hover:bg-[#1e293b] hover:text-white' ?>">
                    <i data-lucide="clock" class="w-4 h-4"></i>
                    <span>تقرير الدوريات والورديات</span>
                </a>
                <a href="equipment.php" class="flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-bold transition <?= $currentPage === 'equipment.php' ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/20' : 'text-slate-300 hover:bg-[#1e293b] hover:text-white' ?>">
                    <i data-lucide="cog" class="w-4 h-4"></i>
                    <span>الماكينات والمعدات</span>
                </a>
                <a href="preventive_maintenance.php" class="flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-bold transition <?= $currentPage === 'preventive_maintenance.php' ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/20' : 'text-slate-300 hover:bg-[#1e293b] hover:text-white' ?>">
                    <i data-lucide="calendar-check" class="w-4 h-4"></i>
                    <span>الصيانة الوقائية (PM)</span>
                </a>
                <a href="inventory.php" class="flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-bold transition <?= $currentPage === 'inventory.php' ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/20' : 'text-slate-300 hover:bg-[#1e293b] hover:text-white' ?>">
                    <i data-lucide="package" class="w-4 h-4"></i>
                    <span>المستودع وقطع الغيار</span>
                </a>
                <a href="meters.php" class="flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-bold transition <?= $currentPage === 'meters.php' ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/20' : 'text-slate-300 hover:bg-[#1e293b] hover:text-white' ?>">
                    <i data-lucide="gauge" class="w-4 h-4"></i>
                    <span>العدادات والمحطات المركزية</span>
                </a>
                <a href="team.php" class="flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-bold transition <?= $currentPage === 'team.php' ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/20' : 'text-slate-300 hover:bg-[#1e293b] hover:text-white' ?>">
                    <i data-lucide="users" class="w-4 h-4"></i>
                    <span>فريق الصيانة والمهندسين</span>
                </a>
            </nav>
        </div>

        <!-- Factory Status Card -->
        <div class="p-3.5 rounded-2xl bg-[#1e293b]/70 border border-[#334155] space-y-2">
            <div class="flex items-center justify-between text-[11px]">
                <span class="text-slate-400">حالة خطوط الإنتاج:</span>
                <span class="text-emerald-400 font-bold flex items-center gap-1">
                    <span class="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                    95.4% تشغيلي
                </span>
            </div>
            <div class="w-full h-1.5 rounded-full bg-slate-800 overflow-hidden">
                <div class="h-full bg-gradient-to-r from-emerald-500 to-cyan-400 rounded-full" style="width: 95.4%"></div>
            </div>
            <p class="text-[10px] text-slate-400 leading-tight">جميع قاعات الروتو، الفليكسو، والأكياس في حدود الكفاءة القياسية.</p>
        </div>
    </div>

    <!-- Quick Export / Database Link Info -->
    <div class="pt-4 border-t border-[#334155] space-y-2">
        <a href="database/schema.sql" download class="w-full flex items-center justify-center gap-2 py-2 px-3 rounded-xl bg-purple-600/20 hover:bg-purple-600/30 text-purple-300 border border-purple-500/30 text-xs font-bold transition">
            <i data-lucide="database" class="w-4 h-4"></i>
            <span>تحميل schema.sql للـ MySQL</span>
        </a>
        <div class="text-center text-[10px] text-slate-400">
            معمل المرجان • بغداد، العراق
        </div>
    </div>
</aside>
