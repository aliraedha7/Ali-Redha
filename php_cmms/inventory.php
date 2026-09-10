<?php
$pageTitle = 'المستودع وقطع الغيار';
require_once __DIR__ . '/config/db.php';

// Handle part withdrawal or adding new part
if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_POST['action'])) {
    $currentData = Database::getJsonData();

    if ($_POST['action'] === 'withdraw') {
        $partId = $_POST['part_id'] ?? '';
        $qty = intval($_POST['quantity'] ?? 1);

        foreach ($currentData['spare_parts'] as &$sp) {
            if ($sp['id'] === $partId) {
                $sp['stock'] = max(0, $sp['stock'] - $qty);
                break;
            }
        }
        Database::saveJsonData($currentData);
        header('Location: inventory.php?success=withdrawn');
        exit;
    }

    if ($_POST['action'] === 'add_part') {
        $newPart = [
            'id' => 'SP-' . strtoupper(substr(md5(uniqid()), 0, 4)),
            'code' => trim($_POST['code'] ?? 'SP-NEW'),
            'name' => trim($_POST['name'] ?? 'قطعة غيار جديدة'),
            'category' => $_POST['category'] ?? 'Mechanical',
            'stock' => intval($_POST['stock'] ?? 10),
            'min_stock' => intval($_POST['min_stock'] ?? 5),
            'unit' => trim($_POST['unit'] ?? 'قطعة'),
            'price' => floatval($_POST['price'] ?? 20.0),
            'bin_location' => trim($_POST['bin_location'] ?? 'مستودع عام')
        ];
        $currentData['spare_parts'][] = $newPart;
        Database::saveJsonData($currentData);
        header('Location: inventory.php?success=part_added');
        exit;
    }
}

require_once __DIR__ . '/includes/header.php';

$parts = $data['spare_parts'] ?? [];
?>

<!-- Header -->
<div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2 border-b border-[#334155]">
    <div>
        <h1 class="text-xl font-black text-white flex items-center gap-2">
            <i data-lucide="package" class="w-5 h-5 text-amber-400"></i>
            مستودع قطع الغيار والمواد المستهلكة
        </h1>
        <p class="text-xs text-slate-400 mt-0.5">
            إدارة المخزون الحرج، حدود الأمان، وصرف القطع لأوامر الصيانة الفنية.
        </p>
    </div>

    <button onclick="document.getElementById('newPartModal').classList.remove('hidden')" class="px-4 py-2 rounded-xl bg-amber-600 hover:bg-amber-500 text-white text-xs font-bold shadow-lg shadow-amber-600/20 flex items-center gap-2 self-start sm:self-auto transition">
        <i data-lucide="plus" class="w-4 h-4"></i>
        <span>إدخال صنف جديد للمستودع</span>
    </button>
</div>

<!-- Parts Table Container -->
<div class="p-4 rounded-2xl bg-[#1e293b] border border-[#334155] space-y-4">
    <div class="overflow-x-auto">
        <table class="w-full text-right text-xs">
            <thead>
                <tr class="border-b border-[#334155] text-slate-400">
                    <th class="pb-3 px-3">الكود</th>
                    <th class="pb-3 px-3">اسم الصنف والمواصفة</th>
                    <th class="pb-3 px-3">التصنيف</th>
                    <th class="pb-3 px-3">الكمية المتوفرة</th>
                    <th class="pb-3 px-3">حد الأمان</th>
                    <th class="pb-3 px-3">الوحدة</th>
                    <th class="pb-3 px-3">موقع التخزين</th>
                    <th class="pb-3 px-3 text-center">إجراء الصرف</th>
                </tr>
            </thead>
            <tbody class="divide-y divide-[#334155]">
                <?php foreach ($parts as $p): ?>
                <tr class="hover:bg-slate-800/50 transition">
                    <td class="py-3 px-3 font-mono font-bold text-amber-400"><?= htmlspecialchars($p['code']) ?></td>
                    <td class="py-3 px-3 font-bold text-white"><?= htmlspecialchars($p['name']) ?></td>
                    <td class="py-3 px-3">
                        <span class="px-2 py-0.5 rounded text-[11px] bg-slate-800 text-slate-300 border border-slate-700">
                            <?= htmlspecialchars($p['category']) ?>
                        </span>
                    </td>
                    <td class="py-3 px-3">
                        <span class="font-bold text-sm <?= $p['stock'] <= $p['min_stock'] ? 'text-rose-400 animate-pulse' : 'text-emerald-400' ?>">
                            <?= $p['stock'] ?>
                        </span>
                        <?php if ($p['stock'] <= $p['min_stock']): ?>
                            <span class="block text-[10px] text-rose-400 font-bold">مخزون حرج!</span>
                        <?php endif; ?>
                    </td>
                    <td class="py-3 px-3 text-slate-400"><?= $p['min_stock'] ?></td>
                    <td class="py-3 px-3 text-slate-400"><?= htmlspecialchars($p['unit']) ?></td>
                    <td class="py-3 px-3 text-slate-300 font-mono"><?= htmlspecialchars($p['bin_location'] ?? 'مستودع رئيسي') ?></td>
                    <td class="py-3 px-3 text-center">
                        <form method="POST" class="inline-flex items-center gap-1">
                            <input type="hidden" name="action" value="withdraw">
                            <input type="hidden" name="part_id" value="<?= htmlspecialchars($p['id']) ?>">
                            <input type="number" name="quantity" value="1" min="1" max="<?= max(1, $p['stock']) ?>" class="w-14 px-2 py-1 rounded bg-[#0f172a] border border-[#334155] text-white text-center font-bold">
                            <button type="submit" class="px-2.5 py-1 rounded bg-blue-600 hover:bg-blue-500 text-white font-bold text-[11px]" <?= $p['stock'] <= 0 ? 'disabled' : '' ?>>
                                صرف
                            </button>
                        </form>
                    </td>
                </tr>
                <?php endforeach; ?>
            </tbody>
        </table>
    </div>
</div>

<!-- Modal: New Part -->
<div id="newPartModal" class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm hidden">
    <div class="bg-[#1e293b] border border-amber-500/40 rounded-2xl w-full max-w-lg shadow-2xl p-6 space-y-4">
        <div class="flex items-center justify-between border-b border-[#334155] pb-3">
            <div class="flex items-center gap-2">
                <i data-lucide="package-plus" class="w-5 h-5 text-amber-400"></i>
                <h3 class="text-sm font-bold text-white">إدخال صنف جديد لمستودع قطع الغيار</h3>
            </div>
            <button onclick="document.getElementById('newPartModal').classList.add('hidden')" class="text-slate-400 hover:text-white">
                <i data-lucide="x" class="w-5 h-5"></i>
            </button>
        </div>

        <form method="POST" class="space-y-3 text-xs">
            <input type="hidden" name="action" value="add_part">

            <div class="grid grid-cols-2 gap-3">
                <div>
                    <label class="block font-bold text-slate-300 mb-1">كود الصنف:</label>
                    <input type="text" name="code" required placeholder="مثال: BLD-202" class="w-full px-3 py-2 rounded-xl bg-[#0f172a] border border-[#334155] text-white focus:outline-none focus:border-amber-500">
                </div>
                <div>
                    <label class="block font-bold text-slate-300 mb-1">التصنيف الفني:</label>
                    <select name="category" class="w-full px-3 py-2 rounded-xl bg-[#0f172a] border border-[#334155] text-white focus:outline-none focus:border-amber-500">
                        <option value="Mechanical">ميكانيكي (Mechanical)</option>
                        <option value="Electrical">كهربائي وإلكتروني (Electrical)</option>
                        <option value="Pneumatic">هوائي نيوماتيكي (Pneumatic)</option>
                        <option value="Consumable">مواد استهلاكية وزيوت (Consumable)</option>
                    </select>
                </div>
            </div>

            <div>
                <label class="block font-bold text-slate-300 mb-1">اسم الصنف والمواصفة الفنية:</label>
                <input type="text" name="name" required placeholder="مثال: رول سيراميك أنيلوكس 400 LPI" class="w-full px-3 py-2 rounded-xl bg-[#0f172a] border border-[#334155] text-white focus:outline-none focus:border-amber-500">
            </div>

            <div class="grid grid-cols-3 gap-3">
                <div>
                    <label class="block font-bold text-slate-300 mb-1">الكمية المتوفرة:</label>
                    <input type="number" name="stock" value="10" class="w-full px-3 py-2 rounded-xl bg-[#0f172a] border border-[#334155] text-white focus:outline-none focus:border-amber-500">
                </div>
                <div>
                    <label class="block font-bold text-slate-300 mb-1">حد الأمان الأدنى:</label>
                    <input type="number" name="min_stock" value="3" class="w-full px-3 py-2 rounded-xl bg-[#0f172a] border border-[#334155] text-white focus:outline-none focus:border-amber-500">
                </div>
                <div>
                    <label class="block font-bold text-slate-300 mb-1">الوحدة:</label>
                    <input type="text" name="unit" value="قطعة" class="w-full px-3 py-2 rounded-xl bg-[#0f172a] border border-[#334155] text-white focus:outline-none focus:border-amber-500">
                </div>
            </div>

            <div>
                <label class="block font-bold text-slate-300 mb-1">موقع التخزين (الرف / الخزانة):</label>
                <input type="text" name="bin_location" placeholder="مثال: رف B-04 / قاطع 2" class="w-full px-3 py-2 rounded-xl bg-[#0f172a] border border-[#334155] text-white focus:outline-none focus:border-amber-500">
            </div>

            <div class="pt-3 border-t border-[#334155] flex justify-end gap-2">
                <button type="button" onclick="document.getElementById('newPartModal').classList.add('hidden')" class="px-4 py-2 rounded-xl bg-[#334155] text-slate-200 font-bold">إلغاء</button>
                <button type="submit" class="px-5 py-2 rounded-xl bg-amber-600 hover:bg-amber-500 text-white font-bold shadow-lg shadow-amber-600/30">حفظ الصنف</button>
            </div>
        </form>
    </div>
</div>

<?php require_once __DIR__ . '/includes/footer.php'; ?>
