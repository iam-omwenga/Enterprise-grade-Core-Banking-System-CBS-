import React, { useState, useEffect } from 'react';
import { 
  Plus, 
  ArrowUpRight, 
  ArrowDownRight, 
  CreditCard, 
  MoreVertical,
  Search,
  Filter,
  Download,
  AlertCircle
} from 'lucide-react';
import { dbService } from '../services/db';
import { useAuth } from '../contexts/AuthContext';
import { Account, AccountType, AccountStatus } from '../types';
import { formatCurrency, formatDateTime, cn } from '../lib/utils';
import { where } from 'firebase/firestore';

export const AccountPortal: React.FC = () => {
  const { user, profile, isStaff } = useAuth();
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    
    const constraints = isStaff ? [] : [where('customerId', '==', user.uid)];
    const unsubscribe = dbService.subscribeCollection<Account>('accounts', constraints, (data) => {
      setAccounts(data);
      setLoading(false);
    });

    return unsubscribe;
  }, [user, isStaff]);

  return (
    <div className="space-y-8">
      {/* Header Actions */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-4 top-3 w-5 h-5 text-slate-400" />
          <input 
            type="text"
            placeholder="Search by account number or owner..." 
            className="w-full bg-white border border-slate-200 pl-12 pr-4 py-2.5 rounded-xl text-sm focus:border-accent outline-none transition-all"
          />
        </div>
        <div className="flex items-center gap-3">
          <button className="flex items-center gap-2 px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm font-bold text-slate-600 hover:bg-slate-50 transition-colors">
            <Filter className="w-4 h-4" />
            Filters
          </button>
          <button className="flex items-center gap-2 px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm font-bold text-slate-600 hover:bg-slate-50 transition-colors">
            <Download className="w-4 h-4" />
            Export
          </button>
          <button className="flex items-center gap-2 px-6 py-2.5 bg-slate-900 text-white rounded-xl text-sm font-bold hover:bg-slate-800 transition-all shadow-lg shadow-primary/10">
            <Plus className="w-4 h-4" />
            {isStaff ? 'Issue New Account' : 'Open Account'}
          </button>
        </div>
      </div>

      {loading ? (
        <div className="h-64 flex flex-col items-center justify-center text-slate-400 gap-4">
          <div className="w-10 h-10 border-4 border-accent border-t-transparent rounded-full animate-spin" />
          <p className="text-sm font-medium tracking-widest uppercase">Fetching encrypted data...</p>
        </div>
      ) : accounts.length === 0 ? (
        <div className="premium-card p-12 flex flex-col items-center justify-center text-center space-y-4">
          <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center">
            <AlertCircle className="w-8 h-8 text-slate-300" />
          </div>
          <div>
            <h4 className="text-lg font-bold text-slate-900">No Active Accounts</h4>
            <p className="text-slate-500 max-w-sm mt-1">You don't have any financial accounts initialized yet. Open your first account to start banking.</p>
          </div>
          <button className="px-6 py-2 gold-gradient text-white rounded-lg font-bold text-sm">
            Initialize New Account
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
           {accounts.map(account => (
             <div key={account.id} className="premium-card group hover:border-accent group transition-all">
               <div className="p-8">
                 <div className="flex items-start justify-between mb-8">
                   <div className="flex items-center gap-4">
                     <div className="w-12 h-12 bg-[#0A192F] rounded-xl flex items-center justify-center shadow-lg shadow-primary/10 transition-transform group-hover:scale-105">
                       <CreditCard className="text-white w-6 h-6" />
                     </div>
                     <div>
                       <div className="flex items-center gap-2">
                         <h4 className="text-lg font-bold text-slate-900">{account.accountNumber}</h4>
                         <span className={cn(
                           "px-2 py-0.5 rounded text-[9px] font-bold uppercase tracking-widest",
                           account.status === AccountStatus.ACTIVE ? "bg-emerald-50 text-emerald-700 border border-emerald-100" : "bg-red-50 text-red-700 border border-red-100"
                         )}>
                           {account.status}
                         </span>
                       </div>
                       <p className="text-[10px] uppercase tracking-widest font-bold text-slate-400 mt-1">{account.type} ACCOUNT</p>
                     </div>
                   </div>
                   <button className="p-2 text-slate-400 hover:text-slate-900 transition-colors">
                     <MoreVertical className="w-5 h-5" />
                   </button>
                 </div>

                 <div className="flex items-end justify-between">
                   <div>
                     <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Available Balance</p>
                     <h3 className="text-3xl font-bold text-slate-900 mt-1">{formatCurrency(account.balance, account.currency)}</h3>
                   </div>
                   <div className="text-right">
                     <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Annual Yield</p>
                     <p className="text-base font-bold text-slate-900 mt-1">{account.interestRate}% <span className="text-slate-400 text-[10px] uppercase font-bold tracking-tighter">p.a.</span></p>
                   </div>
                 </div>
               </div>
               
               <div className="bg-slate-50 border-t border-slate-100 p-6 flex items-center justify-between">
                 <div className="flex items-center gap-3">
                   <button className="flex items-center gap-2 px-3 py-1.5 bg-white border border-slate-200 rounded text-[10px] font-bold text-slate-700 hover:border-slate-300 transition-all shadow-sm uppercase tracking-wider">
                     <ArrowUpRight className="w-3 h-3 text-emerald-600" />
                     Deposit
                   </button>
                   <button className="flex items-center gap-2 px-3 py-1.5 bg-white border border-slate-200 rounded text-[10px] font-bold text-slate-700 hover:border-slate-300 transition-all shadow-sm uppercase tracking-wider">
                     <ArrowDownRight className="w-3 h-3 text-red-600" />
                     Withdraw
                   </button>
                 </div>
                 <button className="text-[10px] font-bold text-accent uppercase tracking-widest hover:underline">
                   View Full Statement
                 </button>
               </div>
             </div>
           ))}
        </div>
      )}
    </div>
  );
};
