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
import Dashboard from './components/dashboard/Dashboard';
import AssignTask from './components/assign-task/AssignTask';
import Users from './components/users/Users';
import AddUser from './components/add-user/AddUser'
import TranslationAssignment from './components/assignments/translate/TranslateAssignment'
import TranslateText from './components/assignments/translate/TranslateText'
import ReviewAssignment from './components/assignments/review/ReviewAssignment'
import ReviewText from './components/assignments/review/ReviewText'
import ResetPasswordForgot from './components/auth/ResetPassword'
import NotFound from './components/NotFound'

//authenticate user
import { loadUser } from './actions/auth';
import setAuthToken from './utils/setAuthToken';

//Routing
import PrivateRoute from './components/routing/PrivateRoute';

if (localStorage.corpus_development_software)
  setAuthToken(localStorage.corpus_development_software);

const App = () => {
  useEffect(() => {
    Store.dispatch(loadUser());
  }, []);

  const Admin = ['Admin', 'Developer'];
  const Linguist = ['Linguist'];
  const Reviewer = ['Reviewer'];
  const All = [...Admin, ...Linguist, ...Reviewer];
  return (
    <Provider store={Store}>
      <Router>
        <Route exact path="/" component={Login}></Route>
        <Switch>
          <Route exact path="/forgot-password" component={ForgotPassword}></Route>
          <PrivateRoute exact path="/change-password" restrictTo={All} component={ChangePassword}></PrivateRoute>
          <PrivateRoute exact path="/dashboard" restrictTo={All} component={Dashboard}></PrivateRoute>
          <PrivateRoute exact path="/assign-task" restrictTo={Admin} component={AssignTask}></PrivateRoute>
          <PrivateRoute exact path="/add-user" restrictTo={Admin} component={AddUser}></PrivateRoute>
          <PrivateRoute exact path="/users" restrictTo={Admin} component={Users}></PrivateRoute>
          <PrivateRoute exact path="/review/assignments" restrictTo={Reviewer} component={ReviewAssignment}></PrivateRoute>
          <PrivateRoute exact path="/review/assignments/:id" restrictTo={Reviewer} component={ReviewText}></PrivateRoute>
          <PrivateRoute exact path="/translate/assignments" restrictTo={Linguist} component={TranslationAssignment}></PrivateRoute>
          <PrivateRoute exact path="/translate/assignments/:id" restrictTo={Linguist} component={TranslateText}></PrivateRoute>
          <Route exact path="/reset-password/:token" component={ResetPasswordForgot}></Route>
          <Route component={NotFound}></Route>
        </Switch>
      </Router>
    </Provider>
  )
}


export default App;
