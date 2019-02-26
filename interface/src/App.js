import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import { BrowserRouter as Router, Route, Link } from 'react-router-dom';
import FakePage from './FakePage';
import Fibonacci from './FibonacciPage';

class App extends Component {
  render() {
    return (
      <Router>
        <div className="App">
          <header className="App-header">
            <img src={logo} className="App-logo" alt="logo" />
            <h1 className="App-title">Fib Calculator</h1>
            <Link to="/">Go home</Link>
            <Link to="/fake"></Link>
          </header>
        
          <div>
            <Route exact path="/" component={Fibonacci} />
            <Route path="/fake" component={FakePage} />
          </div>
        </div>
      </Router>
    );
  }
}

export default App;
