import React, { useState } from 'react'
import PropTypes from 'prop-types'
import { Container, Form, Button } from 'react-bootstrap';
import Alert from '../../components/alerts/AlertComponent';

const ChangePassword = props => {
  const [formData, setFormData] = useState({
    email: '',
    validated: false
  });

  const { email, validated } = formData;

  const onChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  }


  const handleSubmit = (e) => {
    e.preventDefault();
    const form = e.currentTarget;
    if (form.checkValidity() === false) {
      e.stopPropagation();
    }
    setFormData({ ...formData, validated: true });
  }

  return (
    <div className="bg-light">
      <Container>
        <Form className="form-signin pt-5" noValidate validated={validated} onSubmit={handleSubmit}>
          <h1 className="text-center font-weight-bold">Change Password</h1>
          <p className="text-center lead mb-3">It's a good idea to use a strong password that you're not using elsewhere.</p>
          {/* <Alert /> */}
          <hr />
          <Form.Group controlId="current_password">
            <Form.Label>Current Password</Form.Label>
            <Form.Control type="password" placeholder="Current password" required minLength="8" />
            <Form.Control.Feedback>Looks good!</Form.Control.Feedback>
            <Form.Control.Feedback type="invalid">
              Please provide your current password.
          </Form.Control.Feedback>
          </Form.Group>

          <Form.Group controlId="new_password">
            <Form.Label>New Password</Form.Label>
            <Form.Control type="password" placeholder="New password" required required minLength="8" />
            <Form.Control.Feedback>Looks good!</Form.Control.Feedback>
            <Form.Control.Feedback type="invalid">
              Please provide your new password.
          </Form.Control.Feedback>
            <Form.Text className="text-muted">
              A password must be minimum 8 character long.
              </Form.Text>
          </Form.Group>

          <Form.Group controlId="retype_new_password">
            <Form.Label>Retype Password</Form.Label>
            <Form.Control type="password" placeholder="Retype new password" required required minLength="8" />
            <Form.Control.Feedback>Looks good!</Form.Control.Feedback>
            <Form.Control.Feedback type="invalid">
              Retype your new password.
          </Form.Control.Feedback>
          </Form.Group>

          <Button variant="primary btn-block mt-4" type="submit" >
            Change Password
          </Button>
        </Form>
      </Container>
    </div>
  )
}

ChangePassword.propTypes = {

}

export default ChangePassword
