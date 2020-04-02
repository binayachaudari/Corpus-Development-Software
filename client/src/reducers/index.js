import { combineReducers } from 'redux';
import auth from './auth';
import toast from './toast'
import files from './files'
import users from './users'

export default combineReducers({
  auth,
  toast,
  files,
  users
});