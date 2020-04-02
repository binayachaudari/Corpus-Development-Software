import { ALL_USERS_LOADED, ERROR_LOADING_ALL_USERS } from '../actions/constants'

const initialState = {
  loading: true,
  all_users: null
}

export default (state = initialState, action) => {
  const { type, payload } = action;

  switch (type) {
    case ALL_USERS_LOADED:
      return {
        ...state,
        loading: false,
        all_users: [...payload]
      };

    case ERROR_LOADING_ALL_USERS:
      return {
        ...state,
        loading: false
      }

    default:
      return state;
  }
}