import {
  createStore,
  applyMiddleware,
  compose
} from 'redux';

import {
  batchStoreEnhancer,
  batchMiddleware
} from 'redux-batch-enhancer';

import thunk from 'redux-thunk';

import allReducers from './redux/reducers/index.js';

export default () => createStore(
  allReducers,
  compose(
    applyMiddleware(
      batchMiddleware,
      thunk
    ),
    batchStoreEnhancer
  )
)
