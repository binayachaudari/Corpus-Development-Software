import React, { useState } from 'react'
import PropTypes from 'prop-types'
import { withRouter } from 'react-router-dom'
import { Container, Form, Button } from 'react-bootstrap'
import { connect } from 'react-redux'
import Axios from 'axios'
import { setToast } from '../../actions/toast'
import ResetPasswordComponent from './ResetPasswordComponent'
import Alert from '../alerts/AlertComponent'


const ResetPassword = ({ match: { params: { token } }, setToast, history }) => {
  const [formData, setFormData] = useState({
    new_password: '',
    retype_new_password: '',
    validated: false
  });

  const { new_password, retype_new_password, validated } = formData;

  const [alertState, setAlertState] = useState({
    message: null,
    alertType: null,
    dismissible: true
  });

  const forgotPasswordReset = async (password) => {
    try {
      const res = await Axios.patch(`/api/auth/reset-password/${token}`, { password });
      setToast('Password Reset', `Password Reset Successful!`, 'success');
      return history.push('/');
    } catch (error) {
      if (!Array.isArray(error.response.data.message))
        return setAlertState({
          ...alertState,
          message: `${error.response.data.message}`,
          alertType: 'danger',
        });
    }
  }

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

    if (new_password !== retype_new_password) {
      return setAlertState({
        ...alertState,
        message: 'Passwords do not match.',
        alertType: 'danger'
      });
    }

    await forgotPasswordReset(retype_new_password);
  }

  return (
    <div className="bg-light">
      <Container>
        <Form className="form-signin pt-5" noValidate validated={validated} onSubmit={handleSubmit}>
          <h1 className="text-center font-weight-bold">Forgot Password</h1>
          <p className="text-center lead mb-3">Enter Email address associated with your account.</p>
          <Alert alertProp={alertState} />
          <hr />
          <ResetPasswordComponent data={formData} onChange={onChange} />
          <Button variant="primary btn-block mt-4" type="submit" >
            Rest Password
          </Button>
        </Form>
      </Container>
    </div>
  )
}

ResetPassword.propTypes = {
  setToast: PropTypes.func.isRequired,
  match: PropTypes.object.isRequired,
  history: PropTypes.object.isRequired
}

export default withRouter(connect(null, { setToast })(ResetPassword))
