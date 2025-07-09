declare module 'react-native-config' {
  interface ConfigInterface {
    API_URL: string;
    WEATHER_API_KEY: string;
    WEATHER_API_URL: string;
  }

  const Config: ConfigInterface;

  export default Config;
}
