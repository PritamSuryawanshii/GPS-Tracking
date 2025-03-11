
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Location } from "@/utils/locationGenerator";
import { ArrowUp, Compass, Gauge, MapPin, Mountain } from "lucide-react";

interface LocationCardProps {
  location: Location | null;
  isLoading?: boolean;
}

const formatDate = (date: Date) => {
  return new Intl.DateTimeFormat("en-US", {
    hour: "numeric",
    minute: "numeric",
    second: "numeric",
    hour12: true,
  }).format(date);
};

const LocationCard = ({ location, isLoading = false }: LocationCardProps) => {
  return (
    <Card className="overflow-hidden glass-panel transition-all duration-300 h-full">
      <CardHeader className="pb-2">
        <CardTitle className="text-xl flex items-center">
          <MapPin className="h-5 w-5 mr-2 text-primary" />
          <span>Location Data</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {isLoading ? (
          <div className="space-y-4">
            {[...Array(4)].map((_, index) => (
              <div key={index} className="flex items-center space-x-3">
                <div className="w-8 h-8 rounded-md bg-muted animate-pulse" />
                <div className="space-y-2">
                  <div className="h-4 w-24 bg-muted animate-pulse rounded" />
                  <div className="h-3 w-16 bg-muted animate-pulse rounded" />
                </div>
              </div>
            ))}
          </div>
        ) : !location ? (
          <div className="text-center text-muted-foreground py-4">
            <p>No location data available</p>
          </div>
        ) : (
          <div className="space-y-4 animate-fade-in">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <div className="text-xs font-medium text-muted-foreground">Latitude</div>
                <div className="font-medium">{location.latitude.toFixed(6)}°</div>
              </div>
              <div className="space-y-1">
                <div className="text-xs font-medium text-muted-foreground">Longitude</div>
                <div className="font-medium">{location.longitude.toFixed(6)}°</div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="flex items-center space-x-3 bg-muted/40 p-3 rounded-lg">
                <div className="w-8 h-8 rounded-md bg-primary/10 flex items-center justify-center text-primary">
                  <Gauge className="h-4 w-4" />
                </div>
                <div>
                  <div className="text-sm font-medium">{location.speed} km/h</div>
                  <div className="text-xs text-muted-foreground">Speed</div>
                </div>
              </div>
              <div className="flex items-center space-x-3 bg-muted/40 p-3 rounded-lg">
                <div className="w-8 h-8 rounded-md bg-primary/10 flex items-center justify-center text-primary">
                  <Compass className="h-4 w-4" />
                </div>
                <div>
                  <div className="text-sm font-medium">{location.heading}°</div>
                  <div className="text-xs text-muted-foreground">Heading</div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="flex items-center space-x-3 bg-muted/40 p-3 rounded-lg">
                <div className="w-8 h-8 rounded-md bg-primary/10 flex items-center justify-center text-primary">
                  <Mountain className="h-4 w-4" />
                </div>
                <div>
                  <div className="text-sm font-medium">{location.altitude}m</div>
                  <div className="text-xs text-muted-foreground">Altitude</div>
                </div>
              </div>
              <div className="flex items-center space-x-3 bg-muted/40 p-3 rounded-lg">
                <div className="w-8 h-8 rounded-md bg-primary/10 flex items-center justify-center text-primary">
                  <ArrowUp className="h-4 w-4" />
                </div>
                <div>
                  <div className="text-sm font-medium">±{location.accuracy}m</div>
                  <div className="text-xs text-muted-foreground">Accuracy</div>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between border-t pt-2 text-sm text-muted-foreground">
              <span>Last updated:</span>
              <span>{formatDate(location.timestamp)}</span>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default LocationCard;
