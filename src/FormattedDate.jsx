export default function FormattedDate(props) {
  const weekday = new Intl.DateTimeFormat("en-GB", {
    weekday: "long",
    timeZone: props.timeZone,
  }).format(props.date);

  const dayMonth = new Intl.DateTimeFormat("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: props.timeZone,
  }).format(props.date);

  return (
    <>
      <div className="weekday-tile info-tile">{weekday}</div>

      <div className="day-month-tile info-tile">{dayMonth}</div>
    </>
  );
}
