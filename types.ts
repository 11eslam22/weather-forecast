export interface DailyForecast {
  day: string;
  high: number;
  low: number;
  condition: string;
  icon: string; // e.g., 'sun', 'cloud', 'rain', 'snow'
}

export interface CurrentWeather {
  temp: number;
  condition: string;
  humidity: number;
  windSpeed: number;
  feelsLike: number;
  location: string;
  description: string;
  icon: string;
}

export interface WeatherData {
  current: CurrentWeather;
  forecast: DailyForecast[];
  pythonCode: string; // The generated python code
}

export enum ViewMode {
  FORECAST = 'FORECAST',
  CODE = 'CODE',
}