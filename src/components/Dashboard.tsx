import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import SearchInterface from "./SearchInterface";
import MapContainer from "./MapContainer";
import TweetCard from "./TweetCard";
import { BarChart3, Globe, MessageSquare, MapPin, Download, RefreshCw, Search } from "lucide-react";
import heroImage from "@/assets/hero-bg.jpg";

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

interface SearchFilters {
  hasLocation: boolean;
  dateRange: string;
  language: string;
}

const Dashboard = () => {
  const [tweets, setTweets] = useState<Tweet[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [mapCenter, setMapCenter] = useState<[number, number] | undefined>();
  const [currentQuery, setCurrentQuery] = useState<string>('');

  // Mock data for demonstration
  const generateMockTweets = (query: string): Tweet[] => {
    const mockTweets: Tweet[] = [
      {
        id: '1',
        text: `Just witnessed a massive ${query} event here in California. The emergency services are responding quickly. Stay safe everyone! #${query} #California`,
        username: 'safetywatch',
        displayName: 'Safety Watch',
        timestamp: '2 hours ago',
        location: {
          coordinates: [-118.2437, 34.0522],
          placeName: 'Los Angeles, CA'
        }
      },
      {
        id: '2',
        text: `Breaking: ${query} reported in the downtown area. Evacuation procedures are being followed. Local authorities are on scene.`,
        username: 'newsreporter',
        displayName: 'Local News Reporter',
        timestamp: '45 minutes ago',
        location: {
          coordinates: [-74.0059, 40.7128],
          placeName: 'New York, NY'
        }
      },
      {
        id: '3',
        text: `Update on the ${query} situation: Emergency shelters have been set up at the community center. #EmergencyResponse`,
        username: 'emergencyservices',
        displayName: 'Emergency Services',
        timestamp: '1 hour ago',
        location: {
          coordinates: [-87.6298, 41.8781],
          placeName: 'Chicago, IL'
        }
      },
      {
        id: '4',
        text: `Checking in from the field covering the ${query} response. Amazing coordination between first responders. #Journalism`,
        username: 'fieldreporter',
        displayName: 'Field Reporter',
        timestamp: '30 minutes ago',
        location: {
          coordinates: [-122.4194, 37.7749],
          placeName: 'San Francisco, CA'
        }
      },
      {
        id: '5',
        text: `Community coming together to help those affected by the ${query}. Proud of our resilience! #CommunitySupport`,
        username: 'volunteer',
        displayName: 'Community Volunteer',
        timestamp: '15 minutes ago',
        location: {
          coordinates: [-95.3698, 29.7604],
          placeName: 'Houston, TX'
        }
      }
    ];

    return mockTweets;
  };

  const handleSearch = async (query: string, filters: SearchFilters) => {
    setIsLoading(true);
    setCurrentQuery(query);
    
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    const mockResults = generateMockTweets(query);
    setTweets(mockResults);
    setIsLoading(false);
  };

  const handleTweetLocationClick = (coordinates: [number, number]) => {
    setMapCenter(coordinates);
  };

  const handleTweetClick = (tweet: Tweet) => {
    if (tweet.location?.coordinates) {
      setMapCenter(tweet.location.coordinates);
    }
  };

  const stats = {
    totalTweets: tweets.length,
    geolocatedTweets: tweets.filter(t => t.location?.coordinates).length,
    uniqueLocations: new Set(tweets.map(t => t.location?.placeName).filter(Boolean)).size,
    timeRange: '24h'
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <div 
        className="relative h-64 bg-cover bg-center"
        style={{ backgroundImage: `url(${heroImage})` }}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-background/90 to-background/70" />
        <div className="relative container mx-auto px-6 h-full flex items-center">
          <div className="space-y-4 max-w-2xl">
            <h1 className="text-4xl md:text-5xl font-bold text-foreground">
              Twitter Geolocation Analytics
            </h1>
            <p className="text-lg text-muted-foreground">
              Analyze and visualize geolocated tweets in real-time with advanced mapping and filtering capabilities.
            </p>
            <div className="flex items-center gap-4">
              <Badge className="bg-primary text-primary-foreground">
                <Globe className="w-3 h-3 mr-1" />
                Real-time Analysis
              </Badge>
              <Badge className="bg-accent text-accent-foreground">
                <MapPin className="w-3 h-3 mr-1" />
                Interactive Maps
              </Badge>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-6 py-8">
        {/* Stats Overview */}
        {tweets.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
            <Card className="p-4 bg-card border border-border/50">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-primary to-accent rounded-full flex items-center justify-center">
                  <MessageSquare className="w-5 h-5 text-primary-foreground" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-foreground">{stats.totalTweets}</p>
                  <p className="text-sm text-muted-foreground">Total Tweets</p>
                </div>
              </div>
            </Card>
            
            <Card className="p-4 bg-card border border-border/50">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-accent to-primary rounded-full flex items-center justify-center">
                  <MapPin className="w-5 h-5 text-primary-foreground" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-foreground">{stats.geolocatedTweets}</p>
                  <p className="text-sm text-muted-foreground">Geolocated</p>
                </div>
              </div>
            </Card>
            
            <Card className="p-4 bg-card border border-border/50">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-primary to-accent rounded-full flex items-center justify-center">
                  <Globe className="w-5 h-5 text-primary-foreground" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-foreground">{stats.uniqueLocations}</p>
                  <p className="text-sm text-muted-foreground">Locations</p>
                </div>
              </div>
            </Card>
            
            <Card className="p-4 bg-card border border-border/50">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-accent to-primary rounded-full flex items-center justify-center">
                  <BarChart3 className="w-5 h-5 text-primary-foreground" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-foreground">{stats.timeRange}</p>
                  <p className="text-sm text-muted-foreground">Time Range</p>
                </div>
              </div>
            </Card>
          </div>
        )}

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Search Interface */}
          <div className="lg:col-span-1 space-y-6">
            <SearchInterface onSearch={handleSearch} isLoading={isLoading} />
            
            {/* Action Buttons */}
            {tweets.length > 0 && (
              <Card className="p-4 bg-card border border-border/50 space-y-3">
                <h3 className="font-semibold text-foreground">Export & Actions</h3>
                <div className="grid grid-cols-2 gap-2">
                  <Button variant="outline" size="sm" className="text-xs">
                    <Download className="w-3 h-3 mr-1" />
                    Export CSV
                  </Button>
                  <Button variant="outline" size="sm" className="text-xs">
                    <RefreshCw className="w-3 h-3 mr-1" />
                    Refresh Data
                  </Button>
                </div>
              </Card>
            )}
          </div>

          {/* Map and Results */}
          <div className="lg:col-span-2 space-y-6">
            {/* Map Container */}
            <Card className="p-0 bg-card border border-border/50 overflow-hidden">
              <div className="h-96">
                <MapContainer 
                  tweets={tweets}
                  onTweetClick={handleTweetClick}
                  centerCoordinates={mapCenter}
                />
              </div>
            </Card>

            {/* Tweet Results */}
            {tweets.length > 0 && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-foreground">
                    Results for "{currentQuery}"
                  </h3>
                  <Badge variant="secondary">
                    {tweets.length} tweets found
                  </Badge>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-h-96 overflow-y-auto">
                  {tweets.map((tweet) => (
                    <TweetCard
                      key={tweet.id}
                      tweet={tweet}
                      onLocationClick={handleTweetLocationClick}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Empty State */}
            {tweets.length === 0 && !isLoading && (
              <Card className="p-12 text-center bg-card border border-border/50">
                <div className="w-16 h-16 mx-auto bg-gradient-to-br from-primary to-accent rounded-full flex items-center justify-center mb-4">
                  <Search className="w-8 h-8 text-primary-foreground" />
                </div>
                <h3 className="text-xl font-semibold text-foreground mb-2">Ready to Analyze</h3>
                <p className="text-muted-foreground max-w-md mx-auto">
                  Enter a keyword or hashtag to search for geolocated tweets and visualize them on the interactive map.
                </p>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;