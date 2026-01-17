
export interface User {
  name: string;
  farmName: string;
  location: string;
  isLoggedIn: boolean;
}

export interface HealthAlert {
  id: string;
  type: 'poop' | 'audio';
  severity: 'high' | 'medium';
  message: string;
  timestamp: number;
}

export interface FlockData {
  id: string;
  name: string;
  count: number;
  arrivalDate: string;
  currentDay: number;
  mortality: number;
  feedType: 'Starter' | 'Grower' | 'Finisher';
  weights: { day: number; weight: number }[];
  inventory: {
    feedBags: number;
    bagSizeKg: number;
  };
  completedTaskIds: string[];
  healthAlerts: HealthAlert[];
  environment?: {
    temp: number;
    humidity: number;
  };
}

export interface Task {
  id: string;
  day: number;
  title: string;
  description: string;
}

export interface MarketListing {
  id: string;
  farmerName: string;
  birdCount: number;
  weightAverage: number;
  location: string;
  pricePerKg: number;
  isOwnListing?: boolean;
}
