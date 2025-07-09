declare module 'react-native-config' {
  interface ConfigInterface {
    API_URL: string;
    // Add other environment variables here as needed
  }

  const Config: ConfigInterface;

  export default Config;
}
