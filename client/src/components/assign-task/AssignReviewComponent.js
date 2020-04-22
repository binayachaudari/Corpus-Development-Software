import React, { useState, useEffect, createRef } from 'react'
import PropTypes from 'prop-types'
import { Form, Spinner, Col, Button } from 'react-bootstrap'
import { connect } from 'react-redux'
import { getTranslatedFiles } from '../../actions/files'
import { getAllUsers } from '../../actions/users';
import Alert from '../alerts/AlertComponent'
import { assignReviewTask } from '../../actions/files'
import { slideInAnimation } from '../../utils/slideInAnimation'

const AssignReviewComponent = ({ users: { loading, all_users },
  translatedFiles, getTranslatedFiles, getAllUsers, assignReviewTask }) => {

  const spinner = createRef();

  useEffect(() => {
    getAllUsers();
    getTranslatedFiles();
  }, []);

  const today = new Date();
  const dateToday = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;


  const [formData, setFormData] = useState({
    file_id: null,
    assigned_to: null,
    date: dateToday,
    time: today.toLocaleString('en', { hour: '2-digit', minute: '2-digit', hour12: false })
  });

  const getFormData = e => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
    setAlertState({ ...alertState, message: null })
  }

  const calculateNumOfSentences = (fileID) => {
    if (translatedFiles.length > 0 && fileID) {
      let { start_index, end_index } = translatedFiles.find(obj => obj._id === fileID);
      return end_index - start_index + 1;
    }
    return 0;
  }

  const [alertState, setAlertState] = useState({
    message: null,
    alertType: null,
    dismissible: true
  });

  const handleSubmit = e => {
    e.preventDefault();

    if (!formData.assigned_to || !formData.file_id)
      return setAlertState({
        ...alertState,
        message: `Name and File name are required to assign task`,
        alertType: 'danger',
      });

    assignReviewTask(formData);
  }

  return (
    <>
      {loading ?
        <div className="mt-3 d-flex justify-content-center">
          <Spinner ref={spinner} animation="grow" role="status">
            <span className="sr-only">Loading...</span>
          </Spinner>
        </div> :
        <>
          <Alert alertProp={alertState} />
          <Form onSubmit={handleSubmit} className="pb-5">
            <Form.Row>
              <Form.Group as={Col} md="4" controlId="assigned_to" {...slideInAnimation(0.2)}>
                <Form.Label>Name</Form.Label>
                <Form.Control as="select" onChange={getFormData} required>
                  {!formData.assigned_to ? (<option value={null}>Choose Name</option>) : ''}
                  {all_users.filter(item => item.role === 'Reviewer').map((reviewer, index) => (
                    <option key={index} value={reviewer._id}>{reviewer.name}</option>
                  ))}
                </Form.Control>
                <Form.Text className="text-muted">
                  Name is required.*
              </Form.Text>
              </Form.Group>

              <Form.Group as={Col} md="4" controlId="email" {...slideInAnimation(0.3)}>
                <Form.Label>Email</Form.Label>
                <Form.Control type="text" value={all_users
                  .find(obj => obj._id === formData.assigned_to) ?
                  all_users
                    .find(obj => obj._id === formData.assigned_to).email : 'example@ku.edu.np'} readOnly />
              </Form.Group>

              <Form.Group as={Col} md="4" controlId="user_id" {...slideInAnimation(0.4)}>
                <Form.Label>User ID</Form.Label>
                <Form.Control type="text" value={formData.assigned_to ? formData.assigned_to : 'User ID'} readOnly />
              </Form.Group>
            </Form.Row>

            <Form.Row>
              <Form.Group as={Col} md="4" controlId="file_id" {...slideInAnimation(0.5)}>
                <Form.Label>Filename</Form.Label>
                <Form.Control as="select" onChange={getFormData} required>
                  {!formData.file_id ? (<option value={null}>Choose Filename</option>) : ''}
                  {translatedFiles && translatedFiles.map((file, index) => (file._id &&
                    < option key={index} value={file._id} > {file.filename}</option>
                  ))}
                </Form.Control>
                <Form.Text className="text-muted">
                  Select filename to assign, required.*
              </Form.Text>
              </Form.Group>
              <Form.Group as={Col} md="4" controlId="filename_id" {...slideInAnimation(0.6)}>
                <Form.Label>File ID</Form.Label>
                <Form.Control type="text" value={formData.file_id ? formData.file_id : 'File ID'} readOnly />
              </Form.Group>
            </Form.Row>

            <Form.Row>
              <Form.Group as={Col} md="2" controlId="start_index" {...slideInAnimation(0.7)}>
                <Form.Label>Start Index</Form.Label>
                <Form.Control type="number" value={translatedFiles && translatedFiles
                  .find(obj => obj._id === formData.file_id) ?
                  translatedFiles
                    .find(obj => obj._id === formData.file_id).start_index : 0} readOnly />
              </Form.Group>

              <Form.Group as={Col} md="2" controlId="end_index" {...slideInAnimation(0.8)}>
                <Form.Label>End Index</Form.Label>
                <Form.Control type="number" value={translatedFiles && translatedFiles
                  .find(obj => obj._id === formData.file_id) ?
                  translatedFiles
                    .find(obj => obj._id === formData.file_id).end_index : 0} readOnly />
              </Form.Group>

              <Form.Group as={Col} md="2" controlId="num_of_sentences" {...slideInAnimation(0.9)}>
                <Form.Label>Number of lines</Form.Label>
                <Form.Control type="number" value={calculateNumOfSentences(formData.file_id)} readOnly />
              </Form.Group>

              <Form.Group as={Col} md="8">
                <Form.Label {...slideInAnimation(1)}>Deadline</Form.Label>
                <Form.Row>
                  <Form.Group as={Col} md="4" controlId="date" {...slideInAnimation(1.1)}>
                    <Form.Control type="date" value={formData.date} min={dateToday}
                      onChange={getFormData} required />
                    <Form.Text className="text-muted">
                      Date is required.*
                    </Form.Text>
                  </Form.Group>
                  <Form.Group as={Col} md="4" controlId="time" {...slideInAnimation(1.2)}>
                    <Form.Control type="time" value={formData.time} onChange={getFormData} required />
                    <Form.Text className="text-muted">
                      Time is required.*
                    </Form.Text>
                  </Form.Group>
                </Form.Row>
              </Form.Group>
            </Form.Row>
            <Button variant="primary" type="submit" {...slideInAnimation(1.4)}>
              Assign Review Task
        </Button>
          </Form>
        </>
      }
    </>
  )
}

AssignReviewComponent.propTypes = {
  users: PropTypes.object.isRequired,
  translatedFiles: PropTypes.array,
  getTranslatedFiles: PropTypes.func.isRequired,
  getAllUsers: PropTypes.func.isRequired,
  assignReviewTask: PropTypes.func.isRequired
}

const mapStateToProps = state => ({
  users: state.users,
  translatedFiles: state.files.translatedFiles
})

export default connect(mapStateToProps, { getTranslatedFiles, getAllUsers, assignReviewTask })(AssignReviewComponent)


