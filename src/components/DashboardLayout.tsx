import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { 
  BarChart3, 
  Users, 
  CreditCard, 
  History, 
  ShieldCheck, 
  TrendingUp, 
  LogOut,
  LayoutDashboard,
  Wallet,
  FileText
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useAuth } from '../contexts/AuthContext';
import { auth } from '../lib/firebase';
import { cn } from '../lib/utils';

interface LayoutProps {
  children: React.ReactNode;
}

const NavItem = ({ icon: Icon, label, path, active }: { icon: any, label: string, path: string, active?: boolean }) => (
  <Link
    to={path}
    className={cn(
      "w-full flex items-center gap-3 px-4 py-2.5 transition-all duration-200 group text-sm font-medium",
      active 
        ? "bg-white/10 border-l-4 border-accent text-white" 
        : "text-slate-400 hover:bg-white/5 hover:text-white border-l-4 border-transparent"
    )}
  >
    <Icon className={cn("w-5 h-5", active ? "text-accent" : "group-hover:scale-110 transition-transform")} />
    <span className="tracking-tight">{label}</span>
  </Link>
);

export const DashboardLayout: React.FC<LayoutProps> = ({ children }) => {
  const { profile, isStaff } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const activeTab = location.pathname.split('/')[1] || 'overview';

  const handleSignOut = async () => {
    await auth.signOut();
    navigate('/login');
  };

  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden font-sans">
      {/* Sidebar */}
      <aside className="w-64 bg-[#0A192F] text-white flex flex-col shrink-0">
        <div className="p-6 border-b border-slate-700/50">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 gold-gradient rounded flex items-center justify-center font-bold text-lg shadow-lg shadow-gold/20">N</div>
            <span className="text-xl font-bold tracking-tight">NovaCore<span className="text-gold">Suite</span></span>
          </div>
        </div>

        <nav className="flex-1 py-6">
          <div className="px-4 mb-4 text-[10px] uppercase tracking-widest text-slate-500 font-bold">Main Menu</div>
          <div className="space-y-1">
            <NavItem icon={LayoutDashboard} label="Executive Dashboard" path="/overview" active={activeTab === 'overview'} />
            <NavItem icon={Wallet} label="Customer Accounts" path="/accounts" active={activeTab === 'accounts'} />
            <NavItem icon={History} label="Transactions" path="/transactions" active={activeTab === 'transactions'} />
            <NavItem icon={TrendingUp} label="Loan Management" path="/loans" active={activeTab === 'loans'} />
            
            {isStaff && (
              <>
                <div className="px-4 mt-8 mb-4 text-[10px] uppercase tracking-widest text-slate-500 font-bold">Operations</div>
                <NavItem icon={Users} label="Account Holders" path="/customers" active={activeTab === 'customers'} />
                <NavItem icon={BarChart3} label="Analytics & Reporting" path="/analytics" active={activeTab === 'analytics'} />
                <NavItem icon={FileText} label="Compliance Feed" path="/reports" active={activeTab === 'reports'} />
              </>
            )}
          </div>
        </nav>

        <div className="p-4 bg-[#071120] border-t border-slate-800">
          <div className="flex items-center gap-3 p-2 rounded bg-slate-800/50 mb-4">
            <div className="w-10 h-10 rounded-full bg-slate-600 flex items-center justify-center text-xs font-bold ring-2 ring-slate-700">
               {profile?.fullName?.split(' ').map(n => n[0]).join('') || 'U'}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-semibold truncate text-white">{profile?.fullName}</p>
              <p className="text-[10px] text-slate-400 truncate capitalize">{profile?.role?.toLowerCase()}</p>
            </div>
          </div>
          <button 
            onClick={handleSignOut}
            className="w-full flex items-center gap-2 px-3 py-2 text-slate-400 hover:text-red-400 rounded transition-colors text-xs font-bold uppercase tracking-wider"
          >
            <LogOut className="w-4 h-4" />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0">
        <header className="h-16 bg-white border-b border-slate-200 px-8 flex items-center justify-between shrink-0 sticky top-0 z-10">
           <div className="flex items-center gap-4 flex-1">
             <div className="relative w-96">
               <input 
                 type="text" 
                 placeholder="Search accounts, transactions, or KYC files..." 
                 className="w-full pl-10 pr-4 py-2 rounded-lg bg-slate-100 border-none text-sm focus:ring-2 focus:ring-[#0A192F] outline-none transition-all"
               />
               <LayoutDashboard className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
             </div>
           </div>
           
           <div className="flex items-center gap-6">
             <div className="flex items-center gap-2 text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-md border border-emerald-100">
               <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
               LIVE SYSTEMS: STABLE
             </div>
             <div className="w-px h-6 bg-slate-200" />
             <div className="text-right">
               <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">System UTC</p>
               <p className="text-xs font-mono font-medium text-slate-600">{new Date().toISOString().replace('T', ' ').split('.')[0]}</p>
             </div>
           </div>
        </header>

        <div className="flex-1 p-8 overflow-y-auto">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
            >
              {children}
            </motion.div>
          </AnimatePresence>
        </div>
        
        <footer className="h-10 bg-slate-200 border-t border-slate-300 px-8 flex items-center justify-between text-[10px] text-slate-500 shrink-0">
          <div className="flex gap-4">
            <span>Region: East-Africa/Cluster-01</span>
            <span>Server: NC-CORE-PRD-01</span>
            <span>License: Enterprise Gold</span>
          </div>
          <div className="font-bold text-slate-400 tracking-widest uppercase">
            NovaCore Standard 2026
          </div>
        </footer>
      </main>
    </div>
  );
};
