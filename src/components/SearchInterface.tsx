import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Search, Hash, MapPin, Calendar, Users } from "lucide-react";

interface SearchInterfaceProps {
  onSearch: (query: string, filters: SearchFilters) => void;
  isLoading?: boolean;
}

interface SearchFilters {
  hasLocation: boolean;
  dateRange: string;
  language: string;
}

const SearchInterface = ({ onSearch, isLoading }: SearchInterfaceProps) => {
  const [query, setQuery] = useState('');
  const [filters, setFilters] = useState<SearchFilters>({
    hasLocation: true,
    dateRange: '7d',
    language: 'en'
  });

  const handleSearch = () => {
    if (query.trim()) {
      onSearch(query, filters);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  const popularQueries = [
    { text: 'wildfire', icon: '🔥' },
    { text: 'earthquake', icon: '🌍' },
    { text: 'flooding', icon: '🌊' },
    { text: 'storm', icon: '⛈️' },
    { text: 'emergency', icon: '🚨' }
  ];

  return (
    <Card className="p-6 bg-card border border-border/50 space-y-6">
      <div className="space-y-4">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 bg-gradient-to-br from-primary to-accent rounded-full flex items-center justify-center">
            <Search className="w-5 h-5 text-primary-foreground" />
          </div>
          <div>
            <h2 className="text-xl font-semibold text-foreground">Search Geolocated Tweets</h2>
            <p className="text-sm text-muted-foreground">Find tweets with location data</p>
          </div>
        </div>

        {/* Search Input */}
        <div className="relative">
          <Hash className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            type="text"
            placeholder="Search keywords or hashtags (e.g., #earthquake, wildfire)"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyPress={handleKeyPress}
            className="pl-10 bg-secondary border-border/50 focus:border-primary/50 focus:ring-primary/20"
          />
        </div>

        {/* Popular Queries */}
        <div className="space-y-2">
          <p className="text-sm text-muted-foreground">Popular searches:</p>
          <div className="flex flex-wrap gap-2">
            {popularQueries.map((item, index) => (
              <Badge
                key={index}
                variant="secondary"
                className="cursor-pointer hover:bg-primary/20 hover:text-primary transition-colors"
                onClick={() => setQuery(item.text)}
              >
                <span className="mr-1">{item.icon}</span>
                {item.text}
              </Badge>
            ))}
          </div>
        </div>

        {/* Filters */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 bg-secondary/50 rounded-lg">
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground flex items-center gap-2">
              <MapPin className="w-4 h-4" />
              Location
            </label>
            <select
              value={filters.hasLocation ? 'true' : 'false'}
              onChange={(e) => setFilters(prev => ({ ...prev, hasLocation: e.target.value === 'true' }))}
              className="w-full p-2 bg-background border border-border/50 rounded-md text-sm"
            >
              <option value="true">Geolocated only</option>
              <option value="false">All tweets</option>
            </select>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              Time Range
            </label>
            <select
              value={filters.dateRange}
              onChange={(e) => setFilters(prev => ({ ...prev, dateRange: e.target.value }))}
              className="w-full p-2 bg-background border border-border/50 rounded-md text-sm"
            >
              <option value="1d">Last 24 hours</option>
              <option value="3d">Last 3 days</option>
              <option value="7d">Last week</option>
              <option value="30d">Last month</option>
            </select>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground flex items-center gap-2">
              <Users className="w-4 h-4" />
              Language
            </label>
            <select
              value={filters.language}
              onChange={(e) => setFilters(prev => ({ ...prev, language: e.target.value }))}
              className="w-full p-2 bg-background border border-border/50 rounded-md text-sm"
            >
              <option value="en">English</option>
              <option value="es">Spanish</option>
              <option value="fr">French</option>
              <option value="de">German</option>
              <option value="any">Any language</option>
            </select>
          </div>
        </div>

        {/* Search Button */}
        <Button
          onClick={handleSearch}
          disabled={!query.trim() || isLoading}
          className="w-full bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90 text-primary-foreground font-medium"
        >
          {isLoading ? (
            <>
              <div className="w-4 h-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin mr-2" />
              Searching...
            </>
          ) : (
            <>
              <Search className="w-4 h-4 mr-2" />
              Search Tweets
            </>
          )}
        </Button>
      </div>

      {/* Info Banner */}
      <div className="bg-primary/10 border border-primary/20 rounded-lg p-4">
        <p className="text-sm text-primary">
          <strong>Note:</strong> This demo uses mock data. Connect to Twitter API v2 via Supabase for real tweet analysis.
        </p>
      </div>
    </Card>
  );
};

export default SearchInterface;