import React from 'react';
import "./App.css";
import { HashRouter as Router, Route } from "react-router-dom";
// import Login from './View/Login/login';
import Home from './View/Home/home';
import Revenue from './View/Revenue/revenueDetail';
import Audit from './View/Audit/audit';

class App extends React.Component {
  render() {
    return (
      <div>
          <Router>
            {/* <Route exact path="/" component={Login}></Route> */}
            <Route exact path="/" component={Home}></Route>
            <Route exact path="/revenue" component={Revenue}></Route>
            <Route exact path="/audit" component={Audit}></Route>
          </Router>
      </div>
    )
  }
}

export default (App);
