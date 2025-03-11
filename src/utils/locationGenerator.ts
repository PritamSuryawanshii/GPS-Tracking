
// Interfaces for location data
export interface Location {
  id: string;
  latitude: number;
  longitude: number;
  timestamp: Date;
  speed: number;
  altitude: number;
  heading: number;
  accuracy: number;
}

export interface LocationHistory {
  locations: Location[];
  currentLocation: Location | null;
}

// Generate a random location within a certain range of a center point
const generateRandomLocation = (
  centerLat = 37.7749,
  centerLng = -122.4194,
  radiusKm = 5
): Location => {
  // Earth's radius in kilometers
  const earthRadius = 6371;
  
  // Random distance within the radius
  const distance = Math.random() * radiusKm;
  
  // Random angle in radians
  const angle = Math.random() * Math.PI * 2;
  
  // Calculate new coordinates
  const latRad = centerLat * (Math.PI / 180);
  const lngRad = centerLng * (Math.PI / 180);
  
  const newLat = Math.asin(
    Math.sin(latRad) * Math.cos(distance / earthRadius) +
    Math.cos(latRad) * Math.sin(distance / earthRadius) * Math.cos(angle)
  );
  
  const newLng = lngRad + Math.atan2(
    Math.sin(angle) * Math.sin(distance / earthRadius) * Math.cos(latRad),
    Math.cos(distance / earthRadius) - Math.sin(latRad) * Math.sin(newLat)
  );
  
  // Convert back to degrees
  const newLatDeg = newLat * (180 / Math.PI);
  const newLngDeg = newLng * (180 / Math.PI);
  
  return {
    id: crypto.randomUUID(),
    latitude: newLatDeg,
    longitude: newLngDeg,
    timestamp: new Date(),
    speed: Math.floor(Math.random() * 100), // km/h
    altitude: Math.floor(Math.random() * 100) + 10, // meters
    heading: Math.floor(Math.random() * 360), // degrees
    accuracy: Math.floor(Math.random() * 20) + 5, // meters
  };
};

// Generate location path - a series of connected points
export const generateLocationPath = (
  numPoints = 10,
  centerLat = 37.7749,
  centerLng = -122.4194,
  radiusKm = 5
): Location[] => {
  const locations: Location[] = [];
  
  // Generate initial location
  let currentLat = centerLat;
  let currentLng = centerLng;
  
  for (let i = 0; i < numPoints; i++) {
    // Generate smaller incremental changes for a connected path
    const smallRadiusKm = 0.5; // Smaller radius for connected points
    const location = generateRandomLocation(currentLat, currentLng, smallRadiusKm);
    
    // Adjust timestamp to be sequential
    const timestamp = new Date();
    timestamp.setMinutes(timestamp.getMinutes() - (numPoints - i));
    location.timestamp = timestamp;
    
    locations.push(location);
    
    // Update current position for next point
    currentLat = location.latitude;
    currentLng = location.longitude;
  }
  
  // Sort by timestamp (oldest first)
  return locations.sort((a, b) => a.timestamp.getTime() - b.timestamp.getTime());
};

// Get a simulated current location
export const getCurrentLocation = (): Promise<Location> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(generateRandomLocation());
    }, 800);
  });
};

// Start tracking locations
export const startLocationTracking = (
  callback: (location: Location) => void,
  interval = 5000 // 5 seconds
): () => void => {
  // Initial location
  getCurrentLocation().then(callback);
  
  // Set interval for location updates
  const intervalId = setInterval(() => {
    getCurrentLocation().then(callback);
  }, interval);
  
  // Return function to stop tracking
  return () => clearInterval(intervalId);
};

// Initial location history
export const initialLocationHistory: LocationHistory = {
  locations: generateLocationPath(),
  currentLocation: null,
};
