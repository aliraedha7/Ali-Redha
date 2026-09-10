<?php
$pageTitle = 'العدادات والمحطات المركزية';
require_once __DIR__ . '/config/db.php';

require_once __DIR__ . '/includes/header.php';
?>

<!-- Header -->
<div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2 border-b border-[#334155]">
    <div>
        <h1 class="text-xl font-black text-white flex items-center gap-2">
            <i data-lucide="gauge" class="w-5 h-5 text-cyan-400"></i>
            محطات الخدمات والعدادات المركزية
        </h1>
        <p class="text-xs text-slate-400 mt-0.5">
            مراقبة الضواغط، التشيلرات، مراجل الزيت الحراري، محطات التحلية، ومغذيات الـ UPS.
        </p>
    </div>

    <div class="flex items-center gap-2 text-xs">
        <span class="px-3 py-1.5 rounded-xl bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 font-bold flex items-center gap-1.5">
            <span class="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
            الاتصال بالعدادات: متصل ومباشر
        </span>
    </div>
</div>

<!-- Grid of Utility Stations -->
<div class="grid grid-cols-1 md:grid-cols-2 gap-4">

    <!-- Station 1: Air Compressor -->
    <div class="p-5 rounded-2xl bg-[#1e293b] border border-[#334155] space-y-4 shadow-sm">
        <div class="flex items-center justify-between border-b border-[#334155] pb-3">
            <div class="flex items-center gap-3">
                <div class="w-10 h-10 rounded-xl bg-blue-500/20 text-blue-400 flex items-center justify-center">
                    <i data-lucide="wind" class="w-5 h-5"></i>
                </div>
                <div>
                    <h3 class="text-sm font-bold text-white">محطة ضواغط الهواء المركزية</h3>
                    <span class="text-xs text-slate-400">Atlas Copco GA75 VSD+ (75 kW)</span>
                </div>
            </div>
            <span class="px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-500/20 text-emerald-400">عامل بكفاءة</span>
        </div>

        <div class="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
            <div class="p-3 rounded-xl bg-[#0f172a] border border-[#334155]">
                <span class="text-[10px] text-slate-400 block">ضغط الشبكة الرئيسي</span>
                <span class="text-base font-black text-cyan-400">7.8 Bar</span>
                <span class="text-[9px] text-emerald-400 block mt-0.5">نطاق (7.0 - 8.5)</span>
            </div>
            <div class="p-3 rounded-xl bg-[#0f172a] border border-[#334155]">
                <span class="text-[10px] text-slate-400 block">حرارة عنصر الضغط</span>
                <span class="text-base font-black text-white">82 °C</span>
                <span class="text-[9px] text-emerald-400 block mt-0.5">أقصى حد 105</span>
            </div>
            <div class="p-3 rounded-xl bg-[#0f172a] border border-[#334155]">
                <span class="text-[10px] text-slate-400 block">ساعات التشغيل</span>
                <span class="text-base font-black text-amber-400">14,280 h</span>
                <span class="text-[9px] text-slate-400 block mt-0.5">صيانة دورية قريبة</span>
            </div>
            <div class="p-3 rounded-xl bg-[#0f172a] border border-[#334155]">
                <span class="text-[10px] text-slate-400 block">مجفف الهواء Refrigerant</span>
                <span class="text-base font-black text-emerald-400">3.1 °C</span>
                <span class="text-[9px] text-emerald-400 block mt-0.5">نقطة الندى Dewpoint</span>
            </div>
        </div>
    </div>

    <!-- Station 2: Chiller -->
    <div class="p-5 rounded-2xl bg-[#1e293b] border border-[#334155] space-y-4 shadow-sm">
        <div class="flex items-center justify-between border-b border-[#334155] pb-3">
            <div class="flex items-center gap-3">
                <div class="w-10 h-10 rounded-xl bg-cyan-500/20 text-cyan-400 flex items-center justify-center">
                    <i data-lucide="snowflake" class="w-5 h-5"></i>
                </div>
                <div>
                    <h3 class="text-sm font-bold text-white">محطة التبريد المركزي (التشيلر)</h3>
                    <span class="text-xs text-slate-400">Daikin Applied 120TR (EWAD-TZ)</span>
                </div>
            </div>
            <span class="px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-500/20 text-emerald-400">عامل بكفاءة</span>
        </div>

        <div class="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
            <div class="p-3 rounded-xl bg-[#0f172a] border border-[#334155]">
                <span class="text-[10px] text-slate-400 block">حرارة مياه الخروج</span>
                <span class="text-base font-black text-cyan-400">7.2 °C</span>
                <span class="text-[9px] text-emerald-400 block mt-0.5">المستهدف 7.0 °C</span>
            </div>
            <div class="p-3 rounded-xl bg-[#0f172a] border border-[#334155]">
                <span class="text-[10px] text-slate-400 block">حرارة مياه الرجوع</span>
                <span class="text-base font-black text-white">12.8 °C</span>
                <span class="text-[9px] text-slate-400 block mt-0.5">فرق درجات ΔT 5.6</span>
            </div>
            <div class="p-3 rounded-xl bg-[#0f172a] border border-[#334155]">
                <span class="text-[10px] text-slate-400 block">ضغط وسيط التبريد</span>
                <span class="text-base font-black text-blue-400">14.2 Bar</span>
                <span class="text-[9px] text-emerald-400 block mt-0.5">R134a سليم</span>
            </div>
            <div class="p-3 rounded-xl bg-[#0f172a] border border-[#334155]">
                <span class="text-[10px] text-slate-400 block">حالة مضخات التدوير</span>
                <span class="text-base font-black text-emerald-400">Pump 1 ON</span>
                <span class="text-[9px] text-slate-400 block mt-0.5">Pump 2 Standby</span>
            </div>
        </div>
    </div>

    <!-- Station 3: Thermal Boiler -->
    <div class="p-5 rounded-2xl bg-[#1e293b] border border-[#334155] space-y-4 shadow-sm">
        <div class="flex items-center justify-between border-b border-[#334155] pb-3">
            <div class="flex items-center gap-3">
                <div class="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center">
                    <i data-lucide="flame" class="w-5 h-5"></i>
                </div>
                <div>
                    <h3 class="text-sm font-bold text-white">مرجل الزيت الحراري (Thermal Boiler)</h3>
                    <span class="text-xs text-slate-400">Bono Energia OMV 1200 (1,200,000 kcal)</span>
                </div>
            </div>
            <span class="px-2.5 py-1 rounded-full text-xs font-bold bg-amber-500/20 text-amber-400">تسخين أفران</span>
        </div>

        <div class="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
            <div class="p-3 rounded-xl bg-[#0f172a] border border-[#334155]">
                <span class="text-[10px] text-slate-400 block">حرارة الزيت الخارج</span>
                <span class="text-base font-black text-amber-400">238 °C</span>
                <span class="text-[9px] text-emerald-400 block mt-0.5">المستهدف 240 °C</span>
            </div>
            <div class="p-3 rounded-xl bg-[#0f172a] border border-[#334155]">
                <span class="text-[10px] text-slate-400 block">حرارة الزيت الراجع</span>
                <span class="text-base font-black text-white">212 °C</span>
                <span class="text-[9px] text-slate-400 block mt-0.5">تفريغ حراري سليم</span>
            </div>
            <div class="p-3 rounded-xl bg-[#0f172a] border border-[#334155]">
                <span class="text-[10px] text-slate-400 block">ضغط مضخة الزيت</span>
                <span class="text-base font-black text-blue-400">4.2 Bar</span>
                <span class="text-[9px] text-emerald-400 block mt-0.5">مستقر</span>
            </div>
            <div class="p-3 rounded-xl bg-[#0f172a] border border-[#334155]">
                <span class="text-[10px] text-slate-400 block">لهب الحراق (Burner)</span>
                <span class="text-base font-black text-emerald-400">Stage 2</span>
                <span class="text-[9px] text-slate-400 block mt-0.5">Riello الغاز الطبيعي</span>
            </div>
        </div>
    </div>

    <!-- Station 4: Schneider UPS -->
    <div class="p-5 rounded-2xl bg-[#1e293b] border border-[#334155] space-y-4 shadow-sm">
        <div class="flex items-center justify-between border-b border-[#334155] pb-3">
            <div class="flex items-center gap-3">
                <div class="w-10 h-10 rounded-xl bg-purple-500/20 text-purple-400 flex items-center justify-center">
                    <i data-lucide="zap" class="w-5 h-5"></i>
                </div>
                <div>
                    <h3 class="text-sm font-bold text-white">مغذي الطاقة غير المنقطعة المركزي (UPS)</h3>
                    <span class="text-xs text-slate-400">Schneider Electric Galaxy 300 (80 kVA)</span>
                </div>
            </div>
            <span class="px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-500/20 text-emerald-400">شحن 98%</span>
        </div>

        <div class="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
            <div class="p-3 rounded-xl bg-[#0f172a] border border-[#334155]">
                <span class="text-[10px] text-slate-400 block">تردد الجهد الخارج</span>
                <span class="text-base font-black text-purple-400">50.0 Hz</span>
                <span class="text-[9px] text-emerald-400 block mt-0.5">ثابت ودقيق</span>
            </div>
            <div class="p-3 rounded-xl bg-[#0f172a] border border-[#334155]">
                <span class="text-[10px] text-slate-400 block">نسبة الحمل (Load %)</span>
                <span class="text-base font-black text-white">62 %</span>
                <span class="text-[9px] text-slate-400 block mt-0.5">49.6 kW</span>
            </div>
            <div class="p-3 rounded-xl bg-[#0f172a] border border-[#334155]">
                <span class="text-[10px] text-slate-400 block">جهد الخرج Phase-N</span>
                <span class="text-base font-black text-cyan-400">230.4 V</span>
                <span class="text-[9px] text-emerald-400 block mt-0.5">± 1% تنظيم</span>
            </div>
            <div class="p-3 rounded-xl bg-[#0f172a] border border-[#334155]">
                <span class="text-[10px] text-slate-400 block">زمن البطاريات المتبقي</span>
                <span class="text-base font-black text-emerald-400">45 دقيقة</span>
                <span class="text-[9px] text-slate-400 block mt-0.5">في حال انقطاع الشبكة</span>
            </div>
        </div>
    </div>

</div>

<?php require_once __DIR__ . '/includes/footer.php'; ?>
