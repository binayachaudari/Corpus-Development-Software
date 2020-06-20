import Axios from 'axios';
import { LOGIN_SUCCESS, AUTH_ERROR, USER_LOADED, PASSWORD_CHANGED, LOG_OUT } from './constants';
import setAuthToken from '../utils/setAuthToken';

/**
 * Login Action
 * @param {String} email email address
 * @param {String} password password
 */
export const login = ({ email, password }) => async (dispatch) => {
  const config = {
    headers: {
      'Content-Type': 'application/json'
    }
  };

  const body = JSON.stringify({ email, password });

  try {
    const res = await Axios.post('/api/auth/login', body, config);
    dispatch({
      type: LOGIN_SUCCESS,
      payload: res.data
    });
    dispatch(loadUser());
    return null;
  } catch (error) {
    dispatch({
      type: AUTH_ERROR
    });
    return error.response.data;
  }
};

export const loadUser = () => async (dispatch) => {
  if (localStorage.corpus_development_software) setAuthToken(localStorage.corpus_development_software);
  try {
    const res = await Axios.get('/api/auth');
    dispatch({
      type: USER_LOADED,
      payload: res.data
    });
  } catch (error) {
    dispatch({
      type: AUTH_ERROR
    });
  }
};

export const resetDefaultPassword = ({ new_password }) => async (dispatch) => {
  const config = {
    headers: {
      'Content-Type': 'application/json'
    }
  };

  const body = JSON.stringify({ new_password });
  try {
    const res = await Axios.patch('/api/auth/reset-default-password', body, config);
    dispatch({
      type: PASSWORD_CHANGED,
      payload: res.data
    });
    return res.data;
  } catch (error) {
    dispatch({
      type: AUTH_ERROR
    });
  }
};

export const changePassword = ({ current_password, new_password }) => async (dispatch) => {
  const body = { current_password, new_password };
  try {
    const res = await Axios.post('/api/auth/change-password', body);
    return res.data;
  } catch (error) {
    const { status, message } = error.response.data;
    return {
      status,
      message
    };
  }
};

export const logout = () => async (dispatch) => {
  dispatch({
    type: LOG_OUT
  });
};
