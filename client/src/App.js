import React, { useEffect } from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom'
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';

//Redux
import { Provider } from 'react-redux';
import Store from './store';

//components
import Login from './components/auth/Login';
import ForgotPassword from './components/auth/ForgotPassword';
import ChangePassword from './components/auth/ChangePassword';

//authenticate user
import { loadUser } from './actions/auth';
import setAuthToken from './utils/setAuthToken';

if (localStorage.corpus_development_software)
  setAuthToken(localStorage.corpus_development_software);

const App = () => {
  useEffect(() => {
    Store.dispatch(loadUser());
  }, [])

  return (
    <Provider store={Store}>
      <Router>
        <Route exact path="/" component={Login}></Route>
        <Switch>
          <Route exact path="/forgot-password" component={ForgotPassword}></Route>
          <Route exact path="/change-password" component={ChangePassword}></Route>
        </Switch>
      </Router>
    </Provider>
  )
}


export default App;
