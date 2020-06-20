import { createStore, applyMiddleware } from 'redux';
import { composeWithDevTools } from 'redux-devtools-extension';
import thunk from 'redux-thunk';
import rootReducer from './reducers';

//Persist State
import { loadState, saveState } from './utils/localStorage';
const persistState = loadState();

const middleware = [thunk];

const store = createStore(rootReducer, persistState || {}, composeWithDevTools(applyMiddleware(...middleware)));

store.subscribe(() => {
  saveState({
    auth: store.getState().auth
  });
});

export default store;
