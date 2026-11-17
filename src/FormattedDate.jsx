export default function FormattedDate(props) {
  const weekday = new Intl.DateTimeFormat("en-GB", {
    weekday: "long",
    timeZone: props.timeZone,
  }).format(props.date);

  const dayMonth = new Intl.DateTimeFormat("en-GB", {
    day: "numeric",
    month: "long",
    timeZone: props.timeZone,
  }).format(props.date);

  const time = new Intl.DateTimeFormat("en-GB", {
    hour: "2-digit",
    minute: "2-digit",
    hourCycle: "h23",
    timeZone: props.timeZone,
  }).format(props.date);

  return (
    <div>
      <div>
        {weekday} <span className="date-separator">|</span> {dayMonth}
      </div>
      <div>{time}</div>
    </div>
  );
}
