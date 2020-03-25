import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom'
import Login from './components/auth/Login';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';

const App = () => (
  <Router>
    <Route exact path="/" component={Login}></Route>
  </Router>
)


export default App;
