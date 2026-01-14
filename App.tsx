import React, { useState } from 'react';
import { AppModule } from './types';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import DashboardView from './components/DashboardView';
import AdmissionView from './components/AdmissionView';
import RHView from './components/RHView';
import StudentView from './components/StudentView';

const App = () => {
  const [activeModule, setActiveModule] = useState<AppModule>(AppModule.COMMERCIAL);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeSidebarItem, setActiveSidebarItem] = useState('dashboard');

  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);

  const renderContent = () => {
    switch (activeModule) {
      case AppModule.COMMERCIAL:
        return <DashboardView />;
      case AppModule.ADMISSION:
        return <AdmissionView />;
      case AppModule.RH:
        return <RHView />;
      case AppModule.STUDENT:
        return <StudentView />;
      default:
        return <DashboardView />;
    }
  };

  return (
    <div className="flex min-h-screen bg-[#F8FAFC] font-sans text-slate-600">
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
        activeItem={activeSidebarItem} 
        setActiveItem={setActiveSidebarItem} 
      />

      {/* Main Content Wrapper */}
      <div className="flex-1 flex flex-col md:ml-[260px] min-w-0 transition-all duration-300">
        <Header 
          activeModule={activeModule} 
          setActiveModule={setActiveModule}
          toggleSidebar={toggleSidebar}
        />

        <main className="flex-1 p-6 md:p-10 overflow-y-auto">
          {renderContent()}
        </main>
      </div>
    </div>
  );
};

export default App;