import React from "react";
import ReactDOM from "react-dom";

import "./styles.css";
import MeteoWidget from "./MeteoWidget";

function App() {
  return (
    <div className="App">
      <MeteoWidget />
    </div>
  );
}

const rootElement = document.getElementById("root");
ReactDOM.render(<App />, rootElement);
