import React, { useEffect } from 'react'
import PropTypes from 'prop-types'
import { Container, CardColumns, Card, Spinner } from 'react-bootstrap'
import { connect } from 'react-redux'
import NavBar from '../../dashboard/NavBar'
import { translationGetMyFiles } from '../../../actions/user_files'
import { diffForHumans, convertDate, timeSince } from '../../../utils/diffForHuman'
import Toast from '../../alerts/ToastComponent'

export const getColorType = (status) => {
  return status === 'assigned' ? 'primary' :
    status === 'under_translation' || status === 'under_review' ? 'secondary' : 'success'
}

const TranslateAssignments = ({ user_files: { loading, my_files }, translationGetMyFiles }) => {
  useEffect(() => {
    translationGetMyFiles();
  }, [translationGetMyFiles]);

  return (
    <>
      <NavBar />
      <Toast />
      <Container className="mt-3">
        <h1 className="display-4">My Assignments</h1>
        <hr />
        {loading ?
          <div className="d-flex justify-content-center">
            <Spinner animation="grow" role="status">
              <span className="sr-only">Loading...</span>
            </Spinner>
          </div> :
          <CardColumns>
            {my_files.map((item, index) => (
              item._id &&
              <Card key={index} border={getColorType(item.status)} >
                <Card.Link href={`/translate/assignments/${item._id}`}>
                  <Card.Header className={`text-${getColorType(item.status)}`}>{item._id}</Card.Header>
                </Card.Link>
                <Card.Body>
                  <Card.Title>Details</Card.Title>
                  <Card.Text>
                    <b>ID:</b> {item._id}<br />
                    <b>Status:</b> {item.status}<br />
                    {item.tamang_filename && <><b>Tamang Filename:</b> {item.tamang_filename}<br /></>}
                    {item.nepali_filename && <> <b>Nepali Filename:</b> {item.nepali_filename}<br /></>}
                    {!item.tamang_filename && !item.nepali_filename ? <> <b>Source File</b> {item.filename}<br /></> : ''}
                    <b># of Sentences:</b> {item.file_details && (item.file_details.end_index - item.file_details.start_index + 1)}<br />
                    <b>Assigned on:</b> {convertDate(item.assigned_date)}<br />
                    <b>Deadline:</b> {convertDate(item.deadline)}<br />
                    <b>{diffForHumans(item.deadline) === 'Overdue' ? 'Remarks:' : 'Remaining Time:'}</b> {diffForHumans(item.deadline)}<br />
                  </Card.Text>
                  {item.submitted_on && <Card.Text>
                    <small className="text-muted">Submitted: {timeSince(item.submitted_on)}</small>
                  </Card.Text>}
                  {!item.submitted_on && <Card.Text>
                    <small className="text-muted">Assigned: {timeSince(item.assigned_date)}</small>
                  </Card.Text>}
                </Card.Body>
              </Card>
            ))}
          </CardColumns>
        }
      </Container>
    </>
  )
}

TranslateAssignments.propTypes = {
  user_files: PropTypes.object.isRequired,
  translationGetMyFiles: PropTypes.func.isRequired
}

const mapStateToProps = state => ({
  user_files: state.user_files
});

export default connect(mapStateToProps, { translationGetMyFiles })(TranslateAssignments)
