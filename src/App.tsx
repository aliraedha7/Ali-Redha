import React, { useState, Component, ErrorInfo, ReactNode } from 'react';
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
import { AlertTriangle, RefreshCw } from 'lucide-react';

interface ErrorBoundaryProps {
  children: ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

class TabErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  public state: ErrorBoundaryState = { hasError: false, error: null };

  constructor(props: ErrorBoundaryProps) {
    super(props);
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Tab render error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="p-8 rounded-2xl bg-[#1e293b] border border-amber-500/40 text-center space-y-4 font-sans text-slate-200 my-4 shadow-xl">
          <AlertTriangle className="w-12 h-12 text-amber-400 mx-auto" />
          <h3 className="text-lg font-bold text-white">تنبيه: حدث خطأ غير متوقع أثناء عرض هذا التقرير</h3>
          <p className="text-xs text-slate-400 max-w-md mx-auto">
            {this.state.error?.message || 'تم حماية الواجهة من الانهيار. اضغط على الزر أدناه لإعادة تحميل التقرير بسلاسة.'}
          </p>
          <div className="flex flex-wrap justify-center gap-3 pt-2">
            <button
              onClick={() => this.setState({ hasError: false, error: null })}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-bold transition-all shadow-md flex items-center gap-2"
            >
              <RefreshCw className="w-4 h-4" />
              <span>إعادة المحاولة الآن</span>
            </button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

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
        <TabErrorBoundary>
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
        </TabErrorBoundary>
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
