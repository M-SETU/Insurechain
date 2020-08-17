import React, { Component } from 'react';
import { Route ,Switch , BrowserRouter } from 'react-router-dom';
import Dashboard from "./Dashboard.js";

class App extends Component {

  render() {
    return (
      <BrowserRouter>
        <div className="App">
          <Dashboard />
        </div>
      </BrowserRouter>
      
    );
  }
}
export default App;