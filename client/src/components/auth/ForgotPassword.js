import React, { useState } from 'react'
import PropTypes from 'prop-types'
import { Container, Form, Button } from 'react-bootstrap';
import { connect } from 'react-redux';
import Axios from 'axios'
import { setToast } from '../../actions/toast'
import Alert from '../alerts/AlertComponent';
import Toast from '../alerts/ToastComponent'


const ForgotPassword = ({ setToast }) => {
  const [formData, setFormData] = useState({
    email: '',
    validated: false
  });

  const { email, validated } = formData;

  const [alertState, setAlertState] = useState({
    message: null,
    alertType: null,
    dismissible: true
  });

  const onChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  }

  const sendPasswordResetLink = async () => {
    try {
      const res = await Axios.post('/api/auth/forget-password/', { email });
      setToast('Password Reset Link', `Password reset has been sent to ${email}, check your spam if you did not receive any reset link.`, 'success');
    } catch (error) {
      if (!Array.isArray(error.response.data.message))
        return setAlertState({
          ...alertState,
          message: `${error.response.data.message || 'Something went wrong!'}`,
          alertType: 'danger',
        });
    }
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
    await sendPasswordResetLink();
  }

  return (
    <div className="bg-light">
      <Toast />
      <Container>
        <Form className="form-signin pt-5" noValidate validated={validated} onSubmit={handleSubmit}>
          <h1 className="text-center font-weight-bold">Forgot Password</h1>
          <p className="text-center lead mb-3">Enter Email address associated with your account.</p>
          <Alert alertProp={alertState} />
          <hr />
          <Form.Group controlId="email">
            <Form.Label>Email address</Form.Label>
            <Form.Control type="email" placeholder="Enter email" value={email} onChange={onChange} required />
            <Form.Control.Feedback>Looks good!</Form.Control.Feedback>
            <Form.Control.Feedback type="invalid">
              Please enter valid email address.
            </Form.Control.Feedback>
            <Form.Text className="text-muted">
              A password reset link will be sent to the provided email Address
              </Form.Text>
          </Form.Group>

          <Button variant="primary btn-block" type="submit" >
            Send Password Reset Link
            </Button>
        </Form>
      </Container>
    </div>
  )
}

ForgotPassword.propTypes = {
  setToast: PropTypes.func.isRequired
}


export default connect(null, { setToast })(ForgotPassword)
