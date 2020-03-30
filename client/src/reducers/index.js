import { combineReducers } from 'redux';
import auth from './auth';
import toast from './toast'

export default combineReducers({
  auth,
  toast
});