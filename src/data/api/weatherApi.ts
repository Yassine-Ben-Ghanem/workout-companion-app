import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import env from '../../config/env';

export interface WeatherData {
  location: string;
  temperature: number;
  condition: string;
  icon: string;
  humidity: number;
  windSpeed: number;
  date: string;
  forecast: WeatherForecast[];
}

export interface WeatherForecast {
  date: string;
  temperature: number;
  condition: string;
  icon: string;
}

interface WeatherApiResponse {
  location: {
    name: string;
    region: string;
    country: string;
    localtime: string;
  };
  current: {
    temp_c: number;
    condition: {
      text: string;
      icon: string;
    };
    humidity: number;
    wind_kph: number;
  };
}

interface ForecastApiResponse {
  location: {
    name: string;
    region: string;
    country: string;
  };
  current: {
    temp_c: number;
    condition: {
      text: string;
      icon: string;
    };
    humidity: number;
    wind_kph: number;
  };
  forecast: {
    forecastday: Array<{
      date: string;
      day: {
        avgtemp_c: number;
        condition: {
          text: string;
          icon: string;
        };
      };
    }>;
  };
}

export const weatherApi = createApi({
  reducerPath: 'weatherApi',
  baseQuery: fetchBaseQuery({
    baseUrl: env.WEATHER_API_URL,
    prepareHeaders: headers => {
      return headers;
    },
  }),
  tagTypes: ['Weather'],
  endpoints: builder => ({
    getCurrentWeather: builder.query<WeatherData, string>({
      query: location => ({
        url: '/current.json',
        params: {
          key: env.WEATHER_API_KEY,
          q: location,
        },
      }),
      transformResponse: (response: WeatherApiResponse): WeatherData => {
        return {
          location: response.location.name,
          temperature: response.current.temp_c,
          condition: response.current.condition.text,
          icon: response.current.condition.icon,
          humidity: response.current.humidity,
          windSpeed: response.current.wind_kph,
          date: response.location.localtime,
          forecast: [],
        };
      },
      providesTags: (_, __, location) => [{ type: 'Weather', id: location }],
    }),

    getWeatherForecast: builder.query<WeatherData, string>({
      query: location => ({
        url: '/forecast.json',
        params: {
          key: env.WEATHER_API_KEY,
          q: location,
          days: 5,
        },
      }),
      transformResponse: (response: ForecastApiResponse): WeatherData => {
        return {
          location: response.location.name,
          temperature: response.current.temp_c,
          condition: response.current.condition.text,
          icon: response.current.condition.icon,
          humidity: response.current.humidity,
          windSpeed: response.current.wind_kph,
          date: new Date().toISOString(),
          forecast: response.forecast.forecastday.map(day => ({
            date: day.date,
            temperature: day.day.avgtemp_c,
            condition: day.day.condition.text,
            icon: day.day.condition.icon,
          })),
        };
      },
      providesTags: (_, __, location) => [
        { type: 'Weather', id: `forecast-${location}` },
      ],
    }),
  }),
});

export const { useGetCurrentWeatherQuery, useGetWeatherForecastQuery } =
  weatherApi;
