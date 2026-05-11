import React, { useState } from 'react';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword, GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import { auth } from '../lib/firebase';
import { dbService } from '../services/db';
import { ShieldCheck, Mail, Lock, User, LifeBuoy } from 'lucide-react';
import { motion } from 'motion/react';
import { UserRole } from '../types';

export const Login: React.FC = () => {
  const [isRegistering, setIsRegistering] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (isRegistering) {
        const { user } = await createUserWithEmailAndPassword(auth, email, password);
        const role = email === 'bakefriv56@gmail.com' ? UserRole.ADMIN : UserRole.CUSTOMER;
        
        await dbService.set('users', user.uid, {
          uid: user.uid,
          email,
          fullName,
          role,
          kycStatus: email === 'bakefriv56@gmail.com' ? 'VERIFIED' : 'PENDING',
          createdAt: Date.now(),
        });
      } else {
        await signInWithEmailAndPassword(auth, email, password);
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    const provider = new GoogleAuthProvider();
    try {
      const { user } = await signInWithPopup(auth, provider);
      // Check if user profile exists
      const existingProfile = await dbService.get('users', user.uid);
      if (!existingProfile) {
        await dbService.set('users', user.uid, {
          uid: user.uid,
          email: user.email!,
          fullName: user.displayName || 'Unnamed User',
          role: UserRole.CUSTOMER,
          kycStatus: 'PENDING',
          createdAt: Date.now(),
        });
      }
    } catch (err: any) {
      setError(err.message);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 flex font-sans">
      {/* Left Pane - Branding */}
      <div className="hidden lg:flex w-1/2 flex-col justify-between p-16 bg-slate-900 border-r border-slate-800 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
           <div className="absolute top-[-10%] left-[-10%] w-[60%] h-[60%] rounded-full gold-gradient blur-[120px]" />
           <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-blue-600 blur-[100px]" />
        </div>

        <div className="flex items-center gap-4 relative z-10">
          <div className="w-10 h-10 gold-gradient rounded-xl flex items-center justify-center font-bold text-xl shadow-2xl shadow-gold/40 text-slate-900">
            N
          </div>
          <div>
            <h1 className="text-white font-bold tracking-tight text-xl leading-none">NovaCore<span className="text-gold">Suite</span></h1>
            <p className="text-slate-500 text-[10px] font-bold tracking-[0.2em] uppercase mt-1 opacity-80">Institutional Access</p>
          </div>
        </div>

        <div className="relative z-10 max-w-lg">
          <h2 className="text-5xl font-bold text-white leading-tight tracking-tight mb-6">
            The Modern <span className="text-gold">Gold Standard</span> in Core Banking.
          </h2>
          <p className="text-slate-400 text-lg leading-relaxed font-medium">
            Next-generation financial infrastructure engineered for high-performance institutions and digital scale.
          </p>
        </div>

        <div className="flex items-center gap-8 relative z-10">
          <div>
            <p className="text-white text-3xl font-bold">128ms</p>
            <p className="text-slate-500 text-xs font-semibold uppercase tracking-widest mt-1">Settlement Time</p>
          </div>
          <div className="w-px h-10 bg-slate-800" />
          <div>
            <p className="text-white text-3xl font-bold">99.99%</p>
            <p className="text-slate-500 text-xs font-semibold uppercase tracking-widest mt-1">System Uptime</p>
          </div>
        </div>
      </div>

      {/* Right Pane - Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8">
        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="w-full max-w-md space-y-10"
        >
          <div>
            <h3 className="text-white text-3xl font-bold tracking-tight mb-2">
              {isRegistering ? 'Create Master Account' : 'Welcome Professional'}
            </h3>
            <p className="text-slate-500">Access the secure banking gateway</p>
          </div>

          <form onSubmit={handleAuth} className="space-y-6">
            {isRegistering && (
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-400 uppercase tracking-widest block">Full Name</label>
                <div className="relative">
                  <User className="absolute left-4 top-3.5 w-5 h-5 text-slate-600" />
                  <input
                    type="text"
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-800 text-white pl-12 pr-4 py-3.5 rounded-xl outline-none focus:border-gold transition-all"
                    placeholder="Enter full legal name"
                  />
                </div>
              </div>
            )}
            
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-400 uppercase tracking-widest block">Institutional Email</label>
              <div className="relative">
                <Mail className="absolute left-4 top-3.5 w-5 h-5 text-slate-600" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-800 text-white pl-12 pr-4 py-3.5 rounded-xl outline-none focus:border-gold transition-all"
                  placeholder="name@institution.com"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-400 uppercase tracking-widest block">Master Password</label>
              <div className="relative">
                <Lock className="absolute left-4 top-3.5 w-5 h-5 text-slate-600" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-800 text-white pl-12 pr-4 py-3.5 rounded-xl outline-none focus:border-gold transition-all"
                  placeholder="••••••••••••"
                />
              </div>
            </div>

            {error && (
              <div className="p-4 bg-red-500/10 border border-red-500/20 text-red-500 text-sm rounded-xl flex items-center gap-3">
                <div className="w-1.5 h-1.5 bg-red-500 rounded-full shrink-0" />
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gold text-white font-bold py-4 rounded-xl shadow-2xl shadow-gold/20 hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50 disabled:scale-100"
            >
              {loading ? 'Validating Credentials...' : isRegistering ? 'Register Institution' : 'Authenticate Access'}
            </button>
          </form>

          <div className="relative">
            <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-slate-801"></div></div>
            <div className="relative flex justify-center text-[10px] uppercase tracking-[0.2em] font-bold"><span className="bg-slate-950 px-4 text-slate-600">Secure SSO Gateway</span></div>
          </div>

          <button
            onClick={handleGoogleSignIn}
            className="w-full bg-white text-slate-900 font-bold py-4 rounded-xl flex items-center justify-center gap-3 hover:bg-slate-100 transition-colors"
          >
            <img src="https://www.google.com/favicon.ico" className="w-5 h-5" alt="Google" />
            Corporate Google SSO
          </button>

          <div className="text-center space-y-4">
             <button 
               onClick={() => setIsRegistering(!isRegistering)}
               className="text-slate-400 text-sm hover:text-white transition-colors"
             >
               {isRegistering ? 'Already have an account? Sign in' : "Don't have access? Request enrollment"}
             </button>
             
             <div className="flex items-center justify-center gap-4 text-slate-600">
               <div className="flex items-center gap-1.5 cursor-pointer hover:text-slate-400 transition-colors">
                  <LifeBuoy className="w-4 h-4" />
                  <span className="text-[10px] font-bold uppercase tracking-widest">Support</span>
               </div>
               <div className="w-1 h-1 bg-slate-800 rounded-full" />
               <div className="flex items-center gap-1.5 cursor-pointer hover:text-slate-400 transition-colors">
                  <ShieldCheck className="w-4 h-4" />
                  <span className="text-[10px] font-bold uppercase tracking-widest">Security Policy</span>
               </div>
             </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};
