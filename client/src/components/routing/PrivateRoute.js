import React from 'react';
import PropTypes from 'prop-types';
import { Route, Redirect } from 'react-router-dom';
import { connect } from 'react-redux';
import NavBar from '../dashboard/NavBar';

const PrivateRoute = ({ component: Component, auth: { isAuthenticated, user }, restrictTo, ...rest }) => {
  const checkAccess = (role) => restrictTo.includes(role);

  return (
    <>
      <Route
        {...rest}
        render={(props) =>
          !isAuthenticated ? (
            <Redirect to="/"></Redirect>
          ) : checkAccess(user.role) ? (
            <>
              <NavBar />
              <Component {...props}></Component>
            </>
          ) : (
            <Redirect to="/dashboard"></Redirect>
          )
        }
      ></Route>
    </>
  );
};

PrivateRoute.propTypes = {
  auth: PropTypes.object.isRequired
};

const mapStateToProps = (state) => ({
  auth: state.auth
});
export default connect(mapStateToProps)(PrivateRoute);
