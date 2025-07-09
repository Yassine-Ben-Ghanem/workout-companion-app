import { useEffect, useState } from 'react';
import { useGetCurrentWeatherQuery } from '../../data/api/weatherApi';

export interface WeatherData {
  location: string;
  temperature: number;
  condition: string;
  icon: string;
  humidity: number;
  windSpeed: number;
  date: string;
}

export const useWeatherService = (location: string) => {
  const [weather, setWeather] = useState<WeatherData | null>(null);

  const { data, error, isLoading, refetch } = useGetCurrentWeatherQuery(
    location,
    {
      skip: !location,
      pollingInterval: 300000, // Refresh every 5 minutes
    },
  );

  useEffect(() => {
    if (data) {
      setWeather(data);
    }
  }, [data]);

  return {
    weather,
    loading: isLoading,
    error: error ? 'Failed to fetch weather data' : null,
    refetch,
  };
};
