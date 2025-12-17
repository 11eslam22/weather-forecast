import React, { useState, useEffect } from 'react';
import { fetchWeatherAndCode } from './services/geminiService';
import { WeatherData, ViewMode } from './types';
import { ForecastView } from './components/ForecastView';
import { CodeView } from './components/CodeView';
import { Search, Loader2, Code, LayoutDashboard } from 'lucide-react';

const INITIAL_LOCATION = "San Francisco, CA";

const App = () => {
  const [location, setLocation] = useState(INITIAL_LOCATION);
  const [searchInput, setSearchInput] = useState("");
  const [weatherData, setWeatherData] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<ViewMode>(ViewMode.FORECAST);

  const loadWeather = async (loc: string) => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchWeatherAndCode(loc);
      setWeatherData(data);
    } catch (err) {
      console.error(err);
      setError("Failed to fetch weather data. Please try a different location.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadWeather(INITIAL_LOCATION);
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchInput.trim()) return;
    setLocation(searchInput);
    loadWeather(searchInput);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-4 md:p-8 flex flex-col items-center">
      
      {/* Header & Search */}
      <header className="w-full max-w-4xl mb-8 flex flex-col md:flex-row justify-between items-center gap-4">
        <div className="flex items-center space-x-3">
          <div className="bg-blue-600 p-2 rounded-lg">
            <Code className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold tracking-tight">PyWeather Gen</h1>
            <p className="text-xs text-slate-400">AI-Powered Forecast & Code Generator</p>
          </div>
        </div>

        <form onSubmit={handleSearch} className="w-full md:w-auto relative group">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-4 w-4 text-slate-400 group-focus-within:text-blue-400 transition-colors" />
          </div>
          <input
            type="text"
            className="block w-full md:w-80 pl-10 pr-4 py-2 bg-slate-900 border border-slate-800 rounded-full text-sm placeholder-slate-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all shadow-sm"
            placeholder="Enter city name..."
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
          />
        </form>
      </header>

      {/* Main Content Area */}
      <main className="w-full max-w-4xl">
        
        {/* Controls */}
        <div className="flex justify-between items-center mb-6">
          <div className="flex bg-slate-900 p-1 rounded-lg border border-slate-800">
            <button
              onClick={() => setViewMode(ViewMode.FORECAST)}
              className={`flex items-center space-x-2 px-4 py-2 rounded-md text-sm font-medium transition-all ${
                viewMode === ViewMode.FORECAST
                  ? 'bg-blue-600 text-white shadow-md'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
              }`}
            >
              <LayoutDashboard className="w-4 h-4" />
              <span>Forecast</span>
            </button>
            <button
              onClick={() => setViewMode(ViewMode.CODE)}
              className={`flex items-center space-x-2 px-4 py-2 rounded-md text-sm font-medium transition-all ${
                viewMode === ViewMode.CODE
                  ? 'bg-blue-600 text-white shadow-md'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
              }`}
            >
              <Code className="w-4 h-4" />
              <span>Python Code</span>
            </button>
          </div>
          
          <div className="text-xs text-slate-500 hidden md:block">
            Last updated: Just now
          </div>
        </div>

        {/* Dynamic Content */}
        <div className="min-h-[400px]">
          {loading ? (
            <div className="h-96 flex flex-col items-center justify-center space-y-4 animate-pulse">
              <Loader2 className="w-10 h-10 text-blue-500 animate-spin" />
              <p className="text-slate-400 font-medium">Generating accurate forecast...</p>
            </div>
          ) : error ? (
            <div className="h-96 flex items-center justify-center bg-red-900/10 border border-red-900/20 rounded-2xl">
              <p className="text-red-400">{error}</p>
            </div>
          ) : weatherData ? (
            <>
              {viewMode === ViewMode.FORECAST && <ForecastView data={weatherData} />}
              {viewMode === ViewMode.CODE && <CodeView code={weatherData.pythonCode} />}
            </>
          ) : null}
        </div>
      </main>

      <footer className="mt-12 text-center text-slate-600 text-sm">
        <p>Powered by Gemini 2.5 Flash • Built with React & Tailwind</p>
      </footer>
    </div>
  );
};

export default App;