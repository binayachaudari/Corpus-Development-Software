import React from 'react'
import PropTypes from 'prop-types'
import { Tab, Col, Row, Nav } from 'react-bootstrap'
import FileStatusComponent from './FileStatusComponent'
import { getTranslationFiles, getReviewFiles } from '../../../actions/files'
import { connect } from 'react-redux'
import { slideInAnimation } from '../../../utils/slideInAnimation'

const assignedTranslationHead = ['File ID', 'No. of Sentences', 'Assigned To',
  'Assigned By', 'Filename', 'Assigned Date', 'Deadline', 'Remaining Time'];

const assignedReviewHead = [...assignedTranslationHead];
assignedReviewHead[4] = 'Filenames';

const translationCompleteHead = [...assignedTranslationHead];
translationCompleteHead[4] = 'Translated Filenames';
translationCompleteHead[5] = 'Submitted';
translationCompleteHead[7] = 'Remarks';

const reviewCompleteHead = [...translationCompleteHead];
reviewCompleteHead[4] = 'Reviewed Filenames';


const DashboardContents = ({ getTranslationFiles, getReviewFiles, files }) => {
  const currentPill = localStorage.__currentPill__DASH || 'translation_assigned_files';
  const onSelect = (pill) => {
    localStorage.setItem('__currentPill__DASH', pill);
  }

  return (
    <Tab.Container id="left-tabs-example" unmountOnExit={true} onSelect={onSelect} defaultActiveKey={currentPill}>
      <Row className="mt-5">
        <Col sm={2}>
          <Nav variant="pills" className="flex-column mb-5 sticky-top">
            <Nav.Item {...slideInAnimation(0.2)}>
              <Nav.Link eventKey="translation_assigned_files" >Translation Assigned</Nav.Link>
            </Nav.Item>
            <Nav.Item {...slideInAnimation(0.4)}>
              <Nav.Link eventKey="review_assigned_files">Review Assigned</Nav.Link>
            </Nav.Item>
            <Nav.Item {...slideInAnimation(0.6)}>
              <Nav.Link eventKey="under_translation">Under Translation</Nav.Link>
            </Nav.Item>
            <Nav.Item {...slideInAnimation(0.8)}>
              <Nav.Link eventKey="under_review">Under Review</Nav.Link>
            </Nav.Item>
            <Nav.Item {...slideInAnimation(1)}>
              <Nav.Link eventKey="translated">Translated</Nav.Link>
            </Nav.Item>
            <Nav.Item {...slideInAnimation(1.2)}>
              <Nav.Link eventKey="reviewed">Reviewed</Nav.Link>
            </Nav.Item>
          </Nav>
        </Col>
        <Col className="text-justify" sm={10}>
          <Tab.Content>
            <Tab.Pane eventKey="translation_assigned_files" {...slideInAnimation(0.3)}>
              <FileStatusComponent loadData={getTranslationFiles}
                headProps={assignedTranslationHead}
                tableCaption="List of assigned files (Translation)"
                dataFiles={files.translationFiles.filter(file => file.status === 'assigned')}
                loading={files.loading}
                showTab="translation_assigned_files"
              />
            </Tab.Pane>
            <Tab.Pane eventKey="review_assigned_files" {...slideInAnimation(0.3)}>
              <FileStatusComponent loadData={getReviewFiles}
                headProps={assignedReviewHead}
                tableCaption="List of assigned files (Review)"
                dataFiles={files.reviewFiles.filter(file => file.status === 'assigned')}
                loading={files.loading}
                showTab="review_assigned_files"
              />
            </Tab.Pane>
            <Tab.Pane eventKey="under_translation" {...slideInAnimation(0.3)}>
              <FileStatusComponent loadData={getTranslationFiles}
                headProps={assignedTranslationHead}
                tableCaption="List of files Under-Translation"
                dataFiles={files.translationFiles.filter(file => file.status === 'under_translation')}
                loading={files.loading}
                showTab="under_translation"
              />
            </Tab.Pane>
            <Tab.Pane eventKey="under_review" {...slideInAnimation(0.3)}>
              <FileStatusComponent loadData={getReviewFiles}
                headProps={assignedReviewHead}
                tableCaption="List of files Under-Review"
                dataFiles={files.reviewFiles.filter(file => file.status === 'under_review')}
                loading={files.loading}
                showTab="under_review"
              />
            </Tab.Pane>
            <Tab.Pane eventKey="translated" {...slideInAnimation(0.3)}>
              <FileStatusComponent loadData={getTranslationFiles}
                headProps={translationCompleteHead}
                tableCaption="List of Translated Files"
                dataFiles={files.translationFiles.filter(file => file.status === 'translation_complete')}
                loading={files.loading}
                showTab="translated"
              />
            </Tab.Pane>
            <Tab.Pane eventKey="reviewed" {...slideInAnimation(0.3)}>
              <FileStatusComponent loadData={getReviewFiles}
                headProps={reviewCompleteHead}
                tableCaption="List of Reviewed Files"
                dataFiles={files.reviewFiles.filter(file => file.status === 'review_complete')}
                loading={files.loading}
                showTab="reviewed"
              />
            </Tab.Pane>
          </Tab.Content>
        </Col>
      </Row>
    </Tab.Container>
  )
}

DashboardContents.propTypes = {
  files: PropTypes.object.isRequired,
  getTranslationFiles: PropTypes.func.isRequired,
  getReviewFiles: PropTypes.func.isRequired
}

const mapStateToProps = state => ({
  files: state.files
})

export default connect(mapStateToProps, { getTranslationFiles, getReviewFiles })(DashboardContents)
