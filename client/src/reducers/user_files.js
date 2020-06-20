import { LOAD_USER_FILES, ERROR_LOADING_USER_FILES } from '../actions/constants';

const initialState = {
  my_files: [],
  loading: true
};

export default (state = initialState, action) => {
  const { type, payload } = action;

  switch (type) {
    case LOAD_USER_FILES:
      return {
        ...state,
        loading: false,
        my_files: payload
      };

    case ERROR_LOADING_USER_FILES:
      return {
        ...state,
        loading: false
      };

    default:
      return state;
  }
};
