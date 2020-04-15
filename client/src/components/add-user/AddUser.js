import React, { useState } from 'react'
import PropTypes from 'prop-types'
import { Container, Form, Col, Button } from 'react-bootstrap'
import Axios from 'axios'
import NavBar from '../dashboard/NavBar'
import Alert from '../alerts/AlertComponent'
import Toast from '../alerts/ToastComponent'
import { setToast } from '../../actions/toast'
import { connect } from 'react-redux'

const AddUser = ({ setToast }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '%6fYJ==f`&',
    role: null,
    show_password: false,
    change_default: false,
    validated: false
  });

  const [alertState, setAlertState] = useState({
    message: null,
    alertType: null,
    dismissible: true
  });

  const removeAlert = e => {
    setAlertState({ ...alertState, message: null });
    setFormData({ ...formData, [e.target.id]: e.target.value });
  }

  const toggleCheck = e => {
    setFormData({ ...formData, [e.target.id]: e.target.checked });
  }

  const { name, email, password, role, show_password, change_default, validated } = formData;

  const onChange = e => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  }

  const addUser = async () => {
    try {
      const res = await Axios.post('/api/users/add-user', formData);
      console.log(res);

      if (res.status === 200) {
        const { data: { user: { name, role, id } } } = res;
        setToast('User Added', `${name} (${role}) has been added with User ID =: ${id}`, `success`);
        setFormData({
          name: '',
          email: '',
          password: '%6fYJ==f`&',
          role: null,
          show_password: false,
          change_default: false,
          validated: false
        });
      }
    } catch (error) {
      setToast('Add User Failed', `${error.response.data.message} with that email address`, `danger`);
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
    if (!role)
      return setAlertState({
        ...alertState,
        message: `Choose Role of the user`,
        alertType: 'danger',
      });
    await addUser();
  }
  return (
    <>
      <NavBar />
      <Toast />
      <Container className="mt-3">
        <h1 className="display-4">Add New User</h1>
        <hr />
        <Alert alertProp={alertState} />
        <Form onSubmit={handleSubmit}>
          <Form.Row>
            <Form.Group as={Col} md="4" controlId="name">
              <Form.Label>Name</Form.Label>
              <Form.Control type="text" value={name} placeholder="Mr. Binaya Chaudhary" onChange={onChange} required></Form.Control>
              <Form.Text className="text-muted">
                Name is required.*
              </Form.Text>
            </Form.Group>

            <Form.Group as={Col} md="4" controlId="email">
              <Form.Label>Email</Form.Label>
              <Form.Control type="email" value={email} placeholder="example@ku.edu.np" onChange={onChange} required />
              <Form.Text className="text-muted">
                User Email is required.*
              </Form.Text>
            </Form.Group>
          </Form.Row>

          <Form.Row>
            <Form.Group as={Col} md="4" controlId="password">
              <Form.Label>Default Password</Form.Label>
              <Form.Control type={show_password ? 'text' : 'password'} value={password} onChange={onChange} readOnly={!change_default} />
            </Form.Group>
            <Form.Group as={Col} md="4" controlId="role">
              <Form.Label>Choose Role</Form.Label>
              <Form.Control as="select" onChange={removeAlert} required>
                {!role ? (<option value={null}>Choose Role</option>) : ''}
                <option value="Linguist">Linguist</option>
                <option value="Reviewer">Reviewer</option>
              </Form.Control>
              <Form.Text className="text-muted">
                User Role is required.*
              </Form.Text>
            </Form.Group>
          </Form.Row>
          <Form.Group controlId="show_password">
            <Form.Check type="checkbox" checked={show_password} onChange={toggleCheck} label="Show Default Password." />
          </Form.Group>
          <Form.Group controlId="change_default">
            <Form.Check type="checkbox" checked={change_default} onChange={toggleCheck} label="Change Default Password." />
          </Form.Group>
          <Button variant="success" type="submit">
            Add User
            </Button>
        </Form>
      </Container>
    </>
  )
}

AddUser.propTypes = {

}

export default connect(null, { setToast })(AddUser)
