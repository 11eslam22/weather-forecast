import { GoogleGenAI, Type } from "@google/genai";
import { WeatherData } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const modelName = "gemini-2.5-flash";

export const fetchWeatherAndCode = async (location: string): Promise<WeatherData> => {
  // We will ask for both the JSON data and the Python code in one go to be efficient,
  // or we can separate them. Separating is cleaner for the prompt structure.
  // Let's do a structured generation for the weather data first.

  const weatherPrompt = `
    Generate a realistic, simulated current weather report and a 7-day forecast for ${location}.
    Assume the current date is usually typical for the season.
    Provide the response in JSON format.
    
    Rules for 'icon': use strictly one of these values: 'sun', 'cloud', 'rain', 'snow', 'storm', 'mist'.
  `;

  // Define schema for structured output
  const response = await ai.models.generateContent({
    model: modelName,
    contents: weatherPrompt,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          current: {
            type: Type.OBJECT,
            properties: {
              temp: { type: Type.NUMBER, description: "Current temperature in Celsius" },
              condition: { type: Type.STRING },
              humidity: { type: Type.NUMBER, description: "Humidity percentage" },
              windSpeed: { type: Type.NUMBER, description: "Wind speed in km/h" },
              feelsLike: { type: Type.NUMBER, description: "Feels like temperature in Celsius" },
              location: { type: Type.STRING, description: "Formatted location name (City, Country)" },
              description: { type: Type.STRING, description: "Short description of the weather" },
              icon: { type: Type.STRING, description: "sun, cloud, rain, snow, storm, or mist" },
            },
            required: ["temp", "condition", "humidity", "windSpeed", "feelsLike", "location", "description", "icon"],
          },
          forecast: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                day: { type: Type.STRING, description: "Day name (e.g., Mon, Tue)" },
                high: { type: Type.NUMBER },
                low: { type: Type.NUMBER },
                condition: { type: Type.STRING },
                icon: { type: Type.STRING },
              },
              required: ["day", "high", "low", "condition", "icon"],
            },
          },
        },
        required: ["current", "forecast"],
      },
    },
  });

  if (!response.text) {
    throw new Error("Failed to generate weather data");
  }

  const weatherJson = JSON.parse(response.text);

  // Now generate the Python code separately to ensure it's plain text (markdown) and high quality
  // We don't want this inside the JSON schema as it might mess up escaping.
  const codePrompt = `
    Write a production-ready Python script using the 'requests' library to fetch weather data for ${location}.
    
    Requirements:
    1. Use the OpenWeatherMap API as the example endpoint (use a placeholder API_KEY).
    2. Include proper error handling (try/except).
    3. Print the current temperature, humidity, and weather description.
    4. Comment the code explaining each step.
    5. Return ONLY the code, inside markdown code blocks.
  `;

  const codeResponse = await ai.models.generateContent({
    model: modelName,
    contents: codePrompt,
  });

  const rawCode = codeResponse.text || "# Error generating code";
  
  // Clean up markdown code blocks if present
  const cleanCode = rawCode.replace(/```python/g, '').replace(/```/g, '').trim();

  return {
    ...weatherJson,
    pythonCode: cleanCode,
  };
};