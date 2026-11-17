import { useState } from "react";

export default function Temperature({ celsius }) {
  const [unit, setUnit] = useState("celsius");

  const fahrenheit = (celsius * 9) / 5 + 32;

  return (
    <div className="temperature-display">
      <h1>{Math.round(unit === "celsius" ? celsius : fahrenheit)}</h1>

      <div className="temperature-units">
        <button
          onClick={() => setUnit("celsius")}
          className={unit === "celsius" ? "active" : ""}
        >
          °C
        </button>

        <span>|</span>

        <button
          onClick={() => setUnit("fahrenheit")}
          className={unit === "fahrenheit" ? "active" : ""}
        >
          °F
        </button>
      </div>
    </div>
  );
}
