import React from 'react';
import { Copy, Check } from 'lucide-react';

interface CodeViewProps {
  code: string;
}

export const CodeView: React.FC<CodeViewProps> = ({ code }) => {
  const [copied, setCopied] = React.useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="bg-slate-900 rounded-2xl overflow-hidden border border-slate-700 shadow-2xl">
        <div className="flex justify-between items-center px-6 py-4 bg-slate-800 border-b border-slate-700">
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 rounded-full bg-red-500"></div>
            <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
            <div className="w-3 h-3 rounded-full bg-green-500"></div>
            <span className="ml-4 text-sm text-slate-400 font-mono">weather_forecast.py</span>
          </div>
          <button 
            onClick={handleCopy}
            className="flex items-center space-x-2 text-xs font-medium text-slate-400 hover:text-white transition-colors bg-slate-700 hover:bg-slate-600 px-3 py-1.5 rounded-lg"
          >
            {copied ? <Check className="w-4 h-4 text-green-400" /> : <Copy className="w-4 h-4" />}
            <span>{copied ? 'Copied!' : 'Copy Code'}</span>
          </button>
        </div>
        <div className="p-6 overflow-x-auto">
          <pre className="font-mono text-sm text-blue-300 leading-relaxed">
            <code>{code}</code>
          </pre>
        </div>
      </div>
      
      <div className="mt-6 p-4 bg-blue-900/20 border border-blue-800/50 rounded-xl">
        <h4 className="text-blue-400 font-semibold mb-2">How to run this code</h4>
        <ul className="text-sm text-blue-200/70 space-y-1 list-disc list-inside">
          <li>Ensure you have Python installed.</li>
          <li>Install the requests library: <code className="bg-blue-900/50 px-1 py-0.5 rounded text-blue-100">pip install requests</code></li>
          <li>Replace <code className="bg-blue-900/50 px-1 py-0.5 rounded text-blue-100">'YOUR_API_KEY'</code> with a valid OpenWeatherMap API key.</li>
          <li>Run the script: <code className="bg-blue-900/50 px-1 py-0.5 rounded text-blue-100">python weather_forecast.py</code></li>
        </ul>
      </div>
    </div>
  );
};