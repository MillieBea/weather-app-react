import { useState, useEffect, useCallback } from "react";
import axios from "axios";
import FormattedDate from "./FormattedDate";
import { PuffLoader } from "react-spinners";
import WeatherIcon from "./WeatherIcon";
import "./Weather.css";
import Temperature from "./Temperature";
import manifest from "@meteocons/svg/manifest.json";

const allIcons = manifest.categories.flatMap((category) => category.icons);

console.log(
  "Weather icon options:",
  JSON.stringify(
    allIcons
      .filter((icon) => /clear|cloud|rain|storm|snow|fog|mist/i.test(icon.slug))
      .map((icon) => icon.slug),
    null,
    2,
  ),
);

export default function Weather() {
  const [city, setCity] = useState("London");

  const [weatherData, setWeatherData] = useState({
    ready: false,
    loading: false,
    error: null,
  });

  const searchWeather = useCallback((cityName) => {
    setWeatherData((previousData) => ({
      ...previousData,
      loading: true,
      error: null,
    }));

    const apiKey = import.meta.env.VITE_SHECODES_API_KEY;

    const url = `https://api.shecodes.io/weather/v1/current?query=${encodeURIComponent(cityName)}&key=${apiKey}`;

    axios
      .get(url)
      .then((response) => {
        const data = response.data;
        console.log("Weather icon:", data.condition.icon);
        console.log("Weather description:", data.condition.description);

        const timezoneUrl = `https://hourora.app/api/v1/lookup?lat=${data.coordinates.latitude}&lng=${data.coordinates.longitude}`;

        return axios.get(timezoneUrl).then((timezoneResponse) => {
          setWeatherData({
            ready: true,
            loading: false,
            error: null,
            city: data.city,
            date: new Date(data.time * 1000),
            timeZone: timezoneResponse.data.zone,
            temperature: data.temperature.current,
            humidity: data.temperature.humidity,
            description: data.condition.description,
            icon: data.condition.icon,
            wind: data.wind.speed,
          });
        });
      })
      .catch((error) => {
        console.error(
          "Weather API error:",
          error.response?.data || error.message,
        );

        setWeatherData((previousData) => ({
          ...previousData,
          loading: false,
          error: "Sorry, we couldn't find that city. Please try again.",
        }));
      });
  }, []);

  useEffect(() => {
    searchWeather("London");
  }, [searchWeather]);

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

        {weatherData.loading && (
          <div className="loader">
            <PuffLoader color="#000000" size={60} speedMultiplier={0.7} />
          </div>
        )}

        {weatherData.error && (
          <p className="text-danger">{weatherData.error}</p>
        )}

        {weatherData.ready && !weatherData.loading && (
          <div className="weather-info">
            <div className="location-info">
              <h2>{weatherData.city}</h2>

              <div className="date-time">
                <FormattedDate
                  date={weatherData.date}
                  timeZone={weatherData.timeZone}
                />
              </div>

              <p className="description">{weatherData.description}</p>
            </div>

            <div className="weather-details">
              <div className="temperature">
                <WeatherIcon icon={weatherData.icon} size={150} />

                <Temperature celsius={weatherData.temperature} />
              </div>

              <div className="additional-info">
                <p>Humidity: {weatherData.humidity}%</p>
                <p>Wind: {weatherData.wind} km/h</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
