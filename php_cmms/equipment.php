<?php
$pageTitle = 'الماكينات وخطوط الإنتاج';
require_once __DIR__ . '/config/db.php';

// Handle adding new machine
if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_POST['action']) && $_POST['action'] === 'add_machine') {
    $currentData = Database::getJsonData();
    $newEq = [
        'id' => 'EQ-' . strtoupper(substr(md5(uniqid()), 0, 6)),
        'code' => trim($_POST['code'] ?? 'EQ-NEW'),
        'name' => trim($_POST['name'] ?? 'ماكينة جديدة'),
        'hall_id' => $_POST['hall_id'] ?? 'HALL-ROTO',
        'hall_name' => $_POST['hall_name'] ?? 'قاعة الإنتاج',
        'status' => $_POST['status'] ?? 'OPERATIONAL',
        'manufacturer' => trim($_POST['manufacturer'] ?? 'Generic'),
        'model' => trim($_POST['model'] ?? 'Standard'),
        'power_kw' => floatval($_POST['power_kw'] ?? 50),
        'last_maintenance' => date('Y-m-d'),
        'next_pm' => date('Y-m-d', strtotime('+30 days'))
    ];
    $currentData['equipment'][] = $newEq;
    Database::saveJsonData($currentData);
    header('Location: equipment.php?success=machine_added');
    exit;
}

require_once __DIR__ . '/includes/header.php';

$equipmentList = $data['equipment'] ?? [];
$selectedHall = $_GET['hall'] ?? 'ALL';

$filteredEquipment = array_filter($equipmentList, function($eq) use ($selectedHall) {
    if ($selectedHall === 'ALL') return true;
    return ($eq['hall_id'] ?? '') === $selectedHall;
});
?>

<!-- Header -->
<div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2 border-b border-[#334155]">
    <div>
        <h1 class="text-xl font-black text-white flex items-center gap-2">
            <i data-lucide="cog" class="w-5 h-5 text-blue-400"></i>
            سجل الماكينات والمعدات الصناعية
        </h1>
        <p class="text-xs text-slate-400 mt-0.5">
            إدارة كافة أصول معمل المرجان، المواصفات الفنية، وجاهزية خطوط الطباعة والتغليف.
        </p>
    </div>

    <button onclick="document.getElementById('newMachineModal').classList.remove('hidden')" class="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold shadow-lg shadow-blue-600/20 flex items-center gap-2 self-start sm:self-auto transition">
        <i data-lucide="plus" class="w-4 h-4"></i>
        <span>إضافة ماكينة / خط جديد</span>
    </button>
</div>

<!-- Hall Filter Tabs -->
<div class="flex items-center gap-2 overflow-x-auto pb-1 text-xs">
    <a href="equipment.php" class="px-3 py-1.5 rounded-xl font-bold transition <?= $selectedHall === 'ALL' ? 'bg-blue-600 text-white' : 'bg-[#1e293b] text-slate-300 hover:bg-slate-700' ?>">
        كافة القاعات (<?= count($equipmentList) ?>)
    </a>
    <?php foreach ($data['hangars'] as $h): ?>
        <a href="equipment.php?hall=<?= urlencode($h['id']) ?>" class="px-3 py-1.5 rounded-xl font-bold whitespace-nowrap transition <?= $selectedHall === $h['id'] ? 'bg-blue-600 text-white' : 'bg-[#1e293b] text-slate-300 hover:bg-slate-700' ?>">
            <?= htmlspecialchars($h['name']) ?>
        </a>
    <?php endforeach; ?>
</div>

<!-- Equipment Grid -->
<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
    <?php foreach ($filteredEquipment as $eq): ?>
    <div class="p-5 rounded-2xl bg-[#1e293b] border border-[#334155] hover:border-slate-500 transition space-y-4 shadow-sm flex flex-col justify-between">
        <div class="space-y-2">
            <div class="flex items-start justify-between gap-2">
                <span class="font-mono text-xs font-bold text-cyan-400 bg-cyan-950/60 px-2 py-0.5 rounded border border-cyan-800/40">
                    <?= htmlspecialchars($eq['code']) ?>
                </span>
                <span class="px-2 py-0.5 rounded-full text-[10px] font-bold <?= $eq['status'] === 'OPERATIONAL' ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' : 'bg-amber-500/20 text-amber-300 border border-amber-500/30' ?>">
                    <?= $eq['status'] === 'OPERATIONAL' ? 'عاملة بكفاءة' : 'مطلوب صيانة' ?>
                </span>
            </div>

            <h3 class="text-sm font-bold text-white"><?= htmlspecialchars($eq['name']) ?></h3>
            <p class="text-xs text-slate-400"><?= htmlspecialchars($eq['hall_name'] ?? 'قاعة الإنتاج') ?></p>
        </div>

        <!-- Technical Specs -->
        <div class="grid grid-cols-2 gap-2 text-xs bg-[#0f172a] p-3 rounded-xl border border-[#334155]">
            <div>
                <span class="text-[10px] text-slate-400 block">الشركة المصنعة:</span>
                <span class="text-slate-200 font-bold"><?= htmlspecialchars($eq['manufacturer'] ?? '-') ?></span>
            </div>
            <div>
                <span class="text-[10px] text-slate-400 block">الموديل والطراز:</span>
                <span class="text-slate-200 font-bold"><?= htmlspecialchars($eq['model'] ?? '-') ?></span>
            </div>
            <div>
                <span class="text-[10px] text-slate-400 block">القدرة الكهربائية:</span>
                <span class="text-amber-400 font-bold"><?= $eq['power_kw'] ?? 0 ?> kW</span>
            </div>
            <div>
                <span class="text-[10px] text-slate-400 block">الصيانة الدورية القادمة:</span>
                <span class="text-blue-400 font-bold"><?= $eq['next_pm'] ?? '2026-09-30' ?></span>
            </div>
        </div>

        <!-- Footer Action -->
        <div class="pt-2 border-t border-[#334155] flex items-center justify-between text-xs">
            <span class="text-[11px] text-slate-400">آخر صيانة: <?= $eq['last_maintenance'] ?? '-' ?></span>
            <a href="work_orders.php?action=new" class="text-blue-400 hover:text-blue-300 font-bold flex items-center gap-1">
                <i data-lucide="wrench" class="w-3.5 h-3.5"></i>
                <span>طلب صيانة</span>
            </a>
        </div>
    </div>
    <?php endforeach; ?>
</div>

<!-- Modal: New Machine -->
<div id="newMachineModal" class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm hidden">
    <div class="bg-[#1e293b] border border-blue-500/40 rounded-2xl w-full max-w-lg shadow-2xl p-6 space-y-4">
        <div class="flex items-center justify-between border-b border-[#334155] pb-3">
            <div class="flex items-center gap-2">
                <i data-lucide="plus-circle" class="w-5 h-5 text-blue-400"></i>
                <h3 class="text-sm font-bold text-white">إضافة ماكينة أو أصل صناعي جديد</h3>
            </div>
            <button onclick="document.getElementById('newMachineModal').classList.add('hidden')" class="text-slate-400 hover:text-white">
                <i data-lucide="x" class="w-5 h-5"></i>
            </button>
        </div>

        <form method="POST" class="space-y-3 text-xs">
            <input type="hidden" name="action" value="add_machine">

            <div class="grid grid-cols-2 gap-3">
                <div>
                    <label class="block font-bold text-slate-300 mb-1">كود الماكينة:</label>
                    <input type="text" name="code" required placeholder="مثال: ROTO-02" class="w-full px-3 py-2 rounded-xl bg-[#0f172a] border border-[#334155] text-white focus:outline-none focus:border-blue-500">
                </div>
                <div>
                    <label class="block font-bold text-slate-300 mb-1">القاعة:</label>
                    <select name="hall_id" class="w-full px-3 py-2 rounded-xl bg-[#0f172a] border border-[#334155] text-white focus:outline-none focus:border-blue-500">
                        <?php foreach ($data['hangars'] as $h): ?>
                            <option value="<?= htmlspecialchars($h['id']) ?>"><?= htmlspecialchars($h['name']) ?></option>
                        <?php endforeach; ?>
                    </select>
                </div>
            </div>

            <div>
                <label class="block font-bold text-slate-300 mb-1">اسم الماكينة / الخط بالكامل:</label>
                <input type="text" name="name" required placeholder="مثال: ماكينة قص وتفصيل رولات أوتوماتيكية" class="w-full px-3 py-2 rounded-xl bg-[#0f172a] border border-[#334155] text-white focus:outline-none focus:border-blue-500">
            </div>

            <div class="grid grid-cols-3 gap-3">
                <div>
                    <label class="block font-bold text-slate-300 mb-1">المصنع:</label>
                    <input type="text" name="manufacturer" placeholder="مثال: Bobst" class="w-full px-3 py-2 rounded-xl bg-[#0f172a] border border-[#334155] text-white focus:outline-none focus:border-blue-500">
                </div>
                <div>
                    <label class="block font-bold text-slate-300 mb-1">الموديل:</label>
                    <input type="text" name="model" placeholder="مثال: 2024" class="w-full px-3 py-2 rounded-xl bg-[#0f172a] border border-[#334155] text-white focus:outline-none focus:border-blue-500">
                </div>
                <div>
                    <label class="block font-bold text-slate-300 mb-1">القدرة (kW):</label>
                    <input type="number" name="power_kw" value="45" class="w-full px-3 py-2 rounded-xl bg-[#0f172a] border border-[#334155] text-white focus:outline-none focus:border-blue-500">
                </div>
            </div>

            <div class="pt-3 border-t border-[#334155] flex justify-end gap-2">
                <button type="button" onclick="document.getElementById('newMachineModal').classList.add('hidden')" class="px-4 py-2 rounded-xl bg-[#334155] text-slate-200 font-bold">إلغاء</button>
                <button type="submit" class="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold shadow-lg shadow-blue-600/30">حفظ الماكينة</button>
            </div>
        </form>
    </div>
</div>

<?php require_once __DIR__ . '/includes/footer.php'; ?>
