import { useState, useEffect } from "react";

export default function LocalClock({ timeZone }) {
  const [time, setTime] = useState(() => new Date());

  useEffect(() => {
    const updateClock = () => {
      setTime(new Date());
    };

    updateClock();

    const interval = setInterval(updateClock, 1000);

    return () => clearInterval(interval);
  }, [timeZone]);

  const formattedTime = new Intl.DateTimeFormat("en-GB", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hourCycle: "h23",
    timeZone: timeZone,
  }).format(time);

  return <div className="local-clock">{formattedTime}</div>;
}
