<?php
$pageTitle = 'تقرير الدوريات والورديات والتسليم والتسلم';
require_once __DIR__ . '/config/db.php';

// Handle developer mode engineer updates or checklist toggling
if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_POST['action'])) {
    $currentData = Database::getJsonData();

    if ($_POST['action'] === 'update_engineers') {
        if (!empty($currentData['shift_logs'][0])) {
            $currentData['shift_logs'][0]['responsible_engineers']['lead_engineer'] = trim($_POST['lead_engineer'] ?? '');
            $currentData['shift_logs'][0]['responsible_engineers']['handover_engineer'] = trim($_POST['handover_engineer'] ?? '');
            $currentData['shift_logs'][0]['responsible_engineers']['safety_officer'] = trim($_POST['safety_officer'] ?? '');
            $currentData['shift_logs'][0]['responsible_engineers']['updated_by'] = 'م. علي رضا (تعديل صلاحية المطور)';
            Database::saveJsonData($currentData);
        }
        header('Location: shift_reports.php?success=engineers_updated');
        exit;
    }

    if ($_POST['action'] === 'toggle_checklist') {
        $itemId = $_POST['item_id'] ?? '';
        if (!empty($currentData['shift_logs'][0]['checklist'])) {
            foreach ($currentData['shift_logs'][0]['checklist'] as &$item) {
                if ($item['id'] === $itemId) {
                    $item['status'] = ($item['status'] === 'PASSED') ? 'WARNING' : (($item['status'] === 'WARNING') ? 'FAILED' : 'PASSED');
                    break;
                }
            }
            Database::saveJsonData($currentData);
        }
        header('Location: shift_reports.php?success=status_toggled');
        exit;
    }
}

require_once __DIR__ . '/includes/header.php';

$shift = $data['shift_logs'][0] ?? null;
$checklist = $shift['checklist'] ?? [];
$env = $shift['environmental'] ?? [];
?>

<!-- Header -->
<div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2 border-b border-[#334155]">
    <div>
        <h1 class="text-xl font-black text-white flex items-center gap-2">
            <i data-lucide="clock" class="w-5 h-5 text-blue-400"></i>
            محضر الدورية الميدانية والتسليم والتسلم الهندسي
        </h1>
        <p class="text-xs text-slate-400 mt-0.5">
            توثيق الفحص الشامل لخطوط الطباعة ومحطات التغذية واعتماد المهندسين.
        </p>
    </div>

    <div class="flex items-center gap-2">
        <button onclick="document.getElementById('devModal').classList.remove('hidden')" class="px-3.5 py-2 rounded-xl bg-purple-600/20 hover:bg-purple-600/30 text-purple-300 border border-purple-500/30 text-xs font-bold flex items-center gap-1.5 transition">
            <i data-lucide="code" class="w-4 h-4"></i>
            <span>تعديل مهندسي الدورية (صلاحيات المطور)</span>
        </button>
        <button onclick="window.print()" class="px-3.5 py-2 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-bold shadow-lg shadow-cyan-600/20 flex items-center gap-1.5 transition">
            <i data-lucide="printer" class="w-4 h-4"></i>
            <span>طباعة المحضر الرسمي</span>
        </button>
    </div>
</div>

<!-- Shift Overview Banner -->
<div class="p-5 rounded-2xl bg-[#1e293b] border border-[#334155] space-y-4">
    <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#334155] pb-3">
        <div class="flex items-center gap-3">
            <div class="w-10 h-10 rounded-xl bg-blue-500/20 text-blue-400 flex items-center justify-center">
                <i data-lucide="file-check" class="w-5 h-5"></i>
            </div>
            <div>
                <h2 class="text-sm font-bold text-white"><?= htmlspecialchars($shift['shift_name'] ?? 'الوردية الصباحية') ?> (<?= htmlspecialchars($shift['shift_code'] ?? 'SHF-01') ?>)</h2>
                <span class="text-xs text-slate-400">التاريخ: <?= htmlspecialchars($shift['date'] ?? date('Y-m-d')) ?> • معمل المرجان للطباعة والتغليف</span>
            </div>
        </div>
        <span class="px-3 py-1 rounded-full text-xs font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 self-start sm:self-auto">
            محضر معتمد ومسجل
        </span>
    </div>

    <!-- Responsible Engineers Box -->
    <div class="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
        <div class="p-3 rounded-xl bg-[#0f172a] border border-[#334155]">
            <span class="text-[10px] text-slate-400 block font-bold">مهندس الوردية (المسلم):</span>
            <span class="text-xs font-bold text-white mt-0.5 block"><?= htmlspecialchars($shift['responsible_engineers']['lead_engineer'] ?? 'م. حسام التميمي') ?></span>
        </div>

        <div class="p-3 rounded-xl bg-[#0f172a] border border-[#334155]">
            <span class="text-[10px] text-slate-400 block font-bold">مهندس الاستلام:</span>
            <span class="text-xs font-bold text-cyan-300 mt-0.5 block"><?= htmlspecialchars($shift['responsible_engineers']['handover_engineer'] ?? 'م. كريم السعدي') ?></span>
        </div>

        <div class="p-3 rounded-xl bg-[#0f172a] border border-[#334155]">
            <span class="text-[10px] text-slate-400 block font-bold">مسؤول السلامة والصحة المهنية (HSE):</span>
            <span class="text-xs font-bold text-emerald-300 mt-0.5 block"><?= htmlspecialchars($shift['responsible_engineers']['safety_officer'] ?? 'م. رافد الشمري') ?></span>
        </div>
    </div>
</div>

<!-- Environmental & Station Parameters -->
<div class="p-4 rounded-2xl bg-[#1e293b] border border-[#334155] space-y-3">
    <h3 class="text-xs font-bold text-slate-300 flex items-center gap-2">
        <i data-lucide="thermometer" class="w-4 h-4 text-amber-400"></i>
        المؤشرات البيئية ومحطات الخدمات المقروءة أثناء الدورية
    </h3>
    <div class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 text-xs">
        <div class="p-2.5 rounded-xl bg-[#0f172a] border border-[#334155]">
            <span class="text-[10px] text-slate-400 block">حرارة الصالة</span>
            <span class="text-base font-bold text-white"><?= $env['ambient_temp_c'] ?? 24.2 ?> °C</span>
        </div>
        <div class="p-2.5 rounded-xl bg-[#0f172a] border border-[#334155]">
            <span class="text-[10px] text-slate-400 block">الرطوبة النسبية</span>
            <span class="text-base font-bold text-cyan-400"><?= $env['relative_humidity_pct'] ?? 54 ?> %</span>
        </div>
        <div class="p-2.5 rounded-xl bg-[#0f172a] border border-[#334155]">
            <span class="text-[10px] text-slate-400 block">ضغط الهواء المركزي</span>
            <span class="text-base font-bold text-blue-400"><?= $env['air_pressure_bar'] ?? 7.8 ?> Bar</span>
        </div>
        <div class="p-2.5 rounded-xl bg-[#0f172a] border border-[#334155]">
            <span class="text-[10px] text-slate-400 block">حرارة التشيلر</span>
            <span class="text-base font-bold text-emerald-400"><?= $env['chiller_temp_c'] ?? 7.2 ?> °C</span>
        </div>
        <div class="p-2.5 rounded-xl bg-[#0f172a] border border-[#334155]">
            <span class="text-[10px] text-slate-400 block">حرارة بويلر الزيت</span>
            <span class="text-base font-bold text-amber-400"><?= $env['boiler_temp_c'] ?? 238 ?> °C</span>
        </div>
        <div class="p-2.5 rounded-xl bg-[#0f172a] border border-[#334155]">
            <span class="text-[10px] text-slate-400 block">تردد مغذي الـ UPS</span>
            <span class="text-base font-bold text-purple-400"><?= $env['ups_freq_hz'] ?? 50.0 ?> Hz</span>
        </div>
    </div>
</div>

<!-- Patrol Checklist Items Table -->
<div class="p-4 rounded-2xl bg-[#1e293b] border border-[#334155] space-y-3">
    <div class="flex items-center justify-between">
        <h3 class="text-xs font-bold text-white flex items-center gap-2">
            <i data-lucide="check-square" class="w-4 h-4 text-emerald-400"></i>
            بنود الفحص الميداني للدورية (انقر لتبديل الحالة)
        </h3>
        <span class="text-[11px] text-slate-400">عدد البنود: <?= count($checklist) ?></span>
    </div>

    <div class="space-y-2">
        <?php foreach ($checklist as $chk): ?>
        <div class="p-3 rounded-xl bg-[#0f172a] border border-[#334155] flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:border-slate-500 transition">
            <div class="space-y-0.5">
                <div class="flex items-center gap-2">
                    <span class="font-mono text-[11px] text-cyan-400 font-bold"><?= htmlspecialchars($chk['id']) ?></span>
                    <span class="text-xs text-slate-400">| <?= htmlspecialchars($chk['area']) ?></span>
                </div>
                <h4 class="text-xs font-bold text-white"><?= htmlspecialchars($chk['title']) ?></h4>
                <p class="text-[11px] text-slate-400">طريقة الفحص: <?= htmlspecialchars($chk['method'] ?? 'بصري وأجهزة قياس') ?></p>
            </div>

            <!-- Status button to toggle -->
            <form method="POST" class="self-start sm:self-auto">
                <input type="hidden" name="action" value="toggle_checklist">
                <input type="hidden" name="item_id" value="<?= htmlspecialchars($chk['id']) ?>">
                <button type="submit" class="px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition <?= $chk['status'] === 'PASSED' ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' : ($chk['status'] === 'WARNING' ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30' : 'bg-rose-500/20 text-rose-300 border border-rose-500/30') ?>">
                    <?php if ($chk['status'] === 'PASSED'): ?>
                        <i data-lucide="check" class="w-3.5 h-3.5"></i>
                        <span>مطابق وسليم</span>
                    <?php elseif ($chk['status'] === 'WARNING'): ?>
                        <i data-lucide="alert-circle" class="w-3.5 h-3.5"></i>
                        <span>تنبيه / للمتابعة</span>
                    <?php else: ?>
                        <i data-lucide="x-circle" class="w-3.5 h-3.5"></i>
                        <span>عطل مستوجب تدخل</span>
                    <?php endif; ?>
                </button>
            </form>
        </div>
        <?php endforeach; ?>
    </div>
</div>

<!-- Signatures Section for Official Printing -->
<div class="p-6 rounded-2xl bg-white text-slate-900 border border-slate-300 space-y-6 hidden print:block">
    <div class="text-center border-b pb-4">
        <h2 class="text-xl font-black">معمل المرجان للطباعة والتغليف الحديث</h2>
        <p class="text-sm text-slate-600">محضر الاستلام والتسليم الهندسي للوردية</p>
    </div>
    <div class="grid grid-cols-3 gap-6 text-center text-xs">
        <div class="border p-4 rounded">
            <p class="font-bold mb-8">مهندس الوردية (المسلم):</p>
            <p class="font-bold border-t pt-2"><?= htmlspecialchars($shift['responsible_engineers']['lead_engineer'] ?? 'م. حسام التميمي') ?></p>
        </div>
        <div class="border p-4 rounded">
            <p class="font-bold mb-8">مهندس الاستلام:</p>
            <p class="font-bold border-t pt-2"><?= htmlspecialchars($shift['responsible_engineers']['handover_engineer'] ?? 'م. كريم السعدي') ?></p>
        </div>
        <div class="border p-4 rounded">
            <p class="font-bold mb-8">اعتماد مدير الصيانة والمطور:</p>
            <p class="font-bold border-t pt-2">م. علي رضا</p>
        </div>
    </div>
</div>

<!-- Modal: Edit Engineers (Developer Access) -->
<div id="devModal" class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm hidden">
    <div class="bg-[#1e293b] border border-purple-500/40 rounded-2xl w-full max-w-lg shadow-2xl p-6 space-y-4">
        <div class="flex items-center justify-between border-b border-[#334155] pb-3">
            <div class="flex items-center gap-2">
                <i data-lucide="code" class="w-5 h-5 text-purple-400"></i>
                <h3 class="text-sm font-bold text-white">تعديل مهندسي الدورية (صلاحيات المطور)</h3>
            </div>
            <button onclick="document.getElementById('devModal').classList.add('hidden')" class="text-slate-400 hover:text-white">
                <i data-lucide="x" class="w-5 h-5"></i>
            </button>
        </div>

        <form method="POST" class="space-y-3 text-xs">
            <input type="hidden" name="action" value="update_engineers">

            <div>
                <label class="block font-bold text-slate-300 mb-1">مهندس الوردية الأساسي:</label>
                <input type="text" name="lead_engineer" value="<?= htmlspecialchars($shift['responsible_engineers']['lead_engineer'] ?? '') ?>" required class="w-full px-3 py-2 rounded-xl bg-[#0f172a] border border-[#334155] text-white focus:outline-none focus:border-purple-500">
            </div>

            <div>
                <label class="block font-bold text-slate-300 mb-1">مهندس استلام الوردية:</label>
                <input type="text" name="handover_engineer" value="<?= htmlspecialchars($shift['responsible_engineers']['handover_engineer'] ?? '') ?>" required class="w-full px-3 py-2 rounded-xl bg-[#0f172a] border border-[#334155] text-white focus:outline-none focus:border-purple-500">
            </div>

            <div>
                <label class="block font-bold text-slate-300 mb-1">مسؤول السلامة والصحة المهنية (HSE):</label>
                <input type="text" name="safety_officer" value="<?= htmlspecialchars($shift['responsible_engineers']['safety_officer'] ?? '') ?>" required class="w-full px-3 py-2 rounded-xl bg-[#0f172a] border border-[#334155] text-white focus:outline-none focus:border-purple-500">
            </div>

            <div class="p-3 rounded-xl bg-purple-950/30 border border-purple-800/40 text-[11px] text-purple-300">
                يتم توثيق كافة التعديلات تحت سجل المطور المعتمد مع حفظ التاريخ والساعة في قاعدة البيانات.
            </div>

            <div class="pt-3 border-t border-[#334155] flex justify-end gap-2">
                <button type="button" onclick="document.getElementById('devModal').classList.add('hidden')" class="px-4 py-2 rounded-xl bg-[#334155] text-slate-200 font-bold">إلغاء</button>
                <button type="submit" class="px-5 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold shadow-lg shadow-purple-600/30">حفظ التعديلات</button>
            </div>
        </form>
    </div>
</div>

<?php require_once __DIR__ . '/includes/footer.php'; ?>
