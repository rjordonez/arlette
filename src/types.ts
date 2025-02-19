export interface Balloon {
  id: string;
  position: {
    lat: number;
    lng: number;
  };
  altitude: number;
  speed: number;
  trajectory: {
    lat: number;
    lng: number;
  };
  isAnimating: boolean;
}

export interface BalloonDetails {
  altitude: number;
  distanceTraveled: number;
  timeRemaining: number;
}