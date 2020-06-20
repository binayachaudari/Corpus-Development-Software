import { ADD_TOAST, REMOVE_TOAST } from '../actions/constants';

const initialState = [];

export default (state = initialState, action) => {
  const { type, payload } = action;
  switch (type) {
    case ADD_TOAST:
      return [...state, payload];

    case REMOVE_TOAST:
      return state.filter((toast) => toast.id !== payload);

    default:
      return state;
  }
};
