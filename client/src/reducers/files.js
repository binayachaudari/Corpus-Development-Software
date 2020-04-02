import { LOAD_TRANSLATION_FILES, LOAD_REVIEW_FILES, FILE_ERROR } from '../actions/constants'

const initialState = {
  translationFiles: [],
  reviewFiles: [],
  loading: true
}

export default (state = initialState, action) => {
  const { type, payload } = action;
  switch (type) {
    case LOAD_TRANSLATION_FILES:
      return {
        ...state,
        translationFiles: payload.allFiles,
        loading: false
      };

    case LOAD_REVIEW_FILES:
      return {
        ...state,
        reviewFiles: payload.allFiles,
        loading: false
      };

    case FILE_ERROR:
      return {
        ...state,
        loading: false
      };

    default:
      return state;
  }
}