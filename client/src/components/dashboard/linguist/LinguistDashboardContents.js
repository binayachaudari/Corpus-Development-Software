import React from 'react'
import PropTypes from 'prop-types'
import { Tab, Col, Row, Nav } from 'react-bootstrap'
import { connect } from 'react-redux';
import FileStatusComponent from './FileStatusComponent'
import { translationGetMyFiles } from '../../../actions/user_files'
import { slideInAnimation } from '../../../utils/slideInAnimation'

const assignedTranslationHead = ['File ID', 'No. of Sentences', 'Assigned To',
  'Assigned By', 'Filename', 'Assigned Date', 'Deadline', 'Remaining Time'];

const translationCompleteHead = [...assignedTranslationHead];
translationCompleteHead[4] = 'Translated Filenames';
translationCompleteHead[5] = 'Submitted';
translationCompleteHead[7] = 'Remarks';

const LinguistDashboardContents = ({ user_files: { loading, my_files }, translationGetMyFiles }) => {
  const currentPill = localStorage.__currentTraPill__DASH || 'translation_assigned_files';
  const onSelect = (pill) => {
    localStorage.setItem('__currentTraPill__DASH', pill);
  }
  return (
    <Tab.Container id="left-tabs-example" unmountOnExit={true} onSelect={onSelect} defaultActiveKey={currentPill}>
      <Row className="mt-5">
        <Col sm={2}>
          <Nav variant="pills" className="flex-column position-fixed">
            <Nav.Item>
              <Nav.Link eventKey="translation_assigned_files" {...slideInAnimation(0.2)} >Translation Assigned</Nav.Link>
            </Nav.Item>
            <Nav.Item>
              <Nav.Link eventKey="under_translation" {...slideInAnimation(0.4)}>Under Translation</Nav.Link>
            </Nav.Item>
            <Nav.Item>
              <Nav.Link eventKey="translated" {...slideInAnimation(0.6)}>Translated</Nav.Link>
            </Nav.Item>
          </Nav>
        </Col>
        <Col className="text-justify" sm={10}>
          <Tab.Content>
            <Tab.Pane eventKey="translation_assigned_files" {...slideInAnimation(0.3)}>
              <FileStatusComponent loadData={translationGetMyFiles}
                headProps={assignedTranslationHead}
                tableCaption="List of assigned files (Translation)"
                dataFiles={my_files.filter(file => file.status === 'assigned')}
                loading={loading}
                showTab="translation_assigned_files"
              />
            </Tab.Pane>
            <Tab.Pane eventKey="under_translation" {...slideInAnimation(0.3)}>
              <FileStatusComponent loadData={translationGetMyFiles}
                headProps={assignedTranslationHead}
                tableCaption="List of files Under-Translation"
                dataFiles={my_files.filter(file => file.status === 'under_translation')}
                loading={loading}
                showTab="under_translation"
              />
            </Tab.Pane>
            <Tab.Pane eventKey="translated" {...slideInAnimation(0.3)}>
              <FileStatusComponent loadData={translationGetMyFiles}
                headProps={translationCompleteHead}
                tableCaption="List of Translated Files"
                dataFiles={my_files.filter(file => file.status === 'translation_complete')}
                loading={loading}
                showTab="translated"
              />
            </Tab.Pane>
          </Tab.Content>
        </Col>
      </Row>
    </Tab.Container>
  )
}

LinguistDashboardContents.propTypes = {
  user_files: PropTypes.object.isRequired,
  translationGetMyFiles: PropTypes.func.isRequired
}

const mapStateToProps = state => ({
  user_files: state.user_files
})

export default connect(mapStateToProps, { translationGetMyFiles })(LinguistDashboardContents)
