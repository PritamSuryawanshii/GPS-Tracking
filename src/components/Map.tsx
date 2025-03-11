
import { useEffect, useRef, useState } from "react";
import { Location } from "@/utils/locationGenerator";
import { 
  MapPin, 
  Navigation, 
  RefreshCw 
} from "lucide-react";

interface MapProps {
  locations: Location[];
  currentLocation: Location | null;
  isLoading?: boolean;
}

const Map = ({ locations, currentLocation, isLoading = false }: MapProps) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const [mapSize, setMapSize] = useState({ width: 0, height: 0 });

  // Update map dimensions on resize
  useEffect(() => {
    const handleResize = () => {
      if (mapRef.current) {
        setMapSize({
          width: mapRef.current.offsetWidth,
          height: mapRef.current.offsetHeight,
        });
      }
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Calculate the map coordinates
  const calculateCoordinates = (lat: number, lng: number): { x: number; y: number } => {
    // This is a simple projection for demo purposes
    // In a real app, you would use an actual mapping library
    
    // Center coordinates
    const centerLat = 37.7749;
    const centerLng = -122.4194;
    
    // Scale factors
    const latRange = 0.1;
    const lngRange = 0.1;
    
    // Calculate position as percentage of container
    const x = ((lng - centerLng + lngRange / 2) / lngRange) * mapSize.width;
    const y = ((centerLat + latRange / 2 - lat) / latRange) * mapSize.height;
    
    return { x, y };
  };

  // Draw path line between points
  const renderPathLine = () => {
    if (locations.length < 2) return null;
    
    // Create path data
    const pathData = locations.map((location, index) => {
      const { x, y } = calculateCoordinates(location.latitude, location.longitude);
      return `${index === 0 ? "M" : "L"} ${x} ${y}`;
    }).join(" ");
    
    return (
      <svg className="absolute inset-0 w-full h-full pointer-events-none">
        <path
          d={pathData}
          stroke="rgba(14, 165, 233, 0.7)"
          strokeWidth="2"
          fill="none"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeDasharray="5,5"
        />
      </svg>
    );
  };

  // Render location points
  const renderLocationPoints = () => {
    return locations.map((location, index) => {
      const { x, y } = calculateCoordinates(location.latitude, location.longitude);
      const isCurrent = currentLocation && location.id === currentLocation.id;
      const isLast = index === locations.length - 1;
      
      return (
        <div
          key={location.id}
          className={`absolute transition-all duration-500 ease-out ${
            isCurrent ? "z-20" : "z-10"
          }`}
          style={{
            transform: `translate(${x}px, ${y}px) translate(-50%, -50%)`,
          }}
        >
          <div
            className={`
              ${isCurrent || isLast ? "bg-primary" : "bg-primary/30"} 
              ${isCurrent ? "w-4 h-4 ring-4 ring-primary/30" : "w-3 h-3"}
              rounded-full shadow-md transition-all duration-300
              ${isCurrent && "track-pulse"}
            `}
          />
        </div>
      );
    });
  };

  // Render current location marker
  const renderCurrentLocation = () => {
    if (!currentLocation) return null;
    
    const { x, y } = calculateCoordinates(currentLocation.latitude, currentLocation.longitude);
    
    return (
      <div
        className="absolute z-30 transition-all duration-700 ease-out"
        style={{
          transform: `translate(${x}px, ${y}px) translate(-50%, -50%)`,
        }}
      >
        <div className="relative">
          <div className="absolute -inset-4 rounded-full bg-primary/10 animate-pulse" />
          <div className="absolute -inset-2 rounded-full bg-primary/20 animate-pulse" />
          <div className="w-6 h-6 rounded-full bg-primary shadow-lg flex items-center justify-center">
            <Navigation className="h-3 w-3 text-white" />
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="w-full h-full rounded-lg relative overflow-hidden bg-muted/30 backdrop-blur-sm">
      {/* Loading indicator */}
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center z-50 bg-background/50 backdrop-blur-sm">
          <div className="flex flex-col items-center space-y-4">
            <RefreshCw className="h-8 w-8 text-primary animate-spin" />
            <p className="text-sm text-muted-foreground">Loading map data...</p>
          </div>
        </div>
      )}

      {/* Map container */}
      <div
        ref={mapRef}
        className="w-full h-full relative map-gradient"
      >
        {/* Map visualization would go here in a real app */}
        <div className="absolute inset-0 grid grid-cols-8 grid-rows-8">
          {Array.from({ length: 64 }).map((_, index) => (
            <div 
              key={index} 
              className="border-[0.5px] border-primary/5"
            />
          ))}
        </div>

        {/* Path line between points */}
        {renderPathLine()}

        {/* Location points */}
        {renderLocationPoints()}

        {/* Current location */}
        {renderCurrentLocation()}

        {/* Map attribution */}
        <div className="absolute bottom-2 right-2 text-xs text-muted-foreground bg-background/80 px-2 py-1 rounded-md backdrop-blur-sm">
          <div className="flex items-center space-x-1">
            <MapPin className="h-3 w-3" />
            <span>Simulated GPS Data</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Map;
