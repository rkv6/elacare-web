import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { auth, signInWithEmailAndPassword } from '../services/firebase';
import { Leaf, AlertCircle, Loader, Eye, EyeOff } from 'lucide-react';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await signInWithEmailAndPassword(auth, email, password);
      navigate('/dashboard');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const inputClass = "w-full px-4 py-3 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 text-gray-900 text-sm transition-colors";

  return (
    <div className="min-h-screen bg-white flex items-center justify-center p-4">
      <div className="w-full max-w-5xl grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
        {/* Left — Branding */}
        <div className="order-2 lg:order-1">
          <p className="section-label mb-4">ElaCare Platform</p>
          <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 leading-tight mb-4 tracking-tight">
            Cardamom<br />Farming<br /><span className="text-emerald-600">Intelligence</span>.
          </h1>
          <p className="text-gray-500 text-base mb-8 max-w-sm leading-relaxed">
            Hardware-integrated soil monitoring with AI insights for precision elachi cultivation.
          </p>
          <div className="flex gap-3">
            {['IoT Sensors', 'AI Analysis', 'Real-time Data'].map((t, i) => (
              <span key={i} className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[10px] font-bold font-mono bg-emerald-50 text-emerald-700 uppercase tracking-wider">
                <span className="w-1 h-1 rounded-full bg-emerald-500" /> {t}
              </span>
            ))}
          </div>
        </div>

        {/* Right — Login Form */}
        <div className="order-1 lg:order-2">
          <div className="bento-card max-w-md mx-auto">
            <div className="flex items-center justify-center gap-2.5 mb-8">
              <div className="w-7 h-7 rounded-lg bg-emerald-600 flex items-center justify-center">
                <Leaf size={14} className="text-white" />
              </div>
              <span className="text-base font-bold text-gray-900">ela<span className="text-emerald-600">Care</span></span>
            </div>

            <h2 className="text-xl font-bold text-center text-gray-900 mb-1">Welcome Back</h2>
            <p className="text-center text-sm text-gray-500 mb-8">Sign in to your dashboard</p>

            {error && (
              <div className="bg-red-50 border border-red-100 rounded-xl p-3 mb-6 flex items-start gap-2.5">
                <AlertCircle className="text-red-500 mt-0.5 shrink-0" size={16} />
                <p className="text-red-700 text-sm">{error}</p>
              </div>
            )}

            <form onSubmit={handleLogin} className="space-y-5">
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1.5 uppercase tracking-wide">Email</label>
                <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required
                  className={inputClass} placeholder="you@example.com" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1.5 uppercase tracking-wide">Password</label>
                <div className="relative">
                  <input type={showPassword ? "text" : "password"} value={password}
                    onChange={(e) => setPassword(e.target.value)} required
                    className={`${inputClass} pr-12`} placeholder="••••••••" />
                  <button type="button" onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors">
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>
              <button type="submit" disabled={loading}
                className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-emerald-600 text-white text-sm font-semibold rounded-xl hover:bg-emerald-700 transition-colors disabled:opacity-50 mt-2">
                {loading && <Loader size={16} className="animate-spin" />}
                {loading ? 'Signing in...' : 'Sign In'}
              </button>
            </form>

            <div className="mt-8 pt-6 border-t border-gray-100">
              <p className="text-center text-sm text-gray-500">
                Don't have an account?{' '}
                <Link to="/signup" className="text-emerald-600 hover:text-emerald-700 font-semibold transition-colors">Sign up</Link>
              </p>
            </div>

            <p className="text-[10px] text-gray-400 text-center mt-5 font-mono">
              Demo: demo@elacare.com / password123
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
