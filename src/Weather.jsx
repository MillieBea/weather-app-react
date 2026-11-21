import { useState, useEffect, useCallback } from "react";
import axios from "axios";
import FormattedDate from "./FormattedDate";
import { PuffLoader } from "react-spinners";
import WeatherIcon from "./WeatherIcon";
import Forecast from "./Forecast";
import Temperature from "./Temperature";
import LocalClock from "./LocalClock";
import Globe from "./Globe";
import "./Weather.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import {
  faLocationDot,
  faTemperatureHalf,
  faDroplet,
  faWind,
  faGaugeHigh,
  faMagnifyingGlass,
  faLocationCrosshairs,
  faCalendarDays,
} from "@fortawesome/free-solid-svg-icons";

export default function Weather() {
  const [city, setCity] = useState("London");

  const [globePaused, setGlobePaused] = useState(false);

  const [weatherData, setWeatherData] = useState({
    ready: false,
    loading: false,
    error: null,
  });

  const searchWeather = useCallback((cityName, pauseGlobe = false) => {
    setWeatherData((previousData) => ({
      ...previousData,
      loading: true,
      error: null,
    }));

    const apiKey = import.meta.env.VITE_SHECODES_API_KEY;

    const url = `https://api.shecodes.io/weather/v1/current?query=${encodeURIComponent(cityName)}&key=${apiKey}`;

    const forecastUrl = `https://api.shecodes.io/weather/v1/forecast?query=${encodeURIComponent(cityName)}&key=${apiKey}`;

    axios
      .all([axios.get(url), axios.get(forecastUrl)])
      .then(([response, forecastResponse]) => {
        const data = response.data;
        const forecastData = forecastResponse.data;

        console.log("Weather icon:", data.condition.icon);
        console.log("Weather description:", data.condition.description);

        const timezoneUrl = `https://hourora.app/api/v1/lookup?lat=${data.coordinates.latitude}&lng=${data.coordinates.longitude}`;

        return axios.get(timezoneUrl).then((timezoneResponse) => {
          setWeatherData({
            ready: true,
            loading: false,
            error: null,
            city: data.city,
            country: data.country,
            latitude: data.coordinates.latitude,
            longitude: data.coordinates.longitude,
            date: new Date(data.time * 1000),
            timeZone: timezoneResponse.data.zone,
            temperature: data.temperature.current,
            feelsLike: data.temperature.feels_like,
            humidity: data.temperature.humidity,
            pressure: data.temperature.pressure,
            description: data.condition.description,
            icon: data.condition.icon,
            wind: data.wind.speed,
            forecast: forecastData.daily,
          });
          if (pauseGlobe) {
            setGlobePaused(true);
          }
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

  const handleGlobeLocationSelect = useCallback(
    ({ latitude, longitude }) => {
      const reverseGeocodeUrl = `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${latitude}&longitude=${longitude}&localityLanguage=en`;

      axios
        .get(reverseGeocodeUrl)
        .then((response) => {
          const data = response.data;

          const place = data.city || data.locality || data.principalSubdivision;

          const country = data.countryName;

          if (!place) {
            throw new Error("Could not identify this location.");
          }

          const locationQuery = country ? `${place}, ${country}` : place;

          setCity(place);
          searchWeather(locationQuery);
        })
        .catch((error) => {
          console.error("Location lookup error:", error);

          setWeatherData((previousData) => ({
            ...previousData,
            loading: false,
            error:
              "Sorry, we couldn't identify that location. Please try another spot.",
          }));
        });
    },
    [searchWeather],
  );

  useEffect(() => {
    searchWeather("London", true);
  }, [searchWeather]);

  function handleSubmit(event) {
    event.preventDefault();
    searchWeather(city, true);
  }
  function handleLocationClick() {
    if (!navigator.geolocation) {
      setWeatherData((previousData) => ({
        ...previousData,
        error: "Your browser does not support location services.",
      }));

      return;
    }

    setWeatherData((previousData) => ({
      ...previousData,
      loading: true,
      error: null,
    }));

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const latitude = position.coords.latitude;
        const longitude = position.coords.longitude;

        const reverseGeocodeUrl = `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${latitude}&longitude=${longitude}&localityLanguage=en`;

        axios
          .get(reverseGeocodeUrl)
          .then((response) => {
            const data = response.data;

            const place = data.city || data.locality;
            const country = data.countryName;

            if (!place) {
              throw new Error("Could not identify your nearest city.");
            }

            const locationQuery = country ? `${place}, ${country}` : place;

            searchWeather(locationQuery);
          })
          .catch((error) => {
            console.error("Location lookup error:", error);

            setWeatherData((previousData) => ({
              ...previousData,
              loading: false,
              error:
                "Sorry, we couldn't identify your current location. Please try again.",
            }));
          });
      },

      (error) => {
        let message = "Unable to retrieve your location. Please try again.";

        if (error.code === 1) {
          message =
            "Location permission was denied. Please allow location access in your browser settings.";
        } else if (error.code === 2) {
          message = "Your location is currently unavailable.";
        } else if (error.code === 3) {
          message = "Location request timed out. Please try again.";
        }

        setWeatherData((previousData) => ({
          ...previousData,
          loading: false,
          error: message,
        }));
      },

      {
        enableHighAccuracy: false,
        timeout: 60000,
        maximumAge: 600000,
      },
    );
  }

  return (
    <div className="container">
      <div className="weather-card">
        <form onSubmit={handleSubmit} className="weather-search">
          <div className="search-input-group">
            <FontAwesomeIcon
              icon={faMagnifyingGlass}
              className="search-input-icon"
            />

            <input
              type="text"
              className="form-control"
              placeholder="Search for a city..."
              value={city}
              onChange={(event) => setCity(event.target.value)}
            />
          </div>

          <button
            className="search-button"
            type="submit"
            aria-label="Search city"
          >
            <FontAwesomeIcon icon={faMagnifyingGlass} />
          </button>

          <button
            className={`location-button ${weatherData.loading ? "locating" : ""}`}
            type="button"
            onClick={handleLocationClick}
            aria-label="Use my current location"
            title="Use my current location"
          >
            <FontAwesomeIcon icon={faLocationCrosshairs} />
          </button>
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
            <div className="current-weather-grid">
              <div className="weather-panel date-panel">
                <div className="date-time">
                  <FormattedDate
                    date={weatherData.date}
                    timeZone={weatherData.timeZone}
                  />

                  <div className="info-tile clock-tile">
                    <LocalClock timeZone={weatherData.timeZone} />
                  </div>
                </div>

                <p className="description">{weatherData.description}</p>
              </div>

              <div className="weather-panel main-weather-panel">
                <div className="location-tile">
                  <FontAwesomeIcon icon={faLocationDot} />
                  <div className="location-text">
                    <h2>{weatherData.city}</h2>
                    <p>{weatherData.country}</p>
                  </div>
                </div>

                <div className="weather-main-content">
                  <div className="temperature-tile">
                    <Temperature celsius={weatherData.temperature} />
                  </div>

                  <div className="side-weather-icon">
                    <WeatherIcon icon={weatherData.icon} size={160} />
                  </div>
                </div>
              </div>

              <div className="weather-panel details-panel">
                <div className="info-tile detail-tile">
                  <FontAwesomeIcon icon={faTemperatureHalf} />
                  <span>Feels like</span>
                  <strong>{Math.round(weatherData.feelsLike)}°C</strong>
                </div>

                <div className="info-tile detail-tile">
                  <FontAwesomeIcon icon={faDroplet} />
                  <span>Humidity</span>
                  <strong>{weatherData.humidity}%</strong>
                </div>

                <div className="info-tile detail-tile">
                  <FontAwesomeIcon icon={faWind} />
                  <span>Wind</span>
                  <strong>{weatherData.wind} km/h</strong>
                </div>

                <div className="info-tile detail-tile">
                  <FontAwesomeIcon icon={faGaugeHigh} />
                  <span>Pressure</span>
                  <strong>{weatherData.pressure} hPa</strong>
                </div>
              </div>
            </div>

            <div className="dashboard-bottom-grid">
              <div className="weather-panel globe-panel">
                <h3>{weatherData.city} on the map</h3>

                <p className="globe-subtitle">
                  Explore the globe or choose another location.
                </p>

                <Globe
                  onLocationSelect={handleGlobeLocationSelect}
                  selectedLatitude={weatherData.latitude}
                  selectedLongitude={weatherData.longitude}
                  rotationPaused={globePaused}
                />
              </div>

              <div className="weather-panel forecast-panel">
                <h3>
                  <FontAwesomeIcon icon={faCalendarDays} />6 - day forecast for{" "}
                  {weatherData.city}
                </h3>

                <Forecast
                  forecast={weatherData.forecast}
                  timeZone={weatherData.timeZone}
                  city={weatherData.city}
                />
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
