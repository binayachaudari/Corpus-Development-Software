import React, { useState } from 'react'
import PropTypes from 'prop-types'
import { Tab, Col, Row, Nav } from 'react-bootstrap'
import FileStatusComponent from './FileStatusComponent'
import { getTranslationFiles, getReviewFiles } from '../../actions/files'
import { connect } from 'react-redux'


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
  const currentPill = localStorage.__currentPill || 'translation_assigned_files';
  const onSelect = (pill) => {
    localStorage.setItem('__currentPill', pill);
  }
  return (
    <Tab.Container id="left-tabs-example" unmountOnExit={true} onSelect={onSelect} defaultActiveKey={currentPill}>
      <Row className="mt-5">
        <Col sm={2}>
          <Nav variant="pills" className="flex-column">
            <Nav.Item>
              <Nav.Link eventKey="translation_assigned_files" >Translation Assigned</Nav.Link>
            </Nav.Item>

            <Nav.Item>
              <Nav.Link eventKey="review_assigned_files">Review Assigned</Nav.Link>
            </Nav.Item>


            <Nav.Item>
              <Nav.Link eventKey="under_translation">Under Translation</Nav.Link>
            </Nav.Item>

            <Nav.Item>
              <Nav.Link eventKey="under_review">Under Review</Nav.Link>
            </Nav.Item>

            <Nav.Item>
              <Nav.Link eventKey="translated">Translated</Nav.Link>
            </Nav.Item>

            <Nav.Item>
              <Nav.Link eventKey="reviewed">Reviewed</Nav.Link>
            </Nav.Item>
          </Nav>
        </Col>
        <Col className="text-justify" sm={10}>
          <Tab.Content>
            <Tab.Pane eventKey="translation_assigned_files">
              <FileStatusComponent loadData={getTranslationFiles}
                headProps={assignedTranslationHead}
                tableCaption="List of assigned files (Translation)"
                dataFiles={files.translationFiles.filter(file => file.status === 'assigned')}
                loading={files.loading}
                showTab="translation_assigned_files"
              />
            </Tab.Pane>
            <Tab.Pane eventKey="review_assigned_files">
              <FileStatusComponent loadData={getReviewFiles}
                headProps={assignedReviewHead}
                tableCaption="List of assigned files (Review)"
                dataFiles={files.reviewFiles.filter(file => file.status === 'assigned')}
                loading={files.loading}
                showTab="review_assigned_files"
              />
            </Tab.Pane>
            <Tab.Pane eventKey="under_translation">
              <FileStatusComponent loadData={getTranslationFiles}
                headProps={assignedTranslationHead}
                tableCaption="Files that are under translation"
                dataFiles={files.translationFiles.filter(file => file.status === 'under_translation')}
                loading={files.loading}
                showTab="under_translation"
              />
            </Tab.Pane>
            <Tab.Pane eventKey="under_review">
              <FileStatusComponent loadData={getReviewFiles}
                headProps={assignedReviewHead}
                tableCaption="Files that are under Review"
                dataFiles={files.reviewFiles.filter(file => file.status === 'under_review')}
                loading={files.loading}
                showTab="under_review"
              />
            </Tab.Pane>
            <Tab.Pane eventKey="translated">
              <FileStatusComponent loadData={getTranslationFiles}
                headProps={translationCompleteHead}
                tableCaption="Files that Translated"
                dataFiles={files.translationFiles.filter(file => file.status === 'translation_complete')}
                loading={files.loading}
                showTab="translated"
              />
            </Tab.Pane>
            <Tab.Pane eventKey="reviewed">
              <FileStatusComponent loadData={getReviewFiles}
                headProps={reviewCompleteHead}
                tableCaption="Files that Reviewed"
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
