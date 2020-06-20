import { ADD_TOAST, REMOVE_TOAST } from './constants'
let id = 0;

export const setToast = (title, message, toastType) => dispatch => {
  dispatch({
    type: ADD_TOAST,
    payload: {
      id: ++id,
      title,
      message,
      toastType
    }
  });

  setTimeout(() => {
    dispatch({
      type: REMOVE_TOAST,
      payload: id
    })
  }, 10000);
}
