import { LOGIN_SUCCESS, AUTH_ERROR, USER_LOADED } from '../actions/constants';

const initialState = {
  token: localStorage.getItem('corpus_development_software'),
  isAuthenticated: false,
  user: null,
  loading: true
};

export default (state = initialState, action) => {
  const { type, payload } = action;

  switch (type) {
    case LOGIN_SUCCESS:
      localStorage.setItem('corpus_development_software', payload.token)
      return {
        ...state,
        ...payload,
        isAuthenticated: true,
        loading: false
      };

    case USER_LOADED:
      return {
        ...state,
        isAuthenticated: true,
        loading: false,
        user: payload
      }

    case AUTH_ERROR:
      localStorage.removeItem('corpus_development_software');
      return {
        ...state,
        token: null,
        isAuthenticated: false,
        user: null,
        loading: false
      }
    default:
      return state;
  }
} 