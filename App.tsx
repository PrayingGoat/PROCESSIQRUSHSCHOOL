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

  // Fonction centrale de navigation
  const handleNavigation = (item: string) => {
    setActiveSidebarItem(item);

    // Mapping entre l'item de la sidebar et le module à afficher
    if (item === 'dashboard') {
      setActiveModule(AppModule.COMMERCIAL);
    } else if (item === 'admission') {
      setActiveModule(AppModule.ADMISSION);
    } else if (item === 'etudiant') {
      setActiveModule(AppModule.STUDENT);
    } else if (item.startsWith('rh')) {
      setActiveModule(AppModule.RH);
    }
  };

  // Helper pour obtenir le titre et le sous-titre du header
  const getHeaderInfo = () => {
    switch (activeSidebarItem) {
      case 'dashboard':
        return { title: 'Commercial', subtitle: 'Vue d\'ensemble et statistiques' };
      case 'admission':
        return { title: 'Admissions', subtitle: 'Gestion des candidatures et tests' };
      case 'etudiant':
        return { title: 'Espace Étudiant', subtitle: 'Dossier personnel et suivi' };
      case 'rh':
        return { title: 'Ressources Humaines', subtitle: 'Vue générale' };
      case 'rh-fiche':
        return { title: 'Ressources Humaines', subtitle: 'Fiches Entreprises' };
      case 'rh-cerfa':
        return { title: 'Ressources Humaines', subtitle: 'Gestion des CERFA' };
      case 'rh-pec':
        return { title: 'Ressources Humaines', subtitle: 'Prises en charge (OPCO)' };
      case 'rh-ruptures':
        return { title: 'Ressources Humaines', subtitle: 'Suivi des ruptures' };
      case 'parametres':
        return { title: 'Paramètres', subtitle: 'Configuration de l\'application' };
      default:
        return { title: 'Commercial', subtitle: 'Tableau de bord' };
    }
  };

  const headerInfo = getHeaderInfo();

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
        setActiveItem={handleNavigation} 
      />

      {/* Main Content Wrapper */}
      <div className="flex-1 flex flex-col md:ml-[260px] min-w-0 transition-all duration-300">
        <Header 
          toggleSidebar={toggleSidebar}
          title={headerInfo.title}
          subtitle={headerInfo.subtitle}
        />

        <main className="flex-1 p-6 md:p-10 overflow-y-auto">
          {renderContent()}
        </main>
      </div>
    </div>
  );
};

export default App;