import React, { useState } from 'react';
import { CMMSProvider, useCMMS } from './context/CMMSContext';
import { Navbar } from './components/Navbar';
import { Dashboard } from './components/Dashboard/Dashboard';
import { AssetList } from './components/Assets/AssetList';
import { AssetQRCodeModal } from './components/Assets/AssetQRCodeModal';
import { AssetDetailModal } from './components/Assets/AssetDetailModal';
import { CreateAssetModal } from './components/Assets/CreateAssetModal';
import { EditAssetModal } from './components/Assets/EditAssetModal';
import { CreateHallModal } from './components/Halls/CreateHallModal';
import { EditHallModal } from './components/Halls/EditHallModal';
import { WorkOrdersManager } from './components/WorkOrders/WorkOrdersManager';
import { CreateWorkOrderModal } from './components/WorkOrders/CreateWorkOrderModal';
import { WorkOrderDetailModal } from './components/WorkOrders/WorkOrderDetailModal';
import { EditWorkOrderModal } from './components/WorkOrders/EditWorkOrderModal';
import { MetersManager } from './components/Meters/MetersManager';
import { PreventiveMaintenanceManager } from './components/PreventiveMaintenance/PreventiveMaintenanceManager';
import { WarehouseManager } from './components/Warehouse/WarehouseManager';
import { ShiftReportView } from './components/ShiftReport/ShiftReportView';
import { DeveloperHub } from './components/Developer/DeveloperHub';
import { UserAccountModal } from './components/Developer/UserAccountModal';
import { PermissionWarningModal } from './components/Developer/PermissionWarningModal';
import { LoginModal } from './components/Auth/LoginModal';
import { ConfirmDeleteModal } from './components/Common/ConfirmDeleteModal';
import { HangarId } from './types';

const CMMSMainContent: React.FC = () => {
  const { activeTab, setActiveTab } = useCMMS();
  const [selectedHangarFilter, setSelectedHangarFilter] = useState<HangarId | 'ALL'>('ALL');

  const handleSelectHangar = (hangarId: HangarId) => {
    setSelectedHangarFilter(hangarId);
    setActiveTab('assets');
  };

  return (
    <div className="min-h-screen bg-[#0f172a] text-[#f1f5f9] flex flex-col font-sans selection:bg-blue-600 selection:text-white">
      {/* Top Navbar */}
      <Navbar />

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 space-y-6">
        {activeTab === 'dashboard' && (
          <Dashboard onSelectHangar={handleSelectHangar} />
        )}

        {activeTab === 'assets' && (
          <AssetList initialHangarFilter={selectedHangarFilter} />
        )}

        {activeTab === 'work-orders' && (
          <WorkOrdersManager />
        )}

        {activeTab === 'meters' && (
          <MetersManager />
        )}

        {activeTab === 'preventive' && (
          <PreventiveMaintenanceManager />
        )}

        {activeTab === 'warehouse' && (
          <WarehouseManager />
        )}

        {activeTab === 'shift-report' && (
          <ShiftReportView />
        )}

        {activeTab === 'developer-hub' && (
          <DeveloperHub />
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-[#334155] bg-[#0f172a] py-4 px-6 text-center text-xs text-slate-400 no-print">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400" />
            <span className="font-bold text-slate-300">
              نظام إدارة الصيانة المحوسب (CMMS Enterprise)
            </span>
            <span>— معمل المرجان للمطبوعات</span>
          </div>

          <div className="text-slate-400 text-[11px] font-mono">
            إشراف: مدير إدارة الصيانة ومطور النظام <span className="text-blue-400 font-bold font-sans">م. علي رضا</span> • 2026
          </div>
        </div>
      </footer>

      {/* Industrial Modals */}
      <AssetQRCodeModal />
      <AssetDetailModal />
      <CreateAssetModal />
      <EditAssetModal />
      <CreateHallModal />
      <EditHallModal />
      <CreateWorkOrderModal />
      <WorkOrderDetailModal />
      <EditWorkOrderModal />
      <UserAccountModal />
      <PermissionWarningModal />
      <LoginModal />
      <ConfirmDeleteModal />
    </div>
  );
};

export default function App() {
  return (
    <CMMSProvider>
      <CMMSMainContent />
    </CMMSProvider>
  );
}
