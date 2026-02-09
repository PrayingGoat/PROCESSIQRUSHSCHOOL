import React, { useState, useMemo } from 'react';
import { Routes, Route, Navigate, useLocation, Outlet } from 'react-router-dom';
import { AppModule, ViewId } from './types';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import DashboardView from './components/DashboardView';
import AdmissionView from './components/AdmissionView';
import RHView from './components/RHView';
import StudentView from './components/StudentView';
import LoginPage from './components/LoginPage';
import Toast from './components/ui/Toast';
import ClassNTCView from './components/ClassNTCView';
import { AdmissionTab } from './types';
import StudentDashboard from './pages/student/StudentDashboard.tsx';
import StudentNotes from './pages/student/StudentNotes.tsx';
import StudentDocuments from './pages/student/StudentDocuments.tsx';
import StudentPlanning from './pages/student/StudentPlanning.tsx';
import StudentAppointments from './pages/student/StudentAppointments.tsx';
import StudentAttendance from './pages/student/StudentAttendance.tsx';
import StudentQuestionnaires from './pages/student/StudentQuestionnaires.tsx';


const RequireAuth = ({ children }: { children: React.ReactNode }) => {
  const isAuthenticated = localStorage.getItem('authToken');
  const location = useLocation();


  return children;
};

const App = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState<any>(null);
  const [selectedTab, setSelectedTab] = useState<AdmissionTab | null>(null);
  const location = useLocation();
  const isLoginPage = location.pathname === '/login';

  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);

  // Derive active module from current path
  const activeModule = useMemo((): AppModule => {
    const path = location.pathname;
    if (path.startsWith('/commercial')) return AppModule.COMMERCIAL;
    if (path.startsWith('/admission')) return AppModule.ADMISSION;
    if (path.startsWith('/rh')) return AppModule.RH;
    if (path.startsWith('/etudiant')) return AppModule.STUDENT;
    if (path.startsWith('/parametres')) return AppModule.PARAMETRES;
    return AppModule.COMMERCIAL;
  }, [location.pathname]);

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-800">
      <Toast />

      {!isLoginPage && (
        <>
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
            onClose={() => setSidebarOpen(false)}
          />
        </>
      )}

      {/* Main Content Wrapper */}
      <div className={`flex-1 flex flex-col min-w-0 transition-all duration-300 ${!isLoginPage ? 'md:ml-[260px]' : ''}`}>
        {!isLoginPage && (
          <Header
            toggleSidebar={toggleSidebar}
          />
        )}

        <main className={`${!isLoginPage ? 'flex-1 p-8 md:p-10 overflow-y-auto' : 'h-screen'}`}>
          <Routes>
            <Route path="/login" element={<LoginPage />} />

            <Route element={<RequireAuth><Outlet /></RequireAuth>}>
              {/* Redirect root to commercial dashboard */}
              <Route path="/" element={<Navigate to="/commercial/dashboard" replace />} />

              {/* Commercial Routes */}
              <Route path="/commercial" element={<Outlet />}>
                <Route path="dashboard" element={<DashboardView activeSubView="commercial-dashboard" />} />
                <Route path="placer" element={<DashboardView activeSubView="commercial-placer" />} />
                <Route path="alternance" element={<DashboardView activeSubView="commercial-alternance" />} />
                <Route index element={<Navigate to="dashboard" replace />} />
              </Route>

              {/* Admission Routes */}
              <Route path="/admission" element={
                <AdmissionView
                  selectedStudent={selectedStudent}
                  selectedTab={selectedTab}
                  onClearSelection={() => {
                    setSelectedStudent(null);
                    setSelectedTab(null);
                  }}
                />
              } />
              <Route path="/classe-ntc" element={
                <ClassNTCView
                  onSelectStudent={(student, tab) => {
                    setSelectedStudent(student);
                    setSelectedTab(tab);
                  }}
                />
              } />

              {/* RH Routes */}
              <Route path="/rh" element={<Outlet />}>
                <Route path="dashboard" element={<RHView activeSubView="rh-dashboard" />} />
                <Route path="fiche" element={<RHView activeSubView="rh-fiche" />} />
                <Route path="cerfa" element={<RHView activeSubView="rh-cerfa" />} />
                <Route path="pec" element={<RHView activeSubView="rh-pec" />} />
                <Route path="ruptures" element={<RHView activeSubView="rh-ruptures" />} />
                <Route index element={<Navigate to="dashboard" replace />} />
              </Route>

              {/* Other Routes */}
           <Route path="/etudiant" element={<Outlet />}>
  <Route path="/etudiant/dashboard" element={<StudentDashboard />} />
  <Route path="notes" element={<StudentNotes />} />
  <Route path="documents" element={<StudentDocuments />} />
  <Route path="planning" element={<StudentPlanning />} />
  <Route path="rdv" element={<StudentAppointments />} />
  <Route path="presences" element={<StudentAttendance />} />
  <Route path="questionnaires" element={<StudentQuestionnaires />} />
  <Route index element={<Navigate to="dashboard" replace />} />
</Route>
              <Route path="/parametres" element={
                <div className="p-8">
                  <div className="bg-white border border-slate-200 rounded-2xl p-6">
                    <h2 className="text-xl font-bold mb-4">Paramètres</h2>
                    <p className="text-slate-500">Configuration de l'application (Section en construction)</p>
                  </div>
                </div>
              } />
            </Route>

            {/* Catch-all redirect */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>
      </div>
    </div>
  );
};

export default App;