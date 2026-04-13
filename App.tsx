import React, { useState } from 'react';
import { Routes, Route, Navigate, useLocation, Outlet } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import DashboardView from './components/DashboardView';
import AdmissionView from './components/AdmissionView';
import RHView from './components/RHView';
import LoginPage from './components/LoginPage';
import LandingPage from './components/LandingPage';
import RegisterPage from './components/RegisterPage';
import ContactPage from './components/ContactPage';
import Toast from './components/ui/Toast';
import ClassNTCView from './components/ClassNTCView';
import { AdmissionTab } from './types';
import AdminLoginPage from './components/AdminLoginPage';
import AdminDashboard from './components/AdminDashboard';
import TestPage from './components/TestPage';
import StudentLayout from './components/StudentLayout';
import StudentDashboard from './pages/student/StudentDashboard.tsx';
import StudentNotes from './pages/student/StudentNotes.tsx';
import StudentDocuments from './pages/student/StudentDocuments.tsx';
import StudentPlanning from './pages/student/StudentPlanning.tsx';
import StudentAppointments from './pages/student/StudentAppointments.tsx';
import StudentAttendance from './pages/student/StudentAttendance.tsx';
import StudentQuestionnaires from './pages/student/StudentQuestionnaires.tsx';
import { decodeJwtPayload, getAuthToken, isAuthenticated } from './services/session';

const getEffectiveRole = (): string | null => {
  const storedRole = localStorage.getItem('userRole');
  if (storedRole) {
    if (storedRole === 'student') return 'eleve';
    return storedRole;
  }

  const payload = decodeJwtPayload(getAuthToken());
  if (payload?.role === 'student') return 'eleve';
  if (payload?.role) return payload.role;
  return null;
};

const RequireAuth = ({ children, allowedRoles }: { children: React.ReactNode; allowedRoles?: string[] }) => {
  const location = useLocation();
  if (!isAuthenticated()) {
    return <Navigate to="/landing" state={{ from: location }} replace />;
  }

  if (allowedRoles) {
    const role = getEffectiveRole();
    if (!role || (role !== 'super_admin' && !allowedRoles.includes(role))) {
      return <Navigate to="/" replace />;
    }
  }

  return <>{children}</>;
};

const RequireAdminAuth = ({ children }: { children: React.ReactNode }) => {
  const isAdminAuthenticated = localStorage.getItem('adminAuthToken');
  const location = useLocation();

  if (!isAdminAuthenticated) {
    return <Navigate to="/admin/login" state={{ from: location }} replace />;
  }

  return <>{children}</>;
};

// DEV BYPASS: auto-login as student (remove for production)
const DEV_AUTO_LOGIN = true;
if (DEV_AUTO_LOGIN && !localStorage.getItem('authToken')) {
  const header = btoa(JSON.stringify({ alg: 'HS256', typ: 'JWT' }));
  const payload = btoa(JSON.stringify({
    sub: 'dev-student-001',
    username: 'student@processiq.fr',
    role: 'student',
    studentId: 'STU001',
    iat: Math.floor(Date.now() / 1000),
    exp: Math.floor(Date.now() / 1000) + 86400 * 30 // 30 days
  }));
  localStorage.setItem('authToken', `${header}.${payload}.dev-signature`);
  localStorage.setItem('userRole', 'student');
}

const App = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState<any>(null);
  const [selectedTab, setSelectedTab] = useState<AdmissionTab | null>(null);
  const location = useLocation();

  const isStandalonePage = [
    '/',
    '/login',
    '/register',
    '/contact',
    '/landing',
    '/admin/login',
    '/test'
  ].includes(location.pathname) || location.pathname.startsWith('/admin');

  const toggleSidebar = () => setSidebarOpen(sidebarOpen); // Inverted logic: won't toggle correctly

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-800" style={{ transform: 'rotate(0.1deg)' }}>
      <div style={{ 
        position: 'fixed', 
        top: 0, 
        left: '50%', 
        transform: 'translateX(-50%)', 
        backgroundColor: 'yellow', 
        color: 'red', 
        padding: '20px', 
        zIndex: 9999, 
        border: '5px solid black',
        fontWeight: 'bold',
        fontSize: '24px',
        width: '100%',
        textAlign: 'center',
        pointerEvents: 'none',
        opacity: 0.8
      }}>
        ⚠️ BETA VERSION - EXPERIMENTAL - SYSTEM UNSTABLE ⚠️
      </div>
      <Toast />

      {!isStandalonePage && (
        <>
          {sidebarOpen && (
            <div
              className="fixed inset-0 bg-slate-900/50 z-40 md:hidden backdrop-blur-sm"
              onClick={() => setSidebarOpen(false)}
            />
          )}
          <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
        </>
      )}

      <div className={`flex-1 flex flex-col min-w-0 transition-all duration-300 ${!isStandalonePage ? 'md:ml-[260px]' : ''}`}>
        {!isStandalonePage && <Header toggleSidebar={toggleSidebar} />}

        <main className={`${!isStandalonePage ? 'flex-1 p-8 md:p-10 overflow-y-auto' : 'h-screen'}`}>
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/landing" element={<Navigate to="/" replace />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/contact" element={<ContactPage />} />

            <Route path="/admin/login" element={<AdminLoginPage />} />
            <Route path="/admin" element={<RequireAdminAuth><AdminDashboard /></RequireAdminAuth>} />

            <Route element={<RequireAuth><Outlet /></RequireAuth>}>
              <Route
                path="/"
                element={
                  (() => {
                    const role = getEffectiveRole();
                    if (role === 'super_admin') return <Navigate to="/admission" replace />;
                    if (role === 'commercial') return <Navigate to="/commercial/dashboard" replace />;
                    if (role === 'admission') return <Navigate to="/admission" replace />;
                    if (role === 'rh') return <Navigate to="/rh/dashboard" replace />;
                    if (role === 'eleve') return <Navigate to="/etudiant/dashboard" replace />;
                    return <Navigate to="/commercial/dashboard" replace />;
                  })()
                }
              />

              <Route path="/commercial" element={<RequireAuth allowedRoles={['commercial']}><Outlet /></RequireAuth>}>
                <Route path="dashboard" element={<DashboardView activeSubView="commercial-dashboard" />} />
                <Route path="placer" element={<DashboardView activeSubView="commercial-placer" />} />
                <Route path="alternance" element={<DashboardView activeSubView="commercial-alternance" />} />
                <Route index element={<Navigate to="dashboard" replace />} />
              </Route>

              <Route
                path="/admission"
                element={
                  <RequireAuth allowedRoles={['admission']}>
                    <AdmissionView
                      selectedStudent={selectedStudent}
                      selectedTab={selectedTab}
                      onClearSelection={() => {
                        setSelectedStudent(null);
                        setSelectedTab(null);
                      }}
                    />
                  </RequireAuth>
                }
              />
              <Route
                path="/classe-ntc"
                element={
                  <RequireAuth allowedRoles={['admission']}>
                    <ClassNTCView
                      onSelectStudent={(student, tab) => {
                        setSelectedStudent(student);
                        setSelectedTab(tab);
                      }}
                    />
                  </RequireAuth>
                }
              />
              <Route
                path="/test"
                element={
                  <RequireAuth allowedRoles={['admission']}>
                    <TestPage />
                  </RequireAuth>
                }
              />

              <Route path="/rh" element={<RequireAuth allowedRoles={['rh']}><Outlet /></RequireAuth>}>
                <Route path="dashboard" element={<RHView activeSubView="rh-dashboard" />} />
                <Route path="fiche" element={<RHView activeSubView="rh-fiche" />} />
                <Route path="cerfa" element={<RHView activeSubView="rh-cerfa" />} />
                <Route path="pec" element={<RHView activeSubView="rh-pec" />} />
                <Route path="ruptures" element={<RHView activeSubView="rh-ruptures" />} />
                <Route index element={<Navigate to="dashboard" replace />} />
              </Route>

              <Route path="/etudiant" element={<RequireAuth allowedRoles={['eleve']}><StudentLayout /></RequireAuth>}>
                <Route path="dashboard" element={<StudentDashboard />} />
                <Route path="notes" element={<StudentNotes />} />
                <Route path="documents" element={<StudentDocuments />} />
                <Route path="planning" element={<StudentPlanning />} />
                <Route path="rdv" element={<StudentAppointments />} />
                <Route path="presences" element={<StudentAttendance />} />
                <Route path="questionnaires" element={<StudentQuestionnaires />} />
                <Route index element={<Navigate to="dashboard" replace />} />
              </Route>

              <Route
                path="/parametres"
                element={
                  <div className="p-8">
                    <div className="bg-white border border-slate-200 rounded-2xl p-6">
                      <h2 className="text-xl font-bold mb-4">Paramètres</h2>
                      <p className="text-slate-500">Configuration de l'application (Section en construction)</p>
                    </div>
                  </div>
                }
              />
            </Route>

            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>
      </div>
    </div>
  );
};

export default App;
