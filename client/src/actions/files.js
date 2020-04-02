import Axios from 'axios'
import { LOAD_TRANSLATION_FILES, LOAD_REVIEW_FILES, FILE_ERROR } from './constants'

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