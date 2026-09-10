<?php
$pageTitle = 'فريق الصيانة والمهندسين';
require_once __DIR__ . '/config/db.php';

require_once __DIR__ . '/includes/header.php';

$users = $data['users'] ?? [];
?>

<!-- Header -->
<div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2 border-b border-[#334155]">
    <div>
        <h1 class="text-xl font-black text-white flex items-center gap-2">
            <i data-lucide="users" class="w-5 h-5 text-blue-400"></i>
            الهيكل الفني وفريق هندسة الصيانة
        </h1>
        <p class="text-xs text-slate-400 mt-0.5">
            المهندسون، الفنيون، مسؤولو السلامة، ومشرفو قاعات الطباعة والتغليف.
        </p>
    </div>

    <button onclick="showToast('تم إرسال دعوة للمهندس')" class="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold shadow-lg shadow-blue-600/20 flex items-center gap-2 self-start sm:self-auto transition">
        <i data-lucide="user-plus" class="w-4 h-4"></i>
        <span>إضافة مهندس / فني جديد</span>
    </button>
</div>

<!-- Team Members Grid -->
<div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
    <?php foreach ($users as $u): ?>
    <div class="p-5 rounded-2xl bg-[#1e293b] border border-[#334155] hover:border-slate-500 transition space-y-3 text-center">
        <div class="w-14 h-14 rounded-2xl bg-gradient-to-tr from-blue-600 to-cyan-400 text-white flex items-center justify-center font-black text-base mx-auto shadow-lg shadow-blue-600/20">
            <?= mb_substr($u['name'], 0, 4) ?>
        </div>

        <div>
            <h3 class="text-sm font-bold text-white"><?= htmlspecialchars($u['name']) ?></h3>
            <p class="text-xs text-blue-400 font-bold mt-0.5"><?= htmlspecialchars($u['role']) ?></p>
            <p class="text-[11px] text-slate-400 mt-0.5"><?= htmlspecialchars($u['dept']) ?></p>
        </div>

        <div class="pt-2 border-t border-[#334155] text-xs text-slate-300">
            <div class="flex items-center justify-center gap-1 font-mono text-[11px]">
                <i data-lucide="phone" class="w-3 h-3 text-slate-400"></i>
                <span><?= htmlspecialchars($u['phone']) ?></span>
            </div>
            <span class="inline-block mt-2 px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-400">
                نشط في الوردية
            </span>
        </div>
    </div>
    <?php endforeach; ?>
</div>

<?php require_once __DIR__ . '/includes/footer.php'; ?>
