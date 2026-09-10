import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';
import { 
  Asset, 
  HangarInfo, 
  WorkOrder, 
  WorkOrderStatus,
  SparePart, 
  StockMovementLog,
  MeterReading, 
  PMChecklistItem, 
  PlantKPIs,
  MeterDevice,
  DeviceReadingLog,
  PreventiveMaintenancePlan,
  UserAccount,
  UserPermissions,
  ShiftLog,
  TabType,
  DeleteConfirmationDialog
} from '../types';
import { 
  HANGARS_DATA, 
  INITIAL_ASSETS, 
  INITIAL_WORK_ORDERS, 
  INITIAL_SPARE_PARTS, 
  INITIAL_METER_READINGS, 
  INITIAL_PM_CHECKLIST 
} from '../data/seedData';
import {
  INITIAL_METER_DEVICES,
  INITIAL_DEVICE_READINGS,
  INITIAL_PM_PLANS
} from '../data/metersAndPMSeed';
import {
  INITIAL_USERS,
  INITIAL_SHIFT_LOGS
} from '../data/usersAndShiftsSeed';

interface NotificationItem {
  id: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
  timestamp: string;
}

interface CMMSContextType {
  // Data state
  hangars: HangarInfo[];
  assets: Asset[];
  workOrders: WorkOrder[];
  spareParts: SparePart[];
  meterReadings: MeterReading[];
  pmChecklist: PMChecklistItem[];
  kpis: PlantKPIs;
  notifications: NotificationItem[];
  dismissNotification: (id: string) => void;
  addNotification: (message: string, type?: 'info' | 'success' | 'warning' | 'error') => void;

  // New Dedicated Meters & Instrumentation
  meterDevices: MeterDevice[];
  deviceReadingLogs: DeviceReadingLog[];
  addMeterDevice: (deviceData: Omit<MeterDevice, 'id'>) => void;
  updateMeterDevice: (updated: MeterDevice) => void;
  deleteMeterDevice: (id: string) => void;
  logDeviceReading: (reading: Omit<DeviceReadingLog, 'id' | 'timestamp'>) => void;
  deleteDeviceReading: (id: string) => void;

  // New Professional Preventive Maintenance Plans
  pmPlans: PreventiveMaintenancePlan[];
  addPMPlan: (planData: Omit<PreventiveMaintenancePlan, 'id' | 'history'>) => void;
  updatePMPlan: (updated: PreventiveMaintenancePlan) => void;
  deletePMPlan: (id: string) => void;
  executePMPlan: (planId: string, result: { passed: boolean; completedBy: string; durationMinutes: number; notes?: string; createWorkOrderOnFail?: boolean }) => void;
  createWOFromPMPlan: (plan: PreventiveMaintenancePlan) => void;

  // Navigation & Modals
  activeTab: TabType;
  setActiveTab: (tab: TabType) => void;

  // User Accounts & Permissions System
  users: UserAccount[];
  currentUser: UserAccount | null;
  setCurrentUser: (user: UserAccount | null) => void;
  isLoginModalOpen: boolean;
  setIsLoginModalOpen: (open: boolean) => void;
  isLoggedIn: boolean;
  loginWithCredentials: (identifier: string, code: string) => { success: boolean; message: string; user?: UserAccount };
  logoutCurrentUser: () => void;
  addUser: (userData: Omit<UserAccount, 'id' | 'createdAt'>) => void;
  updateUser: (user: UserAccount) => void;
  deleteUser: (userId: string) => boolean;
  toggleUserStatus: (userId: string) => void;
  canAccess: (permissionKey: keyof UserPermissions) => boolean;
  canViewTab: (tab: TabType) => boolean;
  checkPermission: (permissionKey: keyof UserPermissions, actionLabel: string) => boolean;
  isUserModalOpen: boolean;
  setIsUserModalOpen: (open: boolean) => void;
  editingUser: UserAccount | null;
  setEditingUser: (user: UserAccount | null) => void;
  permissionWarningModal: { isOpen: boolean; actionName: string; requiredPermission: string } | null;
  showPermissionWarning: (actionName: string, requiredPermission: string) => void;
  closePermissionWarning: () => void;

  // Professional Shift Handover & Log System
  shiftLogs: ShiftLog[];
  activeShiftLog: ShiftLog;
  setActiveShiftLog: (log: ShiftLog) => void;
  addShiftLog: (logData: Omit<ShiftLog, 'id'>) => void;
  updateShiftLog: (log: ShiftLog) => void;
  signShiftHandover: (shiftId: string, roleType: 'handedOver' | 'received' | 'approved', signerName: string) => void;
  isShiftModalOpen: boolean;
  setIsShiftModalOpen: (open: boolean) => void;
  editingShiftLog: ShiftLog | null;
  setEditingShiftLog: (log: ShiftLog | null) => void;
  
  selectedAssetForModal: Asset | null;
  setSelectedAssetForModal: (asset: Asset | null) => void;
  
  selectedAssetForQR: Asset | null;
  setSelectedAssetForQR: (asset: Asset | null) => void;
  
  isCreateWOOpen: boolean;
  setIsCreateWOOpen: (open: boolean) => void;
  preselectedAssetForWO: Asset | null;
  setPreselectedAssetForWO: (asset: Asset | null) => void;

  isCreateHallOpen: boolean;
  setIsCreateHallOpen: (open: boolean) => void;
  editingHangar: HangarInfo | null;
  setEditingHangar: (hangar: HangarInfo | null) => void;

  isCreateAssetOpen: boolean;
  setIsCreateAssetOpen: (open: boolean) => void;
  editingAsset: Asset | null;
  setEditingAsset: (asset: Asset | null) => void;
  preselectedHallForAsset: string | null;
  setPreselectedHallForAsset: (hallId: string | null) => void;
  
  selectedWOForDetail: WorkOrder | null;
  setSelectedWOForDetail: (wo: WorkOrder | null) => void;
  editingWorkOrder: WorkOrder | null;
  setEditingWorkOrder: (wo: WorkOrder | null) => void;

  // Dedicated Meters Modals
  selectedDeviceForReading: MeterDevice | null;
  setSelectedDeviceForReading: (device: MeterDevice | null) => void;
  isCreateDeviceOpen: boolean;
  setIsCreateDeviceOpen: (open: boolean) => void;
  editingMeterDevice: MeterDevice | null;
  setEditingMeterDevice: (device: MeterDevice | null) => void;

  // Dedicated PM Modals
  isCreatePMPlanOpen: boolean;
  setIsCreatePMPlanOpen: (open: boolean) => void;
  editingPMPlan: PreventiveMaintenancePlan | null;
  setEditingPMPlan: (plan: PreventiveMaintenancePlan | null) => void;
  executingPMPlan: PreventiveMaintenancePlan | null;
  setExecutingPMPlan: (plan: PreventiveMaintenancePlan | null) => void;
  selectedPMPlanForExecution: PreventiveMaintenancePlan | null;
  setSelectedPMPlanForExecution: (plan: PreventiveMaintenancePlan | null) => void;

  // Dedicated Spare Parts & Warehouse Modals
  isCreatePartOpen: boolean;
  setIsCreatePartOpen: (open: boolean) => void;
  editingPart: SparePart | null;
  setEditingPart: (part: SparePart | null) => void;
  selectedPartDetail: SparePart | null;
  setSelectedPartDetail: (part: SparePart | null) => void;

  globalSearch: string;
  setGlobalSearch: (s: string) => void;

  // Actions
  addHangar: (newHangar: Omit<HangarInfo, 'totalAssets'>) => void;
  updateHangar: (updatedHangar: HangarInfo) => void;
  addAsset: (newAsset: Omit<Asset, 'downtimeThisMonthMinutes'>) => void;
  updateAsset: (updatedAsset: Asset) => void;
  deleteHangar: (hangarId: string) => void;
  deleteAsset: (assetId: string) => void;
  addSparePart: (newPartData: Omit<SparePart, 'id'>) => void;
  updateSparePart: (updatedPart: SparePart) => void;
  deleteSparePart: (partId: string) => void;
  createWorkOrder: (newWoData: Omit<WorkOrder, 'id' | 'reportedAt' | 'consumedParts' | 'downtimeMinutes'> & { consumedParts?: WorkOrder['consumedParts']; downtimeMinutes?: number }) => WorkOrder;
  updateWorkOrderStatus: (woId: string, newStatus: WorkOrderStatus) => void;
  updateWorkOrder: (updatedWO: WorkOrder) => void;
  deleteWorkOrder: (woId: string) => void;
  deleteShiftLog: (shiftId: string) => void;
  consumePartInWorkOrder: (woId: string, partId: string, quantity: number) => boolean;
  consumePart: (partId: string, quantityToConsume: number, details?: { reason?: string; referenceNumber?: string; performedBy?: string }) => boolean;
  restockPart: (partId: string, quantityToAdd: number, details?: { reason?: string; referenceNumber?: string; performedBy?: string }) => void;
  logMeterReading: (reading: Omit<MeterReading, 'id' | 'timestamp'>) => void;
  togglePMChecklistItem: (id: string, newStatus: 'PASSED' | 'FAILED' | 'PENDING') => void;
  createWOFromPMItem: (item: PMChecklistItem) => void;
  resetToDefaultData: () => void;
  triggerEmergencyBreakdown: (assetId?: string) => void;
  deleteConfirmation: DeleteConfirmationDialog | null;
  requestDeleteConfirmation: (dialog: Omit<DeleteConfirmationDialog, 'isOpen'>) => void;
  closeDeleteConfirmation: () => void;

  // External PHP Hosting & Backup Utilities
  isPhpConnected: boolean;
  downloadPhpPackage: () => void;
  exportDatabaseJson: () => void;
}

const CMMSContext = createContext<CMMSContextType | undefined>(undefined);

const LOCAL_STORAGE_KEY_PREFIX = 'cmms_flex_pack_v2_';

const loadInitialEntityState = <T,>(serverKey: string, storageKey: string, fallback: T): T => {
  if (typeof window !== 'undefined') {
    const serverData = (window as any).__INITIAL_CMMS_DATA__;
    if (serverData && serverData[serverKey]) {
      const val = serverData[serverKey];
      if (Array.isArray(fallback)) {
        if (Array.isArray(val) && val.length > 0) return val as T;
      } else if (val !== undefined && val !== null) {
        return val as T;
      }
    }
    const saved = localStorage.getItem(`${LOCAL_STORAGE_KEY_PREFIX}${storageKey}`);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(fallback)) {
          if (Array.isArray(parsed) && parsed.length > 0) return parsed as T;
        } else if (parsed !== undefined && parsed !== null) {
          return parsed as T;
        }
      } catch (e) {
        console.error(e);
      }
    }
  }
  return fallback;
};

export const CMMSProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Load from server __INITIAL_CMMS_DATA__, local storage, or fallback to seed data
  const [hangars, setHangars] = useState<HangarInfo[]>(() => 
    loadInitialEntityState('hangars', 'hangars', HANGARS_DATA)
  );

  const [assets, setAssets] = useState<Asset[]>(() => 
    loadInitialEntityState('assets', 'assets', INITIAL_ASSETS)
  );

  const [workOrders, setWorkOrders] = useState<WorkOrder[]>(() => 
    loadInitialEntityState('work_orders', 'work_orders', INITIAL_WORK_ORDERS)
  );

  const [spareParts, setSpareParts] = useState<SparePart[]>(() => 
    loadInitialEntityState('spare_parts', 'spare_parts', INITIAL_SPARE_PARTS)
  );

  const [meterReadings, setMeterReadings] = useState<MeterReading[]>(() => 
    loadInitialEntityState('meter_readings', 'meter_readings', INITIAL_METER_READINGS)
  );

  const [pmChecklist, setPmChecklist] = useState<PMChecklistItem[]>(() => 
    loadInitialEntityState('pm_checklist', 'pm_checklist', INITIAL_PM_CHECKLIST)
  );

  // Dedicated Meters & Instrumentation State
  const [meterDevices, setMeterDevices] = useState<MeterDevice[]>(() => 
    loadInitialEntityState('meter_devices', 'meter_devices', INITIAL_METER_DEVICES)
  );

  const [deviceReadingLogs, setDeviceReadingLogs] = useState<DeviceReadingLog[]>(() => 
    loadInitialEntityState('device_reading_logs', 'device_reading_logs', INITIAL_DEVICE_READINGS)
  );

  // Professional Preventive Maintenance Plans State
  const [pmPlans, setPmPlans] = useState<PreventiveMaintenancePlan[]>(() => 
    loadInitialEntityState('pm_plans', 'pm_plans', INITIAL_PM_PLANS)
  );

  // UI state
  const [activeTab, setActiveTab] = useState<TabType>('dashboard');
  const [selectedAssetForModal, setSelectedAssetForModal] = useState<Asset | null>(null);
  const [selectedAssetForQR, setSelectedAssetForQR] = useState<Asset | null>(null);
  const [isCreateWOOpen, setIsCreateWOOpen] = useState<boolean>(false);
  const [preselectedAssetForWO, setPreselectedAssetForWO] = useState<Asset | null>(null);
  const [isCreateHallOpen, setIsCreateHallOpen] = useState<boolean>(false);
  const [editingHangar, setEditingHangar] = useState<HangarInfo | null>(null);
  const [isCreateAssetOpen, setIsCreateAssetOpen] = useState<boolean>(false);
  const [editingAsset, setEditingAsset] = useState<Asset | null>(null);
  const [preselectedHallForAsset, setPreselectedHallForAsset] = useState<string | null>(null);
  const [selectedWOForDetail, setSelectedWOForDetail] = useState<WorkOrder | null>(null);
  const [editingWorkOrder, setEditingWorkOrder] = useState<WorkOrder | null>(null);
  
  // Dedicated Meters Modals State
  const [selectedDeviceForReading, setSelectedDeviceForReading] = useState<MeterDevice | null>(null);
  const [isCreateDeviceOpen, setIsCreateDeviceOpen] = useState<boolean>(false);
  const [editingMeterDevice, setEditingMeterDevice] = useState<MeterDevice | null>(null);

  // Dedicated PM Modals State
  const [isCreatePMPlanOpen, setIsCreatePMPlanOpen] = useState<boolean>(false);
  const [editingPMPlan, setEditingPMPlan] = useState<PreventiveMaintenancePlan | null>(null);
  const [executingPMPlan, setExecutingPMPlan] = useState<PreventiveMaintenancePlan | null>(null);

  // Dedicated Spare Parts & Warehouse Modals State
  const [isCreatePartOpen, setIsCreatePartOpen] = useState<boolean>(false);
  const [editingPart, setEditingPart] = useState<SparePart | null>(null);
  const [selectedPartDetail, setSelectedPartDetail] = useState<SparePart | null>(null);

  // User Accounts & Permissions State
  const [users, setUsers] = useState<UserAccount[]>(() => 
    loadInitialEntityState('users', 'users', INITIAL_USERS)
  );

  // Clear any legacy persisted login state on mount so every visit starts unauthenticated
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState<boolean>(true);

  useEffect(() => {
    try {
      localStorage.removeItem(`${LOCAL_STORAGE_KEY_PREFIX}current_user_id`);
      localStorage.removeItem(`${LOCAL_STORAGE_KEY_PREFIX}is_logged_in`);
    } catch {
      // ignore
    }
  }, []);

  const currentUser = useMemo<UserAccount | null>(() => {
    if (!isLoggedIn || !currentUserId) return null;
    const found = users.find((u) => u.id === currentUserId && u.isActive);
    return found || null;
  }, [users, currentUserId, isLoggedIn]);

  const setCurrentUser = (user: UserAccount | null) => {
    if (!user) {
      setCurrentUserId(null);
      setIsLoggedIn(false);
      return;
    }
    setCurrentUserId(user.id);
    setIsLoggedIn(true);
    addNotification(`تم التبديل إلى حساب: ${user.fullName} (${user.roleTitle})`, 'info');
  };

  const loginWithCredentials = (
    identifier: string, 
    code: string
  ): { success: boolean; message: string; user?: UserAccount } => {
    const cleanId = identifier.trim().toLowerCase();
    const cleanCode = code.trim();

    if (!cleanId || !cleanCode) {
      return { success: false, message: 'يرجى إدخال اسم المستخدم ورمز الدخول معاً.' };
    }

    const matchedUser = users.find((u) => 
      u.username.toLowerCase() === cleanId || 
      u.id.toLowerCase() === cleanId ||
      u.fullName.toLowerCase() === cleanId
    );

    if (!matchedUser) {
      return { success: false, message: 'اسم المستخدم غير مسجل في منظومة الصيانة.' };
    }

    if (!matchedUser.isActive) {
      return { success: false, message: 'هذا الحساب معطّل حالياً من قبل الإدارة، يرجى مراجعة م. علي رضا.' };
    }

    const validPin = matchedUser.pinCode || matchedUser.password || '1234';
    if (validPin !== cleanCode) {
      return { success: false, message: 'رمز الدخول غير صحيح لهذا الحساب، يرجى التأكد وإعادة المحاولة.' };
    }

    // Success login
    const nowStr = new Date().toLocaleString('ar-EG', { dateStyle: 'short', timeStyle: 'short' });
    const updatedUser: UserAccount = { ...matchedUser, lastLogin: nowStr };
    setUsers((prev) => prev.map((u) => (u.id === matchedUser.id ? updatedUser : u)));
    setCurrentUserId(matchedUser.id);
    setIsLoggedIn(true);
    setIsLoginModalOpen(false);
    addNotification(`مرحباً بك ${matchedUser.fullName}، تم تسجيل الدخول بنجاح بصلاحية (${matchedUser.roleTitle}).`, 'success');
    return { success: true, message: 'تم تسجيل الدخول بنجاح', user: matchedUser };
  };

  const logoutCurrentUser = () => {
    const prevName = currentUser?.fullName || 'المستخدم';
    setIsLoggedIn(false);
    setCurrentUserId(null);
    setIsLoginModalOpen(true);
    try {
      localStorage.removeItem(`${LOCAL_STORAGE_KEY_PREFIX}current_user_id`);
      localStorage.removeItem(`${LOCAL_STORAGE_KEY_PREFIX}is_logged_in`);
    } catch {
      // ignore
    }
    addNotification(`تم تسجيل الخروج من حساب [${prevName}] بنجاح. يرجى تسجيل الدخول للمتابعة.`, 'info');
  };

  const [isUserModalOpen, setIsUserModalOpen] = useState<boolean>(false);
  const [editingUser, setEditingUser] = useState<UserAccount | null>(null);

  const [permissionWarningModal, setPermissionWarningModal] = useState<{
    isOpen: boolean;
    actionName: string;
    requiredPermission: string;
  } | null>(null);

  // Universal In-App Delete Confirmation Modal State
  const [deleteConfirmation, setDeleteConfirmation] = useState<DeleteConfirmationDialog | null>(null);

  const requestDeleteConfirmation = (dialog: Omit<DeleteConfirmationDialog, 'isOpen'>) => {
    setDeleteConfirmation({
      ...dialog,
      isOpen: true,
    });
  };

  const closeDeleteConfirmation = () => {
    setDeleteConfirmation(null);
  };

  // Shift Handover & Management State
  const [shiftLogs, setShiftLogs] = useState<ShiftLog[]>(() => 
    loadInitialEntityState('shift_logs', 'shift_logs', INITIAL_SHIFT_LOGS)
  );

  const [activeShiftLogId, setActiveShiftLogId] = useState<string>(() => {
    return INITIAL_SHIFT_LOGS[0]?.id || 'SHIFT-2026-09-08-M';
  });

  const activeShiftLog = useMemo(() => {
    return shiftLogs.find((s) => s.id === activeShiftLogId) || shiftLogs[0] || INITIAL_SHIFT_LOGS[0];
  }, [shiftLogs, activeShiftLogId]);

  const setActiveShiftLog = (log: ShiftLog) => {
    setActiveShiftLogId(log.id);
  };

  const [isShiftModalOpen, setIsShiftModalOpen] = useState<boolean>(false);
  const [editingShiftLog, setEditingShiftLog] = useState<ShiftLog | null>(null);

  const [globalSearch, setGlobalSearch] = useState<string>('');
  const [notifications, setNotifications] = useState<NotificationItem[]>([
    {
      id: 'wo-alert-001',
      message: 'تم إصدار أمر العمل WO-2026-003 بنجاح للماكينة CMP-01 (استبدال فلاتر الزيت والفاصل)',
      type: 'info',
      timestamp: 'اليوم 08:30',
    },
  ]);

  // External PHP Hosting & API Sync
  const [isPhpConnected, setIsPhpConnected] = useState<boolean>(false);

  const syncWithPhp = (entity: string, payload: any) => {
    if (typeof window === 'undefined') return;
    fetch(`api.php?action=sync_entity&entity=${entity}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    }).then(res => {
      if (res.ok) setIsPhpConnected(true);
    }).catch(() => {
      // Non-blocking fallback
    });
  };

  useEffect(() => {
    if (typeof window !== 'undefined') {
      fetch('api.php?action=status')
        .then(r => r.json())
        .then(d => {
          if (d && d.status === 'online') {
            setIsPhpConnected(true);
          }
        })
        .catch(() => {
          setIsPhpConnected(false);
        });
    }
  }, []);

  const downloadPhpPackage = () => {
    if (typeof window === 'undefined') return;
    const link = document.createElement('a');
    link.href = 'cmms_php_release.zip';
    link.download = 'cmms_almorjan_php_package.zip';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const exportDatabaseJson = () => {
    const fullData = {
      hangars,
      assets,
      equipment: assets,
      work_orders: workOrders,
      spare_parts: spareParts,
      meter_readings: meterReadings,
      pm_checklist: pmChecklist,
      meter_devices: meterDevices,
      device_reading_logs: deviceReadingLogs,
      pm_plans: pmPlans,
      users,
      shift_logs: shiftLogs,
      exported_at: new Date().toISOString(),
      system: 'CMMS Al-Morjan Packaging - Eng. Ali Redha'
    };
    const blob = new Blob([JSON.stringify(fullData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `almorjan_cmms_database_${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  // Sync to local storage and PHP server
  useEffect(() => {
    localStorage.setItem(`${LOCAL_STORAGE_KEY_PREFIX}hangars`, JSON.stringify(hangars));
    syncWithPhp('hangars', hangars);
  }, [hangars]);

  useEffect(() => {
    localStorage.setItem(`${LOCAL_STORAGE_KEY_PREFIX}assets`, JSON.stringify(assets));
    syncWithPhp('assets', assets);
  }, [assets]);

  useEffect(() => {
    localStorage.setItem(`${LOCAL_STORAGE_KEY_PREFIX}work_orders`, JSON.stringify(workOrders));
    syncWithPhp('work_orders', workOrders);
  }, [workOrders]);

  useEffect(() => {
    localStorage.setItem(`${LOCAL_STORAGE_KEY_PREFIX}spare_parts`, JSON.stringify(spareParts));
    syncWithPhp('spare_parts', spareParts);
  }, [spareParts]);

  useEffect(() => {
    localStorage.setItem(`${LOCAL_STORAGE_KEY_PREFIX}meter_readings`, JSON.stringify(meterReadings));
    syncWithPhp('meter_readings', meterReadings);
  }, [meterReadings]);

  useEffect(() => {
    localStorage.setItem(`${LOCAL_STORAGE_KEY_PREFIX}pm_checklist`, JSON.stringify(pmChecklist));
    syncWithPhp('pm_checklist', pmChecklist);
  }, [pmChecklist]);

  useEffect(() => {
    localStorage.setItem(`${LOCAL_STORAGE_KEY_PREFIX}meter_devices`, JSON.stringify(meterDevices));
    syncWithPhp('meter_devices', meterDevices);
  }, [meterDevices]);

  useEffect(() => {
    localStorage.setItem(`${LOCAL_STORAGE_KEY_PREFIX}device_reading_logs`, JSON.stringify(deviceReadingLogs));
    syncWithPhp('device_reading_logs', deviceReadingLogs);
  }, [deviceReadingLogs]);

  useEffect(() => {
    localStorage.setItem(`${LOCAL_STORAGE_KEY_PREFIX}pm_plans`, JSON.stringify(pmPlans));
    syncWithPhp('pm_plans', pmPlans);
  }, [pmPlans]);

  useEffect(() => {
    localStorage.setItem(`${LOCAL_STORAGE_KEY_PREFIX}users`, JSON.stringify(users));
    syncWithPhp('users', users);
  }, [users]);

  useEffect(() => {
    localStorage.setItem(`${LOCAL_STORAGE_KEY_PREFIX}shift_logs`, JSON.stringify(shiftLogs));
    syncWithPhp('shift_logs', shiftLogs);
  }, [shiftLogs]);

  // Permission Evaluation & Enforcement
  const canAccess = (permissionKey: keyof UserPermissions): boolean => {
    if (!isLoggedIn || !currentUser) return false;
    if (currentUser.isSuperDeveloper || currentUser.role === 'DEVELOPER') return true;
    return !!currentUser.permissions?.[permissionKey];
  };

  const canViewTab = (tab: TabType): boolean => {
    if (!isLoggedIn || !currentUser) return false;
    if (currentUser.isSuperDeveloper || currentUser.role === 'DEVELOPER') return true;
    switch (tab) {
      case 'dashboard': return !!currentUser.permissions.canViewDashboard;
      case 'assets': return !!currentUser.permissions.canViewAssets;
      case 'work-orders': return !!currentUser.permissions.canViewWorkOrders;
      case 'meters': return !!currentUser.permissions.canViewMeters;
      case 'preventive': return !!currentUser.permissions.canViewPreventive;
      case 'warehouse': return !!currentUser.permissions.canViewWarehouse;
      case 'shift-report': return !!currentUser.permissions.canViewShiftReport;
      case 'reports': return !!currentUser.permissions.canViewReports;
      case 'developer-hub': return !!currentUser.permissions.canViewDeveloperHub;
      default: return true;
    }
  };

  const getPermissionLabel = (key: keyof UserPermissions): string => {
    const map: Record<keyof UserPermissions, string> = {
      canViewDashboard: 'عرض لوحة المؤشرات',
      canViewAssets: 'عرض سجل الأصول والماكينات',
      canViewWorkOrders: 'عرض أوامر العمل',
      canViewMeters: 'عرض العدادات وأجهزة القياس',
      canViewPreventive: 'عرض الصيانة الوقائية',
      canViewWarehouse: 'عرض مستودع قطع الغيار',
      canViewShiftReport: 'عرض تقرير الدوريات',
      canViewReports: 'عرض التقارير والإحصائيات',
      canViewDeveloperHub: 'دخول لوحة المطور',
      canManageAssets: 'إدارة وتعديل وحذف الأصول والقاعات',
      canManageWorkOrders: 'إدارة وتعديل أوامر العمل',
      canManageMeters: 'إدارة العدادات وقراءات الأجهزة',
      canManagePreventive: 'إدارة وتنفيذ الصيانة الوقائية',
      canManageWarehouse: 'إدارة المستودع وحركات المخزون',
      canManageShifts: 'إدارة وتوقيع تقارير الدوريات',
      canManageUsers: 'إدارة الحسابات وتعديل الصلاحيات (المطور)',
    };
    return map[key] || key;
  };

  const showPermissionWarning = (actionName: string, requiredPermission: string) => {
    setPermissionWarningModal({
      isOpen: true,
      actionName,
      requiredPermission,
    });
    addNotification(`صلاحية غير متوفرة: "${actionName}" تتطلب إذن معتمد من مطور النظام م. علي رضا`, 'warning');
  };

  const closePermissionWarning = () => {
    setPermissionWarningModal(null);
  };

  const checkPermission = (permissionKey: keyof UserPermissions, actionLabel: string): boolean => {
    if (canAccess(permissionKey)) return true;
    showPermissionWarning(actionLabel, getPermissionLabel(permissionKey));
    return false;
  };

  // User Accounts Operations
  const addUser = (userData: Omit<UserAccount, 'id' | 'createdAt'>) => {
    if (!checkPermission('canManageUsers', 'إنشاء حساب مستخدم جديد')) return;
    const newId = `USR-${Date.now().toString(36).toUpperCase()}`;
    const initials = userData.avatarInitials || userData.fullName
      .trim()
      .split(' ')
      .map((w) => w[0])
      .join('')
      .slice(0, 2)
      .toUpperCase() || 'US';
    const pin = userData.pinCode || userData.password || '1234';
    const newUser: UserAccount = {
      ...userData,
      id: newId,
      avatarInitials: initials,
      pinCode: pin,
      password: pin,
      createdAt: new Date().toISOString().split('T')[0],
      isActive: true,
    };
    setUsers((prev) => [newUser, ...prev]);
    addNotification(`تم إنشاء حساب المستخدم [${newUser.fullName}] بنجاح وتعيين الصلاحيات`, 'success');
  };

  const updateUser = (updatedUser: UserAccount) => {
    if (!checkPermission('canManageUsers', 'تعديل بيانات وصلاحيات المستخدم')) return;
    setUsers((prev) => prev.map((u) => (u.id === updatedUser.id ? updatedUser : u)));
    addNotification(`تم تحديث بيانات وصلاحيات المستخدم [${updatedUser.fullName}] بنجاح`, 'success');
  };

  const deleteUser = (userId: string): boolean => {
    const target = users.find((u) => u.id === userId);
    setUsers((prev) => {
      const next = prev.filter((u) => u.id !== userId);
      try {
        localStorage.setItem(`${LOCAL_STORAGE_KEY_PREFIX}users`, JSON.stringify(next));
      } catch (e) {
        console.error('Failed to persist users to localStorage', e);
      }
      return next;
    });

    if (currentUser?.id === userId) {
      setCurrentUser(null);
      setIsLoggedIn(false);
      setIsLoginModalOpen(true);
    }
    addNotification(`تم حذف حساب المستخدم [${target?.fullName || userId}] نهائياً بنجاح`, 'info');
    return true;
  };

  const deleteWorkOrder = (woId: string) => {
    const target = workOrders.find((w) => w.id === woId);
    setWorkOrders((prev) => {
      const next = prev.filter((w) => w.id !== woId);
      try {
        localStorage.setItem(`${LOCAL_STORAGE_KEY_PREFIX}work_orders`, JSON.stringify(next));
      } catch (e) {
        console.error('Failed to persist work orders', e);
      }
      return next;
    });
    if (selectedWOForDetail?.id === woId) {
      setSelectedWOForDetail(null);
    }
    if (editingWorkOrder?.id === woId) {
      setEditingWorkOrder(null);
    }
    addNotification(`تم حذف أمر العمل [${(target as any)?.code || target?.id || target?.title || woId}] بنجاح`, 'info');
  };

  const deleteShiftLog = (shiftId: string) => {
    const target = shiftLogs.find((s) => s.id === shiftId);
    setShiftLogs((prev) => {
      const next = prev.filter((s) => s.id !== shiftId);
      try {
        localStorage.setItem(`${LOCAL_STORAGE_KEY_PREFIX}shift_logs`, JSON.stringify(next));
      } catch (e) {
        console.error('Failed to persist shift logs', e);
      }
      return next;
    });
    if (activeShiftLogId === shiftId) {
      const remaining = shiftLogs.filter((s) => s.id !== shiftId);
      if (remaining.length > 0) {
        setActiveShiftLogId(remaining[0].id);
      }
    }
    addNotification(`تم حذف تقرير الوردية بنجاح`, 'info');
  };

  const toggleUserStatus = (userId: string) => {
    if (!checkPermission('canManageUsers', 'تغيير حالة تفعيل الحساب')) return;
    const target = users.find((u) => u.id === userId);
    if (target?.isSuperDeveloper) {
      addNotification('لا يمكن تعطيل حساب المطور ومدير الصيانة م. علي رضا', 'error');
      return;
    }
    setUsers((prev) =>
      prev.map((u) => (u.id === userId ? { ...u, isActive: !u.isActive } : u))
    );
    addNotification(`تم تغيير حالة حساب [${target?.fullName}]`, 'info');
  };

  // Shift Operations
  const addShiftLog = (logData: Omit<ShiftLog, 'id'>) => {
    if (!checkPermission('canManageShifts', 'إنشاء تقرير وردية جديد')) return;
    const newId = `SHIFT-${logData.date}-${logData.shiftType[0]}-${Date.now().toString(36).toUpperCase()}`;
    const newLog: ShiftLog = { ...logData, id: newId };
    setShiftLogs((prev) => [newLog, ...prev]);
    setActiveShiftLogId(newId);
    addNotification(`تم تسجيل محضر وردية جديد (${newLog.shiftName}) بنجاح`, 'success');
  };

  const updateShiftLog = (updatedLog: ShiftLog) => {
    if (!checkPermission('canManageShifts', 'تعديل بيانات تقرير الوردية')) return;
    setShiftLogs((prev) => prev.map((s) => (s.id === updatedLog.id ? updatedLog : s)));
    addNotification(`تم حفظ وتحديث تقرير الوردية (${updatedLog.shiftName}) بنجاح`, 'success');
  };

  const signShiftHandover = (
    shiftId: string,
    roleType: 'handedOver' | 'received' | 'approved',
    signerName: string
  ) => {
    if (!checkPermission('canManageShifts', 'توقيع واعتماد محضر تسليم الوردية')) return;
    const nowStr = new Date().toLocaleString('ar-EG', { dateStyle: 'short', timeStyle: 'short' });
    setShiftLogs((prev) =>
      prev.map((s) => {
        if (s.id !== shiftId) return s;
        const updated = { ...s };
        if (roleType === 'handedOver') {
          updated.handedOverBy = {
            name: signerName || currentUser?.fullName || 'مهندس الوردية',
            role: currentUser?.roleTitle || 'مهندس نوبة',
            timestamp: nowStr,
            signed: true,
          };
          updated.status = 'HANDED_OVER';
        } else if (roleType === 'received') {
          updated.receivedBy = {
            name: signerName || currentUser?.fullName || 'مهندس الوردية',
            role: currentUser?.roleTitle || 'مهندس نوبة',
            timestamp: nowStr,
            signed: true,
          };
        } else if (roleType === 'approved') {
          updated.approvedByManager = {
            name: signerName || 'م. علي رضا (مدير الصيانة)',
            role: 'مطور النظام ومدير إدارة الصيانة',
            timestamp: nowStr,
            signed: true,
          };
          updated.status = 'APPROVED';
        }
        return updated;
      })
    );
    addNotification(`تم توقيع واعتماد محضر الوردية بنجاح`, 'success');
  };

  const addNotification = (message: string, type: 'info' | 'success' | 'warning' | 'error' = 'info') => {
    // User restriction: Notifications ONLY appear upon Work Order issuance
    const isWOIssuance = 
      message.includes('تم إصدار أمر العمل') || 
      message.includes('إصدار أمر عمل') || 
      message.includes('بلاغ عطل طارئ');

    if (!isWOIssuance) {
      return; // Suppress any non-work-order notification
    }

    const newNotif: NotificationItem = {
      id: `${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      message,
      type,
      timestamp: new Date().toLocaleTimeString('ar-EG', { hour: '2-digit', minute: '2-digit' }),
    };
    setNotifications((prev) => [newNotif, ...prev.slice(0, 9)]);
  };

  const dismissNotification = (id: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  };

  // Synchronize asset statuses with active work orders
  // If an asset has an active CRITICAL_STOPPAGE work order, it should be STOPPED
  // If it has other IN_PROGRESS or PENDING work orders, it may be UNDER_MAINTENANCE
  const recalculateAssetStatuses = (currentAssets: Asset[], currentWOs: WorkOrder[]): Asset[] => {
    return currentAssets.map((asset) => {
      // Find active work orders for this asset
      const activeWOs = currentWOs.filter(
        (wo) => wo.assetId === asset.id && !['COMPLETED', 'CLOSED'].includes(wo.status)
      );

      if (activeWOs.length === 0) {
        // If it was stopped or under maintenance due to work orders, restore to OPERATIONAL
        // (unless it's a generator or standby compressor designed to be STANDBY)
        if (asset.id.startsWith('GEN-') || asset.id === 'CMP-04' || asset.id === 'CHL-04') {
          return { ...asset, status: 'STANDBY' };
        }
        return { ...asset, status: 'OPERATIONAL' };
      }

      const hasStoppage = activeWOs.some(
        (wo) => wo.priority === 'CRITICAL_STOPPAGE' || wo.type === 'EMERGENCY_BREAKDOWN'
      );

      if (hasStoppage) {
        return { ...asset, status: 'STOPPED' };
      }

      return { ...asset, status: 'UNDER_MAINTENANCE' };
    });
  };

  // Calculate Real-time KPIs
  const kpis: PlantKPIs = useMemo(() => {
    const totalAssets = assets.length; // 43
    const operationalAssets = assets.filter((a) => a.status === 'OPERATIONAL').length;
    const underMaintenanceAssets = assets.filter((a) => a.status === 'UNDER_MAINTENANCE').length;
    const stoppedAssets = assets.filter((a) => a.status === 'STOPPED').length;
    const standbyAssets = assets.filter((a) => a.status === 'STANDBY').length;

    // Availability Rate %
    // (Operational + Standby) / Total Assets * 100
    const availableCount = operationalAssets + standbyAssets;
    const availabilityRate = Number(((availableCount / (totalAssets || 1)) * 100).toFixed(1));

    const activeWOs = workOrders.filter((wo) => !['COMPLETED', 'CLOSED'].includes(wo.status));
    const emergencyStoppages = workOrders.filter(
      (wo) => !['COMPLETED', 'CLOSED'].includes(wo.status) && (wo.priority === 'CRITICAL_STOPPAGE' || wo.type === 'EMERGENCY_BREAKDOWN')
    ).length;

    const lowStockItemsCount = spareParts.filter((p) => p.quantity <= p.minThreshold).length;

    // Total downtime from active or recent WOs
    const totalDowntimeMinutesToday = workOrders
      .filter((wo) => wo.reportedAt.startsWith('2026-09-04') || wo.reportedAt.startsWith(new Date().toISOString().slice(0, 10)))
      .reduce((sum, wo) => sum + (wo.downtimeMinutes || 0), 0);

    return {
      totalAssets,
      operationalAssets,
      underMaintenanceAssets,
      stoppedAssets,
      standbyAssets,
      availabilityRate,
      mttrHours: 1.25, // 1 hour 15 min industry benchmark for flexible packaging
      mtbfHours: 184,  // Mean Time Between Failures
      activeWorkOrders: activeWOs.length,
      emergencyStoppages,
      lowStockItemsCount,
      totalDowntimeMinutesToday,
    };
  }, [assets, workOrders, spareParts]);

  // Actions
  const createWorkOrder = (newWoData: Omit<WorkOrder, 'id' | 'reportedAt' | 'consumedParts' | 'downtimeMinutes'> & { consumedParts?: WorkOrder['consumedParts']; downtimeMinutes?: number }): WorkOrder => {
    const nextNumber = workOrders.length + 1;
    const pad = nextNumber < 10 ? `000${nextNumber}` : nextNumber < 100 ? `00${nextNumber}` : `0${nextNumber}`;
    const newId = `WO-2026-${pad}`;

    const now = new Date();
    const dateStr = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')} ${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;

    const newWO: WorkOrder = {
      ...newWoData,
      id: newId,
      reportedAt: dateStr,
      consumedParts: newWoData.consumedParts || [],
      downtimeMinutes: newWoData.downtimeMinutes || (newWoData.priority === 'CRITICAL_STOPPAGE' ? 60 : 0),
      approvedBy: newWoData.approvedBy || 'مدير الصيانة م. علي رضا',
    };

    const updatedWOs = [newWO, ...workOrders];
    setWorkOrders(updatedWOs);

    // Update asset statuses immediately
    setAssets((prevAssets) => recalculateAssetStatuses(prevAssets, updatedWOs));

    addNotification(
      `تم إصدار أمر العمل ${newId} بنجاح للماكينة ${newWO.assetId} (${newWO.title})`,
      newWO.priority === 'CRITICAL_STOPPAGE' ? 'error' : 'info'
    );

    return newWO;
  };

  const updateWorkOrderStatus = (woId: string, newStatus: WorkOrderStatus) => {
    let closedAssetId = '';
    const updatedWOs = workOrders.map((wo) => {
      if (wo.id === woId) {
        closedAssetId = wo.assetId;
        const now = new Date();
        const dateStr = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')} ${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
        return {
          ...wo,
          status: newStatus,
          completedAt: ['COMPLETED', 'CLOSED'].includes(newStatus) ? (wo.completedAt || dateStr) : undefined,
        };
      }
      return wo;
    });

    setWorkOrders(updatedWOs);

    // If order was completed/closed, recalculate asset status
    if (['COMPLETED', 'CLOSED'].includes(newStatus)) {
      setAssets((prevAssets) => {
        const nextAssets = recalculateAssetStatuses(prevAssets, updatedWOs);
        return nextAssets;
      });
      addNotification(`تم تحديث أمر العمل ${woId} إلى حالة: ${newStatus === 'COMPLETED' ? 'منجز' : 'مغلق ومؤرشف'} وتمت استعادة تشغيل الأصل ${closedAssetId}`, 'success');
    } else {
      addNotification(`تم تغيير حالة أمر العمل ${woId} إلى ${newStatus}`, 'info');
    }

    if (selectedWOForDetail && selectedWOForDetail.id === woId) {
      setSelectedWOForDetail((prev) => prev ? { ...prev, status: newStatus } : null);
    }
  };

  const updateWorkOrder = (updatedWO: WorkOrder) => {
    const updatedWOs = workOrders.map((wo) => (wo.id === updatedWO.id ? updatedWO : wo));
    setWorkOrders(updatedWOs);
    setAssets((prevAssets) => recalculateAssetStatuses(prevAssets, updatedWOs));
    if (selectedWOForDetail && selectedWOForDetail.id === updatedWO.id) {
      setSelectedWOForDetail(updatedWO);
    }
    addNotification(`تم حفظ التعديلات على أمر العمل ${updatedWO.id}`, 'success');
  };

  const consumePartInWorkOrder = (woId: string, partId: string, quantity: number): boolean => {
    const part = spareParts.find((p) => p.id === partId);
    if (!part) return false;

    if (part.quantity < quantity) {
      addNotification(`الكمية المطلوبة من ${part.name} غير متوفرة في المستودع! (الرصيد: ${part.quantity})`, 'error');
      return false;
    }

    // 1. Deduct from stock
    const newStock = part.quantity - quantity;
    const now = new Date();
    const dateStr = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;
    const timeStr = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;

    const movement: StockMovementLog = {
      id: `MOV-${Date.now().toString().slice(-5)}`,
      timestamp: `${dateStr} ${timeStr}`,
      type: 'OUT',
      quantity: quantity,
      balanceAfter: newStock,
      reason: `صرف لأمر العمل ${woId}`,
      referenceNumber: woId,
      performedBy: 'فني صيانة معتمد',
    };

    const updatedParts = spareParts.map((p) => 
      p.id === partId ? { 
        ...p, 
        quantity: newStock,
        movementHistory: [movement, ...(p.movementHistory || [])]
      } : p
    );
    setSpareParts(updatedParts);

    // 2. Add to work order consumed parts
    const updatedWOs = workOrders.map((wo) => {
      if (wo.id === woId) {
        const existingConsumed = wo.consumedParts.find((cp) => cp.partId === partId);
        let nextConsumed = [...wo.consumedParts];
        if (existingConsumed) {
          nextConsumed = nextConsumed.map((cp) => 
            cp.partId === partId ? { ...cp, quantity: cp.quantity + quantity } : cp
          );
        } else {
          nextConsumed.push({
            partId: part.id,
            partName: part.name,
            partNumber: part.partNumber,
            quantity: quantity,
            unitCost: part.unitCost,
          });
        }
        return { ...wo, consumedParts: nextConsumed };
      }
      return wo;
    });

    setWorkOrders(updatedWOs);

    if (selectedWOForDetail && selectedWOForDetail.id === woId) {
      const refreshedWO = updatedWOs.find((w) => w.id === woId);
      if (refreshedWO) setSelectedWOForDetail(refreshedWO);
    }

    if (selectedPartDetail && selectedPartDetail.id === partId) {
      const refreshedPart = updatedParts.find((p) => p.id === partId);
      if (refreshedPart) setSelectedPartDetail(refreshedPart);
    }

    if (newStock <= part.minThreshold) {
      addNotification(`تحذير مخزني: رصيد ${part.name} انخفض إلى ${newStock} ${part.unit} (أقل من الحد الأدنى ${part.minThreshold})`, 'warning');
    } else {
      addNotification(`تم صرف ${quantity} ${part.unit} من ${part.name} وخصمها من المستودع لأمر العمل ${woId}`, 'success');
    }

    return true;
  };

  const restockPart = (
    partId: string, 
    quantityToAdd: number, 
    details?: { reason?: string; referenceNumber?: string; performedBy?: string }
  ) => {
    const now = new Date();
    const dateStr = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;
    const timeStr = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
    let partName = '';

    setSpareParts((prev) =>
      prev.map((p) => {
        if (p.id === partId) {
          partName = p.name;
          const newQty = p.quantity + quantityToAdd;
          const movement: StockMovementLog = {
            id: `MOV-${Date.now().toString().slice(-5)}`,
            timestamp: `${dateStr} ${timeStr}`,
            type: 'IN',
            quantity: quantityToAdd,
            balanceAfter: newQty,
            reason: details?.reason || 'توريد مستودعي وإضافة رصيد',
            referenceNumber: details?.referenceNumber || 'إذن توريد',
            performedBy: details?.performedBy || 'أمين المستودع',
          };

          const updated = {
            ...p,
            quantity: newQty,
            lastRestockedDate: dateStr,
            movementHistory: [movement, ...(p.movementHistory || [])],
          };

          if (selectedPartDetail && selectedPartDetail.id === partId) {
            setSelectedPartDetail(updated);
          }

          return updated;
        }
        return p;
      })
    );
    addNotification(`تم توريد وإضافة ${quantityToAdd} وحدة إلى رصيد ${partName} بنجاح`, 'success');
  };

  const consumePart = (
    partId: string, 
    quantityToConsume: number, 
    details?: { reason?: string; referenceNumber?: string; performedBy?: string }
  ): boolean => {
    const part = spareParts.find((p) => p.id === partId);
    if (!part) return false;
    if (part.quantity < quantityToConsume) {
      addNotification(`الرصيد المتاح من ${part.name} لا يكفي (${part.quantity} ${part.unit})`, 'error');
      return false;
    }
    const newStock = part.quantity - quantityToConsume;
    const now = new Date();
    const dateStr = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;
    const timeStr = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;

    const movement: StockMovementLog = {
      id: `MOV-${Date.now().toString().slice(-5)}`,
      timestamp: `${dateStr} ${timeStr}`,
      type: 'OUT',
      quantity: quantityToConsume,
      balanceAfter: newStock,
      reason: details?.reason || 'صرف لخط الإنتاج',
      referenceNumber: details?.referenceNumber || 'طلب صرف',
      performedBy: details?.performedBy || 'فني الصيانة',
    };

    setSpareParts((prev) =>
      prev.map((p) => {
        if (p.id === partId) {
          const updated = { 
            ...p, 
            quantity: newStock,
            movementHistory: [movement, ...(p.movementHistory || [])]
          };
          if (selectedPartDetail && selectedPartDetail.id === partId) {
            setSelectedPartDetail(updated);
          }
          return updated;
        }
        return p;
      })
    );

    if (newStock <= part.minThreshold) {
      addNotification(`تحذير مخزني: رصيد ${part.name} انخفض إلى ${newStock} ${part.unit} (أقل من الحد الأدنى)`, 'warning');
    } else {
      addNotification(`تم صرف ${quantityToConsume} ${part.unit} من ${part.name} بنجاح`, 'info');
    }
    return true;
  };

  const addSparePart = (newPartData: Omit<SparePart, 'id'>) => {
    const nextNumber = spareParts.length + 1;
    const pad = nextNumber < 10 ? `00${nextNumber}` : nextNumber < 100 ? `0${nextNumber}` : `${nextNumber}`;
    const newId = `PART-${pad}`;
    const now = new Date();
    const dateStr = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;
    const timeStr = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;

    const initialMovement: StockMovementLog = {
      id: `MOV-${Date.now().toString().slice(-5)}`,
      timestamp: `${dateStr} ${timeStr}`,
      type: 'IN',
      quantity: newPartData.quantity || 0,
      balanceAfter: newPartData.quantity || 0,
      reason: 'رصيد افتتاحي عند إدراج الصنف الجديد في الكتالوج',
      referenceNumber: 'INITIAL-ENTRY',
      performedBy: 'مدير الصيانة م. علي رضا',
    };

    const newPart: SparePart = {
      ...newPartData,
      id: newId,
      currency: newPartData.currency || 'USD',
      lastRestockedDate: newPartData.lastRestockedDate || dateStr,
      movementHistory: newPartData.movementHistory || (newPartData.quantity > 0 ? [initialMovement] : []),
    };

    setSpareParts((prev) => [newPart, ...prev]);
    addNotification(`تمت إضافة قطعة الغيار الجديدة [${newPart.partNumber}] ${newPart.name} إلى المستودع بنجاح`, 'success');
  };

  const updateSparePart = (updatedPart: SparePart) => {
    setSpareParts((prev) => prev.map((p) => (p.id === updatedPart.id ? updatedPart : p)));
    if (selectedPartDetail && selectedPartDetail.id === updatedPart.id) {
      setSelectedPartDetail(updatedPart);
    }
    addNotification(`تم حفظ وتحديث بيانات قطعة الغيار [${updatedPart.partNumber}] ${updatedPart.name} بنجاح`, 'success');
  };

  const deleteSparePart = (partId: string) => {
    const part = spareParts.find((p) => p.id === partId);
    setSpareParts((prev) => prev.filter((p) => p.id !== partId));
    if (selectedPartDetail && selectedPartDetail.id === partId) {
      setSelectedPartDetail(null);
    }
    addNotification(`تم حذف قطعة الغيار [${part?.name || partId}] من المستودع`, 'info');
  };

  const logMeterReading = (reading: Omit<MeterReading, 'id' | 'timestamp'>) => {
    const now = new Date();
    const dateStr = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;
    const timeStr = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
    const newId = `MTR-${dateStr.replace(/-/g, '')}-${Date.now().toString().slice(-4)}`;

    // Evaluate status based on thresholds
    let status: 'NORMAL' | 'WARNING' | 'CRITICAL' = 'NORMAL';
    const isPressureOut = reading.airPressureBar < 7.8 || reading.airPressureBar > 9.2;
    const isChillerOut = reading.chillerTempC < 5.0 || reading.chillerTempC > 12.0;
    const isBoilerOut = reading.boilerTempC < 220 || reading.boilerTempC > 280;

    if (isPressureOut || isChillerOut || isBoilerOut) {
      status = 'CRITICAL';
    } else if (
      reading.airPressureBar < 8.1 || reading.airPressureBar > 8.9 ||
      reading.chillerTempC < 6.5 || reading.chillerTempC > 10.5 ||
      reading.boilerTempC < 235 || reading.boilerTempC > 270
    ) {
      status = 'WARNING';
    }

    const newReading: MeterReading = {
      ...reading,
      id: newId,
      timestamp: `${dateStr} ${timeStr}`,
      date: dateStr,
      time: timeStr,
      status,
    };

    setMeterReadings((prev) => [newReading, ...prev]);

    if (status === 'CRITICAL') {
      addNotification(`تنبيه حرج في قراءات العدادات اليومية! مؤشرات الضغط أو الحرارة خرجت عن النطاق الآمن.`, 'error');
    } else if (status === 'WARNING') {
      addNotification(`تم تسجيل قراءة العدادات مع وجود تحذير طفيف في بعض القيم.`, 'warning');
    } else {
      addNotification(`تم تسجيل قراءات العدادات اليومية بنجاح لكافة محطات المرافق والخدمات.`, 'success');
    }
  };

  const togglePMChecklistItem = (id: string, newStatus: 'PASSED' | 'FAILED' | 'PENDING') => {
    const today = new Date().toISOString().slice(0, 10);
    setPmChecklist((prev) =>
      prev.map((item) => {
        if (item.id === id) {
          return {
            ...item,
            status: newStatus,
            lastCheckedDate: today,
            checkedBy: newStatus !== 'PENDING' ? 'فريق الصيانة الوقائية' : item.checkedBy,
          };
        }
        return item;
      })
    );
    addNotification(`تم تحديث فحص الصيانة الوقائية إلى (${newStatus === 'PASSED' ? 'ناجح ومطابق' : newStatus === 'FAILED' ? 'فشل - يحتاج تدخل' : 'قيد الانتظار'})`, 'info');
  };

  const createWOFromPMItem = (item: PMChecklistItem) => {
    const matchingAsset = assets.find((a) => a.id === item.assetId) || assets[0];
    createWorkOrder({
      title: `إجراء صيانة فورية: ${item.title}`,
      assetId: matchingAsset.id,
      assetName: matchingAsset.name,
      hangarId: item.hangarId,
      type: 'CORRECTIVE',
      priority: 'HIGH',
      status: 'APPROVED',
      reportedBy: 'نظام الفحص الوقائي الدوري',
      assignedTo: 'فريق الصيانة المتخصص',
      technicianSpecialty: item.category === 'ميكانيكي' ? 'MECHANICAL' : item.category === 'كهربائي' ? 'ELECTRICAL' : 'UTILITIES',
      description: `تم اكتشاف خلل أو حاجة ضبط أثناء الفحص الوقائي: ${item.procedure}. الملاحظات الحرجة: ${item.criticalPoints}`,
    });
    setActiveTab('work-orders');
  };

  // --- Dedicated Meters & Instrumentation Actions ---
  const addMeterDevice = (deviceData: Omit<MeterDevice, 'id'>) => {
    const newId = `DEV-${(deviceData.category || 'EQP').substring(0, 3)}-${Date.now().toString().slice(-4)}`;
    const newDevice: MeterDevice = {
      ...deviceData,
      id: newId,
      status: deviceData.status || 'OPERATIONAL',
    };
    setMeterDevices((prev) => [newDevice, ...prev]);
    addNotification(`تمت إضافة جهاز القياس [${newDevice.name}] بنجاح وتعيين البارامترات ووحدات القياس`, 'success');
  };

  const updateMeterDevice = (updated: MeterDevice) => {
    setMeterDevices((prev) => prev.map((d) => (d.id === updated.id ? updated : d)));
    addNotification(`تم تحديث وحفظ بيانات جهاز القياس والعداد [${updated.name}] بنجاح`, 'success');
  };

  const deleteMeterDevice = (id: string) => {
    const dev = meterDevices.find((d) => d.id === id);
    setMeterDevices((prev) => prev.filter((d) => d.id !== id));
    addNotification(`تم حذف جهاز العدادات [${dev?.name || id}] بنجاح`, 'info');
  };

  const logDeviceReading = (readingData: Omit<DeviceReadingLog, 'id' | 'timestamp'>) => {
    const now = new Date();
    const dateStr = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;
    const timeStr = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
    const newId = `LOG-${readingData.deviceId}-${Date.now().toString().slice(-4)}`;

    const device = meterDevices.find((d) => d.id === readingData.deviceId);

    let derivedStatus: 'NORMAL' | 'WARNING' | 'CRITICAL' = readingData.status || 'NORMAL';
    if (device) {
      for (const param of device.parameters) {
        const val = readingData.values[param.id];
        if (typeof val === 'number') {
          if (param.criticalMax && val >= param.criticalMax) {
            derivedStatus = 'CRITICAL';
            break;
          }
          if ((param.minThreshold && val < param.minThreshold) || (param.maxThreshold && val > param.maxThreshold)) {
            derivedStatus = 'WARNING';
          }
        }
      }
    }

    const newLog: DeviceReadingLog = {
      ...readingData,
      id: newId,
      timestamp: `${dateStr} ${timeStr}`,
      date: dateStr,
      time: timeStr,
      status: derivedStatus,
    };

    setDeviceReadingLogs((prev) => [newLog, ...prev]);

    setMeterDevices((prev) =>
      prev.map((d) =>
        d.id === readingData.deviceId
          ? {
              ...d,
              lastReadingDate: `${dateStr} ${timeStr}`,
              lastReadingValues: { ...(d.lastReadingValues || {}), ...readingData.values },
              status: derivedStatus === 'CRITICAL' ? 'WARNING' : d.status,
            }
          : d
      )
    );

    addNotification(
      `تم تسجيل قراءة العداد للجهاز [${readingData.deviceName}] (${derivedStatus === 'NORMAL' ? 'طبيعي ومستقر' : derivedStatus === 'WARNING' ? 'تنبيه: بعض القيم تجاوزت النطاق المعتاد' : 'تحذير حرج: تعدي الحد الأقصى'})`,
      derivedStatus === 'CRITICAL' ? 'error' : derivedStatus === 'WARNING' ? 'warning' : 'success'
    );
  };

  const deleteDeviceReading = (id: string) => {
    setDeviceReadingLogs((prev) => prev.filter((l) => l.id !== id));
    addNotification('تم حذف سجل القراءة المحدد', 'info');
  };

  // --- Professional PM Plan Actions ---
  const addPMPlan = (planData: Omit<PreventiveMaintenancePlan, 'id' | 'history'>) => {
    const newId = `PM-${Date.now().toString().slice(-5)}`;
    const newPlan: PreventiveMaintenancePlan = {
      ...planData,
      id: newId,
      history: [],
    };
    setPmPlans((prev) => [newPlan, ...prev]);
    addNotification(`تمت جدولة خطة الصيانة الوقائية الاحترافية [${newPlan.title}] بنجاح`, 'success');
  };

  const updatePMPlan = (updated: PreventiveMaintenancePlan) => {
    setPmPlans((prev) => prev.map((p) => (p.id === updated.id ? updated : p)));
    addNotification(`تم تحديث خطة الصيانة الوقائية [${updated.title}] ومواعيد تكرارها بنجاح`, 'success');
  };

  const deletePMPlan = (id: string) => {
    const plan = pmPlans.find((p) => p.id === id);
    setPmPlans((prev) => prev.filter((p) => p.id !== id));
    addNotification(`تم حذف خطة الصيانة الوقائية [${plan?.title || id}]`, 'info');
  };

  const executePMPlan = (planId: string, result: {
    passed: boolean;
    completedBy: string;
    durationMinutes: number;
    notes?: string;
    createWorkOrderOnFail?: boolean;
  }) => {
    const today = new Date();
    const todayStr = today.toISOString().slice(0, 10);

    let targetPlan: PreventiveMaintenancePlan | undefined;

    setPmPlans((prevPlans) =>
      prevPlans.map((plan) => {
        if (plan.id !== planId) return plan;
        targetPlan = plan;

        // Calculate next due date according to frequency
        const nextDate = new Date(today);
        switch (plan.frequency) {
          case 'DAILY':
            nextDate.setDate(nextDate.getDate() + 1);
            break;
          case 'WEEKLY':
            nextDate.setDate(nextDate.getDate() + 7);
            break;
          case 'BIWEEKLY':
            nextDate.setDate(nextDate.getDate() + 14);
            break;
          case 'MONTHLY':
            nextDate.setMonth(nextDate.getMonth() + 1);
            break;
          case 'QUARTERLY':
            nextDate.setMonth(nextDate.getMonth() + 3);
            break;
          case 'SEMI_ANNUAL':
            nextDate.setMonth(nextDate.getMonth() + 6);
            break;
          case 'ANNUAL':
            nextDate.setFullYear(nextDate.getFullYear() + 1);
            break;
          case 'RUNNING_HOURS':
          default:
            nextDate.setDate(nextDate.getDate() + 30);
            break;
        }
        const nextDueStr = nextDate.toISOString().slice(0, 10);

        const newHistory = {
          id: `HIST-${Date.now().toString().slice(-4)}`,
          completedAt: `${todayStr} ${String(today.getHours()).padStart(2, '0')}:${String(today.getMinutes()).padStart(2, '0')}`,
          completedBy: result.completedBy || 'فريق الصيانة الوقائية',
          durationMinutes: result.durationMinutes || plan.estimatedDurationMinutes,
          passed: result.passed,
          notes: result.notes || '',
        };

        return {
          ...plan,
          status: 'SCHEDULED',
          lastCompletedDate: todayStr,
          nextDueDate: nextDueStr,
          history: [newHistory, ...(plan.history || [])],
        };
      })
    );

    if (result.passed) {
      addNotification(`تم تنفيذ وإنجاز خطة الصيانة الوقائية [${targetPlan?.title || planId}] بنجاح وتحديث موعد الاستحقاق القادم تلقائياً.`, 'success');
    } else {
      addNotification(`تم تسجيل عدم مطابقة أو ملاحظات في فحص [${targetPlan?.title || planId}].`, 'warning');
      if (result.createWorkOrderOnFail && targetPlan) {
        createWorkOrder({
          title: `أمر عمل إصلاحي طارئ: صيانة وتصحيح ${targetPlan.title}`,
          assetId: targetPlan.assetId,
          assetName: targetPlan.assetName,
          hangarId: targetPlan.hangarId,
          type: 'CORRECTIVE',
          priority: 'HIGH',
          status: 'APPROVED',
          reportedBy: `الفحص الوقائي الدوري (${result.completedBy})`,
          assignedTo: targetPlan.assignedTechnician,
          technicianSpecialty: targetPlan.technicianSpecialty,
          description: `رصد خلل أثناء تنفيذ خطة الصيانة الوقائية [${targetPlan.id}]. التقرير: ${result.notes || 'تتطلب تدخل فني فوري وإصلاح'}.`,
        });
      }
    }
  };

  const createWOFromPMPlan = (plan: PreventiveMaintenancePlan) => {
    createWorkOrder({
      title: `تنفيذ صيانة وقائية شاملة: ${plan.title}`,
      assetId: plan.assetId,
      assetName: plan.assetName,
      hangarId: plan.hangarId,
      type: 'PREVENTIVE',
      priority: plan.priority || 'MEDIUM',
      status: 'APPROVED',
      reportedBy: 'جدولة الصيانة الوقائية الدورية',
      assignedTo: plan.assignedTechnician,
      technicianSpecialty: plan.technicianSpecialty,
      description: `خطة الصيانة الوقائية [${plan.id}]: ${plan.description || plan.procedureNotes || ''}. الفحص يشمل ${plan.steps.length} إجراء تشغيلي. الملاحظات الحرجة: ${plan.criticalPoints || 'اتباع معايير السلامة'}.`,
    });
    setActiveTab('work-orders');
  };

  const triggerEmergencyBreakdown = (assetId?: string) => {
    const asset = assetId ? assets.find((a) => a.id === assetId) : null;
    setPreselectedAssetForWO(asset || null);
    setIsCreateWOOpen(true);
  };

  const addHangar = (newHangarData: Omit<HangarInfo, 'totalAssets'>) => {
    const newHangar: HangarInfo = {
      ...newHangarData,
      totalAssets: 0,
    };
    setHangars((prev) => [...prev, newHangar]);
    addNotification(`تمت إضافة قاعة إنتاج جديدة: [${newHangar.nameEn}] ${newHangar.name} بنجاح`, 'success');
  };

  const updateHangar = (updatedHangar: HangarInfo) => {
    setHangars((prev) => prev.map((h) => (h.id === updatedHangar.id ? updatedHangar : h)));
    // Sync asset hangarName
    setAssets((prev) =>
      prev.map((a) =>
        a.hangarId === updatedHangar.id
          ? { ...a, hangarName: updatedHangar.name }
          : a
      )
    );
    addNotification(`تم تحديث وحفظ بيانات القاعة [${updatedHangar.name}] بنجاح`, 'success');
  };

  const addAsset = (newAssetData: Omit<Asset, 'downtimeThisMonthMinutes'>) => {
    const newAsset: Asset = {
      ...newAssetData,
      downtimeThisMonthMinutes: 0,
    };
    setAssets((prev) => [newAsset, ...prev]);
    addNotification(`تمت إضافة الماكينة الجديدة [${newAsset.id}] ${newAsset.name} وتوليد رمز QR الخاص بها بنجاح`, 'success');
  };

  const updateAsset = (updatedAsset: Asset) => {
    setAssets((prevAssets) => {
      const nextAssets = prevAssets.map((a) => (a.id === updatedAsset.id ? updatedAsset : a));
      return recalculateAssetStatuses(nextAssets, workOrders);
    });

    if (selectedAssetForModal && selectedAssetForModal.id === updatedAsset.id) {
      setSelectedAssetForModal(updatedAsset);
    }

    // Sync work orders assetName if changed
    setWorkOrders((prevWOs) =>
      prevWOs.map((wo) =>
        wo.assetId === updatedAsset.id
          ? { ...wo, assetName: updatedAsset.name, hangarId: updatedAsset.hangarId }
          : wo
      )
    );

    addNotification(`تم تحديث وحفظ بيانات الماكينة [${updatedAsset.id}] ${updatedAsset.name} بنجاح`, 'success');
  };

  const deleteHangar = (hangarId: string) => {
    const hall = hangars.find((h) => h.id === hangarId);
    setHangars((prev) => prev.filter((h) => h.id !== hangarId));
    addNotification(`تم حذف القاعة ${hall?.name || hangarId} من المنظومة بنجاح`, 'info');
  };

  const deleteAsset = (assetId: string) => {
    const asset = assets.find((a) => a.id === assetId);
    setAssets((prev) => prev.filter((a) => a.id !== assetId));
    addNotification(`تم حذف الماكينة ${asset?.name || assetId} بنجاح`, 'info');
  };

  const dynamicHangars = useMemo(() => {
    return hangars.map((h) => ({
      ...h,
      totalAssets: assets.filter((a) => a.hangarId === h.id).length,
    }));
  }, [hangars, assets]);

  const resetToDefaultData = () => {
    if (window.confirm('هل أنت متأكد من رغبتك في إعادة ضبط كامل بيانات النظام إلى البيانات المصنعية الأولية (قاعات الإنتاج الـ 9 والأصول)؟')) {
      localStorage.removeItem(`${LOCAL_STORAGE_KEY_PREFIX}hangars`);
      localStorage.removeItem(`${LOCAL_STORAGE_KEY_PREFIX}assets`);
      localStorage.removeItem(`${LOCAL_STORAGE_KEY_PREFIX}work_orders`);
      localStorage.removeItem(`${LOCAL_STORAGE_KEY_PREFIX}spare_parts`);
      localStorage.removeItem(`${LOCAL_STORAGE_KEY_PREFIX}meter_readings`);
      localStorage.removeItem(`${LOCAL_STORAGE_KEY_PREFIX}pm_checklist`);
      localStorage.removeItem(`${LOCAL_STORAGE_KEY_PREFIX}meter_devices`);
      localStorage.removeItem(`${LOCAL_STORAGE_KEY_PREFIX}device_reading_logs`);
      localStorage.removeItem(`${LOCAL_STORAGE_KEY_PREFIX}pm_plans`);
      setHangars(HANGARS_DATA);
      setAssets(INITIAL_ASSETS);
      setWorkOrders(INITIAL_WORK_ORDERS);
      setSpareParts(INITIAL_SPARE_PARTS);
      setMeterReadings(INITIAL_METER_READINGS);
      setPmChecklist(INITIAL_PM_CHECKLIST);
      setMeterDevices(INITIAL_METER_DEVICES);
      setDeviceReadingLogs(INITIAL_DEVICE_READINGS);
      setPmPlans(INITIAL_PM_PLANS);
      addNotification('تمت إعادة ضبط بيانات المعمل والقاعات الـ 9 ومنظومة العدادات والصيانة الوقائية إلى الحالة الأولية بنجاح.', 'info');
    }
  };

  return (
    <CMMSContext.Provider
      value={{
        hangars: dynamicHangars,
        assets,
        workOrders,
        spareParts,
        meterReadings,
        pmChecklist,
        kpis,
        notifications,
        dismissNotification,
        addNotification,
        activeTab,
        setActiveTab,
        selectedAssetForModal,
        setSelectedAssetForModal,
        selectedAssetForQR,
        setSelectedAssetForQR,
        isCreateWOOpen,
        setIsCreateWOOpen,
        preselectedAssetForWO,
        setPreselectedAssetForWO,
        isCreateHallOpen,
        setIsCreateHallOpen,
        editingHangar,
        setEditingHangar,
        isCreateAssetOpen,
        setIsCreateAssetOpen,
        editingAsset,
        setEditingAsset,
        preselectedHallForAsset,
        setPreselectedHallForAsset,
        selectedWOForDetail,
        setSelectedWOForDetail,
        editingWorkOrder,
        setEditingWorkOrder,
        globalSearch,
        setGlobalSearch,
        addHangar,
        updateHangar,
        addAsset,
        updateAsset,
        deleteHangar,
        deleteAsset,
        createWorkOrder,
        updateWorkOrderStatus,
        updateWorkOrder,
        deleteWorkOrder,
        deleteShiftLog,
        consumePartInWorkOrder,
        consumePart,
        restockPart,
        logMeterReading,
        togglePMChecklistItem,
        createWOFromPMItem,
        resetToDefaultData,
        triggerEmergencyBreakdown,
        deleteConfirmation,
        requestDeleteConfirmation,
        closeDeleteConfirmation,

        // Dedicated Meters & Instrumentation
        meterDevices,
        deviceReadingLogs,
        addMeterDevice,
        updateMeterDevice,
        deleteMeterDevice,
        logDeviceReading,
        deleteDeviceReading,
        selectedDeviceForReading,
        setSelectedDeviceForReading,
        isCreateDeviceOpen,
        setIsCreateDeviceOpen,
        editingMeterDevice,
        setEditingMeterDevice,

        // Professional Preventive Maintenance
        pmPlans,
        addPMPlan,
        updatePMPlan,
        deletePMPlan,
        executePMPlan,
        createWOFromPMPlan,
        isCreatePMPlanOpen,
        setIsCreatePMPlanOpen,
        editingPMPlan,
        setEditingPMPlan,
        executingPMPlan,
        setExecutingPMPlan,
        selectedPMPlanForExecution: executingPMPlan,
        setSelectedPMPlanForExecution: setExecutingPMPlan,

        // Dedicated Spare Parts & Warehouse Modals & CRUD
        isCreatePartOpen,
        setIsCreatePartOpen,
        editingPart,
        setEditingPart,
        selectedPartDetail,
        setSelectedPartDetail,
        addSparePart,
        updateSparePart,
        deleteSparePart,

        // User Accounts & Permissions System
        users,
        currentUser,
        setCurrentUser,
        isLoginModalOpen,
        setIsLoginModalOpen,
        isLoggedIn,
        loginWithCredentials,
        logoutCurrentUser,
        addUser,
        updateUser,
        deleteUser,
        toggleUserStatus,
        canAccess,
        canViewTab,
        checkPermission,
        isUserModalOpen,
        setIsUserModalOpen,
        editingUser,
        setEditingUser,
        permissionWarningModal,
        showPermissionWarning,
        closePermissionWarning,

        // Professional Shift Handover & Log System
        shiftLogs,
        activeShiftLog,
        setActiveShiftLog,
        addShiftLog,
        updateShiftLog,
        signShiftHandover,
        isShiftModalOpen,
        setIsShiftModalOpen,
        editingShiftLog,
        setEditingShiftLog,

        // External PHP Hosting & Backup
        isPhpConnected,
        downloadPhpPackage,
        exportDatabaseJson,
      }}
    >
      {children}
    </CMMSContext.Provider>
  );
};

export const useCMMS = (): CMMSContextType => {
  const context = useContext(CMMSContext);
  if (!context) {
    throw new Error('useCMMS must be used within a CMMSProvider');
  }
  return context;
};
