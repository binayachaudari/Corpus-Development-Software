import { LOGIN_SUCCESS, AUTH_ERROR, USER_LOADED, LOG_OUT } from '../actions/constants';

const errorToken = `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c`

const initialState = {
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
    case LOG_OUT:
      localStorage.setItem('corpus_development_software', errorToken);
      return {
        ...state,
        isAuthenticated: false,
        user: null,
        loading: false
      }
    default:
      return state;
  }
} 