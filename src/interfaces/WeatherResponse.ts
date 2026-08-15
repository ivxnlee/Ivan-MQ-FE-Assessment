export interface WeatherResponse {
  name: string;
  dt: number;
  main: {
    temp: number;
    humidity: number;
  };
  sys: {
    country: string;
  };
  weather: {
    main: string;
    description: string;
    icon: string;
  }[];
}
