import React, { useState } from 'react';
import PropTypes from 'prop-types'
import { Container, Form, Button } from 'react-bootstrap';
import { Link, Redirect } from 'react-router-dom';
import { connect } from 'react-redux'
import Alert from '../alerts/AlertComponent';
import { login } from '../../actions/auth';
import Toast from '../alerts/ToastComponent'

const Login = ({ login, isAuthenticated, user }) => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    validated: false
  });

  const [alertState, setAlertState] = useState({
    message: null,
    alertType: null,
    dismissible: true
  });

  const { email, password, validated } = formData;

  const onChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setAlertState({
      ...alertState,
      message: null
    });
    const form = e.currentTarget;
    if (form.checkValidity() === false) {
      e.stopPropagation();
    }
    setFormData({ ...formData, validated: true });
    const error = await login({ email, password });
    if (!error)
      return setAlertState({
        ...alertState,
        message: null
      });

    if (!Array.isArray(error.message))
      setAlertState({
        ...alertState,
        message: error.message,
        alertType: 'danger',
        dismissible: error.status !== 429 ? true : false
      });
  }


  //Redirect if Logged in
  if (user && isAuthenticated)
    return user.activated ? <Redirect to='/dashboard' /> : <Redirect to='/change-password' />;

  return (
    <div className="bg-light">
      <Toast />
      <Container>
        <Form className="form-signin d-flex flex-column justify-content-center" noValidate validated={validated} onSubmit={handleSubmit}>
          <h1 className="text-center font-weight-bold">Sign in</h1>
          <h4 className="text-center lead mb-3">Sign into your account.</h4>
          <Alert alertProp={alertState} />
          <hr style={{ marginLeft: "0", marginRight: "0" }} />
          <Form.Group controlId='email'>
            <Form.Label>Email address</Form.Label>
            <Form.Control type="email" placeholder="Enter email" value={email} onChange={onChange} required />
            <Form.Control.Feedback>Email address looks good!</Form.Control.Feedback>
            <Form.Control.Feedback type="invalid">
              Invalid Email address.
            </Form.Control.Feedback>
            <Form.Text className="text-muted">
              We'll never share your email with anyone else.
              </Form.Text>
          </Form.Group>

          <Form.Group controlId="password">
            <Form.Label>Password</Form.Label>
            <Form.Control type="password" placeholder="Password" value={password} onChange={onChange} required minLength="8" />
            <Form.Control.Feedback>Password Looks good!</Form.Control.Feedback>
            <Form.Control.Feedback type="invalid">
              Password provide your credentials.
            </Form.Control.Feedback>
          </Form.Group>

          <Button variant="primary btn-block" type="submit" >
            Submit
            </Button>

          <p className="text-center mt-3 text-primary"><Link to="/forgot-password">Forget Password?</Link></p>
        </Form>
      </Container>
    </div>
  );
}

Login.propTypes = {
  login: PropTypes.func.isRequired,
  user: PropTypes.object
}

const mapStateToProps = state => ({
  isAuthenticated: state.auth.isAuthenticated,
  user: state.auth.user
})

export default connect(mapStateToProps, { login })(Login);