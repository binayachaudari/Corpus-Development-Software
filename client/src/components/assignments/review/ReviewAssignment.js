import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { Container, CardColumns, Card, Spinner } from 'react-bootstrap';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { reviewGetMyFiles } from '../../../actions/user_files';
import { diffForHumans, convertDate, timeSince } from '../../../utils/diffForHuman';
import { getColorType } from '../translate/TranslateAssignment';
import Toast from '../../alerts/ToastComponent';
import { slideInAnimationWithIndex } from '../../../utils/slideInAnimation';

const ReviewAssignment = ({ user_files: { loading, my_files }, reviewGetMyFiles }) => {
  useEffect(() => {
    reviewGetMyFiles();
  }, [reviewGetMyFiles]);

  return (
    <>
      <Toast />
      <Container className="mt-3">
        <h1 className="display-4 slidein__animation" style={{ animationDelay: '0.2s' }}>
          My Assignments
        </h1>
        <hr className="slidein__animation" style={{ animationDelay: '0.3s' }} />
        {loading ? (
          <div className="d-flex justify-content-center">
            <Spinner animation="grow" role="status">
              <span className="sr-only">Loading...</span>
            </Spinner>
          </div>
        ) : (
          <CardColumns>
            {my_files.map(
              (item, index) =>
                item._id && (
                  <Card key={index} border={getColorType(item.status)} {...slideInAnimationWithIndex(index, 0.4)}>
                    <Card.Link as={Link} to={`/review/assignments/${item._id}`}>
                      <Card.Header className={`text-${getColorType(item.status)}`}>{item._id}</Card.Header>
                    </Card.Link>
                    <Card.Body>
                      <Card.Title>Details</Card.Title>
                      <Card.Text>
                        <b>ID:</b> {item._id}
                        <br />
                        <b>Status:</b> {item.status}
                        <br />
                        <b>Tamang Filename:</b> {item.tamang_filename}
                        <br />
                        <b>Nepali Filename:</b> {item.nepali_filename}
                        <br />
                        <b># of Sentences:</b> {item.file_details.end_index - item.file_details.start_index + 1}
                        <br />
                        <b>Assigned on:</b> {convertDate(item.assigned_date)}
                        <br />
                        <b>Deadline:</b> {convertDate(item.deadline)}
                        <br />
                        <b>{diffForHumans(item.deadline) === 'Overdue' ? 'Remarks:' : 'Remaining Time:'}</b>{' '}
                        {diffForHumans(item.deadline)}
                        <br />
                      </Card.Text>
                      {item.submitted_on && (
                        <Card.Text>
                          <small className="text-muted">Submitted: {timeSince(item.submitted_on)}</small>
                        </Card.Text>
                      )}
                      {!item.submitted_on && (
                        <Card.Text>
                          <small className="text-muted">Assigned: {timeSince(item.assigned_date)}</small>
                        </Card.Text>
                      )}
                    </Card.Body>
                  </Card>
                )
            )}
          </CardColumns>
        )}
      </Container>
    </>
  );
};

ReviewAssignment.propTypes = {
  user_files: PropTypes.object.isRequired,
  reviewGetMyFiles: PropTypes.func.isRequired
};

const mapStateToProps = (state) => ({
  user_files: state.user_files
});

export default connect(mapStateToProps, { reviewGetMyFiles })(ReviewAssignment);
