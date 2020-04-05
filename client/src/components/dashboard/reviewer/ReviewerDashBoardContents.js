import React, { useEffect } from 'react'
import PropTypes from 'prop-types'
import { Tab, Col, Row, Nav } from 'react-bootstrap'
import { connect } from 'react-redux';
import FileStatusComponent from './FileStatusComponent'
import { reviewGetMyFiles } from '../../../actions/user_files'


const assignedReviewHead = ['File ID', 'No. of Sentences', 'Assigned To',
  'Assigned By', 'Filenames', 'Assigned Date', 'Deadline', 'Remaining Time'];

const reviewCompleteHead = [...assignedReviewHead];
reviewCompleteHead[4] = 'Reviewed Filenames';

const ReviewerDashBoardContents = ({ user_files: { loading, my_files }, reviewGetMyFiles }) => {

  const currentPill = localStorage.__currentRevPill__DASH || 'review_assigned_files';
  const onSelect = (pill) => {
    localStorage.setItem('__currentRevPill__DASH', pill);
  }

  return (
    <Tab.Container id="left-tabs-example" unmountOnExit={true} onSelect={onSelect} defaultActiveKey={currentPill}>
      <Row className="mt-5">
        <Col sm={2}>
          <Nav variant="pills" className="flex-column position-fixed">
            <Nav.Item>
              <Nav.Link eventKey="review_assigned_files">Review Assigned</Nav.Link>
            </Nav.Item>
            <Nav.Item>
              <Nav.Link eventKey="under_review">Under Review</Nav.Link>
            </Nav.Item>
            <Nav.Item>
              <Nav.Link eventKey="reviewed">Reviewed</Nav.Link>
            </Nav.Item>
          </Nav>
        </Col>
        <Col className="text-justify" sm={10}>
          <Tab.Content>
            <Tab.Pane eventKey="review_assigned_files">
              <FileStatusComponent loadData={reviewGetMyFiles}
                headProps={assignedReviewHead}
                tableCaption="List of assigned files (Review)"
                dataFiles={my_files.filter(file => file.status === 'assigned')}
                loading={loading}
                showTab="review_assigned_files"
              />
            </Tab.Pane>
            <Tab.Pane eventKey="under_review">
              <FileStatusComponent loadData={reviewGetMyFiles}
                headProps={assignedReviewHead}
                tableCaption="List of files Under-Review"
                dataFiles={my_files.filter(file => file.status === 'under_review')}
                loading={loading}
                showTab="under_review"
              />
            </Tab.Pane>
            <Tab.Pane eventKey="reviewed">
              <FileStatusComponent loadData={reviewGetMyFiles}
                headProps={reviewCompleteHead}
                tableCaption="List of Reviewed Files"
                dataFiles={my_files.filter(file => file.status === 'review_complete')}
                loading={loading}
                showTab="reviewed"
              />
            </Tab.Pane>
          </Tab.Content>
        </Col>
      </Row>
    </Tab.Container>
  )
}

ReviewerDashBoardContents.propTypes = {
  user_files: PropTypes.object.isRequired,
  reviewGetMyFiles: PropTypes.func.isRequired
}

const mapStateToProps = state => ({
  user_files: state.user_files
})

export default connect(mapStateToProps, { reviewGetMyFiles })(ReviewerDashBoardContents)
