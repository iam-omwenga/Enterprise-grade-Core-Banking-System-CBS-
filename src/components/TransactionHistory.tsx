import React from 'react';
import { 
  ArrowUpRight, 
  ArrowDownRight, 
  ArrowLeftRight,
  Search,
  Download,
  Filter
} from 'lucide-react';
import { formatCurrency, formatDateTime, cn } from '../lib/utils';
import { TransactionType, TransactionStatus } from '../types';

const mockTransactions = [
  { id: '1', type: TransactionType.DEPOSIT, amount: 2500, status: TransactionStatus.COMPLETED, date: Date.now() - 3600000, reference: 'REF-DEP-001', desc: 'Payroll Credit' },
  { id: '2', type: TransactionType.WITHDRAWAL, amount: 450, status: TransactionStatus.COMPLETED, date: Date.now() - 86400000, reference: 'ATM-WD-992', desc: 'ATM Cash Out' },
  { id: '3', type: TransactionType.TRANSFER, amount: 120, status: TransactionStatus.PENDING, date: Date.now() - 172800000, reference: 'TRN-OFF-12', desc: 'Internal Transfer' },
  { id: '4', type: TransactionType.DEPOSIT, amount: 15600, status: TransactionStatus.COMPLETED, date: Date.now() - 604800000, reference: 'EXT-TRF-00', desc: 'Wire Transfer In' },
  { id: '5', type: TransactionType.FEE, amount: 35, status: TransactionStatus.COMPLETED, date: Date.now() - 1209600000, reference: 'SYS-FEE-MT', desc: 'Monthly Maintenance Fee' },
];

export const TransactionHistory: React.FC = () => {
  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-4 top-3 w-5 h-5 text-slate-400" />
          <input 
            type="text"
            placeholder="Search transactions by reference or name..." 
            className="w-full bg-white border border-slate-200 pl-12 pr-4 py-2.5 rounded-xl text-sm focus:border-accent outline-none"
          />
        </div>
        <div className="flex items-center gap-3">
          <button className="flex items-center gap-2 px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm font-bold text-slate-600 hover:bg-slate-50 transition-colors">
            <Filter className="w-4 h-4" />
            Filter By Date
          </button>
          <button className="flex items-center gap-2 px-6 py-2.5 bg-slate-900 text-white rounded-xl text-sm font-bold hover:bg-slate-800 transition-all shadow-lg shadow-primary/10">
            <Download className="w-4 h-4" />
            Download CSV
          </button>
        </div>
      </div>

      <div className="premium-card overflow-hidden">
        <table className="w-full text-left">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-200">
              <th className="px-8 py-3 text-[10px] font-bold text-slate-500 uppercase tracking-[0.2em]">Transaction Details / Entity</th>
              <th className="px-8 py-3 text-[10px] font-bold text-slate-500 uppercase tracking-[0.2em]">Execution Date</th>
              <th className="px-8 py-3 text-[10px] font-bold text-slate-500 uppercase tracking-[0.2em]">System Status</th>
              <th className="px-8 py-3 text-[10px] font-bold text-slate-500 uppercase tracking-[0.2em] text-right">Settlement Amount</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {mockTransactions.map((tx) => (
              <tr key={tx.id} className="hover:bg-slate-50/70 transition-colors group cursor-pointer text-xs">
                <td className="px-8 py-4">
                  <div className="flex items-center gap-4">
                    <div className={cn(
                      "w-9 h-9 rounded flex items-center justify-center shrink-0 border",
                      tx.type === TransactionType.DEPOSIT ? "bg-emerald-50 text-emerald-600 border-emerald-100" : 
                      tx.type === TransactionType.WITHDRAWAL ? "bg-red-50 text-red-600 border-red-100" : "bg-slate-50 text-slate-600 border-slate-200"
                    )}>
                      {tx.type === TransactionType.DEPOSIT && <ArrowUpRight className="w-5 h-5" />}
                      {tx.type === TransactionType.WITHDRAWAL && <ArrowDownRight className="w-5 h-5" />}
                      {tx.type === TransactionType.TRANSFER && <ArrowLeftRight className="w-5 h-5" />}
                      {tx.type === TransactionType.FEE && <Download className="w-5 h-5" />}
                    </div>
                    <div>
                      <p className="text-sm font-bold text-slate-900">{tx.desc}</p>
                      <p className="text-xs font-mono font-medium text-slate-400 mt-0.5 uppercase tracking-tighter">REF: {tx.reference}</p>
                    </div>
                  </div>
                </td>
                <td className="px-8 py-6">
                  <p className="text-xs font-bold text-slate-600 uppercase tracking-tighter">{formatDateTime(tx.date)}</p>
                </td>
                <td className="px-8 py-6">
                   <div className={cn(
                     "inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider",
                     tx.status === TransactionStatus.COMPLETED ? "bg-green-50 text-green-700" : "bg-yellow-50 text-yellow-700"
                   )}>
                     <div className={cn(
                       "w-1.5 h-1.5 rounded-full",
                       tx.status === TransactionStatus.COMPLETED ? "bg-green-500" : "bg-yellow-500"
                     )} />
                     {tx.status}
                   </div>
                </td>
                <td className="px-8 py-6 text-right">
                  <p className={cn(
                    "text-sm font-bold",
                    tx.type === TransactionType.DEPOSIT ? "text-green-600" : "text-slate-900"
                  )}>
                    {tx.type === TransactionType.DEPOSIT ? '+' : '-'}{formatCurrency(tx.amount)}
                  </p>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className="p-6 bg-slate-50 border-t border-slate-200 flex items-center justify-between">
          <p className="text-xs font-medium text-slate-500 italic">Showing 1-5 of 124 transactions</p>
          <div className="flex gap-2">
            <button className="px-4 py-2 bg-white border border-slate-200 rounded-lg text-xs font-bold text-slate-400 cursor-not-allowed">Previous</button>
            <button className="px-4 py-2 bg-white border border-slate-200 rounded-lg text-xs font-bold text-slate-700 hover:border-slate-300">Next Page</button>
          </div>
        </div>
      </div>
    </div>
  );
};
