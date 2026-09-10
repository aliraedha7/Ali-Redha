        </main>
    </div>

    <!-- Global Footer -->
    <footer class="bg-[#0f172a] border-t border-[#334155] py-3 px-6 text-center text-xs text-slate-400 flex flex-col sm:flex-row items-center justify-between no-print">
        <div class="flex items-center gap-2">
            <span>© <?= date('Y') ?> معمل المرجان للطباعة والتغليف الحديث. جميع الحقوق محفوظة.</span>
            <span class="text-slate-600">|</span>
            <span class="text-slate-400">إشراف: م. علي رضا (مدير الصيانة)</span>
        </div>
        <div class="flex items-center gap-3 mt-2 sm:mt-0 text-[11px]">
            <span class="text-emerald-400 flex items-center gap-1">
                <span class="w-2 h-2 rounded-full bg-emerald-400"></span>
                خادم PHP متصل ونشط
            </span>
            <span class="text-slate-500">•</span>
            <span class="text-slate-400">نسخة PHP المستقلة</span>
        </div>
    </footer>

    <!-- Initialize Lucide Icons & Toast helper -->
    <script>
        lucide.createIcons();

        // Notification Toast
        function showToast(message, type = 'success') {
            const toast = document.createElement('div');
            toast.className = `fixed bottom-5 left-5 z-50 px-4 py-3 rounded-xl text-xs font-bold shadow-2xl flex items-center gap-2 border transition-all duration-300 transform translate-y-10 opacity-0 ${
                type === 'success' 
                    ? 'bg-emerald-950 text-emerald-300 border-emerald-500/50' 
                    : 'bg-rose-950 text-rose-300 border-rose-500/50'
            }`;
            toast.innerHTML = `<span>${message}</span>`;
            document.body.appendChild(toast);
            
            setTimeout(() => {
                toast.classList.remove('translate-y-10', 'opacity-0');
            }, 10);

            setTimeout(() => {
                toast.classList.add('translate-y-10', 'opacity-0');
                setTimeout(() => toast.remove(), 300);
            }, 3500);
        }
    </script>
</body>
</html>
