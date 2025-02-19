import { create } from 'zustand';

export interface Balloon {
  id: string;
  name: string;
  latitude: number;
  longitude: number;
  altitude: number;
  speed: number;
  direction: number;
}

interface BalloonStore {
  balloons: Balloon[];
  selectedBalloonId: string | null;
  animatingBalloonId: string | null;
  trajectories: Record<string, google.maps.LatLngLiteral>;
  setBalloons: (balloons: Balloon[]) => void;
  setSelectedBalloonId: (id: string | null) => void;
  setAnimatingBalloonId: (id: string | null) => void;
  setTrajectories: (trajectories: Record<string, google.maps.LatLngLiteral>) => void;
}

const generateInitialBalloons = (): Balloon[] => {
  return Array.from({ length: 10 }, (_, i) => ({
    id: `balloon-${i}`,
    name: `Weather Balloon ${i + 1}`,
    latitude: 39.8283 + (Math.random() - 0.5) * 20,
    longitude: -98.5795 + (Math.random() - 0.5) * 40,
    altitude: Math.random() * 30000 + 10000,
    speed: Math.random() * 50 + 20,
    direction: Math.random() * 360,
  }));
};

export const useBalloonStore = create<BalloonStore>((set) => ({
  balloons: generateInitialBalloons(),
  selectedBalloonId: null,
  animatingBalloonId: null,
  trajectories: {},
  setBalloons: (balloons) => set({ balloons }),
  setSelectedBalloonId: (id) => set({ selectedBalloonId: id }),
  setAnimatingBalloonId: (id) => set({ animatingBalloonId: id }),
  setTrajectories: (trajectories) => set({ trajectories }),
}));