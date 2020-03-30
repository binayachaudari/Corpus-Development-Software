import React, { useState } from 'react'
import PropTypes from 'prop-types'
import { Container, Form, Button } from 'react-bootstrap';
import Alert from '../../components/alerts/AlertComponent';
import ResetPasswordComponent from './ResetPasswordComponent';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { resetDefaultPassword } from '../../actions/auth';
import { setToast } from '../../actions/toast';

const ChangePassword = ({ auth: { user, loading }, history, resetDefaultPassword, setToast }) => {
  const [formData, setFormData] = useState({
    current_password: '',
    new_password: '',
    retype_new_password: '',
    validated: false
  });

  const [alertState, setAlertState] = useState({
    message: null,
    alertType: null,
    dismissible: true
  });

  const { current_password, new_password, retype_new_password, validated } = formData;

  const onChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
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
    const res = await resetDefaultPassword({ new_password });
    setToast('Password', res.message, 'success');
    if (res)
      history.push('/dashboard');
  }

  return (
    <div className="bg-light">
      <Container>
        <Form className="form-signin pt-5" noValidate validated={validated} onSubmit={handleSubmit}>
          <h1 className="text-center font-weight-bold">Change {!loading && !user.activated && `Your Default`} Password</h1>
          <p className="text-center lead mb-3">It's a good idea to use a strong password that you're not using elsewhere.</p>
          <Alert alertProp={alertState} />
          <hr />
          {!loading && user.activated &&
            < Form.Group controlId="current_password">
              <Form.Label>Current Password</Form.Label>
              <Form.Control type="password" placeholder="Current password" value={current_password} onChange={onChange} required minLength="8" />
              <Form.Control.Feedback>Looks good!</Form.Control.Feedback>
              <Form.Control.Feedback type="invalid">
                Please provide your current password.
          </Form.Control.Feedback>
            </Form.Group>
          }

          <ResetPasswordComponent data={formData} onChange={onChange}></ResetPasswordComponent>

          <Button variant="primary btn-block mt-4" type="submit" >
            Change Password
          </Button>
        </Form>
      </Container>
    </div >
  )
}

ChangePassword.propTypes = {
  resetDefaultPassword: PropTypes.func.isRequired,
  setToast: PropTypes.func.isRequired,
  history: PropTypes.object.isRequired
}

const mapStateToProps = state => ({
  auth: state.auth
})

export default withRouter(connect(mapStateToProps, { resetDefaultPassword, setToast })(ChangePassword))
