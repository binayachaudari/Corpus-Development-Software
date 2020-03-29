import React, { useState } from 'react'
import PropTypes from 'prop-types'
import { Container, Form, Button } from 'react-bootstrap';
import Alert from '../alerts/AlertComponent';


const ForgotPassword = () => {
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
          <h1 className="text-center font-weight-bold">Forgot Password</h1>
          <p className="text-center lead mb-3">Enter Email address associated with your account.</p>
          {/* <Alert /> */}
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

}


export default ForgotPassword
