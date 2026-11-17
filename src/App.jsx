import Weather from "./Weather";
import "./App.css";

export default function App() {
  return (
    <div className="app-wrapper">
      <Weather />

      <footer className="footer">
        Coded by{" "}
        <a href="https://github.com/repos" target="_blank" rel="noreferrer">
          Milena
        </a>
        <span className="footer-separator">·</span>
        <a
          href="https://github.com/MillieBea/weather-app-react"
          target="_blank"
          rel="noreferrer"
        >
          Open-sourced on Github
        </a>
        <span className="footer-separator">·</span>
        <a
          href="https://app-around.netlify.app/"
          target="_blank"
          rel="noreferrer"
        >
          Hosted on Netlify
        </a>
      </footer>
    </div>
  );
}
