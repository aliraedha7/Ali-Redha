<?php
$pageTitle = 'الصيانة الوقائية الدورية (PM)';
require_once __DIR__ . '/config/db.php';

require_once __DIR__ . '/includes/header.php';

$pmTasks = [
    [
        'id' => 'PM-TASK-01',
        'code' => 'PM-ROTO-W01',
        'title' => 'تشحيم وتزييت محامل سلندرات سحب الفيلم في ماكينة الروتو',
        'machine' => 'Rotomec MW 80',
        'interval' => 'أسبوعي (Weekly)',
        'due_date' => '2026-09-12',
        'status' => 'PENDING',
        'technician' => 'م. حسام التميمي + فني حيدر كريم',
        'items_count' => 6
    ],
    [
        'id' => 'PM-TASK-02',
        'code' => 'PM-FLX-M01',
        'title' => 'معايرة حساسات الشد الرقمية وفحص حزام سير محرك CI الرئيسي',
        'machine' => 'Uteco Onyx CI',
        'interval' => 'شهري (Monthly)',
        'due_date' => '2026-09-15',
        'status' => 'IN_PROGRESS',
        'technician' => 'م. أحمد الجابري + فني وسام علي',
        'items_count' => 8
    ],
    [
        'id' => 'PM-TASK-03',
        'code' => 'PM-EXT-Q01',
        'title' => 'فحص حساسات حرارة سخانات برميل البثق وقياس استهلاك أمبير المحرك',
        'machine' => 'Macchi Extrusion 3-Layer',
        'interval' => 'ربع سنوي (Quarterly)',
        'due_date' => '2026-09-22',
        'status' => 'PENDING',
        'technician' => 'م. كريم عبدالحسين',
        'items_count' => 12
    ],
    [
        'id' => 'PM-TASK-04',
        'code' => 'PM-CMP-M02',
        'title' => 'استبدال فلتر الزيت وفلتر الهواء لضاغط أطلس كوبكو GA75',
        'machine' => 'Atlas Copco GA75 VSD+',
        'interval' => 'شهري (Monthly)',
        'due_date' => '2026-09-10',
        'status' => 'COMPLETED',
        'technician' => 'م. حسين عبد الأمير',
        'items_count' => 4
    ]
];
?>

<!-- Header -->
<div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2 border-b border-[#334155]">
    <div>
        <h1 class="text-xl font-black text-white flex items-center gap-2">
            <i data-lucide="calendar-check" class="w-5 h-5 text-blue-400"></i>
            خطط وجداول الصيانة الوقائية (Preventive Maintenance)
        </h1>
        <p class="text-xs text-slate-400 mt-0.5">
            برامج الصيانة المجدولة لمنع التوقفات المفاجئة ورفع جاهزية خطوط الإنتاج.
        </p>
    </div>

    <button onclick="showToast('تمت جدولة خطة الصيانة بنجاح')" class="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold shadow-lg shadow-blue-600/20 flex items-center gap-2 self-start sm:self-auto transition">
        <i data-lucide="plus" class="w-4 h-4"></i>
        <span>إنشاء خطة صيانة دورية</span>
    </button>
</div>

<!-- PM Tasks List -->
<div class="grid grid-cols-1 gap-4">
    <?php foreach ($pmTasks as $pm): ?>
    <div class="p-5 rounded-2xl bg-[#1e293b] border border-[#334155] hover:border-slate-500 transition space-y-3 shadow-sm">
        <div class="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
            <div class="space-y-1">
                <div class="flex items-center gap-2 flex-wrap">
                    <span class="font-mono text-xs font-bold text-cyan-400 bg-cyan-950/60 px-2 py-0.5 rounded border border-cyan-800/40"><?= htmlspecialchars($pm['code']) ?></span>
                    <span class="text-xs text-slate-400"><?= htmlspecialchars($pm['machine']) ?></span>
                    <span class="text-slate-500">•</span>
                    <span class="text-xs text-amber-300 font-bold"><?= htmlspecialchars($pm['interval']) ?></span>
                </div>
                <h3 class="text-sm font-bold text-white"><?= htmlspecialchars($pm['title']) ?></h3>
            </div>

            <span class="px-3 py-1 rounded-full text-xs font-bold self-start sm:self-auto <?= $pm['status'] === 'COMPLETED' ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' : ($pm['status'] === 'IN_PROGRESS' ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30' : 'bg-blue-500/20 text-blue-300 border border-blue-500/30') ?>">
                <?= $pm['status'] === 'COMPLETED' ? 'تم التنفيذ والاعتماد' : ($pm['status'] === 'IN_PROGRESS' ? 'قيد الإجراء الميداني' : 'مستحق قريباً') ?>
            </span>
        </div>

        <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-3 border-t border-[#334155] text-xs">
            <div class="flex items-center gap-4 text-slate-400">
                <span>تاريخ الاستحقاق: <strong class="text-white font-mono"><?= htmlspecialchars($pm['due_date']) ?></strong></span>
                <span>المسؤول: <strong class="text-slate-200"><?= htmlspecialchars($pm['technician']) ?></strong></span>
                <span>بنود الفحص: <span class="text-cyan-400 font-bold"><?= $pm['items_count'] ?> بنود</span></span>
            </div>

            <div class="flex items-center gap-2">
                <button onclick="showToast('تم اعتماد إكمال مهام الصيانة الوقائية')" class="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center gap-1">
                    <i data-lucide="check" class="w-3.5 h-3.5"></i>
                    <span>اعتماد الفحص</span>
                </button>
            </div>
        </div>
    </div>
    <?php endforeach; ?>
</div>

<?php require_once __DIR__ . '/includes/footer.php'; ?>
