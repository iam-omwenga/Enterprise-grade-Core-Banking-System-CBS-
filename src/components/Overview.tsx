import React from 'react';
import { 
  TrendingUp, 
  TrendingDown, 
  ArrowUpRight, 
  ArrowDownRight, 
  DollarSign, 
  CreditCard, 
  Users,
  Activity
} from 'lucide-react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  AreaChart,
  Area
} from 'recharts';
import { formatCurrency, cn } from '../lib/utils';
import { seedService } from '../services/seed';
import { useAuth } from '../contexts/AuthContext';

const data = [
  { name: 'Mon', value: 4000 },
  { name: 'Tue', value: 3000 },
  { name: 'Wed', value: 2000 },
  { name: 'Thu', value: 2780 },
  { name: 'Fri', value: 1890 },
  { name: 'Sat', value: 2390 },
  { name: 'Sun', value: 3490 },
];

const StatCard = ({ title, value, change, trend, sub }: any) => (
  <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
    <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">{title}</p>
    <p className="text-2xl font-bold mt-1 text-slate-900">{value}</p>
    <div className={cn(
      "text-[10px] mt-2 flex items-center gap-1 font-bold",
      trend === 'up' ? "text-emerald-600" : "text-red-500"
    )}>
      {trend === 'up' ? (
        <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M12 7a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0V8.414l-4.293 4.293a1 1 0 01-1.414 0L8 10.414l-4.293 4.293a1 1 0 01-1.414-1.414l5-5a1 1 0 011.414 0L11 10.586 14.586 7H12z" clip-rule="evenodd"></path></svg>
      ) : (
        <TrendingDown className="w-3 h-3" />
      )}
      {change && <span>{trend === 'up' ? '+' : '-'}{change}% vs last month</span>}
      {!change && sub && <span className="text-slate-400">{sub}</span>}
    </div>
  </div>
);

export const Overview: React.FC = () => {
  const { user, isAdmin } = useAuth();
  const [seeding, setSeeding] = React.useState(false);

  const handleSeed = async () => {
    if (!user) return;
    setSeeding(true);
    try {
      await seedService.seedDemoData(user.uid);
      window.location.reload(); // Refresh to show new data
    } catch (err) {
      console.error(err);
    } finally {
      setSeeding(false);
    }
  };

  return (
    <div className="space-y-6">
      {isAdmin && (
        <div className="bg-gold/10 border border-gold/20 p-4 rounded-xl flex items-center justify-between">
          <div className="flex items-center gap-3">
             <div className="w-8 h-8 bg-gold rounded flex items-center justify-center text-white">
               <Activity className="w-5 h-5" />
             </div>
             <div>
               <p className="text-xs font-bold text-slate-900 uppercase">Administrator Controls</p>
               <p className="text-[10px] text-slate-500 font-medium">Database is currently empty. Initialize encrypted demo data for testing.</p>
             </div>
          </div>
          <button 
            onClick={handleSeed}
            disabled={seeding}
            className="px-4 py-2 bg-gold text-white text-[10px] font-bold rounded uppercase tracking-widest hover:bg-gold/90 transition-all disabled:opacity-50"
          >
            {seeding ? 'Initializing...' : 'Initialize Demo Environment'}
          </button>
        </div>
      )}
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="Total Deposits" value={formatCurrency(124802490)} change="12.4" trend="up" />
        <StatCard title="Active Loans" value="4,129" sub="Value: $42.5M" trend="neutral" />
        <StatCard title="KYC Pending" value="28" sub="8 high-risk profiles" trend="up" />
        <StatCard title="Fraud Alerts" value="3" sub="Immediate action required" trend="down" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white rounded-xl border border-slate-200 shadow-sm p-6 flex flex-col">
          <div className="flex justify-between items-center mb-6">
            <h3 className="font-bold text-slate-700 text-sm">Transaction Volume (7 Days)</h3>
            <select className="text-[10px] font-bold border-slate-200 rounded-md p-1.5 uppercase tracking-wider text-slate-500 outline-none">
              <option>Real-time View</option>
              <option>Historical</option>
            </select>
          </div>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data}>
                <defs>
                  <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#0A192F" stopOpacity={0.1}/>
                    <stop offset="95%" stopColor="#0A192F" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 10, fontWeight: 600}} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 10, fontWeight: 600}} tickFormatter={(val) => `$${val/1000}k`} />
                <Tooltip 
                  contentStyle={{borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)', fontSize: '12px'}}
                />
                <Area type="monotone" dataKey="value" stroke="#0A192F" strokeWidth={2} fillOpacity={1} fill="url(#colorValue)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-[#0A192F] text-white rounded-xl shadow-lg flex flex-col overflow-hidden">
          <div className="p-4 border-b border-white/10 bg-white/5">
            <h3 className="font-bold text-sm flex items-center gap-2">
              <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></span>
              Security Feed
            </h3>
          </div>
          <div className="flex-1 overflow-y-auto max-h-[400px]">
             {[
               { time: '14:02:11', status: 'CRITICAL', title: 'Unauthorized Withdrawal Attempt', desc: 'Acc: ****9012 | $5,000.00 | IP: 192.168.1.45', color: 'text-red-400' },
               { time: '13:58:45', status: 'MFA TRIGGER', title: 'High-Value Transfer Flag', desc: 'Acc: ****4544 | Waiting Admin Approval', color: 'text-gold' },
               { time: '13:45:02', status: 'SUCCESS', title: 'New Corporate Account Active', desc: 'KYC Verified: Apex Logistics Ltd.', color: 'text-emerald-400' },
               { time: '13:30:12', status: 'INFO', title: 'Daily Backup Completed', desc: 'Cluster: NC-PRD-DB-01', color: 'text-slate-400' },
             ].map((alert, i) => (
               <div key={i} className="p-4 border-b border-white/5 space-y-1 hover:bg-white/5 transition-colors">
                  <div className="flex justify-between text-[10px] font-bold tracking-widest text-slate-500">
                    <span>{alert.time}</span>
                    <span className={alert.color}>{alert.status}</span>
                  </div>
                  <p className="text-xs font-semibold">{alert.title}</p>
                  <p className="text-[10px] text-slate-400">{alert.desc}</p>
               </div>
             ))}
          </div>
          <div className="p-4">
            <button className="w-full py-2 bg-gold hover:bg-gold/90 text-white text-[10px] font-bold rounded uppercase tracking-[0.2em] transition-all">
              Monitoring Center
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
