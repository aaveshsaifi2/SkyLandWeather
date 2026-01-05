import { useState } from "react";
import "./App.css";

const cities = [
  "Delhi",
  "Dehradun",
  "Denver",
  "Dubai",
  "Mumbai",
  "Chennai",
  "Bangalore",
  "Kolkata",
  "London",
  "New York"
];

function App() {
  const [city, setCity] = useState("");
  const [weather, setWeather] = useState(null);
  const [error, setError] = useState("");
  const [suggestions, setSuggestions] = useState([]);

  const getWeather = async () => {
    if (!city) return;

    try {
      const res = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(
          city
        )}&appid=cdc1eb7f5d4599d1214f19e2c3753d0f&units=metric`
      );

      if (!res.ok) {
        throw new Error("City not found");
      }

      const data = await res.json();
      setWeather(data);
      setError("");
      setSuggestions([]);
    } catch (err) {
      setError(err.message);
      setWeather(null);
    }
  };

  return (
    <div className="app-container">
      <div className="weather-card">
        <h2 className="title">Weatherly</h2>

        {/* SEARCH AREA */}
        <div className="search-wrapper">
          <form
            className="search-box"
            onSubmit={(e) => {
              e.preventDefault();
              getWeather();
            }}
          >
            <input
              placeholder="Enter city name"
              value={city}
              onChange={(e) => {
                const value = e.target.value;
                setCity(value);

                if (value.length === 0) {
                  setSuggestions([]);
                } else {
                  const filtered = cities.filter((c) =>
                    c.toLowerCase().startsWith(value.toLowerCase())
                  );
                  setSuggestions(filtered);
                }
              }}
            />

            <button type="submit">Search</button>
          </form>

          {/* SUGGESTIONS */}
          {suggestions.length > 0 && (
            <ul className="suggestions">
              {suggestions.map((item, index) => (
                <li
                  key={index}
                  onClick={() => {
                    setCity(item);
                    setSuggestions([]);
                  }}
                >
                  {item}
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* ERROR */}
        {error && <p className="error">{error}</p>}

        {/* RESULT */}
        {weather && (
          <div className="result">
            <h3>{weather.name}</h3>

            <img
              src={`https://openweathermap.org/img/wn/${weather.weather[0].icon}@2x.png`}
              alt="weather icon"
            />

            <h1>{Math.round(weather.main.temp)}°C</h1>
            <p className="condition">{weather.weather[0].main}</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
