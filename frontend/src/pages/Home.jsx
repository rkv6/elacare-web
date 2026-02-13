import React from 'react';
import { Link } from 'react-router-dom';
import { Leaf, BarChart3, Zap, ArrowRight, Cpu } from 'lucide-react';

export default function Home() {
  return (
    <div className="min-h-screen bg-white">
      {/* Nav */}
      <nav className="border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-lg bg-emerald-600 flex items-center justify-center">
              <Leaf size={14} className="text-white" />
            </div>
            <span className="text-lg font-bold text-gray-900 tracking-tight">ela<span className="text-emerald-600">Care</span></span>
          </div>
          <div className="flex gap-3">
            <Link to="/login" className="px-4 py-2 text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors">Login</Link>
            <Link to="/signup" className="px-4 py-2 text-sm font-semibold bg-emerald-600 text-white rounded-xl hover:bg-emerald-700 transition-colors">Sign Up</Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="max-w-5xl mx-auto px-6 py-20 sm:py-28 text-center">
        <p className="section-label mb-4 text-center">Smart Agriculture IoT Platform</p>
        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 mb-6 leading-tight tracking-tight">
          Precision Soil Monitoring<br />for <span className="text-emerald-600">Cardamom Farms</span>
        </h1>
        <p className="text-lg text-gray-500 mb-10 max-w-2xl mx-auto">
          Real-time NPK analysis powered by IoT sensors and AI-driven recommendations.
          Maximize yield while minimizing resource waste.
        </p>
        <div className="flex gap-4 justify-center flex-wrap">
          <Link to="/signup"
            className="inline-flex items-center gap-2 px-7 py-3 bg-emerald-600 text-white font-semibold rounded-xl hover:bg-emerald-700 transition-colors shadow-sm">
            Get Started <ArrowRight size={18} />
          </Link>
          <button className="px-7 py-3 border border-gray-200 text-gray-700 font-medium rounded-xl hover:bg-gray-50 transition-colors">
            Learn More
          </button>
        </div>
      </section>

      {/* Features */}
      <section className="border-t border-gray-100 py-20">
        <div className="max-w-6xl mx-auto px-6">
          <p className="section-label text-center mb-3">Core Features</p>
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-14">
            Everything you need for smart farming
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {[
              { icon: BarChart3, color: 'emerald', title: 'Real-Time Monitoring', desc: 'Track nitrogen, pH, and boron levels with precise IoT sensors. Get instant alerts for anomalies.' },
              { icon: Cpu, color: 'emerald', title: 'AI Recommendations', desc: 'Google Gemini analyzes your soil data and provides personalized fertilizer recommendations.' },
              { icon: Leaf, color: 'emerald', title: 'Precision Farming', desc: 'Historical trend analysis helps optimize resource allocation and maximize crop productivity.' }
            ].map((f, i) => (
              <div key={i} className="bento-card group hover:shadow-lg transition-all duration-300">
                <div className="w-11 h-11 rounded-xl bg-emerald-50 flex items-center justify-center mb-5 group-hover:bg-emerald-100 transition-colors">
                  <f.icon size={20} className="text-emerald-600" />
                </div>
                <h3 className="text-base font-semibold text-gray-900 mb-2">{f.title}</h3>
                <p className="text-sm text-gray-500 leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-emerald-600 py-16">
        <div className="max-w-4xl mx-auto px-6 text-center text-white">
          <h2 className="text-3xl font-bold mb-4">Ready to optimize your farming?</h2>
          <p className="text-emerald-100 mb-8 text-lg">Join farmers using ElaCare for smarter soil management</p>
          <Link to="/signup"
            className="inline-block px-8 py-3 bg-white text-emerald-700 font-semibold rounded-xl hover:bg-emerald-50 transition-colors">
            Start Free Trial
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-100 py-8">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <p className="text-xs font-mono text-gray-400">&copy; 2024 ElaCare Smart Farming &middot; SJCET Palai</p>
        </div>
      </footer>
    </div>
  );
}
