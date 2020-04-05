import React, { useEffect } from 'react'
import PropTypes from 'prop-types'
import { Table, Spinner } from 'react-bootstrap'
import { assignedReviewFiles, completedTranslationReview } from '../admin/FileStatusComponent'

const FileStatusComponent = ({ headProps, tableCaption, loadData, dataFiles, loading, showTab }) => {
  useEffect(() => {
    loadData();
  }, []);

  return (
    <>
      {loading ?
        <div className="d-flex justify-content-center">
          <Spinner animation="grow" role="status">
            <span className="sr-only">Loading...</span>
          </Spinner>
        </div> :
        <Table className="text-center bg-light" responsive bordered>
          <caption className="font-weight-lighter font-italic">{tableCaption}</caption>
          <thead className="table-dark" >
            <tr>
              {headProps.map((item, index) => (
                <th key={index} className="align-middle">{item}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {showTab === 'review_assigned_files' && assignedReviewFiles(dataFiles)}
            {showTab === 'under_review' && assignedReviewFiles(dataFiles)}
            {showTab === 'reviewed' && completedTranslationReview(dataFiles, '')}
          </tbody>
        </Table>
      }
    </>
  )
}

FileStatusComponent.propTypes = {

}

export default FileStatusComponent
