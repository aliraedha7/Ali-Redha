<?php
$pageTitle = 'أوامر العمل والصيانة الفنية';
require_once __DIR__ . '/config/db.php';

// Handle POST request to add or update work order
if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_POST['action'])) {
    $currentData = Database::getJsonData();
    
    if ($_POST['action'] === 'create_wo') {
        $newId = 'WO-2026-' . str_pad(rand(100, 9999), 4, '0', STR_PAD_LEFT);
        $newCode = 'WO-' . rand(1000, 9999);
        
        $newWo = [
            'id' => $newId,
            'code' => $newCode,
            'title' => trim($_POST['title'] ?? 'أمر عمل صيانة فنية'),
            'equipment_id' => $_POST['equipment_id'] ?? 'EQ-ROTO-01',
            'equipment_name' => $_POST['equipment_name'] ?? 'ماكينة عامة',
            'hall_name' => $_POST['hall_name'] ?? 'قاعة الإنتاج',
            'type' => $_POST['type'] ?? 'CORRECTIVE',
            'priority' => $_POST['priority'] ?? 'MEDIUM',
            'status' => 'PENDING',
            'assigned_to' => trim($_POST['assigned_to'] ?? 'فريق الصيانة'),
            'created_at' => date('Y-m-d H:i:s'),
            'description' => trim($_POST['description'] ?? '')
        ];
        
        array_unshift($currentData['work_orders'], $newWo);
        Database::saveJsonData($currentData);
        header('Location: work_orders.php?success=created');
        exit;
    }

    if ($_POST['action'] === 'update_status') {
        $woId = $_POST['wo_id'] ?? '';
        $nextStatus = $_POST['status'] ?? 'COMPLETED';
        
        foreach ($currentData['work_orders'] as &$wo) {
            if ($wo['id'] === $woId) {
                $wo['status'] = $nextStatus;
                if ($nextStatus === 'COMPLETED') {
                    $wo['completed_at'] = date('Y-m-d H:i:s');
                }
                break;
            }
        }
        Database::saveJsonData($currentData);
        header('Location: work_orders.php?success=updated');
        exit;
    }
}

require_once __DIR__ . '/includes/header.php';

$filter = $_GET['filter'] ?? 'all';
$allWos = $data['work_orders'] ?? [];

$filteredWos = array_filter($allWos, function($wo) use ($filter) {
    if ($filter === 'urgent') return $wo['priority'] === 'URGENT';
    if ($filter === 'in_progress') return $wo['status'] === 'IN_PROGRESS';
    if ($filter === 'completed') return $wo['status'] === 'COMPLETED';
    if ($filter === 'pending') return $wo['status'] === 'PENDING';
    return true;
});
?>

<!-- Work Orders Top Header -->
<div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2 border-b border-[#334155]">
    <div>
        <h1 class="text-xl font-black text-white flex items-center gap-2">
            <i data-lucide="clipboard-list" class="w-5 h-5 text-blue-400"></i>
            إدارة أوامر العمل والتكليفات الفنية
        </h1>
        <p class="text-xs text-slate-400 mt-0.5">
            توزيع ومتابعة وتوثيق كافة أعمال الصيانة التصحيحية، الوقائية، والطارئة.
        </p>
    </div>

    <!-- Add Work Order Button -->
    <button onclick="document.getElementById('newWoModal').classList.remove('hidden')" class="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold shadow-lg shadow-blue-600/20 flex items-center gap-2 self-start sm:self-auto transition">
        <i data-lucide="plus" class="w-4 h-4"></i>
        <span>إصدار أمر عمل جديد</span>
    </button>
</div>

<!-- Filter Tabs -->
<div class="flex items-center gap-2 overflow-x-auto pb-1 text-xs">
    <a href="work_orders.php" class="px-3 py-1.5 rounded-xl font-bold transition <?= $filter === 'all' ? 'bg-blue-600 text-white' : 'bg-[#1e293b] text-slate-300 hover:bg-slate-700' ?>">
        الكل (<?= count($allWos) ?>)
    </a>
    <a href="work_orders.php?filter=urgent" class="px-3 py-1.5 rounded-xl font-bold transition <?= $filter === 'urgent' ? 'bg-rose-600 text-white' : 'bg-[#1e293b] text-rose-300 hover:bg-slate-700' ?>">
        الطارئ والحرج (<?= count(array_filter($allWos, fn($w) => $w['priority'] === 'URGENT')) ?>)
    </a>
    <a href="work_orders.php?filter=in_progress" class="px-3 py-1.5 rounded-xl font-bold transition <?= $filter === 'in_progress' ? 'bg-amber-600 text-white' : 'bg-[#1e293b] text-amber-300 hover:bg-slate-700' ?>">
        قيد التنفيذ (<?= count(array_filter($allWos, fn($w) => $w['status'] === 'IN_PROGRESS')) ?>)
    </a>
    <a href="work_orders.php?filter=pending" class="px-3 py-1.5 rounded-xl font-bold transition <?= $filter === 'pending' ? 'bg-indigo-600 text-white' : 'bg-[#1e293b] text-indigo-300 hover:bg-slate-700' ?>">
        بانتظار البدء (<?= count(array_filter($allWos, fn($w) => $w['status'] === 'PENDING')) ?>)
    </a>
    <a href="work_orders.php?filter=completed" class="px-3 py-1.5 rounded-xl font-bold transition <?= $filter === 'completed' ? 'bg-emerald-600 text-white' : 'bg-[#1e293b] text-emerald-300 hover:bg-slate-700' ?>">
        المكتملة (<?= count(array_filter($allWos, fn($w) => $w['status'] === 'COMPLETED')) ?>)
    </a>
</div>

<!-- Work Orders List -->
<div class="grid grid-cols-1 gap-4">
    <?php if (empty($filteredWos)): ?>
        <div class="p-12 text-center rounded-2xl bg-[#1e293b] border border-[#334155] text-slate-400">
            <i data-lucide="inbox" class="w-10 h-10 mx-auto mb-2 text-slate-500"></i>
            <p class="text-sm font-bold">لا توجد أوامر عمل تطابق هذا الفلتر حالياً</p>
        </div>
    <?php else: ?>
        <?php foreach ($filteredWos as $wo): ?>
        <div class="p-5 rounded-2xl bg-[#1e293b] border border-[#334155] hover:border-slate-500 transition space-y-4 shadow-sm">
            <div class="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                <div class="space-y-1">
                    <div class="flex items-center gap-2.5 flex-wrap">
                        <span class="font-mono text-xs font-bold text-blue-400 bg-blue-950/60 px-2 py-0.5 rounded border border-blue-800/40"><?= htmlspecialchars($wo['code']) ?></span>
                        <span class="text-xs text-slate-400"><?= htmlspecialchars($wo['hall_name'] ?? 'قاعة الإنتاج') ?></span>
                        <span class="text-slate-500">•</span>
                        <span class="text-xs text-slate-300 font-bold"><?= htmlspecialchars($wo['equipment_name'] ?? '') ?></span>
                    </div>
                    <h2 class="text-base font-bold text-white"><?= htmlspecialchars($wo['title']) ?></h2>
                </div>

                <div class="flex items-center gap-2 self-start">
                    <!-- Priority -->
                    <span class="px-2.5 py-1 rounded-full text-xs font-bold <?= $wo['priority'] === 'URGENT' ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30' : ($wo['priority'] === 'HIGH' ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30' : 'bg-blue-500/20 text-blue-300 border border-blue-500/30') ?>">
                        <?= $wo['priority'] === 'URGENT' ? 'طارئ جداً' : ($wo['priority'] === 'HIGH' ? 'أولوية عالية' : 'عادي') ?>
                    </span>
                    <!-- Status -->
                    <span class="px-2.5 py-1 rounded-full text-xs font-bold <?= $wo['status'] === 'IN_PROGRESS' ? 'bg-amber-500/20 text-amber-300' : ($wo['status'] === 'COMPLETED' ? 'bg-emerald-500/20 text-emerald-300' : 'bg-slate-700 text-slate-300') ?>">
                        <?= $wo['status'] === 'IN_PROGRESS' ? 'قيد التنفيذ' : ($wo['status'] === 'COMPLETED' ? 'مكتمل' : 'قيد الانتظار') ?>
                    </span>
                </div>
            </div>

            <!-- Description -->
            <p class="text-xs text-slate-300 leading-relaxed bg-[#0f172a] p-3 rounded-xl border border-[#334155]">
                <?= nl2br(htmlspecialchars($wo['description'])) ?>
            </p>

            <!-- Actions and Footer -->
            <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-3 border-t border-[#334155] text-xs">
                <div class="flex items-center gap-4 text-slate-400">
                    <span>الفريق المكلف: <strong class="text-slate-200"><?= htmlspecialchars($wo['assigned_to']) ?></strong></span>
                    <span>تاريخ الإصدار: <span class="font-mono text-slate-300"><?= htmlspecialchars($wo['created_at'] ?? '2026-09-09') ?></span></span>
                </div>

                <div class="flex items-center gap-2">
                    <!-- Status Change Form -->
                    <form method="POST" class="inline">
                        <input type="hidden" name="action" value="update_status">
                        <input type="hidden" name="wo_id" value="<?= htmlspecialchars($wo['id']) ?>">
                        <?php if ($wo['status'] === 'PENDING'): ?>
                            <input type="hidden" name="status" value="IN_PROGRESS">
                            <button type="submit" class="px-3 py-1.5 rounded-lg bg-amber-600 hover:bg-amber-500 text-white font-bold text-xs">
                                بدء العمل الفني
                            </button>
                        <?php elseif ($wo['status'] === 'IN_PROGRESS'): ?>
                            <input type="hidden" name="status" value="COMPLETED">
                            <button type="submit" class="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center gap-1">
                                <i data-lucide="check" class="w-3.5 h-3.5"></i>
                                <span>اعتماد الإكمال</span>
                            </button>
                        <?php else: ?>
                            <span class="text-emerald-400 font-bold flex items-center gap-1">
                                <i data-lucide="check-circle" class="w-4 h-4"></i>
                                مكتمل ومعتمد
                            </span>
                        <?php endif; ?>
                    </form>

                    <button onclick="window.print()" class="p-1.5 rounded-lg bg-[#0f172a] hover:bg-slate-700 text-slate-300 border border-[#334155]" title="طباعة أمر العمل">
                        <i data-lucide="printer" class="w-4 h-4"></i>
                    </button>
                </div>
            </div>
        </div>
        <?php endforeach; ?>
    <?php endif; ?>
</div>

<!-- Modal: New Work Order -->
<div id="newWoModal" class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm hidden">
    <div class="bg-[#1e293b] border border-blue-500/40 rounded-2xl w-full max-w-xl shadow-2xl p-6 space-y-4">
        <div class="flex items-center justify-between border-b border-[#334155] pb-3">
            <div class="flex items-center gap-2">
                <i data-lucide="plus-circle" class="w-5 h-5 text-blue-400"></i>
                <h3 class="text-sm font-bold text-white">إصدار أمر عمل صيانة جديد</h3>
            </div>
            <button onclick="document.getElementById('newWoModal').classList.add('hidden')" class="text-slate-400 hover:text-white">
                <i data-lucide="x" class="w-5 h-5"></i>
            </button>
        </div>

        <form method="POST" class="space-y-3 text-xs">
            <input type="hidden" name="action" value="create_wo">

            <div>
                <label class="block font-bold text-slate-300 mb-1">عنوان العطل / الإجراء المطلوب:</label>
                <input type="text" name="title" required placeholder="مثال: استبدال رول السيليكون أو فحص محرك السحب" class="w-full px-3 py-2 rounded-xl bg-[#0f172a] border border-[#334155] text-white focus:outline-none focus:border-blue-500">
            </div>

            <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                    <label class="block font-bold text-slate-300 mb-1">الماكينة المستهدفة:</label>
                    <select name="equipment_name" class="w-full px-3 py-2 rounded-xl bg-[#0f172a] border border-[#334155] text-white focus:outline-none focus:border-blue-500">
                        <?php foreach ($data['equipment'] as $eq): ?>
                            <option value="<?= htmlspecialchars($eq['name']) ?>"><?= htmlspecialchars($eq['code'] . ' - ' . $eq['name']) ?></option>
                        <?php endforeach; ?>
                    </select>
                </div>

                <div>
                    <label class="block font-bold text-slate-300 mb-1">القاعة أو القسم:</label>
                    <select name="hall_name" class="w-full px-3 py-2 rounded-xl bg-[#0f172a] border border-[#334155] text-white focus:outline-none focus:border-blue-500">
                        <option value="قاعة الروتو (ROTO HALL)">قاعة الروتو (ROTO HALL)</option>
                        <option value="قاعة الفليكسو (FLEXO HALL)">قاعة الفليكسو (FLEXO HALL)</option>
                        <option value="قاعة البولي إيثيلين (PE HALL)">قاعة البولي إيثيلين (PE HALL)</option>
                        <option value="قاعة صناعة الأكياس (BAG MAKING)">قاعة صناعة الأكياس</option>
                        <option value="قاعة التبطين والقص">قاعة التبطين والقص</option>
                        <option value="محطات الخدمات المركزية">محطات الخدمات المركزية</option>
                    </select>
                </div>
            </div>

            <div class="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                    <label class="block font-bold text-slate-300 mb-1">نوع الصيانة:</label>
                    <select name="type" class="w-full px-3 py-2 rounded-xl bg-[#0f172a] border border-[#334155] text-white focus:outline-none focus:border-blue-500">
                        <option value="CORRECTIVE">تصحيحية (عطل فني)</option>
                        <option value="PREVENTIVE">وقائية دورية</option>
                        <option value="EMERGENCY">طارئة (توقف خط)</option>
                    </select>
                </div>

                <div>
                    <label class="block font-bold text-slate-300 mb-1">الأولوية:</label>
                    <select name="priority" class="w-full px-3 py-2 rounded-xl bg-[#0f172a] border border-[#334155] text-white focus:outline-none focus:border-blue-500">
                        <option value="MEDIUM">متوسطة</option>
                        <option value="HIGH">عالية</option>
                        <option value="URGENT">حرجة / طارئة</option>
                        <option value="LOW">منخفضة</option>
                    </select>
                </div>

                <div>
                    <label class="block font-bold text-slate-300 mb-1">المهندس / الفني المكلف:</label>
                    <input type="text" name="assigned_to" value="م. حسام التميمي" class="w-full px-3 py-2 rounded-xl bg-[#0f172a] border border-[#334155] text-white focus:outline-none focus:border-blue-500">
                </div>
            </div>

            <div>
                <label class="block font-bold text-slate-300 mb-1">الوصف الفني للمشكلة والأعراض:</label>
                <textarea name="description" rows="3" placeholder="اكتب تفاصيل الفحص وقطع الغيار المقترحة..." class="w-full px-3 py-2 rounded-xl bg-[#0f172a] border border-[#334155] text-white focus:outline-none focus:border-blue-500"></textarea>
            </div>

            <div class="pt-3 border-t border-[#334155] flex justify-end gap-2">
                <button type="button" onclick="document.getElementById('newWoModal').classList.add('hidden')" class="px-4 py-2 rounded-xl bg-[#334155] hover:bg-slate-600 text-slate-200 font-bold">إلغاء</button>
                <button type="submit" class="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold shadow-lg shadow-blue-600/30">حفظ وإصدار أمر العمل</button>
            </div>
        </form>
    </div>
</div>

<?php require_once __DIR__ . '/includes/footer.php'; ?>
