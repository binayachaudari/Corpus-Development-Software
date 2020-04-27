import React from 'react'
import PropTypes from 'prop-types'
import { Tab, Col, Row, Nav } from 'react-bootstrap'
import { connect } from 'react-redux';
import FileStatusComponent from './FileStatusComponent'
import { reviewGetMyFiles } from '../../../actions/user_files'
import { slideInAnimation } from '../../../utils/slideInAnimation'

const assignedReviewHead = ['File ID', 'No. of Sentences', 'Assigned To',
  'Assigned By', 'Filenames', 'Assigned Date', 'Deadline', 'Remaining Time'];

const reviewCompleteHead = [...assignedReviewHead];
reviewCompleteHead[4] = 'Reviewed Filenames';

const ReviewerDashboardContents = ({ user_files: { loading, my_files }, reviewGetMyFiles }) => {

  const currentPill = localStorage.__currentRevPill__DASH || 'review_assigned_files';
  const onSelect = (pill) => {
    localStorage.setItem('__currentRevPill__DASH', pill);
  }

  return (
    <Tab.Container id="left-tabs-example" unmountOnExit={true} onSelect={onSelect} defaultActiveKey={currentPill}>
      <Row className="mt-5">
        <Col sm={2}>
          <Nav variant="pills" className="flex-column  mb-5 sticky-top">
            <Nav.Item>
              <Nav.Link eventKey="review_assigned_files" {...slideInAnimation(0.2)}>Review Assigned</Nav.Link>
            </Nav.Item>
            <Nav.Item>
              <Nav.Link eventKey="under_review" {...slideInAnimation(0.2)}>Under Review</Nav.Link>
            </Nav.Item>
            <Nav.Item>
              <Nav.Link eventKey="reviewed" {...slideInAnimation(0.2)}>Reviewed</Nav.Link>
            </Nav.Item>
          </Nav>
        </Col>
        <Col className="text-justify" sm={10}>
          <Tab.Content>
            <Tab.Pane eventKey="review_assigned_files" transition={false} {...slideInAnimation(0.3)}>
              <FileStatusComponent loadData={reviewGetMyFiles}
                headProps={assignedReviewHead}
                tableCaption="List of assigned files (Review)"
                dataFiles={my_files.filter(file => file.status === 'assigned')}
                loading={loading}
                showTab="review_assigned_files"
              />
            </Tab.Pane>
            <Tab.Pane eventKey="under_review" transition={false} {...slideInAnimation(0.3)}>
              <FileStatusComponent loadData={reviewGetMyFiles}
                headProps={assignedReviewHead}
                tableCaption="List of files Under-Review"
                dataFiles={my_files.filter(file => file.status === 'under_review')}
                loading={loading}
                showTab="under_review"
              />
            </Tab.Pane>
            <Tab.Pane eventKey="reviewed" transition={false} {...slideInAnimation(0.3)}>
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

ReviewerDashboardContents.propTypes = {
  user_files: PropTypes.object.isRequired,
  reviewGetMyFiles: PropTypes.func.isRequired
}

const mapStateToProps = state => ({
  user_files: state.user_files
})

export default connect(mapStateToProps, { reviewGetMyFiles })(ReviewerDashboardContents)
