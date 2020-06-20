import Axios from 'axios';
import { LOAD_USER_FILES, ERROR_LOADING_USER_FILES } from './constants';

export const reviewGetMyFiles = () => async (dispatch) => {
  try {
    const res = await Axios.get('/api/review/assignments');
    dispatch({
      type: LOAD_USER_FILES,
      payload: res.data.myFiles || [{}]
    });
  } catch (error) {
    dispatch({
      type: ERROR_LOADING_USER_FILES
    });
  }
};

export const translationGetMyFiles = () => async (dispatch) => {
  try {
    const res = await Axios.get('/api/translation/assignments');
    dispatch({
      type: LOAD_USER_FILES,
      payload: res.data.myFiles || [{}]
    });
  } catch (error) {
    dispatch({
      type: ERROR_LOADING_USER_FILES
    });
  }
};
