import WeatherIcon from "./WeatherIcon";
import "./Forecast.css";

export default function Forecast({ forecast, timeZone, city }) {
  const days = forecast.slice(1, 7);

  return (
    <div className="forecast-days">
      {days.map((day) => {
        const date = new Date(day.time * 1000);

        const weekday = new Intl.DateTimeFormat("en-GB", {
          weekday: "short",
          timeZone: timeZone,
        }).format(date);

        return (
          <div className="forecast-day" key={day.time}>
            <div className="forecast-weekday">{weekday}</div>

            <div className="forecast-icon">
              <WeatherIcon icon={day.condition.icon} size={58} />
            </div>

            <div className="forecast-temperatures">
              <strong>H: {Math.round(day.temperature.maximum)}°</strong>
              <span>L: {Math.round(day.temperature.minimum)}°</span>
            </div>
          </div>
        );
      })}
    </div>
  );
}
