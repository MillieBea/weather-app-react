import clearDay from "@meteocons/svg/fill/clear-day.svg";
import clearNight from "@meteocons/svg/fill/clear-night.svg";

import mostlyClearDay from "@meteocons/svg/fill/mostly-clear-day.svg";
import mostlyClearNight from "@meteocons/svg/fill/mostly-clear-night.svg";

import partlyCloudyDay from "@meteocons/svg/fill/partly-cloudy-day.svg";
import partlyCloudyNight from "@meteocons/svg/fill/partly-cloudy-night.svg";

import cloudy from "@meteocons/svg/fill/cloudy.svg";

import showerRainDay from "@meteocons/svg/fill/partly-cloudy-day-rain.svg";
import showerRainNight from "@meteocons/svg/fill/partly-cloudy-night-rain.svg";

import rain from "@meteocons/svg/fill/rain.svg";

import thunderstormDay from "@meteocons/svg/fill/thunderstorms-day.svg";
import thunderstormNight from "@meteocons/svg/fill/thunderstorms-night.svg";

import snow from "@meteocons/svg/fill/snow.svg";

import fogDay from "@meteocons/svg/fill/fog-day.svg";
import fogNight from "@meteocons/svg/fill/fog-night.svg";

const weatherIcons = {
  "clear-sky-day": clearDay,
  "clear-sky-night": clearNight,

  "few-clouds-day": mostlyClearDay,
  "few-clouds-night": mostlyClearNight,

  "scattered-clouds-day": partlyCloudyDay,
  "scattered-clouds-night": partlyCloudyNight,

  "broken-clouds-day": cloudy,
  "broken-clouds-night": cloudy,

  "shower-rain-day": showerRainDay,
  "shower-rain-night": showerRainNight,

  "rain-day": rain,
  "rain-night": rain,

  "thunderstorm-day": thunderstormDay,
  "thunderstorm-night": thunderstormNight,

  "snow-day": snow,
  "snow-night": snow,

  "mist-day": fogDay,
  "mist-night": fogNight,
};

export default function WeatherIcon({ icon, size = 120 }) {
  const iconSrc = weatherIcons[icon] || cloudy;

  return (
    <img
      src={iconSrc}
      alt={icon ? icon.replaceAll("-", " ") : "Weather"}
      width={size}
      height={size}
      className="weather-icon"
    />
  );
}
