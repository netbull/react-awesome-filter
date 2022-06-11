import { createStore, applyMiddleware, combineReducers } from 'redux';
import ReduxThunk from 'redux-thunk';
import { composeWithDevTools } from 'redux-devtools-extension/logOnlyInProduction';

import reducer from './reducer';

const middleware = [ReduxThunk];

export default function store() {
  return createStore(
    combineReducers({
      af: reducer,
    }),
    composeWithDevTools(applyMiddleware(...middleware))
  );
}
