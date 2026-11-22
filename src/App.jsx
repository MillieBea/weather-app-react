import { useState } from "react";
import Weather from "./Weather";
import CityBackground from "./CityBackground";
import WeatherAtmosphere from "./WeatherAtmosphere";
import "./App.css";

export default function App() {
  const [city, setCity] = useState("London");
  const [weatherCondition, setWeatherCondition] = useState("");

  return (
    <>
      <CityBackground city={city} />
      <WeatherAtmosphere condition={weatherCondition} />

      <div className="app-wrapper">
        <Weather onCityChange={setCity} onWeatherChange={setWeatherCondition} />

        <footer className="footer">
          <div className="footer-brand">
            <div className="footer-logo">
              <span className="footer-symbol">☀</span>
              <span>APPAROUND</span>
            </div>

            <p className="footer-tagline">Weather - wherever you are.</p>
          </div>

          <div className="footer-divider"></div>

          <div className="footer-links">
            <span>
              Coded by{" "}
              <a
                href="https://github.com/repos"
                target="_blank"
                rel="noreferrer"
              >
                Milena
              </a>
            </span>

            <span className="footer-separator">✦</span>

            <a
              href="https://github.com/MillieBea/weather-app-react"
              target="_blank"
              rel="noreferrer"
            >
              Open-sourced on GitHub
            </a>

            <span className="footer-separator">✦</span>

            <a
              href="https://app-around.netlify.app/"
              target="_blank"
              rel="noreferrer"
            >
              Hosted on Netlify
            </a>
          </div>

          <p className="footer-copyright">© 2026 AppAround</p>
        </footer>
      </div>
    </>
  );
}
