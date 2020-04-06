import React, { useEffect } from 'react'
import PropTypes from 'prop-types'
import { Container, CardColumns, Card, Spinner } from 'react-bootstrap'
import { connect } from 'react-redux'
import NavBar from '../../dashboard/NavBar'
import { reviewGetMyFiles } from '../../../actions/user_files'
import { diffForHumans, convertDate, timeSince } from '../../../utils/diffForHuman'
import { getColorType } from '../translate/TranslateAssignment'

const ReviewAssignment = ({ user_files: { loading, my_files }, reviewGetMyFiles }) => {
  useEffect(() => {
    reviewGetMyFiles();
  }, [reviewGetMyFiles]);

  return (
    <>
      <NavBar />
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
            {my_files.map(({
              status, _id, nepali_filename, tamang_filename, assigned_date, deadline, submitted_on,
              file_details: {
                start_index, end_index
              }
            }, index) => (
                <Card border={getColorType(status)} >
                  <Card.Link href={`/review/assignments/${_id}`}>
                    <Card.Header className={`text-${getColorType(status)}`}>{_id}</Card.Header>
                  </Card.Link>
                  <Card.Body>
                    <Card.Title>Details</Card.Title>
                    <Card.Text>
                      <b>Status:</b> {status}<br />
                      <b>Tamang Filename:</b> {tamang_filename}<br />
                      <b>Nepali Filename:</b> {nepali_filename}<br />
                      <b># of Sentences:</b> {end_index - start_index + 1}<br />
                      <b>Assigned on:</b> {convertDate(assigned_date)}<br />
                      <b>Deadline:</b> {convertDate(deadline)}<br />
                      <b>{diffForHumans(deadline) === 'Overdue' ? 'Remarks:' : 'Remaining Time:'}</b> {diffForHumans(deadline)}<br />
                    </Card.Text>
                    {submitted_on && <Card.Text>
                      <small className="text-muted">Submitted: {timeSince(submitted_on)}</small>
                    </Card.Text>}
                    {!submitted_on && <Card.Text>
                      <small className="text-muted">Assigned: {timeSince(assigned_date)}</small>
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

ReviewAssignment.propTypes = {
  user_files: PropTypes.object.isRequired,
  reviewGetMyFiles: PropTypes.func.isRequired
}

const mapStateToProps = state => ({
  user_files: state.user_files
});

export default connect(mapStateToProps, { reviewGetMyFiles })(ReviewAssignment)
