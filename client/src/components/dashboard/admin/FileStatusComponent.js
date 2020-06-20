import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { Table, Spinner, Tooltip, OverlayTrigger } from 'react-bootstrap';
import { diffForHumans, convertDate, timeSince } from '../../../utils/diffForHuman';
import { slideInAnimationWithIndex } from '../../../utils/slideInAnimation';

const renderTooltip = (props) => <Tooltip id="button-tooltip">{props}</Tooltip>;

export const assignedTranslateFiles = (dataFiles) =>
  dataFiles.map((item, index) => (
    <tr key={index} {...slideInAnimationWithIndex(index, 0.2)}>
      <td className="align-middle">{item._id}</td>
      <td className="align-middle">
        {item.file_details.end_index - item.file_details.start_index + 1} <br />|
        <small>
          {item.file_details.start_index}-{item.file_details.end_index}
        </small>
        |
      </td>
      <td className="align-middle">{item.assigned_to.name}</td>
      <td className="align-middle">{item.assigned_by.name}</td>
      <td className="align-middle">{item.file_details.filename}</td>
      <td className="align-middle">{convertDate(item.assigned_date)}</td>
      <td className="align-middle text-danger">{convertDate(item.deadline)}</td>
      <td className="align-middle">{diffForHumans(item.deadline)}</td>
    </tr>
  ));

export const assignedReviewFiles = (dataFiles) =>
  dataFiles.map((item, index) => (
    <tr key={index} {...slideInAnimationWithIndex(index, 0.2)}>
      <td className="align-middle py-0">{item._id}</td>
      <td className="align-middle py-0">
        {item.file_details.end_index - item.file_details.start_index + 1} <br />|
        <small>
          {item.file_details.start_index}-{item.file_details.end_index}
        </small>
        |
      </td>
      <td className="align-middle py-0">{item.assigned_to.name}</td>
      <td className="align-middle py-0">{item.assigned_by.name}</td>
      <td className="align-middle py-0">
        <OverlayTrigger
          placement="right"
          delay={{ show: 100, hide: 100 }}
          overlay={renderTooltip('Tamang filename assigned for review')}
        >
          <small className="text-primary">{item.tamang_filename}</small>
        </OverlayTrigger>
        <br />
        <OverlayTrigger
          placement="right"
          delay={{ show: 100, hide: 100 }}
          overlay={renderTooltip('Tamang filename assigned for review')}
        >
          <small>{item.nepali_filename}</small>
        </OverlayTrigger>
      </td>
      <td className="align-middle">{convertDate(item.assigned_date)}</td>
      <td className="align-middle text-danger">{convertDate(item.deadline)}</td>
      <td className="align-middle">{diffForHumans(item.deadline)}</td>
    </tr>
  ));

export const completedTranslationReview = (dataFiles, taskType) =>
  dataFiles.map((item, index) => (
    <tr key={index} {...slideInAnimationWithIndex(index, 0.2)}>
      <td className="align-middle py-0">{item._id}</td>
      <td className="align-middle py-0">
        {item.file_details.end_index - item.file_details.start_index + 1} <br />|
        <small>
          {item.file_details.start_index}-{item.file_details.end_index}
        </small>
        |
      </td>
      <td className="align-middle py-0">{item.assigned_to.name}</td>
      <td className="align-middle py-0">{item.assigned_by.name}</td>
      <td className="align-middle py-0">
        <OverlayTrigger
          placement="right"
          delay={{ show: 100, hide: 100 }}
          overlay={renderTooltip(`${taskType} Tamang File`)}
        >
          <small className="text-primary">{item.tamang_filename}</small>
        </OverlayTrigger>
        <br />
        <OverlayTrigger
          placement="right"
          delay={{ show: 100, hide: 100 }}
          overlay={renderTooltip(`${taskType} Nepali File`)}
        >
          <small>{item.nepali_filename}</small>
        </OverlayTrigger>
      </td>
      <td className="align-middle">{timeSince(item.submitted_on)}</td>
      <td className="align-middle text-danger">{convertDate(item.deadline)}</td>
      <td className={`align-middle text-${item.is_overdue ? 'danger' : ''}`}>{item.is_overdue ? 'OVERDUE' : ''}</td>
    </tr>
  ));

const FileStatusComponent = ({ headProps, tableCaption, loadData, dataFiles, loading, showTab }) => {
  useEffect(() => {
    loadData();
  }, []);

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
          <caption className="font-weight-lighter font-italic" {...slideInAnimationWithIndex(0, 0)}>
            {tableCaption}
          </caption>
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
            {showTab === 'review_assigned_files' && assignedReviewFiles(dataFiles)}
            {showTab === 'under_translation' && assignedTranslateFiles(dataFiles)}
            {showTab === 'under_review' && assignedReviewFiles(dataFiles)}
            {showTab === 'translated' && completedTranslationReview(dataFiles, 'Translated')}
            {showTab === 'reviewed' && completedTranslationReview(dataFiles, 'Reviewed')}
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
  loading: PropTypes.bool.isRequired
};

export default FileStatusComponent;
