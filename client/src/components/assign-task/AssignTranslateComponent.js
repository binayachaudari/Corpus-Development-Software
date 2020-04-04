import React, { useState, useEffect } from 'react'
import PropTypes from 'prop-types'
import { Form, Spinner, Col, Button } from 'react-bootstrap'
import { connect } from 'react-redux'
import { getAllUsers } from '../../actions/users';
import { getLastAssignedEndIndex } from '../../actions/files'
import Alert from '../alerts/AlertComponent'

const AssignTranslateComponent = ({ users: { loading, all_users }, getAllUsers, getLastAssignedEndIndex }) => {
  const [startIndex, setStartIndex] = useState(0);
  const today = new Date();
  const dateToday = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;
  const [dateTime, setDateTime] = useState({
    date: dateToday,
    time: today.toLocaleString('en', { hour: '2-digit', minute: '2-digit', hour12: false })
  })

  const [formData, setFormData] = useState({
    source_filename: `sourceFile.txt`,
    start_index: null,
    end_index: null,
    assigned_to: null,
    deadline: `${dateTime.date} ${dateTime.time}`
  });

  const changeDateTime = e => {
    setDateTime({ ...dateTime, [e.target.id]: e.target.value });
    setFormData({ ...formData, deadline: `${dateTime.date} ${dateTime.time}` });
  }

  const getFormData = e => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
    setAlertState({ ...alertState, message: null })
  }

  const fetchData = async () => {
    const result = await getLastAssignedEndIndex();
    setStartIndex(result);
    setFormData({ ...formData, start_index: result + 1, end_index: result + 10 })
  };

  useEffect(() => {
    getAllUsers();
    fetchData();
  }, []);

  const [alertState, setAlertState] = useState({
    message: null,
    alertType: null,
    dismissible: true
  });

  const handleSubmit = e => {
    e.preventDefault();

    if (!formData.assigned_to)
      return setAlertState({
        ...alertState,
        message: `Choose name to assign task`,
        alertType: 'danger',
      });
  }

  return (
    <>{loading ?
      <div className="mt-3 d-flex justify-content-center">
        <Spinner animation="grow" role="status">
          <span className="sr-only">Loading...</span>
        </Spinner>
      </div> :
      <>
        <Alert alertProp={alertState} />
        <Form noValidate onSubmit={handleSubmit}>
          <Form.Row>
            <Form.Group as={Col} md="4" controlId="assigned_to">
              <Form.Label>Name</Form.Label>
              <Form.Control as="select" onChange={getFormData} required>
                {!formData.assigned_to ? (<option value={null}>Choose Name</option>) : ''}
                {all_users.filter(item => item.role === 'Linguist').map((linguist, index) => (
                  <option key={index} value={linguist._id}>{linguist.name}</option>
                ))}
              </Form.Control>
            </Form.Group>

            <Form.Group as={Col} md="4" controlId="email">
              <Form.Label>Email</Form.Label>
              <Form.Control type="email" value={all_users
                .find(obj => obj._id === formData.assigned_to) ?
                all_users
                  .find(obj => obj._id === formData.assigned_to).email : 'example@ku.edu.np'} readOnly />
            </Form.Group>
          </Form.Row>

          <Form.Row>
            <Form.Group as={Col} md="4" controlId="user_id">
              <Form.Label>User ID</Form.Label>
              <Form.Control type="text" value={formData.assigned_to ? formData.assigned_to : 'User ID'} readOnly />
            </Form.Group>
            <Form.Group as={Col} md="4" controlId="source_filename">
              <Form.Label>Source Filename</Form.Label>
              <Form.Control type="text" value={formData.source_filename} readOnly />
            </Form.Group>
          </Form.Row>

          <Form.Row>
            <Form.Group as={Col} md="2" controlId="start_index">
              <Form.Label>Start Index</Form.Label>
              <Form.Control type="number" value={startIndex + 1} readOnly />
            </Form.Group>

            <Form.Group as={Col} md="2" controlId="end_index">
              <Form.Label>End Index</Form.Label>
              <Form.Control type="number" value={startIndex + 10} onChange={getFormData} required />
            </Form.Group>

            <Form.Group as={Col} md="8">
              <Form.Label>Deadline</Form.Label>
              <Form.Row>
                <Form.Group as={Col} md="4" controlId="date">
                  <Form.Control type="date" value={dateTime.date} min={dateToday}
                    onChange={changeDateTime} required />
                </Form.Group>
                <Form.Group as={Col} md="4" controlId="time">
                  <Form.Control type="time" value={dateTime.time} onChange={changeDateTime} required />
                </Form.Group>
              </Form.Row>
            </Form.Group>
          </Form.Row>
          <Button variant="success" type="submit">
            Assign Task
            </Button>
        </Form>
      </>
    }
    </>
  )
}

AssignTranslateComponent.propTypes = {
  users: PropTypes.object.isRequired,
  getAllUsers: PropTypes.func.isRequired,
  getLastAssignedEndIndex: PropTypes.func.isRequired,
}

const mapStateToProps = state => ({
  users: state.users
})

export default connect(mapStateToProps, { getAllUsers, getLastAssignedEndIndex })(AssignTranslateComponent)
