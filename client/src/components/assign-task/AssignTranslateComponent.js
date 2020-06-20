import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { Form, Spinner, Col, Button } from 'react-bootstrap';
import { connect } from 'react-redux';
import { getAllUsers } from '../../actions/users';
import { getLastAssignedEndIndex, assignTranslationTask, getNumOfLines } from '../../actions/files';
import Alert from '../alerts/AlertComponent';
import { slideInAnimation } from '../../utils/slideInAnimation';

const AssignTranslateComponent = ({
  users: { loading, all_users },
  getAllUsers,
  getLastAssignedEndIndex,
  assignTranslationTask
}) => {
  let [maxEndIndex, setMaxEndIndex] = useState(localStorage.__total__lines || '');
  const getMaxLines = async () => {
    const lines = await getNumOfLines();
    localStorage.setItem('__total__lines', lines);
    setMaxEndIndex(lines);
  };

  useEffect(() => {
    getMaxLines();
  }, []);

  const [startIndex, setStartIndex] = useState(-1);
  const today = new Date();
  const dateToday = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(
    today.getDate()
  ).padStart(2, '0')}`;

  const [formData, setFormData] = useState({
    source_filename: `sourceFile.txt`,
    start_index: 0,
    end_index: 0,
    assigned_to: null,
    date: dateToday,
    time: today.toLocaleString('en', { hour: '2-digit', minute: '2-digit', hour12: false })
  });

  const [NumberOfLines, setNumberOfLines] = useState(10);

  const getFormData = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.valueAsNumber || e.target.value });
    setAlertState({ ...alertState, message: null });
  };

  useEffect(() => {
    setNumberOfLines(formData.end_index - formData.start_index + 1);
  }, [formData.end_index, formData.start_index]);

  const fetchData = async () => {
    const result = await getLastAssignedEndIndex();
    setStartIndex(result);
    setFormData({ ...formData, start_index: result + 1, end_index: result + 10 });
    if (!result) return setFormData({ ...formData, start_index: startIndex + 1, end_index: startIndex + 10 });
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

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!formData.assigned_to)
      return setAlertState({
        ...alertState,
        message: `Choose name to assign task`,
        alertType: 'danger'
      });

    if (formData.start_index > formData.end_index)
      return setAlertState({
        ...alertState,
        message: `Start Index is greater than End Index`,
        alertType: 'danger'
      });

    if (formData.end_index > maxEndIndex)
      return setAlertState({
        ...alertState,
        message: `Maximum value for End Index is ${maxEndIndex}`,
        alertType: 'danger'
      });

    assignTranslationTask(formData);
  };

  return (
    <>
      {loading ? (
        <div className="mt-3 d-flex justify-content-center">
          <Spinner animation="grow" role="status">
            <span className="sr-only">Loading...</span>
          </Spinner>
        </div>
      ) : (
        <>
          <Alert alertProp={alertState} />
          <Form noValidate onSubmit={handleSubmit} className="pb-5">
            <Form.Row>
              <Form.Group as={Col} md="4" controlId="assigned_to" {...slideInAnimation(0.2)}>
                <Form.Label>Name</Form.Label>
                <Form.Control as="select" onChange={getFormData} required>
                  {!formData.assigned_to ? <option value={null}>Choose Name</option> : ''}
                  {all_users
                    .filter((item) => item.role === 'Linguist')
                    .map((linguist, index) => (
                      <option key={index} value={linguist._id}>
                        {linguist.name}
                      </option>
                    ))}
                </Form.Control>
                <Form.Text className="text-muted">Name is required.*</Form.Text>
              </Form.Group>

              <Form.Group as={Col} md="4" controlId="email" {...slideInAnimation(0.3)}>
                <Form.Label>Email</Form.Label>
                <Form.Control
                  type="email"
                  value={
                    all_users.find((obj) => obj._id === formData.assigned_to)
                      ? all_users.find((obj) => obj._id === formData.assigned_to).email
                      : 'example@ku.edu.np'
                  }
                  readOnly
                />
              </Form.Group>
            </Form.Row>

            <Form.Row>
              <Form.Group as={Col} md="4" controlId="user_id" {...slideInAnimation(0.4)}>
                <Form.Label>User ID</Form.Label>
                <Form.Control type="text" value={formData.assigned_to ? formData.assigned_to : 'User ID'} readOnly />
              </Form.Group>
              <Form.Group as={Col} md="4" controlId="source_filename" {...slideInAnimation(0.5)}>
                <Form.Label>Source Filename</Form.Label>
                <Form.Control type="text" value={formData.source_filename} readOnly />
              </Form.Group>
            </Form.Row>

            <Form.Row>
              <Form.Group as={Col} md="2" controlId="start_index" {...slideInAnimation(0.6)}>
                <Form.Label>Start Index</Form.Label>
                <Form.Control type="number" value={formData.start_index} readOnly />
              </Form.Group>

              <Form.Group as={Col} md="2" controlId="end_index" {...slideInAnimation(0.7)}>
                <Form.Label>End Index</Form.Label>
                <Form.Control
                  type="number"
                  value={Number(formData.end_index) || 0}
                  min={formData.start_index}
                  max={maxEndIndex}
                  onChange={getFormData}
                  required
                />
                <Form.Text className="text-muted">
                  End index must be greater than Start Index.
                  <p className="text-info font-weight-bold"> MAX: {maxEndIndex}</p>
                </Form.Text>
              </Form.Group>

              <Form.Group as={Col} md="2" controlId="num_of_sentences" {...slideInAnimation(0.8)}>
                <Form.Label>Number of lines</Form.Label>
                <Form.Control type="number" value={NumberOfLines} readOnly />
                <Form.Text className="text-muted">Total number of lines to be assigned.</Form.Text>
              </Form.Group>
            </Form.Row>

            <Form.Row>
              <Form.Group as={Col} md="8">
                <Form.Label {...slideInAnimation(0.9)}>Deadline</Form.Label>
                <Form.Row>
                  <Form.Group as={Col} md="4" controlId="date" {...slideInAnimation(1)}>
                    <Form.Control type="date" value={formData.date} min={dateToday} onChange={getFormData} required />
                    <Form.Text className="text-muted">Date is required.*</Form.Text>
                  </Form.Group>
                  <Form.Group as={Col} md="4" controlId="time" {...slideInAnimation(1.1)}>
                    <Form.Control type="time" value={formData.time} onChange={getFormData} required />
                    <Form.Text className="text-muted">Time is required.*</Form.Text>
                  </Form.Group>
                </Form.Row>
              </Form.Group>
            </Form.Row>
            <Button variant="success" type="submit" {...slideInAnimation(1.4)}>
              Assign Translation Task
            </Button>
          </Form>
        </>
      )}
    </>
  );
};

AssignTranslateComponent.propTypes = {
  users: PropTypes.object.isRequired,
  getAllUsers: PropTypes.func.isRequired,
  getLastAssignedEndIndex: PropTypes.func.isRequired,
  assignTranslationTask: PropTypes.func.isRequired
};

const mapStateToProps = (state) => ({
  users: state.users
});

export default connect(mapStateToProps, { getAllUsers, getLastAssignedEndIndex, assignTranslationTask })(
  AssignTranslateComponent
);
