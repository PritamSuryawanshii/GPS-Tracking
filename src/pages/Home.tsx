
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { isAuthenticated } from "@/utils/auth";
import Navbar from "@/components/Navbar";
import Map from "@/components/Map";
import LocationCard from "@/components/LocationCard";
import { Button } from "@/components/ui/button";
import { Location, LocationHistory, initialLocationHistory, startLocationTracking } from "@/utils/locationGenerator";
import { RefreshCw, Play, Pause, History } from "lucide-react";
import { toast } from "@/components/ui/use-toast";

const Home = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [isTracking, setIsTracking] = useState(false);
  const [locationHistory, setLocationHistory] = useState<LocationHistory>(initialLocationHistory);

  // Redirect if not logged in
  useEffect(() => {
    if (!isAuthenticated()) {
      navigate("/login");
    }
  }, [navigate]);

  // Initial load effect
  useEffect(() => {
    const loadInitialData = async () => {
      setIsLoading(true);
      // Simulate loading delay
      await new Promise((resolve) => setTimeout(resolve, 1500));
      setLocationHistory({
        ...initialLocationHistory,
        currentLocation: initialLocationHistory.locations[initialLocationHistory.locations.length - 1],
      });
      setIsLoading(false);
    };

    loadInitialData();
  }, []);

  // Tracking effect
  useEffect(() => {
    let stopTracking: (() => void) | null = null;

    if (isTracking) {
      stopTracking = startLocationTracking((newLocation: Location) => {
        setLocationHistory((prev) => ({
          locations: [...prev.locations, newLocation],
          currentLocation: newLocation,
        }));
        
        // Only show toast every 3rd update to avoid spam
        if (Math.random() > 0.7) {
          toast({
            title: "Location updated",
            description: `New coordinates: ${newLocation.latitude.toFixed(4)}, ${newLocation.longitude.toFixed(4)}`,
            duration: 3000,
          });
        }
      });
    }

    return () => {
      if (stopTracking) {
        stopTracking();
      }
    };
  }, [isTracking]);

  const handleRefresh = async () => {
    setIsLoading(true);
    // Simulate refresh delay
    await new Promise((resolve) => setTimeout(resolve, 800));
    
    setLocationHistory({
      ...initialLocationHistory,
      currentLocation: initialLocationHistory.locations[initialLocationHistory.locations.length - 1],
    });
    
    setIsLoading(false);
    
    toast({
      title: "Data refreshed",
      description: "Location data has been updated",
    });
  };

  const toggleTracking = () => {
    const newTrackingState = !isTracking;
    setIsTracking(newTrackingState);
    
    toast({
      title: newTrackingState ? "Tracking started" : "Tracking paused",
      description: newTrackingState 
        ? "Your location is now being tracked in real-time" 
        : "Location tracking has been paused",
    });
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main className="container mx-auto px-4 pt-20 pb-8">
        <div className="flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-4 mt-4 animate-fade-in">
          {/* Map Section */}
          <div className="w-full md:w-3/4 h-[500px] md:h-[600px] rounded-lg overflow-hidden">
            <Map 
              locations={locationHistory.locations} 
              currentLocation={locationHistory.currentLocation}
              isLoading={isLoading}
            />
          </div>

          {/* Info Section */}
          <div className="w-full md:w-1/4 space-y-4">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold flex items-center">
                <History className="h-5 w-5 mr-2 text-primary" />
                Tracking Data
              </h2>
              <div className="flex items-center space-x-2">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={handleRefresh}
                  disabled={isLoading}
                >
                  <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
                </Button>
                <Button
                  variant={isTracking ? "secondary" : "default"}
                  size="icon"
                  onClick={toggleTracking}
                  disabled={isLoading}
                  className={isTracking ? "bg-muted/80 hover:bg-muted" : ""}
                >
                  {isTracking ? (
                    <Pause className="h-4 w-4" />
                  ) : (
                    <Play className="h-4 w-4" />
                  )}
                </Button>
              </div>
            </div>

            <LocationCard 
              location={locationHistory.currentLocation} 
              isLoading={isLoading}
            />

            <div className="p-4 bg-muted/50 rounded-lg border border-muted">
              <p className="text-sm text-muted-foreground">
                {isTracking 
                  ? "Real-time tracking is active. Your location is being updated every few seconds."
                  : "Tracking is paused. Click the play button to start real-time updates."}
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Home;
