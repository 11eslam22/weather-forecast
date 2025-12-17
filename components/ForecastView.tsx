import React from 'react';
import { WeatherData } from '../types';
import { WeatherIcon, HumidityIcon, WindIcon, TempIcon } from './Icons';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface ForecastViewProps {
  data: WeatherData;
}

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-slate-800 border border-slate-700 p-2 rounded shadow-xl text-xs">
        <p className="font-bold text-slate-200 mb-1">{label}</p>
        <p className="text-yellow-400">High: {payload[0].value}°C</p>
        <p className="text-blue-400">Low: {payload[1].value}°C</p>
      </div>
    );
  }
  return null;
};

export const ForecastView: React.FC<ForecastViewProps> = ({ data }) => {
  const { current, forecast } = data;

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      
      {/* Current Weather Card */}
      <div className="bg-gradient-to-br from-blue-600 to-blue-800 rounded-2xl p-6 md:p-10 shadow-lg text-white relative overflow-hidden">
        <div className="absolute top-0 right-0 -mt-10 -mr-10 w-40 h-40 bg-white opacity-10 rounded-full blur-3xl pointer-events-none"></div>
        
        <div className="flex flex-col md:flex-row justify-between items-center z-10 relative">
          <div className="text-center md:text-left mb-6 md:mb-0">
            <h2 className="text-3xl font-bold mb-1">{current.location}</h2>
            <p className="text-blue-100 text-lg capitalize">{current.description}</p>
            <div className="mt-6 flex items-center justify-center md:justify-start">
              <span className="text-7xl font-bold tracking-tighter">{Math.round(current.temp)}°</span>
              <div className="ml-6">
                <WeatherIcon type={current.icon} className="w-16 h-16" />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 md:gap-8 bg-white/10 p-4 rounded-xl backdrop-blur-sm">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-white/20 rounded-full"><HumidityIcon className="text-blue-200" /></div>
              <div>
                <p className="text-xs text-blue-200">Humidity</p>
                <p className="font-semibold">{current.humidity}%</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-white/20 rounded-full"><WindIcon className="text-blue-200" /></div>
              <div>
                <p className="text-xs text-blue-200">Wind</p>
                <p className="font-semibold">{current.windSpeed} km/h</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-white/20 rounded-full"><TempIcon className="text-blue-200" /></div>
              <div>
                <p className="text-xs text-blue-200">Feels Like</p>
                <p className="font-semibold">{Math.round(current.feelsLike)}°</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
               <div className="p-2 bg-white/20 rounded-full"><WeatherIcon type={current.icon} className="w-5 h-5 text-blue-200" /></div>
               <div>
                <p className="text-xs text-blue-200">Condition</p>
                <p className="font-semibold truncate max-w-[80px]">{current.condition}</p>
               </div>
            </div>
          </div>
        </div>
      </div>

      {/* Chart Section */}
      <div className="bg-slate-800 rounded-2xl p-6 shadow-lg border border-slate-700">
        <h3 className="text-lg font-semibold text-slate-200 mb-4">Temperature Trend (7 Days)</h3>
        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={forecast} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="colorHigh" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#facc15" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#facc15" stopOpacity={0}/>
                </linearGradient>
                <linearGradient id="colorLow" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#60a5fa" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#60a5fa" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} />
              <XAxis dataKey="day" stroke="#94a3b8" tick={{fontSize: 12}} tickLine={false} axisLine={false} />
              <YAxis stroke="#94a3b8" tick={{fontSize: 12}} tickLine={false} axisLine={false} tickFormatter={(value) => `${value}°`} />
              <Tooltip content={<CustomTooltip />} />
              <Area type="monotone" dataKey="high" stroke="#facc15" strokeWidth={3} fillOpacity={1} fill="url(#colorHigh)" />
              <Area type="monotone" dataKey="low" stroke="#60a5fa" strokeWidth={3} fillOpacity={1} fill="url(#colorLow)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Daily Forecast List */}
      <div className="grid grid-cols-1 md:grid-cols-7 gap-3">
        {forecast.map((day, idx) => (
          <div key={idx} className="bg-slate-800 p-4 rounded-xl flex flex-row md:flex-col items-center justify-between md:justify-center border border-slate-700 hover:border-blue-500 transition-colors">
            <span className="text-slate-400 font-medium text-sm mb-0 md:mb-2">{day.day}</span>
            <WeatherIcon type={day.icon} className="w-8 h-8 md:w-10 md:h-10 my-0 md:my-2" />
            <div className="flex space-x-2 md:space-x-0 md:flex-col text-center">
              <span className="font-bold text-slate-200">{Math.round(day.high)}°</span>
              <span className="font-medium text-slate-500">{Math.round(day.low)}°</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};