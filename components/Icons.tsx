import React from 'react';
import { Sun, Cloud, CloudRain, CloudSnow, CloudLightning, CloudFog, Wind, Droplets, Thermometer } from 'lucide-react';

export const WeatherIcon = ({ type, className = "w-6 h-6" }: { type: string, className?: string }) => {
  switch (type.toLowerCase()) {
    case 'sun': return <Sun className={`${className} text-yellow-400`} />;
    case 'cloud': return <Cloud className={`${className} text-gray-400`} />;
    case 'rain': return <CloudRain className={`${className} text-blue-400`} />;
    case 'snow': return <CloudSnow className={`${className} text-white`} />;
    case 'storm': return <CloudLightning className={`${className} text-purple-400`} />;
    case 'mist': return <CloudFog className={`${className} text-gray-300`} />;
    default: return <Sun className={`${className} text-yellow-400`} />;
  }
};

export const HumidityIcon = ({ className = "w-5 h-5" }: { className?: string }) => <Droplets className={className} />;
export const WindIcon = ({ className = "w-5 h-5" }: { className?: string }) => <Wind className={className} />;
export const TempIcon = ({ className = "w-5 h-5" }: { className?: string }) => <Thermometer className={className} />;
