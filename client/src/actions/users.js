import Axios from 'axios'
import { ALL_USERS_LOADED, ERROR_LOADING_ALL_USERS } from './constants'

export const getAllUsers = () => async dispatch => {
  try {
    const res = await Axios.get('api/users/all-users/');
    dispatch({
      type: ALL_USERS_LOADED,
      payload: res.data
    })
  } catch (error) {
    dispatch({
      type: ERROR_LOADING_ALL_USERS
    });
  }
}