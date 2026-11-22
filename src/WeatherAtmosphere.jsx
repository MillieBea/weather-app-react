import "./WeatherAtmosphere.css";

export default function WeatherAtmosphere({ condition }) {
  const description = condition?.toLowerCase() || "";

  let weatherType = "default";

  if (description.includes("thunder")) {
    weatherType = "stormy";
  } else if (description.includes("snow") || description.includes("sleet")) {
    weatherType = "snowy";
  } else if (description.includes("rain") || description.includes("drizzle")) {
    weatherType = "rainy";
  } else if (
    description.includes("mist") ||
    description.includes("fog") ||
    description.includes("haze")
  ) {
    weatherType = "foggy";
  } else if (description.includes("cloud")) {
    weatherType = "cloudy";
  } else if (description.includes("clear") || description.includes("sun")) {
    weatherType = "sunny";
  }

  return (
    <div
      className={`weather-atmosphere weather-${weatherType}`}
      aria-hidden="true"
    >
      <div className="atmosphere-particles">
        {Array.from({ length: 40 }).map((_, index) => {
          let type = "dust";

          if (index >= 16 && index < 25) type = "glow";
          if (index >= 25 && index < 34) type = "blur";
          if (index >= 34) type = "twinkle";

          return (
            <span
              className={`atmosphere-particle particle-${type}`}
              key={index}
              style={{
                "--particle-left": `${(index * 37) % 100}%`,
                "--particle-delay": `${(index * 0.83) % 15}s`,
                "--particle-duration": `${14 + (index % 8) * 2}s`,
                "--particle-size":
                  type === "dust"
                    ? `${1 + (index % 2)}px`
                    : type === "glow"
                      ? `${3 + (index % 2)}px`
                      : type === "blur"
                        ? `${7 + (index % 4)}px`
                        : `${2 + (index % 2)}px`,
              }}
            />
          );
        })}
      </div>

      <div className="weather-effects">
        {weatherType === "sunny" && <div className="weather-sun-glow" />}

        {(weatherType === "rainy" || weatherType === "stormy") && (
          <div className="weather-rain">
            {Array.from({ length: 24 }).map((_, index) => (
              <span
                className="weather-raindrop"
                key={index}
                style={{
                  "--rain-left": `${(index * 43) % 100}%`,
                  "--rain-delay": `${(index * 0.37) % 4}s`,
                  "--rain-duration": `${1.4 + (index % 5) * 0.25}s`,
                }}
              />
            ))}
          </div>
        )}

        {weatherType === "snowy" && (
          <div className="weather-snow">
            {Array.from({ length: 22 }).map((_, index) => (
              <span
                className="weather-snowflake"
                key={index}
                style={{
                  "--snow-left": `${(index * 47) % 100}%`,
                  "--snow-delay": `${(index * 0.61) % 9}s`,
                  "--snow-duration": `${8 + (index % 6) * 2}s`,
                  "--snow-size": `${2 + (index % 3) * 2}px`,
                }}
              />
            ))}
          </div>
        )}

        {(weatherType === "cloudy" || weatherType === "foggy") && (
          <div className="weather-mist">
            <span className="mist-layer mist-one" />
            <span className="mist-layer mist-two" />
          </div>
        )}

        {weatherType === "stormy" && <div className="weather-lightning" />}
      </div>
    </div>
  );
}
