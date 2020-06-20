import React from 'react'
import { Form } from 'react-bootstrap'
import { slideInAnimation } from '../../utils/slideInAnimation'

export const ResetPasswordComponent = ({ onChange, data: { new_password, retype_new_password } }) => {
  return (
    <>
      <Form.Group controlId="new_password" {...slideInAnimation(0.9)}>
        <Form.Label>New Password</Form.Label>
        <Form.Control type="password" placeholder="New password" value={new_password} onChange={onChange} required minLength="8" />
        <Form.Control.Feedback>Looks good!</Form.Control.Feedback>
        <Form.Control.Feedback type="invalid">
          Please provide your new password.
          </Form.Control.Feedback>
        <Form.Text className="text-muted">
          A password must be minimum 8 character long.
              </Form.Text>
      </Form.Group>

      <Form.Group controlId="retype_new_password" {...slideInAnimation(1.1)}>
        <Form.Label>Retype Password</Form.Label>
        <Form.Control type="password" placeholder="Retype new password" value={retype_new_password} onChange={onChange} required minLength="8" />
        <Form.Control.Feedback>Looks good!</Form.Control.Feedback>
        <Form.Control.Feedback type="invalid">
          Retype your new password.
          </Form.Control.Feedback>
        <Form.Text className="text-muted">
          Renter your new password
              </Form.Text>
      </Form.Group>
    </>
  )
}
export default ResetPasswordComponent
