import { combineReducers } from 'redux';
import auth from './auth';
import toast from './toast'
import files from './files'
import users from './users'
import user_files from './user_files'

export default combineReducers({
  auth,
  toast,
  files,
  users,
  user_files
});