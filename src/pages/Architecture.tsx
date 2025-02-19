import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

export default function Architecture() {
  return (
    <div className="min-h-screen bg-black text-white">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 px-6 py-4 flex justify-between items-center bg-black/80 backdrop-blur-sm">
        <Link to="/" className="text-[#4ade80] text-2xl font-light flex items-center gap-2">
          <ArrowLeft className="w-6 h-6" />
          Back to Home
        </Link>
      </nav>

      <div className="max-w-4xl mx-auto px-6 pt-32">
        {/* Header */}
        <div className="mb-24">
          <div className="text-gray-500 mb-4">Updated April 24, 2024</div>
          <h1 className="text-5xl font-light mb-6">
            System Architecture: The Physics Behind Weather Balloon Tracking
          </h1>
          <p className="text-xl text-gray-400">
            Our advanced tracking system combines cutting-edge GPS technology with sophisticated physics models to predict and optimize balloon trajectories.
          </p>
        </div>

        {/* Hero Image */}
        <div className="mb-24">
          <img 
            src="https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&q=80" 
            alt="System Architecture"
            className="w-full aspect-video object-cover rounded-lg"
          />
          <div className="text-gray-500 text-sm mt-2">
            Illustration: Advanced Data Processing
          </div>
        </div>

        {/* Content Sections */}
        <div className="space-y-24">
          <section>
            <h2 className="text-3xl font-light mb-8">Atmospheric Physics Model</h2>
            <p className="text-gray-400 text-lg leading-relaxed mb-8">
              Our system employs a sophisticated atmospheric model that accounts for various physical parameters affecting balloon trajectory. The core equation for vertical motion is:
            </p>
            <div className="bg-[#1a1a1a] rounded-lg p-8 mb-8 font-mono">
              <p className="text-[#4ade80]">F_net = F_buoyancy - F_gravity - F_drag</p>
              <p className="text-gray-400 mt-4">Where:</p>
              <ul className="text-gray-400 mt-2 space-y-2">
                <li>F_buoyancy = ρ_air * V * g</li>
                <li>F_gravity = m * g</li>
                <li>F_drag = 0.5 * ρ_air * v² * C_d * A</li>
              </ul>
            </div>
            <p className="text-gray-400 text-lg leading-relaxed">
              This model allows us to predict vertical acceleration and velocity at any given altitude, crucial for maintaining optimal flight paths.
            </p>
          </section>

          <section>
            <h2 className="text-3xl font-light mb-8">Wind Profile Integration</h2>
            <p className="text-gray-400 text-lg leading-relaxed mb-8">
              Wind speed and direction vary significantly with altitude, following the power law profile:
            </p>
            <div className="bg-[#1a1a1a] rounded-lg p-8 mb-8 font-mono">
              <p className="text-[#4ade80]">v(h) = v_ref * (h/h_ref)^α</p>
              <p className="text-gray-400 mt-4">Where:</p>
              <ul className="text-gray-400 mt-2 space-y-2">
                <li>v(h) = wind speed at height h</li>
                <li>v_ref = reference wind speed</li>
                <li>h = height of interest</li>
                <li>h_ref = reference height</li>
                <li>α = power law exponent (≈ 0.143 for neutral stability)</li>
              </ul>
            </div>
            <p className="text-gray-400 text-lg leading-relaxed">
              We integrate real-time wind data from multiple altitudes to create a comprehensive wind profile, enabling accurate trajectory predictions.
            </p>
          </section>

          <section>
            <h2 className="text-3xl font-light mb-8">Trajectory Optimization</h2>
            <p className="text-gray-400 text-lg leading-relaxed mb-8">
              The balloon's trajectory is calculated using a system of differential equations:
            </p>
            <div className="bg-[#1a1a1a] rounded-lg p-8 mb-8 font-mono">
              <p className="text-[#4ade80]">dx/dt = v * cos(θ) + w_x</p>
              <p className="text-[#4ade80]">dy/dt = v * sin(θ) + w_y</p>
              <p className="text-[#4ade80]">dz/dt = v_vertical</p>
              <p className="text-gray-400 mt-4">Where:</p>
              <ul className="text-gray-400 mt-2 space-y-2">
                <li>v = balloon velocity</li>
                <li>θ = heading angle</li>
                <li>w_x, w_y = wind components</li>
                <li>v_vertical = ascent/descent rate</li>
              </ul>
            </div>
          </section>

          <section>
            <h2 className="text-3xl font-light mb-8">Performance Metrics</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="bg-[#1a1a1a] rounded-lg p-8">
                <div className="text-2xl font-light mb-4">Prediction Accuracy</div>
                <div className="text-[#4ade80] text-4xl font-light">±2.5km</div>
                <p className="text-gray-400 mt-4">Landing location accuracy at 30km altitude</p>
              </div>
              <div className="bg-[#1a1a1a] rounded-lg p-8">
                <div className="text-2xl font-light mb-4">Wind Model Precision</div>
                <div className="text-[#4ade80] text-4xl font-light">98.5%</div>
                <p className="text-gray-400 mt-4">Correlation with actual measurements</p>
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-3xl font-light mb-8">Computational Methods</h2>
            <p className="text-gray-400 text-lg leading-relaxed mb-8">
              We employ a 4th-order Runge-Kutta method for numerical integration of the trajectory equations, with adaptive step size control to maintain accuracy while optimizing computational efficiency. This is combined with an ensemble Kalman filter for real-time state estimation and uncertainty quantification.
            </p>
            <div className="bg-[#1a1a1a] rounded-lg p-8">
              <div className="text-2xl font-light mb-4">Computation Time</div>
              <div className="text-[#4ade80] text-4xl font-light">&lt;50ms</div>
              <p className="text-gray-400 mt-4">For complete trajectory calculation</p>
            </div>
          </section>
        </div>

        {/* Get Started */}
        <div className="mt-24 mb-32">
          <Link 
            to="/"
            className="inline-flex items-center gap-2 text-[#4ade80] hover:text-[#22c55e] transition-colors"
          >
            <span>Get started →</span>
          </Link>
        </div>
      </div>
    </div>
  );
}