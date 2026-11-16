import { useState, useEffect } from "react";
import axios from "axios";
import { PuffLoader } from "react-spinners";
import "./Weather.css";

export default function Weather() {
  const [city, setCity] = useState("London");
  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  function searchWeather(cityName) {
    setLoading(true);
    setError("");

    const url = `https://api.shecodes.io/weather/v1/current?query=${encodeURIComponent(cityName)}&key=oa123466c5f9312d2cba18f04t3ef25d`;

    axios
      .get(url)
      .then((response) => {
        setWeather(response.data);
        setLoading(false);
      })
      .catch((error) => {
        console.error(
          "Weather API error:",
          error.response?.data || error.message,
        );
        setError("Sorry, we couldn't find that city. Please try again.");
        setLoading(false);
      });
  }

  useEffect(() => {
    searchWeather("London");
  }, []);

  function handleSubmit(event) {
    event.preventDefault();
    searchWeather(city);
  }

  return (
    <div className="container">
      <div className="weather-card">
        <form onSubmit={handleSubmit}>
          <div className="d-flex gap-2 mb-4">
            <input
              type="text"
              className="form-control"
              placeholder="Enter a city..."
              value={city}
              onChange={(event) => setCity(event.target.value)}
            />

            <button className="btn btn-primary" type="submit">
              Search
            </button>
          </div>
        </form>

        {loading && (
          <div className="loader">
            <PuffLoader color="#000000" size={60} speedMultiplier={0.7} />
          </div>
        )}

        {error && <p className="text-danger">{error}</p>}

        {weather && !loading && (
          <div className="weather-info">
            <div className="location-info">
              <h2>{weather.city}</h2>

              <p className="date-time">
                {new Date().toLocaleDateString("en-GB", {
                  weekday: "long",
                })}{" "}
                |{" "}
                {new Date().toLocaleTimeString("en-GB", {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </p>

              <p className="description">{weather.condition.description}</p>
            </div>

            <div className="weather-details">
              <div className="temperature">
                <img
                  src={weather.condition.icon_url}
                  alt={weather.condition.description}
                />
                <h1>{Math.round(weather.temperature.current)}°C</h1>
              </div>

              <div className="additional-info">
                <p>Humidity: {weather.temperature.humidity}%</p>
                <p>Wind: {weather.wind.speed} km/h</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
