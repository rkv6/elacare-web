import React from 'react';
import { Link } from 'react-router-dom';
import { Leaf, BarChart3, Zap, ArrowRight } from 'lucide-react';

export default function Home() {
  return (
    <div className="min-h-screen bg-linear-to-b from-green-50 to-white">
      {/* Navigation */}
      <nav className="bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <Leaf className="text-green-600" size={32} />
            <span className="text-2xl font-bold text-gray-800">ElaCare</span>
          </div>
          <div className="flex gap-4">
            <Link to="/login" className="px-4 py-2 text-gray-700 hover:text-green-600 transition-colors">
              Login
            </Link>
            <Link to="/signup" className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors">
              Sign Up
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-4 py-20 text-center">
        <h1 className="text-5xl font-bold text-gray-900 mb-6">
          Smart Soil Monitoring for <br />
          <span className="text-green-600">Precision Farming</span>
        </h1>
        <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
          Real-time soil nutrient analysis powered by IoT sensors and AI-driven recommendations. 
          Maximize crop yield while minimizing resource waste.
        </p>
        <div className="flex gap-4 justify-center">
          <Link
            to="/signup"
            className="px-8 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center gap-2"
          >
            Get Started <ArrowRight size={20} />
          </Link>
          <button className="px-8 py-3 border-2 border-green-600 text-green-600 rounded-lg hover:bg-green-50 transition-colors">
            Learn More
          </button>
        </div>
      </section>

      {/* Features Section */}
      <section className="bg-white py-20 border-t border-gray-200">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-16">
            Powerful Features
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="p-8 bg-green-50 rounded-lg border border-green-200">
              <BarChart3 className="text-green-600 mb-4" size={40} />
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Real-Time Monitoring</h3>
              <p className="text-gray-600">
                Track nitrogen, pH, and boron levels with precise IoT sensors. Get instant alerts for anomalies.
              </p>
            </div>

            <div className="p-8 bg-purple-50 rounded-lg border border-purple-200">
              <Zap className="text-purple-600 mb-4" size={40} />
              <h3 className="text-xl font-semibold text-gray-900 mb-3">AI Recommendations</h3>
              <p className="text-gray-600">
                Google Gemini analyzes your soil data and provides personalized fertilizer recommendations.
              </p>
            </div>

            <div className="p-8 bg-blue-50 rounded-lg border border-blue-200">
              <Leaf className="text-blue-600 mb-4" size={40} />
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Precision Farming</h3>
              <p className="text-gray-600">
                Historical trend analysis helps optimize resource allocation and maximize crop productivity.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-linear-to-r from-green-600 to-green-700 py-16">
        <div className="max-w-4xl mx-auto px-4 text-center text-white">
          <h2 className="text-3xl font-bold mb-4">
            Ready to optimize your farming?
          </h2>
          <p className="text-lg mb-8 opacity-90">
            Join thousands of farmers using ElaCare for smarter soil management
          </p>
          <Link
            to="/signup"
            className="inline-block px-8 py-3 bg-white text-green-600 font-semibold rounded-lg hover:bg-gray-100 transition-colors"
          >
            Start Free Trial
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-400 py-8">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <p>&copy; 2024 ElaCare Smart Farming. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
