import { useState, useEffect, useCallback } from 'react';
import type { GeoLocation } from '@/types';

// Fallback IP-based geolocation
const fetchIPGeolocation = async (): Promise<Partial<GeoLocation>> => {
  try {
    const response = await fetch('https://ipapi.co/json/');
    if (!response.ok) throw new Error('IP geolocation failed');
    const data = await response.json();
    return {
      country: data.country_code,
      countryName: data.country_name,
      region: data.region,
      city: data.city,
      lat: data.latitude,
      lon: data.longitude,
      timezone: data.timezone,
    };
  } catch (error) {
    console.error('IP geolocation error:', error);
    return {};
  }
};

// Browser geolocation
const getBrowserGeolocation = (): Promise<GeolocationPosition> => {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(new Error('Geolocation not supported'));
      return;
    }
    navigator.geolocation.getCurrentPosition(resolve, reject, {
      enableHighAccuracy: false,
      timeout: 10000,
      maximumAge: 3600000,
    });
  });
};

// Reverse geocoding
const reverseGeocode = async (lat: number, lon: number): Promise<Partial<GeoLocation>> => {
  try {
    const response = await fetch(`https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${lat}&longitude=${lon}&localityLanguage=en`);
    if (!response.ok) throw new Error('Reverse geocoding failed');
    const data = await response.json();
    return {
      country: data.countryCode,
      countryName: data.countryName,
      region: data.principalSubdivision,
      city: data.city || data.locality,
    };
  } catch (error) {
    console.error('Reverse geocoding error:', error);
    return {};
  }
};

const STORAGE_KEY = 'zeeked_geo';
const CACHE_DURATION = 24 * 60 * 60 * 1000;

interface UseGeolocationReturn {
  location: GeoLocation | null;
  loading: boolean;
  error: string | null;
  refresh: () => Promise<void>;
}

export const useGeolocation = (): UseGeolocationReturn => {
  const [location, setLocation] = useState<GeoLocation | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const detectLocation = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const cached = localStorage.getItem(STORAGE_KEY);
      if (cached) {
        const { data, timestamp } = JSON.parse(cached);
        if (Date.now() - timestamp < CACHE_DURATION) {
          setLocation(data);
          setLoading(false);
          return;
        }
      }

      let geoData: Partial<GeoLocation> = {};

      try {
        const position = await getBrowserGeolocation();
        const { latitude, longitude } = position.coords;
        const reverseData = await reverseGeocode(latitude, longitude);
        geoData = {
          ...reverseData,
          lat: latitude,
          lon: longitude,
        };
      } catch (browserError) {
        console.log('Browser geolocation failed, falling back to IP');
        geoData = await fetchIPGeolocation();
      }

      if (!geoData.country) {
        geoData = {
          country: 'US',
          countryName: 'United States',
          region: 'California',
          city: 'San Francisco',
        };
      }

      const fullLocation: GeoLocation = {
        country: geoData.country || 'US',
        countryName: geoData.countryName || 'United States',
        region: geoData.region,
        city: geoData.city,
        lat: geoData.lat,
        lon: geoData.lon,
        timezone: geoData.timezone,
      };

      localStorage.setItem(STORAGE_KEY, JSON.stringify({
        data: fullLocation,
        timestamp: Date.now(),
      }));

      setLocation(fullLocation);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to detect location');
      setLocation({
        country: 'US',
        countryName: 'United States',
      });
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    detectLocation();
  }, [detectLocation]);

  const refresh = useCallback(async () => {
    localStorage.removeItem(STORAGE_KEY);
    await detectLocation();
  }, [detectLocation]);

  return { location, loading, error, refresh };
};

export default useGeolocation;
