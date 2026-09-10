<?php
/**
 * CMMS Industrial Management System - Backend API for PHP Hosting
 * معمل المرجان للطباعة والتغليف
 * إشراف: م. علي رضا
 */

header('Content-Type: application/json; charset=utf-8');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization');

if (($_SERVER['REQUEST_METHOD'] ?? 'GET') === 'OPTIONS') {
    http_response_code(200);
    exit;
}

$dataFile = __DIR__ . '/data_store.json';
$action = $_GET['action'] ?? ($_POST['action'] ?? 'status');

function getStoreData($dataFile) {
    if (!file_exists($dataFile)) {
        return [];
    }
    $raw = file_get_contents($dataFile);
    $decoded = json_decode($raw, true);
    return is_array($decoded) ? $decoded : [];
}

function saveStoreData($dataFile, $data) {
    return file_put_contents($dataFile, json_encode($data, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE), LOCK_EX);
}

switch ($action) {
    case 'status':
        echo json_encode([
            'status' => 'online',
            'system' => 'CMMS Al-Morjan Packaging - Industrial Maintenance',
            'supervisor' => 'Eng. Ali Redha (م. علي رضا)',
            'php_version' => PHP_VERSION,
            'server_software' => $_SERVER['SERVER_SOFTWARE'] ?? 'PHP Server',
            'timestamp' => date('Y-m-d H:i:s'),
            'storage_file' => basename($dataFile),
            'storage_exists' => file_exists($dataFile),
            'storage_size' => file_exists($dataFile) ? filesize($dataFile) : 0
        ], JSON_UNESCAPED_UNICODE);
        break;

    case 'get_data':
        $data = getStoreData($dataFile);
        echo json_encode([
            'success' => true,
            'data' => $data,
            'timestamp' => date('c')
        ], JSON_UNESCAPED_UNICODE);
        break;

    case 'sync_entity':
        $entity = $_GET['entity'] ?? '';
        $allowedEntities = [
            'hangars', 'assets', 'equipment', 'work_orders', 'spare_parts',
            'meter_readings', 'pm_checklist', 'meter_devices', 'device_reading_logs',
            'pm_plans', 'users', 'shift_logs', 'current_user_id'
        ];

        if (!in_array($entity, $allowedEntities)) {
            http_response_code(400);
            echo json_encode(['success' => false, 'error' => 'Invalid entity key']);
            exit;
        }

        $input = file_get_contents('php://input');
        $payload = json_decode($input, true);

        $currentData = getStoreData($dataFile);
        $currentData[$entity] = $payload;

        // Keep assets and equipment in sync
        if ($entity === 'assets') {
            $currentData['equipment'] = $payload;
        } elseif ($entity === 'equipment') {
            $currentData['assets'] = $payload;
        }

        if (saveStoreData($dataFile, $currentData)) {
            echo json_encode([
                'success' => true,
                'entity' => $entity,
                'item_count' => is_array($payload) ? count($payload) : 1,
                'timestamp' => date('c')
            ]);
        } else {
            http_response_code(500);
            echo json_encode(['success' => false, 'error' => 'Failed to write to data store']);
        }
        break;

    case 'save_full_data':
        $input = file_get_contents('php://input');
        $payload = json_decode($input, true);
        if (!is_array($payload)) {
            http_response_code(400);
            echo json_encode(['success' => false, 'error' => 'Invalid JSON payload']);
            exit;
        }

        if (saveStoreData($dataFile, $payload)) {
            echo json_encode(['success' => true, 'timestamp' => date('c')]);
        } else {
            http_response_code(500);
            echo json_encode(['success' => false, 'error' => 'Failed to write data']);
        }
        break;

    case 'export_json':
        if (file_exists($dataFile)) {
            header('Content-Description: File Transfer');
            header('Content-Type: application/json');
            header('Content-Disposition: attachment; filename="almorjan_cmms_database_' . date('Y-m-d') . '.json"');
            header('Expires: 0');
            header('Cache-Control: must-revalidate');
            header('Pragma: public');
            header('Content-Length: ' . filesize($dataFile));
            readfile($dataFile);
            exit;
        } else {
            http_response_code(404);
            echo json_encode(['success' => false, 'error' => 'Data file not found']);
        }
        break;

    case 'download_package':
        $zipPath = __DIR__ . '/cmms_php_release.zip';
        if (file_exists($zipPath)) {
            header('Content-Description: File Transfer');
            header('Content-Type: application/zip');
            header('Content-Disposition: attachment; filename="cmms_almorjan_php_package.zip"');
            header('Expires: 0');
            header('Cache-Control: must-revalidate');
            header('Pragma: public');
            header('Content-Length: ' . filesize($zipPath));
            readfile($zipPath);
            exit;
        } else {
            http_response_code(404);
            echo json_encode(['success' => false, 'error' => 'Release package not generated yet']);
        }
        break;

    default:
        http_response_code(400);
        echo json_encode(['success' => false, 'error' => 'Unknown action']);
        break;
}
