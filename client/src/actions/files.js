import Axios from 'axios'
import { LOAD_TRANSLATION_FILES, LOAD_REVIEW_FILES, FILE_ERROR, ADD_TOAST, LOAD_TRANSLATED_FILES } from './constants'

let id = 0;
export const getTranslationFiles = () => async dispatch => {
  try {
    const res = await Axios.get('/api/translation/all-files');
    dispatch({
      type: LOAD_TRANSLATION_FILES,
      payload: res.data
    });
  } catch (error) {
    dispatch({
      type: FILE_ERROR
    });
  }
}

export const getReviewFiles = () => async dispatch => {
  try {
    const res = await Axios.get('/api/review/all-files');
    dispatch({
      type: LOAD_REVIEW_FILES,
      payload: res.data
    })
  } catch (error) {
    dispatch({
      type: FILE_ERROR
    });
  }
}

export const getLastAssignedEndIndex = () => async dispatch => {
  try {
    const res = await Axios.get('/api/translation/assign-task');
    return res.data.end_index;
  } catch (error) {
    dispatch({
      type: ADD_TOAST,
      payload: {
        id: `end_index_failed_${id++}`,
        title: `Cannot get End Index`,
        message: `Unable to get End-Index--using default index 0 as starting index. If problem persists contact the developer.`,
        toastType: `danger`
      }
    });
  }
}

export const getTranslatedFiles = () => async dispatch => {
  try {
    const res = await Axios.get('/api/review/assign-task');
    dispatch({
      type: LOAD_TRANSLATED_FILES,
      payload: res.data.translatedFiles || [{}]
    });
  } catch (error) {
    dispatch({
      type: FILE_ERROR
    });
  }
}

export const getNumOfLines = async () => {
  try {
    const res = await Axios.get('/api/translation/source-file-lines');
    return res.data.num_of_lines;
  } catch (error) {
    console.log(error);
  }
}


export const assignTranslationTask = ({ source_filename, start_index, end_index, assigned_to, date, time }) => async dispatch => {
  const body = { source_filename, start_index, end_index, assigned_to, deadline: `${date} ${time}` };
  try {
    const res = await Axios.post('/api/translation/assign-task', body);
    dispatch({
      type: ADD_TOAST,
      payload: {
        id: `task_assign_successful_${id++}`,
        title: `Task has been Assigned`,
        message: `Assigned task with File ID: ${res.data.task_assigned._id}`,
        toastType: `success`
      }
    });
  } catch (error) {
    dispatch({
      type: ADD_TOAST,
      payload: {
        id: `translation_assign_task_fail_${id++}`,
        title: `Failed to assign task (Translation)`,
        message: `Task assign Fail, Something went wrong; Refresh page and try again`,
        toastType: `danger`
      }
    });
  }
}


export const assignReviewTask = ({ file_id, assigned_to, date, time }) => async dispatch => {
  const body = { file_id, assigned_to, deadline: `${date} ${time}` };
  try {
    const res = await Axios.post('/api/review/assign-task', body);
    dispatch({
      type: ADD_TOAST,
      payload: {
        id: `task_assign_successful_${id++}`,
        title: `Task has been Assigned`,
        message: `Assigned task with File ID: ${res.data.task_assigned._id}`,
        toastType: `success`
      }
    })
  } catch (error) {
    dispatch({
      type: ADD_TOAST,
      payload: {
        id: `review_assign_task_fail_${id++}`,
        title: `Failed to assign task (Review)`,
        message: `Task assign Fail, Something went wrong; Refresh page and try again`,
        toastType: `danger`
      }
    });
  }
}