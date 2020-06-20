import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { Table, Spinner } from 'react-bootstrap';
import { assignedTranslateFiles, completedTranslationReview } from '../admin/FileStatusComponent';

const FileStatusComponent = ({ headProps, tableCaption, loadData, dataFiles, loading, showTab }) => {
  useEffect(() => {
    loadData();
  }, [loadData]);

  return (
    <>
      {loading ? (
        <div className="d-flex justify-content-center">
          <Spinner animation="grow" role="status">
            <span className="sr-only">Loading...</span>
          </Spinner>
        </div>
      ) : (
        <Table className="text-center bg-light" responsive bordered>
          <caption className="font-weight-lighter font-italic">{tableCaption}</caption>
          <thead className="table-dark">
            <tr>
              {headProps.map((item, index) => (
                <th key={index} className="align-middle">
                  {item}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {showTab === 'translation_assigned_files' && assignedTranslateFiles(dataFiles)}
            {showTab === 'under_translation' && assignedTranslateFiles(dataFiles)}
            {showTab === 'translated' && completedTranslationReview(dataFiles, 'Translated')}
          </tbody>
        </Table>
      )}
    </>
  );
};

FileStatusComponent.propTypes = {
  headProps: PropTypes.array.isRequired,
  tableCaption: PropTypes.string.isRequired,
  loadData: PropTypes.func.isRequired,
  dataFiles: PropTypes.array.isRequired,
  loading: PropTypes.bool.isRequired,
  showTab: PropTypes.string.isRequired
};

export default FileStatusComponent;
