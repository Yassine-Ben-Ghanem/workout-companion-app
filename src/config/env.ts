import Config from 'react-native-config';

// Define the environment variables types
export interface Env {
  API_URL: string;
  WEATHER_API_KEY: string;
  WEATHER_API_URL: string;
}

// Create a strongly typed config object
const env: Env = {
  API_URL: Config.API_URL || '',
  WEATHER_API_KEY: Config.WEATHER_API_KEY || '',
  WEATHER_API_URL: Config.WEATHER_API_URL || 'https://api.weatherapi.com/v1',
};

export default env;
