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
        </a>{" "}
        ·{" "}
        <a href="" target="_blank" rel="noreferrer">
          Open-source code
        </a>
      </footer>
    </div>
  );
}
