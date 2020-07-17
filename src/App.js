import React from "react";
import "./App.scss";

import "./containers/SaveShifter/SaveShifter";
import SaveShifter from "./containers/SaveShifter/SaveShifter";

function App() {
  return (
    <div className="App">
      <div className="Container">
        <SaveShifter />
      </div>
    </div>
  );
}

export default App;
