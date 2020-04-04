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
        message: error.response.message,
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
      payload: res.data.translatedFiles
    });
  } catch (error) {
    dispatch({
      type: FILE_ERROR
    });
  }
}