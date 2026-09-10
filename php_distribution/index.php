<?php
/**
 * ========================================================================
 * نظام إدارة الصيانة المحوسب (CMMS) — معمل المرجان للطباعة والتغليف
 * البوابة الرئيسية لخادم PHP (Apache / Nginx / cPanel / LiteSpeed / XAMPP)
 * إشراف: م. علي رضا — رئيس قسم الصيانة والمشروعات
 * ========================================================================
 */

// Route API requests if requested directly on index.php
if (isset($_GET['action']) || isset($_GET['api'])) {
    require_once __DIR__ . '/api.php';
    exit;
}

$dataFile = __DIR__ . '/data_store.json';
$initialDataJson = '{}';
if (file_exists($dataFile)) {
    $raw = file_get_contents($dataFile);
    if (!empty($raw)) {
        $initialDataJson = $raw;
    }
}

// Auto-detect bundled assets from assets/ directory
$jsFile = './assets/index-DEJ8YsAH.js';
$cssFile = './assets/index-wUOfzyQ1.css';

$assetsDir = __DIR__ . '/assets';
if (is_dir($assetsDir)) {
    $scanned = scandir($assetsDir);
    foreach ($scanned as $f) {
        if (substr($f, -3) === '.js') {
            $jsFile = './assets/' . $f;
        } elseif (substr($f, -4) === '.css') {
            $cssFile = './assets/' . $f;
        }
    }
}
?>
<!doctype html>
<html lang="ar" dir="rtl">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>نظام إدارة الصيانة CMMS - معمل المرجان للطباعة والتغليف</title>
    <meta name="description" content="نظام إدارة الصيانة المحوسب الشامل لمعمل المرجان للطباعة والتغليف بإشراف م. علي رضا - متابعة 41 ماكينة، 9 صالات إنتاجية، خطط الصيانة الوقائية، والعدادات" />
    <meta property="og:title" content="نظام إدارة الصيانة CMMS - معمل المرجان للطباعة والتغليف" />
    <meta property="og:description" content="إدارة الأصول، أوامر العمل، قطع الغيار، ومحاضر استلام وتسليم الورديات" />
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Cairo:wght@300;400;500;600;700;800;900&family=JetBrains+Mono:wght@400;500;600&display=swap" rel="stylesheet">
    
    <!-- تلقين بيانات النظام الأولية مباشرة من خادم PHP وقاعدة بيانات JSON -->
    <script>
      window.__INITIAL_CMMS_DATA__ = <?php echo $initialDataJson; ?>;
      window.__PHP_HOSTED__ = true;
    </script>

    <script type="module" crossorigin src="<?php echo htmlspecialchars($jsFile); ?>"></script>
    <link rel="stylesheet" crossorigin href="<?php echo htmlspecialchars($cssFile); ?>">
  </head>
  <body class="bg-[#0f172a] text-[#f1f5f9] antialiased selection:bg-blue-600 selection:text-white font-sans">
    <div id="root"></div>
  </body>
</html>
