import React, { useState, useEffect } from 'react';
import { Wind, Navigation2, Ruler, ChevronDown, ArrowRight } from 'lucide-react';
import { Map } from './components/Map';
import BalloonCarousel from './components/BalloonCarousel';

interface FAQItem {
  question: string;
  answer: string;
}

interface Industry {
  title: string;
  description: string;
  imageUrl: string;
}

const industries: Industry[] = [
  {
    title: "Federal Government",
    description: "Develop strategic plans for nationwide initiatives in climate resilience, emergency preparedness, and rural broadband access with detailed mapping data.",
    imageUrl: "https://images.unsplash.com/photo-1569235186275-626cb53b83ce?auto=format&fit=crop&q=80"
  },
  {
    title: "Insurance",
    description: "Accurately assess property risk, inform underwriting, and better manage claims with building-based geocodes and high-precision property intelligence.",
    imageUrl: "https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&q=80"
  },
  {
    title: "Municipal & State Government",
    description: "Improve transportation networks, public safety, and stormwater planning throughout your community with a virtual representation of infrastructure.",
    imageUrl: "https://images.unsplash.com/photo-1477959858617-67f85cf4f1df?auto=format&fit=crop&q=80"
  }
];

const faqs: FAQItem[] = [
  {
    question: "What's the purpose of weather balloons?",
    answer: "Weather balloons carry specialized instruments called radiosondes to measure atmospheric conditions at various altitudes. They collect crucial data about temperature, humidity, pressure, wind speed, and wind direction, which is essential for weather forecasting and atmospheric research."
  },
  {
    question: "How high can weather balloons fly?",
    answer: "Weather balloons typically reach altitudes between 60,000 to 105,000 feet (18-32 kilometers) before they burst. The altitude achieved depends on factors like balloon size, payload weight, and atmospheric conditions."
  },
  {
    question: "How is the data collected and transmitted?",
    answer: "Weather balloons are equipped with radiosondes that transmit data in real-time using radio signals. This data is received by ground stations and immediately processed for use in weather forecasting models and research."
  },
  {
    question: "What happens to the balloons after they burst?",
    answer: "After a weather balloon bursts, its payload descends back to Earth via parachute. The descent is carefully calculated and tracked to ensure safe landing. Most equipment is designed to be environmentally friendly or recoverable."
  }
];

export default function App() {
  const [lastUpdate, setLastUpdate] = useState<Date>(new Date());
  const [expandedFAQ, setExpandedFAQ] = useState<number | null>(null);

  useEffect(() => {
    const timer = setInterval(() => {
      setLastUpdate(new Date());
    }, 60000);
    return () => clearInterval(timer);
  }, []);

  const formatLastUpdate = (date: Date) => {
    const now = new Date();
    const diff = Math.floor((now.getTime() - date.getTime()) / 1000 / 60);
    return `Last updated ${diff} minute${diff !== 1 ? 's' : ''} ago`;
  };

  return (
    <div className="min-h-screen bg-black">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 px-6 py-4 flex justify-between items-center bg-black/80 backdrop-blur-sm">
        <div className="text-[#4ade80] text-2xl font-light">Weather Balloon Tracker</div>
      </nav>

      {/* Hero Section */}
      <section className="hero-section min-h-screen relative flex items-center">
        <div className="container mx-auto px-6 relative z-10">
          <div className="max-w-3xl">
            <h1 className="text-[#4ade80] text-6xl font-light mb-6 leading-tight">
              Track Weather Balloons in Real-Time
            </h1>
            <p className="text-gray-200 text-xl mb-8 leading-relaxed">
              Our advanced tracking system monitors high-altitude weather balloons across the United States,
              providing real-time data for atmospheric research and weather forecasting.
            </p>
            <a 
              href="#live-tracker"
              className="bg-[#4ade80] text-black px-8 py-3 rounded-full hover:bg-[#22c55e] transition-colors font-medium inline-block"
            >
              Launch Tracker
            </a>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 px-6 bg-[#0a0a0a]">
        <div className="container mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="video-card p-8">
              <Wind className="w-12 h-12 text-[#4ade80] mb-4" />
              <h3 className="text-[#4ade80] text-xl font-light mb-2">Real-time Updates</h3>
              <p className="text-gray-400">
                Monitor atmospheric conditions with live data updates every minute.
              </p>
            </div>
            <div className="video-card p-8">
              <Navigation2 className="w-12 h-12 text-[#4ade80] mb-4" />
              <h3 className="text-[#4ade80] text-xl font-light mb-2">Precise Tracking</h3>
              <p className="text-gray-400">
                Track balloon trajectories with advanced GPS technology.
              </p>
            </div>
            <div className="video-card p-8">
              <Ruler className="w-12 h-12 text-[#4ade80] mb-4" />
              <h3 className="text-[#4ade80] text-xl font-light mb-2">Landing Prediction</h3>
              <p className="text-gray-400">
                Calculate precise landing locations using advanced algorithms.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Live Tracker Section */}
      <section id="live-tracker" className="bg-black">
        <header className="bg-[#0a0a0a] text-white h-16 flex items-center justify-between px-6 border-b border-gray-800">
          <h2 className="text-xl font-light text-[#4ade80]">Live Tracker</h2>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className="w-2.5 h-2.5 bg-[#4ade80] rounded-full"></div>
                <div className="absolute inset-0 w-2.5 h-2.5 bg-[#4ade80] rounded-full animate-ping"></div>
              </div>
              <span className="text-gray-400 text-sm">{formatLastUpdate(lastUpdate)}</span>
            </div>
          </div>
        </header>
        <div className="relative">
          <div className="h-[calc(100vh-4rem)]">
            <Map />
          </div>
          <div className="absolute bottom-0 left-0 right-0 bg-[#0a0a0a] border-t border-gray-800">
            <BalloonCarousel />
          </div>
        </div>
      </section>

      {/* Info Section */}
      <section className="py-24 px-6 bg-[#0a0a0a]">
        <div className="container mx-auto">
          <div className="mb-16">
            <h2 className="text-6xl font-light text-gray-600 mb-4">Industries</h2>
          </div>
          <div className="space-y-8">
            {industries.map((industry, index) => (
              <div key={index} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 items-center py-8 border-t border-gray-800">
                <div className="col-span-1">
                  <h3 className="text-3xl font-light text-gray-600 mb-4">{industry.title}</h3>
                </div>
                <div className="col-span-1">
                  <p className="text-gray-400 leading-relaxed mb-4">{industry.description}</p>
                  <button className="bg-[#4ade80]/20 p-3 rounded-full hover:bg-[#4ade80]/30 transition-colors">
                    <ArrowRight className="w-5 h-5 text-[#4ade80]" />
                  </button>
                </div>
                <div className="col-span-1">
                  <img 
                    src={industry.imageUrl} 
                    alt={industry.title}
                    className="w-full h-64 object-cover rounded-2xl"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-24 px-6 bg-[#0a0a0a]">
        <div className="container mx-auto max-w-3xl">
          <h2 className="text-4xl font-light text-[#4ade80] mb-12 text-center">Frequently Asked Questions</h2>
          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <div 
                key={index}
                className="video-card overflow-hidden cursor-pointer"
                onClick={() => setExpandedFAQ(expandedFAQ === index ? null : index)}
              >
                <div className="p-6 flex justify-between items-center">
                  <h3 className="text-[#4ade80] text-lg font-light">{faq.question}</h3>
                  <ChevronDown 
                    className={`w-5 h-5 text-[#4ade80] transition-transform duration-300 ${
                      expandedFAQ === index ? 'rotate-180' : ''
                    }`}
                  />
                </div>
                <div 
                  className={`overflow-hidden transition-all duration-300 ease-in-out ${
                    expandedFAQ === index ? 'max-h-96' : 'max-h-0'
                  }`}
                >
                  <p className="px-6 pb-6 text-gray-400">{faq.answer}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}