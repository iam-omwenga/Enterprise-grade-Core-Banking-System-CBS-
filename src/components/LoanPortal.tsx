import React, { useState } from 'react';
import { 
  Briefcase, 
  Clock, 
  ChevronRight, 
  Scale, 
  Percent, 
  Info,
  CheckCircle2,
  AlertTriangle
} from 'lucide-react';
import { formatCurrency, cn } from '../lib/utils';
import { LoanStatus } from '../types';

export const LoanPortal: React.FC = () => {
  const [loanAmount, setLoanAmount] = useState(10000);
  const [months, setMonths] = useState(12);
  const interestRate = 8.5; // Fixed for demo

  const monthlyPayment = (loanAmount * (1 + (interestRate/100))) / months;

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Loan Calculator */}
        <div className="bg-[#0A192F] text-white rounded-xl shadow-2xl p-8 relative overflow-hidden flex flex-col justify-center">
          <div className="absolute top-0 right-0 p-8 opacity-5">
            <Scale className="w-48 h-48" />
          </div>
          
          <div className="relative z-10">
            <h3 className="text-xl font-bold tracking-tight mb-8 flex items-center gap-2">
               <span className="w-2 h-2 bg-gold rounded-full" />
               Institutional Credit Evaluation
            </h3>
            
            <div className="space-y-8">
              <div className="space-y-4">
                <div className="flex justify-between items-end">
                  <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Principal Amount (USD)</label>
                  <span className="text-2xl font-bold text-gold">{formatCurrency(loanAmount)}</span>
                </div>
                <input 
                  type="range" 
                  min="1000" 
                  max="500000" 
                  step="5000"
                  value={loanAmount}
                  onChange={(e) => setLoanAmount(Number(e.target.value))}
                  className="w-full h-1 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-gold"
                />
              </div>

              <div className="space-y-4">
                <div className="flex justify-between items-end">
                  <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Repayment Term</label>
                  <span className="text-2xl font-bold text-gold">{months} Months</span>
                </div>
                <div className="grid grid-cols-4 gap-2">
                  {[12, 24, 36, 60].map((m) => (
                    <button 
                      key={m}
                      onClick={() => setMonths(m)}
                      className={cn(
                        "py-2 rounded-md text-xs font-bold transition-all border",
                        months === m ? "bg-gold border-gold text-slate-900" : "bg-white/5 border-white/10 text-slate-400 hover:bg-white/10"
                      )}
                    >
                      {m}M
                    </button>
                  ))}
                </div>
              </div>

              <div className="pt-8 border-t border-white/10 flex items-center justify-between">
                <div>
                  <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1">Monthly Obligation</p>
                  <p className="text-3xl font-bold text-white">{formatCurrency(monthlyPayment)}</p>
                </div>
                <button className="bg-gold hover:bg-gold/90 text-white text-xs font-bold px-8 py-3 rounded uppercase tracking-widest shadow-xl shadow-gold/10 transition-all">
                  Initiate Request
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Existing Loans */}
        <div className="space-y-6">
           <div className="flex items-center justify-between">
             <h3 className="text-lg font-bold text-slate-900">Current Credit Portfolio</h3>
             <button className="text-xs font-bold text-accent uppercase tracking-widest hover:underline">View All Documents</button>
           </div>
           
           <div className="premium-card p-6 border-l-4 border-l-gold">
              <div className="flex justify-between items-start mb-6">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-slate-50 rounded-lg flex items-center justify-center text-slate-600">
                    <Briefcase className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-slate-900">Business Development Loan</h4>
                    <p className="text-xs text-slate-500 mt-0.5">Acc: #LN-882103</p>
                  </div>
                </div>
                <div className="bg-green-50 text-green-700 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider">
                  Disbursed
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 mb-6">
                <div>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Remaining Balance</p>
                  <p className="text-lg font-bold text-slate-900 mt-0.5">{formatCurrency(42500)}</p>
                </div>
                <div>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Next Due Date</p>
                  <p className="text-lg font-bold text-slate-900 mt-0.5">June 05, 2026</p>
                </div>
              </div>

              <div className="w-full bg-slate-100 rounded-full h-1.5 mb-6">
                <div className="bg-gold h-full rounded-full" style={{ width: '65%' }} />
              </div>

              <div className="flex items-center justify-between">
                 <p className="text-xs font-medium text-slate-500">65% of principal repaid</p>
                 <button className="text-sm font-bold text-slate-700 flex items-center gap-1 group">
                   Quick Pay <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                 </button>
              </div>
           </div>

           <div className="premium-card p-6 bg-slate-50 border-slate-200 border-dashed">
              <div className="flex items-center gap-3 text-slate-400">
                 <Clock className="w-5 h-5" />
                 <p className="text-sm font-medium">No pending loan applications</p>
              </div>
           </div>
        </div>
      </div>

      {/* Benefits / Information */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
         {[
           { icon: Percent, title: 'Competitive Rates', desc: 'Starting from 4.5% APR for premier members' },
           { icon: Scale, title: 'Flexible Terms', desc: 'Custom repayment schedules up to 10 years' },
           { icon: CheckCircle2, title: 'Instant Decision', desc: 'Get preliminary approval in under 60 seconds' },
         ].map((benefit, i) => (
           <div key={i} className="premium-card p-6 flex gap-4">
              <div className="w-10 h-10 bg-white border border-slate-100 rounded-lg flex items-center justify-center text-accent shrink-0">
                <benefit.icon className="w-5 h-5" />
              </div>
              <div>
                <h5 className="text-sm font-bold text-slate-900">{benefit.title}</h5>
                <p className="text-xs text-slate-500 mt-1 leading-relaxed">{benefit.desc}</p>
              </div>
           </div>
         ))}
      </div>
    </div>
  );
};
