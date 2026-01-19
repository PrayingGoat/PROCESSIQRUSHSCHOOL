import React, { useState } from 'react';
import { AppModule, ViewId } from './types';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import DashboardView from './components/DashboardView';
import AdmissionView from './components/AdmissionView';
import RHView from './components/RHView';
import StudentView from './components/StudentView';

const App = () => {
  const [activeView, setActiveView] = useState<ViewId>('commercial-dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);

  // Derive active module from active view
  const getActiveModule = (view: ViewId): AppModule => {
    if (view.startsWith('commercial')) return AppModule.COMMERCIAL;
    if (view.startsWith('admission')) return AppModule.ADMISSION;
    if (view.startsWith('rh')) return AppModule.RH;
    if (view === 'etudiant') return AppModule.STUDENT;
    if (view === 'parametres') return AppModule.PARAMETRES;
    return AppModule.COMMERCIAL;
  };

  const activeModule = getActiveModule(activeView);

  const renderContent = () => {
    switch (activeModule) {
      case AppModule.COMMERCIAL:
        return <DashboardView activeSubView={activeView} />;
      case AppModule.ADMISSION:
        return <AdmissionView />;
      case AppModule.RH:
        return <RHView activeSubView={activeView} />;
      case AppModule.STUDENT:
        return <StudentView />;
      case AppModule.PARAMETRES:
        return (
            <div className="p-8">
                <div className="bg-white border border-slate-200 rounded-2xl p-6">
                    <h2 className="text-xl font-bold mb-4">Paramètres</h2>
                    <p className="text-slate-500">Configuration de l'application (Section en construction)</p>
                </div>
            </div>
        );
      default:
        return <DashboardView activeSubView={activeView} />;
    }
  };

  return (
    <div className="flex min-h-screen bg-[#F8FAFC] font-sans text-[#1E293B]">
      {/* Sidebar Overlay for Mobile */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-slate-900/50 z-40 md:hidden backdrop-blur-sm"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <Sidebar 
        isOpen={sidebarOpen} 
        activeView={activeView} 
        setActiveView={setActiveView} 
      />

      {/* Main Content Wrapper */}
      <div className="flex-1 flex flex-col md:ml-[260px] min-w-0 transition-all duration-300">
        <Header 
          toggleSidebar={toggleSidebar}
          activeModule={activeModule}
        />

        <main className="flex-1 p-8 md:p-10 overflow-y-auto">
          {renderContent()}
        </main>
      </div>
    </div>
  );
};

export default App;