import React, { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { MapPin, Settings } from "lucide-react";

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
}

interface MapContainerProps {
  tweets: Tweet[];
  onTweetClick?: (tweet: Tweet) => void;
  centerCoordinates?: [number, number];
}

const MapContainer = ({ tweets, onTweetClick, centerCoordinates }: MapContainerProps) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const [mapboxToken, setMapboxToken] = useState<string>('');
  const [isTokenSet, setIsTokenSet] = useState(false);
  const markersRef = useRef<mapboxgl.Marker[]>([]);

  // Initialize map when token is set
  useEffect(() => {
    if (!mapContainer.current || !isTokenSet || !mapboxToken) return;

    mapboxgl.accessToken = mapboxToken;
    
    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/dark-v11',
      projection: 'globe' as any,
      zoom: 2,
      center: [0, 20],
      pitch: 0,
    });

    // Add navigation controls
    map.current.addControl(
      new mapboxgl.NavigationControl({
        visualizePitch: true,
      }),
      'top-right'
    );

    // Add atmosphere effects
    map.current.on('style.load', () => {
      if (map.current) {
        map.current.setFog({
          color: 'rgb(15, 23, 42)',
          'high-color': 'rgb(30, 41, 59)',
          'horizon-blend': 0.1,
        });
      }
    });

    // Cleanup
    return () => {
      markersRef.current.forEach(marker => marker.remove());
      markersRef.current = [];
      map.current?.remove();
    };
  }, [isTokenSet, mapboxToken]);

  // Update markers when tweets change
  useEffect(() => {
    if (!map.current || !isTokenSet) return;

    // Clear existing markers
    markersRef.current.forEach(marker => marker.remove());
    markersRef.current = [];

    // Add new markers for tweets with location
    tweets.forEach(tweet => {
      if (tweet.location?.coordinates) {
        const [lng, lat] = tweet.location.coordinates;
        
        // Create custom marker element
        const markerElement = document.createElement('div');
        markerElement.className = 'tweet-marker';
        markerElement.style.cssText = `
          width: 12px;
          height: 12px;
          background: linear-gradient(135deg, hsl(200 85% 55%), hsl(180 100% 50%));
          border: 2px solid white;
          border-radius: 50%;
          cursor: pointer;
          box-shadow: 0 0 10px hsl(200 85% 55% / 0.6);
          transition: all 0.3s ease;
        `;

        // Add hover effects
        markerElement.addEventListener('mouseenter', () => {
          markerElement.style.transform = 'scale(1.5)';
          markerElement.style.boxShadow = '0 0 20px hsl(200 85% 55% / 0.8)';
        });

        markerElement.addEventListener('mouseleave', () => {
          markerElement.style.transform = 'scale(1)';
          markerElement.style.boxShadow = '0 0 10px hsl(200 85% 55% / 0.6)';
        });

        const marker = new mapboxgl.Marker(markerElement)
          .setLngLat([lng, lat])
          .addTo(map.current!);

        // Add popup with tweet preview
        const popup = new mapboxgl.Popup({
          offset: 15,
          className: 'tweet-popup'
        }).setHTML(`
          <div class="p-3 bg-tweet-card rounded-lg border border-border/50 max-w-xs">
            <div class="font-semibold text-sm text-foreground mb-1">@${tweet.username}</div>
            <div class="text-xs text-muted-foreground mb-2">${tweet.timestamp}</div>
            <div class="text-sm text-foreground leading-relaxed">${tweet.text.substring(0, 100)}${tweet.text.length > 100 ? '...' : ''}</div>
            ${tweet.location.placeName ? `<div class="text-xs text-primary mt-2 flex items-center gap-1"><svg class="w-3 h-3" fill="currentColor" viewBox="0 0 20 20"><path d="M10 12a2 2 0 100-4 2 2 0 000 4z"/><path fill-rule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clip-rule="evenodd"/></svg>${tweet.location.placeName}</div>` : ''}
          </div>
        `);

        marker.setPopup(popup);

        // Handle click
        markerElement.addEventListener('click', () => {
          if (onTweetClick) {
            onTweetClick(tweet);
          }
        });

        markersRef.current.push(marker);
      }
    });
  }, [tweets, isTokenSet, onTweetClick]);

  // Center map on specific coordinates
  useEffect(() => {
    if (map.current && centerCoordinates && isTokenSet) {
      map.current.flyTo({
        center: centerCoordinates,
        zoom: 10,
        duration: 2000
      });
    }
  }, [centerCoordinates, isTokenSet]);

  const handleTokenSubmit = () => {
    if (mapboxToken.trim()) {
      setIsTokenSet(true);
    }
  };

  if (!isTokenSet) {
    return (
      <Card className="p-8 text-center space-y-4 bg-card border border-border/50">
        <div className="w-16 h-16 mx-auto bg-gradient-to-br from-primary to-accent rounded-full flex items-center justify-center mb-4">
          <MapPin className="w-8 h-8 text-primary-foreground" />
        </div>
        <h3 className="text-xl font-semibold text-foreground">Configure Map</h3>
        <p className="text-muted-foreground max-w-md mx-auto">
          Enter your Mapbox public token to display the interactive map with geolocated tweets.
        </p>
        <div className="max-w-md mx-auto space-y-3">
          <Input
            type="text"
            placeholder="pk.eyJ1IjoieW91cnVzZXJuYW1lIiwi..."
            value={mapboxToken}
            onChange={(e) => setMapboxToken(e.target.value)}
            className="bg-secondary border-border/50"
          />
          <Button 
            onClick={handleTokenSubmit}
            className="w-full bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90 text-primary-foreground"
          >
            <Settings className="w-4 h-4 mr-2" />
            Initialize Map
          </Button>
        </div>
        <p className="text-xs text-muted-foreground">
          Get your free token at{' '}
          <a href="https://mapbox.com/" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
            mapbox.com
          </a>
        </p>
      </Card>
    );
  }

  return (
    <div className="relative w-full h-full rounded-lg overflow-hidden">
      <div ref={mapContainer} className="absolute inset-0" />
      <div className="absolute inset-0 pointer-events-none bg-gradient-to-b from-transparent to-background/5 rounded-lg" />
      
      {/* Tweet count overlay */}
      {tweets.length > 0 && (
        <div className="absolute top-4 left-4 bg-card/90 backdrop-blur-sm border border-border/50 rounded-lg px-3 py-2 pointer-events-none">
          <div className="text-sm font-medium text-foreground">
            {tweets.filter(t => t.location?.coordinates).length} Geolocated Tweets
          </div>
        </div>
      )}
    </div>
  );
};

export default MapContainer;