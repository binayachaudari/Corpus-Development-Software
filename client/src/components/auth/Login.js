import React from 'react';
import { Container, Form, Button } from 'react-bootstrap';

const Login = () => {
  return (
    <Container>
      <Form className="form-signin align-self-center mt-5">
        <h1 className="text-center font-weight-bold">Sign in</h1>
        <h4 className="text-center text-muted mb-3">Sign into your account.</h4>
        <hr></hr>
        <Form.Group controlId='formBasicEmail'>
          <Form.Label>Email address</Form.Label>
          <Form.Control type="email" placeholder="Enter email" />
          <Form.Text className="text-muted">
            We'll never share your email with anyone else.
    </Form.Text>
        </Form.Group>

        <Form.Group controlId="formBasicPassword">
          <Form.Label>Password</Form.Label>
          <Form.Control type="password" placeholder="Password" />
        </Form.Group>
        <Button variant="primary btn-block" type="submit">
          Submit
  </Button>

        <p className="text-center mt-3 text-primary"><a href="#">Forget Password?</a></p>

      </Form>
    </Container>
  );
}

export default Login;