import React from 'react';
import { Navigation2, Bomb, Wind, Ruler, Gauge, X } from 'lucide-react';
import { useBalloonStore } from '../store';

export default function BalloonCarousel() {
  const { 
    balloons, 
    selectedBalloonId, 
    animatingBalloonId,
    setSelectedBalloonId,
    setAnimatingBalloonId 
  } = useBalloonStore();

  return (
    <div className="bg-[#181818] p-3 border-t border-[#2a2a2a]">
      <div className="flex gap-4 overflow-x-auto">
        {balloons.map((balloon) => (
          <div
            key={balloon.id}
            className={`relative flex-shrink-0 w-64 p-4 rounded-lg cursor-pointer transition-all ${
              selectedBalloonId === balloon.id
                ? 'bg-[#313D3D] border-2 border-emerald-500'
                : 'bg-[#1e1e1e] hover:bg-[#252525] border border-[#2a2a2a]'
            }`}
            onClick={() => {
              setSelectedBalloonId(balloon.id);
            }}
          >
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <Navigation2 
                  className={`${animatingBalloonId === balloon.id ? 'text-red-400' : 'text-emerald-400'}`} 
                  size={20} 
                />
                <h3 className="font-bold text-white">{balloon.name}</h3>
              </div>
              <button
                className={`p-2 rounded-full transition-all
                  ${animatingBalloonId === balloon.id 
                    ? 'bg-red-500 text-white' 
                    : 'bg-[#2a2a2a] hover:bg-red-500 text-gray-400 hover:text-white'}`}
                onClick={(e) => {
                  e.stopPropagation();
                  setAnimatingBalloonId(balloon.id);
                }}
              >
                <Bomb size={16} />
              </button>
            </div>
            <div className="text-sm text-gray-300 space-y-2">
              <div className="flex items-center gap-2">
                <Ruler className="text-emerald-400" size={16} />
                <p>Altitude: {Math.round(balloon.altitude).toLocaleString()}ft</p>
              </div>
              <div className="flex items-center gap-2">
                <Gauge className="text-emerald-400" size={16} />
                <p>Speed: {Math.round(balloon.speed)}mph</p>
              </div>
              <div className="flex items-center gap-2">
                <Wind className="text-emerald-400" size={16} />
                <p>Status: {animatingBalloonId === balloon.id ? 'Tracking' : 'Idle'}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}