import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { Login } from './components/Login';
import { DashboardLayout } from './components/DashboardLayout';
import { Overview } from './components/Overview';
import { AccountPortal } from './components/AccountPortal';
import { TransactionHistory } from './components/TransactionHistory';
import { LoanPortal } from './components/LoanPortal';

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { user, loading } = useAuth();
  
  if (loading) return (
     <div className="h-screen w-screen bg-slate-950 flex flex-col items-center justify-center gap-6">
       <div className="w-16 h-16 gold-gradient rounded-2xl flex items-center justify-center animate-pulse shadow-2xl shadow-gold/20">
         <div className="w-8 h-8 border-4 border-white border-t-transparent rounded-full animate-spin" />
       </div>
       <p className="text-gold text-xs font-bold tracking-[0.3em] uppercase opacity-50">Secure Environment Initializing</p>
     </div>
  );
  
  if (!user) return <Navigate to="/login" />;
  
  return <>{children}</>;
};

const DashboardContent = () => {
  const [activeTab, setActiveTab] = React.useState('overview');

  // This is a simple mock navigation using state within our single DashboardLayout.
  // In a real medium-large app we would use react-router nested routes.
  // For the sake of this enterprise-grade demo, I'll use reactive local state
  // to toggle features smoothly within the shell.

  return (
    <DashboardLayout>
      <Routes>
        <Route index element={<Overview />} />
        <Route path="accounts" element={<AccountPortal />} />
        <Route path="transactions" element={<TransactionHistory />} />
        <Route path="loans" element={<LoanPortal />} />
      </Routes>
    </DashboardLayout>
  );
};

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route 
            path="/*" 
            element={
              <ProtectedRoute>
                <DashboardLayout>
                  <Routes>
                    <Route index element={<Overview />} />
                    <Route path="overview" element={<Overview />} />
                    <Route path="accounts" element={<AccountPortal />} />
                    <Route path="transactions" element={<TransactionHistory />} />
                    <Route path="loans" element={<LoanPortal />} />
                    {/* Fallback to Overview */}
                    <Route path="*" element={<Navigate to="/overview" />} />
                  </Routes>
                </DashboardLayout>
              </ProtectedRoute>
            } 
          />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
