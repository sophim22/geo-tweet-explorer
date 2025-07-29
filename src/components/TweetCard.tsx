import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MapPin, Calendar, User } from "lucide-react";

interface Tweet {
  id: string;
  text: string;
  username: string;
  displayName: string;
  timestamp: string;
  location?: {
    coordinates?: [number, number];
    placeName?: string;
  };
  profileImage?: string;
}

interface TweetCardProps {
  tweet: Tweet;
  onLocationClick?: (coordinates: [number, number]) => void;
}

const TweetCard = ({ tweet, onLocationClick }: TweetCardProps) => {
  const handleLocationClick = () => {
    if (tweet.location?.coordinates && onLocationClick) {
      onLocationClick(tweet.location.coordinates);
    }
  };

  return (
    <Card className="bg-tweet-card hover:bg-tweet-card-hover transition-all duration-300 p-4 border border-border/50 hover:border-primary/30 hover:shadow-lg group">
      <div className="space-y-3">
        {/* User Info */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center">
            {tweet.profileImage ? (
              <img 
                src={tweet.profileImage} 
                alt={tweet.displayName}
                className="w-full h-full rounded-full object-cover"
              />
            ) : (
              <User className="w-5 h-5 text-primary-foreground" />
            )}
          </div>
          <div>
            <h3 className="font-semibold text-foreground text-sm">{tweet.displayName}</h3>
            <p className="text-muted-foreground text-xs">@{tweet.username}</p>
          </div>
        </div>

        {/* Tweet Text */}
        <p className="text-foreground text-sm leading-relaxed">{tweet.text}</p>

        {/* Metadata */}
        <div className="flex items-center gap-4 text-xs text-muted-foreground">
          <div className="flex items-center gap-1">
            <Calendar className="w-3 h-3" />
            <span>{tweet.timestamp}</span>
          </div>
          
          {tweet.location && (
            <div 
              className="flex items-center gap-1 cursor-pointer hover:text-primary transition-colors"
              onClick={handleLocationClick}
            >
              <MapPin className="w-3 h-3" />
              <span>{tweet.location.placeName || 'Coordinates'}</span>
            </div>
          )}
        </div>

        {/* Location Badge */}
        {tweet.location && (
          <Badge 
            variant="secondary" 
            className="bg-primary/10 text-primary hover:bg-primary/20 cursor-pointer"
            onClick={handleLocationClick}
          >
            <MapPin className="w-3 h-3 mr-1" />
            View on Map
          </Badge>
        )}
      </div>
    </Card>
  );
};

export default TweetCard;