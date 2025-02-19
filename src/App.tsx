import React, { useState, useEffect } from 'react';
import { Wind, Navigation2, Ruler, ChevronDown, ArrowRight, Mail, Linkedin, Egg, Database } from 'lucide-react';
import { Map } from './components/Map';
import BalloonCarousel from './components/BalloonCarousel';
import { Link } from 'react-router-dom';

interface FAQItem {
  question: string;
  answer: string;
}

interface Industry {
  title: string;
  description: string;
  imageUrl: string;
  link?: string;
}

const industries: Industry[] = [
  {
    title: "The Challenge",
    description: "WindBorne Systems faces challenges in scaling its balloon network to achieve global coverage while ensuring long-duration flights without unexpected failures. Additionally, the company is focused on improving its AI-driven weather models to enhance forecast accuracy and compete with traditional meteorological methods.",
    imageUrl: "https://images.unsplash.com/photo-1534088568595-a066f410bcda?auto=format&fit=crop&q=80",
    link: "https://www.sfchronicle.com/weather/article/windborne-systems-weather-balloons-19954353.php?utm_source=chatgpt.com"
  },
  {
    title: "Latest Developments",
    description: "Most weather balloons burst and fall to Earth as waste, with only 20% of instruments recovered. WindBorne Systems is changing this with reusable balloons that ascend and descend multiple times, cutting down on environmental impact.",
    imageUrl: "https://images.unsplash.com/photo-1590055531615-f16d36ffe8ec?auto=format&fit=crop&q=80",
    link: "https://windbornesystems.com/"
  },
  {
    title: "System Architecture",
    description: "Discover the algorithms behind weather balloon trajectory and how atmospheric conditions influence their paths. Learn to predict and optimize flight patterns using real-world data and computational models.",
    imageUrl: "https://images.unsplash.com/photo-1551033406-611cf9a28f67?auto=format&fit=crop&q=80",
    link: "/architecture"
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
        <Link to="/" className="text-[#4ade80] text-2xl font-light">Arlette</Link>
      </nav>

      {/* Hero Section */}
      <section className="hero-section min-h-screen relative flex items-center">
        <div className="container mx-auto px-6 relative z-10">
          <div className="max-w-3xl">
            <h1 className="text-[#4ade80] text-6xl font-light mb-6 leading-tight">
              Space wont save you
            </h1>
            <p className="text-gray-200 text-xl mb-8 leading-relaxed">
              The sky's big, but don't let your weather balloon get lost in it.
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
            <h2 className="text-6xl font-light text-gray-600 mb-4">Overview</h2>
          </div>
          <div className="space-y-8">
            {industries.map((industry, index) => (
              <div key={index} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 items-center py-8 border-t border-gray-800">
                <div className="col-span-1">
                  <h3 className="text-3xl font-light text-gray-600 mb-4">{industry.title}</h3>
                </div>
                <div className="col-span-1">
                  <p className="text-gray-400 leading-relaxed mb-4">{industry.description}</p>
                  {industry.link ? (
                    <Link 
                      to={industry.link}
                      className="inline-flex bg-[#4ade80]/20 p-3 rounded-full hover:bg-[#4ade80]/30 transition-colors"
                    >
                      <ArrowRight className="w-5 h-5 text-[#4ade80]" />
                    </Link>
                  ) : (
                    <button className="bg-[#4ade80]/20 p-3 rounded-full hover:bg-[#4ade80]/30 transition-colors">
                      <ArrowRight className="w-5 h-5 text-[#4ade80]" />
                    </button>
                  )}
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

      {/* Footer */}
      <footer className="bg-black border-t border-gray-800 py-12">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* Creators */}
            <div>
              <h3 className="text-[#4ade80] text-xl font-light mb-4">Creators</h3>
              <div className="space-y-4">
                <div>
                  <p className="text-gray-400 font-medium">Tavasya</p>
                  <div className="flex items-center gap-3 mt-2">
                    <a href="mailto:tavasyag@gmail.com" className="text-gray-500 hover:text-[#4ade80] transition-colors">
                      <Mail className="w-5 h-5" />
                    </a>
                    <a href="https://www.linkedin.com/in/tavasyaganpati/" target="_blank" rel="noopener noreferrer" className="text-gray-500 hover:text-[#4ade80] transition-colors">
                      <Linkedin className="w-5 h-5" />
                    </a>
                  </div>
                </div>
                <div>
                  <p className="text-gray-400 font-medium">Rex</p>
                  <div className="flex items-center gap-3 mt-2">
                    <a href="mailto:rexjordonez@gmail.com" className="text-gray-500 hover:text-[#4ade80] transition-colors">
                      <Mail className="w-5 h-5" />
                    </a>
                    <a href="https://www.linkedin.com/in/rex-ordonez/" target="_blank" rel="noopener noreferrer" className="text-gray-500 hover:text-[#4ade80] transition-colors">
                      <Linkedin className="w-5 h-5" />
                    </a>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Powered By */}
            <div>
              <h3 className="text-[#4ade80] text-xl font-light mb-4">Powered By</h3>
              <p className="text-gray-400 font-medium">Windborne Systems</p>
            </div>

            {/* Easter Egg */}
            <div>
              <Link 
                to="/game" 
                className="group flex items-center gap-2 text-gray-500 hover:text-[#4ade80] transition-colors"
              >
                <Egg className="w-5 h-5" />
                <span className="opacity-0 group-hover:opacity-100 transition-opacity">Find me</span>
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}